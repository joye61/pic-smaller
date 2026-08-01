import { Typography } from "antd";
import style from "./index.module.scss";
import { observer } from "mobx-react-lite";

interface LogoProps {
  iconSize?: number;
  title?: string;
}

export const Logo = observer(
  ({ iconSize = 40, title = "Pic Smaller" }: LogoProps) => {
    return (
      <div className={style.container}>
        <span
          className={style.icon}
          style={{ width: iconSize, height: iconSize }}
        >
          <img src="/logo.png" alt="" aria-hidden="true" />
        </span>
        <Typography.Text>{title}</Typography.Text>
      </div>
    );
  },
);
