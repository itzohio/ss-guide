<!-- route: /screensharing-general-knowledge/eighth-section-common-bypass-techniques-in-screensharing/disk-partition-manipulation-for-evasion/mechanism-of-evasion -->
# Le mécanisme de l'évasion

- **Création de la partition :** avec la Gestion des disques (`diskmgmt.msc`) ou `diskpart`, l'utilisateur crée une nouvelle partition sur un de ses disques physiques. Elle peut être en NTFS, ou dans un système moins riche en artefacts comme FAT32 ou exFAT.
- **Confinement de l'activité :** les fichiers de cheat, les outils ou les données temporaires sont placés, exécutés et stockés dans cette partition.
- **Évitement de la journalisation :**
  - Si la partition est en FAT32/exFAT, elle n'a pas de journalisation solide (`$UsnJrnl`, `$LogFile`), donc suivre les opérations sur les fichiers y est difficile avec les méthodes NTFS.
  - Si elle est en NTFS, elle a son propre jeu de métafichiers (`$MFT`, `$UsnJrnl`, `$LogFile`), distincts du volume système (C:). L'activité reste dans son journal, pas dans celui de C:. Un SSer qui ne regarde que le journal de C: passe à côté.
- **Suppression de la partition :** avant ou pendant le screenshare, l'utilisateur supprime toute la partition qui contient les fichiers ou les logs. Ça retire non seulement les fichiers, mais toute la structure du système de fichiers, `$MFT` et journal compris si c'était du NTFS.
