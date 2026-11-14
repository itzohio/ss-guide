<!-- route: /screensharing-general-knowledge/seventh-section-manual-ss-techniques/lastactivityview-artifact-aggregation/functionality-in-screensharing -->
# À quoi ça sert en screenshare

LastActivityView est un excellent premier coup d'œil pendant un screenshare pour avoir vite une chronologie des actions récentes :

- **Détecter des exécutions :** voir les exécutables récents à partir de Prefetch, et parfois d'UserAssist ou d'autres traces de registre.
- **Repérer les fichiers ouverts ou enregistrés :** très pratique pour voir des documents, images, archives ou configs de cheat (`.cfg`, `.ini`, `.json`) récemment utilisés, grâce aux données MRU Ouvrir/Enregistrer.
- **Suivre l'usage des DLL :** ça met souvent en évidence les interactions avec des `.dll`, surtout celles chargées normalement ou avec une extension maquillée (une DLL de cheat renommée en `.cfg` ou `.dat`, par exemple). Souvent, le simple fait qu'un injecteur choisisse une DLL dans une boîte "Ouvrir" ou qu'un programme charge un fichier de config laisse une trace dans les clés OpenSavePidlMRU, que LastActivityView affiche.
- **Croiser les timelines :** comme les données de plusieurs sources sont triées par date, ça aide à reconstruire une chronologie et à relier les actions (télécharger une archive, puis lancer un exe depuis un dossier d'extraction temporaire juste après).
