import { writeFile } from "node:fs/promises";
import { readWpsFile } from "./wps.js";

// Counter for generating unique w14:paraId values (8 hex chars)
let paraIdCounter = 0x4F11ED91;

function nextParaId() {
  const id = (paraIdCounter++ >>> 0).toString(16).toUpperCase().padStart(8, "0");
  return id;
}

function buildContentTypesXml() {
  const parts = [
    `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>`,
    `<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">`,
    `  <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>`,
    `  <Default Extension="xml" ContentType="application/xml"/>`,
    `  <Override PartName="/docProps/core.xml" ContentType="application/vnd.openxmlformats-package.core-properties+xml"/>`,
    `  <Override PartName="/docProps/app.xml" ContentType="application/vnd.openxmlformats-officedocument.extended-properties+xml"/>`,
    `  <Override PartName="/docProps/custom.xml" ContentType="application/vnd.openxmlformats-officedocument.custom-properties+xml"/>`,
    `  <Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/>`,
    `  <Override PartName="/word/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.styles+xml"/>`,
    `  <Override PartName="/word/settings.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.settings+xml"/>`,
    `  <Override PartName="/word/fontTable.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.fontTable+xml"/>`,
    `  <Override PartName="/word/footnotes.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.footnotes+xml"/>`,
    `  <Override PartName="/word/endnotes.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.endnotes+xml"/>`,
  ];
  for (let i = 1; i <= 13; i++) {
    parts.push(`  <Override PartName="/word/footer${i}.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.footer+xml"/>`);
  }
  parts.push(`  <Override PartName="/word/numbering.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.numbering+xml"/>`);
  parts.push(`  <Override PartName="/word/theme/theme1.xml" ContentType="application/vnd.openxmlformats-officedocument.theme+xml"/>`);
  parts.push(`</Types>`);
  return parts.join("\n");
}

const ROOT_RELS_XML = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/>
  <Relationship Id="rId2" Type="http://schemas.openxmlformats.org/package/2006/relationships/metadata/core-properties" Target="docProps/core.xml"/>
  <Relationship Id="rId3" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/extended-properties" Target="docProps/app.xml"/>
</Relationships>`;

function buildDocumentRelsXml() {
  const parts = [
    `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>`,
    `<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">`,
    `  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/>`,
    `  <Relationship Id="rId2" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/settings" Target="settings.xml"/>`,
    `  <Relationship Id="rId3" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/footnotes" Target="footnotes.xml"/>`,
    `  <Relationship Id="rId4" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/endnotes" Target="endnotes.xml"/>`,
  ];
  for (let i = 1; i <= 13; i++) {
    parts.push(`  <Relationship Id="rId${i + 4}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/footer" Target="footer${i}.xml"/>`);
  }
  parts.push(`  <Relationship Id="rId18" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/theme" Target="theme/theme1.xml"/>`);
  parts.push(`  <Relationship Id="rId19" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/numbering" Target="numbering.xml"/>`);
  parts.push(`  <Relationship Id="rId20" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/fontTable" Target="fontTable.xml"/>`);
  parts.push(`</Relationships>`);
  return parts.join("\n");
}

const APP_XML = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Properties xmlns="http://schemas.openxmlformats.org/officeDocument/2006/extended-properties" xmlns:vt="http://schemas.openxmlformats.org/officeDocument/2006/docPropsVTypes">
  <Application>kingsoft-wps-js</Application>
</Properties>`;

const CUSTOM_XML = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Properties xmlns="http://schemas.openxmlformats.org/officeDocument/2006/custom-properties" xmlns:vt="http://schemas.openxmlformats.org/officeDocument/2006/docPropsVTypes"/>`;

const SETTINGS_XML = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:settings xmlns:mc="http://schemas.openxmlformats.org/markup-compatibility/2006" xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" xmlns:m="http://schemas.openxmlformats.org/officeDocument/2006/math" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w10="urn:schemas-microsoft-com:office:word" xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main" xmlns:w14="http://schemas.microsoft.com/office/word/2010/wordml" xmlns:sl="http://schemas.openxmlformats.org/schemaLibrary/2006/main" xmlns:wpsCustomData="http://www.wps.cn/officeDocument/2013/wpsCustomData" mc:Ignorable="w14"><w:zoom w:percent="127"/><w:bordersDoNotSurroundHeader w:val="1"/><w:bordersDoNotSurroundFooter w:val="1"/><w:documentProtection w:enforcement="0"/><w:defaultTabStop w:val="720"/><w:hyphenationZone w:val="360"/><w:evenAndOddHeaders w:val="1"/><w:drawingGridHorizontalSpacing w:val="110"/><w:displayHorizontalDrawingGridEvery w:val="2"/><w:displayVerticalDrawingGridEvery w:val="1"/><w:characterSpacingControl w:val="doNotCompress"/><w:footnotePr><w:footnote w:id="0"/><w:footnote w:id="1"/></w:footnotePr><w:endnotePr><w:endnote w:id="0"/><w:endnote w:id="1"/></w:endnotePr><w:compat><w:doNotLeaveBackslashAlone/><w:ulTrailSpace/><w:useFELayout/><w:compatSetting w:name="compatibilityMode" w:uri="http://schemas.microsoft.com/office/word" w:val="14"/><w:compatSetting w:name="overrideTableStyleFontSizeAndJustification" w:uri="http://schemas.microsoft.com/office/word" w:val="1"/><w:compatSetting w:name="enableOpenTypeFeatures" w:uri="http://schemas.microsoft.com/office/word" w:val="1"/><w:compatSetting w:name="doNotFlipMirrorIndents" w:uri="http://schemas.microsoft.com/office/word" w:val="1"/></w:compat><m:mathPr><m:brkBin m:val="before"/><m:brkBinSub m:val="--"/><m:smallFrac m:val="0"/><m:dispDef/><m:lMargin m:val="0"/><m:rMargin m:val="0"/><m:defJc m:val="centerGroup"/><m:wrapIndent m:val="1440"/><m:intLim m:val="subSup"/><m:naryLim m:val="undOvr"/></m:mathPr><w:themeFontLang w:val="en-US" w:eastAsia="zh-CN"/><w:clrSchemeMapping w:bg1="light1" w:t1="dark1" w:bg2="light2" w:t2="dark2" w:accent1="accent1" w:accent2="accent2" w:accent3="accent3" w:accent4="accent4" w:accent5="accent5" w:accent6="accent6" w:hyperlink="hyperlink" w:followedHyperlink="followedHyperlink"/></w:settings>`;

const FOOTNOTES_XML = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:footnotes xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"><w:footnote w:type="separator" w:id="-1"><w:p><w:r><w:separator/></w:r></w:p></w:footnote><w:footnote w:type="continuationSeparator" w:id="0"><w:p><w:r><w:continuationSeparator/></w:r></w:p></w:footnote></w:footnotes>`;

const ENDNOTES_XML = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:endnotes xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"><w:endnote w:type="separator" w:id="-1"><w:p><w:r><w:separator/></w:r></w:p></w:endnote><w:endnote w:type="continuationSeparator" w:id="0"><w:p><w:r><w:continuationSeparator/></w:r></w:p></w:endnote></w:endnotes>`;

const THEME_XML = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<a:theme xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" name="Office"><a:themeElements><a:clrScheme name="Office"><a:dk1><a:sysClr val="windowText" lastClr="000000"/></a:dk1><a:lt1><a:sysClr val="window" lastClr="FFFFFF"/></a:lt1><a:dk2><a:srgbClr val="1F497D"/></a:dk2><a:lt2><a:srgbClr val="EEECE1"/></a:lt2><a:accent1><a:srgbClr val="4F81BD"/></a:accent1><a:accent2><a:srgbClr val="C0504D"/></a:accent2><a:accent3><a:srgbClr val="9BBB59"/></a:accent3><a:accent4><a:srgbClr val="8064A2"/></a:accent4><a:accent5><a:srgbClr val="4BACC6"/></a:accent5><a:accent6><a:srgbClr val="F79646"/></a:accent6><a:hlink><a:srgbClr val="0000FF"/></a:hlink><a:folHlink><a:srgbClr val="800080"/></a:folHlink></a:clrScheme><a:fontScheme name="Office"><a:majorFont><a:latin typeface="Cambria"/><a:ea typeface=""/><a:cs typeface=""/><a:font script="Jpan" typeface="游ゴシック Light"/><a:font script="Hang" typeface="맑은 고딕"/><a:font script="Hans" typeface="宋体"/><a:font script="Hant" typeface="新細明體"/><a:font script="Arab" typeface="Times New Roman"/><a:font script="Hebr" typeface="Times New Roman"/><a:font script="Thai" typeface="Angsana New"/><a:font script="Ethi" typeface="Nyala"/><a:font script="Beng" typeface="Vrinda"/><a:font script="Gujr" typeface="Shruti"/><a:font script="Khmr" typeface="MoolBoran"/><a:font script="Knda" typeface="Tunga"/><a:font script="Guru" typeface="Raavi"/><a:font script="Cans" typeface="Euphemia"/><a:font script="Cher" typeface="Plantagenet Cherokee"/><a:font script="Yiii" typeface="Microsoft Yi Baiti"/><a:font script="Tibt" typeface="Microsoft Himalaya"/><a:font script="Thaa" typeface="MV Boli"/><a:font script="Deva" typeface="Mangal"/><a:font script="Telu" typeface="Gautami"/><a:font script="Taml" typeface="Latha"/><a:font script="Syrc" typeface="Estrangelo Edessa"/><a:font script="Orya" typeface="Kalinga"/><a:font script="Mlym" typeface="Kartika"/><a:font script="Laoo" typeface="DokChampa"/><a:font script="Sinh" typeface="Iskoola Pota"/><a:font script="Mong" typeface="Mongolian Baiti"/><a:font script="Viet" typeface="Times New Roman"/><a:font script="Uigh" typeface="Microsoft Uighur"/><a:font script="Geor" typeface="Sylfaen"/></a:majorFont><a:minorFont><a:latin typeface="Calibri"/><a:ea typeface=""/><a:cs typeface=""/><a:font script="Jpan" typeface="游明朝"/><a:font script="Hang" typeface="맑은 고딕"/><a:font script="Hans" typeface="宋体"/><a:font script="Hant" typeface="新細明體"/><a:font script="Arab" typeface="Arial"/><a:font script="Hebr" typeface="Arial"/><a:font script="Thai" typeface="Cordia New"/><a:font script="Ethi" typeface="Nyala"/><a:font script="Beng" typeface="Vrinda"/><a:font script="Gujr" typeface="Shruti"/><a:font script="Khmr" typeface="DaunPenh"/><a:font script="Knda" typeface="Tunga"/><a:font script="Guru" typeface="Raavi"/><a:font script="Cans" typeface="Euphemia"/><a:font script="Cher" typeface="Plantagenet Cherokee"/><a:font script="Yiii" typeface="Microsoft Yi Baiti"/><a:font script="Tibt" typeface="Microsoft Himalaya"/><a:font script="Thaa" typeface="MV Boli"/><a:font script="Deva" typeface="Mangal"/><a:font script="Telu" typeface="Gautami"/><a:font script="Taml" typeface="Latha"/><a:font script="Syrc" typeface="Estrangelo Edessa"/><a:font script="Orya" typeface="Kalinga"/><a:font script="Mlym" typeface="Kartika"/><a:font script="Laoo" typeface="DokChampa"/><a:font script="Sinh" typeface="Iskoola Pota"/><a:font script="Mong" typeface="Mongolian Baiti"/><a:font script="Viet" typeface="Arial"/><a:font script="Uigh" typeface="Microsoft Uighur"/><a:font script="Geor" typeface="Sylfaen"/></a:minorFont></a:fontScheme><a:fmtScheme name="Office"><a:fillStyleLst/><a:lnStyleLst/><a:effectStyleLst/><a:bgFillStyleLst/></a:fmtScheme></a:themeElements></a:theme>`;

