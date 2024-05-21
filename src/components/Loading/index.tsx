import style from "./index.module.scss";
import { Flex, theme } from "antd";
import { observer } from "mobx-react-lite";
import { Indicator } from "../Indicator";
import { createPortal } from "react-dom";

export const Loading = observer(() => {
  const { token } = theme.useToken();

  return createPortal(
    <Flex align="center" justify="center" className={style.container}>
      <Flex
        align="center"
        justify="center"
        style={{
          borderRadius: token.borderRadius,
        }}
      >
        <Indicator size="large" white />
      </Flex>
    </Flex>,
    document.body,
  );
});
