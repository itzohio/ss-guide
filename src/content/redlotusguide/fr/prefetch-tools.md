<!-- route: /screensharing-general-knowledge/seventh-section-manual-ss-techniques/windows-prefetch-analysis/analysis-tools -->
# Les outils d'analyse

Regarder le dossier `C:\Windows\Prefetch` directement ne montre que les noms et les dates des fichiers. Il faut des outils dédiés pour parser les `.pf` et sortir les métadonnées :

- **WinPrefetchView (Nirsoft) :**
  - Fonction : un outil gratuit avec interface, très utilisé, fait pour lire les `.pf` et afficher les données dans un tableau triable.
  - Interface : la fenêtre liste toutes les entrées Prefetch. En sélectionner une remplit le panneau du bas avec les détails : dates et compteurs d'exécution, infos du volume, et la fameuse liste des fichiers et dossiers référencés (appelée "Indexes" ou ressources chargées dans l'outil).
  - Usages en screenshare :
    - Confirmer l'exécution et le timing : vérifier si un `.exe` a tourné, et exactement quand, via les dates du `.pf` (dernière exécution / date de modification).
    - Repérer un exe renommé : voir facilement un `.pf` dont le nom contient une extension bizarre (`MYCHEAT.TMP-HASH.pf`), signe d'une tentative de camouflage.
    - Analyser les ressources chargées : lire la liste des fichiers référencés d'une entrée (`java.exe.pf` pour un `.jar` de cheat, `rundll32.exe.pf` pour une DLL injectée).
    - Indice de process hollowing : un champ "Executable Path" vide dans WinPrefetchView peut parfois coller avec du process hollowing, mais il faut d'autres preuves.
- **PECmd (Eric Zimmerman) :**
  - Fonction : un outil en ligne de commande de la suite Eric Zimmerman, plus complet et plus fin que beaucoup d'outils graphiques.
  - Utilisation : dans CMD ou PowerShell en admin. La commande typique est `PECmd.exe -d "C:\Windows\Prefetch" --csv C:\OutputPath\`, qui parse tous les `.pf` du dossier indiqué (`-d`) et écrit les résultats en CSV (`--csv`) dans le dossier de sortie.
  - Sortie et intérêt : des CSV détaillés à charger dans Timeline Explorer ou un tableur pour filtrer, trier, croiser et reconstruire une timeline. Très utile quand un `.pf` est corrompu et qu'un outil graphique échoue, ou pour analyser beaucoup d'entrées d'un coup.
