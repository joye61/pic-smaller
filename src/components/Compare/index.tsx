import { useEffect, useRef, useState } from "react";
import style from "./index.module.scss";
import { Button, Flex } from "antd";
import { CloseOutlined } from "@ant-design/icons";
import { createPortal } from "react-dom";
import { ImageItem, homeState } from "@/states/home";
import { observer } from "mobx-react-lite";
import { Indicator } from "../Indicator";

interface CompareData {
  base: "x" | "y";
  containerWidth: number;
  containerHeight: number;
  imageWidth: number;
  imageHeight: number;
  scale: number;
  oldSrc?: string;
  newSrc?: string;
  x: number;
}

export interface CompareState {
  x: number;
  scale: number;
  ready: boolean;
}

export const Compare = observer(() => {
  const dividerWidth = 8;
  const info = homeState.list.get(homeState.compareId!) as Required<ImageItem>;
  const containerRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const dataRef = useRef<CompareData>({
    base: "x",
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
  });

  const updateRef = useRef<((newState: Partial<CompareState>) => void) | null>(
    null
  );
  useEffect(() => {
    updateRef.current = (newState) => {
      dataRef.current = {
        ...dataRef.current,
        ...newState,
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
    updateRef.current?.({ x, scale, ready: true });

    return () => {
      URL.revokeObjectURL(oldSrc);
      URL.revokeObjectURL(newSrc);
    };
  }, []);

  useEffect(() => {
    if (!state.ready) {
      return;
    }
    
    const doc = document.documentElement;
    const bar = barRef.current!;

    let isControl = false;
    let cursorX = 0;

    const mousedown = (event: MouseEvent) => {
      isControl = true;
      cursorX = event.clientX;
    };
    const mouseup = () => {
      isControl = false;
      cursorX = 0;
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
    width: `${dividerWidth}px`,
    left: `${data.x - dividerWidth / 2}px`,
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

  let content: React.ReactNode = (
    <Flex align="center" justify="center" className={style.loading}>
      <Indicator size="large" />
    </Flex>
  );
  if (data.oldSrc && data.newSrc) {
    content = (
      <>
        <div style={leftStyle}>
          <img src={data.oldSrc} style={leftImageStyle} />
        </div>
        <div style={rightStyle}>
          <img src={data.newSrc} style={rightImageStyle} />
        </div>
        <div style={barStyle} ref={barRef} />
        <Button
          icon={<CloseOutlined />}
          className={style.close}
          shape="circle"
          onClick={() => {
            homeState.compareId = null;
          }}
        />
      </>
    );
  }

  return createPortal(
    <div className={style.container} ref={containerRef}>
      {content}
    </div>,
    document.body
  );
});
