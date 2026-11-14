<!-- route: /screensharing-general-knowledge/seventh-section-manual-ss-techniques/regedit-registry-explorer/key-considerations-for-screensharing -->
# Les points importants en screenshare

- **Actions utilisateur ou système :** tout changement dans le registre n'est pas malveillant ni fait par le joueur. Croiser les LastWriteTime avec d'autres artefacts (Prefetch, journal, logs) pour avoir le contexte. Chercher aussi un accès manuel via `regedit.exe` ou `reg.exe`.
- **Permissions :** modifier HKLM demande en général les droits admin ; HKCU est propre à l'utilisateur.
- **Dates :** se concentrer sur la "Last Write Time" des clés, qui indique la dernière modification à l'intérieur.
- **Entrées supprimées :** trouver des entrées effacées, surtout dans BAM, UserAssist ou OpenSavePidlMRU, avec un outil comme Registry Explorer, est un très bon indice de nettoyage volontaire des preuves.
