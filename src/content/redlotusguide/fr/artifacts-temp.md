<!-- route: /advanced-explanation-of-artifacts/user-activity-and-knowledge/temporary-files-temp -->
# Fichiers temporaires (%temp%)

### But et fonctionnement

Le dossier des fichiers temporaires, accessible via la variable `%temp%`, est un répertoire dédié où Windows et les applications stockent des données éphémères : fichiers de cache, copies temporaires de documents en cours d'édition, logs d'installation, fichiers extraits d'archives compressées.

Vue DFIR, `%temp%` est un emplacement clé pour trouver des traces d'activité récente. Comme c'est un dossier courant où l'utilisateur peut écrire, il sert souvent de brouillon, aussi bien aux logiciels légitimes qu'aux malveillants, et laisse des preuves précieuses.

### Emplacement et structure

Chaque utilisateur a son propre dossier temporaire, ce qui isole les données de chaque compte.

- Emplacement : `%LOCALAPPDATA%\Temp`
  - Soit en général : `C:\Users\%username%\AppData\Local\Temp`

C'est un dossier standard avec un mélange de fichiers et de sous-dossiers créés par plein de processus différents. Le contenu peut être énorme et chaotique, ce qui demande une approche ciblée, en général un tri par date de modification pour ne regarder que le récent.

### Artefacts stockés et valeur forensique

Le contenu est divers, mais certains types d'artefacts sont très intéressants, surtout en détection de cheats.

- **Archives extraites :** quand un utilisateur lance un exécutable depuis une archive (`.zip`, `.rar`, `.7z`) sans l'extraire, l'outil d'archivage (WinRAR, 7-Zip) extrait souvent les fichiers nécessaires dans un sous-dossier temporaire de `%temp%`. Ces dossiers portent des noms comme `Rar$EXa0.123` ou `7zOADF8.tmp`. Examiner leur contenu et leurs horodatages révèle des programmes récemment lancés depuis des archives.
- **Bibliothèques JnativeHook :** certaines applications Java, notamment des autoclickers et outils de macro, utilisent la bibliothèque tierce JnativeHook pour interagir avec les entrées clavier et souris globales. Au lancement, elles déposent souvent une DLL native dans `%temp%`, avec un nom du type `JnativeHook-xxxxxxxx.dll`. La date de création de cette DLL correspond directement au moment du lancement de l'application Java.
- **Logs et caches d'application :** beaucoup d'applications stockent des logs temporaires, des configs ou des caches ici. Ça donne du contexte sur leur activité ou leurs réglages récents.
- **Restes de droppers :** des malwares ou loaders de cheats utilisent parfois `%temp%` comme zone de dépôt pour une charge secondaire ou un script avant exécution.

La difficulté principale, c'est la volatilité et le bruit des applications légitimes. Mais le contenu est directement attribuable à l'utilisateur, et les horodatages donnent des preuves très précises de l'activité récente.

#### Points de réflexion (SS Contest)

Pour un SSer, `%temp%` est une priorité pour trouver des traces d'outils récemment utilisés, surtout ceux qui ne s'installent pas de façon permanente.

- **La preuve JnativeHook :** la présence d'un `JnativeHook-xxxxxxxx.dll` est un des indicateurs les plus connus et les plus directs d'un autoclicker Java. Un SSer peut trier `%temp%` par date et repérer ce fichier tout de suite. Son heure de création donne le moment exact du lancement du cheat. Même si le fichier est supprimé, l'événement de suppression se trouve dans le journal USN.
- **Démasquer les cheats lancés depuis un ZIP :** scénario très courant. Un joueur télécharge un cheat en `.zip` et, pour ne pas le laisser sur le Bureau, le lance directement depuis l'archive. Le SSer trouve le dossier d'extraction temporaire dans `%temp%`, qui contient l'exécutable du cheat. L'heure de création ou de modification du dossier donne le moment de l'exécution.
- **Un premier coup d'œil sur l'activité récente :** ouvrir `%temp%` et trier par date de modification est un des moyens les plus rapides de voir ce qu'un joueur faisait juste avant le screenshare. Les dossiers récents ou les types de fichiers suspects (`.exe`, `.dll`, `.jar`) en haut de la liste sont des cibles immédiates.
- **Trouver les fichiers déposés :** si un loader de cheat a tourné, il a peut-être déposé sa charge dans `%temp%`. Un exécutable non signé avec une date de création très récente dans ce dossier est très suspect.
