<!-- route: /advanced-explanation-of-artifacts/program-execution -->
# Exécution de programme

Ce chapitre couvre la catégorie d'artefacts la plus importante pour n'importe quel screenshare : l'exécution de programme. C'est ce qui apporte la preuve concrète de la question de base : est-ce qu'un programme non autorisé a été lancé sur cette machine ? On va voir plusieurs artefacts, des journaux très précis comme Prefetch et BAM aux bases historiques comme Amcache et SRUM.

Un concept clé pour lire ces preuves, c'est la précision temporelle : le niveau de détail qu'un artefact donne sur le moment d'un événement. Certains sont très précis, à la minute et à la seconde près. C'est le cas de Prefetch, qui garde les huit dernières exécutions, et de BAM/DAM, qui note l'horodatage de la dernière interaction avec un exécutable. Ce sont les sources principales pour établir une activité récente.

D'autres artefacts prouvent l'exécution mais avec moins de granularité. Amcache/Syscache, RecentFileCache, UserAssist et SRUM ne montrent pas toujours la dernière exécution, mais apportent autre chose :

- **Preuve historique :** ils confirment qu'un programme a tourné à un moment donné, même si les traces plus volatiles ont été effacées.
- **Identification par hash :** Amcache est très fort pour ça, il stocke le SHA1 de l'exécutable, ce qui permet de l'identifier même si le fichier a été renommé.
- **Contexte utilisateur et système :** UserAssist relie une exécution à un profil utilisateur précis, et SRUM donne des infos sur le réseau et les ressources consommées, ce qui aide à attribuer l'activité et à comprendre son impact.
- **Persistance longue :** SRUM et Activities Cache gardent les données d'exécution des semaines ou des mois, souvent en survivant aux nettoyages qui visent les artefacts plus courants.

Comprendre les forces et les limites de chaque artefact est essentiel.
