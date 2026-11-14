<!-- route: /screensharing-general-knowledge/seventh-section-manual-ss-techniques/regedit-registry-explorer/forensically-relevant-registry-keyslocations -->
# Les clés et emplacements utiles pour l'analyse

Une analyse fine du registre demande de l'expérience, mais certaines clés sont vérifiées systématiquement en screenshare (beaucoup sont collectées automatiquement par des outils comme le module RECmd de RL Collector) :

- **Paramètres Prefetch :** `HKLM\SYSTEM\CurrentControlSet\Control\Session Manager\Memory Management\PrefetchParameters` (vérifier `EnablePrefetcher`).
- **Program Compatibility Assistant (PCA) :** `HKCU\Software\Microsoft\Windows NT\CurrentVersion\AppCompatFlags\Compatibility Assistant\Store` (les chemins des programmes vus par PCA).
- **Background Activity Moderator (BAM) :** `HKLM\SYSTEM\CurrentControlSet\Services\bam\State\UserSettings\{User_SID}` (chemins des applis exécutées et dates de dernière exécution — et regarder si des entrées ont été supprimées).
- **UserAssist :** `HKCU\Software\Microsoft\Windows\CurrentVersion\Explorer\UserAssist\{GUID}\Count` (lancements de programmes graphiques, compteurs, dates — les données sont encodées en ROT-13).
- **MRU des boîtes Ouvrir/Enregistrer :** `HKCU\Software\Microsoft\Windows\CurrentVersion\Explorer\ComDlg32\OpenSavePidlMRU\` (les derniers fichiers ouverts ou enregistrés via les boîtes de dialogue, par extension). Ça révèle des cheats, DLL ou configs récemment utilisés.
- **RecentDocs :** `HKCU\Software\Microsoft\Windows\CurrentVersion\Explorer\RecentDocs` (les documents récents, souvent le miroir de `shell:recent` — vérifier si c'est vide).
- **Clés Run / RunOnce :** `HKLM\Software\Microsoft\Windows\CurrentVersion\Run`, `HKCU\Software\Microsoft\Windows\CurrentVersion\Run` (et les variantes RunOnce). Emplacements classiques de persistance pour malware et PUP.
- **Historique USB :** `HKLM\SYSTEM\CurrentControlSet\Enum\USBSTOR` (les périphériques USB de stockage branchés).
- **Historique réseau :** plusieurs clés sous `HKLM\SYSTEM\CurrentControlSet\Services\Tcpip\Parameters` et les profils réseau utilisateur peuvent révéler l'historique des connexions.
- **Autorun du processeur de commandes :** `HKLM\SOFTWARE\Microsoft\Command Processor\Autorun` (des commandes lancées automatiquement au démarrage de `cmd.exe` — bypass potentiel).
