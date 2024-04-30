import { CompressOption, ImageInfo } from "@/uitls/ImageInfo";
import { sendToCreateCompress } from "@/uitls/transform";
import { makeAutoObservable, toJS } from "mobx";

export const DefaultCompressOption: CompressOption = {
  scale: "unChanged",
  quality: 60,
  toWidth: undefined,
  toHeight: undefined,
  openHighPng: false,
  // highPngColors: 8,
  highPngDither: 0,
};

export interface ProgressHintInfo {
  loadedNum: number;
  totalNum: number;
  percent: number;
  originSize: number;
  outputSize: number;
  rate: number;
}

export class HomeState {
  public list: Map<number, ImageInfo> = new Map();
  public showOption: boolean = false;
  public option: CompressOption = DefaultCompressOption;

  constructor() {
    makeAutoObservable(this);
  }

  reCompress(){
    this.list.forEach(info => {
      info.output = null;
      sendToCreateCompress(toJS(info));
    })
  }

  async updateCompressOption(data: Partial<CompressOption>) {
    this.showOption = false;
    await new Promise<void>((resolve) => {
      window.setTimeout(resolve, 300);
    });
    const option: CompressOption = {
      ...toJS(this.option),
      ...data,
    };
    this.option = option;
    this.list.forEach((info) => {
      info.output = null;
      info.option = option;
      sendToCreateCompress(toJS(info));
    });
  }

  hasTaskRunning() {
    for (let [_, value] of this.list) {
      if (!value.preview || !value.output) {
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
      originSize += info.origin.blob.size;
      if (info.output) {
        loadedNum++;
        outputSize += info.output.blob.size;
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
