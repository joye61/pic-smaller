import { observable } from "mobx";

export interface UploadCardState {
  dragActive: boolean;
}

export const state = observable.object<UploadCardState>({
  dragActive: false,
});
