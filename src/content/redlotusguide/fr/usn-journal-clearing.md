<!-- route: /screensharing-general-knowledge/eighth-section-common-bypass-techniques-in-screensharing/artifact-clearing-techniques/usn-journal-clearing -->
# Supprimer le journal USN

- **Description :** supprimer complètement le journal USN de NTFS (le flux `$J` dans `$Extend\$UsnJrnl`) d'un volume.
- **Mécanisme :** en général avec `fsutil.exe` en admin : `fsutil usn deletejournal /D C:` (remplacer `C:` par le disque visé). La commande efface tout le journal existant et Windows en recrée un vide au prochain changement sur le système de fichiers.
- **Pourquoi les tricheurs font ça :** effacer tout l'historique des créations, suppressions, renommages, changements d'attributs et modifications de flux d'un volume. Ça aveugle les analyses qui reposent sur le journal (détection du nettoyage de Prefetch, remplacement de fichiers, timestomping via `BASIC_INFO_CHANGE`, manipulation d'ADS…).
- **Détection :** c'est une action radicale, qui laisse des traces nettes :
  - Journaux d'événements : supprimer le journal USN déclenche systématiquement l'ID 3079 dans le journal Application. Le détail indique en général le volume concerné et mentionne souvent `fsutil.exe` comme processus source. Cet événement, c'est la preuve d'une suppression volontaire.
  - Analyse des métadonnées du journal : examiner `$J` et `$MAX` dans `$Extend\$UsnJrnl` avec FTK Imager ou MFTECmd révèle le nettoyage :
    - Dates de modification : les deux flux ont une date très récente, celle de la commande `deletejournal`. Comparer les deux est important : une modification récente des deux confirme l'effacement.
    - Plus vieille entrée : JournalTrace affiche la date de l'entrée la plus ancienne encore présente. Si elle est postérieure à la connexion de l'utilisateur ou au lancement du jeu, c'est que le journal a été vidé pendant la session en cours.
    - Taille : un journal recréé (`$J`) est tout petit comparé à un journal qui accumule depuis longtemps.
