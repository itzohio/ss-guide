<!-- route: /screensharing-minecraft-knowledge/fifth-section-specific-context-minecraft/minecraft-and-java/categorizing-minecraft-cheats-context-for-analysis -->
# Classer les cheats Minecraft (contexte pour l'analyse)

Avant d'entrer dans les techniques d'analyse, il est utile de connaître les grandes catégories de cheats, parce que ça oriente la détection.

À noter : les définitions de ces termes ont changé avec les années, et tout le monde ne les emploie pas pareil. Ça n'a pas grande importance : ce sont des conventions pour qu'on se comprenne entre SSers et bypassers.

- **Ghost clients :** ils modifient le jeu de l'intérieur, souvent packagés en versions modifiées (ils remplacent les `.jar` vanilla/Forge dans `versions`), en mods (dans `mods`), ou parfois en bibliothèques modifiées. Ils laissent des traces dans l'arborescence du `.minecraft` et souvent dans la mémoire de `javaw.exe`.
- **Injection clients :** en général un injecteur externe (`.exe`) qui charge une DLL malveillante dans le processus `javaw.exe`. La DLL utilise ensuite JNI ou JVMTI pour modifier le comportement du jeu. Détection : retrouver l'injecteur et la DLL sur le disque, et chercher les traces du module injecté dans la mémoire du jeu.
- **External clients :** ils tournent en exe séparés et interagissent avec le jeu en lisant et écrivant directement dans la mémoire de `javaw.exe` via les API Windows, sans injecter de code. Ils laissent peu de traces dans la mémoire du jeu : il faut détecter l'exe externe et son activité sur le système.
- **Autoclickers et macros :** ils simulent des clics ou des frappes en externe, via des API de l'OS ou des fonctions logicielles/matérielles de la souris. Ils interagissent peu directement avec `javaw.exe`.

Comprendre ces catégories aide à prioriser les artefacts et les techniques d'analyse selon le type de cheat suspecté.
