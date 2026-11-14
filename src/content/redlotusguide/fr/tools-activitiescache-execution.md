<!-- route: /screenshare-tools/spoks-tools/activitiescache-execution -->
# ActivitiesCache execution

Description : parse la base de l'Activities Cache de Windows (`ActivitiesCache.db`) pour récupérer l'historique d'activité de l'utilisateur, avec vérification de signature et détections génériques.

Fonctions :

- Parse les fichiers exécutés (et d'autres activités) depuis `ActivitiesCache.db` avec sqlite3.
- Vérifie les signatures numériques des exécutables identifiés.
- Applique plusieurs règles YARA génériques pour signaler les fichiers suspects selon des caractéristiques de cheats.
- Peut tourner en mode normal (résultats dans un `.txt`) ou en mode CLI (interface en ligne de commande avec options de sortie).

Usage : aide à passer en revue l'activité récente, dont l'usage d'applications et les interactions fichiers journalisées par la Timeline Windows. Ça donne une couche de preuve d'exécution supplémentaire quand la fonction est activée et alimentée.

Lien : `https://github.com/spokwn/ActivitiesCache-execution`
