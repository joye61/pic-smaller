import { ImageInfo, calculateScale } from "./ImageInfo";
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

export class PngImage {
  constructor(private info: ImageInfo) {}

  async compress() {
    const dimension = calculateScale(this.info);
    const buffer = await this.info.origin.blob.arrayBuffer();
    const result: UPNGDecodeResult = UPNG.decode(buffer) as any;
    const frames = UPNG.toRGBA8(result);

    let delays: number[] | undefined = undefined;
    if (result.frames.length >= 2) {
      delays = [];
      result.frames.forEach((frame) => {
        delays!.push(frame.delay);
      });
    }

    const quality = 8 + (256 - 8) * (this.info.option.quality / 100);
    const pngBuffer = (<any>UPNG).encode(
      frames,
      dimension.width,
      dimension.height,
      quality,
      delays
    );

    const blob = new Blob([pngBuffer], { type: this.info.origin.blob.type });

    this.info.output = {
      ...dimension,
      blob,
    };
  }

  async preview() {}
}
