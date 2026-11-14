<!-- route: /screensharing-general-knowledge/eighth-section-common-bypass-techniques-in-screensharing/artifact-clearing-techniques/prefetch-clearing -->
# Vider Prefetch

- **Description :** supprimer les fichiers Prefetch (`.pf`) de `C:\Windows\Prefetch`. Comme ils contiennent l'historique détaillé d'exécution (dates, run counts, ressources chargées), les effacer élimine une source de preuve directe.
- **Mécanisme :**
  - Suppression manuelle : le joueur ouvre `C:\Windows\Prefetch` (en admin) et supprime des `.pf` précis (`cheat.exe-HASH.pf`) ou tout le contenu du dossier.
  - Scripts et outils : des nettoyeurs (CCleaner, BleachBit) ou des scripts maison (`.bat`, `.ps1`) peuvent vider le dossier Prefetch automatiquement.
- **Pourquoi les tricheurs font ça :** effacer l'historique d'exécution d'un cheat ou d'un outil pour empêcher le SSer de trouver la preuve d'un lancement récent avec WinPrefetchView.
- **Détection :**
  - Journal USN (`$UsnJrnl`) : la méthode principale. Chaque suppression, y compris de `.pf`, est loggée avec `FILE_DELETE | CLOSE`, le nom exact (`CHEAT.EXE-1234ABCD.pf`) et le chemin `C:\Windows\Prefetch`. Trouver des `FILE_DELETE` récents sur des `.pf`, surtout plusieurs groupés juste avant ou pendant le screenshare, c'est une preuve solide de nettoyage.
  - Dossier vide ou incomplet : un `C:\Windows\Prefetch` vide, ou sans les entrées des processus système courants (`explorer.exe`), des applis utilisées récemment (`AnyDesk.exe`) ou du jeu (`javaw.exe`), alors que SysMain tourne et que Prefetch est activé dans le registre, c'est très parlant.
  - Recoupement : si d'autres artefacts (BAM, chaînes en mémoire) montrent l'exécution récente d'un programme mais que son `.pf` manque ou affiche une vieille date, il faut soupçonner un nettoyage ou une manipulation (attribut lecture seule) et vérifier dans le journal.
