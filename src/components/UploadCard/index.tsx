import { Flex, Typography, theme } from "antd";
import style from "./index.module.scss";
import { useEffect, useRef } from "react";
import classNames from "classnames";
import { observer } from "mobx-react-lite";
import { gstate } from "@/global";
import { ImageInput } from "../ImageInput";
import { state } from "./state";
import { toJS } from "mobx";
import { FileListLike, createImageList } from "@/libs/transform";


let max = 0
let fileBuffer: FileSystemEntry[] = []
let now = 0;
/**
 * 递归地从文件系统条目中获取文件放入fileBuffer中
 *
 * @param entry 文件系统条目
 * @param dirCall 可选参数，处理目录的回调函数
 */
function getFileFromEntryRecursively(entry: FileSystemEntry, dirCall?: any) {
  if ((entry as FileSystemFileEntry).isFile) {
    fileBuffer.push(entry)
  } else if ((entry as FileSystemDirectoryEntry).isDirectory) {
    max++;
    // 这里可以添加处理目录的逻辑，比如递归遍历目录中的文件
    (entry as FileSystemDirectoryEntry).createReader().readEntries((entries) => {
      now++;

      entries.map((e) => getFileFromEntryRecursively(e, dirCall));
      if (now === max) {
        dirCall && dirCall()
      }
    })
  }
}
/**
 * 从文件缓冲区中获取文件
 *
 * @param call 遍历每个文件时的回调函数，可选
 * @param endCall 所有文件遍历完成后的回调函数，可选
 */
function getFileFromFileBuffer(call?: any, endCall?: any) {
  let maxFiles = fileBuffer.length
  let nowFiles = 0
  for (let i = 0; i < maxFiles; i++) {
    (fileBuffer[i] as FileSystemFileEntry)?.file((f) => {
      nowFiles++
      call && call(f)
      if (nowFiles === maxFiles) {

        endCall && endCall()
      }
    })
  }
}
/**
 * 使用拖拽功能
 *
 * @param dragRef 拖拽区域的引用对象
 */
function useDragAndDrop(dragRef: React.RefObject<HTMLDivElement>) {
  useEffect(() => {
    const dragLeave = () => {
      state.dragActive = false;
    };
    const dragOver = (event: DragEvent) => {
      event.preventDefault();
      state.dragActive = true;
    };
    const drop = async (event: DragEvent) => {
      event.preventDefault();
      fileBuffer = []
      now = 0;
      max = 0;
      state.dragActive = false;
      let files: FileListLike = [];

      const types = Object.values(toJS(gstate.mimes));
      if (event.dataTransfer?.items) {
        const list: File[] = [];
        const entrys = []
        for (let i = 0; i < event.dataTransfer.items.length; i++) {
          const item = event.dataTransfer.items[i];
          if (item.webkitGetAsEntry) {
            let entry = item.webkitGetAsEntry()
            entrys.push(entry)
            getFileFromEntryRecursively(entry as FileSystemEntry, () => {
              getFileFromFileBuffer((f: File) => {
                if (types.includes(f.type)) {
                  list.push(f as File)
                }
              }, async () => {
                files = list;
                if (files.length) {
                  await createImageList(files);
                }
              })
            })
          } else {
            if (item.kind === "file" && types.includes(item.type)) {
              const file = item.getAsFile();
              if (file) {
                list.push(file);
              }
            }
          }
        }
        if (max === 0) {
          getFileFromFileBuffer((f: File) => {
            if (types.includes(f.type)) {
              list.push(f as File)
            }
          }, async () => {
            files = list;
            if (files.length) {
              await createImageList(files);
            }
          })
        }
        files = list;
        if (files.length) {
          await createImageList(files);
        }
      } else if (event.dataTransfer?.files) {
        files = event.dataTransfer?.files;
        if (files.length) {
          await createImageList(files);
        }
      }

    };

    const target = dragRef.current!;
    target.addEventListener("dragover", dragOver);
    target.addEventListener("dragleave", dragLeave);
    target.addEventListener("drop", drop);

    return () => {
      target.removeEventListener("dragover", dragOver);
      target.removeEventListener("dragleave", dragLeave);
      target.removeEventListener("drop", drop);
    };
  }, []);
}

export const UploadCard = observer(() => {
  const fileRef = useRef<HTMLInputElement>(null);
  const dragRef = useRef<HTMLDivElement>(null);

  useDragAndDrop(dragRef);

  const { token } = theme.useToken();

  return (
    <Flex
      justify="center"
      align="center"
      className={classNames(style.container, state.dragActive && style.active)}
      style={{ borderRadius: token.borderRadiusLG }}
    >
      <Flex vertical align="center" className={style.inner}>
        <svg viewBox="0 0 24 24">
          <path d="M18 15V18H15V20H18V23H20V20H23V18H20V15H18M13.3 21H5C3.9 21 3 20.1 3 19V5C3 3.9 3.9 3 5 3H19C20.1 3 21 3.9 21 5V13.3C20.4 13.1 19.7 13 19 13C17.9 13 16.8 13.3 15.9 13.9L14.5 12L11 16.5L8.5 13.5L5 18H13.1C13 18.3 13 18.7 13 19C13 19.7 13.1 20.4 13.3 21Z" />
        </svg>
        <Typography.Text>{gstate.locale?.uploadCard.title}</Typography.Text>
        <div>
          {gstate.locale?.uploadCard.subTitle[0]}&nbsp;
          <span>
            {Object.keys(toJS(gstate.mimes))
              .map((item) => item.toUpperCase())
              .join("/")}
          </span>
          &nbsp;{gstate.locale?.uploadCard.subTitle[1]}
        </div>
      </Flex>
      <ImageInput ref={fileRef} />
      <div
        className={style.mask}
        ref={dragRef}
        onClick={() => {
          fileRef.current?.click();
        }}
      />
    </Flex>
  );
});
