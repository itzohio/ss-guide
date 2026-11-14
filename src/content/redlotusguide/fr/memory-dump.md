<!-- route: /screensharing-general-knowledge/ninth-section-more-artifact-analysis-for-screensharing/process-and-memory-dump-analysis -->
# Analyse de dump de processus et de mémoire (Kernel Live Dump, RAM dump)

Analyser la mémoire volatile donne une photo de l'état du système au moment de la capture, et peut révéler des menaces ou des activités qui ne laissent rien sur le disque.

- **RAM dump (dump de mémoire physique) :** une copie bit à bit de toute la mémoire vive. Il capture l'état de tous les processus, des pilotes chargés, des structures du noyau, des connexions réseau, parfois des identifiants en cache, le presse-papiers, des clés cryptographiques, et du code injecté ou du malware dépacké qui ne vit qu'en mémoire. Il faut un outil dédié : FTK Imager, DumpIt (Comae) ou Magnet RAM Capture. Le fichier (`.mem`, `.vmem`, `.raw`) peut être énorme, de la taille de la RAM installée.
- **Kernel Live Dump :** un dump plus ciblé sur l'espace mémoire du noyau. Il contient souvent les métadonnées des processus, les modules noyau chargés et parfois les lignes de commande récentes, mais moins de données des applis que la RAM complète. On peut le créer alors que le système tourne, sans l'instabilité (via "Create kernel memory dump" dans System Informer). C'est utile pour diagnostiquer le noyau ou analyser des rootkits noyau, mais aussi pour retrouver l'historique des lignes de commande.

Côté analyse, un dump mémoire sert à :

- Détecter un malware ou un cheat qui ne vit qu'en RAM.
- Identifier du code injecté (DLL, shellcode) dans des processus légitimes.
- Récupérer les lignes de commande utilisées pour lancer des processus, même éphémères (souvent dans les dumps noyau).
- Analyser les connexions réseau actives et les processus associés.
- Parfois retrouver des identifiants ou des données sensibles en mémoire.
- Trouver des composants de rootkit cachés (processus, pilotes).

Mais l'analyse mémoire a ses limites, surtout dans un screenshare classique : c'est complexe, il faut des outils et des connaissances (Volatility Framework, MemProcFS), les données sont volatiles et ne représentent qu'un instant, les dumps sont gros, et capturer/analyser soulève de vraies questions d'éthique et de vie privée à cause des données personnelles capturées. Donc, même si c'est puissant, l'analyse mémoire complète est réservée aux cas d'incident response, ou faite par des personnes très formées dans des circonstances précises et justifiées. L'analyse de chaînes sur un dump noyau avec `strings64.exe` ou `bstrings.exe` (comme vu plus haut pour l'historique de commandes ou les traces d'injection) est une approche plus ciblée et moins intrusive, applicable en screenshare.

### KernelLiveDump++

Analyser les dumps mémoire du noyau s'est révélé l'une des méthodes les plus efficaces pour trouver des traces de bypass, surtout ceux qui passent par la ligne de commande ou le fileless. Mais trier à la main les millions de chaînes extraites d'un `.dmp` prend un temps fou.

Pour régler ça, **KernelLiveDump++** (`https://detect.ac/tool/KernelLiveDump++`) fait le travail à ta place : il dumpe la RAM noyau et la RAM utilisateur d'un coup, charge aussi un dump externe, et compile toutes les chaînes dans un tableau filtrable. Un interrupteur permet de passer des chaînes signalées comme suspectes au dump complet, et on peut importer ses propres chaînes à chercher. Un check se fait en secondes au lieu de minutes.

Ce qu'il trouve bien : les preuves en ligne de commande liées à un large éventail de bypass, comme les commandes servant à :

- Injecter ou charger une DLL via `Regsvr32.exe` ou `RunDLL32.exe`.
- Les indices d'exécution sans fichier (commandes PowerShell avec `iex`, `iwr`, `encodedcommand`).
- Le remplacement de fichiers avec `echo` ou `type`.
- Les exécutions via `forfiles.exe` ou `wmic.exe`.
- La suppression ou la modification de clés et valeurs de registre avec `reg.exe` en CMD ou PowerShell.

En automatisant la recherche de ces indicateurs dans le dump noyau, l'outil rend la détection des bypass sophistiqués beaucoup plus rapide et efficace pendant un screenshare.
