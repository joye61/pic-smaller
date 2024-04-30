/**
 * 参考项目：https://github.com/antelle/wasm-image-compressor
 */

import { ImageHandler } from "./ImageHandler";
import { Module } from "./PngWasmModule";

const MaxColors = 8; // 0-256 颜色空间
const Dithering = 0; // 0-1 抖动值

export class PngWasmImage extends ImageHandler {
  async compress() {
    const { width, height } = this.calculateScale();
    const { context } = await this.convertOriginToCanvas(width, height);
    const imageData = context.getImageData(0, 0, width, height).data;

    try {
      const buffer = Module._malloc(imageData.byteLength);
      Module.HEAPU8.set(imageData, buffer);
      const imageDataLen = width * height * 4;
      if (imageData.byteLength !== imageDataLen) {
        return this.compressWithError();
      }
      const outputSizePointer = Module._malloc(4);
      const result = Module._compress(
        width,
        height,
        MaxColors,
        Dithering,
        buffer,
        outputSizePointer
      );
      if (result) {
        return this.compressWithError();
      }
      const outputSize = Module.getValue(outputSizePointer, "i32", false);
      const output = new Uint8Array(outputSize);
      output.set(Module.HEAPU8.subarray(buffer, buffer + outputSize));

      this.info.output = {
        width,
        height,
        blob: new Blob([output], { type: this.info.origin.blob.type }),
      };

      Module._free(buffer);
      Module._free(outputSizePointer);
    } catch (error) {
      this.compressWithError();
    }
  }
}
