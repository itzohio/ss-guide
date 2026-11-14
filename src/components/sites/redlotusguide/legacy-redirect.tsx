"use client";

import { useEffect } from "react";
import { assetPath } from "@/lib/base-path";

export function LegacyRedirect({ to }: { to: string }) {
  const href = assetPath(to);

  useEffect(() => {
    window.location.replace(href);
  }, [href]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-3 p-6 text-center">
      <meta httpEquiv="refresh" content={`0; url=${href}`} />
      <p className="text-sm text-muted-foreground">Cette page a été déplacée.</p>
      <a className="underline" href={href}>
        Continuer vers la nouvelle adresse
      </a>
    </main>
  );
}
