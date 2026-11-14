<!-- route: /screensharing-general-knowledge/seventh-section-manual-ss-techniques/windows-prefetch-analysis/information-stored-in-prefetch-files -->
# Ce que contiennent les fichiers Prefetch

Chaque `.pf` est une mine de métadonnées utiles sur l'exécution qu'il représente :

- **Nom de l'exécutable :** le nom du programme lancé.
- **Run Count :** combien de fois l'application a tourné depuis ce chemin.
- **Date de dernière exécution :** la date et l'heure précises du dernier lancement depuis ce chemin. C'est l'indicateur principal. (Rappel : la date de modification du `.pf` correspond à cette dernière exécution.)
- **Dates des exécutions précédentes :** jusqu'à 8 horodatages des lancements précédents, ce qui donne un historique récent.
- **Infos du volume :** le volume où se trouvait l'exe lors de son dernier lancement, avec le nom (`C:`), le numéro de série et la date de création du volume.
- **Métriques du fichier :** la taille de l'exe d'origine.
- **Dossiers référencés :** la liste des dossiers accédés au démarrage, en gros les 10 premières secondes.
- **Fichiers référencés (index / ressources chargées) :** la liste des fichiers précis (DLL, configs, données) chargés ou lus à ce moment-là. C'est ce qui permet de relier `java.exe` à un `.jar` précis, ou `rundll32.exe` à une `.dll` précise.
- **Hash du chemin :** le hash de 8 caractères qui identifie le chemin d'exécution.
