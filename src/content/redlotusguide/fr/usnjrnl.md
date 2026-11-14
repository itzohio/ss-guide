<!-- route: /screensharing-general-knowledge/third-section-windows-fundamentals/key-ntfs-components/the-journal-the-change-log -->
# Le journal ($UsnJrnl) — le journal des changements

Le $UsnJrnl fait partie de la journalisation de NTFS. Il se trouve en général dans un dossier système caché, souvent C:\$Extend, et on ne le voit pas dans l'Explorateur. C'est un carnet de bord détaillé de tout ce qui arrive aux fichiers et dossiers du volume. Il garde une trace chronologique des événements, notamment :

- La création de fichiers et de dossiers (FILE_CREATE).
- Leur suppression (FILE_DELETE).
- Leur renommage (RENAME_OLD_NAME, RENAME_NEW_NAME).
- Les changements de contenu (écrasement DATA_OVERWRITE, agrandissement DATA_EXTEND, réduction DATA_TRUNCATION).
- Les modifications d'attributs ou de sécurité (BASIC_INFO_CHANGE).
- Les changements liés aux Alternate Data Streams (STREAM_CHANGE).

Le fichier $UsnJrnl en lui-même peut sembler vide ou minuscule si on le regarde directement. Les vraies données sont dans deux Alternate Data Streams (ADS) attachés à ce fichier :

- $Max : les infos sur le journal (identifiant, taille maximale, granularité d'allocation).
- $J : la suite des enregistrements USN, c'est-à-dire les vraies entrées de log.

Les enregistrements USN sont les briques de base du flux $J. Chacun décrit un changement précis et contient en général :

- Un numéro de séquence (USN), qui augmente à chaque entrée.
- Le File Reference Number (FRN) du fichier ou dossier concerné.
- Le FRN du dossier parent.
- Un code de raison (FILE_CREATE, FILE_DELETE, DATA_OVERWRITE, BASIC_INFO_CHANGE, etc.).
- La source du changement (données utilisateur, gestion par l'OS…).
- Le SID de l'utilisateur ou du processus qui a fait le changement (pas toujours dispo).
- Les attributs du fichier au moment du changement.
- Le nom du fichier.
- Un horodatage précis de l'événement.

Pour lire le flux $J, il faut un outil : la commande intégrée `fsutil usn readjournal c:` ou un outil d'analyse comme MFTECmd, JournalTrace ou Echo Journal Viewer. Ça donne une timeline très parlante de l'activité du disque, même pour des fichiers supprimés.
