import { Mimes } from "@/mimes";
import {
  CompressOption,
  ImageBase,
  ImageInfo,
  ProcessOutput,
} from "./ImageBase";
import { getSvgDimension } from "./svgParse";
import { optimize } from "svgo";

/**
 * JPEG/JPG/WEBP is compatible
 */
export class SvgImage extends ImageBase {
  // SVG text data
  data: string;

  private constructor(info: ImageInfo, option: CompressOption, data: string) {
    super(info, option);
    this.data = data;
  }

  /**
   * Create JpegImage instance
   * @param info
   * @param option
   * @returns
   */
  public static async create(
    info: Omit<ImageInfo, "width" | "height">,
    option: CompressOption,
  ) {
    const data = await info.blob.text();
    let dimension = { width: 0, height: 0 };
    try {
      dimension = getSvgDimension(data);
    } catch (error) {}
    return new SvgImage({ ...info, ...dimension }, option, data);
  }

  async compress(): Promise<ProcessOutput> {
    if (this.info.width === 0 || this.info.height === 0) {
      return this.failResult();
    }

    const result = optimize(this.data);
    return {
      width: this.info.width,
      height: this.info.height,
      blob: new Blob([result.data], { type: Mimes.svg }),
    };
  }

  /**
   * We will do nothing for svg preview
   * @returns
   */
  async preview(): Promise<ProcessOutput> {
    return this.failResult();
  }
}
