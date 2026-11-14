<!-- route: /screensharing-minecraft-knowledge/fifth-section-specific-context-minecraft/minecraft-and-java/minecraft-folder -->
# Le dossier .minecraft (emplacement, structure)

Minecraft stocke tous ses fichiers essentiels — assets, configs, logs, mondes sauvegardés, resource packs, shaders et surtout mods — dans un dossier principal, le fameux `.minecraft`.

- **Emplacement par défaut :** sous Windows, il est dans le dossier roaming AppData de l'utilisateur : `C:\Users\{username}\AppData\Roaming\.minecraft`. On y accède souvent vite via Win+R avec `%appdata%\.minecraft`.
- **Emplacement variable :** IMPORTANT : l'emplacement du `.minecraft` utilisé par l'instance en cours n'est PAS FIXE et ne doit JAMAIS être supposé être le chemin par défaut sans vérification. Les lanceurs custom ou une config manuelle peuvent le mettre n'importe où (`D:\Games\MinecraftInstances\MyModpack`, `C:\MultiMC\Instances\Forge1.8.9\.minecraft`…). Ne vérifier que `%appdata%\.minecraft` est une erreur classique qui fait rater des preuves et rend le screenshare inefficace.
- **Trouver le bon dossier pendant un screenshare :** identifier le vrai dossier du jeu utilisé par l'instance en cours est primordial. Les méthodes les plus fiables :
  - **Depuis le jeu (à faire en premier) :**
    - Minecraft lancé, aller dans Options… (ou l'équivalent).
    - Choisir Resource Packs….
    - Cliquer sur "Ouvrir le dossier des packs" (le libellé varie selon la version et la langue).
    - Ça ouvre le sous-dossier `resourcepacks` du dossier de jeu actif.
    - Remonter d'un niveau : ce dossier parent, c'est le `.minecraft` (ou la racine de jeu équivalente) utilisé par cette instance. Noter le chemin.
  - **System Informer (analyse de processus, avancé/confirmation) :**
    - Lancer System Informer en admin (pilote noyau activé si besoin).
    - Trouver le `javaw.exe` de l'instance Minecraft.
    - Clic droit > Properties > onglet Memory > bouton Strings.
    - Configurer la recherche (longueur min. 5, Mapped & Private cochés).
    - Cliquer sur Filter et choisir un filtre "Contains (insensible à la casse)".
    - Chercher des chaînes contenant des noms de sous-dossiers courants : `\mods`, `\versions` ou `\resourcepacks`.
    - Lire les chemins complets trouvés en mémoire : ils révèlent les dossiers que le jeu utilise vraiment, ce qui confirme le bon `.minecraft` et ses sous-dossiers.
- **Structure et sous-dossiers utiles :** dans le bon dossier racine, plusieurs sous-dossiers comptent pour la détection :
  - `versions/` : un sous-dossier par version installée (vanilla ou moddée Forge/Fabric), avec les `.jar` du jeu (cibles possibles de JavaEdit) et les bibliothèques associées.
  - `mods/` : l'endroit où sont placés les mods Forge ou Fabric (`.jar`) chargés par le jeu. Cible principale de l'analyse.
  - `libraries/` : les bibliothèques Java nécessaires à Minecraft et à Forge/Fabric. Des bibliothèques modifiées ou malveillantes peuvent parfois s'y cacher.
  - `logs/` : les logs du jeu et de Forge/Fabric (`latest.log`, `debug.log`), avec les erreurs, les mods chargés et parfois des infos utiles au contexte.
  - `config/` : les fichiers de config des mods (`.cfg`, `.toml`, `.json`), qui peuvent révéler des réglages suspects.
  - `resourcepacks/` et `shaderpacks/` : en principe des assets cosmétiques, mais les dates de modification ou des types de fichiers bizarres peuvent parfois être pertinents.
