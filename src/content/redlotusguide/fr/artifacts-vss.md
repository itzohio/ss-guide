<!-- route: /advanced-explanation-of-artifacts/file-system-activity/volume-shadow-copies-vss -->
# Clichés instantanés de volume (VSS)

Le Volume Shadow Copy Service (VSS), ou service de clichés instantanés de volume, est une technologie Windows qui permet de créer des copies de sauvegarde ponctuelles, des snapshots, de fichiers ou de volumes, même en cours d'utilisation. Ses buts système : alimenter la Restauration du système et la fonction "Versions précédentes", qui permet de récupérer des versions antérieures de fichiers et dossiers.

Vue DFIR, les clichés VSS sont un trésor. Chaque snapshot est une image historique complète du volume à un instant précis, ce qui permet de "voyager dans le temps" pour voir l'état du système de fichiers avant que les preuves soient modifiées ou supprimées sur le système en cours.

### Emplacement et structure

Les snapshots VSS ne sont pas de simples copies de fichiers : ils sont gérés au niveau des blocs. Les données sont dans un dossier système caché et protégé à la racine du volume.

- Emplacement : `C:\System Volume Information`

Quand un snapshot est créé (automatiquement avant une installation, selon un planning, ou manuellement), VSS fige en quelque sorte l'état du volume. À mesure que les fichiers changent, VSS utilise un mécanisme de copie sur écriture : avant qu'un bloc soit écrasé par de nouvelles données, les données d'origine sont copiées dans la zone VSS. Le snapshot reste donc une représentation cohérente et exacte du volume au moment de sa création.

### Données stockées et accès

Un snapshot contient une version historique de tout le volume, dont :

- **Fichiers et dossiers :** des fichiers présents au moment du snapshot et depuis supprimés peuvent être intacts et récupérables depuis un ancien cliché.
- **Métadonnées NTFS :** des versions antérieures des fichiers critiques comme `$MFT`, `$UsnJrnl` et `$LogFile`.
- **Ruches de registre :** des copies de toutes les ruches (`SYSTEM`, `SOFTWARE`, `SAM`, `NTUSER.DAT`…) telles qu'elles étaient.
- **Journaux d'événements :** des `.evtx` historiques, extractibles et analysables.
- **Autres artefacts :** tout artefact fichier, comme des Prefetch, des bases de navigateur ou Amcache, récupérable depuis un cliché.

L'accès demande des outils dédiés. La commande intégrée `vssadmin list shadows` liste les snapshots. Des outils graphiques comme ShadowExplorer permettent de parcourir un snapshot comme un disque normal. Les outils en ligne de commande avancés, comme ceux de la suite d'Eric Zimmerman (`MFTECmd`, `RECmd`, `PECmd`…), ont souvent un paramètre `--vss` qui traite automatiquement tous les clichés disponibles.

### Valeur forensique

L'analyse VSS est essentielle pour débusquer des preuves qui ont subi de l'anti-forensique sur le système en cours.

- **Récupérer des preuves supprimées :** une des méthodes les plus puissantes pour retrouver des fichiers, scripts, logs ou exécutables de cheat supprimés. Si un fichier a été supprimé après le dernier snapshot, il est probablement encore dedans.
- **Détecter manipulation et nettoyage :** en comparant un artefact d'un cliché avec sa version sur le système actuel, on prouve la manipulation. Si le `NTUSER.DAT` actuel a ses clés UserAssist vides mais qu'un `NTUSER.DAT` d'un cliché d'il y a deux heures les montre remplies, c'est la preuve du nettoyage du registre.
- **Étendre la timeline :** l'enquête peut dépasser les données du système actuel. Des `$MFT` ou `$UsnJrnl` plus anciens donnent un historique bien plus long.
- **Contourner les verrouillages :** les fichiers verrouillés par le système (ruches de registre) peuvent souvent être copiés et analysés depuis un cliché monté.

L'efficacité dépend de l'activation du VSS sur le volume (en général oui pour le disque système) et de la fréquence et rétention des snapshots, gérées automatiquement par Windows.

#### Points de réflexion (SS Contest)

Pour un SSer, VSS est l'arme ultime contre l'effacement de preuves. C'est le bouton "annuler" des actions anti-forensiques d'un tricheur.

- **La machine à remonter le temps :** VSS permet de voir le système du joueur avant qu'il cache quoi que ce soit. S'il supprime tout son dossier Prefetch juste avant le SS, un cliché d'il y a une heure contiendra probablement tous les `.pf` compromettants.
- **Preuve définitive de nettoyage :** comparer un artefact actuel avec sa version VSS est irréfutable. Une clé BAM vide sur le système et remplie dans un snapshot, c'est "affaire classée" pour la manipulation de preuves.
- **Récupérer le cheat supprimé :** cas d'usage principal. Si le joueur supprime son cheat avec Maj+Suppr et qu'un VSS récent existe, le SSer peut parcourir le cliché, aller à l'emplacement d'origine et récupérer l'exécutable.
- **Un check simple et rentable :** l'analyse VSS poussée est complexe, mais un coup d'œil avec ShadowExplorer est simple. Découvrir que le joueur a supprimé tous ses points de restauration (`vssadmin delete shadows /all`) juste avant le SS est en soi un acte très suspect de destruction de preuves.
