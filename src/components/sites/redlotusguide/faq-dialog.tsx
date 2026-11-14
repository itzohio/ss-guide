"use client";

import { useEffect, useState } from "react";

export function FaqDialog() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open]);

  return (
    <>
      <button
        type="button"
        className="rl-faq-btn"
        aria-label="FAQ et à propos de ce guide"
        aria-expanded={open}
        onClick={() => setOpen(true)}
      >
        ?
      </button>

      {open ? (
        <div className="rl-faq-overlay" onClick={() => setOpen(false)}>
          <div
            className="rl-faq-card"
            role="dialog"
            aria-modal="true"
            aria-labelledby="rl-faq-title"
            onClick={(event) => event.stopPropagation()}
          >
            <h2 id="rl-faq-title" className="rl-faq-title">
              FAQ
            </h2>

            <p>
              Ce guide n&apos;est pas le nôtre. C&apos;est le guide <strong>public</strong> de
              RedLotus, écrit par ItzIceHere, et nous le mettons simplement à disposition en
              français pour les membres de notre communauté qui sont plus à l&apos;aise comme ça.
              Tout le crédit lui revient.
            </p>

            <p>
              La version originale et à jour se trouve ici :{" "}
              <a href="https://itzicehere.gitbook.io/redlotusguide" target="_blank" rel="noreferrer">
                itzicehere.gitbook.io/redlotusguide
              </a>
              . En cas de doute, de divergence ou de mise à jour, c&apos;est cette version-là qui
              fait foi — pas la traduction que vous lisez en ce moment.
            </p>

            <button type="button" className="rl-faq-close" onClick={() => setOpen(false)}>
              Fermer
            </button>
          </div>
        </div>
      ) : null}
    </>
  );
}
