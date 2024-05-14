import { useEffect, useRef, useState } from "react";
import style from "./index.module.scss";
import ReactDOM from "react-dom/client";

export interface CompareOption {
  onClose?(): void;
  width: number;
  height: number;
  old: Blob;
  new: Blob;
}

interface CompareData {
  cw: number;
  ch: number;
  iw: number;
  ih: number;
  x: number;
}

export function Compare(props: CompareOption) {
  const dividerWidth = 8;
  const containerRef = useRef<HTMLDivElement>(null);
  const [data, setData] = useState<CompareData>({
    cw: 0,
    ch: 0,
    iw: 0,
    ih: 0,
    x: 0,
  });

  // 初始化
  useEffect(() => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      let iw = 0;
      let ih = 0;
      if (props.width / props.height > rect.width / rect.height) {
        iw = rect.width * 0.8;
        ih = (iw * props.height) / props.width;
      } else {
        ih = rect.height * 0.8;
        iw = (ih * props.width) / props.height;
      }
      setData({
        cw: rect.width,
        ch: rect.height,
        iw,
        ih,
        x: rect.width / 2,
      });
    }
  }, [props.width, props.height]);

  return (
    <div className={style.container} ref={containerRef}>
      <div
        style={{
          width: `${data.x}px`,
        }}
      >
        <img />
      </div>
      <div
        style={{
          width: `${data.cw - data.x}px`,
        }}
      >
        <img />
      </div>
      <div
        style={{
          width: `${dividerWidth}px`,
          left: `${data.x - dividerWidth / 2}px`,
        }}
      />
    </div>
  );
}

export function showCompare(option: Omit<CompareOption, "onClose">) {
  let div: Element | null = document.createElement("div");
  document.body.append(div);
  const root = ReactDOM.createRoot(div);
  const close = () => {
    if (div) {
      div.remove();
      root.unmount();
      div = null;
    }
  };
  root.render(<Compare onClose={close} {...option} />);
  return close;
}
