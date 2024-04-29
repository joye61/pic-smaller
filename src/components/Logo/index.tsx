import { Flex, theme } from "antd";
import style from "./index.module.scss";
import { observer } from "mobx-react-lite";

interface LogoProps {
  iconSize?: number;
  title?: string;
}

export const Logo = observer(
  ({ iconSize = 22, title = "PicSmaller" }: LogoProps) => {
    const { token } = theme.useToken();
    return (
      <Flex className={style.container}>
        <img
          src="/logo.svg"
          alt="logo"
          width={iconSize}
          height={iconSize}
          style={{
            borderRadius: token.borderRadiusSM,
          }}
        />
        <span>{title}</span>
      </Flex>
    );
  }
);
