<!-- route: /screensharing-general-knowledge/seventh-section-manual-ss-techniques/journal-analysis/limitations -->
# Les limites

- **Taille et rotation :** le journal USN a une taille maximale (réglable via `fsutil`, mais rarement modifiée). Une fois pleine, les vieilles entrées sont écrasées par les nouvelles (il "tourne"). La période couverte dépend donc de l'activité du disque et de la taille configurée. Sur un système très actif, ça peut ne couvrir que quelques heures ou jours ; sur un système calme, des semaines ou des mois.
- **Vidage du journal :** on peut le supprimer volontairement avec `fsutil usn deletejournal /D C:` (en admin). C'est très suspect, et ça se détecte :
  - Dans les journaux d'événements : ID 3079 dans le journal Application.
  - Dans les métadonnées du journal : les outils (JournalTrace avec la "plus vieille entrée", ou les dates de `$J`/`$MAX` via FTK Imager/MFTECmd) montrent une création/modification très récente, signe qu'il a été effacé et recréé.
- **FAT32/exFAT :** ces systèmes n'ont pas de journal USN. L'analyse du journal ne s'applique pas du tout aux volumes FAT32 ou exFAT.
