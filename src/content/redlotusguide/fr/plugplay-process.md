<!-- route: /screensharing-general-knowledge/seventh-section-manual-ss-techniques/specific-processes-to-analyze-and-search-patterns/3-plugplay-service -->
# Le service PlugPlay (parfois sous DCOMLaunch)

- **Rôle :** le service Plug and Play gère la détection et l'installation du matériel, mais il est aussi souvent impliqué quand des applications Java (`.jar`) tournent, sans doute à cause des interactions avec le runtime Java.
- **Trouver le processus :** repérer l'instance de `svchost.exe` qui héberge le service "PlugPlay" (onglet Services dans System Informer ou le Gestionnaire des tâches). Sinon, DCOMLaunch (`svchost.exe -k DcomLaunch`) est parfois lié. Prendre celle qui a le plus de private bytes parmi ces candidates.
- **Motif courant :** `.jar` (Contains, insensible à la casse). Dans cette instance, trouver des chemins complets finissant en `.jar` (par exemple `C:\\Users\\Admin\\Downloads\\autoclicker.jar`) est la méthode principale pour repérer un cheat ou un outil `.jar` qui a tourné.

