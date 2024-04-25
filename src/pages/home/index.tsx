import {
  Button,
  Col,
  Flex,
  Popover,
  Row,
  Space,
  Table,
  Tooltip,
  Typography,
} from "antd";
import style from "./index.module.scss";
import { observer } from "mobx-react-lite";
import { Logo } from "@/components/Logo";
import { UploadCard } from "@/components/UploadCard";
import { TableProps } from "antd/es/table";
import {
  ClearOutlined,
  DownloadOutlined,
  PlusOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import { useRef } from "react";
import { ImageInput } from "@/components/ImageInput";
import { gstate } from "@/global";
import { CompressOption } from "@/components/CompressOption";

interface RowType {
  key: string;
  status: 0 | 1 | 2;
  name: string;
  age: number;
  address: string;
  tags: string[];
}

const columns: TableProps<RowType>["columns"] = [
  {
    dataIndex: "status",
    title: gstate.locale?.columnTitle.status,
  },
  {
    dataIndex: "preview",
    title: gstate.locale?.columnTitle.preview,
  },
  {
    dataIndex: "name",
    title: gstate.locale?.columnTitle.name,
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

export default observer(() => {
  const fileRef = useRef<HTMLInputElement>(null);

  return (
    <div className={style.main}>
      <Flex align="center" justify="space-between" className={style.header}>
        <Logo title={gstate.locale?.logo} />
        <Typography.Link>Feedback</Typography.Link>
      </Flex>
      <div>
        <UploadCard />
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
                  content={<CompressOption />}
                  placement="bottomRight"
                  title={gstate.locale?.listAction.setting}
                  open
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
            <Table columns={columns} bordered scroll={{ y: 600 }} />
          </Col>
        </Row>
      </div>
    </div>
  );
});
