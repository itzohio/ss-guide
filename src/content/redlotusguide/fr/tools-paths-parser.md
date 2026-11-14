<!-- route: /screenshare-tools/spoks-tools/paths-parser -->
# Paths Parser

Description : un outil complet pour analyser des listes de chemins de fichiers fournies dans des `.txt` précis (`search results.txt`, `paths.txt`, `p.txt`). Il effectue plusieurs vérifications sur chaque chemin valide, ce qui automatise plusieurs étapes d'analyse.

Fonctions :

- **Parsing des chemins :** gère et parse correctement les chemins, y compris ceux avec le préfixe `\\?\`. Lit les chemins ligne par ligne dans les fichiers d'entrée indiqués.
- **Vérification de l'existence :** détermine si le fichier existe encore ou s'il a été supprimé (statut "Deleted").
- **Vérification de signature numérique :** contrôle les signatures Authenticode et Catalog. Affiche "Signed", "Not signed" ou un état d'erreur précis. Détection spéciale pour des cheats signés connus comme Slinky et Vape.
- **Détections génériques :** applique une suite de 27 vérifications heuristiques conçues pour signaler des caractéristiques suspectes fréquentes dans les logiciels malveillants ou les cheats. Catégories : autoclickers (A), protections non C# (B), protections C# (C/D/E), exécutables packés (F), injecteurs (G) et cheats connus (Specific A/B).
- **Vérification de remplacement :** interroge le journal USN pour chaque chemin existant afin d'identifier des schémas de remplacement de fichier (séquences liées aux déplacements via l'Explorateur, à `copy` ou aux écrasements par `type`).
- **Intégration YARA :** permet d'ajouter ses propres règles `.yar` pour le scan.
- **Sortie :** affiche les résultats (existence, signature, hits de génériques) pour chaque chemin dans la console, et écrit un résumé des remplacements détectés dans `replaces.txt`, dans le dossier du programme.

Notes et limites :

- Les génériques A2 (clickers DLL) et la série F (fichiers packés) peuvent parfois donner des faux positifs, mais ils restent actifs pour maximiser la détection de vrais cheats.
- Bien examiner les horodatages des remplacements détectés : une mise à jour légitime de fichier peut déclencher ces motifs.
- Les chemins de fichiers supprimés peuvent apparaître incomplets ou "coupés", selon la façon dont les artefacts mémoire ou le parsing traitent les fichiers inexistants.

Usage : un outil puissant pour analyser en masse des chemins récupérés par d'autres outils (des dumps de chaînes System Informer, par exemple) ou des logs. Il donne le statut de signature, l'existence, un niveau de suspicion heuristique et la détection de remplacements potentiels. Très utile pour évaluer rapidement des listes de DLL ou d'EXE trouvées en mémoire.

Lien : `https://github.com/spokwn/PathsParser/releases`
