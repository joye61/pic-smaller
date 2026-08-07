import { ArrowDown, ArrowUp } from "lucide-react";
import style from "./index.module.scss";

interface CompressionRateProps {
  originSize: number;
  outputSize?: number;
}

export function CompressionRate({ originSize, outputSize }: CompressionRateProps) {
  if (outputSize === undefined || originSize <= 0) return <>-</>;

  const difference = outputSize - originSize;
  const rate = Math.abs((difference * 100) / originSize).toFixed(2);

  if (difference < 0) {
    return <strong className={style.positive}>{rate}% <ArrowDown size={14} /></strong>;
  }
  if (difference > 0) {
    return <strong className={style.negative}>{rate}% <ArrowUp size={14} /></strong>;
  }
  return <strong className={style.neutral}>0.00%</strong>;
}
