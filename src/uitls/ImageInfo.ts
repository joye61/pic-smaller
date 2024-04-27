import { uniqId } from "@/functions";
import { homeState } from "@/states/home";
import { sendToCreateCompress, sendToCreatePreview } from "./transform";

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

export async function createBlob(
  info: OriginalInfo,
  width: number,
  height: number,
  quality = 0.7
) {
  const offscreen = new OffscreenCanvas(width, height);
  const canvas = offscreen.getContext("2d");
  const image = await createImageBitmap(info.blob);
  canvas?.drawImage(image, 0, 0, info.width, info.height, 0, 0, width, height);
  const opiton: ImageEncodeOptions = {
    type: info.blob.type,
    quality,
  };
  const blob = await offscreen.convertToBlob(opiton);
  image.close();
  return blob;
}

export interface CalculateScaleResult {
  width: number;
  height: number;
}

export function calculateScale(info: ImageInfo) {
  if (info.option.scale === "toWidth") {
    const rate = info.option.toWidth! / info.origin.width;
    return {
      width: info.option.toWidth!,
      height: rate * info.origin.height,
    };
  } else if (info.option.scale === "toHeight") {
    const rate = info.option.toHeight! / info.origin.height;
    return {
      width: rate * info.origin.width,
      height: info.option.toHeight!,
    };
  } else {
    return {
      width: info.origin.width,
      height: info.origin.height,
    };
  }
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
      option: {
        scale: homeState.option.scale,
        toWidth: homeState.option.toWidth,
        toHeight: homeState.option.toHeight,
        quality: homeState.option.quality,
      },
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

  for (let info of list) {
    homeState.list.push(info);
    sendToCreatePreview(info);
    sendToCreateCompress(info);
  }
}
