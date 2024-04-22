"use client";

import Image from "next/image";
import style from "./page.module.scss";
import {  Button, Flex, Space } from "antd";
import { Logo } from "@/components/Logo";

export default function Home() {
  return (
    <main className={style.main}>
      <Flex align="center" justify="space-between">
        <Logo />
        <Space><Button>Contact US</Button></Space>
      </Flex>
    </main>
  );
}
