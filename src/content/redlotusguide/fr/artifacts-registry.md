<!-- route: /advanced-explanation-of-artifacts/system-configuration-and-persistence/registry -->
# Registre

### But et fonctionnement

Le registre Windows est une base de données hiérarchique centrale qui sert de dépôt de configuration pour l'OS et beaucoup d'applications installées. Il stocke un tas de réglages bas niveau : configuration matérielle, préférences utilisateur, détails d'installation logicielle, stratégies système. Windows et les logiciels tiers s'appuient lourdement dessus.

Vue DFIR, le registre est une des sources d'information les plus riches sur un système Windows. Son rôle critique en fait une cible de choix pour les malwares (persistance, évasion) comme pour les analystes (récupération de preuves).

### Emplacement et structure

Le registre n'est pas un seul fichier mais un ensemble de fichiers appelés ruches. Elles sont chargées en mémoire au démarrage et exposées dans la structure hiérarchique visible dans `regedit.exe`.

Les ruches principales et leurs emplacements :

- SYSTEM : `C:\Windows\System32\config\SYSTEM` (configuration matérielle et des services)
- SOFTWARE : `C:\Windows\System32\config\SOFTWARE` (réglages logiciels système)
- SAM : `C:\Windows\System32\config\SAM` (comptes utilisateurs locaux et sécurité)
- SECURITY : `C:\Windows\System32\config\SECURITY` (stratégies de sécurité)
- NTUSER.DAT : `C:\Users\%username%\NTUSER.DAT` (réglages du profil utilisateur)
- UsrClass.dat : `C:\Users\%username%\AppData\Local\Microsoft\Windows\UsrClass.dat` (enregistrement COM par utilisateur et réglages du shell)

Le registre est organisé en arbre de clés (comme des dossiers) et de valeurs (comme des fichiers) qui contiennent les données.

### Valeur forensique : configuration et persistance

Le registre contient d'innombrables artefacts (UserAssist et Shellbags sont traités ailleurs). Ici, l'intérêt principal est la configuration système et les mécanismes de persistance classiques.

- **Preuve d'installation :** de nombreux enregistrements d'installations sous `HKLM\SOFTWARE\Microsoft\Windows\CurrentVersion\Uninstall`. Ces entrées peuvent prouver qu'une application (un installeur de cheat connu, par exemple) a été installée, avec parfois des infos qui restent après désinstallation.
- **Configuration système et sécurité :** les clés de `SYSTEM` et `SECURITY` révèlent des réglages critiques. On peut vérifier si des fonctions de sécurité ont été désactivées (UAC, Windows Defender), si des services ont été modifiés, ou s'il existe des stratégies destinées à gêner l'enquête (bloquer `cmd.exe` ou `regedit.exe`).
- **Persistance via `Run` et `RunOnce` :** les mécanismes de persistance les plus classiques sur Windows. Les programmes listés dans ces clés se lancent automatiquement au démarrage ou à l'ouverture de session. Les malwares et loaders de cheats y sont souvent placés. Emplacements :
  - `HKLM\Software\Microsoft\Windows\CurrentVersion\Run`
  - `HKLM\Software\Microsoft\Windows\CurrentVersion\RunOnce`
  - `HKCU\Software\Microsoft\Windows\CurrentVersion\Run`
  - `HKCU\Software\Microsoft\Windows\CurrentVersion\RunOnce`
- **Autres mécanismes :** le registre héberge aussi `AppInit_DLLs`, le COM hijacking (modification de clés CLSID) et la création de services malveillants sous `HKLM\SYSTEM\CurrentControlSet\Services`.
- **Preuve de manipulation :** la date "LastWrite" d'une clé indique quand elle ou une de ses valeurs a été modifiée. Un LastWrite récent sur une clé de persistance, ou sur une clé censée être statique, est un fort indicateur d'activité malveillante récente. Les parseurs forensiques savent aussi souvent retrouver les clés et valeurs supprimées, ce qui révèle les tentatives d'effacement.

#### Points de réflexion (SS Contest)

Pour un SSer, le registre est une cible majeure pour trouver les cheats "collants" et les modifications système faites pour tricher.

- **Chasser les cheats au démarrage :** les clés `Run` font partie de tout screenshare sérieux. Trouver le chemin d'un loader de cheat ou d'un exécutable inconnu dans une de ces clés prouve une tentative de persistance.
- **Découvrir la manipulation système :** un joueur peut désactiver des fonctions de sécurité via le registre pour faire tourner ses cheats sans être gêné. On peut vérifier certaines clés de stratégie (par exemple `DisableCMD` pour bloquer l'invite de commandes, ou des clés affaiblissant Windows Defender).
- **L'horodatage LastWrite :** une preuve simple mais forte. Si tu trouves une entrée suspecte dans une clé `Run`, le LastWrite de la clé te dit quand elle a été ajoutée, ce qui peut la relier directement à la session de jeu en cours.
- **Récupérer la persistance supprimée :** un outil comme Registry Explorer qui montre les clés supprimées est vital. Un joueur peut lancer un cheat qui s'ajoute à une clé `Run` puis supprimer l'entrée avant le SS. Un parseur forensique retrouve souvent l'entrée supprimée, ce qui prouve à la fois l'exécution et la tentative de masquage.
