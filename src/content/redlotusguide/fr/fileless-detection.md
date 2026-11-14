<!-- route: /screensharing-general-knowledge/eighth-section-common-bypass-techniques-in-screensharing/fileless-malware-and-living-off-the-land-binaries/forensic-implications-and-detection -->
# Implications forensic et détection

#### Malware sans fichier et techniques d'injection mémoire

Cette catégorie regroupe les techniques d'évasion les plus avancées : le code malveillant tourne en grande partie, ou entièrement, dans la mémoire volatile (RAM), souvent sans jamais écrire d'exécutable classique sur le disque. Du coup, les scanners qui ne regardent que les fichiers galèrent. Ces techniques passent souvent par l'injection de code dans des processus légitimes, pour se planquer et profiter de leur confiance.

Les techniques courantes :

- **Injection de DLL réflective :** charger une DLL malveillante directement depuis la mémoire dans un processus cible, en contournant le mécanisme de chargement de Windows et sans avoir besoin du fichier sur le disque au moment de l'injection.
- **Process hollowing :** créer un processus légitime en état suspendu, remplacer son code en mémoire par du code malveillant, puis le reprendre. Le code malveillant tourne sous l'apparence du processus légitime.
- **Injection de shellcode :** injecter du code machine brut (shellcode) directement dans la mémoire d'un processus cible et déclencher son exécution (`CreateRemoteThread`, détournement de thread…).
- **Chargement d'assembly .NET en mémoire :** utiliser les fonctions légitimes du runtime .NET (souvent via PowerShell ou un loader) pour charger et exécuter un assembly malveillant directement depuis la mémoire.

Détecter les injections sans fichier (côté mémoire)

Comme ces techniques vivent surtout en mémoire, la détection demande d'analyser l'état volatil du système, en se concentrant sur la mémoire des processus et les artefacts liés.

- **Analyse de Kernel Live Dump (la méthode la plus complète) :**
  - Pourquoi : c'est sans doute l'approche la plus robuste pour repérer les traces d'une exécution sans fichier ou d'une injection. Même si le payload tourne entièrement en mémoire utilisateur, les commandes, scripts ou loaders qui ont lancé l'injection laissent souvent des traces persistantes dans les buffers mémoire du noyau capturés dans le dump. Ces traces survivent plus longtemps que la mémoire du processus, surtout si le loader s'est arrêté juste après.
  - Procédure : créer un Kernel Live Dump avec System Informer ou le Gestionnaire des tâches. Noter l'emplacement du `.dmp` (par exemple `%LOCALAPPDATA%\Microsoft\Windows\TaskManager\LiveKernelDumps\`).
  - Analyse avec `bstrings` : utiliser `bstrings.exe` (Eric Zimmerman Tools) pour extraire et filtrer les chaînes du dump. La commande qui cible les indicateurs des vecteurs d'exécution sans fichier (souvent utilisés comme loaders pour de l'injection) :

    ```
    bstrings.exe -f "C:\Path\To\Your\LiveKernelDump.DMP" --lr "(?i)(?:\b(?:powershell|cmd|wscript|cscript)\b|iwr|iex|invoke|encodedcommand|decoded|base64|github|pastebin|\.exe|\.bat|\.vbs)" -o ".\FilelessExecutionEvidence.txt"
    ```

    Elle cherche dans le dump (sans tenir compte de la casse) les interpréteurs de script courants, les commandes PowerShell de téléchargement/exécution (`iwr`, `iex`, `invoke`), les indices de payload encodé (`encodedcommand`, `decoded`, `base64`), les hébergeurs de payload (`github`, `pastebin`) et les extensions d'exe ou de script qu'on retrouve dans les lignes de commande. Le résultat est écrit dans `FilelessExecutionEvidence.txt`.
  - Lire la sortie : parcourir le fichier pour repérer les lignes de commande, bouts de script, blocs Base64 (à décoder à part), URL ou chemins liés au lancement de l'activité. Mettre la main sur la commande qui a téléchargé et exécuté un script PowerShell en mémoire, ou sur la ligne de commande d'un loader, c'est une preuve solide.
  - Outil : **KernelLiveDump++** (`https://detect.ac/tool/KernelLiveDump++`) fait ce filtrage à la place de `bstrings`. Il dumpe la RAM noyau et la RAM utilisateur d'un coup, accepte aussi un dump externe déjà capturé, puis compile toutes les chaînes dans un tableau filtrable. On bascule d'un interrupteur entre les chaînes signalées comme suspectes et le dump complet, et on peut importer ses propres chaînes à chercher. Pour le fileless, ça permet de sortir en quelques secondes les lignes `iex`, `iwr`, `encodedcommand` ou les initiateurs d'injection au lieu de trier un `.txt` à la main.
