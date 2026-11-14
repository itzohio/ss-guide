<!-- route: /screenshare-tools/spoks-tools/streams-script -->
# Script Streams

Description : un script PowerShell qui vérifie la présence d'Alternate Data Streams (ADS), dont le flux `Zone.Identifier` courant, pour les fichiers d'un chemin donné.

Fonctions :

- Commence par le dossier courant où le script est lancé.
- Demande à l'utilisateur s'il faut chercher récursivement dans les sous-dossiers.
- Permet de préciser la profondeur de récursion (nombre de niveaux) ou de tout parcourir ('all').
- Affiche une barre de progression pendant le scan.
- Pour chaque fichier ou dossier, il collecte :
  - Chemin complet et nom.
  - Hash MD5 (fichiers seulement).
  - Propriétaire (nom/SID).
  - Taille.
  - Date de dernier accès et de dernière écriture.
  - Attributs (mode).
  - Le contenu de jusqu'à 5 flux trouvés (Stream1 à Stream5).
  - Le contenu de jusqu'à 4 lignes du flux `Zone.Identifier` (ZoneId1 à ZoneId4).
- Affiche le tout dans une fenêtre GridView interactive.

Astuce d'usage : sert surtout à identifier les fichiers avec des flux alternatifs, qui peuvent servir à cacher des données ou à tracer l'origine d'un fichier (un téléchargement Internet via `Zone.Identifier`, par exemple).
