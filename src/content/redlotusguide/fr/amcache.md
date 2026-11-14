<!-- route: /screensharing-general-knowledge/ninth-section-more-artifact-analysis-for-screensharing/amcachesyscacherecentfilecache-analysis -->
# Analyse d'Amcache / Syscache / RecentFileCache

Windows utilise plusieurs bases dans son cadre de compatibilité applicative pour suivre l'exécution des programmes. C'est fait pour la compatibilité, mais ça crée des artefacts très utiles.

- Le fichier **Amcache.hve** (`C:\Windows\AppCompat\Programs\Amcache.hve` sur Windows 8/10/11) est une ruche de registre qui garde les détails des applications exécutées : chemin de l'exe, hash SHA1, date d'installation ou de première exécution (souvent déduite de la création d'un fichier de lien), et parfois des dates de suppression. Amcache ne donne pas toujours la dernière exécution aussi précisément que Prefetch, mais il prouve qu'un programme a été présent et a tourné au moins une fois, et les entrées peuvent rester même après désinstallation. Le hash SHA1 est très pratique pour identifier un exe malveillant connu même renommé. AmcacheParser (Eric Zimmerman) est l'outil standard pour lire cette ruche.
- Sur les vieux systèmes, surtout Windows 7, le prédécesseur s'appelle **Syscache.hve**. Il est souvent dans System Volume Information (`C:\Windows\System32\config\System.sav\Syscache.hve` ou équivalent) et demande les droits admin ou un montage hors ligne. Il fait à peu près la même chose qu'Amcache : suivre les programmes et pilotes exécutés. L'outil communautaire Ruedas est connu pour le parser.

Autre artefact lié : **RecentFileCache.bcf** (`C:\Windows\AppCompat\Programs\RecentFileCache.bcf` sur Win 7/8/10, usage variable). C'est un fichier binaire qui suit les fichiers récemment exécutés. Il capte parfois des exécutions ratées par les autres caches, ou des dates un peu plus récentes. RecentFileCacheParser (Eric Zimmerman) l'analyse.

Ensemble, ces caches donnent un historique de l'exécution des programmes sur la machine, en complément de Prefetch.
