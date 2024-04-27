import { ImageInfo, PreviewInfo } from "./ImageInfo";
import { JpegImage } from "./JpegImage";

globalThis.addEventListener(
  "message",
  async (event: MessageEvent<ImageInfo>) => {
    const info = event.data;
    const mime = info.origin.blob.type;
    if (["image/jpeg", "image/webp"].includes(mime)) {
      const jpeg = new JpegImage(info);
      await jpeg.compress();
      globalThis.postMessage(info);
    } else if ("image/png" === mime) {
      // TODO
    }
  }
);
