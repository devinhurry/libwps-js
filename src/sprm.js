const SPRM_SIZES = {
  0x2400: 4, 0x2401: 4, 0x2402: 2, 0x2403: 1, 0x2404: 1,
  0x2405: 1, 0x2406: 1, 0x2407: 1, 0x2408: 1, 0x2409: 1,
  0x240A: 4, 0x240B: 1, 0x240C: 4, 0x240D: 4, 0x240E: 4,
  0x2410: 1, 0x2411: 1, 0x2413: 1, 0x2414: 1, 0x2415: 1,
  0x2416: 1, 0x2417: 4, 0x2418: 4, 0x2419: 1, 0x241A: 1,
  0x241B: 1, 0x241C: 1, 0x241D: 1, 0x241E: 1, 0x241F: 1,
  0x2420: 1, 0x2421: 1, 0x2422: 1, 0x2423: 1, 0x2424: 1,
  0x2431: 1, 0x2433: 1, 0x2434: 1, 0x2435: 1, 0x2436: 1,
  0x2437: 1, 0x2438: 1, 0x2439: 2, 0x243A: 2, 0x243B: 2,
  0x243C: 1, 0x243D: 1, 0x243E: 1, 0x243F: 1,
  0x2425: 1, 0x2426: 1, 0x2427: 1, 0x2428: 1, 0x2429: 1,
  0x242A: 1, 0x242B: 1, 0x242C: 1, 0x242D: 1, 0x242E: 1,
  0x242F: 1, 0x2430: 1, 0x2432: 1,
  0x2440: 1, 0x2441: 1, 0x2443: 1, 0x2444: 1, 0x2445: 4,
  0x2446: 4, 0x2447: 1, 0x2448: 1, 0x2449: 4, 0x244A: 4,
  0x244B: 4, 0x244C: 4, 0x244D: 4, 0x244E: 4, 0x244F: 4,
  0x2450: 4, 0x2451: 4, 0x2452: 4, 0x2453: 4, 0x2454: 4,
  0x2461: 1, 0x2462: 1, 0x2463: 1, 0x2464: 1, 0x2465: 4,
  0x6412: 4,
  0x6A0C: 4, 0x6A0D: 4, 0x6A0E: 4, 0x6A0F: 4,
  0x840E: 2, 0x840F: 2, 0x8411: 2, 0x8458: 2, 0x845D: 2,
  0x845E: 2, 0x8460: 2,
  0xA413: 2, 0xA414: 2,
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
  0x6A40: 4, 0x6A41: 4, 0x6A42: 4, 0x6A43: 4, 0x6A44: 4,
  0x6A45: 4, 0x6A46: 4, 0x6A47: 4, 0x6A48: 4, 0x6A49: 4,
  0x4852: 2, 0x4853: 2, 0x4854: 2, 0x4855: 2, 0x4856: 2,
  0x4857: 2, 0x4858: 2, 0x4859: 2, 0x485A: 2, 0x485B: 2,
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
  0x8458: "firstLineIndent",
  0x845D: "rightIndent",
  0x845E: "leftIndent",
  0x8460: "firstLineIndent",
  0x2400: "spacingBefore",
  0x2401: "spacingAfter",
  0x4A43: "fontSize",
  0x4A30: "fontId",
  0x4A4F: "fontAscii",
  0x4A50: "fontEastAsia",
  0x4A51: "fontHAnsi",
  0x4A5E: "fontCs",
  0x8840: "charSpacing",
  0x4852: "charWidth",
  0x2A02: "bold",
  0x2A03: "italic",
  0x2A0E: "underline",
  0xC60D: "tabs",
  0x6A0C: "fontIdWps",
};

const ALIGNMENT_MAP = { 0: "left", 1: "right", 2: "center", 3: "both", 4: "distribute", 5: "numTab" };
const WORD_ALIGNMENT_MAP = { 0: "left", 1: "center", 2: "right", 3: "both", 4: "distribute", 5: "numTab" };

const SPRM_OPERAND_SIZE_BY_SPRA = [1, 1, 2, 4, 2, 2, -1, 3];

export function parseSprms(grpprl, skipIstd = false) {
  const props = {};
  let off = skipIstd ? 2 : 0;
  if (skipIstd && grpprl.length >= 2) {
    props.istd = grpprl.readUInt16LE(0);
  }
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
      const raw = val.readUInt16LE(0);
      const signed = raw > 0x7fff ? raw - 0x10000 : raw;
      props.lineSpacing = { twips: Math.abs(signed), rule: signed < 0 ? "exact" : "atLeast" };
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
    case 0x8840:
      props.charSpacing = val.readInt16LE(0);
      break;
    case 0x4852:
      props.charWidth = val.readUInt16LE(0);
      break;
    case 0x2A02:
      props.bold = val[0] !== 0;
      break;
    case 0x2A03:
      props.italic = val[0] !== 0;
      break;
    case 0x2A0E:
      props.underline = val[0] !== 0;
      break;
    case 0xC60D:
      props.tabs = parseTabsOperand(val);
      break;
    default:
      break;
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
  for (let i = 0; i < addedCount; i += 1) {
    tabs.push({
      position: payload.readUInt16LE(positionsOffset + i * 2),
      alignment: "left",
    });
  }
  return tabs;
}
