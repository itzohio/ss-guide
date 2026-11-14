<!-- route: /screensharing-general-knowledge/fourth-section-common-windows-artifacts-and-their-basic-analysis/windows-event-logs-introduction/the-eventlog-service -->
# Le service EventLog

- **Dépendance :** tout le système de journaux repose sur le service Windows Event Log (nom : `eventlog`). C'est lui qui gère les fichiers, reçoit les événements des fournisseurs et permet à l'Observateur d'événements d'y accéder.
- **Statut critique :** si `eventlog` est arrêté, plus aucun événement n'est enregistré et l'Observateur d'événements (comme les autres outils) ne peut plus rien afficher. Trouver ce service arrêté pendant un screenshare est très suspect et suggère fortement une manipulation ou un gros problème système.
- **Vérifier son état :** en admin, dans une invite de commandes ou PowerShell : `sc query eventlog`. L'état attendu est `RUNNING`.
