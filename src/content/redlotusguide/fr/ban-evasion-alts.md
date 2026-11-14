<!-- route: /screensharing-general-knowledge/ban-evasion-and-alt-account-detection/identifying-alternate-accounts-during-screenshare -->
# Repérer les comptes alternatifs pendant un screenshare

Relier le joueur en cours de screenshare à un compte déjà banni demande d'examiner les artefacts qui gardent des identités, des configs ou des identifiants de machine.

- **Noms d'utilisateur et artefacts de compte dans les fichiers :**
  - Les logs : les logs du client de jeu (`latest.log`, logs de chat), les logs de lanceurs (Lunar Client, Badlion Client) et parfois ceux des mods peuvent contenir des noms d'utilisateur ou des UUID liés aux comptes utilisés sur la machine.
  - Les fichiers de config des lanceurs : beaucoup stockent les infos de compte. Par exemple, des lanceurs custom ont un `accounts.json` ou équivalent dans leur dossier de données (`.lunarclient/`, `.feather/`, souvent dans `%appdata%` ou le dossier utilisateur sous Linux/macOS). Ça peut révéler plusieurs comptes liés à l'appareil.
  - Recherche de fichiers : les joueurs laissent parfois des noms dans des endroits inattendus — fichiers `.txt`, scripts, noms de dossiers du profil. Chercher les pseudos ou UUID bannis connus dans `C:\Users\%username%`, le Bureau, Téléchargements, Documents, et les dossiers AppData (`%appdata%`, `%localappdata%`).
  - Scripts PowerShell pour les alts : des scripts automatisent la recherche de pseudos aux endroits habituels. Par exemple, le script ADVANCE ALT CHECK parcourt récursivement les dossiers utilisateur pour les fichiers `.txt`, `.log`, `.json`, `.jar` et cherche un pseudo donné (un alt banni connu), puis sort la liste des fichiers trouvés. Ça va beaucoup plus vite qu'une navigation manuelle.
- **Analyse du registre :**
  - Profils utilisateur : chaque profil Windows a sa ruche (`NTUSER.DAT` dans `C:\Users\{username}\`). Les analyser (surtout s'il y a eu plusieurs profils) avec Registry Explorer révèle des réglages ou configs liés à d'autres comptes.
  - Clés logicielles : les clés des lanceurs, de logiciels associés (Discord) ou de composants Windows peuvent stocker des identifiants de compte, des clés de licence ou un historique d'usage qui relie plusieurs activités sur la même machine.
- **Système de fichiers et métadonnées :**
  - Arborescence : les chemins contiennent souvent le nom Windows (`C:\Users\BannedPlayerName\...`). Trouver des fichiers de jeu, des configs de cheat ou des logs pertinents dans plusieurs dossiers utilisateur distincts sur la même machine indique fortement l'usage d'alts.
  - Propriété des fichiers : c'est moins souvent vérifié, mais les métadonnées de propriétaire lient techniquement un fichier au SID de l'utilisateur qui l'a créé. Recouper les SID avec des profils bannis connus peut informer, mais c'est complexe.
- **Le lien par le HWID :**
  - Côté serveur : beaucoup de serveurs tiennent une base qui associe les comptes bannis aux HWID collectés lors des sessions ou des screenshares précédents.
  - Outils SS : certains outils (comme Echo) collectent le HWID de la machine pendant le scan. Ce HWID est ensuite comparé (automatiquement ou à la main) à la base des HWID bannis du serveur.
  - Détection : une correspondance entre le HWID de la machine actuelle et un HWID banni, c'est une preuve forte d'évasion, même avec un nouveau compte et un nouveau profil Windows. Le SSer doit savoir comment ses outils collectent le HWID et comment son serveur s'en sert pour les bans.
