import assert from "node:assert/strict";
import test from "node:test";
import { getUniqNameOnNames, normalize, splitFileName } from "@/functions";
import {
  type CompressOption,
  ImageBase,
  type ProcessOutput,
} from "@/engines/ImageBase";
import { OutputFormats } from "@/mimes";
import { applySvgDimension } from "@/engines/svgParse";

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
  return new PreviewProbeImage(
    {
      key: 1,
      name: "probe.png",
      width: 1200,
      height: 800,
      blob: new Blob([], { type: "image/png" }),
    },
    { resize } as CompressOption,
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