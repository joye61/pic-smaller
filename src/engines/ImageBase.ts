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
    method?:
      | "fitWidth"
      | "fitHeight"
      | "setShort"
      | "setLong"
      | "setCropRatio"
      | "setCropSize";
    width?: number;
    height?: number;
    short?: number;
    long?: number;
    cropWidthRatio?: number;
    cropHeightRatio?: number;
    cropWidthSize?: number;
    cropHeightSize?: number;
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
  x: number;
  y: number;
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
    const {
      method,
      width,
      height,
      short,
      long,
      cropWidthRatio,
      cropHeightRatio,
      cropWidthSize,
      cropHeightSize,
    } = this.option.resize;

    const originDimension = {
      x: 0,
      y: 0,
      width: this.info.width,
      height: this.info.height,
    };

    if (method === "fitWidth") {
      if (!width) {
        return originDimension;
      }
      const rate = width / this.info.width;
      const newHeight = rate * this.info.height;
      return {
        x: 0,
        y: 0,
        width: Math.ceil(width),
        height: Math.ceil(newHeight),
      };
    }

    if (method === "fitHeight") {
      if (!height) {
        return originDimension;
      }
      const rate = height / this.info.height;
      const newWidth = rate * this.info.width;
      return {
        x: 0,
        y: 0,
        width: Math.ceil(newWidth),
        height: Math.ceil(height),
      };
    }

    if (method === "setShort") {
      if (!short) {
        return originDimension;
      }

      let newWidth: number;
      let newHeight: number;
      if (this.info.width <= this.info.height) {
        newWidth = short;
        const rate = newWidth / this.info.width;
        newHeight = rate * this.info.height;
      } else {
        newHeight = short;
        const rate = newHeight / this.info.height;
        newWidth = rate * this.info.width;
      }
      return {
        x: 0,
        y: 0,
        width: Math.ceil(newWidth),
        height: Math.ceil(newHeight),
      };
    }

    if (method === "setLong") {
      if (!long) {
        return originDimension;
      }

      let newWidth: number;
      let newHeight: number;
      if (this.info.width >= this.info.height) {
        newWidth = long;
        const rate = newWidth / this.info.width;
        newHeight = rate * this.info.height;
      } else {
        newHeight = long;
        const rate = newHeight / this.info.height;
        newWidth = rate * this.info.width;
      }
      return {
        x: 0,
        y: 0,
        width: Math.ceil(newWidth),
        height: Math.ceil(newHeight),
      };
    }

    // Crop via ratio
    if (method === "setCropRatio") {
      if (!cropWidthRatio || !cropHeightRatio) {
        return originDimension;
      }

      let x = 0;
      let y = 0;
      let newWidth = 0;
      let newHeight = 0;

      if (
        cropWidthRatio / cropHeightRatio >=
        this.info.width / this.info.height
      ) {
        x = 0;
        newWidth = this.info.width;
        newHeight = (this.info.width * cropHeightRatio) / cropWidthRatio;
        y = (this.info.height - newHeight) / 2;
      } else {
        y = 0;
        newHeight = this.info.height;
        newWidth = (this.info.height * cropWidthRatio) / cropHeightRatio;
        x = (this.info.width - newWidth) / 2;
      }

      return {
        x: Math.ceil(x),
        y: Math.ceil(y),
        width: Math.ceil(newWidth),
        height: Math.ceil(newHeight),
      };
    }

    // Crop via special width and height
    if (method === "setCropSize") {
      if (!cropWidthSize || !cropHeightSize) {
        return originDimension;
      }

      let newWidth = cropWidthSize;
      let newHeight = cropHeightSize;

      if (cropWidthSize >= this.info.width) {
        newWidth = this.info.width;
      }

      if (cropHeightSize >= this.info.height) {
        newHeight = this.info.height;
      }

      const x = (this.info.width - newWidth) / 2;
      const y = (this.info.height - newHeight) / 2;

      return {
        x: Math.ceil(x),
        y: Math.ceil(y),
        width: Math.ceil(newWidth),
        height: Math.ceil(newHeight),
      };
    }

    return originDimension;
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
        x: 0,
        y: 0,
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

    return {
      x: 0,
      y: 0,
      width: Math.ceil(width),
      height: Math.ceil(height),
    };
  }

  /**
   * Get preview from native browser method
   * @returns
   */
  async preview(): Promise<ProcessOutput> {
    const { width, height, x, y } = this.getPreviewDimension();
    const blob = await this.createBlob(width, height, x, y);
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
    cropX: number = 0,
    cropY: number = 0,
  ): Promise<{
    canvas: OffscreenCanvas;
    context: OffscreenCanvasRenderingContext2D;
  }> {
    const canvas = new OffscreenCanvas(width, height);
    const context = canvas.getContext("2d")!;
    const image = await createImageBitmap(this.info.blob);

    const method = this.option.resize.method;
    if (method && ["setCropRatio", "setCropSize"].includes(method)) {
      // Crop mode only
      context?.drawImage(
        image,
        cropX,
        cropY,
        width,
        height,
        0,
        0,
        width,
        height,
      );
    } else {
      // Resize mode only
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
    }

    image.close();
    return { canvas, context };
  }

  /**
   * create OffscreenCanvas from Blob
   * @param width
   * @param height
   * @param quality
   * @param cropX
   * @param cropY
   * @returns
   */
  async createBlob(
    width: number,
    height: number,
    quality = 0.6,
    cropX = 0,
    cropY = 0,
  ) {
    const { canvas } = await this.createCanvas(width, height, cropX, cropY);
    const opiton: ImageEncodeOptions = {
      type: this.info.blob.type,
      quality,
    };
    return canvas.convertToBlob(opiton);
  }
}
