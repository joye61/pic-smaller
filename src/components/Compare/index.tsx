import { useEffect, useRef, useState } from "react";
import style from "./index.module.scss";
import { Button, Flex, Popover, Space } from "antd";
import { CloseOutlined, QuestionCircleOutlined } from "@ant-design/icons";
import { createPortal } from "react-dom";
import { ImageItem, homeState } from "@/states/home";
import { observer } from "mobx-react-lite";
import classNames from "classnames";
import { gstate } from "@/global";

interface CompareData {
  oldSrc?: string;
  newSrc?: string;
}

export interface CompareState {
  x: number;
  xrate: number;
  scale: number;
  ready: boolean;
  moving: boolean;
  status: "show" | "hide";
  dividerWidth: number;
  imageWidth: number;
  imageHeight: number;
  containerWidth: number;
  containerHeight: number;
}

export const Compare = observer(() => {
  const info = homeState.list.get(homeState.compareId!) as Required<ImageItem>;
  const containerRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const dataRef = useRef<CompareData>({
    oldSrc: undefined,
    newSrc: undefined,
  });
  const [state, setState] = useState<CompareState>({
    x: 0,
    xrate: 0.5,
    scale: 0.8,
    ready: false,
    moving: false,
    status: "hide",
    dividerWidth: 2,
    containerWidth: 0,
    containerHeight: 0,
    imageWidth: 0,
    imageHeight: 0,
  });

  const update = (newState: Partial<CompareState>) => {
    setState({
      ...state,
      ...newState,
    });
  };
  const getState = () => {
    return state;
  };

  const updateRef = useRef<(newState: Partial<CompareState>) => void>(update);
  const stateRef = useRef<() => CompareState>(getState);
  useEffect(() => {
    updateRef.current = update;
    stateRef.current = getState;
  }, [update, getState]);

  // Initialize
  useEffect(() => {
    let oldSrc = URL.createObjectURL(info.blob);
    let newSrc = URL.createObjectURL(info.compress.blob);
    dataRef.current = {
      oldSrc,
      newSrc,
    };

    updateRef.current({
      ready: true,
      status: "show",
    });

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

    const resize = () => {
      const states = stateRef.current();
      const rect = containerRef.current!.getBoundingClientRect();
      let imageWidth: number;
      let imageHeight: number;
      if (info.width / info.height > rect.width / rect.height) {
        imageWidth = rect.width * states.scale;
        imageHeight = (imageWidth * info.height) / info.width;
      } else {
        imageHeight = rect.height * states.scale;
        imageWidth = (imageHeight * info.width) / info.height;
      }
      updateRef.current({
        x: rect.width * states.xrate,
        imageWidth,
        imageHeight,
        containerWidth: rect.width,
        containerHeight: rect.height,
      });
    };

    const mousedown = (event: MouseEvent) => {
      isControl = true;
      cursorX = event.clientX;
      updateRef.current({ moving: true });
    };

    const mouseup = () => {
      isControl = false;
      cursorX = 0;
      updateRef.current({ moving: false });
    };

    const mousemove = (event: MouseEvent) => {
      if (isControl) {
        const states = stateRef.current();
        let x = states.x + event.clientX - cursorX;
        const min = (states.containerWidth - states.imageWidth) / 2;
        const max = (states.containerWidth + states.imageWidth) / 2;
        if (x < min) {
          x = min;
        }
        if (x > max) {
          x = max;
        }
        cursorX = event.clientX;
        updateRef.current({ x, xrate: x / states.containerWidth });
      }
    };

    const wheel = (event: WheelEvent) => {
      const states = stateRef.current();
      let scale = -0.001 * event.deltaY + states.scale;
      if (scale > 1) {
        scale = 1;
      }
      if (scale < 0.1) {
        scale = 0.1;
      }

      let imageWidth: number;
      let imageHeight: number;
      if (
        info.width / info.height >
        states.containerWidth / states.containerHeight
      ) {
        imageWidth = states.containerWidth * scale;
        imageHeight = (imageWidth * info.height) / info.width;
      } else {
        imageHeight = states.containerHeight * scale;
        imageWidth = (imageHeight * info.width) / info.height;
      }

      let innerRate =
        (states.x - (states.containerWidth - states.imageWidth) / 2) /
        states.imageWidth;
      let x = innerRate * imageWidth + (states.containerWidth - imageWidth) / 2;

      updateRef.current({ scale, imageWidth, imageHeight, x });
    };

    window.addEventListener("resize", resize);
    window.addEventListener("wheel", wheel);
    bar.addEventListener("mousedown", mousedown);
    doc.addEventListener("mousemove", mousemove);
    doc.addEventListener("mouseup", mouseup);

    resize();

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("wheel", wheel);
      bar.removeEventListener("mousedown", mousedown);
      doc.removeEventListener("mousemove", mousemove);
      doc.removeEventListener("mouseup", mouseup);
    };
  }, [state.ready]);

  const leftStyle: React.CSSProperties = {
    width: `${state.x}px`,
  };
  const rightStyle: React.CSSProperties = {
    width: `${state.containerWidth - state.x}px`,
  };
  const barStyle: React.CSSProperties = {
    width: `${state.dividerWidth}px`,
    left: `${state.x - state.dividerWidth / 2}px`,
    opacity: state.x === 0 ? 0 : 1,
  };
  const leftImageStyle: React.CSSProperties = {
    width: state.imageWidth,
    height: state.imageHeight,
    left: (state.containerWidth - state.imageWidth) / 2 + "px",
  };
  const rightImageStyle: React.CSSProperties = {
    width: state.imageWidth,
    height: state.imageHeight,
    right: (state.containerWidth - state.imageWidth) / 2 + "px",
  };

  let content: React.ReactNode = null;
  if (state.ready) {
    const help = <div className={style.help}>{gstate.locale?.previewHelp}</div>;
    content = (
      <>
        <div style={leftStyle}>
          <img src={dataRef.current.oldSrc} style={leftImageStyle} />
        </div>
        <div style={rightStyle}>
          <img src={dataRef.current.newSrc} style={rightImageStyle} />
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
        statusClass,
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
    document.body,
  );
});
