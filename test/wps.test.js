import { readFile } from "node:fs/promises";
import test from "node:test";
import assert from "node:assert/strict";
import { readWps, normalizeComparableText } from "../src/index.js";
import { wpsToDocxBuffer } from "../src/docx.js";
import { readDocxMainText, readDocxDocumentXml, readZipEntry } from "./fixtures-docx.js";

const BASIC_WPS = "sample/basic/original.wps";
const BASIC_DOCX = "sample/basic/expected.docx";
const FULL_WPS = "sample/full/original.wps";
const FULL_DOCX = "sample/full/expected.docx";
const TABLE2_WPS = "sample/table2/original.wps";

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

  assert.deepEqual(wps.tableRows.map((table) => table.rows.map((row) => row.cells.length)), [
    [4, 6, 4, 1, 4, 1, 5],
    [5, 5, 5, 5, 5, 5, 5, 5],
    [5, 3, 2],
  ]);

  const secondTableFirstCell = wps.bodyText.slice(
    wps.tableRows[1].rows[0].cells[0].cpStart,
    wps.tableRows[1].rows[0].cells[0].cpEnd,
  );
  assert.equal(secondTableFirstCell, "政策落实\r（30 分）\x07");

  const docx = wpsToDocxBuffer(wps, { title: "table2" });
  const xml = readDocxDocumentXml(docx);
  const tableXmls = [...xml.matchAll(/<w:tbl>[\s\S]*?<\/w:tbl>/g)].map((match) => match[0]);
  assert.equal(tableXmls.length, 3);
  assert.deepEqual(tableXmls.map((tableXml) => [...tableXml.matchAll(/<w:tr[\s>]/g)].length), [7, 8, 3]);
  assert.deepEqual(tableXmls.map((tableXml) => [...tableXml.matchAll(/<w:tc>/g)].length), [25, 40, 10]);
  assert.match(tableXmls[0], /<w:tblW w:w="13118" w:type="dxa"\/>/);
  assert.match(tableXmls[1], /政策落实[\s\S]*30[\s\S]*分/);

  const sectionTypes = [...xml.matchAll(/<w:sectPr>([\s\S]*?)<\/w:sectPr>/g)]
    .map((match) => /<w:type w:val="continuous"\/>/.test(match[1]) ? "continuous" : null);
  assert.deepEqual(sectionTypes, ["continuous", "continuous", null, null]);
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
  assert.equal(normal.lineSpacing.rule, "atLeast");

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
  assert.match(xml, /<w:pStyle w:val="3"\/>/);
  assert.match(xml, /<w:rPr>.*<w:w w:val="100"\/><w:sz w:val="9"\/><w:szCs w:val="9"\/><\/w:rPr>/s);

  const stylesEntry = readZipEntry(docx, "word/styles.xml");
  const stylesXml = stylesEntry.toString("utf8");
  assert.match(stylesXml, /<w:style w:type="paragraph"[^>]*w:styleId="1"/);
  assert.match(stylesXml, /<w:name w:val="Normal"/);
  assert.match(stylesXml, /<w:style w:type="paragraph"[^>]*w:styleId="2"/);
  assert.match(stylesXml, /<w:name w:val="heading 1"/);
  assert.match(stylesXml, /<w:sz w:val="44"\/><w:szCs w:val="44"\/>/);
  assert.match(stylesXml, /<w:spacing w:line="240" w:lineRule="atLeast"\/>/);
  assert.match(stylesXml, /<w:basedOn w:val="1"\/>/);
});

test("full WPS conversion has correct 2-column sections for landscape attachments", async () => {
  const wps = readWps(await readFile(FULL_WPS));
  const docx = wpsToDocxBuffer(wps, { title: "test" });
  const xml = readDocxDocumentXml(docx);

  // Count 2-column continuous landscape sections  
  const twoColSections = [...xml.matchAll(/<w:cols[^>]*num="2"/g)];
  // Should have exactly 2 two-column sections (for 附件 2 and 附件 5 landscape areas)
  assert.equal(twoColSections.length, 2, "Expected 2 two-column sections for landscape attachment areas");
  
  // Verify they're on landscape pages
  const landscapeSections = [...xml.matchAll(/<w:pgSz[^>]*orient="landscape"[^>]*\/>/g)];
  assert.ok(landscapeSections.length >= 2, "Expected at least 2 landscape sections");
});

