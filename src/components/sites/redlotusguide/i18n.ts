export type Lang = "fr";

export const dict = {
  fr: {
    onThisPage: "Sur cette page",
    next: "Suivant",
    previous: "Précédent",
    openToc: "Ouvrir la table des matières",
    breadcrumb: "Fil d'Ariane",
    pagination: "Pagination",
    spaceNav: "Navigation de l'espace",
    theme: "Thème",
    themeLight: "Passer au thème clair",
    themeSystem: "Passer au thème système",
    themeDark: "Passer au thème sombre",
    proTipLabel: "Astuce :",
    proTip:
      "si vous croisez des termes anglais comme screenshare ou hack check, c'est normal : c'est le vocabulaire du milieu, on les garde tels quels.",
    breadcrumbHome: "Introduction et principes du ScreenSharing",
  },
} as const;

export type Messages = (typeof dict)["fr"];
