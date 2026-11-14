<!-- route: /screensharing-general-knowledge/eighth-section-common-bypass-techniques-in-screensharing/artifact-clearing-techniques/recycle-bin-clearing -->
# Vider la corbeille

- **Description :** vider la corbeille, ce qui supprime définitivement les fichiers mis là par une suppression normale.
- **Mécanisme :**
  - Clic droit sur l'icône de la corbeille > "Vider la corbeille".
  - Ou un utilitaire de nettoyage de disque qui inclut la corbeille.
- **Pourquoi les tricheurs font ça :** éliminer définitivement les fichiers suspects supprimés normalement juste avant le screenshare, pour qu'ils ne soient pas récupérables facilement.
- **Détection :** les fichiers sont partis (sauf récupération), mais le vidage laisse une trace :
  - La date du dossier `$Recycle.bin` : vérifier la date de modification du dossier système caché `$Recycle.bin` à la racine du disque (`C:\$Recycle.bin`). Si elle est très récente (quelques minutes avant le screenshare), la corbeille a été utilisée récemment, probablement vidée (ou un fichier restauré). Il faut activer l'affichage des fichiers cachés et protégés du système pour le voir.
