<!-- route: /screensharing-general-knowledge/seventh-section-manual-ss-techniques/introduction-to-process-and-memory-analysis -->
# Introduction à l'analyse des processus et de la mémoire

L'analyse des processus et de la mémoire, c'est un des piliers du screenshare manuel. On regarde directement les processus en cours et le contenu de la RAM associé à ces processus. Contrairement à l'analyse des fichiers posés sur le disque, on travaille ici sur des données volatiles : des infos qui n'existent que tant que le PC est allumé et que le processus tourne.

- **Pourquoi c'est important ?**
  - Détecter les menaces qui vivent en mémoire : beaucoup de cheats évolués (injection, fileless) fonctionnent uniquement dans la mémoire du jeu ou d'un processus légitime, en laissant presque rien sur le disque. Souvent, l'analyse mémoire est le seul moyen de les voir.
  - Retrouver des traces récentes : même un cheat qui a des fichiers sur le disque peut charger des chaînes, des configs ou du code en mémoire à l'exécution. Chercher dans la mémoire révèle ces traces juste après le lancement, même si les fichiers ont été supprimés ou obfusqués entre-temps.
  - Repérer du code injecté : l'injection de DLL ou le process hollowing consistent à mettre du code dans l'espace mémoire d'un processus légitime. L'analyse mémoire permet de fouiller `javaw.exe` (Minecraft) ou `explorer.exe` et de trouver ce code étranger.
  - Découvrir des activités cachées : lire les chaînes ou les modules chargés de certains processus révèle des commandes, des scripts, des arguments ou des connexions réseau liés à un bypass ou à un cheat.
- **L'outil clé :** Process Hacker (remplacé aujourd'hui par System Informer) est indispensable pour ça. Il donne l'interface pour voir, inspecter et chercher dans la mémoire des processus en cours.

Attention quand même : l'analyse mémoire demande de l'interprétation. Trouver une chaîne de caractères qui ressemble à un cheat ne suffit pas. Il faut le contexte, le recoupement avec d'autres preuves et une bonne connaissance du comportement normal de Windows pour éviter les faux positifs.
