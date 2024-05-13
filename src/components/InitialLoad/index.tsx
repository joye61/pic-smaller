import style from "./index.module.scss";
import { observer } from "mobx-react-lite";
import { Flex, Typography } from "antd";
import { Indicator } from "../Indicator";

export const InitialLoad = observer(() => {
  return (
    <Flex align="center" justify="center" className={style.container}>
      <Flex vertical align="center">
        <Indicator />
        <Typography.Text>加载中</Typography.Text>
      </Flex>
    </Flex>
  );
});
