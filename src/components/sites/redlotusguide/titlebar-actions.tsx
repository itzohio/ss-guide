"use client";

import { chromeIcons } from "./generated";
import { Glyph } from "./glyph";
import { dict, type Lang } from "./i18n";

export function TitlebarActions({
  lang,
  onOpenToc,
  showToc = true,
}: {
  lang: Lang;
  onOpenToc: () => void;
  showToc?: boolean;
}) {
  const t = dict[lang];

  if (!showToc) return null;

  return (
    <div className="rl-titlebar-actions">
      <button
        type="button"
        className="rl-icon-btn rl-toc-toggle"
        aria-label={t.openToc}
        onClick={onOpenToc}
      >
        <Glyph icon={chromeIcons.outline} size={18} />
      </button>
    </div>
  );
}
