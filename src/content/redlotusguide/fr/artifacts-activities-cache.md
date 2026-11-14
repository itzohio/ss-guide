<!-- route: /advanced-explanation-of-artifacts/program-execution/activities-cache -->
# Activities Cache

## But et fonctionnement

L'Activities Cache est un composant clé de la Timeline Windows, apparue avec Windows 10 (version 1803) et présente dans Windows 11. Le but de cette fonction : créer un historique chronologique riche des activités d'un utilisateur (applications lancées, documents ouverts, sites visités), pour reprendre une tâche d'une session à l'autre, et même d'un appareil à l'autre lié au même compte Microsoft.

Vue DFIR, la base `ActivitiesCache.db` est un artefact extrêmement détaillé. Elle donne un journal des interactions centré utilisateur, avec du contexte sur ce qui a été lancé, comment et pendant combien de temps, souvent relié à des fichiers ou ressources précises.

## Emplacement et dépendances

L'Activities Cache est une base SQLite dans le profil de chaque utilisateur.

- Emplacement : `C:\Users\%username%\AppData\Local\ConnectedDevicesPlatform\{UserProfile_ID}\ActivitiesCache.db`

Son alimentation et son accessibilité dépendent de plusieurs réglages et services :

- Réglages système : l'utilisateur doit avoir activé "Historique des activités" dans les paramètres de confidentialité.
- Services : le service "Expériences des utilisateurs connectés et télémétrie" (aussi appelé `DiagTrack`) doit en général tourner pour que la base soit alimentée.
- Chiffrement : selon la config et le compte, le contenu peut être chiffré, ce qui demande des outils capables de déchiffrer.

## Métadonnées stockées

Base SQLite oblige, `ActivitiesCache.db` a plusieurs tables avec beaucoup d'infos structurées. On y trouve notamment :

- Infos application : le nom et le chemin de l'application qui a généré l'activité (`javaw.exe`, `explorer.exe`…).
- Type d'activité : la nature de l'interaction (`UserEngaged`, `Open`…).
- Focus Time : les horodatages `StartTime` et `EndTime` d'une activité, qui permettent de calculer combien de temps une application est restée au premier plan.
- Texte affiché et contenu : des infos contextuelles riches, comme le titre de la fenêtre, le nom du document édité ou l'URL visitée.
- Payload : souvent un blob JSON avec des détails propres à l'application, y compris des chemins complets ou d'autres identifiants.

## Valeur forensique

L'Activities Cache donne une vision très complète du workflow d'un utilisateur, ce qui est inestimable pour reconstituer une séquence d'événements.

- **Timeline riche :** plus détaillée et plus contextualisée que beaucoup d'autres artefacts d'exécution. Ça ne montre pas juste qu'un programme a tourné, mais qu'un utilisateur a ouvert un fichier précis avec et y a travaillé pendant un certain temps.
- **Intention de l'utilisateur :** les données aident à établir l'intention. Par exemple : ouverture du navigateur, visite d'un site de cheats, téléchargement d'un fichier, ouverture d'un `.zip`, puis lancement d'un exécutable depuis l'archive — une série d'activités liées.
- **Persistance :** la base garde l'historique assez longtemps (30 jours par défaut en général), ce qui préserve des preuves effacées des artefacts plus volatiles.
- **Traces de fichiers supprimés :** elle peut référencer (texte affiché, payload) des fichiers depuis supprimés du disque, ce qui prouve leur existence et leur usage passés.

La complexité de la base, plus le chiffrement possible, font qu'un outil forensique dédié est recommandé.

#### Points de réflexion (SS Contest)

Pour un SSer, l'Activities Cache peut être la source qui relie toutes les preuves en un récit incontestable.

- **Construire un récit :** c'est sa grande force en SS. Tu ne présentes pas des artefacts isolés, mais une histoire étape par étape. Par exemple : "À 15h10, ton activité navigateur montre une visite sur `cheats.com`. À 15h12, une activité WinRAR montre l'ouverture de `SuperAim.zip`. À 15h13, cette base montre l'exécution de `SuperAim.exe`."
- **Vérifier les dépendances :** si l'artefact manque de données alors qu'il devrait être actif, c'est peut-être que l'utilisateur a désactivé volontairement l'historique des activités dans ses paramètres de confidentialité — un acte suspect en soi.
