<!-- route: /advanced-explanation-of-artifacts/file-system-activity -->
# Activité du système de fichiers

Prouver qu'un programme a tourné ne suffit pas : une enquête forensique complète doit répondre à une deuxième question de base : quelle est l'histoire des fichiers concernés ? Ce chapitre passe des artefacts d'exécution aux traces laissées dans le système de fichiers lui-même. Ces artefacts révèlent tout le cycle de vie d'un fichier, de sa création à sa suppression, et c'est la clé pour débusquer les tentatives de cacher, modifier ou détruire des preuves.

On va voir les composants centraux du système NTFS, qui est son propre archiviste méticuleux. Des artefacts comme la Master File Table (`$MFT`), le journal USN (`$UsnJrnl`) et le `$LogFile` donnent une vue bas niveau de chaque transaction sur un disque. C'est la source de vérité ultime pour les événements du système de fichiers, et c'est très résistant à la manipulation.

Au programme :

- Les bases de NTFS, comme la `$MFT`, qui catalogue chaque fichier, et les attributs d'index (`$INDX`), qui organisent le contenu des dossiers.
- Les journaux chronologiques, comme le journal USN, qui suivent chaque changement et prouvent de façon définitive les créations, suppressions et renommages.
- Les journaux spécialisés comme le `$LogFile`, qui peut révéler des techniques anti-forensiques avancées comme le timestomping.
- Les fonctions système qui conservent l'historique, dont la Corbeille pour les suppressions classiques et les clichés instantanés de volume (VSS), véritables capsules temporelles du système de fichiers.
- Les structures cachées comme les Alternate Data Streams (ADS), qu'on peut détourner pour cacher une charge dans un fichier anodin.

Maîtriser ces artefacts, c'est ce qui fait passer un screenshare de la simple recherche de fichiers suspects à un vrai examen forensique. C'est là que les contournements les plus sophistiqués (remplacement de fichier, timestomping, effacement de preuves) sont mis au jour.
