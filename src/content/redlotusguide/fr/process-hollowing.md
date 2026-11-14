<!-- route: /screensharing-general-knowledge/eighth-section-common-bypass-techniques-in-screensharing/process-hollowing -->
# Le processus creusé (process hollowing)

- **Vue d'ensemble :** le process hollowing est une technique d'injection assez sophistiquée : on cache du code malveillant dans l'espace mémoire d'un processus légitime pour donner l'impression que seul ce processus tourne.
- **Mécanisme :**
  - Créer un processus suspendu : l'attaquant lance une nouvelle instance d'un processus Windows légitime (`svchost.exe`, `explorer.exe`, `notepad.exe`) en état suspendu, avec le flag `CREATE_SUSPENDED` et `CreateProcess`.
  - Démonter le code légitime : la région mémoire qui contient le code d'origine du processus suspendu est retirée ou désallouée de force avec `NtUnmapViewOfSection` ou `ZwUnmapViewOfSection`. L'espace d'adressage est "creusé".
  - Allouer de la mémoire : on réserve de la mémoire dans cet espace vidé avec `VirtualAllocEx`.
  - Injecter le code malveillant : le code de l'attaquant (un PE complet, souvent packé) est écrit dans cette région avec `WriteProcessMemory`.
  - Rediriger l'exécution : le contexte du thread principal est modifié (`GetThreadContext` puis `SetThreadContext`) pour que le pointeur d'instruction (RIP/EIP) pointe vers le point d'entrée du code injecté au lieu de celui du processus d'origine.
  - Reprendre le processus : on relance avec `ResumeThread`. Le processus exécute le code malveillant, mais pour l'OS (et dans le Gestionnaire des tâches), il ressemble toujours au processus légitime (`svchost.exe`).
- **Pourquoi les tricheurs font ça :** surtout pour la discrétion. Le cheat tourne sous l'identité d'un processus système de confiance, ce qui contourne les listes blanches, trompe la surveillance simple des processus et le rend difficile à repérer dans une liste.
- **Détection :** il faut de l'analyse mémoire ou une surveillance comportementale poussée.
  - À noter : pour faire un process hollowing, il faut un exe qui en creuse un autre. Le plus simple pour le prouver, c'est donc de prouver que l'exe qui sert de hollower a été lancé. S'il a été lancé via une injection sans fichier, c'est la méthode de détection du fileless qui s'applique.
  - Analyse mémoire (Volatility) : le plugin `hollowfind` est fait pour repérer les indices classiques du hollowing, comme les incohérences entre le processus listé dans le PEB (Process Environment Block) et le code réellement en mémoire, ou les processus avec des sections exécutables non mappées. `malfind` peut aussi signaler la région du code injecté.
  - Inspection mémoire (System Informer) : comparer le chemin du processus affiché avec les modules et le contenu mémoire réels. Du code exécutable dans une région privée qui ne correspond à aucun module légitime de l'hôte, c'est un indice. L'absence du module principal du processus d'origine dans la liste des modules est aussi un indice.
  - Anomalie Prefetch : parfois, le hollowing donne une entrée Prefetch pour le processus hôte avec un champ "Executable Path" vide ou absent dans WinPrefetchView.
  - Kernel Live Dump : chercher dans les chaînes du dump les traces laissées par l'outil ou le script qui a fait le hollowing (appels d'API de création de processus, de démappage, de modification de contexte). Chercher les mots-clés présents dans les commandes a déjà été mis en relation avec certains outils de hollowing.
