import { parseSprms } from "./sprm.js";
import {
  getBuiltInStyleDefinitionByRawName,
  resolveStyleIdFromRawName,
  resolveStyleNameFromRawName,
  resolveStyleTypeFromSgc,
} from "./style-defs.js";

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
const TABLE_BORDER_SIDES = ["top", "left", "bottom", "right", "insideH", "insideV"];

export function extractWordBinaryDocument({ wordDocument, table0, table1 = null, data = null }) {
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
  const defaultTabStop = inferDefaultTabStop(sections);
  const paragraphProperties = extractParagraphProperties(wordDocument, tableStream, fib, bodyText, styles, pieces);
  const characterRuns = extractCharacterRuns(wordDocument, tableStream, fib, bodyText, pieces);
  const characterProperties = expandCharacterRuns(characterRuns, bodyText.length);
  const tableRows = extractTableRows(wordDocument, tableStream, fib, pieces, bodyText, paragraphProperties, sections, data);

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
    defaultTabStop,
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

function inferDefaultTabStop(sections) {
  if (!Array.isArray(sections) || sections.length === 0) {
    // Gary's personal judgment: when the binary document does not expose a section profile,
    // keep Word's legacy default tab spacing so plain text alignment does not drift.
    return 420;
  }

  const hasExplicitDocGrid = sections.some((section) => section?.properties?.docGridType != null);
  if (hasExplicitDocGrid) {
    // Gary's personal judgment: documents that expose an explicit doc grid use the denser
    // half-width tab behavior in the observed WPS fixtures.
    return 420;
  }

  return 720;
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
      if (papxOffset + 1 + byteLength > page.length) continue;
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
    leftIndentChars: parsed.leftIndentChars ?? null,
    rightIndentChars: parsed.rightIndentChars ?? null,
    firstLineIndentChars: parsed.firstLineIndentChars ?? null,
    leftIndent: parsed.leftIndent ?? null,
    rightIndent: parsed.rightIndent ?? null,
    firstLineIndent: parsed.firstLineIndent ?? null,
    spacingBefore: parsed.spacingBefore ?? null,
    spacingAfter: parsed.spacingAfter ?? null,
    spacingBeforeAuto: parsed.spacingBeforeAuto ?? null,
    spacingAfterAuto: parsed.spacingAfterAuto ?? null,
    listLevel: parsed.listLevel ?? null,
    listId: parsed.listId ?? null,
    tabs: parsed.tabs ?? null,
    inTable: parsed.inTable ?? false,
    keepLines: parsed.keepLines ?? null,
    keepNext: parsed.keepNext ?? null,
    pageBreakBefore: parsed.pageBreakBefore ?? null,
    widowControl: parsed.widowControl ?? null,
    bidi: parsed.bidi ?? null,
    snapToGrid: parsed.snapToGrid ?? null,
    textAlignment: parsed.textAlignment ?? null,
    kinsoku: parsed.kinsoku ?? null,
    wordWrap: parsed.wordWrap ?? null,
    overflowPunct: parsed.overflowPunct ?? null,
    topLinePunct: parsed.topLinePunct ?? null,
    autoSpaceDE: parsed.autoSpaceDE ?? null,
    autoSpaceDN: parsed.autoSpaceDN ?? null,
    adjustRightInd: parsed.adjustRightInd ?? null,
    lineNumberCount: parsed.lineNumberCount ?? null,
    tablePosition: parsed.tablePosition ?? null,
    tableNoAllowOverlap: parsed.tableNoAllowOverlap ?? null,
  };
}

const STYLE_TYPE_PARAGRAPH = "paragraph";
const STYLE_TYPE_CHARACTER = "character";
const STYLE_TYPE_TABLE = "table";
const STYLE_TYPE_LIST = "list";

function buildStyleId(name, index) {
  return resolveStyleIdFromRawName(name, index);
}

function buildStyleName(name) {
  return resolveStyleNameFromRawName(name);
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

  let order = 0;
  for (const style of styles) {
    if (!style) continue;
    style.order = order;
    const builtIn = getBuiltInStyleDefinitionByRawName(style.name);
    if (builtIn) {
      style.styleId = builtIn.styleId;
      style.styleName = builtIn.styleName;
      style.type = builtIn.type;
    } else {
      style.styleId = String(order + 1);
    }
    order += 1;
  }
  applyCompactWpsStyleProfile(styles);

  return styles;
}

function applyCompactWpsStyleProfile(styles) {
  if (!styles.some((style) => style?.name === "正文文本")) return;

  // Evidence: WPS desktop exports documents with the compact built-in style set
  // containing "正文文本" as Body Text styleId=3, with footer/header shifted to
  // 4/5 and Default Paragraph Font/Normal Table at 7/6. Documents with the
  // larger built-in set, such as sample3, do not contain "正文文本" and keep the
  // standard parsed built-in ids from style-defs.js.
  const compactBuiltIns = new Map([
    ["标题 1", { styleId: "2", styleName: "heading 1", type: STYLE_TYPE_PARAGRAPH }],
    ["正文文本", { styleId: "3", styleName: "Body Text", type: STYLE_TYPE_PARAGRAPH }],
    ["页脚", { styleId: "4", styleName: "footer", type: STYLE_TYPE_PARAGRAPH }],
    ["页眉", { styleId: "5", styleName: "header", type: STYLE_TYPE_PARAGRAPH }],
    ["普通表格", { styleId: "6", styleName: "Normal Table", type: STYLE_TYPE_TABLE }],
    ["默认段落字体", { styleId: "7", styleName: "Default Paragraph Font", type: STYLE_TYPE_CHARACTER }],
    ["Table Normal", { styleId: "8", styleName: "Table Normal", type: STYLE_TYPE_TABLE }],
    ["List Paragraph", { styleId: "9", styleName: "List Paragraph", type: STYLE_TYPE_PARAGRAPH }],
    ["Table Paragraph", { styleId: "10", styleName: "Table Paragraph", type: STYLE_TYPE_PARAGRAPH }],
  ]);

  for (const style of styles) {
    const compact = compactBuiltIns.get(style?.name);
    if (!compact) continue;
    style.styleId = compact.styleId;
    style.styleName = compact.styleName;
    style.type = compact.type;
  }
}

