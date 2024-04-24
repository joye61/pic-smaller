import { observable } from "mobx";
import { normalize } from "./functions";
import { history } from "./history";

export interface GlobalState {
  pathname: string;
  page: null | React.ReactNode;
}

export const gstate = observable.object<GlobalState>({
  pathname: normalize(history.location.pathname),
  page: null,
});

export const modules = import.meta.glob("@/pages/**/index.tsx");
