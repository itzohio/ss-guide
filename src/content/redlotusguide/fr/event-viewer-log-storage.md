<!-- route: /screensharing-general-knowledge/seventh-section-manual-ss-techniques/event-viewer/log-storage -->
# Où sont stockés les journaux

Les journaux sont des fichiers `.evtx`, en général dans `%SystemRoot%\System32\Winevt\Logs\` (par exemple `Application.evtx`, `Security.evtx`, `System.evtx`).

Des applications tierces peuvent aussi créer leurs propres journaux.
