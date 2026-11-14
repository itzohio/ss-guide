<!-- route: /screensharing-general-knowledge/fourth-section-common-windows-artifacts-and-their-basic-analysis/execution-traces-and-recent-activity/prefetch -->
# Prefetch (C:\Windows\Prefetch)

- **Rôle :** à la base, c'est une fonction de Microsoft pour accélérer le lancement des programmes. Windows regarde les fichiers et les données qu'un programme utilise au démarrage, puis les précharge la fois suivante. Pour nous, ce qui compte, c'est que les fichiers Prefetch (`.pf`) sont un indicateur d'exécution direct et très fiable.
- **Emplacement :** `C:\Windows\Prefetch`. On y accède via Exécuter (Win+R) en tapant `prefetch`, avec les droits admin.
- **Format et nommage :** Windows crée un `.pf` pour beaucoup d'exécutables les premières fois qu'ils tournent. Le nom suit toujours le même modèle : `NOM.EXE-HASH.pf`.
  - `NOM.EXE` : le nom de l'exécutable lancé.
  - `HASH` : un hash hexadécimal de 8 caractères, calculé à partir du chemin d'où l'exe a été lancé. Lancer le même exe depuis deux endroits différents (Bureau et Téléchargements, par exemple) donne deux `.pf` différents.
- **Ce qu'on trouve dans un `.pf` :** chaque fichier contient des métadonnées très utiles :
  - Le nom de l'exécutable.
  - Le hash du chemin d'exécution.
  - Le Run Count : combien de fois le programme a tourné depuis ce chemin.
  - La date de dernière exécution. C'est l'info clé, et la date de modification du `.pf` lui-même correspond directement à cette dernière exécution.
  - Les horodatages des 8 exécutions précédentes, ce qui donne un petit historique.
  - Les infos du volume (lettre, nom, numéro de série, date de création) où l'exe se trouvait lors de sa dernière exécution.
  - La liste des dossiers et fichiers (DLL comprises) touchés par l'exe au démarrage, en gros les 10 premières secondes.
- **Outils d'analyse :** les `.pf` sont binaires, mais plusieurs outils les lisent :
  - WinPrefetchView (Nirsoft) : un outil gratuit avec interface, très utilisé. En haut la liste des entrées, en bas les détails de celle sélectionnée, dont la fameuse liste des fichiers chargés au démarrage. Pratique pour voir si un processus légitime comme `java.exe` a chargé un `.jar` suspect.
  - PECmd (Eric Zimmerman) : en ligne de commande, plus poussé. Il sort toutes les métadonnées et sert quand WinPrefetchView coince ou qu'on veut croiser les données (export CSV vers Timeline Explorer).
  - LastActivityView (Nirsoft) : il agrège plusieurs sources, dont Prefetch, et affiche l'activité dans l'ordre chronologique.
- **Dépendances, bypass et nuances :**
  - Dépendance au service : Prefetch repose sur SysMain (l'ancien Superfetch). Si le service est arrêté, les `.pf` peuvent ne plus être créés ni mis à jour. Vérification : `sc query sysmain` en admin. Un service arrêté pendant un check, c'est très louche.
  - Contrôle par le registre : l'état de la fonction est géré par la valeur `EnablePrefetcher` dans `HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Control\Session Manager\Memory Management\PrefetchParameters`. À 0, Prefetch est désactivé, ce qui est suspect si ce n'est pas justifié (certains guides d'optimisation SSD le conseillent, mais c'est rare maintenant).
  - Bypass par les permissions (`cacls`) : un tricheur peut modifier les permissions du dossier `C:\Windows\Prefetch` (avec `cacls` ou `icacls`) pour bloquer l'écriture et empêcher la création des `.pf`. Ce genre de changement de permissions se repère souvent dans le journal USN (`$UsnJrnl`), en cherchant les événements de sécurité sur le dossier Prefetch.
  - Fichiers cachés : un `.pf` peut être passé en caché avec les attributs classiques. Pour les voir : `dir /ah C:\Windows\Prefetch` en admin.
  - Extensions renommées et non-exe : Prefetch log surtout les `.exe`.
    - Si un exe est renommé (par exemple `cheat.exe` en `cheat.tmp`) et lancé d'une façon particulière (comme `Start-Process` en PowerShell), Prefetch crée souvent quand même une entrée, avec l'extension renommée dans le nom (`CHEAT.TMP-HASH.pf`). Tomber sur ça, c'est un gros indice d'évasion.
    - Lancer un `.jar` crée en général une entrée pour le runtime Java (`java.exe` ou `javaw.exe`). Il faut alors regarder la liste des fichiers référencés pour retrouver le `.jar` chargé.
    - Une injection de DLL peut créer une entrée pour le processus hôte (`rundll32.exe`, `regsvr32.exe`) ou pour l'injecteur. Là encore, la liste des fichiers référencés peut révéler la DLL.
  - Indice de process hollowing : parfois, une entrée Prefetch avec un champ "Executable Path" vide dans WinPrefetchView peut suggérer du process hollowing, mais seul, ce n'est pas une preuve.
