"use client";

import Link from "next/link";

import { chromeIcons, pageIcon } from "./generated";
import { Glyph } from "./glyph";
import { dict, type Lang } from "./i18n";
import type { HomeNext } from "./site-shell";
import { TitlebarActions } from "./titlebar-actions";

const defaultNext: HomeNext = {
  route: "/screensharing-introducttion-and-principles/first-section-an-introduction-to-hack-checks-and-bypasses/what-is-a-hack-check",
  title: "What is a Hack Check (Screenshare)?",
  titleFr: "Qu'est-ce qu'un hack check (screenshare) ?",
};

export function PageContent({
  lang,
  next,
  onOpenToc,
}: {
  lang: Lang;
  next?: HomeNext;
  onOpenToc: () => void;
}) {
  const t = dict[lang];
  const target = next ?? defaultNext;

  return (
    <>
      <div className="rl-titlebar">
        <TitlebarActions lang={lang} onOpenToc={onOpenToc} />
        <nav className="rl-breadcrumb" aria-label={t.breadcrumb}>
          <Link href="/">{t.breadcrumbHome}</Link>
        </nav>
      </div>

      <h1 className="rl-title">
        <Glyph icon={pageIcon} className="rl-title-icon" />
        <span>Introduction</span>
      </h1>

      <div className="rl-prose">
        <p>
          Ce doc, reprend et approfondit un truc qu&apos;on appelle <em>hack check</em> ou{" "}
          <em>screenshare</em>. C&apos;est parfois mal vu, mais c&apos;est en fait un outil de modération
          essentiel dans les communautés de jeu compétitives, surtout sur Minecraft, où les modifs
          côté client sont partout. L&apos;idée de ce guide, c&apos;est de montrer comment ces vérifs se
          passent, pourquoi elles sont plutôt saines, et comment elles servent le{" "}
          <strong>fair play</strong>.
        </p>
        <p>
          Le jeu en ligne, et encore plus les jeux moddables, doit faire face en permanence à des gens
          qui cherchent un avantage déloyal : cheats, hacks, mods non autorisés. Les anti-cheats côté
          serveur aident, mais ils ne voient pas tout ce qui se passe sur la machine du joueur.
          D&apos;où le screenshare : le staff va regarder directement sur le PC pour vérifier que le
          jeu et la config sont clean. Ce guide ne s&apos;arrête pas aux bases : on part des principes
          et de l&apos;éthique, puis on passe aux artefacts, aux spécificités de Minecraft, aux bypass
          courants, et on finit par des méthodes forensiques plus poussées.
        </p>
        <p>
          Que vous débarquiez ou que vous connaissiez déjà le sujet, lisez ça tranquillement et gardez
          l&apos;esprit ouvert. La détection de triche et les bypass évoluent tout le temps : il faut
          apprendre en continu, réfléchir par soi-même et savoir s&apos;adapter. Ce guide essaie
          d&apos;être complet, mais sur le terrain il faut du jugement, le respect des règles du
          serveur et un minimum d&apos;intégrité.
        </p>
        <p>
          <strong>{t.proTipLabel}</strong> <em>{t.proTip}</em>
        </p>

        <Link className="rl-next" href={target.route}>
          <Glyph icon={chromeIcons.chevron} className="rl-next-icon" />
          <span className="rl-next-body">
            <span className="rl-next-label">{t.next}</span>
            <span className="rl-next-title">{target.titleFr}</span>
          </span>
        </Link>
      </div>
    </>
  );
}
