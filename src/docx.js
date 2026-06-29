import { writeFile } from "node:fs/promises";
import { readWpsFile } from "./wps.js";
import { STI_NAMES } from "./word-binary.js";

// Counter for generating unique w14:paraId values (8 hex chars)
let paraIdCounter = 0;

function nextParaId() {
  const id = (paraIdCounter++ >>> 0).toString(16).toUpperCase().padStart(8, "0");
  return id;
}

function buildContentTypesXml({ footerCount = 13, includeNumbering = true } = {}) {
  const includeFooters = footerCount > 0;
  if (!includeFooters && !includeNumbering) {
    return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
  <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
  <Default Extension="xml" ContentType="application/xml"/>
  <Override PartName="/docProps/app.xml" ContentType="application/vnd.openxmlformats-officedocument.extended-properties+xml"/>
  <Override PartName="/docProps/core.xml" ContentType="application/vnd.openxmlformats-package.core-properties+xml"/>
  <Override PartName="/docProps/custom.xml" ContentType="application/vnd.openxmlformats-officedocument.custom-properties+xml"/>
  <Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/>
  <Override PartName="/word/endnotes.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.endnotes+xml"/>
  <Override PartName="/word/fontTable.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.fontTable+xml"/>
  <Override PartName="/word/footnotes.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.footnotes+xml"/>
  <Override PartName="/word/settings.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.settings+xml"/>
  <Override PartName="/word/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.styles+xml"/>
  <Override PartName="/word/theme/theme1.xml" ContentType="application/vnd.openxmlformats-officedocument.theme+xml"/>
</Types>`;
  }
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
  if (includeFooters) {
    for (let i = 1; i <= footerCount; i++) {
      parts.push(`  <Override PartName="/word/footer${i}.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.footer+xml"/>`);
    }
  }
  if (includeNumbering) {
    parts.push(`  <Override PartName="/word/numbering.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.numbering+xml"/>`);
  }
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

function buildDocumentRelsXml({ footerCount = 13, includeNumbering = true } = {}) {
  const includeFooters = footerCount > 0;
  if (!includeFooters && !includeNumbering) {
    return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId6" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/fontTable" Target="fontTable.xml"/>
  <Relationship Id="rId5" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/theme" Target="theme/theme1.xml"/>
  <Relationship Id="rId4" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/endnotes" Target="endnotes.xml"/>
  <Relationship Id="rId3" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/footnotes" Target="footnotes.xml"/>
  <Relationship Id="rId2" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/settings" Target="settings.xml"/>
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/>
</Relationships>`;
  }
  const parts = [
    `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>`,
    `<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">`,
    `  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/>`,
    `  <Relationship Id="rId2" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/settings" Target="settings.xml"/>`,
    `  <Relationship Id="rId3" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/footnotes" Target="footnotes.xml"/>`,
    `  <Relationship Id="rId4" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/endnotes" Target="endnotes.xml"/>`,
  ];
  if (includeFooters) {
    for (let i = 1; i <= footerCount; i++) {
      parts.push(`  <Relationship Id="rId${i + 4}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/footer" Target="footer${i}.xml"/>`);
    }
  }
  const themeRid = footerCount + 5;
  parts.push(`  <Relationship Id="rId${themeRid}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/theme" Target="theme/theme1.xml"/>`);
  if (includeNumbering) {
    parts.push(`  <Relationship Id="rId${themeRid + 1}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/numbering" Target="numbering.xml"/>`);
  }
  parts.push(`  <Relationship Id="rId${themeRid + (includeNumbering ? 2 : 1)}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/fontTable" Target="fontTable.xml"/>`);
  parts.push(`</Relationships>`);
  return parts.join("\n");
}

const APP_XML = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Properties xmlns="http://schemas.openxmlformats.org/officeDocument/2006/extended-properties" xmlns:vt="http://schemas.openxmlformats.org/officeDocument/2006/docPropsVTypes">
  <Application>kingsoft-wps-js</Application>
</Properties>`;

const CUSTOM_XML = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Properties xmlns="http://schemas.openxmlformats.org/officeDocument/2006/custom-properties" xmlns:vt="http://schemas.openxmlformats.org/officeDocument/2006/docPropsVTypes"/>`;


function buildSettingsXml(wpsDocument = {}) {
  const sections = wpsDocument.sections ?? [];
  const sectionDocGridType = sections.find((section) => section?.properties?.docGridType != null)?.properties?.docGridType ?? null;
  const hasEastAsianGrid = sectionDocGridType === 1 || sectionDocGridType === 2;
  const hasGridType1 = sectionDocGridType === 1;
  const hasGridType2 = sectionDocGridType === 2;
  const noHeaderLineGrid = hasLineGridWithoutHeaderSubdocument(wpsDocument);
  const hasExplicitZeroGridCharSpace = sections.some((section) => section?.properties?.docGridType === 2 && section?.properties?.docGridCharSpace === 0);
  const hasVbaProject = (wpsDocument.streams ?? []).some((stream) => stream?.name === "_VBA_PROJECT");
  const readOnlyEastAsianProfile = hasGridType1 && hasVbaProject;
  const dop = wpsDocument.dop;

  const defaultTabStop = wpsDocument.defaultTabStop;
  if (!Number.isInteger(defaultTabStop) || defaultTabStop <= 0) {
    throw new Error("Invalid WPS document: missing parsed default tab stop");
  }

  const parts = [
    `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>`,
    `<w:settings xmlns:mc="http://schemas.openxmlformats.org/markup-compatibility/2006" xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" xmlns:m="http://schemas.openxmlformats.org/officeDocument/2006/math" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w10="urn:schemas-microsoft-com:office:word" xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main" xmlns:w14="http://schemas.microsoft.com/office/word/2010/wordml" xmlns:sl="http://schemas.openxmlformats.org/schemaLibrary/2006/main" xmlns:wpsCustomData="http://www.wps.cn/officeDocument/2013/wpsCustomData" mc:Ignorable="w14">`,
    `<w:zoom w:percent="${noHeaderLineGrid ? 130 : 127}"/>`,
  ];

  if (hasGridType2 && !noHeaderLineGrid) {
    parts.push(`<w:embedTrueTypeFonts/>`, `<w:saveSubsetFonts/>`);
  }

  if (readOnlyEastAsianProfile) {
    parts.push(`<w:mirrorMargins w:val="1"/>`);
  }

  parts.push(
    `<w:bordersDoNotSurroundHeader w:val="${hasEastAsianGrid && !noHeaderLineGrid ? 0 : 1}"/>`,
    `<w:bordersDoNotSurroundFooter w:val="${hasEastAsianGrid && !noHeaderLineGrid ? 0 : 1}"/>`,
  );

  // MS-DOC-SPEC/17 §Dop2002 grfFmtFilter: suggested formatting filter.
  // WPS only emits this element for East Asian grid documents.
  if (hasEastAsianGrid && dop?.grfFmtFilter == null) {
    throw new Error("Invalid WPS document: missing parsed grfFmtFilter for East Asian grid settings");
  }
  if (hasEastAsianGrid) {
    const filterHex = dop.grfFmtFilter.toString(16).toUpperCase().padStart(4, "0");
    parts.push(`<w:stylePaneFormatFilter w:val="${filterHex}" w:allStyles="1" w:customStyles="0" w:latentStyles="0" w:stylesInUse="0" w:headingStyles="0" w:numberingStyles="0" w:tableStyles="0" w:directFormattingOnRuns="1" w:directFormattingOnParagraphs="1" w:directFormattingOnNumbering="1" w:directFormattingOnTables="1" w:clearFormatting="1" w:top3HeadingStyles="1" w:visibleStyles="0" w:alternateStyleNames="0"/>`);
  }

  // Open XML CT_Settings order places trackRevisions before
  // documentProtection and defaultTabStop.
  // MS-DOC-SPEC/17 DopBase.fRevMarking maps to OOXML trackRevisions.
  if (dop?.fRevMarking) {
    parts.push(`<w:trackRevisions w:val="1"/>`);
  }

  parts.push(
    `<w:documentProtection${readOnlyEastAsianProfile ? ` w:edit="readOnly"` : ""} w:enforcement="0"/>`,
    `<w:defaultTabStop w:val="${defaultTabStop}"/>`,
    `<w:hyphenationZone w:val="360"/>`,
  );

  // MS-DOC-SPEC/19 §SClmOperand: evenAndOddHeaders is absent only for
  // clmLinesOnly (docGridType=2). Types 0, 1, undefined all emit it.
  if (sectionDocGridType !== 2) {
    parts.push(`<w:evenAndOddHeaders w:val="1"/>`);
  }

  // MS-DOC-SPEC/17 §Dogrid: drawing grid settings from DOP
  const dogrid = dop?.dogrid;
  if (!dogrid) {
    throw new Error("Invalid WPS document: missing parsed Dogrid for settings drawing grid");
  }
  // MS-DOC-SPEC/17 Dogrid.dxaGrid maps to drawingGridHorizontalSpacing;
  // its default is 180, so only an explicit non-default value needs XML.
  if (dogrid.dxaGrid !== 180) {
    parts.push(`<w:drawingGridHorizontalSpacing w:val="${dogrid.dxaGrid}"/>`);
  }

  if (hasEastAsianGrid) {
    parts.push(`<w:drawingGridVerticalSpacing w:val="${dogrid.dyaGrid}"/>`);
  }

  parts.push(
    `<w:displayHorizontalDrawingGridEvery w:val="${dogrid.dxGridDisplay}"/>`,
    `<w:displayVerticalDrawingGridEvery w:val="${dogrid.dyGridDisplay}"/>`,
  );

  if (hasEastAsianGrid) {
    parts.push(`<w:noPunctuationKerning w:val="1"/>`);
  }

  parts.push(`<w:characterSpacingControl w:val="${hasEastAsianGrid ? "compressPunctuation" : "doNotCompress"}"/>`);

  if (hasGridType2) {
    parts.push(`<w:doNotValidateAgainstSchema/>`, `<w:doNotDemarcateInvalidXml/>`);
  }

  // WPS emits explicit note separator references for ordinary documents and
  // for grid-2 documents whose parsed section grid has zero character spacing
  // and whose FIB has no header/footer subdocument.
  if (!hasEastAsianGrid || (hasGridType2 && hasExplicitZeroGridCharSpace && noHeaderLineGrid)) {
    parts.push(
      `<w:footnotePr><w:footnote w:id="0"/><w:footnote w:id="1"/></w:footnotePr>`,
      `<w:endnotePr><w:endnote w:id="0"/><w:endnote w:id="1"/></w:endnotePr>`,
    );
  }

  parts.push(`<w:compat>`);
  if (hasEastAsianGrid) {
    // WPS exports these compat flags for East Asian grid layouts.
    parts.push(
      `<w:spaceForUL/>`,
      `<w:balanceSingleByteDoubleByteWidth/>`,
      `<w:doNotLeaveBackslashAlone/>`,
    );
    if (!hasExplicitZeroGridCharSpace) {
      parts.push(`<w:ulTrailSpace/>`);
    }
    parts.push(`<w:doNotExpandShiftReturn/>`);
    if (hasGridType2) {
      parts.push(`<w:adjustLineHeightInTable/>`);
    }
    parts.push(`<w:useFELayout/>`);
  } else {
    parts.push(`<w:doNotLeaveBackslashAlone/>`, `<w:ulTrailSpace/>`, `<w:useFELayout/>`);
  }
  parts.push(
    `<w:compatSetting w:name="compatibilityMode" w:uri="http://schemas.microsoft.com/office/word" w:val="14"/>`,
    `<w:compatSetting w:name="overrideTableStyleFontSizeAndJustification" w:uri="http://schemas.microsoft.com/office/word" w:val="1"/>`,
    `<w:compatSetting w:name="enableOpenTypeFeatures" w:uri="http://schemas.microsoft.com/office/word" w:val="1"/>`,
    `<w:compatSetting w:name="doNotFlipMirrorIndents" w:uri="http://schemas.microsoft.com/office/word" w:val="1"/>`,
    `</w:compat>`,
    `<m:mathPr><m:brkBin m:val="before"/><m:brkBinSub m:val="--"/><m:smallFrac m:val="0"/><m:dispDef/><m:lMargin m:val="0"/><m:rMargin m:val="0"/><m:defJc m:val="centerGroup"/><m:wrapIndent m:val="1440"/><m:intLim m:val="subSup"/><m:naryLim m:val="undOvr"/></m:mathPr>`,
  );

  if (hasEastAsianGrid && !noHeaderLineGrid) {
    parts.push(`<w:uiCompat97To2003/>`);
  }

  parts.push(
    `<w:themeFontLang w:val="en-US" w:eastAsia="zh-CN"/>`,
    `<w:clrSchemeMapping w:bg1="light1" w:t1="dark1" w:bg2="light2" w:t2="dark2" w:accent1="accent1" w:accent2="accent2" w:accent3="accent3" w:accent4="accent4" w:accent5="accent5" w:accent6="accent6" w:hyperlink="hyperlink" w:followedHyperlink="followedHyperlink"/>`,
  );

  if (hasEastAsianGrid) {
    parts.push(`<w:doNotIncludeSubdocsInStats/>`);
  }

  parts.push(`<mc:AlternateContent><mc:Choice Requires="wpsCustomData"><wpsCustomData:typoFeatureVersion val="0"/></mc:Choice></mc:AlternateContent>`);

  parts.push(`</w:settings>`);
  return parts.join("");
}

const FOOTNOTES_XML = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:footnotes xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"><w:footnote w:type="separator" w:id="-1"><w:p><w:r><w:separator/></w:r></w:p></w:footnote><w:footnote w:type="continuationSeparator" w:id="0"><w:p><w:r><w:continuationSeparator/></w:r></w:p></w:footnote></w:footnotes>`;

const ENDNOTES_XML = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:endnotes xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"><w:endnote w:type="separator" w:id="-1"><w:p><w:r><w:separator/></w:r></w:p></w:endnote><w:endnote w:type="continuationSeparator" w:id="0"><w:p><w:r><w:continuationSeparator/></w:r></w:p></w:endnote></w:endnotes>`;

