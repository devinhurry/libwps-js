#!/usr/bin/env node
import { readWpsFile } from "../src/index.js";

const [, , filePath, mode = "text"] = process.argv;

if (!filePath || mode === "--help" || mode === "-h") {
  process.stderr.write("Usage: kingsoft-wps-js <file.wps> [text|json|raw]\n");
  process.exit(filePath ? 0 : 1);
}

const document = await readWpsFile(filePath);

if (mode === "json") {
  process.stdout.write(`${JSON.stringify({
    type: document.type,
    streams: document.streams,
    fib: document.fib,
    paragraphs: document.paragraphs,
    text: document.text,
  }, null, 2)}\n`);
} else if (mode === "raw") {
  process.stdout.write(document.rawText);
} else if (mode === "text") {
  process.stdout.write(`${document.text}\n`);
} else {
  process.stderr.write(`Unknown mode: ${mode}\n`);
  process.exit(1);
}
