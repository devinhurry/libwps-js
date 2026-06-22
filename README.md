# libwps-js — Pure JavaScript WPS Office `.wps` File Parser & DOCX Converter

[English](README.md) | [简体中文](README.zh-CN.md)

[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Node](https://img.shields.io/badge/node-%3E%3D18-green.svg)](package.json)
[![Language](https://img.shields.io/badge/language-JavaScript-yellow.svg)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![Format](https://img.shields.io/badge/format-.wps-orange.svg)](#supported-path)
[![Tests](https://img.shields.io/badge/tests-node--test-brightgreen.svg)](#tests)

A pure JavaScript (no native dependencies) reader and text extractor for **WPS
Office `.wps` files** that are stored as **OLE2 / CFB (Compound File Binary)**
containers holding **Word binary streams** (`WordDocument`, `0Table` / `1Table`,
`Data`). It parses the **Word FIB**, the **CLX / Pcdt piece table**, and both
**UTF-16LE** and **compressed single-byte** text pieces to recover body text,
paragraphs, headers, footnotes, and other Word subdocuments.

Includes a CLI plus a minimal **`.wps` → `.docx` (WordprocessingML) converter**.

## Features

- 100% JavaScript — no native addons, works on Node.js 18+ and modern browsers
- Reads OLE2 / CFB compound files: sectors, FAT, MiniFAT, directory, streams
- Parses the Word binary **FIB** and selects the correct table stream
- Walks the **CLX / Pcdt piece table** to extract text in the right order
- Decodes **UTF-16LE** and **compressed (single-byte)** text pieces
- Exposes body text, raw text, paragraphs, and **Word subdocument ranges**
- Ships a CLI (`libwps-js`) and a **`.wps` to `.docx`** converter

## Installation

```sh
npm install libwps-js
```

## Usage

```js
import { readWpsFile } from "libwps-js";

const document = await readWpsFile("ole2-full.wps");

console.log(document.text);
console.log(document.paragraphs);
```

## CLI

```sh
./bin/libwps-js.js ole2-full.wps text      # normalized body text
./bin/libwps-js.js ole2-full.wps json      # parsed document as JSON
./bin/libwps-js.js ole2-full.wps raw       # raw piece-table text
./bin/wps-to-docx.js ole2-full.wps out.docx  # convert .wps to .docx
```

The DOCX converter emits a minimal **WordprocessingML** document from extracted
body text and paragraph breaks. It does not yet recreate original page layout,
tables, headers, footers, fonts, or drawing objects.

## Returned document

`readWps` and `readWpsFile` return:

- `text`: normalized body text
- `rawText`: all text from the Word binary piece table, including subdocuments
- `bodyText`: raw main-document text
- `paragraphs`: normalized non-empty body paragraphs
- `paragraphProperties`: per-paragraph properties from PAPX pages, including `lineSpacing` and `styleId`
- `characterRuns` / `characterProperties`: run formatting from CHPX pages, including font size, width, and character spacing
- `fontTable`: FFN font records parsed from the table stream
- `styles`: style sheet entries parsed from STSH, each with `name`, `type`, `styleId`, `basedOn`, `lineSpacing`, and run properties
- `subdocuments`: Word subdocument ranges for body, headers, footnotes, etc.
- `streams`: OLE2 stream names and sizes
- `fib`: parsed Word binary FIB details used for extraction

## WPS binary format specifics

This section documents WPS-specific extensions to the standard Word 97 binary format
that were discovered during development. Standard OLE2/CFB and Word binary structures
(FIB, CLX, piece table, text encoding) are not repeated here.

### STSH (Style Sheet) location

The STSH is stored in the table stream (`0Table` or `1Table`) at the offset given by
FIB FcLcb index 1 (`fcStshf` / `lcbStshf`). The header is:

| Offset | Size | Field |
|--------|------|-------|
| 0 | 2 | `cbStshi` — size of Stshi header |
| 2 | 2 | `cstd` — style count |
| 4 | `cbStshi - 4` | remaining Stshi header (unused by this parser) |

Each style descriptor (`Std`) follows at offset `2 + cbStshi`:

| Offset | Size | Field |
|--------|------|-------|
| 0 | 2 | `cbStd` — size of this Std |
| 2 | `cbStd` | Std data |

The Std data layout (WPS-specific, 18-byte header before the name):

| Offset | Size | Field |
|--------|------|-------|
| 0 | 1 | `styLo` — low nibble of byte 0 (style type, WPS encoding) |
| 2 | 2 | `istdBase` — based-on style index (`>= 0xFFF0` = nil / no base) |
| 18 | 2 | `cbName` — style name length in UTF-16 chars (not including null) |
| 20 | `cbName * 2` | UTF-16LE style name |
| 20 + `cbName * 2` | 2 | null terminator (UTF-16LE `0x0000`) |
| 22 + `cbName * 2` | remaining | grpprl (SPRMs for this style) |

Style type is inferred from the name since WPS's `styLo` field does not follow the
standard Word 97 mapping (`1=paragraph, 2=character, 3=table, 4=list`).

### PAPX (Paragraph Property) pages

Paragraph properties are stored in `PlcfBtePapx` (FIB FcLcb index 13) which points
to 512-byte pages in the `WordDocument` stream (at `PN * 512`). Each page contains:

1. `aFC[]` — uint32 file-character positions (bin boundaries)
2. `aPHE[]` — 12-byte paragraph height entries (one per paragraph in the bin)
3. PAPX entries — one per paragraph, each: `cb` (1 byte) + `cb` bytes of data

The PAPX data starts with a 2-byte `istd` (style index), followed by grpprl SPRMs.

### SPRM 0x6412 — WPS line spacing

WPS uses a non-standard SPRM `0x6412` for paragraph line spacing instead of the
standard `sprmPDyaLine` (`0x2409`). Its operand is a 2-byte **signed** integer in twips:

| Value | Meaning |
|-------|---------|
| negative | `exact` (固定值) — line height is exactly `|value|` twips |
| positive | `atLeast` (最小值) — line height is at least `value` twips |

Example: `-594` = 594 twips = 29.7 pt exact (固定值 29.7 磅).

This SPRM can appear both in direct paragraph PAPX and in style grpprl within the STSH.
The converter merges direct PAPX properties with the referenced style's properties.

## Supported path

The current parser supports the WPS fixtures in this repository by reading:

1. OLE2 Compound File Binary sectors, FAT, MiniFAT, and streams.
2. Word binary FIB table-stream selection.
3. The CLX/Pcdt piece table.
4. UTF-16LE and compressed single-byte text pieces.
5. STSH style sheet: style names, types, based-on relationships, and line spacing.
6. PAPX paragraph properties: per-paragraph style references and direct line spacing.
7. CHPX character properties: run-level font size, character width, and character spacing.
8. FFN font records from the table stream.
9. DOCX conversion emits `word/styles.xml`, `<w:pPr>` paragraph properties, paragraph-mark `<w:rPr>`, and split `<w:r>` runs.

## Use cases

- Extract text from legacy **WPS Office `.wps`** documents
- Convert `.wps` files to `.docx` for modern Word / Office compatibility
- Index, search, or archive old WPS / Word binary format documents
- Build Node.js services that read `.wps` files without native dependencies
- Programmatically inspect OLE2 / CFB streams and the Word FIB

## Tests

```sh
npm test
```

## Topics / Keywords

`wps` · `wps-office` · `wps-file` · `.wps` · `ole2` · `cfb` ·
`compound-file-binary` · `word` · `word-binary` · `doc` · `docx` ·
`fib` · `clx` · `pcdt` · `piece-table` · `utf-16le` · `javascript` ·
`nodejs` · `parser` · `text-extraction` · `converter` · `wps-to-docx`

## License

[MIT](LICENSE) © devinhurry
