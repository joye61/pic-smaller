import { Flex, Typography, theme } from "antd";
import style from "./index.module.scss";
import { useEffect, useRef } from "react";
import classNames from "classnames";
import { observer } from "mobx-react-lite";
import { gstate } from "@/global";
import { ImageInput } from "../ImageInput";
import { state } from "./state";
import { createImageList } from "@/engines/transform";
import { getFilesFromEntry, getFilesFromHandle } from "@/functions";
import { sprintf } from "sprintf-js";
import { Mimes } from "@/mimes";

export const UploadCard = observer(() => {
  const { token } = theme.useToken();
  const fileRef = useRef<HTMLInputElement>(null);
  const dragRef = useRef<HTMLDivElement>(null);

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
      state.dragActive = false;
      const files: Array<File> = [];
      if (event.dataTransfer?.items) {
        for (let i = 0; i < event.dataTransfer.items.length; i++) {
          const item = event.dataTransfer.items[i];
          if (typeof item.getAsFileSystemHandle === "function") {
            const handle = await item.getAsFileSystemHandle();
            const result = await getFilesFromHandle(handle);
            files.push(...result);
            continue;
          }
          if (typeof item.webkitGetAsEntry === "function") {
            const entry = await item.webkitGetAsEntry();
            if (entry) {
              const result = await getFilesFromEntry(entry);
              files.push(...result);
              continue;
            }
          }
        }
      } else if (event.dataTransfer?.files) {
        const list = event.dataTransfer?.files;
        for (let index = 0; index < list.length; index++) {
          const file = list.item(index);
          file && files.push(file);
          if (file) {
            files.push(file);
          }
        }
      }

      files.length > 0 && createImageList(files);
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
          {sprintf(
            gstate.locale?.uploadCard.subTitle ?? "",
            Object.keys(Mimes)
              .map((item) => item.toUpperCase())
              .join("/"),
          )}
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
