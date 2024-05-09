import {
  ImageBase,
  ImageInfo,
  ProcessOption,
  ProcessOutput,
} from "./ImageBase";

export interface JpegProcessOption extends ProcessOption {
  quality: number; // 0-1
}

export class JpegImage {
  base: ImageBase;

  constructor(public info: ImageInfo, public option: JpegProcessOption) {
    this.base = new ImageBase(info, option);
  }

  async compress(): Promise<ProcessOutput> {
    const dimension = this.base.getOutputDimension();
    const blob = await this.base.createBlob(
      dimension.width,
      dimension.height,
      this.option.quality
    );
    return {
      ...dimension,
      blob,
    };
  }

  async preview(): Promise<ProcessOutput> {
    return this.base.preview();
  }
}
