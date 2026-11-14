<!-- route: /advanced-explanation-of-artifacts/user-activity-and-knowledge/shellbags -->
# Shellbags

### But et fonctionnement

Les shellbags sont des clés de registre qui suivent l'historique de navigation d'un utilisateur dans ses dossiers. Leur fonction côté Windows : mémoriser les préférences d'affichage par dossier (taille des icônes, mode "Détails" ou "Liste", largeur des colonnes, position de la fenêtre). Quand on rouvre un dossier, Windows restaure son état précédent grâce aux shellbags.

Vue DFIR, ça crée un enregistrement méticuleux et persistant de chaque dossier ouvert dans l'Explorateur. Les shellbags peuvent prouver qu'un utilisateur a navigué dans un dossier précis, même si ce dossier et son contenu ont été supprimés depuis.

### Emplacement et structure

Les infos sont dans le registre, surtout dans deux ruches par utilisateur :

- `NTUSER.DAT` : shellbags pour le bureau, le réseau et les dossiers locaux.
  - `HKEY_CURRENT_USER\Software\Microsoft\Windows\Shell\BagMRU`
  - `HKEY_CURRENT_USER\Software\Microsoft\Windows\Shell\Bags`
- `UsrClass.dat` : shellbags pour les dossiers ouverts via des archives zip, le Panneau de configuration et d'autres espaces de noms du shell.
  - `HKEY_CURRENT_USER\Software\Classes\Local Settings\Software\Microsoft\Windows\Shell\BagMRU`
  - `HKEY_CURRENT_USER\Software\Classes\Local Settings\Software\Microsoft\Windows\Shell\Bags`

La structure est hiérarchique et complexe :

- Les clés `BagMRU` servent d'index, en stockant l'arborescence dans un ordre "plus récemment utilisé". Chaque valeur numérotée correspond à un sous-dossier.
- Les clés `Bags` stockent les préférences d'affichage réelles (taille de fenêtre, tri…) des dossiers listés dans `BagMRU`. La valeur NodeSlot d'une clé `BagMRU` fait le lien avec une entrée précise de `Bags`.

### Métadonnées stockées

Les données principales concernent les préférences, mais la valeur forensique vient de la structure et des horodatages :

- Chemin complet du dossier : reconstituable en parcourant l'arbre `BagMRU`.
- Type de dossier : disque local, partage réseau, périphérique amovible, fichier zip…
- Premier accès : certaines entrées, surtout sur les Windows récents, donnent un horodatage indiquant quand l'utilisateur a interagi pour la première fois avec le dossier.
- Dernier accès : la date "LastWrite" de la clé parente correspond souvent au dernier accès à un dossier de cette structure, ce qui donne un repère temporel.

### Valeur forensique

Les shellbags prouvent qu'un utilisateur connaissait et a utilisé des emplacements précis.

- **Prouver la "connaissance d'un chemin" :** leur valeur principale. Ils prouvent qu'un utilisateur a navigué dans un dossier, même s'il est supprimé aujourd'hui ou s'il était sur un support amovible débranché. C'est décisif pour contrer le "je ne savais même pas que ce dossier existait".
- **Reconstituer l'activité :** en analysant la structure, on peut voir les habitudes de navigation et le parcours dans le système de fichiers.
- **Identifier l'accès à des supports amovibles :** des entrées sont créées pour les dossiers des clés USB, ce qui donne un historique d'accès même après débranchement.
- **Persistance :** les shellbags sont remarquablement persistants. Ils ne sont pas nettoyés par les utilitaires classiques et peuvent survivre longtemps, ce qui donne un historique profond.

Parser des shellbags à la main est très difficile. Des outils comme `ShellBagsExplorer` d'Eric Zimmerman, ou des suites forensiques, sont indispensables pour décoder le binaire et reconstruire les chemins.

#### Points de réflexion (SS Contest)

Pour un SSer, les shellbags sont l'outil ultime pour prouver l'intention et la connaissance, et transformer une simple découverte de fichier en récit d'action délibérée.

- **Contrer le déni plausible :** l'usage le plus fort est de démolir le "je ne sais pas comment c'est arrivé là". Si tu trouves un cheat dans `C:\Users\Player\AppData\Local\HiddenFolder\` et que le joueur nie y être allé, parser ses shellbags peut sortir une entrée pour ce chemin exact. Ça prouve qu'il a navigué activement jusqu'à cet emplacement caché.
- **Suivre les cheats sur clé USB :** si tu penses qu'un joueur a utilisé des cheats depuis une clé USB débranchée, ses shellbags peuvent encore contenir des entrées pour les dossiers de ce disque (`E:\Vape\`). Ça prouve l'accès au dossier de cheat depuis le support amovible.
- **Renforcer le dossier :** trouver un fichier suspect, c'est bien. Prouver que le joueur a aussi créé et ouvert le dossier qui le contient (un dossier nommé "Minecraft Ghost Clients", par exemple) rend le dossier incontestable. Les shellbags apportent ce lien contextuel.
- **Débusquer les emplacements cachés :** un joueur peut cacher un dossier avec l'attribut caché. Tu peux le trouver en changeant les options d'affichage, mais ses shellbags prouveront qu'il y a accédé alors qu'il était caché, donc qu'il savait exactement où regarder.
