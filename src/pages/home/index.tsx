import { Flex, Typography } from "antd";
import style from "./index.module.scss";
import { observer } from "mobx-react-lite";
import { Logo } from "@/components/Logo";

export default observer(() => {
  return (
    <div className={style.main}>
      <Flex align="center" justify="space-between" className={style.header}>
        <Logo />
        <Typography.Link>反馈</Typography.Link>
      </Flex>
      <></>
    </div>
  );
});
