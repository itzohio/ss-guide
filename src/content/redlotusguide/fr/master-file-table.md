<!-- route: /screensharing-general-knowledge/third-section-windows-fundamentals/key-ntfs-components/master-file-table-the-file-catalog -->
# Master File Table ($MFT) — le catalogue des fichiers

La Master File Table ($MFT) est le cœur d'un volume NTFS : sa base de données centrale. C'est un fichier spécial qui contient au moins une entrée, appelée enregistrement MFT, pour chaque fichier et dossier du volume. Chaque enregistrement est une fiche détaillée sur le fichier : nom(s), taille, attributs, permissions, horodatages MACB, et l'emplacement des données sur le disque. Pour les tout petits fichiers, les données peuvent même être stockées directement dans l'enregistrement (fichier dit "résident").

- Nom(s) du fichier (NTFS gère plusieurs noms, par exemple le nom court 8.3 et le nom long)
- Taille du fichier (logique et physique)
- Attributs (lecture seule, caché, système, archive, compressé, chiffré)
- Permissions de sécurité (ACL)
- Les horodatages MACB de base (dans des attributs comme $STANDARD_INFORMATION et $FILE_NAME)
- Les pointeurs ($DATA) qui indiquent où sont stockées les données sur le disque. Pour les très petits fichiers, les données peuvent être dans l'enregistrement lui-même (fichier "résident").

Analyser (on dit "parser") le $MFT donne un catalogue de presque tout ce qui existe sur le volume, y compris souvent les fichiers récemment supprimés dont l'enregistrement n'a pas encore été écrasé. C'est un artefact de base pour prouver l'existence d'un fichier, reconstruire une timeline et lire ses attributs. Toute modification des métadonnées enregistrées dans l'entrée MFT met à jour l'horodatage (C) Changed.
