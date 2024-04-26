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
