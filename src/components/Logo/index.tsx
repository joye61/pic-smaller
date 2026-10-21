import style from "./index.module.scss";
import { observer } from "mobx-react-lite";

interface LogoProps {
  iconSize?: number;
  title?: string;
}

export const Logo = observer(
  ({ iconSize = 40, title = "LunePic" }: LogoProps) => {
    return (
      <div className={style.container}>
        <span
          className={style.icon}
          style={{ width: iconSize, height: iconSize }}
        >
          <img src="/lunepic-logo.svg" alt="" aria-hidden="true" />
        </span>
        <span>{title}</span>
      </div>
    );
  },
);
