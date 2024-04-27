import { observable } from "mobx";
import { normalize } from "./functions";
import { history } from "./history";
import { LocaleData } from "./locales/type";

export interface GlobalState {
  pathname: string;
  page: null | React.ReactNode;
  lang: string;
  locale: LocaleData | null;
  mimes: Record<string, string>;
}

export const gstate = observable.object<GlobalState>({
  pathname: normalize(history.location.pathname),
  page: null,
  mimes: {
    jpg: "image/jpeg",
    jpeg: "image/jpeg",
    png: "image/png",
    webp: "image/webp",
    // 'svg': 'image/svg+xml'
  },
  lang: "en-US",
  locale: null,
});

export const modules = import.meta.glob("@/pages/**/index.tsx");
