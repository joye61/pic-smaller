import assert from "node:assert/strict";
import test from "node:test";
import { getUniqNameOnNames, normalize, splitFileName } from "@/functions";
import {
  type CompressOption,
  ImageBase,
  type ProcessOutput,
} from "@/engines/ImageBase";
import { Mimes, OutputFormats } from "@/mimes";
import { applySvgDimension } from "@/engines/svgParse";
import { isAnimatedImage, rejectAnimatedImage, ERROR_ANIMATED_UNSUPPORTED } from "@/engines/animation";

function ascii(value: string): number[] {
  return Array.from(value, (character) => character.charCodeAt(0));
}

function uint32BE(value: number): number[] {
  return [value >>> 24, value >>> 16, value >>> 8, value].map(
    (part) => part & 0xff,
  );
}

function uint32LE(value: number): number[] {
  return [value, value >>> 8, value >>> 16, value >>> 24].map(
    (part) => part & 0xff,
  );
}

class PreviewProbeImage extends ImageBase {
  call?: [number, number, number, number, number];

  async compress(): Promise<ProcessOutput> {
    return this.failResult();
  }

  override getPreviewDimension() {
    return { width: 120, height: 80, x: 14, y: 9 };
  }

  override async createBlob(
    width: number,
    height: number,
    quality: number,
    cropX = 0,
    cropY = 0,
  ) {
    this.call = [width, height, quality, cropX, cropY];
    return new Blob();
  }
}

function createDimensionProbe(resize: CompressOption["resize"]) {
  return createSizedDimensionProbe(resize, 1200, 800);
}

function createSizedDimensionProbe(
  resize: CompressOption["resize"],
  width: number,
  height: number,
  target?: CompressOption["format"]["target"],
) {
  return new PreviewProbeImage(
    {
      key: 1,
      name: "probe.png",
      width,
      height,
      blob: new Blob([], { type: "image/png" }),
    },
    { resize, format: { target, transparentFill: "#FFFFFF" } } as CompressOption,
  );
}

test("Path normalize check", () => {
  assert.equal(normalize(""), "");
  assert.equal(normalize("/a/b"), "a/b");
  assert.equal(normalize("/sub/a/b", "/sub"), "a/b");
  assert.equal(normalize("/a/b", "/sub"), "error404");
});

test("Rename check", () => {
  const names = new Set<string>(["a.jpg", "b.png"]);
  assert.equal(getUniqNameOnNames(names, "a.jpg"), "a(1).jpg");
  names.add("a(1).jpg");
  assert.equal(getUniqNameOnNames(names, "a.jpg"), "a(1)(1).jpg");
});

test("splitFileName keeps names without extension intact (P3-11)", () => {
  assert.deepEqual(splitFileName("photo"), { name: "photo", suffix: "" });
  assert.deepEqual(splitFileName(".gitignore"), {
    name: ".gitignore",
    suffix: "",
  });
  assert.deepEqual(splitFileName("a.photo.JPG"), {
    name: "a.photo",
    suffix: "jpg",
  });
});

test("preview forwards crop coordinates without treating them as quality", async () => {
  const image = new PreviewProbeImage(
    {
      key: 1,
      name: "probe.png",
      width: 200,
      height: 100,
      blob: new Blob([], { type: "image/png" }),
    },
    { preview: { maxSize: 256 } } as CompressOption,
  );

  await image.preview();

  assert.deepEqual(image.call, [120, 80, 1, 14, 9]);
});

test("output formats expose one canonical JPEG option", () => {
  assert.deepEqual(OutputFormats, ["jpg", "png", "webp", "avif"]);
});

test("animated WebP is detected from RIFF animation chunks", async () => {
  const animationChunk = [...ascii("ANIM"), ...uint32LE(0)];
  const animated = new Blob([
    new Uint8Array([
      ...ascii("RIFF"),
      ...uint32LE(4 + animationChunk.length),
      ...ascii("WEBP"),
      ...animationChunk,
    ]),
  ]);
  const stillChunk = [...ascii("VP8 "), ...uint32LE(0)];
  const still = new Blob([
    new Uint8Array([
      ...ascii("RIFF"),
      ...uint32LE(4 + stillChunk.length),
      ...ascii("WEBP"),
      ...stillChunk,
    ]),
  ]);

  assert.equal(await isAnimatedImage(animated, Mimes.webp), true);
  assert.equal(await isAnimatedImage(still, Mimes.webp), false);
});

test("animated AVIF is detected from the avis sequence brand", async () => {
  const animated = new Blob([
    new Uint8Array([
      ...uint32BE(24),
      ...ascii("ftyp"),
      ...ascii("avif"),
      ...uint32BE(0),
      ...ascii("mif1"),
      ...ascii("avis"),
    ]),
  ]);
  const still = new Blob([
    new Uint8Array([
      ...uint32BE(20),
      ...ascii("ftyp"),
      ...ascii("avif"),
      ...uint32BE(0),
      ...ascii("mif1"),
    ]),
  ]);

  assert.equal(await isAnimatedImage(animated, Mimes.avif), true);
  assert.equal(await isAnimatedImage(still, Mimes.avif), false);
});

