import { ForwardedRef, forwardRef } from "react";
import style from "./index.module.scss";
import { observer } from "mobx-react-lite";
import { gstate } from "@/global";

export const ImageInput = observer(
  forwardRef((_, ref: ForwardedRef<HTMLInputElement>) => {
    return (
      <input
        ref={ref}
        className={style.file}
        type="file"
        multiple
        accept={gstate.supportedTypes.map((item) => "." + item).join(",")}
      />
    );
  })
);