function parseStd(std, index) {
  if (std.length < STSH_STD_HEADER_SIZE + 2) return null;

  const sti = std.readUInt16LE(0) & 0x0fff;
  const sgc = std.readUInt16LE(2) & 0x000f;
  const istdBase = std.readUInt16LE(2) >> 4;
  const istdNext = std.readUInt16LE(4) >> 4;

  const cbName = std.readUInt16LE(STSH_STD_NAME_OFFSET);
  if (cbName < 1 || cbName > 50) return null;

  const nameStart = STSH_STD_NAME_OFFSET + 2;
  const nameEnd = nameStart + cbName * 2;
  if (nameEnd + 2 > std.length) return null;

  const name = std.subarray(nameStart, nameEnd).toString("utf16le");
  const grpprlStart = nameEnd + 2;
  const grpprl = std.subarray(grpprlStart);
  const parsed = parseSprms(grpprl, true);

  const runProperties = extractCharacterPropertiesFromGrpprl(grpprl);
  const type = resolveStyleTypeFromSgc(name, sgc);
  const styleId = buildStyleId(name, index);
  const styleName = buildStyleName(name);

  return {
    index,
    name,
    styleName,
    sti,
    sgc,
    type,
    styleId,
    basedOn: resolveBasedOn(istdBase, index),
    next: istdNext,
    baseCode: istdBase,
    nextCode: istdNext,
    lineSpacing: parsed.lineSpacing ?? extractLineSpacingFromGrpprl(grpprl),
    alignment: parsed.alignment ?? null,
    leftIndentChars: parsed.leftIndentChars ?? null,
    rightIndentChars: parsed.rightIndentChars ?? null,
    firstLineIndentChars: parsed.firstLineIndentChars ?? null,
    leftIndent: parsed.leftIndent ?? null,
    rightIndent: parsed.rightIndent ?? null,
    firstLineIndent: parsed.firstLineIndent ?? null,
    spacingBefore: parsed.spacingBefore ?? null,
    spacingAfter: parsed.spacingAfter ?? null,
    spacingBeforeAuto: parsed.spacingBeforeAuto ?? null,
    spacingAfterAuto: parsed.spacingAfterAuto ?? null,
    listLevel: parsed.listLevel ?? null,
    listId: parsed.listId ?? null,
    tabs: parsed.tabs ?? null,
    keepLines: parsed.keepLines ?? null,
    keepNext: parsed.keepNext ?? null,
    pageBreakBefore: parsed.pageBreakBefore ?? null,
    widowControl: parsed.widowControl ?? null,
    bidi: parsed.bidi ?? null,
    snapToGrid: parsed.snapToGrid ?? null,
    textAlignment: parsed.textAlignment ?? null,
    kinsoku: parsed.kinsoku ?? null,
    wordWrap: parsed.wordWrap ?? null,
    overflowPunct: parsed.overflowPunct ?? null,
    topLinePunct: parsed.topLinePunct ?? null,
    autoSpaceDE: parsed.autoSpaceDE ?? null,
    autoSpaceDN: parsed.autoSpaceDN ?? null,
    adjustRightInd: parsed.adjustRightInd ?? null,
    lineNumberCount: parsed.lineNumberCount ?? null,
    runProperties,
  };
}

function resolveBasedOn(istdBase, index) {
  if (istdBase === 0x0fff || istdBase >= STSH_NIL_BASE) return null;
  if (istdBase === index) return null;
  return istdBase;
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
  scanKnownSprm(grpprl, 0x4a61, 2, (value) => { props.fontSizeCs = value.readUInt16LE(0); });
  scanKnownSprm(grpprl, 0x4a4f, 2, (value) => { props.fontAscii = value.readUInt16LE(0); });
  scanKnownSprm(grpprl, 0x4a50, 2, (value) => { props.fontEastAsia = value.readUInt16LE(0); });
  scanKnownSprm(grpprl, 0x4a51, 2, (value) => { props.fontHAnsi = value.readUInt16LE(0); });
  scanKnownSprm(grpprl, 0x4a5e, 2, (value) => { props.fontCs = value.readUInt16LE(0); });
  scanKnownSprm(grpprl, 0x286f, 1, (value) => { props.fontHint = value[0] === 1 ? "eastAsia" : "default"; });
  scanKnownSprm(grpprl, 0x4852, 2, (value) => { props.charWidth = value.readUInt16LE(0); });
  scanKnownSprm(grpprl, 0x8840, 2, (value) => { props.charSpacing = value.readInt16LE(0); });
  scanKnownSprm(grpprl, 0x484b, 2, (value) => { props.kern = value.readUInt16LE(0); });
  scanKnownSprm(grpprl, 0x2a42, 1, (value) => { props.textColor = styleTextColorHex(value[0]); });
  scanKnownSprm(grpprl, 0x2a0e, 1, (value) => {
    if (value[0] === 0) props.underline = false;
  });
  scanKnownSprm(grpprl, 0x2a3e, 1, (value) => {
    if (value[0] === 0) props.underline = false;
  });
  scanKnownSprm(grpprl, 0x485f, 2, (value) => { props.langIdBidi = value.readUInt16LE(0); });
  scanKnownSprm(grpprl, 0x486d, 2, (value) => { props.langId = value.readUInt16LE(0); });
  scanKnownSprm(grpprl, 0x486e, 2, (value) => { props.langIdEastAsia = value.readUInt16LE(0); });
  scanKnownSprm(grpprl, 0x4873, 2, (value) => { props.langId = value.readUInt16LE(0); });
  scanKnownSprm(grpprl, 0x4874, 2, (value) => { props.langIdEastAsia = value.readUInt16LE(0); });
  return Object.keys(props).length ? props : null;
}

