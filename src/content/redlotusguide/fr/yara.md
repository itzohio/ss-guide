<!-- route: /screensharing-general-knowledge/ninth-section-more-artifact-analysis-for-screensharing/yara-rules -->
# Les règles YARA

YARA est un outil puissant, souvent décrit comme "le couteau suisse du pattern matching pour les chercheurs en malware". Ce n'est pas une technique d'analyse en soi, mais un outil qui identifie des fichiers ou des régions mémoire à partir de motifs texte ou binaires. YARA fonctionne avec des règles. Chaque règle a :

- Une section strings : les chaînes de texte (ASCII/Unicode) ou les motifs d'octets hexa à chercher.
- Une section condition : une expression booléenne qui définit le déclenchement (par exemple "fichier contenant la chaîne $a ET la chaîne $b", "fichier contenant n'importe laquelle des chaînes $s*", "fichier de plus de 1 Mo contenant $c").

Quand YARA scanne une cible (fichier, dossier ou mémoire d'un processus) et trouve du contenu qui correspond aux chaînes et satisfait la condition, il signale une correspondance avec l'identifiant de la règle.

En screenshare et en DFIR, YARA sert à :

- **Chasser les cheats et malwares connus :** créer des règles à partir de chaînes uniques, bouts de code, import hashes (imphashes) ou métadonnées extraites de fichiers de cheat ou d'échantillons connus (avec HxD, DiE). On scanne ensuite les fichiers suspects ou la mémoire avec ces règles.
- **Classer des fichiers :** écrire des règles qui repèrent des caractéristiques précises (exe packés selon les noms de sections ou l'entropie, fichiers qui demandent les droits admin, fichiers contenant certains appels d'API).
- **Scan mémoire :** intégrer YARA aux workflows d'analyse mémoire. Volatility (plugin `yarascan`) et Velociraptor (fonction VQL `yara()`) appliquent des règles directement sur un dump ou sur la mémoire d'un processus en cours, pour trouver du code injecté ou des artefacts résidents. Des outils SS automatiques comme Ocean et Golden ont aussi intégré YARA.
- **Souplesse :** YARA gère les jokers, l'insensibilité à la casse, les regex et des modules, ce qui permet des règles très précises et adaptables.

Pour bien utiliser YARA, il faut de bonnes règles (publiques, comme celles de Florian Roth, communautaires ou maison) et savoir les appliquer à la bonne cible (fichier ou mémoire). C'est un outil de chasse qui signale ce qui mérite d'être creusé, à partir de motifs définis à l'avance.
