<!-- route: /screensharing-general-knowledge/eighth-section-common-bypass-techniques-in-screensharing/artifact-clearing-techniques/registry-clearing -->
# Nettoyer le registre (BAM, RecentDocs, etc.)

- **Description :** supprimer des clés ou valeurs du registre qui gardent l'historique d'activité. Les cibles classiques sont les ruches qui loggent l'exécution de programmes ou l'accès aux fichiers.
- **Mécanisme :**
  - Suppression manuelle (`regedit.exe`) : le joueur navigue jusqu'aux clés et les supprime, elles ou leurs valeurs.
  - Ligne de commande (`reg.exe`) : des `reg delete` dans un CMD ou un script pour virer des clés/valeurs ciblées.
  - Nettoyeurs : CCleaner et compagnie proposent souvent de nettoyer les listes MRU du registre, et parfois d'autres logs d'activité.
- **Les cibles courantes :**
  - BAM (Background Activity Moderator) : les clés sous `HKLM\SYSTEM\CurrentControlSet\Services\bam\State\UserSettings\{User_SID}\` stockent les chemins d'exe et les dates de dernière exécution.
  - RecentDocs : les clés sous `HKCU\Software\Microsoft\Windows\CurrentVersion\Explorer\RecentDocs` suivent les fichiers ouverts récemment (souvent liés à `shell:recent`).
  - UserAssist : les clés sous `HKCU\Software\Microsoft\Windows\CurrentVersion\Explorer\UserAssist\` suivent les lancements de programmes graphiques (données en ROT-13).
  - OpenSavePidlMRU : les clés sous `HKCU\Software\Microsoft\Windows\CurrentVersion\Explorer\ComDlg32\OpenSavePidlMRU\` suivent les fichiers ouverts ou enregistrés via les boîtes de dialogue.
  - AppCompatFlags (PCA Store) : la clé `Store` sous `HKCU\Software\Microsoft\Windows NT\CurrentVersion\AppCompatFlags\Compatibility Assistant\` peut aussi être vidée.
- **Pourquoi les tricheurs font ça :** supprimer les traces d'exécution (BAM, UserAssist) ou de fichiers récemment utilisés (RecentDocs, MRU Ouvrir/Enregistrer) qui pourraient pointer vers un cheat ou sa config.
- **Détection :**
  - Registry Explorer (clés et valeurs supprimées) : souvent la méthode la plus efficace. Les visionneuses forensic repèrent et surlignent les clés ou valeurs supprimées dont l'espace dans la ruche n'a pas encore été écrasé. Trouver ces entrées (avec l'icône d'avertissement pour BAM) dans les ruches sensibles, surtout si la suppression semble récente par rapport au démarrage, c'est une preuve forte.
  - Logs d'exécution : chercher des lancements récents de `regedit.exe` ou `reg.exe` dans Prefetch, BAM ou l'historique de commandes autour du screenshare. Ça indique une interaction manuelle avec le registre, donc il faut creuser ce qui a pu être effacé.
  - Clés manquantes : une clé normalement remplie (UserAssist ou BAM pour un utilisateur qui se sert clairement du PC) totalement vide, c'est suspect, même si ça peut aussi venir d'une config ou d'un profil particulier.
  - Dates : Registry Explorer affiche la "Last Write Time" des clés. Une date très récente sur une clé parente (comme `UserSettings` pour BAM) peut indiquer des modifications récentes, suppressions comprises.
