const CFB_MAGIC = Buffer.from([0xd0, 0xcf, 0x11, 0xe0, 0xa1, 0xb1, 0x1a, 0xe1]);

const FREE_SECTOR = -1;
const END_OF_CHAIN = -2;
const FAT_SECTOR = -3;
const DIFAT_SECTOR = -4;

export class CompoundFile {
  constructor(input) {
    this.buffer = toBuffer(input);
    assertCfb(this.buffer);

    this.sectorSize = 1 << this.buffer.readUInt16LE(0x1e);
    this.miniSectorSize = 1 << this.buffer.readUInt16LE(0x20);
    this.fatSectorCount = this.buffer.readInt32LE(0x2c);
    this.firstDirectorySector = this.buffer.readInt32LE(0x30);
    this.miniStreamCutoffSize = this.buffer.readUInt32LE(0x38);
    this.firstMiniFatSector = this.buffer.readInt32LE(0x3c);
    this.miniFatSectorCount = this.buffer.readInt32LE(0x40);
    this.firstDifatSector = this.buffer.readInt32LE(0x44);
    this.difatSectorCount = this.buffer.readInt32LE(0x48);

    this.difat = this.#readDifat();
    this.fat = this.#readFat();
    this.directoryEntries = this.#readDirectoryEntries();
    this.rootEntry = this.directoryEntries.find((entry) => entry.type === 5);
    if (!this.rootEntry) {
      throw new Error("Invalid CFB file: missing Root Entry");
    }
    this.miniFat = this.#readMiniFat();
    this.miniStream = this.rootEntry.startSector >= 0
      ? this.#readFatChain(this.rootEntry.startSector, Number(this.rootEntry.size))
      : Buffer.alloc(0);
  }

  listStreams() {
    return this.directoryEntries
      .filter((entry) => entry.type === 2)
      .map((entry) => ({
        name: entry.name,
        size: Number(entry.size),
      }));
  }

  hasStream(name) {
    return this.directoryEntries.some((entry) => entry.type === 2 && entry.name === name);
  }

  readStream(name) {
    const entry = this.directoryEntries.find((item) => item.type === 2 && item.name === name);
    if (!entry) {
      throw new Error(`CFB stream not found: ${name}`);
    }
    return this.#readStreamEntry(entry);
  }

  #readDifat() {
    const sectorIds = [];
    for (let offset = 0x4c; offset < 512; offset += 4) {
      const sectorId = this.buffer.readInt32LE(offset);
      if (sectorId >= 0) {
        sectorIds.push(sectorId);
      }
    }

    let nextDifatSector = this.firstDifatSector;
    for (let i = 0; i < this.difatSectorCount; i += 1) {
      if (nextDifatSector < 0) {
        throw new Error("Invalid CFB file: DIFAT chain ended early");
      }
      const sector = this.#sector(nextDifatSector);
      for (let offset = 0; offset < this.sectorSize - 4; offset += 4) {
        const sectorId = sector.readInt32LE(offset);
        if (sectorId >= 0) {
          sectorIds.push(sectorId);
        }
      }
      nextDifatSector = sector.readInt32LE(this.sectorSize - 4);
    }

