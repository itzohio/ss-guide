<!-- route: /screensharing-general-knowledge/eighth-section-common-bypass-techniques-in-screensharing/artifact-and-system-manipulation/timestamp-manipulation -->
# Modifier les horodatages (timestomping)

- **Description :** le timestomping est une technique anti-analyse classique : modifier les horodatages standards d'un fichier ou d'un dossier. Le but est de changer les dates Modified, Accessed, Changed et/ou Birth (MACB) pour qu'un fichier malveillant (un cheat) ou un fichier légitime récemment modifié paraisse plus vieux, ou se noie parmi les fichiers système. Ça brouille l'analyse de la timeline pendant le screenshare.
- **Mécanisme :** plusieurs outils ou méthodes permettent de réécrire ces métadonnées :
  - Des utilitaires dédiés, comme `Timestomp.exe` (Metasploit) ou d'autres outils autonomes.
  - Des outils intégrés : des commandes PowerShell (`Set-ItemProperty`) ou des appels d'API bas niveau.
  - La cible : en général les horodatages de l'attribut `$STANDARD_INFORMATION` (`$SI`) dans l'enregistrement MFT du fichier, parce que ce sont ceux que l'Explorateur et la plupart des outils basiques affichent.
- **Pourquoi les tricheurs font ça :** faire passer un cheat téléchargé, installé ou exécuté récemment pour un fichier pas touché depuis des mois ou des années, en espérant que le SSer le zappe en triant par date. Ça peut aussi servir sur des artefacts comme les fichiers Prefetch (même si là, la manipulation d'attributs est plus courante) ou des logs.
- **Détection :** il faut souvent comparer plusieurs jeux d'horodatages :
  - Comparaison `$SI` vs `$FN` : comme expliqué dans la partie NTFS, un fichier a souvent deux jeux de dates MACB dans son enregistrement MFT, un dans `$STANDARD_INFORMATION` ($SI) et un dans `$FILE_NAME` ($FN). Les outils de timestomping ne touchent souvent que le $SI. Parser le $MFT (avec MFTECmd, par exemple) et comparer les deux révèle des incohérences, ce qui est un très bon indice. Si le $SI affiche 2015 et le $FN une date récente (celle du screenshare), c'est presque sûr.
  - Journal USN (`$UsnJrnl`) : modifier des horodatages génère un `BASIC_INFO_CHANGE`, loggé avec l'heure exacte de la modification. Trouver un `BASIC_INFO_CHANGE` récent pour un fichier qui affiche un $SI très ancien, c'est une preuve forte.
  - `$LogFile` : en théorie il peut capturer la transaction, avec parfois l'ancienne et la nouvelle date, mais c'est complexe à parser.
  - Corrélation avec un changement d'heure système : si le timestomping est récent, regarder les logs (ID 4616) pour un changement d'heure système à ce moment-là, parce que certains outils reculent l'horloge avant de modifier. (Les outils évolués n'en ont pas besoin.)
