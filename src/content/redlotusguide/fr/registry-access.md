<!-- route: /screensharing-general-knowledge/seventh-section-manual-ss-techniques/regedit-registry-explorer/accessing-the-registry -->
# Accéder au registre

Plusieurs outils permettent de voir et manipuler le registre :

- **Regedit (`regedit.exe`) :**
  - L'éditeur graphique intégré de Windows.
  - On l'ouvre via Win+R puis `regedit`. Les droits admin sont en général nécessaires pour tout voir.
  - Il affiche l'arborescence classique (ruches > clés > sous-clés) et les valeurs dans le panneau de droite.
  - Intérêt pour l'analyse : voir `regedit.exe` dans Prefetch/BAM indique fortement une interaction manuelle. Regarder la "LastWriteTime" des clés (Affichage > Afficher l'heure de dernière écriture de la clé) montre quand elles ont été modifiées. Regedit retient aussi la dernière clé ouverte avant fermeture, ce qui donne parfois un indice.
- **Reg.exe :**
  - L'utilitaire en ligne de commande (`reg query`, `reg add`, `reg delete`, `reg compare`…).
  - Intérêt : une exécution vue dans Prefetch/BAM ou dans l'historique de commandes indique une manipulation scriptée ou manuelle, souvent pour un bypass (nettoyer les entrées BAM, désactiver des fonctions de sécurité).
- **Les outils tiers (Registry Explorer, etc.) :**
  - Registry Explorer (Eric Zimmerman) : un outil d'analyse gratuit et puissant, fait pour le registre. Il lit les ruches en direct ou hors ligne (extraites de `C:\Windows\System32\config` ou d'un VSS).
  - Fonctions utiles en screenshare :
    - Clés et valeurs supprimées : il les met souvent en évidence (icône d'avertissement) dans la ruche chargée. Trouver des entrées récemment supprimées dans des ruches sensibles comme BAM ou UserAssist pendant la session en cours, c'est une preuve forte de nettoyage.
    - Recherche robuste (CTRL+F) : dans les clés, les noms de valeurs, les données, et même l'espace résiduel, avec des chaînes, des dates (UTC) ou des tailles.
    - Récupération des valeurs supprimées : il retrouve souvent le contenu des clés ou valeurs effacées (souvent affiché en rouge).
    - Favoris : des raccourcis vers les emplacements importants (UserAssist, BAM, clés Run, USBStor…).
    - Dates : la "Last Write Time" de chaque clé est affichée clairement, en UTC par défaut.
  - Conseil : lancer Registry Explorer et charger les ruches utiles (NTUSER.DAT pour l'activité utilisateur, SYSTEM/SOFTWARE pour la config système) tôt dans le screenshare. Il fige l'état au moment du chargement et ne se met pas à jour en direct, donc le joueur ne peut plus modifier ce qu'on voit. Nécessite les droits admin.
  - Autre outil : RegScanner (Nirsoft) propose une recherche alternative.
