import { Flex, Space, Tooltip, Typography, message, theme } from "antd";
import style from "./index.module.scss";
import { TableProps } from "antd/es/table";
import {
  ArrowDownOutlined,
  ArrowUpOutlined,
  CheckCircleFilled,
  DeleteOutlined,
  DownloadOutlined,
} from "@ant-design/icons";
import { gstate } from "@/global";
import { ImageItem, homeState } from "@/states/home";
import { Indicator } from "@/components/Indicator";
import { createDownload, formatSize, getOutputFileName } from "@/functions";
import { useResponse } from "@/media";

export function useColumn(disabled: boolean) {
  const { token } = theme.useToken();
  const { isPC, isPad, isMobile } = useResponse();

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
                  if (homeState.isCropMode()) {
                    message.warning("裁剪模式不支持预览对比");
                    return;
                  }
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
  ];
  if (isPC) {
    columns.push({
      dataIndex: "name",
      title: gstate.locale?.columnTitle.name,
      render(_, row) {
        return (
          <Typography.Text title={row.name} className={style.name}>
            {row.name}
          </Typography.Text>
        );
      },
    });
  }
  if (isPC || isPad) {
    columns.push(
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
    );
  }

  // All media supported fields
  columns.push(
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
              <Typography.Text type="success" style={{ whiteSpace: "nowrap" }}>
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
          <Space size={isMobile ? "large" : undefined}>
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
  );

  return columns;
}
