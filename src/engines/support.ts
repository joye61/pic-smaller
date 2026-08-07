import { Mimes } from "@/mimes";

const MimeAvif = "image/avif";

/**
 * 检测Avif图片格式是否被支持
 * @returns
 */
async function isAvifSupport() {
  const canvas = new OffscreenCanvas(1, 1);
  canvas.getContext("2d");
  try {
    await canvas.convertToBlob({ type: MimeAvif });
    return true;
  } catch (error) {
    return false;
  }
}

/**
 * Probe browser AVIF support and enable/disable Mimes.avif accordingly.
 * When unsupported, remove the avif key so UI options don't mislead.
 */
export async function avifCheck() {
  if (await isAvifSupport()) {
    Mimes.avif = MimeAvif;
  } else {
    delete Mimes.avif;
  }
}
