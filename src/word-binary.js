import { parseSprms } from "./sprm.js";

const WORD_BINARY_MAGIC = 0xa5ec;
const FIB_FLAGS_OFFSET = 0x0a;
const FIB_F_COMPLEX = 0x0004;
const FIB_F_WHICH_TABLE_STREAM = 0x0200;

const FIB_CCP_TEXT_OFFSET = 0x4c;
const FIB_CCP_FTN_OFFSET = 0x50;
const FIB_CCP_HDD_OFFSET = 0x54;
const FIB_CCP_ATN_OFFSET = 0x5c;
const FIB_CCP_EDN_OFFSET = 0x60;
const FIB_CCP_TXBX_OFFSET = 0x64;
const FIB_CCP_HDR_TXBX_OFFSET = 0x68;

const FIB_FC_LCB_START = 0x9a;
const FIB_FC_LCB_COUNT_OFFSET = 0x98;
const FIB_FC_CLX_INDEX = 33;
const FIB_FC_PLCFSED_INDEX = 6;
const FIB_FC_PAPX_INDEX = 13;
const FIB_FC_STSH_INDEX = 1;
const FIB_FC_FONT_TABLE_INDEX = 15;

const PHE_SIZE = 12;
const SPRM_WPS_DYA_LINE = 0x6412;
const SPRM_WPS_DYA_LINE_OPERAND_SIZE = 2;
const FIB_FC_CHPX_INDEX = 12;

const STSH_NIL_BASE = 0xfff0;
const STSH_STD_HEADER_SIZE = 18;
const STSH_STD_NAME_OFFSET = 18;
const SPRM_OPERAND_SIZE_BY_SPRA = [1, 1, 2, 4, 2, 2, -1, 3];

export function extractWordBinaryDocument({ wordDocument, table0, table1 = null }) {
  assertWordDocument(wordDocument);

  const fib = readFib(wordDocument);
  if ((fib.flags & FIB_F_COMPLEX) === 0) {
    throw new Error("Unsupported Word binary document: expected a complex file with a CLX piece table");
  }

  const tableStream = fib.whichTableStream === "1Table" ? table1 : table0;
  if (!tableStream) {
    throw new Error(`Missing required Word table stream: ${fib.whichTableStream}`);
  }

  const pieces = readPieceTable(tableStream, fib.fcClx, fib.lcbClx);
  const subdocuments = splitSubdocuments(wordDocument, pieces, fib.characterCounts);
  const rawText = readPieces(wordDocument, pieces);
  const bodyText = subdocuments.body.rawText;
  const styles = extractStyleSheet(tableStream, fib);
  const fontTable = extractFontTable(tableStream, fib);
  const sections = extractSections(wordDocument, tableStream, fib);
  const paragraphProperties = extractParagraphProperties(wordDocument, tableStream, fib, bodyText, styles, pieces);
  const characterRuns = extractCharacterRuns(wordDocument, tableStream, fib, bodyText, pieces);
  const characterProperties = expandCharacterRuns(characterRuns, bodyText.length);

  return {
    fib,
    pieces,
    text: normalizeWordText(bodyText),
    rawText,
    bodyText,
    paragraphs: paragraphsFromWordText(bodyText),
    paragraphProperties,
    characterProperties,
    characterRuns,
    styles,
    fontTable,
    sections,
    subdocuments,
  };
}

