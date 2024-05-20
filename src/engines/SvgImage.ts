import {
  CompressOption,
  ImageBase,
  ImageInfo,
  ProcessOutput,
} from "./ImageBase";

/**
 * JPEG/JPG/WEBP is compatible
 */
export class SvgImage extends ImageBase {
  /**
   * Create JpegImage instance
   * @param info
   * @param option
   * @returns
   */
  public static async create(
    info: Omit<ImageInfo, "width" | "height">,
    option: CompressOption
  ) {
    // const dimension = await ImageBase.getDimension(info.blob);
    // return new SvgImage({ ...info, ...dimension }, option);
  }

  async compress(): Promise<ProcessOutput> {
    // const dimension = this.getOutputDimension();
    // const blob = await this.createBlob(
    //   dimension.width,
    //   dimension.height,
    //   this.option.jpeg.quality
    // );
    // return {
    //   ...dimension,
    //   blob,
    // };
  }
}
