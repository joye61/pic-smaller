import { ImageInfo } from "@/uitls/ImageInfo";
import { observable } from "mobx";

export interface HomeState {
  list: ImageInfo[];
}

export const state = observable.object<HomeState>({
  list: [],
});
