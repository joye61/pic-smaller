import { Mimes } from "@/mimes";
import { ImageBase, ProcessOutput } from "./ImageBase";

interface CodecImage {
  data: Uint8Array | Uint8ClampedArray;
  width: number;
  height: number;
}

interface MozJpegModule {
  createMozjpegEncoder: (mode: "client") => (
    image: CodecImage,
    options: {
      quality: number;
      progressive: boolean;
      optimize_coding: boolean;
      trellis_multipass: boolean;
      trellis_opt_zero: boolean;
      trellis_opt_table: boolean;
      trellis_loops: number;
    },
  ) => Promise<Uint8Array>;
}

async function importCodec<T>(path: string): Promise<T> {
  return (await import(/* webpackIgnore: true */ path)) as T;
}

let encoderReady: Promise<ReturnType<MozJpegModule["createMozjpegEncoder"]>> | null = null;

function getEncoder() {
  if (!encoderReady) {
    encoderReady = importCodec<MozJpegModule>(
      "/codecs/mozjpeg/index.browser.mjs",
    ).then((module) => module.createMozjpegEncoder("client"));
  }
  return encoderReady;
}

export class JpegImage extends ImageBase {
  static async encode(image: CodecImage, quality: number): Promise<Blob> {
    const encode = await getEncoder();
    const result = await encode(image, {
      quality: Math.round(quality * 100),
      progressive: true,
      optimize_coding: true,
      trellis_multipass: true,
      trellis_opt_zero: true,
      trellis_opt_table: true,
      trellis_loops: 3,
    });
    const bytes = new Uint8Array(result.byteLength);
    bytes.set(result);
    return new Blob([bytes.buffer], { type: Mimes.jpg });
  }

  async compress(): Promise<ProcessOutput> {
    const dimension = this.getOutputDimension();
    const { canvas, context } = await this.createCanvas(
      dimension.width,
      dimension.height,
      dimension.x,
      dimension.y,
    );

    context.globalCompositeOperation = "destination-over";
    context.fillStyle = this.option.format.transparentFill;
    context.fillRect(0, 0, dimension.width, dimension.height);
    context.globalCompositeOperation = "source-over";

    const blob = this.option.jpeg.extreme
      ? await JpegImage.encode(
          context.getImageData(0, 0, dimension.width, dimension.height),
          this.option.jpeg.quality,
        )
      : await canvas.convertToBlob({
          type: Mimes.jpg,
          quality: this.option.jpeg.quality,
        });

    return {
      ...dimension,
      blob,
      src: URL.createObjectURL(blob),
    };
  }
}
