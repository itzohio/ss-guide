<!-- route: /screensharing-general-knowledge/fourth-section-common-windows-artifacts-and-their-basic-analysis/execution-traces-and-recent-activity/recent-items -->
# Les éléments récents (shell:recent)

- **Rôle :** ce dossier spécial stocke des raccourcis (`.lnk`) vers les fichiers et dossiers que l'utilisateur a ouverts ou utilisés récemment via Windows (ouvrir un fichier dans un programme, enregistrer un document…). Son fonctionnement dépend des réglages Windows sur le suivi des éléments récents.
- **Emplacement :** `C:\Users\{username}\AppData\Roaming\Microsoft\Windows\Recent`. Accès rapide via Win+R puis `shell:recent`.
- **Format :** des fichiers `.lnk`. Chacun pointe vers le fichier ou dossier d'origine et contient son chemin, parfois des horodatages liés à la cible (création, modification, accès), plus les dates de création et de modification du raccourci lui-même.
- **Valeur pour l'enquête :**
  - Ça donne du contexte sur ce que le joueur a fait récemment et sur les fichiers, programmes ou disques qu'il a utilisés.
  - Trouver une preuve directe de cheat ici (un raccourci vers une `.dll`) est devenu rare, et beaucoup considèrent ça comme une méthode de détection un peu dépassée. Par contre, des raccourcis vers des emplacements bizarres, des fichiers temporaires ou des archives téléchargées récemment peuvent confirmer ce qu'on a trouvé ailleurs.
  - Ça aide à reconstituer l'histoire des actions du joueur.
- **Artefacts liés et nettoyage :** le contenu de `shell:recent` est lié à deux autres choses :
  - Les Jump Lists : elles listent les éléments récents par application, accessibles en clic droit sur une icône de la barre des tâches ou du menu Démarrer. Les données sont stockées à part, dans des fichiers `.automaticDestinations-ms` et `.customDestinations-ms` dans `%AppData%\Microsoft\Windows\Recent\AutomaticDestinations\` et `CustomDestinations\`. Nettoyer `shell:recent` ne vide pas forcément les Jump Lists.
  - Les clés de registre RecentDocs : sous `HKCU\Software\Microsoft\Windows\CurrentVersion\Explorer\RecentDocs`. Les vider supprime souvent (mais pas toujours) le contenu de `shell:recent`. Des traces de nettoyage de ces clés (par exemple dans les logs d'utilisation de `reg.exe`) peuvent être suspectes.
