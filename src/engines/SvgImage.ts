import { Mimes } from "@/mimes";
import { ImageBase, ProcessOutput } from "./ImageBase";
import { optimize } from "svgo/lib/svgo";
import { applySvgDimension } from "./svgParse";
import { AvifImage } from "./AvifImage";
import { PngImage } from "./PngImage";
import { JpegImage } from "./JpegImage";

/**
 * JPEG/JPG/WEBP is compatible
 */
export class SvgImage extends ImageBase {
  async compress(): Promise<ProcessOutput> {
    if (this.info.width === 0 || this.info.height === 0) {
      return this.failResult();
    }

    const data = await this.info.blob.text();

    const result = optimize(data);
    const dimension = this.getOutputDimension();
    const crop = Boolean(this.option.resize.method &&
      ["setCropRatio", "setCropSize", "presetCrop"].includes(this.option.resize.method));
    const output = !this.option.format.target && this.option.resize.method
      ? applySvgDimension(result.data, this.info, dimension, crop)
      : result.data;
    const optimizedBlob = new Blob([output], { type: Mimes.svg });

    if (this.option.format.target) {
      const target = this.option.format.target.toLowerCase();
      const canvas = new OffscreenCanvas(dimension.width, dimension.height);
      const context = canvas.getContext("2d")!;
      if (["jpg", "jpeg"].includes(target)) {
        context.fillStyle = this.option.format.transparentFill;
        context.fillRect(0, 0, dimension.width, dimension.height);
      }

      const bitmap = await createImageBitmap(optimizedBlob);
      if (crop) {
        context.drawImage(
          bitmap,
          dimension.x,
          dimension.y,
          dimension.width,
          dimension.height,
          0,
          0,
          dimension.width,
          dimension.height,
        );
      } else {
        context.drawImage(bitmap, 0, 0, dimension.width, dimension.height);
      }
      bitmap.close();

      let blob: Blob;
      if (target === "avif") {
        blob = await AvifImage.encode(
          context,
          dimension.width,
          dimension.height,
          this.option.avif.quality,
          this.option.avif.speed,
        );
      } else if (target === "png") {
        blob = await PngImage.encode(
          context.getImageData(0, 0, dimension.width, dimension.height),
          this.option.png.colors,
          this.option.png.dithering,
          this.option.png.extreme,
        );
      } else if (["jpg", "jpeg"].includes(target) && this.option.jpeg.extreme) {
        blob = await JpegImage.encode(
          context.getImageData(0, 0, dimension.width, dimension.height),
          this.option.jpeg.quality,
        );
      } else {
        blob = await canvas.convertToBlob({
          type: Mimes[target],
          quality: this.option.jpeg.quality,
        });
      }

      return {
        width: dimension.width,
        height: dimension.height,
        blob,
        src: URL.createObjectURL(blob),
      };
    }

    return {
      width: dimension.width,
      height: dimension.height,
      blob: optimizedBlob,
      src: URL.createObjectURL(optimizedBlob),
    };
  }

  /**
   * Attempt to render SVG as a preview thumbnail by encoding
   * the SVG text to a data URL. Falls back to original on failure.
   * @returns
   */
  async preview(): Promise<ProcessOutput> {
    try {
      const text = await this.info.blob.text();
      const { width, height } = this.getPreviewDimension();
      const canvas = new OffscreenCanvas(width, height);
      const ctx = canvas.getContext("2d")!;

      const svgBlob = new Blob([text], { type: Mimes.svg });
      const bitmap = await createImageBitmap(svgBlob);
      ctx.drawImage(bitmap, 0, 0, width, height);
      bitmap.close();

      const blob = await canvas.convertToBlob({ type: "image/png" });
      return {
        width,
        height,
        blob,
        src: URL.createObjectURL(blob),
      };
    } catch {
      return this.failResult();
    }
  }
}
