import type { CompressOption } from "@/engines/ImageBase";
import { MAX_CANVAS_DIMENSION, PREVIEW_MAX_SIZE } from "@/engines/ImageBase";
import { OutputFormats } from "@/mimes";
import { Mimes } from "@/mimes";

export const DefaultCompressOption: CompressOption = {
  preview: { maxSize: PREVIEW_MAX_SIZE },
  resize: {
    method: undefined,
    width: undefined,
    height: undefined,
    short: undefined,
    long: undefined,
    cropWidthRatio: undefined,
    cropHeightRatio: undefined,
    cropWidthSize: undefined,
    cropHeightSize: undefined,
    presetCrop: {
      paperSize: "a4",
      orientation: "portrait",
      reference: "width",
      cropPx: 0,
      offsetPx: 0,
    },
  },
  format: { target: undefined, transparentFill: "#FFFFFF" },
  jpeg: { quality: 0.75, extreme: false },
  png: { colors: 128, dithering: 0.5, extreme: false },
  gif: { colors: 128, dithering: false },
  avif: { quality: 50, speed: 8 },
};

type JsonObject = Record<string, unknown>;

const resizeMethods = ["fitWidth", "fitHeight", "setShort", "setLong", "setCropRatio", "setCropSize", "presetCrop"] as const;
const paperSizes = ["a3", "a4", "a5", "letter", "legal", "b4", "b5"];

function objectValue(value: unknown): JsonObject {
  return value !== null && typeof value === "object" && !Array.isArray(value)
    ? value as JsonObject
    : {};
}

function numberValue(value: unknown, fallback: number, min: number, max: number) {
  return typeof value === "number" && Number.isFinite(value)
    ? Math.min(max, Math.max(min, value))
    : fallback;
}

function optionalPositiveNumber(value: unknown) {
  return typeof value === "number" && Number.isFinite(value) && value > 0
    ? Math.min(MAX_CANVAS_DIMENSION, value)
    : undefined;
}

export function normalizeCompressOption(value: unknown): CompressOption {
  const root = objectValue(value);
  const preview = objectValue(root.preview);
  const resize = objectValue(root.resize);
  const presetCrop = objectValue(resize.presetCrop);
  const format = objectValue(root.format);
  const jpeg = objectValue(root.jpeg);
  const png = objectValue(root.png);
  const gif = objectValue(root.gif);
  const avif = objectValue(root.avif);
  const target = typeof format.target === "string" && OutputFormats.includes(format.target as typeof OutputFormats[number])
    ? format.target as CompressOption["format"]["target"]
    : undefined;
  const method = typeof resize.method === "string" && resizeMethods.includes(resize.method as typeof resizeMethods[number])
    ? resize.method as CompressOption["resize"]["method"]
    : undefined;

  return {
    preview: {
      maxSize: numberValue(preview.maxSize, PREVIEW_MAX_SIZE, 1, 4096),
    },
    resize: {
      method,
      width: optionalPositiveNumber(resize.width),
      height: optionalPositiveNumber(resize.height),
      short: optionalPositiveNumber(resize.short),
      long: optionalPositiveNumber(resize.long),
      cropWidthRatio: optionalPositiveNumber(resize.cropWidthRatio),
      cropHeightRatio: optionalPositiveNumber(resize.cropHeightRatio),
      cropWidthSize: optionalPositiveNumber(resize.cropWidthSize),
      cropHeightSize: optionalPositiveNumber(resize.cropHeightSize),
      presetCrop: {
        paperSize: typeof presetCrop.paperSize === "string" && paperSizes.includes(presetCrop.paperSize) ? presetCrop.paperSize : "a4",
        orientation: presetCrop.orientation === "landscape" ? "landscape" : "portrait",
        reference: presetCrop.reference === "height" ? "height" : "width",
        cropPx: numberValue(presetCrop.cropPx, 0, 0, 1000),
        offsetPx: numberValue(presetCrop.offsetPx, 0, -500, 500),
      },
    },
    format: {
      target,
      transparentFill: typeof format.transparentFill === "string" && /^#[0-9A-F]{6}$/i.test(format.transparentFill)
        ? format.transparentFill.toUpperCase()
        : "#FFFFFF",
    },
    jpeg: {
      quality: numberValue(jpeg.quality, 0.75, 0, 1),
      extreme: typeof jpeg.extreme === "boolean" ? jpeg.extreme : false,
    },
    png: {
      colors: Math.round(numberValue(png.colors, 128, 2, 256)),
      dithering: numberValue(png.dithering, 0.5, 0, 1),
      extreme: typeof png.extreme === "boolean" ? png.extreme : false,
    },
    gif: {
      colors: Math.round(numberValue(gif.colors, 128, 2, 256)),
      dithering: typeof gif.dithering === "boolean" ? gif.dithering : false,
    },
    avif: {
      quality: Math.round(numberValue(avif.quality, 50, 1, 100)),
      speed: Math.round(numberValue(avif.speed, 8, 1, 10)),
    },
  };
}

export type CompressionOptionVisibility = {
  jpeg: boolean;
  png: boolean;
  gif: boolean;
  avif: boolean;
};

export function getCompressionOptionVisibility(
  sourceMimes: Iterable<string>,
  target?: CompressOption["format"]["target"],
): CompressionOptionVisibility {
  const finalMimes = target ? [Mimes[target]] : Array.from(sourceMimes);
  if (!target && finalMimes.length === 0) {
    return { jpeg: true, png: true, gif: true, avif: true };
  }
  return {
    jpeg: finalMimes.some((mime) => mime === Mimes.jpg || mime === Mimes.webp),
    png: finalMimes.includes(Mimes.png),
    gif: finalMimes.includes(Mimes.gif),
    avif: finalMimes.includes(Mimes.avif),
  };
}

export function getFinalMime(
  sourceMime: string,
  target?: CompressOption["format"]["target"],
) {
  return target ? Mimes[target] : sourceMime;
}