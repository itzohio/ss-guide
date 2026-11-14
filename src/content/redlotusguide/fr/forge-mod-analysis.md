<!-- route: /screensharing-minecraft-knowledge/fifth-section-specific-context-minecraft/specific-analysis-for-minecraft/forge-mod-analysis -->
# Analyse des mods Forge

Ce process détaille comment examiner méthodiquement les mods Forge (les `.jar` du dossier `mods`) pour y trouver des cheats ou des modifications.

**Phase 1 : préparation et localisation du bon dossier `mods`**

Tout commence par une bonne préparation et une identification précise du dossier cible.

- **Afficher les fichiers cachés :** avant de commencer, vérifier que l'Explorateur Windows affiche les fichiers cachés, les dossiers cachés et les fichiers système protégés. Le dossier `mods`, ou des fichiers dedans, peuvent être cachés exprès.
- **Localiser le `.minecraft` actif :** comme dit plus haut, ne pas partir du chemin par défaut. Utiliser la méthode en jeu (Options > Resource Packs > Ouvrir le dossier des packs > remonter d'un niveau) ou la recherche de chaînes System Informer (chercher `\mods` dans la mémoire de `javaw.exe`) pour identifier de façon certaine la racine du jeu et le sous-dossier `mods` utilisés par l'instance en cours. Noter le chemin exact.

**Phase 2 : vérifications préalables sur le dossier `mods`**

Avant d'analyser les `.jar` un par un, inspecter le dossier en lui-même.

- **Date de dernière modification :** regarder la date de modification du dossier `mods`.
  - Indicateur critique (potentiellement ban) : si elle est très récente, surtout juste avant le début du screenshare ou pendant la session de jeu examinée, ça sent fort la manipulation. Des fichiers ont probablement été ajoutés, retirés ou remplacés très récemment, souvent pour cacher des cheats avant le check. Beaucoup de serveurs considèrent ça comme un motif de ban direct, vu la forte probabilité de modification des preuves.

**Phase 3 : analyse détaillée des fichiers de mods (`.jar`)**

Passer au crible chaque `.jar` présent dans le dossier `mods` actif.

- **Identifier les mods chargés (méthode simple) :** le jeu lancé, essayer de déplacer chaque `.jar` hors du dossier `mods` (vers le Bureau, par exemple). Les fichiers qui refusent de bouger avec une erreur "fichier utilisé" sont chargés et verrouillés par `javaw.exe`. Ceux qui bougent n'ont pas été chargés par l'instance en cours (ou ont pu être déchargés par une technique de bypass, voir la phase 4). Noter quels mods sont réellement chargés.
- **Analyse de la taille (poids) :** vérifier la taille en Ko ou Mo de chaque `.jar`. Les SSers expérimentés ont une idée de la taille typique des mods courants (Optifine, Keystrokes, Togglesneak) selon la version.
  - Suspicion : une taille très supérieure ou inférieure à la normale pour ce mod et cette version précise est un gros signal qui demande à creuser.
  - Exemple : un mod Togglesneak courant pour 1.8.9 pèse en général 24 à 30 Ko. Un `Togglesneak-1.8.9.jar` de 64 Ko, ou de 10 Ko, est très suspect : décompilation et vérification de hash immédiates. Noter les mods aux tailles anormales.
- **Analyse du contenu par décompilation (Luyten, Recaf) :** utiliser un décompilateur Java fiable (Luyten, Recaf) pour examiner la structure et le code des mods suspects (taille anormale, nom de cheat connu, ou autre raison).
  - Procédure : glisser le `.jar` suspect dans la fenêtre du décompilateur.
  - Quoi chercher :
    - Noms de classes ou de packages suspects : des dossiers ou fichiers dont le nom évoque clairement une fonction de cheat (`autoclicker`, `aimassist`, `reach`, `velocity`, `killaura`, `scaffold`, `fly`, `speed`, `esp`, `xray`, `selfdestruct`, `bypass`, `exploit`).
    - Code inattendu : du code de cheat dans un mod censé être purement cosmétique ou de performance (une logique de clic complexe dans un simple mod de HUD, par exemple).
    - Obfuscation : signal critique. C'est le brouillage volontaire du code pour le rendre illisible et gêner l'analyse. Chercher :
      - Une structure de code volontairement tordue ou absurde.
      - Indicateur critique (potentiellement ban) : l'obfuscation lourde est très utilisée par les développeurs de cheats pour cacher du code et empêcher la détection. Comme vérifier la légitimité d'un code obfusqué pendant un screenshare chronométré est impossible, beaucoup de serveurs bannissent purement et simplement la présence de mods obfusqués.
      - Des noms de classes, méthodes et variables sans sens ou à une lettre (`a.class`, `b.class`, `a()`, `b()`, `var1`, `var2`).
      - Des noms très longs et aléatoires (`aBcDeFgHiJkLmNoPqRsT.class`).
      - Des caractères ou symboles non standard dans les noms.
- **Vérification d'intégrité par hash (SHA256 / HashMyFiles) :** la méthode définitive pour savoir si un mod, même crédible par son nom et sa taille (Optifine, par exemple), a été modifié ou n'est pas la version officielle.
  - Outils : un calculateur de hash fiable comme HashMyFiles (Nirsoft), l'outil intégré de 7-Zip, ou `Get-FileHash` en PowerShell. SHA256 est l'algorithme recommandé.
  - Procédure : calculer le SHA256 du `.jar` du joueur, récupérer le hash officiel de la même version, comparer.
  - Indicateur critique (potentiellement ban) : si les hash diffèrent, c'est la preuve que le fichier du joueur a été modifié et n'est pas légitime. Ça peut être un mod officiel trafiqué avec des cheats, une fausse version au même nom, ou un fichier corrompu. Bien comparer avec le hash de la version précise : comparer deux versions différentes donne forcément un écart, source classique de faux positifs.
  - Récupérer le hash officiel uniquement sur des sources de confiance : le site du développeur (optifine.net, par exemple), des plateformes sérieuses comme CurseForge ou Modrinth, ou des wikis et bases communautaires fiables. Pas les hash d'un forum random.

**Phase 4 : détecter les mods "déchargés" (analyse mémoire)**

Cette technique avancée cherche à repérer les mods présents dans `mods` au démarrage du jeu mais retirés ou renommés ensuite, souvent pour échapper à la détection. Les références à ces mods déchargés peuvent rester dans la mémoire du jeu.

- **Outil :** System Informer (ou son prédécesseur Process Hacker) lancé en admin, avec le pilote noyau activé pour un accès complet à la mémoire des processus.
- **Procédure :**
  - Trouver le `javaw.exe` de l'instance Minecraft.
  - Clic droit > Properties.
  - Onglet Memory.
  - Cliquer sur Strings.
  - Configurer : longueur minimale raisonnable (5 ou plus pour réduire le bruit), types Mapped et Private cochés (Image peut être décoché pour réduire le bruit, mais le laisser est plus sûr au début), support Unicode activé. OK.
  - Dans la fenêtre des résultats, cliquer sur Filter.
  - Choisir Contains (insensible à la casse).
  - Coller le chemin complet et exact du dossier `mods` actif (repéré en phase 1).
- **Lire le résultat :** System Informer affiche toutes les chaînes de la mémoire de `javaw.exe` qui contiennent ce chemin. La liste inclut souvent les chemins complets des `.jar` chargés ou référencés par le jeu.

Comparaison : comparer soigneusement la liste des chemins `.jar` trouvés en mémoire avec la liste des `.jar` réellement présents dans le dossier `mods` sur le disque (dans l'Explorateur).

Indicateur critique (potentiellement ban) : si le scan mémoire montre le chemin complet d'un mod (`C:\Users\Player\AppData\Roaming\.minecraft\mods\SuspiciousCheatMod.jar`) alors que ce `.jar` n'est plus sur le disque, c'est une forte preuve que le mod a été "déchargé" (si le cheat le permet) puis supprimé, déplacé ou renommé après le lancement du jeu, typiquement pour échapper au screenshare.

**BONUS : HabibiModAnalyzer (script PowerShell)**

Pour accélérer la vérification d'intégrité, surtout la comparaison de hash, le script PowerShell HabibiModAnalyzer, créé par le membre de la communauté HadronCollision, est très efficace.

- **Fonction :** le script automatise la vérification d'intégrité en comparant les hash des `.jar` d'un dossier `mods` à l'immense base de données de Modrinth (une plateforme de mods de confiance). Il identifie vite les mods trafiqués (hash différent). Il embarque aussi quelques heuristiques de détection de cheats et peut analyser l'ADS Zone.Identifier pour déterminer l'origine probable du téléchargement (des mods venus de sources non fiables, par exemple).
- **Commande d'exécution :** pour lancer le script directement depuis GitHub dans une fenêtre PowerShell (en admin) :

```powershell
  Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass; Invoke-Expression (Invoke-RestMethod https://raw.githubusercontent.com/HadronCollision/PowershellScripts/refs/heads/main/HabibiModAnalyzer.ps1)
```

Le script demande en général le chemin du dossier `mods` à analyser.
