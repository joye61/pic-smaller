"use client";

import Image from "next/image";
import style from "./page.module.scss";
import { Button, Flex, Space, Typography } from "antd";
import { Logo } from "@/components/Logo";
import Link from "next/link";

export default function Home() {
  return (
    <main className={style.main}>
      <Flex align="center" justify="space-between" className={style.header}>
        <Logo />
        <Link href="#">反馈</Link>
      </Flex>
    </main>
  );
}
