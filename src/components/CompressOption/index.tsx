import { observer } from "mobx-react-lite";
import style from "./index.module.scss";
import { homeState } from "@/states/home";
import { gstate } from "@/global";
import { getImageMime, Mimes, OutputFormats } from "@/mimes";
import { MAX_CANVAS_DIMENSION, PAPER_SIZES } from "@/engines/ImageBase";
import { Select } from "@/components/Select";
import { getCompressionOptionVisibility } from "@/options";

type ResizeMethod = typeof homeState.tempOption.resize.method;

type NumberFieldProps = {
  value?: number;
  min?: number;
  max?: number;
  placeholder?: string;
  disabled: boolean;
  onChange: (value?: number) => void;
};

function NumberField({ value, min = 0, max = MAX_CANVAS_DIMENSION, placeholder, disabled, onChange }: NumberFieldProps) {
  return (
    <input type="number" value={value ?? ""} min={min} max={max} step={1} placeholder={placeholder} disabled={disabled} onChange={(event) => { const nextValue = event.target.value; onChange(nextValue === "" ? undefined : Number(nextValue)); }} />
  );
}

type RangeFieldProps = {
  label?: string;
  value: number;
  min: number;
  max: number;
  step: number;
  disabled: boolean;
  onChange: (value: number) => void;
};

function RangeField({ label, value, min, max, step, disabled, onChange }: RangeFieldProps) {
  return (
    <label className={style.rangeField}>
      <span>{label}<b>{value}</b></span>
      <input type="range" value={value} min={min} max={max} step={step} disabled={disabled} onChange={(event) => onChange(Number(event.target.value))} />
    </label>
  );
}