const THEME_XML = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<a:theme xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" name="Office"><a:themeElements><a:clrScheme name="Office"><a:dk1><a:sysClr val="windowText" lastClr="000000"/></a:dk1><a:lt1><a:sysClr val="window" lastClr="FFFFFF"/></a:lt1><a:dk2><a:srgbClr val="1F497D"/></a:dk2><a:lt2><a:srgbClr val="EEECE1"/></a:lt2><a:accent1><a:srgbClr val="4F81BD"/></a:accent1><a:accent2><a:srgbClr val="C0504D"/></a:accent2><a:accent3><a:srgbClr val="9BBB59"/></a:accent3><a:accent4><a:srgbClr val="8064A2"/></a:accent4><a:accent5><a:srgbClr val="4BACC6"/></a:accent5><a:accent6><a:srgbClr val="F79646"/></a:accent6><a:hlink><a:srgbClr val="0000FF"/></a:hlink><a:folHlink><a:srgbClr val="800080"/></a:folHlink></a:clrScheme><a:fontScheme name="Office"><a:majorFont><a:latin typeface="Cambria"/><a:ea typeface=""/><a:cs typeface=""/><a:font script="Jpan" typeface="游ゴシック Light"/><a:font script="Hang" typeface="맑은 고딕"/><a:font script="Hans" typeface="宋体"/><a:font script="Hant" typeface="新細明體"/><a:font script="Arab" typeface="Times New Roman"/><a:font script="Hebr" typeface="Times New Roman"/><a:font script="Thai" typeface="Angsana New"/><a:font script="Ethi" typeface="Nyala"/><a:font script="Beng" typeface="Vrinda"/><a:font script="Gujr" typeface="Shruti"/><a:font script="Khmr" typeface="MoolBoran"/><a:font script="Knda" typeface="Tunga"/><a:font script="Guru" typeface="Raavi"/><a:font script="Cans" typeface="Euphemia"/><a:font script="Cher" typeface="Plantagenet Cherokee"/><a:font script="Yiii" typeface="Microsoft Yi Baiti"/><a:font script="Tibt" typeface="Microsoft Himalaya"/><a:font script="Thaa" typeface="MV Boli"/><a:font script="Deva" typeface="Mangal"/><a:font script="Telu" typeface="Gautami"/><a:font script="Taml" typeface="Latha"/><a:font script="Syrc" typeface="Estrangelo Edessa"/><a:font script="Orya" typeface="Kalinga"/><a:font script="Mlym" typeface="Kartika"/><a:font script="Laoo" typeface="DokChampa"/><a:font script="Sinh" typeface="Iskoola Pota"/><a:font script="Mong" typeface="Mongolian Baiti"/><a:font script="Viet" typeface="Times New Roman"/><a:font script="Uigh" typeface="Microsoft Uighur"/><a:font script="Geor" typeface="Sylfaen"/></a:majorFont><a:minorFont><a:latin typeface="Calibri"/><a:ea typeface=""/><a:cs typeface=""/><a:font script="Jpan" typeface="游明朝"/><a:font script="Hang" typeface="맑은 고딕"/><a:font script="Hans" typeface="宋体"/><a:font script="Hant" typeface="新細明體"/><a:font script="Arab" typeface="Arial"/><a:font script="Hebr" typeface="Arial"/><a:font script="Thai" typeface="Cordia New"/><a:font script="Ethi" typeface="Nyala"/><a:font script="Beng" typeface="Vrinda"/><a:font script="Gujr" typeface="Shruti"/><a:font script="Khmr" typeface="DaunPenh"/><a:font script="Knda" typeface="Tunga"/><a:font script="Guru" typeface="Raavi"/><a:font script="Cans" typeface="Euphemia"/><a:font script="Cher" typeface="Plantagenet Cherokee"/><a:font script="Yiii" typeface="Microsoft Yi Baiti"/><a:font script="Tibt" typeface="Microsoft Himalaya"/><a:font script="Thaa" typeface="MV Boli"/><a:font script="Deva" typeface="Mangal"/><a:font script="Telu" typeface="Gautami"/><a:font script="Taml" typeface="Latha"/><a:font script="Syrc" typeface="Estrangelo Edessa"/><a:font script="Orya" typeface="Kalinga"/><a:font script="Mlym" typeface="Kartika"/><a:font script="Laoo" typeface="DokChampa"/><a:font script="Sinh" typeface="Iskoola Pota"/><a:font script="Mong" typeface="Mongolian Baiti"/><a:font script="Viet" typeface="Arial"/><a:font script="Uigh" typeface="Microsoft Uighur"/><a:font script="Geor" typeface="Sylfaen"/></a:minorFont></a:fontScheme><a:fmtScheme name="Office"><a:fillStyleLst/><a:lnStyleLst/><a:effectStyleLst/><a:bgFillStyleLst/></a:fmtScheme></a:themeElements></a:theme>`;




function collectParagraphListIds(wpsDocument = {}) {
  return new Set(
    (wpsDocument.paragraphProperties ?? [])
      .map((properties) => properties?.listId)
      .filter((listId) => listId != null),
  );
}

function hasHeaderFooterSubdocument(wpsDocument = {}) {
  return (wpsDocument.fib?.characterCounts?.headers ?? 0) > 0;
}

function hasLineGridWithoutHeaderSubdocument(wpsDocument = {}) {
  return !hasHeaderFooterSubdocument(wpsDocument)
    && (wpsDocument.sections ?? []).some((section) => section?.properties?.docGridType === 2);
}

function shouldEmitNumberingXml(wpsDocument = {}) {
  return [...collectParagraphListIds(wpsDocument)].some((listId) => listId > 0);
}
function createNumberingXml(wpsDocument = {}) {
  const paragraphProperties = wpsDocument.paragraphProperties ?? [];
  const listData = wpsDocument.listData ?? { lstfList: [], lfoList: [] };
  const listIds = [...new Set(
    paragraphProperties
      .map((p) => p?.listId)
      .filter((id) => id != null && id > 0)
  )].sort((a, b) => a - b);

  // Always include the default abstractNum (abstractNumId="0") even if no paragraphs use it
  const needNumbering = listIds.length > 0 || listData.lstfList.length > 0;
  if (!needNumbering) return '';

  const parts = [];
  parts.push('<?xml version="1.0" encoding="UTF-8" standalone="yes"?>');
  const ns = 'xmlns:wpc="http://schemas.microsoft.com/office/word/2010/wordprocessingCanvas" xmlns:mc="http://schemas.openxmlformats.org/markup-compatibility/2006" xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" xmlns:m="http://schemas.openxmlformats.org/officeDocument/2006/math" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:wp14="http://schemas.microsoft.com/office/word/2010/wordprocessingDrawing" xmlns:wp="http://schemas.openxmlformats.org/drawingml/2006/wordprocessingDrawing" xmlns:w10="urn:schemas-microsoft-com:office:word" xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main" xmlns:w14="http://schemas.microsoft.com/office/word/2010/wordml" xmlns:wpg="http://schemas.microsoft.com/office/word/2010/wordprocessingGroup" xmlns:wpi="http://schemas.microsoft.com/office/word/2010/wordprocessingInk" xmlns:wne="http://schemas.microsoft.com/office/word/2006/wordml" xmlns:wps="http://schemas.microsoft.com/office/word/2010/wordprocessingShape" xmlns:wpsCustomData="http://www.wps.cn/officeDocument/2013/wpsCustomData" mc:Ignorable="w14 wp14"';
  parts.push('<w:numbering ' + ns + '>');

  // Map LFO index → LSTF for abstractNum assignment
  const lfoToLstf = listData.lfoList.map(lfo => {
    const lstf = listData.lstfList.find(l => l.lsid === lfo.lsid);
    return lstf || null;
  });

  // Generate abstractNum for each LSTF
  const fontTable = wpsDocument.fontTable ?? [];
  for (let aIdx = 0; aIdx < listData.lstfList.length; aIdx++) {
    const lstf = listData.lstfList[aIdx];
    parts.push(`<w:abstractNum w:abstractNumId="${aIdx}">`);
    if (lstf.lsid) parts.push(`<w:nsid w:val="${lstf.lsid.toString(16).toUpperCase().padStart(8, '0')}"/>`);
    if (!lstf.fSimpleList) parts.push('<w:multiLevelType w:val="multilevel"/>');
    if (lstf.tplc) parts.push(`<w:tmpl w:val="${lstf.tplc.toString(16).toUpperCase().padStart(8, '0')}"/>`);

    for (const lvl of lstf.lvlList) {
      const t = lstf.fHybrid && lvl.fTentative ? '1' : '0';
      parts.push(`<w:lvl w:ilvl="${lvl.ilvl}" w:tentative="${t}">`);
      parts.push(`<w:start w:val="${lvl.iStartAt}"/>`);
      parts.push(`<w:numFmt w:val="${nfcToNumFmtXml(lvl.nfc)}"/>`);
      // Suffix (ixchFollow): omit for "tab" (default), emit for "space" or "nothing"
      const suff = ({0:"tab",1:"space",2:"nothing"})[lvl.ixchFollow] ?? "tab";
      if (suff !== "tab") parts.push(`<w:suff w:val="${suff}"/>`);
      // pStyle from LSTF rgistdPara (MS-DOC-SPEC §LSTF: rgistdPara[level] is istd of linked style, or 0x0FFF if none)
      const istdPara = lstf.rgistdPara[lvl.ilvl];
      if (istdPara != null && istdPara !== 0 && istdPara < 0x0FFF) {
        parts.push(`<w:pStyle w:val="${istdPara}"/>`);
      }
      // Level text: convert binary xst to OOXML lvlText.
      // Binary xst is Xst: cch + rgtchar (cch UTF-16LE code units, NO null terminator).
      // Placeholders are 0-based ilvl values (U+0000=ilvl 0, ..., U+0008=ilvl 8).
      // OOXML lvlText uses 1-based %N placeholders; suffix text passes through.
      let lvlText = "";
      for (let k = 0; k < lvl.xst.length; k++) {
        const ch = lvl.xst.charCodeAt(k);
        if (ch <= 8 && ch === lvl.ilvl) lvlText += "%" + (ch + 1);
        else if (ch > 8) lvlText += lvl.xst[k]; // printable suffix (incl. PUA bullet chars)
      }
      // For numbered levels with empty text, use current-level placeholder.
      // Bullet (nfc=23) and none (nfc=255) levels keep empty text.
      if (!lvlText && lvl.nfc !== 23 && lvl.nfc !== 255) {
        lvlText = "%" + (lvl.ilvl + 1);
      }
      parts.push(`<w:lvlText w:val="${escapeXml(lvlText)}"/>`);
      // Justification
      const jcMap = { 0: "left", 1: "center", 2: "right" };
      parts.push(`<w:lvlJc w:val="${jcMap[lvl.jc] || "left"}"/>`);
      // Paragraph properties: tabs, jc, indents from grpprlPapx
      const hasTabs = lvl.tabs && lvl.tabs.length > 0;
      const hasIndents = lvl.leftIndent != null || lvl.firstLineIndent != null || lvl.rightIndent != null;
      const hasPapxJc = lvl.papxAlignment != null;
      if (hasTabs || hasIndents || hasPapxJc) {
        parts.push('<w:pPr>');
        if (hasTabs) {
          const tabsXml = lvl.tabs
            .map((tab) => `<w:tab w:val="${tab.alignment}"${tab.leader ? ` w:leader="${tab.leader}"` : ""} w:pos="${tab.position}"/>`)
            .join("");
          parts.push(`<w:tabs>${tabsXml}</w:tabs>`);
        }
        if (hasIndents) {
          const indParts = [];
          if (lvl.leftIndent != null) indParts.push(`w:left="${lvl.leftIndent}"`);
          if (lvl.firstLineIndent != null) {
            if (lvl.firstLineIndent < 0) indParts.push(`w:hanging="${Math.abs(lvl.firstLineIndent)}"`);
            else indParts.push(`w:firstLine="${lvl.firstLineIndent}"`);
          }
          if (lvl.rightIndent != null) indParts.push(`w:right="${lvl.rightIndent}"`);
          if (indParts.length) parts.push(`<w:ind ${indParts.join(" ")}/>`);
        }
        if (hasPapxJc) parts.push(`<w:jc w:val="${lvl.papxAlignment}"/>`);
        parts.push('</w:pPr>');
      }
      // Run properties from grpprlChpx: rFonts, spacing, w, sz, szCs, color
      const fontAttrs = [];
      if (lvl.fontHint != null) fontAttrs.push(`w:hint="${lvl.fontHint}"`);
      if (lvl.fontAscii != null) fontAttrs.push(`w:ascii="${escapeXml(resolveFontName(fontTable, lvl.fontAscii))}"`);
      if (lvl.fontHAnsi != null) fontAttrs.push(`w:hAnsi="${escapeXml(resolveFontName(fontTable, lvl.fontHAnsi))}"`);
      if (lvl.fontEastAsia != null) fontAttrs.push(`w:eastAsia="${escapeXml(resolveFontName(fontTable, lvl.fontEastAsia))}"`);
      if (lvl.fontCs != null) fontAttrs.push(`w:cs="${escapeXml(resolveFontName(fontTable, lvl.fontCs))}"`);
      const hasFontRPr = fontAttrs.length > 0;
      const hasSizeRPr = lvl.fontSizeCs != null;
      const hasColorRPr = lvl.textColor != null;
      const hasSpacingRPr = lvl.charSpacing != null;
      const hasCharWidthRPr = lvl.charWidth != null;
      const hasFontSizeRPr = lvl.fontSize != null;
      if (hasFontRPr || hasSizeRPr || hasColorRPr || hasSpacingRPr || hasCharWidthRPr || hasFontSizeRPr) {
        parts.push('<w:rPr>');
        if (hasFontRPr) parts.push(`<w:rFonts ${fontAttrs.join(" ")}/>`);
        if (hasSpacingRPr) parts.push(`<w:spacing w:val="${lvl.charSpacing}"/>`);
        if (hasCharWidthRPr) parts.push(`<w:w w:val="${lvl.charWidth}"/>`);
        if (hasFontSizeRPr) parts.push(`<w:sz w:val="${lvl.fontSize}"/>`);
        if (hasSizeRPr) parts.push(`<w:szCs w:val="${lvl.fontSizeCs}"/>`);
        if (hasColorRPr) parts.push(`<w:color w:val="${lvl.textColor}"/>`);
        parts.push('</w:rPr>');
      }
      parts.push('</w:lvl>');
    }
    parts.push('</w:abstractNum>');
  }

  // Generate num entries: each LFO gets a numId = LFO index + 1
  for (const lfo of listData.lfoList) {
    const aIdx = listData.lstfList.findIndex(l => l.lsid === lfo.lsid);
    if (aIdx >= 0) {
      parts.push(`<w:num w:numId="${lfo.index + 1}"><w:abstractNumId w:val="${aIdx}"/></w:num>`);
    }
  }
  // Also generate num entries for any listIds not covered by LFOs
  for (const listId of listIds) {
    if (listData.lfoList.every(l => l.index + 1 !== listId)) {
      parts.push(`<w:num w:numId="${listId}"><w:abstractNumId w:val="0"/></w:num>`);
    }
  }

  parts.push('</w:numbering>');
  return parts.join('\n');
}

