import { uniqId } from "@/functions";
import { homeState } from "@/states/home";
import { sendToCreateCompress, sendToCreatePreview } from "./transform";
import { toJS } from "mobx";

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
  // compress quality: 70
  quality: number;
}

export interface ImageInfo {
  key: number;
  option: CompressOption;
  origin: OriginalInfo;
  preview: PreviewInfo | null;
  output: OutputInfo | null;
}

/**
 * 处理上传的图片文件
 * @param files
 */
export async function createImagesFromFiles(files: FileListLike) {
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

  list.forEach((info) => {
    homeState.list.set(info.key, info);
    sendToCreatePreview(info);
    sendToCreateCompress(info);
  });
}
