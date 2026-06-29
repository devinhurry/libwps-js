const SPRM_SIZES = {
  0x2400: 4, 0x2401: 4, 0x2402: 2, 0x2403: 1, 0x2404: 1,
  0x2405: 1, 0x2406: 1, 0x2407: 1, 0x2408: 1, 0x2409: 1,
  0x240A: 4, 0x240B: 1, 0x240C: 4, 0x240D: 4, 0x240E: 4,
  0x2410: 1, 0x2411: 1, 0x2413: 1, 0x2414: 1, 0x2415: 1,
  0x240C: 1,
  0x2416: 1, 0x2417: 4, 0x2418: 4, 0x2419: 1, 0x241A: 1,
  0x241B: 1, 0x241C: 1, 0x241D: 1, 0x241E: 1, 0x241F: 1,
  0x2420: 1, 0x2421: 1, 0x2422: 1, 0x2423: 1, 0x2424: 1,
  0x2431: 1, 0x2433: 1, 0x2434: 1, 0x2435: 1, 0x2436: 1,
  0x2437: 1, 0x2438: 1, 0x2439: 2, 0x243A: 2, 0x243B: 2,
  0x243C: 1, 0x243D: 1, 0x243E: 1, 0x243F: 1,
  0x2441: 1, 0x2447: 1, 0x4439: 2,
  0x2425: 1, 0x2426: 1, 0x2427: 1, 0x2428: 1, 0x2429: 1,
  0x242A: 1, 0x242B: 1, 0x242C: 1, 0x242D: 1, 0x242E: 1,
  0x242F: 1, 0x2430: 1, 0x2432: 1,
  0x2440: 1, 0x2441: 1, 0x2443: 1, 0x2444: 1, 0x2445: 4,
  0x2446: 4, 0x2447: 1, 0x2448: 1, 0x2449: 4, 0x244A: 4,
  0x244B: 4, 0x244C: 4, 0x244D: 4, 0x244E: 4, 0x244F: 4,
  0x2450: 4, 0x2451: 4, 0x2452: 4, 0x2453: 4, 0x2454: 4,
  0x245B: 1, 0x245C: 1, 0x246D: 1,
  0x260A: 1, 0x460B: 2,
  0x261B: 1, 0x2423: 1, 0x2430: 1,
  0x8418: 2, 0x8419: 2, 0x841A: 2, 0x442B: 2,
  0x2640: 1,
  0x2461: 1, 0x2462: 1, 0x2463: 1, 0x2464: 1, 0x2465: 4,
  0x6412: 4,
  0x6424: 4, 0x6425: 4, 0x6426: 4, 0x6427: 4, 0x6428: 4, 0x6629: 4,
  0x6A0C: 4, 0x6A0D: 4, 0x6A0E: 4, 0x6A0F: 4,
  0x4455: 2, 0x4456: 2, 0x4457: 2, 0x4458: 2, 0x4459: 2,
  0x840E: 2, 0x840F: 2, 0x8411: 2, 0x8458: 2, 0x845D: 2,
  0x845E: 2, 0x8460: 2,
  0xA413: 2, 0xA414: 2,
  0x3465: 1, 0x360D: 1, 0x940E: 2, 0x940F: 2, 0x9410: 2,
  0x9411: 2, 0x941E: 2, 0x941F: 2,
  0x2A02: 1, 0x2A03: 1, 0x2A04: 1, 0x2A05: 1, 0x2A06: 1,
  0x2A07: 1, 0x2A08: 1, 0x2A09: 1, 0x2A0A: 1, 0x2A0B: 1,
  0x2A0C: 1, 0x2A0D: 1, 0x2A0E: 1, 0x2A0F: 1, 0x2A10: 1,
  0x2A11: 1, 0x2A12: 1, 0x2A13: 1, 0x2A14: 1, 0x2A15: 1,
  0x2A16: 1, 0x2A17: 1, 0x2A18: 1, 0x2A19: 1, 0x2A1A: 1,
  0x2A1B: 1, 0x2A1C: 1, 0x2A1D: 1, 0x2A1E: 1, 0x2A1F: 1,
  0x2A20: 1, 0x2A21: 1, 0x2A22: 1, 0x2A23: 1, 0x2A24: 1,
  0x2A25: 1, 0x2A26: 1, 0x2A27: 1, 0x2A28: 1, 0x2A29: 1,
  0x2A2A: 1, 0x2A2B: 1, 0x2A2C: 1, 0x2A2D: 1, 0x2A2E: 1,
  0x2A2F: 1, 0x2A30: 1, 0x2A31: 1, 0x2A32: 1, 0x2A33: 1,
  0x2A34: 1, 0x2A35: 1, 0x2A36: 1, 0x2A37: 1, 0x2A38: 1,
  0x2A39: 1, 0x2A3A: 1, 0x2A3B: 1, 0x2A3C: 1, 0x2A3D: 1,
  0x2A3E: 1, 0x2A3F: 1, 0x2A40: 1, 0x2A41: 1, 0x2A42: 1,
  0x2A43: 1, 0x2A44: 1, 0x2A45: 1, 0x2A46: 1, 0x2A47: 1,
  0x2A48: 1, 0x2A49: 1, 0x2A4A: 1, 0x2A4B: 1, 0x2A4C: 1,
  0x2A4D: 1, 0x2A4E: 1, 0x2A4F: 1, 0x2A50: 1, 0x2A51: 1,
  0x2A52: 1, 0x2A53: 1, 0x2A54: 1, 0x2A55: 1, 0x2A56: 1,
  0x286F: 1,
  0x4A30: 2, 0x4A31: 2, 0x4A32: 2, 0x4A33: 2, 0x4A34: 2,
  0x4A35: 2, 0x4A36: 2, 0x4A37: 2, 0x4A38: 2, 0x4A39: 2,
  0x4A3A: 2, 0x4A3B: 2, 0x4A3C: 2, 0x4A3D: 2, 0x4A3E: 2,
  0x4A3F: 2, 0x4A40: 2, 0x4A41: 2, 0x4A42: 2, 0x4A43: 2,
  0x4A44: 2, 0x4A45: 2, 0x4A46: 2, 0x4A47: 2, 0x4A48: 2,
  0x4A49: 2, 0x4A4A: 2, 0x4A4B: 2, 0x4A4C: 2, 0x4A4D: 2,
  0x4A4E: 2, 0x4A4F: 2, 0x4A50: 2, 0x4A51: 2, 0x4A52: 2,
  0x4A53: 2, 0x4A54: 2, 0x4A55: 2, 0x4A56: 2, 0x4A57: 2,
  0x4A58: 2, 0x4A59: 2, 0x4A5A: 2, 0x4A5B: 2, 0x4A5C: 2,
  0x4A5D: 2, 0x4A5E: 2, 0x4A5F: 2,
  0x6A09: 4,
  0x6A40: 4, 0x6A41: 4, 0x6A42: 4, 0x6A43: 4, 0x6A44: 4,
  0x6A45: 4, 0x6A46: 4, 0x6A47: 4, 0x6A48: 4, 0x6A49: 4,
  0x4852: 2, 0x4853: 2, 0x4854: 2, 0x4855: 2, 0x4856: 2,
  0x484B: 2, 0x4857: 2, 0x4858: 2, 0x4859: 2, 0x485A: 2, 0x485B: 2,
  0x8840: 2, 0x8841: 2, 0x8842: 2, 0x8843: 2, 0x8844: 2,
  0x8845: 2, 0x8846: 2, 0x8847: 2, 0x8848: 2, 0x8849: 2,
  0xC60D: -1,
};

