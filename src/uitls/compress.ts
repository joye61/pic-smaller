import { ImageInfo, PreviewInfo } from "./ImageInfo";

globalThis.addEventListener(
  "message",
  async (event: MessageEvent<ImageInfo>) => {
    const info = event.data;
  }
);
