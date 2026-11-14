<!-- route: /screensharing-minecraft-knowledge/fifth-section-specific-context-minecraft/specific-analysis-for-minecraft/javaedit-detection-via-hashcontent -->
# JavaEdit — détection par hash et contenu

JavaEdit, c'est une catégorie de cheats où le `.jar` vanilla de Minecraft lui-même (pas un mod) a été modifié directement au niveau du bytecode pour intégrer des cheats : reach améliorée, knockback modifié, hit detection altérée… Ces versions se font passer pour du vanilla standard dans le dossier `versions`.

- **Méthode principale (comparaison de hash) :** la façon la plus fiable et définitive de détecter JavaEdit est la même que pour les mods.
  - Identifier la version vanilla exacte que le joueur prétend utiliser (1.8.9, 1.16.5…).
  - Localiser le `.jar` du jeu correspondant dans `.minecraft/versions/{nom_de_version}/` (par exemple `1.8.9.jar`).
  - Calculer le SHA256 du `.jar` du joueur.
  - Récupérer le SHA256 officiel de cette version vanilla depuis une source de confiance (les ressources officielles Minecraft, ou des wikis communautaires sérieux comme le Minecraft Wiki sur Fandom/Wiki.gg, qui listent souvent les hash officiels).
  - Comparer.
- **Vérification :** la moindre différence entre le hash du `.jar` du joueur et le hash officiel de cette version prouve que le fichier a été modifié et n'est pas un client vanilla légitime. Sur quasiment tous les serveurs, c'est un motif de ban direct. Et attention à bien comparer avec le hash du bon numéro de version.