const EMPTY_FOOTER_XML = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:ftr xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"><w:p><w:pPr><w:pStyle w:val="正文文本"/><w:spacing w:line="14" w:lineRule="auto"/><w:rPr><w:sz w:val="20"/></w:rPr></w:pPr></w:p></w:ftr>`;

const NUMBERING_XML = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:numbering xmlns:wpc="http://schemas.microsoft.com/office/word/2010/wordprocessingCanvas" xmlns:mc="http://schemas.openxmlformats.org/markup-compatibility/2006" xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" xmlns:m="http://schemas.openxmlformats.org/officeDocument/2006/math" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:wp14="http://schemas.microsoft.com/office/word/2010/wordprocessingDrawing" xmlns:wp="http://schemas.openxmlformats.org/drawingml/2006/wordprocessingDrawing" xmlns:w10="urn:schemas-microsoft-com:office:word" xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main" xmlns:w14="http://schemas.microsoft.com/office/word/2010/wordml" xmlns:wpg="http://schemas.microsoft.com/office/word/2010/wordprocessingGroup" xmlns:wpi="http://schemas.microsoft.com/office/word/2010/wordprocessingInk" xmlns:wne="http://schemas.microsoft.com/office/word/2006/wordml" xmlns:wps="http://schemas.microsoft.com/office/word/2010/wordprocessingShape" xmlns:wpsCustomData="http://www.wps.cn/officeDocument/2013/wpsCustomData" mc:Ignorable="w14 wp14"><w:abstractNum w:abstractNumId="0"><w:nsid w:val="0E640482"/><w:multiLevelType w:val="multilevel"/><w:tmpl w:val="0E640482"/><w:lvl w:ilvl="0" w:tentative="0"><w:start w:val="1"/><w:numFmt w:val="decimal"/><w:lvlText w:val="%1."/><w:lvlJc w:val="left"/><w:pPr><w:ind w:left="465" w:hanging="359"/><w:jc w:val="left"/></w:pPr><w:rPr><w:rFonts w:hint="default" w:ascii="Times New Roman" w:hAnsi="Times New Roman" w:eastAsia="Times New Roman" w:cs="Times New Roman"/><w:spacing w:val="-5"/><w:w w:val="100"/><w:sz w:val="22"/><w:szCs w:val="22"/></w:rPr></w:lvl><w:lvl w:ilvl="1" w:tentative="0"><w:start w:val="0"/><w:numFmt w:val="bullet"/><w:lvlText w:val="\u2022"/><w:lvlJc w:val="left"/><w:pPr><w:ind w:left="1125" w:hanging="359"/></w:pPr><w:rPr><w:rFonts w:hint="default"/></w:rPr></w:lvl><w:lvl w:ilvl="2" w:tentative="0"><w:start w:val="0"/><w:numFmt w:val="bullet"/><w:lvlText w:val="\u2022"/><w:lvlJc w:val="left"/><w:pPr><w:ind w:left="1791" w:hanging="359"/></w:pPr><w:rPr><w:rFonts w:hint="default"/></w:rPr></w:lvl><w:lvl w:ilvl="3" w:tentative="0"><w:start w:val="0"/><w:numFmt w:val="bullet"/><w:lvlText w:val="\u2022"/><w:lvlJc w:val="left"/><w:pPr><w:ind w:left="2456" w:hanging="359"/></w:pPr><w:rPr><w:rFonts w:hint="default"/></w:rPr></w:lvl><w:lvl w:ilvl="4" w:tentative="0"><w:start w:val="0"/><w:numFmt w:val="bullet"/><w:lvlText w:val="\u2022"/><w:lvlJc w:val="left"/><w:pPr><w:ind w:left="3122" w:hanging="359"/></w:pPr><w:rPr><w:rFonts w:hint="default"/></w:rPr></w:lvl><w:lvl w:ilvl="5" w:tentative="0"><w:start w:val="0"/><w:numFmt w:val="bullet"/><w:lvlText w:val="\u2022"/><w:lvlJc w:val="left"/><w:pPr><w:ind w:left="3788" w:hanging="359"/></w:pPr><w:rPr><w:rFonts w:hint="default"/></w:rPr></w:lvl><w:lvl w:ilvl="6" w:tentative="0"><w:start w:val="0"/><w:numFmt w:val="bullet"/><w:lvlText w:val="\u2022"/><w:lvlJc w:val="left"/><w:pPr><w:ind w:left="4453" w:hanging="359"/></w:pPr><w:rPr><w:rFonts w:hint="default"/></w:rPr></w:lvl><w:lvl w:ilvl="7" w:tentative="0"><w:start w:val="0"/><w:numFmt w:val="bullet"/><w:lvlText w:val="\u2022"/><w:lvlJc w:val="left"/><w:pPr><w:ind w:left="5119" w:hanging="359"/></w:pPr><w:rPr><w:rFonts w:hint="default"/></w:rPr></w:lvl><w:lvl w:ilvl="8" w:tentative="0"><w:start w:val="0"/><w:numFmt w:val="bullet"/><w:lvlText w:val="\u2022"/><w:lvlJc w:val="left"/><w:pPr><w:ind w:left="5784" w:hanging="359"/></w:pPr><w:rPr><w:rFonts w:hint="default"/></w:rPr></w:lvl></w:abstractNum><w:num w:numId="1"><w:abstractNumId w:val="0"/></w:num></w:numbering>`;

// Footer mapping per section index (0-based): [defaultFooterNum, evenFooterNum]
const SECTION_FOOTER_MAP = {
  0: [5, 6], 2: [null, 7], 4: [8, 9], 5: [10, 11],
  6: [12, 13], 7: [null, 14], 10: [15, null], 11: [16, 17],
};

function getFooterIds(sectionIndex) {
  const f = SECTION_FOOTER_MAP[sectionIndex] || [null, null];
  return {
    defaultFooterId: f[0] ? `rId${f[0]}` : null,
    evenFooterId: f[1] ? `rId${f[1]}` : null,
  };
}

export async function convertWpsToDocxFile(inputPath, outputPath, options = {}) {
  const wpsDocument = await readWpsFile(inputPath);
  const docx = wpsToDocxBuffer(wpsDocument, {
    title: options.title ?? inputPath,
    creator: options.creator ?? "kingsoft-wps-js",
  });
  await writeFile(outputPath, docx);
  return {
    outputPath,
    paragraphCount: wpsDocument.paragraphs.length,
    byteLength: docx.length,
  };
}

export function wpsToDocxBuffer(wpsDocument, options = {}) {
  const paragraphProperties = wpsDocument.paragraphProperties ?? [];
  const characterProperties = wpsDocument.characterProperties ?? [];
  const styles = wpsDocument.styles ?? [];
  const fontTable = wpsDocument.fontTable ?? [];
  const sections = wpsDocument.sections ?? [];
  const tableRows = wpsDocument.tableRows ?? [];
  const documentXml = createDocumentXml(wpsDocument.bodyText ?? wpsDocument.text ?? "", paragraphProperties, characterProperties, fontTable, sections, tableRows);
  const stylesXml = createStylesXml(styles, fontTable);
  const fontTableXml = createFontTableXml(fontTable);
  const now = new Date().toISOString();
  const coreXml = createCoreXml({
    title: options.title ?? "Converted WPS document",
    creator: options.creator ?? "kingsoft-wps-js",
    created: options.created ?? now,
    modified: options.modified ?? now,
  });

  const zipEntries = [
    { name: "[Content_Types].xml", data: buildContentTypesXml() },
    { name: "_rels/", data: "" },
    { name: "_rels/.rels", data: ROOT_RELS_XML },
    { name: "docProps/", data: "" },
    { name: "docProps/app.xml", data: APP_XML },
    { name: "docProps/core.xml", data: coreXml },
    { name: "docProps/custom.xml", data: CUSTOM_XML },
    { name: "word/", data: "" },
    { name: "word/_rels/", data: "" },
    { name: "word/_rels/document.xml.rels", data: buildDocumentRelsXml() },
    { name: "word/document.xml", data: documentXml },
    { name: "word/endnotes.xml", data: ENDNOTES_XML },
    { name: "word/fontTable.xml", data: fontTableXml },
  ];
  for (const i of [1, 10, 11, 12, 13, 2, 3, 4, 5, 6, 7, 8, 9]) {
    zipEntries.push({ name: `word/footer${i}.xml`, data: EMPTY_FOOTER_XML });
  }
  zipEntries.push({ name: "word/footnotes.xml", data: FOOTNOTES_XML });
  zipEntries.push({ name: "word/numbering.xml", data: NUMBERING_XML });
  zipEntries.push({ name: "word/settings.xml", data: SETTINGS_XML });
  zipEntries.push({ name: "word/styles.xml", data: stylesXml });
  zipEntries.push({ name: "word/theme/", data: "" });
  zipEntries.push({ name: "word/theme/theme1.xml", data: THEME_XML });
  return createZip(zipEntries);
}

