import { ImageHandler } from "./ImageHandler";
import { UPNG } from "./UPNG";

export interface UPNGDecodeResult {
  ctype: number;
  data: Uint8Array;
  depth: number;
  frames: Array<{
    delay: number;
    data?: Uint8Array;
  }>;
  width: number;
  height: number;
}

export class PngImage extends ImageHandler {
  /**
   * decode origin png
   * @returns
   */
  private async decodeOrigin() {
    const buffer = await this.info.origin.blob.arrayBuffer();
    const result: UPNGDecodeResult = UPNG.decode(buffer) as any;
    let delays: number[] | undefined = undefined;
    if (result.frames.length >= 2) {
      delays = [];
      result.frames.forEach((frame) => {
        delays!.push(frame.delay);
      });
    }

    return { result, delays };
  }

  async compress() {
    const dimension = this.calculateScale();

    const { result, delays } = await this.decodeOrigin();
    const frames = UPNG.toRGBA8(result);
    const quality = 256 * (this.info.option.quality / 100);
    const buffer = (<any>UPNG).encode(
      frames,
      dimension.width,
      dimension.height,
      quality < 8 ? 8 : quality,
      delays
    );

    const blob = new Blob([buffer], {
      type: this.info.origin.blob.type,
    });

    this.info.output = {
      ...dimension,
      blob,
    };
  }

  async creatPreviewBlob(width: number, height: number) {
    const { result, delays } = await this.decodeOrigin();
    if (result.frames.length >= 2) {
      const frames = UPNG.toRGBA8(result);
      const buffer = (<any>UPNG).encode(
        frames,
        width,
        height,
        Math.ceil(256 * 0.7),
        delays
      );
      console.log(result, frames, buffer, this.info);
      return new Blob([buffer], { type: this.info.origin.blob.type });
    } else {
      return this.createBlobFromCanvas(width, height);
    }
  }

  async preview() {
    if (
      Math.max(this.info.origin.width, this.info.origin.height) <=
      ImageHandler.MaxPreviewSize
    ) {
      this.info.preview = {
        width: this.info.origin.width,
        height: this.info.origin.height,
        blob: this.info.origin.blob,
      };
      return;
    }

    let pw, ph: number;
    if (this.info.origin.width >= this.info.origin.height) {
      const rate = ImageHandler.MaxPreviewSize / this.info.origin.width;
      pw = ImageHandler.MaxPreviewSize;
      ph = rate * this.info.origin.height;
    } else {
      const rate = ImageHandler.MaxPreviewSize / this.info.origin.height;
      ph = ImageHandler.MaxPreviewSize;
      pw = rate * this.info.origin.width;
    }

    this.info.preview = {
      width: pw,
      height: ph,
      blob: await this.creatPreviewBlob(pw, ph),
    };
  }
}
