import {
  Checkbox,
  Divider,
  InputNumber,
  Modal,
  Radio,
  Select,
  Slider,
  theme,
} from "antd";
import style from "./index.module.scss";
import { observer } from "mobx-react-lite";
import { DefaultCompressOption, homeState } from "@/states/home";
import { CompressOption } from "@/uitls/ImageInfo";
import { gstate } from "@/global";
import { useEffect, useState } from "react";
import { OptionItem } from "../OptionItem";

export const CompressOptionPannel = observer(() => {
  const { token } = theme.useToken();
  const [option, setOption] = useState<CompressOption>(homeState.option);
  const update = (data: Partial<CompressOption>) => {
    setOption({ ...option, ...data });
  };

  const canSubmit = () => {
    if (
      option.scale === "unChanged" ||
      (option.scale === "toWidth" && typeof option.toWidth === "number") ||
      (option.scale === "toHeight" && typeof option.toHeight === "number")
    ) {
      return true;
    }
    return false;
  };

  useEffect(() => {
    const enter = (event: KeyboardEvent) => {
      if (
        event.key.toUpperCase() === "ENTER" &&
        homeState.showOption &&
        canSubmit()
      ) {
        event.preventDefault();
        homeState.updateCompressOption(option);
      }
    };
    window.addEventListener("keydown", enter);
    return () => {
      window.removeEventListener("keydown", enter);
    };
  }, [option]);

  const scaleOptions = [
    {
      value: "unChanged",
      label: gstate.locale?.optionPannel.unChanged,
    },
    {
      value: "toWidth",
      label: gstate.locale?.optionPannel?.toWidth,
    },
    {
      value: "toHeight",
      label: gstate.locale?.optionPannel?.toHeight,
    },
  ];

  const pngEngineOptions = [
    {
      value: "upng",
      label: gstate.locale?.optionPannel.engineUpng,
    },
    {
      value: "libpng",
      label: gstate.locale?.optionPannel.engineLibPng,
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
    <Modal
      title={gstate.locale?.optionPannel.title}
      width={512}
      centered
      maskClosable
      open={homeState.showOption}
      cancelText={gstate.locale?.optionPannel?.resetBtn}
      okText={gstate.locale?.optionPannel?.confirmBtn}
      okButtonProps={{
        disabled: !canSubmit(),
      }}
      onCancel={async () => {
        update(DefaultCompressOption);
        await homeState.updateCompressOption(DefaultCompressOption);
      }}
      onOk={() => {
        homeState.updateCompressOption(option);
      }}
    >
      <OptionItem desc={gstate.locale?.optionPannel.changeDimension}>
        <Radio.Group
          buttonStyle="solid"
          value={option.scale}
          onChange={(event) => {
            const value = event.target.value;
            const newOption: Partial<CompressOption> = {
              scale: value as CompressOption["scale"],
            };
            if (value === "unChanged") {
              newOption.toHeight = undefined;
              newOption.toWidth = undefined;
            }
            if (value === "toWidth") {
              newOption.toHeight = undefined;
            }
            if (value === "toHeight") {
              newOption.toWidth = undefined;
            }
            update(newOption);
          }}
        >
          {scaleOptions.map((item) => {
            return (
              <Radio.Button key={item.value} value={item.value}>
                {item.label}
              </Radio.Button>
            );
          })}
        </Radio.Group>

        {input && <div className={style.scaleInput}>{input}</div>}
      </OptionItem>

      <Divider orientation="left" orientationMargin="0">
        JPG/JPEG/WEBP
      </Divider>

      <OptionItem desc={gstate.locale?.optionPannel?.qualityTitle}>
        <div
          className={style.commonSlider}
          style={{
            borderRadius: token.borderRadius,
          }}
        >
          <Slider
            defaultValue={DefaultCompressOption.jpeg.quality}
            value={option.jpeg.quality}
            min={0}
            max={1}
            step={0.01}
            onChange={(value) => {
              const jpeg: CompressOption["jpeg"] = {
                quality: value,
              };
              update({ jpeg });
            }}
          />
        </div>
      </OptionItem>

      <Divider orientation="left" orientationMargin="0">
        PNG
      </Divider>

      <OptionItem>
        <Select
          style={{ width: "100%" }}
          value={option.png.engine}
          options={pngEngineOptions}
          onChange={(value) => {
            let png: CompressOption["png"] = {
              ...option.png,
              engine: value,
            };
            if (value === "upng") {
              png.dithering = undefined;
            }
            update({ png });
          }}
        />
      </OptionItem>

      <OptionItem desc={gstate.locale?.optionPannel.colorsDesc}>
        <div
          className={style.commonSlider}
          style={{
            borderRadius: token.borderRadius,
          }}
        >
          <Slider
            defaultValue={DefaultCompressOption.png.colors}
            value={option.png.colors}
            min={2}
            max={256}
            step={1}
            onChange={(value) => {
              let png: CompressOption["png"] = {
                ...option.png,
                colors: value,
              };
              update({ png });
            }}
          />
        </div>
      </OptionItem>

      {option.png.engine === "libpng" && (
        <OptionItem desc={gstate.locale?.optionPannel.pngDithering}>
          <div
            className={style.commonSlider}
            style={{
              borderRadius: token.borderRadius,
            }}
          >
            <Slider
              defaultValue={DefaultCompressOption.png.dithering}
              value={option.png.dithering}
              min={0}
              max={1}
              step={0.01}
              onChange={(value) => {
                let png: CompressOption["png"] = {
                  ...option.png,
                  dithering: value,
                };
                update({ png });
              }}
            />
          </div>
        </OptionItem>
      )}

      <Divider orientation="left" orientationMargin="0">
        GIF
      </Divider>

      <OptionItem desc={gstate.locale?.optionPannel.colorsDesc}>
        <div
          className={style.commonSlider}
          style={{
            borderRadius: token.borderRadius,
          }}
        >
          <Slider
            defaultValue={DefaultCompressOption.gif.colors}
            value={option.gif.colors}
            min={2}
            max={256}
            step={1}
            onChange={(value) => {
              let gif: CompressOption["gif"] = {
                ...option.gif,
                colors: value,
              };
              update({ gif });
            }}
          />
        </div>
      </OptionItem>

      <OptionItem>
        <Checkbox
          checked={option.gif.dither}
          onChange={(event) => {
            console.log(event);
            let gif: CompressOption["gif"] = {
              ...option.gif,
              dither: event.target.checked,
            };
            update({ gif });
          }}
        >
          {gstate.locale?.optionPannel.gifDither}
        </Checkbox>
      </OptionItem>
    </Modal>
  );
});