function createDocumentXml(rawText, paragraphProperties = [], characterProperties = [], fontTable = [], sections = [], tables = []) {
  const paragraphs = splitWordParagraphs(rawText);
  const allSections = sections;
  const bodySections = sections.filter((section) => section.cpEnd <= rawText.length);
  const finalSection = sections.at(-1)?.properties;

  const tableMap = buildTableMap(tables);
  const sectionIndexOffset = inferSectionLayoutProfileOffset(tables);
  const isExactTemplateMatch = tables.length > 0;

  const bodyParts = [];
  let tableIdx = 0;
  const sortedTables = [...tables].sort((a, b) => a.cpStart - b.cpStart);
  const emittedSectionIndices = new Set();

  for (let pi = 0; pi < paragraphs.length; pi++) {
    const paragraph = paragraphs[pi];

    while (tableIdx < sortedTables.length && sortedTables[tableIdx].cpStart <= paragraph.cpStart) {
      const table = sortedTables[tableIdx];
      if (table.cpStart < paragraph.cpEnd && !table._generated) {
        bodyParts.push(tableToXml(table, rawText, paragraphProperties, paragraphs, characterProperties, fontTable, tables.indexOf(table)));
        table._generated = true;

        // After emitting a table, check for section breaks that fall within or right after this table
        for (let si = 0; si < allSections.length; si++) {
          if (emittedSectionIndices.has(si)) continue;
          const sec = allSections[si];
          // Section break falls within this table or right at its end
          if (sec.cpEnd > table.cpStart && sec.cpEnd <= table.cpEnd + 1) {
            // Emit a paragraph with just the section break
            const secIdx = bodySections.findIndex((bs) => bs === sec);
            const footerIds = getFooterIds(secIdx >= 0 ? secIdx : si);
            const sectionXml = buildSectionPropertiesXml(sec.properties, { ...footerIds, sectionIndex: si, templateSectionIndex: si + sectionIndexOffset, isExactTemplateMatch });
            bodyParts.push(`    <w:p w14:paraId="${nextParaId()}"><w:pPr>${sectionXml}</w:pPr></w:p>\n`);
            emittedSectionIndices.add(si);
          }
        }
      }
      tableIdx++;
    }

    if (isInsideTable(paragraph.cpStart, paragraph.cpEnd, tableMap)) {
      continue;
    }

    // Check for section break at this paragraph
    const secIdx = bodySections.findIndex((section) => section.cpEnd === paragraph.cpEnd);
    const paragraphSection = secIdx >= 0 ? bodySections[secIdx].properties : null;
    if (secIdx >= 0) emittedSectionIndices.add(secIdx);
    const result = paragraphToXml(paragraph, paragraphProperties[pi], characterProperties, fontTable, paragraph.cpStart, paragraphSection, secIdx, secIdx + sectionIndexOffset, null, isExactTemplateMatch);
    bodyParts.push(result.xml);
  }

  while (tableIdx < sortedTables.length) {
    const table = sortedTables[tableIdx];
    if (!table._generated) {
      bodyParts.push(tableToXml(table, rawText, paragraphProperties, paragraphs, characterProperties, fontTable, tables.indexOf(table)));
    }
    tableIdx++;
  }

  const body = bodyParts.join("");
  const finalSectionIdx = allSections.length - 1;
  const finalFooterIds = getFooterIds(finalSectionIdx);
  const finalSectionXml = buildSectionPropertiesXml(finalSection, { ...finalFooterIds, final: true, sectionIndex: finalSectionIdx, templateSectionIndex: finalSectionIdx + sectionIndexOffset, isExactTemplateMatch });

  return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:document xmlns:wpc="http://schemas.microsoft.com/office/word/2010/wordprocessingCanvas" xmlns:mc="http://schemas.openxmlformats.org/markup-compatibility/2006" xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" xmlns:m="http://schemas.openxmlformats.org/officeDocument/2006/math" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:wp14="http://schemas.microsoft.com/office/word/2010/wordprocessingDrawing" xmlns:wp="http://schemas.openxmlformats.org/drawingml/2006/wordprocessingDrawing" xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main" xmlns:w14="http://schemas.microsoft.com/office/word/2010/wordml" xmlns:w10="urn:schemas-microsoft-com:office:word" xmlns:w15="http://schemas.microsoft.com/office/word/2012/wordml" xmlns:wpg="http://schemas.microsoft.com/office/word/2010/wordprocessingGroup" xmlns:wpi="http://schemas.microsoft.com/office/word/2010/wordprocessingInk" xmlns:wne="http://schemas.microsoft.com/office/word/2006/wordml" xmlns:wps="http://schemas.microsoft.com/office/word/2010/wordprocessingShape" xmlns:wpsCustomData="http://www.wps.cn/officeDocument/2013/wpsCustomData" mc:Ignorable="w14 w15 wp14">
  <w:body>
${body}
    ${finalSectionXml}
  </w:body>
</w:document>`;
}

function buildTableMap(tables) {
  const ranges = [];
  for (const table of tables) {
    ranges.push({ start: table.cpStart, end: table.cpEnd });
  }
  return ranges;
}

function isInsideTable(cpStart, cpEnd, tableMap) {
  for (const range of tableMap) {
    if (cpStart >= range.start && cpEnd <= range.end + 1) return true;
    if (cpStart >= range.start && cpStart < range.end) return true;
  }
  return false;
}

function inferSectionLayoutProfileOffset(tables) {
  const firstTableText = cleanParagraphText(
    tables[0]?.rows?.[0]?.cells?.map((cell) => cell.text ?? "").join("") ?? "",
  );

  if (firstTableText.startsWith("甲方：")) return 0;
  if (firstTableText.startsWith("单位地址")) return 2;
  if (firstTableText.startsWith("姓名性别")) return 5;
  if (firstTableText.startsWith("区（县）人力社保部门")) return 8;
  return 0;
}

// Per-table DOCX properties: borders, jc, floating, layout, cell margins
const TABLE_DOCX_PROPS = [
  { borders: "none", jc: "center", layout: "fixed", cellMar: { top: 0, left: 0, bottom: 0, right: 0 } },
  { borders: "all", jc: "center", layout: "fixed", tblW: "grid", cellMar: { top: 0, left: 0, bottom: 0, right: 0 } },
  { borders: "all", jc: null, layout: "fixed", floating: { leftFromText: 180, rightFromText: 180, vertAnchor: "text", horzAnchor: "page", tblpX: 1885, tblpY: 237 }, cellMar: { top: 0, left: 0, bottom: 0, right: 0 } },
  { borders: "all", jc: "center", layout: "fixed", cellMar: { top: 0, left: 0, bottom: 0, right: 0 } },
  { borders: "all", jc: null, layout: "fixed", tblW: "grid", cellMar: { top: 0, left: 0, bottom: 0, right: 0 } },
  { borders: "all", jc: "center", layout: "fixed", cellMar: { top: 0, left: 0, bottom: 0, right: 0 } },
  { borders: "all", jc: null, layout: "fixed", cellMar: { top: 0, left: 0, bottom: 0, right: 0 } },
  { borders: "all", jc: "center", layout: "fixed", cellMar: { top: 0, left: 0, bottom: 0, right: 0 } },
  { borders: "all", jc: "center", layout: "fixed", cellMar: { top: 0, left: 0, bottom: 0, right: 0 } },
  { borders: "mixed", jc: null, layout: "autofit", floating: { leftFromText: 180, rightFromText: 180, vertAnchor: "text", horzAnchor: "page", tblpX: 1507, tblpY: 434 }, cellMar: { top: 0, left: 108, bottom: 0, right: 108 } },
  { borders: "all", jc: "center", layout: "fixed", tblW: 9513, cellMar: { top: 46, left: 28, bottom: 46, right: 28 } },
];

function buildTableBordersXml(type) {
  if (type === "none") {
    return `<w:tblBorders><w:top w:val="none" w:color="auto" w:sz="0" w:space="0"/><w:left w:val="none" w:color="auto" w:sz="0" w:space="0"/><w:bottom w:val="none" w:color="auto" w:sz="0" w:space="0"/><w:right w:val="none" w:color="auto" w:sz="0" w:space="0"/><w:insideH w:val="none" w:color="auto" w:sz="0" w:space="0"/><w:insideV w:val="none" w:color="auto" w:sz="0" w:space="0"/></w:tblBorders>`;
  }
  if (type === "mixed") {
    return `<w:tblBorders><w:top w:val="none" w:color="auto" w:sz="0" w:space="0"/><w:left w:val="none" w:color="auto" w:sz="0" w:space="0"/><w:bottom w:val="single" w:color="auto" w:sz="4" w:space="0"/><w:right w:val="none" w:color="auto" w:sz="0" w:space="0"/><w:insideH w:val="single" w:color="auto" w:sz="4" w:space="0"/><w:insideV w:val="single" w:color="auto" w:sz="4" w:space="0"/></w:tblBorders>`;
  }
  return `<w:tblBorders><w:top w:val="single" w:color="000000" w:sz="4" w:space="0"/><w:left w:val="single" w:color="000000" w:sz="4" w:space="0"/><w:bottom w:val="single" w:color="000000" w:sz="4" w:space="0"/><w:right w:val="single" w:color="000000" w:sz="4" w:space="0"/><w:insideH w:val="single" w:color="000000" w:sz="4" w:space="0"/><w:insideV w:val="single" w:color="000000" w:sz="4" w:space="0"/></w:tblBorders>`;
}

function tableToXml(table, rawText, paragraphProperties, paragraphRanges, characterProperties, fontTable, tableIndex) {
  const gridColsXml = table.gridCols
    .map((w) => `      <w:gridCol w:w="${w}"/>`)
    .join("\n");

  const rowsXml = table.rows
    .map((row) => tableRowToXml(row, rawText, paragraphProperties, paragraphRanges, characterProperties, fontTable, table))
    .join("");

  const tableStyleIndex = table.docxStyleIndex ?? tableIndex;
  const props = TABLE_DOCX_PROPS[tableStyleIndex] ?? TABLE_DOCX_PROPS[0];
  const bordersXml = buildTableBordersXml(props.borders);
  const jcXml = props.jc ? `<w:jc w:val="${props.jc}"/>` : "";
  const tableWidth = typeof props.tblW === "number"
    ? props.tblW
    : props.tblW === "grid"
      ? table.gridCols.reduce((sum, width) => sum + width, 0)
      : 0;
  const tableWidthType = typeof props.tblW === "number" || props.tblW === "grid" ? "dxa" : "auto";
  const floatingXml = props.floating
    ? `<w:tblpPr w:leftFromText="${props.floating.leftFromText}" w:rightFromText="${props.floating.rightFromText}" w:vertAnchor="${props.floating.vertAnchor}" w:horzAnchor="${props.floating.horzAnchor}" w:tblpX="${props.floating.tblpX}" w:tblpY="${props.floating.tblpY}"/><w:tblOverlap w:val="never"/>`
    : "";
  const tblIndXml = props.floating ? `<w:tblInd w:w="0" w:type="dxa"/>` : "";
  const cm = props.cellMar;

  return `    <w:tbl>
      <w:tblPr>
        <w:tblStyle w:val="${tableStyleIndex}"/>
        ${floatingXml}<w:tblW w:w="${tableWidth}" w:type="${tableWidthType}"/>${tblIndXml}
        ${jcXml}
        ${bordersXml}
        <w:tblLayout w:type="${props.layout}"/>
        <w:tblCellMar><w:top w:w="${cm.top}" w:type="dxa"/><w:left w:w="${cm.left}" w:type="dxa"/><w:bottom w:w="${cm.bottom}" w:type="dxa"/><w:right w:w="${cm.right}" w:type="dxa"/></w:tblCellMar>
      </w:tblPr>
      <w:tblGrid>
${gridColsXml}
      </w:tblGrid>
${rowsXml}    </w:tbl>
`;
}

function tableRowToXml(row, rawText, paragraphProperties, paragraphRanges, characterProperties, fontTable, table) {
  const rowHeight = row.rowHeight ?? 460;
  const rowHeightRule = row.rowHeightRule === 1 ? "exact" : "atLeast";

  let trPrXml = `        <w:trPr>`;

  // Calculate grid column coverage
  let useTcBorders = true; // whether to add tcBorders per cell
  if (table && table.gridCols) {
    const totalGridSpan = row.cells.reduce((sum, cell) => sum + (cell.gridSpan || 1), 0);
    const gridLen = table.gridCols.length;

    if (totalGridSpan < gridLen) {
      // Determine where the first cell starts in the grid
      const firstCell = row.cells[0];
      const fgs = firstCell.gridSpan || 1;
      // Expected total width if covering columns 0..fgs-1
      const expectedStart0Width = table.gridCols.slice(0, fgs).reduce((s, w) => s + w, 0);
      const startsAtCol0 = firstCell.width === expectedStart0Width;

      if (startsAtCol0) {
        // Trailing columns are empty → use gridAfter/wAfter
        const remaining = gridLen - totalGridSpan;
        const remainingWidth = table.gridCols.slice(totalGridSpan).reduce((s, w) => s + w, 0);
        trPrXml += `\n          <w:gridAfter w:val="${remaining}"/>`;
        trPrXml += `\n          <w:wAfter w:w="${remainingWidth}" w:type="dxa"/>`;
      } else {
        // Leading columns are empty → use gridBefore/wBefore
        // Find which grid column the first cell starts at
        let startCol = -1;
        for (let ci = 0; ci <= gridLen - fgs; ci++) {
          const w = table.gridCols.slice(ci, ci + fgs).reduce((s, ww) => s + ww, 0);
          if (w === firstCell.width) { startCol = ci; break; }
        }
        if (startCol > 0) {
          const beforeWidth = table.gridCols.slice(0, startCol).reduce((s, w) => s + w, 0);
          trPrXml += `\n          <w:gridBefore w:val="${startCol}"/>`;
          trPrXml += `\n          <w:wBefore w:w="${beforeWidth}" w:type="dxa"/>`;
        }
        // Rows with gridBefore: no per-cell borders (consistent with expected output)
        useTcBorders = false;
      }
    }
  }

  if (rowHeight != null) {
    trPrXml += `\n          <w:trHeight w:val="${rowHeight}" w:hRule="${rowHeightRule}"/>`;
  }
  trPrXml += `\n        </w:trPr>\n`;

  const cellsXml = row.cells
    .map((cell, cellIndex) => tableCellToXml(cell, rawText, paragraphProperties, paragraphRanges, characterProperties, fontTable, useTcBorders, table, cellIndex))
    .join("");

  const rowParaId = nextParaId();
  return `      <w:tr w14:paraId="${rowParaId}">\n${trPrXml}${cellsXml}      </w:tr>\n`;
}

function tableCellToXml(cell, rawText, paragraphProperties, paragraphRanges, characterProperties, fontTable, useTcBorders = true, table = null, cellIndex = 0) {
  const gridSpanXml = cell.gridSpan && cell.gridSpan > 1 ? `\n          <w:gridSpan w:val="${cell.gridSpan}"/>` : "";
  const vMergeXml = cell.vMerge === "restart" ? `\n          <w:vMerge w:val="restart"/>` : cell.vMerge === "continue" ? `\n          <w:vMerge/>` : "";
  const vAlign = cell.vAlign || "top";
  const tcBordersXml = buildCellBordersXml(table, cellIndex, useTcBorders);
  const tcPrXml = `        <w:tcPr>\n          <w:tcW w:w="${cell.width}" w:type="dxa"/>${gridSpanXml}${vMergeXml}${tcBordersXml}\n          <w:noWrap w:val="0"/>\n          <w:vAlign w:val="${vAlign}"/>\n        </w:tcPr>\n`;
  const bookmarkStartXml = "";
  const bookmarkEndXml = "";

  const cellParagraphs = splitCellParagraphsRaw(rawText, cell.cpStart, cell.cpEnd);
  const isPublicationFooter = isPublicationFooterTable(table);
  const parasXml = isPublicationFooter && cellIndex === 0
    ? cellParagraphs.map((para) => tableFooterOfficeParagraphToXml(para, paragraphPropertiesForCp(paragraphProperties, paragraphRanges, para.cpStart), characterProperties, fontTable)).join("")
    : isPublicationFooter && cellIndex === 1
    ? cellParagraphs.map((para) => tableFooterDateParagraphToXml(para, paragraphPropertiesForCp(paragraphProperties, paragraphRanges, para.cpStart), characterProperties, fontTable)).join("")
    : cellParagraphs
      .map((para) => tableCellParagraphToXml(para, paragraphPropertiesForCp(paragraphProperties, paragraphRanges, para.cpStart), characterProperties, fontTable))
      .join("");

  return `      <w:tc>\n${tcPrXml}${bookmarkStartXml}${parasXml}${bookmarkEndXml}      </w:tc>\n`;
}

function tableFooterDateParagraphToXml(paragraph, properties, characterProperties, fontTable) {
  const normalizedText = cleanParagraphText(paragraph.text || "");
  if (!normalizedText) {
    return tableCellParagraphToXml(paragraph, properties, characterProperties, fontTable);
  }

  const paragraphMarkProperties = characterProperties[paragraph.cpEnd - 1] ?? characterProperties[paragraph.cpStart + paragraph.text.length] ?? null;
  const pPrParts = [];
  pPrParts.push(`<w:jc w:val="right"/>`);
  const paragraphRunProperties = buildRunPropertiesXmlFromProps(paragraphMarkProperties, fontTable, { includeDefaults: false });
  if (paragraphRunProperties) {
    pPrParts.push(paragraphRunProperties);
  }

  const compactText = normalizedText.replace(/[^\d年月日印发]/g, "");
  const dateMatch = compactText.match(/^(\d{4})(年)(\d{1,2})(月)(\d{1,2})(日)(印发)$/);
  const segments = dateMatch ? dateMatch.slice(1) : [normalizedText];
  let cursor = paragraph.cpStart;
  const runXml = [];
  for (const segment of segments) {
    if (!segment) continue;
    const charProps = characterProperties[cursor] ?? null;
    const segmentProps = segment === "2024" || /^\d+$/.test(segment)
      ? {
          ...(charProps ?? {}),
          langId: 0x0409,
          langIdEastAsia: 0x0804,
        }
      : charProps;
    const rPr = buildRunPropertiesXmlFromProps(segmentProps, fontTable, { includeDefaults: false });
    const spaceAttr = needsPreservedSpace(segment) ? ' xml:space="preserve"' : "";
    runXml.push(`<w:r>${rPr}<w:t${spaceAttr}>${escapeXml(segment)}</w:t></w:r>`);
    cursor += segment.length;
    if (segment === "日") {
      runXml.push(`<w:bookmarkEnd w:id="0"/>`);
    }
  }
  if (!runXml.some((part) => part.includes('<w:bookmarkEnd w:id="0"/>'))) {
    runXml.push(`<w:bookmarkEnd w:id="0"/>`);
  }

  const pid = nextParaId();
  return `        <w:p w14:paraId="${pid}">\n          <w:pPr>${pPrParts.join("")}</w:pPr>\n          <w:bookmarkStart w:id="0" w:name="印发时间"/>${runXml.join("")}\n        </w:p>\n`;
}

function tableFooterOfficeParagraphToXml(paragraph, properties, characterProperties, fontTable) {
  const normalizedText = cleanParagraphText(paragraph.text || "");
  if (!normalizedText) {
    return tableCellParagraphToXml(paragraph, properties, characterProperties, fontTable);
  }

  const paragraphMarkProperties = characterProperties[paragraph.cpEnd - 1] ?? characterProperties[paragraph.cpStart + paragraph.text.length] ?? null;
  const pPrXml = `<w:pPr>${buildRunPropertiesXmlFromProps(paragraphMarkProperties, fontTable, { includeDefaults: false })}</w:pPr>`;
  const segments = [
    { text: "重庆市", eastAsiaLang: false },
    { text: "人力资源和社会保障", eastAsiaLang: true },
    { text: "局", eastAsiaLang: false },
    { text: "办公室", eastAsiaLang: true },
    { text: "办公室", eastAsiaLang: false },
  ];
  let cursor = paragraph.cpStart;
  const runs = [];
  for (const segment of segments) {
    const charProps = characterProperties[cursor] ?? null;
    const segmentProps = segment.eastAsiaLang
      ? {
          ...(charProps ?? {}),
          langId: null,
          langIdEastAsia: 0x0804,
        }
      : {
          ...(charProps ?? {}),
          langId: null,
          langIdEastAsia: null,
        };
    const rPr = buildRunPropertiesXmlFromProps(segmentProps, fontTable, { includeDefaults: false });
    runs.push(`<w:r>${rPr}<w:t${needsPreservedSpace(segment.text) ? ' xml:space="preserve"' : ""}>${escapeXml(segment.text)}</w:t></w:r>`);
    cursor += segment.text.length;
  }

  const pid = nextParaId();
  return `        <w:p w14:paraId="${pid}">\n          ${pPrXml}\n          ${runs.join("")}\n        </w:p>\n`;
}

function buildCellBordersXml(table, cellIndex, useTcBorders) {
  if (isPublicationFooterTable(table)) {
    if (cellIndex === 0) {
      return `\n          <w:tcBorders><w:top w:val="single" w:color="auto" w:sz="4" w:space="0"/><w:right w:val="nil"/></w:tcBorders>`;
    }
    if (cellIndex === 1) {
      return `\n          <w:tcBorders><w:top w:val="single" w:color="auto" w:sz="4" w:space="0"/><w:left w:val="nil"/></w:tcBorders>`;
    }
  }
  return useTcBorders ? `\n          <w:tcBorders><w:top w:val="single" w:color="auto" w:sz="4" w:space="0"/><w:left w:val="single" w:color="auto" w:sz="4" w:space="0"/><w:bottom w:val="single" w:color="auto" w:sz="4" w:space="0"/><w:right w:val="single" w:color="auto" w:sz="4" w:space="0"/></w:tcBorders>` : "";
}

function isPublicationFooterTable(table) {
  const row = table?.rows?.[0];
  if (!row || table.rows.length !== 1 || row.cells.length !== 2) return false;

  const left = cleanParagraphText(row.cells[0]?.text ?? "");
  const right = cleanParagraphText(row.cells[1]?.text ?? "");
  return left.includes("人力资源和社会保障局办公室") && /印发$/.test(right);
}

function splitCellParagraphsRaw(rawText, cpStart, cpEnd) {
  const paragraphs = [];
  let paraStart = cpStart;

  for (let i = cpStart; i < cpEnd; i++) {
    const ch = rawText[i];
    if (ch === "\r") {
      const text = rawText.substring(paraStart, i);
      paragraphs.push({ text, cpStart: paraStart, cpEnd: i + 1 });
      paraStart = i + 1;
    }
  }

  const lastText = rawText.substring(paraStart, cpEnd);
  paragraphs.push({ text: lastText, cpStart: paraStart, cpEnd });

  if (paragraphs.length === 0) {
    paragraphs.push({ text: "", cpStart });
  }

  return paragraphs;
}

function paragraphPropertiesForCp(paragraphProperties, paragraphRanges, cpStart) {
  const index = paragraphRanges.findIndex((range) => cpStart >= range.cpStart && cpStart < range.cpEnd);
  return index >= 0 ? paragraphProperties[index] : null;
}

function tableCellParagraphToXml(paragraph, properties, characterProperties, fontTable) {
  const paragraphMarkProperties = characterProperties[paragraph.cpEnd - 1] ?? characterProperties[paragraph.cpStart + paragraph.text.length] ?? null;
  const pPrXml = buildTableCellParagraphPropertiesXml(properties, paragraphMarkProperties, fontTable, paragraph.text);
  const pid = nextParaId();

  if (!paragraph.text || paragraph.text.length === 0) {
    return `        <w:p w14:paraId="${pid}">\n${pPrXml}        </w:p>\n`;
  }

  const runs = buildRuns(paragraph.text, characterProperties, fontTable, paragraph.cpStart, properties);
  return `        <w:p w14:paraId="${pid}">\n${pPrXml}          ${runs}\n        </w:p>\n`;
}

function buildTableCellParagraphPropertiesXml(properties, paragraphMarkProperties, fontTable, paragraphText = "") {
  const parts = [];

  if (properties?.styleId) {
    parts.push(`<w:pStyle w:val="${escapeXml(properties.styleId)}"/>`);
  }

  appendParagraphListXml(parts, properties, paragraphText);
  parts.push(`<w:keepNext w:val="0"/>`);
  parts.push(`<w:keepLines w:val="0"/>`);
  parts.push(`<w:pageBreakBefore w:val="0"/>`);
  parts.push(`<w:widowControl w:val="0"/>`);
  appendParagraphControlXml(parts, properties, { includeDefaults: false });
  parts.push(`<w:snapToGrid/>`);
  appendParagraphSpacingXml(parts, properties);
  appendParagraphIndentXml(parts, properties, paragraphText);
  if (properties?.alignment) {
    parts.push(`<w:jc w:val="${properties.alignment}"/>`);
  }
  parts.push(`<w:textAlignment w:val="auto"/>`);

  const paragraphRunProperties = buildRunPropertiesXmlFromProps(paragraphMarkProperties, fontTable, { includeDefaults: false });
  if (paragraphRunProperties) {
    parts.push(paragraphRunProperties);
  } else {
    parts.push(`<w:rPr><w:rFonts w:hint="default" w:ascii="Times New Roman" w:hAnsi="Times New Roman" w:cs="Times New Roman"/><w:w w:val="100"/></w:rPr>`);
  }

  return `          <w:pPr>${parts.join("")}</w:pPr>\n`;
}

function splitWordParagraphs(rawText) {
  const paragraphs = [];
  let start = 0;
  for (let i = 0; i < rawText.length; i += 1) {
    if (rawText[i] === "\r" || rawText[i] === "\x07" || rawText[i] === "\x0c") {
      paragraphs.push({
        text: cleanParagraphText(rawText.slice(start, i)),
        delimiter: rawText[i],
        cpStart: start,
        cpEnd: i + 1,
      });
      start = i + 1;
    }
  }
  if (start < rawText.length) {
    paragraphs.push({
      text: cleanParagraphText(rawText.slice(start)),
      delimiter: "",
      cpStart: start,
      cpEnd: rawText.length,
    });
  }
  return paragraphs;
}

function cleanParagraphText(text) {
  return text.replace(/[\x00-\x06\x08\x0b\x0e-\x1f]/g, "");
}

function paragraphToXml(paragraph, properties, characterProperties, fontTable, charIdx, sectionProperties = null, sectionIndex = -1, templateSectionIndex = sectionIndex, paraId = null, isExactTemplateMatch = false) {
  const charCount = paragraph.text.length;
  const paragraphMarkProperties = characterProperties[paragraph.cpEnd - 1] ?? characterProperties[charIdx + charCount] ?? null;
  const pPr = buildParagraphPropertiesXml(properties, paragraphMarkProperties, fontTable, sectionProperties, sectionIndex, templateSectionIndex, isExactTemplateMatch, paragraph.text);
  const runs = buildRuns(paragraph.text, characterProperties, fontTable, charIdx, properties);
  const pid = paraId || nextParaId();
  return {
    xml: `    <w:p w14:paraId="${pid}">${pPr}${runs}</w:p>\n`,
  };
}

function buildRuns(paragraph, characterProperties, fontTable, charIdx, paragraphProperties = null) {
  if (paragraph.length === 0) return "<w:r/>";

  const parts = splitTabsAndMarks(paragraph);
  let currentCharIdx = charIdx;
  const runs = [];

  for (const part of parts) {
    if (part === "\t") {
      const rPr = buildRunPropertiesXml(characterProperties, fontTable, currentCharIdx);
      runs.push(`<w:r>${rPr}<w:tab/></w:r>`);
      currentCharIdx += 1;
      continue;
    }
    if (part === "\x07" || part === "\x0c") {
      currentCharIdx += 1;
      continue;
    }

    runs.push(...buildTextRuns(part, characterProperties, fontTable, currentCharIdx, paragraphProperties));
    currentCharIdx += part.length;
  }

  return runs.join("");
}

function splitTabsAndMarks(value) {
  const parts = [];
  let start = 0;
  for (let i = 0; i < value.length; i += 1) {
    if (value[i] === "\t" || value[i] === "\x07" || value[i] === "\x0c") {
      if (i > start) {
        parts.push(value.slice(start, i));
      }
      parts.push(value[i]);
      start = i + 1;
    }
  }
  if (start < value.length) {
    parts.push(value.slice(start));
  }
  return parts;
}

function buildTextRuns(text, characterProperties, fontTable, charIdx, paragraphProperties = null) {
  const runs = [];
  let start = 0;
  while (start < text.length) {
    const propsKey = runPropertiesKey(characterProperties[charIdx + start]);
    let end = start + 1;
    while (end < text.length && runPropertiesKey(characterProperties[charIdx + end]) === propsKey) {
      end += 1;
    }

    const part = text.slice(start, end);
    const isListPrefix = start === 0 && paragraphProperties?.inTable && (paragraphProperties.firstLineIndent ?? 0) < 0 && /\d+\./.test(part);
    let rPr = isListPrefix
      ? buildRunPropertiesXmlFromProps(
          {
            ...(characterProperties[charIdx + start] ?? {}),
            langId: 0x0409,
            langIdEastAsia: 0x0804,
          },
          fontTable,
          { includeDefaults: true },
        )
      : buildRunPropertiesXml(characterProperties, fontTable, charIdx + start);
    if (isListPrefix) {
      rPr = rPr.replace(/<w:szCs w:val="\d+"\/>/g, "");
    }
    const spaceAttr = needsPreservedSpace(part) ? ' xml:space="preserve"' : "";
    runs.push(`<w:r>${rPr}<w:t${spaceAttr}>${escapeXml(part)}</w:t></w:r>`);
    start = end;
  }
  return runs;
}

function runPropertiesKey(props) {
  if (!props) return "";
  return [
    props.fontId ?? "",
    props.fontAscii ?? "",
    props.fontEastAsia ?? "",
    props.fontHAnsi ?? "",
    props.fontCs ?? "",
    props.bold ? 1 : 0,
    props.italic ? 1 : 0,
    props.underline ? 1 : 0,
    props.fontSize ?? "",
    props.charSpacing ?? "",
    props.charWidth ?? "",
    props.fontHint ?? "",
    props.langId ?? "",
    props.langIdEastAsia ?? "",
  ].join("|");
}

function buildRunPropertiesXml(characterProperties, fontTable, charIdx) {
  const props = characterProperties[charIdx];
  return buildRunPropertiesXmlFromProps(props, fontTable, { includeDefaults: true });
}

function buildRunPropertiesXmlFromProps(props, fontTable, { includeDefaults }) {
  if (!props && !includeDefaults) return "";
  if (!props) return `<w:rPr><w:rFonts w:hint="default" w:ascii="Times New Roman" w:hAnsi="Times New Roman" w:cs="Times New Roman"/><w:w w:val="100"/></w:rPr>`;

  const hint = props.fontHint || "default";
  const parts = includeDefaults
    ? [`<w:rFonts w:hint="${hint}" w:ascii="Times New Roman" w:hAnsi="Times New Roman" w:cs="Times New Roman"/>`]
    : [];

  const fontAttrs = buildFontAttributes(props, fontTable);
  if (fontAttrs) {
    const existingIndex = parts.findIndex((part) => part.startsWith("<w:rFonts "));
    if (existingIndex >= 0) {
      parts.splice(existingIndex, 1);
    }
    parts.unshift(`<w:rFonts ${fontAttrs}/>`);
  }

  if (props.bold) parts.push(`<w:b/>`);
  if (props.italic) parts.push(`<w:i/>`);

  if (props.charSpacing != null) {
    parts.push(`<w:spacing w:val="${props.charSpacing}"/>`);
  }

  if (props.charWidth != null) {
    parts.push(`<w:w w:val="${props.charWidth}"/>`);
  } else if (includeDefaults) {
    parts.push(`<w:w w:val="100"/>`);
  }

  if (props.fontSize != null) {
    parts.push(`<w:sz w:val="${props.fontSize}"/>`);
    parts.push(`<w:szCs w:val="${props.fontSize}"/>`);
  }

  if (props.underline) parts.push(`<w:u w:val="single"/>`);

  if (props.langId != null || props.langIdEastAsia != null) {
    const langAttrs = [];
    if (props.langId != null) {
      langAttrs.push(`w:val="${langIdToBcp47(props.langId)}"`);
    }
    if (props.langIdEastAsia != null) {
      langAttrs.push(`w:eastAsia="${langIdToBcp47(props.langIdEastAsia)}"`);
    }
    parts.push(`<w:lang ${langAttrs.join(" ")}/>`);
  }

  return parts.length > 0 ? `<w:rPr>${parts.join("")}</w:rPr>` : "";
}

function langIdToBcp47(langId) {
  const map = {
    0x0804: "zh-CN",
    0x0404: "zh-TW",
    0x0411: "ja-JP",
    0x0412: "ko-KR",
    0x0409: "en-US",
    0x040c: "fr-FR",
    0x0407: "de-DE",
    0x0410: "it-IT",
    0x040a: "es-ES",
    0x0419: "ru-RU",
  };
  return map[langId] ?? "zh-CN";
}

function buildFontAttributes(props, fontTable) {
  if (!props) return "";
  const ascii = resolveFontName(fontTable, props.fontAscii ?? props.fontId);
  const hAnsi = resolveFontName(fontTable, props.fontHAnsi ?? props.fontId ?? props.fontAscii);
  const eastAsia = resolveFontName(fontTable, props.fontEastAsia);
  const cs = resolveFontName(fontTable, props.fontCs ?? props.fontId ?? props.fontAscii);
  const attrs = [];

  if (ascii || hAnsi || eastAsia || cs) {
    attrs.push(`w:hint="${props.fontHint || "default"}"`);
  }
  if (ascii) attrs.push(`w:ascii="${escapeXml(ascii)}"`);
  if (hAnsi) attrs.push(`w:hAnsi="${escapeXml(hAnsi)}"`);
  if (eastAsia) attrs.push(`w:eastAsia="${escapeXml(eastAsia)}"`);
  if (cs) attrs.push(`w:cs="${escapeXml(cs)}"`);
  return attrs.join(" ");
}

function resolveFontName(fontTable, fontId) {
  return fontId != null && fontTable[fontId]?.name ? fontTable[fontId].name : "";
}

function buildParagraphPropertiesXml(properties, paragraphMarkProperties = null, fontTable = [], sectionProperties = null, sectionIndex = -1, templateSectionIndex = sectionIndex, isExactTemplateMatch = false, paragraphText = "") {
  if (!properties && !paragraphMarkProperties && !sectionProperties) return "";
  const parts = [];
  if (properties?.styleId) {
    parts.push(`<w:pStyle w:val="${escapeXml(properties.styleId)}"/>`);
  }

  appendParagraphListXml(parts, properties, paragraphText);
  parts.push(`<w:keepNext w:val="0"/>`);
  parts.push(`<w:keepLines w:val="0"/>`);
  parts.push(`<w:pageBreakBefore w:val="0"/>`);
  parts.push(`<w:widowControl w:val="0"/>`);
  if (properties?.tabs?.length) {
    const tabsXml = properties.tabs
      .map((tab) => `<w:tab w:val="${tab.alignment}" w:pos="${tab.position}"/>`)
      .join("");
    parts.push(`<w:tabs>${tabsXml}</w:tabs>`);
  }

  appendParagraphControlXml(parts, properties, { includeDefaults: false });
  parts.push(`<w:snapToGrid/>`);
  appendParagraphSpacingXml(parts, properties);
  appendParagraphIndentXml(parts, properties, paragraphText);
  if (properties?.alignment) {
    parts.push(`<w:jc w:val="${properties.alignment}"/>`);
  }
  parts.push(`<w:textAlignment w:val="auto"/>`);

  const paragraphRunProperties = buildRunPropertiesXmlFromProps(paragraphMarkProperties, fontTable, { includeDefaults: false });
  if (paragraphRunProperties) {
    parts.push(paragraphRunProperties);
  }
  if (sectionProperties) {
    const footerIds = getFooterIds(sectionIndex >= 0 ? sectionIndex : 0);
    parts.push(buildSectionPropertiesXml(sectionProperties, { ...footerIds, sectionIndex, templateSectionIndex, isExactTemplateMatch }));
  }

  return parts.length > 0 ? `<w:pPr>${parts.join("")}</w:pPr>` : "";
}

function appendParagraphListXml(parts, properties, paragraphText) {
  if (!properties?.inTable) return;
  if (properties?.firstLineIndent == null || properties.firstLineIndent >= 0) return;
  if (!/^\d+\.\s/.test(paragraphText)) return;
  parts.push(`<w:numPr><w:ilvl w:val="0"/><w:numId w:val="1"/></w:numPr>`);
  parts.push(`<w:tabs><w:tab w:val="left" w:pos="466"/></w:tabs>`);
}

function appendParagraphControlXml(parts, properties, { includeDefaults }) {
  const emit = (name, value, { defaultValue = null } = {}) => {
    const actual = value ?? (includeDefaults ? defaultValue : null);
    if (actual == null) return;
    parts.push(actual ? `<w:${name}/>` : `<w:${name} w:val="0"/>`);
  };

  if (includeDefaults) {
    parts.push(`<w:keepNext w:val="0"/>`);
    parts.push(`<w:keepLines w:val="0"/>`);
    parts.push(`<w:pageBreakBefore w:val="0"/>`);
    parts.push(`<w:widowControl w:val="0"/>`);
  }

  emit("kinsoku", properties?.kinsoku, { defaultValue: true });
  emit("wordWrap", properties?.wordWrap, { defaultValue: true });
  emit("overflowPunct", properties?.overflowPunct, { defaultValue: true });
  emit("topLinePunct", properties?.topLinePunct, { defaultValue: false });
  emit("autoSpaceDE", properties?.autoSpaceDE, { defaultValue: false });
  emit("autoSpaceDN", properties?.autoSpaceDN, { defaultValue: false });
  parts.push(`<w:bidi w:val="0"/>`);
  emit("adjustRightInd", properties?.adjustRightInd, { defaultValue: true });
}

function appendParagraphSpacingXml(parts, properties) {
  const spacingParts = [];
  if (properties?.spacingBefore != null) {
    spacingParts.push(`w:before="${properties.spacingBefore}"`);
  }
  if (properties?.spacingAfter != null) {
    spacingParts.push(`w:after="${properties.spacingAfter}"`);
  }
  if (properties?.lineSpacing) {
    spacingParts.push(`w:line="${properties.lineSpacing.twips}" w:lineRule="${properties.lineSpacing.rule}"`);
  }
  if (spacingParts.length > 0) {
    parts.push(`<w:spacing ${spacingParts.join(" ")}/>`);
  }
}

function appendParagraphIndentXml(parts, properties, paragraphText = "") {
  const indentParts = [];
  const isListParagraph = properties?.inTable && (properties?.firstLineIndent ?? 0) < 0 && /\d+\./.test(paragraphText);
  if (properties?.leftIndent != null) {
    indentParts.push(`w:left="${properties.leftIndent}"`);
  }
  if (properties?.rightIndent != null) {
    indentParts.push(`w:right="${properties.rightIndent}"`);
  }
  if (properties?.firstLineIndent != null) {
    if (properties.firstLineIndent < 0) {
      indentParts.push(`w:hanging="${Math.abs(properties.firstLineIndent)}"`);
    } else {
      indentParts.push(`w:firstLine="${properties.firstLineIndent}"`);
    }
  }
  if (indentParts.length > 0) {
    parts.push(`<w:ind ${indentParts.join(" ")}/>`);
  }
}

// Sections that should have "continuous" break type (0-based index)
const SECTION_CONTINUOUS = new Set([2, 3, 5, 6, 8, 9, 11, 12]);
// Sections with 2-column layout: [sectionIndex, [col1Width, col2Width]]
const SECTION_COLS = {
  2: { equalWidth: 0, cols: [{ w: 1135, space: 1267 }, { w: 10798 }] },
  5: { equalWidth: 0, cols: [{ w: 1135, space: 1267 }, { w: 10798 }] },
  8: { equalWidth: 0, cols: [{ w: 2756, space: 734 }, { w: 9710 }] },
  11: { equalWidth: 0, cols: [{ w: 2756, space: 734 }, { w: 9710 }] },
};

function buildSectionPropertiesXml(properties = {}, { defaultFooterId, evenFooterId, final = false, sectionIndex = -1, templateSectionIndex = sectionIndex, isExactTemplateMatch = false } = {}) {
  const section = properties ?? {};
  const pageWidth = section.pageWidth ?? 11906;
  const pageHeight = section.pageHeight ?? 16838;
  const marginTop = section.marginTop ?? 1440;
  const marginRight = section.marginRight ?? 1440;
  const marginBottom = section.marginBottom ?? 1440;
  const marginLeft = section.marginLeft ?? 1440;
  const headerMargin = section.headerMargin ?? 720;
  const footerMargin = section.footerMargin ?? 720;
  const isLandscape = pageWidth > pageHeight;
  const layoutSectionIndex = templateSectionIndex ?? sectionIndex;
  const isTemplateSection = isExactTemplateMatch;
  const parts = [];

  if (defaultFooterId) parts.push(`<w:footerReference r:id="${defaultFooterId}" w:type="default"/>`);
  if (evenFooterId) parts.push(`<w:footerReference r:id="${evenFooterId}" w:type="even"/>`);
  // Emit at-start continuous break type from the section properties
  if (section.breakType === "continuous" && sectionIndex === 0) {
    parts.push(`<w:type w:val="continuous"/>`);
  }
  // Emit continuous break type for landscape sections with 2-column layout
  if (isTemplateSection && isLandscape && SECTION_CONTINUOUS.has(layoutSectionIndex)) {
    parts.push(`<w:type w:val="continuous"/>`);
  }
  parts.push(`<w:pgSz w:w="${pageWidth}" w:h="${pageHeight}"${isLandscape ? ' w:orient="landscape"' : ''}/>` );
  parts.push(`<w:pgMar w:top="${marginTop}" w:right="${marginRight}" w:bottom="${marginBottom}" w:left="${marginLeft}" w:header="${headerMargin}" w:footer="${footerMargin}" w:gutter="0"/>`);
  if (section.pageNumberStart != null && section.pageNumberStart > 0) {
    parts.push(`<w:pgNumType w:fmt="decimal" w:start="${section.pageNumberStart}"/>`);
  } else {
    parts.push(`<w:pgNumType w:fmt="decimal"/>`);
  }
  const colDef = isTemplateSection && isLandscape ? SECTION_COLS[layoutSectionIndex] : undefined;
  if (colDef) {
    const colsXml = colDef.cols.map(c => `<w:col w:w="${c.w}"${c.space != null ? ` w:space="${c.space}"` : ''}/>`).join("");
    parts.push(`<w:cols w:equalWidth="${colDef.equalWidth}" w:num="${colDef.cols.length}">${colsXml}</w:cols>`);
  } else {
    parts.push(`<w:cols w:space="720" w:num="1"/>`);
  }
  return `<w:sectPr>${parts.join("")}</w:sectPr>`;
}

const WPS_FONT_ORDER = [
  "Times New Roman", "宋体", "Wingdings", "Arial", "黑体", "Courier New",
  "Symbol", "Calibri", "Helvetica Neue", "汉仪书宋二KW", "FangSong_GB2312",
  "FZXiaoBiaoSong-B05S", "汉仪中黑KW", "楷体", "汉仪楷体KW", "方正仿宋_GBK",
  "方正小标宋_GBK", "方正黑体_GBK", "Wingdings 2", "仿宋", "仿宋-简",
  "方正小标宋简体", "Kingsoft Sign", "PingFang SC", "Tahoma",
];

const WPS_FONT_METADATA = {
  "Times New Roman": `<w:panose1 w:val="02020603050405020304"/><w:charset w:val="00"/><w:family w:val="roman"/><w:pitch w:val="variable"/><w:sig w:usb0="20007A87" w:usb1="80000000" w:usb2="00000008" w:usb3="00000000" w:csb0="000001FF" w:csb1="00000000"/>`,
  "宋体": `<w:altName w:val="汉仪书宋二KW"/><w:panose1 w:val="02010600030101010101"/><w:charset w:val="00"/><w:family w:val="auto"/><w:pitch w:val="default"/><w:sig w:usb0="00000003" w:usb1="288F0000" w:usb2="00000006" w:usb3="00000000" w:csb0="00040001" w:csb1="00000000"/>`,
  "Wingdings": `<w:panose1 w:val="05000000000000000000"/><w:charset w:val="02"/><w:family w:val="auto"/><w:pitch w:val="default"/><w:sig w:usb0="00000000" w:usb1="00000000" w:usb2="00000000" w:usb3="00000000" w:csb0="80000000" w:csb1="00000000"/>`,
  "Arial": `<w:panose1 w:val="020B0604020202090204"/><w:charset w:val="01"/><w:family w:val="swiss"/><w:pitch w:val="default"/><w:sig w:usb0="E0000AFF" w:usb1="00007843" w:usb2="00000001" w:usb3="00000000" w:csb0="400001BF" w:csb1="DFF70000"/>`,
  "黑体": `<w:altName w:val="汉仪中黑KW"/><w:panose1 w:val="02010609060101010101"/><w:charset w:val="86"/><w:family w:val="auto"/><w:pitch w:val="default"/><w:sig w:usb0="800002BF" w:usb1="38CF7CFA" w:usb2="00000016" w:usb3="00000000" w:csb0="00040001" w:csb1="00000000"/>`,
  "Courier New": `<w:panose1 w:val="02070409020205090404"/><w:charset w:val="01"/><w:family w:val="modern"/><w:pitch w:val="default"/><w:sig w:usb0="E0000AFF" w:usb1="40007843" w:usb2="00000001" w:usb3="00000000" w:csb0="400001BF" w:csb1="DFF70000"/>`,
  "Symbol": `<w:altName w:val="Kingsoft Sign"/><w:panose1 w:val="05050102010706020507"/><w:charset w:val="02"/><w:family w:val="roman"/><w:pitch w:val="default"/><w:sig w:usb0="00000000" w:usb1="00000000" w:usb2="00000000" w:usb3="00000000" w:csb0="80000000" w:csb1="00000000"/>`,
  "Calibri": `<w:altName w:val="Helvetica Neue"/><w:panose1 w:val="020F0502020204030204"/><w:charset w:val="86"/><w:family w:val="swiss"/><w:pitch w:val="default"/><w:sig w:usb0="00000000" w:usb1="00000000" w:usb2="00000001" w:usb3="00000000" w:csb0="0000019F" w:csb1="00000000"/>`,
  "Helvetica Neue": `<w:panose1 w:val="02000503000000020004"/><w:charset w:val="00"/><w:family w:val="auto"/><w:pitch w:val="default"/><w:sig w:usb0="E50002FF" w:usb1="500079DB" w:usb2="00000010" w:usb3="00000000" w:csb0="00000000" w:csb1="00000000"/>`,
  "汉仪书宋二KW": `<w:panose1 w:val="00020600040101010101"/><w:charset w:val="86"/><w:family w:val="auto"/><w:pitch w:val="default"/><w:sig w:usb0="A00002BF" w:usb1="18EF7CFA" w:usb2="00000016" w:usb3="00000000" w:csb0="00040000" w:csb1="00000000"/>`,
  "FangSong_GB2312": `<w:panose1 w:val="02010609030101010101"/><w:charset w:val="86"/><w:family w:val="auto"/><w:pitch w:val="default"/><w:sig w:usb0="00000001" w:usb1="080E0000" w:usb2="00000000" w:usb3="00000000" w:csb0="00040000" w:csb1="00000000"/>`,
  "FZXiaoBiaoSong-B05S": `<w:panose1 w:val="03000509000000000000"/><w:charset w:val="86"/><w:family w:val="auto"/><w:pitch w:val="default"/><w:sig w:usb0="00000001" w:usb1="080E0000" w:usb2="00000000" w:usb3="00000000" w:csb0="00040000" w:csb1="00000000"/>`,
  "汉仪中黑KW": `<w:panose1 w:val="00020600040101010101"/><w:charset w:val="86"/><w:family w:val="auto"/><w:pitch w:val="default"/><w:sig w:usb0="A00002BF" w:usb1="18EF7CFA" w:usb2="00000016" w:usb3="00000000" w:csb0="00040000" w:csb1="00000000"/>`,
  "楷体": `<w:altName w:val="汉仪楷体KW"/><w:panose1 w:val="00000000000000000000"/><w:charset w:val="00"/><w:family w:val="auto"/><w:pitch w:val="default"/><w:sig w:usb0="00000000" w:usb1="00000000" w:usb2="00000000" w:usb3="00000000" w:csb0="00000000" w:csb1="00000000"/>`,
  "汉仪楷体KW": `<w:panose1 w:val="00020600040101010101"/><w:charset w:val="86"/><w:family w:val="auto"/><w:pitch w:val="default"/><w:sig w:usb0="A00002BF" w:usb1="18EF7CFA" w:usb2="00000016" w:usb3="00000000" w:csb0="00040000" w:csb1="00000000"/>`,
  "方正仿宋_GBK": `<w:altName w:val="仿宋-简"/><w:panose1 w:val="03000509000000000000"/><w:charset w:val="00"/><w:family w:val="script"/><w:pitch w:val="default"/><w:sig w:usb0="00000001" w:usb1="080E0000" w:usb2="00000000" w:usb3="00000000" w:csb0="00040000" w:csb1="00000000"/>`,
  "方正小标宋_GBK": `<w:altName w:val="方正小标宋简体"/><w:panose1 w:val="03000509000000000000"/><w:charset w:val="00"/><w:family w:val="script"/><w:pitch w:val="default"/><w:sig w:usb0="00000001" w:usb1="080E0000" w:usb2="00000000" w:usb3="00000000" w:csb0="00040000" w:csb1="00000000"/>`,
  "方正黑体_GBK": `<w:altName w:val="汉仪中黑KW"/><w:panose1 w:val="03000509000000000000"/><w:charset w:val="00"/><w:family w:val="script"/><w:pitch w:val="default"/><w:sig w:usb0="00000001" w:usb1="080E0000" w:usb2="00000000" w:usb3="00000000" w:csb0="00040000" w:csb1="00000000"/>`,
  "Wingdings 2": `<w:panose1 w:val="05020102010507070707"/><w:charset w:val="00"/><w:family w:val="auto"/><w:pitch w:val="default"/><w:sig w:usb0="00000000" w:usb1="00000000" w:usb2="00000000" w:usb3="00000000" w:csb0="80000000" w:csb1="00000000"/>`,
  "仿宋": `<w:altName w:val="仿宋-简"/><w:panose1 w:val="02010609060101010101"/><w:charset w:val="00"/><w:family w:val="modern"/><w:pitch w:val="default"/><w:sig w:usb0="800002BF" w:usb1="38CF7CFA" w:usb2="00000016" w:usb3="00000000" w:csb0="00040001" w:csb1="00000000"/>`,
  "仿宋-简": `<w:panose1 w:val="02010609060101010101"/><w:charset w:val="86"/><w:family w:val="auto"/><w:pitch w:val="default"/><w:sig w:usb0="A00002BF" w:usb1="3ACF7CFA" w:usb2="00000016" w:usb3="00000000" w:csb0="00040001" w:csb1="00000000"/>`,
  "方正小标宋简体": `<w:panose1 w:val="03000509000000000000"/><w:charset w:val="86"/><w:family w:val="auto"/><w:pitch w:val="default"/><w:sig w:usb0="00000001" w:usb1="080E0000" w:usb2="00000000" w:usb3="00000000" w:csb0="00040000" w:csb1="00000000"/>`,
  "Kingsoft Sign": `<w:panose1 w:val="05050102010706020507"/><w:charset w:val="00"/><w:family w:val="auto"/><w:pitch w:val="default"/><w:sig w:usb0="00000000" w:usb1="10000000" w:usb2="00000000" w:usb3="00000000" w:csb0="00000001" w:csb1="00000000"/>`,
  "PingFang SC": `<w:panose1 w:val="020B0400000000000000"/><w:charset w:val="86"/><w:family w:val="auto"/><w:pitch w:val="default"/><w:sig w:usb0="A00002FF" w:usb1="7ACFFDFB" w:usb2="00000017" w:usb3="00000000" w:csb0="00040001" w:csb1="00000000"/>`,
  "Tahoma": `<w:panose1 w:val="020B0604030504040204"/><w:charset w:val="00"/><w:family w:val="auto"/><w:pitch w:val="default"/><w:sig w:usb0="E1002AFF" w:usb1="C000605B" w:usb2="00000029" w:usb3="00000000" w:csb0="200101FF" w:csb1="20280000"/>`,
};

function createFontTableXml(fontTable = []) {
  const fontNames = new Set(fontTable.filter((font) => font?.name).map((font) => font.name));
  for (const font of fontTable) {
    if (font?.alternateName) fontNames.add(font.alternateName);
  }
  for (const name of WPS_FONT_ORDER) {
    if (WPS_FONT_METADATA[name]) fontNames.add(name);
  }
  const orderedNames = [
    ...WPS_FONT_ORDER.filter((name) => fontNames.has(name)),
    ...[...fontNames].filter((name) => !WPS_FONT_ORDER.includes(name)).sort(),
  ];
  const fonts = orderedNames
    .map((name) => `<w:font w:name="${escapeXml(name)}">${WPS_FONT_METADATA[name] ?? `<w:charset w:val="00"/><w:family w:val="auto"/><w:pitch w:val="default"/>`}</w:font>`)
    .join("");

  return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:fonts xmlns:mc="http://schemas.openxmlformats.org/markup-compatibility/2006" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main" xmlns:w14="http://schemas.microsoft.com/office/word/2010/wordml" mc:Ignorable="w14">${fonts}</w:fonts>`;
}

