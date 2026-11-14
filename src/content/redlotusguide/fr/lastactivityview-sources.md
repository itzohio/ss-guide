<!-- route: /screensharing-general-knowledge/seventh-section-manual-ss-techniques/lastactivityview-artifact-aggregation/data-sources -->
# Les sources de données

LastActivityView interroge et affiche les données venant notamment de :

- **Fichiers Prefetch :** les dates d'exécution et les noms de fichiers des `.pf` dans `C:\Windows\Prefetch`.
- **Clés de registre :**
  - L'historique des fichiers récents : les fichiers et dossiers ouverts récemment (souvent liés aux raccourcis `shell:recent` et aux clés `RecentDocs`).
  - L'historique des boîtes Ouvrir/Enregistrer (MRU) : les données de clés comme `HKEY_CURRENT_USER\Software\Microsoft\Windows\CurrentVersion\Explorer\ComDlg32\OpenSavePidlMRU\`, qui gardent la liste des derniers fichiers ouverts ou enregistrés via les boîtes de dialogue Windows.
  - Les clés UserAssist : le suivi des programmes avec interface graphique.
  - D'autres clés liées à l'usage des applications ou aux événements système.
- **Journaux d'événements Windows :** certains événements précis (installations, arrêts du système).
- **La corbeille :** des infos sur les fichiers récemment supprimés.
- **Les rapports de plantage d'applications.**