function styleTextColorHex(index) {
  const colors = [
    "auto",
    "000000",
    "8080FF",
    "80FFFF",
    "80FF80",
    "FF80FF",
    // WPS STSH style color index 6 exports as red in sample3 styles.xml.
    "FF0000",
    "FFFF00",
    "FFFFFF",
    "0000FF",
    "00FFFF",
    "00FF00",
    "FF00FF",
    "FF0000",
    "800000",
    "808080",
    "C0C0C0",
  ];
  if (index >= 0 && index < colors.length) {
    return colors[index];
  }
  throw new Error(`Unsupported style text color index ${index}`);
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

export function parseSectionSprms(grpprl) {
  const props = {};
  let off = 0;
  while (off + 2 <= grpprl.length) {
    const sprm = grpprl.readUInt16LE(off);
    off += 2;
    let size = sectionSprmOperandSize(sprm);
    if (size === -1) {
      if (off >= grpprl.length) {
        throw new Error(`Truncated section SPRM length byte for 0x${sprm.toString(16)}`);
      }
      size = grpprl[off] + 1;
    }
    if (off + size > grpprl.length) {
      throw new Error(`Truncated section SPRM operand for 0x${sprm.toString(16)}`);
    }
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
  if (size === -1) {
    return -1;
  }
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
    case 0x300a:
      props.titlePg = val[0] !== 0;
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
    case 0x5032:
      props.docGridType = val.readUInt16LE(0);
      break;
    case 0x7030:
      props.docGridCharSpace = val.readUInt32LE(0);
      break;
    case 0x9031:
      props.docGridLinePitch = val.readUInt16LE(0);
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

function extractTableRows(wordDocument, tableStream, fib, pieces, bodyText, paragraphProperties, sections = null, dataStream = null) {
  const paragraphRanges = getParagraphRanges(bodyText);
  const rowProperties = collectTDefTableEntries(wordDocument, tableStream, fib, pieces, dataStream);
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
    const meaningfulRows = rows.filter((row) =>
      row.rowColumns || row.cells.some((cell) => cleanCellText(cell.text).length > 0),
    );
    if (meaningfulRows.length === 0) {
      i = blockEnd;
      continue;
    }
    if (meaningfulRows.some((row) => !row.rowColumns)) {
      throw new Error("Unable to infer table grid positions: missing parsed row column geometry for a non-empty table block");
    }

    for (const tableRows of splitRowsIntoTables(meaningfulRows)) {
      if (tableRows.length === 0) continue;

      const gridPositions = buildTableGridPositions(tableRows);
      const gridCols = positionsToWidths(gridPositions);
      applyRowGeometry(tableRows, gridPositions, sections);
      inferMissingRowHeights(tableRows);
      const { tableWidth, tableWidthType } = inferTableWidth(tableRows);
      const cellMargins = inferTableCellMargins(tableRows);
      const tableBorders = inferTableBorders(tableRows);
      tables.push({
        cpStart: tableRows[0].cpStart,
        cpEnd: tableRows.at(-1).cpEnd,
        gridCols,
        gridPositions,
        rows: tableRows,
        tableWidth,
        tableWidthType,
        cellMargins,
        tableBorders,
      });
    }

    i = blockEnd;
  }

  if (tables.length === 0 && rowProperties.length > 0) {
    // Some WPS exports do not mark table body paragraphs as inTable, but the row
    // properties still carry explicit table geometry. Use them as the fallback source.
    const rows = buildGenericTableRows(paragraphRanges, paragraphProperties, bodyText, rowProperties);
    const meaningfulRows = rows.filter((row) =>
      row.rowColumns || row.cells.some((cell) => cleanCellText(cell.text).length > 0),
    );
    if (meaningfulRows.some((row) => !row.rowColumns)) {
      throw new Error("Unable to infer table grid positions: missing parsed row column geometry for a non-empty table block");
    }
    for (const tableRows of splitRowsIntoTables(meaningfulRows)) {
      if (tableRows.length === 0) continue;

      const gridPositions = buildTableGridPositions(tableRows);
      const gridCols = positionsToWidths(gridPositions);
      applyRowGeometry(tableRows, gridPositions, sections);
      inferMissingRowHeights(tableRows);
      const { tableWidth, tableWidthType } = inferTableWidth(tableRows);
      const cellMargins = inferTableCellMargins(tableRows);
      const tableBorders = inferTableBorders(tableRows);
      tables.push({
        cpStart: tableRows[0].cpStart,
        cpEnd: tableRows.at(-1).cpEnd,
        gridCols,
        gridPositions,
        rows: tableRows,
        tableWidth,
        tableWidthType,
        cellMargins,
        tableBorders,
      });
    }
  }

  return tables;
}

function splitRowsIntoTables(rows) {
  if (rows.length === 0) return [];
  const tables = [];
  let current = [];
  let currentWidthKey = null;
  let currentPositionKey = null;
  for (let i = 0; i < rows.length; i += 1) {
    const row = rows[i];
    const widthKey = row.tableWidth == null
      ? null
      : `${row.tableWidth}:${row.tableWidthType ?? "dxa"}`;
    const positionKey = row.tablePosition ? "positioned" : row.tableNoAllowOverlap ? "positioned" : "flow";
    if (
      current.length > 0 &&
      ((widthKey != null && currentWidthKey != null && widthKey !== currentWidthKey) ||
        (currentPositionKey != null && positionKey !== currentPositionKey))
    ) {
      tables.push(current);
      current = [];
      currentWidthKey = null;
      currentPositionKey = null;
    }
    if (currentWidthKey == null && widthKey != null) {
      currentWidthKey = widthKey;
    }
    if (currentPositionKey == null) {
      currentPositionKey = positionKey;
    }
    current.push(row);
  }
  if (current.length > 0) tables.push(current);
  return tables;
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

    const row = buildGenericTableRow(
      paragraphRanges.slice(rowStart, rowEndIndex),
      paragraphProperties.slice(rowStart, rowEndIndex),
      bodyText,
      paragraphRanges[rowEndIndex],
      rowProperties,
    );
    if (row) rows.push(row);
    rowStart = rowEndIndex + 1;
  }

  const trailingRow = buildGenericTableRow(
    paragraphRanges.slice(rowStart),
    paragraphProperties.slice(rowStart),
    bodyText,
    null,
    rowProperties,
  );
  if (trailingRow) rows.push(trailingRow);

  return rows;
}

function buildGenericTableRow(paragraphRanges, paragraphProperties, bodyText, rowEndRange, rowProperties) {
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
        vAlign: "center",
      });
    cellStart = cellEnd;
    sawCell = true;
  }

  if (!sawCell) return null;

  const cpStart = paragraphRanges[0].cpStart;
  const cpEnd = rowEndRange?.cpEnd ?? paragraphRanges.at(-1).cpEnd;
  const rowProperty = findRowPropertyForRange(rowProperties, cpStart, cpEnd, cells.length);
  const rowColumns = normalizeColumnPositions(rowProperty?.columns);
  const rowPosition = extractTablePositionForRange(paragraphRanges, paragraphProperties, cpStart, cpEnd);

  return {
    cpStart,
    cpEnd,
    cells,
    rowColumns,
    cellMargins: rowProperty?.cellMargins ?? null,
    cellFlags: rowProperty?.cellFlags ?? null,
    cellBorders: rowProperty?.cellBorders ?? null,
    cellBorderSideArrays: rowProperty?.cellBorderSideArrays ?? null,
    cellBorderAssignments: rowProperty?.cellBorderAssignments ?? null,
    tableBorders: rowProperty?.tableBorders ?? null,
    tableWidth: rowProperty?.tableWidth ?? null,
    tableWidthType: rowProperty?.tableWidthType ?? null,
    rowHeight: rowProperty?.rowHeight ?? null,
    rowHeightRule: rowProperty?.rowHeightRule ?? null,
    cantSplit: rowProperty?.cantSplit ?? null,
    repeatHeader: rowProperty?.repeatHeader ?? null,
    vMergeAssignments: rowProperty?.vMergeAssignments ?? null,
    vAlignAssignments: rowProperty?.vAlignAssignments ?? null,
    tablePosition: rowPosition?.tablePosition ?? null,
    tableNoAllowOverlap: rowPosition?.tableNoAllowOverlap ?? null,
  };
}

