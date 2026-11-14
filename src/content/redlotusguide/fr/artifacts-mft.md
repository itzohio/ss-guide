<!-- route: /advanced-explanation-of-artifacts/file-system-activity/master-file-table -->
# Master File Table

La Master File Table (MFT) est le cœur de NTFS. C'est un fichier système spécial qui sert de base de données et d'index central pour tout un volume. La MFT contient au moins un enregistrement (un file record segment, FRS) pour chaque fichier et chaque dossier du volume, y compris pour elle-même.

Vue DFIR, la MFT est la source de vérité ultime pour les métadonnées du système de fichiers. Elle donne un catalogue détaillé et structuré de presque tout ce qui existe, ou a récemment existé, sur un disque. L'analyser est une étape de base de toute enquête forensique sur un système de fichiers.

### Emplacement et structure

La MFT est un fichier en soi, nommé `$MFT`, à la racine du volume NTFS. Il est en général caché et inaccessible via l'Explorateur.

- Structure : une série d'enregistrements de taille fixe (souvent 1024 octets). Les premiers sont réservés aux fichiers de métadonnées NTFS (`$MFT`, `$LogFile`, `$Volume`, `$AttrDef`…). Les suivants sont attribués à un fichier ou un dossier à sa création.

Quand un fichier est supprimé, son enregistrement MFT est marqué inactif mais pas écrasé tout de suite. L'espace devient réutilisable pour un nouveau fichier. Ce délai offre une fenêtre précieuse pour récupérer les métadonnées d'un fichier supprimé.

### Métadonnées et attributs

Chaque enregistrement MFT est une fiche détaillée, qui stocke les métadonnées du fichier ou dossier sous forme d'attributs. Les principaux :

- `$STANDARD_INFORMATION` ($SI) : un jeu d'horodatages MACB (Modified, Accessed, Changed, Birth), les attributs du fichier (lecture seule, caché, système…) et les infos de propriété. Ce sont les horodatages que Windows affiche en général.
- `$FILE_NAME` ($FN) : le nom du fichier (en Unicode), la référence MFT du dossier parent et, surtout, un second jeu d'horodatages MACB indépendant. Ces horodatages sont souvent moins sensibles aux manipulations simples que ceux du `$SI`.
- `$DATA` : le contenu réel du fichier. Pour les très petits fichiers ("résidents"), les données sont stockées directement dans l'enregistrement MFT. Pour les plus gros, l'attribut contient des pointeurs vers les clusters où sont stockées les données.
- Autres attributs : les permissions (`$SECURITY_DESCRIPTOR`), les Alternate Data Streams (`$ATTRIBUTE_LIST`), etc.

### Valeur forensique

La MFT est indispensable pour reconstituer l'activité du système de fichiers et détecter les manipulations.

- **Catalogue complet :** parser la MFT donne la liste complète des fichiers et dossiers actifs, avec leurs métadonnées.
- **Récupération de fichiers supprimés :** en analysant les enregistrements inactifs pas encore écrasés, on peut récupérer des métadonnées critiques : noms d'origine, tailles, horodatages, ce qui prouve l'existence passée du fichier.
- **Détection de timestomping :** usage clé. Comme la MFT stocke deux jeux d'horodatages (`$SI` et `$FN`), un écart entre eux est un indicateur classique et fort de timestomping. Beaucoup d'outils anti-forensiques ne modifient que les `$SI`, plus accessibles, et laissent les `$FN` intacts comme preuve de la manipulation.
- **Suivre les déplacements :** la référence au dossier parent dans `$FN` aide à situer le fichier et à suivre ses déplacements dans le même volume.

Il faut des outils dédiés comme `MFTECmd` d'Eric Zimmerman, ou des suites comme FTK Imager, pour parser la MFT brute et l'afficher de façon lisible.

#### Points de réflexion (SS Contest)

Pour un SSer, la MFT est le registre de tous les fichiers du système et un outil de premier choix pour exposer les bypass avancés.

- **La vérité terrain :** la MFT dit ce qu'il y a réellement sur le disque. Elle peut révéler des fichiers ou dossiers cachés invisibles dans l'Explorateur.
- **Exposer le timestomping :** comparer les horodatages `$SI` et `$FN` est une des techniques les plus puissantes d'un SSer. Si un joueur prétend que son fichier de cheat est ancien, mais que la MFT montre un `$SI` à 2019 et un `$FN` à aujourd'hui, tu as la preuve définitive de la manipulation.
- **Récupérer les infos d'un fichier supprimé :** même si le joueur supprime un cheat avec Maj+Suppr, un parse rapide des enregistrements inactifs peut retrouver le nom et les horodatages, ce qui prouve qu'il existait quelques instants avant le screenshare.
- **Identifier les fichiers résidents :** les tricheurs utilisent parfois des outils ou scripts très petits. S'ils sont "résidents" dans la MFT, ils n'occupent pas de cluster séparé, ce qui les rend un peu plus durs à trouver avec du carving classique. Un parse complet de la MFT les trouve toujours.
