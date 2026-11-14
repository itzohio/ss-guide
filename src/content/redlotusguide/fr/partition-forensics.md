<!-- route: /screensharing-general-knowledge/eighth-section-common-bypass-techniques-in-screensharing/disk-partition-manipulation-for-evasion/forensic-implications -->
# Les conséquences pour l'analyse

Cette méthode isole l'activité puis supprime le contenant, mais créer et supprimer une partition, ce sont des événements système importants qui laissent des traces :

- **Journaux d'événements :** Windows logge souvent les opérations de gestion de volumes. Les logs à regarder :
  - Journal Système : les événements liés au Virtual Disk Service (VDS), à la gestion des partitions ou à `diskpart.exe`. Les ID varient, mais ils concernent la création, le formatage et la suppression de volumes.
  - Journal Ntfs (Operational) : `Journaux des applications et des services > Microsoft > Windows > Ntfs > Operational`. L'ID 4 peut indiquer un montage/démontage de volume. L'ID 501 peut logguer une suppression de journal si la partition était en NTFS et que son journal a été supprimé avant (plus rare).
- **Outils de gestion de disques :** ouvrir la Gestion des disques (`diskmgmt.msc`) peut révéler un espace non alloué là où une partition existait récemment.
- **Logs SetupAPI :** `C:\Windows\INF\setupapi.dev.log` contient parfois des logs détaillés sur l'installation et la suppression de périphériques, ce qui peut inclure des événements liés aux disques et volumes.
- **(Avancé) Analyse bas niveau du disque :** des outils forensic qui lisent la structure brute du disque trouvent parfois des restes ou des métadonnées de tables de partitions ou de systèmes de fichiers supprimés dans l'espace non alloué, mais c'est au-delà d'un screenshare standard.

Trouver des entrées récentes de création puis suppression de partition, surtout si ça colle avec une session de jeu ou un screenshare, est très suspect.