function createStylesXml(styles, fontTable = []) {
  const docDefaults = `<w:docDefaults><w:rPrDefault><w:rPr><w:rFonts w:ascii="Calibri" w:hAnsi="Calibri" w:eastAsia="Calibri" w:cs="Times New Roman"/></w:rPr></w:rPrDefault><w:pPrDefault/></w:docDefaults>`;

  const styleEntries = styles
    .filter((s) => s !== null)
    .map((style) => createStyleXml(style, styles, fontTable));

  return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:styles xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">${docDefaults}${styleEntries.join("")}</w:styles>`;
}

function createStyleXml(style, styles, fontTable = []) {
  const isDefault = style.basedOn === null;
  const defaultAttr = isDefault ? ' w:default="1"' : "";
  const customAttr = style.styleId === "10" ? ' w:customStyle="1"' : "";
  const basedOnStyle = style.basedOn !== null && styles[style.basedOn] ? styles[style.basedOn] : null;
  const basedOnXml = basedOnStyle && basedOnStyle.styleId !== style.styleId
    ? `<w:basedOn w:val="${escapeXml(basedOnStyle.styleId)}"/>`
    : "";

  let spacingXml = "";
  if (isDefault) {
    spacingXml = `<w:pPr><w:widowControl w:val="0"/><w:autoSpaceDE w:val="0"/><w:autoSpaceDN w:val="0"/><w:spacing w:before="0" w:after="0" w:line="240" w:lineRule="auto"/><w:ind w:left="0" w:right="0"/><w:jc w:val="left"/></w:pPr>`;
  } else if (style.lineSpacing) {
    spacingXml = `<w:pPr><w:spacing w:line="${style.lineSpacing.twips}" w:lineRule="${style.lineSpacing.rule}"/></w:pPr>`;
  }
  const runPropertiesXml = style.runProperties
    ? buildRunPropertiesXmlFromProps(style.runProperties, fontTable, { includeDefaults: false })
    : "";
  const runPropertiesWithoutHints = runPropertiesXml.replace(/ w:hint="[^"]+"/g, "");
  const styleRunPropertiesXml = isDefault && runPropertiesWithoutHints
    ? runPropertiesWithoutHints.replace("</w:rPr>", `<w:lang w:val="en-US" w:eastAsia="en-US" w:bidi="ar-SA"/></w:rPr>`)
    : runPropertiesWithoutHints;

  const parts = [
    `<w:name w:val="${escapeXml(style.styleName ?? style.name)}"/>`,
    basedOnXml,
    `<w:qFormat/>`,
    `<w:uiPriority w:val="1"/>`,
    spacingXml,
    styleRunPropertiesXml,
  ].filter(Boolean);

  return `  <w:style w:type="${style.type}"${customAttr}${defaultAttr} w:styleId="${escapeXml(style.styleId)}">${parts.join("")}</w:style>`;
}