const SPRM_CATEGORIES = {
  0x2403: "jc",
  0x6412: "lineSpacing",
  0x840E: "rightIndent",
  0x840F: "leftIndent",
  0x8411: "firstLineIndent",
  0x4455: "rightIndentChars",
  0x4456: "leftIndentChars",
  0x4457: "firstLineIndentChars",
  0x4458: "spacingBeforeLines",
  0x4459: "spacingAfterLines",
  0x8458: "firstLineIndent",
  0x845D: "rightIndent",
  0x845E: "leftIndent",
  0x8460: "firstLineIndent",
  0x2400: "spacingBefore",
  0x2401: "spacingAfter",
  0x4A43: "fontSize",
  0x4845: "textPosition",
  0x4A30: "fontId",
  0x4A4F: "fontAscii",
  0x4A50: "fontEastAsia",
  0x4A51: "fontHAnsi",
  0x4A61: "fontSizeCs",
  0x4A5E: "fontCs",
  0x6A09: "symbol",
  0x484B: "kern",
  0x485F: "langIdBidi",
  0x8840: "charSpacing",
  0x4852: "charWidth",
  0x2A02: "bold",
  0x2A03: "italic",
  0x2A0E: "underline",
  0x2A3E: "underline",
  0x286F: "fontHint",
  0x486D: "langId",
  0x486E: "langIdEastAsia",
  0x4873: "langId",
  0x4874: "langIdEastAsia",
  0xC60D: "tabs",
  0x3465: "tableNoAllowOverlap",
  0x360D: "tablePositionCode",
  0x940E: "tablePositionX",
  0x940F: "tablePositionY",
  0x9410: "tablePositionLeftMargin",
  0x9411: "tablePositionTopMargin",
  0x941E: "tablePositionRightMargin",
  0x941F: "tablePositionBottomMargin",
  0x6A0C: "fontIdWps",
  // LibreOffice WW8 maps these paragraph flags as:
  // PFKeep -> keepLines, PFKeepFollow -> keepNext, PFPageBreakBefore -> pageBreakBefore.
  0x2405: "keepLines",
  0x2406: "keepNext",
  0x2407: "pageBreakBefore",
  0x2441: "bidi",
  0x2447: "snapToGrid",
  0x4439: "textAlignment",
  0x2431: "widowControl",
  0x2433: "kinsoku",
  0x2434: "wordWrap",
  0x2435: "overflowPunct",
  0x2436: "topLinePunct",
  0x2437: "autoSpaceDE",
  0x2438: "autoSpaceDN",
  0x2448: "adjustRightInd",
  0x245B: "spacingBeforeAuto",
  0x245C: "spacingAfterAuto",
  0x260A: "listLevel",
  0x460B: "listId",
};

