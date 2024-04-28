import { ImageInfo } from "./ImageInfo";
import { JpegImage } from "./JpegImage";
import { PngImage } from "./PngImage";
import { WebpImage } from "./WebpImage";

globalThis.addEventListener(
  "message",
  async (event: MessageEvent<ImageInfo>) => {
    const info = event.data;
    const mime = info.origin.blob.type;

    let image: null | JpegImage | PngImage | typeof WebpImage = null;
    if (["image/jpeg", "image/webp"].includes(mime)) {
      image = new JpegImage(info);
      globalThis.postMessage(info);
    } else if (["image/png", "image/apng"].includes(mime)) {
      image = new PngImage(info);
    }

    if (image) {
      await image.compress();
      globalThis.postMessage(info);
    }
  }
);
