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
import { observer } from "mobx-react-lite";
import { Logo } from "@/components/Logo";
import { UploadCard } from "@/components/UploadCard";
import { TableProps } from "antd/es/table";
import {
  CheckCircleFilled,
  ClearOutlined,
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
      title: gstate.locale?.columnTitle.preview,
    },
    {
      dataIndex: "name",
      title: gstate.locale?.columnTitle.name,
      render(_, row) {
        return <Typography.Text>{row.origin.name}</Typography.Text>;
      },
    },
    {
      dataIndex: "size",
      title: gstate.locale?.columnTitle.size,
    },
    {
      dataIndex: "dimension",
      title: gstate.locale?.columnTitle.dimension,
    },
    {
      dataIndex: "decrease",
      title: gstate.locale?.columnTitle.decrease,
    },
    {
      dataIndex: "action",
      title: gstate.locale?.columnTitle.action,
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
                <Tooltip title={gstate.locale?.listAction.clear}>
                  <Button icon={<ClearOutlined />} danger type="primary" />
                </Tooltip>
                <Popover
                  content={<CompressOptionPannel />}
                  placement="bottomRight"
                  title={gstate.locale?.optionPannel.title}
                >
                  <Button icon={<SettingOutlined />} type="primary" />
                </Popover>
                <Tooltip title={gstate.locale?.listAction.downloadAll}>
                  <Button icon={<DownloadOutlined />} type="primary" />
                </Tooltip>
              </Space>
              <ImageInput ref={fileRef} />
            </Flex>
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <Table
              columns={columns}
              bordered
              // scroll={{ y: 600 }}
              dataSource={homeState.list}
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