function buildTableGridPositions(rows) {
  const positionSet = new Set();
  for (const row of rows) {
    if (!row.rowColumns || row.rowColumns.length < 2) continue;
    for (const pos of row.rowColumns) positionSet.add(pos);
  }

  if (positionSet.size === 0) {
    throw new Error("Unable to infer table grid positions: no row column geometry was parsed");
  }

  const positions = [...positionSet].sort((a, b) => a - b);
  const merged = [positions[0]];
  for (let i = 1; i < positions.length; i += 1) {
    if (Math.abs(positions[i] - merged.at(-1)) > 20) {
      merged.push(positions[i]);
    }
  }
  return merged;
}

function positionsToWidths(positions) {
  if (!positions || positions.length < 2) {
    throw new Error("Invalid table grid: expected at least two positions");
  }
  const widths = [];
  for (let i = 1; i < positions.length; i += 1) {
    widths.push(Math.max(1, positions[i] - positions[i - 1]));
  }
  return widths;
}

function applyRowGeometry(rows, gridPositions, sections = null) {
  for (const row of rows) {
    if (!row.rowColumns || row.rowColumns.length !== row.cells.length + 1) {
      row.rowColumns = inferRowColumnsFromGrid(gridPositions, row);
    }
    if (!row.rowColumns || row.rowColumns.length !== row.cells.length + 1) {
      throw new Error("Unable to infer table row geometry: missing parsed row column boundaries");
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
      if (row.cellBorders?.[ci]) {
        row.cells[ci].borders = row.cellBorders[ci];
      }
    }
    applyCellFlags(row);
    applyCellBorderSideArrays(row);
    applyCellBorderAssignments(row);
    applyVerticalMergeAssignments(row);
    applyVerticalAlignAssignments(row);
  }
}

function applyCellFlags(row) {
  if (!row.cellFlags || row.cellFlags.length === 0) return;
  for (let ci = 0; ci < Math.min(row.cells.length, row.cellFlags.length); ci += 1) {
    const flags = row.cellFlags[ci];
    const cell = row.cells[ci];
    if (!cell || !flags) continue;
    if (flags.bVertRestart) cell.vMerge = "restart";
    else if (flags.bVertMerge) cell.vMerge = "continue";
    if (flags.nVertAlign === 2) cell.vAlign = "bottom";
    else if (flags.nVertAlign === 1) cell.vAlign = "center";
    else if (flags.nVertAlign === 0) cell.vAlign = "top";
  }
}

function applyVerticalMergeAssignments(row) {
  if (!row.vMergeAssignments || row.vMergeAssignments.length === 0) return;
  for (const assignment of row.vMergeAssignments) {
    const cell = row.cells[assignment.itc];
    if (!cell) continue;
    if (assignment.state === 3) cell.vMerge = "restart";
    else if (assignment.state === 1) cell.vMerge = "continue";
  }
}

function applyCellBorderAssignments(row) {
  if (!row.cellBorderAssignments || row.cellBorderAssignments.length === 0) return;
  for (const assignment of row.cellBorderAssignments) {
    const start = Math.max(0, assignment.itcFirst);
    const end = Math.min(row.cells.length, assignment.itcLim);
    for (let ci = start; ci < end; ci += 1) {
      const cell = row.cells[ci];
      if (!cell) continue;
      if (!cell.borders) {
        cell.borders = createDefaultTableBorders();
      }
      if (assignment.changeTop) cell.borders.top = assignment.border;
      if (assignment.changeLeft) cell.borders.left = assignment.border;
      if (assignment.changeBottom) cell.borders.bottom = assignment.border;
      if (assignment.changeRight) cell.borders.right = assignment.border;
    }
  }
}

function applyCellBorderSideArrays(row) {
  if (!row.cellBorderSideArrays) return;

  const sideArrays = [
    ["top", row.cellBorderSideArrays.top],
    ["left", row.cellBorderSideArrays.left],
    ["bottom", row.cellBorderSideArrays.bottom],
    ["right", row.cellBorderSideArrays.right],
  ];

  if (sideArrays.every(([, borders]) => !borders || borders.length === 0)) return;

  for (let ci = 0; ci < row.cells.length; ci += 1) {
    const cell = row.cells[ci];
    if (!cell) continue;
    for (const [side, borders] of sideArrays) {
      if (!borders || borders.length === 0) continue;
      const border = borders[ci];
      if (!border || border.style === "none") continue;
      if (!cell.borders) cell.borders = createDefaultTableBorders();
      cell.borders[side] = border;
    }
  }
}

