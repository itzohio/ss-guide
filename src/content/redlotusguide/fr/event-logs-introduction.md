<!-- route: /screensharing-general-knowledge/fourth-section-common-windows-artifacts-and-their-basic-analysis/windows-event-logs-introduction -->
# Les journaux d'événements Windows : introduction

Les journaux d'événements sont des logs standardisés, tenus par Windows, les applications et les services, pour enregistrer les événements importants : erreurs, avertissements, infos. C'est un peu le journal intime du système, avec une chronologie précieuse pour diagnostiquer un problème, auditer la sécurité ou faire de l'analyse.

En screenshare, ils sont très utiles parce qu'ils peuvent prouver :

- Les connexions et déconnexions utilisateur (réussies ou ratées — journal Sécurité).
- Les démarrages et arrêts du système.
- Les plantages et blocages d'applications.
- Les actions liées à la sécurité, comme un changement de politique ou de compte (journal Sécurité).
- Le démarrage et l'arrêt de services (journal Système).
- Les tentatives de vider les journaux d'événements elles-mêmes, ce qui est très suspect et sent la dissimulation.
- Des traces de bypass précises, comme un changement d'heure système (journal Sécurité, ID 4616) ou une suppression du journal USN (journal Application, ID 3079).
- L'installation de logiciels ou de pilotes.

Savoir naviguer et interroger ces journaux est indispensable pour trouver des preuves invisibles ailleurs.

Les journaux sont stockés en fichiers, en général avec l'extension `.evtx`, dans `%SystemRoot%\System32\Winevt\Logs\` (donc `C:\Windows\System32\Winevt\Logs\`).
