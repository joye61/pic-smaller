import { ImageInfo } from "./ImageInfo";
import { createImageHandlerInstance } from "./instance";

globalThis.addEventListener(
  "message",
  async (event: MessageEvent<ImageInfo>) => {
    const info = event.data;
    const handler = createImageHandlerInstance(info);
    if (handler) {
      await handler.compress();
      globalThis.postMessage(info);
    }
  }
);
