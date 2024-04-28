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

    let buffers: ArrayBuffer[] = [];
    let delays: number[] | undefined = undefined;
    if (result.frames.length === 0) {
      buffers.push(buffer);
    } else {
      delays = [];
      result.frames.forEach((frame) => {
        buffers.push(frame.data ? frame.data.buffer : new ArrayBuffer(0));
        delays!.push(frame.delay);
      });
    }

    const quality = 256 - 256 * (this.info.option.quality / 100);
    const pngBuffer = (<any>UPNG).encode(
      buffers,
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

  /**
   * 获取最终转换后的图片信息
   * @returns
   */
  getInfo() {
    return this.info;
  }
}
