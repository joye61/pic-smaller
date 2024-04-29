import { ImageInfo } from "./ImageInfo";

export abstract class ImageHandler {
  // 定义最大预览尺寸常量
  public static MaxPreviewSize = 256;

  constructor(public info: ImageInfo) {}

  /**
   * 压缩图片功能
   */
  abstract compress(): Awaited<void>;

  /**
   * 从OffscreenCanvas中创建Blob
   * @param width
   * @param height
   * @param quality
   * @returns
   */
  async createBlobFromCanvas(width: number, height: number, quality = 0.7) {
    const offscreen = new OffscreenCanvas(width, height);
    const canvas = offscreen.getContext("2d");
    const image = await createImageBitmap(this.info.origin.blob);
    canvas?.drawImage(
      image,
      0,
      0,
      this.info.origin.width,
      this.info.origin.height,
      0,
      0,
      width,
      height
    );
    const opiton: ImageEncodeOptions = {
      type: this.info.origin.blob.type,
      quality,
    };
    const blob = await offscreen.convertToBlob(opiton);
    image.close();
    return blob;
  }

  /**
   * 计算缩放后的宽度和高度
   * @returns
   */
  calculateScale(): {
    width: number;
    height: number;
  } {
    if (this.info.option.scale === "toWidth") {
      const rate = this.info.option.toWidth! / this.info.origin.width;
      return {
        width: this.info.option.toWidth!,
        height: Math.ceil(rate * this.info.origin.height),
      };
    } else if (this.info.option.scale === "toHeight") {
      const rate = this.info.option.toHeight! / this.info.origin.height;
      return {
        width: Math.ceil(rate * this.info.origin.width),
        height: this.info.option.toHeight!,
      };
    } else {
      return {
        width: this.info.origin.width,
        height: this.info.origin.height,
      };
    }
  }

  async preview() {
    if (
      Math.max(this.info.origin.width, this.info.origin.height) <=
      ImageHandler.MaxPreviewSize
    ) {
      this.info.preview = {
        width: this.info.origin.width,
        height: this.info.origin.height,
        blob: this.info.origin.blob,
      };
      return;
    }

    let pw, ph: number;
    if (this.info.origin.width >= this.info.origin.height) {
      const rate = ImageHandler.MaxPreviewSize / this.info.origin.width;
      pw = ImageHandler.MaxPreviewSize;
      ph = Math.ceil(rate * this.info.origin.height);
    } else {
      const rate = ImageHandler.MaxPreviewSize / this.info.origin.height;
      ph = ImageHandler.MaxPreviewSize;
      pw = Math.ceil(rate * this.info.origin.width);
    }

    this.info.preview = {
      width: pw,
      height: ph,
      blob: await this.createBlobFromCanvas(pw, ph),
    };
  }
}
