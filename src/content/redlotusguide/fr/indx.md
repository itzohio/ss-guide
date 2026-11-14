<!-- route: /screensharing-general-knowledge/ninth-section-more-artifact-analysis-for-screensharing/indx-analysis -->
# Analyse de $INDX (attributs d'index $i30)

Dans NTFS, le contenu des dossiers est organisé avec des attributs d'index : `$INDEX_ROOT` (petits dossiers) et `$INDEX_ALLOCATION` (gros dossiers). La structure d'index la plus courante, souvent appelée `$i30` par les outils (d'après son identifiant de type), sert en gros de liste du dossier, avec une entrée de métadonnées pour chaque fichier et sous-dossier. Chaque entrée de l'index `$i30` reprend les infos de l'attribut `$FILE_NAME` du `$MFT` : nom, numéro de référence MFT, attributs, taille et un jeu de dates MACB qui reflète les dates `$FN`.

Pour l'analyse, lire ces attributs `$i30`, surtout l'espace résiduel et les entrées inactives, donne des preuves qu'on ne trouve pas ailleurs :

- **Récupérer les métadonnées de fichiers supprimés :** à la suppression, l'entrée dans l'index `$i30` du dossier parent est marquée inactive mais souvent pas écrasée tout de suite. Les outils peuvent parser l'arbre B de l'index et son espace résiduel (les parties inutilisées des blocs alloués) pour récupérer ces entrées. Ça permet de retrouver le nom, la taille, les attributs et les dates `$FN` de fichiers dont l'enregistrement `$MFT` a été écrasé ou est inaccessible, et donc de prouver qu'un fichier portant ce nom a existé dans ce dossier.
- **Reconstruire une timeline :** les dates des entrées `$i30` reflètent celles du `$FN`, ce qui donne une source de plus pour dater l'activité dans un dossier précis.
- **Recouper :** les résultats de `$i30` confirment ceux du `$MFT` et du `$UsnJrnl` sur l'existence, le nom et le timing d'un fichier à un endroit donné.

Il faut en général des outils dédiés. INDXRipper (de Harel Segev) est fait pour parser les attributs d'index NTFS, espace résiduel compris, et récupérer les métadonnées des fichiers et dossiers actifs comme supprimés. Une commande comme `INDXRipper.exe //./C: --deleted-dirs output.csv` extrait les entrées supprimées du disque C: dans un CSV à analyser dans Timeline Explorer. Les suites forensic avancées ont aussi souvent des modules pour ces attributs.
