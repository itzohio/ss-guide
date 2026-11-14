<!-- route: /advanced-explanation-of-artifacts/program-execution/recentfilecache -->
# RecentFileCache

## But et fonctionnement

`RecentFileCache.bcf` est un fichier binaire utilisé par Windows, surtout dans le cadre du framework de compatibilité applicative. Comme Amcache/Syscache, il met en cache des infos sur les applications récemment exécutées pour aider aux vérifications de compatibilité et aux performances. C'est un journal simple et à court terme des exécutions.

Vue DFIR, `RecentFileCache.bcf` est une autre source de preuve d'exécution, moins détaillée mais utile : elle contient parfois des traces de programmes absents des autres artefacts, ou des données temporelles légèrement différentes qui aident à corroborer ou compléter une timeline.

## Emplacement et structure

C'est un fichier binaire unique, dans le même dossier que la ruche `Amcache.hve`.

- Emplacement : `C:\Windows\AppCompat\Programs\RecentFileCache.bcf`

Sa structure interne est simple : un en-tête et une série d'entrées successives. Chaque entrée représente un programme exécuté et stocke peu de métadonnées. Format binaire oblige, il faut un outil dédié pour le lire.

## Métadonnées stockées

Comparé à Amcache, c'est plus concis. Une entrée typique contient :

- Chemin du fichier : le chemin complet de l'exécutable lancé.
- Taille du fichier.
- Horodatage d'exécution : il reflète en général le moment de l'exécution, avec des variations selon la version de Windows et l'état du système.

Le cache a une taille limitée et fonctionne en FIFO : au fil des nouveaux programmes, les anciennes entrées finissent par être écrasées.

## Valeur forensique

Moins complet que Prefetch ou SRUM, `RecentFileCache.bcf` reste une pièce utile :

- **Confirmation rapide :** un moyen simple et direct de confirmer qu'un exécutable a tourné.
- **Preuve complémentaire :** sa valeur principale est de corroborer les autres sources. Trouver le chemin d'un exécutable à la fois dans `RecentFileCache.bcf` et dans un autre artefact (BAM, par exemple) renforce la certitude.
- **Traces uniques :** parfois, à cause des subtilités de la journalisation Windows, une exécution apparaît ici et pas ailleurs, surtout si les autres artefacts ont été nettoyés ou n'ont pas été mis à jour. C'est donc une source secondaire à ne pas oublier.
- **Simplicité :** sa structure simple le rend rapide à parser, ce qui donne un aperçu immédiat de l'activité récente.

En revanche, sa taille limitée et l'absence de détails (compteur d'exécutions, hash) en font une preuve moins puissante prise seule.

#### Points de réflexion (SS Contest)

Pour un SSer, `RecentFileCache.bcf` est un artefact rapide à checker qui peut apporter la preuve qui manquait.

- **Le hit qui confirme :** son rôle principal en screenshare est de soutenir les autres trouvailles. Si un exécutable suspect apparaît dans Prefetch et aussi dans `RecentFileCache.bcf`, la preuve devient difficile à contester.
- **Trouver ce qui manque :** si tu penses que le joueur a nettoyé Prefetch ou BAM, `RecentFileCache.bcf` peut encore contenir la trace. C'est la logique du "ne rien laisser de côté" quand on cherche des preuves d'exécution.
- **Vitesse et efficacité :** pendant un screenshare chronométré, le parser avec un outil comme `RecentFileCacheParser` d'Eric Zimmerman est très rapide et donne tout de suite un aperçu des programmes récents, ce qui aide à cibler les vérifications plus profondes.
