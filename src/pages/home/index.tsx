import {
  Button,
  Divider,
  Dropdown,
  Flex,
  Space,
  Table,
  Tooltip,
  Typography,
} from "antd";
import style from "./index.module.scss";
import { observer } from "mobx-react-lite";
import { Logo } from "@/components/Logo";
import {
  ClearOutlined,
  DownloadOutlined,
  FolderAddOutlined,
  GithubOutlined,
  MenuOutlined,
  PlusOutlined,
  ReloadOutlined,
} from "@ant-design/icons";
import { useCallback, useEffect, useRef, useState } from "react";
import { ImageInput } from "@/components/ImageInput";
import { gstate } from "@/global";
import { changeLang, langList } from "@/locale";
import { homeState } from "@/states/home";
import {
  createDownload,
  getFilesFromHandle,
  getOutputFileName,
  getUniqNameOnNames,
  wait,
} from "@/functions";
import { ProgressHint } from "@/components/ProgressHint";
import { UploadCard } from "@/components/UploadCard";
import { createImageList, useWorkerHandler } from "@/engines/transform";
import { Compare } from "@/components/Compare";
import { useColumn } from "./column";
import { useResponse } from "@/media";
import { RightOption } from "./RightOption";

/**
 * 获取当前语言字符串
 * @returns
 */
function getLangStr() {
  const findLang = langList?.find((item) => item?.key == gstate.lang);
  return (findLang as any)?.label;
}

const Home = observer(() => {
  const { isPC } = useResponse();
  const fileRef = useRef<HTMLInputElement>(null);
  const disabled = homeState.hasTaskRunning();
  const columns = useColumn(disabled);

  useWorkerHandler();

  const scrollBoxRef = useRef<HTMLDivElement>(null);
  const [scrollHeight, setScrollHeight] = useState<number>(0);
  const resize = useCallback(() => {
    const element = scrollBoxRef.current;
    if (element) {
      const boxHeight = element.getBoundingClientRect().height;
      const th = document.querySelector(".ant-table-thead");
      const tbody = document.querySelector(".ant-table-tbody");
      const thHeight = th?.getBoundingClientRect().height ?? 0;
      const tbodyHeight = tbody?.getBoundingClientRect().height ?? 0;
      if (boxHeight > thHeight + tbodyHeight) {
        setScrollHeight(0);
      } else {
        setScrollHeight(boxHeight - thHeight);
      }
    }
  }, []);

  /* eslint-disable react-hooks/exhaustive-deps */
  // Everytime list change, recalc the scroll height
  useEffect(resize, [homeState.list.size]);

  useEffect(() => {
    window.addEventListener("resize", resize);
    return () => {
      window.removeEventListener("resize", resize);
    };
  }, [resize]);

  // Main content switch
  let mainContent = <UploadCard />;
  if (homeState.list.size > 0) {
    mainContent = (
      <>
        <Flex align="stretch" vertical className={style.content}>
          <Flex align="center" justify="space-between" className={style.menu}>
            <Space>
              <Button
                disabled={disabled}
                icon={<PlusOutlined />}
                type="primary"
                onClick={() => {
                  fileRef.current?.click();
                }}
              >
                {gstate.locale?.listAction.batchAppend}
              </Button>
              {window.showDirectoryPicker && (
                <Button
                  disabled={disabled}
                  icon={<FolderAddOutlined />}
                  type="primary"
                  onClick={async () => {
                    const handle = await window.showDirectoryPicker!();
                    const result = await getFilesFromHandle(handle);
                    await createImageList(result);
                  }}
                >
                  {gstate.locale?.listAction.addFolder}
                </Button>
              )}
            </Space>
            <Space>
              <Tooltip title={gstate.locale?.listAction.reCompress}>
                <Button
                  disabled={disabled}
                  icon={<ReloadOutlined />}
                  onClick={async () => {
                    homeState.reCompress();
                  }}
                />
              </Tooltip>
              <Button
                disabled={disabled}
                icon={<ClearOutlined />}
                onClick={() => {
                  homeState.list.clear();
                }}
              >
                {gstate.locale?.listAction.clear}
              </Button>
              <Button
                icon={<DownloadOutlined />}
                type="primary"
                disabled={disabled}
                onClick={async () => {
                  gstate.loading = true;
                  const jszip = await import("jszip");
                  const zip = new jszip.default();
                  const names: Set<string> = new Set();
                  /* eslint-disable @typescript-eslint/no-unused-vars */
                  for (const [_, info] of homeState.list) {
                    const fileName = getOutputFileName(info, homeState.option);
                    const uniqName = getUniqNameOnNames(names, fileName);
                    names.add(uniqName);
                    if (info.compress?.blob) {
                      zip.file(uniqName, info.compress.blob);
                    }
                  }
                  const result = await zip.generateAsync({
                    type: "blob",
                    compression: "DEFLATE",
                    compressionOptions: {
                      level: 6,
                    },
                  });
                  createDownload("picsmaller.zip", result);
                  gstate.loading = false;
                }}
              >
                {gstate.locale?.listAction.downloadAll}
              </Button>
            </Space>
            <ImageInput ref={fileRef} />
          </Flex>
          <div ref={scrollBoxRef}>
            <Table
              columns={columns}
              size="small"
              pagination={false}
              scroll={scrollHeight ? { y: scrollHeight } : undefined}
              dataSource={Array.from(homeState.list.values())}
            />
          </div>
          <Flex align="center">
            <ProgressHint />
          </Flex>
        </Flex>
        <RightOption />
      </>
    );
  }

  return (
    <div className={style.container}>
      {/* header */}
      <Flex align="center" justify="space-between" className={style.header}>
        <div>
          <Logo title={gstate.locale?.logo} />
        </div>
        <Space>
          <Dropdown
            menu={{
              items: langList,
              selectedKeys: [gstate.lang],
              async onClick({ key }) {
                await wait(300);
                changeLang(key);
              },
            }}
          >
            <Flex className={style.locale} align="center">
              <svg viewBox="0 0 24 24" style={{ color: "currentcolor" }}>
                <path d="M12.87,15.07L10.33,12.56L10.36,12.53C12.1,10.59 13.34,8.36 14.07,6H17V4H10V2H8V4H1V6H12.17C11.5,7.92 10.44,9.75 9,11.35C8.07,10.32 7.3,9.19 6.69,8H4.69C5.42,9.63 6.42,11.17 7.67,12.56L2.58,17.58L4,19L9,14L12.11,17.11L12.87,15.07M18.5,10H16.5L12,22H14L15.12,19H19.87L21,22H23L18.5,10M15.88,17L17.5,12.67L19.12,17H15.88Z" />
              </svg>
              <Typography.Text>{getLangStr()}</Typography.Text>
            </Flex>
          </Dropdown>
          <Typography.Link
            className={style.github}
            target="_blank"
            href="https://github.com/joye61/pic-smaller"
          >
            <GithubOutlined />
          </Typography.Link>

          {/* If non-PC is determined, the menu button will be displayed */}
          {!isPC && homeState.list.size > 0 && (
            <>
              <Divider type="vertical" style={{ background: "#dfdfdf" }} />
              <Button
                icon={<MenuOutlined />}
                onClick={() => {
                  homeState.showOption = true;
                }}
              />
            </>
          )}
        </Space>
      </Flex>

      {/* body */}
      <Flex align="stretch" className={style.main}>
        {mainContent}
      </Flex>

      {/* Compare */}
      {homeState.compareId !== null && <Compare />}
    </div>
  );
});

export default Home;
