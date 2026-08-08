import { observer } from "mobx-react-lite";
import { useEffect, useRef, useState } from "react";
import {
  AlertTriangle,
  CheckCircle2,
  Download,
  Eye,
  FolderPlus,
  LoaderCircle,
  Plus,
  RefreshCw,
  Trash2,
} from "lucide-react";
import style from "./LeftContent.module.scss";
import { ImageInput } from "@/components/ImageInput";
import { ProgressHint } from "@/components/ProgressHint";
import { gstate } from "@/global";
import { homeState, type ImageItem } from "@/states/home";
import {
  createDownload,
  formatSize,
  getFilesFromHandle,
  getOutputFileName,
  getUniqNameOnNames,
} from "@/functions";
import { createImageList } from "@/engines/transform";
import { ERROR_ANIMATED_UNSUPPORTED } from "@/engines/animation";
import { CompressionRate } from "@/components/CompressionRate";

function isHeif(item: ImageItem) {
  const extension = item.name.split(".").pop()?.toLowerCase();
  return ["image/heic", "image/heif"].includes(item.blob.type.toLowerCase()) ||
    extension === "heic" || extension === "heif";
}

function IconButton({ label, disabled, danger = false, onClick, children }: {
  label: string;
  disabled?: boolean;
  danger?: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return <button type="button" className={danger ? style.dangerButton : style.iconButton} aria-label={label} title={label} disabled={disabled} onClick={onClick}>{children}</button>;
}

const ResultItem = observer(({ item, disabled, onPreviewUnavailable }: { item: ImageItem; disabled: boolean; onPreviewUnavailable: () => void }) => {
  const completed = Boolean(item.preview && item.compress);
  const hasError = item.status === "error";
  const outputSize = item.compress?.blob.size;
  const reduced = outputSize !== undefined && item.blob.size > outputSize;

  const compare = () => {
    if (!item.compress || homeState.isCropMode()) return;
    if (isHeif(item)) {
      onPreviewUnavailable();
      return;
    }
    homeState.compareId = item.key;
  };

  let statusIcon: React.ReactNode;
  if (hasError) {
    statusIcon = <AlertTriangle size={17} className={style.errorIcon} />;
  } else if (completed) {
    statusIcon = <CheckCircle2 size={17} />;
  } else {
    statusIcon = <LoaderCircle className={style.spin} size={17} />;
  }

  return (
    <article className={style.resultItem}>
      <button type="button" className={style.preview} onClick={compare} disabled={!item.compress || Boolean(homeState.isCropMode())} aria-label={gstate.locale?.previewHelp}>
        {item.preview ? <img src={item.preview.src} alt="" /> : <span />}
        {item.compress && !homeState.isCropMode() && <i><Eye size={18} /></i>}
      </button>
      <div className={style.fileInfo}>
        <div className={style.fileName}>{statusIcon}<strong title={item.name}>{item.name}</strong></div>
        <div className={style.fileMeta}><span>{item.width || "-"} x {item.height || "-"}</span><span>{formatSize(item.blob.size)}</span></div>
      </div>
      <div className={style.outputInfo}>
        <small>{gstate.locale?.columnTitle.newSize}</small>
        <strong className={reduced ? style.success : style.warning}>{outputSize === undefined ? "-" : formatSize(outputSize)}</strong>
        <span>{item.compress ? `${item.compress.width} x ${item.compress.height}` : "-"}</span>
      </div>
      <div className={style.rate}>
        <small>{gstate.locale?.columnTitle.decrease}</small>
        <CompressionRate originSize={item.blob.size} outputSize={outputSize} />
      </div>
      <div className={style.itemActions}>
        <IconButton label={gstate.locale?.listAction.downloadOne ?? "Download"} disabled={disabled || !item.compress} onClick={() => { if (item.compress?.blob) createDownload(getOutputFileName(item, homeState.option), item.compress.blob); }}><Download size={18} /></IconButton>
        <IconButton label={gstate.locale?.listAction.removeOne ?? "Remove"} danger disabled={disabled} onClick={() => homeState.remove(item.key)}><Trash2 size={18} /></IconButton>
      </div>
      {item.processError && (() => {
        const errorText = item.processError === ERROR_ANIMATED_UNSUPPORTED
          ? gstate.locale?.errors.animatedUnsupported ?? item.processError
          : item.processError;
        return (
          <div className={style.errorTooltip} title={errorText}>
            <AlertTriangle size={14} />
            <span>{errorText}</span>
          </div>
        );
      })()}
      {item.preservedOriginal && (
        <div className={style.noticeTooltip}>
          <AlertTriangle size={14} />
          <span>{gstate.locale?.heif.originalPreserved}</span>
        </div>
      )}
    </article>
  );
});

function takeItems(items: IterableIterator<ImageItem>, limit: number) {
  const visibleItems: ImageItem[] = [];
  for (const item of items) {
    visibleItems.push(item);
    if (visibleItems.length >= limit) break;
  }
  return visibleItems;
}

export const LeftContent = observer(() => {
  const disabled = homeState.hasTaskRunning();
  const fileRef = useRef<HTMLInputElement>(null);
  const progressRef = useRef<HTMLElement>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [visibleCount, setVisibleCount] = useState(32);
  const totalItems = homeState.list.size;

  useEffect(() => {
    if (totalItems === 0) {
      setVisibleCount(32);
      return;
    }
    if (visibleCount >= totalItems) return;
    const progress = progressRef.current;
    if (!progress) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setVisibleCount((count) => Math.min(totalItems, count + 32));
      }
    }, {
      rootMargin: "200px",
    });
    observer.observe(progress);
    return () => observer.disconnect();
  }, [totalItems, visibleCount]);

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(null), 3500);
    return () => window.clearTimeout(timer);
  }, [toast]);

  const downloadAll = async () => {
    gstate.loading = true;
    try {
      const jszip = await import("jszip");
      const zip = new jszip.default();
      const names = new Set<string>();
        for (const info of homeState.list.values()) {
        const outputName = info.compress
          ? getOutputFileName(info, homeState.option)
          : info.name;
        const uniqueName = getUniqNameOnNames(names, outputName);
        names.add(uniqueName);
        if (info.compress?.blob) zip.file(uniqueName, info.compress.blob);
      }
      createDownload("picsmaller.zip", await zip.generateAsync({ type: "blob", compression: "DEFLATE", compressionOptions: { level: 6 } }));
    } finally {
      gstate.loading = false;
    }
  };

  return (
    <div className={style.content}>
      <div className={style.toolbar}>
        <div>
          <button type="button" className="button buttonPrimary" disabled={disabled} onClick={() => fileRef.current?.click()}><Plus size={18} />{gstate.locale?.listAction.batchAppend}</button>
          {typeof window.showDirectoryPicker === "function" && (
            <button
              type="button"
              className="button"
              disabled={disabled}
              onClick={async () => {
                try {
                  const handle = await window.showDirectoryPicker();
                  createImageList(await getFilesFromHandle(handle));
                } catch (error) {
                  // User cancelled the directory picker — no-op.
                }
              }}
            >
              <FolderPlus size={18} />
              {gstate.locale?.listAction.addFolder}
            </button>
          )}
        </div>
        <div>
          <IconButton label={gstate.locale?.listAction.reCompress ?? "Recompress"} disabled={disabled} onClick={() => homeState.reCompress()}><RefreshCw size={18} /></IconButton>
          <IconButton label={gstate.locale?.listAction.clear ?? "Clear"} danger disabled={disabled} onClick={() => homeState.clear()}><Trash2 size={18} /></IconButton>
          <button type="button" className="button buttonAccent" disabled={disabled} onClick={downloadAll}><Download size={18} />{gstate.locale?.listAction.downloadAll}</button>
        </div>
        <ImageInput ref={fileRef} />
      </div>
      <div className={style.list}>{takeItems(homeState.list.values(), visibleCount).map((item) => <ResultItem key={item.key} item={item} disabled={disabled} onPreviewUnavailable={() => setToast(gstate.locale?.heif.previewUnavailable ?? "") } />)}</div>
      <footer ref={progressRef} className={style.progress}><ProgressHint /></footer>
      {toast && <div className={style.toast} role="status"><AlertTriangle size={17} /><span>{toast}</span></div>}
    </div>
  );
});
