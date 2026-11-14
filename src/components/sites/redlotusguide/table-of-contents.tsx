"use client";

import { useEffect, useState } from "react";

import { chromeIcons } from "./generated";
import { Glyph } from "./glyph";
import { dict, type Lang } from "./i18n";

export type TocItem = { id: string; text: string; level: number };

export function TableOfContents({
  open,
  items,
  lang,
  onClose,
}: {
  open: boolean;
  items: TocItem[];
  lang: Lang;
  onClose: () => void;
}) {
  const [active, setActive] = useState(items[0]?.id ?? "");
  const ids = items.map((entry) => entry.id).join(",");
  const t = dict[lang];

  useEffect(() => {
    const sections = ids
      .split(",")
      .map((id) => document.getElementById(id))
      .filter((section): section is HTMLElement => section !== null);
    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: "-15% 0px -70% 0px" }
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, [ids]);

  if (items.length === 0) {
    return <aside className="rl-toc" aria-hidden="true" />;
  }

  return (
    <aside className="rl-toc" data-open={open} aria-label={t.onThisPage}>
      <div className="rl-toc-heading">
        <Glyph icon={chromeIcons.outline} />
        <span>{t.onThisPage}</span>
      </div>
      <ul className="rl-toc-list">
        {items.map((entry) => (
          <li key={entry.id} data-level={entry.level}>
            <a
              className="rl-toc-link"
              href={`#${entry.id}`}
              data-active={active === entry.id}
              onClick={onClose}
            >
              {entry.text}
            </a>
          </li>
        ))}
      </ul>
    </aside>
  );
}
