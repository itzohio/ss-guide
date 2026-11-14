<!-- route: /screensharing-general-knowledge/eighth-section-common-bypass-techniques-in-screensharing/environment-and-hardware-bypasses/external-usb-drives -->
# Les disques USB externes (FAT32 vs NTFS)

- **Description :** les cheats, injecteurs, scripts ou outils peuvent être stockés et exécutés directement depuis une clé USB ou un disque externe. Le système de fichiers du disque change beaucoup les traces laissées.
- **Mécanisme et évasion (FAT32 vs NTFS) :**
  - NTFS : le système standard et moderne de Windows, utilisable aussi sur un disque externe. Un volume NTFS tient des logs détaillés de l'activité : le journal USN (`$UsnJrnl`), qui enregistre créations, suppressions, renommages et modifications, et souvent `$LogFile` pour les métadonnées. Analyser ces logs sur une clé en NTFS révèle la manipulation récente d'un fichier, même si le cheat a été supprimé.
  - FAT32 (et exFAT) : vieux systèmes très utilisés sur les clés USB pour la compatibilité. Le point important : FAT32 et exFAT n'ont pas de journalisation comparable au `$UsnJrnl` ou au `$LogFile`. Sans ces logs, suivre les opérations sur les fichiers est bien plus dur. Un joueur peut supprimer un cheat d'une clé FAT32 juste avant ou pendant le screenshare en laissant beaucoup moins de traces qu'avec la même action en NTFS. Prefetch ou BAM peuvent encore logguer l'exécution si le cheat a tourné depuis la clé, mais prouver la suppression sur FAT32 repose surtout sur les outils de récupération ou des logs externes.
- **Ce qu'il faut vérifier :**
  - Identifier les périphériques branchés : USBDeview (Nirsoft), l'outil USB d'Echo, les journaux d'événements (Kernel-PnP) et les clés `USBSTOR` du registre montrent les périphériques USB actuels et passés. Chercher ceux branchés ou débranchés juste avant le screenshare.
  - Vérifier le système de fichiers : si la clé est présente, regarder son type (Propriétés ou Gestion des disques). Si c'est FAT32/exFAT et qu'on la soupçonne, pas d'analyse de journal possible.
  - Analyser le contenu (si présente) : Search Everything, inspection manuelle.
  - Récupération de fichiers (surtout FAT32/exFAT) : sans journalisation, Recuva ou le navigateur de fichiers de FTK Imager deviennent importants pour retrouver les fichiers supprimés.
  - Logs d'exécution : chercher dans Prefetch, BAM, etc., les exécutions venant de la lettre ou du chemin du disque USB.
