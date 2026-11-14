<!-- route: /screensharing-general-knowledge/fourth-section-common-windows-artifacts-and-their-basic-analysis/execution-traces-and-recent-activity/recycle-bin -->
# La corbeille (C:\$Recycle.bin)

- **Rôle :** la corbeille garde temporairement les fichiers et dossiers supprimés normalement (touche Suppr, clic droit > Supprimer). Ça permet de récupérer un fichier effacé par erreur. Un `Shift+Suppr` passe complètement à côté.
- **Emplacement :** chaque volume NTFS a son propre dossier système caché et protégé, `$Recycle.bin`, à la racine du disque (`C:\$Recycle.bin`, `D:\$Recycle.bin`…).
- **Pour y accéder :** il faut d'abord, dans les options de l'Explorateur :
  - activer "Afficher les fichiers, dossiers et lecteurs cachés" ;
  - décocher "Masquer les fichiers protégés du système d'exploitation (recommandé)".
- **Analyse :** tout se joue dans la structure interne et les métadonnées. Dans `$Recycle.bin`, il y a des sous-dossiers nommés d'après le SID des utilisateurs qui ont supprimé des fichiers. Dans le dossier d'un utilisateur, chaque élément supprimé est représenté par deux fichiers cachés :
  - `$I{ID_unique}.{extension_dorigine}` : le fichier de métadonnées. Il contient le chemin complet d'origine et, surtout, l'horodatage exact de la suppression. La date de modification/création de ce `$I...` correspond à l'heure de suppression.
  - `$R{ID_unique}.{extension_dorigine}` : le contenu réel de l'élément supprimé.
  - Les dates de suppression des `$I...` sont donc importantes. Des fichiers liés à un cheat supprimés juste avant ou pendant un screenshare, c'est un gros signal.
  - Regarder aussi la date de modification du dossier `$Recycle.bin` lui-même (ou du sous-dossier du SID) : ça donne la dernière interaction avec la corbeille sur ce volume (suppression, restauration, vidage). Une modification très récente mérite un coup d'œil.
- **Bypass et limites :**
  - Shift+Suppr : le fichier est supprimé définitivement, sans passer par la corbeille. Mais la suppression est souvent quand même loggée ailleurs, comme dans le journal USN (`$UsnJrnl`).
  - FAT32/exFAT : ces systèmes n'ont pas la structure `$Recycle.bin` classique. Le comportement à la suppression est différent et les méthodes d'analyse de la corbeille ne s'appliquent pas. Sur ces systèmes, les outils de récupération de fichiers (comme Recuva) deviennent plus utiles.
