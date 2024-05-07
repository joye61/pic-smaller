import { uniqId } from "@/functions";
import { homeState } from "@/states/home";
import { sendToCreateCompress, sendToCreatePreview } from "./transform";
import { toJS } from "mobx";
import { gstate } from "@/global";

export interface FileListLike {
  length: number;
  [index: number]: File;
}

export interface OriginalInfo {
  name: string;
  width: number;
  height: number;
  blob: Blob;
}

export type PreviewInfo = Omit<OriginalInfo, "name">;
export type OutputInfo = Omit<OriginalInfo, "name">;

export interface CompressOption {
  // scale: unChanged
  scale: "toWidth" | "toHeight" | "unChanged";
  // depend: scale=toWidth
  toWidth?: number;
  // depend: scale=toHeight
  toHeight?: number;

  jpeg: {
    quality: number; // 0-1
  };
  png: {
    engine: "upng" | "libpng";
    colors: number; // 2-256
    dithering: number; // 0-1,
  };
  gif: {
    colors: number; // 2-256
    dither: boolean; // 是否启用抖色
  };
}

export interface ImageInfo {
  key: number;
  option: CompressOption;
  origin: OriginalInfo;
  preview: PreviewInfo | null;
  output: OutputInfo | null;
  extra?: null | any;
}

/**
 * 处理上传的图片文件
 * @param files
 */
export async function createImagesFromFiles(files: FileListLike) {
  gstate.showLoading(gstate.locale?.readFileTip);
  const list: Array<ImageInfo> = [];
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const bitmap = await createImageBitmap(file);
    const info: ImageInfo = {
      key: uniqId(),
      output: null,
      preview: null,
      option: toJS(homeState.option),
      origin: {
        name: file.name,
        width: bitmap.width,
        height: bitmap.height,
        blob: file,
      },
    };
    bitmap.close();
    list.push(info);
  }
  gstate.hideLoading();

  list.forEach((info) => {
    homeState.list.set(info.key, info);
    sendToCreatePreview(info);
    sendToCreateCompress(info);
  });
}