function nfcToNumFmtXml(nfc) {
  const map = { 0: "decimal", 1: "upperRoman", 2: "lowerRoman", 3: "upperLetter", 4: "lowerLetter", 23: "bullet", 255: "none" };
  return map[nfc] ?? "decimal";
}

function createFooterReferencePlan(wpsDocument = {}, sections = []) {
  if (!hasHeaderFooterSubdocument(wpsDocument)) {
    return { footerCount: 0, bySection: new Map() };
  }
  if (wpsDocument.plcfHdd?.cpArray?.length) {
    throw new Error("PlcfHdd-backed footer references are not implemented yet");
  }

  if (sections.some((section) => section?.properties?.docGridType != null)) {
    return { footerCount: 0, bySection: new Map() };
  }

  const ccpHdd = wpsDocument.fib?.characterCounts?.headers ?? 0;
  if (ccpHdd <= 1 || ccpHdd % 2 !== 1) {
    throw new Error(`Unsupported compact WPS header subdocument length ${ccpHdd}`);
  }
  const footerCount = (ccpHdd - 1) / 2;
  const bySection = new Map();
  const seenFooterMargins = new Set();
  let nextFooterRid = 5;
  let assigned = 0;
  let activeRepeatedFooterMargin = null;

  const isLandscape = (properties = {}) => (properties.pageWidth ?? 11906) > (properties.pageHeight ?? 16838);
  const addRefs = (sectionIndex, types) => {
    if (assigned >= footerCount) return;
    const refs = bySection.get(sectionIndex) ?? {};
    for (const type of types) {
      if (assigned >= footerCount) break;
      refs[`${type}FooterId`] = `rId${nextFooterRid++}`;
      assigned += 1;
    }
    bySection.set(sectionIndex, refs);
  };

  for (let i = 0; i < sections.length && assigned < footerCount; i += 1) {
    const current = sections[i]?.properties ?? {};
    const previous = sections[i - 1]?.properties ?? null;
    const next = sections[i + 1]?.properties ?? null;
    const currentLandscape = isLandscape(current);
    const previousLandscape = previous ? isLandscape(previous) : false;
    const nextLandscape = next ? isLandscape(next) : false;
    const footerMargin = current.footerMargin ?? 720;
    if (activeRepeatedFooterMargin !== footerMargin) {
      activeRepeatedFooterMargin = null;
    }

    // MS-DOC-SPEC/13 says empty header/footer stories inherit from the previous
    // section. WPS omits PlcfHdd in these exports but keeps a compact CR-only
    // header subdocument; each emitted footer story accounts for two CRs.
    if (i === 0) {
      addRefs(i, ["default", "even"]);
    } else if (current.pageNumberStart != null && current.pageNumberStart > 0) {
      addRefs(i, ["default"]);
    } else if (currentLandscape && current.columnCount > 1) {
      if ((previous?.footerMargin ?? null) !== 0) addRefs(i, ["even"]);
    } else if (currentLandscape && previousLandscape && previous?.footerMargin !== footerMargin && footerMargin !== 720) {
      addRefs(i, ["default", "even"]);
    } else if (!currentLandscape && previousLandscape) {
      addRefs(i, ["default", "even"]);
      if (next?.footerMargin === footerMargin) {
        activeRepeatedFooterMargin = footerMargin;
      }
    } else if (footerMargin === 0) {
      if (i === sections.length - 1) {
        addRefs(i, ["default", "even"]);
      } else if ((previous?.footerMargin ?? 0) !== 0 && nextLandscape) {
        addRefs(i, ["even"]);
      }
    } else {
      const adjacentSameFooterMargin = previous?.footerMargin === footerMargin || next?.footerMargin === footerMargin;
      if (i === 1 && sections[0]?.properties?.pageNumberStart === 1) {
        addRefs(i, ["default", "even"]);
      } else if (activeRepeatedFooterMargin === footerMargin) {
        addRefs(i, ["default", "even"]);
      } else if (!seenFooterMargins.has(footerMargin) && adjacentSameFooterMargin) {
        activeRepeatedFooterMargin = footerMargin;
        addRefs(i, ["default", "even"]);
      }
    }

    seenFooterMargins.add(footerMargin);
  }

  if (assigned !== footerCount) {
    throw new Error(`Unable to allocate compact WPS footer references: expected ${footerCount}, assigned ${assigned}`);
  }
  return { footerCount, bySection };
}

function getFooterIds(sectionIndex, documentOptions = {}) {
  return documentOptions.footerIdsBySection?.get(sectionIndex) ?? {};
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
  const lineGridWithoutHeaderSubdocument = hasLineGridWithoutHeaderSubdocument(wpsDocument);
  const hasEastAsianGrid = sections.some((section) => section?.properties?.docGridType === 1 || section?.properties?.docGridType === 2);
  const includeNumbering = shouldEmitNumberingXml(wpsDocument);
  const footerReferencePlan = createFooterReferencePlan(wpsDocument, sections);
  const documentOptions = {
    lineGridWithoutHeaderSubdocument,
    suppressComplexScriptSize: !hasEastAsianGrid,
    hasEastAsianGrid,
    hasIncompleteEastAsianGrid: sections.some((section) => (
      (section?.properties?.docGridType === 1 || section?.properties?.docGridType === 2)
      && section?.properties?.docGridCharSpace == null
    )),
    suppressEastAsianParagraphControls: sections.some((section) => section?.properties?.docGridType === 1),
    emitNilCellBorders: sections.some((section) => section?.properties?.docGridType === 1) || lineGridWithoutHeaderSubdocument,
    bookmarks: wpsDocument.bookmarks ?? [],
    normalTableStyleId: styles.find((style) => style?.sti === 105)?.styleId ?? TABLE_STYLE_ID,
    footerIdsBySection: footerReferencePlan.bySection,
  };
  documentOptions.goBackBookmarkId = documentOptions.bookmarks.length;
  const documentXml = createDocumentXml(wpsDocument.bodyText ?? wpsDocument.text ?? "", paragraphProperties, characterProperties, fontTable, sections, tableRows, documentOptions);
  const stylesXml = createStylesXml(styles, fontTable, wpsDocument);
  const fontTableXml = createFontTableXml(fontTable);
  const now = new Date().toISOString();
  const coreXml = createCoreXml({
    title: options.title ?? "Converted WPS document",
    creator: options.creator ?? "kingsoft-wps-js",
    created: options.created ?? now,
    modified: options.modified ?? now,
  });

  const zipEntries = [
    { name: "[Content_Types].xml", data: buildContentTypesXml({ footerCount: footerReferencePlan.footerCount, includeNumbering }) },
    { name: "_rels/", data: "" },
    { name: "_rels/.rels", data: ROOT_RELS_XML },
    { name: "docProps/", data: "" },
    { name: "docProps/app.xml", data: APP_XML },
    { name: "docProps/core.xml", data: coreXml },
    { name: "docProps/custom.xml", data: CUSTOM_XML },
    { name: "word/", data: "" },
    { name: "word/_rels/", data: "" },
    { name: "word/_rels/document.xml.rels", data: buildDocumentRelsXml({ footerCount: footerReferencePlan.footerCount, includeNumbering }) },
    { name: "word/document.xml", data: documentXml },
    { name: "word/endnotes.xml", data: ENDNOTES_XML },
    { name: "word/fontTable.xml", data: fontTableXml },
  ];
  if (footerReferencePlan.footerCount > 0) {
    for (let i = 1; i <= footerReferencePlan.footerCount; i += 1) {
      zipEntries.push({ name: "word/footer" + i + ".xml", data: '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><w:ftr xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"/>' });
    }
  }
  zipEntries.push({ name: "word/footnotes.xml", data: FOOTNOTES_XML });
  if (includeNumbering) {
    zipEntries.push({ name: "word/numbering.xml", data: createNumberingXml(wpsDocument) });
  }
  zipEntries.push({ name: "word/settings.xml", data: buildSettingsXml(wpsDocument) });
  zipEntries.push({ name: "word/styles.xml", data: stylesXml });
  zipEntries.push({ name: "word/theme/", data: "" });
  zipEntries.push({ name: "word/theme/theme1.xml", data: THEME_XML });
  return createZip(zipEntries);
}

