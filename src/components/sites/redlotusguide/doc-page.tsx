"use client";

import Link from "next/link";

import { Blocks } from "./blocks";
import { chromeIcons } from "./generated";
import { Glyph } from "./glyph";
import { dict, type Lang } from "./i18n";
import type { Crumb, Page } from "./pages-data";
import { TitlebarActions } from "./titlebar-actions";

export function DocPage({
  page,
  crumbs,
  prev,
  next,
  lang,
  onOpenToc,
}: {
  page: Page;
  crumbs: Crumb[];
  prev: Page | null;
  next: Page | null;
  lang: Lang;
  onOpenToc: () => void;
}) {
  const t = dict[lang];
  const french = lang === "fr" ? page.fr : undefined;
  const blocks = french?.blocks ?? page.blocks;
  const title = french?.title ?? page.title;
  const headings = french?.headings ?? page.headings;

  const crumbLabel = (crumb: Crumb) => (lang === "fr" ? crumb.titleFr : crumb.title);
  const pageLabel = (target: Page) => (lang === "fr" ? target.fr?.title ?? target.title : target.title);

  return (
    <>
      <div className="rl-titlebar">
        <TitlebarActions
          lang={lang}
          onOpenToc={onOpenToc}
          showToc={headings.some((entry) => entry.level === 2 || entry.level === 3)}
        />
        <nav className="rl-breadcrumb" aria-label={t.breadcrumb}>
          {crumbs.map((crumb, index) => (
            <span key={`${crumb.title}-${index}`}>
              {index > 0 ? <span className="rl-breadcrumb-sep">/</span> : null}
              {crumb.route ? <Link href={crumb.route}>{crumbLabel(crumb)}</Link> : crumbLabel(crumb)}
            </span>
          ))}
        </nav>
      </div>

      <h1 className="rl-title rl-doc-title">
        <Glyph icon={page.icon} className="rl-title-icon" />
        <span>{title}</span>
      </h1>

      <div className="rl-prose rl-doc-prose">
        <Blocks blocks={blocks} />
      </div>

      {prev || next ? (
        <nav className="rl-pager" aria-label={t.pagination}>
          {prev ? (
            <Link className="rl-next rl-next--prev" href={prev.route}>
              <Glyph icon={chromeIcons.chevron} className="rl-next-icon" />
              <span className="rl-next-body">
                <span className="rl-next-label">{t.previous}</span>
                <span className="rl-next-title">{pageLabel(prev)}</span>
              </span>
            </Link>
          ) : null}
          {next ? (
            <Link className="rl-next" href={next.route}>
              <Glyph icon={chromeIcons.chevron} className="rl-next-icon" />
              <span className="rl-next-body">
                <span className="rl-next-label">{t.next}</span>
                <span className="rl-next-title">{pageLabel(next)}</span>
              </span>
            </Link>
          ) : null}
        </nav>
      ) : null}
    </>
  );
}
