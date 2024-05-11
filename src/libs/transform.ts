import { GifProcessOption } from "./GifImage";
import { JpegProcessOption } from "./JpegImage";
import { PngProcessOption } from "./PngImage";
import WorkerC from "./WorkerCompress?worker";
import WorkerP from "./WorkerPreview?worker";
import { useEffect } from "react";
import { uniqId } from "@/functions";
import { toJS } from "mobx";
import { ImageItem, homeState } from "@/states/home";
import { OutputMessageData } from "./handler";

export interface MessageData {
  info: ImageItem;
  option: JpegProcessOption | GifProcessOption | PngProcessOption;
}

let workerC: Worker | null = null;
let workerP: Worker | null = null;

export function useWorkerHandler() {
  useEffect(() => {
    const message = (event: MessageEvent<OutputMessageData>) => {
      const value = homeState.list.get(event.data.key);
      if (value) {
        const item = toJS(value);
        item.width = event.data.width;
        item.height = event.data.height;
        item.compress = event.data.compress ?? item.compress;
        item.preview = event.data.preview ?? item.preview;
        homeState.list.set(item.key, item);
      }
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

export function createMessageData(item: ImageItem): MessageData {
  const option: Partial<MessageData["option"]> = {
    maxPreviewSize: homeState.option.maxPreviewSize,
    resizeWidth: homeState.option.resizeWidth,
    resizeHeight: homeState.option.resizeHeight,
  };
  const mime = item.blob.type.toLowerCase();
  if (["image/jpeg", "image/webp"].includes(mime)) {
    (<JpegProcessOption>option).quality = homeState.option.jpeg.quality;
  }
  if (mime === "image/png") {
    (<PngProcessOption>option).colors = homeState.option.png.colors;
    (<PngProcessOption>option).dithering = homeState.option.png.dithering;
  }
  if (mime === "image/gif") {
    (<GifProcessOption>option).colors = homeState.option.gif.colors;
    (<GifProcessOption>option).dithering = homeState.option.gif.dithering;
  }

  return {
    info: {
      key: item.key,
      name: item.name,
      blob: item.blob,
    },
    option: option as MessageData["option"],
  };
}

export function createCompressTask(item: ImageItem) {
  workerC?.postMessage(createMessageData(item));
}

export function createPreviewTask(item: ImageItem) {
  workerP?.postMessage(createMessageData(item));
}

export interface FileListLike {
  length: number;
  [index: number]: File;
}

/**
 * 处理上传的图片文件
 * @param files
 */
export async function createImageList(files: FileListLike) {
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const info: ImageItem = {
      key: uniqId(),
      name: file.name,
      blob: file,
    };
    homeState.list.set(info.key, info);
  }

  for (let [_, item] of homeState.list) {
    createPreviewTask(item);
    createCompressTask(item);
  }
}
