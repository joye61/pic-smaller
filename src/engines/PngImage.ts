/**
 * Reference：
 * https://github.com/antelle/wasm-image-compressor
 */

import { ImageBase, ProcessOutput } from "./ImageBase";
import { Module } from "./PngWasmModule";

export class PngImage extends ImageBase {
  async compress(): Promise<ProcessOutput> {
    const { width, height } = this.getOutputDimension();
    const { context } = await this.createCanvas(width, height);
    const imageData = context.getImageData(0, 0, width, height).data;

    try {
      const buffer = Module._malloc(imageData.byteLength);
      Module.HEAPU8.set(imageData, buffer);
      const imageDataLen = width * height * 4;
      if (imageData.byteLength !== imageDataLen) {
        return this.failResult();
      }
      const outputSizePointer = Module._malloc(4);

      const result = Module._compress(
        width,
        height,
        this.option.png.colors,
        this.option.png.dithering,
        buffer,
        outputSizePointer,
      );
      if (result) {
        return this.failResult();
      }
      const outputSize = Module.getValue(outputSizePointer, "i32", false);
      const output = new Uint8Array(outputSize);
      output.set(Module.HEAPU8.subarray(buffer, buffer + outputSize));

      Module._free(buffer);
      Module._free(outputSizePointer);

      const blob = new Blob([output], { type: this.info.blob.type });
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
