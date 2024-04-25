import { Flex } from "antd";
import style from "./index.module.scss";
import { useEffect, useRef } from "react";
import classNames from "classnames";
import { FileAddOutlined } from "@ant-design/icons";
import { observer } from "mobx-react-lite";
import { gstate } from "@/global";
import { ImageInput } from "../ImageInput";
import { state } from "./state";

function useDragAndDrop(dragRef: React.RefObject<HTMLDivElement>) {
  useEffect(() => {
    const dragLeave = () => {
      state.dragActive = false;
    };
    const dragOver = (event: DragEvent) => {
      event.preventDefault();
      state.dragActive = true;
    };
    const drop = (event: DragEvent) => {
      event.preventDefault();
      state.dragActive = false;
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

  return (
    <Flex
      justify="center"
      align="center"
      className={classNames(style.container, state.dragActive && style.active)}
    >
      <Flex vertical align="center" className={style.inner}>
        <FileAddOutlined />
        <div>{gstate.locale?.uploadCard.title}</div>
        <div>
          {gstate.locale?.uploadCard.subTitle[0]}&nbsp;
          <span>
            {gstate.supportedTypes.map((item) => item.toUpperCase()).join("/")}
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