const ALIGNMENT_MAP = { 0: "left", 1: "right", 2: "center", 3: "both", 4: "distribute", 5: "numTab" };
const WORD_ALIGNMENT_MAP = { 0: "left", 1: "center", 2: "right", 3: "both", 4: "distribute", 5: "numTab" };

const SPRM_OPERAND_SIZE_BY_SPRA = [1, 1, 2, 4, 2, 2, -1, 3];
// MS-DOC-SPEC/19 ICO: 0=auto, 1=black, 2=blue, 3=cyan, 4=green,
// 5=magenta, 6=red. Use RGB hex for OOXML w:color.
const WW8_TEXT_COLOR_INDEXES = [
  "auto",
  "000000",
  "0000FF",
  "00FFFF",
  "00FF00",
  "FF00FF",
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

const WW8_SHADING_STRENGTHS = [
  0,
  1000,
  50,
  100,
  200,
  250,
  300,
  400,
  500,
  600,
  700,
  750,
  800,
  900,
  333,
  333,
  333,
  333,
  333,
  333,
  333,
  333,
  333,
  333,
  333,
  333,
  500,
  500,
  500,
  500,
  500,
  500,
  500,
  500,
  500,
  25,
  75,
  125,
  150,
  175,
  225,
  275,
  325,
  350,
  375,
  425,
  450,
  475,
  525,
  550,
  575,
  625,
  650,
  675,
  725,
  775,
  825,
  850,
  875,
  925,
  950,
  975,
];

export function parseSprms(grpprl, skipIstd = false, cupx = 0) {
  const props = {};
  let off = skipIstd ? 2 : 0;
  if (skipIstd && grpprl.length >= 2) {
    props.istd = grpprl.readUInt16LE(0);
  }
  // Skip Upx section (user-defined properties) in style GRPPRLs.
  // cupx values per MS-DOC StdfBase: 1=char, 2=para, 3=table
  off += cupx;
  if (skipIstd && off < grpprl.length && grpprl[off] === 0) {
    off += 1;
  }
  while (off + 2 <= grpprl.length) {
    if (grpprl[off] === 0) {
      off += 1;
      continue;
    }
    const sprm = grpprl.readUInt16LE(off);
    off += 2;
    let size = SPRM_SIZES[sprm];
    if (size === undefined) {
      const spra = (sprm >> 13) & 0x7;
      size = SPRM_OPERAND_SIZE_BY_SPRA[spra];
    }
    if (size === -1) {
      if (off >= grpprl.length) break;
      size = grpprl[off] + 1;
    }
    if (!size || size < 0) {
      throw new Error(`Unsupported SPRM operand size for 0x${sprm.toString(16)}`);
    }
    if (off + size > grpprl.length) {
      if (sprm === 0xC60D) {
        size = grpprl.length - off;
      } else if (SPRM_CATEGORIES[sprm]) {
        throw new Error(`Truncated SPRM operand for 0x${sprm.toString(16)}`);
      } else {
        break;
      }
    }
    const val = grpprl.subarray(off, off + size);
    applySprm(props, sprm, val, size);
    off += size;
  }
  return props;
}

function applySprm(props, sprm, val, size) {
  switch (sprm) {
    case 0x6412: {
      // Byte 2 of the 4-byte operand encodes the rule: 0=atLeast, 1=auto, 2+=exact.
      // When byte 2 is absent (old 2-byte format), use signed twips convention.
      const ruleByte = val.length >= 3 ? val[2] : null;
      let rule, twips;
      if (ruleByte === 1) {
        twips = val.readUInt16LE(0);
        rule = "auto";
      } else if (ruleByte != null && ruleByte >= 2) {
        twips = val.readUInt16LE(0);
        rule = "exact";
      } else {
        const raw = val.readUInt16LE(0);
        const signed = raw > 0x7fff ? raw - 0x10000 : raw;
        twips = Math.abs(signed);
        rule = signed < 0 ? "exact" : "atLeast";
      }
      props.lineSpacing = { twips, rule };
      break;
    }
    case 0x2403:
      props.alignment = WORD_ALIGNMENT_MAP[val[0]] || ALIGNMENT_MAP[val[0]] || "left";
      break;
    case 0xA413:
      props.spacingBefore = val.readInt16LE(0);
      break;
    case 0xA414:
      props.spacingAfter = val.readInt16LE(0);
      break;
    case 0x840E:
    case 0x845D:
      props.rightIndent = val.readInt16LE(0);
      break;
    case 0x840F:
    case 0x845E:
      props.leftIndent = val.readInt16LE(0);
      break;
    case 0x4455:
      props.rightIndentChars = val.readInt16LE(0);
      break;
    case 0x4456:
      props.leftIndentChars = val.readInt16LE(0);
      break;
    case 0x4457:
      props.firstLineIndentChars = val.readInt16LE(0);
      break;
    case 0x4458:
      // MS-DOC-SPEC/16 sprmPDylBefore is already in 1/100 line units.
      props.spacingBeforeLines = val.readInt16LE(0);
      break;
    case 0x4459:
      // MS-DOC-SPEC/16 sprmPDylAfter is already in 1/100 line units.
      props.spacingAfterLines = val.readInt16LE(0);
      break;
    case 0x8411:
    case 0x8458:
    case 0x8460:
      props.firstLineIndent = val.readInt16LE(0);
      break;
    case 0x2400:
      props.spacingBefore = val.readInt32LE(0);
      break;
    case 0x2401:
      props.spacingAfter = val.readInt32LE(0);
      break;
    case 0x4A43:
      props.fontSize = val.readUInt16LE(0);
      break;
    case 0x4845:
      // MS-DOC-SPEC/16 sprmCHpsPos: signed half-point vertical text position.
      props.textPosition = val.readInt16LE(0);
      break;
    case 0x4A61:
      props.fontSizeCs = val.readUInt16LE(0);
      break;
    case 0x4A30:
    case 0x6A0C:
      props.fontId = val.readUInt16LE(0);
      break;
    case 0x4A4F:
      props.fontAscii = val.readUInt16LE(0);
      break;
    case 0x4A50:
      props.fontEastAsia = val.readUInt16LE(0);
      break;
    case 0x4A51:
      props.fontHAnsi = val.readUInt16LE(0);
      break;
    case 0x4A5E:
      props.fontCs = val.readUInt16LE(0);
      break;
    case 0x6A09:
      props.symbolFontId = val.readUInt16LE(0);
      props.symbolChar = val.readUInt16LE(2);
      break;
    case 0x8840:
      props.charSpacing = val.readInt16LE(0);
      break;
    case 0x4852:
      props.charWidth = val.readUInt16LE(0);
      break;
    case 0x484B:
      props.kern = val.readUInt16LE(0);
      break;
    case 0x485F:
      props.langIdBidi = val.readUInt16LE(0);
      break;
    case 0x0835:
    case 0x085C:
    case 0x2A02:
      props.bold = val[0] !== 0;
      break;
    case 0x0836:
    case 0x085D:
    case 0x2A03:
      props.italic = val[0] !== 0;
      break;
    case 0x2A0E:
    case 0x2A3E:
      props.underlineStyle = underlineStyleFromCode(val[0]);
      props.underline = props.underlineStyle != null;
      break;
    case 0x2A42:
    case 0x4A60:
      props.textColor = ww8TextColorHex(val[0]);
      break;
    case 0x2A0C:
      props.highlight = ww8HighlightName(val[0]);
      break;
    case 0x4866:
    case 0xCA71:
      props.background = parseWw8Shade(val);
      break;
    case 0x286F:
      props.fontHint = val[0] === 1 ? "eastAsia" : "default";
      break;
    case 0x486D:
    case 0x4873:
      props.langId = val.readUInt16LE(0);
      break;
    case 0x486E:
    case 0x4874:
      props.langIdEastAsia = val.readUInt16LE(0);
      break;
    case 0xC60D:
      props.tabs = parseTabsOperand(val);
      break;
    case 0x3465:
      props.tableNoAllowOverlap = val[0] !== 0;
      break;
    case 0x360D:
      props.tablePosition ??= {};
      props.tablePosition.nTPc = val[0];
      break;
    case 0x940E:
      props.tablePosition ??= {};
      props.tablePosition.nTDxaAbs = val.readInt16LE(0);
      break;
    case 0x940F:
      props.tablePosition ??= {};
      props.tablePosition.nTDyaAbs = val.readInt16LE(0);
      break;
    case 0x9410:
      props.tablePosition ??= {};
      props.tablePosition.nLeftMargin = val.readUInt16LE(0);
      break;
    case 0x9411:
      props.tablePosition ??= {};
      props.tablePosition.nUpperMargin = val.readUInt16LE(0);
      break;
    case 0x941E:
      props.tablePosition ??= {};
      props.tablePosition.nRightMargin = val.readUInt16LE(0);
      break;
    case 0x941F:
      props.tablePosition ??= {};
      props.tablePosition.nLowerMargin = val.readUInt16LE(0);
      break;
    case 0x2416:
      props.inTable = val[0] !== 0;
      break;
    case 0x240C:
      // LibreOffice WW8 maps pap.fNoLnn to RES_LINENUMBER and writes
      // <w:suppressLineNumbers w:val="0"/> when the paragraph count flag is set.
      props.lineNumberCount = val[0] === 0;
      break;
    case 0x2405:
      props.keepLines = val[0] !== 0;
      break;
    case 0x2406:
      props.keepNext = val[0] !== 0;
      break;
    case 0x2407:
      props.pageBreakBefore = val[0] !== 0;
      break;
    case 0x2431:
      props.widowControl = val[0] !== 0;
      break;
    case 0x2433:
      props.kinsoku = val[0] !== 0;
      break;
    case 0x2434:
      props.wordWrap = val[0] !== 0;
      break;
    case 0x2435:
      props.overflowPunct = val[0] !== 0;
      break;
    case 0x2436:
      props.topLinePunct = val[0] !== 0;
      break;
    case 0x2437:
      props.autoSpaceDE = val[0] !== 0;
      break;
    case 0x2438:
      props.autoSpaceDN = val[0] !== 0;
      break;
    case 0x245B:
      props.spacingBeforeAuto = val[0] !== 0;
      break;
    case 0x245C:
      props.spacingAfterAuto = val[0] !== 0;
      break;
    case 0x246D:
      // sprmPFContextualSpacing (MS-DOC-SPEC/16): Bool8 — ignore space between same-style paragraphs
      props.contextualSpacing = val[0] !== 0;
      break;
    case 0x260A:
      props.listLevel = val[0];
      break;
    case 0x2640:
      // sprmPOutLvl: WW8 values 0-9 → OOXML outlineLvl 0-9 (0=Level1, …, 8=Level9, 9=BodyText).
      // OOXML §17.3.1.20 outlineLvl explicitly allows 9; WPS exports it.
      props.outlineLevel = val[0] <= 9 ? val[0] : null;
      break;
    // Frame properties per MS-DOC-SPEC §2.6.2
    case 0x2423: // sprmPWr: text wrap around frame
      props.frameWrap = FRAME_WRAP_NAMES[val[0]] ?? null;
      break;
    case 0x2430: // sprmPFLocked: anchor lock
      props.frameLocked = val[0] !== 0;
      break;
    case 0x8418: { // sprmPDxaAbs: horizontal position (XAS_plusOne)
      const x = val.readInt16LE(0);
      if (x === 0) props.frameXAlign = "left";
      else if (x === -4) props.frameXAlign = "center";
      else if (x === -8) props.frameXAlign = "right";
      else if (x === -12) props.frameXAlign = "inside";
      else if (x === -16) props.frameXAlign = "outside";
      else props.frameX = x;
      break;
    }
    case 0x8419: { // sprmPDyaAbs: vertical position (YAS_plusOne)
      const y = val.readInt16LE(0);
      if (y === 0) props.frameYAlign = "inline";
      else if (y === -4) props.frameYAlign = "top";
      else if (y === -8) props.frameYAlign = "center";
      else if (y === -12) props.frameYAlign = "bottom";
      else if (y === -16) props.frameYAlign = "inside";
      else if (y === -20) props.frameYAlign = "outside";
      else props.frameY = y;
      break;
    }
    case 0x841A: // sprmPDxaWidth: frame width in twips
      props.frameWidth = val.readUInt16LE(0);
      break;
    case 0x442B: { // sprmPWHeightAbs: frame height; bit 15 = fMinHeight (atLeast vs exact)
      const raw = val.readUInt16LE(0);
      props.frameHeight = raw & 0x7FFF;
      props.frameHRule = (raw & 0x8000) ? "atLeast" : "exact";
      break;
    }
    case 0x261B: { // sprmPPc: frame anchor (PositionCodeOperand)
      const pc = val[0];
      const pcVert = (pc >> 4) & 3;
      const pcHorz = (pc >> 6) & 3;
      props.frameVAnchor = FRAME_V_ANCHOR[pcVert] ?? "page";
      props.frameHAnchor = FRAME_H_ANCHOR[pcHorz] ?? "page";
      break;
    }
    case 0x460B:
      props.listId = val.readInt16LE(0);
      break;
    case 0x2448:
      props.adjustRightInd = val[0] !== 0;
      break;
    case 0x2441:
      props.bidi = val[0] !== 0;
      break;
    case 0x2447:
      props.snapToGrid = val[0] !== 0;
      break;
    case 0x4439: {
      const alignMap = {
        0: "top",
        1: "center",
        2: "baseline",
        3: "bottom",
        4: "auto",
      };
      props.textAlignment = alignMap[val.readUInt16LE(0)] ?? "auto";
      break;
    }
    // Paragraph borders (Brc80 format: 4 bytes — dptLineWidth, brcType, ico, dptSpace|flags)
    case 0x6424: // sprmPBrcTop80
      props.paragraphBorders ??= {};
      props.paragraphBorders.top = parseBrc80(val);
      break;
    case 0x6425: // sprmPBrcLeft80
      props.paragraphBorders ??= {};
      props.paragraphBorders.left = parseBrc80(val);
      break;
    case 0x6426: // sprmPBrcBottom80
      props.paragraphBorders ??= {};
      props.paragraphBorders.bottom = parseBrc80(val);
      break;
    case 0x6427: // sprmPBrcRight80
      props.paragraphBorders ??= {};
      props.paragraphBorders.right = parseBrc80(val);
      break;
    case 0x6428: // sprmPBrcBetween80
      props.paragraphBorders ??= {};
      props.paragraphBorders.between = parseBrc80(val);
      break;
    case 0x6629: // sprmPBrcBar80
      props.paragraphBorders ??= {};
      props.paragraphBorders.bar = parseBrc80(val);
      break;
    default:
      break;
  }
}

// Brc80 structure (4 bytes): dptLineWidth(1), brcType(1), ico(1), dptSpace+flags(1)
// per MS-DOC-SPEC 19-structures-basic-types.md §Brc80
// Frame wrap styles per MS-DOC-SPEC sprmPWr
const FRAME_WRAP_NAMES = {
  0: "auto",
  1: "notBeside",
  2: "around",
  3: "none",
  4: "tight",
  5: "through",
};

// Frame vertical anchor per MS-DOC-SPEC sprmPPc pcVert
const FRAME_V_ANCHOR = ["margin", "page", "text", "margin"];

// Frame horizontal anchor per MS-DOC-SPEC sprmPPc pcHorz
const FRAME_H_ANCHOR = ["text", "margin", "page", "margin"];

function parseBrc80(val) {
  if (val.length < 4) return null;
  const dptLineWidth = val[0];
  const brcType = val[1];
  const ico = val[2];
  const dptSpace = val[3] & 0x1F;
  if (brcType === 0) return null; // no border
  return {
    val: BRC_TYPE_NAMES[brcType] ?? "single",
    color: brcColorFromIco(ico),
    sz: String(dptLineWidth),
    space: String(dptSpace),
  };
}

// BrcType values per MS-DOC-SPEC
export const BRC_TYPE_NAMES = {
  0x00: "none",
  0x01: "single",
  0x02: "thick",
  0x03: "double",
  0x05: "thinThickSmallGap",
  0x06: "dotted",
  0x07: "dashed",
  0x08: "dotDash",
  0x09: "dotDotDash",
  0x0A: "triple",
  0x0B: "thinThickThinSmallGap",
  0x0C: "thinThickMediumGap",
  0x0D: "thickThinMediumGap",
  0x0E: "thinThickLargeGap",
  0x0F: "thickThinLargeGap",
  0x16: "wave",
  0x17: "doubleWave",
  0x2A: "inset",
  0x2B: "outset",
};

// ico color palette index per MS-DOC-SPEC §ICO (0x00=auto)
export function brcColorFromIco(ico) {
  if (ico === 0) return "auto";
  const colors = [
    null, "000000", "0000FF", "00FFFF", "00FF00", "FF00FF",
    "FF0000", "FFFF00", "FFFFFF", "000080", "008080",
    "008000", "800080", "800000", "808000", "808080", "C0C0C0",
  ];
  return colors[ico] ?? "auto";
}

function ww8TextColorHex(index) {
  if (index == null) return null;
  if (index >= 0 && index < WW8_TEXT_COLOR_INDEXES.length) {
    return WW8_TEXT_COLOR_INDEXES[index];
  }
  throw new Error(`Unsupported WW8 text color index ${index}`);
}

function ww8ShadeColorHex(index, autoHex) {
  if (index == null) return null;
  if (index === 0) return autoHex;
  if (index >= 0 && index < WW8_TEXT_COLOR_INDEXES.length) {
    return WW8_TEXT_COLOR_INDEXES[index];
  }
  throw new Error(`Unsupported WW8 shading color index ${index}`);
}

function parseWw8Shade(val) {
  if (val.length < 2) {
    return null;
  }

  const raw = val.readUInt16LE(0);
  const foreIndex = raw & 0x1f;
  const backIndex = (raw >> 5) & 0x1f;
  const styleIndex = (raw >> 10) & 0x3f;
  const foreHex = ww8ShadeColorHex(foreIndex, "000000");
  const backHex = ww8ShadeColorHex(backIndex, "FFFFFF");
  const strength = WW8_SHADING_STRENGTHS[styleIndex] ?? 0;

  if (styleIndex === 0) {
    return {
      val: "clear",
      color: "auto",
      fill: backHex,
    };
  }

  if (strength === 0) {
    return {
      val: "clear",
      color: "auto",
      fill: backHex,
    };
  }

  if (strength === 1000) {
    return {
      val: "clear",
      color: "auto",
      fill: foreHex,
    };
  }

  const mix = (fore, back) => Math.round((fore * strength + back * (1000 - strength)) / 1000);
  const fill = [0, 1, 2].map((i) => {
    const foreChannel = Number.parseInt(foreHex.slice(i * 2, i * 2 + 2), 16);
    const backChannel = Number.parseInt(backHex.slice(i * 2, i * 2 + 2), 16);
    return mix(foreChannel, backChannel).toString(16).toUpperCase().padStart(2, "0");
  }).join("");

  return {
    val: styleIndex === 38 ? "pct15" : "clear",
    color: "auto",
    fill,
  };
}

function ww8HighlightName(index) {
  const map = {
    0: "auto",
    1: "black",
    2: "blue",
    3: "cyan",
    4: "green",
    5: "magenta",
    6: "red",
    7: "yellow",
    8: "white",
    9: "darkBlue",
    10: "darkCyan",
    11: "darkGreen",
    12: "darkMagenta",
    13: "darkRed",
    14: "darkYellow",
    15: "darkGray",
    16: "lightGray",
  };
  return map[index] ?? "auto";
}

function underlineStyleFromCode(code) {
  switch (code) {
    case 0:
      return null;
    case 1:
    case 2:
      return "single";
    case 3:
      return "double";
    case 4:
      return "dotted";
    case 5:
      return null;
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
      throw new Error(`Unsupported underline style code ${code}`);
  }
}

function parseTabsOperand(val) {
  const payload = val.subarray(1);
  if (payload.length < 2) return [];
  const deletedCount = payload[0];
  const addedCount = payload[1 + deletedCount * 2] ?? 0;
  const positionsOffset = 2 + deletedCount * 2;
  if (positionsOffset + addedCount * 2 > payload.length) {
    throw new Error("Truncated tab-stop SPRM: missing tab positions");
  }

  const tabs = [];
  const tbdOffset = positionsOffset + addedCount * 2;
  if (tbdOffset + addedCount > payload.length) {
    throw new Error("Truncated tab-stop SPRM: missing tab descriptors");
  }
  for (let i = 0; i < addedCount; i += 1) {
    const descriptor = payload[tbdOffset + i];
    const rawAlign = descriptor & 0x07;
    const rawLeader = (descriptor >> 3) & 0x07;
    // WPS sometimes stores the alignment in bits 3-5 and leader in bits 0-2;
    // if rawAlign is unrecognised, try the swapped layout.
    let alignCode = rawAlign;
    let leaderCode = rawLeader;
    if (!(rawAlign in TAB_ALIGNMENT_MAP) && (rawLeader in TAB_ALIGNMENT_MAP)) {
      alignCode = rawLeader;
      leaderCode = rawAlign;
    }
    tabs.push({
      position: payload.readInt16LE(positionsOffset + i * 2),
      alignment: TAB_ALIGNMENT_MAP[alignCode] ?? "left",
      leader: TAB_LEADER_MAP[leaderCode] ?? null,
    });
  }
  return tabs;
}

const TAB_ALIGNMENT_MAP = { 0: "left", 1: "center", 2: "right", 3: "decimal", 4: "bar" };
const TAB_LEADER_MAP = { 0: null, 1: "dot", 2: "hyphen", 3: "underscore", 4: "heavy", 5: "middleDot" };

function tabAlignmentFromCode(code) {
  return TAB_ALIGNMENT_MAP[code] ?? "left";
}

function tabLeaderFromCode(code) {
  return TAB_LEADER_MAP[code] ?? null;
}
