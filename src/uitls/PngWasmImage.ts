/**
 * Reference：https://github.com/antelle/wasm-image-compressor
 */

import { ImageHandler } from "./ImageHandler";
import { Module } from "./PngWasmModule";

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
        this.info.option.png.colors,
        this.info.option.png.dithering,
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
