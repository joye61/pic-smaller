import { goto } from "@/history";
import style from "./index.module.scss";
import { Button, Flex, Result } from "antd";
import { observer } from "mobx-react";

export default observer(() => {
  const backToHome = (
    <Button
      type="primary"
      onClick={() => {
        goto("/", null, "replace");
      }}
    >
      回到首页
    </Button>
  );

  return (
    <Flex className={style.container} align="center" justify="center">
      <Result
        status="404"
        title="404"
        subTitle="抱歉，你访问的页面不存在~"
        extra={backToHome}
      />
    </Flex>
  );
});
