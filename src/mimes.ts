// 支持的图片类型
export const Mimes: Record<string, string> = {
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  png: "image/png",
  webp: "image/webp",
  gif: "image/gif",
  svg: "image/svg+xml",
  avif: "image/avif",
  heic: "image/heic",
  heif: "image/heif",
};

export const OutputFormats = ["jpg", "png", "webp", "avif"] as const;

export function getImageMime(file: { name: string; type: string }) {
  const mime = file.type.toLowerCase();
  if (Object.values(Mimes).includes(mime)) return mime;
  const extension = file.name.split(".").pop()?.toLowerCase() ?? "";
  return Mimes[extension] ?? mime;
}