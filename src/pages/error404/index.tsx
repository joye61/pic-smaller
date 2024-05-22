import { goto } from "@/history";
import style from "./index.module.scss";
import { Button, Flex, Result } from "antd";
import { observer } from "mobx-react-lite";
import { gstate } from "@/global";

const Error404 = observer(() => {
  const backToHome = (
    <Button
      type="primary"
      onClick={() => {
        goto("/", null, "replace");
      }}
    >
      {gstate.locale?.error404.backHome}
    </Button>
  );

  return (
    <Flex className={style.container} align="center" justify="center">
      <Result
        status="404"
        title="404"
        subTitle={gstate.locale?.error404.description}
        extra={backToHome}
      />
    </Flex>
  );
});

export default Error404;
