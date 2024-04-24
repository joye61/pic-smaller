/**
 * 格式化路径
 * @param pathname
 * @returns
 */
export function normalize(pathname: string) {
  return pathname.replace(/^\/*|\/*$/g, "");
}