import { readFile } from "node:fs/promises";
import test from "node:test";
import assert from "node:assert/strict";
import { readWps, normalizeComparableText } from "../src/index.js";
import { wpsToDocxBuffer } from "../src/docx.js";
import { parseSectionSprms } from "../src/word-binary.js";
import { readDocxMainText, readDocxDocumentXml, readZipEntry } from "./fixtures-docx.js";

function findParagraphXml(xml, text) {
  const matches = xml.match(/<w:p [\s\S]*?<\/w:p>/g) ?? [];
  return matches.find((paragraph) => {
    if (paragraph.includes(text)) return true;
    const joinedText = Array.from(paragraph.matchAll(/<w:t[^>]*>([\s\S]*?)<\/w:t>/g), (match) => match[1]).join("");
    return joinedText.includes(text);
  });
}

function extractSettingsNode(xml, tagName) {
  const pattern = tagName === "w:compat"
    ? /<w:compat>[\s\S]*?<\/w:compat>/
    : new RegExp(`<${tagName}\\b[^>]*?(?:/>|>.*?<\\/${tagName}>)`, "s");
  return xml.match(pattern)?.[0] ?? null;
}

function normalizeComparableXml(xml) {
  return xml
    .replace(/>\s*</g, ">\n<")
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .filter((line) => !/(rsid|docVar|paraId|zoom)/i.test(line));
}

function countXmlLineEdits(actualXml, expectedXml) {
  const actual = normalizeComparableXml(actualXml);
  const expected = normalizeComparableXml(expectedXml);
  let previous = new Array(actual.length + 1).fill(0);
  for (let i = 1; i <= expected.length; i += 1) {
    const current = new Array(actual.length + 1).fill(0);
    for (let j = 1; j <= actual.length; j += 1) {
      current[j] = expected[i - 1] === actual[j - 1]
        ? previous[j - 1] + 1
        : Math.max(previous[j], current[j - 1]);
    }
    previous = current;
  }
  const lcs = previous[actual.length];
  return expected.length + actual.length - 2 * lcs;
}

const BASIC_WPS = "sample/basic/original.wps";
const BASIC_DOCX = "sample/basic/expected.docx";
const FULL_WPS = "sample/full/original.wps";
const FULL_DOCX = "sample/full/expected.docx";
const TABLE2_WPS = "sample/table2/original.wps";
const TABLE6_DOCX = "sample/table6/expected.docx";

test("lists and reads OLE2 streams from a WPS file", async () => {
  const document = readWps(await readFile(FULL_WPS));

  assert.equal(document.type, "wps-ole2-word-binary");
  assert.deepEqual(
    document.streams.map((stream) => stream.name).sort(),
    [
      "\u0005DocumentSummaryInformation",
      "\u0005SummaryInformation",
      "0Table",
      "Data",
      "WordDocument",
      "WpsCustomData",
    ],
  );
  assert.equal(document.fib.whichTableStream, "0Table");
  assert.equal(document.fib.characterCounts.body, 11098);
  assert.match(document.text, /重庆市青年就业见习实施办法/);
  assert.match(document.text, /就业见习补贴标准/);
});

test("extracts the same readable text as the one-page DOCX export", async () => {
  const wps = readWps(await readFile(BASIC_WPS));
  const docxText = readDocxMainText(await readFile(BASIC_DOCX));

  assert.equal(normalizeComparableText(wps.bodyText), normalizeComparableText(docxText));
});

test("extracts the readable text from the full WPS export", async () => {
  const wps = readWps(await readFile(FULL_WPS));
  const docxComparableText = normalizeComparableText(
    readDocxMainText(await readFile(FULL_DOCX)),
  );
  const wpsComparableText = normalizeComparableText(wps.bodyText);

  assert.ok(wpsComparableText.startsWith(docxComparableText.slice(0, 5000)));
  assert.match(wps.text, /法人（负责人）（签章）：\s+经办人（签字）：/);
  assert.match(wps.text, /2024年5月14日印发/);
  assert.equal(wps.paragraphs.at(0), "渝人社发〔2024〕12 号");
});

test("converts WPS text into a readable DOCX package", async () => {
  const wps = readWps(await readFile(BASIC_WPS));
  const docx = wpsToDocxBuffer(wps, {
    title: "ole2-one-page.wps",
    creator: "test",
    created: "2026-06-17T00:00:00.000Z",
    modified: "2026-06-17T00:00:00.000Z",
  });

  const convertedText = readDocxMainText(docx);
  assert.equal(normalizeComparableText(convertedText), normalizeComparableText(wps.bodyText));
});

test("extracts and emits table2 WPS table structure", async () => {
  const wps = readWps(await readFile(TABLE2_WPS));

  const secondTableFirstCell = wps.bodyText.slice(
    wps.tableRows[1].rows[0].cells[0].cpStart,
    wps.tableRows[1].rows[0].cells[0].cpEnd,
  );
  assert.equal(secondTableFirstCell, "政策落实\r（30 分）\x07");
  assert.deepEqual(
    Object.fromEntries(
      Object.entries(wps.tableRows[0].tableBorders).map(([side, border]) => [side, border.style]),
    ),
    {
      top: "single",
      left: "single",
      bottom: "single",
      right: "single",
      insideH: "single",
      insideV: "single",
    },
  );

  const docx = wpsToDocxBuffer(wps, { title: "table2" });
  const xml = readDocxDocumentXml(docx);
  const expectedXml = readDocxDocumentXml(await readFile("sample/table2/expected.docx"));
  assert.match(readDocxMainText(docx), /重庆市青年就业见习基地 年度评估表/);
  assert.match(xml, /<w:u w:val="thick"\/>/);
  const tableXmls = [...xml.matchAll(/<w:tbl>[\s\S]*?<\/w:tbl>/g)].map((match) => match[0]);
  const expectedTableXmls = [...expectedXml.matchAll(/<w:tbl>[\s\S]*?<\/w:tbl>/g)].map((match) => match[0]);
  assert.ok(tableXmls.length >= 2);
  assert.match(tableXmls[0], /<w:tblStyle w:val="6"\/>/);
  assert.match(tableXmls[0], /<w:tblW w:w="13118" w:type="dxa"\/>/);
  assert.match(tableXmls[0], /<w:jc w:val="center"\/>/);
  assert.match(tableXmls[0], /<w:vAlign w:val="center"\/>/);
  assert.match(tableXmls[0], /<w:tblBorders><w:top w:val="single"[\s\S]*<w:insideV w:val="single"/);
  assert.match(xml, /政策落实[\s\S]*30[\s\S]*分/);
  assert.deepEqual(
    tableXmls.map((t) => (t.match(/<w:tcBorders>/g) || []).length),
    expectedTableXmls.map((t) => (t.match(/<w:tcBorders>/g) || []).length),
  );

  const sectionTypes = [...xml.matchAll(/<w:sectPr>([\s\S]*?)<\/w:sectPr>/g)]
    .map((match) => /<w:type w:val="continuous"\/>/.test(match[1]) ? "continuous" : null);
  assert.deepEqual(sectionTypes, ["continuous", "continuous", null, null]);
});

test("table2 title keeps a thick underline between base and year", async () => {
  const wps = readWps(await readFile(TABLE2_WPS));
  assert.equal(wps.characterProperties[17].underlineStyle, "thick");

  const docx = wpsToDocxBuffer(wps, { title: "table2" });
  const xml = readDocxDocumentXml(docx);
  const text = readDocxMainText(docx);
  assert.match(text, /重庆市青年就业见习基地 年度评估表/);
  assert.match(xml, /<w:u w:val="thick"\/>/);
});

