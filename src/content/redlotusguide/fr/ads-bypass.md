<!-- route: /screensharing-general-knowledge/eighth-section-common-bypass-techniques-in-screensharing/concealment-and-obfuscation/3-alternate-data-streams -->
# Les Alternate Data Streams (ADS)

- **Description :** comme vu dans les fondamentaux de Windows, les ADS de NTFS permettent de planquer des données "derrière" un fichier ou un dossier normal, sans changer sa taille ni son contenu apparent dans l'Explorateur.
- **Mécanisme :** un tricheur peut stocker un exécutable complet (`cheat.exe`) ou n'importe quoi de malveillant dans un flux attaché à un fichier innocent (`notes.txt`).
  - Création, par exemple en invite de commandes : `type C:\path\to\cheat.exe >> C:\path\to\benign_file.txt:hidden_stream_name.exe`. Le `type >>` envoie le contenu binaire du cheat dans le flux du fichier innocent.
  - Exécution : il faut souvent une commande précise, comme `wmic process call create "C:\path\to\benign_file.txt:hidden_stream_name.exe"`, ou un utilitaire comme `forfiles`. Double-cliquer sur `benign_file.txt` ne lance pas le contenu du flux.
- **Pourquoi les tricheurs font ça :** c'est une technique de dissimulation puissante. Le payload échappe à la navigation et aux scans simples qui ne regardent que les fichiers autonomes. Le fichier hôte a l'air parfaitement normal, en taille comme en contenu.
- **Détection :**
  - Visionneuses d'ADS : AlternateStreamView (Nirsoft) ou Streams de Sysinternals sont indispensables. Scanner les dossiers utiles (Téléchargements, Bureau, Temp, dossiers du jeu) ou le disque entier pour lister les fichiers avec des flux. Regarder les flux aux noms suspects ou de taille importante.
  - Ligne de commande : `dir /r` liste les flux du dossier courant. `Get-Item -Stream *` en PowerShell inspecte un fichier précis.
  - Journal USN : créer, modifier ou supprimer un ADS génère en général des événements `STREAM_CHANGE` ou `NAMED_DATA_OVERWRITE`/`EXTEND`/`TRUNCATION` sur le fichier hôte. Ces événements sur un fichier a priori normal sont suspects.
  - Analyse mémoire : si le contenu du flux a été exécuté, il peut rester des traces en mémoire (des chaînes du cheat caché dans `csrss.exe` ou dans le processus lancé via `wmic`).
  - Outils spécialisés : les suites forensic et Velociraptor ont souvent des modules dédiés (`Windows.NTFS.ADSHunter`) pour trouver et analyser les ADS sur tout le système.
