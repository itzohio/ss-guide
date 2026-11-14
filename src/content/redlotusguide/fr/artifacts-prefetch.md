<!-- route: /advanced-explanation-of-artifacts/program-execution/prefetch -->
# Prefetch

## But et fonctionnement

Le prefetching est une fonction de performance intégrée à Windows, faite pour réduire le temps de démarrage des applications. Le système, via le service SysMain (anciennement Superfetch), surveille les fichiers et données qu'une application accède pendant son lancement (en général les 10 premières secondes), puis note tout ça dans un fichier Prefetch (`.pf`). Aux lancements suivants, Windows s'en sert pour précharger les ressources en mémoire et démarrer plus vite.

Vue DFIR, cette fonction de performance crée un des artefacts les plus fiables pour suivre l'exécution des programmes. La création et la modification des `.pf` sont un journal direct des lancements d'applications.

## Emplacement et nommage

Les fichiers Prefetch sont dans un dossier système qui demande en général les droits admin :

- Emplacement : `C:\Windows\Prefetch`

Chaque `.pf` correspond à un exécutable lancé depuis un emplacement précis et suit un schéma de nom constant :

`EXECUTABLENAME.EXE-HASH.pf`

- EXECUTABLENAME.EXE : le nom de l'exécutable lancé (`NOTEPAD.EXE`, `VAPE.EXE`…).
- HASH : un hash hexadécimal de 8 caractères. Point important : ce hash est calculé sur le chemin complet depuis lequel l'exécutable a été lancé, pas sur le contenu du fichier. Lancer le même exécutable depuis deux emplacements différents (`C:\Users\Admin\Desktop\cheat.exe` et `C:\Users\Admin\Downloads\cheat.exe`) génère donc deux `.pf` distincts, avec deux hash différents.

## Structure interne et métadonnées

Chaque `.pf` est un fichier binaire avec plein de métadonnées, lisibles avec des outils spécialisés. On y trouve :

- Nom de l'exécutable : le nom du programme lancé.
- Run Count : le nombre total d'exécutions depuis ce chemin précis.
- Horodatages :
  - Dernière exécution : un horodatage très précis de la dernière fois que l'appli a tourné depuis ce chemin. En pratique, la date de modification du `.pf` reflète directement cette valeur.
  - Exécutions précédentes : jusqu'à 8 horodatages précédents sont stockés dans le fichier, ce qui donne un historique court des lancements depuis ce chemin.
- Infos de volume : des détails sur le disque où se trouvait l'exécutable à la dernière exécution, dont le chemin de volume (`\Device\HarddiskVolume1`), la date de création et le numéro de série. C'est essentiel pour repérer les exécutions depuis un support amovible type clé USB.
- Fichiers et dossiers référencés : la liste des fichiers (DLL, configs, etc.) et dossiers accédés au démarrage. C'est une info capitale, parce qu'elle permet de relier un processus hôte générique (`java.exe`, `rundll32.exe`) à une charge précise (un `.jar` de cheat, une `.dll` injectée).

## Dépendances et contrôle système

Le prefetching ne tourne pas tout seul, il dépend de composants précis :

- **Service SysMain :** toute la fonctionnalité est gérée par ce service. S'il est arrêté ou désactivé, Windows arrête de créer ou mettre à jour les `.pf`. Son état se vérifie avec `sc query sysmain`.
- **Contrôle par le registre :** l'état du prefetcher se configure dans `HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Control\Session Manager\Memory Management\PrefetchParameters`.

La valeur DWORD `EnablePrefetcher` de cette clé détermine le comportement :

- `0` : désactivé
- `1` : prefetch au lancement des applications
- `2` : prefetch au démarrage
- `3` : les deux (par défaut)

Une valeur non standard, surtout `0`, est un fort indicateur de manipulation volontaire.

## Valeur forensique

La valeur de Prefetch est énorme. Il donne une timeline fiable et précise des applications lancées sur la machine. Comme il note le nom complet de l'exécutable (extension comprise), les fichiers référencés, et qu'il est lié à un chemin d'exécution précis, c'est un pilier pour :

- Confirmer l'exécution d'un logiciel malveillant.
- Établir la chronologie des actions.
- Repérer les programmes lancés depuis des emplacements inhabituels ou des supports amovibles.
- Découvrir les tentatives de camouflage par changement d'extension.

#### Points de réflexion (SS Contest)

Pour un SSer, Prefetch est une source de preuve à haute confiance.

- **Preuve précise :** la "dernière exécution" est assez précise pour prouver une exécution "in instance", en lien direct avec la session de jeu.
- **Détecter l'évasion :** le schéma de nom rend les techniques d'évasion évidentes. Un fichier comme `MyCheat.tmp-A1B2C3D4.pf` trahit une extension falsifiée.
- **Relier les processus hôtes :** la liste des fichiers référencés permet de connecter les points. Un SSer peut prouver qu'un `javaw.exe` a chargé un `.jar` de cheat, ou que `rundll32.exe` a servi à charger une `.dll` de cheat.
- **Preuve de manipulation :** un dossier Prefetch vide (alors que le service tourne et que la clé registre est activée) est une forte preuve de nettoyage. Un `.pf` en lecture seule est une tentative directe de "figer" l'artefact pour cacher l'activité récente. Trouver le service SysMain arrêté ou `EnablePrefetcher` à `0` est en soi un acte de manipulation très suspect.
