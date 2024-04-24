import { Flex } from "antd";
import style from "./index.module.scss";
import { useEffect, useRef, useState } from "react";
import classNames from "classnames";

export function UploadCard() {
  const fileRef = useRef<HTMLInputElement>(null);
  const dndRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState<boolean>(false);

  useEffect(() => {
    const dragLeave = () => {
      setActive(false);
    };
    const dragOver = (event: DragEvent) => {
      event.preventDefault();
      setActive(true);
    };
    const drop = (event: DragEvent) => {
      event.preventDefault();
      setActive(false);
    };

    const target = dndRef.current!;
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
      className={classNames(style.container, active && style.active)}
    >
      <Flex vertical align="center" className={style.inner}>
        <svg viewBox="0 0 24 24">
          <path
            d="M13 3.00231C12.5299 3 12.0307 3 11.5 3C7.02166 3 4.78249 3 3.39124 4.39124C2 5.78249 2 8.02166 2 12.5C2 16.9783 2 19.2175 3.39124 20.6088C4.78249 22 7.02166 22 11.5 22C15.9783 22 18.2175 22 19.6088 20.6088C20.9472 19.2703 20.998 17.147 20.9999 13"
            stroke="#141B34"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <path
            d="M2 14.1354C2.61902 14.0455 3.24484 14.0011 3.87171 14.0027C6.52365 13.9466 9.11064 14.7729 11.1711 16.3342C13.082 17.7821 14.4247 19.7749 15 22"
            stroke="#141B34"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <path
            d="M21 16.8962C19.8246 16.3009 18.6088 15.9988 17.3862 16.0001C15.5345 15.9928 13.7015 16.6733 12 18"
            stroke="#141B34"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <path
            d="M17 4.5C17.4915 3.9943 18.7998 2 19.5 2M22 4.5C21.5085 3.9943 20.2002 2 19.5 2M19.5 2V10"
            stroke="#141B34"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <div>Drag and drop files or click to upload</div>
        <div>Support <span>JPG/JPEG/PNG/WEBP</span> format</div>
      </Flex>
      <input type="file" multiple ref={fileRef} accept=".jpg,.jpeg,.png,.webp"/>
      <div
        className={style.mask}
        ref={dndRef}
        onClick={() => {
          fileRef.current?.click();
        }}
      />
    </Flex>
  );
}
