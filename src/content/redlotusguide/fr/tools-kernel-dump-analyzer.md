<!-- route: /screenshare-tools/spoks-tools/kernel-live-dump-analyzer -->
# KernelLiveDump++

Analyser des dumps mémoire du noyau est une des méthodes les plus efficaces pour retrouver les traces de techniques de bypass, surtout celles qui passent par la ligne de commande ou des méthodes fileless. Le problème, c'est que fouiller à la main dans l'énorme volume de chaînes extraites d'un dump (`.dmp`) prend du temps.

**KernelLiveDump++**, de detect.ac, fait ce travail à la place : il capture la RAM du noyau et la RAM utilisateur dans le même dump, accepte aussi un dump externe déjà généré, puis compile toutes les chaînes capturées dans un tableau filtrable. Un interrupteur permet de basculer entre les chaînes signalées comme suspectes et le dump complet, et on peut importer ses propres chaînes à chercher.

Capacités :

- **Dump complet :** noyau et mode utilisateur ensemble, pour ne pas rater un loader ou un injecteur qui vit côté user.
- **Dumps externes :** un `.dmp` capturé autrement (System Informer, Gestionnaire des tâches) peut être chargé directement.
- **Tableau filtrable :** les chaînes sont triées et filtrables, donc on repère une commande suspecte sans ouvrir un `.txt` de plusieurs centaines de Mo.
- **Chaînes personnalisées :** on peut chercher un nom de tool, un chemin ou un mot-clé propre à l'affaire en cours.

L'outil est particulièrement efficace pour trouver les traces de commandes liées à tout un éventail de bypass :

- Des injections ou chargements de DLL via `Regsvr32.exe` ou `RunDLL32.exe`.
- Des indicateurs d'exécution fileless (commandes PowerShell avec `iex`, `iwr`, `encodedcommand`).
- Des méthodes de remplacement de fichier avec `echo` ou `type`.
- Des exécutions via des vecteurs moins courants comme `forfiles.exe` ou `wmic.exe`.
- Des suppressions ou modifications de clés et valeurs de registre via `reg` en CMD ou PowerShell.

### Utilisation

- **Créer un dump du noyau :** plusieurs moyens pendant un SS :
  - Avec System Informer :
    - Lancer System Informer en admin.
    - Menu : Hacker > Create kernel memory dump.
    - Choisir Live kernel dump.
    - Noter l'emplacement du `.dmp` (souvent `%LOCALAPPDATA%\Microsoft\Windows\TaskManager\LiveKernelDumps\`).
  - Avec le Gestionnaire des tâches (alternative) :
    - Onglet "Détails".
    - Trouver le processus System (PID 4 en général).
    - Clic droit > Créer un fichier de vidage. Attention : le Gestionnaire crée souvent un dump mémoire complet, bien plus gros et plus long qu'un dump noyau ciblé. Vérifier le type de dump créé.
- **Charger le dump :** lancer KernelLiveDump++ et sélectionner le `.dmp` (ou le laisser capturer lui-même).
- **Explorer les résultats :** filtrer sur les commandes suspectes, les fragments de script, les chemins vers des cheats ou outils de bypass connus, les chaînes encodées. Le contexte autour du mot-clé compte souvent.
- **Importer ses propres chaînes :** ajouter un nom de tool ou un chemin précis vu ailleurs dans le check pour confirmer sa présence dans le dump.

Lien : `https://detect.ac/tool/KernelLiveDump++`
