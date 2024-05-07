import { ImageHandler } from "./ImageHandler";

export class JpegImage extends ImageHandler {
  async compress() {
    const dimension = this.calculateScale();
    const blob = await this.createBlobFromCanvas(
      dimension.width,
      dimension.height,
      this.info.option.jpeg.quality
    );
    this.info.output = {
      ...dimension,
      blob,
    };
  }
}
