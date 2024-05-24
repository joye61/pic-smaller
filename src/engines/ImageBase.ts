export interface ImageInfo {
  key: number;
  name: string;
  width: number;
  height: number;
  blob: Blob;
}

export interface CompressOption {
  preview: {
    maxSize: number;
  };
  resize: {
    method?: "fitWidth" | "fitHeight";
    width?: number;
    height?: number;
  };
  format: {
    target?: "jpg" | "jpeg" | "png" | "webp" | "avif";
    transparentFill: string;
  };
  jpeg: {
    quality: number; // 0-1
  };
  png: {
    colors: number; // 2-256
    dithering: number; // 0-1
  };
  gif: {
    colors: number; // 2-256
    dithering: boolean; // boolean
  };
  avif: {
    quality: number; // 1 - 100
    speed: number; //  1 - 10
  };
}

export interface ProcessOutput {
  width: number;
  height: number;
  blob: Blob;
  src: string;
}

export interface Dimension {
  width: number;
  height: number;
}

export abstract class ImageBase {
  constructor(
    public info: ImageInfo,
    public option: CompressOption,
  ) {}

  abstract compress(): Promise<ProcessOutput>;

  /**
   * Get output image dimension, based on resize param
   * @returns Dimension
   */
  getOutputDimension(): Dimension {
    const { width, height } = this.option.resize;
    if (!width && !height) {
      return {
        width: this.info.width,
        height: this.info.height,
      };
    }

    if (!width && height) {
      const rate = height / this.info.height;
      const width = rate * this.info.width;
      return {
        width: Math.ceil(width),
        height: Math.ceil(height),
      };
    }

    if (width && !height) {
      const rate = width / this.info.width;
      const height = rate * this.info.height;
      return {
        width: Math.ceil(width),
        height: Math.ceil(height),
      };
    }

    return {
      width: Math.ceil(width!),
      height: Math.ceil(height!),
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
      src: URL.createObjectURL(this.info.blob),
    };
  }

  /**
   * Get preview image size via option
   * @returns Dimension
   */
  getPreviewDimension(): Dimension {
    const maxSize = this.option.preview.maxSize;
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
    const blob = await this.createBlob(width, height);
    return {
      width,
      height,
      blob,
      src: URL.createObjectURL(blob),
    };
  }

  async createCanvas(
    width: number,
    height: number,
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
      height,
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