- **Analyse des journaux d'événements (avec Hayabusa) :**
  - Les journaux enregistrent surtout l'activité disque, mais certains, surtout si le PowerShell Script Block Logging (IDs 4103/4104) est activé, capturent les commandes ou blocs de script utilisés pour lancer le fileless ou l'injection.
  - Outil : Hayabusa est un parseur de journaux efficace, qui utilise des règles Sigma pour la chasse aux menaces. Il traite vite beaucoup de `.evtx`.
  - Analyse : le lancer sur `C:\Windows\System32\winevt\Logs`, puis examiner le rapport ou le CSV, en filtrant les règles liées à l'exécution PowerShell suspecte, à WMI ou aux techniques Living-off-the-Land. Chercher les mots-clés associés au téléchargement ou à l'exécution de payloads distants ou encodés : `iwr`, `iex`, `invoke-expression`, `invoke-webrequest`, `encodedcommand`, `encode`, `decoded`, `github`, `pastebin`, `-nop`, `-w hidden`. Des commandes qui utilisent ces mots-clés, surtout complexes ou obfusquées, méritent un gros coup d'œil.
- **Scan YARA en mémoire :**
  - Mécanisme : utiliser des règles YARA taillées pour détecter les signatures de shellcodes connus, de stubs de reflective loader, d'exe packés en mémoire, de modules de cheat connus ou d'artefacts d'évasion mémoire.
  - Outils :
    - Volatility Framework : le plugin `yarascan` scanne un dump mémoire complet (`.mem`, `.vmem`, `.raw`) avec les règles fournies.
    - Velociraptor : la fonction VQL `yara()` avec `accessor='process'` scanne la mémoire des processus en cours sans avoir besoin d'un dump complet.
  - Efficacité : ça dépend beaucoup de la qualité et de la précision des règles. De bonnes règles donnent des résultats solides, des règles génériques produisent des faux positifs.
- **Inspection de la mémoire des processus (System Informer / Process Hacker) :**
  - Mécanisme : examiner directement l'espace mémoire des processus suspectés d'héberger du code injecté (le jeu, `explorer.exe`).
  - Quoi chercher :
    - Régions mémoire suspectes : repérer celles marquées `Private` (pas adossées à un fichier) avec des droits d'exécution (`PAGE_EXECUTE_READWRITE` ou équivalent). Analyser leur contenu (visionneuse hexa, recherche de chaînes). Des en-têtes PE (MZ…) ou du code exécutable dans ces régions, c'est un bon indice d'injection.
    - Modules anormaux : regarder la liste des modules pour des DLL non signées, des DLL dans des chemins inattendus ou plusieurs instances de DLL système chargées à des adresses de base bizarres. (Une injection réflective peut cacher des modules de cette liste.)
    - Recherche de chaînes : chercher dans la mémoire les chaînes associées au cheat, au loader ou à la méthode d'injection.
- **Volatility Framework (analyse de dump mémoire) :**
  - Mécanisme : analyser un dump complet pris avec FTK Imager, DumpIt ou Magnet RAM Capture.
  - Plugins utiles :
    - `malfind` : le plugin principal pour trouver du code injecté. Il repère les régions mémoire qui présentent les caractéristiques d'une injection (mémoire privée exécutable, en-têtes PE).
    - `ldrmodules` : identifie parfois des DLL cachées aux méthodes d'énumération classiques.
    - `pstree` / `pslist` : pour comprendre les relations entre processus et repérer les hôtes d'injection ou les anomalies liées au hollowing.
    - `memdump` : extraire une région mémoire jugée suspecte par `malfind` pour l'analyser hors ligne (reverse engineering).
    - `vadinfo` : le détail des Virtual Address Descriptors, pour comprendre les permissions et types de régions mémoire.

Détecter le fileless et l'injection mémoire, c'est donc analyser l'état volatil du système. Le dump noyau couvre bien la phase de lancement, et le combiner avec l'inspection ciblée de la mémoire des processus, des outils avancés (Volatility/YARA) et les journaux d'événements donne la stratégie la plus complète contre ces techniques d'évasion.
