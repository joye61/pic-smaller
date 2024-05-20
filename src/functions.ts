import { filesize } from "filesize";
import { Mimes } from "./global";

/**
 * 格式化路径
 * @param pathname
 * @returns
 */
export function normalize(pathname: string) {
  const base = import.meta.env.BASE_URL;
  if (pathname.startsWith(base)) {
    pathname = pathname.substring(base.length);
  }
  return pathname.replace(/^\/*|\/*$/g, "");
}

// 通过自增生成全局唯一的数字ID
let __UniqIdIndex = 0;
export function uniqId() {
  __UniqIdIndex += 1;
  return __UniqIdIndex;
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

/**
 * Get file list from FileSystemEntry
 * @param entry
 * @returns
 */
export async function getFilesFromEntry(
  entry: FileSystemEntry
): Promise<Array<File>> {
  // If entry is a file
  if (entry.isFile) {
    const fileEntry = entry as FileSystemFileEntry;
    return new Promise<Array<File>>((resolve) => {
      fileEntry.file(
        (result) => {
          const types = Object.values(Mimes);
          resolve(types.includes(result.type) ? [result] : []);
        },
        () => []
      );
    });
  }

  // If entry is a directory
  if (entry.isDirectory) {
    const dirEntry = entry as FileSystemDirectoryEntry;
    const list = await new Promise<Array<FileSystemEntry>>((resolve) => {
      dirEntry.createReader().readEntries(resolve, () => []);
    });
    const result: Array<File> = [];
    for (let item of list) {
      const subList = await getFilesFromEntry(item);
      result.push(...subList);
    }
    return result;
  }

  // Otherwise
  return [];
}

/**
 * Get file list from FileSystemHandle
 * @param entry
 * @returns
 */
export async function getFilesFromHandle(
  handle: FileSystemHandle
): Promise<Array<File>> {
  // If handle is a file
  if (handle.kind === "file") {
    const fileHandle = handle as FileSystemFileHandle;
    const file = await fileHandle.getFile();
    const types = Object.values(Mimes);
    return types.includes(file.type) ? [file] : [];
  }

  // If handle is a directory
  if (handle.kind === "directory") {
    const result: Array<File> = [];
    for await (const item of (handle as any).values()) {
      const subList = await getFilesFromHandle(item);
      result.push(...subList);
    }
    return result;
  }

  return [];
}
