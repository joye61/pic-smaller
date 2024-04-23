import { Flex } from "antd";
import Image from "next/image";
import style from "./index.module.scss";

interface LogoProps {
  iconSize?: number;
  title?: string;
}

export function Logo({ iconSize = 24, title = "图小小" }: LogoProps) {
  return (
    <Flex className={style.container}>
      <Image src="/logo.svg" alt="logo" width={iconSize} height={iconSize} />
      <span>{title}</span>
    </Flex>
  );
}
