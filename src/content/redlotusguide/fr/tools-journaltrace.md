<!-- route: /screenshare-tools/spoks-tools/journaltrace -->
# JournalTrace

Description : un outil à interface graphique développé par Spokwn pour parser et afficher les entrées du journal USN de NTFS (le flux `$UsnJrnl:$J`). Il donne des noms d'événements explicites et des filtres avancés, donc une analyse plus fine que certains visionneuses plus simples.

Fonctions :

- Parse et affiche les entrées du journal USN des volumes NTFS sélectionnés.
- Affiche clairement les codes de raison (`FileDelete`, `Rename_New_Name`, `BasicInfoChange`, `Data_Overwrite`…).
- Filtres avancés par colonne, avec des opérateurs précis :
  - Inclusions (`&&`) : plusieurs conditions (`name:rundll32&&.pf`).
  - Exclusions (`!!`) : exclure une valeur (`name:.exe!!svchost`).
  - Conditions OR (`||`) : une condition parmi plusieurs (`name:.exe||.dll`).
  - Filtres multi-colonnes (`;`) : filtrer sur plusieurs colonnes en même temps (`name:.pf;reason:delete`). Le préfixe de colonne est optionnel avec les opérateurs.
- Utilise un wrapper `OpenByFileId` pour résoudre les identifiants de fichier autrement illisibles.
- Basé sur le wrapper C# de StCroixSkippers pour l'API Win32 UsnJournal.

Usage : indispensable pour analyser finement l'historique d'activité du système de fichiers. Les filtres avancés permettent de suivre précisément les créations, suppressions, renommages, modifications d'attributs (lecture seule, timestomping via BasicInfoChange) et changements de données (édition hexadécimale via DataOverwrite), ce qui est crucial pour reconstituer l'activité et détecter les tentatives de bypass.

Licence : GNU General Public License v3.0.

Lien : `https://github.com/spokwn/JournalTrace/releases`
