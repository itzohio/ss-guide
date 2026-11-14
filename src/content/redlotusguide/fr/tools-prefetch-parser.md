<!-- route: /screenshare-tools/spoks-tools/prefetch-parser -->
# Prefetch Parser

Description : un outil pour parser et analyser les fichiers Prefetch de Windows (`.pf`), en alternative ou en complément de WinPrefetchView.

Fonctions :

- Parse les fichiers Prefetch et affiche les mêmes informations que WinPrefetchView.
- Onglets détaillés : Execution History (les 8 dernières exécutions), File Info (taille, dates de création, accès, modification).
- Intègre le parsing BAM, le scan de règles YARA et la vérification de signature numérique de l'exécutable associé.
- Propose des filtres (Show Unsigned Only, Show Flagged Only, Only In Instance).

Usage : aide à examiner les preuves d'exécution contenues dans les Prefetch, en combinant analyse Prefetch, vérification de signature et scan YARA dans une seule interface.

Lien : `https://github.com/spokwn/prefetch-parser`
