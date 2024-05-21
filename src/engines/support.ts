/**
 * 检测Avif图片格式是否被支持
 * @returns
 */
export async function isAvifSupport() {
  const canvas = new OffscreenCanvas(1, 1);
  canvas.getContext("2d");
  try {
    await canvas.convertToBlob({ type: "image/avif" });
    return true;
  } catch (error) {
    return false;
  }
}
