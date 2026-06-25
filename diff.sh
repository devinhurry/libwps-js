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

node "$SCRIPT_DIR/bin/wps-to-docx.js" "$ORIGINAL_WPS" "$CONVERTED_DOCX"

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
