<!-- route: /advanced-explanation-of-artifacts/file-system-activity/usn-journal-usdusnjrnl -->
# Journal USN ($UsnJrnl)

Le journal USN (Update Sequence Number), aussi appelé Change Journal, est un composant à part entière de NTFS. C'est un journal chronologique performant qui note méticuleusement les changements de fichiers et de dossiers sur un volume. Son but système : offrir aux applications (services d'indexation, logiciels de sauvegarde, moteurs de réplication) un moyen rapide de suivre les modifications sans rescanner tout le disque.

Vue DFIR, le journal USN est un des artefacts les plus puissants. Il donne un historique horodaté détaillé de l'activité du système de fichiers, et révèle souvent des actions que les autres artefacts ratent, surtout les suppressions et les renommages.

### Emplacement et structure

Les données sont dans un fichier de métadonnées NTFS caché, inaccessible par les interfaces classiques.

- Emplacement : `C:\$Extend\$UsnJrnl`

Le journal lui-même est dans un flux alternatif (ADS) de ce fichier, nommé `$J`. C'est un journal d'enregistrements de longueur variable, chacun identifié par un USN 64 bits qui ne fait qu'augmenter.

Quand il atteint sa taille maximale, il fonctionne en circulaire : les nouveaux enregistrements écrasent les plus anciens. La période couverte dépend donc beaucoup de l'activité du disque et de la taille allouée.

### Métadonnées stockées

Chaque enregistrement du flux `$J` documente un changement précis :

- Horodatage : très précis, il donne le moment exact de l'événement.
- Nom du fichier ou du dossier concerné.
- File Reference Number (FRN) : un identifiant unique qui relie l'enregistrement à l'entrée MFT du fichier. Le FRN du parent est aussi noté, ce qui relie le fichier à son dossier.
- Code de raison : un masque de bits qui décrit le type de changement. C'est la clé pour lire le journal. Les codes courants :
  - `FILE_CREATE` : création d'un fichier ou dossier.
  - `FILE_DELETE` : suppression.
  - `RENAME_OLD_NAME` / `RENAME_NEW_NAME` : renommage, avec l'ancien et le nouveau nom.
  - `DATA_OVERWRITE` / `DATA_EXTEND` : modification du contenu.
  - `BASIC_INFO_CHANGE` : modification des attributs (lecture seule, caché) ou des horodatages `$SI`.
  - `STREAM_CHANGE` : ajout, suppression ou modification d'un flux alternatif.
  - `CLOSE` : fermeture du handle, souvent ajouté aux autres flags pour marquer la fin d'une opération.

### Valeur forensique

Le journal USN est indispensable pour reconstituer le cycle de vie d'un fichier et détecter l'anti-forensique.

- **Suivre la vie d'un fichier :** il donne la séquence chronologique définitive : création, renommage (ancien et nouveau nom), modification du contenu, changement d'attributs, suppression finale.
- **Preuve de suppression :** c'est souvent la meilleure, et parfois la seule, source pour prouver qu'un fichier a été supprimé et quand. Il garde les enregistrements jusqu'à ce que le journal tourne, bien après que l'entrée MFT a pu être réutilisée.
- **Détecter renommage et remplacement :** il journalise explicitement les renommages, ce qui est crucial pour le bypass de "remplacement de fichier", où un fichier malveillant est supprimé et remplacé par un fichier anodin du même nom. Le journal montre la séquence : `FILE_DELETE` du premier, puis `FILE_CREATE` et `RENAME_NEW_NAME` du second.
- **Débusquer la manipulation d'attributs :** le code `BASIC_INFO_CHANGE` est un fort indicateur de traficotage. Il se déclenche lors d'un timestomping (modification d'horodatages) ou quand on passe un artefact comme un Prefetch en lecture seule pour empêcher sa mise à jour.
- **Identifier la manipulation d'ADS :** les événements `STREAM_CHANGE` révèlent la création ou la modification de flux alternatifs cachés.

Il faut des outils dédiés comme `fsutil.exe`, JournalTrace ou `MFTECmd` d'Eric Zimmerman pour parser le flux binaire `$J` et interpréter ses enregistrements.

#### Points de réflexion (SS Contest)

Pour un SSer, le journal USN est l'outil ultime pour exposer les tentatives de masquage. Il transforme l'acte de cacher une preuve en preuve.

- **L'artefact anti-bypass :** c'est son rôle principal. Si un joueur supprime son dossier Prefetch, le journal contient un `FILE_DELETE` pour chaque `.pf`. S'il utilise la méthode du remplacement de fichier, le journal montre la séquence exacte de suppression et création.
- **Exposer la manipulation de Prefetch :** un `BASIC_INFO_CHANGE` récent sur un fichier Prefetch est une preuve flagrante. Ça montre que le joueur a touché aux attributs, probablement pour le passer en lecture seule afin de "figer" sa dernière date d'exécution et cacher l'usage récent d'un cheat.
- **Confirmer les suppressions :** si un fichier apparaît dans un artefact d'exécution (BAM, par exemple) mais n'est plus sur le disque, le journal apporte la preuve finale en montrant le `FILE_DELETE` de ce chemin exact, horodaté.
- **Détecter le nettoyage du journal :** effacer le journal lui-même (`fsutil usn deletejournal`) est une technique anti-forensique très suspecte, et Windows la journalise (Event ID 3079).
