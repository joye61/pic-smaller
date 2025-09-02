import { Flex, Space, Tooltip, Typography, message, theme } from "antd";
import style from "./index.module.scss";
import { TableProps } from "antd/es/table";
import { ArrowDownOutlined, ArrowUpOutlined } from "@ant-design/icons";
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
            <div className={style.fileok}>
              <svg viewBox="0 0 1024 1024">
                <path d="M128 128l0 768 768 0L896 128 128 128zM424.704 768 198.464 541.696 288.96 451.2l135.744 135.744 316.8-316.8L832 360.704 424.704 768z" />
              </svg>
            </div>
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
          <Space
            size={isMobile ? "large" : undefined}
            className={style.actionlink}
          >
            <Typography.Link
              type="secondary"
              disabled={disabled}
              style={{ fontSize: 0 }}
              onClick={() => {
                homeState.list.delete(row.key);
              }}
            >
              <Tooltip title={gstate.locale?.listAction.removeOne}>
                <svg viewBox="0 0 1024 1024" width="20" height="20">
                  <path
                    d="M912 239.2H112a5.333333 5.333333 0 0 0-5.333333 5.333333v64a5.333333 5.333333 0 0 0 5.333333 5.333334h88.32a5.333333 5.333333 0 0 1 5.333333 5.333333V912a5.333333 5.333333 0 0 0 5.333334 5.333333h601.973333a5.333333 5.333333 0 0 0 5.333333-5.333333V319.2a5.333333 5.333333 0 0 1 5.333334-5.333333H912a5.333333 5.333333 0 0 0 5.333333-5.333334v-64a5.333333 5.333333 0 0 0-5.333333-5.333333z m-470.24 486.506667a5.333333 5.333333 0 0 1-5.333333 5.333333h-64a5.333333 5.333333 0 0 1-5.333334-5.333333V430.826667a5.333333 5.333333 0 0 1 5.333334-5.333334h64a5.333333 5.333333 0 0 1 5.333333 5.333334z m215.146667 0a5.333333 5.333333 0 0 1-5.333334 5.333333h-64a5.333333 5.333333 0 0 1-5.333333-5.333333V430.826667a5.333333 5.333333 0 0 1 5.333333-5.333334h64a5.333333 5.333333 0 0 1 5.333334 5.333334z"
                    fill="#ff4d4f"
                  ></path>
                  <path
                    d="M320 106.666667m5.333333 0l373.333334 0q5.333333 0 5.333333 5.333333l0 64q0 5.333333-5.333333 5.333333l-373.333334 0q-5.333333 0-5.333333-5.333333l0-64q0-5.333333 5.333333-5.333333Z"
                    fill="#ff4d4f"
                  ></path>
                </svg>
              </Tooltip>
            </Typography.Link>
            <Typography.Link
              type="secondary"
              disabled={disabled}
              style={{ fontSize: 0 }}
              onClick={() => {
                if (row.compress?.blob) {
                  const fileName = getOutputFileName(row, homeState.option);
                  createDownload(fileName, row.compress.blob);
                }
              }}
            >
              <Tooltip title={gstate.locale?.listAction.downloadOne}>
                <svg viewBox="0 0 1024 1024" width="18" height="20">
                  <path
                    d="M736 448l-256 256-256-256 160 0 0-384 192 0 0 384zM480 704l-480 0 0 256 960 0 0-256-480 0zM896 832l-128 0 0-64 128 0 0 64z"
                    fill="#707070"
                  />
                </svg>
              </Tooltip>
            </Typography.Link>
          </Space>
        );
      },
    },
  );

  return columns;
}
