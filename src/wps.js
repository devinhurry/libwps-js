import { readFile } from "node:fs/promises";
import { CompoundFile } from "./cfb.js";
import { extractWordBinaryDocument } from "./word-binary.js";

export async function readWpsFile(filePath) {
  const buffer = await readFile(filePath);
  return readWps(buffer);
}

export function readWps(input) {
  const cfb = new CompoundFile(input);
  if (!cfb.hasStream("WordDocument")) {
    throw new Error("Unsupported WPS file: missing WordDocument stream");
  }

  const wordDocument = cfb.readStream("WordDocument");
  const table0 = cfb.hasStream("0Table") ? cfb.readStream("0Table") : null;
  const table1 = cfb.hasStream("1Table") ? cfb.readStream("1Table") : null;
  const data = cfb.hasStream("Data") ? cfb.readStream("Data") : null;
  const document = extractWordBinaryDocument({ wordDocument, table0, table1, data });

  return {
    type: "wps-ole2-word-binary",
    streams: cfb.listStreams(),
    ...document,
  };
}
