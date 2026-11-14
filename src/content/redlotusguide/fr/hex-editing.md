<!-- route: /screensharing-general-knowledge/eighth-section-common-bypass-techniques-in-screensharing/artifact-and-system-manipulation/hexadecimal-file-modification -->
# Modifier un fichier en hexadécimal

- **Description :** l'édition hexadécimale consiste à modifier directement le contenu binaire d'un fichier avec un éditeur hexa (HxD, ImHex, 010 Editor).
- **Mécanisme :** les bypassers s'en servent sur des exe ou des DLL de cheat pour :
  - Changer des chaînes ou des identifiants afin d'échapper aux détections par chaîne des scanners mémoire ou des outils SS.
  - Modifier un peu la structure du code pour changer le hash du fichier et passer une blocklist basée sur le hash (même si ça ne trompe pas une détection de signature sérieuse).
  - Neutraliser les protections anti-screenshare (du code qui détecte AnyDesk et ferme le programme) ou modifier une config intégrée.
- **Pourquoi les tricheurs font ça :** surtout pour échapper à la détection en changeant la signature (le hash) ou en supprimant des chaînes identifiables, et parfois pour désactiver des mécanismes anticheat/anti-screenshare du cheat.
- **Détection :**
  - Hash différent ou signature invalide : toute modification du binaire change le hash (MD5, SHA1, SHA256). Comparer le hash du fichier suspect avec celui de la version légitime connue révèle la modification. Les outils de vérification de signature (le script de BACA ou `Get-AuthenticodeSignature`) renvoient `HashMismatch` pour un fichier signé qui a été édité après signature. Un fichier non signé édité garde une signature absente, mais son hash ne correspond plus à aucune référence.
  - Journal USN (`$UsnJrnl`) : modifier le contenu génère en général `DATA_OVERWRITE | CLOSE`, `DATA_EXTEND | CLOSE`, ou parfois `STREAM_CHANGE | CLOSE`. Ces entrées, croisées avec un échec de vérification de signature, renforcent l'hypothèse.
  - Analyse manuelle (avancé) : comparer le dump hexa du fichier suspect avec une version propre connue montre exactement ce qui a été changé.
