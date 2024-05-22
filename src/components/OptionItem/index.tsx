import { HTMLProps } from "react";
import style from "./index.module.scss";
import { Typography } from "antd";

export interface OptionItemProps extends HTMLProps<HTMLDivElement> {
  desc?: React.ReactNode;
  children?: React.ReactNode;
}

export function OptionItem(props: OptionItemProps) {
  /* eslint-disable prefer-const */
  let { desc, children, ...extra } = props;
  if (desc && typeof desc === "string") {
    desc = <Typography.Text className={style.desc}>{desc}</Typography.Text>;
  }
  return (
    <div className={style.container} {...extra}>
      <div className={style.desc}>{desc}</div>
      <div>{children}</div>
    </div>
  );
}
