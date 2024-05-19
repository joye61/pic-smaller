import { CompressOption, ImageInfo, ProcessOutput } from "./ImageBase";
import { GifImage } from "./GifImage";
import { JpegImage } from "./JpegImage";
import { PngImage } from "./PngImage";

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
    return JpegImage.create(data.info, data.option);
  }

  if (mime === "image/png") {
    return PngImage.create(data.info, data.option);
  }

  if (mime === "image/gif") {
    return GifImage.create(data.info, data.option);
  }
}
