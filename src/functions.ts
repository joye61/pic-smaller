import { filesize } from "filesize";
import { Mimes } from "./mimes";
import type { ImageItem } from "./states/home";
import type { CompressOption } from "./engines/ImageBase";

/**
 * Normalize pathname
 * @param pathname
 * @param base
 * @returns
 */
export function normalize(pathname: string, base = import.meta.env.BASE_URL) {
  // Ensure starts with '/'
  pathname = "/" + pathname.replace(/^\/*/, "");
  base = "/" + base.replace(/^\/*/, "");
  if (pathname.startsWith(base)) {
    pathname = pathname.substring(base.length);
    return pathname.replace(/^\/*|\/*$/g, "");
  }
  return "error404";
}

/**
 * Globaly uniqid in browser session lifecycle
 */
let __UniqIdIndex = 0;
export function uniqId() {
  __UniqIdIndex += 1;
  return __UniqIdIndex;
}

/**
 * Beautify byte size
 * @param num byte size
 * @returns
 */
export function formatSize(num: number) {
  const result = filesize(num, { standard: "jedec", output: "array" });
  return result[0] + " " + result[1];
}

/**
 * Create a download dialog from browser
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
 * If names Set already has name, add suffix '(1)' for the name
 * which will newly pushed to names set
 *
 * @param names will checked names Set
 * @param name will pushed to names
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
 * Preload image by src
 * @param src
 */
export async function preloadImage(src: string) {
  return new Promise<void>((resolve) => {
    const img = new Image();
    img.src = src;
    img.onload = () => resolve();
    img.onerror = () => resolve();
  });
}

/**
 * Get file list from FileSystemEntry
 * @param entry
 * @returns
 */
export async function getFilesFromEntry(
  entry: FileSystemEntry,
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
        () => [],
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
    for (const item of list) {
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
  handle: FileSystemHandle,
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

/**
 * Get file suffix by lowercase
 * @param fileName
 */
export function splitFileName(fileName: string) {
  const index = fileName.lastIndexOf(".");
  const name = fileName.substring(0, index);
  const suffix = fileName.substring(index + 1).toLowerCase();
  return { name, suffix };
}

/**
 * Get final file name if there exists a type convert
 * @param item
 * @param option
 * @returns
 */
export function getOutputFileName(item: ImageItem, option: CompressOption) {
  if (item.blob.type === item.compress?.blob.type) {
    return item.name;
  }

  const { name, suffix } = splitFileName(item.name);
  let resultSuffix = suffix;
  for (const key in Mimes) {
    if (item.compress!.blob.type === Mimes[key]) {
      resultSuffix = key;
      break;
    }
  }

  if (["jpg", "jpeg"].includes(resultSuffix)) {
    resultSuffix = option.format.target?.toLowerCase() || resultSuffix;
  }

  return name + "." + resultSuffix;
}
