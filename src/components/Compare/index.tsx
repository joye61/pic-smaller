import { useEffect, useRef, useState } from "react";
import style from "./index.module.scss";
import { Button, Flex, Popover, Space, Tag, theme } from "antd";
import { CloseOutlined, QuestionCircleOutlined } from "@ant-design/icons";
import { createPortal } from "react-dom";
import { ImageItem, homeState } from "@/states/home";
import { observer } from "mobx-react-lite";
import classNames from "classnames";
import { gstate } from "@/global";
import { formatSize } from "@/functions";
import { pick } from "lodash";

interface CompareData {
  base: "x" | "y";
  dividerWidth: number;
  containerWidth: number;
  containerHeight: number;
  imageWidth: number;
  imageHeight: number;
  oldSrc?: string;
  newSrc?: string;
  x: number;
  scale: number;
}

export interface CompareState {
  x: number;
  scale: number;
  ready: boolean;
  moving: boolean;
  status: "show" | "hide";
}

export const Compare = observer(() => {
  const info = homeState.list.get(homeState.compareId!) as Required<ImageItem>;
  const { token } = theme.useToken();
  const containerRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const dataRef = useRef<CompareData>({
    base: "x",
    dividerWidth: 2,
    containerWidth: 0,
    containerHeight: 0,
    imageWidth: 0,
    imageHeight: 0,
    oldSrc: undefined,
    newSrc: undefined,
    x: 0,
    scale: 1,
  });
  const [state, setState] = useState<CompareState>({
    x: 0,
    scale: 1,
    ready: false,
    moving: false,
    status: "hide",
  });

  const updateRef = useRef<((newState: Partial<CompareState>) => void) | null>(
    null
  );
  useEffect(() => {
    updateRef.current = (newState) => {
      dataRef.current = {
        ...dataRef.current,
        ...pick(newState, ["x", "scale"]),
      };
      setState({
        ...state,
        ...newState,
      });
    };
  }, [state]);

  // 初始化
  useEffect(() => {
    if (!containerRef.current) {
      return;
    }
    const rect = containerRef.current.getBoundingClientRect();
    let imageWidth = 0;
    let imageHeight = 0;
    let base: CompareData["base"];
    if (info.width / info.height > rect.width / rect.height) {
      imageWidth = rect.width * 0.8;
      imageHeight = (imageWidth * info.height) / info.width;
      base = "x";
    } else {
      imageHeight = rect.height * 0.8;
      imageWidth = (imageHeight * info.width) / info.height;
      base = "y";
    }

    let oldSrc = URL.createObjectURL(info.blob);
    let newSrc = URL.createObjectURL(info.compress.blob);
    const scale = 1;
    const x = rect.width / 2;
    dataRef.current = {
      ...dataRef.current,
      base,
      containerWidth: rect.width,
      containerHeight: rect.height,
      imageWidth,
      imageHeight,
      oldSrc,
      newSrc,
      scale,
      x,
    };
    updateRef.current?.({ x, scale, ready: true, status: "show" });

    return () => {
      URL.revokeObjectURL(oldSrc);
      URL.revokeObjectURL(newSrc);
    };
  }, []);

  useEffect(() => {
    if (!state.ready) {
      return;
    }

    gstate.loading = false;

    const doc = document.documentElement;
    const bar = barRef.current!;

    let isControl = false;
    let cursorX = 0;

    const mousedown = (event: MouseEvent) => {
      isControl = true;
      cursorX = event.clientX;
      updateRef.current?.({ moving: true });
    };
    const mouseup = () => {
      isControl = false;
      cursorX = 0;
      updateRef.current?.({ moving: false });
    };
    const mousemove = (event: MouseEvent) => {
      if (isControl) {
        const data = dataRef.current;
        let x = data.x + event.clientX - cursorX;
        const min = (data.containerWidth - data.imageWidth) / 2;
        const max = (data.containerWidth + data.imageWidth) / 2;
        if (x < min) {
          x = min;
        }
        if (x > max) {
          x = max;
        }
        cursorX = event.clientX;
        updateRef.current?.({ x });
      }
    };

    bar.addEventListener("mousedown", mousedown);
    doc.addEventListener("mousemove", mousemove);
    doc.addEventListener("mouseup", mouseup);

    return () => {
      bar.removeEventListener("mousedown", mousedown);
      doc.removeEventListener("mousemove", mousemove);
      doc.removeEventListener("mouseup", mouseup);
    };
  }, [state.ready]);

  const data = dataRef.current;
  const realImageWidth = data.imageWidth * data.scale;
  const realImageHeight = data.imageHeight * data.scale;

  const leftStyle: React.CSSProperties = {
    width: `${data.x}px`,
  };
  const rightStyle: React.CSSProperties = {
    width: `${data.containerWidth - data.x}px`,
  };
  const barStyle: React.CSSProperties = {
    width: `${data.dividerWidth}px`,
    left: `${data.x - data.dividerWidth / 2}px`,
  };
  const leftImageStyle: React.CSSProperties = {
    width: realImageWidth,
    height: realImageHeight,
    left: (data.containerWidth - realImageWidth) / 2 + "px",
  };
  const rightImageStyle: React.CSSProperties = {
    width: realImageWidth,
    height: realImageHeight,
    right: (data.containerWidth - realImageWidth) / 2 + "px",
  };

  let content: React.ReactNode = null;
  if (state.ready) {
    const help = <div className={style.help}>{gstate.locale?.previewHelp}</div>;
    content = (
      <>
        <div style={leftStyle}>
          <img src={data.oldSrc} style={leftImageStyle} />
        </div>
        <div style={rightStyle}>
          <img src={data.newSrc} style={rightImageStyle} />
        </div>
        <div style={barStyle}>
          <Flex align="center" justify="center" ref={barRef}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
              <path d="M6.45,17.45L1,12L6.45,6.55L7.86,7.96L4.83,11H19.17L16.14,7.96L17.55,6.55L23,12L17.55,17.45L16.14,16.04L19.17,13H4.83L7.86,16.04L6.45,17.45Z" />
            </svg>
          </Flex>
        </div>
        <Space className={style.action}>
          <Popover content={help} placement="bottomRight">
            <Button icon={<QuestionCircleOutlined />} />
          </Popover>
          <Button
            icon={<CloseOutlined />}
            onClick={() => {
              updateRef.current?.({ status: "hide" });
            }}
          />
        </Space>

        <Tag className={style.before}>
          {info.width}*{info.height}&nbsp;&nbsp;{formatSize(info.blob.size)}
        </Tag>
        <Tag
          className={style.after}
          color={
            info.blob.size > info.compress.blob.size
              ? token.colorSuccess
              : token.colorError
          }
        >
          {info.compress.width}*{info.compress.height}&nbsp;&nbsp;
          {formatSize(info.compress.blob.size)}
        </Tag>
      </>
    );
  }

  let statusClass: string | undefined = undefined;
  if (state.ready && state.status === "show") {
    statusClass = style.show;
  }
  if (state.ready && state.status === "hide") {
    statusClass = style.hide;
  }

  return createPortal(
    <div
      className={classNames(
        style.container,
        state.ready && style.withBg,
        state.moving && style.moving,
        statusClass
      )}
      ref={containerRef}
      onAnimationEnd={(event) => {
        if (event.animationName === style.BoxHide) {
          homeState.compareId = null;
        }
      }}
    >
      {content}
    </div>,
    document.body
  );
});
