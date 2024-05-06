import { HTMLProps } from "react";
import style from "./index.module.scss";
import { Typography } from "antd";
import { isString } from "lodash";

export interface OptionItemProps extends HTMLProps<HTMLDivElement> {
  desc?: React.ReactNode;
  children?: React.ReactNode;
}

export function OptionItem(props: OptionItemProps) {
  let desc: React.ReactNode = props.desc;
  if (isString(props.desc)) {
    desc = (
      <Typography.Text className={style.desc}>{props.desc}</Typography.Text>
    );
  }
  return (
    <div className={style.container}>
      <div className={style.desc}>{desc}</div>
      <div>{props.children}</div>
    </div>
  );
}
