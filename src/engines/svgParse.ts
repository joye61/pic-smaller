/**
 * Reference: https://github.com/image-size/image-size/blob/main/lib/types/svg.ts
 */

import { Dimension } from "./ImageBase";

type IAttributes = {
  width: number | null;
  height: number | null;
  viewbox?: IAttributes | null;
};

const svgReg = /<svg\s([^>"']|"[^"]*"|'[^']*')*>/;

const extractorRegExps = {
  height: /\sheight=(['"])([^%]+?)\1/,
  root: svgReg,
  viewbox: /\sviewBox=(['"])(.+?)\1/i,
  width: /\swidth=(['"])([^%]+?)\1/,
};

const INCH_CM = 2.54;
const units: { [unit: string]: number } = {
  in: 96,
  cm: 96 / INCH_CM,
  em: 16,
  ex: 8,
  m: (96 / INCH_CM) * 100,
  mm: 96 / INCH_CM / 10,
  pc: 96 / 72 / 12,
  pt: 96 / 72,
  px: 1,
};

const unitsReg = new RegExp(
  `^([0-9.]+(?:e\\d+)?)(${Object.keys(units).join("|")})?$`,
);

function setSvgAttribute(root: string, name: string, value: string) {
  const attribute = new RegExp(`\\s${name}\\s*=\\s*(["']).*?\\1`, "i");
  if (attribute.test(root)) {
    return root.replace(attribute, ` ${name}="${value}"`);
  }
  return root.replace(/<svg\b/i, `<svg ${name}="${value}"`);
}

export function applySvgDimension(
  source: string,
  original: { width: number; height: number },
  dimension: Dimension,
  crop: boolean,
) {
  const rootMatch = source.match(/<svg\b[^>]*>/i);
  if (!rootMatch) return source;

  let root = rootMatch[0];
  root = setSvgAttribute(root, "width", String(dimension.width));
  root = setSvgAttribute(root, "height", String(dimension.height));

  if (crop) {
    const viewBoxMatch = root.match(/\sviewBox\s*=\s*(["'])(.*?)\1/i);
    const values = viewBoxMatch?.[2].trim().split(/[\s,]+/).map(Number);
    const validViewBox = values?.length === 4 && values.every(Number.isFinite);
    const [minX, minY, viewWidth, viewHeight] = validViewBox
      ? values
      : [0, 0, original.width, original.height];
    const scaleX = viewWidth / original.width;
    const scaleY = viewHeight / original.height;
    const viewBox = [
      minX + dimension.x * scaleX,
      minY + dimension.y * scaleY,
      dimension.width * scaleX,
      dimension.height * scaleY,
    ].map((value) => Number(value.toFixed(4))).join(" ");
    root = setSvgAttribute(root, "viewBox", viewBox);
  }

  return source.replace(rootMatch[0], root);
}

function parseLength(len: string) {
  const m = unitsReg.exec(len);
  if (!m) {
    return undefined;
  }
  return Math.round(Number(m[1]) * (units[m[2]] || 1));
}

function parseViewbox(viewbox: string): IAttributes {
  const bounds = viewbox.split(" ");
  return {
    height: parseLength(bounds[3]) as number,
    width: parseLength(bounds[2]) as number,
  };
}

function parseAttributes(root: string): IAttributes {
  const width = root.match(extractorRegExps.width);
  const height = root.match(extractorRegExps.height);
  const viewbox = root.match(extractorRegExps.viewbox);
  return {
    height: height && (parseLength(height[2]) as number),
    viewbox: viewbox && (parseViewbox(viewbox[2]) as IAttributes),
    width: width && (parseLength(width[2]) as number),
  };
}

function calculateByDimensions(attrs: IAttributes): Dimension {
  return {
    x: 0,
    y: 0,
    height: attrs.height as number,
    width: attrs.width as number,
  };
}

function calculateByViewbox(
  attrs: IAttributes,
  viewbox: IAttributes,
): Dimension {
  const ratio = (viewbox.width as number) / (viewbox.height as number);
  if (attrs.width) {
    return {
      x: 0,
      y: 0,
      height: Math.floor(attrs.width / ratio),
      width: attrs.width,
    };
  }
  if (attrs.height) {
    return {
      x: 0,
      y: 0,
      height: attrs.height,
      width: Math.floor(attrs.height * ratio),
    };
  }
  return {
    x: 0,
    y: 0,
    height: viewbox.height as number,
    width: viewbox.width as number,
  };
}

export function getSvgDimension(input: string): Dimension {
  const root = input.match(extractorRegExps.root);
  if (root) {
    const attrs = parseAttributes(root[0]);
    if (attrs.width && attrs.height) {
      return calculateByDimensions(attrs);
    }
    if (attrs.viewbox) {
      return calculateByViewbox(attrs, attrs.viewbox);
    }
  }
  throw new TypeError("Invalid SVG");
}
