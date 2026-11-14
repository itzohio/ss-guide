<!-- route: /advanced-explanation-of-artifacts/system-configuration-and-persistence -->
# Configuration système et persistance

Un adversaire ou un tricheur sérieux ne vise pas une seule exécution réussie. Il cherche à s'installer durablement : ses outils doivent se lancer automatiquement, survivre aux redémarrages et tourner avec un minimum d'interaction. Ce chapitre traite des artefacts qui montrent comment un système est configuré et quels mécanismes de persistance sont en place.

Les analyser permet de dépasser le suivi d'événements isolés pour révéler des activités longues, automatisées ou cachées. On va voir les bases de configuration de Windows et les journaux des événements système fondamentaux. C'est là qu'on répond à : quels programmes se lancent au démarrage ? Des services critiques ont-ils été trafiqués ? Un cheat a-t-il été lancé depuis une clé USB aujourd'hui débranchée ?

Au programme :

- Le registre Windows : le système nerveux de l'OS, qui stocke la configuration mais aussi des emplacements de persistance critiques comme les clés `Run` et `RunOnce`.
- Les artefacts du Planificateur de tâches : les fichiers et clés qui définissent les tâches planifiées, un mécanisme puissant et souvent détourné pour automatiser l'exécution de scripts et de loaders.
- L'historique des périphériques USB : la trace laissée quand un stockage externe est connecté, essentielle pour les cheats stockés et lancés depuis un support amovible.
- Les journaux d'événements Windows : les journaux horodatés de l'OS. C'est la source ultime pour détecter une manipulation système, comme la modification d'un service, l'effacement de preuves ou une activité de compte suspecte.

Maîtriser ces artefacts est essentiel pour détecter les cheats les plus discrets, ceux qui se fondent dans le démarrage et le fonctionnement normal de Windows. Ils prouvent non seulement une action ponctuelle, mais une stratégie de dissimulation délibérée et durable.
