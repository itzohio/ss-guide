<!-- route: /advanced-explanation-of-artifacts/program-execution/bam-and-dam -->
# BAM et DAM

## Background Activity Moderator (BAM) et Desktop Activity Moderator (DAM)

### But et fonctionnement

Le Background Activity Moderator (BAM) et son prédécesseur le Desktop Activity Moderator (DAM) sont des services Windows qui gèrent et limitent la consommation de ressources des applications en arrière-plan. Apparu avec Windows 10 (Fall Creators Update, 1709), le BAM sert surtout à éviter que les processus de fond plombent les performances ou la batterie en limitant leur activité.

Vue DFIR, ce service de modération crée un artefact très utile. Pour faire son boulot, il garde une trace des applications qu'il surveille. Cette trace est stockée dans le registre Windows et fait office de journal des programmes exécutés, en capturant parfois des exécutions que d'autres artefacts ratent.

### Emplacement et structure

Les données BAM et DAM sont dans des clés précises de la ruche SYSTEM. Y accéder demande les droits admin.

- Emplacement : `HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Services\bam\State\UserSettings\{User_SID}`
- Pour DAM (systèmes plus anciens) : `HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Services\dam\State\UserSettings\{User_SID}`

Dans chaque clé SID utilisateur, les données sont stockées sous forme de valeurs de registre.

- Nom de la valeur : le chemin complet du programme exécuté, en notation NT (`\Device\HarddiskVolumeX\...`).
- Donnée de la valeur : une structure binaire. La partie la plus intéressante est un horodatage `FILETIME` de 8 octets, qui donne la dernière fois où l'application a été vue par le service.

### Métadonnées et comportement

Le BAM/DAM donne deux infos par entrée :

- **Chemin complet de l'exécutable :** le nom de la valeur donne le chemin complet du programme exécuté. Indispensable pour savoir quel fichier a tourné et d'où (une clé USB, un dossier temporaire…).
- **Dernière exécution :** le `FILETIME` dans les données binaires indique la dernière fois que le programme a été vu tourner par le BAM. Il est mis à jour au lancement mais aussi lors des interactions ou fermetures suivantes, ce qui en fait un indicateur très précis de l'activité récente.

Contrairement à Prefetch, qui journalise surtout les `.exe`, le BAM/DAM note aussi d'autres types d'applications, même si son focus reste les exécutables.

Caractéristique importante : c'est volatil. Les entrées des clés BAM peuvent être écrasées au fil des nouveaux programmes surveillés. Et ces clés peuvent être effacées volontairement par un utilisateur avec les droits, ou par un utilitaire de nettoyage.

### Valeur forensique

Le BAM/DAM est un artefact d'exécution essentiel, surtout quand Prefetch n'est pas disponible ou a été trafiqué. Son intérêt :

- **Horodatages précis :** il donne une heure précise de la dernière activité connue, vital pour une timeline juste.
- **Chemin complet :** il note l'emplacement exact d'où le programme a été lancé, ce qui aide à retrouver l'origine d'un exécutable malveillant.
- **Preuve complémentaire :** il capture souvent des exécutions qui ne génèrent pas de Prefetch, ou dont l'entrée Prefetch a été supprimée.
- **Preuve de manipulation :** comme les données sont à un emplacement connu du registre, la suppression peut souvent être détectée via l'espace libre du registre ou en voyant que la date "LastWrite" de la clé est récente. Des outils forensiques savent souvent mettre en évidence les entrées BAM récemment supprimées, ce qui transforme une tentative d'effacement en preuve d'intention.

#### Points de réflexion (SS Contest)

Pour un SSer, le BAM est une autre source majeure pour prouver une exécution "in instance", souvent avec précision.

- **Preuve directe d'exécution :** trouver le chemin d'un cheat dans les clés BAM avec un horodatage récent est une preuve directe et convaincante.
- **Attraper les contournements :** le BAM est très efficace contre les cheats lancés puis supprimés aussitôt. Le fichier a disparu, mais l'enregistrement d'exécution reste.
- **Détecter les loaders "fileless" :** certaines techniques de bypass utilisent des exécutables légitimes pour lancer du code malveillant. L'exécution du loader initial (un hôte PowerShell ou CMD suspect) peut être dans le BAM, ce qui donne une piste.
