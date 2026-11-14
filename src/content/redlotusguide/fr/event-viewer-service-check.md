<!-- route: /screensharing-general-knowledge/seventh-section-manual-ss-techniques/event-viewer/checking-the-eventlog-service -->
# Vérifier le service EventLog

L'enregistrement des événements dépend du service EventLog (`eventlog`). S'il est arrêté, plus rien n'est enregistré et l'Observateur ne fonctionne plus.

- Vérifier l'état : CMD/PowerShell en admin, `sc query eventlog`.
- État attendu : `RUNNING`. Un `STOPPED` est très suspect.
