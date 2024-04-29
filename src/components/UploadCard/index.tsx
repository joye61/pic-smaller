import { Flex, theme } from "antd";
import style from "./index.module.scss";
import { useEffect, useRef } from "react";
import classNames from "classnames";
import { observer } from "mobx-react-lite";
import { gstate } from "@/global";
import { ImageInput } from "../ImageInput";
import { state } from "./state";
import { toJS } from "mobx";
import { FileListLike, createImagesFromFiles } from "@/uitls/ImageInfo";

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
      state.dragActive = false;

      let files: FileListLike = [];
      if (event.dataTransfer?.items) {
        const list: File[] = [];
        for (let i = 0; i < event.dataTransfer.items.length; i++) {
          const item = event.dataTransfer.items[i];
          const types = Object.values(toJS(gstate.mimes));
          if (item.kind === "file" && types.includes(item.type)) {
            const file = item.getAsFile();
            if (file) {
              list.push(file);
            }
          }
        }
        files = list;
      } else if (event.dataTransfer?.files) {
        files = event.dataTransfer?.files;
      }

      if (files.length) {
        await createImagesFromFiles(files);
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
        <svg viewBox="0 0 426.66668701171875 426.66668701171875">
          <path d="M320,256L320,320L256,320L256,362.667L320,362.667L320,426.667L362.667,426.667L362.667,362.667L426.667,362.667L426.667,320L362.667,320L362.667,256L320,256ZM327.5,232.533Q295,232.533,275.2,232.533L245.333,192L170.667,288L117.333,224L42.6667,320L228,320Q228,331.5,228,350Q228,371,228,384.5L42.6667,384Q30.9333,384,0,384Q0,353.067,0,341.333L0,42.6667Q0,30.9333,0,0Q30.9333,0,42.6667,0L341.333,0Q353.067,0,384,0Q384,30.9333,384,42.6667L384,232.533L327.5,232.533Z" />
        </svg>
        <div>{gstate.locale?.uploadCard.title}</div>
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