export function normalizeWordText(text) {
  return text
    .replace(/\r/g, "\n")
    .replace(/\x0c/g, "\n")
    .replace(/\x07/g, "")
    .replace(/[\x00-\x06\x08\x0b\x0e-\x1f]/g, "")
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

export function normalizeComparableText(text) {
  return normalizeWordText(text).replace(/\s+/g, "");
}

function readFib(wordDocument) {
  const flags = wordDocument.readUInt16LE(FIB_FLAGS_OFFSET);
  const fcLcbCount = wordDocument.readUInt16LE(FIB_FC_LCB_COUNT_OFFSET);
  const tableStreamOffset = FIB_FC_LCB_START + FIB_FC_CLX_INDEX * 8;
  const plcfSedOffset = FIB_FC_LCB_START + FIB_FC_PLCFSED_INDEX * 8;
  const papxOffset = FIB_FC_LCB_START + FIB_FC_PAPX_INDEX * 8;
  const chpxOffset = FIB_FC_LCB_START + FIB_FC_CHPX_INDEX * 8;
  const fontTableOffset = FIB_FC_LCB_START + FIB_FC_FONT_TABLE_INDEX * 8;
  const stshOffset = FIB_FC_LCB_START + FIB_FC_STSH_INDEX * 8;
  if (tableStreamOffset + 8 > FIB_FC_LCB_START + fcLcbCount * 4) {
    throw new Error("Unsupported Word binary document: FIB does not contain fcClx/lcbClx");
  }

  return {
    nFib: wordDocument.readUInt16LE(0x02),
    flags,
    whichTableStream: (flags & FIB_F_WHICH_TABLE_STREAM) === 0 ? "0Table" : "1Table",
    fcMin: wordDocument.readUInt32LE(0x18),
    fcMac: wordDocument.readUInt32LE(0x1c),
    fcClx: wordDocument.readUInt32LE(tableStreamOffset),
    lcbClx: wordDocument.readUInt32LE(tableStreamOffset + 4),
    fcPlcfSed: wordDocument.readUInt32LE(plcfSedOffset),
    lcbPlcfSed: wordDocument.readUInt32LE(plcfSedOffset + 4),
    fcPapx: wordDocument.readUInt32LE(papxOffset),
    lcbPapx: wordDocument.readUInt32LE(papxOffset + 4),
    fcChpx: wordDocument.readUInt32LE(chpxOffset),
    lcbChpx: wordDocument.readUInt32LE(chpxOffset + 4),
    fcFontTable: wordDocument.readUInt32LE(fontTableOffset),
    lcbFontTable: wordDocument.readUInt32LE(fontTableOffset + 4),
    fcStsh: wordDocument.readUInt32LE(stshOffset),
    lcbStsh: wordDocument.readUInt32LE(stshOffset + 4),
    characterCounts: {
      body: wordDocument.readUInt32LE(FIB_CCP_TEXT_OFFSET),
      footnotes: wordDocument.readUInt32LE(FIB_CCP_FTN_OFFSET),
      headers: wordDocument.readUInt32LE(FIB_CCP_HDD_OFFSET),
      annotations: wordDocument.readUInt32LE(FIB_CCP_ATN_OFFSET),
      endnotes: wordDocument.readUInt32LE(FIB_CCP_EDN_OFFSET),
      textboxes: wordDocument.readUInt32LE(FIB_CCP_TXBX_OFFSET),
      headerTextboxes: wordDocument.readUInt32LE(FIB_CCP_HDR_TXBX_OFFSET),
    },
  };
}

function readPieceTable(tableStream, fcClx, lcbClx) {
  if (fcClx + lcbClx > tableStream.length) {
    throw new Error("Invalid Word binary document: CLX is outside the table stream");
  }

  const clx = tableStream.subarray(fcClx, fcClx + lcbClx);
  let offset = 0;
  while (offset < clx.length && clx[offset] === 0x01) {
    if (offset + 3 > clx.length) {
      throw new Error("Invalid Word binary document: truncated CLX Prc block");
    }
    offset += 3 + clx.readUInt16LE(offset + 1);
  }

  if (offset >= clx.length || clx[offset] !== 0x02) {
    throw new Error("Invalid Word binary document: CLX does not contain a Pcdt piece table");
  }
  if (offset + 5 > clx.length) {
    throw new Error("Invalid Word binary document: truncated Pcdt header");
  }

  const plcPcdLength = clx.readUInt32LE(offset + 1);
  const plcPcdStart = offset + 5;
  const plcPcdEnd = plcPcdStart + plcPcdLength;
  if (plcPcdEnd > clx.length) {
    throw new Error("Invalid Word binary document: truncated PlcPcd");
  }
  if ((plcPcdLength - 4) % 12 !== 0) {
    throw new Error("Invalid Word binary document: PlcPcd length is not valid");
  }

  const plcPcd = clx.subarray(plcPcdStart, plcPcdEnd);
  const pieceCount = (plcPcdLength - 4) / 12;
  const characterPositions = [];
  for (let i = 0; i <= pieceCount; i += 1) {
    characterPositions.push(plcPcd.readUInt32LE(i * 4));
  }

  const pcdStart = (pieceCount + 1) * 4;
  const pieces = [];
  for (let i = 0; i < pieceCount; i += 1) {
    const pcdOffset = pcdStart + i * 8;
    const fcCompressed = plcPcd.readUInt32LE(pcdOffset + 2);
    const compressed = (fcCompressed & 0x40000000) !== 0;
    const fileOffset = compressed ? ((fcCompressed & ~0x40000000) >>> 1) : fcCompressed;
    pieces.push({
      cpStart: characterPositions[i],
      cpEnd: characterPositions[i + 1],
      fileOffset,
      compressed,
    });
  }

  return pieces;
}

function splitSubdocuments(wordDocument, pieces, counts) {
  const ranges = {};
  let cp = 0;
  for (const [name, length] of Object.entries(counts)) {
    ranges[name] = {
      cpStart: cp,
      cpEnd: cp + length,
      rawText: readPieces(wordDocument, pieces, cp, cp + length),
    };
    cp += length;
  }
  return ranges;
}

function readPieces(wordDocument, pieces, cpStart = 0, cpEnd = Infinity) {
  let text = "";
  for (const piece of pieces) {
    const start = Math.max(piece.cpStart, cpStart);
    const end = Math.min(piece.cpEnd, cpEnd);
    if (end <= start) {
      continue;
    }

    const characterOffset = start - piece.cpStart;
    const characterLength = end - start;
    if (piece.compressed) {
      const startByte = piece.fileOffset + characterOffset;
      const endByte = startByte + characterLength;
      assertRange(wordDocument, startByte, endByte, "compressed text piece");
      text += decodeSingleByteText(wordDocument.subarray(startByte, endByte));
    } else {
      const startByte = piece.fileOffset + characterOffset * 2;
      const endByte = startByte + characterLength * 2;
      assertRange(wordDocument, startByte, endByte, "Unicode text piece");
      text += wordDocument.subarray(startByte, endByte).toString("utf16le");
    }
  }
  return text;
}

function paragraphsFromWordText(text) {
  return normalizeWordText(text)
    .split(/\n+/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);
}

function assertWordDocument(wordDocument) {
  if (!Buffer.isBuffer(wordDocument)) {
    throw new TypeError("Expected WordDocument to be a Buffer");
  }
  if (wordDocument.length < 0x1aa || wordDocument.readUInt16LE(0) !== WORD_BINARY_MAGIC) {
    throw new Error("Unsupported file: WordDocument stream does not contain a Word binary FIB");
  }
}

function assertRange(buffer, start, end, label) {
  if (start < 0 || end > buffer.length) {
    throw new Error(`Invalid Word binary document: ${label} points outside WordDocument`);
  }
}

function decodeSingleByteText(buffer) {
  return new TextDecoder("windows-1252", { fatal: false }).decode(buffer);
}

function extractParagraphProperties(wordDocument, tableStream, fib, bodyText, styles, pieces) {
  if (!fib.fcPapx || !fib.lcbPapx || fib.lcbPapx < 4) {
    return [];
  }
  if (fib.fcPapx + fib.lcbPapx > tableStream.length) {
    return [];
  }

  const plcf = tableStream.subarray(fib.fcPapx, fib.fcPapx + fib.lcbPapx);
  const binCount = (fib.lcbPapx - 4) / 8;
  if (binCount <= 0 || !Number.isInteger(binCount)) {
    return [];
  }

  const binFCs = [];
  for (let i = 0; i <= binCount; i += 1) {
    binFCs.push(plcf.readUInt32LE(i * 4));
  }

  const pageNumbers = [];
  for (let bi = 0; bi < binCount; bi += 1) {
    pageNumbers.push(plcf.readUInt32LE((binCount + 1) * 4 + bi * 4));
  }

  const bodyParagraphRanges = getParagraphRanges(bodyText);
  const allEntries = [];

  for (let bi = 0; bi < binCount; bi += 1) {
    const pageNumber = pageNumbers[bi];
    if (pageNumber === 0) continue;
    const pageOffset = pageNumber * 512;
    if (pageOffset + PHE_SIZE > wordDocument.length) continue;

    const page = wordDocument.subarray(pageOffset, Math.min(pageOffset + 512, wordDocument.length));
    const entries = parsePapxEntries(page, styles, pieces, fib.characterCounts.body);
    allEntries.push(...entries);
  }

  return bodyParagraphRanges.map((paragraphRange) => {
    const direct = allEntries.find((entry) => rangesOverlap(entry, paragraphRange)) ?? null;
    return direct?.properties ?? null;
  });
}

function countPageFCs(page, binStart, binEnd) {
  let count = 0;
  for (let i = 0; i * 4 + 4 <= page.length; i += 1) {
    const fc = page.readUInt32LE(i * 4);
    if (fc < binStart || fc > binEnd) break;
    count += 1;
  }
  return count;
}

function parsePapxEntries(page, styles, pieces, bodyCharacterCount) {
  const entries = [];
  const crun = page[511];
  if (crun <= 0) return entries;

  const fcBoundaries = readFkpFcBoundaries(page, crun);
  const bxStart = (crun + 1) * 4;

  for (let i = 0; i < crun; i += 1) {
    const bxOffset = bxStart + i * (1 + PHE_SIZE);
    if (bxOffset >= 511) break;
    const papxOffset = page[bxOffset] * 2;
    if (papxOffset <= 0 || papxOffset >= 511) continue;
    const cb = page[papxOffset];
    const byteLength = cb * 2;
    if (cb === 0 || byteLength > 400 || papxOffset + 1 + byteLength > page.length) continue;

    const cpStart = fileOffsetToCharacterPosition(fcBoundaries[i], pieces);
    const cpEnd = fileOffsetToCharacterPosition(fcBoundaries[i + 1], pieces);
    if (cpStart == null || cpEnd == null || cpStart >= bodyCharacterCount || cpEnd <= 0) continue;

    const data = page.subarray(papxOffset + 1, papxOffset + 1 + byteLength);
    const properties = parseParagraphGrpprl(data);
    const istd = properties.istd ?? 0;
    properties.styleId = resolveStyleId(istd, styles);
    entries.push({
      cpStart: Math.max(0, cpStart),
      cpEnd: Math.min(bodyCharacterCount, cpEnd),
      properties,
    });
  }

  return entries;
}

function readFkpFcBoundaries(page, crun) {
  const boundaries = [];
  for (let i = 0; i <= crun; i += 1) {
    boundaries.push(page.readUInt32LE(i * 4));
  }
  return boundaries;
}

function resolveStyleId(istd, styles) {
  if (!styles) return null;
  if (istd === 0) return null;
  if (istd >= 0 && istd < styles.length && styles[istd]) {
    return styles[istd].styleId;
  }
  for (const style of styles) {
    if (style && style.type === STYLE_TYPE_PARAGRAPH && style.basedOn === null) {
      return style.styleId;
    }
  }
  return null;
}

function parseParagraphGrpprl(data) {
  const parsed = parseSprms(data, true);
  return {
    istd: parsed.istd ?? null,
    styleId: null,
    lineSpacing: parsed.lineSpacing ?? null,
    alignment: parsed.alignment ?? null,
    leftIndent: parsed.leftIndent ?? null,
    rightIndent: parsed.rightIndent ?? null,
    firstLineIndent: parsed.firstLineIndent ?? null,
    spacingBefore: parsed.spacingBefore ?? null,
    spacingAfter: parsed.spacingAfter ?? null,
    tabs: parsed.tabs ?? null,
  };
}

const STYLE_TYPE_PARAGRAPH = "paragraph";
const STYLE_TYPE_CHARACTER = "character";
const STYLE_TYPE_TABLE = "table";
const STYLE_TYPE_LIST = "list";

function inferStyleType(styLo, name) {
  if (name === "默认段落字体") return STYLE_TYPE_CHARACTER;
  if (name === "普通表格" || name === "Table Normal") return STYLE_TYPE_TABLE;
  if (name === "List Paragraph") return STYLE_TYPE_PARAGRAPH;
  return STYLE_TYPE_PARAGRAPH;
}

function buildStyleId(name, index) {
  const mapped = mapBuiltInStyle(name);
  if (mapped) return mapped.styleId;
  if (!name) return `style${index}`;
  return name.replace(/\s+/g, "");
}

function buildStyleName(name) {
  return mapBuiltInStyle(name)?.name ?? name;
}

function mapBuiltInStyle(name) {
  const styles = {
    "正文": { styleId: "1", name: "Normal" },
    "标题 1": { styleId: "2", name: "heading 1" },
    "正文文本": { styleId: "3", name: "Body Text" },
    "页脚": { styleId: "4", name: "footer" },
    "页眉": { styleId: "5", name: "header" },
    "普通表格": { styleId: "6", name: "Normal Table" },
    "默认段落字体": { styleId: "7", name: "Default Paragraph Font" },
    "Table Normal": { styleId: "8", name: "Table Normal" },
    "List Paragraph": { styleId: "9", name: "List Paragraph" },
    "Table Paragraph": { styleId: "10", name: "Table Paragraph" },
  };
  return styles[name] ?? null;
}

function extractStyleSheet(tableStream, fib) {
  if (!fib.lcbStsh || fib.lcbStsh < 6) {
    return [];
  }
  if (fib.fcStsh + fib.lcbStsh > tableStream.length) {
    return [];
  }

  const stsh = tableStream.subarray(fib.fcStsh, fib.fcStsh + fib.lcbStsh);
  const cbStshi = stsh.readUInt16LE(0);
  if (cbStshi < 4 || 2 + cbStshi > stsh.length) {
    return [];
  }

  const cstd = stsh.readUInt16LE(2);
  const styles = new Array(cstd).fill(null);

  let off = 2 + cbStshi;
  for (let i = 0; i < cstd && off + 2 <= stsh.length; i += 1) {
    const cbStd = stsh.readUInt16LE(off);
    off += 2;
    if (cbStd === 0) continue;
    const stdEnd = off + cbStd;
    if (stdEnd > stsh.length) break;

    const std = stsh.subarray(off, stdEnd);
    const style = parseStd(std, i);
    if (style) styles[i] = style;

    off = stdEnd;
  }

  return styles;
}

function parseStd(std, index) {
  if (std.length < STSH_STD_HEADER_SIZE + 2) return null;

  const styLo = std[0] & 0x0f;
  const istdBase = std.readUInt16LE(2);

  const cbName = std.readUInt16LE(STSH_STD_NAME_OFFSET);
  if (cbName < 1 || cbName > 50) return null;

  const nameStart = STSH_STD_NAME_OFFSET + 2;
  const nameEnd = nameStart + cbName * 2;
  if (nameEnd + 2 > std.length) return null;

  const name = std.subarray(nameStart, nameEnd).toString("utf16le");
  const grpprlStart = nameEnd + 2;
  const grpprl = std.subarray(grpprlStart);

  const lineSpacing = extractLineSpacingFromGrpprl(grpprl);
  const runProperties = extractCharacterPropertiesFromGrpprl(grpprl);
  const type = inferStyleType(styLo, name);
  const styleId = buildStyleId(name, index);
  const styleName = buildStyleName(name);
  const basedOn = resolveBasedOn(istdBase, index, type);

  return {
    index,
    name,
    styleName,
    type,
    styleId,
    basedOn,
    lineSpacing,
    runProperties,
  };
}

function resolveBasedOn(istdBase, index, type) {
  if (istdBase >= STSH_NIL_BASE) return null;
  const resolvedIndex = istdBase > 0 ? istdBase - 1 : istdBase;
  if (resolvedIndex === index) return null;
  return resolvedIndex;
}

function extractLineSpacingFromGrpprl(grpprl) {
  for (let i = 0; i + 3 < grpprl.length; i += 1) {
    if (grpprl[i] === (SPRM_WPS_DYA_LINE & 0xff) && grpprl[i + 1] === ((SPRM_WPS_DYA_LINE >> 8) & 0xff)) {
      const raw = grpprl[i + 2] | (grpprl[i + 3] << 8);
      const signed = raw > 0x7fff ? raw - 0x10000 : raw;
      return {
        twips: Math.abs(signed),
        rule: signed < 0 ? "exact" : "atLeast",
      };
    }
  }
  return null;
}

function extractCharacterPropertiesFromGrpprl(grpprl) {
  const props = {};
  scanKnownSprm(grpprl, 0x4a43, 2, (value) => { props.fontSize = value.readUInt16LE(0); });
  scanKnownSprm(grpprl, 0x4a4f, 2, (value) => { props.fontAscii = value.readUInt16LE(0); });
  scanKnownSprm(grpprl, 0x4a50, 2, (value) => { props.fontEastAsia = value.readUInt16LE(0); });
  scanKnownSprm(grpprl, 0x4a51, 2, (value) => { props.fontHAnsi = value.readUInt16LE(0); });
  scanKnownSprm(grpprl, 0x4a5e, 2, (value) => { props.fontCs = value.readUInt16LE(0); });
  scanKnownSprm(grpprl, 0x4852, 2, (value) => { props.charWidth = value.readUInt16LE(0); });
  scanKnownSprm(grpprl, 0x8840, 2, (value) => { props.charSpacing = value.readInt16LE(0); });
  return Object.keys(props).length ? props : null;
}

function scanKnownSprm(grpprl, sprm, operandSize, apply) {
  const lo = sprm & 0xff;
  const hi = (sprm >> 8) & 0xff;
  for (let i = 0; i + 2 + operandSize <= grpprl.length; i += 1) {
    if (grpprl[i] === lo && grpprl[i + 1] === hi) {
      apply(grpprl.subarray(i + 2, i + 2 + operandSize));
    }
  }
}

function extractFontTable(tableStream, fib) {
  if (!fib.lcbFontTable || fib.fcFontTable + fib.lcbFontTable > tableStream.length) return [];

  const data = tableStream.subarray(fib.fcFontTable, fib.fcFontTable + fib.lcbFontTable);
  const fonts = [];
  if (data.length < 4) return fonts;

  const count = data.readUInt16LE(0);
  const extraDataSize = data.readUInt16LE(2);
  let pos = 4;
  for (let i = 0; i < count && pos < data.length; i += 1) {
    const cbFfn = data[pos];
    if (cbFfn === 0 || pos + cbFfn > data.length) break;
    const ffn = data.subarray(pos, pos + cbFfn);
    const weight = ffn.length > 4 ? ffn.readUInt16LE(3) : 0;
    const charset = ffn.length > 6 ? ffn[6] : 0;
    const prq = ffn.length > 7 ? ffn[7] : 0;
    const name = readFfnString(ffn, 40);
    const alternateName = name ? readFfnString(ffn, 40 + (name.length + 1) * 2) : "";
    fonts.push({ index: fonts.length, name, alternateName, weight, charset, prq, extraDataSize });
    pos += cbFfn;
    if (pos % 2 === 1) pos += 1;
  }
  return fonts;
}

function readFfnString(ffn, offset) {
  let name = "";
  for (let pos = offset; pos + 1 < ffn.length; pos += 2) {
    const ch = ffn.readUInt16LE(pos);
    if (ch === 0) break;
    name += String.fromCharCode(ch);
  }
  return name;
}

function extractSections(wordDocument, tableStream, fib) {
  if (!fib.lcbPlcfSed || fib.lcbPlcfSed < 16) return [];
  if (fib.fcPlcfSed + fib.lcbPlcfSed > tableStream.length) return [];

  const plcf = tableStream.subarray(fib.fcPlcfSed, fib.fcPlcfSed + fib.lcbPlcfSed);
  const sedSize = 12;
  const sectionCount = (fib.lcbPlcfSed - 4) / (4 + sedSize);
  if (!Number.isInteger(sectionCount) || sectionCount <= 0) return [];

  const sections = [];
  const sedStart = (sectionCount + 1) * 4;
  for (let i = 0; i < sectionCount; i += 1) {
    const cpStart = plcf.readUInt32LE(i * 4);
    const cpEnd = plcf.readUInt32LE((i + 1) * 4);
    const sedOffset = sedStart + i * sedSize;
    const fcSepx = plcf.readUInt32LE(sedOffset + 2);
    const properties = fcSepx === 0xffffffff
      ? {}
      : readSectionProperties(wordDocument, fcSepx);

    sections.push({
      cpStart,
      cpEnd,
      properties,
    });
  }
  return sections;
}

function readSectionProperties(wordDocument, fcSepx) {
  if (fcSepx + 2 > wordDocument.length) {
    throw new Error("Invalid Word binary document: SEPX points outside WordDocument");
  }

  const cb = wordDocument.readUInt16LE(fcSepx);
  if (fcSepx + 2 + cb > wordDocument.length) {
    throw new Error("Invalid Word binary document: truncated SEPX");
  }

  return parseSectionSprms(wordDocument.subarray(fcSepx + 2, fcSepx + 2 + cb));
}

function parseSectionSprms(grpprl) {
  const props = {};
  let off = 0;
  while (off + 2 <= grpprl.length) {
    const sprm = grpprl.readUInt16LE(off);
    off += 2;
    const size = sectionSprmOperandSize(sprm);
    if (off + size > grpprl.length) break;
    const val = grpprl.subarray(off, off + size);
    applySectionSprm(props, sprm, val);
    off += size;
  }
  return props;
}

function sectionSprmOperandSize(sprm) {
  if (sprm === 0xd1ff) return 3;
  const spra = (sprm >> 13) & 0x7;
  const size = SPRM_OPERAND_SIZE_BY_SPRA[spra];
  if (!size || size < 0) {
    throw new Error(`Unsupported section SPRM operand size for 0x${sprm.toString(16)}`);
  }
  return size;
}

function applySectionSprm(props, sprm, val) {
  switch (sprm) {
    case 0x3011:
      props.breakType = val[0] === 1 ? "continuous" : null;
      break;
    case 0x501c:
      props.pageNumberStart = val.readUInt16LE(0);
      break;
    case 0xb01f:
      props.pageWidth = val.readUInt16LE(0);
      break;
    case 0xb020:
      props.pageHeight = val.readUInt16LE(0);
      break;
    case 0xb021:
      props.marginLeft = val.readUInt16LE(0);
      break;
    case 0xb022:
      props.marginRight = val.readUInt16LE(0);
      break;
    case 0x9023:
      props.marginTop = val.readUInt16LE(0);
      break;
    case 0x9024:
      props.marginBottom = val.readUInt16LE(0);
      break;
    case 0xb017:
      props.headerMargin = val.readUInt16LE(0);
      break;
    case 0xb018:
      props.footerMargin = val.readUInt16LE(0);
      break;
    default:
      break;
  }
}

function extractCharacterRuns(wordDocument, tableStream, fib, bodyText, pieces) {
  if (!fib.lcbChpx || fib.lcbChpx < 4) return [];
  if (fib.fcChpx + fib.lcbChpx > tableStream.length) return [];

  const plcf = tableStream.subarray(fib.fcChpx, fib.fcChpx + fib.lcbChpx);
  const binCount = (fib.lcbChpx - 4) / 8;
  if (binCount <= 0 || !Number.isInteger(binCount)) return [];

  const binFCs = [];
  for (let i = 0; i <= binCount; i += 1) {
    binFCs.push(plcf.readUInt32LE(i * 4));
  }
  const pageNumbers = [];
  for (let bi = 0; bi < binCount; bi += 1) {
    pageNumbers.push(plcf.readUInt32LE((binCount + 1) * 4 + bi * 4));
  }

  const bodyCharacterCount = bodyText.length;
  const runs = [];

  for (let bi = 0; bi < binCount; bi += 1) {
    const pageNumber = pageNumbers[bi];
    if (pageNumber === 0) continue;
    const pageOffset = pageNumber * 512;
    if (pageOffset + 4 > wordDocument.length) continue;

    const page = wordDocument.subarray(pageOffset, Math.min(pageOffset + 512, wordDocument.length));
    const crun = page[511];
    if (crun <= 0) continue;

    const fcBoundaries = readFkpFcBoundaries(page, crun);
    const offsetArrayStart = (crun + 1) * 4;

    for (let i = 0; i < crun; i += 1) {
      const cpStart = fileOffsetToCharacterPosition(fcBoundaries[i], pieces);
      const cpEnd = fileOffsetToCharacterPosition(fcBoundaries[i + 1], pieces);
      if (cpStart == null || cpEnd == null || cpStart >= bodyCharacterCount || cpEnd <= 0) continue;

      const off = page[offsetArrayStart + i] * 2;
      if (off === 0 || off >= page.length) continue;
      const cb = page[off];
      if (cb === 0 || cb > 200 || off + 1 + cb > page.length) continue;
      const grpprl = page.subarray(off + 1, off + 1 + cb);
      const props = parseSprms(grpprl, false);
      runs.push({
        cpStart: Math.max(0, cpStart),
        cpEnd: Math.min(bodyCharacterCount, cpEnd),
        properties: props,
      });
    }
  }

  return runs;
}

function expandCharacterRuns(characterRuns, bodyCharacterCount) {
  const properties = new Array(bodyCharacterCount).fill(null);
  for (const run of characterRuns) {
    for (let cp = run.cpStart; cp < run.cpEnd && cp < properties.length; cp += 1) {
      properties[cp] = run.properties;
    }
  }
  return properties;
}

function fileOffsetToCharacterPosition(fileOffset, pieces) {
  for (const piece of pieces) {
    const byteLength = (piece.cpEnd - piece.cpStart) * (piece.compressed ? 1 : 2);
    const start = piece.fileOffset;
    const end = start + byteLength;
    if (fileOffset >= start && fileOffset <= end) {
      const delta = fileOffset - start;
      return piece.cpStart + Math.floor(delta / (piece.compressed ? 1 : 2));
    }
  }
  return null;
}

function getParagraphRanges(text) {
  const ranges = [];
  let start = 0;
  for (let i = 0; i < text.length; i += 1) {
    if (text[i] === "\r") {
      ranges.push({ cpStart: start, cpEnd: i + 1 });
      start = i + 1;
    }
  }
  if (start <= text.length) {
    ranges.push({ cpStart: start, cpEnd: text.length });
  }
  return ranges;
}

function rangesOverlap(a, b) {
  return a.cpStart < b.cpEnd && b.cpStart < a.cpEnd;
}
