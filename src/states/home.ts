import { CompressOption, ImageInfo } from "@/uitls/ImageInfo";
import { sendToCreateCompress } from "@/uitls/transform";
import { makeAutoObservable, toJS } from "mobx";

export const DefaultCompressOption: CompressOption = {
  scale: "unChanged",
  quality: 70,
  toWidth: undefined,
  toHeight: undefined,
};

export class HomeState {
  public list: Map<number, ImageInfo> = new Map();
  public showOption: boolean = false;
  public option: CompressOption = DefaultCompressOption;

  constructor() {
    makeAutoObservable(this);
  }

  updateCompressOption(data: Partial<CompressOption>) {
    const option: CompressOption = {
      ...toJS(this.option),
      ...data,
    };
    this.option = option;
    this.list.forEach((info) => {
      info.output = null;
      info.option = option;
      const data: ImageInfo = toJS(info);
      data.preview = null;
      sendToCreateCompress(data);
    });
    this.showOption = false;
  }
}

export const homeState = new HomeState();
