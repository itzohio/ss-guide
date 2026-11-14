<!-- route: /screensharing-minecraft-knowledge/fifth-section-specific-context-minecraft/minecraft-and-java/launchers -->
# Les lanceurs (officiel, custom : Lunar, Badlion, etc.)

Minecraft ne se lance pas directement : il faut une application (le lanceur) pour préparer l'environnement et démarrer la JVM avec les bons paramètres.

- **Rôle :** les lanceurs gèrent les versions du jeu, les profils et comptes, la mémoire allouée et construisent les arguments de ligne de commande complexes pour démarrer la version choisie. En gros, ils exécutent la commande `java.exe`/`javaw.exe` nécessaire (souvent une variante de `java -jar <minecraft_version.jar> [plein d'arguments JVM]`) pour lancer le jeu dans la JVM.
- **Variété :** les joueurs utilisent plusieurs lanceurs :
  - Le lanceur officiel de Mojang/Microsoft.
  - Des lanceurs tiers, souvent populaires dans certaines communautés (PvP, moddé…) : Lunar Client, Badlion Client, Feather Client, MultiMC, CurseForge Launcher, ATLauncher, et bien d'autres. Ils embarquent souvent des optimisations (Sodium/Optifine), des mods intégrés, des cosmétiques ou des fonctions en plus.
- **Ce que ça implique pour le screenshare :**
  - Logs et réglages : chaque lanceur a ses propres fichiers de log et de config, à des endroits différents (souvent dans AppData ou son dossier d'installation). Ces logs contiennent parfois des infos utiles (erreurs de conflit de mods, arguments JVM utilisés, historique de connexion des comptes).
  - Emplacements non standard : point important, les lanceurs custom permettent souvent de stocker les instances du jeu (dont le dossier `.minecraft`) ailleurs que dans AppData. Se fier uniquement au chemin par défaut fait complètement rater les fichiers du jeu et les preuves.