export const CompressOption = observer(() => {
  const disabled = homeState.hasTaskRunning();
  const locale = gstate.locale?.optionPannel;
  const resize = homeState.tempOption.resize;
  const resizeMethod = resize.method;
  const targetFormat = homeState.tempOption.format.target;
  const sourceMimes = Array.from(homeState.list.values(), (item) =>
    getImageMime({ name: item.name, type: item.blob.type })
  );
  const optionVisibility = getCompressionOptionVisibility(
    sourceMimes,
    targetFormat,
  );
  const showJpegOptions = optionVisibility.jpeg;
  const showPngOptions = optionVisibility.png;
  const showGifOptions = optionVisibility.gif;
  const showAvifOptions = optionVisibility.avif;
  const showJpegExtreme = targetFormat
    ? Mimes[targetFormat] === Mimes.jpg
    : sourceMimes.length === 0 || sourceMimes.includes(Mimes.jpg);
  const preset = resizeMethod === "presetCrop"
    ? resize.presetCrop ?? { paperSize: "a4", orientation: "portrait" as const, reference: "width" as const, cropPx: 0, offsetPx: 0 }
    : null;

  const setResizeMethod = (method: ResizeMethod) => {
    homeState.tempOption.resize = {
      method,
      width: undefined,
      height: undefined,
      short: undefined,
      long: undefined,
      cropWidthRatio: undefined,
      cropHeightRatio: undefined,
      cropWidthSize: undefined,
      cropHeightSize: undefined,
      presetCrop: method === "presetCrop"
        ? { paperSize: "a4", orientation: "portrait", reference: "width", cropPx: 0, offsetPx: 0 }
        : undefined,
    };
  };

  const pairField = (first: React.ReactNode, separator: string, second: React.ReactNode) => (
    <div className={style.pairField}>{first}<span>{separator}</span>{second}</div>
  );

  const resizeOptions = [
    { value: "fitWidth", label: locale?.fitWidth ?? "" },
    { value: "fitHeight", label: locale?.fitHeight ?? "" },
    { value: "setShort", label: locale?.setShort ?? "" },
    { value: "setLong", label: locale?.setLong ?? "" },
    { value: "setCropRatio", label: locale?.setCropRatio ?? "" },
    { value: "setCropSize", label: locale?.setCropSize ?? "" },
    { value: "presetCrop", label: locale?.presetCrop ?? "" },
  ];

  let resizeField: React.ReactNode = null;
  if (resizeMethod === "fitWidth") {
    resizeField = <NumberField value={resize.width} disabled={disabled} placeholder={locale?.widthPlaceholder} onChange={(value) => { resize.width = value; }} />;
  } else if (resizeMethod === "fitHeight") {
    resizeField = <NumberField value={resize.height} disabled={disabled} placeholder={locale?.heightPlaceholder} onChange={(value) => { resize.height = value; }} />;
  } else if (resizeMethod === "setShort") {
    resizeField = <NumberField value={resize.short} disabled={disabled} placeholder={locale?.shortPlaceholder} onChange={(value) => { resize.short = value; }} />;
  } else if (resizeMethod === "setLong") {
    resizeField = <NumberField value={resize.long} disabled={disabled} placeholder={locale?.longPlaceholder} onChange={(value) => { resize.long = value; }} />;
  } else if (resizeMethod === "setCropRatio") {
    resizeField = pairField(
      <NumberField value={resize.cropWidthRatio} min={1} disabled={disabled} placeholder={locale?.cwRatioPlaceholder} onChange={(value) => { resize.cropWidthRatio = value; }} />,
      ":",
      <NumberField value={resize.cropHeightRatio} min={1} disabled={disabled} placeholder={locale?.chRatioPlaceholder} onChange={(value) => { resize.cropHeightRatio = value; }} />,
    );
  } else if (resizeMethod === "setCropSize") {
    resizeField = pairField(
      <NumberField value={resize.cropWidthSize} min={1} disabled={disabled} placeholder={locale?.cwSizePlaceholder} onChange={(value) => { resize.cropWidthSize = value; }} />,
      "x",
      <NumberField value={resize.cropHeightSize} min={1} disabled={disabled} placeholder={locale?.chSizePlaceholder} onChange={(value) => { resize.cropHeightSize = value; }} />,
    );
  }

  let presetWarning = false;
  if (preset && homeState.list.size > 0) {
    for (const item of homeState.list.values()) {
      const paper = PAPER_SIZES[preset.paperSize];
      if (!paper) { presetWarning = true; break; }
      const ratioWidth = preset.orientation === "landscape" ? paper.height : paper.width;
      const ratioHeight = preset.orientation === "landscape" ? paper.width : paper.height;
      const referenceDimension = preset.reference === "width" ? item.width : item.height;
      const otherDimension = preset.reference === "width" ? item.height : item.width;
      const referenceRatio = preset.reference === "width" ? ratioWidth : ratioHeight;
      const otherRatio = preset.reference === "width" ? ratioHeight : ratioWidth;
      const cropPx = preset.cropPx ?? 0;
      const offsetPx = preset.offsetPx ?? 0;
      const remaining = referenceDimension - Math.max(0, cropPx + offsetPx) - Math.max(0, cropPx - offsetPx);
      if (remaining <= 0 || Math.round(remaining * otherRatio / referenceRatio) > otherDimension) {
        presetWarning = true;
        break;
      }
    }
  }

  return (
    <div className={style.container}>
      <section>
        <h4>{locale?.resizeLable}</h4>
        <Select value={resizeMethod} options={resizeOptions} placeholder={locale?.resizePlaceholder} disabled={disabled} onChange={(value) => setResizeMethod(value as ResizeMethod)} onClear={() => setResizeMethod(undefined)} />
        {resizeField && <div className={style.fieldGap}>{resizeField}</div>}
        {preset && (
          <div className={style.presetGrid}>
            <label><span>{locale?.presetPaperSize}</span><Select value={preset.paperSize} options={Object.entries(PAPER_SIZES).map(([value, paper]) => ({ value, label: paper.label }))} disabled={disabled} onChange={(value) => { preset.paperSize = value; }} /></label>
            <label><span>{locale?.presetOrientation}</span><Select value={preset.orientation} options={[{ value: "portrait", label: locale?.presetPortrait ?? "" }, { value: "landscape", label: locale?.presetLandscape ?? "" }]} disabled={disabled} onChange={(value) => { preset.orientation = value as "portrait" | "landscape"; }} /></label>
            <label><span>{locale?.presetRefWidth}</span><Select value={preset.reference} options={[{ value: "width", label: locale?.presetRefWidth ?? "" }, { value: "height", label: locale?.presetRefHeight ?? "" }]} disabled={disabled} onChange={(value) => { preset.reference = value as "width" | "height"; }} /></label>
            <label><span>{locale?.presetCropPx}</span><NumberField value={preset.cropPx} min={0} max={1000} disabled={disabled} onChange={(value) => { preset.cropPx = value; }} /></label>
            <label><span>{locale?.presetOffsetPx}</span><NumberField value={preset.offsetPx} min={-500} max={500} disabled={disabled} onChange={(value) => { preset.offsetPx = value; }} /></label>
            {presetWarning && <div className={style.warning}><span>{locale?.presetCropWarning}</span><button type="button" onClick={() => { preset.reference = preset.reference === "width" ? "height" : "width"; }}>{locale?.presetSwitchRef}</button><button type="button" onClick={() => setResizeMethod(undefined)}>{locale?.presetCancelCrop}</button></div>}
          </div>
        )}
      </section>

      <section>
        <h4>{locale?.outputFormat}</h4>
        <Select value={homeState.tempOption.format.target} options={OutputFormats.map((format) => ({ value: format, label: format === "jpg" ? "JPEG" : format.toUpperCase() }))} placeholder={locale?.outputFormatPlaceholder} disabled={disabled} onChange={(value) => { homeState.tempOption.format.target = value as typeof homeState.tempOption.format.target; }} onClear={() => { homeState.tempOption.format.target = undefined; }} />
        {["jpg", "jpeg"].includes(homeState.tempOption.format.target ?? "") && <label className={style.colorField}><span>{locale?.transparentFillDesc}</span><input type="color" disabled={disabled} value={homeState.tempOption.format.transparentFill} onChange={(event) => { homeState.tempOption.format.transparentFill = event.target.value.toUpperCase(); }} /></label>}
      </section>

      {showJpegOptions && <section><h4>{locale?.jpegLable}</h4><RangeField label={locale?.qualityTitle} value={homeState.tempOption.jpeg.quality} min={0} max={1} step={0.01} disabled={disabled} onChange={(value) => { homeState.tempOption.jpeg.quality = value; }} />{showJpegExtreme && <label className={style.extremeField}><input type="checkbox" checked={homeState.tempOption.jpeg.extreme} disabled={disabled} onChange={(event) => { homeState.tempOption.jpeg.extreme = event.target.checked; }} /><span><b>{locale?.extremeMode}</b><small>{locale?.extremeModeHint}</small></span></label>}</section>}
      {showPngOptions && <section><h4>{locale?.pngLable}</h4><RangeField label={locale?.colorsDesc} value={homeState.tempOption.png.colors} min={2} max={256} step={1} disabled={disabled} onChange={(value) => { homeState.tempOption.png.colors = value; }} /><RangeField label={locale?.pngDithering} value={homeState.tempOption.png.dithering} min={0} max={1} step={0.01} disabled={disabled} onChange={(value) => { homeState.tempOption.png.dithering = value; }} /><label className={style.extremeField}><input type="checkbox" checked={homeState.tempOption.png.extreme} disabled={disabled} onChange={(event) => { homeState.tempOption.png.extreme = event.target.checked; }} /><span><b>{locale?.extremeMode}</b><small>{locale?.extremeModeHint}</small></span></label></section>}
      {showGifOptions && <section><h4>{locale?.gifLable}</h4><label className={style.checkField}><input type="checkbox" checked={homeState.tempOption.gif.dithering} disabled={disabled} onChange={(event) => { homeState.tempOption.gif.dithering = event.target.checked; }} /><span>{locale?.gifDithering}</span></label><RangeField label={locale?.colorsDesc} value={homeState.tempOption.gif.colors} min={2} max={256} step={1} disabled={disabled} onChange={(value) => { homeState.tempOption.gif.colors = value; }} /></section>}
      {showAvifOptions && <section><h4>{locale?.avifLable}</h4><RangeField label={locale?.avifQuality} value={homeState.tempOption.avif.quality} min={1} max={100} step={1} disabled={disabled} onChange={(value) => { homeState.tempOption.avif.quality = value; }} /><RangeField label={locale?.avifSpeed} value={homeState.tempOption.avif.speed} min={1} max={10} step={1} disabled={disabled} onChange={(value) => { homeState.tempOption.avif.speed = value; }} /></section>}
    </div>
  );
});
