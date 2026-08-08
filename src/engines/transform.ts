import { useEffect } from "react";
import { uniqId } from "@/functions";
import { runInAction, toJS } from "mobx";
import { ImageItem, homeState } from "@/states/home";
import { CompressOption, ImageInfo } from "./ImageBase";
import { OutputMessageData } from "./handler";
import { normalizeCompressOption } from "@/options";

export interface MessageData {
  info: ImageInfo;
  option: CompressOption;
}

let workerC: Worker | null = null;
let workerP: Worker | null = null;

function message(event: MessageEvent<OutputMessageData>) {
  const value = homeState.list.get(event.data.key);
  if (!value) return;

  runInAction(() => {
    // Field-level update avoids replacing the item and rerendering unrelated rows.
    if (event.data.width) value.width = event.data.width;
    if (event.data.height) value.height = event.data.height;

    if (event.data.error) {
      value.processError = event.data.error;
      value.status = "error";
    }

    if (event.data.preservedOriginal !== undefined) {
      value.preservedOriginal = event.data.preservedOriginal;
    }

    if (event.data.compress) {
      if (!value.compress) homeState.completedCompressCount++;
      homeState.outputSize += event.data.compress.blob.size - (value.compress?.blob.size ?? 0);
      value.compress = event.data.compress;
      if (value.status !== "error") value.status = "done";
    }

    if (event.data.preview) {
      if (!value.preview) homeState.completedPreviewCount++;
      value.preview = event.data.preview;
    }
  });
}

export function useWorkerHandler() {
  useEffect(() => {
    workerC = new Worker(new URL("./WorkerCompress.ts", import.meta.url));
    workerP = new Worker(new URL("./WorkerPreview.ts", import.meta.url));
    workerC.addEventListener("message", message);
    workerP.addEventListener("message", message);

    return () => {
      workerC?.removeEventListener("message", message);
      workerP?.removeEventListener("message", message);
      workerC?.terminate();
      workerP?.terminate();
      workerC = null;
      workerP = null;
    };
  }, []);
}

function createMessageData(item: ImageInfo, option: CompressOption): MessageData {
  return {
    /**
     * Why not use the spread operator here?
     * Because it causes an error when used this way,
     * and the exact reason is unknown at the moment.
     *
     * error: `Uncaught (in promise) DOMException: Failed to execute 'postMessage' on 'Worker': #<Object> could not be cloned.`
     * Reproduction method: In the second upload, include the same images as in the first.
     */
    info: {
      key: item.key,
      name: item.name,
      blob: item.blob,
      width: item.width,
      height: item.height,
    },
    option,
  };
}

const dispatchQueue: Array<() => void> = [];
let dispatchTimer: number | null = null;

function flushDispatchQueue() {
  dispatchTimer = null;
  for (let count = 0; count < 8 && dispatchQueue.length > 0; count++) {
    dispatchQueue.shift()!();
  }
  if (dispatchQueue.length > 0) {
    dispatchTimer = window.setTimeout(flushDispatchQueue, 0);
  }
}

function enqueueDispatch(task: () => void) {
  dispatchQueue.push(task);
  if (dispatchTimer === null) {
    dispatchTimer = window.setTimeout(flushDispatchQueue, 0);
  }
}

export function createCompressTask(item: ImageItem) {
  const option = toJS(homeState.option);
  enqueueDispatch(() => workerC?.postMessage(createMessageData(item, option)));
}

function createPreviewTask(item: ImageItem, option: CompressOption) {
  enqueueDispatch(() => workerP?.postMessage(createMessageData(item, option)));
}

/**
 * Handle image files
 * @param files
 */
export async function createImageList(files: Array<File>) {
  // Give user a heads-up when individual files exceed a reasonable size.
  const largeFiles = files.filter((f) => f.size > 50 * 1024 * 1024);
  if (largeFiles.length > 0) {
    const names = largeFiles
      .slice(0, 3)
      .map((f) => f.name)
      .join(", ");
    const extra = largeFiles.length > 3 ? ` +${largeFiles.length - 3}` : "";
    console.warn(
      `[PicSmaller] Detected ${largeFiles.length} large file(s) (${names}${extra}). Processing may be slow or exceed browser memory limits.`,
    );
  }

  if (files.length === 0) return;

  const option = normalizeCompressOption(toJS(homeState.tempOption));
  runInAction(() => { homeState.tempOption = structuredClone(option); });
  runInAction(() => { homeState.option = option; });
  try {
    localStorage.setItem("pic-smaller-options", JSON.stringify(option));
  } catch {}

  for (let offset = 0; offset < files.length; offset += 40) {
    const items = files.slice(offset, offset + 40).map((file): ImageItem => ({
      key: uniqId(),
      name: file.name,
      blob: file,
      width: 0,
      height: 0,
      src: URL.createObjectURL(file),
      preview: undefined,
      compress: undefined,
      status: "processing",
      processError: undefined,
      preservedOriginal: false,
    }));

    runInAction(() => {
      items.forEach((item) => {
        homeState.list.set(item.key, item);
        homeState.originSize += item.blob.size;
      });
    });

    items.forEach((item) => {
      createPreviewTask(item, option);
      enqueueDispatch(() => workerC?.postMessage(createMessageData(item, option)));
    });

    if (offset + 40 < files.length) {
      await new Promise<void>((resolve) => window.setTimeout(resolve, 0));
    }
  }
}
