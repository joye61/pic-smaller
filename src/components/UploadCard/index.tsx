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
        // https://stackoverflow.com/questions/55658851/javascript-datatransfer-items-not-persisting-through-async-calls
        const list: Array<Promise<void>> = [];
        for (const item of event.dataTransfer.items) {
          if (typeof item.getAsFileSystemHandle === "function") {
            list.push(
              (async () => {
                const handle = await item.getAsFileSystemHandle!();
                const result = await getFilesFromHandle(handle);
                files.push(...result);
              })(),
            );
            continue;
          }
          if (typeof item.webkitGetAsEntry === "function") {
            list.push(
              (async () => {
                const entry = await item.webkitGetAsEntry();
                if (entry) {
                  const result = await getFilesFromEntry(entry);
                  files.push(...result);
                }
              })(),
            );
          }
        }
        await Promise.all(list);
      } else if (event.dataTransfer?.files) {
        const list = event.dataTransfer?.files;
        for (let index = 0; index < list.length; index++) {
          const file = list.item(index);
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
        <svg viewBox="0 0 1024 1024">
          <path d="M128 256l0 640 896 0L1024 256 128 256zM960 789.344 832 576l-145.056 120.896L576 512 192 832 192 320l768 0L960 789.344zM256 480A3 3 7560 1 0 448 480 3 3 7560 1 0 256 480zM896 128 0 128 0 768 64 768 64 192 896 192z" />
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