function applyVerticalAlignAssignments(row) {
  if (!row.vAlignAssignments || row.vAlignAssignments.length === 0) return;
  for (const assignment of row.vAlignAssignments) {
    const start = Math.max(0, assignment.itcFirst);
    const end = Math.min(row.cells.length, assignment.itcLim);
    for (let ci = start; ci < end; ci += 1) {
      const cell = row.cells[ci];
      if (!cell) continue;
      cell.vAlign = assignment.valign === 2 ? "bottom" : assignment.valign === 1 ? "center" : "top";
    }
  }
}

function extractTablePositionForRange(paragraphRanges, paragraphProperties, cpStart, cpEnd) {
  const positions = [];
  let noAllowOverlap = false;

  for (let i = 0; i < paragraphRanges.length; i += 1) {
    const range = paragraphRanges[i];
    if (range.cpEnd <= cpStart || range.cpStart >= cpEnd) continue;
    const props = paragraphProperties[i];
    if (props?.tablePosition) positions.push(props.tablePosition);
    if (props?.tableNoAllowOverlap) noAllowOverlap = true;
  }

  if (positions.length === 0 && !noAllowOverlap) return null;

  const merged = {};
  for (const position of positions) {
    for (const [key, value] of Object.entries(position)) {
      if (value == null) continue;
      if (merged[key] == null) {
        merged[key] = value;
        continue;
      }
      if (merged[key] !== value) {
        throw new Error(`Conflicting table position sprms were parsed for a table row: ${key}`);
      }
    }
  }

  return { tablePosition: Object.keys(merged).length > 0 ? merged : null, tableNoAllowOverlap: noAllowOverlap };
}

function parseCellBorderSideArrayOperand(sprm, payload) {
  if (!payload || payload.length === 0) {
    throw new Error(`Truncated cell border side array SPRM 0x${sprm.toString(16)}`);
  }
  if (payload.length % 4 !== 0) {
    throw new Error(`Unsupported cell border side array length ${payload.length} in SPRM 0x${sprm.toString(16)}`);
  }

  let side = null;
  if (sprm === 0xD61A) side = "top";
  else if (sprm === 0xD61B) side = "left";
  else if (sprm === 0xD61C) side = "bottom";
  else if (sprm === 0xD61D) side = "right";
  else throw new Error(`Unsupported cell border side SPRM 0x${sprm.toString(16)}`);

  const borders = [];
  for (let off = 0; off < payload.length; off += 4) {
    borders.push(parseBorderRecord(payload.subarray(off, off + 4), sprm));
  }
  return { side, borders };
}

function inferMissingRowHeights(rows) {
  const heightCounts = new Map();
  for (const row of rows) {
    if (row.rowHeight == null) continue;
    const key = `${row.rowHeight}:${row.rowHeightRule}`;
    heightCounts.set(key, (heightCounts.get(key) ?? 0) + 1);
  }

  let dominantKey = null;
  let dominantCount = 0;
  for (const [key, count] of heightCounts.entries()) {
    if (count > dominantCount) {
      dominantKey = key;
      dominantCount = count;
    }
  }

  if (!dominantKey) return;
  const [heightText, ruleText] = dominantKey.split(":");
  const dominantHeight = Number(heightText);
  const dominantRule = Number(ruleText);

  for (const row of rows) {
    if (row.rowHeight != null) continue;
    row.rowHeight = dominantHeight;
    row.rowHeightRule = dominantRule;
  }
}