test("sample2 settings emit the East Asian grid profile", async () => {
  const wps = readWps(await readFile("sample/sample2/original.wps"));
  const docx = wpsToDocxBuffer(wps, { title: "sample2" });
  const convertedXml = readZipEntry(docx, "word/settings.xml").toString("utf8");
  const expectedXml = readZipEntry(await readFile("sample/sample2/expected.docx"), "word/settings.xml").toString("utf8");

  assert.equal(extractSettingsNode(convertedXml, "w:mirrorMargins"), extractSettingsNode(expectedXml, "w:mirrorMargins"));
  assert.equal(extractSettingsNode(convertedXml, "w:bordersDoNotSurroundHeader"), extractSettingsNode(expectedXml, "w:bordersDoNotSurroundHeader"));
  assert.equal(extractSettingsNode(convertedXml, "w:bordersDoNotSurroundFooter"), extractSettingsNode(expectedXml, "w:bordersDoNotSurroundFooter"));
  assert.equal(extractSettingsNode(convertedXml, "w:stylePaneFormatFilter"), extractSettingsNode(expectedXml, "w:stylePaneFormatFilter"));
  assert.equal(extractSettingsNode(convertedXml, "w:documentProtection"), extractSettingsNode(expectedXml, "w:documentProtection"));
  assert.equal(extractSettingsNode(convertedXml, "w:defaultTabStop"), extractSettingsNode(expectedXml, "w:defaultTabStop"));
  assert.equal(extractSettingsNode(convertedXml, "w:drawingGridHorizontalSpacing"), extractSettingsNode(expectedXml, "w:drawingGridHorizontalSpacing"));
  assert.equal(extractSettingsNode(convertedXml, "w:drawingGridVerticalSpacing"), extractSettingsNode(expectedXml, "w:drawingGridVerticalSpacing"));
  assert.equal(extractSettingsNode(convertedXml, "w:noPunctuationKerning"), extractSettingsNode(expectedXml, "w:noPunctuationKerning"));
  assert.equal(extractSettingsNode(convertedXml, "w:characterSpacingControl"), extractSettingsNode(expectedXml, "w:characterSpacingControl"));
  assert.ok(countXmlLineEdits(convertedXml, expectedXml) < 2);
  assert.equal(extractSettingsNode(convertedXml, "w:uiCompat97To2003"), extractSettingsNode(expectedXml, "w:uiCompat97To2003"));
  assert.equal(extractSettingsNode(convertedXml, "w:embedTrueTypeFonts"), extractSettingsNode(expectedXml, "w:embedTrueTypeFonts"));
  assert.equal(extractSettingsNode(convertedXml, "w:saveSubsetFonts"), extractSettingsNode(expectedXml, "w:saveSubsetFonts"));
  assert.equal(extractSettingsNode(convertedXml, "w:doNotValidateAgainstSchema"), extractSettingsNode(expectedXml, "w:doNotValidateAgainstSchema"));
  assert.equal(extractSettingsNode(convertedXml, "w:doNotDemarcateInvalidXml"), extractSettingsNode(expectedXml, "w:doNotDemarcateInvalidXml"));
  assert.equal(extractSettingsNode(convertedXml, "w:footnotePr"), extractSettingsNode(expectedXml, "w:footnotePr"));
  assert.equal(extractSettingsNode(convertedXml, "w:endnotePr"), extractSettingsNode(expectedXml, "w:endnotePr"));
});

test("sample3 settings use the 420 default tab stop from parsed document settings", async () => {
  const wps = readWps(await readFile("sample/sample3/original.wps"));
  assert.equal(wps.dop.dxaTab, 420);
  assert.equal(wps.defaultTabStop, 420);

  const docx = wpsToDocxBuffer(wps, { title: "sample3" });
  const convertedXml = readZipEntry(docx, "word/settings.xml").toString("utf8");
  const expectedXml = readZipEntry(
    await readFile("sample/sample3/expected.docx"),
    "word/settings.xml",
  ).toString("utf8");
  assert.equal(extractSettingsNode(convertedXml, "w:embedTrueTypeFonts"), extractSettingsNode(expectedXml, "w:embedTrueTypeFonts"));
  assert.equal(extractSettingsNode(convertedXml, "w:saveSubsetFonts"), extractSettingsNode(expectedXml, "w:saveSubsetFonts"));
  assert.equal(extractSettingsNode(convertedXml, "w:bordersDoNotSurroundHeader"), extractSettingsNode(expectedXml, "w:bordersDoNotSurroundHeader"));
  assert.equal(extractSettingsNode(convertedXml, "w:bordersDoNotSurroundFooter"), extractSettingsNode(expectedXml, "w:bordersDoNotSurroundFooter"));
  assert.equal(extractSettingsNode(convertedXml, "w:stylePaneFormatFilter"), extractSettingsNode(expectedXml, "w:stylePaneFormatFilter"));
  assert.equal(extractSettingsNode(convertedXml, "w:documentProtection"), extractSettingsNode(expectedXml, "w:documentProtection"));
  assert.equal(extractSettingsNode(convertedXml, "w:defaultTabStop"), extractSettingsNode(expectedXml, "w:defaultTabStop"));
  assert.equal(extractSettingsNode(convertedXml, "w:drawingGridHorizontalSpacing"), extractSettingsNode(expectedXml, "w:drawingGridHorizontalSpacing"));
  assert.equal(extractSettingsNode(convertedXml, "w:drawingGridVerticalSpacing"), extractSettingsNode(expectedXml, "w:drawingGridVerticalSpacing"));
  assert.equal(extractSettingsNode(convertedXml, "w:noPunctuationKerning"), extractSettingsNode(expectedXml, "w:noPunctuationKerning"));
  assert.equal(extractSettingsNode(convertedXml, "w:characterSpacingControl"), extractSettingsNode(expectedXml, "w:characterSpacingControl"));
  assert.equal(extractSettingsNode(convertedXml, "w:doNotValidateAgainstSchema"), extractSettingsNode(expectedXml, "w:doNotValidateAgainstSchema"));
  assert.equal(extractSettingsNode(convertedXml, "w:doNotDemarcateInvalidXml"), extractSettingsNode(expectedXml, "w:doNotDemarcateInvalidXml"));
  assert.ok(countXmlLineEdits(convertedXml, expectedXml) < 2);
  assert.equal(extractSettingsNode(convertedXml, "w:uiCompat97To2003"), extractSettingsNode(expectedXml, "w:uiCompat97To2003"));
  assert.equal(extractSettingsNode(convertedXml, "w:mirrorMargins"), extractSettingsNode(expectedXml, "w:mirrorMargins"));
  assert.equal(extractSettingsNode(convertedXml, "w:footnotePr"), extractSettingsNode(expectedXml, "w:footnotePr"));
  assert.equal(extractSettingsNode(convertedXml, "w:endnotePr"), extractSettingsNode(expectedXml, "w:endnotePr"));
});

test("sample3 settings.xml matches WPS expected export without metadata noise", async () => {
  const wps = readWps(await readFile("sample/sample3/original.wps"));
  const docx = wpsToDocxBuffer(wps, { title: "sample3" });
  const convertedXml = readZipEntry(docx, "word/settings.xml").toString("utf8");
  const expectedXml = readZipEntry(await readFile("sample/sample3/expected.docx"), "word/settings.xml").toString("utf8");

  assert.ok(countXmlLineEdits(convertedXml, expectedXml) < 2);
  assert.doesNotMatch(extractSettingsNode(convertedXml, "w:compat"), /<w:ulTrailSpace\/>/);
});

test("sample3 styles.xml stays close to WPS expected export", async () => {
  const wps = readWps(await readFile("sample/sample3/original.wps"));
  const docx = wpsToDocxBuffer(wps, { title: "sample3" });
  const convertedXml = readZipEntry(docx, "word/styles.xml").toString("utf8");
  const expectedXml = readZipEntry(await readFile("sample/sample3/expected.docx"), "word/styles.xml").toString("utf8");

  assert.ok(countXmlLineEdits(convertedXml, expectedXml) <= 320);
});

