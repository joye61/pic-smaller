import { Mimes } from "@/mimes";

const textDecoder = new TextDecoder("ascii");

function fourCC(bytes: Uint8Array, offset: number): string {
  return textDecoder.decode(bytes.subarray(offset, offset + 4));
}

function readUint32BE(bytes: Uint8Array, offset: number): number {
  return new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength).getUint32(
    offset,
    false,
  );
}

function readUint32LE(bytes: Uint8Array, offset: number): number {
  return new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength).getUint32(
    offset,
    true,
  );
}

async function readBytes(blob: Blob, start: number, length: number) {
  return new Uint8Array(await blob.slice(start, start + length).arrayBuffer());
}

async function isAnimatedWebp(blob: Blob): Promise<boolean> {
  const header = await readBytes(blob, 0, 12);
  if (
    header.length < 12 ||
    fourCC(header, 0) !== "RIFF" ||
    fourCC(header, 8) !== "WEBP"
  ) {
    return false;
  }

  const containerEnd = Math.min(blob.size, readUint32LE(header, 4) + 8);
  let offset = 12;
  while (offset + 8 <= containerEnd) {
    const chunkHeader = await readBytes(blob, offset, 8);
    if (chunkHeader.length < 8) return false;

    const type = fourCC(chunkHeader, 0);
    if (type === "ANIM" || type === "ANMF") return true;

    const size = readUint32LE(chunkHeader, 4);
    const nextOffset = offset + 8 + size + (size % 2);
    if (nextOffset <= offset || nextOffset > containerEnd) return false;
    offset = nextOffset;
  }

  return false;
}

async function isAnimatedAvif(blob: Blob): Promise<boolean> {
  const header = await readBytes(blob, 0, 16);
  if (header.length < 16 || fourCC(header, 4) !== "ftyp") return false;

  let boxSize = readUint32BE(header, 0);
  let brandOffset = 8;
  if (boxSize === 1) {
    const high = readUint32BE(header, 8);
    const low = readUint32BE(header, 12);
    if (high !== 0) return false;
    boxSize = low;
    brandOffset = 16;
  }

  if (boxSize < brandOffset + 8 || boxSize > blob.size) return false;
  const ftyp = await readBytes(blob, 0, boxSize);
  if (fourCC(ftyp, brandOffset) === "avis") return true;

  for (let offset = brandOffset + 8; offset + 4 <= ftyp.length; offset += 4) {
    if (fourCC(ftyp, offset) === "avis") return true;
  }
  return false;
}

export async function isAnimatedImage(blob: Blob, mime: string) {
  if (mime === Mimes.webp) return isAnimatedWebp(blob);
  if (mime === Mimes.avif) return isAnimatedAvif(blob);
  return false;
}

export const ERROR_ANIMATED_UNSUPPORTED = "animated-unsupported";

export async function rejectAnimatedImage(blob: Blob, mime: string) {
  if (await isAnimatedImage(blob, mime)) {
    throw new Error(ERROR_ANIMATED_UNSUPPORTED);
  }
}
