import { ImageHandler } from "./ImageHandler";

export class JpegImage extends ImageHandler {
  async compress() {
    const dimension = this.calculateScale();
    const blob = await this.createBlobFromCanvas(
      dimension.width,
      dimension.height,
      this.info.option.quality / 100
    );
    this.info.output = {
      ...dimension,
      blob,
    };
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
      ph = rate * this.info.origin.height;
    } else {
      const rate = ImageHandler.MaxPreviewSize / this.info.origin.height;
      ph = ImageHandler.MaxPreviewSize;
      pw = rate * this.info.origin.width;
    }

    this.info.preview = {
      width: pw,
      height: ph,
      blob: await this.createBlobFromCanvas(pw, ph),
    };
  }
}
