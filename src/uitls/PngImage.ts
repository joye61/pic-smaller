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
    const dimension = this.calculateScale();

    const canvas = new OffscreenCanvas(dimension.width, dimension.height);
    const context = canvas.getContext("2d");
    const bitmap = await createImageBitmap(
      this.info.origin.blob,
      0,
      0,
      this.info.origin.width,
      this.info.origin.height
    );
    context?.drawImage(
      bitmap,
      0,
      0,
      this.info.origin.width,
      this.info.origin.height,
      0,
      0,
      dimension.width,
      dimension.height
    );
    const imageData = context?.getImageData(
      0,
      0,
      dimension.width,
      dimension.height
    );
    const frames = [imageData?.data.buffer];
    const quality = 256 * (this.info.option.quality / 100);
    const encodeBuffer = (<any>UPNG).encode(
      frames,
      dimension.width,
      dimension.height,
      quality < 8 ? 8 : quality
    );

    const blob = new Blob([encodeBuffer], {
      type: this.info.origin.blob.type,
    });

    this.info.output = {
      ...dimension,
      blob,
    };
  }
}
