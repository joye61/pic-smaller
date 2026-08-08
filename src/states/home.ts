import { CompressOption, ProcessOutput } from "@/engines/ImageBase";
import { createCompressTask } from "@/engines/transform";
import { makeAutoObservable, reaction, toJS } from "mobx";
import { DefaultCompressOption, normalizeCompressOption } from "@/options";

export { DefaultCompressOption } from "@/options";

export interface ProgressHintInfo {
  loadedNum: number;
  totalNum: number;
  percent: number;
  originSize: number;
  outputSize: number;
  rate: number;
}

export type ImageItem = {
  key: number;
  name: string;
  blob: Blob;
  src: string;
  width: number;
  height: number;
  preview?: ProcessOutput;
  compress?: ProcessOutput;
  status: "pending" | "processing" | "done" | "error";
  processError?: string;
  preservedOriginal?: boolean;
};

function revokeItemUrls(item?: ImageItem) {
  if (!item) return;
  if (item.src) URL.revokeObjectURL(item.src);
  if (item.preview?.src) URL.revokeObjectURL(item.preview.src);
  if (item.compress?.src) URL.revokeObjectURL(item.compress.src);
}

const OPTION_STORAGE_KEY = "pic-smaller-options";

function loadPersistedOption(): CompressOption {
  try {
    const raw = localStorage.getItem(OPTION_STORAGE_KEY);
    if (raw) {
      return normalizeCompressOption(JSON.parse(raw));
    }
  } catch {}
  return normalizeCompressOption(undefined);
}

function persistOption(option: CompressOption) {
  try {
    localStorage.setItem(OPTION_STORAGE_KEY, JSON.stringify(option));
  } catch {}
}

export class HomeState {
  public list: Map<number, ImageItem> = new Map();
  public option: CompressOption = loadPersistedOption();
  public tempOption: CompressOption = loadPersistedOption();
  public compareId: number | null = null;
  public showOption: boolean = false;
  public completedCompressCount: number = 0;
  public completedPreviewCount: number = 0;
  public originSize: number = 0;
  public outputSize: number = 0;

  constructor() {
    makeAutoObservable(this);

    // Auto-persist temp option changes so settings survive page reloads
    // even before the user commits them by starting a batch.
    reaction(
      () => toJS(this.tempOption),
      (opt) => persistOption(opt),
    );
  }

  /**
   * Check whether crop mode
   * @returns
   */
  isCropMode() {
    const resize = this.option.resize;
    return (
      (resize.method === "presetCrop" &&
        resize.presetCrop?.paperSize != null) ||
      (resize.method === "setCropRatio" &&
        resize.cropWidthRatio &&
        resize.cropHeightRatio &&
        resize.cropWidthRatio > 0 &&
        resize.cropHeightRatio > 0) ||
      (resize.method === "setCropSize" &&
        resize.cropWidthSize &&
        resize.cropHeightSize &&
        resize.cropWidthSize > 0 &&
        resize.cropHeightSize > 0)
    );
  }

  clear() {
    this.list.forEach((item) => revokeItemUrls(item));
    this.list.clear();
    this.completedCompressCount = 0;
    this.completedPreviewCount = 0;
    this.originSize = 0;
    this.outputSize = 0;
    this.tempOption = structuredClone(DefaultCompressOption);
    this.option = structuredClone(DefaultCompressOption);
    persistOption(this.option);
  }

  remove(key: number) {
    const item = this.list.get(key);
    if (!item) return;
    this.originSize -= item.blob.size;
    if (item.preview) this.completedPreviewCount--;
    if (item.compress) {
      this.completedCompressCount--;
      this.outputSize -= item.compress.blob.size;
    }
    revokeItemUrls(item);
    this.list.delete(key);
  }

  reCompress() {
    // Persist current options before re-compressing
    persistOption(this.option);
    this.completedCompressCount = 0;
    this.outputSize = 0;
    this.list.forEach((info) => {
      if (info.compress?.src) {
        URL.revokeObjectURL(info.compress.src);
      }
      info.compress = undefined;
      info.status = "pending";
      info.processError = undefined;
      info.preservedOriginal = false;
      createCompressTask(info);
    });
  }

  hasTaskRunning() {
    return this.completedPreviewCount < this.list.size ||
      this.completedCompressCount < this.list.size;
  }

  /**
   * 获取进度条信息
   * @returns
   */
  getProgressHintInfo(): ProgressHintInfo {
    const totalNum = this.list.size;
    const loadedNum = this.completedCompressCount;
    const originSize = this.originSize;
    const outputSize = this.outputSize;
    const percent = totalNum > 0 ? Math.ceil((loadedNum * 100) / totalNum) : 0;
    const originRate =
      originSize > 0 ? ((outputSize - originSize) * 100) / originSize : 0;
    const rate = Number(Math.abs(originRate).toFixed(2));

    return {
      totalNum,
      loadedNum,
      originSize,
      outputSize,
      percent,
      rate,
    };
  }
}

export const homeState = new HomeState();
