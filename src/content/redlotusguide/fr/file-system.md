<!-- route: /screensharing-general-knowledge/third-section-windows-fundamentals/file-systems-the-foundation/file-system -->
# Système de fichiers (définition, types : NTFS, FAT32, etc.)

Un système de fichiers, c'est la structure qui permet à un OS de gérer comment les données sont stockées, lues et retrouvées sur un disque (HDD, SSD, clé USB). Il définit les règles pour nommer les fichiers et dossiers, gérer les permissions, stocker les métadonnées et organiser l'arborescence qu'on connaît tous. Chaque OS gère plusieurs systèmes de fichiers, avec leurs avantages, leurs perfs et leurs limites.

Il en existe plein (HFS+ ou APFS sur macOS, ext4 sur Linux), mais en screenshare on tombe presque toujours sur Windows. Du coup ce guide se concentre sur ceux qui comptent pour Windows :

- **NTFS (New Technology File System) :** c'est le système par défaut des disques internes sur toutes les versions récentes de Windows (de XP/Vista à Windows 10 et 11). Comme il est partout, il faut connaître ses spécificités. NTFS apporte des choses utiles autant pour le système que pour l'analyse :
  - Journalisation : un mécanisme qui garantit la cohérence des données et une reprise rapide après un crash (voir plus bas).
  - Permissions détaillées et listes de contrôle d'accès (ACL).
  - Chiffrement (EFS), compression, gros fichiers et gros volumes.
  - Des fonctions comme les Alternate Data Streams (ADS) et les hard links.
- **FAT32 :** un système plus vieux et plus simple, souvent utilisé pour la compatibilité, notamment sur les clés USB et les vieilles cartes SD. Ce qui compte en screenshare :
  - Pas de journalisation : FAT32 n'a rien d'équivalent au $UsnJrnl ou au $LogFile de NTFS. Du coup, impossible de retracer proprement les créations, suppressions et modifications via des logs sur un volume FAT32.
  - Permissions très limitées.
  - Fichiers limités à 4 Go, et volumes limités aussi.
- **exFAT :** une évolution de FAT32, pensée pour les grosses clés USB et cartes mémoire. Il dépasse les limites de taille de FAT32 et reste plus compatible que NTFS (mieux géré sur macOS, par exemple). Mais comme FAT32, il n'a pas la journalisation solide de NTFS.

Savoir quel système de fichiers est en place (surtout sur un disque externe) est important : c'est lui qui détermine quels artefacts, comme le journal USN, seront disponibles pour l'analyse.
