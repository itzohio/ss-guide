<!-- route: /screensharing-general-knowledge/third-section-windows-fundamentals/key-ntfs-components/alternate-data-streams-hidden-data-streams -->
# Alternate Data Streams (ADS) — les flux cachés

Les Alternate Data Streams (ADS) sont une fonction de NTFS peu connue mais puissante : elle permet d'avoir plusieurs flux de données liés à un seul nom de fichier. Chaque fichier NTFS a un flux principal, sans nom, noté :$DATA. C'est lui qui contient le contenu normal : le texte d'un .txt, les pixels d'un .jpg, le code machine d'un .exe.

Mais NTFS autorise des flux supplémentaires, nommés, attachés à la même entrée dans le $MFT. Par exemple, un fichier `MyDocument.txt` peut avoir son texte dans `MyDocument.txt:$DATA` et en même temps un exécutable caché dans `MyDocument.txt:HiddenApp.exe`.

Forcément, ça se détourne facilement pour cacher des choses. Du code malveillant, des outils de triche, des configs, des logs ou des infos sensibles peuvent vivre dans un ADS collé à un fichier qui a l'air innocent (notepad.exe, calc.exe, un simple .txt ou une image). L'Explorateur Windows n'affiche ni l'existence ni la taille de ces flux par défaut : à l'œil nu, ils sont invisibles.

Pour les trouver et les examiner, il faut des commandes ou des outils dédiés :

- **Invite de commandes :** `dir /r` liste les flux alternatifs des fichiers du dossier courant.
- **PowerShell :** `Get-Item -Path .\MyDocument.txt -Stream *` liste les flux d'un fichier. `Get-Content -Path .\MyDocument.txt -Stream HiddenApp.exe` lit le contenu (si c'est du texte).
- **Outils dédiés :** AlternateStreamView de Nirsoft ou Streams de Sysinternals permettent de trouver, voir, extraire et supprimer des ADS avec une interface.
- **Exécution :** lancer du code caché dans un ADS demande des techniques particulières, comme `wmic process call create "C:\path\file.txt:hidden.exe"` ou l'utilitaire `forfiles`.

En screenshare, connaître les ADS est indispensable : c'est une technique classique pour planquer une payload malveillante.
