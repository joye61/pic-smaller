import {
  Button,
  Divider,
  Dropdown,
  Flex,
  GlobalToken,
  Popover,
  Space,
  Table,
  Tooltip,
  Typography,
  theme,
} from "antd";
import style from "./index.module.scss";
import { observer } from "mobx-react-lite";
import { Logo } from "@/components/Logo";
import { TableProps } from "antd/es/table";
import {
  ArrowDownOutlined,
  ArrowUpOutlined,
  CaretRightOutlined,
  CheckCircleFilled,
  ClearOutlined,
  DeleteOutlined,
  DownloadOutlined,
  ExclamationCircleOutlined,
  FolderAddOutlined,
  GithubOutlined,
  PlusOutlined,
  ReloadOutlined,
} from "@ant-design/icons";
import { useCallback, useEffect, useRef, useState } from "react";
import { ImageInput } from "@/components/ImageInput";
import { gstate } from "@/global";
import { CompressOption } from "@/components/CompressOption";
import { changeLang, langList } from "@/locale";
import { DefaultCompressOption, ImageItem, homeState } from "@/states/home";
import { Indicator } from "@/components/Indicator";
import {
  createDownload,
  formatSize,
  getFilesFromHandle,
  getOutputFileName,
  getUniqNameOnNames,
  wait,
} from "@/functions";
import { ProgressHint } from "@/components/ProgressHint";
import { UploadCard } from "@/components/UploadCard";
import { createImageList, useWorkerHandler } from "@/engines/transform";
import { toJS } from "mobx";
import { Compare } from "@/components/Compare";

/**
 * 获取当前语言字符串
 * @returns
 */
function getLangStr() {
  const findLang = langList?.find((item) => item?.key == gstate.lang);
  return (findLang as any)?.label;
}

