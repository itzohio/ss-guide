"use client";

import { useSyncExternalStore } from "react";

import { chromeIcons } from "./generated";
import type { IconData } from "./glyph";
import { Glyph } from "./glyph";
import { dict } from "./i18n";
import { useLanguage } from "./use-language";

const KEY = "redlotus-theme";
type Mode = "light" | "system" | "dark";

const listeners = new Set<() => void>();

const read = (): Mode => {
  if (typeof window === "undefined") return "light";
  const stored = window.localStorage.getItem(KEY);
  return stored === "dark" || stored === "system" ? stored : "light";
};

const subscribe = (onChange: () => void) => {
  listeners.add(onChange);
  window.addEventListener("storage", onChange);
  return () => {
    listeners.delete(onChange);
    window.removeEventListener("storage", onChange);
  };
};

const apply = (mode: Mode) => {
  const dark =
    mode === "dark" ||
    (mode === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches);
  document.documentElement.classList.toggle("dark", dark);
};

const setMode = (mode: Mode) => {
  window.localStorage.setItem(KEY, mode);
  apply(mode);
  listeners.forEach((listener) => listener());
};

export function ThemeSwitcher() {
  const mode = useSyncExternalStore(subscribe, read, () => "light" as Mode);
  const t = dict[useLanguage()];

  const options: { id: Mode; label: string; icon: IconData }[] = [
    { id: "light", label: t.themeLight, icon: chromeIcons.light },
    { id: "system", label: t.themeSystem, icon: chromeIcons.system },
    { id: "dark", label: t.themeDark, icon: chromeIcons.dark },
  ];

  return (
    <div className="rl-theme" role="radiogroup" aria-label={t.theme}>
      {options.map((option) => (
        <button
          key={option.id}
          type="button"
          role="radio"
          aria-checked={mode === option.id}
          aria-label={option.label}
          onClick={() => setMode(option.id)}
        >
          <Glyph icon={option.icon} />
        </button>
      ))}
    </div>
  );
}