test("tables WPS conversion has correct 2-column continuous sections", async () => {
  const wps = readWps(await readFile("sample/tables/original.wps"));
  const docx = wpsToDocxBuffer(wps, { title: "test" });
  const xml = readDocxDocumentXml(docx);

  // Count 2-column continuous sections
  const twoColContinuous = [...xml.matchAll(/<w:cols[^>]*num="2"/g)];
  // Should have exactly 2 two-column sections (indices 2 and 8)
  assert.equal(twoColContinuous.length, 2, "Expected 2 two-column sections");
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

test("sample2 table keeps a full-width merged first row over a 7-column body", async () => {
  const wps = readWps(await readFile("sample/sample2/original.wps"));

  assert.equal(wps.tableRows.length, 1);
  assert.deepEqual(wps.tableRows[0].rows.map((row) => row.cells.length), [1, 7, 7, 7, 7, 7, 7, 7, 7]);
  assert.equal(wps.tableRows[0].gridCols.length, 7);
  assert.equal(wps.tableRows[0].rows[0].cells[0].gridSpan, 7);
  assert.equal(
    normalizeComparableText(
      wps.bodyText.slice(wps.tableRows[0].rows[0].cells[0].cpStart, wps.tableRows[0].rows[0].cells[0].cpEnd),
    ),
    "项目名称：",
  );

  const docx = wpsToDocxBuffer(wps, { title: "sample2" });
  const xml = readDocxDocumentXml(docx);
  const tableXmls = [...xml.matchAll(/<w:tbl>[\s\S]*?<\/w:tbl>/g)].map((match) => match[0]);
  assert.equal(tableXmls.length, 1);
  assert.equal((tableXmls[0].match(/<w:gridCol w:w="/g) || []).length, 7);
  assert.match(tableXmls[0], /<w:gridSpan w:val="7"\/>/);
});

test("full WPS extracts all 10 tables from row properties", async () => {
  const wps = readWps(await readFile(FULL_WPS));

  assert.equal(wps.tableRows.length, 10, "full should produce 10 tables");
  assert.deepEqual(
    wps.tableRows.map((table) => table.rows.map((row) => row.cells.length)),
    [
      [4, 4, 4],
      [4, 6, 4, 1, 4, 1, 5],
      [5, 5, 5, 5, 5, 5, 5, 5],
      [5, 3, 2],
      [4, 4, 4, 2, 2, 2, 2],
      [4, 6, 2, 7, 7, 7, 7, 4, 4, 1, 5, 5, 5, 2, 2, 2, 2, 2],
      [9, 9, 9, 9, 9, 9, 9],
      [4, 4, 4, 4, 4, 1, 4, 2, 2],
      [2, 2, 2],
      [2],
    ],
    "Tables should keep the expected row/cell structure"
  );

  // Spot-check key table structures (tables that were previously problematic)
  // Table 5 is the large table4-like table: 18 rows
  assert.equal(wps.tableRows[5].rows.length, 18, "Table 5 should have 18 rows");
  // Table 6 should have 7 rows
  assert.equal(wps.tableRows[6].rows.length, 7, "Table 6 should have 7 rows");
  // Table 9 should be the small footer table
  assert.equal(wps.tableRows[9].rows.length, 1, "Table 9 should have 1 row");
  assert.equal(wps.tableRows[9].rows[0].cells.length, 2, "Table 9 should have 2 cells");
  assert.ok(wps.tableRows[9].cpEnd > 11095, "Table 9 should include the footer date");

  // Verify DOCX output has correct table count
  const docx = wpsToDocxBuffer(wps, { title: "full" });
  const xml = readDocxDocumentXml(docx);
  const tableXmls = [...xml.matchAll(/<w:tbl>/g)];
  assert.equal(tableXmls.length, 10, "DOCX should have 10 tables");
});

test("full attachment 6 footer table keeps office and date inside the table", async () => {
  const wps = readWps(await readFile(FULL_WPS));
  const table = wps.tableRows[9];

  assert.equal(table.rows[0].cells.length, 2);
  assert.equal(normalizeComparableText(table.rows[0].cells[0].text), "重庆市人力资源和社会保障局办公室办公室");
  assert.equal(normalizeComparableText(table.rows[0].cells[1].text), "2024年5月14日印发");
  assert.ok(table.cpEnd > 11095);

  const docx = wpsToDocxBuffer(wps, { title: "full" });
  const text = readDocxMainText(docx);
  const footerIdx = text.indexOf("重庆市人力资源和社会保障局办公室办公室");
  assert.ok(footerIdx >= 0);
  assert.match(
    text.slice(footerIdx - 80, footerIdx + 50),
    /保险补贴（100 元\/人）。\n+重庆市人力资源和社会保障局办公室办公室\n2024年5月14日印发/,
  );

  const xml = readDocxDocumentXml(docx);
  const tableXmls = [...xml.matchAll(/<w:tbl>[\s\S]*?<\/w:tbl>/g)].map((match) => match[0]);
  const footerTableXml = tableXmls.at(-1);
  assert.ok(footerTableXml, "footer table XML should exist");
  assert.match(footerTableXml, /印发时间/);
  assert.doesNotMatch(footerTableXml, /<w:pStyle w:val="10"\/>/, "footer date paragraph should not use Table Paragraph");
  assert.match(footerTableXml, /<w:jc w:val="right"\/>/, "footer date paragraph should keep right alignment");
});

test("tables sample extracts all 10 tables with correct structure", async () => {
  const wps = readWps(await readFile("sample/tables/original.wps"));

  assert.equal(wps.tableRows.length, 10, "tables should produce 10 tables");
  assert.deepEqual(
    wps.tableRows.map((table) => table.rows.map((row) => row.cells.length)),
    [
      [4, 4, 4],
      [4, 6, 4, 1, 4, 1, 5],
      [5, 5, 5, 5, 5, 5, 5, 5],
      [5, 3, 2],
      [4, 4, 4, 2, 2, 2, 2],
      [4, 6, 2, 7, 7, 7, 7, 4, 4, 1, 5, 5, 5, 2, 2, 2, 2, 2],
      [9, 9, 9, 9, 9, 9, 9],
      [4, 4, 4, 4, 4, 1, 4, 2, 2],
      [2, 2, 2],
      [2],
    ],
    "Tables should keep the expected row/cell structure"
  );

  // Table 5 is the large table4-like table with 18 rows
  assert.equal(wps.tableRows[5].rows.length, 18, "Table 5 should have 18 rows");
  // Table 2 has 8 rows
  assert.equal(wps.tableRows[2].rows.length, 8, "Table 2 should have 8 rows");

  // Verify DOCX output
  const docx = wpsToDocxBuffer(wps, { title: "tables" });
  const xml = readDocxDocumentXml(docx);
  const tableXmls = [...xml.matchAll(/<w:tbl>/g)];
  assert.equal(tableXmls.length, 10, "DOCX should have 10 tables");
});

test("sample3 is parsed as one table instead of mark-count template fragments", async () => {
  const wps = readWps(await readFile("sample/sample3.wps"));

  assert.equal(wps.tableRows.length, 1);
  assert.equal(wps.tableRows[0].rows.length, 23);
  assert.ok(wps.tableRows[0].rows.every((row) => row.cells.length === 6));
  assert.equal(normalizeComparableText(wps.tableRows[0].rows[0].cells[0].text), "序号");
  assert.match(normalizeComparableText(wps.tableRows[0].rows.at(-1).cells[2].text), /面向人脸识别系统/);
});
