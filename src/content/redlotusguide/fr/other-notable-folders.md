<!-- route: /screensharing-general-knowledge/fourth-section-common-windows-artifacts-and-their-basic-analysis/other-notable-folderslocations -->
# D'autres dossiers et emplacements à connaître

À part les artefacts principaux vus plus haut, pas mal d'endroits du système peuvent cacher des preuves ou donner du contexte. La liste complète serait trop longue pour cette section de base, mais un SSer doit connaître au moins ceux-là :

- **Le Planificateur de tâches :** `C:\Windows\System32\Tasks` (et les clés de registre associées). Ce dossier contient les définitions XML des tâches planifiées. C'est un endroit classique pour de la persistance malveillante ou des scripts qui font des trucs à des moments précis (vider des logs à la connexion, par exemple). Il faut regarder les commandes, chemins et déclencheurs des tâches.
- **Program Compatibility Assistant (PCA) :** `C:\Windows\appcompat\pca`. On y trouve `Amcache.hve` et `RecentFileCache.bcf`, qui suivent l'historique d'exécution et les infos de compatibilité. C'est souvent une preuve secondaire, surtout sur les vieux Windows (7/8) ou quand les autres logs ont été nettoyés, mais ça peut confirmer qu'un programme a tourné.
- **L'historique PowerShell :** `%AppData%\Microsoft\Windows\PowerShell\PSReadLine\ConsoleHost_history.txt`. Un simple fichier texte qui garde les commandes tapées à la main dans PowerShell. Très utile pour repérer des scripts, des manipulations de fichiers ou des tentatives de désactivation de sécurité.
- **User Assist :** ce ne sont pas des dossiers mais des clés de registre (`HKEY_CURRENT_USER\Software\Microsoft\Windows\CurrentVersion\Explorer\UserAssist\`) qui suivent le lancement des programmes avec interface graphique. Les données sont encodées : il faut un outil ou un décodage manuel pour lire les compteurs de lancement et les dates.

Connaître ces emplacements, et les autres, ça élargit le champ d'un screenshare sérieux au-delà des artefacts les plus évidents.
