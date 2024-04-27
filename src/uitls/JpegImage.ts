import { ImageInfo } from "./ImageInfo";

export class JpegImage {
  constructor(private info: ImageInfo) {}

  async compress() {}

  /**
   * 获取最终转换后的图片信息
   * @returns 
   */
  getInfo() {
    return this.info;
  }
}
