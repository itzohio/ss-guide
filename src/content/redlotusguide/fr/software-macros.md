<!-- route: /screensharing-minecraft-knowledge/sixth-section-mouse-macro-and-input-analysis-in-screensharing/2-macro-analysis/detecting-software-based-macros -->
# Détecter les macros logicielles

Détecter une macro stockée sur le PC, ça veut dire retrouver et examiner les fichiers de config et les réglages du logiciel de la souris du joueur. La plupart des fabricants de souris gaming fournissent un logiciel qui permet de tout personnaliser, y compris créer et assigner des macros. Ces réglages sont en général stockés dans des fichiers ou des bases de données aux emplacements classiques des données utilisateur ou système.

Détection par marque (fichiers et emplacements de config)

L'emplacement et le format exacts changent beaucoup selon le fabricant, et même selon la version du logiciel. Voici les emplacements connus ou souvent suspects pour plusieurs marques courantes :

- **Logitech :**
  - Logitech Gaming Software (LGS, ancien) : voir `%localappdata%\Logitech\Logitech Gaming Software\`. Chercher des fichiers comme `settings.json` ou des `.xml` contenant profils et définitions de macros.
  - Logitech G HUB (récent) : voir `%localappdata%\LGHUB\`. La config principale est souvent dans `settings.db` (une base SQLite, à ouvrir avec un navigateur de base) ou dans des fichiers et dossiers proches. Regarder d'abord les dates de modification.
- **Razer :**
  - Synapse 2 (ancien) : voir les dossiers d'installation (`C:\Program Files (x86)\Razer`, etc.) et `%localappdata%\Razer` ou `%programdata%\Razer` pour les fichiers de profils et macros (souvent `.xml`).
  - Synapse 3 : config plus complexe, avec synchro cloud possible. Voir `C:\ProgramData\Razer\Synapse3\Accounts\` pour les données de compte et `%localappdata%\Razer\Synapse3\Log\` pour les logs d'activité (changements de profil, usage de macros). Les macros peuvent être dans des structures de profil complexes, voire côté serveur : l'interface du logiciel est alors indispensable.
- **SteelSeries :**
  - SteelSeries Engine / GG : voir `%localappdata%\steelseries-engine-3-client\Local Storage\leveldb\` ou des chemins similaires dans `%localappdata%` ou `%programdata%`. SteelSeries utilise souvent des bases LevelDB, qui demandent des outils dédiés. Voir aussi les `.json` et fichiers de config des dossiers voisins.
- **Roccat :**
  - Roccat Swarm : voir `%appdata%\ROCCAT\SWARM\`. Chercher des sous-dossiers comme `macro` avec des fichiers `custom_macro_list.xml` ou `macro_list.dat`. Lire les `.xml` pour les définitions de macros.
- **Red Dragon :**
  - Les chemins varient selon le modèle. Voir `%homepath%\Documents\` pour des dossiers du type `M### Gaming Mouse`. Dedans, chercher un sous-dossier `MacroDB` avec un `MacroData.db`.
- **Glorious :**
  - Voir `%appdata%\BY-COMBO2\` (le chemin varie un peu selon le logiciel et le modèle). Chercher des `.json` ou `.ini`, et les sous-dossiers `Mac` ou `Macro`.
- **Cooler Master :**
  - Voir `%localappdata%\CoolerMaster`, `%appdata%\CoolerMaster` ou `%programdata%\CoolerMaster` pour les fichiers de config (`.json`, `.xml`, `.ini`, parfois `.db`).
- **Bloody :**
  - Voir le dossier d'installation, par exemple `C:\Program Files (x86)\Bloody7\Bloody7\Data\Mouse\English\ScriptsMacros\GunLib\` pour Bloody7. Voir aussi AppData pour les fichiers liés (`.ini`, `.amc2`).
- **Mad Catz :** voir le dossier d'installation et les emplacements AppData classiques.
- **Mars Gaming :** voir le dossier d'installation et AppData pour des `.xml` ou `.ini`.
- **Ayax (Noganet) :** voir le chemin d'installation, par exemple `C:\Program Files\AYAX GamingMouse\`, et un fichier `record.ini`.
- **Krom (modèle Kolt) :** voir `%AppData%\Local\VirtualStore\Program Files (x86)\KROM KOLT\Config` (chemin de virtualisation si le logiciel tourne avec des permissions non standard), et un `sequence.dat`.
- **BlackWeb :** voir le chemin d'installation, par exemple `C:\Blackweb Gaming AP\config\`, avec des extensions inhabituelles comme `.MA32AIY`.
- **YanPol (souvent du matériel proche de Glorious/Ajazz) :** voir `%appdata%\BYCOMBO-2\` (ou similaire) et les sous-dossiers `Mac\`.
- **MotoSpeed (exemple V60) :** voir le chemin d'installation, par exemple `C:\Program Files (x86)\MotoSpeed Gaming Mouse\V60\modules`, et les sous-dossiers comme `Settings` avec des `.bin` ou des configs.
- **Asus (ROG Armoury) :** voir `C:\Users\%username%\Documents\ASUS\ROG\ROG Armoury\common\` et un sous-dossier `Macro`.
- **Corsair (iCUE) :** voir `C:\Users\%username%\AppData\Roaming\Corsair\CUE` (ou `Local` au lieu de `Roaming`), dans `Config.cuecfg` (ou un fichier de config complexe similaire). Chercher dedans des chaînes comme `RecMouseCLicksEnable`. Une technique avancée consiste à dumper la mémoire de `iCUE.exe` et filtrer les chaînes comme `MemberFuncSlot`.

Étapes d'analyse des macros logicielles :

- **Identifier la souris :** déterminer la marque et le modèle exacts. Demander au joueur, ou regarder dans les réglages de périphériques Windows.
- **Regarder l'interface du logiciel :** la méthode la plus directe, c'est souvent d'ouvrir le logiciel officiel (G HUB, Synapse, Swarm, iCUE) et d'aller dans les sections de définition de macros et d'assignation des boutons. Chercher les macros liées à des boutons, surtout celles qui font des clics gauche/droit rapides.
- **Vérifier les emplacements de config :** aller dans les chemins correspondant à la marque identifiée.
- **Regarder les dates :** la date de modification des fichiers, bases et dossiers concernés. Une modification juste avant le screenshare est très suspecte : mise en place ou suppression de macro.
- **Analyser le contenu :**
  - Ouvrir les fichiers texte (`.json`, `.xml`, `.ini`) dans un éditeur et chercher des mots-clés comme "macro", "click", "delay", "repeat", ou des assignations précises ("LeftMouseButton", "Button 4"). Chercher les séquences de clics rapides avec de petits délais.
  - Ouvrir les bases `.db` avec un navigateur SQLite (DB Browser for SQLite) et examiner les tables de profils, macros ou bindings.
  - Pour LevelDB ou d'autres formats, utiliser des outils dédiés (plus avancé).
- **Vérifier les logs :** les fichiers de log du logiciel (Razer, par exemple) peuvent montrer un changement de profil, une exécution de macro, des erreurs ou l'activation d'un mode performance ("Turbo").
