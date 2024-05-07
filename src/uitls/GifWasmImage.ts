import { gifsicle } from "./GifWasmModule";
import { ImageHandler } from "./ImageHandler";

export class GifWasmImage extends ImageHandler {
  /**
   * 压缩GIF图片，参数参考：https://www.lcdf.org/gifsicle/man.html
   * @returns
   */
  async compress() {
    try {
      const { width, height } = this.calculateScale();
      const commands: string[] = [
        `--resize=${width}x${height}`,
        `--colors=${this.info.option.gif.colors}`,
      ];
      if (this.info.option.gif.dither) {
        commands.push(`--dither=floyd-steinberg`);
      }
      commands.push(`--output=/out/${this.info.origin.name}`);
      commands.push(this.info.origin.name);
      const buffer = await this.info.origin.blob.arrayBuffer();
      const result = await gifsicle({
        data: [
          {
            file: buffer,
            name: this.info.origin.name,
          },
        ],
        command: [commands.join(" ")],
      });

      if (!Array.isArray(result) || result.length !== 1) {
        this.compressWithError();
        return;
      }

      const blob = new Blob([result[0].file], {
        type: this.info.origin.blob.type,
      });
      this.info.output = {
        width,
        height,
        blob,
      };
    } catch (error) {
      this.compressWithError();
    }
  }

  /**
   * 生成预览图
   * @returns 
   */
  async preview() {
    if (
      Math.max(this.info.origin.width, this.info.origin.height) <=
      ImageHandler.MaxPreviewSize
    ) {
      this.info.preview = {
        width: this.info.origin.width,
        height: this.info.origin.height,
        blob: this.info.origin.blob,
      };
      return;
    }

    let pw, ph: number;
    if (this.info.origin.width >= this.info.origin.height) {
      const rate = ImageHandler.MaxPreviewSize / this.info.origin.width;
      pw = ImageHandler.MaxPreviewSize;
      ph = Math.ceil(rate * this.info.origin.height);
    } else {
      const rate = ImageHandler.MaxPreviewSize / this.info.origin.height;
      ph = ImageHandler.MaxPreviewSize;
      pw = Math.ceil(rate * this.info.origin.width);
    }

    const commands: string[] = [
      `--resize=${pw}x${ph}`,
      `--colors=${this.info.option.gif.colors}`,
      `--output=/out/${this.info.origin.name}`,
      this.info.origin.name,
    ];
    const buffer = await this.info.origin.blob.arrayBuffer();
    const result = await gifsicle({
      data: [
        {
          file: buffer,
          name: this.info.origin.name,
        },
      ],
      command: [commands.join(" ")],
    });

    if (!Array.isArray(result) || result.length !== 1) {
      this.info.preview = {
        width: this.info.origin.width,
        height: this.info.origin.height,
        blob: this.info.origin.blob,
      };
      return;
    }

    const blob = new Blob([result[0].file], {
      type: this.info.origin.blob.type,
    });
    this.info.preview = {
      width: pw,
      height: ph,
      blob,
    };
  }
}
