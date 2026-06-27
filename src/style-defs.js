const BUILTIN_STYLE_DEFINITIONS = [
  {
    rawName: "正文",
    styleId: "1",
    styleName: "Normal",
    type: "paragraph",
    default: true,
    next: "2",
    uiPriority: "0",
    qFormat: true,
  },
  {
    rawName: "正文缩进",
    styleId: "2",
    styleName: "Normal Indent",
    type: "paragraph",
    basedOn: "1",
    uiPriority: "0",
    qFormat: true,
  },
  {
    rawName: "批注文字",
    styleId: "3",
    styleName: "annotation text",
    type: "paragraph",
    basedOn: "1",
    uiPriority: "99",
    qFormat: true,
    unhideWhenUsed: true,
  },
  {
    rawName: "纯文本",
    styleId: "4",
    styleName: "Plain Text",
    type: "paragraph",
    basedOn: "1",
    link: "13",
    uiPriority: "99",
    qFormat: true,
    unhideWhenUsed: true,
  },
  {
    rawName: "页脚",
    styleId: "5",
    styleName: "footer",
    type: "paragraph",
    basedOn: "1",
    link: "14",
    uiPriority: "0",
    qFormat: true,
  },
  {
    rawName: "页眉",
    styleId: "6",
    styleName: "header",
    type: "paragraph",
    basedOn: "1",
    link: "15",
    uiPriority: "0",
    qFormat: true,
  },
  {
    rawName: "普通(网站)",
    styleId: "7",
    styleName: "Normal (Web)",
    type: "paragraph",
    basedOn: "1",
    uiPriority: "99",
    qFormat: true,
    unhideWhenUsed: true,
  },
  {
    rawName: "普通表格",
    styleId: "8",
    styleName: "Normal Table",
    type: "table",
    default: true,
    uiPriority: "99",
    qFormat: true,
    unhideWhenUsed: true,
  },
  {
    rawName: "默认段落字体",
    styleId: "9",
    styleName: "Default Paragraph Font",
    type: "character",
    default: true,
    uiPriority: "0",
    qFormat: true,
  },
  {
    rawName: "页码",
    styleId: "10",
    styleName: "page number",
    type: "character",
    basedOn: "9",
    uiPriority: "99",
    qFormat: true,
    unhideWhenUsed: true,
  },
  {
    rawName: "超链接",
    styleId: "11",
    styleName: "Hyperlink",
    type: "character",
    uiPriority: "0",
    qFormat: true,
  },
  {
    rawName: "批注引用",
    styleId: "12",
    styleName: "annotation reference",
    type: "character",
    uiPriority: "99",
    qFormat: true,
    unhideWhenUsed: true,
  },
  {
    rawName: "纯文本 Char",
    styleId: "13",
    styleName: "纯文本 Char",
    type: "character",
    customStyle: true,
    link: "4",
    uiPriority: "99",
    qFormat: true,
  },
  {
    rawName: "页脚 Char",
    styleId: "14",
    styleName: "页脚 Char",
    type: "character",
    customStyle: true,
    link: "5",
    uiPriority: "0",
    qFormat: true,
  },
  {
    rawName: "页眉 Char",
    styleId: "15",
    styleName: "页眉 Char",
    type: "character",
    customStyle: true,
    link: "6",
    uiPriority: "0",
    qFormat: true,
  },
  {
    rawName: "段 Char",
    styleId: "16",
    styleName: "段 Char",
    type: "character",
    customStyle: true,
    uiPriority: "0",
    qFormat: true,
  },
];

const BUILTIN_STYLE_DEFINITION_BY_RAW_NAME = new Map(
  BUILTIN_STYLE_DEFINITIONS.map((definition) => [definition.rawName, definition]),
);

const BUILTIN_STYLE_DEFINITION_BY_ID = new Map(
  BUILTIN_STYLE_DEFINITIONS.map((definition) => [definition.styleId, definition]),
);

export function getBuiltInStyleDefinitionByRawName(rawName) {
  return BUILTIN_STYLE_DEFINITION_BY_RAW_NAME.get(rawName) ?? null;
}

export function getBuiltInStyleDefinitionById(styleId) {
  return BUILTIN_STYLE_DEFINITION_BY_ID.get(String(styleId)) ?? null;
}

export function resolveStyleIdFromRawName(rawName, index) {
  return getBuiltInStyleDefinitionByRawName(rawName)?.styleId ?? String(index + 1);
}

export function resolveStyleNameFromRawName(rawName) {
  return getBuiltInStyleDefinitionByRawName(rawName)?.styleName ?? rawName;
}

export function resolveStyleTypeFromSgc(rawName, sgc) {
  const builtIn = getBuiltInStyleDefinitionByRawName(rawName);
  if (builtIn) return builtIn.type;
  if (sgc === 2) return "character";
  if (sgc === 5) return "table";
  return "paragraph";
}
