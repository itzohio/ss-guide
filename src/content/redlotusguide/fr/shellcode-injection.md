<!-- route: /screensharing-general-knowledge/eighth-section-common-bypass-techniques-in-screensharing/shellcode-injection -->
# L'injection de shellcode

- **Vue d'ensemble :** le shellcode, c'est un petit bout de code machine autonome, conçu pour être injecté dans la mémoire d'un autre processus et exécuté. Il est souvent position-independent, donc il tourne quel que soit l'endroit où on le place en mémoire. À l'origine, le nom venait des exploits qui ouvraient un shell (`cmd.exe`) ; maintenant ça désigne tout payload injecté de cette façon : du code pour télécharger et lancer un malware, ouvrir une connexion inverse, ou, dans le contexte de la triche, manipuler directement les fonctions ou données du jeu. L'injection de shellcode, c'est l'action de le placer dans un processus cible et de déclencher son exécution.
- **Mécanisme de l'évasion :** en général, un injecteur (un `.exe` autonome ou un autre processus compromis) fait ces étapes :
  - Récupérer le processus cible : obtenir un handle sur le processus visé (`javaw.exe` du jeu, par exemple) avec `OpenProcess` et les droits nécessaires (`PROCESS_VM_OPERATION`, `PROCESS_VM_WRITE`, `PROCESS_CREATE_THREAD`).
  - Allouer de la mémoire : réserver une région dans l'espace d'adressage du processus cible avec `VirtualAllocEx`, avec des droits d'exécution (`PAGE_EXECUTE_READWRITE`).
  - Écrire le shellcode : copier le shellcode depuis l'injecteur vers la région allouée avec `WriteProcessMemory`.
  - Déclencher l'exécution : faire exécuter le shellcode au CPU. Les méthodes courantes :
    - `CreateRemoteThread` : crée un thread dans le processus cible dont l'adresse de départ est le début du shellcode. La méthode classique.
    - Thread hijacking : suspendre un thread existant (`SuspendThread`), modifier son pointeur d'instruction (`GetThreadContext`/`SetThreadContext`) pour pointer vers le shellcode, puis le reprendre (`ResumeThread`).
    - APC : mettre un APC en file (`QueueUserAPC`) sur un thread cible. Le shellcode s'exécute quand le thread entre dans un état d'attente alertable.
    - D'autres méthodes à base de callbacks ou de hooking.
- **Pourquoi les tricheurs font ça :**
  - Livraison de payload sans fichier : le shellcode s'exécute directement depuis la mémoire, souvent sans qu'un fichier malveillant (`.exe` ou `.dll`) soit présent sur le disque au moment de l'exécution (même s'il peut en télécharger plus tard). Ça passe à travers les antivirus qui scannent les fichiers et les vérifications d'artefacts simples.
  - Discrétion : tourner dans le contexte d'un processus légitime (ou du jeu) cache l'activité aux listes de processus et aux outils de surveillance basiques.
  - Souplesse : un shellcode peut être petit et conçu pour faire une action initiale précise, comme établir une communication ou charger un payload de second étage en réflectif.
- **Détection :** elle repose surtout sur l'analyse mémoire et la surveillance du comportement :
  - Analyse mémoire (Volatility/System Informer) : utiliser `malfind` de Volatility ou inspecter la mémoire à la main pour trouver des régions exécutables (`PAGE_EXECUTE_READWRITE`) qui ne correspondent à aucun fichier légitime (`Private`) et contiennent du code machine suspect. Un shellcode a souvent une entropie élevée et peut ne pas avoir d'en-tête PE, puisque c'est du code brut.
  - Scan YARA : scanner la mémoire des processus avec des règles qui détectent les motifs de shellcode courants, les stubs de packer ou des séquences d'octets connues.
  - Surveillance des API (ProcMon) : chercher la séquence typique d'injection — `OpenProcess` -> `VirtualAllocEx` -> `WriteProcessMemory` -> `CreateRemoteThread` (ou les API de thread hijacking) — venant d'un processus inattendu et visant le jeu.
  - Kernel Live Dump : l'injecteur ou le script qui a lancé l'injection peut laisser des traces de commandes, de chemins ou d'appels d'API dans le dump noyau.
