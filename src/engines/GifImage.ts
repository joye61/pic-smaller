/**
 * Reference：
 * https://github.com/renzhezhilu/gifsicle-wasm-browser
 * https://www.lcdf.org/gifsicle/man.html
 */

import { ImageBase, ProcessOutput } from "./ImageBase";

interface GifsicleModule {
  gifsicle: (options: {
    data: Array<{ file: ArrayBuffer; name: string }>;
    command: string[];
  }) => Promise<Array<{ file: BlobPart }>>;
}

let _gifsicle: GifsicleModule["gifsicle"] | null = null;

async function getGifsicle() {
  if (!_gifsicle) {
    const path = "/codecs/gif/index.browser.mjs";
    const mod = (await import(
      /* webpackIgnore: true */ path
    )) as GifsicleModule;
    _gifsicle = mod.gifsicle;
  }
  return _gifsicle;
}

export class GifImage extends ImageBase {
  async compress(): Promise<ProcessOutput> {
    const { width, height, x, y } = this.getOutputDimension();
    const inputName = "input.gif";
    const outputName = "output.gif";

    const commands: string[] = [
      `--optimize=3`,
      `--colors=${this.option.gif.colors}`,
    ];

    const resizeMethod = this.option.resize.method;
    const isCrop =
      resizeMethod === "presetCrop" ||
      resizeMethod === "setCropRatio" ||
      resizeMethod === "setCropSize";
    if (isCrop) {
      commands.push(`--crop=${x},${y}+${width}x${height}`);
    } else if (width !== this.info.width || height !== this.info.height) {
      commands.push(`--resize=${width}x${height}`);
    }

    if (this.option.gif.dithering) {
      commands.push(`--dither=floyd-steinberg`);
    }
    commands.push(`--output=/out/${outputName}`);
    commands.push(inputName);
    const buffer = await this.info.blob.arrayBuffer();
    const gifsicle = await getGifsicle();
    const result = await gifsicle({
      data: [
        {
          file: buffer,
          name: inputName,
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
  }

  async preview(): Promise<ProcessOutput> {
    const { width, height } = this.getPreviewDimension();
    const bitmap = await createImageBitmap(this.info.blob);
    const canvas = new OffscreenCanvas(width, height);
    const ctx = canvas.getContext("2d")!;
    ctx.drawImage(bitmap, 0, 0, width, height);
    bitmap.close();
    const blob = await canvas.convertToBlob({ type: this.info.blob.type });
    return {
      width,
      height,
      blob,
      src: URL.createObjectURL(blob),
    };
  }
}