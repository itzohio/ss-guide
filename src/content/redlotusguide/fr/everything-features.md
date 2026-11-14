<!-- route: /screensharing-general-knowledge/seventh-section-manual-ss-techniques/search-everything-rapid-file-system-search/core-features -->
# Les fonctions principales

- **Indexation quasi instantanée :** au premier lancement, il scanne la Master File Table (MFT) des volumes NTFS et construit un index léger de tous les noms et chemins. Ensuite il surveille le journal USN pour se mettre à jour en direct quand des fichiers sont créés, supprimés, déplacés ou renommés.
- **Recherche très rapide :** les résultats arrivent presque immédiatement, même sur plusieurs téraoctets.
- **Peu de ressources :** il consomme très peu de CPU et de RAM, donc il tourne même sur une machine modeste.
- **Syntaxe puissante :** bien plus que des mots-clés :
  - Opérateurs booléens (`AND`, `OR`, `NOT`, représentés par un espace, `|` et `!`).
  - Jokers (`*` pour plusieurs caractères, `?` pour un seul).
  - Expressions régulières pour les motifs complexes.
  - Filtres précis : taille (`size:`), dates (`dm:` modifié, `dc:` créé, `da:` accédé), attributs (`attrib:`), chemins (`path:`), extensions (`ext:`), et même contenu (`content:`, mais beaucoup plus lent).
