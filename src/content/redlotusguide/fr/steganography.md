<!-- route: /screensharing-general-knowledge/eighth-section-common-bypass-techniques-in-screensharing/steganography -->
# La stéganographie

- **Description :** la stéganographie, c'est cacher des données dans d'autres données ou fichiers qui ont l'air anodins (le fichier "porteur"), de façon à ce que la présence du contenu caché ne saute pas aux yeux. Dans le cadre des bypass en screenshare, il s'agit en général de planquer du code, des scripts ou un exe de cheat complet dans des types de fichiers courants : images (`.jpg`, `.png`), audio (`.wav`), vidéo (`.mp4`) ou documents (`.pdf`).
- **Mécanisme :** contrairement aux ADS, où les données sont dans un flux NTFS à part attaché au fichier, la stéganographie modifie la structure binaire du fichier porteur pour y glisser le payload. Ça va du simple ajout de données à la fin du fichier (ce qui peut changer sa taille) à des méthodes plus fines qui touchent les bits de poids faible (LSB) des pixels d'une image ou exploitent des zones redondantes du format. Le but : que les données cachées ressemblent à une partie normale du fichier ou à du bruit.
- **Pourquoi les tricheurs font ça :** c'est une couche de dissimulation de plus. En cachant un payload dans un type de fichier considéré comme sûr et rarement scanné pour du code exécutable (une image `.png`), ils espèrent passer à travers les outils et l'inspection visuelle qui se concentrent sur les exe et les scripts. L'efficacité grimpe encore quand c'est combiné avec d'autres techniques, comme une extraction/exécution non standard ou de l'obfuscation du payload.
- **Détection :** c'est souvent difficile et ça demande une analyse plus poussée :
  - Anomalies de taille ou de métadonnées : comparer la taille, les dimensions (pour une image) ou d'autres métadonnées avec ce qu'on attend pour ce type de fichier. Une taille étonnamment grosse ou des incohérences sont suspectes.
  - Comparaison de hash : si le fichier prétend être un fichier standard connu (un fond d'écran Windows par défaut, par exemple), comparer son hash avec l'officiel révèle une modification.
  - Outils de stéganalyse : StegDetect, StegExpose ou les suites forensic font de l'analyse statistique et de la reconnaissance de motifs pour repérer des données cachées dans certains formats (surtout les images).
  - Analyse d'entropie : des données chiffrées ou compressées intégrées peuvent changer l'entropie du fichier porteur de façon inhabituelle.
  - Inspection manuelle en éditeur hexa : regarder le contenu brut révèle parfois des données ajoutées ou des motifs qui ne collent pas avec le format.

La stéganographie, c'est une dissimulation plus avancée qu'un simple renommage ou un ADS. Elle demande souvent une analyse ciblée, au-delà de la procédure de base d'un screenshare.