test("animated images are rejected before the single-frame canvas pipeline", async () => {
  const animationChunk = [...ascii("ANIM"), ...uint32LE(0)];
  const blob = new Blob([
    new Uint8Array([
      ...ascii("RIFF"),
      ...uint32LE(4 + animationChunk.length),
      ...ascii("WEBP"),
      ...animationChunk,
    ]),
  ], { type: Mimes.webp });

  await assert.rejects(
    rejectAnimatedImage(blob, Mimes.webp),
    (error: unknown) => error instanceof Error && error.message === ERROR_ANIMATED_UNSUPPORTED,
  );
});

test("every resize mode produces a material, bounded dimension change", () => {
  const cases: Array<[CompressOption["resize"], [number, number]]> = [
    [{ method: "fitWidth", width: 600 }, [600, 400]],
    [{ method: "fitHeight", height: 400 }, [600, 400]],
    [{ method: "setShort", short: 400 }, [600, 400]],
    [{ method: "setLong", long: 600 }, [600, 400]],
    [{ method: "setCropRatio", cropWidthRatio: 1, cropHeightRatio: 1 }, [800, 800]],
    [{ method: "setCropSize", cropWidthSize: 600, cropHeightSize: 500 }, [600, 500]],
    [{ method: "presetCrop", presetCrop: { paperSize: "a4", orientation: "landscape", reference: "width", cropPx: 100, offsetPx: 20 } }, [1000, 707]],
  ];

  for (const [resize, expected] of cases) {
    const dimension = createDimensionProbe(resize).getOutputDimension();
    assert.deepEqual([dimension.width, dimension.height], expected);
    assert.ok(dimension.x >= 0 && dimension.y >= 0);
    assert.ok(dimension.width <= 1200 && dimension.height <= 800);
  }
});

test("SVG resize and crop update vector dimensions without rasterizing", () => {
  const source = '<svg width="1200" height="800" viewBox="10 20 120 80"><rect width="100%" height="100%"/></svg>';
  const resized = applySvgDimension(source, { width: 1200, height: 800 }, { x: 0, y: 0, width: 600, height: 400 }, false);
  assert.match(resized, /width="600"/);
  assert.match(resized, /height="400"/);
  assert.match(resized, /viewBox="10 20 120 80"/);

  const cropped = applySvgDimension(source, { width: 1200, height: 800 }, { x: 200, y: 0, width: 800, height: 800 }, true);
  assert.match(cropped, /width="800"/);
  assert.match(cropped, /height="800"/);
  assert.match(cropped, /viewBox="30 20 80 80"/);
});

test("resize modes handle portrait, empty, and oversized parameters", () => {
  const cases: Array<[CompressOption["resize"], [number, number], [number, number]]> = [
    [{ method: "fitWidth", width: 600 }, [600, 400], [600, 900]],
    [{ method: "fitHeight", height: 400 }, [600, 400], [267, 400]],
    [{ method: "setShort", short: 400 }, [600, 400], [400, 600]],
    [{ method: "setLong", long: 600 }, [600, 400], [400, 600]],
    [{ method: "setCropRatio", cropWidthRatio: 1, cropHeightRatio: 1 }, [800, 800], [800, 800]],
    [{ method: "setCropSize", cropWidthSize: 5000, cropHeightSize: 5000 }, [1200, 800], [800, 1200]],
    [{ method: "presetCrop", presetCrop: { paperSize: "a4", orientation: "portrait", reference: "height", cropPx: 0, offsetPx: 0 } }, [566, 800], [800, 1200]],
  ];

  for (const [resize, landscapeExpected, portraitExpected] of cases) {
    const landscape = createSizedDimensionProbe(resize, 1200, 800).getOutputDimension();
    const portrait = createSizedDimensionProbe(resize, 800, 1200).getOutputDimension();
    assert.deepEqual([landscape.width, landscape.height], landscapeExpected);
    assert.deepEqual([portrait.width, portrait.height], portraitExpected);
  }

  const emptyCases: CompressOption["resize"][] = [
    { method: "fitWidth" },
    { method: "fitHeight" },
    { method: "setShort" },
    { method: "setLong" },
    { method: "setCropRatio" },
    { method: "setCropSize" },
    { method: "presetCrop", presetCrop: { paperSize: "a4", orientation: "portrait", reference: "width" } },
  ];
  for (const resize of emptyCases) {
    assert.deepEqual(createSizedDimensionProbe(resize, 1200, 800).getOutputDimension(), { x: 0, y: 0, width: 1200, height: 800 });
  }
});

test("target format never changes resize geometry", () => {
  const resizeCases: CompressOption["resize"][] = [
    { method: "fitWidth", width: 600 },
    { method: "fitHeight", height: 400 },
    { method: "setShort", short: 400 },
    { method: "setLong", long: 600 },
    { method: "setCropRatio", cropWidthRatio: 16, cropHeightRatio: 9 },
    { method: "setCropSize", cropWidthSize: 640, cropHeightSize: 480 },
    { method: "presetCrop", presetCrop: { paperSize: "a4", orientation: "landscape", reference: "width", cropPx: 20, offsetPx: -5 } },
  ];

  for (const resize of resizeCases) {
    const expected = createSizedDimensionProbe(resize, 1200, 800).getOutputDimension();
    for (const target of OutputFormats) {
      assert.deepEqual(createSizedDimensionProbe(resize, 1200, 800, target).getOutputDimension(), expected);
    }
  }
});