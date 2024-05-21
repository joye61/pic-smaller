import { makeAutoObservable } from "mobx";
import { normalize } from "./functions";
import { history } from "./history";
import { LocaleData } from "./type";
import { Initial } from "./Initial";

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
