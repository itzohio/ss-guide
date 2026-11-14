<!-- route: /advanced-explanation-of-artifacts/system-configuration-and-persistence/task-scheduler-artifact -->
# Artefacts du Planificateur de tâches

### But et fonctionnement

Le Planificateur de tâches Windows est un composant central de l'OS qui permet d'automatiser en lançant des programmes ou des scripts à des heures précises ou en réaction à des événements. Usages légitimes : scripts de maintenance, vérification des mises à jour, sauvegardes.

Vue DFIR, c'est un des mécanismes de persistance les plus puissants et les plus détournés de Windows. Les attaquants, malwares et tricheurs s'en servent pour que leur code s'exécute automatiquement, souvent avec des privilèges élevés et sans éveiller les outils de surveillance basiques. Ça permet de lancer une charge sur plein de déclencheurs : démarrage, ouverture de session, événement système précis.

### Emplacement et structure

Les artefacts des tâches planifiées sont surtout à deux endroits : le système de fichiers et le registre.

- **Système de fichiers (fichiers de définition) :**
  - Emplacement : `C:\Windows\System32\Tasks` (et sous-dossiers)
  - Structure : chaque tâche est définie par un fichier XML dans cette arborescence, qui reprend souvent l'organisation visible dans l'interface du Planificateur. Le XML contient toutes les infos critiques.
- **Registre (cache des tâches) :**
  - Emplacement : `HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\Windows NT\CurrentVersion\Schedule\TaskCache`
  - Structure : le registre garde un cache pour la performance. La sous-clé `Tree` reprend l'arborescence du disque, et `Tasks` contient les métadonnées de chaque tâche, dont une référence à son fichier de définition et ses descripteurs de sécurité.

### Métadonnées stockées

Le XML de définition est l'artefact le plus riche. Il décrit complètement le comportement de la tâche :

- **Déclencheurs :** ce qui lance la tâche.
  - Une heure précise (`CalendarTrigger`)
  - Le démarrage (`BootTrigger`)
  - L'ouverture de session (`LogonTrigger`)
  - L'inactivité (`IdleTrigger`)
  - Un événement précis du journal Windows (`EventTrigger`)
- **Actions :** ce que fait la tâche. L'action la plus courante est `Exec`, qui lance un programme ou un script, avec :
  - `<Command>` : le chemin complet de l'exécutable (`powershell.exe`, `cmd.exe`, un loader de cheat).
  - `<Arguments>` : les arguments passés. C'est souvent là que se cachent la charge ou le script.
- **Settings :** les conditions et le comportement (exécution à la demande, que faire en cas d'échec, durée maximale).
- **Principal :** le contexte de sécurité sous lequel la tâche tourne (un compte utilisateur, ou le puissant compte `SYSTEM`).
- **Auteur et horodatages :** le XML contient l'auteur et la date de création. Les dates de création et de modification du fichier XML lui-même sont aussi des indicateurs critiques.

### Valeur forensique

Analyser les tâches planifiées est essentiel pour identifier les mécanismes de persistance et l'activité automatisée malveillante.

- **Découvrir la persistance :** méthode principale pour trouver malwares, loaders ou scripts configurés pour survivre au redémarrage. Une tâche qui lance `powershell.exe` avec un argument encodé suspect à chaque ouverture de session, c'est de la persistance classique.
- **Reconstituer les actions :** les balises `<Command>` et `<Arguments>` donnent la ligne de commande exacte, donc les outils et méthodes.
- **Identifier l'élévation de privilèges :** une tâche configurée en `SYSTEM` peut servir à élever les privilèges et faire tourner du code avec l'accès maximal.
- **Détecter la manipulation :** les dates de création et modification des XML dans `C:\Windows\System32\Tasks` sont très parlantes. Un fichier créé ou modifié juste avant une enquête est très suspect. Le journal du Planificateur (`Microsoft-Windows-TaskScheduler/Operational`) note aussi la création (Event ID 106), la modification (140) et la suppression (141) des tâches.

#### Points de réflexion (SS Contest)

Pour un SSer, le Planificateur est un endroit critique pour trouver des cheats cachés qui se lancent tout seuls et des scripts de bypass.

- **Le cheat qui démarre tout seul :** un joueur peut créer une tâche pour lancer son loader ou son injecteur à chaque ouverture de session. Le cheat tourne alors en arrière-plan avant même le démarrage de Minecraft. Il faut vérifier les tâches récentes, surtout celles déclenchées à l'ouverture de session ou au démarrage.
- **Contourner les artefacts d'exécution :** lancer un programme via le Planificateur génère parfois moins de bruit dans certains artefacts (UserAssist, par exemple) qu'un lancement manuel via l'interface. La tâche elle-même devient la preuve principale de l'exécution.
- **Trouver le script de "nettoyage" :** un tricheur averti peut créer une tâche qui lance un script de nettoyage (supprimer Prefetch et journaux en PowerShell) déclenché par un événement précis, comme le lancement d'un outil de screenshare (`AnyDesk.exe`). Trouver une telle tâche, c'est la preuve directe d'une tentative de bypass planifiée.
- **Les fichiers XML comme preuve :** on peut ouvrir `C:\Windows\System32\Tasks` avec Search Everything, trier par date de modification, et trouver un fichier modifié quelques minutes avant le SS. L'ouvrir et voir qu'il lance un exécutable depuis le dossier Téléchargements suffit souvent à conclure.
