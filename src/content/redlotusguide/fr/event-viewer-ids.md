<!-- route: /screensharing-general-knowledge/seventh-section-manual-ss-techniques/event-viewer/key-event-logs-and-ids-for-screensharing -->
# Les journaux et identifiants clés en screenshare

Filtrer par ID d'événement, c'est la façon la plus efficace d'utiliser l'Observateur pendant un screenshare. Clic droit sur un journal (Sécurité, par exemple) > "Filtrer le journal actuel…".

- **Changement d'heure système (journal Sécurité) :**
  - ID : 4616
  - Journal : Sécurité (`Security.evtx`)
  - Description : enregistre les changements d'heure système.
  - Le contexte est essentiel : regarder les champs "Process Name" et "Process ID" dans le détail. Un changement lancé par `svchost.exe` (souvent lié à `services.exe`) peut être une synchronisation réseau légitime. Lancé par `cmd.exe` ou `powershell.exe`, c'est très probablement un changement manuel du joueur, donc très suspect juste avant une partie ou un SS.
- **Vidage du journal d'audit (journal Sécurité) :**
  - ID : 1102
  - Journal : Sécurité (`Security.evtx`)
  - Description : indique explicitement que le journal Sécurité a été vidé. Ça demande les droits admin et c'est presque toujours fait à la main par quelqu'un qui veut cacher ses traces. Trouver cet événement, c'est un très fort indice de dissimulation.
- **Suppression du journal USN (journal Application) :**
  - ID : 3079
  - Journal : Application (`Application.evtx`)
  - Source : souvent `fsutil` ou des composants liés.
  - Description : le journal USN d'un volume (la lettre du disque est en général indiquée) a été supprimé (via `fsutil usn deletejournal`). C'est une tentative directe d'effacer l'historique d'activité du système de fichiers.
- **Journal vidé (hors Sécurité) :**
  - ID : 104
  - Journal : Système (`System.evtx`)
  - Description : indique qu'un autre journal (Application, Système, Setup ou un journal des "Journaux des applications et des services") a été vidé. Cet événement n'est pas généré pour le journal Sécurité (qui utilise 1102). Vider Application ou Système peut rester suspect selon le contexte.
- **Arrêt/démarrage du service EventLog (journal Système) :**
  - ID : 7036
  - Journal : Système (`System.evtx`)
  - Source : Service Control Manager
  - Description : enregistre le passage des services en état démarré ou arrêté. Filtrer sur "eventlog" dans le message montre si le service de journalisation lui-même a été arrêté puis relancé, ce qui sent la manipulation.
