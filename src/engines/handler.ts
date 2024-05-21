import { CompressOption, ImageInfo, ProcessOutput } from "./ImageBase";
import { GifImage } from "./GifImage";
import { CanvasImage } from "./CanvasImage";
import { PngImage } from "./PngImage";
import { AvifImage } from "./AvifImage";
import { Mimes } from "@/mimes";
import { SvgImage } from "./SvgImage";

export interface MessageData {
  info: Omit<ImageInfo, "width" | "height">;
  option: CompressOption;
}

export interface OutputMessageData extends Omit<ImageInfo, "name" | "blob"> {
  compress?: ProcessOutput;
  preview?: ProcessOutput;
}

export async function createHandler(data: MessageData) {
  const mime = data.info.blob.type.toLowerCase();
  if ([Mimes.jpg, Mimes.webp].includes(mime)) {
    return CanvasImage.create(data.info, data.option);
  }

  if (mime === Mimes.avif) {
    return AvifImage.create(data.info, data.option);
  }

  if (mime === Mimes.png) {
    return PngImage.create(data.info, data.option);
  }

  if (mime === Mimes.gif) {
    return GifImage.create(data.info, data.option);
  }

  if (mime === Mimes.svg) {
    return SvgImage.create(data.info, data.option);
  }
}
