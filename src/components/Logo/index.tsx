import { Flex, Typography } from "antd";
import style from "./index.module.scss";
import { observer } from "mobx-react-lite";

interface LogoProps {
  iconSize?: number;
  title?: string;
}

export const Logo = observer(({ title = "PicSmaller" }: LogoProps) => {
  return (
    <Flex justify="flex-start" className={style.container}>
      <Typography.Text>{title}</Typography.Text>
    </Flex>
  );
});
