import WorkerC from "./WorkerCompress?worker";
import WorkerP from "./WorkerPreview?worker";
import { useEffect } from "react";
import { uniqId } from "@/functions";
import { toJS } from "mobx";
import { ImageItem, homeState } from "@/states/home";
import { CompressOption, Dimension, ImageInfo } from "./ImageBase";
import { OutputMessageData } from "./handler";
import { Mimes } from "@/mimes";
import { AvifImage } from "./AvifImage";

export interface MessageData {
  info: ImageInfo;
  option: CompressOption;
}

let workerC: Worker | null = null;
let workerP: Worker | null = null;

async function message(event: MessageEvent<OutputMessageData>) {
  const value = homeState.list.get(event.data.key);
  if (value) {
    const item = toJS(value);
    item.width = event.data.width;
    item.height = event.data.height;
    item.compress = event.data.compress ?? item.compress;
    item.preview = event.data.preview ?? item.preview;

    // SVG can't convert in worker，so we do converting here
    if (
      item.blob.type === Mimes.svg &&
      event.data.compress &&
      homeState.option.format.target
    ) {
      const target = homeState.option.format.target.toLowerCase();
      const canvas = document.createElement("canvas");
      canvas.width = item.width;
      canvas.height = item.height;
      const context = canvas.getContext("2d")!;
      if (["jpg", "jpeg"].includes(target)) {
        context.fillStyle = homeState.option.format.transparentFill;
        context.fillRect(0, 0, item.width, item.height);
      }
      const svg = await new Promise<HTMLImageElement>((resolve) => {
        const img = new Image();
        img.src = item.compress!.src;
        img.onload = () => resolve(img);
      });
      context.drawImage(
        svg,
        0,
        0,
        item.width,
        item.height,
        0,
        0,
        item.width,
        item.height,
      );

      // Convert svg to target type
      let blob: Blob;
      if (target === "avif") {
        blob = await AvifImage.encode(
          context,
          item.width,
          item.height,
          homeState.option.avif.quality,
          homeState.option.avif.speed,
        );
      } else {
        blob = await new Promise<Blob>((resolve) => {
          canvas.toBlob(
            (result) => {
              resolve(result!);
            },
            Mimes[target],
            1,
          );
        });
      }
      item.compress!.blob = blob;
      item.compress!.src = URL.createObjectURL(blob);
    }

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

export function createMessageData(item: ImageInfo): MessageData {
  return {
    info: {
      key: item.key,
      name: item.name,
      blob: item.blob,
      width: item.width,
      height: item.height,
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
 * Handle image files
 * @param files
 */
export async function createImageList(files: Array<File>) {
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const info: ImageItem = {
      key: uniqId(),
      name: file.name,
      blob: file,
      width: 0,
      height: 0,
      src: URL.createObjectURL(file),
    };

    // Due to createImageBitmap do not support SVG blob,
    // we should get dimension of SVG via Image
    if (file.type === Mimes.svg) {
      const { width, height } = await new Promise<Dimension>((resolve) => {
        const img = new Image();
        img.src = info.src;
        img.onload = () => {
          resolve({
            width: img.width,
            height: img.height,
          });
        };
      });
      info.width = width;
      info.height = height;
    }

    homeState.list.set(info.key, info);
  }

  /* eslint-disable @typescript-eslint/no-unused-vars */
  for (const [_, item] of homeState.list) {
    createPreviewTask(item);
    createCompressTask(item);
  }
}
