import { ImageHandler } from "./ImageHandler";
import { ImageInfo } from "./ImageInfo";
import { JpegImage } from "./JpegImage";
import { PngImage } from "./PngImage";
import { PngWasmImage } from "./PngWasmImage";

export function createImageHandlerInstance(
  info: ImageInfo
): ImageHandler | undefined {
  const mime = info.origin.blob.type;
  if (["image/jpeg", "image/webp"].includes(mime)) {
    return new JpegImage(info);
  }

  if (["image/png"].includes(mime)) {
    if (info.option.openHighPng) {
      return new PngWasmImage(info);
    } else {
      return new PngImage(info);
    }
  }
}