function inferRowColumnsFromGrid(gridPositions, row) {
  if (!gridPositions || gridPositions.length < row.cells.length + 1) return null;

  const excessColumns = gridPositions.length - 1 - row.cells.length;
  if (excessColumns < 0) return null;

  const rowColumns = [gridPositions[0]];
  for (let i = excessColumns; i < gridPositions.length - 1; i += 1) {
    rowColumns.push(gridPositions[i]);
  }

  if (rowColumns.length !== row.cells.length + 1) return null;
  for (let i = 1; i < rowColumns.length; i += 1) {
    if (rowColumns[i] <= rowColumns[i - 1]) return null;
  }

  return rowColumns;
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
  for (let i = 1; i < columns.length; i += 1) {
    if (columns[i] <= columns[i - 1]) return null;
  }
  return columns;
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

function collectTDefTableEntries(wordDocument, tableStream, fib, pieces, dataStream = null) {
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
        if (papxOffset + 1 + byteLength > page.length) continue;
        dataOffset = papxOffset + 1;
      }

      const cpStart = fileOffsetToCharacterPosition(fcBoundaries[i], pieces);
      const cpEnd = fileOffsetToCharacterPosition(fcBoundaries[i + 1], pieces);
      if (cpStart == null || cpEnd == null) continue;

      const data = page.subarray(dataOffset, dataOffset + byteLength);
      const info = parseTableRowSprms(data, dataStream);
      if (!info) continue;

      entries.push({
        cpStart,
        cpEnd,
        columns: info.columns,
        cellFlags: info.cellFlags,
        cellBorders: info.cellBorders,
        cellBorderSideArrays: info.cellBorderSideArrays,
        cellBorderAssignments: info.cellBorderAssignments,
        tableWidth: info.tableWidth,
        tableWidthType: info.tableWidthType,
        rowHeight: info.rowHeight,
        rowHeightRule: info.rowHeightRule,
        cellMargins: info.cellMargins,
        tableBorders: info.tableBorders,
        vMergeAssignments: info.vMergeAssignments,
        vAlignAssignments: info.vAlignAssignments,
        cantSplit: info.cantSplit,
        repeatHeader: info.repeatHeader,
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

function parseTableRowSprms(data, dataStream = null) {
  data = expandHugePapxTableSprms(data, dataStream);
  let off = 2;
  if (data.length >= 2 && data[off] === 0) off += 1;

  let tableDef = null;
  let cellFlags = [];
  let tableWidth = null;
  let tableWidthType = null;
  let rowHeight = null;
  let rowHeightRule = null;
  let cellMargins = null;
  let tableBorders = null;
  let cellBorders = [];
  let cellBorderAssignments = [];
  let cellBorderSideArrays = {};
  const cellMarginCandidates = [];
  const vMergeAssignments = [];
  const vAlignAssignments = [];
  let cantSplit = null;
  let repeatHeader = null;

  while (off + 2 <= data.length) {
    if (data[off] === 0) { off += 1; continue; }
    const sprm = data.readUInt16LE(off);
    const spra = (sprm >> 13) & 0x7;
    let size = SPRM_OPERAND_SIZE_BY_SPRA[spra];

    if (sprm === 0xD608 || sprm === 0xD606) {
      if (off + 4 > data.length) {
        throw new Error(`Truncated table definition SPRM length word for 0x${sprm.toString(16)}`);
      }
      const cb = data.readUInt16LE(off + 2);
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
          const descriptorStart = 2 + (itc + 1) * 2;
          const availableDescriptorBytes = tblData.length - descriptorStart;
          const descriptorCount = Math.min(itc, Math.floor(availableDescriptorBytes / 20));
          if (descriptorCount > 0) {
            cellFlags = [];
            cellBorders = [];
            for (let i = 0; i < descriptorCount; i += 1) {
              const base = descriptorStart + i * 20;
              const bits = tblData.readUInt16LE(base);
              cellFlags.push({
                bFirstMerged: (bits & 0x0001) !== 0,
                bMerged: (bits & 0x0002) !== 0,
                bVertical: (bits & 0x0004) !== 0,
                bBackward: (bits & 0x0008) !== 0,
                bRotateFont: (bits & 0x0010) !== 0,
                bVertMerge: (bits & 0x0020) !== 0,
                bVertRestart: (bits & 0x0040) !== 0,
                nVertAlign: (bits & 0x0180) >> 7,
              });
              cellBorders.push(parseCellBordersFromDescriptor(tblData.subarray(base + 4, base + 20)));
            }
          }
        }
      }
    } else if (sprm === 0xF614) {
      if (off + 5 <= data.length) {
        const widthType = data[off + 2];
        const widthValue = data.readUInt16LE(off + 3);
        if (widthType === 3) {
          tableWidth = widthValue;
          tableWidthType = "dxa";
        } else if (widthType === 2) {
          tableWidth = widthValue;
          tableWidthType = "pct";
        } else if (widthType !== 1 && widthType !== 0) {
          throw new Error(`Unsupported table width type ${widthType} in sprmTTableWidth`);
        }
      }
    } else if (sprm === 0xD605) {
      const cb = data[off + 2];
      size = cb + 1;
      if (off + 3 + cb <= data.length) {
        tableBorders = parseTableBordersOperand(sprm, data.subarray(off + 3, off + 3 + cb));
      }
    } else if (sprm === 0xD613) {
      const cb = data[off + 2];
      size = cb + 1;
      if (off + 3 + cb <= data.length) {
        tableBorders = parseTableBordersOperand(sprm, data.subarray(off + 3, off + 3 + cb));
      }
    } else if (sprm === 0xD620 || sprm === 0xD62F) {
      const cb = data[off + 2];
      size = cb + 1;
      if (off + 3 + cb <= data.length) {
        const payload = data.subarray(off + 3, off + 3 + cb);
        const assignment = parseCellBorderAssignmentOperand(sprm, payload);
        if (assignment) cellBorderAssignments.push(assignment);
      }
    } else if ((sprm >= 0xD61A && sprm <= 0xD61D) || sprm === 0xD662 || (sprm >= 0xD680 && sprm <= 0xD686)) {
      const cb = data[off + 2];
      size = cb + 1;
      if (off + 3 + cb <= data.length && sprm >= 0xD61A && sprm <= 0xD61D) {
        const payload = data.subarray(off + 3, off + 3 + cb);
        const assignment = parseCellBorderSideArrayOperand(sprm, payload);
        if (assignment) cellBorderSideArrays[assignment.side] = assignment.borders;
      }
    } else if (sprm === 0xD632 || sprm === 0xD634) {
      const cb = data[off + 2];
      size = cb + 1;
      if (off + 3 + cb <= data.length) {
        const candidate = parseTableCellPadding(data.subarray(off + 3, off + 3 + cb), sprm === 0xD634);
        if (candidate) cellMarginCandidates.push(candidate);
      }
    } else if (sprm === 0x9407) {
      if (off + 4 <= data.length) {
        const height = data.readInt16LE(off + 2);
        rowHeight = Math.abs(height);
        rowHeightRule = height < 0 ? 1 : 0;
      }
    } else if (sprm === 0x3403 || sprm === 0x3466) {
      if (off + 3 <= data.length) {
        cantSplit = data[off + 2] !== 0;
      }
    } else if (sprm === 0x3404) {
      if (off + 3 <= data.length) {
        repeatHeader = data[off + 2] !== 0;
      }
    } else if (sprm === 0xD62B) {
      const cb = data[off + 2];
      size = cb + 1;
      if (off + 5 <= data.length) {
        const itc = data[off + 3];
        const state = data[off + 4] & 0x3;
        vMergeAssignments.push({ itc, state });
      }
    } else if (sprm === 0xD62C) {
      const cb = data[off + 2];
      size = cb + 1;
      if (off + 6 <= data.length) {
        const itcFirst = data[off + 3];
        const itcLim = data[off + 4];
        const valign = data[off + 5] & 0x3;
        vAlignAssignments.push({ itcFirst, itcLim, valign });
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
  cellMargins = chooseTableCellMargins(cellMarginCandidates, tableDef.length - 1);
  return {
    columns: tableDef,
    cellFlags,
    cellBorders,
    cellBorderSideArrays,
    cellBorderAssignments,
    tableWidth,
    tableWidthType,
    rowHeight,
    rowHeightRule,
    cellMargins,
    tableBorders: tableBorders ?? createDefaultTableBorders(),
    vMergeAssignments,
    vAlignAssignments,
    cantSplit,
    repeatHeader,
  };
}

function inferTableWidth(rows) {
  let tableWidth = null;
  let tableWidthType = null;
  for (const row of rows) {
    if (row.tableWidth == null) continue;
    if (tableWidth == null) {
      tableWidth = row.tableWidth;
      tableWidthType = row.tableWidthType ?? "dxa";
      continue;
    }
    if (tableWidth !== row.tableWidth || tableWidthType !== (row.tableWidthType ?? "dxa")) {
      throw new Error("Conflicting table width sprms were parsed for a single table");
    }
  }
  return { tableWidth, tableWidthType };
}

function parseTableCellPadding(data, isDefault) {
  if (!data || data.length < 6) return null;
  const startCell = data[0];
  const endCell = isDefault ? 1 : data[1];
  const sideBits = data[2];
  const sizeType = isDefault ? 0x3 : data[3];
  const value = data.readUInt16LE(4);
  if (isDefault && startCell !== 0) return null;
  if (!isDefault && (startCell >= endCell || sizeType !== 0x3)) return null;
  const margins = { top: 0, left: 0, bottom: 0, right: 0 };
  let used = false;
  if (sideBits & 0x01) { margins.top = value; used = true; }
  if (sideBits & 0x02) { margins.left = value; used = true; }
  if (sideBits & 0x04) { margins.bottom = value; used = true; }
  if (sideBits & 0x08) { margins.right = value; used = true; }
  return used ? { margins, startCell, endCell, isDefault, sideBits } : null;
}

function chooseTableCellMargins(candidates, cellCount) {
  if (!candidates || candidates.length === 0) return null;
  const selected = { top: null, left: null, bottom: null, right: null };
  for (const candidate of candidates) {
    const coversAllCells = candidate.isDefault || (candidate.startCell === 0 && candidate.endCell >= cellCount);
    if (!coversAllCells) continue;
    for (const side of ["top", "left", "bottom", "right"]) {
      const bit = side === "top" ? 0x01 : side === "left" ? 0x02 : side === "bottom" ? 0x04 : 0x08;
      if (!(candidate.sideBits & bit)) continue;
      if (selected[side] == null) {
        selected[side] = candidate.margins[side];
        continue;
      }
      if (selected[side] !== candidate.margins[side]) {
        throw new Error("Conflicting table cell padding sprms were parsed for a single table");
      }
    }
  }
  return {
    top: selected.top ?? 0,
    left: selected.left ?? 0,
    bottom: selected.bottom ?? 0,
    right: selected.right ?? 0,
  };
}

function inferTableCellMargins(rows) {
  let margins = null;
  for (const row of rows) {
    if (!row.cellMargins) continue;
    if (!margins) {
      margins = row.cellMargins;
      continue;
    }
    if (
      margins.top !== row.cellMargins.top ||
      margins.left !== row.cellMargins.left ||
      margins.bottom !== row.cellMargins.bottom ||
      margins.right !== row.cellMargins.right
    ) {
      throw new Error("Conflicting table cell margins were parsed for a single table");
    }
  }
  return margins;
}

function inferTableBorders(rows) {
  let borders = null;
  for (const row of rows) {
    if (!row.tableBorders) continue;
    if (!borders) {
      borders = row.tableBorders;
      continue;
    }
    if (JSON.stringify(borders) !== JSON.stringify(row.tableBorders)) {
      throw new Error("Conflicting table border sprms were parsed for a single table");
    }
  }
  return borders ?? createDefaultTableBorders();
}

function createDefaultTableBorders() {
  const borders = {};
  for (const side of TABLE_BORDER_SIDES) {
    borders[side] = createEmptyTableBorder();
  }
  return borders;
}

function parseCellBordersFromDescriptor(raw) {
  if (!raw || raw.length < 16) {
    return null;
  }

  const borders = {};
  const cellBorderSides = ["top", "left", "bottom", "right"];
  for (let i = 0; i < cellBorderSides.length; i += 1) {
    borders[cellBorderSides[i]] = parseWw8CellBorderEntry(raw.subarray(i * 4, (i + 1) * 4));
  }
  return borders;
}

function parseWw8CellBorderEntry(raw) {
  if (raw.length !== 4) {
    throw new Error(`Invalid WW8 cell border entry length ${raw.length}`);
  }
  if (raw[0] === 0xff && raw[1] === 0xff) {
    return createEmptyTableBorder();
  }
  return normalizeTableBorderRecord({
    sprm: 0xd608,
    brcType: raw[1],
    dptLineWidth: raw[0],
    colorIndex: raw[2],
    space: raw[3] & 0x1f,
  });
}

function createEmptyTableBorder() {
  return {
    style: "none",
    width: 0,
    color: null,
    space: 0,
  };
}

function parseTableBordersOperand(sprm, payload) {
  if (!payload || payload.length === 0) {
    throw new Error(`Truncated table border SPRM 0x${sprm.toString(16)}`);
  }

  const entrySize = payload.length / TABLE_BORDER_SIDES.length;
  if (!Number.isInteger(entrySize)) {
    throw new Error(`Unsupported table border SPRM length ${payload.length} for 0x${sprm.toString(16)}`);
  }

  if (entrySize !== 2 && entrySize !== 4 && entrySize !== 8) {
    throw new Error(`Unsupported table border entry size ${entrySize} in SPRM 0x${sprm.toString(16)}`);
  }

  const borders = {};
  for (let i = 0; i < TABLE_BORDER_SIDES.length; i += 1) {
    borders[TABLE_BORDER_SIDES[i]] = parseTableBorderEntry(
      payload.subarray(i * entrySize, (i + 1) * entrySize),
      entrySize,
      sprm,
    );
  }
  return borders;
}

function parseCellBorderAssignmentOperand(sprm, payload) {
  if (!payload || payload.length < 3) {
    throw new Error(`Truncated table cell border assignment SPRM 0x${sprm.toString(16)}`);
  }

  const itcFirst = payload[0];
  const itcLim = payload[1];
  const nFlag = payload[2];
  if (itcLim <= itcFirst) {
    return null;
  }

  const borderRaw = payload.subarray(3);
  const border = parseBorderRecord(borderRaw, sprm);
  return {
    itcFirst,
    itcLim,
    changeTop: (nFlag & 0x01) !== 0,
    changeLeft: (nFlag & 0x02) !== 0,
    changeBottom: (nFlag & 0x04) !== 0,
    changeRight: (nFlag & 0x08) !== 0,
    border,
  };
}

function parseBorderRecord(raw, sprm) {
  if (!raw || raw.length === 0) {
    throw new Error(`Invalid border record length 0 in SPRM 0x${sprm.toString(16)}`);
  }
  if (raw.length === 4 && raw[0] === 0xff && raw[1] === 0xff) {
    return createEmptyTableBorder();
  }
  if (raw.length === 8 && raw.every((byte) => byte === 0xff)) {
    return createEmptyTableBorder();
  }
  if (raw.length === 2 && raw[0] === 0xff && raw[1] === 0xff) {
    return createEmptyTableBorder();
  }
  if (raw.length !== 2 && raw.length !== 4 && raw.length !== 8) {
    throw new Error(`Unsupported border record length ${raw.length} in SPRM 0x${sprm.toString(16)}`);
  }
  return parseTableBorderEntry(raw, raw.length, sprm);
}

function parseTableBorderEntry(raw, entrySize, sprm) {
  if (entrySize === 2) {
    const bits = raw.readUInt16LE(0);
    let dptLineWidth = bits & 0x07;
    let brcType = (bits & 0x18) >> 3;
    const colorIndex = ((bits & 0xc0) >> 6) | ((raw[1] & 0x07) << 2);
    const space = raw[1] >> 3;
    if (dptLineWidth > 5) {
      brcType = dptLineWidth;
      dptLineWidth = 1;
    }
    dptLineWidth *= 6;
    return normalizeTableBorderRecord({
      sprm,
      brcType,
      dptLineWidth,
      colorIndex,
      space,
    });
  }

  if (entrySize === 4) {
    return normalizeTableBorderRecord({
      sprm,
      brcType: raw[1],
      dptLineWidth: raw[0],
      colorIndex: raw[2],
      space: raw[3] & 0x1f,
    });
  }

  if (entrySize === 8) {
    return normalizeTableBorderRecord({
      sprm,
      brcType: raw[5],
      dptLineWidth: raw[4],
      color: raw.readUInt32LE(0),
      space: raw[6] & 0x1f,
    });
  }

  throw new Error(`Unsupported table border entry size ${entrySize} in SPRM 0x${sprm.toString(16)}`);
}

function normalizeTableBorderRecord({ sprm, brcType, dptLineWidth, colorIndex = null, color = null, space = 0 }) {
  return {
    style: tableBorderStyleFromBrcType(brcType, sprm),
    width: dptLineWidth,
    color: color != null ? colorToHexFromBgr(color) : colorIndexToHex(colorIndex),
    space,
  };
}

function tableBorderStyleFromBrcType(brcType, sprm) {
  switch (brcType) {
    case 0:
      return "none";
    case 1:
    case 2:
      return "single";
    case 3:
      return "double";
    case 4:
      return "dotted";
    case 6:
      return "thick";
    case 7:
      return "dash";
    case 9:
      return "dotDash";
    case 10:
      return "dotDotDash";
    case 11:
      return "wave";
    case 20:
      return "dottedHeavy";
    case 23:
      return "dashedHeavy";
    case 25:
      return "dashDotHeavy";
    case 26:
      return "dashDotDotHeavy";
    case 27:
      return "wavyHeavy";
    case 39:
    case 55:
      return "dashLongHeavy";
    case 43:
      return "wavyDouble";
    default:
      throw new Error(`Unsupported table border type ${brcType} in SPRM 0x${sprm.toString(16)}`);
  }
}

function colorIndexToHex(colorIndex) {
  if (colorIndex == null || colorIndex === 0) {
    return null;
  }
  if (colorIndex === 1) {
    return "000000";
  }
  throw new Error(`Unsupported table border color index ${colorIndex}`);
}

function colorToHexFromBgr(color) {
  if (color === 0xff000000) {
    return null;
  }
  const blue = color & 0xff;
  const green = (color >> 8) & 0xff;
  const red = (color >> 16) & 0xff;
  return `${red.toString(16).padStart(2, "0")}${green.toString(16).padStart(2, "0")}${blue.toString(16).padStart(2, "0")}`.toUpperCase();
}

function expandHugePapxTableSprms(data, dataStream, depth = 0) {
  if (depth > 8) {
    throw new Error("Huge PAPX sprm expansion exceeded maximum recursion depth");
  }

  if (data.length <= 2) {
    return Buffer.from(data);
  }

  const expanded = [...data.subarray(0, 2)];
  let off = 2;
  if (data[off] === 0) {
    expanded.push(0);
    off += 1;
  }
  while (off + 2 <= data.length) {
    if (data[off] === 0) {
      expanded.push(0);
      off += 1;
      continue;
    }

    const sprm = data.readUInt16LE(off);
    if ((sprm === 0x6646 || sprm === 0x646B) && off + 6 <= data.length) {
      if (!dataStream) {
        throw new Error(`Encountered huge table sprm 0x${sprm.toString(16)} without Data stream`);
      }
      const dataOffset = data.readUInt32LE(off + 2);
      const nested = readDataStreamGrpprl(dataStream, dataOffset);
      const nestedExpanded = expandHugePapxTableSprms(nested, dataStream, depth + 1);
      expanded.push(...nestedExpanded);
      off += 6;
      continue;
    }

    let size = SPRM_OPERAND_SIZE_BY_SPRA[(sprm >> 13) & 0x7];
    if (sprm === 0xD608 || sprm === 0xD606) {
      if (off + 4 > data.length) {
        throw new Error(`Truncated table definition SPRM length word for 0x${sprm.toString(16)}`);
      }
      const cb = data.readUInt16LE(off + 2);
      size = cb + 1;
    } else if (sprm === 0xD605) {
      if (off + 3 > data.length) break;
      const cb = data[off + 2];
      size = cb + 1;
    } else if (size === -1) {
      if (off + 3 > data.length) break;
      size = data[off + 2] + 1;
    }

    if (!size || size < 0 || off + 2 + size > data.length) {
      throw new Error(`Truncated table sprm data at offset ${off}`);
    }

    expanded.push(...data.subarray(off, off + 2 + size));
    off += 2 + size;
  }

  return Buffer.from(expanded);
}

function readDataStreamGrpprl(dataStream, offset) {
  if (!dataStream) {
    throw new Error("Missing Data stream for huge PAPX table sprm expansion");
  }
  if (offset + 2 > dataStream.length) {
    throw new Error(`Huge PAPX data offset ${offset} is outside the Data stream`);
  }

  const length = dataStream.readUInt16LE(offset);
  const start = offset + 2;
  const end = start + length;
  if (end > dataStream.length) {
    throw new Error(`Huge PAPX data at offset ${offset} exceeds the Data stream`);
  }

  return dataStream.subarray(start, end);
}
