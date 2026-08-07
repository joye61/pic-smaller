import { Mimes } from "@/mimes";
import { ImageBase, ProcessOutput } from "./ImageBase";

interface CodecImage {
  data: Uint8Array | Uint8ClampedArray;
  width: number;
  height: number;
}

interface AvifModule {
  createAvifEncoder: (mode: "client") => (
    image: CodecImage,
    options: { quality: number; speed: number },
  ) => Promise<Uint8Array>;
}

async function importCodec<T>(path: string): Promise<T> {
  return (await import(/* webpackIgnore: true */ path)) as T;
}

const encoderReady = importCodec<AvifModule>(
  "/codecs/avif/index.browser.mjs",
).then((module) => module.createAvifEncoder("client"));

export class AvifImage extends ImageBase {
  /**
   * Encode avif image with canvas context
   * @param context
   * @param width
   * @param height
   * @param quality
   * @param speed
   * @returns
   */
  static async encode(
    context: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D,
    width: number,
    height: number,
    quality: number = 50,
    speed: number = 8,
  ): Promise<Blob> {
    const imageData = context.getImageData(0, 0, width, height);
    const encode = await encoderReady;
    const result = await encode(imageData, { quality, speed });
    const buffer = new ArrayBuffer(result.byteLength);
    const bytes = new Uint8Array(buffer);
    bytes.set(result);
    return new Blob([buffer], { type: Mimes.avif });
  }

  async compress(): Promise<ProcessOutput> {
    const { width, height, x, y } = this.getOutputDimension();
    const { context } = await this.createCanvas(width, height, x, y);
    const blob = await AvifImage.encode(
      context,
      width,
      height,
      this.option.avif.quality,
      this.option.avif.speed,
    );

    return {
      width,
      height,
      blob,
      src: URL.createObjectURL(blob),
    };
  }
}
