import { observer } from "mobx-react-lite";
import style from "./index.module.scss";
import { gstate } from "@/global";
import { homeState } from "@/states/home";
import { formatSize } from "@/functions";
import { useResponse } from "@/media";
import { CompressionRate } from "@/components/CompressionRate";

export const ProgressHint = observer(() => {
  const info = homeState.getProgressHintInfo();
  const { isMobile } = useResponse();

  return (
    <div className={style.container}>
      <div className={style.track} aria-label={`${info.percent}%`}>
        <span style={{ width: `${info.percent}%` }} />
      </div>
      <div className={style.progress}>
        <span className={style.count}><strong>{info.loadedNum}</strong> / {info.totalNum}</span>
        {!isMobile && (
          <>
            <span>{gstate.locale?.progress.before}: <b>{formatSize(info.originSize)}</b></span>
            <span>{gstate.locale?.progress.after}: <b>{formatSize(info.outputSize)}</b></span>
          </>
        )}
        <span>{gstate.locale?.progress.rate}: <CompressionRate originSize={info.originSize} outputSize={info.outputSize} /></span>
      </div>
    </div>
  );
});
