import { observable } from "mobx";
import { normalize } from "./functions";
import { history } from "./history";
import { LocaleData } from "./locales/type";

export interface GlobalState {
  pathname: string;
  page: null | React.ReactNode;
  supportedTypes: string[];
  locale: LocaleData | null;
}

export const gstate = observable.object<GlobalState>({
  pathname: normalize(history.location.pathname),
  page: null,
  supportedTypes: ["jpg", "jpeg", "png", "webp"],
  locale: null,
});

export const modules = import.meta.glob("@/pages/**/index.tsx");
