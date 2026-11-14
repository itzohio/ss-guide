<!-- route: /screensharing-general-knowledge/eighth-section-common-bypass-techniques-in-screensharing/concealment-and-obfuscation/1-spoofed-extensions -->
# Les extensions usurpées

- **Description :** une technique simple et très courante : déguiser un exécutable (souvent `.exe`, mais aussi des scripts `.bat` ou `.ps1`) en changeant son extension pour quelque chose d'innocent. `SuperClicker.exe` devient `important_notes.txt`, `config.dll`, `logo.png`, `tempdata.tmp`, ou même `mydata` sans extension.
- **Mécanisme :** le bypass joue sur le fait que, si le double-clic utilise l'extension pour lancer un fichier, Windows propose d'autres façons de lancer un processus sans dépendre du `.exe` :
  - Des commandes PowerShell comme `Start-Process C:\path\to\renamed_file.tmp`.
  - Des commandes WMI, notamment `wmic process call create "C:\path\to\renamed_file.dat"`.
  - Des tâches planifiées ou des scripts qui indiquent le fichier exact à exécuter, peu importe l'extension.
- **Pourquoi les tricheurs font ça :** échapper aux scans visuels et aux outils automatiques qui cherchent surtout des `.exe`. Un `graphics.dll` ou une `image.png` attire moins l'œil qu'un `MegaAimAssist.exe`.
- **Détection :**
  - Analyse Prefetch : comme vu avant, Prefetch logge souvent l'exécution sous le nom maquillé (`LOGO.PNG-HASH.pf`). Un fichier non-`.exe` dans Prefetch, c'est un gros signal.
  - Analyse mémoire : System Informer, en fouillant la mémoire de services (surtout `csrss.exe` et `dps`), révèle les chemins complets des fichiers exécutés, y compris avec une extension maquillée, avec les bonnes regex (par exemple `^!![A-Z]((?!Exe).)*$` dans DPS, ou une recherche large de chemins dans `csrss`).
  - Signature et contenu : lancer une vérification de signature (comme le script Signature Checker de BACA) sur tous les fichiers suspects, quelle que soit l'extension, permet de repérer les exécutables déguisés (ils ressortent en "NotSigned" ou "HashMismatch" si une fausse signature a été tentée). Detect It Easy, ou une recherche d'en-tête PE (`content:"This program cannot be run in DOS mode."`) dans Everything, les exposent aussi.
  - Logs d'exécution : BAM, Activities Cache et parfois les journaux d'événements enregistrent l'exécution sous le nom maquillé.
