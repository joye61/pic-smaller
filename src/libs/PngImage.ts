/**
 * Reference：
 * https://github.com/antelle/wasm-image-compressor
 */

import {
  ImageBase,
  ImageInfo,
  ProcessOption,
  ProcessOutput,
} from "./ImageBase";
import { Module } from "./PngWasmModule";

export interface PngProcessOption extends ProcessOption {
  colors: number; // 2-256
  dithering: number; // 0-1,
}

export class PngImage {
  base: ImageBase;

  constructor(public info: ImageInfo, public option: PngProcessOption) {
    this.base = new ImageBase(info, option);
  }

  async compress(): Promise<ProcessOutput> {
    const { width, height } = this.base.getOutputDimension();
    const { context } = await this.base.createCanvas(width, height);
    const imageData = context.getImageData(0, 0, width, height).data;

    try {
      const buffer = Module._malloc(imageData.byteLength);
      Module.HEAPU8.set(imageData, buffer);
      const imageDataLen = width * height * 4;
      if (imageData.byteLength !== imageDataLen) {
        return this.base.failResult();
      }
      const outputSizePointer = Module._malloc(4);

      const result = Module._compress(
        width,
        height,
        this.option.colors,
        this.option.dithering,
        buffer,
        outputSizePointer
      );
      if (result) {
        return this.base.failResult();
      }
      const outputSize = Module.getValue(outputSizePointer, "i32", false);
      const output = new Uint8Array(outputSize);
      output.set(Module.HEAPU8.subarray(buffer, buffer + outputSize));

      Module._free(buffer);
      Module._free(outputSizePointer);

      return {
        width,
        height,
        blob: new Blob([output], { type: this.info.blob.type }),
      };
    } catch (error) {
      return this.base.failResult();
    }
  }

  async preview(): Promise<ProcessOutput> {
    return this.base.preview();
  }
}
