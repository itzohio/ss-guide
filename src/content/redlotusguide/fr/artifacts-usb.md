<!-- route: /advanced-explanation-of-artifacts/system-configuration-and-persistence/usb-drive -->
# Périphériques USB

### But et fonctionnement

Windows garde un historique détaillé des périphériques de stockage USB connectés. Le but : rendre le plug and play fluide. Quand un périphérique est rebranché, Windows utilise cet historique pour le reconnaître vite, charger le bon pilote et lui assigner une lettre de lecteur sans refaire toute l'installation.

Vue DFIR, cette commodité crée un journal persistant et précieux de tous les stockages externes branchés sur la machine. Cet historique peut prouver qu'un périphérique a été utilisé, même s'il n'est plus là physiquement.

### Emplacement et structure

Les preuves sont réparties sur plusieurs endroits, surtout dans le registre et les logs système.

- **Registre, clé `USBSTOR` :**
  - Emplacement : `HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Enum\USBSTOR`
  - Structure : la clé principale pour les périphériques de stockage USB. Une sous-clé par périphérique unique connecté, nommée d'après ses identifiants matériels (Vendor ID, Product ID, numéro de série unique).
  - Métadonnées : dans chaque sous-clé, le nom convivial du périphérique, ses Hardware IDs et un horodatage de première installation.
- **Registre, `MountedDevices` :**
  - Emplacement : `HKEY_LOCAL_MACHINE\SYSTEM\MountedDevices`
  - Structure : associe les identifiants de volume (`\DosDevices\E:`) à des GUID de volume, ce qui aide à relier un périphérique aux lettres de lecteur assignées.
- **Fichier de log, `setupapi.dev.log` :**
  - Emplacement : `C:\Windows\inf\setupapi.dev.log`
  - Structure : un log texte qui détaille les installations de périphériques et de pilotes, avec des horodatages précis de première connexion et de dernière connexion/déconnexion d'un USB.

### Métadonnées stockées

En recoupant ces sources, on dresse un profil complet de chaque périphérique :

- Identifiants : VID, PID et numéro de série unique, ce qui identifie souvent le modèle exact.
- Nom du périphérique : le nom convivial reporté à l'OS ("SanDisk Cruzer Blade", par exemple).
- Première connexion : la date et l'heure de la toute première connexion (`USBSTOR` et `setupapi.dev.log`).
- Dernière connexion : la date et l'heure de la connexion la plus récente (`setupapi.dev.log`).
- Dernière déconnexion : la date et l'heure du dernier débranchement (`setupapi.dev.log`).
- Lettre assignée : la lettre de lecteur (`E:`, par exemple) attribuée au volume.

### Valeur forensique

Analyser cet historique est essentiel pour comprendre comment des données et programmes ont pu entrer ou sortir.

- **Prouver la présence d'un périphérique :** preuve définitive qu'un stockage USB précis a été connecté, ce qui démolit le "je n'ai jamais utilisé de clé".
- **Établir une timeline d'utilisation :** les horodatages de première connexion, dernière connexion et dernier débranchement permettent de savoir quand le périphérique interagissait avec le système, à recouper avec d'autres preuves (exécution depuis une lettre de lecteur précise, par exemple).
- **Identifier l'origine de fichiers malveillants :** si des fichiers malveillants ont été exécutés depuis un support amovible, l'historique aide à identifier le périphérique, donc l'objet physique.
- **Suivre l'exfiltration :** dans une enquête sur un vol de données, l'historique montre quels périphériques étaient branchés quand les données ont disparu.

Des outils comme `USBDeview` (Nirsoft), `JLECmd` d'Eric Zimmerman (qui parse les logs `setupapi`) ou des suites forensiques servent à agréger et parser tout ça.

#### Points de réflexion (SS Contest)

Pour un SSer, l'historique USB est l'outil principal contre une des plus vieilles méthodes de bypass : lancer les cheats depuis un support amovible.

- **Le bypass "cheat sur clé USB" :** tactique courante : stocker ses cheats sur une clé, les lancer de là, puis débrancher la clé avant le screenshare. Le but est de ne rien laisser sur le disque principal. L'historique USB démolit complètement cette tactique.
- **Trouver la clé débranchée récemment :** la preuve la plus forte, c'est une entrée dans `setupapi.dev.log` (ou dans `USBDeview`) montrant un stockage USB débranché quelques instants avant le début du screenshare. Indicateur très fort d'une tentative de cacher le périphérique.
- **Recouper avec l'exécution :** si Prefetch ou BAM montre l'exécution d'un fichier depuis `E:\`, on peut vérifier l'historique USB pour prouver qu'un périphérique précis a été monté en `E:` récemment, ce qui relie l'objet physique à l'exécution du cheat.
- **Contexte FAT32/exFAT :** les joueurs utilisent souvent du FAT32 ou exFAT sur leurs clés, qui n'ont pas de journalisation robuste (`$UsnJrnl`). L'historique USB devient donc encore plus critique, car c'est parfois la seule trace persistante de la présence et de l'activité du périphérique.
