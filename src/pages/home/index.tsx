import {
  Button,
  Col,
  Dropdown,
  Flex,
  Popover,
  Row,
  Space,
  Table,
  Tooltip,
  Typography,
  theme,
} from "antd";
import style from "./index.module.scss";
import { Observer, observer } from "mobx-react-lite";
import { Logo } from "@/components/Logo";
import { UploadCard } from "@/components/UploadCard";
import { TableProps } from "antd/es/table";
import {
  ArrowDownOutlined,
  ArrowUpOutlined,
  CheckCircleFilled,
  ClearOutlined,
  DeleteOutlined,
  DownloadOutlined,
  PlusOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import { useEffect, useRef } from "react";
import { ImageInput } from "@/components/ImageInput";
import { gstate } from "@/global";
import { CompressOptionPannel } from "@/components/CompressOptionPannel";
import { changeLang, langList } from "@/locale";
import { homeState } from "@/states/home";
import { setTransformData } from "@/uitls/transform";
import { ImageInfo } from "@/uitls/ImageInfo";
import { Indicator } from "@/components/Indicator";
import { formatSize } from "@/functions";
import { round } from "lodash";
import { toJS } from "mobx";

/**
 * 获取当前语言字符串
 * @returns
 */
function getLangStr() {
  const findLang = langList?.find((item) => item?.key == gstate.lang);
  return (findLang as any)?.label;
}

export default observer(() => {
  const fileRef = useRef<HTMLInputElement>(null);
  const { token } = theme.useToken();

  const columns: TableProps<ImageInfo>["columns"] = [
    {
      dataIndex: "status",
      title: gstate.locale?.columnTitle.status,
      fixed: "left",
      width: 60,
      render(_, row) {
        if (row.output) {
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
      width: 70,
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
          <Typography.Text title={row.origin.name} className={style.name}>
            {row.origin.name}
          </Typography.Text>
        );
      },
    },
    {
      dataIndex: "dimension",
      width: 100,
      className: style.nowrap,
      title: gstate.locale?.columnTitle.dimension,
      render(_, row) {
        return (
          <Typography.Text type="secondary">
            {row.origin.width}*{row.origin.height}
          </Typography.Text>
        );
      },
    },
    {
      dataIndex: "newDimension",
      width: 120,
      className: style.nowrap,
      title: gstate.locale?.columnTitle.newDimension,
      render(_, row) {
        if (!row.output) return "-";
        return (
          <Observer>
            {() => (
              <Typography.Text>
                {row.output!.width}*{row.output!.height}
              </Typography.Text>
            )}
          </Observer>
        );
      },
    },
    {
      dataIndex: "size",
      width: 100,
      className: style.nowrap,
      title: gstate.locale?.columnTitle.size,
      render(_, row) {
        return (
          <Typography.Text type="secondary">
            {formatSize(row.origin.blob.size)}
          </Typography.Text>
        );
      },
    },
    {
      dataIndex: "newSize",
      width: 100,
      className: style.nowrap,
      title: gstate.locale?.columnTitle.newSize,
      render(_, row) {
        if (!row.output) return "-";
        const lower = row.origin.blob.size > row.output!.blob.size;
        const format = formatSize(row.output!.blob.size);
        return (
          <Observer>
            {() => {
              if (lower) {
                return (
                  <Typography.Text type="danger">{format}</Typography.Text>
                );
              }

              return <Typography.Text type="success">{format}</Typography.Text>;
            }}
          </Observer>
        );
      },
    },
    {
      dataIndex: "decrease",
      className: style.nowrap,
      title: gstate.locale?.columnTitle.decrease,
      align: "right",
      fixed: "right",
      width: 80,
      render(_, row) {
        if (!row.output) return "-";
        const lower = row.origin.blob.size > row.output!.blob.size;
        const rate =
          (row.output!.blob.size - row.origin.blob.size) / row.origin.blob.size;
        const formatRate = round(rate, 4) * 100 + "%";
        return (
          <Observer>
            {() => {
              if (lower) {
                return (
                  <Flex align="center" justify="flex-end">
                    <Typography.Text type="danger">
                      {formatRate}
                    </Typography.Text>
                    <ArrowDownOutlined style={{ color: token.colorError }} />
                  </Flex>
                );
              }

              return (
                <Flex align="center" justify="flex-end">
                  <Typography.Text type="success">{formatRate}</Typography.Text>
                  <ArrowUpOutlined style={{ color: token.colorSuccess }} />
                </Flex>
              );
            }}
          </Observer>
        );
      },
    },
    {
      dataIndex: "action",
      align: "right",
      fixed: "right",
      width: 60,
      title: gstate.locale?.columnTitle.action,
      render(_, row, index) {
        return (
          <Observer>
            {() => (
              <Space>
                <Typography.Link
                  type="warning"
                  onClick={() => {
                    homeState.list.splice(index, 1);
                    homeState.list = [...toJS(homeState.list)];
                  }}
                >
                  <Tooltip title={gstate.locale?.listAction.removeOne}>
                    <DeleteOutlined />
                  </Tooltip>
                </Typography.Link>
                <Typography.Link
                  type="secondary"
                  onClick={() => {
                    // TODO
                  }}
                >
                  <Tooltip title={gstate.locale?.listAction.downloadOne}>
                    <DownloadOutlined />
                  </Tooltip>
                </Typography.Link>
              </Space>
            )}
          </Observer>
        );
      },
    },
  ];

  useEffect(setTransformData, []);

  let actionPannel = <UploadCard />;
  if (homeState.list.length > 0) {
    actionPannel = (
      <>
        <Row>
          <Col span={24}>
            <Flex align="center" justify="space-between" className={style.menu}>
              <Button
                icon={<PlusOutlined />}
                type="primary"
                onClick={() => {
                  fileRef.current?.click();
                }}
              >
                {gstate.locale?.listAction.batchAppend}
              </Button>
              <Space>
                <Popover
                  content={<CompressOptionPannel />}
                  placement="bottomRight"
                  title={gstate.locale?.optionPannel.title}
                >
                  <Button icon={<SettingOutlined />} />
                </Popover>
                <Button icon={<ClearOutlined />}>
                  {gstate.locale?.listAction.clear}
                </Button>
                <Button icon={<DownloadOutlined />} type="primary">
                  {gstate.locale?.listAction.downloadAll}
                </Button>
              </Space>
              <ImageInput ref={fileRef} />
            </Flex>
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <Table
              columns={columns}
              // bordered
              size="small"
              pagination={false}
              scroll={{ y: 400 }}
              dataSource={homeState.list}
              footer={() => {
                return null;
              }}
            />
          </Col>
        </Row>
      </>
    );
  }

  return (
    <div className={style.main}>
      <Flex align="center" justify="space-between" className={style.header}>
        <Logo title={gstate.locale?.logo} />
        <Space>
          <Dropdown
            menu={{
              items: langList,
              selectedKeys: [gstate.lang],
              onClick({ key }) {
                changeLang(key);
              },
            }}
          >
            <Flex className={style.localeChange} align="center">
              <svg viewBox="0 0 24 24" style={{ color: "currentcolor" }}>
                <path d="M12.87,15.07L10.33,12.56L10.36,12.53C12.1,10.59 13.34,8.36 14.07,6H17V4H10V2H8V4H1V6H12.17C11.5,7.92 10.44,9.75 9,11.35C8.07,10.32 7.3,9.19 6.69,8H4.69C5.42,9.63 6.42,11.17 7.67,12.56L2.58,17.58L4,19L9,14L12.11,17.11L12.87,15.07M18.5,10H16.5L12,22H14L15.12,19H19.87L21,22H23L18.5,10M15.88,17L17.5,12.67L19.12,17H15.88Z" />
              </svg>
              <Typography.Text>{getLangStr()}</Typography.Text>
            </Flex>
          </Dropdown>
        </Space>
      </Flex>
      <div>{actionPannel}</div>
    </div>
  );
});