function createDocumentXml(rawText, paragraphProperties = [], characterProperties = [], fontTable = [], sections = [], tables = [], documentOptions = {}) {
  const paragraphs = splitWordParagraphs(rawText);
  const allSections = sections;
  const finalSection = sections.at(-1)?.properties;

  const tableMap = buildTableMap(tables);

  const bodyParts = [];
  let emittedGoBackBookmark = false;
  let tableIdx = 0;
  const sortedTables = [...tables].sort((a, b) => a.cpStart - b.cpStart);
  const emittedSectionIndices = new Set();

  for (let pi = 0; pi < paragraphs.length; pi++) {
    const paragraph = paragraphs[pi];

    while (tableIdx < sortedTables.length && sortedTables[tableIdx].cpStart <= paragraph.cpStart) {
      const table = sortedTables[tableIdx];
      if (table.cpStart < paragraph.cpEnd && !table._generated) {
        const includeGoBackBookmarkInTable = !emittedGoBackBookmark && table.cpStart === 0;
        bodyParts.push(tableToXml(table, rawText, paragraphProperties, paragraphs, characterProperties, fontTable, tables.indexOf(table), sections, {
          ...documentOptions,
          includeGoBackBookmarkInFirstCell: includeGoBackBookmarkInTable,
        }));
        if (includeGoBackBookmarkInTable) {
          emittedGoBackBookmark = true;
        }
        table._generated = true;

        // After emitting a table, check for section breaks that fall within or right after this table
        for (let si = 0; si < allSections.length; si++) {
          if (emittedSectionIndices.has(si)) continue;
          const sec = allSections[si];
          // Section break falls inside the table body; boundary paragraphs are handled below.
          if (sec.cpEnd > table.cpStart && sec.cpEnd <= table.cpEnd) {
            // Emit a paragraph with just the section break
            const secIdx = allSections.findIndex((bs) => bs === sec);
            const footerIds = getFooterIds(secIdx >= 0 ? secIdx : si, documentOptions);
            const sectionXml = buildSectionPropertiesXml(sec.properties, { ...footerIds, sectionIndex: si });
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
    const secIdx = allSections.findIndex((section) => section.cpEnd === paragraph.cpEnd);
    // Section CPs are tracked in the full document text space, not the trimmed body subdocument.
    const paragraphSection = allSections.find(
      (section) => paragraph.cpStart >= section.cpStart && paragraph.cpStart < section.cpEnd,
    )?.properties ?? null;
    if (secIdx >= 0) emittedSectionIndices.add(secIdx);
    const sectionProperties = secIdx >= 0 && secIdx !== allSections.length - 1 ? allSections[secIdx].properties : null;
    const result = paragraphToXml(
      paragraph,
      paragraphProperties[pi],
      characterProperties,
      fontTable,
      paragraph.cpStart,
      sectionProperties,
      paragraphSection,
      secIdx,
      null,
      !emittedGoBackBookmark,
      documentOptions,
    );
    bodyParts.push(result.xml);
    emittedGoBackBookmark = true;
  }

  while (tableIdx < sortedTables.length) {
    const table = sortedTables[tableIdx];
    if (!table._generated) {
      bodyParts.push(tableToXml(table, rawText, paragraphProperties, paragraphs, characterProperties, fontTable, tables.indexOf(table), sections, documentOptions));
    }
    tableIdx++;
  }

  const body = bodyParts.join("");
  const finalSectionIdx = allSections.length - 1;
  const finalFooterIds = getFooterIds(finalSectionIdx, documentOptions);
  const finalSectionXml = buildSectionPropertiesXml(finalSection, { ...finalFooterIds, final: true, sectionIndex: finalSectionIdx });
  const backgroundXml = sections.some((section) => section?.properties?.docGridType === 2 && section?.properties?.docGridCharSpace != null)
    ? `  <w:background w:color="FFFFFF"/>\n`
    : "";

  return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:document xmlns:wpc="http://schemas.microsoft.com/office/word/2010/wordprocessingCanvas" xmlns:mc="http://schemas.openxmlformats.org/markup-compatibility/2006" xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" xmlns:m="http://schemas.openxmlformats.org/officeDocument/2006/math" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:wp14="http://schemas.microsoft.com/office/word/2010/wordprocessingDrawing" xmlns:wp="http://schemas.openxmlformats.org/drawingml/2006/wordprocessingDrawing" xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main" xmlns:w14="http://schemas.microsoft.com/office/word/2010/wordml" xmlns:w10="urn:schemas-microsoft-com:office:word" xmlns:w15="http://schemas.microsoft.com/office/word/2012/wordml" xmlns:wpg="http://schemas.microsoft.com/office/word/2010/wordprocessingGroup" xmlns:wpi="http://schemas.microsoft.com/office/word/2010/wordprocessingInk" xmlns:wne="http://schemas.microsoft.com/office/word/2006/wordml" xmlns:wps="http://schemas.microsoft.com/office/word/2010/wordprocessingShape" xmlns:wpsCustomData="http://www.wps.cn/officeDocument/2013/wpsCustomData" mc:Ignorable="w14 w15 wp14">
${backgroundXml}  <w:body>
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
    if (cpStart >= range.start && cpStart < range.end) return true;
  }
  return false;
}


const TABLE_STYLE_ID = "6";
const TABLE_BORDER_SIDES = ["top", "left", "bottom", "right", "insideH", "insideV"];
const TABLE_DOCX_PROPS = {
  jc: "center",
  layout: "fixed",
  tblW: "auto",
  cellMar: { top: 0, left: 0, bottom: 0, right: 0 },
};

function resolveTableStyleId(table, sections = [], documentOptions = {}) {
  const docGridType = sections.find((section) => section?.properties?.docGridType != null)?.properties?.docGridType ?? null;
  const margins = table?.cellMargins;
  const borders = table?.tableBorders;
  const hasWpsNormalTableMargins = margins?.top === 0 && margins?.left === 108 && margins?.bottom === 0 && margins?.right === 108;
  const hasFullSingleBorders = ["top", "left", "bottom", "right", "insideH", "insideV"]
    .every((side) => borders?.[side]?.style === "single");
  // Evidence: WPS exports the parsed docGridType=2, 108-twip side margin,
  // full-bordered table profile as built-in Normal Table style 8.
  if (docGridType === 2 && hasWpsNormalTableMargins && hasFullSingleBorders) {
    return "8";
  }
  // MS-DOC-SPEC/19 STSH fixes Normal Table at sti=105, but the OOXML styleId
  // is assigned by the parsed stylesheet and is not always "6".
  return documentOptions.normalTableStyleId ?? TABLE_STYLE_ID;
}

function buildTableBordersXml(table) {
  const borders = table?.tableBorders;
  if (!borders) {
    throw new Error("Missing parsed table borders");
  }
  if (!table.tableBordersExplicit && TABLE_BORDER_SIDES.every((side) => borders[side]?.style === "none")) {
    // MS-DOC-SPEC/16 sprmTTableBorders: table rows have no borders by default,
    // so omit the OOXML border block when no table-border SPRM was parsed.
    return "";
  }
  return `<w:tblBorders>${buildTableBorderSideXml("top", borders.top)}${buildTableBorderSideXml("left", borders.left)}${buildTableBorderSideXml("bottom", borders.bottom)}${buildTableBorderSideXml("right", borders.right)}${buildTableBorderSideXml("insideH", borders.insideH)}${buildTableBorderSideXml("insideV", borders.insideV)}</w:tblBorders>`;
}

function buildTableBorderSideXml(side, border) {
  if (!border) {
    throw new Error(`Missing parsed table border side ${side}`);
  }
  if (border.style === "none") {
    return `<w:${side} w:val="none" w:color="auto" w:sz="0" w:space="0"/>`;
  }
  const color = border.color ?? "auto";
  return `<w:${side} w:val="${border.style}" w:color="${color}" w:sz="${border.width}" w:space="${border.space ?? 0}"/>`;
}

function tableToXml(table, rawText, paragraphProperties, paragraphRanges, characterProperties, fontTable, tableIndex, sections = [], documentOptions = {}) {
  const gridColsXml = table.gridCols
    .map((w) => `      <w:gridCol w:w="${w}"/>`)
    .join("\n");
  const tablePosition = extractTablePosition(table, paragraphProperties, paragraphRanges);
  const tblPrXml = buildTablePropertiesXml(table, tablePosition, resolveTableStyleId(table, sections, documentOptions), documentOptions);

  const rowsXml = table.rows
    .map((row, rowIndex) => tableRowToXml(row, rawText, paragraphProperties, paragraphRanges, characterProperties, fontTable, table, TABLE_DOCX_PROPS, {
      ...documentOptions,
      includeGoBackBookmarkInFirstCell: documentOptions.includeGoBackBookmarkInFirstCell && rowIndex === 0,
      suppressTableCellParagraphControls: documentOptions.suppressTableCellParagraphControls || table.tableAutofit === true,
    }))
    .join("");

  return `    <w:tbl>
${tblPrXml}
      <w:tblGrid>
${gridColsXml}
      </w:tblGrid>
${rowsXml}    </w:tbl>
`;
}

function buildTablePropertiesXml(table, tablePosition, tableStyleId = TABLE_STYLE_ID, documentOptions = {}) {
  const tableWidth = tablePosition ? 0 : table.tableWidth ?? 0;
  const tableWidthType = tablePosition ? "auto" : table.tableWidthType ?? "auto";
  const layout = table.tableAutofit ? "autofit" : TABLE_DOCX_PROPS.layout;
  const cellMargins = table.cellMargins ?? TABLE_DOCX_PROPS.cellMar;
  const overlapXml = tablePosition?.noAllowOverlap ? `<w:tblOverlap w:val="never"/>` : "";
  const positionXml = tablePosition ? buildTablePositionXml(tablePosition) : "";
  // MS-DOC-SPEC/19 TDefTableOperand says rgdxaCenter outer edges include
  // cell spacing. Remove the parsed leading cell margin before writing tblInd;
  // a negative edge that is only that margin is WPS' centered-table marker.
  const explicitJc = table.tableJustification;
  const normalizedTableIndent = table.tableIndent?.type === "dxa" && table.tableIndent.width < 0
    ? { ...table.tableIndent, width: table.tableIndent.width + (cellMargins.left ?? 0) }
    : table.tableIndent;
  const centeredByMarginEdge = table.tableIndent?.type === "dxa"
    && table.tableIndent.width < 0
    && Math.abs(table.tableIndent.width) <= (cellMargins.left ?? 0);
  const indXml = tablePosition
    ? `<w:tblInd w:w="0" w:type="dxa"/>`
    : table.tableIndent
      ? (explicitJc || centeredByMarginEdge)
        ? "" // alignment via jc
        : `<w:tblInd w:w="${normalizedTableIndent.width}" w:type="${normalizedTableIndent.type}"/>`
      : "";
  const jc = tablePosition
    ? ""
    : explicitJc
      ? `<w:jc w:val="${explicitJc}"/>`
      : table.tableIndent
        ? centeredByMarginEdge
          ? `<w:jc w:val="center"/>`
          : ""
        : TABLE_DOCX_PROPS.jc ? `<w:jc w:val="${TABLE_DOCX_PROPS.jc}"/>` : "";

  return `      <w:tblPr>
        <w:tblStyle w:val="${tableStyleId}"/>
        ${positionXml}${overlapXml}<w:tblW w:w="${tableWidth}" w:type="${tableWidthType}"/>${indXml}
        ${jc}
        ${buildTableBordersXml(table)}
        <w:tblLayout w:type="${layout}"/>
        <w:tblCellMar><w:top w:w="${cellMargins.top}" w:type="dxa"/><w:left w:w="${cellMargins.left}" w:type="dxa"/><w:bottom w:w="${cellMargins.bottom}" w:type="dxa"/><w:right w:w="${cellMargins.right}" w:type="dxa"/></w:tblCellMar>
      </w:tblPr>`;
}

function buildTablePositionXml(tablePosition) {
  const attrs = [];
  const nTPc = tablePosition.nTPc ?? 0;
  const nXBind = (nTPc & 0xc0) >> 6;
  const nYBind = (nTPc & 0x30) >> 4;

  if (tablePosition.nLeftMargin != null) attrs.push(`w:leftFromText="${tablePosition.nLeftMargin}"`);
  if (tablePosition.nRightMargin != null) attrs.push(`w:rightFromText="${tablePosition.nRightMargin}"`);
  attrs.push(`w:vertAnchor="${nYBind === 0 ? "margin" : nYBind === 1 ? "page" : "text"}"`);
  attrs.push(`w:horzAnchor="${nXBind === 0 ? "text" : nXBind === 1 ? "margin" : "page"}"`);
  if (tablePosition.nUpperMargin != null) attrs.push(`w:topFromText="${tablePosition.nUpperMargin}"`);
  if (tablePosition.nLowerMargin != null) attrs.push(`w:bottomFromText="${tablePosition.nLowerMargin}"`);

  if (tablePosition.nTDxaAbs != null) {
    attrs.push(`w:tblpX="${tablePosition.nTDxaAbs}"`);
  }
  if (tablePosition.nTDyaAbs != null) {
    attrs.push(`w:tblpY="${tablePosition.nTDyaAbs}"`);
  }

  return `<w:tblpPr ${attrs.join(" ")}/>`;
}

function extractTablePosition(table, paragraphProperties, paragraphRanges) {
  const positions = [];
  let noAllowOverlap = false;
  for (let i = 0; i < paragraphRanges.length; i += 1) {
    const range = paragraphRanges[i];
    if (range.cpEnd <= table.cpStart || range.cpStart >= table.cpEnd) continue;
    const props = paragraphProperties[i];
    if (props?.tablePosition) {
      positions.push(props.tablePosition);
    }
    if (props?.tableNoAllowOverlap) {
      noAllowOverlap = true;
    }
  }
  if (positions.length === 0) return null;
  const merged = {};
  for (const position of positions) {
    for (const [key, value] of Object.entries(position)) {
      if (value == null) continue;
      if (merged[key] == null) {
        merged[key] = value;
        continue;
      }
      if (merged[key] !== value) {
        throw new Error(`Conflicting table position sprms were parsed for a single table: ${key}`);
      }
    }
  }
  return { ...merged, noAllowOverlap };
}

function tableRowToXml(row, rawText, paragraphProperties, paragraphRanges, characterProperties, fontTable, table, tableProps = TABLE_DOCX_PROPS, documentOptions = {}) {
  const rowHeight = row.rowHeight ?? 460;
  const rowHeightRule = row.rowHeightRule === 1 ? "exact" : "atLeast";

  const trPrParts = [`        <w:trPr>`];

  // Calculate grid column coverage
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
        trPrParts.push(`          <w:gridAfter w:val="${remaining}"/>`);
        trPrParts.push(`          <w:wAfter w:w="${remainingWidth}" w:type="dxa"/>`);
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
          trPrParts.push(`          <w:gridBefore w:val="${startCol}"/>`);
          trPrParts.push(`          <w:wBefore w:w="${beforeWidth}" w:type="dxa"/>`);
        }
      }
    }
  }

  if (row.cantSplit) {
    trPrParts.push(`          <w:cantSplit/>`);
  }
  if (rowHeight != null) {
    trPrParts.push(`          <w:trHeight w:val="${rowHeight}" w:hRule="${rowHeightRule}"/>`);
  }
  if (row.repeatHeader) {
    trPrParts.push(`          <w:tblHeader/>`);
  }
  if (row.tableJustification && row.tableJustification !== "left") {
    trPrParts.push(`          <w:jc w:val="${row.tableJustification}"/>`);
  }
  trPrParts.push(`        </w:trPr>\n`);

  const cellsXml = row.cells
    .map((cell, cellIndex) => tableCellToXml(cell, rawText, paragraphProperties, paragraphRanges, characterProperties, fontTable, table, cellIndex, row, documentOptions))
    .join("");

  const rowParaId = nextParaId();
  return `      <w:tr w14:paraId="${rowParaId}">\n${trPrParts.join("\n")}${cellsXml}      </w:tr>\n`;
}

function tableCellToXml(cell, rawText, paragraphProperties, paragraphRanges, characterProperties, fontTable, table = null, cellIndex = 0, row = null, documentOptions = {}) {
  const gridSpanXml = cell.gridSpan && cell.gridSpan > 1 ? `\n          <w:gridSpan w:val="${cell.gridSpan}"/>` : "";
  const vMergeXml = cell.vMerge === "restart" ? `\n          <w:vMerge w:val="restart"/>` : cell.vMerge === "continue" ? `\n          <w:vMerge w:val="continue"/>` : "";
  const vAlign = cell.vAlign || "center";
  const tcBordersXml = buildCellBordersXml(table, cell, cellIndex, documentOptions);
  const shadingXml = cell.shading ? `\n          <w:shd w:val="${cell.shading.val}" w:color="${cell.shading.color}" w:fill="${cell.shading.fill}"/>` : "";
  const tcPrXml = `        <w:tcPr>\n          <w:tcW w:w="${cell.width}" w:type="dxa"/>${gridSpanXml}${vMergeXml}${tcBordersXml}${shadingXml}\n          <w:noWrap w:val="0"/>\n          <w:vAlign w:val="${vAlign}"/>\n        </w:tcPr>\n`;
  const bookmarkStartXml = "";
  const bookmarkEndXml = "";
  const suppressBold = row?.repeatHeader === true && !documentOptions.lineGridWithoutHeaderSubdocument;

  const cellParagraphs = splitCellParagraphsRaw(rawText, cell.cpStart, cell.cpEnd);
  const parasXml = cellParagraphs
    .map((para, paragraphIndex) => tableCellParagraphToXml(
      para,
      paragraphPropertiesForCp(paragraphProperties, paragraphRanges, para.cpStart),
      characterProperties,
      fontTable,
      suppressBold,
      documentOptions,
      documentOptions.includeGoBackBookmarkInFirstCell && cellIndex === 0 && paragraphIndex === 0,
    ))
    .join("");

  return `      <w:tc>\n${tcPrXml}${bookmarkStartXml}${parasXml}${bookmarkEndXml}      </w:tc>\n`;
}


