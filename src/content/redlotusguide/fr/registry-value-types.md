<!-- route: /screensharing-general-knowledge/fourth-section-common-windows-artifacts-and-their-basic-analysis/windows-registry-introduction/registry-value-types -->
# Les types de valeurs du registre

Les valeurs du registre existent dans plusieurs formats. Connaître les principaux aide à comprendre ce qu'on lit :

- `REG_SZ` : une chaîne de texte standard, de longueur fixe. Souvent utilisée pour des chemins de fichiers, des noms ou des réglages texte simples.
- `REG_EXPAND_SZ` : une chaîne de texte extensible. Comme `REG_SZ`, mais elle peut contenir des variables d'environnement (`%SystemRoot%`, `%USERNAME%`) que le système remplace à la lecture.
- `REG_BINARY` : des données binaires brutes, affichées en hexadécimal dans `regedit`. Sert pour des configs complexes, des drapeaux, parfois de petits fichiers ou structures intégrés.
- `REG_DWORD` (32 bits) / `REG_QWORD` (64 bits) : des nombres. Souvent des réglages entiers, des booléens (`0` pour faux/désactivé, `1` pour vrai/activé) ou des masques de bits.
- `REG_MULTI_SZ` : plusieurs chaînes de texte dans une seule valeur, séparées par des caractères nuls et terminées par un double nul. Sert pour des listes, comme des protocoles réseau ou des dépendances de service.
