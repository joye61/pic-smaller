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
import { DefaultCompressOption, homeState } from "@/states/home";
import { CompressOption } from "@/uitls/ImageInfo";
import { gstate } from "@/global";
import { useState } from "react";

export const CompressOptionPannel = observer(() => {
  const { token } = theme.useToken();
  const [option, setOption] = useState<CompressOption>(homeState.option);
  const update = (data: Partial<CompressOption>) => {
    setOption({ ...option, ...data });
  };

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
  if (option.scale === "toWidth") {
    input = (
      <InputNumber
        min={0}
        step={1}
        placeholder={gstate.locale?.optionPannel?.widthPlaceholder}
        value={option.toWidth}
        onChange={(value) => {
          update({ toWidth: value! });
        }}
      />
    );
  } else if (option.scale === "toHeight") {
    input = (
      <InputNumber
        min={0}
        step={1}
        placeholder={gstate.locale?.optionPannel?.heightPlaceholder}
        value={option.toHeight}
        onChange={(value) => {
          update({ toHeight: value! });
        }}
      />
    );
  }

  return (
    <div className={style.container}>
      <Tabs
        type="card"
        items={tabItems}
        activeKey={option.scale}
        onChange={(activeKey) => {
          const newOption: Partial<CompressOption> = {
            scale: activeKey as CompressOption["scale"],
          };
          if (activeKey === "toWidth") {
            newOption.toHeight = undefined;
          }
          if (activeKey === "toHeight") {
            newOption.toWidth = undefined;
          }
          update(newOption);
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
          <Slider
            defaultValue={DefaultCompressOption.quality}
            value={option.quality}
            onChange={(value) => {
              update({ quality: value });
            }}
          />
        </div>
      </div>

      <Flex justify="flex-end">
        <Space>
          <Button
            onClick={async () => {
              update(DefaultCompressOption);
              await homeState.updateCompressOption(DefaultCompressOption);
            }}
          >
            {gstate.locale?.optionPannel?.resetBtn}
          </Button>
          <Button
            type="primary"
            onClick={() => {
              homeState.updateCompressOption(option);
            }}
          >
            {gstate.locale?.optionPannel?.confirmBtn}
          </Button>
        </Space>
      </Flex>
    </div>
  );
});
