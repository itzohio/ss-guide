<!-- route: /screensharing-general-knowledge/third-section-windows-fundamentals/fundamental-timestamps -->
# Les horodatages de base

Chaque fichier NTFS a plusieurs horodatages qui racontent son histoire et son usage. Savoir ce qu'ils veulent dire, et à quel point on peut leur faire confiance, c'est la base d'une analyse correcte. Le plus connu, c'est le jeu MACB :

- **(M) Modified :** la dernière fois que le contenu du fichier a changé. Enregistrer un document, retoucher une image, recompiler un exe ou ajouter des lignes dans un log met à jour le Modified.
- **(A) Access :** en théorie, la dernière fois que le fichier a été ouvert, lu, écrit ou exécuté. En pratique, en screenshare, cet horodatage ne prouve rien sur une action du joueur. Des tas de processus en fond, l'indexation Windows, les antivirus, les assistants de compatibilité, et même le simple fait d'ouvrir un dossier dans l'Explorateur peuvent le mettre à jour sans que le joueur ait ouvert quoi que ce soit. S'appuyer dessus pour prouver qu'un cheat a été lancé mène droit aux faux positifs. Seul, il ne vaut presque rien.
- **(C) Changed :** la dernière fois que les métadonnées du fichier ont changé dans le $MFT. Ça inclut les attributs (lecture seule, caché), les permissions (ACL), un renommage ou un déplacement dans le même volume. Modifier le contenu ne met pas forcément à jour le Changed, sauf si les métadonnées bougent en même temps.
- **(B) Birth :** le moment exact où le fichier a été créé sur ce volume (C:, une clé USB…). Important à comprendre : copier un fichier ailleurs (même sur le même disque, et surtout sur un autre) donne une nouvelle date de création au fichier copié, celle de la fin de la copie à destination. Un déplacement dans le même volume garde en général la date de création d'origine, mais met à jour le Changed.

Il faut donc faire attention aux nuances de chaque horodatage, surtout à l'Access time qui ne prouve presque jamais une action volontaire du joueur. En pratique, il faut recouper avec d'autres artefacts.
