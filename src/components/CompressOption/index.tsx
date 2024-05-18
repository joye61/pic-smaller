import { Checkbox, Divider, InputNumber, Select, Slider } from "antd";
import style from "./index.module.scss";
import { observer } from "mobx-react-lite";
import { DefaultCompressOption, homeState } from "@/states/home";
import { gstate } from "@/global";
import { OptionItem } from "../OptionItem";

export const CompressOption = observer(() => {
  const resizeMethod = homeState.tempOption.resizeMethod;
  const resizeOptions = [
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

  // 显示输入框逻辑
  let input: React.ReactNode = null;
  if (resizeMethod === "toWidth") {
    input = (
      <InputNumber
        min={0}
        step={1}
        placeholder={gstate.locale?.optionPannel?.widthPlaceholder}
        value={homeState.tempOption.resizeWidth}
        onChange={(value) => {
          homeState.tempOption.resizeWidth = value!;
        }}
      />
    );
  } else if (resizeMethod === "toHeight") {
    input = (
      <InputNumber
        min={0}
        step={1}
        placeholder={gstate.locale?.optionPannel?.heightPlaceholder}
        value={homeState.tempOption.resizeHeight}
        onChange={(value) => {
          homeState.tempOption.resizeHeight = value!;
        }}
      />
    );
  }

  const disabled = homeState.hasTaskRunning();

  return (
    <>
      <Divider orientation="left" orientationMargin="0">
        {gstate.locale?.optionPannel.resizeLable}
      </Divider>
      <OptionItem>
        <Select
          style={{ width: "100%" }}
          value={resizeMethod}
          options={resizeOptions}
          disabled={disabled}
          onChange={(value) => {
            homeState.tempOption.resizeMethod = value;
            homeState.tempOption.resizeWidth = undefined;
            homeState.tempOption.resizeHeight = undefined;
          }}
        />

        {input && <div className={style.resizeInput}>{input}</div>}
      </OptionItem>

      <Divider orientation="left" orientationMargin="0">
        {gstate.locale?.optionPannel.jpegLable}
      </Divider>

      <OptionItem desc={gstate.locale?.optionPannel?.qualityTitle}>
        <Slider
          defaultValue={DefaultCompressOption.jpeg.quality}
          value={homeState.tempOption.jpeg.quality}
          min={0}
          max={1}
          step={0.01}
          disabled={disabled}
          onChange={(value) => {
            homeState.tempOption.jpeg.quality = value;
          }}
        />
      </OptionItem>

      <Divider orientation="left" orientationMargin="0">
        {gstate.locale?.optionPannel.pngLable}
      </Divider>

      <OptionItem desc={gstate.locale?.optionPannel.colorsDesc}>
        <Slider
          defaultValue={DefaultCompressOption.png.colors}
          value={homeState.tempOption.png.colors}
          min={2}
          max={256}
          step={1}
          disabled={disabled}
          onChange={(value) => {
            homeState.tempOption.png.colors = value;
          }}
        />
      </OptionItem>

      <OptionItem desc={gstate.locale?.optionPannel.pngDithering}>
        <Slider
          defaultValue={DefaultCompressOption.png.dithering}
          value={homeState.tempOption.png.dithering}
          min={0}
          max={1}
          step={0.01}
          disabled={disabled}
          onChange={(value) => {
            homeState.tempOption.png.dithering = value;
          }}
        />
      </OptionItem>

      <Divider orientation="left" orientationMargin="0">
        {gstate.locale?.optionPannel.gifLable}
      </Divider>

      <OptionItem>
        <Checkbox
          checked={homeState.tempOption.gif.dithering}
          disabled={disabled}
          onChange={(event) => {
            homeState.tempOption.gif.dithering = event.target.checked;
          }}
        >
          {gstate.locale?.optionPannel.gifDithering}
        </Checkbox>
      </OptionItem>

      <OptionItem desc={gstate.locale?.optionPannel.colorsDesc}>
        <Slider
          defaultValue={DefaultCompressOption.gif.colors}
          value={homeState.tempOption.gif.colors}
          min={2}
          max={256}
          step={1}
          disabled={disabled}
          onChange={(value) => {
            homeState.tempOption.gif.colors = value;
          }}
        />
      </OptionItem>
    </>
  );
});
