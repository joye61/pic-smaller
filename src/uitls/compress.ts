import { ImageInfo } from "./ImageInfo";

globalThis.addEventListener(
  "message",
  async (event: MessageEvent<ImageInfo>) => {
    console.log(event);
  }
);
