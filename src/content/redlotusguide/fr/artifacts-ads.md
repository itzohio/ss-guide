<!-- route: /advanced-explanation-of-artifacts/file-system-activity/alternate-data-streams-ads -->
# Alternate Data Streams (ADS)

### But et fonctionnement

Les Alternate Data Streams (ADS) sont une fonction propre à NTFS qui permet d'associer plusieurs flux de données à un même nom de fichier. Chaque fichier d'un volume NTFS a un flux principal par défaut, techniquement sans nom mais souvent appelé `:$DATA`. C'est lui qui contient le contenu attendu : le texte d'un `.txt`, les pixels d'un `.jpg`, le code machine d'un `.exe`.

Mais NTFS permet d'attacher autant de flux nommés qu'on veut à la même entrée MFT. Par exemple, `MyDocument.txt` peut contenir son texte principal et héberger en même temps un exécutable caché dans un flux séparé, comme `MyDocument.txt:HiddenApp.exe`.

Cette fonction avait été conçue pour la compatibilité avec l'ancien système de fichiers Mac HFS, et elle est aujourd'hui rarement utilisée à des fins légitimes.

Vue DFIR, les ADS sont une technique bien connue des malwares et des utilisateurs avertis pour cacher des données.

### Mécanisme de dissimulation

La force des ADS, c'est leur invisibilité pour les outils Windows standard.

- **Invisibilité dans l'Explorateur :** l'Explorateur Windows et la commande `dir` de l'invite de commandes n'affichent pas par défaut l'existence ni la taille des flux alternatifs. Un fichier avec une grosse charge cachée dans un ADS affichera la taille de son flux principal seulement, donc l'air parfaitement anodin.
- **Création et exécution :**
  - Un ADS se crée facilement en ligne de commande. Par exemple, `type C:\path\to\cheat.exe > C:\path\to\benign_file.txt:hidden.exe` envoie tout le binaire du cheat dans un nouveau flux `hidden.exe` attaché à `benign_file.txt`.
  - Exécuter du code caché dans un ADS n'est pas aussi simple qu'un double-clic. Il faut des techniques précises, comme `wmic process call create "C:\path\to\file.txt:hidden.exe"`, `forfiles.exe`, ou d'autres méthodes de scripting.

### Données et valeur forensique

Un ADS peut contenir n'importe quoi : du simple texte, des binaires entiers, des scripts, des fichiers de config. Sa valeur forensique tient à son usage comme cachette.

- **Cacher une charge malveillante :** l'usage malveillant le plus courant. Des outils de cheat, des malwares et des scripts peuvent être stockés dans un ADS attaché à un fichier légitime et insoupçonnable (`notepad.exe`, une DLL système, un simple fichier texte).
- **Cacher configs et logs :** des cheats peuvent utiliser un ADS pour stocker leurs réglages ou leurs logs, hors de portée d'une recherche basique.
- **Le flux `Zone.Identifier` (exemple légitime) :** un des rares usages légitimes courants. Quand un fichier est téléchargé depuis Internet, Windows y ajoute souvent ce flux. Il contient des métadonnées indiquant que le fichier vient d'une source non fiable (la "zone Internet"), ce qui déclenche l'avertissement de sécurité au lancement. L'analyser est utile pour prouver l'origine d'un fichier.

### Détection et analyse

La détection demande des commandes précises ou des outils dédiés.

- **Ligne de commande :**
  - `dir /r` : liste les flux alternatifs de tous les fichiers du dossier courant.
  - PowerShell : `Get-Item -Path .\file.txt -Stream *` liste tous les flux d'un fichier.
- **Outils dédiés :** des utilitaires graphiques comme AlternateStreamView (Nirsoft) ou Streams (Sysinternals) sont indispensables. Ils scannent vite des dossiers ou disques entiers, listent les fichiers avec ADS et permettent de voir, extraire ou supprimer le contenu du flux.
- **Journal USN (`$UsnJrnl`) :** la création, la modification ou la suppression d'un ADS est journalisée, souvent avec des codes comme `STREAM_CHANGE` ou `NAMED_DATA_OVERWRITE`, associés au fichier hôte. Ces événements sur un fichier anodin sont un fort indicateur d'activité ADS.
- **Analyse MFT :** la présence d'ADS est notée dans l'enregistrement MFT du fichier hôte, en général dans l'attribut `$ATTRIBUTE_LIST` quand il y a plusieurs flux.

#### Points de réflexion (SS Contest)

Pour un SSer, connaître les ADS est crucial pour trouver ce qu'un joueur a vraiment tenté de cacher.

- **Une cachette classique :** les ADS sont une technique de choix pour cacher des cheats. Il faut scanner les dossiers utilisateur courants (Bureau, Téléchargements, Temp) et les dossiers du jeu avec un outil comme AlternateStreamView. Un flux anormalement gros, ou portant un nom en `.exe` ou `.dll`, attaché à un fichier non exécutable, est un gros signal.
- **Preuve d'exécution :** cacher le fichier est une chose, le lancer en est une autre. Si tu trouves dans l'historique de commandes du joueur (PowerShell, par exemple) ou dans un dump mémoire une commande qui utilise `wmic` ou `forfiles` avec deux-points (`:`) dans le chemin, tu as probablement la commande qui a lancé la charge depuis un ADS.
- **Contexte via `Zone.Identifier` :** ce flux est une preuve complémentaire utile. Si un fichier suspect l'a, tu peux lire son contenu (avec Notepad, par exemple) pour voir le `HostUrl` d'où il a été téléchargé, ce qui peut le relier à un site de distribution de cheats connu.
- **Recouper avec le journal :** si tu suspectes des ADS mais que les fichiers ont disparu, cherche dans le journal USN des `STREAM_CHANGE` sur des fichiers récemment modifiés ou supprimés. Ça peut prouver qu'on manipulait des ADS, même sans récupérer le contenu.
