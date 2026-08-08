import { observer } from "mobx-react-lite";
import { toJS } from "mobx";
import { Check, RotateCcw, X } from "lucide-react";
import style from "./RightOption.module.scss";
import { CompressOption } from "@/components/CompressOption";
import { gstate } from "@/global";
import { DefaultCompressOption, homeState } from "@/states/home";
import { useEffect } from "react";
import { normalizeCompressOption } from "@/options";

export const RightOption = observer(() => {
  const disabled = homeState.hasTaskRunning();
  const showOption = homeState.showOption;

  useEffect(() => {
    if (!showOption) return;

    const root = document.documentElement;
    const body = document.body;
    const media = window.matchMedia("(max-width: 980px)");
    const previousOverflow = root.style.overflow;
    const previousPaddingRight = body.style.paddingRight;

    const updateScrollLock = () => {
      if (media.matches) {
        const scrollbarWidth = window.innerWidth - root.clientWidth;
        root.style.overflow = "hidden";
        body.style.paddingRight = scrollbarWidth > 0 ? `${scrollbarWidth}px` : "";
      } else {
        root.style.overflow = previousOverflow;
        body.style.paddingRight = previousPaddingRight;
      }
    };

    updateScrollLock();
    media.addEventListener("change", updateScrollLock);

    return () => {
      media.removeEventListener("change", updateScrollLock);
      root.style.overflow = previousOverflow;
      body.style.paddingRight = previousPaddingRight;
    };
  }, [showOption]);

  const reset = () => {
    homeState.showOption = false;
    homeState.tempOption = structuredClone(DefaultCompressOption);
    homeState.option = structuredClone(DefaultCompressOption);
    if (homeState.list.size > 0) homeState.reCompress();
  };

  const apply = () => {
    homeState.showOption = false;
    const option = normalizeCompressOption(toJS(homeState.tempOption));
    homeState.tempOption = structuredClone(option);
    homeState.option = option;
    if (homeState.list.size > 0) homeState.reCompress();
  };

  return (
    <>
      {showOption && <button type="button" className={style.backdrop} aria-label="Close settings" onClick={() => { homeState.showOption = false; }} />}
      <aside className={`${style.side} ${showOption ? style.open : ""}`} aria-label={gstate.locale?.optionPannel.help}>
        <button type="button" className={style.close} aria-label="Close settings" onClick={() => { homeState.showOption = false; }}><X size={20} /></button>
        <div className={style.scroll}><CompressOption /></div>
        <footer>
          <button type="button" className="button" disabled={disabled} onClick={reset}><RotateCcw size={17} />{gstate.locale?.optionPannel.resetBtn}</button>
          <button type="button" className="button buttonPrimary" disabled={disabled} onClick={apply}><Check size={17} />{gstate.locale?.optionPannel.confirmBtn}</button>
        </footer>
      </aside>
    </>
  );
});
