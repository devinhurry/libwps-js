import { inflateRawSync, inflateSync } from "node:zlib";

export function readDocxMainText(buffer) {
  const documentXml = readZipEntry(buffer, "word/document.xml").toString("utf8");
  return extractWordXmlText(documentXml);
}

export function readDocxDocumentXml(buffer) {
  return readZipEntry(buffer, "word/document.xml").toString("utf8");
}

export function readZipEntry(buffer, entryName) {
  const eocdOffset = findEndOfCentralDirectory(buffer);
  const centralDirectorySize = buffer.readUInt32LE(eocdOffset + 12);
  const centralDirectoryOffset = buffer.readUInt32LE(eocdOffset + 16);
  let offset = centralDirectoryOffset;
  const end = centralDirectoryOffset + centralDirectorySize;

  while (offset < end) {
    if (buffer.readUInt32LE(offset) !== 0x02014b50) {
      throw new Error("Invalid DOCX fixture: bad central directory header");
    }
    const compressionMethod = buffer.readUInt16LE(offset + 10);
    const compressedSize = buffer.readUInt32LE(offset + 20);
    const fileNameLength = buffer.readUInt16LE(offset + 28);
    const extraLength = buffer.readUInt16LE(offset + 30);
    const commentLength = buffer.readUInt16LE(offset + 32);
    const localHeaderOffset = buffer.readUInt32LE(offset + 42);
    const fileName = buffer.subarray(offset + 46, offset + 46 + fileNameLength).toString("utf8");

    if (fileName === entryName) {
      return readLocalEntry(buffer, localHeaderOffset, compressionMethod, compressedSize);
    }

    offset += 46 + fileNameLength + extraLength + commentLength;
  }

  throw new Error(`DOCX fixture entry not found: ${entryName}`);
}

function readLocalEntry(buffer, localHeaderOffset, compressionMethod, compressedSize) {
  if (buffer.readUInt32LE(localHeaderOffset) !== 0x04034b50) {
    throw new Error("Invalid DOCX fixture: bad local file header");
  }
  const fileNameLength = buffer.readUInt16LE(localHeaderOffset + 26);
  const extraLength = buffer.readUInt16LE(localHeaderOffset + 28);
  const dataStart = localHeaderOffset + 30 + fileNameLength + extraLength;
  const data = buffer.subarray(dataStart, dataStart + compressedSize);

  if (compressionMethod === 0) {
    return data;
  }
  if (compressionMethod === 8) {
    try {
      return inflateRawSync(data);
    } catch {
      return inflateSync(data);
    }
  }
  throw new Error(`Unsupported DOCX fixture compression method: ${compressionMethod}`);
}

function findEndOfCentralDirectory(buffer) {
  const minOffset = Math.max(0, buffer.length - 0xffff - 22);
  for (let offset = buffer.length - 22; offset >= minOffset; offset -= 1) {
    if (buffer.readUInt32LE(offset) === 0x06054b50) {
      return offset;
    }
  }
  throw new Error("Invalid DOCX fixture: end of central directory not found");
}

function extractWordXmlText(xml) {
  const parts = [];
  const tokenPattern = /<w:t(?:\s[^>]*)?>([\s\S]*?)<\/w:t>|<w:tab\s*\/>|<w:br\s*\/>|<w:p\b/g;
  for (const match of xml.matchAll(tokenPattern)) {
    const token = match[0];
    if (token.startsWith("<w:t")) {
      parts.push(unescapeXml(match[1] ?? ""));
    } else if (token.startsWith("<w:tab")) {
      parts.push("\t");
    } else {
      parts.push("\n");
    }
  }
  return parts.join("").replace(/^\n/, "");
}

function unescapeXml(value) {
  return value
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, "\"")
    .replace(/&apos;/g, "'");
}
