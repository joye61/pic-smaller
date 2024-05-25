import {
  CompressOption,
  ImageBase,
  ImageInfo,
  ProcessOutput,
} from "./ImageBase";
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

export type HandleMethod = "compress" | "preview";

export async function convert(
  data: MessageData,
  method: HandleMethod = "compress",
): Promise<OutputMessageData | null> {
  const mime = data.info.blob.type.toLowerCase();

  // For SVG type, do not support type convert
  if (Mimes.svg === mime) {
    // SVG has dimension already
    if (data.info.width > 0 && data.info.height > 0) {
      return createHandler(data, method);
    }

    // If SVG has no dimension from main thread
    const svgData = await data.info.blob.text();
    let dimension = { width: 0, height: 0 };
    try {
      dimension = getSvgDimension(svgData);
    } catch (error) {}
    data.info.width = dimension.width;
    data.info.height = dimension.height;

    return createHandler(data, method);
  }

  // For JPG/JPEG/WEBP/AVIF/PNG/GIF type
  const bitmap = await createImageBitmap(data.info.blob);
  data.info.width = bitmap.width;
  data.info.height = bitmap.height;

  // Type convert logic here
  if (
    // Only compress task need convert
    method === "compress" &&
    // If there is no target type, don't need convert
    data.option.format.target &&
    // If target type is equal to original type, don't need convert
    data.option.format.target !== data.info.blob.type
  ) {
    const target = data.option.format.target.toLowerCase();

    // Currently no browsers support creation of an AVIF from a canvas
    // So we should encode AVIF image type using webassembly, and the
    // result blob don't need compress agin, return it directly
    if (target === "avif") {
      return createHandler(data, method, Mimes.avif);
    }

    const canvas = new OffscreenCanvas(bitmap.width, bitmap.height);
    const context = canvas.getContext("2d")!;

    // JPEG format don't support transparent, we should set a background
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

    data.info.blob = await canvas.convertToBlob({
      type: Mimes[target],
      quality: 1,
    });
  }

  // Release bitmap
  bitmap.close();

  return createHandler(data, method);
}

export async function createHandler(
  data: MessageData,
  method: HandleMethod,
  specify?: string,
): Promise<OutputMessageData | null> {
  let mime = data.info.blob.type.toLowerCase();
  if (specify) {
    mime = specify;
  }
  let image: ImageBase | null = null;
  if ([Mimes.jpg, Mimes.webp].includes(mime)) {
    image = new CanvasImage(data.info, data.option);
  } else if (mime === Mimes.avif) {
    image = new AvifImage(data.info, data.option);
  } else if (mime === Mimes.png) {
    image = new PngImage(data.info, data.option);
  } else if (mime === Mimes.gif) {
    image = new GifImage(data.info, data.option);
  } else if (mime === Mimes.svg) {
    image = new SvgImage(data.info, data.option);
  }

  // Unsupported handler type, return it
  if (!image) return null;

  const result: OutputMessageData = {
    key: image.info.key,
    width: image.info.width,
    height: image.info.height,
  };

  if (image && method === "preview") {
    result.preview = await image.preview();
    return result;
  }

  if (image && method === "compress") {
    result.compress = await image.compress();
    return result;
  }

  return null;
}
