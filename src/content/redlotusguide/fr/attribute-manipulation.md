<!-- route: /screensharing-general-knowledge/eighth-section-common-bypass-techniques-in-screensharing/artifact-and-system-manipulation/attribute-manipulation -->
# Manipuler les attributs (lecture seule, caché)

- **Description :** changer les attributs standards (lecture seule, caché, système) de fichiers ou dossiers précis pour gêner la détection ou empêcher la journalisation de fonctionner.
- **Mécanisme :** ça passe par des fonctions Windows normales :
  - Les propriétés du fichier (clic droit > Propriétés > cocher "Lecture seule" ou "Caché").
  - L'outil en ligne de commande `attrib` (par exemple `attrib +r +h C:\path\to\file`).
  - Des commandes PowerShell (`Set-ItemProperty`).
- **Pourquoi les tricheurs font ça (en screenshare) :** l'usage malveillant le plus courant, c'est de mettre l'attribut lecture seule (`+r`) sur les fichiers Prefetch (`.pf`) dans `C:\Windows\Prefetch`.
  - Bypass Prefetch : un `.pf` en lecture seule ne peut plus être mis à jour par SysMain (date de dernière exécution, run count) aux lancements suivants. L'entrée est en quelque sorte gelée, et un cheat lancé récemment paraît ne pas avoir tourné depuis la date inscrite avant le changement. L'activité récente disparaît de l'analyse Prefetch.
  - Cacher des fichiers : l'attribut caché (`+h`) sert simplement à planquer des fichiers ou dossiers de cheat des vues par défaut de l'Explorateur.
- **Détection :**
  - Vérifier les attributs : regarder directement ceux des fichiers suspects, surtout les `.pf` qui affichent de vieilles dates alors que d'autres preuves disent qu'ils ont tourné.
    - Dans l'Explorateur (Propriétés > Général).
    - En invite de commandes : `dir /ar C:\Windows\Prefetch` liste les fichiers en lecture seule, et `dir /ah C:\path\` les fichiers cachés.
  - Journal USN (`$UsnJrnl`) : changer les attributs (lecture seule ou caché) génère un `BASIC_INFO_CHANGE | CLOSE` sur le fichier concerné. Des `BASIC_INFO_CHANGE` récents sur des `.pf`, c'est un très bon indice de manipulation de Prefetch.
