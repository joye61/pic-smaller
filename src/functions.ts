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
  const result = filesize(num, { standard: "jedec", output: "array" });
  return result[0] + " " + result[1];
}

/**
 * 弹出一个下载框
 * @param name
 * @param blob
 */
export function createDownload(name: string, blob: Blob) {
  const anchor = document.createElement("a");
  anchor.href = URL.createObjectURL(blob);
  anchor.download = name;
  anchor.click();
  anchor.remove();
}

/**
 * 判断names中是否已经存在name，如果存在，则创建一个新的name
 * @param names 用来检测的names
 * @param name 待判断的name
 */
export function getUniqNameOnNames(names: Set<string>, name: string): string {
  const getName = (checkName: string): string => {
    if (names.has(checkName)) {
      const nameParts = checkName.split(".");
      const extension = nameParts.pop();
      const newName = nameParts.join("") + "(1)." + extension;
      return getName(newName);
    } else {
      return checkName;
    }
  };
  return getName(name);
}

/**
 * Wait some time 
 * @param millisecond 
 * @returns 
 */
export async function wait(millisecond: number) {
  return new Promise<void>((resolve) => {
    window.setTimeout(resolve, millisecond);
  });
}
