export interface OriginalInfo {
  name: string;
  type: string;
  size: number;
  width: number;
  height: number;
  blob: Blob;
}

export type OutputInfo = OriginalInfo;

export interface CompressOption {
  // 缩放类型，默认值为 unChanged
  scale: "toWidth" | "toHeight" | "unChanged";
  // 缩放到宽度值，依赖:scale=toWidth
  toWidth?: number;
  // 缩放到高度值，依赖:scale=toHeight
  toHeight?: number;
  // 压缩质量，默认70
  quality: number;
}

export interface ImageInfo {
  key: number;
  option: CompressOption;
  origin: OriginalInfo;
  output: OutputInfo | null;
}
