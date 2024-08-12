import { Button, Flex, Space, Table, Tooltip } from "antd";
import style from "./index.module.scss";
import { observer } from "mobx-react-lite";
import {
  ClearOutlined,
  DownloadOutlined,
  FolderAddOutlined,
  PlusOutlined,
  ReloadOutlined,
} from "@ant-design/icons";
import { useCallback, useEffect, useRef, useState } from "react";
import { ImageInput } from "@/components/ImageInput";
import { gstate } from "@/global";
import { homeState } from "@/states/home";
import {
  createDownload,
  getFilesFromHandle,
  getOutputFileName,
  getUniqNameOnNames,
} from "@/functions";
import { ProgressHint } from "@/components/ProgressHint";
import { createImageList } from "@/engines/transform";
import { useColumn } from "./useColumn";
import { useResponse } from "@/media";

export const LeftContent = observer(() => {
  const { isMobile } = useResponse();
  const disabled = homeState.hasTaskRunning();
  const fileRef = useRef<HTMLInputElement>(null);
  const columns = useColumn(disabled);

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

  return (
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
            {!isMobile && gstate.locale?.listAction.batchAppend}
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
              {!isMobile && gstate.locale?.listAction.addFolder}
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
              homeState.clear();
            }}
          >
            {!isMobile && gstate.locale?.listAction.clear}
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
            {!isMobile && gstate.locale?.listAction.downloadAll}
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
  );
});
