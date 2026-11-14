<!-- route: /screensharing-general-knowledge/eighth-section-common-bypass-techniques-in-screensharing/task-scheduler-bypass-techniques/mechanism-of-evasion -->
# Le mécanisme de l'évasion

- **Création de la tâche :** une tâche malveillante ou liée au bypass est créée avec l'interface du Planificateur, `schtasks.exe` ou les cmdlets PowerShell (`Register-ScheduledTask`).
- **Exécution du payload :** la tâche est configurée pour faire une action précise :
  - Lancer un loader de cheat ou le cheat lui-même.
  - Exécuter un script (`.bat`, `.ps1`, `.vbs`) qui fait le sale boulot (supprimer des logs, télécharger d'autres payloads, désactiver la sécurité).
  - Lancer des commandes système (par exemple `cmd.exe /c ...` ou `powershell.exe -Command ...`).
- **Configuration du déclencheur :** c'est le point clé pour l'évasion. Une tâche peut se déclencher :
  - Au démarrage ou à l'ouverture de session : le payload tourne tôt, parfois avant que la surveillance ou les outils de screenshare soient actifs.
  - Sur un événement précis : déclenché par des événements qui arrivent pendant la partie.
  - À une heure précise : moins courant pour un bypass direct, plus pour la persistance.
- **Contexte d'exécution et privilèges :** une tâche peut tourner sous différents comptes, y compris `SYSTEM`, ce qui donne au payload des privilèges élevés (utile pour arrêter des services critiques).
- **Contourner la surveillance :**
  - Source d'exécution : la tâche est lancée par le service du Planificateur (`taskeng.exe` ou via `svchost.exe`), pas par un double-clic. Du coup, les logs d'exécution simples (axés sur l'action de l'utilisateur) peuvent la rater. Prefetch peut ne logguer que `mmc.exe` (l'interface), `schtasks.exe` (si utilisé pour créer), ou le service du planificateur, plutôt que le payload lui-même.
  - Timing : les déclencheurs au démarrage ou à la connexion exécutent du code avant que la surveillance classique commence.
- **Obfuscation :** les noms, descriptions et chemins/arguments des actions peuvent être maquillés pour ressembler à des tâches légitimes (des tâches de mise à jour, par exemple) et échapper à l'inspection manuelle. Les caractères Unicode peuvent aussi servir.
