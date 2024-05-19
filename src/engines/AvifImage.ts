/**
 * Reference：
 * https://github.com/packurl/wasm_avif
 */

import { avif } from "./AvifWasmModule";
import {
  CompressOption,
  ImageBase,
  ImageInfo,
  ProcessOutput,
} from "./ImageBase";

export class AvifImage extends ImageBase {
  /**
   * Create PngImage instance
   * @param info
   * @param option
   * @returns
   */
  public static async create(
    info: Omit<ImageInfo, "width" | "height">,
    option: CompressOption
  ) {
    const dimension = await ImageBase.getDimension(info.blob);
    return new AvifImage({ ...info, ...dimension }, option);
  }

  async compress(): Promise<ProcessOutput> {
    const { width, height } = this.getOutputDimension();
    try {
      const { context } = await this.createCanvas(width, height);
      const imageData = context.getImageData(0, 0, width, height).data;

      const bytes = new Uint8Array(imageData);
      const result: Uint8Array = avif(
        bytes,
        width,
        height,
        this.option.avif.quality,
        this.option.avif.speed
      );
      return {
        width,
        height,
        blob: new Blob([result]),
      };
    } catch (error) {
      console.log(error);
      return this.failResult();
    }
  }
}
