export const themeStorageKey = "lunepic-theme";

export type Theme = "light" | "dark";

export function isTheme(value: string | null): value is Theme {
  return value === "light" || value === "dark";
}

export function readTheme(storage: Pick<Storage, "getItem">): Theme {
  const value = storage.getItem(themeStorageKey);
  return isTheme(value) ? value : "light";
}

export function applyTheme(
  theme: Theme,
  root: Pick<HTMLElement, "dataset"> = document.documentElement,
) {
  root.dataset.theme = theme;
}

export function persistTheme(
  theme: Theme,
  storage: Pick<Storage, "setItem"> = window.localStorage,
  root: Pick<HTMLElement, "dataset"> = document.documentElement,
) {
  storage.setItem(themeStorageKey, theme);
  applyTheme(theme, root);
}
