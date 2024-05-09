/**
 * Reference：
 * https://github.com/antelle/wasm-image-compressor
 * https://www.lcdf.org/gifsicle/man.html
 */

import { gifsicle } from "./GifWasmModule";
import {
  ImageBase,
  ImageInfo,
  ProcessOption,
  ProcessOutput,
} from "./ImageBase";

export interface GifProcessOption extends ProcessOption {
  colors: number; // 2-256
  dithering: boolean; // enable or unable dithering
}

export class GifImage {
  base: ImageBase;

  constructor(public info: ImageInfo, public option: GifProcessOption) {
    this.base = new ImageBase(info, option);
  }

  async compress(): Promise<ProcessOutput> {
    try {
      const { width, height } = this.base.getOutputDimension();
      const commands: string[] = [
        `--resize=${width}x${height}`,
        `--colors=${this.option.colors}`,
      ];
      if (this.option.dithering) {
        commands.push(`--dither=floyd-steinberg`);
      }
      commands.push(`--output=/out/${this.info.name}`);
      commands.push(this.info.name);
      const buffer = await this.info.blob.arrayBuffer();
      const result = await gifsicle({
        data: [
          {
            file: buffer,
            name: this.info.name,
          },
        ],
        command: [commands.join(" ")],
      });

      if (!Array.isArray(result) || result.length !== 1) {
        return this.base.failResult();
      }

      const blob = new Blob([result[0].file], {
        type: this.info.blob.type,
      });
      return {
        width,
        height,
        blob,
      };
    } catch (error) {
      return this.base.failResult();
    }
  }

  async preview(): Promise<ProcessOutput> {
    const { width, height } = this.base.getPreviewDimension();

    const commands: string[] = [
      `--resize=${width}x${height}`,
      `--colors=${this.option.colors}`,
      `--output=/out/${this.info.name}`,
      this.info.name,
    ];
    const buffer = await this.info.blob.arrayBuffer();
    const result = await gifsicle({
      data: [
        {
          file: buffer,
          name: this.info.name,
        },
      ],
      command: [commands.join(" ")],
    });

    if (!Array.isArray(result) || result.length !== 1) {
      return {
        width: this.info.width,
        height: this.info.height,
        blob: this.info.blob,
      };
    }

    const blob = new Blob([result[0].file], {
      type: this.info.blob.type,
    });
    return {
      width,
      height,
      blob,
    };
  }
}
