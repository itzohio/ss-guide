<!-- route: /screenshare-tools/redlotus-tools/redlotus-task-sentinel -->
# Analyse du Planificateur de tâches

detect.ac n'a pas d'outil dédié au Planificateur de tâches. Pour ce volet, on utilise les scripts de la section [Principaux scripts RedLotus](/screenshare-tools/specific-powershell-scripts/key-categories-and-examples), qui couvrent les trois angles utiles : les tâches créées à la main, celles qui lancent des commandes suspectes, et l'extraction des commandes et arguments.

#### ⚙️ Les scripts

- **ManualTasks (N0LW)** : liste les tâches créées par l'utilisateur, en laissant de côté celles du système. C'est le premier tri à faire, parce qu'une tâche de joueur sur un Windows de base, c'est déjà louche.
- **SuspiciousScheduler (N0LW)** : signale les tâches qui exécutent des commandes suspectes (`powershell`, `cmd`, `rundll32`, scripts encodés, chemins dans `%temp%` ou Téléchargements).
- **Task Parser (Rio / ObsessiveBf)** : extrait proprement les `<Command>` et `<Arguments>` de chaque fichier XML de tâche, ce qui donne la ligne de commande exacte sans ouvrir les XML un par un.

Commande ManualTasks :

```powershell
  powershell -Command "Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass; Invoke-Expression (Invoke-RestMethod 'https://raw.githubusercontent.com/nolww/project-mohr/refs/heads/main/ManualTasks.ps1')"
```

Commande SuspiciousScheduler :

```powershell
  powershell -Command "Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass; Invoke-Expression (Invoke-RestMethod 'https://raw.githubusercontent.com/nolww/project-mohr/refs/heads/main/SuspiciousScheduler.ps1')"
```

Commande Task Parser (Rio) :

```powershell
  powershell -Command "Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass; Invoke-Expression (Invoke-RestMethod 'https://raw.githubusercontent.com/ObsessiveBf/Task-Scheduler-Parser/main/script.ps1')"
```

#### 🛡️ Ce qu'on cherche dans les résultats

- Une tâche déclenchée au démarrage ou à l'ouverture de session qui lance un loader de cheat, donc avant même le démarrage de Minecraft.
- Une commande PowerShell encodée (`-EncodedCommand`) ou un téléchargement en mémoire (`IEX`, `iwr`).
- Un exécutable lancé depuis `%temp%`, `%appdata%` ou Téléchargements.
- Une tâche en `SYSTEM` sur un programme utilisateur, signature absente ou invalide.
- Une tâche "fantôme", présente dans le registre (`TaskCache`) mais dont le XML a disparu du dossier `C:\Windows\System32\Tasks`, ou l'inverse.
- Une tâche dont le XML a été modifié quelques minutes avant le screenshare (trier par date dans le dossier `Tasks` avec Everything).

Pour le contexte forensique des tâches planifiées (structure des XML, Event IDs 106/140/141), voir la page [Artefacts du Planificateur de tâches](/advanced-explanation-of-artifacts/system-configuration-and-persistence/task-scheduler-artifact).
