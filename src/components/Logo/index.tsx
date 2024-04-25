import { Flex } from "antd";
import style from "./index.module.scss";
import { observer } from "mobx-react-lite";

interface LogoProps {
  iconSize?: number;
  title?: string;
}

export const Logo = observer(
  ({ iconSize = 22, title = "PicSmaller" }: LogoProps) => {
    return (
      <Flex className={style.container}>
        <img src="/logo.svg" alt="logo" width={iconSize} height={iconSize} />
        <span>{title}</span>
      </Flex>
    );
  }
);
