/**
 * Reference：
 * https://github.com/renzhezhilu/gifsicle-wasm-browser
 * https://www.lcdf.org/gifsicle/man.html
 */

import { gifsicle } from "./GifWasmModule";
import { ImageBase, ProcessOutput } from "./ImageBase";

export class GifImage extends ImageBase {
  async compress(): Promise<ProcessOutput> {
    try {
      const { width, height, x, y } = this.getOutputDimension();

      const commands: string[] = [
        `--optimize=3`,
        // `--resize=${width}x${height}`,
        `--colors=${this.option.gif.colors}`,
      ];

      // Crop mode
      if (width !== this.info.width || height !== this.info.height) {
        commands.push(`--crop=${x},${y}+${width}x${height}`);
      } else {
        commands.push(`--resize=${width}x${height}`);
      }

      if (this.option.gif.dithering) {
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
        return this.failResult();
      }

      const blob = new Blob([result[0].file], {
        type: this.info.blob.type,
      });
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

  async preview(): Promise<ProcessOutput> {
    const { width, height, x, y } = this.getPreviewDimension();

    const commands: string[] = [
      `--colors=${this.option.gif.colors}`,
      // `--resize=${width}x${height}`,
      `--output=/out/${this.info.name}`,
    ];

    // Crop mode
    if (width !== this.info.width || height !== this.info.height) {
      commands.push(`--crop=${x},${y}+${width}x${height}`);
    } else {
      commands.push(`--resize=${width}x${height}`);
    }

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
      return {
        width: this.info.width,
        height: this.info.height,
        blob: this.info.blob,
        src: URL.createObjectURL(this.info.blob),
      };
    }

    const blob = new Blob([result[0].file], {
      type: this.info.blob.type,
    });
    return {
      width,
      height,
      blob,
      src: URL.createObjectURL(blob),
    };
  }
}
