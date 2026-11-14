<!-- route: /screensharing-general-knowledge/eighth-section-common-bypass-techniques-in-screensharing/artifact-and-system-manipulation/service-thread-suspension -->
# Suspendre les threads d'un service

- **Description :** une technique d'évasion plus avancée, qui vise les services système chargés de la journalisation ou de la surveillance : Prefetch (SysMain), PCA (PcaSvc), Event Logging (EventLog) ou Diagnostics (DPS). Au lieu d'arrêter complètement le service (ce qui se voit tout de suite avec `sc query` ou un gestionnaire de services), le bypasser suspend certains threads du processus du service (souvent `svchost.exe`).
- **Mécanisme :** il faut un outil capable de toucher aux threads, comme Process Hacker / System Informer, ou un script maison qui utilise les API Windows `OpenThread`, `SuspendThread` et `ResumeThread`. Le bypasser repère les threads liés à la fonction principale du service (souvent via sa DLL : `sechost.dll` pour SysMain, `pcasvc.dll` pour PcaSvc, `wevtsvc.dll` pour EventLog, `dps.dll` pour DPS) et les met en pause.
- **Pourquoi les tricheurs font ça :** le processus du service (`svchost.exe`) reste affiché "Running" dans le Gestionnaire des tâches et dans les requêtes de service, ce qui trompe les vérifications basiques. Mais les threads suspendus empêchent le service de bosser : plus d'écriture Prefetch, plus d'événements loggés, plus de données DPS. C'est plus discret qu'un arrêt de service.
- **Détection :** il faut inspecter les threads des processus concernés avec System Informer (en admin) :
  - Repérer le `svchost.exe` (ou le processus dédié) du service visé (SysMain, PcaSvc, EventLog, DPS).
  - Clic droit sur le processus > Properties > onglet Threads.
  - Chercher les threads à l'état "Suspended".
  - Regarder la colonne "Start address" : si des threads suspendus pointent dans la DLL principale du service (`sechost.dll`, `wevtsvc.dll`…), c'est très suspect et ça indique clairement une manipulation pour couper la journalisation.
