import WorkerC from "./WorkerCompress?worker";
import WorkerP from "./WorkerPreview?worker";
import { useEffect } from "react";
import { uniqId } from "@/functions";
import { toJS } from "mobx";
import { ImageItem, homeState } from "@/states/home";
import { OutputMessageData } from "./handler";
import { CompressOption } from "./ImageBase";

export interface MessageData {
  info: ImageItem;
  option: CompressOption;
}

let workerC: Worker | null = null;
let workerP: Worker | null = null;

function message(event: MessageEvent<OutputMessageData>) {
  const value = homeState.list.get(event.data.key);
  if (value) {
    const item = toJS(value);
    item.width = event.data.width;
    item.height = event.data.height;
    item.compress = event.data.compress ?? item.compress;
    item.preview = event.data.preview ?? item.preview;
    homeState.list.set(item.key, item);
  }
}

export function useWorkerHandler() {
  useEffect(() => {
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
  return {
    info: {
      key: item.key,
      name: item.name,
      blob: item.blob,
    },
    option: toJS(homeState.option),
  };
}

export function createCompressTask(item: ImageItem) {
  workerC?.postMessage(createMessageData(item));
}

export function createPreviewTask(item: ImageItem) {
  workerP?.postMessage(createMessageData(item));
}

/**
 * 处理上传的图片文件
 * @param files
 */
export async function createImageList(files: Array<File>) {
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const info: ImageItem = {
      key: uniqId(),
      name: file.name,
      blob: file,
    };
    homeState.list.set(info.key, info);
  }

  /* eslint-disable @typescript-eslint/no-unused-vars */
  for (const [_, item] of homeState.list) {
    createPreviewTask(item);
    createCompressTask(item);
  }
}
