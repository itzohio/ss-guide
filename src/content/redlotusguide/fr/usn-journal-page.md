<!-- route: /screensharing-general-knowledge/seventh-section-manual-ss-techniques/journal-analysis/the-usn-journal -->
# Le journal USN ($UsnJrnl)

Le journal USN (Update Sequence Number) fait partie de NTFS. C'est un log chronologique qui enregistre méticuleusement les changements faits aux fichiers et dossiers du volume.

- **Emplacement et structure :** les données sont dans un Alternate Data Stream nommé `$J`, qui appartient au métatifichier système caché `$Extend\$UsnJrnl` à la racine du volume (par exemple `C:\$Extend\$UsnJrnl`). Un autre flux, `$Max`, contient les métadonnées du journal.
- **Rôle :** côté système, ça permet aux applications (indexation, sauvegarde, réplication) de suivre les changements sans rescanner tout le volume. Côté analyse, ça donne un historique détaillé des opérations.
- **Ce que logge chaque entrée (USN Record) du flux `$J` :**
  - L'horodatage précis de l'événement.
  - Le nom du fichier concerné.
  - Le File Reference Number (FRN) et le FRN du dossier parent (ce qui relie le fichier à son dossier et à son enregistrement MFT).
  - Un ou plusieurs codes de raison, qui indiquent le type de changement (`FILE_CREATE`, `FILE_DELETE`, `RENAME_OLD_NAME`, `RENAME_NEW_NAME`, `DATA_OVERWRITE`, `BASIC_INFO_CHANGE`, `STREAM_CHANGE`, `CLOSE`). Comprendre ces codes, c'est la clé de l'interprétation.
  - Les attributs du fichier au moment de l'événement.
  - La source (pour distinguer une action utilisateur d'une gestion par l'OS).
- **Persistance :** point important, le journal garde souvent les entrées de fichiers supprimés (jusqu'à ce qu'il tourne en boucle ou soit vidé). C'est ce qui permet de prouver qu'un fichier a existé puis a été supprimé.
