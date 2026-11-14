<!-- route: /advanced-explanation-of-artifacts/file-system-activity/index-attributes-usdindx-usdi30 -->
# Attributs d'index ($INDX / $i30)

Dans NTFS, le contenu d'un dossier n'est pas stocké comme une simple liste. Il est organisé dans une structure en arbre B sophistiquée pour permettre le tri et les recherches rapides. Cette structure est stockée dans des attributs spéciaux de l'enregistrement MFT du dossier, appelés attributs d'index.

L'attribut d'index principal, identifié par son type `$I30` dans les outils forensiques, sert en gros de table des matières du dossier. Il contient une entrée pour chaque fichier et sous-dossier.

Vue DFIR, les `$I30` sont précieux parce que, comme la MFT, ils ne purgent pas tout de suite les infos sur les éléments supprimés. Leur structure interne et leur slack space gardent des métadonnées longtemps après l'écrasement des enregistrements MFT d'origine.

### Emplacement et structure

Les infos d'index d'un dossier sont dans son propre enregistrement MFT. La structure dépend de la taille du dossier :

- `$INDEX_ROOT` : pour les petits dossiers, toutes les entrées sont dans cet attribut, dans l'enregistrement MFT. Il sert aussi de nœud racine de l'arbre B pour les gros dossiers.
- `$INDEX_ALLOCATION` : pour les dossiers trop gros pour tenir dans le `$INDEX_ROOT`, l'arbre s'étend sur des clusters externes, suivis par cet attribut.

Chaque entrée de l'index `$I30` contient un sous-ensemble de métadonnées copiées depuis l'attribut `$FILE_NAME` ($FN) du fichier dans son enregistrement MFT.

### Métadonnées stockées

Une entrée d'index `$I30` stocke en général :

- Nom du fichier ou du sous-dossier.
- File Reference Number MFT : un pointeur vers l'enregistrement MFT du fichier.
- Taille du fichier.
- Horodatages MACB : un jeu qui reflète ceux de l'attribut `$FILE_NAME` du fichier.

Quand un fichier est supprimé, son entrée dans l'index `$I30` du dossier parent est marquée inactive mais pas effacée tout de suite. Elle reste dans l'arbre jusqu'à ce que l'espace soit nécessaire, et même là, des restes peuvent persister dans le slack space du buffer d'index.

### Valeur forensique

Analyser les `$I30`, surtout les entrées inactives et le slack space, permet de retrouver des preuves qui ne sont plus dans la MFT.

- **Récupérer les métadonnées de fichiers supprimés :** c'est la valeur principale. En "carvant" les structures `$I30`, les outils extraient les entrées inactives : nom, taille, attributs et horodatages `$FN` de fichiers dont l'enregistrement MFT a été complètement écrasé et réutilisé. Ça prouve de façon définitive qu'un fichier de ce nom a existé dans ce dossier.
- **Corroborer les timelines :** les horodatages des entrées `$I30` sont une autre source temporelle, qui reflète les `$FN`. Ça sert à confirmer ou construire la chronologie de l'activité dans le contexte du dossier parent.
- **Repérer les renommages :** le `$UsnJrnl` reste la source principale, mais la séquence d'entrées actives et inactives d'un index peut donner des indices sur des renommages récents.
- **Contourner la manipulation de MFT :** dans un scénario où un attaquant aurait modifié un enregistrement MFT sans déclencher d'autres logs, l'entrée `$I30` correspondante dans le dossier parent peut encore contenir les métadonnées d'origine, intactes.

Il faut des outils dédiés : `INDXRipper` en ligne de commande, ou des suites comme EnCase et X-Ways Forensics, qui savent parser ces arbres B et extraire aussi bien les entrées actives qu'inactives.

#### Points de réflexion (SS Contest)

Pour un SSer, l'analyse `$I30` est une technique avancée, mais comprendre son potentiel est essentiel quand les autres artefacts échouent et qu'on suspecte un nettoyage de preuves.

- **Le dernier recours pour les fichiers supprimés :** imagine un joueur qui supprime un cheat, vide la corbeille, puis crée assez de fichiers pour écraser l'enregistrement MFT du cheat. Le `$UsnJrnl` a peut-être tourné et VSS est peut-être désactivé. Dans ce pire scénario, parser l'index `$I30` du dossier où se trouvait le cheat (le Bureau, par exemple) peut être le seul moyen de retrouver le nom du fichier et de prouver qu'il a existé là.
- **Prouver l'existence :** l'usage le plus fort en SS est simple : prouver qu'un fichier nommé `Vape.exe` a existé sur le Bureau du joueur à un moment donné. Même sans horodatage précis, ça peut suffire à contredire le joueur et à justifier un ban selon les règles du serveur.
- **L'outil des bypasseurs pros :** cette technique est surtout efficace contre les joueurs qui savent déjouer les artefacts forensiques classiques. Elle montre un niveau d'investigation plus profond, capable d'attraper même les tentatives sophistiquées de destruction de données.
