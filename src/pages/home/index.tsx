import { Button, Col, Flex, Row, Space, Table, Typography } from "antd";
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
    title: "Status",
  },
  {
    dataIndex: "preview",
    title: "Preview",
  },
  {
    dataIndex: "name",
    title: "Name",
  },
  {
    dataIndex: "size",
    title: "Size",
  },
  {
    dataIndex: "dimension",
    title: "Dimension",
  },
  {
    dataIndex: "decrease",
    title: "Decrease",
  },
  {
    dataIndex: "action",
    title: "Action",
  },
];

export default observer(() => {
  return (
    <div className={style.main}>
      <Flex align="center" justify="space-between" className={style.header}>
        <Logo />
        <Typography.Link>Feedback</Typography.Link>
      </Flex>
      <div>
        {/* <UploadCard /> */}
        <Row>
          <Col span={24}>
            <Flex align="center" justify="space-between" className={style.menu}>
              <Button icon={<PlusOutlined />} type="primary">
                Batch Add
              </Button>
              <Space>
                <Button icon={<ClearOutlined />} danger type="primary" />
                <Button icon={<SettingOutlined />} type="primary" />
                <Button icon={<DownloadOutlined />} type="primary" />
              </Space>
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
