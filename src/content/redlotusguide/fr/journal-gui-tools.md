<!-- route: /screensharing-general-knowledge/seventh-section-manual-ss-techniques/journal-analysis/gui-parsing-tools -->
# Les outils de lecture du journal

Lire le flux `$J` brut à la main n'est pas réaliste. Il faut des outils pour le parser en texte lisible.

- **En ligne de commande (`fsutil.exe`) :** Windows fournit `fsutil.exe`, qui interroge directement le journal USN.
  - Commande de base : `fsutil usn readjournal C: csv` (remplacer `C:` par le disque visé). L'argument `csv` sort les données en CSV, pratique pour rediriger.
  - Filtrage avec `findstr` : on envoie souvent la sortie (`|`) dans `findstr.exe` pour filtrer. Les options utiles :
    - `/i` : insensible à la casse.
    - `/C:"texte"` : cherche une chaîne littérale. Plusieurs `/C` fonctionnent comme un OU.
    - `/R` : interprète la chaîne comme une expression régulière.
  - Redirection : `> output.txt` pour enregistrer le résultat.
  - Exemple : filtrer les codes de raison FileDelete, RenameOld et RenameNew pour ne garder que les lignes finissant par `.exe"` ou `.pf"`.
- À noter : il faut les droits admin, et écrire une bonne commande `fsutil` demande de connaître les codes de raison et la syntaxe de `findstr`.

- **Les outils graphiques :** plusieurs interfaces rendent l'analyse plus simple.
  - **JournalTrace (Ponei/Spokwn) :**
    - Fonction : outil graphique gratuit dédié au parsing et à l'affichage des entrées USN. Demande les droits admin. La version de Spokwn ajoute des filtres avancés.
    - Déroulé : lancer, choisir le disque, scanner, passer en affichage "Data Grid", puis trier/filtrer par colonne.
    - Points forts : les codes de raison sont clairs, le filtrage par colonne est simple (nom, raison, chemin), la date de la "plus vieille entrée" s'affiche (pratique pour repérer un nettoyage récent), et la résolution des IDs de fichiers est souvent meilleure que dans les outils basiques. Les filtres avancés de Spokwn gèrent AND (`&&`), OR (`||`), NOT (`!!`) et le filtrage multi-colonnes.
  - **Echo Easy Journal Viewer (Echo) :**
    - Fonction : autre outil graphique gratuit de l'équipe Echo, pensé pour la simplicité.
    - Interface : des boutons prêts à l'emploi pour les filtres courants ("Deleted", "Created", "Renamed"), tri par colonne (date, nom…) et filtrage simple. Il lit tous les disques NTFS d'un coup.
    - Usage : bien pour débuter ou pour vérifier vite des suppressions et renommages.
