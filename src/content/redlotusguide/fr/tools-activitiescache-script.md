<!-- route: /screenshare-tools/spoks-tools/activitiescache-script -->
# Script ActivitiesCache

Description : un script PowerShell qui automatise le parsing de la base Activities Cache de Windows. Il télécharge un exécutable de parsing dédié (`ActivitiesCacheParser.exe`, depuis le GitHub de Spokwn) pour faire l'analyse.

Prérequis : doit tourner avec les droits administrateur.

Fonctions :

- Télécharge `ActivitiesCacheParser.exe` dans le dossier temporaire.
- Lance le parseur pour extraire les données dans un `activities.txt` temporaire.
- Récupère l'heure de la plus ancienne ouverture de session (interactives, types 2 ou 10) pour servir de filtre.
- Parse le fichier de sortie en gardant les activités postérieures à cette ouverture de session.
- Pour chaque activité pertinente, il extrait et met en forme :
  - Le chemin et le nom de l'application.
  - Le statut de signature numérique.
  - Les génériques détectés par le parseur (avec des marqueurs comme [GenericName]).
  - Les heures de début et de fin de l'activité.
- Affiche les résultats formatés directement dans la console PowerShell.
- Nettoie à la fin en supprimant le parseur téléchargé et le fichier temporaire.

Astuce d'usage : pratique pour passer en revue rapidement l'activité applicative récente journalisée dans l'Activities Cache, filtrée sur la session utilisateur en cours.
