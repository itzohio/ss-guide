<!-- route: /screensharing-general-knowledge/eighth-section-common-bypass-techniques-in-screensharing/scripting-languages-for-evasion/forensic-implications -->
# Les conséquences pour l'analyse

Enquêter sur un bypass par script demande de croiser plusieurs artefacts. Les points clés :

- **Les fichiers de script :** retrouver les scripts eux-mêmes (`.ps1`, `.bat`, `.vbs`, `.py`, `.au3`, `.hta`) sur le disque, en regardant les dossiers Temp, les profils utilisateur et les dossiers de téléchargement.
- **Les logs d'exécution :**
  - PowerShell : journaux d'événements (surtout le journal PowerShell Operational, IDs 400, 403, 800, 4103 et 4104 si le script block logging est activé) et le fichier d'historique PSReadline (`ConsoleHost_history.txt`).
  - CMD/Batch : entrées Prefetch de `cmd.exe`, et parfois les relations processus parent/enfant dans les logs de sécurité (4688).
  - VBS/JScript : Prefetch de `wscript.exe` ou `cscript.exe`, et les journaux d'événements.
  - HTA : Prefetch de `mshta.exe`, historique de téléchargement du navigateur, artefacts du système de fichiers.
  - Python/AutoIt : Prefetch de `python.exe` ou `AutoIt3.exe`, chemins d'installation, fichiers de script associés.
- **Analyse mémoire :** les chaînes dans les processus interpréteurs (`powershell.exe`, `cmd.exe`…) peuvent contenir le contenu du script ou les commandes.
- **Registre :** les traces de persistance mise en place par les scripts (clés Run, tâches planifiées).

En pratique, la détection tourne autour de la surveillance de l'exécution des scripts, de l'analyse de leur contenu (surtout pour repérer de l'obfuscation ou des appels d'API suspects) et de la lecture des logs des moteurs de script et des événements système liés.
