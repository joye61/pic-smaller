import {
  Button,
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
import { PAPER_SIZES } from "@/engines/ImageBase";

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
    {
      value: "presetCrop",
      label: gstate.locale?.optionPannel?.presetCrop,
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

  const paperSizeOptions = Object.entries(PAPER_SIZES).map(([key, val]) => ({
    value: key,
    label: val.label,
  }));

  const pc = resizeMethod === "presetCrop" ? (homeState.tempOption.resize.presetCrop || {
    paperSize: "a4",
    orientation: "portrait" as const,
    reference: "width" as const,
    cropPx: 0,
    offsetPx: 0,
  }) : null;

  let presetCropWarning = false;
  if (pc && homeState.list.size > 0) {
    for (const [_, item] of homeState.list) {
      const paper = PAPER_SIZES[pc.paperSize];
      if (!paper) { presetCropWarning = true; break; }
      let ratioW = paper.width;
      let ratioH = paper.height;
      if (pc.orientation === "landscape") {
        ratioW = paper.height;
        ratioH = paper.width;
      }
      const refIsWidth = pc.reference === "width";
      const refDim = refIsWidth ? item.width : item.height;
      const otherDim = refIsWidth ? item.height : item.width;
      const ratioRef = refIsWidth ? ratioW : ratioH;
      const ratioOther = refIsWidth ? ratioH : ratioW;
      const cropStart = Math.max(0, (pc.cropPx || 0) + (pc.offsetPx || 0));
      const cropEnd = Math.max(0, (pc.cropPx || 0) - (pc.offsetPx || 0));
      const newRefDim = refDim - cropStart - cropEnd;
      if (newRefDim <= 0) { presetCropWarning = true; break; }
      const newOtherDim = Math.round(newRefDim * (ratioOther / ratioRef));
      if (newOtherDim > otherDim) { presetCropWarning = true; break; }
    }
  }

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
  } else if (resizeMethod === "presetCrop" && pc) {
    input = (
      <div className={style.presetCropInput}>
        <div className={style.presetRow}>
          <span>{gstate.locale?.optionPannel?.presetPaperSize}</span>
          <Select
            value={pc.paperSize}
            options={paperSizeOptions}
            disabled={disabled}
            onChange={(value) => {
              homeState.tempOption.resize = {
                ...homeState.tempOption.resize,
                presetCrop: { ...pc, paperSize: value },
              };
            }}
          />
        </div>
        <div className={style.presetRow}>
          <span>{gstate.locale?.optionPannel?.presetOrientation}</span>
          <Select
            value={pc.orientation}
            options={[
              { value: "portrait", label: gstate.locale?.optionPannel?.presetPortrait },
              { value: "landscape", label: gstate.locale?.optionPannel?.presetLandscape },
            ]}
            disabled={disabled}
            onChange={(value) => {
              homeState.tempOption.resize = {
                ...homeState.tempOption.resize,
                presetCrop: { ...pc, orientation: value },
              };
            }}
          />
        </div>
        <div className={style.presetRow}>
          <span>{gstate.locale?.optionPannel?.presetRefWidth}</span>
          <Select
            value={pc.reference}
            options={[
              { value: "width", label: gstate.locale?.optionPannel?.presetRefWidth },
              { value: "height", label: gstate.locale?.optionPannel?.presetRefHeight },
            ]}
            disabled={disabled}
            onChange={(value) => {
              homeState.tempOption.resize = {
                ...homeState.tempOption.resize,
                presetCrop: { ...pc, reference: value },
              };
            }}
          />
        </div>
        <div className={style.presetRow}>
          <span>{gstate.locale?.optionPannel?.presetCropPx}</span>
          <InputNumber
            min={0}
            max={1000}
            step={1}
            disabled={disabled}
            value={pc.cropPx}
            onChange={(value) => {
              homeState.tempOption.resize = {
                ...homeState.tempOption.resize,
                presetCrop: { ...pc, cropPx: value ?? 0 },
              };
            }}
          />
        </div>
        <div className={style.presetRow}>
          <span>{gstate.locale?.optionPannel?.presetOffsetPx}</span>
          <InputNumber
            min={-500}
            max={500}
            step={1}
            disabled={disabled}
            value={pc.offsetPx}
            onChange={(value) => {
              homeState.tempOption.resize = {
                ...homeState.tempOption.resize,
                presetCrop: { ...pc, offsetPx: value ?? 0 },
              };
            }}
          />
        </div>
        {presetCropWarning && (
          <div className={style.presetWarning}>
            <span>{gstate.locale?.optionPannel?.presetCropWarning}</span>
            <div className={style.warningActions}>
              <Button size="small" onClick={() => {
                homeState.tempOption.resize = {
                  ...homeState.tempOption.resize,
                  presetCrop: { ...pc, reference: pc.reference === "width" ? "height" : "width" },
                };
              }}>
                {gstate.locale?.optionPannel?.presetSwitchRef}
              </Button>
              <Button size="small" onClick={() => {
                homeState.tempOption.resize = {
                  method: undefined,
                  width: undefined,
                  height: undefined,
                  short: undefined,
                  long: undefined,
                  cropWidthRatio: undefined,
                  cropHeightRatio: undefined,
                  cropWidthSize: undefined,
                  cropHeightSize: undefined,
                };
              }}>
                {gstate.locale?.optionPannel?.presetCancelCrop}
              </Button>
            </div>
          </div>
        )}
      </div>
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
      <div className={style.olabel}>
        {gstate.locale?.optionPannel.resizeLable}
      </div>
      <OptionItem>
        <Select
          style={{ width: "100%" }}
          value={resizeMethod}
          options={resizeOptions}
          disabled={disabled}
          placeholder={gstate.locale?.optionPannel.resizePlaceholder}
          allowClear
          onChange={(value) => {
            const base = {
              method: value,
              width: undefined,
              height: undefined,
              short: undefined,
              long: undefined,
              cropWidthRatio: undefined,
              cropHeightRatio: undefined,
              cropWidthSize: undefined,
              cropHeightSize: undefined,
            } as any;
            if (value === "presetCrop") {
              homeState.tempOption.resize = {
                ...base,
                presetCrop: {
                  paperSize: "a4",
                  orientation: "portrait",
                  reference: "width",
                  cropPx: 0,
                  offsetPx: 0,
                },
              };
            } else {
              homeState.tempOption.resize = base;
            }
          }}
        />
        {input}
      </OptionItem>

      <Divider />

      <div className={style.olabel}>
        {gstate.locale?.optionPannel.outputFormat}
      </div>
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

      <Divider />
      <div className={style.olabel}>
        {gstate.locale?.optionPannel.jpegLable}
      </div>

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

      <Divider />
      <div className={style.olabel}>{gstate.locale?.optionPannel.pngLable}</div>

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

      <Divider />
      <div className={style.olabel}>{gstate.locale?.optionPannel.gifLable}</div>

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
          <Divider />
          <div className={style.olabel}>
            {gstate.locale?.optionPannel.avifLable}
          </div>

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
