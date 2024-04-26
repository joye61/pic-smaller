import { ForwardedRef, forwardRef } from "react";
import style from "./index.module.scss";
import { observer } from "mobx-react-lite";
import { gstate } from "@/global";
import { uniqId } from "@/functions";
import { ImageInfo } from "@/uitls/ImageInfo";
import { homeState } from "@/states/home";
import { sendToCreateCompress, sendToCreatePreview } from "@/uitls/transform";

export const ImageInput = observer(
  forwardRef((_, ref: ForwardedRef<HTMLInputElement>) => {
    return (
      <input
        ref={ref}
        className={style.file}
        type="file"
        multiple
        accept={gstate.supportedTypes.map((item) => "." + item).join(",")}
        onChange={(event) => {
          if (!event.target.files?.length) {
            event.target.value = "";
            return;
          }
          const files = event.target.files;
          for (let i = 0; i < files.length; i++) {
            const file = files.item(i)!;
            const info: ImageInfo = {
              key: uniqId(),
              output: null,
              option: {
                scale: homeState.option.scale,
                toWidth: homeState.option.toWidth,
                toHeight: homeState.option.toHeight,
                quality: homeState.option.quality,
              },
              origin: {
                name: file.name,
                type: file.type,
                size: file.size,
                width: 0,
                height: 0,
                blob: file,
              },
            };
            homeState.list.push(info);
            sendToCreatePreview(info);
            sendToCreateCompress(info);
          }
          event.target.value = "";
        }}
      />
    );
  })
);