    if (sectorIds.length < this.fatSectorCount) {
      throw new Error("Invalid CFB file: FAT sector count exceeds DIFAT entries");
    }
    return sectorIds.slice(0, this.fatSectorCount);
  }

  #readFat() {
    const entries = [];
    for (const sectorId of this.difat) {
      const sector = this.#sector(sectorId);
      for (let offset = 0; offset < this.sectorSize; offset += 4) {
        entries.push(sector.readInt32LE(offset));
      }
    }
    return entries;
  }

  #readMiniFat() {
    if (this.firstMiniFatSector < 0 || this.miniFatSectorCount === 0) {
      return [];
    }

    const miniFatBytes = this.#readFatChain(
      this.firstMiniFatSector,
      this.miniFatSectorCount * this.sectorSize,
    );
    const entries = [];
    for (let offset = 0; offset + 4 <= miniFatBytes.length; offset += 4) {
      entries.push(miniFatBytes.readInt32LE(offset));
    }
    return entries;
  }

  #readDirectoryEntries() {
    const directoryStream = this.#readFatChain(this.firstDirectorySector);
    const entries = [];
    for (let offset = 0; offset + 128 <= directoryStream.length; offset += 128) {
      const nameLength = directoryStream.readUInt16LE(offset + 64);
      const type = directoryStream.readUInt8(offset + 66);
      if (nameLength < 2 || type === 0) {
        continue;
      }

      const name = directoryStream.subarray(offset, offset + nameLength - 2).toString("utf16le");
      entries.push({
        index: offset / 128,
        name,
        type,
        leftSiblingId: directoryStream.readInt32LE(offset + 68),
        rightSiblingId: directoryStream.readInt32LE(offset + 72),
        childId: directoryStream.readInt32LE(offset + 76),
        clsid: directoryStream.subarray(offset + 80, offset + 96),
        stateBits: directoryStream.readUInt32LE(offset + 96),
        creationTime: directoryStream.readBigUInt64LE(offset + 100),
        modifiedTime: directoryStream.readBigUInt64LE(offset + 108),
        startSector: directoryStream.readInt32LE(offset + 116),
        size: directoryStream.readBigUInt64LE(offset + 120),
      });
    }
    return entries;
  }

  #readStreamEntry(entry) {
    const size = Number(entry.size);
    if (size === 0) {
      return Buffer.alloc(0);
    }
    if (size < this.miniStreamCutoffSize && entry.startSector >= 0) {
      return this.#readMiniFatChain(entry.startSector, size);
    }
    return this.#readFatChain(entry.startSector, size);
  }

  #readFatChain(startSector, byteLength = null) {
    if (startSector < 0) {
      return Buffer.alloc(0);
    }

    const chunks = [];
    for (const sectorId of this.#collectChain(startSector, this.fat, "FAT")) {
      chunks.push(this.#sector(sectorId));
    }
    const bytes = Buffer.concat(chunks);
    return byteLength == null ? bytes : bytes.subarray(0, byteLength);
  }

  #readMiniFatChain(startMiniSector, byteLength) {
    const chunks = [];
    for (const miniSectorId of this.#collectChain(startMiniSector, this.miniFat, "MiniFAT")) {
      const offset = miniSectorId * this.miniSectorSize;
      const end = offset + this.miniSectorSize;
      if (end > this.miniStream.length) {
        throw new Error(`Invalid CFB file: MiniFAT sector ${miniSectorId} is outside the mini stream`);
      }
      chunks.push(this.miniStream.subarray(offset, end));
    }
    return Buffer.concat(chunks).subarray(0, byteLength);
  }

  #collectChain(startSector, table, tableName) {
    const sectorIds = [];
    const seen = new Set();
    let sectorId = startSector;

    while (sectorId !== END_OF_CHAIN) {
      if (sectorId < 0) {
        throw new Error(`Invalid CFB file: ${tableName} chain points at special sector ${sectorId}`);
      }
      if (sectorId >= table.length) {
        throw new Error(`Invalid CFB file: ${tableName} chain sector ${sectorId} is out of range`);
      }
      if (seen.has(sectorId)) {
        throw new Error(`Invalid CFB file: ${tableName} chain loop at sector ${sectorId}`);
      }
      seen.add(sectorId);
      sectorIds.push(sectorId);

      const next = table[sectorId];
      if (next === FREE_SECTOR || next === FAT_SECTOR || next === DIFAT_SECTOR) {
        throw new Error(`Invalid CFB file: ${tableName} chain points at non-data sector ${next}`);
      }
      sectorId = next;
    }

    return sectorIds;
  }

  #sector(sectorId) {
    if (sectorId < 0) {
      throw new Error(`Invalid CFB file: negative sector id ${sectorId}`);
    }
    const offset = (sectorId + 1) * this.sectorSize;
    const end = offset + this.sectorSize;
    if (offset >= this.buffer.length) {
      throw new Error(`Invalid CFB file: sector ${sectorId} is outside the file`);
    }
    if (end > this.buffer.length) {
      const sector = Buffer.alloc(this.sectorSize);
      this.buffer.copy(sector, 0, offset);
      return sector;
    }
    return this.buffer.subarray(offset, end);
  }
}

function assertCfb(buffer) {
  if (buffer.length < 512 || !buffer.subarray(0, 8).equals(CFB_MAGIC)) {
    throw new Error("Invalid CFB file: missing OLE2 compound file signature");
  }
  if (buffer.readUInt16LE(0x1c) !== 0xfffe) {
    throw new Error("Invalid CFB file: only little-endian files are supported");
  }
}

function toBuffer(input) {
  if (Buffer.isBuffer(input)) {
    return input;
  }
  if (input instanceof Uint8Array) {
    return Buffer.from(input.buffer, input.byteOffset, input.byteLength);
  }
  throw new TypeError("Expected a Buffer or Uint8Array");
}
