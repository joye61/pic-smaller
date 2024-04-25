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
import { gstate } from "@/global";

const locale = gstate.locale?.optionPannel;

const tabItems: TabsProps["items"] = [
  {
    key: "unChanged",
    label: locale?.unChanged,
  },
  {
    key: "toWidth",
    label: locale?.toWidth,
    icon: <ColumnWidthOutlined />,
  },
  {
    key: "toHeight",
    label: locale?.toHeight,
    icon: <ColumnHeightOutlined />,
  },
];

/**
 * 输入框逻辑
 * @returns
 */
function showInput() {
  if (homeState.option.scale === "toWidth") {
    return (
      <InputNumber min={0} step={1} placeholder={locale?.widthPlaceholder} />
    );
  }
  if (homeState.option.scale === "toHeight") {
    return (
      <InputNumber min={0} step={1} placeholder={locale?.heightPlaceholder} />
    );
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
        <Typography.Text>{locale?.qualityTitle}</Typography.Text>
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
          <Button>{locale?.resetBtn}</Button>
          <Button type="primary">{locale?.confirmBtn}</Button>
        </Space>
      </Flex>
    </div>
  );
});
