import { ImageInfo } from "@/uitls/ImageInfo";
import { observable } from "mobx";

export interface HomeState {
  list: ImageInfo[];
  showOption: boolean;
}

export const state = observable.object<HomeState>({
  list: [],
  showOption: false,
});
