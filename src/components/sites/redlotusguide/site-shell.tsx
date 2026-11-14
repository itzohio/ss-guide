"use client";

import { useEffect, useState } from "react";

import { DocPage } from "./doc-page";
import { FaqDialog } from "./faq-dialog";
import { chromeIcons } from "./generated";
import { Glyph } from "./glyph";
import { dict, type Lang } from "./i18n";
import type { Crumb, NavSection, Page } from "./pages-data";
import { PageContent } from "./page-content";
import { SidebarNav } from "./sidebar-nav";
import { TableOfContents } from "./table-of-contents";
import { ThemeSwitcher } from "./theme-switcher";
import { useLanguage } from "./use-language";
import "./redlotus.css";

type Drawer = "nav" | "toc" | null;

export type DocView = {
  page: Page;
  crumbs: Crumb[];
  prev: Page | null;
  next: Page | null;
};

export type HomeNext = { route: string; title: string; titleFr: string };

const tocFor = (page: Page, lang: Lang) =>
  (lang === "fr" ? page.fr?.headings ?? page.headings : page.headings).filter(
    (entry) => entry.level === 2 || entry.level === 3
  );

export function SiteShell({
  nav,
  doc,
  homeNext,
}: {
  nav: NavSection[];
  doc?: DocView;
  homeNext?: HomeNext;
}) {
  const [drawer, setDrawer] = useState<Drawer>(null);
  const open = drawer !== null;
  const lang = useLanguage();
  const t = dict[lang];
  const route = doc?.page.route ?? "/";
  const toc = doc ? tocFor(doc.page, lang) : [];

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setDrawer(null);
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, []);

  useEffect(() => {
    const name = doc
      ? lang === "fr"
        ? doc.page.fr?.title ?? doc.page.title
        : doc.page.title
      : "Introduction";
    document.title = `${name} | SS Guide`;
    document.documentElement.lang = lang;
  }, [doc, lang]);

  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);

  return (
    <div className="rl-site">
      <header className="rl-header">
        <button
          type="button"
          className="rl-icon-btn"
          aria-label={t.openToc}
          onClick={() => setDrawer("nav")}
        >
          <Glyph icon={chromeIcons.menu} size={18} />
        </button>
      </header>

      <div className="rl-overlay" data-open={open} onClick={() => setDrawer(null)} aria-hidden="true" />

      <div className="rl-shell">
        <SidebarNav open={drawer === "nav"} activeRoute={route} sections={nav} lang={lang} />

        <div className="rl-body">
          <div className="rl-columns">
            <main className="rl-main">
              {doc ? (
                <DocPage
                  page={doc.page}
                  crumbs={doc.crumbs}
                  prev={doc.prev}
                  next={doc.next}
                  lang={lang}
                  onOpenToc={() => setDrawer("toc")}
                />
              ) : (
                <PageContent
                  lang={lang}
                  next={homeNext}
                  onOpenToc={() => setDrawer("toc")}
                />
              )}
            </main>

            <TableOfContents
              open={drawer === "toc"}
              items={toc}
              lang={lang}
              onClose={() => setDrawer(null)}
            />
          </div>
        </div>
      </div>

      <ThemeSwitcher />
      <FaqDialog />
    </div>
  );
}
