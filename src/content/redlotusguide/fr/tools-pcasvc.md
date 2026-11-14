<!-- route: /screenshare-tools/spoks-tools/pcasvc-executed -->
# pcasvc executed

Description : un outil qui parse les données d'exécution liées au service Program Compatibility Assistant (PcaSvc) et, éventuellement, aux artefacts PcaClient. Il fait les vérifications de signature et les détections génériques du BAM Parser.

Fonctions :

- Parse les informations de dernière exécution du service PcaSvc et des artefacts PcaClient.
- Vérifie les signatures numériques des exécutables identifiés.
- Applique une suite de vérifications heuristiques pour signaler les fichiers suspects.
- Cherche des remplacements de fichier via le journal USN.
- Propose d'afficher les infos du fichier, ses strings, ses imports, et de lancer des règles YARA.

Usage : utile pour enquêter sur les traces d'exécution journalisées par le service PCA et les artefacts liés, en complément de Prefetch et BAM, surtout sur les systèmes où la journalisation PCA est active.

Lien : `https://github.com/spokwn/pcasvc-executed`
