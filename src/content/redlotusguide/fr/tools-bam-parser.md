<!-- route: /screenshare-tools/spoks-tools/bam-parser -->
# BAM parser

Description : un parseur pour les clés de registre du Background Activity Moderator (BAM), pensé pour les besoins du ScreenSharing. La logique de parsing principale est en partie visible (semi-open source), mais beaucoup de règles de détection génériques sont propriétaires.

Fonctions :

- Parse les entrées BAM du registre, en corrigeant les chemins au format `\Device\HarddiskVolume` vers les lettres de lecteur classiques.
- Récupère la dernière date d'exécution du fichier et indique si elle tombe dans la session de session utilisateur actuelle.
- Vérifie les signatures numériques (Authenticode/Catalog) de chaque exécutable présent.
- Applique de nombreuses règles de détection génériques (heuristiques) pour signaler les entrées suspectes selon des caractéristiques fréquentes chez les cheats et malwares.
- Cherche des schémas de remplacement de fichier via le journal USN pour chaque chemin.
- Propose des filtres dans l'interface (afficher seulement les non signés, les signalés, ceux de l'instance en cours).
- Met en rouge les entrées liées à un remplacement de fichier.

Notes et limites :

- Un ou deux génériques qui touchent un même fichier ne doivent pas mener à une conclusion directe : la vérification manuelle est recommandée.
- Le développeur précise que certains génériques (A2, série F) peuvent donner des faux positifs, mais ils restent actifs pour maximiser la détection.
- `Ctrl + clic gauche` copie le chemin de la cellule sélectionnée.

Usage : utile pour analyser les preuves d'exécution stockées dans les clés BAM, avec l'heure d'exécution, le statut de signature et les alertes heuristiques, ce qui aide à identifier rapidement un exécutable potentiellement malveillant.

Lien : `https://github.com/spokwn/BAM-parser`
