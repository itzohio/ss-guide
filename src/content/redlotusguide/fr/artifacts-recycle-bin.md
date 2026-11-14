<!-- route: /advanced-explanation-of-artifacts/file-system-activity/recycle-bin-usdrecycle.bin -->
# Corbeille ($Recycle.bin)

### But et fonctionnement

La Corbeille Windows est un dossier système spécial qui sert de zone d'attente pour les fichiers et dossiers supprimés par un utilisateur de façon classique (touche `Suppr` ou menu contextuel). Son but : jouer le filet de sécurité, en gardant les éléments supprimés indéfiniment, jusqu'à ce que l'utilisateur vide la corbeille ou restaure les fichiers à leur emplacement d'origine.

Point important : un fichier envoyé à la corbeille n'est pas dans un état temporaire avec une date d'expiration. Il y reste jusqu'à une action explicite. Les fichiers supprimés avec `Maj + Suppr`, ou effacés par certains programmes, contournent complètement la corbeille.

Vue DFIR, la corbeille est un artefact crucial. Elle note méticuleusement les métadonnées de chaque élément envoyé, ce qui prouve ce qui a été supprimé et quand.

### Emplacement et structure

Chaque volume NTFS a son propre dossier système caché et protégé, nommé `$Recycle.bin`, à la racine du disque (`C:\$Recycle.bin`). Pour le voir, il faut activer l'affichage des fichiers cachés et des fichiers système protégés dans les options de l'Explorateur.

Dans `$Recycle.bin`, il y a des sous-dossiers nommés d'après le SID de chaque utilisateur ayant supprimé des fichiers sur ce volume. Cette structure garantit que chaque élément supprimé est attribuable à un compte précis.

Dans le dossier SID d'un utilisateur, chaque élément supprimé est représenté par deux fichiers :

- `$I{ID_unique}.{extension_origine}` : le fichier de métadonnées. Petit mais très riche :
  - Le chemin complet d'origine de l'élément supprimé.
  - Sa taille d'origine en octets.
  - Un horodatage `FILETIME` très précis indiquant le moment exact où l'élément a été mis à la corbeille.
- `$R{ID_unique}.{extension_origine}` : le fichier de contenu. Il contient les données réelles de l'élément, avec son extension d'origine et un préfixe `$R`.

Quand l'utilisateur vide la corbeille, les fichiers `$I` et `$R` associés sont supprimés définitivement du système de fichiers.

### Métadonnées stockées

L'essentiel de la valeur est dans le fichier `$I`. Un parser forensique en extrait :

- Nom et chemin d'origine : ce que le fichier s'appelait et où il était avant la suppression.
- Horodatage de suppression : la preuve la plus importante. La date de création du fichier `$I...` correspond directement au moment où le fichier a été mis à la corbeille.
- Taille du fichier d'origine.
- Attribution utilisateur : la structure par SID relie directement la suppression à un compte précis.

### Valeur forensique

La corbeille est une source inestimable pour récupérer des preuves jetées et comprendre les tentatives de masquage.

- **Récupérer les preuves jetées :** on peut souvent récupérer le contenu complet des fichiers supprimés via les `$R...`, donc accéder directement à ce que l'utilisateur croyait avoir fait disparaître.
- **Établir une timeline de suppression :** les horodatages des `$I...` sont essentiels pour une timeline précise. Des fichiers suspects supprimés juste avant une enquête, c'est un gros signal.
- **Prouver l'existence et l'emplacement passés :** le chemin d'origine prouve qu'un fichier existait à un endroit précis, ce qui confirme les artefacts d'exécution qui pointent vers un fichier aujourd'hui absent.
- **Détecter un nettoyage :** la date de modification du dossier `$Recycle.bin` parent (ou du sous-dossier SID) est mise à jour à chaque interaction, y compris quand on vide la corbeille. Une modification très récente est un fort indicateur de nettoyage.

À noter : les disques en FAT32 ou exFAT (fréquents sur les clés USB) n'ont pas cette structure `$Recycle.bin`.

#### Points de réflexion (SS Contest)

Pour un SSer, la corbeille est le premier endroit à vérifier quand on cherche ce qu'un joueur a jeté juste avant le check.

- **Trouver le nettoyage d'avant SS :** un joueur suspecté supprime souvent ses cheats de façon classique juste avant d'être "freeze". La corbeille est le premier endroit où atterrit cette preuve. Un cheat avec un horodatage de suppression quelques instants avant le début du SS est une preuve d'une tentative de le cacher.
- **Récupérer la preuve ultime :** le SSer peut souvent récupérer l'exécutable complet depuis le fichier `$R...`, ce qui permet de l'analyser tout de suite (hash, strings, VirusTotal) et transforme un fichier supprimé en preuve concrète.
- **Confirmer l'effacement de preuves :** même si le joueur a vidé la corbeille, on peut regarder la date de modification de `C:\$Recycle.bin`. Une date très récente indique fortement qu'il vient de vider la corbeille pour détruire des preuves — un acte très suspect en soi.
- **Attribution directe :** la structure par SID rend l'attribution simple, ce qui empêche le joueur de nier ou de blâmer un autre utilisateur ou un processus système.
