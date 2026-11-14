<!-- route: /screensharing-general-knowledge/third-section-windows-fundamentals/key-ntfs-components/file-attributes-manipulable-properties -->
# Les attributs de fichier (lecture seule, caché, etc.)

Sur NTFS, chaque fichier a des attributs : des drapeaux stockés dans les métadonnées qui contrôlent son comportement, sa visibilité et la façon dont l'OS et les programmes le traitent. Ceux qu'on croise le plus en screenshare :

- **Lecture seule :** empêche en principe de modifier le contenu et complique un peu la suppression (il faut confirmer ou forcer).
- **Caché :** le fichier n'apparaît pas dans les listes par défaut, ni dans l'Explorateur ni avec un `dir` simple. Pour les voir, il faut activer "Afficher les fichiers, dossiers et lecteurs cachés" ou utiliser `dir /ah`.
- **Système :** marque un fichier comme critique pour l'OS. Ils sont en général aussi cachés, avec une option séparée dans l'Explorateur ("Masquer les fichiers protégés du système d'exploitation").
- **Archive :** sert surtout aux logiciels de sauvegarde pour repérer les fichiers modifiés depuis la dernière sauvegarde. Peu utile pour détecter un cheat.
- **Non indexé :** exclut le contenu de l'indexation Windows Search.
- **Temporaire :** signale un fichier que les outils de nettoyage peuvent supprimer.
- **Compressé / Chiffré :** indique une compression ou un chiffrement NTFS.

Ces attributs se voient et se modifient facilement :

- Propriétés du fichier dans l'Explorateur (clic droit > Propriétés > onglet Général).
- En ligne de commande : `attrib` (le classique), `cacls`, `icacls` (plus récent, orienté permissions).
- Par programme, via les API Windows.

En screenshare et en bypass, les attributs sont souvent bricolés :

- Le **caché** sert très souvent à planquer des fichiers de cheat, des dossiers ou des artefacts.
- Le **lecture seule** peut être mis sur des artefacts comme les fichiers Prefetch (.pf) pour empêcher le service SysMain de mettre à jour la date de dernière exécution ou le compteur de lancements. L'artefact est en quelque sorte gelé pour cacher une activité récente.

Point important : les changements d'attributs sont normalement loggés dans le $UsnJrnl sous le code BASIC_INFO_CHANGE. Chercher ces événements sur des fichiers suspects ou dans les dossiers d'artefacts connus permet de repérer une tentative de modification.
