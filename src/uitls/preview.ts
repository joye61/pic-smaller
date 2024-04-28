import { ImageInfo, createBlob } from "./ImageInfo";

globalThis.addEventListener(
  "message",
  async (event: MessageEvent<ImageInfo>) => {
    const info = event.data;
    const max = 256;

    if (Math.max(info.origin.width, info.origin.height) <= max) {
      info.preview = {
        width: info.origin.width,
        height: info.origin.height,
        blob: info.origin.blob,
      };
      globalThis.postMessage(info);
      return;
    }

    if (info.origin.width >= info.origin.height) {
      const rate = max / info.origin.width;
      const pw = max;
      const ph = rate * info.origin.height;

      const blob = await createBlob(info.origin, pw, ph, 1);
      info.preview = {
        width: pw,
        height: ph,
        blob,
      };
      globalThis.postMessage(info);
      return;
    }

    const rate = max / info.origin.height;
    const ph = max;
    const pw = rate * info.origin.width;
    const blob = await createBlob(info.origin, pw, ph, 1);
    info.preview = {
      width: pw,
      height: ph,
      blob,
    };
    globalThis.postMessage(info);
  }
);
