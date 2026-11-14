<!-- route: /screensharing-general-knowledge/fourth-section-common-windows-artifacts-and-their-basic-analysis/windows-registry-introduction -->
# Le registre Windows : introduction

Apparu avec Windows 3.1, le registre est devenu une base de données hiérarchique centrale : c'est le hub de configuration de l'OS, des programmes et du matériel. Un peu le système nerveux des réglages : il stocke une masse d'options bas niveau, les préférences, les configs matérielles, les profils utilisateurs, les réglages des applications… Windows et les logiciels tiers s'appuient dessus en permanence. Les développeurs y créent des entrées, les "clés" et les "valeurs", pour définir le comportement des programmes et du matériel.

Comme il est au cœur du système, c'est aussi une mine d'or pour l'analyse, et donc une zone qu'on regarde systématiquement en screenshare. Le registre contient :

- La configuration système, les périphériques et les pilotes installés.
- Les logiciels installés, leur historique d'utilisation et les infos de désinstallation (MRU, UserAssist, références Amcache).
- Les comptes utilisateurs, leurs préférences et leurs traces d'activité (dernière connexion, documents récents via certaines clés).
- L'historique des périphériques USB branchés (clés USBSTOR).
- La configuration réseau et l'historique des connexions.
- Des mécanismes de persistance malveillante (clés Run, configs de services, tâches planifiées dans le registre).
- Des traces de techniques de bypass ou de modifications du système.

Par contre, toucher au registre à la main peut avoir de grosses conséquences : instabilité, logiciels qui plantent. D'où le conseil classique de ne pas bricoler dedans sans savoir, et de faire une sauvegarde avant de gros changements.

- **Comment y accéder :**
  - `regedit.exe` (Éditeur du registre) : l'outil graphique intégré pour parcourir et modifier le registre. On l'ouvre via Win+R puis `regedit`. Côté analyse : voir `regedit.exe` dans les logs d'exécution (Prefetch ou BAM) suggère fortement que le joueur a trifouillé le registre lui-même. Si c'est juste avant une partie ou un screenshare, il faut creuser ce qui a pu être modifié ou supprimé. Regedit garde aussi en mémoire la dernière clé ouverte, ce qui peut donner un indice si le joueur n'a pas navigué ailleurs avant de fermer.
  - `reg.exe` : l'utilitaire en ligne de commande pour lire, ajouter, supprimer et modifier des entrées. Très utilisé dans les scripts et fichiers batch. Côté analyse : voir `reg.exe` dans les logs est un bon indice de manipulation volontaire, souvent pour nettoyer des artefacts (BAM, UserAssist), changer des réglages de sécurité ou mettre en place un bypass. L'historique de commandes (PowerShell, par exemple) peut montrer les commandes exactes.
  - Outils tiers : Registry Explorer (Eric Zimmerman) va plus loin que `regedit`. Il lit directement les ruches (même hors ligne), récupère souvent les clés et valeurs supprimées (surlignées), propose une recherche et des filtres puissants, et a des favoris pour les emplacements intéressants. RegScanner apporte aussi une recherche améliorée.
