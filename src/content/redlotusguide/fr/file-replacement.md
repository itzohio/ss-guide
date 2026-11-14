<!-- route: /screensharing-general-knowledge/eighth-section-common-bypass-techniques-in-screensharing/artifact-clearing-techniques/file-replacement -->
# Remplacer un fichier (la méthode du remplacement)

- **Description :** une technique courante : remplacer le fichier malveillant (le cheat) par un fichier légitime portant exactement le même nom. Le but est de tromper le SSer qui trouve des traces d'exécution liées à un nom de fichier, puis découvre à cet emplacement un programme tout à fait inoffensif.
- **Mécanisme :** en général comme ça :
  - Le tricheur a un exe de cheat, `MyClient.exe`, à un endroit précis (le Bureau, par exemple).
  - Il le lance. Des artefacts d'exécution (Prefetch, BAM, chaînes en mémoire) pointent vers ce fichier et ce chemin.
  - Juste avant le screenshare, il supprime le vrai `MyClient.exe`.
  - Tout de suite après, il déplace ou copie un fichier légitime (un `notepad.exe` renommé, `calc.exe` ou un autre programme inoffensif) au même endroit, avec exactement le même nom : `MyClient.exe`.
- **Pourquoi les tricheurs font ça :** pour pouvoir nier de façon plausible. Quand le SSer trouve une preuve d'exécution pour `MyClient.exe` (dans Prefetch ou BAM) et va au chemin indiqué, il trouve bien un `MyClient.exe`, mais c'est le fichier de remplacement. S'il se contente de regarder les propriétés ou le contenu du fichier actuel sans croiser les dates ni creuser, il passe à côté de l'échange.
- **Détection :** il faut croiser les preuves, surtout avec le journal USN :
  - Journal USN (`$UsnJrnl`) : la méthode la plus fiable. Le journal enregistre toute la séquence :
    - Un `FILE_DELETE` pour le cheat d'origine (`MyClient.exe`) à son emplacement.
    - Juste après, des `FILE_CREATE` et éventuellement `RENAME_NEW_NAME` pour le fichier légitime déplacé, copié ou renommé au même endroit avec le même nom (`MyClient.exe`). Les codes varient selon copie, déplacement ou renommage, mais le motif clé, c'est suppression puis création/renommage du même nom au même chemin en peu de temps.
  - Incohérence de dates (Prefetch/BAM vs fichier actuel) : comparer la date d'exécution vue dans Prefetch ou BAM avec les dates de création/modification du `MyClient.exe` présent sur le disque. Si l'exécution est bien plus récente que la création du fichier actuel, c'est que le fichier exécuté n'est pas celui qui est là maintenant.
  - Hash ou signature différents : si le cheat d'origine n'était pas signé ou avait un hash précis, et que le remplaçant est légitime (un `notepad.exe` signé), la comparaison du hash ou de la signature avec ce qu'annoncent les logs révèle le remplacement.
  - Date de compilation vue par DPS : le service DPS logge parfois la date de compilation gravée dans l'exe. Si DPS montre une exécution de `MyClient.exe` avec la date A, et que le fichier actuel a la date B (vérifiable via VirusTotal ou un outil d'analyse PE), le remplacement est prouvé.
  - (Avancé) `fsutil file queryFileNameById` : si le journal USN donne le FRN du cheat supprimé, cette commande (lancée assez vite, avant que l'enregistrement MFT soit réutilisé) peut parfois retrouver le nom d'origine lié à ce FRN. La fiabilité varie.

Repérer un remplacement de fichier demande de comparer minutieusement les dates et les événements du système de fichiers avec les artefacts d'exécution.
