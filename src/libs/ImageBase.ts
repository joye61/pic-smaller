export interface ProcessOption {
  maxPreviewSize: number;
  resizeWidth?: number;
  resizeHeight?: number;
}

export interface ProcessOutput {
  width: number;
  height: number;
  blob: Blob;
}

export interface ImageInfo {
  key: number;
  name: string;
  width: number;
  height: number;
  blob: Blob;
}

export interface Dimension {
  width: number;
  height: number;
}

export class ImageBase {
  constructor(public info: ImageInfo, public option: ProcessOption) {}

  /**
   * Get dimension from image blob
   * @param blob
   * @returns
   */
  static async getDimension(blob: Blob): Promise<Dimension> {
    const bitmap = await createImageBitmap(blob);
    const result: Dimension = {
      width: bitmap.width,
      height: bitmap.height,
    };
    bitmap.close();
    return result;
  }

  /**
   * Ensure original dimension exists
   */
  async ensureOriginalDimension() {
    if (!this.info.width || !this.info.height) {
      const bitmap = await createImageBitmap(this.info.blob);
      this.info.width = bitmap.width;
      this.info.height = bitmap.height;
    }
  }

  /**
   * Get output image dimension, based on resize param
   * @returns Dimension
   */
  getOutputDimension(): Dimension {
    if (!this.option.resizeWidth && !this.option.resizeHeight) {
      return {
        width: this.info.width,
        height: this.info.height,
      };
    }

    if (!this.option.resizeWidth && this.option.resizeHeight) {
      const rate = this.option.resizeHeight / this.info.height;
      const width = rate * this.info.width;
      return {
        width,
        height: Math.ceil(this.option.resizeHeight),
      };
    }

    if (this.option.resizeWidth && !this.option.resizeHeight) {
      const rate = this.option.resizeWidth / this.info.width;
      const height = rate * this.info.height;
      return {
        width: Math.ceil(this.option.resizeWidth),
        height,
      };
    }

    return {
      width: Math.ceil(this.option.resizeWidth!),
      height: Math.ceil(this.option.resizeHeight!),
    };
  }

  /**
   * Return original info when process fails
   * @returns
   */
  failResult(): ProcessOutput {
    return {
      width: this.info.width,
      height: this.info.height,
      blob: this.info.blob,
    };
  }

  /**
   * Get preview image size via option
   * @returns Dimension
   */
  getPreviewDimension(): Dimension {
    const maxSize = this.option.maxPreviewSize;
    if (Math.max(this.info.width, this.info.height) <= maxSize) {
      return {
        width: this.info.width,
        height: this.info.height,
      };
    }

    let width, height: number;
    if (this.info.width >= this.info.height) {
      const rate = maxSize / this.info.width;
      width = maxSize;
      height = rate * this.info.height;
    } else {
      const rate = maxSize / this.info.height;
      width = rate * this.info.width;
      height = maxSize;
    }

    return { width: Math.ceil(width), height: Math.ceil(height) };
  }

  /**
   * Get preview from native browser method
   * @returns
   */
  async preview(): Promise<ProcessOutput> {
    const { width, height } = this.getPreviewDimension();
    return {
      width,
      height,
      blob: await this.createBlob(width, height),
    };
  }

  async createCanvas(
    width: number,
    height: number
  ): Promise<{
    canvas: OffscreenCanvas;
    context: OffscreenCanvasRenderingContext2D;
  }> {
    const canvas = new OffscreenCanvas(width, height);
    const context = canvas.getContext("2d")!;
    const image = await createImageBitmap(this.info.blob);
    context?.drawImage(
      image,
      0,
      0,
      this.info.width,
      this.info.height,
      0,
      0,
      width,
      height
    );
    image.close();
    return { canvas, context };
  }

  /**
   * create OffscreenCanvas from Blob
   * @param width
   * @param height
   * @param quality
   * @returns
   */
  async createBlob(width: number, height: number, quality = 0.6) {
    const { canvas } = await this.createCanvas(width, height);
    const opiton: ImageEncodeOptions = {
      type: this.info.blob.type,
      quality,
    };
    return canvas.convertToBlob(opiton);
  }
}
