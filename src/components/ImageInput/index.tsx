import { ForwardedRef, forwardRef } from "react";
import style from "./index.module.scss";
import { observer } from "mobx-react-lite";
import { gstate } from "@/global";
import { toJS } from "mobx";
import { createImageList } from "@/libs/transform";

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
          const files = event.target.files;
          if (!files?.length) {
            event.target.value = "";
            return;
          }
          const list: Array<File> = [];
          for (let index = 0; index < files.length; index++) {
            const file = files.item(index);
            if (file) {
              list.push(file);
            }
          }
          await createImageList(list);
          event.target.value = "";
        }}
      />
    );
  })
);
