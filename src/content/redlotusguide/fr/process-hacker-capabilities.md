<!-- route: /screensharing-general-knowledge/seventh-section-manual-ss-techniques/process-hacker-system-informer-introduction-and-configuration/key-capabilities-for-screensharing -->
# Les capacités clés pour le screenshare

- **Visualisation détaillée des processus :** une liste complète des processus, services, pilotes et connexions réseau en cours, qui montre souvent des choses que le Gestionnaire des tâches de Windows cache.
- **Inspection mémoire et recherche de chaînes :** on peut examiner l'espace mémoire virtuelle d'un processus et chercher dedans du texte (mots-clés ou expressions régulières) ou des motifs binaires. C'est la fonction principale pour trouver des identifiants de cheat, des chemins de modules ou des commandes suspectes.
- **Modules chargés (DLL) :** la liste des DLL chargées par un processus, indispensable pour repérer un cheat injecté ou une bibliothèque louche.
- **Surveillance réseau :** les connexions établies par chaque processus en temps réel, avec les IP et ports distants. Utile pour certains cheats ou pour des communications C2.
- **Services et handles :** inspection des services, de leurs processus (`svchost.exe`) et des handles ouverts (fichiers, clés de registre).
- **Kernel Live Dumps :** (avancé) création de dumps de la mémoire du noyau pour une analyse hors ligne.
