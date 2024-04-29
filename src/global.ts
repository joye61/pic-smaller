import { makeAutoObservable } from "mobx";
import { normalize } from "./functions";
import { history } from "./history";
import { LocaleData } from "./locales/type";

export class GlobalState {
  public pathname: string = normalize(history.location.pathname);
  public page: null | React.ReactNode = null;
  public lang: string = "en-US";
  public locale: LocaleData | null = null;
  public mimes: Record<string, string> = {
    jpg: "image/jpeg",
    jpeg: "image/jpeg",
    png: "image/png",
    // apng: "image/apng",
    webp: "image/webp",
    // 'svg': 'image/svg+xml'
  };

  constructor() {
    makeAutoObservable(this);
  }
}

export const gstate = new GlobalState();
export const modules = import.meta.glob("@/pages/**/index.tsx");
