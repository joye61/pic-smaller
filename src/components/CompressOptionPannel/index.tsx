import {
  Button,
  Flex,
  InputNumber,
  Slider,
  Space,
  Tabs,
  Typography,
  theme,
} from "antd";
import style from "./index.module.scss";
import { observer } from "mobx-react-lite";
import { TabsProps } from "antd/lib";
import { ColumnHeightOutlined, ColumnWidthOutlined } from "@ant-design/icons";
import { homeState } from "@/states/home";
import { CompressOption } from "@/uitls/ImageInfo";

const tabItems: TabsProps["items"] = [
  {
    key: "unChanged",
    label: "无缩放",
  },
  {
    key: "toWidth",
    label: "适应宽度",
    icon: <ColumnWidthOutlined />,
  },
  {
    key: "toHeight",
    label: "适应高度",
    icon: <ColumnHeightOutlined />,
  },
];

/**
 * 输入框逻辑
 * @returns
 */
function showInput() {
  if (homeState.option.scale === "toWidth") {
    return <InputNumber min={0} step={1} placeholder="设置压缩图宽度" />;
  }
  if (homeState.option.scale === "toHeight") {
    return <InputNumber min={0} step={1} placeholder="设置压缩图高度" />;
  }

  return null;
}

export const CompressOptionPannel = observer(() => {
  const { token } = theme.useToken();

  return (
    <div className={style.container}>
      <Tabs
        type="card"
        items={tabItems}
        activeKey={homeState.option.scale}
        onChange={(activeKey) => {
          homeState.option.scale = activeKey as CompressOption["scale"];
        }}
      />

      <div className={style.scaleInput}>{showInput()}</div>

      <div className={style.quality}>
        <Typography.Text>
          设置压缩质量（质量越高，生成图片越大）
        </Typography.Text>
        <div
          style={{
            borderRadius: token.borderRadius,
          }}
        >
          <Slider defaultValue={70} />
        </div>
      </div>

      <Flex justify="flex-end">
        <Space>
          <Button>重置</Button>
          <Button type="primary">确定</Button>
        </Space>
      </Flex>
    </div>
  );
});
