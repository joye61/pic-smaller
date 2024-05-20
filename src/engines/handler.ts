import { CompressOption, ImageInfo, ProcessOutput } from "./ImageBase";
import { GifImage } from "./GifImage";
import { CanvasImage } from "./CanvasImage";
import { PngImage } from "./PngImage";
import { AvifImage } from "./AvifImage";
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
  if (["image/jpeg", "image/webp"].includes(mime)) {
    return CanvasImage.create(data.info, data.option);
  }

  if (mime === "image/avif") {
    return AvifImage.create(data.info, data.option);
  }

  if (mime === "image/png") {
    return PngImage.create(data.info, data.option);
  }

  if (mime === "image/gif") {
    return GifImage.create(data.info, data.option);
  }

  if (mime === "image/svg+xml") {
    return SvgImage.create(data.info, data.option);
  }
}