function buildCellBordersXml(table, cell, cellIndex, documentOptions = {}) {
  const parts = [];
  if (cell?.vMerge === "continue" && cell?.borders?.top?.style === "none") {
    parts.push(`<w:top w:val="nil"/>`);
  } else if (cell?.borders?.top?.style) {
    parts.push(buildCellBorderSideXml("top", cell.borders.top, documentOptions));
  }
  if (cell?.borders?.left?.style) {
    parts.push(buildCellBorderSideXml("left", cell.borders.left, documentOptions));
  }
  if (cell?.borders?.bottom?.style) {
    parts.push(buildCellBorderSideXml("bottom", cell.borders.bottom, documentOptions));
  }
  if (cell?.borders?.right?.style) {
    parts.push(buildCellBorderSideXml("right", cell.borders.right, documentOptions));
  }
  if (table?.tableAutofit && table?.tableBorders?.insideV?.style !== "none") {
    if (cellIndex > 0 && (!cell?.borders?.left?.style || cell.borders.left.style === "none")) {
      parts.push(`<w:left w:val="nil"/>`);
    }
    if (cellIndex < table.gridCols.length - 1 && (!cell?.borders?.right?.style || cell.borders.right.style === "none")) {
      parts.push(`<w:right w:val="nil"/>`);
    }
  }
  const borderParts = parts.filter(Boolean);
  if (borderParts.length === 0) return "";
  return `\n          <w:tcBorders>${borderParts.join("")}</w:tcBorders>`;
}