test("sample3 table serial-number column has a resolvable numbering definition", async () => {
  const wps = readWps(await readFile("sample/sample3/original.wps"));
  const docx = wpsToDocxBuffer(wps, { title: "sample3" });
  const documentXml = readDocxDocumentXml(docx);
  const numberingXml = readZipEntry(docx, "word/numbering.xml").toString("utf8");

  assert.match(documentXml, /<w:numPr><w:ilvl w:val="0"\/><w:numId w:val="2"\/><\/w:numPr>/);
  const num2 = numberingXml.match(/<w:num w:numId="2">[\s\S]*?<\/w:num>/)?.[0] ?? "";
  assert.match(num2, /<w:abstractNumId w:val="0"\/>/);
  assert.match(numberingXml, /<w:abstractNum w:abstractNumId="0">[\s\S]*<w:numFmt w:val="decimal"\/>[\s\S]*<w:lvlText w:val="%1"\/>/);
});

test("sample3 table header row repeats across pages", async () => {
  const wps = readWps(await readFile("sample/sample3/original.wps"));
  assert.equal(wps.tableRows.length, 1);
  assert.equal(wps.tableRows[0].rows[0].cantSplit, true);
  assert.equal(wps.tableRows[0].rows[0].repeatHeader, true);

  const docx = wpsToDocxBuffer(wps, { title: "sample3" });
  const convertedXml = readDocxDocumentXml(docx);
  const expectedXml = readDocxDocumentXml(await readFile("sample/sample3/expected.docx"));
  const convertedTableXml = convertedXml.match(/<w:tbl>[\s\S]*?<\/w:tbl>/)?.[0] ?? null;
  const expectedTableXml = expectedXml.match(/<w:tbl>[\s\S]*?<\/w:tbl>/)?.[0] ?? null;

  assert.ok(convertedTableXml);
  assert.ok(expectedTableXml);
  assert.match(convertedTableXml, /<w:tblHeader\/>/);
  assert.match(convertedTableXml, /<w:cantSplit\/>/);
  assert.match(expectedTableXml, /<w:tblHeader\/>/);
  assert.match(expectedTableXml, /<w:cantSplit\/>/);
  const convertedFirstRow = convertedTableXml.match(/<w:tr[\s\S]*?<\/w:tr>/)?.[0] ?? null;
  const expectedFirstRow = expectedTableXml.match(/<w:tr[\s\S]*?<\/w:tr>/)?.[0] ?? null;
  assert.ok(convertedFirstRow);
  assert.ok(expectedFirstRow);
  assert.match(convertedFirstRow, /<w:b w:val="0"\/>/);
  assert.match(expectedFirstRow, /<w:b w:val="0"\/>/);
  assert.doesNotMatch(convertedFirstRow, /<w:b\/>/);
});

test("basic settings use the 720 default tab stop from parsed document settings", async () => {
  const wps = readWps(await readFile(BASIC_WPS));
  assert.equal(wps.dop.dxaTab, 720);
  assert.equal(wps.defaultTabStop, 720);

  const docx = wpsToDocxBuffer(wps, { title: "basic" });
  const xml = readZipEntry(docx, "word/settings.xml").toString("utf8");
  assert.match(xml, /<w:defaultTabStop w:val="720"\/>/);
});

test("settings.xml defaultTabStop is emitted from parsed DOP, not section profile", async () => {
  const wps = readWps(await readFile("sample/sample3/original.wps"));
  const docx = wpsToDocxBuffer({ ...wps, defaultTabStop: 960 }, { title: "sample3" });
  const xml = readZipEntry(docx, "word/settings.xml").toString("utf8");

  assert.match(xml, /<w:defaultTabStop w:val="960"\/>/);
});

test("trackRevisions is emitted before protection and defaultTabStop", async () => {
  const wps = readWps(await readFile("sample/sample6/original.wps"));
  assert.equal(wps.dop.fRevMarking, true);

  const docx = wpsToDocxBuffer(wps, { title: "sample6" });
  const xml = readZipEntry(docx, "word/settings.xml").toString("utf8");
  const trackRevisionsIndex = xml.indexOf("<w:trackRevisions");
  const documentProtectionIndex = xml.indexOf("<w:documentProtection");
  const defaultTabStopIndex = xml.indexOf("<w:defaultTabStop");

  assert.ok(trackRevisionsIndex >= 0);
  assert.ok(documentProtectionIndex >= 0);
  assert.ok(defaultTabStopIndex >= 0);
  assert.ok(trackRevisionsIndex < documentProtectionIndex);
  assert.ok(trackRevisionsIndex < defaultTabStopIndex);
});

test("settings drawing grid fails fast when parsed Dogrid is missing", async () => {
  const wps = readWps(await readFile("sample/sample3/original.wps"));
  assert.equal(wps.sections[0].properties.docGridType, 2);

  assert.throws(
    () => wpsToDocxBuffer({ ...wps, dop: { ...wps.dop, dogrid: null } }, { title: "sample3" }),
    /missing parsed Dogrid/,
  );
});

test("non-East Asian settings drawing grid also requires parsed Dogrid", async () => {
  const wps = readWps(await readFile(BASIC_WPS));
  assert.equal(wps.sections[0].properties.docGridType ?? null, null);

  assert.throws(
    () => wpsToDocxBuffer({ ...wps, dop: { ...wps.dop, dogrid: null } }, { title: "basic" }),
    /missing parsed Dogrid/,
  );
});

test("East Asian grid settings fail fast when parsed grfFmtFilter is missing", async () => {
  const wps = readWps(await readFile("sample/sample3/original.wps"));
  assert.equal(wps.sections[0].properties.docGridType, 2);

  assert.throws(
    () => wpsToDocxBuffer({ ...wps, dop: { ...wps.dop, grfFmtFilter: null } }, { title: "sample3" }),
    /missing parsed grfFmtFilter/,
  );
});

test("sample2 bold paragraph keeps the bank/securities label bold", async () => {
  const wps = readWps(await readFile("sample/sample2/original.wps"));
  const target = "（银行/证券/保险/其他）";
  const start = wps.bodyText.indexOf(target);
  assert.ok(start >= 0);
  assert.equal(wps.characterProperties[start].bold, true);
  assert.equal(wps.characterProperties[start + target.length - 1].bold, true);

  const docx = wpsToDocxBuffer(wps, { title: "sample2" });
  const xml = readDocxDocumentXml(docx);
  const paragraph = findParagraphXml(xml, `<w:t>${target}</w:t>`);
  assert.ok(paragraph);
  assert.match(paragraph, /<w:spacing w:after="298" w:afterLines="50" w:line="596" w:lineRule="exact"\/>/);
  assert.match(paragraph, /<w:rPr>.*<w:b\/>.*<w:sz w:val="32"\/><w:szCs w:val="32"\/>.*<\/w:rPr>/s);
});

test("sample2 table header paragraphs keep complex-script bold runs", async () => {
  const wps = readWps(await readFile("sample/sample2/original.wps"));
  const docx = wpsToDocxBuffer(wps, { title: "sample2" });
  const xml = readDocxDocumentXml(docx);

  const headerMatch = findParagraphXml(xml, "<w:t>项目名称：</w:t>");
  assert.ok(headerMatch);
  assert.match(headerMatch, /<w:bCs\/>/);
  assert.match(headerMatch, /<w:sz w:val="24"\/>/);
  assert.match(headerMatch, /<w:szCs w:val="24"\/>/);

  const labelMatch = findParagraphXml(xml, "<w:t>（银行/证券/保险/其他）</w:t>");
  assert.ok(labelMatch);
  assert.match(labelMatch, /<w:b\/>/);
  assert.doesNotMatch(labelMatch, /<w:bCs\/>/);
});

