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

export const CompressOptionPannel = observer(() => {
  const { token } = theme.useToken();

  const tabItems: TabsProps["items"] = [
    {
      key: "unChanged",
      label: gstate.locale?.optionPannel.unChanged,
    },
    {
      key: "toWidth",
      label: gstate.locale?.optionPannel?.toWidth,
      icon: <ColumnWidthOutlined />,
    },
    {
      key: "toHeight",
      label: gstate.locale?.optionPannel?.toHeight,
      icon: <ColumnHeightOutlined />,
    },
  ];

  // 显示输入框逻辑
  let input: React.ReactNode = null;
  if (homeState.option.scale === "toWidth") {
    input = (
      <InputNumber
        min={0}
        step={1}
        placeholder={gstate.locale?.optionPannel?.widthPlaceholder}
      />
    );
  } else if (homeState.option.scale === "toHeight") {
    input = (
      <InputNumber
        min={0}
        step={1}
        placeholder={gstate.locale?.optionPannel?.heightPlaceholder}
      />
    );
  }

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

      <div className={style.scaleInput}>{input}</div>

      <div className={style.quality}>
        <Typography.Text>
          {gstate.locale?.optionPannel?.qualityTitle}
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
          <Button>{gstate.locale?.optionPannel?.resetBtn}</Button>
          <Button type="primary">
            {gstate.locale?.optionPannel?.confirmBtn}
          </Button>
        </Space>
      </Flex>
    </div>
  );
});
