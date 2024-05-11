import { ImageInfo, ProcessOutput } from "./ImageBase";
import { GifImage, GifProcessOption } from "./GifImage";
import { JpegImage, JpegProcessOption } from "./JpegImage";
import { PngImage, PngProcessOption } from "./PngImage";
import WorkerC from "./WorkerCompress?worker";
import WorkerP from "./WorkerPreview?worker";
import { useEffect } from "react";

export interface MessageData {
  info: Omit<ImageInfo, "width" | "height">;
  option: JpegProcessOption | GifProcessOption | PngProcessOption;
}

/**
 * 常见图片处理程序
 * @param data
 * @returns
 */
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

let workerC: Worker | null = null;
let workerP: Worker | null = null;

export function useWorkerHandler() {
  useEffect(() => {
    const message = (event: MessageEvent<ProcessOutput>) => {
      const data = event.data;
    };
    workerC = new WorkerC();
    workerP = new WorkerP();
    workerC.addEventListener("message", message);
    workerP.addEventListener("message", message);

    return () => {
      workerC!.removeEventListener("message", message);
      workerP!.removeEventListener("message", message);
      workerC!.terminate();
      workerP!.terminate();
      workerC = null;
      workerP = null;
    };
  }, []);
}