function getColumns(token: GlobalToken, disabled: boolean) {
  const columns: TableProps<ImageItem>["columns"] = [
    {
      dataIndex: "status",
      title: gstate.locale?.columnTitle.status,
      fixed: "left",
      width: 80,
      className: style.status,
      render(_, row) {
        if (row.compress && row.preview) {
          return (
            <CheckCircleFilled
              style={{
                fontSize: "17px",
                color: token.colorPrimary,
              }}
            />
          );
        }
        return <Indicator />;
      },
    },
    {
      dataIndex: "preview",
      title: gstate.locale?.columnTitle.preview,
      render(_, row) {
        if (!row.preview) return <div className={style.preview} />;
        return (
          <div
            className={style.preview}
            style={{
              borderRadius: token.borderRadius,
            }}
          >
            <img src={row.preview.src} />
            {row.compress && (
              <Flex
                align="center"
                justify="center"
                onClick={async () => {
                  // gstate.loading = true;
                  // await wait(300);
                  homeState.compareId = row.key;
                }}
              >
                <svg viewBox="0 0 24 24">
                  <path d="M13,23H11V1H13V23M9,19H5V5H9V3H5C3.89,3 3,3.89 3,5V19C3,20.11 3.9,21 5,21H9V19M19,7V9H21V7H19M19,5H21C21,3.89 20.1,3 19,3V5M21,15H19V17H21V15M19,11V13H21V11H19M17,3H15V5H17V3M19,21C20.11,21 21,20.11 21,19H19V21M17,19H15V21H17V19Z" />
                </svg>
              </Flex>
            )}
          </div>
        );
      },
    },
    {
      dataIndex: "name",
      title: gstate.locale?.columnTitle.name,
      render(_, row) {
        return (
          <Typography.Text title={row.name} className={style.name}>
            {row.name}
          </Typography.Text>
        );
      },
    },
    {
      dataIndex: "dimension",
      align: "right",
      className: style.nowrap,
      title: gstate.locale?.columnTitle.dimension,
      render(_, row) {
        if (!row.width && !row.height) return "-";
        return (
          <Typography.Text type="secondary">
            {row.width}*{row.height}
          </Typography.Text>
        );
      },
    },
    {
      dataIndex: "newDimension",
      align: "right",
      className: style.nowrap,
      title: gstate.locale?.columnTitle.newDimension,
      render(_, row) {
        if (!row.compress?.width && !row.compress?.height) return "-";
        return (
          <Typography.Text>
            {row.compress.width}*{row.compress.height}
          </Typography.Text>
        );
      },
    },
    {
      dataIndex: "size",
      align: "right",
      className: style.nowrap,
      title: gstate.locale?.columnTitle.size,
      sorter(first, second) {
        return first.blob.size - second.blob.size;
      },
      render(_, row) {
        return (
          <Typography.Text type="secondary">
            {formatSize(row.blob.size)}
          </Typography.Text>
        );
      },
    },
    {
      dataIndex: "newSize",
      align: "right",
      className: style.nowrap,
      title: gstate.locale?.columnTitle.newSize,
      sorter(first, second) {
        if (!first.compress || !second.compress) {
          return 0;
        }
        return first.compress.blob.size - second.compress.blob.size;
      },
      render(_, row) {
        if (!row.compress) return "-";
        const lower = row.blob.size > row.compress.blob.size;
        const format = formatSize(row.compress.blob.size);
        if (lower) {
          return <Typography.Text type="success">{format}</Typography.Text>;
        }

        return <Typography.Text type="danger">{format}</Typography.Text>;
      },
    },
    {
      dataIndex: "decrease",
      className: style.nowrap,
      title: gstate.locale?.columnTitle.decrease,
      align: "right",
      sorter(first, second) {
        if (!first.compress || !second.compress) {
          return 0;
        }
        const firstRate =
          (first.blob.size - first.compress.blob.size) / first.blob.size;
        const secondRate =
          (second.blob.size - second.compress.blob.size) / second.blob.size;

        return firstRate - secondRate;
      },
      render(_, row) {
        if (!row.compress) return "-";
        const lower = row.blob.size > row.compress.blob.size;
        const rate = (row.compress.blob.size - row.blob.size) / row.blob.size;
        const formatRate = (Math.abs(rate) * 100).toFixed(2) + "%";
        if (lower) {
          return (
            <Flex align="center" justify="flex-end">
              <Typography.Text type="success">
                {formatRate}&nbsp;
              </Typography.Text>
              <ArrowDownOutlined style={{ color: token.colorSuccess }} />
            </Flex>
          );
        }

        return (
          <Flex align="center" justify="flex-end">
            <Typography.Text type="danger">+{formatRate}&nbsp;</Typography.Text>
            <Tooltip title={gstate.locale?.optionPannel.failTip}>
              <ArrowUpOutlined
                style={{ color: token.colorError, cursor: "pointer" }}
              />
            </Tooltip>
          </Flex>
        );
      },
    },
    {
      dataIndex: "action",
      align: "right",
      fixed: "right",
      title: gstate.locale?.columnTitle.action,
      className: style.action,
      render(_, row) {
        return (
          <Space>
            <Typography.Link
              type="secondary"
              disabled={disabled}
              onClick={() => {
                homeState.list.delete(row.key);
              }}
            >
              <Tooltip title={gstate.locale?.listAction.removeOne}>
                <DeleteOutlined />
              </Tooltip>
            </Typography.Link>
            <Typography.Link
              type="secondary"
              disabled={disabled}
              onClick={() => {
                if (row.compress?.blob) {
                  const fileName = getOutputFileName(row, homeState.option);
                  createDownload(fileName, row.compress.blob);
                }
              }}
            >
              <Tooltip title={gstate.locale?.listAction.downloadOne}>
                <DownloadOutlined />
              </Tooltip>
            </Typography.Link>
          </Space>
        );
      },
    },
  ];

  return columns;
}

const Home = observer(() => {
  const fileRef = useRef<HTMLInputElement>(null);
  const { token } = theme.useToken();

  const disabled = homeState.hasTaskRunning();
  const columns = getColumns(token, disabled);

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
        <div className={style.side}>
          <Flex justify="space-between" align="center">
            <Popover
              placement="bottom"
              content={
                <div className={style.optionHelpBox}>
                  <Typography.Text>
                    {gstate.locale?.optionPannel.help}
                  </Typography.Text>
                </div>
              }
            >
              <Typography.Text type="secondary" className={style.optionHelp}>
                <ExclamationCircleOutlined />
              </Typography.Text>
            </Popover>
            <Space>
              <Button
                disabled={disabled}
                icon={<ReloadOutlined />}
                onClick={async () => {
                  homeState.tempOption = { ...DefaultCompressOption };
                  homeState.option = { ...DefaultCompressOption };
                  homeState.reCompress();
                }}
              >
                {gstate.locale?.optionPannel?.resetBtn}
              </Button>
              <Button
                disabled={disabled}
                icon={<CaretRightOutlined />}
                type="primary"
                onClick={() => {
                  homeState.option = toJS(homeState.tempOption);
                  homeState.reCompress();
                }}
              >
                {gstate.locale?.optionPannel?.confirmBtn}
              </Button>
            </Space>
          </Flex>
          <div>
            <CompressOption />
          </div>
        </div>
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
          <Divider type="vertical" style={{ background: "#dfdfdf" }} />
          <Typography.Link
            className={style.github}
            target="_blank"
            href="https://github.com/joye61/pic-smaller"
          >
            <GithubOutlined />
          </Typography.Link>
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
