import style from "./index.module.scss";
import clsx from "classnames";

export interface IndicatorProps {
  size?: "large";
  white?: boolean;
}

export function Indicator({ size, white = false }: IndicatorProps) {
  const bars = [];
  for (let i = 0; i < 10; i++) {
    bars.push(<div key={i} />);
  }
  return (
    <div
      className={clsx(
        style.container,
        size === "large" && style.large,
        white && style.white,
      )}
    >
      {bars}
    </div>
  );
}
