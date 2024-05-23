/**
 * Reference：
 * https://github.com/packurl/wasm_avif
 */

import { Mimes } from "@/mimes";
import { avif } from "./AvifWasmModule";
import { ImageBase, ProcessOutput } from "./ImageBase";

export class AvifImage extends ImageBase {
  async compress(): Promise<ProcessOutput> {
    const { width, height } = this.getOutputDimension();
    try {
      const { context } = await this.createCanvas(width, height);
      const imageData = context.getImageData(0, 0, width, height).data;

      const bytes = new Uint8Array(imageData);
      const result: Uint8Array = await avif(
        bytes,
        width,
        height,
        this.option.avif.quality,
        this.option.avif.speed,
      );

      const blob = new Blob([result], { type: Mimes.avif });
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
