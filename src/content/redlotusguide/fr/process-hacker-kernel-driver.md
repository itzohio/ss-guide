<!-- route: /screensharing-general-knowledge/seventh-section-manual-ss-techniques/process-hacker-system-informer-introduction-and-configuration/configuration-enabling-kernel-mode-driver -->
# Configuration : activer le pilote en mode noyau

Pour avoir accès à toutes les infos système et contourner les restrictions de permissions — surtout quand on veut inspecter des processus protégés (`csrss.exe`, les antivirus) ou composer avec les protections des Windows récents (11+) — activer le pilote noyau de System Informer est souvent nécessaire, et fortement recommandé.

- **Télécharger et installer :** prendre la dernière version sur le site officiel (`https://systeminformer.sourceforge.io/`). Bien télécharger l'installeur ou le binaire, pas juste le code source.
- **Lancer en admin :** toujours démarrer System Informer avec les droits administrateur (clic droit > Exécuter en tant qu'administrateur). C'est obligatoire pour installer et utiliser le pilote noyau et voir toutes les infos.
- **Options :** une fois lancé, menu principal : Hacker > Options.
- **Activer le pilote :** dans la fenêtre Options, onglet General, cocher "Enable Kernel-Mode Driver", puis OK.
- **Redémarrer System Informer :** fermer complètement l'appli et la relancer en admin. Le pilote se charge (un UAC peut apparaître). Si un message dit que le pilote ne peut pas se charger, c'est souvent une incompatibilité temporaire avec une mise à jour de sécurité très récente (les devs corrigent vite) ou un antivirus tiers trop agressif.
