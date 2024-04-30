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
  async compress() {
    const { width, height } = this.calculateScale();
    const { context } = await this.convertOriginToCanvas(width, height);
    const imageData = context.getImageData(0, 0, width, height);
    const frames = [imageData?.data.buffer];
    const quality = 256 * (this.info.option.quality / 100);
    const encodeBuffer = (<any>UPNG).encode(
      frames,
      width,
      height,
      quality < 8 ? 8 : quality
    );

    const blob = new Blob([encodeBuffer], {
      type: this.info.origin.blob.type,
    });

    this.info.output = {
      width,
      height,
      blob,
    };
  }
}
