import { ForwardedRef, forwardRef } from "react";
import style from "./index.module.scss";
import { observer } from "mobx-react-lite";
import { gstate } from "@/global";
import { toJS } from "mobx";
import { createImagesFromFiles } from "@/uitls/ImageInfo";

export const ImageInput = observer(
  forwardRef((_, ref: ForwardedRef<HTMLInputElement>) => {
    return (
      <input
        ref={ref}
        className={style.file}
        type="file"
        multiple
        accept={Object.keys(toJS(gstate.mimes))
          .map((item) => "." + item)
          .join(",")}
        onChange={async (event) => {
          if (!event.target.files?.length) {
            event.target.value = "";
            return;
          }
          await createImagesFromFiles(event.target.files);
          event.target.value = "";
        }}
      />
    );
  })
);
