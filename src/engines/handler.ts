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
import { getImageMime, Mimes } from "@/mimes";
import { SvgImage } from "./SvgImage";
import { getSvgDimension } from "./svgParse";
import { getFinalMime } from "@/options";
import { rejectAnimatedImage } from "./animation";
import { JpegImage } from "./JpegImage";

export interface MessageData {
  info: ImageInfo;
  option: CompressOption;
}

export interface OutputMessageData extends Omit<ImageInfo, "name" | "blob" | "bitmap"> {
  compress?: ProcessOutput;
  preview?: ProcessOutput;
  error?: string;
  preservedOriginal?: boolean;
}

export type HandleMethod = "compress" | "preview";

export function createFailureOutput(
  data: MessageData,
  method: HandleMethod,
  error: unknown,
): OutputMessageData {
  const fallback: ProcessOutput = {
    width: data.info.width,
    height: data.info.height,
    blob: data.info.blob,
    src: URL.createObjectURL(data.info.blob),
  };

  return {
    key: data.info.key,
    width: data.info.width,
    height: data.info.height,
    error: error instanceof Error ? error.message : String(error),
    [method]: fallback,
  };
}

async function createInputBitmap(info: ImageInfo, mime: string) {
  if ([Mimes.heic, Mimes.heif].includes(mime)) {
    const { heicTo } = await import("heic-to/next");
    return heicTo({ blob: info.blob, type: "bitmap" });
  }
  return createImageBitmap(info.blob);
}

export async function convert(
  data: MessageData,
  method: HandleMethod = "compress",
): Promise<OutputMessageData | null> {
  const mime = getImageMime({ name: data.info.name, type: data.info.blob.type });

  if (method === "compress" && [Mimes.webp, Mimes.avif].includes(mime)) {
    await rejectAnimatedImage(data.info.blob, mime);
  }

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
  const bitmap = await createInputBitmap(data.info, mime);
  data.info.width = bitmap.width;
  data.info.height = bitmap.height;
  data.info.bitmap = bitmap;

  const isHeif = [Mimes.heic, Mimes.heif].includes(mime);
  if (isHeif && method === "compress" && !data.option.format.target) {
    bitmap.close();
    data.info.bitmap = undefined;
    return {
      key: data.info.key,
      width: data.info.width,
      height: data.info.height,
      preservedOriginal: true,
      compress: {
        width: data.info.width,
        height: data.info.height,
        blob: data.info.blob,
        src: URL.createObjectURL(data.info.blob),
      },
    };
  }
  if (isHeif && method === "preview") {
    data.option.format.target = "jpg";
  }

  try {
    // Type convert logic here
    if (
      // Only compress task need convert
      method === "compress" &&
      // If there is no target type, don't need convert
      data.option.format.target &&
      // If target type is equal to original type, don't need convert
      getFinalMime(mime, data.option.format.target) !== mime
    ) {
      const target = data.option.format.target.toLowerCase();

      if (["avif", "png", "jpg", "jpeg"].includes(target)) {
        return createHandler(data, method, Mimes[target]);
      }

      const handler = new CanvasImage(data.info, data.option);
      const dim = handler.getOutputDimension();
      const outCanvas = new OffscreenCanvas(dim.width, dim.height);
      const outCtx = outCanvas.getContext("2d")!;

      if (["jpg", "jpeg"].includes(target)) {
        outCtx.fillStyle = data.option.format.transparentFill;
        outCtx.fillRect(0, 0, dim.width, dim.height);
      }

      if (
        data.option.resize.method &&
        ["setCropRatio", "setCropSize", "presetCrop"].includes(
          data.option.resize.method,
        )
      ) {
        outCtx.drawImage(
          bitmap,
          dim.x,
          dim.y,
          dim.width,
          dim.height,
          0,
          0,
          dim.width,
          dim.height,
        );
      } else {
        outCtx.drawImage(
          bitmap,
          0,
          0,
          bitmap.width,
          bitmap.height,
          0,
          0,
          dim.width,
          dim.height,
        );
      }

      const blob = await outCanvas.convertToBlob({
        type: Mimes[target],
        quality: data.option.jpeg.quality,
      });
      bitmap.close();
      data.info.bitmap = undefined;

      return {
        key: data.info.key,
        width: dim.width,
        height: dim.height,
        compress: {
          width: dim.width,
          height: dim.height,
          blob,
          src: URL.createObjectURL(blob),
        },
      };
    }

    return createHandler(data, method, isHeif ? Mimes.jpg : undefined);
  } catch (error) {
    // Bitmap was not consumed yet — clean it up.
    try { bitmap.close(); } catch {}
    data.info.bitmap = undefined;
    throw error;
  }
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
  if (mime === Mimes.jpg) {
    image = new JpegImage(data.info, data.option);
  } else if (mime === Mimes.webp) {
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
    try {
      result.preview = await image.preview();
    } catch (error) {
      result.error = error instanceof Error ? error.message : String(error);
      result.preview = image.failResult();
    }
    return result;
  }

  if (image && method === "compress") {
    try {
      result.compress = await image.compress();
    } catch (error) {
      result.error = error instanceof Error ? error.message : String(error);
      result.compress = image.failResult();
    }
    return result;
  }

  return null;
}