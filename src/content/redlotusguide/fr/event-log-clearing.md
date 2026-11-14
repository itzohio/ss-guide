<!-- route: /screensharing-general-knowledge/eighth-section-common-bypass-techniques-in-screensharing/artifact-clearing-techniques/event-log-clearingmanipulation -->
# Vider ou bricoler les journaux d'événements

- **Description :** supprimer des événements des journaux Windows (`.evtx`) pour effacer les preuves de certaines actions (changement d'heure, manipulation de service, plantages causés par un cheat, événements de sécurité).
- **Mécanisme :**
  - Interface de l'Observateur : clic droit sur un journal (Sécurité, Application, Système) > "Effacer le journal…".
  - Commande `wevtutil.exe` : `wevtutil cl NomDuJournal` (par exemple `wevtutil cl Security`). Il faut les droits admin.
  - Arrêt du service EventLog : `sc stop eventlog` ou `net stop eventlog` (avec les permissions nécessaires) empêche l'enregistrement de nouveaux événements pendant l'arrêt.
  - Manipulation avancée : toucher directement aux `.evtx` hors ligne (difficile), ou utiliser PsExec pour déconnecter des canaux précis (complexe et rare en screenshare).
- **Pourquoi les tricheurs font ça :** effacer les traces de changements d'heure (ID 4616), de suppression du journal USN (3079), d'arrêt/démarrage de services (7036), de plantages d'applications (souvent 1001/1002) ou d'événements de sécurité déclenchés par leurs outils.
- **Détection :** Windows logge lui-même l'effacement :
  - Vidage du journal Sécurité : l'ID 1102 est écrit dans le journal Sécurité avant que l'opération se termine. Cet événement prouve que le journal a été vidé volontairement.
  - Vidage des autres journaux : l'ID 104 dans le journal Système indique quel journal a été vidé.
  - Service EventLog arrêté : `sc query eventlog` qui montre le service arrêté est très suspect. Le journal Système (ID 7036) doit aussi montrer le passage à l'arrêt.
  - Trous dans les logs : des interruptions chronologiques inexpliquées peuvent suggérer un effacement, mais il faut analyser finement pour les distinguer du comportement normal.
