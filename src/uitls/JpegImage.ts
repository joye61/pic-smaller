import { ImageInfo, calculateScale, createBlob } from "./ImageInfo";

export class JpegImage {
  constructor(private info: ImageInfo) {}

  async compress() {
    const dimension = calculateScale(this.info);
    const blob = await createBlob(
      this.info.origin,
      dimension.width,
      dimension.height,
      this.info.option.quality / 100
    );
    this.info.output = {
      ...dimension,
      blob,
    };
  }
}
