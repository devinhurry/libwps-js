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
  const tableRows = extractTableRows(wordDocument, tableStream, fib, pieces, bodyText, paragraphProperties, sections);

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
    tableRows,
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
    let dataOffset;
    let byteLength;
    if (cb === 0) {
      const cbx = page[papxOffset + 1];
      if (cbx === 0 || papxOffset + 2 + cbx * 2 > page.length) continue;
      dataOffset = papxOffset + 2;
      byteLength = cbx * 2;
    } else {
      byteLength = cb * 2;
      if (byteLength > 400 || papxOffset + 1 + byteLength > page.length) continue;
      dataOffset = papxOffset + 1;
    }

    const cpStart = fileOffsetToCharacterPosition(fcBoundaries[i], pieces);
    const cpEnd = fileOffsetToCharacterPosition(fcBoundaries[i + 1], pieces);
    if (cpStart == null || cpEnd == null || cpStart >= bodyCharacterCount || cpEnd <= 0) continue;

    const data = page.subarray(dataOffset, dataOffset + byteLength);
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
    inTable: parsed.inTable ?? false,
    kinsoku: parsed.kinsoku ?? null,
    wordWrap: parsed.wordWrap ?? null,
    overflowPunct: parsed.overflowPunct ?? null,
    topLinePunct: parsed.topLinePunct ?? null,
    autoSpaceDE: parsed.autoSpaceDE ?? null,
    autoSpaceDN: parsed.autoSpaceDN ?? null,
    adjustRightInd: parsed.adjustRightInd ?? null,
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
    if (text[i] === "\r" || text[i] === "\x07" || text[i] === "\x0c") {
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

function extractTableRows(wordDocument, tableStream, fib, pieces, bodyText, paragraphProperties, sections = null) {
  const paragraphRanges = getParagraphRanges(bodyText);
  const rowProperties = collectTDefTableEntries(wordDocument, tableStream, fib, pieces);
  return buildTablesFromInTableParagraphBlocks(bodyText, paragraphProperties, paragraphRanges, rowProperties, sections);
}

function buildTablesFromInTableParagraphBlocks(bodyText, paragraphProperties, paragraphRanges, rowProperties, sections = null) {
  if (!paragraphProperties || paragraphProperties.length !== paragraphRanges.length) return [];

  const tables = [];
  let i = 0;
  while (i < paragraphRanges.length) {
    while (i < paragraphRanges.length && !paragraphProperties[i]?.inTable) i += 1;
    if (i >= paragraphRanges.length) break;

    let blockStart = i;
    let blockEnd = i;
    while (blockEnd < paragraphRanges.length) {
      const rangeText = bodyText.substring(paragraphRanges[blockEnd].cpStart, paragraphRanges[blockEnd].cpEnd);
      if (paragraphProperties[blockEnd]?.inTable || rangeText === "\x07") {
        blockEnd += 1;
        continue;
      }
      break;
    }

    const rows = buildGenericTableRows(
      paragraphRanges.slice(blockStart, blockEnd),
      paragraphProperties.slice(blockStart, blockEnd),
      bodyText,
      rowProperties,
    );
    for (const tableRows of splitRowsIntoTables(rows)) {
      if (tableRows.length === 0) continue;

      const gridPositions = buildTableGridPositions(tableRows);
      const gridCols = positionsToWidths(gridPositions);
      applyRowGeometry(tableRows, gridPositions, sections);
      tables.push({
        cpStart: tableRows[0].cpStart,
        cpEnd: tableRows.at(-1).cpEnd,
        gridCols,
        gridPositions,
        rows: tableRows,
        docxStyleIndex: 4,
      });
    }

    i = blockEnd;
  }

  return tables;
}

function splitRowsIntoTables(rows) {
  if (rows.length === 0) return [];

  const tables = [];
  let current = [];
  for (let i = 0; i < rows.length; i += 1) {
    if (current.length > 0 && shouldStartNewTableAt(rows, i, current)) {
      tables.push(current);
      current = [];
    }
    current.push(rows[i]);
  }
  if (current.length > 0) tables.push(current);
  return tables;
}

function shouldStartNewTableAt(rows, index, currentRows) {
  if (currentRows.length < 3) return false;
  if (rows[index].rowColumns) return false;
  if (!isControlOnlyText(rows[index].cells[0]?.text ?? "")) return false;
  if (!hasVisibleText(rows[index].cells[1]?.text ?? "")) return false;

  const currentGrid = buildTableGridPositions(currentRows);
  if (currentGrid.length <= 2) return false;

  const lookaheadRows = rows.slice(index, Math.min(rows.length, index + 3));
  if (!lookaheadRows.some((row) => row.rowColumns && row.rowColumns.length > 2)) return false;
  const lookaheadGrid = buildTableGridPositions(lookaheadRows);
  if (lookaheadGrid.length <= 2) return false;

  return hasIncompatibleGridBoundary(currentGrid, lookaheadGrid);
}

function hasIncompatibleGridBoundary(currentGrid, candidateGrid) {
  return candidateGrid.some((pos) => findGridPositionIndex(currentGrid, pos) == null);
}

function buildGenericTableRows(paragraphRanges, paragraphProperties, bodyText, rowProperties) {
  const rows = [];
  const rowEndIndices = new Set();

  for (let i = 0; i < paragraphRanges.length; i += 1) {
    const rangeText = bodyText.substring(paragraphRanges[i].cpStart, paragraphRanges[i].cpEnd);
    const isSeparator = !paragraphProperties[i]?.inTable && rangeText === "\x07";
    if (isSeparator) rowEndIndices.add(i);
  }

  const blockStartCp = paragraphRanges[0]?.cpStart ?? 0;
  const blockEndCp = paragraphRanges.at(-1)?.cpEnd ?? 0;
  for (const rowProperty of rowProperties ?? []) {
    if (rowProperty.cpStart < blockStartCp || rowProperty.cpEnd > blockEndCp) continue;
    const rowEndIndex = paragraphRanges.findIndex((range) => range.cpStart === rowProperty.cpStart && range.cpEnd === rowProperty.cpEnd);
    if (rowEndIndex >= 0) rowEndIndices.add(rowEndIndex);
  }

  let rowStart = 0;
  for (const rowEndIndex of [...rowEndIndices].sort((a, b) => a - b)) {
    if (rowEndIndex < rowStart) continue;

    const row = buildGenericTableRow(paragraphRanges.slice(rowStart, rowEndIndex), bodyText, paragraphRanges[rowEndIndex], rowProperties);
    if (row) rows.push(row);
    rowStart = rowEndIndex + 1;
  }

  const trailingRow = buildGenericTableRow(paragraphRanges.slice(rowStart), bodyText, null, rowProperties);
  if (trailingRow) rows.push(trailingRow);

  return rows;
}

function buildGenericTableRow(paragraphRanges, bodyText, rowEndRange, rowProperties) {
  if (paragraphRanges.length === 0) return null;

  const cells = [];
  let cellStart = paragraphRanges[0].cpStart;
  let sawCell = false;

  for (const range of paragraphRanges) {
    const rangeText = bodyText.substring(range.cpStart, range.cpEnd);
    if (!rangeText.endsWith("\x07")) continue;

    const cellEnd = range.cpEnd;
    cells.push({
      cpStart: cellStart,
      cpEnd: cellEnd,
      text: cleanCellText(bodyText.substring(cellStart, cellEnd)),
      width: 0,
      gridSpan: 1,
      vMerge: null,
      vAlign: "top",
    });
    cellStart = cellEnd;
    sawCell = true;
  }

  if (!sawCell) return null;

  const cpStart = paragraphRanges[0].cpStart;
  const cpEnd = rowEndRange?.cpEnd ?? paragraphRanges.at(-1).cpEnd;
  const rowProperty = findRowPropertyForRange(rowProperties, cpStart, cpEnd, cells.length);
  const rowColumns = normalizeColumnPositions(rowProperty?.columns);

  return {
    cpStart,
    cpEnd,
    cells,
    rowColumns,
    rowHeight: rowProperty?.rowHeight ?? 460,
    rowHeightRule: rowProperty?.rowHeightRule === 1 ? 1 : 0,
  };
}

function buildTableGridPositions(rows) {
  const positionSet = new Set();
  for (const row of rows) {
    if (!row.rowColumns || row.rowColumns.length < 2) continue;
    for (const pos of row.rowColumns) positionSet.add(pos);
  }

  if (positionSet.size === 0) {
    const maxCells = rows.reduce((max, row) => Math.max(max, row.cells.length), 1);
    const positions = [];
    for (let i = 0; i <= maxCells; i += 1) positions.push(i * 1440);
    return positions;
  }

  const positions = [...positionSet].sort((a, b) => a - b);
  const merged = [positions[0]];
  for (let i = 1; i < positions.length; i += 1) {
    if (Math.abs(positions[i] - merged.at(-1)) > 20) {
      merged.push(positions[i]);
    }
  }

  const maxCells = rows.reduce((max, row) => Math.max(max, row.cells.length), 1);
  if (maxCells > merged.length - 1) {
    const left = merged[0];
    const right = merged.at(-1);
    const width = right - left;
    for (let i = 1; i < maxCells; i += 1) {
      const pos = Math.round(left + (width * i) / maxCells);
      if (findGridPositionIndex(merged, pos) == null) merged.push(pos);
    }
    merged.sort((a, b) => a - b);
  }
  return merged;
}

function positionsToWidths(positions) {
  const widths = [];
  for (let i = 1; i < positions.length; i += 1) {
    widths.push(Math.max(1, positions[i] - positions[i - 1]));
  }
  return widths.length > 0 ? widths : [9000];
}

function applyRowGeometry(rows, gridPositions, sections = null) {
  const fallbackWidths = buildGenericGridCols(rows, sections);
  for (const row of rows) {
    if (!row.rowColumns || row.rowColumns.length !== row.cells.length + 1) {
      for (let ci = 0; ci < row.cells.length; ci += 1) {
        row.cells[ci].width = fallbackWidths[Math.min(ci, fallbackWidths.length - 1)] ?? 1440;
        row.cells[ci].gridSpan = 1;
      }
      continue;
    }

    for (let ci = 0; ci < row.cells.length; ci += 1) {
      const start = row.rowColumns[ci];
      const end = row.rowColumns[ci + 1];
      const startIndex = findGridPositionIndex(gridPositions, start);
      const endIndex = findGridPositionIndex(gridPositions, end);
      const span = startIndex != null && endIndex != null && endIndex > startIndex
        ? endIndex - startIndex
        : 1;
      row.cells[ci].width = Math.max(1, end - start);
      row.cells[ci].gridSpan = span;
    }
  }
}

function findGridPositionIndex(gridPositions, value) {
  let bestIndex = null;
  let bestDistance = Infinity;
  for (let i = 0; i < gridPositions.length; i += 1) {
    const distance = Math.abs(gridPositions[i] - value);
    if (distance < bestDistance) {
      bestDistance = distance;
      bestIndex = i;
    }
  }
  return bestDistance <= 20 ? bestIndex : null;
}

function findRowPropertyForRange(rowProperties, cpStart, cpEnd, cellCount) {
  if (!rowProperties || rowProperties.length === 0) return null;

  const overlapping = rowProperties.filter((entry) => rangesOverlap(entry, { cpStart, cpEnd }));
  if (overlapping.length === 0) return null;

  const exactCellCount = overlapping.findLast((entry) => entry.columns?.length === cellCount + 1);
  if (exactCellCount) return exactCellCount;

  return overlapping.at(-1) ?? null;
}

function normalizeColumnPositions(columns) {
  if (!columns || columns.length < 2) return null;
  const first = columns[0];
  const normalized = columns.map((pos) => pos - first);
  for (let i = 1; i < normalized.length; i += 1) {
    if (normalized[i] <= normalized[i - 1]) return null;
  }
  return normalized;
}

function buildGenericGridCols(rows, sections = null) {
  const widestRow = rows.reduce((best, row) => (row.cells.length > best.cells.length ? row : best), rows[0]);
  const weights = widestRow.cells.map((cell) => {
    const visibleLength = cleanCellText(cell.text).replace(/\s+/g, "").length;
    return Math.max(1, visibleLength || 1);
  });
  const section = sections?.[0]?.properties ?? null;
  const totalWidth = section
    ? Math.max(6000, Math.min(12000, section.pageWidth - section.marginLeft - section.marginRight))
    : 9000;
  const totalWeight = weights.reduce((sum, weight) => sum + weight, 0) || 1;
  const cols = [];
  let consumed = 0;
  for (let i = 0; i < weights.length; i += 1) {
    const isLast = i === weights.length - 1;
    const width = isLast
      ? totalWidth - consumed
      : Math.max(300, Math.floor((totalWidth * weights[i]) / totalWeight));
    cols.push(width);
    consumed += width;
  }
  return cols;
}

function collectTDefTableEntries(wordDocument, tableStream, fib, pieces) {
  if (!fib.fcPapx || !fib.lcbPapx || fib.lcbPapx < 4) return [];
  if (fib.fcPapx + fib.lcbPapx > tableStream.length) return [];

  const plcf = tableStream.subarray(fib.fcPapx, fib.fcPapx + fib.lcbPapx);
  const binCount = (fib.lcbPapx - 4) / 8;
  if (binCount <= 0 || !Number.isInteger(binCount)) return [];

  const pageNumbers = [];
  for (let bi = 0; bi < binCount; bi += 1) {
    pageNumbers.push(plcf.readUInt32LE((binCount + 1) * 4 + bi * 4));
  }

  const entries = [];

  for (let bi = 0; bi < binCount; bi += 1) {
    const pageNumber = pageNumbers[bi];
    if (pageNumber === 0) continue;
    const pageOffset = pageNumber * 512;
    if (pageOffset + PHE_SIZE > wordDocument.length) continue;

    const page = wordDocument.subarray(pageOffset, Math.min(pageOffset + 512, wordDocument.length));
    const crun = page[511];
    if (crun <= 0) continue;

    const fcBoundaries = readFkpFcBoundaries(page, crun);
    const bxStart = (crun + 1) * 4;

    for (let i = 0; i < crun; i += 1) {
      const bxOffset = bxStart + i * (1 + PHE_SIZE);
      if (bxOffset >= 511) break;
      const papxOffset = page[bxOffset] * 2;
      if (papxOffset <= 0 || papxOffset >= 511) continue;
      const cb = page[papxOffset];
      let dataOffset;
      let byteLength;
      if (cb === 0) {
        const cbx = page[papxOffset + 1];
        if (cbx === 0 || papxOffset + 2 + cbx * 2 > page.length) continue;
        dataOffset = papxOffset + 2;
        byteLength = cbx * 2;
      } else {
        byteLength = cb * 2;
        if (byteLength > 400 || papxOffset + 1 + byteLength > page.length) continue;
        dataOffset = papxOffset + 1;
      }

      const cpStart = fileOffsetToCharacterPosition(fcBoundaries[i], pieces);
      const cpEnd = fileOffsetToCharacterPosition(fcBoundaries[i + 1], pieces);
      if (cpStart == null || cpEnd == null) continue;

      const data = page.subarray(dataOffset, dataOffset + byteLength);
      const info = parseTableRowSprms(data);
      if (!info) continue;

      entries.push({
        cpStart,
        cpEnd,
        columns: info.columns,
        rowHeight: info.rowHeight,
        rowHeightRule: info.rowHeightRule,
      });
    }
  }

  entries.sort((a, b) => a.cpStart - b.cpStart);
  return entries;
}

function cleanCellText(text) {
  return text
    .replace(/[\x07\x0c]/g, "")
    .replace(/[\x00-\x06\x08\x0b\x0e-\x1f]/g, "");
}

function isControlOnlyText(text) {
  return text.replace(/[\s\x00-\x1f]/g, "").length === 0;
}

function hasVisibleText(text) {
  return text.replace(/[\s\x00-\x1f]/g, "").length > 0;
}

function parseTableRowSprms(data) {
  let off = 2;
  if (data.length >= 2 && data[off] === 0) off += 1;

  let tableDef = null;
  let rowHeight = null;
  let rowHeightRule = null;

  while (off + 2 <= data.length) {
    if (data[off] === 0) { off += 1; continue; }
    const sprm = data.readUInt16LE(off);
    const spra = (sprm >> 13) & 0x7;
    let size = SPRM_OPERAND_SIZE_BY_SPRA[spra];

    if (sprm === 0xD608) {
      const cb = data[off + 2];
      size = cb + 1;
      if (off + 3 + cb <= data.length) {
        const tblData = data.subarray(off + 3, off + 3 + cb);
        const itc = tblData[1];
        if (itc > 0 && itc < 64 && 2 + (itc + 1) * 2 <= tblData.length) {
          const positions = [];
          for (let i = 0; i <= itc; i += 1) {
            positions.push(tblData.readInt16LE(2 + i * 2));
          }
          tableDef = positions;
        }
      }
    } else if (sprm === 0xD605) {
      const cb = data[off + 2];
      size = cb + 1;
    } else if (sprm === 0x9407) {
      if (off + 4 <= data.length) {
        const height = data.readInt16LE(off + 2);
        rowHeight = Math.abs(height);
        rowHeightRule = height < 0 ? 1 : 0;
      }
    } else {
      if (size === -1) {
        if (off + 2 < data.length) size = data[off + 2] + 1;
        else break;
      }
    }

    if (!size || size < 0 || off + 2 + size > data.length) break;
    off += 2 + size;
  }

  if (!tableDef) return null;
  return { columns: tableDef, rowHeight, rowHeightRule };
}
