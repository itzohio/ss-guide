<!-- route: /screensharing-general-knowledge/seventh-section-manual-ss-techniques/specific-processes-to-analyze-and-search-patterns/6-other-relevant-processes -->
# Les autres processus intéressants

Les processus vus avant sont les cibles principales, mais selon le bypass ou le type de cheat, d'autres peuvent donner des résultats :

- **Le moteur du Planificateur de tâches (`taskhostw.exe`, le `svchost.exe` qui héberge Schedule) :** la mémoire peut contenir des chemins, des commandes (`<Command>`, `<Arguments>`) ou des scripts liés aux tâches planifiées, surtout si on soupçonne un bypass par tâche planifiée.
- **`SearchIndexer.exe` :** la mémoire peut contenir des chemins en cache ou des bouts du contenu indexé par Windows Search, y compris des fichiers ou scripts récemment créés ou exécutés.
- **Les processus d'antivirus (`MsMpEng.exe` pour Windows Defender, ou ceux d'un AV tiers) :** les dumper (il faut le pilote noyau) révèle parfois des chaînes liées à des menaces détectées (puis mises en quarantaine, autorisées ou ignorées), ou des bouts de code de cheats qui essaient de passer.
- **Le processus du jeu (`javaw.exe` pour Minecraft) :** chercher directement des chaînes de cheat connues, des noms de classes (cheats Java) ou des modules chargés (DLL injectées), c'est la base. Les motifs dépendent du cheat recherché.
- **Les processus liés aux entrées (`ctfmon.exe`, `TextInputHost.exe`) :** parfois utiles quand on enquête sur des macros complexes ou de la manipulation d'entrées.

Appliquer ces recherches de chaînes de façon méthodique dans ces processus, en suivant le contexte de l'enquête et en comprenant comment un cheat interagit avec le système, ça rend le screenshare manuel beaucoup plus efficace. Et toujours recouper les résultats entre plusieurs processus et artefacts.
