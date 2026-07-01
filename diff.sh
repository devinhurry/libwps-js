#!/usr/bin/env bash
set -euo pipefail

if [[ $# -ne 1 ]]; then
  echo "Usage: $0 <sample-name>" >&2
  exit 1
fi

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SAMPLE_NAME="$1"
SAMPLE_DIR="$SCRIPT_DIR/sample/$SAMPLE_NAME"
ORIGINAL_WPS="$SAMPLE_DIR/original.wps"
EXPECTED_DOCX="$SAMPLE_DIR/expected.docx"
CONVERTED_DOCX="$SAMPLE_DIR/converted.docx"
EXPECTED_DIR="$SAMPLE_DIR/expected"
CONVERTED_DIR="$SAMPLE_DIR/converted"

if [[ ! -f "$ORIGINAL_WPS" ]]; then
  echo "Missing input file: $ORIGINAL_WPS" >&2
  exit 1
fi

if [[ ! -f "$EXPECTED_DOCX" ]]; then
  echo "Missing expected DOCX: $EXPECTED_DOCX" >&2
  exit 1
fi

if ! command -v xmllint >/dev/null 2>&1; then
  echo "Missing required tool: xmllint" >&2
  exit 1
fi

node "$SCRIPT_DIR/bin/msdoc-wps-to-docx.js" "$ORIGINAL_WPS" "$CONVERTED_DOCX"

rm -rf "$EXPECTED_DIR" "$CONVERTED_DIR"
mkdir -p "$EXPECTED_DIR" "$CONVERTED_DIR"
unzip -oq "$EXPECTED_DOCX" -d "$EXPECTED_DIR"
unzip -oq "$CONVERTED_DOCX" -d "$CONVERTED_DIR"

format_xml_tree() {
  local root="$1"
  while IFS= read -r -d '' file; do
    local tmp="${file}.tmp"
    xmllint --format "$file" > "$tmp"
    mv "$tmp" "$file"
  done < <(find "$root" -type f \( -name '*.xml' -o -name '*.rels' \) -print0 | sort -z)
}

format_xml_tree "$EXPECTED_DIR"
format_xml_tree "$CONVERTED_DIR"

# Print normalized diff counts for the main XML files
echo "=== Normalized diff counts for sample: $SAMPLE_NAME ==="
node -e "
const { readFileSync } = require('fs');
const path = require('path');

const expectedDir = '$EXPECTED_DIR';
const convertedDir = '$CONVERTED_DIR';
const mainFiles = ['word/document.xml', 'word/styles.xml', 'word/settings.xml', 'word/numbering.xml'];

function normalizeXmlLines(xml) {
  return xml
    .replace(/>\s*</g, '>\n<')
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean)
    .filter((l) => !/(rsid|docVar|paraId|uiCompat97to2003)/i.test(l));
}

function editDistance(actual, expected) {
  let prev = new Array(actual.length + 1).fill(0);
  for (let i = 1; i <= expected.length; i++) {
    const cur = new Array(actual.length + 1).fill(0);
    for (let j = 1; j <= actual.length; j++) {
      cur[j] = expected[i - 1] === actual[j - 1]
        ? prev[j - 1] + 1
        : Math.max(prev[j], cur[j - 1]);
    }
    prev = cur;
  }
  return expected.length + actual.length - 2 * prev[actual.length];
}

for (const file of mainFiles) {
  const expectedPath = path.join(expectedDir, file);
  const convertedPath = path.join(convertedDir, file);
  try {
    const expectedLines = normalizeXmlLines(readFileSync(expectedPath, 'utf8'));
    const convertedLines = normalizeXmlLines(readFileSync(convertedPath, 'utf8'));
    const dist = editDistance(convertedLines, expectedLines);
    console.log(\`  \${file}: \${dist} lines differ (expected \${expectedLines.length}, got \${convertedLines.length})\`);
  } catch (e) {
    console.log(\`  \${file}: MISSING (\${e.message})\`);
  }
}
"
