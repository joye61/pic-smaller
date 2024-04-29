import { ImageInfo } from "./ImageInfo";
import { JpegImage } from "./JpegImage";
import { PngImage } from "./PngImage";
import { WebpImage } from "./WebpImage";

export function createImageHandlerInstance(info: ImageInfo) {
  const mime = info.origin.blob.type;
  let image: undefined | JpegImage | PngImage | typeof WebpImage = undefined;
  if (["image/jpeg", "image/webp"].includes(mime)) {
    image = new JpegImage(info);
  } else if (["image/png"].includes(mime)) {
    image = new PngImage(info);
  }
  return image;
}
