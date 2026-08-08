import {
  ImageBase,
  OXI_PNG_EXTREME_LEVEL,
  OXI_PNG_LEVEL,
  ProcessOutput,
} from "./ImageBase";
import { Mimes } from "@/mimes";

interface CodecImage {
  data: Uint8Array | Uint8ClampedArray;
  width: number;
  height: number;
}

interface ImageQuantModule {
  createImagequantQuantizer: (mode: "client") => (
    image: CodecImage,
    options: { numColors: number; dither: number },
  ) => Promise<CodecImage>;
}

interface OxiPngModule {
  createOxipngOptimizer: (mode: "client") => (
    image: CodecImage,
    options: { level: number },
  ) => Promise<Uint8Array>;
}

async function importCodec<T>(path: string): Promise<T> {
  return (await import(/* webpackIgnore: true */ path)) as T;
}

const codecsReady = Promise.all([
  importCodec<ImageQuantModule>("/codecs/imagequant/index.browser.mjs"),
  importCodec<OxiPngModule>("/codecs/oxipng/index.browser.mjs"),
]).then(([imageQuant, oxiPng]) => ({
  quantize: imageQuant.createImagequantQuantizer("client"),
  optimize: oxiPng.createOxipngOptimizer("client"),
}));

export class PngImage extends ImageBase {
  static async encode(
    image: CodecImage,
    colors: number,
    dithering: number,
    extreme = false,
  ): Promise<Blob> {
    const { quantize, optimize } = await codecsReady;
    const quantized = await quantize(image, {
      numColors: colors,
      dither: dithering,
    });
    const output = await optimize(quantized, {
      level: extreme ? OXI_PNG_EXTREME_LEVEL : OXI_PNG_LEVEL,
    });
    const bytes = new Uint8Array(output.byteLength);
    bytes.set(output);
    return new Blob([bytes.buffer], { type: Mimes.png });
  }

  async compress(): Promise<ProcessOutput> {
    const { width, height, x, y } = this.getOutputDimension();
    const { context } = await this.createCanvas(width, height, x, y);

    const imageData = context.getImageData(0, 0, width, height);
    const blob = await PngImage.encode(
      imageData,
      this.option.png.colors,
      this.option.png.dithering,
      this.option.png.extreme,
    );
    return {
      width,
      height,
      blob,
      src: URL.createObjectURL(blob),
    };
  }
}
