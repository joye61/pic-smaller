import assert from "node:assert/strict";
import test from "node:test";
import { getImageMime, Mimes, OutputFormats } from "@/mimes";
import {
  DefaultCompressOption,
  getCompressionOptionVisibility,
  getFinalMime,
  normalizeCompressOption,
} from "@/options";

test("normalization restores every nested option omitted by JSON", () => {
  const normalized = normalizeCompressOption({
    format: { transparentFill: "#abcdef" },
    resize: { method: "setCropSize" },
  });

  assert.equal(Object.prototype.hasOwnProperty.call(normalized.format, "target"), true);
  assert.equal(normalized.format.target, undefined);
  assert.equal(normalized.format.transparentFill, "#ABCDEF");
  assert.equal(Object.prototype.hasOwnProperty.call(normalized.resize, "cropWidthSize"), true);
  assert.deepEqual(normalized.jpeg, DefaultCompressOption.jpeg);
  assert.deepEqual(normalized.png, DefaultCompressOption.png);
  assert.deepEqual(normalized.gif, DefaultCompressOption.gif);
  assert.deepEqual(normalized.avif, DefaultCompressOption.avif);
});

test("normalization rejects invalid enums and clamps every encoder parameter", () => {
  const normalized = normalizeCompressOption({
    preview: { maxSize: 0 },
    resize: { method: "unknown", width: -10, height: 999999, cropWidthRatio: Number.NaN, presetCrop: { paperSize: "unknown" } },
    format: { target: "bmp", transparentFill: "red" },
    jpeg: { quality: 9 },
    png: { colors: 1, dithering: -1 },
    gif: { colors: 999, dithering: "yes" },
    avif: { quality: 0, speed: 99 },
  });

  assert.equal(normalized.preview.maxSize, 1);
  assert.equal(normalized.resize.method, undefined);
  assert.equal(normalized.resize.width, undefined);
  assert.equal(normalized.resize.height, 16384);
  assert.equal(normalized.resize.cropWidthRatio, undefined);
  assert.equal(normalized.resize.presetCrop?.paperSize, "a4");
  assert.deepEqual(normalized.format, { target: undefined, transparentFill: "#FFFFFF" });
  assert.deepEqual(normalized.jpeg, { quality: 1, extreme: false });
  assert.deepEqual(normalized.png, { colors: 2, dithering: 0, extreme: false });
  assert.deepEqual(normalized.gif, { colors: 256, dithering: false });
  assert.deepEqual(normalized.avif, { quality: 1, speed: 10 });
});

test("normalization preserves valid values for every option group", () => {
  const normalized = normalizeCompressOption({
    preview: { maxSize: 512 },
    resize: {
      method: "presetCrop",
      width: 640,
      height: 480,
      short: 320,
      long: 1280,
      cropWidthRatio: 16,
      cropHeightRatio: 9,
      cropWidthSize: 600,
      cropHeightSize: 400,
      presetCrop: { paperSize: "letter", orientation: "landscape", reference: "height", cropPx: 12, offsetPx: -8 },
    },
    format: { target: "webp", transparentFill: "#12abEF" },
    jpeg: { quality: 0.42, extreme: true },
    png: { colors: 64, dithering: 0.25, extreme: true },
    gif: { colors: 32, dithering: true },
    avif: { quality: 73, speed: 4 },
  });

  assert.deepEqual(normalized, {
    preview: { maxSize: 512 },
    resize: {
      method: "presetCrop",
      width: 640,
      height: 480,
      short: 320,
      long: 1280,
      cropWidthRatio: 16,
      cropHeightRatio: 9,
      cropWidthSize: 600,
      cropHeightSize: 400,
      presetCrop: { paperSize: "letter", orientation: "landscape", reference: "height", cropPx: 12, offsetPx: -8 },
    },
    format: { target: "webp", transparentFill: "#12ABEF" },
    jpeg: { quality: 0.42, extreme: true },
    png: { colors: 64, dithering: 0.25, extreme: true },
    gif: { colors: 32, dithering: true },
    avif: { quality: 73, speed: 4 },
  });
});

test("all output formats route to their canonical MIME", () => {
  const sourceMimes = [Mimes.jpg, Mimes.png, Mimes.webp, Mimes.gif, Mimes.svg, Mimes.avif, Mimes.heic, Mimes.heif];
  for (const sourceMime of sourceMimes) {
    assert.equal(getFinalMime(sourceMime), sourceMime);
    for (const target of OutputFormats) {
      assert.equal(getFinalMime(sourceMime, target), Mimes[target]);
    }
  }
});

test("compression parameters follow source formats without a target", () => {
  assert.deepEqual(
    getCompressionOptionVisibility([Mimes.jpg, Mimes.png, Mimes.gif, Mimes.avif]),
    { jpeg: true, png: true, gif: true, avif: true },
  );
  assert.deepEqual(
    getCompressionOptionVisibility([Mimes.svg, Mimes.heic]),
    { jpeg: false, png: false, gif: false, avif: false },
  );
});

test("empty upload workspace exposes every compression parameter", () => {
  assert.deepEqual(
    getCompressionOptionVisibility([]),
    { jpeg: true, png: true, gif: true, avif: true },
  );
});

test("compression parameters follow the final encoder for every target", () => {
  const expected = {
    jpg: { jpeg: true, png: false, gif: false, avif: false },
    png: { jpeg: false, png: true, gif: false, avif: false },
    webp: { jpeg: true, png: false, gif: false, avif: false },
    avif: { jpeg: false, png: false, gif: false, avif: true },
  } as const;

  for (const target of OutputFormats) {
    assert.deepEqual(
      getCompressionOptionVisibility([Mimes.jpg, Mimes.png, Mimes.gif], target),
      expected[target],
    );
  }
});

test("image MIME falls back to a case-insensitive file extension", () => {
  assert.equal(getImageMime({ name: "photo.JPEG", type: "" }), Mimes.jpeg);
  assert.equal(getImageMime({ name: "animation.GIF", type: "application/octet-stream" }), Mimes.gif);
  assert.equal(getImageMime({ name: "photo.bin", type: Mimes.png }), Mimes.png);
  assert.equal(getImageMime({ name: "unknown.bin", type: "application/octet-stream" }), "application/octet-stream");
});