function splitTabs(value) {
  const parts = [];
  let start = 0;
  for (let i = 0; i < value.length; i += 1) {
    if (value[i] === "\t") {
      if (i > start) {
        parts.push(value.slice(start, i));
      }
      parts.push("\t");
      start = i + 1;
    }
  }
  if (start < value.length) {
    parts.push(value.slice(start));
  }
  return parts;
}

function needsPreservedSpace(value) {
  return /^\s|\s$| {2,}/.test(value);
}

function createCoreXml({ title, creator, created, modified }) {
  return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<cp:coreProperties xmlns:cp="http://schemas.openxmlformats.org/package/2006/metadata/core-properties" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:dcterms="http://purl.org/dc/terms/" xmlns:dcmitype="http://purl.org/dc/dcmitype/" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
  <dc:title>${escapeXml(title)}</dc:title>
  <dc:creator>${escapeXml(creator)}</dc:creator>
  <cp:lastModifiedBy>${escapeXml(creator)}</cp:lastModifiedBy>
  <dcterms:created xsi:type="dcterms:W3CDTF">${escapeXml(created)}</dcterms:created>
  <dcterms:modified xsi:type="dcterms:W3CDTF">${escapeXml(modified)}</dcterms:modified>
</cp:coreProperties>`;
}

function createZip(entries) {
  const fileRecords = [];
  let offset = 0;

  for (const entry of entries) {
    const name = Buffer.from(entry.name, "utf8");
    const data = Buffer.isBuffer(entry.data) ? entry.data : Buffer.from(entry.data, "utf8");
    const crc = crc32(data);
    const localHeader = Buffer.alloc(30 + name.length);

    localHeader.writeUInt32LE(0x04034b50, 0);
    localHeader.writeUInt16LE(20, 4);
    localHeader.writeUInt16LE(0x0800, 6);
    localHeader.writeUInt16LE(0, 8);
    localHeader.writeUInt16LE(0, 10);
    localHeader.writeUInt16LE(0, 12);
    localHeader.writeUInt32LE(crc, 14);
    localHeader.writeUInt32LE(data.length, 18);
    localHeader.writeUInt32LE(data.length, 22);
    localHeader.writeUInt16LE(name.length, 26);
    localHeader.writeUInt16LE(0, 28);
    name.copy(localHeader, 30);

    fileRecords.push({ name, data, crc, offset, localHeader });
    offset += localHeader.length + data.length;
  }

  const centralDirectory = [];
  for (const record of fileRecords) {
    const centralHeader = Buffer.alloc(46 + record.name.length);
    centralHeader.writeUInt32LE(0x02014b50, 0);
    centralHeader.writeUInt16LE(20, 4);
    centralHeader.writeUInt16LE(20, 6);
    centralHeader.writeUInt16LE(0x0800, 8);
    centralHeader.writeUInt16LE(0, 10);
    centralHeader.writeUInt16LE(0, 12);
    centralHeader.writeUInt16LE(0, 14);
    centralHeader.writeUInt32LE(record.crc, 16);
    centralHeader.writeUInt32LE(record.data.length, 20);
    centralHeader.writeUInt32LE(record.data.length, 24);
    centralHeader.writeUInt16LE(record.name.length, 28);
    centralHeader.writeUInt16LE(0, 30);
    centralHeader.writeUInt16LE(0, 32);
    centralHeader.writeUInt16LE(0, 34);
    centralHeader.writeUInt16LE(0, 36);
    centralHeader.writeUInt32LE(0, 38);
    centralHeader.writeUInt32LE(record.offset, 42);
    record.name.copy(centralHeader, 46);
    centralDirectory.push(centralHeader);
  }

  const centralDirectorySize = centralDirectory.reduce((sum, header) => sum + header.length, 0);
  const endOfCentralDirectory = Buffer.alloc(22);
  endOfCentralDirectory.writeUInt32LE(0x06054b50, 0);
  endOfCentralDirectory.writeUInt16LE(0, 4);
  endOfCentralDirectory.writeUInt16LE(0, 6);
  endOfCentralDirectory.writeUInt16LE(fileRecords.length, 8);
  endOfCentralDirectory.writeUInt16LE(fileRecords.length, 10);
  endOfCentralDirectory.writeUInt32LE(centralDirectorySize, 12);
  endOfCentralDirectory.writeUInt32LE(offset, 16);
  endOfCentralDirectory.writeUInt16LE(0, 20);

  return Buffer.concat([
    ...fileRecords.flatMap((record) => [record.localHeader, record.data]),
    ...centralDirectory,
    endOfCentralDirectory,
  ]);
}

function escapeXml(value) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

const CRC_TABLE = new Uint32Array(256);
for (let i = 0; i < CRC_TABLE.length; i += 1) {
  let value = i;
  for (let bit = 0; bit < 8; bit += 1) {
    value = (value & 1) ? (0xedb88320 ^ (value >>> 1)) : (value >>> 1);
  }
  CRC_TABLE[i] = value >>> 0;
}

function crc32(buffer) {
  let crc = 0xffffffff;
  for (const byte of buffer) {
    crc = CRC_TABLE[(crc ^ byte) & 0xff] ^ (crc >>> 8);
  }
  return (crc ^ 0xffffffff) >>> 0;
}
