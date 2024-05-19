import { CompressOption, ProcessOutput } from "@/engines/ImageBase";
import { createCompressTask } from "@/engines/transform";
import { makeAutoObservable } from "mobx";

export const DefaultCompressOption: CompressOption = {
  maxPreviewSize: 256,
  resizeMethod: "unChanged",
  resizeWidth: undefined,
  resizeHeight: undefined,
  jpeg: {
    quality: 0.7,
  },
  png: {
    colors: 32,
    dithering: 0,
  },
  gif: {
    colors: 32,
    dithering: false,
  },
  avif: {
    quality: 50,
    speed: 8,
  },
};

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
  width?: number;
  height?: number;
  preview?: ProcessOutput;
  compress?: ProcessOutput;
};

export class HomeState {
  public list: Map<number, ImageItem> = new Map();
  public option: CompressOption = DefaultCompressOption;
  public tempOption: CompressOption = DefaultCompressOption;
  public compareId: number | null = null;

  constructor() {
    makeAutoObservable(this);
  }

  reCompress() {
    this.list.forEach((info) => {
      info.compress = undefined;
      createCompressTask(info);
    });
  }

  hasTaskRunning() {
    for (let [_, value] of this.list) {
      if (!value.preview || !value.compress) {
        return true;
      }
    }
    return false;
  }

  /**
   * 获取进度条信息
   * @returns
   */
  getProgressHintInfo(): ProgressHintInfo {
    let loadedNum = 0;
    let totalNum = this.list.size;
    let originSize = 0;
    let outputSize = 0;
    for (let [_, info] of this.list) {
      originSize += info.blob.size;
      if (info.compress) {
        loadedNum++;
        outputSize += info.compress.blob.size;
      }
    }
    let percent = Math.ceil((loadedNum * 100) / totalNum);
    const originRate = ((outputSize - originSize) * 100) / originSize;
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
