<!-- route: /screensharing-general-knowledge/ninth-section-more-artifact-analysis-for-screensharing/magnet-edd -->
# Magnet EDD (Encrypted Disk Detector)

Magnet Encrypted Disk Detector (EDD) est un outil gratuit et spécialisé de Magnet Forensics. Son seul but : scanner rapidement un système pour repérer les volumes chiffrés créés par les logiciels de chiffrement de disque courants.

- **Ce qu'il détecte :**
  - BitLocker (le chiffrement natif de Windows)
  - TrueCrypt (ancien, mais des volumes existent encore)
  - VeraCrypt (le successeur open source populaire de TrueCrypt)
  - D'autres selon la version et les méthodes de détection.
- **Systèmes de fichiers gérés :** il scanne les disques en NTFS, exFAT et FAT32.
- **Fonctionnement :** un simple exécutable autonome, souvent lancé depuis une invite de commandes admin. L'option `/batch` automatise le scan et la sortie sans interaction.
- **À quoi ça sert en screenshare :** identifier si le joueur a des disques, partitions ou conteneurs de disque virtuels chiffrés. Un volume chiffré est par définition inaccessible sans le mot de passe, le fichier de clé ou la clé de récupération. C'est donc un cachette possible pour des cheats, des outils, des données sensibles ou n'importe quel fichier compromettant, totalement à l'abri d'un screenshare classique sauf si le joueur accepte de déchiffrer.
- **Comment lire le résultat :** Magnet EDD ne détecte pas les cheats, il signale des zones de dissimulation potentielles. Trouver un volume chiffré monté et actif (surtout si le joueur ne le mentionne pas ou refuse de le déchiffrer) pendant un screenshare est très suspect : c'est un endroit inaccessible au SSer où des preuves pourraient être cachées. Les règles des serveurs prévoient souvent quoi faire quand on tombe sur un volume chiffré pendant un check.
