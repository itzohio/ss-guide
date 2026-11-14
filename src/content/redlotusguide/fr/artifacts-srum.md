<!-- route: /advanced-explanation-of-artifacts/program-execution/system-resource-usage-monitor-srum -->
# System Resource Usage Monitor (SRUM)

## But et fonctionnement

Le System Resource Usage Monitor (SRUM) est une fonction de Windows (depuis Windows 8) qui fournit un historique détaillé de la consommation de ressources. Son but côté système : suivre quelles applications et quels services utilisent le CPU, le réseau et le disque, ce qui aide à la gestion d'énergie et à la compréhension du comportement des applications.

Pour les analystes DFIR, SRUM est souvent décrit comme une mine d'or. Il tient une base historique glissante (30 à 60 jours en général) de l'activité des processus et du réseau, ce qui en fait un artefact très robuste, qui garde souvent des preuves longtemps après que les traces plus volatiles ont été écrasées ou effacées.

### Emplacement et structure

Les données SRUM sont dans une base ESE (Extensible Storage Engine), le même format que celui utilisé par Exchange et Active Directory.

- Emplacement : `C:\Windows\System32\sru\SRUDB.dat`

`SRUDB.dat` est une base multi-tables complexe, en général verrouillée par le système quand Windows tourne. L'analyse demande des outils capables de parser de l'ESE.

### Métadonnées stockées

La base SRUM journalise beaucoup de métriques détaillées par application et service. Les plus intéressantes :

- **Historique d'exécution :** quels processus ont tourné, avec leur chemin complet et le contexte utilisateur (SID). Ça donne un historique plus long que Prefetch ou BAM.
- **Activité réseau :** c'est une fonction clé. SRUM surveille la connectivité application par application et note :
  - Octets envoyés et reçus : le volume total transféré, en filaire comme en Wi-Fi.
  - Interface réseau : l'adaptateur utilisé pour la connexion.
  - Horodatages de connexion : quand l'application a été connectée.
- **Consommation de ressources :** temps CPU (premier plan et arrière-plan distingués), I/O disque (lectures et écritures), et d'autres compteurs de performance par application.
- **Uptime et focus :** via des tables comme `AppTimelineProvider`, SRUM peut suivre combien de temps une application est restée au premier plan, ce qui donne du contexte sur l'interaction utilisateur.

### Valeur forensique

La profondeur historique et l'étendue des données SRUM en font un outil exceptionnel.

- **Historique long :** sa rétention de 30 à 60 jours permet de prouver une activité bien antérieure à l'enquête, souvent après plusieurs redémarrages et tentatives de nettoyage.
- **Détecter les malwares réseau :** la surveillance réseau est inestimable pour identifier des applications non autorisées qui communiquent. Elle peut prouver qu'un processus précis (un loader de cheat) s'est connecté à Internet, ce qu'on recoupe avec du téléchargement ou du C2.
- **Résistance à la manipulation :** `SRUDB.dat` peut être supprimé, mais son absence est un indicateur très suspect d'anti-forensique. Effacer toute la base SRUM est bien plus radical et visible que nettoyer quelques Prefetch ou clés de registre.
- **Relier utilisateur et système :** en combinant exécution, SID et horodatages, SRUM aide à attribuer les activités à un utilisateur précis et à construire une timeline complète.

Vu sa complexité, les outils en ligne de commande comme `SrumECmd` d'Eric Zimmerman sont la référence pour parser la base et exporter les tables en CSV lisible.