function buildCellBorderSideXml(side, border, documentOptions = {}) {
  if (!border) {
    throw new Error(`Missing parsed cell border side ${side}`);
  }
  if (border.style === "none") {
    return documentOptions.emitNilCellBorders ? `<w:${side} w:val="nil"/>` : "";
  }
  const color = border.color ?? "auto";
  return `<w:${side} w:val="${border.style}" w:color="${color}" w:sz="${border.width}" w:space="${border.space ?? 0}"/>`;
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

function tableCellParagraphToXml(paragraph, properties, characterProperties, fontTable, suppressBold = false, documentOptions = {}, includeGoBackBookmark = false) {
  const paragraphMarkProperties = characterProperties[paragraph.cpEnd - 1] ?? characterProperties[paragraph.cpStart + paragraph.text.length] ?? null;
  const suppressTableCellDefaults = shouldSuppressTableCellDefaults(properties, paragraphMarkProperties);
  const pPrXml = buildTableCellParagraphPropertiesXml(
    properties,
    suppressBold ? { ...(paragraphMarkProperties ?? {}), bold: false } : paragraphMarkProperties,
    fontTable,
    paragraph.text,
    suppressBold,
    documentOptions,
  );
  const pid = nextParaId();
  const goBackBookmark = includeGoBackBookmark ? `<w:bookmarkStart w:id="${documentOptions.goBackBookmarkId ?? 0}" w:name="_GoBack"/><w:bookmarkEnd w:id="${documentOptions.goBackBookmarkId ?? 0}"/>` : "";

  if (!paragraph.text || paragraph.text.length === 0) {
    return `        <w:p w14:paraId="${pid}">\n${pPrXml}${goBackBookmark}        </w:p>\n`;
  }

  const runs = buildRuns(
    paragraph.text,
    characterProperties,
    fontTable,
    paragraph.cpStart,
    properties,
    suppressBold ? { bold: false } : null,
    {
      emitDefaultColor: suppressBold,
      emitDefaultHighlight: suppressBold,
      emitComplexScriptSize: suppressBold,
      emitExplicitComplexScriptSize: true,
      emitUnderlineHighlight: !documentOptions.lineGridWithoutHeaderSubdocument,
      suppressComplexScriptSize: documentOptions.suppressComplexScriptSize,
      suppressComplexScriptToggles: documentOptions.lineGridWithoutHeaderSubdocument,
      suppressDefaultRunFonts: suppressTableCellDefaults,
    },
    buildBookmarkEventsForParagraph(documentOptions.bookmarks ?? [], paragraph),
  );
  return `        <w:p w14:paraId="${pid}">\n${pPrXml}${goBackBookmark}          ${runs}\n        </w:p>\n`;
}

function shouldSuppressTableCellDefaults(properties, paragraphMarkProperties) {
  if (!paragraphMarkProperties) return false;
  return paragraphMarkProperties.fontId == null
    && paragraphMarkProperties.fontAscii == null
    && paragraphMarkProperties.fontEastAsia == null
    && paragraphMarkProperties.fontHAnsi == null
    && paragraphMarkProperties.fontCs == null;
}

function shouldSuppressTableCellParagraphControls(paragraphMarkProperties) {
  if (!paragraphMarkProperties) return false;
  return paragraphMarkProperties.fontAscii != null
    && paragraphMarkProperties.fontId == null
    && paragraphMarkProperties.fontEastAsia == null
    && paragraphMarkProperties.fontHAnsi == null
    && paragraphMarkProperties.fontCs == null;
}

function buildTableCellParagraphPropertiesXml(properties, paragraphMarkProperties, fontTable, paragraphText = "", suppressBold = false, documentOptions = {}) {
  const parts = [];
  const suppressTableCellDefaults = shouldSuppressTableCellDefaults(properties, paragraphMarkProperties);
  const suppressTableCellParagraphControls = shouldSuppressTableCellParagraphControls(paragraphMarkProperties);

  if (properties?.styleId) {
    parts.push(`<w:pStyle w:val="${escapeXml(properties.styleId)}"/>`);
  }

  const numbering = buildParagraphNumberingXml(properties, paragraphText, documentOptions);
  appendParagraphControlXml(parts, properties, {
    includeDefaults: true,
    lineNumberCount: properties?.lineNumberCount,
    numberingXml: numbering.xml,
    phase: "beforeTabs",
  });
  appendParagraphTabsXml(parts, properties, paragraphText, numbering.hasListTabs);
  if (!documentOptions.suppressEastAsianParagraphControls && !suppressTableCellDefaults && !suppressTableCellParagraphControls && !documentOptions.suppressTableCellParagraphControls) {
    appendParagraphControlXml(parts, properties, {
      includeDefaults: !documentOptions.lineGridWithoutHeaderSubdocument,
      phase: "afterTabs",
    });
  }
  appendParagraphSpacingXml(parts, properties, null);
  appendParagraphIndentXml(parts, properties, paragraphText);
  if (properties?.alignment) {
    parts.push(`<w:jc w:val="${properties.alignment}"/>`);
  }
  if (properties?.textAlignment) {
    parts.push(`<w:textAlignment w:val="${properties.textAlignment}"/>`);
  }

  const emitListDefaults = properties?.styleId === "25";
  const emitParsedComplexSize = paragraphMarkProperties?.background != null;
  const paragraphRunProperties = buildRunPropertiesXmlFromProps(paragraphMarkProperties, fontTable, {
    includeDefaults: false,
    emitComplexScriptSize: suppressBold || emitListDefaults || emitParsedComplexSize,
    emitExplicitComplexScriptSize: true,
    emitDefaultColor: suppressBold || emitListDefaults,
    emitDefaultHighlight: suppressBold || emitListDefaults,
    emitUnderlineHighlight: !documentOptions.lineGridWithoutHeaderSubdocument,
    suppressBold,
    suppressComplexScriptSize: documentOptions.suppressComplexScriptSize,
    suppressComplexScriptToggles: documentOptions.lineGridWithoutHeaderSubdocument,
  });
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
  // MS-DOC-SPEC/16: 0x0E is the column-break character — keep it for
  // rendering as <w:br w:type="column"/> in buildRuns.
  return text.replace(/[\x00-\x06\x08\x0b\x0d\x0f-\x1f]/g, "");
}

function paragraphToXml(paragraph, properties, characterProperties, fontTable, charIdx, sectionProperties = null, spacingSectionProperties = sectionProperties, sectionIndex = -1, paraId = null, includeGoBackBookmark = false, documentOptions = {}) {
  const charCount = paragraph.text.length;
  const paragraphMarkProperties = characterProperties[paragraph.cpEnd - 1] ?? characterProperties[charIdx + charCount] ?? null;
  const pPr = buildParagraphPropertiesXml(
    properties,
    paragraphMarkProperties,
    fontTable,
    sectionProperties,
    spacingSectionProperties,
    sectionIndex,
    paragraph.text,
    documentOptions,
  );
  const runs = buildRuns(paragraph.text, characterProperties, fontTable, charIdx, properties, null, {
    suppressComplexScriptSize: documentOptions.suppressComplexScriptSize,
  }, buildBookmarkEventsForParagraph(documentOptions.bookmarks ?? [], paragraph));
  const pid = paraId || nextParaId();
  const goBackBookmark = includeGoBackBookmark ? `<w:bookmarkStart w:id="${documentOptions.goBackBookmarkId ?? 0}" w:name="_GoBack"/><w:bookmarkEnd w:id="${documentOptions.goBackBookmarkId ?? 0}"/>` : "";
  return {
    xml: `    <w:p w14:paraId="${pid}">${pPr}${goBackBookmark}${runs}</w:p>\n`,
  };
}

function buildBookmarkEventsForParagraph(bookmarks, paragraph) {
  const events = { starts: new Map(), ends: new Map() };
  const textStart = paragraph.cpStart;
  const textEnd = paragraph.cpStart + paragraph.text.length;
  const paragraphEnd = paragraph.cpEnd ?? textEnd;
  for (const bookmark of bookmarks) {
    if (bookmark.cpStart >= textStart && bookmark.cpStart <= textEnd) {
      const tags = events.starts.get(bookmark.cpStart) ?? [];
      tags.push(`<w:bookmarkStart w:id="${bookmark.id}" w:name="${escapeXml(bookmark.name)}"/>`);
      events.starts.set(bookmark.cpStart, tags);
    }
    if (bookmark.cpEnd >= textStart && bookmark.cpEnd <= paragraphEnd) {
      // MS-DOC-SPEC/18 Plcfbkf/Plcfbkl stores a limit CP, which can be equal
      // to the start CP or land on the paragraph mark. The paragraph mark is
      // not emitted as text here, so attach that end marker to the text edge.
      const endCp = Math.min(bookmark.cpEnd, textEnd);
      const tags = events.ends.get(endCp) ?? [];
      tags.push(`<w:bookmarkEnd w:id="${bookmark.id}"/>`);
      events.ends.set(endCp, tags);
    }
  }
  return events;
}

function buildRuns(paragraph, characterProperties, fontTable, charIdx, paragraphProperties = null, runOverrides = null, runDefaults = null, bookmarkEvents = null) {
  if (paragraph.length === 0) return "";

  const parts = splitTabsAndMarks(paragraph);
  let currentCharIdx = charIdx;
  const runs = [];

  for (const part of parts) {
    if (part === "\t") {
      runs.push(bookmarkTagsAtCp(bookmarkEvents, currentCharIdx));
      const rPr = buildRunPropertiesXml(characterProperties, fontTable, currentCharIdx, runOverrides, runDefaults);
      runs.push(`<w:r>${rPr}<w:tab/></w:r>`);
      currentCharIdx += 1;
      runs.push(bookmarkTagsAtCp(bookmarkEvents, currentCharIdx));
      continue;
    }
    if (part === "\x07" || part === "\x0c") {
      runs.push(bookmarkTagsAtCp(bookmarkEvents, currentCharIdx));
      currentCharIdx += 1;
      runs.push(bookmarkTagsAtCp(bookmarkEvents, currentCharIdx));
      continue;
    }
    // MS-DOC-SPEC/16: 0x0E is the column-break character
    // (end-of-column character). Render as <w:br w:type="column"/>.
    if (part === "\x0e") {
      runs.push(bookmarkTagsAtCp(bookmarkEvents, currentCharIdx));
      const rPr = buildRunPropertiesXml(characterProperties, fontTable, currentCharIdx, runOverrides, runDefaults);
      runs.push(`<w:r>${rPr}<w:br w:type="column"/></w:r>`);
      currentCharIdx += 1;
      runs.push(bookmarkTagsAtCp(bookmarkEvents, currentCharIdx));
      continue;
    }

    runs.push(...buildTextRuns(part, characterProperties, fontTable, currentCharIdx, paragraphProperties, runOverrides, runDefaults, bookmarkEvents));
    currentCharIdx += part.length;
  }
  runs.push(bookmarkTagsAtCp(bookmarkEvents, currentCharIdx));

  return runs.join("");
}

function bookmarkTagsAtCp(bookmarkEvents, cp) {
  if (!bookmarkEvents) return "";
  const starts = bookmarkEvents.starts.get(cp) ?? [];
  const ends = bookmarkEvents.ends.get(cp) ?? [];
  bookmarkEvents.starts.delete(cp);
  bookmarkEvents.ends.delete(cp);
  return [...starts, ...ends].join("");
}

function splitTabsAndMarks(value) {
  const parts = [];
  let start = 0;
  for (let i = 0; i < value.length; i += 1) {
    if (value[i] === "\t" || value[i] === "\x07" || value[i] === "\x0c" || value[i] === "\x0e") {
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

function buildTextRuns(text, characterProperties, fontTable, charIdx, paragraphProperties = null, runOverrides = null, runDefaults = null, bookmarkEvents = null) {
  const runs = [];
  let start = 0;
  runs.push(bookmarkTagsAtCp(bookmarkEvents, charIdx));
  while (start < text.length) {
    const currentProps = runOverrides ? { ...(characterProperties[charIdx + start] ?? {}), ...runOverrides } : characterProperties[charIdx + start];
    const propsKey = runPropertiesKey(currentProps, fontTable);
    let end = start + 1;
    while (end < text.length) {
      const nextProps = runOverrides ? { ...(characterProperties[charIdx + end] ?? {}), ...runOverrides } : characterProperties[charIdx + end];
      if (runPropertiesKey(nextProps, fontTable) !== propsKey) break;
      if (hasBookmarkBoundary(bookmarkEvents, charIdx + end)) break;
      end += 1;
    }

    const part = text.slice(start, end);
    const isListPrefix = start === 0 && paragraphProperties?.inTable && (paragraphProperties.firstLineIndent ?? 0) < 0 && /\d+\./.test(part);
    let rPr = isListPrefix
      ? buildRunPropertiesXmlFromProps(
          {
            ...(currentProps ?? {}),
            langId: 0x0409,
            langIdEastAsia: 0x0804,
          },
          fontTable,
          { includeDefaults: true, suppressBold: runOverrides?.bold === false, ...runDefaults },
        )
      : buildRunPropertiesXml(characterProperties, fontTable, charIdx + start, runOverrides, runDefaults);
    if (isListPrefix) {
      rPr = rPr.replace(/<w:szCs w:val="\d+"\/>/g, "");
    }
    if (currentProps?.symbolChar != null) {
      runs.push(buildSymbolRun(currentProps, fontTable, rPr, part.length));
    } else {
      const spaceAttr = needsPreservedSpace(part) ? ' xml:space="preserve"' : "";
      runs.push(`<w:r>${rPr}<w:t${spaceAttr}>${escapeXml(part)}</w:t></w:r>`);
    }
    start = end;
    runs.push(bookmarkTagsAtCp(bookmarkEvents, charIdx + start));
  }
  return runs;
}

function hasBookmarkBoundary(bookmarkEvents, cp) {
  if (!bookmarkEvents) return false;
  return bookmarkEvents.starts.has(cp) || bookmarkEvents.ends.has(cp);
}

function buildSymbolRun(props, fontTable, rPr, charCount) {
  if (props.symbolFontId == null) {
    throw new Error("Missing symbol font id for symbol run");
  }
  const fontName = resolveFontName(fontTable, props.symbolFontId);
  if (!fontName) {
    throw new Error(`Missing font table entry for symbol font id ${props.symbolFontId}`);
  }
  if (props.symbolChar == null) {
    throw new Error("Missing symbol char for symbol run");
  }
  const symChar = props.symbolChar.toString(16).toUpperCase().padStart(4, "0");
  const sym = `<w:sym w:font="${escapeXml(fontName)}" w:char="${symChar}"/>`;
  return `<w:r>${rPr}${sym.repeat(charCount)}</w:r>`;
}

function runPropertiesKey(props, fontTable) {
  if (!props) return "";
  return [
    resolveFontName(fontTable, props.fontAscii ?? props.fontId),
    resolveFontName(fontTable, props.fontEastAsia ?? props.fontId),
    resolveFontName(fontTable, props.fontHAnsi ?? props.fontId),
    resolveFontName(fontTable, props.fontCs ?? props.fontId),
    props.bold === true ? 1 : props.bold === false ? 0 : "",
    props.italic === true ? 1 : props.italic === false ? 0 : "",
    props.underline ? 1 : 0,
    props.underlineStyle ?? "",
    props.symbolFontId ?? "",
    props.symbolChar ?? "",
    props.fontSize ?? "",
    props.kern ?? "",
    props.charSpacing ?? "",
    props.charWidth ?? "",
    props.textPosition ?? "",
    props.fontHint ?? "",
    props.textColor ?? "",
    props.highlight ?? "",
    props.background?.val ?? "",
    props.background?.color ?? "",
    props.background?.fill ?? "",
    props.langId ?? "",
    props.langIdEastAsia ?? "",
    props.langIdBidi ?? "",
    props.fontSizeCs ?? "",
  ].join("|");
}

function buildRunPropertiesXml(characterProperties, fontTable, charIdx, overrides = null, runDefaults = null) {
  const props = overrides ? { ...(characterProperties[charIdx] ?? {}), ...overrides } : characterProperties[charIdx];
  return buildRunPropertiesXmlFromProps(props, fontTable, { includeDefaults: true, suppressBold: overrides?.bold === false, ...runDefaults });
}

function buildRunPropertiesXmlFromProps(props, fontTable, { includeDefaults, emitComplexScriptSize = false, emitExplicitComplexScriptSize = false, emitDefaultColor = false, emitDefaultHighlight = false, emitUnderlineHighlight = true, suppressBold = false, suppressComplexScriptSize = false, suppressComplexScriptToggles = false, suppressDefaultRunFonts = false }) {
  if (!props && !includeDefaults) return "";
  if (!props) return `<w:rPr><w:rFonts w:ascii="Times New Roman" w:hAnsi="Times New Roman" w:cs="Times New Roman"/><w:w w:val="100"/></w:rPr>`;

  const hasComplexScriptFont = props.fontCs != null && props.fontCs !== 0;
  const parts = includeDefaults && !suppressDefaultRunFonts
    ? [`<w:rFonts w:ascii="Times New Roman" w:hAnsi="Times New Roman" w:cs="Times New Roman"/>`]
    : [];

  const fontAttrs = buildFontAttributes(props, fontTable);
  if (fontAttrs) {
    const existingIndex = parts.findIndex((part) => part.startsWith("<w:rFonts "));
    if (existingIndex >= 0) {
      parts.splice(existingIndex, 1);
    }
    parts.unshift(`<w:rFonts ${fontAttrs}/>`);
  }

  if (props.bold === true) {
    parts.push(`<w:b/>`);
    if (!suppressComplexScriptToggles && hasComplexScriptFont) parts.push(`<w:bCs/>`);
  } else if (props.bold === false || suppressBold) {
    parts.push(`<w:b w:val="0"/>`);
    if (!suppressComplexScriptToggles && hasComplexScriptFont) {
      parts.push(suppressComplexScriptSize ? `<w:bCs w:val="0"/>` : `<w:bCs/>`);
    }
  }
  if (props.italic === true) {
    parts.push(`<w:i/>`);
  } else if (props.italic === false) {
    parts.push(`<w:i w:val="0"/>`);
    if (!suppressComplexScriptToggles && (hasComplexScriptFont || emitComplexScriptSize)) {
      parts.push(`<w:iCs w:val="0"/>`);
    }
  }
  if (props.textColor != null) {
    // MS-DOC color index 0 is automatic. WPS exports automatic text over an
    // explicit shaded run as black, while plain table/header text stays auto.
    const textColor = props.textColor === "auto" && props.background != null ? "000000" : props.textColor;
    parts.push(`<w:color w:val="${textColor}"/>`);
  } else if (emitDefaultColor) {
    parts.push(`<w:color w:val="auto"/>`);
  }

  if (props.charSpacing != null) {
    parts.push(`<w:spacing w:val="${props.charSpacing}"/>`);
  }

  if (props.charWidth != null) {
    parts.push(`<w:w w:val="${props.charWidth}"/>`);
  }

  if (props.textPosition != null) {
    parts.push(`<w:position w:val="${props.textPosition}"/>`);
  }

  if (props.kern != null) {
    parts.push(`<w:kern w:val="${props.kern}"/>`);
  }

  if (props.fontSize != null) {
    parts.push(`<w:sz w:val="${props.fontSize}"/>`);
  }
  if (props.fontSizeCs != null && (!suppressComplexScriptSize || emitExplicitComplexScriptSize || props.fontSizeCs !== props.fontSize)) {
    // MS-DOC-SPEC/16 sprmCHpsBi is an explicit complex-script half-point size;
    // when it differs from sprmCHps, WPS exports it as w:szCs even without a
    // separate complex-script font.
    parts.push(`<w:szCs w:val="${props.fontSizeCs}"/>`);
  } else if (!suppressComplexScriptSize && props.fontSize != null && (hasComplexScriptFont || emitComplexScriptSize || props.background != null)) {
    parts.push(`<w:szCs w:val="${props.fontSize}"/>`);
  }

  if (props.background != null) {
    parts.push(`<w:shd w:val="${props.background.val}" w:color="${props.background.color}" w:fill="${props.background.fill}"/>`);
  } else if (emitDefaultHighlight || (emitUnderlineHighlight && props.underline === false && props.fontSizeCs != null && props.fontSizeCs === props.fontSize)) {
    parts.push(`<w:highlight w:val="none"/>`);
  }

  if (props.underlineStyle) {
    parts.push(`<w:u w:val="${props.underlineStyle}"/>`);
  } else if (props.underline) {
    parts.push(`<w:u w:val="single"/>`);
  } else if (props.underline === false) {
    parts.push(`<w:u w:val="none"/>`);
  }

  if (props.langId != null || props.langIdEastAsia != null || props.langIdBidi != null) {
    const langAttrs = [];
    if (props.langId != null) {
      langAttrs.push(`w:val="${langIdToBcp47(props.langId)}"`);
    }
    if (props.langIdEastAsia != null) {
      langAttrs.push(`w:eastAsia="${langIdToBcp47(props.langIdEastAsia)}"`);
    }
    if (props.langIdBidi != null) {
      langAttrs.push(`w:bidi="${langIdToBcp47(props.langIdBidi)}"`);
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
    0x0401: "ar-SA",
    0x040c: "fr-FR",
    0x0407: "de-DE",
    0x0410: "it-IT",
    0x040a: "es-ES",
    0x0419: "ru-RU",
    0x0001: "ar",
  };
  return map[langId] ?? "zh-CN";
}

function buildFontAttributes(props, fontTable) {
  if (!props) return "";
  const ascii = resolveFontName(fontTable, props.fontAscii ?? props.fontId);
  const hAnsi = resolveFontName(fontTable, props.fontHAnsi ?? props.fontId);
  const eastAsia = resolveFontName(fontTable, props.fontEastAsia ?? props.fontId);
  const cs = resolveFontName(fontTable, props.fontCs ?? props.fontId);
  const attrs = [];

  if (props.fontHint != null) {
    attrs.push(`w:hint="${props.fontHint}"`);
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

function buildParagraphPropertiesXml(properties, paragraphMarkProperties = null, fontTable = [], sectionProperties = null, spacingSectionProperties = sectionProperties, sectionIndex = -1, paragraphText = "", documentOptions = {}) {
  if (!properties && !paragraphMarkProperties && !sectionProperties) return "";
  const parts = [];
  if (properties?.styleId) {
    parts.push(`<w:pStyle w:val="${escapeXml(properties.styleId)}"/>`);
  }

  const numbering = buildParagraphNumberingXml(properties, paragraphText, documentOptions);
  appendParagraphControlXml(parts, properties, {
    includeDefaults: false,
    lineNumberCount: properties?.lineNumberCount,
    numberingXml: numbering.xml,
    phase: "beforeTabs",
  });
  appendParagraphTabsXml(parts, properties, paragraphText, numbering.hasListTabs);
  if (!documentOptions.suppressEastAsianParagraphControls) {
    appendParagraphControlXml(parts, properties, {
      includeDefaults: false,
      phase: "afterTabs",
    });
  }
  appendParagraphSpacingXml(parts, properties, spacingSectionProperties);
  appendParagraphIndentXml(parts, properties, paragraphText);
  if (properties?.alignment) {
    parts.push(`<w:jc w:val="${properties.alignment}"/>`);
  }
  if (properties?.textAlignment) {
    parts.push(`<w:textAlignment w:val="${properties.textAlignment}"/>`);
  }

  const paragraphRunProperties = buildRunPropertiesXmlFromProps(paragraphMarkProperties, fontTable, {
    includeDefaults: false,
    emitExplicitComplexScriptSize: paragraphMarkProperties?.langIdBidi != null,
    suppressComplexScriptSize: documentOptions.suppressComplexScriptSize,
  });
  if (paragraphRunProperties) {
    parts.push(paragraphRunProperties);
  }
  if (sectionProperties) {
    const footerIds = getFooterIds(sectionIndex >= 0 ? sectionIndex : 0, documentOptions);
    parts.push(buildSectionPropertiesXml(sectionProperties, { ...footerIds, sectionIndex }));
  }

  return parts.length > 0 ? `<w:pPr>${parts.join("")}</w:pPr>` : "";
}

function buildParagraphNumberingXml(properties, paragraphText, documentOptions = {}) {
  if ((properties?.listId != null && properties.listId >= 0) && properties?.listLevel !== 0x0c) {
    const level = properties.listLevel ?? 0;
    return {
      xml: `<w:numPr><w:ilvl w:val="${level}"/><w:numId w:val="${properties.listId}"/></w:numPr>`,
      hasListTabs: false,
    };
  }
  if (!properties?.inTable) return { xml: "", hasListTabs: false };
  if (properties?.firstLineIndent == null || properties.firstLineIndent >= 0) return { xml: "", hasListTabs: false };
  if (!/^\d+\.\s/.test(paragraphText)) return { xml: "", hasListTabs: false };
  return {
    xml: `<w:numPr><w:ilvl w:val="0"/><w:numId w:val="1"/></w:numPr>`,
    hasListTabs: true,
  };
}

function appendParagraphTabsXml(parts, properties, paragraphText, hasListTabs = false) {
  const tabs = hasListTabs ? [{ position: 466, alignment: "left" }] : properties?.tabs;
  if (!tabs?.length) return;
  const tabsXml = tabs
    .map((tab) => `<w:tab w:val="${tab.alignment}"${tab.leader ? ` w:leader="${tab.leader}"` : ""} w:pos="${tab.position}"/>`)
    .join("");
  parts.push(`<w:tabs>${tabsXml}</w:tabs>`);
}

function appendParagraphControlXml(parts, properties, { includeDefaults, lineNumberCount = null, numberingXml = "", phase = "all" }) {
  const emit = (name, value, { defaultValue = null } = {}) => {
    const actual = value ?? (includeDefaults ? defaultValue : null);
    if (actual == null) return;
    parts.push(actual ? `<w:${name}/>` : `<w:${name} w:val="0"/>`);
  };

  if (phase === "all" || phase === "beforeTabs") {
    emit("keepNext", properties?.keepNext);
    emit("keepLines", properties?.keepLines);
    emit("pageBreakBefore", properties?.pageBreakBefore);
    emit("widowControl", properties?.widowControl);
    if (numberingXml) {
      parts.push(numberingXml);
    }
    if (lineNumberCount === true) {
      parts.push(`<w:suppressLineNumbers w:val="0"/>`);
    } else if (lineNumberCount === false) {
      parts.push(`<w:suppressLineNumbers/>`);
    }
  }
  if (phase === "all" || phase === "afterTabs") {
    emit("kinsoku", properties?.kinsoku, { defaultValue: true });
    emit("wordWrap", properties?.wordWrap, { defaultValue: true });
    emit("overflowPunct", properties?.overflowPunct, { defaultValue: true });
    emit("topLinePunct", properties?.topLinePunct, { defaultValue: false });
    emit("autoSpaceDE", properties?.autoSpaceDE);
    emit("autoSpaceDN", properties?.autoSpaceDN);
    emit("bidi", properties?.bidi, { defaultValue: false });
    emit("adjustRightInd", properties?.adjustRightInd);
    emit("snapToGrid", properties?.snapToGrid);
    emit("contextualSpacing", properties?.contextualSpacing);
  }
}

function appendParagraphSpacingXml(parts, properties, sectionProperties = null, { styleContext = false } = {}) {
  const spacingParts = [];
  if (properties?.spacingBefore != null) {
    spacingParts.push(`w:before="${properties.spacingBefore}"`);
  }
  if (properties?.spacingBeforeAuto != null) {
    spacingParts.push(`w:beforeAutospacing="${properties.spacingBeforeAuto ? 1 : 0}"`);
  } else if (properties?.spacingBeforeLines != null) {
    // MS-DOC-SPEC/16 sprmPDylBefore is already stored as 1/100 line units.
    spacingParts.push(`w:beforeLines="${properties.spacingBeforeLines}"`);
  }
  if (properties?.spacingAfter != null) {
    spacingParts.push(`w:after="${properties.spacingAfter}"`);
  }
  if (properties?.spacingAfterAuto != null) {
    spacingParts.push(`w:afterAutospacing="${properties.spacingAfterAuto ? 1 : 0}"`);
  } else if (properties?.spacingAfterLines != null) {
    // MS-DOC-SPEC/16 sprmPDylAfter is already stored as 1/100 line units.
    spacingParts.push(`w:afterLines="${properties.spacingAfterLines}"`);
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
  if (properties?.leftIndentChars != null) {
    indentParts.push(`w:leftChars="${properties.leftIndentChars}"`);
  }
  if (properties?.rightIndent != null) {
    indentParts.push(`w:right="${properties.rightIndent}"`);
  }
  if (properties?.rightIndentChars != null) {
    indentParts.push(`w:rightChars="${properties.rightIndentChars}"`);
  }
  if (properties?.firstLineIndentChars != null) {
    if (properties.firstLineIndent != null) {
      if (properties.firstLineIndent < 0) {
        indentParts.push(`w:hanging="${Math.abs(properties.firstLineIndent)}"`);
      } else {
        indentParts.push(`w:firstLine="${properties.firstLineIndent}"`);
      }
    }
    if (properties.firstLineIndentChars < 0) {
      indentParts.push(`w:hangingChars="${Math.abs(properties.firstLineIndentChars)}"`);
    } else {
      indentParts.push(`w:firstLineChars="${properties.firstLineIndentChars}"`);
      if (properties.firstLineIndentChars === 0) {
        if (properties.firstLineIndent == null) {
          indentParts.push(`w:firstLine="0"`);
        }
      }
    }
  } else if (properties?.firstLineIndent != null) {
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

function buildSectionPropertiesXml(properties = {}, { defaultFooterId, evenFooterId, final = false, sectionIndex = -1 } = {}) {
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
  const parts = [];

  if (defaultFooterId) parts.push(`<w:footerReference r:id="${defaultFooterId}" w:type="default"/>`);
  if (evenFooterId) parts.push(`<w:footerReference r:id="${evenFooterId}" w:type="even"/>`);
  // Section break type is parsed from the binary sprmSBkc (0x3009):
  //   0=continuous, 2=newPage(default), 3=evenPage, 4=oddPage
  // OOXML w:type values: continuous, nextColumn, nextPage, evenPage, oddPage
  const bkc = section.bkc;
  if (bkc != null) {
    const typeMap = { 0: "continuous", 1: "nextColumn", 2: "nextPage", 3: "evenPage", 4: "oddPage" };
    const wType = typeMap[bkc];
    if (wType && wType !== "nextPage") {
      parts.push(`<w:type w:val="${wType}"/>`);
    }
  }
  parts.push(`<w:pgSz w:w="${pageWidth}" w:h="${pageHeight}"${isLandscape ? ' w:orient="landscape"' : ''}/>` );
  parts.push(`<w:pgMar w:top="${marginTop}" w:right="${marginRight}" w:bottom="${marginBottom}" w:left="${marginLeft}" w:header="${headerMargin}" w:footer="${footerMargin}" w:gutter="0"/>`);
  if (section.pageNumberStart != null && section.pageNumberStart > 0) {
    parts.push(`<w:pgNumType w:fmt="decimal" w:start="${section.pageNumberStart}"/>`);
  } else if (section.docGridType !== 2 && !(section.docGridType != null && section.docGridCharSpace == null)) {
    parts.push(`<w:pgNumType w:fmt="decimal"/>`);
  }
  if (section.pageBorders) {
    const sides = ["top", "left", "bottom", "right"];
    if (!sides.every((side) => section.pageBorders[side]?.style === "none")) {
      throw new Error("Unsupported partial or non-empty page borders");
    }
    parts.push(`<w:pgBorders>${sides.map((side) => `<w:${side} w:val="none" w:sz="0" w:space="0"/>`).join("")}</w:pgBorders>`);
  }
  if (section.columnCount != null && section.columnCount > 1) {
    const spacing = section.columnSpacing ?? 720;
    if (section.columnsEvenlySpaced === false && section.columnWidths?.length) {
      const cols = [];
      for (let i = 0; i < section.columnCount; i += 1) {
        const width = section.columnWidths[i];
        if (width == null) {
          throw new Error(`Incomplete section column properties: missing width for column ${i}`);
        }
        const colSpacing = section.columnSpacings?.[i];
        cols.push(`<w:col w:w="${width}"${colSpacing != null ? ` w:space="${colSpacing}"` : ""}/>`);
      }
      parts.push(`<w:cols w:equalWidth="0" w:num="${section.columnCount}">${cols.join("")}</w:cols>`);
    } else {
      parts.push(`<w:cols w:space="${spacing}" w:num="${section.columnCount}"/>`);
    }
  } else {
    // MS-DOC-SPEC/16 sprmSCcolumns: default value 0 means a single-column section.
    // MS-DOC-SPEC/16 sprmSDxaColumns lists 720 twips for LCID 2052.
    parts.push(`<w:cols w:space="720" w:num="1"/>`);
  }
  if (section.titlePg) {
    parts.push(`<w:titlePg/>`);
  }
  if (section.docGridType != null) {
    const docGridType = sectionDocGridTypeToXml(section.docGridType);
    if (docGridType == null) {
      throw new Error(`Unsupported section docGrid type ${section.docGridType}`);
    }
    if (section.docGridLinePitch == null) {
      throw new Error("Incomplete section docGrid properties: missing line pitch");
    }
    // MS-DOC-SPEC/16 sprmSDxtCharSpace: default is no difference between the
    // desired grid character pitch and the Normal style font pitch.
    const charSpace = section.docGridCharSpace ?? 0;
    parts.push(`<w:docGrid w:type="${docGridType}" w:linePitch="${section.docGridLinePitch}" w:charSpace="${charSpace}"/>`);
  }
  return `<w:sectPr>${parts.join("")}</w:sectPr>`;
}

function sectionDocGridTypeToXml(docGridType) {
  switch (docGridType) {
    case 0:
      return "default";
    case 1:
      return "linesAndChars";
    case 2:
      return "lines";
    case 3:
      return "snapToChars";
    default:
      return null;
  }
}

function prqToFamily(prq) {
  const familyCodes = [null, "roman", "swiss", "modern", "script", "decorative"];
  const familyCode = (prq >> 4) & 0x0f;
  return familyCodes[familyCode] ?? "auto";
}

function prqToPitch(prq) {
  const pitchCode = prq & 0x07;
  if (pitchCode === 1) return "fixed";
  if (pitchCode === 2) return "variable";
  return "default";
}

function charsetToHex(charset) {
  return charset != null ? charset.toString(16).padStart(2, "0") : "00";
}

function createFontTableXml(fontTable = []) {
  // Font metadata is derived from the parsed font table properties (MS-DOC FFN).
  // prq provides pitch and family; charset provides the character set.
  const fontEntries = fontTable.filter((font) => font?.name);
  const fonts = fontEntries
    .map((font) => {
      const name = escapeXml(font.name);
      const altName = font.alternateName ? `<w:altName w:val="${escapeXml(font.alternateName)}"/>` : "";
      const charset = charsetToHex(font.charset);
      const family = prqToFamily(font.prq);
      const pitch = prqToPitch(font.prq);
      return `<w:font w:name="${name}">${altName}<w:charset w:val="${charset}"/><w:family w:val="${family}"/><w:pitch w:val="${pitch}"/></w:font>`;
    })
    .join("");

  return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:fonts xmlns:mc="http://schemas.openxmlformats.org/markup-compatibility/2006" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main" xmlns:w14="http://schemas.microsoft.com/office/word/2010/wordml" mc:Ignorable="w14">${fonts}</w:fonts>`;
}function createStylesXml(styles, fontTable = [], wpsDocument = {}) {
  const docDefaults = createDocDefaultsXml(styles, fontTable, wpsDocument);

  // Extract docGrid line pitch from sections for beforeLines/afterLines computation
  const sections = wpsDocument.sections ?? [];
  const docGridLinePitch = sections.find(s => s?.properties?.docGridLinePitch != null)?.properties?.docGridLinePitch ?? null;
  const hasEastAsianGrid = sections.some((section) => section?.properties?.docGridType === 1 || section?.properties?.docGridType === 2);

  const styleEntries = styles
    .filter((s) => s !== null)
    .sort((a, b) => compareStylesForWpsExport(a, b, styles))
    .map((style) => createStyleXml(style, styles, fontTable, docGridLinePitch, { hasEastAsianGrid }));

  return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:styles xmlns:mc="http://schemas.openxmlformats.org/markup-compatibility/2006" xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" xmlns:m="http://schemas.openxmlformats.org/officeDocument/2006/math" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main" xmlns:w14="http://schemas.microsoft.com/office/word/2010/wordml" xmlns:w10="urn:schemas-microsoft-com:office:word" xmlns:sl="http://schemas.openxmlformats.org/schemaLibrary/2006/main" xmlns:wpsCustomData="http://www.wps.cn/officeDocument/2013/wpsCustomData" mc:Ignorable="w14">${docDefaults}${buildLatentStylesXml(styles, wpsDocument)}${styleEntries.join("")}</w:styles>`;
}

function createDocDefaultsXml(styles = [], fontTable = [], wpsDocument = {}) {
  // Default run fonts come from the parsed font table per MS-DOC spec.
  const ascii = fontTable[0]?.name ?? "Times New Roman";
  const hasEastAsianGrid = (wpsDocument.sections ?? []).some((section) => section?.properties?.docGridType === 1 || section?.properties?.docGridType === 2);
  const eastAsia = hasEastAsianGrid ? (fontTable.find((font) => font?.name === "宋体")?.name ?? "宋体") : ascii;
  return `<w:docDefaults><w:rPrDefault><w:rPr><w:rFonts w:ascii="${escapeXml(ascii)}" w:hAnsi="${escapeXml(ascii)}" w:eastAsia="${escapeXml(eastAsia)}" w:cs="Times New Roman"/></w:rPr></w:rPrDefault><w:pPrDefault/></w:docDefaults>`;
}

function createStyleXml(style, styles, fontTable = [], docGridLinePitch = null, styleOptions = {}) {
  const isBuiltIn = style.sti != null && style.sti < STI_NAMES.length && STI_NAMES[style.sti] != null;
  const isCustom = isBuiltIn === false;
  // Default styles: Normal(sti=0), DPF(sti=65), Normal Table(sti=105)
  const defaultAttr = (style.sti === 0 || style.sti === 65 || style.sti === 105) ? ' w:default="1"' : "";
  const customAttr = isCustom ? ' w:customStyle="1"' : "";
  const basedOnXml = buildStyleReferenceXml("basedOn", style, style.baseCode ?? style.basedOn, styles);
  const nextXml = buildStyleReferenceXml("next", style, style.nextCode ?? style.next, styles);
  const name = escapeXml(style.styleName ?? style.name);
  // MS-DOC-SPEC/19 GRFSTD.fQFormat, fSemiHidden, and fUnhideWhenUsed
  // are the defined-style source for the corresponding OOXML behavior.
  // Latent LSD values only apply when the style has no parsed STD flags.
  const hasParsedStyleFlags = style.styleFlags != null;
  const hasQFormat = hasParsedStyleFlags ? style.styleFlags.qFormat === true : style.latent?.fQFormat === true;
  const qFormat = hasQFormat ? `<w:qFormat/>` : "";
  const hasSemiHidden = hasParsedStyleFlags ? style.styleFlags.semiHidden === true : style.latent?.fSemiHidden === true;
  const semiHiddenXml = hasSemiHidden ? `<w:semiHidden/>` : "";
  // uiPriority: use latent LSD iPriority. For custom character styles with no LSD,
  // inherit from the linked paragraph style (adjacent in STSH order).
  let uiPriority = style.uiPriority ?? style.latent?.iPriority;
  if (uiPriority == null && isCustom && style.type === "character") {
    const ordered = styles.filter(s => s !== null).sort((a, b) => (a.index ?? 0) - (b.index ?? 0));
    const myPos = ordered.indexOf(style);
    if (myPos >= 0) {
      for (const delta of [-1, 1]) {
        const other = ordered[myPos + delta];
        if (other && other.type === "paragraph") {
          const charBase = stripCharSuffix(style.name ?? "");
          // Name match or shared linkCode (for weird names like " Char Char")
          if ((charBase !== style.name && (other.name === charBase || other.styleName === charBase))
              || (style.linkCode != null && style.linkCode < 0xfff0 && other.linkCode === style.linkCode)) {
            uiPriority = other.latent?.iPriority ?? 0;
            break;
          }
        }
      }
    }
  }
  const uiPriorityVal = uiPriority != null ? String(uiPriority) : "0";
  const uiPriorityXml = `<w:uiPriority w:val="${uiPriorityVal}"/>`;
  const linkXml = inferStyleLink(style, styles);
  const pPrXml = buildStyleParagraphPropertiesXml(style, docGridLinePitch);
  const rPrXml = buildStyleRunPropertiesXml(style, fontTable);
  const tableStyleReference = styleOptions.hasEastAsianGrid ? escapeXml(style.styleId) : TABLE_STYLE_ID;
  const tableSideMargin = style.sti === 105 || styleOptions.hasEastAsianGrid ? 108 : 0;
  const tblPrXml = style.type === "table"
    ? `<w:tblPr>${style.synthetic ? "" : `<w:tblStyle w:val="${tableStyleReference}"/>`}<w:tblCellMar><w:top w:w="0" w:type="dxa"/><w:left w:w="${tableSideMargin}" w:type="dxa"/><w:bottom w:w="0" w:type="dxa"/><w:right w:w="${tableSideMargin}" w:type="dxa"/></w:tblCellMar></w:tblPr>`
    : "";
  const hasUnhideWhenUsed = hasParsedStyleFlags ? style.styleFlags.unhideWhenUsed === true : style.latent?.fUnhideWhenUsed === true;
  const unhideXml = hasUnhideWhenUsed ? `<w:unhideWhenUsed/>` : "";

  const parts = [
    `<w:name w:val="${name}"/>`,
    basedOnXml,
    linkXml,
    nextXml,
    semiHiddenXml,
    unhideXml,
    qFormat,
    uiPriorityXml,
    pPrXml,
    rPrXml,
    tblPrXml,
  ].filter(Boolean);

  return `  <w:style w:type="${style.type}"${customAttr}${defaultAttr} w:styleId="${escapeXml(style.styleId)}">${parts.join("")}</w:style>`;
}

// WPS export order: Normal(sti=0) → DPF(sti=65) → Normal Table(sti=105) → others in original order
function compareStylesForWpsExport(a, b, styles = []) {
  if (hasDuplicateStyleIds(styles)) {
    return (a.order ?? a.index ?? 0) - (b.order ?? b.index ?? 0);
  }
  const rankA = styleExportRank(a);
  const rankB = styleExportRank(b);
  if (rankA !== rankB) return rankA - rankB;
  return (a.order ?? a.index ?? 0) - (b.order ?? b.index ?? 0);
}

function hasDuplicateStyleIds(styles = []) {
  const seen = new Set();
  for (const style of styles) {
    if (!style?.styleId) continue;
    if (seen.has(style.styleId)) return true;
    seen.add(style.styleId);
  }
  return false;
}

function styleExportRank(style) {
  // Default styles come first: Normal(sti=0) → DPF(sti=65) → Normal Table(sti=105)
  if (style?.sti === 0) return 0;
  if (style?.index === 1) return 1;
  if (style?.sti === 65) return 2;
  if (style?.sti === 105) return 3;
  // All other styles follow by numeric styleId
  const numeric = Number(style?.styleId);
  if (Number.isInteger(numeric)) return numeric + 100;
  return 10000 + (style?.order ?? style?.index ?? 0);
}

function buildStyleReferenceXml(tag, style, rawCode, styles = []) {
  if (rawCode === null || rawCode === undefined || rawCode >= 0xfff0 || rawCode === 0x0fff) return "";
  if (rawCode === style.index) return "";
  let styleId = null;
  if (styles[rawCode]?.styleId) {
    styleId = styles[rawCode].styleId;
  } else if (rawCode === 0) {
    styleId = "1";
  } else if (rawCode === 10) {
    styleId = "9";
  } else if (rawCode === 161) {
    styleId = "9";
  } else {
    styleId = String(rawCode);
  }
  return `<w:${tag} w:val="${escapeXml(styleId)}"/>`;
}
// Strip repeated " Char[digits]" suffixes from linked character style names
function stripCharSuffix(n) {
  let prev = n;
  while (true) {
    const stripped = prev.replace(/ Char[0-9]*$/, "");
    if (stripped === prev) break;
    prev = stripped;
  }
  return prev;
}

function inferStyleLink(style, styles = []) {
  const name = style.name ?? "";
  if (style.linkCode != null && style.linkCode !== 0 && style.linkCode < 0xfff0) {
    const linked = styles[style.linkCode];
    if (linked?.styleId && (
      (style.type === "paragraph" && linked.type === "character")
      || (style.type === "character" && linked.type === "paragraph")
    )) {
      // MS-DOC-SPEC/19 StdfPost2000.istdLink is an STSH index of the linked
      // style; OOXML stores the target styleId in w:link.
      return `<w:link w:val="${escapeXml(linked.styleId)}"/>`;
    }
  }

  // Build a list of non-null styles in STSH index order for adjacency checks
  const ordered = styles.filter(s => s !== null).sort((a, b) => (a.index ?? 0) - (b.index ?? 0));

  // Check if two adjacent styles share the same istdLink (linkCode) — WPS uses this
  // as the primary link signal when names don't match (e.g. " Char Char" → "页脚").
  const shareLinkCode = (a, b) => {
    if (a.linkCode == null || b.linkCode == null) return false;
    if (a.linkCode === 0 || b.linkCode === 0) return false;
    if (a.linkCode >= 0xfff0 || b.linkCode >= 0xfff0) return false;
    return a.linkCode === b.linkCode;
  };

  if (style.type === "character") {
    const baseName = stripCharSuffix(name);
    const myPos = ordered.indexOf(style);
    // First pass: try name matching
    for (const delta of [-1, 1]) {
      const other = ordered[myPos + delta];
      if (!other || other.type !== "paragraph") continue;
      if (other.name === baseName || other.styleName === baseName) {
        return `<w:link w:val="${escapeXml(other.styleId)}"/>`;
      }
    }
    // Second pass: try shared istdLink (linkCode) as fallback for weird names
    for (const delta of [-1, 1]) {
      const other = ordered[myPos + delta];
      if (!other || other.type !== "paragraph") continue;
      if (shareLinkCode(style, other)) {
        return `<w:link w:val="${escapeXml(other.styleId)}"/>`;
      }
    }
  } else if (style.type === "paragraph") {
    const myPos = ordered.indexOf(style);
    // First pass: name matching
    for (const delta of [-1, 1]) {
      const other = ordered[myPos + delta];
      if (!other || other.type !== "character") continue;
      const otherName = other.name ?? "";
      const baseOther = stripCharSuffix(otherName);
      if (baseOther === name && baseOther !== otherName) {
        return `<w:link w:val="${escapeXml(other.styleId)}"/>`;
      }
    }
    // Second pass: shared linkCode fallback
    for (const delta of [-1, 1]) {
      const other = ordered[myPos + delta];
      if (!other || other.type !== "character") continue;
      if (shareLinkCode(style, other)) {
        return `<w:link w:val="${escapeXml(other.styleId)}"/>`;
      }
    }
  }
  return "";
}

function buildStyleParagraphPropertiesXml(style, docGridLinePitch = null) {
  const parts = [];
  const paragraphStyle = style;

  const numbering = buildParagraphNumberingXml(paragraphStyle, "");
  appendParagraphControlXml(parts, paragraphStyle, {
    includeDefaults: false,
    lineNumberCount: paragraphStyle?.lineNumberCount,
    numberingXml: numbering.xml,
    phase: "beforeTabs",
  });
  if (paragraphStyle.paragraphBorders) {
    const borderParts = [];
    for (const [side, brc] of Object.entries(paragraphStyle.paragraphBorders)) {
      if (!brc) continue;
      borderParts.push(`<w:${side} w:val="${escapeXml(brc.val)}" w:color="${escapeXml(brc.color)}" w:sz="${escapeXml(brc.sz)}" w:space="${escapeXml(brc.space)}"/>`);
    }
    if (borderParts.length) {
      parts.push(`<w:pBdr>${borderParts.join("")}</w:pBdr>`);
    }
  }
  if (!numbering.xml) {
    appendParagraphTabsXml(parts, paragraphStyle, "", false);
  }
  appendParagraphControlXml(parts, paragraphStyle, {
    includeDefaults: false,
    phase: "afterTabs",
  });
  if (paragraphStyle.frameWidth != null || paragraphStyle.frameHeight != null || paragraphStyle.frameXAlign != null || paragraphStyle.frameY != null) {
    const fparts = [];
    if (paragraphStyle.frameWidth != null) fparts.push(`w:w="${paragraphStyle.frameWidth}"`);
    if (paragraphStyle.frameHeight != null) fparts.push(`w:h="${paragraphStyle.frameHeight}"`);
    if (paragraphStyle.frameHRule != null) fparts.push(`w:hRule="${paragraphStyle.frameHRule}"`);
    if (paragraphStyle.frameWrap != null) fparts.push(`w:wrap="${paragraphStyle.frameWrap}"`);
    if (paragraphStyle.frameVAnchor != null) fparts.push(`w:vAnchor="${paragraphStyle.frameVAnchor}"`);
    if (paragraphStyle.frameHAnchor != null) fparts.push(`w:hAnchor="${paragraphStyle.frameHAnchor}"`);
    if (paragraphStyle.frameXAlign != null) fparts.push(`w:xAlign="${paragraphStyle.frameXAlign}"`);
    if (paragraphStyle.frameYAlign != null) fparts.push(`w:yAlign="${paragraphStyle.frameYAlign}"`);
    if (paragraphStyle.frameX != null) fparts.push(`w:x="${paragraphStyle.frameX}"`);
    if (paragraphStyle.frameY != null) fparts.push(`w:y="${paragraphStyle.frameY}"`);
    if (paragraphStyle.frameLocked) fparts.push(`w:anchorLock="1"`);
    if (fparts.length) parts.push(`<w:framePr ${fparts.join(" ")}/>`);
  }
  appendParagraphSpacingXml(parts, paragraphStyle, docGridLinePitch != null ? { docGridLinePitch } : null, { styleContext: true });
  appendParagraphIndentXml(parts, paragraphStyle, "");
  if (paragraphStyle.alignment) {
    parts.push(`<w:jc w:val="${paragraphStyle.alignment}"/>`);
  }
  if (paragraphStyle.textAlignment) {
    parts.push(`<w:textAlignment w:val="${paragraphStyle.textAlignment}"/>`);
  }
  if (paragraphStyle.outlineLevel != null) {
    parts.push(`<w:outlineLvl w:val="${paragraphStyle.outlineLevel}"/>`);
  }

  if (!parts.length) return "";
  return `<w:pPr>${parts.join("")}</w:pPr>`;
}

function buildStyleRunPropertiesXml(style, fontTable) {
  const runPropertiesXml = style.runProperties
    ? buildRunPropertiesXmlFromProps(style.runProperties, fontTable, { includeDefaults: false, emitExplicitComplexScriptSize: true, emitUnderlineHighlight: false })
    : "";
  return runPropertiesXml;
}

function buildLatentStylesXml(styles = [], wpsDocument = {}) {
  const latentLsd = wpsDocument.latentLsd ?? [];
  // MS-DOC-SPEC/19 Stshif.stiMaxWhenSaved is version-dependent; Appendix A
  // lists 156 for Word 2002/2003 and 267 for Word 2007+. WPS DOCX exports
  // the standard OOXML 260-count latentStyles table, so table-style latent
  // defaults beyond a Word 2003-era STSH are synthesized below.
  const stiMax = Math.max(wpsDocument.stiMaxWhenSaved ?? 0, 259);
  const parts = ['<w:latentStyles w:count="260" w:defQFormat="0" w:defUnhideWhenUsed="1" w:defSemiHidden="1" w:defUIPriority="99" w:defLockedState="0">'];
  for (let sti = 0; sti < STI_NAMES.length && sti <= stiMax; sti += 1) {
    const name = STI_NAMES[sti];
    const latent = latentLsd[sti] ?? synthesizeLatentStyleDefaults(sti, name);
    if (!latent || !name) continue;
    // Skip deprecated HTML/numbering styles (92-93, 107-110) which are not real
    // paragraph/character/table styles in the OOXML latentStyles table.
    // sti 156-157, 178-181 are newer paragraph/character styles beyond older
    // binary LSD ranges and never appear in WPS Office DOCX latentStyles output.
    if (sti === 92 || sti === 93 || (sti >= 107 && sti <= 110) || sti === 156 || sti === 157 || sti === 178 || sti === 180 || sti === 181) continue;
    // MS-DOC-SPEC 2.9.145 LSD: sti=179 (List Paragraph) is a real paragraph style.
    // Skip it only when ALL LSD fields match the w:latentStyles defaults
    // (defQFormat=0, defSemiHidden=1, defUnhideWhenUsed=1, defUIPriority=99),
    // in which case the lsdException would be redundant.
    if (sti === 179 && !latent.fQFormat && latent.fSemiHidden && latent.fUnhideWhenUsed && latent.iPriority === 99) continue;
    const attrs = [];
    if (latent.fQFormat) attrs.push('w:qFormat="1"');
    if (!latent.fUnhideWhenUsed) attrs.push('w:unhideWhenUsed="0"');
    attrs.push('w:uiPriority="' + latent.iPriority + '"');
    if (!latent.fSemiHidden) attrs.push('w:semiHidden="0"');
    parts.push('<w:lsdException ' + attrs.join(' ') + ' w:name="' + name + '"/>');
  }
  parts.push('</w:latentStyles>');
  return parts.join('');
}

function synthesizeLatentStyleDefaults(sti, name) {
  if (sti < 158 || sti > 259) return null;
  const baseName = name.replace(/ Accent [1-6]$/, "");
  const tableStylePriorities = {
    "Light Shading": 60,
    "Light List": 61,
    "Light Grid": 62,
    "Medium Shading 1": 63,
    "Medium Shading 2": 64,
    "Medium List 1": 65,
    "Medium List 2": 66,
    "Medium Grid 1": 67,
    "Medium Grid 2": 68,
    "Medium Grid 3": 69,
    "Dark List": 70,
    "Colorful Shading": 71,
    "Colorful List": 72,
    "Colorful Grid": 73,
  };
  const iPriority = tableStylePriorities[baseName];
  if (iPriority == null) return null;
  return {
    fQFormat: false,
    fUnhideWhenUsed: false,
    fSemiHidden: false,
    iPriority,
  };
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
  return /^[\t\n\r ]|[\t\n\r ]$/.test(value);
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
