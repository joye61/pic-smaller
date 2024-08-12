import { CompressOption, ProcessOutput } from "@/engines/ImageBase";
import { createCompressTask } from "@/engines/transform";
import { makeAutoObservable } from "mobx";

export const DefaultCompressOption: CompressOption = {
  preview: {
    maxSize: 256,
  },
  resize: {
    method: undefined,
    width: undefined,
    height: undefined,
    short: undefined,
    long: undefined,
    cropWidthRatio: undefined,
    cropHeightRatio: undefined,
    cropWidthSize: undefined,
    cropHeightSize: undefined,
  },
  format: {
    target: undefined,
    transparentFill: "#FFFFFF",
  },
  jpeg: {
    quality: 0.75,
  },
  png: {
    colors: 128,
    dithering: 0.5,
  },
  gif: {
    colors: 128,
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
  src: string;
  width: number;
  height: number;
  preview?: ProcessOutput;
  compress?: ProcessOutput;
};

export class HomeState {
  public list: Map<number, ImageItem> = new Map();
  public option: CompressOption = DefaultCompressOption;
  public tempOption: CompressOption = DefaultCompressOption;
  public compareId: number | null = null;
  public showOption: boolean = false;

  constructor() {
    makeAutoObservable(this);
  }

  /**
   * Check whether crop mode
   * @returns
   */
  isCropMode() {
    const resize = this.option.resize;
    return (
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
    this.list.clear();
    this.tempOption = { ...DefaultCompressOption };
    this.option = { ...DefaultCompressOption };
  }

  reCompress() {
    this.list.forEach((info) => {
      URL.revokeObjectURL(info.compress!.src);
      info.compress = undefined;
      createCompressTask(info);
    });
  }

  hasTaskRunning() {
    /* eslint-disable @typescript-eslint/no-unused-vars */
    for (const [_, value] of this.list) {
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
    const totalNum = this.list.size;
    let loadedNum = 0;
    let originSize = 0;
    let outputSize = 0;
    /* eslint-disable @typescript-eslint/no-unused-vars */
    for (const [_, info] of this.list) {
      originSize += info.blob.size;
      if (info.compress) {
        loadedNum++;
        outputSize += info.compress.blob.size;
      }
    }
    const percent = Math.ceil((loadedNum * 100) / totalNum);
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
