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
  const mime = data.info.blob.type.toLowerCase();

  // For SVG type
  if (Mimes.svg === mime) {
    // SVG has dimension already
    if (data.info.width > 0 && data.info.height > 0) {
      return createHandler(data);
    }

    // If SVG has no dimension from main thread
    const svgData = await data.info.blob.text();
    let dimension = { width: 0, height: 0 };
    try {
      dimension = getSvgDimension(svgData);
    } catch (error) {}
    data.info.width = dimension.width;
    data.info.height = dimension.height;

    return createHandler(data);
  }

  // For JPG/JPEG/WEBP/AVIF/PNG/GIF type
  const bitmap = await createImageBitmap(data.info.blob);
  data.info.width = bitmap.width;
  data.info.height = bitmap.height;
  let target = data.option.format.target;
  if (target) {
    target = target.toLowerCase() as typeof target;
    const canvas = new OffscreenCanvas(bitmap.width, bitmap.height);
    const context = canvas.getContext("2d")!;
    console.log(target, data.option);
    if (["jpg", "jpeg"].includes(target)) {
      context.fillStyle = data.option.format.transparentFill;
      context.fillRect(0, 0, bitmap.width, bitmap.height);
    }
    context.drawImage(
      bitmap,
      0,
      0,
      bitmap.width,
      bitmap.height,
      0,
      0,
      bitmap.width,
      bitmap.height,
    );
    data.info.blob = await canvas.convertToBlob({ type: Mimes[target] });
  }
  bitmap.close();

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