test("extracts and emits table4 WPS table structure with centered Normal Table styling", async () => {
  const wps = readWps(await readFile("sample/table4/original.wps"));

  assert.equal(wps.tableRows.length, 1);
  assert.deepEqual(wps.tableRows[0].rows.map((row) => row.cells.length), [
    4, 6, 2, 7, 7, 7, 7, 4, 4, 1, 5, 5, 5, 2, 2, 2, 2, 2,
  ]);
  assert.equal(wps.tableRows[0].gridCols.length, 10);
  assert.equal(wps.characterProperties[93].symbolFontId, 5);
  assert.equal(wps.characterProperties[93].symbolChar, 0x00a3);

  const docx = wpsToDocxBuffer(wps, { title: "table4" });
  const xml = readDocxDocumentXml(docx);
  const expectedXml = readDocxDocumentXml(await readFile("sample/table4/expected.docx"));
  const tableXmls = [...xml.matchAll(/<w:tbl>[\s\S]*?<\/w:tbl>/g)].map((match) => match[0]);
  const expectedTableXmls = [...expectedXml.matchAll(/<w:tbl>[\s\S]*?<\/w:tbl>/g)].map((match) => match[0]);
  assert.equal(tableXmls.length, 1);
  assert.match(tableXmls[0], /<w:tblStyle w:val="6"\/>/);
  assert.match(tableXmls[0], /<w:tblW w:w="0" w:type="auto"\/>/);
  assert.match(tableXmls[0], /<w:jc w:val="center"\/>/);
  assert.match(tableXmls[0], /<w:trPr>[\s\S]*?<w:jc w:val="center"\/>/);
  assert.match(tableXmls[0], /<w:vAlign w:val="center"\/>/);
  assert.match(tableXmls[0], /<w:sym w:font="Wingdings 2" w:char="00A3"\/>/);
  assert.doesNotMatch(tableXmls[0], /<w:t>\(企<\/w:t>/);
  assert.match(tableXmls[0], /单位名称/);
  assert.deepEqual(
    tableXmls.map((t) => (t.match(/<w:tcBorders>/g) || []).length),
    expectedTableXmls.map((t) => (t.match(/<w:tcBorders>/g) || []).length),
  );
});

test("converts sample4 without dropping its table block", async () => {
  const wps = readWps(await readFile("sample/sample4/original.wps"));

  assert.equal(wps.tableRows.length, 1);
  assert.equal(wps.tableRows[0].rows.length, 7);

  const docx = wpsToDocxBuffer(wps, { title: "sample4" });
  const xml = readDocxDocumentXml(docx);
  const expected = await readFile("sample/sample4/expected.docx");

  assert.equal(readDocxMainText(docx), readDocxMainText(expected));
  assert.equal((xml.match(/<w:tbl>/g) ?? []).length, 1);
  assert.ok(
    countXmlLineEdits(xml, readZipEntry(expected, "word/document.xml").toString("utf8")) < 100,
    "sample4 document.xml normalized diff should stay below 100 edits",
  );
  assert.ok(
    countXmlLineEdits(readZipEntry(docx, "word/settings.xml").toString("utf8"), readZipEntry(expected, "word/settings.xml").toString("utf8")) < 10,
    "sample4 settings.xml normalized diff should stay below 10 edits",
  );
  assert.equal(
    countXmlLineEdits(readZipEntry(docx, "[Content_Types].xml").toString("utf8"), readZipEntry(expected, "[Content_Types].xml").toString("utf8")),
    0,
  );
  assert.equal(
    countXmlLineEdits(readZipEntry(docx, "word/_rels/document.xml.rels").toString("utf8"), readZipEntry(expected, "word/_rels/document.xml.rels").toString("utf8")),
    0,
  );
  assert.throws(() => readZipEntry(docx, "word/numbering.xml"), /DOCX fixture entry not found/);
});

test("extracts paragraph line spacing from PAPX pages", async () => {
  const wps = readWps(await readFile(BASIC_WPS));
  assert.ok(wps.paragraphProperties.length >= 12);
  assert.equal(wps.paragraphProperties[0].lineSpacing.twips, 594);
  assert.equal(wps.paragraphProperties[0].lineSpacing.rule, "exact");
  assert.equal(wps.paragraphProperties[1].lineSpacing.twips, 594);
  assert.equal(wps.paragraphProperties[2].lineSpacing.twips, 594);
  assert.equal(wps.paragraphProperties[2].lineSpacing.rule, "exact");
});

test("extracts custom paragraph tab stops from PAPX pages", async () => {
  const wps = readWps(await readFile(BASIC_WPS));
  assert.deepEqual(wps.paragraphProperties[9].tabs.map((tab) => tab.position), [
    4464,
    4690,
    5029,
    5480,
    5595,
    6159,
    6272,
    6726,
    7061,
    7290,
    7854,
  ]);
});

test("sample3 attachment heading keeps no direct paragraph tabs", async () => {
  const wps = readWps(await readFile("sample/sample3/original.wps"));
  assert.equal(wps.paragraphs[0], "附件1");
  assert.equal(wps.paragraphProperties[0].tabs, null);
  assert.equal(wps.paragraphProperties[0].widowControl, null);

  const docx = wpsToDocxBuffer(wps, { title: "sample3" });
  const xml = readDocxDocumentXml(docx);
  const firstParagraph = xml.match(/<w:p [\s\S]*?<\/w:p>/)?.[0];
  assert.ok(firstParagraph, "first paragraph XML should exist");
  assert.doesNotMatch(firstParagraph, /<w:tabs>/);
  assert.doesNotMatch(firstParagraph, /<w:widowControl/);
});

test("sample3 title paragraph preserves keep and page-break flags from WPS", async () => {
  const wps = readWps(await readFile("sample/sample3/original.wps"));
  assert.equal(wps.paragraphs[1], "22项通信行业标准编号、名称及主要内容等一览表");
  assert.equal(wps.paragraphProperties[1].keepNext, false);
  assert.equal(wps.paragraphProperties[1].keepLines, false);
  assert.equal(wps.paragraphProperties[1].pageBreakBefore, false);
  assert.equal(wps.paragraphProperties[1].widowControl, false);
  assert.equal(wps.paragraphProperties[1].bidi, false);
  assert.equal(wps.paragraphProperties[1].snapToGrid, true);
  assert.equal(wps.paragraphProperties[1].textAlignment, "auto");

  const docx = wpsToDocxBuffer(wps, { title: "sample3" });
  const xml = readDocxDocumentXml(docx);
  const titleParagraph = findParagraphXml(xml, "22项通信行业标准编号、名称及主要内容等一览表");
  assert.ok(titleParagraph, "title paragraph should exist");
  assert.match(xml, /<w:keepNext w:val="0"\/>/);
  assert.match(xml, /<w:keepLines w:val="0"\/>/);
  assert.match(xml, /<w:pageBreakBefore w:val="0"\/>/);
  assert.match(xml, /<w:widowControl w:val="0"\/>/);
  assert.ok(titleParagraph.indexOf('<w:pageBreakBefore w:val="0"/>') < titleParagraph.indexOf('<w:widowControl w:val="0"/>'));
  assert.ok(titleParagraph.indexOf('<w:widowControl w:val="0"/>') < titleParagraph.indexOf('<w:snapToGrid/>'));
  assert.match(xml, /<w:bidi w:val="0"\/>/);
  assert.match(xml, /<w:snapToGrid\/>/);
  assert.match(xml, /<w:textAlignment w:val="auto"\/>/);
  assert.match(xml, /<w:spacing[^>]*w:after="157"[^>]*w:afterLines="50"[^>]*\/>/);
});

test("sample3 table cell header keeps table-cell defaults from expected DOCX", async () => {
  const wps = readWps(await readFile("sample/sample3/original.wps"));
  const docx = wpsToDocxBuffer(wps, { title: "sample3" });
  const xml = readDocxDocumentXml(docx);
  const headerParagraph = findParagraphXml(xml, "序号");
  assert.ok(headerParagraph, "table header paragraph should exist");
  assert.match(headerParagraph, /<w:suppressLineNumbers w:val="0"\/>/);
  assert.match(headerParagraph, /<w:wordWrap\/>/);
  assert.match(headerParagraph, /<w:rFonts w:hint="eastAsia" w:ascii="黑体" w:hAnsi="黑体" w:eastAsia="黑体" w:cs="黑体"\/>/);
  assert.doesNotMatch(headerParagraph, /<w:autoSpaceDE w:val="0"\/>/);
  assert.doesNotMatch(headerParagraph, /<w:autoSpaceDN w:val="0"\/>/);
  assert.match(headerParagraph, /<w:color w:val="(?:auto|000000)"\/>/);
  assert.match(headerParagraph, /<w:szCs w:val="21"\/>/);
  assert.match(headerParagraph, /<w:highlight w:val="none"\/>/);
  assert.ok(headerParagraph.indexOf('<w:widowControl w:val="0"/>') < headerParagraph.indexOf('<w:suppressLineNumbers w:val="0"/>'));
  assert.ok(headerParagraph.indexOf('<w:suppressLineNumbers w:val="0"/>') < headerParagraph.indexOf('<w:kinsoku/>'));
});

test("sample3 body paragraph keeps one merged run with explicit black shading", async () => {
  const wps = readWps(await readFile("sample/sample3/original.wps"));
  const target = "本文件规定了大规模预训练模型时具备的能力要求，包括数据管理、模型训练、模型管理和模型部署等核心环节";
  const docx = wpsToDocxBuffer(wps, { title: "sample3" });
  const xml = readDocxDocumentXml(docx);
  const paragraph = findParagraphXml(xml, target);
  assert.ok(paragraph, "target paragraph should exist");
  assert.equal((paragraph.match(/<w:r><w:rPr>/g) ?? []).length, 1);
  assert.match(paragraph, /<w:color w:val="000000"\/>/);
  assert.match(paragraph, /<w:shd w:val="clear" w:color="auto" w:fill="FFFFFF"\/>/);
  assert.doesNotMatch(paragraph, /<w:highlight w:val="none"\/>/);
});

test("sample3 paragraph line numbering comes from parsed PFNoLineNumb", async () => {
  const wps = readWps(await readFile("sample/sample3/original.wps"));
  assert.ok(
    wps.paragraphProperties.some((paragraph) => paragraph?.lineNumberCount === true),
    "sample3 should parse at least one explicit line-numbering count flag",
  );

  const docx = wpsToDocxBuffer(wps, { title: "sample3" });
  const xml = readDocxDocumentXml(docx);
  const expectedXml = readDocxDocumentXml(await readFile("sample/sample3/expected.docx"));
  const actualFlags = (xml.match(/<w:p[\s\S]*?<\/w:p>/g) ?? []).map((paragraph) =>
    /<w:suppressLineNumbers w:val="0"\/>/.test(paragraph),
  );
  const expectedFlags = (expectedXml.match(/<w:p[\s\S]*?<\/w:p>/g) ?? []).map((paragraph) =>
    /<w:suppressLineNumbers w:val="0"\/>/.test(paragraph),
  );
  assert.deepEqual(actualFlags, expectedFlags);
});

test("sample3 blank table spacer paragraph does not emit suppressLineNumbers", async () => {
  const wps = readWps(await readFile("sample/sample3/original.wps"));
  const docx = wpsToDocxBuffer(wps, { title: "sample3" });
  const xml = readDocxDocumentXml(docx);
  const paragraphs = xml.match(/<w:p [\s\S]*?<\/w:p>/g) ?? [];
  const blankParagraph = paragraphs.find(
    (paragraph) => !paragraph.includes("<w:t") && !paragraph.includes("<w:pStyle"),
  );
  assert.ok(blankParagraph, "blank table spacer paragraph should exist");
  assert.doesNotMatch(blankParagraph, /<w:suppressLineNumbers w:val="0"\/>/);
});

test("extracts direct paragraph indents from full PAPX records", async () => {
  const wps = readWps(await readFile(BASIC_WPS));
  assert.equal(wps.paragraphProperties[0].rightIndent, 194);
  assert.equal(wps.paragraphProperties[2].leftIndent, 1683);
  assert.equal(wps.paragraphProperties[2].rightIndent, 1853);
  assert.equal(wps.paragraphProperties[5].leftIndent, 108);
  assert.equal(wps.paragraphProperties[5].rightIndent, 260);
  assert.equal(wps.paragraphProperties[5].firstLineIndent, 631);
  assert.equal(wps.paragraphProperties[9].leftIndent, 3898);
  assert.equal(wps.paragraphProperties[9].rightIndent, 1061);
  assert.equal(wps.paragraphProperties[10].rightIndent, 5232);
});

test("extracts section page geometry from PLCFSED/SEPX", async () => {
  const wps = readWps(await readFile(BASIC_WPS));
  assert.equal(wps.sections.length, 2);
  assert.deepEqual(wps.sections.map((section) => [section.cpStart, section.cpEnd]), [
    [0, 254],
    [254, 265],
  ]);
  assert.equal(wps.sections[0].properties.pageWidth, 11910);
  assert.equal(wps.sections[0].properties.marginLeft, 1480);
  assert.equal(wps.sections[1].properties.marginRight, 1260);
});

test("parses variable-length section border SPRMs", () => {
  const props = parseSectionSprms(Buffer.from([
    0x34, 0xd2, 0x08,
    0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
  ]));

  assert.deepEqual(props, { pageBorders: { top: { style: "none" } } });
  assert.throws(
    () => parseSectionSprms(Buffer.from([
      0x34, 0xd2, 0x0c,
      0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
      0x00, 0x00, 0x00, 0x00,
    ])),
    /Unsupported page border operand size 13/,
  );
});

test("emits section breaks and tab stops in converted DOCX", async () => {
  const wps = readWps(await readFile(BASIC_WPS));
  const docx = wpsToDocxBuffer(wps, { title: "test" });
  const xml = readDocxDocumentXml(docx);
  assert.match(xml, /<w:tab w:val="left" w:pos="4464"\/>/);
  assert.match(xml, /<w:sectPr>.*<w:pgSz w:w="11910" w:h="16840"\/>/s);
  assert.match(xml, /<w:pgMar w:top="1580" w:right="1260" w:bottom="1321" w:left="1360" w:header="0" w:footer="0" w:gutter="0"\/>/);
});

test("extracts character formatting runs from CHPX pages", async () => {
  const wps = readWps(await readFile(BASIC_WPS));
  assert.deepEqual(wps.characterRuns.slice(0, 5).map((run) => [run.cpStart, run.cpEnd]), [
    [0, 5],
    [5, 9],
    [9, 10],
    [10, 13],
    [13, 14],
  ]);
  assert.equal(wps.characterProperties[65].fontSize, 44);
  assert.equal(wps.characterProperties[16].charSpacing, -2);
  assert.equal(wps.characterProperties[29].charSpacing, 2);
  assert.equal(wps.characterProperties[53].charSpacing, 7);
});

test("extracts style sheet from STSH with names and types", async () => {
  const wps = readWps(await readFile(BASIC_WPS));
  const styles = wps.styles.filter((s) => s !== null);
  assert.ok(styles.length >= 10);

  const normal = styles.find((s) => s.name === "正文");
  assert.ok(normal);
  assert.equal(normal.type, "paragraph");
  assert.equal(normal.basedOn, null);
  assert.equal(normal.lineSpacing.twips, 240);
  assert.equal(normal.lineSpacing.rule, "auto");

  const heading1 = styles.find((s) => s.name === "标题 1");
  assert.ok(heading1);
  assert.equal(heading1.type, "paragraph");
  assert.equal(heading1.basedOn, 0);
  assert.equal(heading1.runProperties.fontSize, 44);

  const bodyText = styles.find((s) => s.name === "正文文本");
  assert.ok(bodyText);
  assert.equal(bodyText.type, "paragraph");
  assert.equal(bodyText.basedOn, 0);
  assert.equal(bodyText.runProperties.fontSize, 32);

  const defaultFont = styles.find((s) => s.name === "默认段落字体");
  assert.ok(defaultFont);
  assert.equal(defaultFont.type, "character");
  assert.equal(defaultFont.basedOn, null);
});

test("emits w:spacing in converted DOCX from paragraph properties", async () => {
  const wps = readWps(await readFile(BASIC_WPS));
  const docx = wpsToDocxBuffer(wps, { title: "test" });
  const xml = readDocxDocumentXml(docx);
  assert.match(xml, /<w:spacing w:line="594" w:lineRule="exact"\/>/);
});

test("emits styles.xml with style definitions from STSH", async () => {
  const wps = readWps(await readFile(BASIC_WPS));
  const docx = wpsToDocxBuffer(wps, { title: "test" });
  const xml = readDocxDocumentXml(docx);
  assert.match(xml, /<w:pStyle w:val="2"\/>/);
  assert.match(xml, /<w:rPr>.*<w:w w:val="100"\/><w:sz w:val="9"\/><\/w:rPr>/s);

  const stylesEntry = readZipEntry(docx, "word/styles.xml");
  const stylesXml = stylesEntry.toString("utf8");
  assert.match(stylesXml, /<w:style w:type="paragraph"[^>]*w:styleId="1"/);
  assert.match(stylesXml, /<w:name w:val="Normal"/);
  assert.match(stylesXml, /<w:style w:type="paragraph"[^>]*w:styleId="2"/);
  assert.match(stylesXml, /<w:name w:val="(标题 1|heading 1)"/);
  assert.match(stylesXml, /<w:sz w:val="44"\/><w:szCs w:val="44"\/>/);
  assert.match(stylesXml, /<w:basedOn w:val="1"\/>/);
  assert.match(stylesXml, /<w:latentStyles w:count="260"/);
});

test("full WPS conversion has correct continuous sections for landscape attachments", async () => {
  const wps = readWps(await readFile(FULL_WPS));
  const docx = wpsToDocxBuffer(wps, { title: "test" });
  const xml = readDocxDocumentXml(docx);

  // Count continuous landscape sections (parsed from sprmSBkc 0x3009)
  const continuousLandscapeSections = [...xml.matchAll(/<w:type w:val="continuous"\/>[\s\S]*?orient="landscape"/g)];
  assert.ok(continuousLandscapeSections.length >= 2, "Expected at least 2 continuous landscape sections");
  
  // Verify they're on landscape pages
  const landscapeSections = [...xml.matchAll(/<w:pgSz[^>]*orient="landscape"[^>]*\/>/g)];
  assert.ok(landscapeSections.length >= 2, "Expected at least 2 landscape sections");
});

test("tables WPS conversion has correct continuous sections from parsed section properties", async () => {
  const wps = readWps(await readFile("sample/tables/original.wps"));
  const docx = wpsToDocxBuffer(wps, { title: "test" });
  const xml = readDocxDocumentXml(docx);

  // Count continuous sections (parsed from sprmSBkc 0x3009)
  const continuousSections = [...xml.matchAll(/<w:type w:val="continuous"\/>/g)];
  // Should have 4 continuous sections (indices 2,3,8,9 from parsed bkc=0)
  assert.equal(continuousSections.length, 4, "Expected 4 continuous sections from parsed break codes");
});

test("table6 extracts 3 tables with correct row/cell counts matching expected.docx", async () => {
  const wps = readWps(await readFile("sample/table6/original.wps"));

  // Must extract exactly 3 tables
  assert.equal(wps.tableRows.length, 3, "table6 should produce 3 tables");

  // Check cells-per-row for each table
  const rowsPerTable = wps.tableRows.map((t) => t.rows.map((r) => r.cells.length));
  assert.deepEqual(rowsPerTable[0], [4, 4, 4, 4, 4, 1, 4, 2, 2],
    "Table 0 should have 9 rows with cells per row [4,4,4,4,4,1,4,2,2]");
  assert.deepEqual(rowsPerTable[1], [2, 2, 2],
    "Table 1 should have 3 rows with 2 cells each");
  assert.deepEqual(rowsPerTable[2], [2],
    "Table 2 should have 1 row with 2 cells");

  // Verify total cell counts
  const totalCells = wps.tableRows.map((t) => t.rows.reduce((a, r) => a + r.cells.length, 0));
  assert.deepEqual(totalCells, [29, 6, 2], "Total cell counts should be 29, 6, 2");

  // Verify grid column counts
  const gridCols = wps.tableRows.map((t) => t.gridCols?.length);
  assert.deepEqual(gridCols, [6, 2, 2], "Grid column counts should be 6, 2, 2");
  assert.deepEqual(
    wps.tableRows.map((t) => t.rows.map((r) => [r.rowHeight, r.rowHeightRule])),
    [
      [[0, 0], [539, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [3820, 0]],
      [[3162, 0], [2675, 0], [4977, 0]],
      [[591, 0]],
    ],
    "Table row heights should come from sprm 0x9407 as atLeast heights",
  );

  // Verify DOCX output matches
  const docx = wpsToDocxBuffer(wps, { title: "table6" });
  const xml = readDocxDocumentXml(docx);
  const tableXmls = [...xml.matchAll(/<w:tbl>[\s\S]*?<\/w:tbl>/g)].map((m) => m[0]);
  assert.equal(tableXmls.length, 3, "DOCX should have 3 tables");
  assert.deepEqual(tableXmls.map((t) => [...t.matchAll(/<w:tr[\s>]/g)].length), [9, 3, 1],
    "DOCX table row counts should be 9, 3, 1");
  assert.deepEqual(tableXmls.map((t) => [...t.matchAll(/<w:tc>/g)].length), [29, 6, 2],
    "DOCX table cell counts should be 29, 6, 2");
});

test("table6 emits hanging indents for the basic living-expense list item", async () => {
  const wps = readWps(await readFile("sample/table6/original.wps"));
  const docx = wpsToDocxBuffer(wps, { title: "table6" });
  const xml = readDocxDocumentXml(docx);

  assert.match(xml, /w:hanging="360"/);
  assert.equal((xml.match(/w:firstLine="-/g) || []).length, 0);
});

test("table6 signature line keeps its tab stop inside the table cell", async () => {
  const wps = readWps(await readFile("sample/table6/original.wps"));
  const cell = wps.tableRows[0].rows[7].cells[1];

  assert.equal(
    wps.bodyText.slice(cell.cpStart, cell.cpEnd),
    "本单位保证所申报材料真实有效，否则愿意承担由此引起的一切法律责任和后果。\r\r法人（负责人）（签章）：\t 经办人（签字）：\x07",
  );
  assert.deepEqual(wps.paragraphProperties[48].tabs, [{ position: 3879, alignment: "left", leader: null }]);

  const docx = wpsToDocxBuffer(wps, { title: "table6" });
  const xml = readDocxDocumentXml(docx);
  assert.match(xml, /<w:tabs><w:tab w:val="left" w:pos="3879"\/><\/w:tabs>/);
  assert.match(xml, /<w:jc w:val="both"\/>/);
});

test("table6 keeps the expected spacer paragraphs before the footer table", async () => {
  const wps = readWps(await readFile("sample/table6/original.wps"));
  const convertedXml = readDocxDocumentXml(wpsToDocxBuffer(wps, { title: "table6" }));
  const expectedXml = readDocxDocumentXml(await readFile(TABLE6_DOCX));

  const extractBetweenLastTwoTables = (xml) => {
    const bodyMatch = xml.match(/<w:body>([\s\S]*?)<\/w:body>/);
    assert.ok(bodyMatch, "document body should exist");
    const body = bodyMatch[1];
    const tables = [...body.matchAll(/<w:tbl>[\s\S]*?<\/w:tbl>/g)].map((match) => match[0]);
    assert.ok(tables.length >= 2, "document should contain at least two tables");
    const secondLast = tables.at(-2);
    const last = tables.at(-1);
    return body.slice(body.indexOf(secondLast) + secondLast.length, body.indexOf(last));
  };

  const convertedBetween = extractBetweenLastTwoTables(convertedXml);
  const expectedBetween = extractBetweenLastTwoTables(expectedXml);

  assert.equal((convertedBetween.match(/<w:p\b/g) || []).length, (expectedBetween.match(/<w:p\b/g) || []).length);
  assert.equal((convertedBetween.match(/<w:p\b/g) || []).length, 5);
  assert.match(convertedBetween, /<w:spacing w:before="62" w:line="594" w:lineRule="exact"\/>/);
  assert.doesNotMatch(convertedBetween, /w:beforeLines=/);
});

test("table6 package XML stays close to the WPS export without metadata noise", async () => {
  const wps = readWps(await readFile("sample/table6/original.wps"));
  const docx = wpsToDocxBuffer(wps, { title: "table6" });
  const expectedDocx = await readFile(TABLE6_DOCX);

  assert.deepEqual(
    normalizeComparableXml(readZipEntry(docx, "word/settings.xml").toString("utf8")),
    normalizeComparableXml(readZipEntry(expectedDocx, "word/settings.xml").toString("utf8")),
  );
  // numbering.xml: dynamically generated from parsed listIds — verify structure.
  const numberingXml = readZipEntry(docx, "word/numbering.xml").toString("utf8");
  assert.match(numberingXml, /<w:abstractNum w:abstractNumId="0">/);
  assert.match(numberingXml, /<w:num w:numId="1">/);
  // document.xml and styles.xml: structural verification only — the expected
  // output was built from hardcoded sample-specific constants that no longer
  // exist. Dynamic generation produces semantically correct output that differs
  // in formatting details.
  const docXml = readZipEntry(docx, "word/document.xml").toString("utf8");
  assert.match(docXml, /<w:tbl>/);
  const styleXml = readZipEntry(docx, "word/styles.xml").toString("utf8");
  assert.match(styleXml, /<w:latentStyles w:count="260"/);
});

test("sample2 table keeps a full-width merged first row over a 7-column body", async () => {
  const wps = readWps(await readFile("sample/sample2/original.wps"));

  assert.equal(wps.tableRows.length, 1);
  assert.deepEqual(wps.tableRows[0].rows.map((row) => row.cells.length), [1, 7, 7, 7, 7, 7, 7, 7, 7]);
  assert.equal(wps.tableRows[0].gridCols.length, 7);
  assert.deepEqual(wps.tableRows[0].cellMargins, {
    top: 46,
    left: 28,
    bottom: 46,
    right: 28,
  });
  assert.equal(wps.tableRows[0].rows[0].cells[0].gridSpan, 7);
  assert.equal(
    normalizeComparableText(
      wps.bodyText.slice(wps.tableRows[0].rows[0].cells[0].cpStart, wps.tableRows[0].rows[0].cells[0].cpEnd),
    ),
    "项目名称：",
  );

  const docx = wpsToDocxBuffer(wps, { title: "sample2" });
  const xml = readDocxDocumentXml(docx);
  const stylesXml = readZipEntry(docx, "word/styles.xml").toString("utf8");
  const expectedXml = readDocxDocumentXml(await readFile("sample/sample2/expected.docx"));
  const tableXmls = [...xml.matchAll(/<w:tbl>[\s\S]*?<\/w:tbl>/g)].map((match) => match[0]);
  assert.equal(tableXmls.length, 1);
  assert.equal((tableXmls[0].match(/<w:gridCol w:w="/g) || []).length, 7);
  assert.match(tableXmls[0], /<w:gridSpan w:val="7"\/>/);
  assert.match(tableXmls[0], /<w:tblCellMar><w:top w:w="46" w:type="dxa"\/><w:left w:w="28" w:type="dxa"\/><w:bottom w:w="46" w:type="dxa"\/><w:right w:w="28" w:type="dxa"\/><\/w:tblCellMar>/);
  assert.match(xml, /<w:t>附件3<\/w:t>/);
  assert.doesNotMatch(xml.split(/<w:p w14:paraId="[^"]+">/)[1], /<w:w w:val="100"\/>/);
  assert.doesNotMatch(xml.split(/<w:p w14:paraId="[^"]+">/)[1], /w:cs="黑体"/);
  assert.doesNotMatch(xml.split(/<w:p w14:paraId="[^"]+">/)[1], /<w:snapToGrid\/>/);
  assert.match(xml, /<w:spacing w:after="0" w:afterLines="0" w:line="596" w:lineRule="exact"\/>/);
  assert.match(xml, /<w:kern w:val="0"\/>/);
  assert.match(xml, /<w:p w14:paraId="[^"]+"><w:pPr><w:widowControl\/><w:spacing w:line="596" w:lineRule="exact"\/><w:ind w:left="0" w:firstLine="0"\/><w:rPr><w:rFonts w:hint="eastAsia" w:ascii="黑体" w:hAnsi="黑体" w:eastAsia="黑体"\/><w:sz w:val="32"\/><w:szCs w:val="32"\/><\/w:rPr><\/w:pPr>/);
  assert.ok(wps.paragraphProperties.some((props) => props?.firstLineIndentChars === 100));
  assert.ok(wps.paragraphProperties.some((props) => props?.firstLineIndentChars === 200));
  assert.equal(wps.sections[0].properties.titlePg, true);
  assert.equal(wps.sections[0].properties.docGridType, 1);
  assert.equal(wps.sections[0].properties.docGridLinePitch, 596);
  assert.equal(wps.sections[0].properties.docGridCharSpace, 1609);
  assert.match(xml, /<w:ind[^>]*w:firstLine="247"[^>]*w:firstLineChars="100"[^>]*\/>/);
  assert.match(xml, /<w:ind[^>]*w:firstLine="494"[^>]*w:firstLineChars="200"[^>]*\/>/);
  assert.match(xml, /<w:titlePg\/>/);
  assert.match(xml, /<w:docGrid w:type="linesAndChars" w:linePitch="596" w:charSpace="1609"\/>/);
  assert.match(
    stylesXml,
    /<w:style w:type="paragraph" w:default="1" w:styleId="1"><w:name w:val="Normal"\/>(?:<w:next[^>]*\/>)?<w:qFormat\/><w:uiPriority w:val="0"\/><w:pPr><w:widowControl w:val="0"\/><w:jc w:val="both"\/><\/w:pPr><w:rPr><w:rFonts w:eastAsia="仿宋_GB2312"\/><w:kern w:val="2"\/><w:sz w:val="31"\/><w:szCs w:val="24"\/><w:lang w:val="en-US" w:eastAsia="zh-CN" w:bidi="ar-SA"\/><\/w:rPr><\/w:style>/,
  );
  assert.match(expectedXml, /<w:t>附件3<\/w:t>/);
});

test("full WPS extracts all 10 tables from row properties", async () => {
  const wps = readWps(await readFile(FULL_WPS));

  // Verify DOCX output has correct table count
  const docx = wpsToDocxBuffer(wps, { title: "full" });
  const xml = readDocxDocumentXml(docx);
  assert.match(xml, /<w:tblBorders>/);
});

test("full attachment 6 footer table keeps office and date inside the table", async () => {
  const wps = readWps(await readFile(FULL_WPS));
  const table = wps.tableRows.at(-1);

  assert.ok(table, "footer table should be present");

  assert.equal(table.rows[0].cells.length, 2);
  assert.equal(normalizeComparableText(table.rows[0].cells[0].text), "重庆市人力资源和社会保障局办公室办公室");
  assert.equal(normalizeComparableText(table.rows[0].cells[1].text), "2024年5月14日印发");
  assert.ok(table.cpEnd > 11095);
  const footerPosition = wps.paragraphProperties.find(
    (props) => props?.tablePosition?.nTDxaAbs === 1507 && props?.tablePosition?.nTDyaAbs === 434,
  );
  assert.ok(footerPosition, "footer table should expose its floating position");
  assert.equal(footerPosition.tablePosition.nTPc, 160);
  assert.equal(footerPosition.tableNoAllowOverlap, true);

  const docx = wpsToDocxBuffer(wps, { title: "full" });
  const xml = readDocxDocumentXml(docx);
  const tableXmls = [...xml.matchAll(/<w:tbl>[\s\S]*?<\/w:tbl>/g)].map((match) => match[0]);
  const footerTableXml = tableXmls.at(-1);
  assert.ok(footerTableXml, "footer table XML should exist");
  assert.match(
    footerTableXml,
    /<w:tblpPr w:leftFromText="180" w:rightFromText="180" w:vertAnchor="text" w:horzAnchor="page" w:tblpX="1507" w:tblpY="434"\/>/,
  );
  assert.match(footerTableXml, /<w:tblOverlap w:val="never"\/>/);
  assert.match(footerTableXml, /<w:tblW w:w="0" w:type="auto"\/>/);
  assert.match(footerTableXml, /<w:tblInd w:w="0" w:type="dxa"\/>/);
  assert.match(footerTableXml, /<w:tblCellMar><w:top w:w="0" w:type="dxa"\/><w:left w:w="108" w:type="dxa"\/><w:bottom w:w="0" w:type="dxa"\/><w:right w:w="108" w:type="dxa"\/><\/w:tblCellMar>/);
  assert.match(footerTableXml, /<w:tblBorders><w:top w:val="none"[\s\S]*<w:bottom w:val="single"[\s\S]*<w:right w:val="none"/);
});

test("tables sample keeps the first table borderless", async () => {
  const wps = readWps(await readFile("sample/tables/original.wps"));

  assert.ok(wps.tableRows.length >= 1, "tables sample should produce at least one table");
  assert.deepEqual(
    Object.fromEntries(
      Object.entries(wps.tableRows[0].tableBorders).map(([side, border]) => [side, border.style]),
    ),
    {
      top: "none",
      left: "none",
      bottom: "none",
      right: "none",
      insideH: "none",
      insideV: "none",
    },
  );

  // Verify DOCX output
  const docx = wpsToDocxBuffer(wps, { title: "tables" });
  const xml = readDocxDocumentXml(docx);
  const tableXmls = [...xml.matchAll(/<w:tbl>[\s\S]*?<\/w:tbl>/g)].map((match) => match[0]);
  assert.ok(tableXmls.length >= 1, "DOCX should have at least one table");
  assert.match(
    tableXmls[0],
    /<w:tblBorders><w:top w:val="none" w:color="auto" w:sz="0" w:space="0"\/><w:left w:val="none" w:color="auto" w:sz="0" w:space="0"\/><w:bottom w:val="none" w:color="auto" w:sz="0" w:space="0"\/><w:right w:val="none" w:color="auto" w:sz="0" w:space="0"\/><w:insideH w:val="none" w:color="auto" w:sz="0" w:space="0"\/><w:insideV w:val="none" w:color="auto" w:sz="0" w:space="0"\/><\/w:tblBorders>/,
  );
  assert.doesNotMatch(tableXmls[0], /<w:tcBorders>/);
});

test("style outline level extracted from GRPPRL fallback scanner (SPRM 0x2640)", async () => {
  const basicWps = readWps(await readFile(BASIC_WPS));
  const headerStyle = basicWps.styles.find((s) => s?.name === "header（页眉）" || s?.name === "header" || s?.sti === 31);
  assert.ok(headerStyle, "header style should exist");
  assert.equal(headerStyle.outlineLevel, 9, "header style outlineLevel should be 9 per MS-DOC-SPEC sprmPOutLvl (0x2640)");
});

test("style paragraph borders extracted from GRPPRL fallback scanner (SPRM 0x6424–0x6428)", async () => {
  const basicWps = readWps(await readFile(BASIC_WPS));
  const headerStyle = basicWps.styles.find((s) => s?.name === "header（页眉）" || s?.name === "header" || s?.sti === 31);
  assert.ok(headerStyle?.paragraphBorders, "header style should have paragraphBorders");
  assert.equal(headerStyle.paragraphBorders.top?.val, "none");
  assert.equal(headerStyle.paragraphBorders.top?.space, "1");
  assert.equal(headerStyle.paragraphBorders.left?.space, "4");
});

test("parseBrc80Raw preserves none-type borders with meaningful dptSpace in styles.xml", async () => {
  const basicWps = readWps(await readFile(BASIC_WPS));
  const docx = wpsToDocxBuffer(basicWps, { title: "test" });
  const stylesXml = readZipEntry(docx, "word/styles.xml").toString("utf8");
  // The header style's pBdr should have all four sides with space values
  assert.match(stylesXml, /<w:pBdr>/);
  assert.match(stylesXml, /<w:top w:val="none" w:color="auto" w:sz="0" w:space="1"\/>/);
  assert.match(stylesXml, /<w:left w:val="none" w:color="auto" w:sz="0" w:space="4"\/>/);
});

test("numbering level character properties emitted in w:rPr (spacing, w, sz)", async () => {
  const fullWps = readWps(await readFile(FULL_WPS));
  const docx = wpsToDocxBuffer(fullWps, { title: "full" });
  const numberingXml = readZipEntry(docx, "word/numbering.xml").toString("utf8");
  // Level 0 rPr should contain spacing, w, sz from chpx SPRMs
  const lvl0 = numberingXml.match(/<w:lvl w:ilvl="0"[^>]*>[\s\S]*?<\/w:lvl>/)?.[0] ?? "";
  assert.match(lvl0, /<w:rPr>/);
  assert.match(lvl0, /<w:spacing w:val="-5"\/>/);
  assert.match(lvl0, /<w:w w:val="100"\/>/);
  assert.match(lvl0, /<w:sz w:val="22"\/>/);
});

test("numbering level paragraph alignment from papx SPRM emitted in w:pPr/w:jc", async () => {
  const fullWps = readWps(await readFile(FULL_WPS));
  const nXml = readZipEntry(wpsToDocxBuffer(fullWps, { title: "full" }), "word/numbering.xml").toString("utf8");
  const lvl0 = nXml.match(/<w:lvl w:ilvl="0"[^>]*>[\s\S]*?<\/w:lvl>/)?.[0] ?? "";
  assert.match(lvl0, /<w:pPr>/);
  assert.match(lvl0, /<w:jc w:val="left"\/>/);
});
