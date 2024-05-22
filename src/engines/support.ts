import { Mimes } from "@/mimes";

const MimeAvif = "image/avif";

/**
 * 检测Avif图片格式是否被支持
 * @returns
 */
export async function isAvifSupport() {
  const canvas = new OffscreenCanvas(1, 1);
  canvas.getContext("2d");
  try {
    await canvas.convertToBlob({ type: MimeAvif });
    return true;
  } catch (error) {
    return false;
  }
}

export async function avifCheck() {
  if (await isAvifSupport()) {
    Mimes.avif = MimeAvif;
  }
}
