import { CompressOption, ImageInfo, ProcessOutput } from "./ImageBase";
import { GifImage } from "./GifImage";
import { CanvasImage } from "./CanvasImage";
import { PngImage } from "./PngImage";
import { AvifImage } from "./AvifImage";
import { Mimes } from "@/mimes";
import { SvgImage } from "./SvgImage";
import { getSvgDimension } from "./svgParse";

export interface MessageData {
  info: ImageInfo;
  option: CompressOption;
}

export interface OutputMessageData extends Omit<ImageInfo, "name" | "blob"> {
  compress?: ProcessOutput;
  preview?: ProcessOutput;
}

export async function convert(data: MessageData) {
  let blob: Blob = data.info.blob;
  let width: number = 0;
  let height: number = 0;
  const mime = blob.type.toLowerCase();

  // For JPG/JPEG/WEBP/AVIF/PNG/GIF type
  if (
    [Mimes.jpg, Mimes.webp, Mimes.avif, Mimes.png, Mimes.gif].includes(mime)
  ) {
    const bitmap = await createImageBitmap(blob);
    width = bitmap.width;
    height = bitmap.height;
    let target = data.option.format.target;
    if (target) {
      target = target.toLowerCase() as typeof target;
      const canvas = new OffscreenCanvas(width, height);
      const context = canvas.getContext("2d")!;
      if (["jpg", "jpeg"].includes(target)) {
        context.fillStyle = data.option.format.transparentFill;
        context.fillRect(0, 0, width, height);
      }
      context.drawImage(bitmap, 0, 0, width, height, 0, 0, width, height);
      blob = await canvas.convertToBlob({ type: Mimes[target] });
    }
    bitmap.close();
  }

  // For SVG type
  if (Mimes.svg === mime) {
    const data = await blob.text();
    let dimension = { width: 0, height: 0 };
    try {
      dimension = getSvgDimension(data);
    } catch (error) {}
    width = dimension.width;
    height = dimension.height;
  }

  data.info.blob = blob;
  data.info.width = width;
  data.info.height = height;

  // Start to handle images
  return createHandler(data);
}

export async function createHandler(data: MessageData) {
  const mime = data.info.blob.type.toLowerCase();
  if ([Mimes.jpg, Mimes.webp].includes(mime)) {
    return new CanvasImage(data.info, data.option);
  }

  if (mime === Mimes.avif) {
    return new AvifImage(data.info, data.option);
  }

  if (mime === Mimes.png) {
    return new PngImage(data.info, data.option);
  }

  if (mime === Mimes.gif) {
    return new GifImage(data.info, data.option);
  }

  if (mime === Mimes.svg) {
    return new SvgImage(data.info, data.option);
  }
}
