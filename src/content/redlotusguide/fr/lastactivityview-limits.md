<!-- route: /screensharing-general-knowledge/seventh-section-manual-ss-techniques/lastactivityview-artifact-aggregation/limitations-and-considerations -->
# Limites et points d'attention

- **Dépendance à la source :** le résultat dépend entièrement de la présence et de l'intégrité des artefacts interrogés. Si Prefetch est désactivé, que les clés de registre ont été nettoyées (CCleaner ou `reg.exe`) ou que les journaux sont vidés, LastActivityView n'affichera rien pour cette activité. Il ne fait pas de magie : il agrège ce qui existe.
- **Origine des dates :** les horodatages viennent directement de la source. Ça peut être l'heure d'exécution (Prefetch), l'heure d'accès (MRU Ouvrir/Enregistrer) ou l'heure de l'événement (logs). Bien regarder la colonne de source, sinon on interprète mal.
- **Pas exhaustif :** il couvre beaucoup d'artefacts courants, mais pas tous. Des traces avancées demandent encore une vérification manuelle ou des outils spécialisés.
- **Rapport aux vérifications manuelles :** pour des détections précises, comme des chemins de DLL dans OpenSavePidlMRU, LastActivityView n'est qu'une interface pratique sur des données qu'on pourrait trouver en fouillant `regedit`. Sa force, c'est d'agréger ça avec Prefetch pour une vue d'ensemble rapide.
