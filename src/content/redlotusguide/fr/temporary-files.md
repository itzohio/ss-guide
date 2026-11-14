<!-- route: /screensharing-general-knowledge/fourth-section-common-windows-artifacts-and-their-basic-analysis/execution-traces-and-recent-activity/temporary-files -->
# Les fichiers temporaires (%temp%)

- **Rôle :** Windows et les applications y stockent des données temporaires pendant qu'elles tournent ou s'installent. Ça peut être des copies de fichiers en cours d'édition, des caches d'installation, des logs ou des fichiers extraits d'archives.
- **Emplacement :** `C:\Users\{username}\AppData\Local\Temp`. Accès rapide via Win+R puis `%temp%`.
- **Artefacts intéressants en screenshare :**
  - Les DLL JnativeHook : certains cheats Java, notamment des autoclickers, utilisent la bibliothèque JnativeHook pour interagir avec les entrées système. À l'exécution, ils lâchent souvent un fichier `JnativeHook-{chiffres aléatoires}.dll` dans `%temp%`. La date de création ou de modification de cette DLL donne directement l'heure d'exécution du cheat.
    - Attention, ce n'est pas fiable à 100 % : tous les cheats Java n'utilisent pas cette bibliothèque, et le fichier peut être supprimé facilement (par le joueur ou un nettoyeur). Si on le soupçonne mais qu'il n'est plus là, il faut chercher dans le journal USN (`$UsnJrnl`) des `FILE_DELETE` récents correspondant à `JnativeHook*.dll` dans `%temp%`.
  - Les archives décompressées : quand on lance un exe directement depuis un `.zip` ou un `.rar` sans tout extraire, l'outil d'archivage extrait souvent le nécessaire dans un sous-dossier de `%temp%`. Ces dossiers s'appellent parfois `Rar${...}` ou `7z${...}`. Regarder leur contenu et leurs dates de modification permet de retrouver des programmes récemment lancés depuis une archive.
