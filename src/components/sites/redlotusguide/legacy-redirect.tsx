"use client";

import { useEffect } from "react";

export function LegacyRedirect({ to }: { to: string }) {
  useEffect(() => {
    window.location.replace(to);
  }, [to]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-3 p-6 text-center">
      <meta httpEquiv="refresh" content={`0; url=${to}`} />
      <p className="text-sm text-muted-foreground">Cette page a été déplacée.</p>
      <a className="underline" href={to}>
        Continuer vers la nouvelle adresse
      </a>
    </main>
  );
}
