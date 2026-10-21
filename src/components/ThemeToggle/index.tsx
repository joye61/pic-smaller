"use client";

import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";
import { applyTheme, persistTheme, readTheme, type Theme } from "@/theme";
import style from "./index.module.scss";

interface ThemeToggleProps {
  lightLabel: string;
  darkLabel: string;
}

export function ThemeToggle({ lightLabel, darkLabel }: ThemeToggleProps) {
  const [theme, setTheme] = useState<Theme>("light");

  useEffect(() => {
    const storedTheme = readTheme(window.localStorage);
    setTheme(storedTheme);
    applyTheme(storedTheme);
  }, []);

  const nextTheme = theme === "light" ? "dark" : "light";
  const label = nextTheme === "dark" ? darkLabel : lightLabel;

  return (
    <button
      type="button"
      className={style.toggle}
      aria-label={label}
      title={label}
      onClick={() => {
        setTheme(nextTheme);
        persistTheme(nextTheme);
      }}
    >
      {theme === "light" ? <Moon size={18} /> : <Sun size={18} />}
    </button>
  );
}
