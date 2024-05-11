import { ImageInfo, ProcessOutput } from "./ImageBase";
import { GifImage, GifProcessOption } from "./GifImage";
import { JpegImage, JpegProcessOption } from "./JpegImage";
import { PngImage, PngProcessOption } from "./PngImage";

export interface MessageData {
  info: Omit<ImageInfo, "width" | "height">;
  option: JpegProcessOption | GifProcessOption | PngProcessOption;
}

export interface OutputMessageData extends Omit<ImageInfo, "name" | "blob"> {
  compress?: ProcessOutput;
  preview?: ProcessOutput;
}

export async function createHandler(data: MessageData) {
  const mime = data.info.blob.type.toLowerCase();
  if (["image/jpeg", "image/webp"].includes(mime)) {
    return JpegImage.create(data.info, data.option as JpegProcessOption);
  }

  if (mime === "image/png") {
    return PngImage.create(data.info, data.option as PngProcessOption);
  }

  if (mime === "image/gif") {
    return GifImage.create(data.info, data.option as GifProcessOption);
  }
}
