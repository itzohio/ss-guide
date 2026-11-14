<!-- route: /advanced-explanation-of-artifacts/file-system-activity/usdlogfile -->
# $LogFile

Le `$LogFile` est un composant critique de l'auto-réparation et du journal transactionnel de NTFS. Sa fonction : garantir l'intégrité du système de fichiers en servant de journal transactionnel pour toutes les opérations qui modifient la structure et les métadonnées du volume. Avant qu'un changement soit écrit définitivement dans les structures NTFS (comme la MFT), l'opération est d'abord notée dans le `$LogFile`.

Ce mécanisme permet une récupération rapide après un crash. En cas de plantage ou d'arrêt brutal, Windows peut "rejouer" les transactions du `$LogFile` pour terminer les opérations inachevées, ou les annuler, ce qui remet le système de fichiers dans un état cohérent sans scan complet du disque.

Vue DFIR, le `$LogFile` offre un enregistrement très granulaire, mais souvent de courte durée, des modifications de métadonnées. C'est une vue bas niveau des changements du système de fichiers.

### Emplacement et structure

Comme la `$MFT` et le `$UsnJrnl`, c'est un fichier de métadonnées NTFS caché, à la racine du volume.

- Emplacement : `C:\$LogFile`

Il fonctionne en journal circulaire : une fois sa taille atteinte, les nouvelles entrées écrasent les plus anciennes. Sur un système actif, la fenêtre de données peut être très courte, parfois quelques minutes ou quelques heures.

Sa structure interne est complexe et mal documentée, faite d'enregistrements qui décrivent des opérations "redo" (comment réappliquer un changement) et "undo" (comment l'annuler).

### Métadonnées stockées

Le `$LogFile` est très spécialisé et ne traite que les métadonnées, pas le contenu des fichiers. Il journalise :

- **Modifications d'enregistrements MFT :** tout changement dans un enregistrement, y compris les attributs.
- **Mises à jour d'horodatages :** les transactions qui modifient les MACB dans `$STANDARD_INFORMATION` ($SI) et `$FILE_NAME` ($FN).
- **Manipulation d'attributs :** changements des flags lecture seule, caché, système.
- **Mises à jour d'index :** modifications des index de dossiers (attributs `$INDX`).
- **Création et suppression :** les opérations de métadonnées liées à la création et à la suppression de fichiers et dossiers.

### Valeur forensique

Malgré sa volatilité et la difficulté à le parser, le `$LogFile` apporte des preuves uniques, surtout contre les techniques anti-forensiques poussées.

- **Preuve définitive de timestomping :** son usage le plus célèbre. Comme la modification d'un horodatage est une transaction, le `$LogFile` peut contenir des enregistrements qui montrent à la fois l'horodatage d'origine et le faux, dans la même entrée. C'est une preuve irréfutable, difficile à trouver ailleurs.
- **Reconstitution fine :** il enregistre au niveau le plus bas, plus fin que le `$UsnJrnl`. Il peut révéler la séquence précise d'opérations rapides (création, renommage, suppression) qui apparaissent comme un seul événement dans d'autres journaux.
- **Récupérer des métadonnées éphémères :** comme il journalise les changements prévus, il peut conserver l'état d'un fichier (nom, attributs) qui n'a existé que très brièvement.

L'analyse du `$LogFile` est considérée comme avancée. Elle demande des outils comme `LogFileParser` en ligne de commande, ou des modules spécialisés de suites forensiques (Magnet Forensics, Exterro). Son format binaire complexe rend l'analyse manuelle quasi impossible.

#### Points de réflexion (SS Contest)

Pour un SSer, analyser le `$LogFile` dépasse en général le cadre d'un check standard à cause de sa complexité. Mais comprendre son rôle est utile, et un parser automatisé peut donner la solution miracle dans certains cas précis.
