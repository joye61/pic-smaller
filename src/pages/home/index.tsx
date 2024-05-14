import {
  Button,
  Dropdown,
  Flex,
  GlobalToken,
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
  CheckCircleFilled,
  ClearOutlined,
  DeleteOutlined,
  DownloadOutlined,
  PlusOutlined,
  ReloadOutlined,
} from "@ant-design/icons";
import { useEffect, useRef, useState } from "react";
import { ImageInput } from "@/components/ImageInput";
import { gstate } from "@/global";
import { CompressOption } from "@/components/CompressOption";
import { changeLang, langList } from "@/locale";
import { DefaultCompressOption, ImageItem, homeState } from "@/states/home";
import { Indicator } from "@/components/Indicator";
import {
  createDownload,
  formatSize,
  getUniqNameOnNames,
  wait,
} from "@/functions";
import { ProgressHint } from "@/components/ProgressHint";
import JSZip from "jszip";
import { UploadCard } from "@/components/UploadCard";
import { useWorkerHandler } from "@/libs/transform";
import { toJS } from "mobx";

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
          <div className={style.preview}>
            <img src={URL.createObjectURL(row.preview.blob)} />
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
            <Typography.Text type="danger">{formatRate}&nbsp;</Typography.Text>
            <ArrowUpOutlined style={{ color: token.colorError }} />
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
                  createDownload(row.name, row.compress.blob);
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

export default observer(() => {
  const fileRef = useRef<HTMLInputElement>(null);
  const { token } = theme.useToken();

  // 当前是否禁用操作
  const disabled = homeState.hasTaskRunning();
  const columns = getColumns(token, disabled);

  useWorkerHandler();

  const scrollBoxRef = useRef<HTMLDivElement>(null);
  const resizeRef = useRef<() => void>(() => {
    const element = scrollBoxRef.current;
    if (element) {
      const boxHeight = element.getBoundingClientRect().height;
      const th = document.querySelector(".ant-table-thead");
      const tbody = document.querySelector(".ant-table-tbody");
      const thHeight = th?.getBoundingClientRect().height ?? 0;
      const tbodyHeight = tbody?.getBoundingClientRect().height ?? 0;
      if (boxHeight > thHeight + tbodyHeight) {
        setScrollHeight(undefined);
      } else {
        setScrollHeight(boxHeight - thHeight);
      }
    }
  });
  const [scrollHeight, setScrollHeight] = useState<number | undefined>(
    undefined
  );
  const scrollY = scrollHeight ? { y: scrollHeight } : undefined;

  useEffect(() => {
    resizeRef.current();
  }, [homeState.list.size]);

  useEffect(() => {
    window.addEventListener("resize", resizeRef.current!);
    return () => {
      window.removeEventListener("resize", resizeRef.current!);
    };
  }, []);

  // Main content switch
  let mainContent = <UploadCard />;
  if (homeState.list.size > 0) {
    mainContent = (
      <>
        <Flex align="stretch" vertical className={style.content}>
          <Flex align="center" justify="space-between" className={style.menu}>
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
                  const zip = new JSZip();
                  const names: Set<string> = new Set();
                  for (let [_, info] of homeState.list) {
                    const uniqName = getUniqNameOnNames(names, info.name);
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
                  createDownload("PicSmaller.zip", result);
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
              scroll={scrollY}
              dataSource={Array.from(homeState.list.values())}
            />
          </div>
          <Flex align="center">
            <ProgressHint />
          </Flex>
        </Flex>
        <div className={style.side}>
          <Flex align="center" justify="space-between">
            <Typography.Text strong>
              {gstate.locale?.optionPannel.title}
            </Typography.Text>
          </Flex>
          <div>
            <CompressOption />
          </div>
          <Flex justify="flex-end">
            <Space>
              <Button
                disabled={disabled}
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
        </Space>
      </Flex>

      {/* body */}
      <Flex align="stretch" className={style.main}>
        {mainContent}
      </Flex>
    </div>
  );
});
