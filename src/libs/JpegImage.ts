import {
  ImageBase,
  ImageInfo,
  ProcessOption,
  ProcessOutput,
} from "./ImageBase";

export interface JpegProcessOption extends ProcessOption {
  quality: number; // 0-1
}

/**
 * JPEG/JPG/WEBP is compatible
 */
export class JpegImage extends ImageBase {
  /**
   * Create JpegImage instance
   * @param info
   * @param option
   * @returns
   */
  public static async create(
    info: Omit<ImageInfo, "width" | "height">,
    option: JpegProcessOption
  ) {
    const dimension = await ImageBase.getDimension(info.blob);
    return new JpegImage({ ...info, ...dimension }, option);
  }

  async compress(): Promise<ProcessOutput> {
    const option = <JpegProcessOption>this.option;
    const dimension = this.getOutputDimension();
    const blob = await this.createBlob(
      dimension.width,
      dimension.height,
      option.quality
    );
    return {
      ...dimension,
      blob,
    };
  }
}
