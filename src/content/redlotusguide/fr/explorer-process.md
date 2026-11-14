<!-- route: /screensharing-general-knowledge/seventh-section-manual-ss-techniques/specific-processes-to-analyze-and-search-patterns/1-explorerexe -->
# explorer.exe (l'Explorateur Windows)

- **Rôle :** c'est le processus du shell graphique de Windows : Bureau, barre des tâches, menu Démarrer et fenêtres de l'Explorateur. Il gère les interactions avec les fichiers et dossiers et discute avec les services d'indexation.
- **Pourquoi l'analyser :** comme il est au centre des opérations sur les fichiers, sa mémoire contient parfois des chemins en cache, des noms de dossiers récemment ouverts, ou des bouts de lignes de commande ou de scripts, notamment ce que logge le Program Compatibility Assistant (PCA).
- **Fiabilité et limites :** souvent considéré comme peu fiable comme preuve unique. Sa mémoire bouge tout le temps, les cheats modernes peuvent la nettoyer ou la contourner, et des chaînes innocentes se confondent facilement avec du cheat (beaucoup de faux positifs). À utiliser comme piste ou comme preuve d'appui, pas comme preuve seule.
- **Motifs de recherche courants :**
  - `pcaclient` (Contains, insensible à la casse) : cherche les chaînes en cache liées au service PCA. Ça révèle parfois les chemins des derniers programmes exécutés (souvent les 10 derniers), même si c'est facile à contourner. Copier les blocs de résultat complets dans Notepad pour les lire plus facilement.
  - `file:///` (Contains, insensible à la casse) : liste des chemins (souvent en URI) récemment consultés via l'Explorateur. Ça donne du contexte, mais c'est noyé dans l'activité normale et ça ne prouve pas une exécution. Filtrer ensuite sur `.exe`, `.dll`, `.jar` ou des dossiers utilisateur peut donner des pistes.
