import { makeAutoObservable } from "mobx";
import { normalize } from "./functions";
import { history } from "./history";
import { LocaleData } from "./type";
import { Initial } from "./Initial";

// 支持的图片类型
export const Mimes: Record<string, string> = {
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  png: "image/png",
  webp: "image/webp",
  gif: "image/gif",
  svg: "image/svg+xml",
};

export class GlobalState {
  public pathname: string = normalize(history.location.pathname);
  public page: null | React.ReactNode = (<Initial />);
  public lang: string = "en-US";
  public locale: LocaleData | null = null;
  public loading: boolean = false;
  constructor() {
    makeAutoObservable(this);
  }
}

export const gstate = new GlobalState();
