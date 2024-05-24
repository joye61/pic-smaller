/**
 * Reference：
 * https://github.com/packurl/wasm_avif
 */

import { Mimes } from "@/mimes";
import { avif } from "./AvifWasmModule";
import { ImageBase, ProcessOutput } from "./ImageBase";

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
    const imageData = context.getImageData(0, 0, width, height).data;
    const bytes = new Uint8Array(imageData);
    const result: Uint8Array = await avif(bytes, width, height, quality, speed);
    return new Blob([result], { type: Mimes.avif });
  }

  async compress(): Promise<ProcessOutput> {
    const { width, height } = this.getOutputDimension();
    try {
      const { context } = await this.createCanvas(width, height);
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
    } catch (error) {
      return this.failResult();
    }
  }
}
