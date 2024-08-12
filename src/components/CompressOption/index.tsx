import {
  Checkbox,
  ColorPicker,
  Divider,
  Flex,
  InputNumber,
  Select,
  Slider,
} from "antd";
import style from "./index.module.scss";
import { observer } from "mobx-react-lite";
import { DefaultCompressOption, homeState } from "@/states/home";
import { gstate } from "@/global";
import { OptionItem } from "../OptionItem";
import { Mimes } from "@/mimes";

export const CompressOption = observer(() => {
  const disabled = homeState.hasTaskRunning();
  const resizeMethod = homeState.tempOption.resize.method;
  const resizeOptions = [
    {
      value: "fitWidth",
      label: gstate.locale?.optionPannel?.fitWidth,
    },
    {
      value: "fitHeight",
      label: gstate.locale?.optionPannel?.fitHeight,
    },
    {
      value: "setShort",
      label: gstate.locale?.optionPannel?.setShort,
    },
    {
      value: "setLong",
      label: gstate.locale?.optionPannel?.setLong,
    },
    {
      value: "setCropRatio",
      label: gstate.locale?.optionPannel?.setCropRatio,
    },
    {
      value: "setCropSize",
      label: gstate.locale?.optionPannel?.setCropSize,
    },
  ];

  const getFormatOptions = () => {
    const options: { label: string; value: string }[] = [];
    Object.keys(Mimes).forEach((mime) => {
      if (!["svg", "gif"].includes(mime)) {
        options.push({
          value: mime,
          label: mime.toUpperCase(),
        });
      }
    });
    return options;
  };

  // You should only allow to resize a side
  let input: React.ReactNode = null;
  if (resizeMethod === "fitWidth") {
    input = (
      <div className={style.resizeInput}>
        <InputNumber
          min={0}
          step={1}
          disabled={disabled}
          placeholder={gstate.locale?.optionPannel?.widthPlaceholder}
          value={homeState.tempOption.resize.width}
          onChange={(value) => {
            homeState.tempOption.resize.width = value!;
          }}
        />
      </div>
    );
  } else if (resizeMethod === "fitHeight") {
    input = (
      <div className={style.resizeInput}>
        <InputNumber
          min={0}
          step={1}
          disabled={disabled}
          placeholder={gstate.locale?.optionPannel?.heightPlaceholder}
          value={homeState.tempOption.resize.height}
          onChange={(value) => {
            homeState.tempOption.resize.height = value!;
          }}
        />
      </div>
    );
  } else if (resizeMethod === "setShort") {
    input = (
      <div className={style.resizeInput}>
        <InputNumber
          min={0}
          step={1}
          disabled={disabled}
          placeholder={gstate.locale?.optionPannel?.shortPlaceholder}
          value={homeState.tempOption.resize.short}
          onChange={(value) => {
            homeState.tempOption.resize.short = value!;
          }}
        />
      </div>
    );
  } else if (resizeMethod === "setLong") {
    input = (
      <div className={style.resizeInput}>
        <InputNumber
          min={0}
          step={1}
          disabled={disabled}
          placeholder={gstate.locale?.optionPannel?.longPlaceholder}
          value={homeState.tempOption.resize.long}
          onChange={(value) => {
            homeState.tempOption.resize.long = value!;
          }}
        />
      </div>
    );
  } else if (resizeMethod === "setCropRatio") {
    input = (
      <Flex align="center" className={style.cropInput}>
        <InputNumber
          min={1}
          step={1}
          disabled={disabled}
          placeholder={gstate.locale?.optionPannel?.cwRatioPlaceholder}
          value={homeState.tempOption.resize.cropWidthRatio}
          onChange={(value) => {
            homeState.tempOption.resize.cropWidthRatio = value!;
          }}
        />
        <div>:</div>
        <InputNumber
          min={1}
          step={1}
          disabled={disabled}
          placeholder={gstate.locale?.optionPannel?.chRatioPlaceholder}
          value={homeState.tempOption.resize.cropHeightRatio}
          onChange={(value) => {
            homeState.tempOption.resize.cropHeightRatio = value!;
          }}
        />
      </Flex>
    );
  } else if (resizeMethod === "setCropSize") {
    input = (
      <Flex align="center" className={style.cropInput}>
        <InputNumber
          min={1}
          step={1}
          disabled={disabled}
          placeholder={gstate.locale?.optionPannel?.cwSizePlaceholder}
          value={homeState.tempOption.resize.cropWidthSize}
          onChange={(value) => {
            homeState.tempOption.resize.cropWidthSize = value!;
          }}
        />
        <div>×</div>
        <InputNumber
          min={1}
          step={1}
          disabled={disabled}
          placeholder={gstate.locale?.optionPannel?.chSizePlaceholder}
          value={homeState.tempOption.resize.cropHeightSize}
          onChange={(value) => {
            homeState.tempOption.resize.cropHeightSize = value!;
          }}
        />
      </Flex>
    );
  }

  // JPEG dont't support transparent, when convert to JPEG,
  // we should give an option to choose transparent fill color
  let colorPicker: React.ReactNode = null;
  const target = homeState.tempOption.format.target;
  if (target && ["jpg", "jpeg"].includes(target)) {
    colorPicker = (
      <OptionItem desc={gstate.locale?.optionPannel.transparentFillDesc}>
        <ColorPicker
          showText
          disabledAlpha
          disabled={disabled}
          value={homeState.tempOption.format.transparentFill}
          onChangeComplete={(value) => {
            homeState.tempOption.format.transparentFill =
              "#" + value.toHex().toUpperCase();
          }}
        />
      </OptionItem>
    );
  }

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
          placeholder={gstate.locale?.optionPannel.resizePlaceholder}
          allowClear
          onChange={(value) => {
            homeState.tempOption.resize = {
              method: value,
              width: undefined,
              height: undefined,
              short: undefined,
              long: undefined,
              cropWidthRatio: undefined,
              cropHeightRatio: undefined,
              cropWidthSize: undefined,
              cropHeightSize: undefined,
            };
          }}
        />
        {input}
      </OptionItem>

      <Divider orientation="left" orientationMargin="0">
        {gstate.locale?.optionPannel.outputFormat}
      </Divider>
      <OptionItem>
        <Select
          style={{ width: "100%" }}
          value={homeState.tempOption.format.target}
          options={getFormatOptions()}
          disabled={disabled}
          placeholder={gstate.locale?.optionPannel.outputFormatPlaceholder}
          allowClear
          onChange={(value) => {
            homeState.tempOption.format.target = value;
          }}
        />
      </OptionItem>
      {/* Colorpicker option */}
      {colorPicker}

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

      {Mimes.avif && (
        <>
          <Divider orientation="left" orientationMargin="0">
            {gstate.locale?.optionPannel.avifLable}
          </Divider>

          <OptionItem desc={gstate.locale?.optionPannel.avifQuality}>
            <Slider
              defaultValue={DefaultCompressOption.png.colors}
              value={homeState.tempOption.avif.quality}
              min={1}
              max={100}
              step={1}
              disabled={disabled}
              onChange={(value) => {
                homeState.tempOption.avif.quality = value;
              }}
            />
          </OptionItem>

          <OptionItem desc={gstate.locale?.optionPannel.avifSpeed}>
            <Slider
              defaultValue={DefaultCompressOption.avif.speed}
              value={homeState.tempOption.avif.speed}
              min={1}
              max={10}
              step={1}
              disabled={disabled}
              onChange={(value) => {
                homeState.tempOption.avif.speed = value;
              }}
            />
          </OptionItem>
        </>
      )}
    </>
  );
});
