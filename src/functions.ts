import { filesize } from "filesize";

/**
 * 格式化路径
 * @param pathname
 * @returns
 */
export function normalize(pathname: string) {
  return pathname.replace(/^\/*|\/*$/g, "");
}

// 通过自增生成全局唯一的数字ID
let __UnidIdIndex = 0;
export function uniqId() {
  __UnidIdIndex += 1;
  return __UnidIdIndex;
}

/**
 * 格式化字节数据
 * @param num
 * @returns
 */
export function formatSize(num: number) {
  const result = filesize(num, { standard: "jedec", output: "array"});
  return result[0] + " " + result[1];
}
