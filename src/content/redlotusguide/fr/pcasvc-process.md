<!-- route: /screensharing-general-knowledge/seventh-section-manual-ss-techniques/specific-processes-to-analyze-and-search-patterns/5-pcasvc -->
# PcaSvc (Program Compatibility Assistant Service)

- **Rôle :** ce service aide à faire tourner les vieux programmes, mais il logge aussi des données d'exécution, en complément des chaînes PCA de `explorer.exe`.
- **Trouver le processus :** repérer l'instance de `svchost.exe` qui héberge le service "PcaSvc".
- **Motifs de recherche courants :**
  - `jar` (Contains, insensible à la casse, sans le point) : chercher "jar" plutôt que ".jar" dans la mémoire de PcaSvc révèle parfois des exécutions de fichiers `.jar`, y compris ceux lancés via `java -jar` avec une extension maquillée (la ligne de commande contient "jar"). Ça complète la recherche dans PlugPlay.
  - Noms d'exécutables précis (Contains, insensible à la casse) : chercher direct le nom de fichiers de cheats connus.
