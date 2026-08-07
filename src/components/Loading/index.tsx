import style from "./index.module.scss";
import { observer } from "mobx-react-lite";
import { Indicator } from "../Indicator";
import { createPortal } from "react-dom";

export const Loading = observer(() => {
  return createPortal(
    <div className={style.container} role="status" aria-label="Loading">
      <div>
        <Indicator size="large" white />
      </div>
    </div>,
    document.body,
  );
});
