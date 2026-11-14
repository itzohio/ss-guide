<!-- route: /screensharing-general-knowledge/eighth-section-common-bypass-techniques-in-screensharing/concealment-and-obfuscation/2-unicode-characters-in-file-namespaths -->
# Les caractères Unicode dans les noms et chemins

- **Description :** utiliser des caractères non standard, notamment Unicode, dans les noms de fichiers ou de dossiers. Ça peut être :
  - Des caractères d'autres alphabets (cyrillique, chinois, arabe, géorgien).
  - Des homoglyphes : des caractères qui ressemblent à de l'ASCII mais qui sont différents (un "а" cyrillique au lieu d'un "a" latin, par exemple).
  - Des caractères invisibles ou de largeur nulle glissés dans les noms.
- **Mécanisme :** le bypass exploite les limites ou les incohérences dans la façon dont les outils, les applications et même l'OS affichent, traitent ou cherchent ces caractères.
  - Les noms s'affichent mal, ou en espaces et points d'interrogation, dans certains outils ou invites de commandes.
  - Chercher le fichier avec le clavier devient difficile, voire impossible.
  - Les filtres des outils d'analyse mémoire (System Informer) peuvent ne rien matcher s'ils gèrent mal l'encodage ou si la chaîne tapée ne correspond pas exactement à la séquence Unicode.
  - Des noms visuellement trompeurs piègent le SSer pendant l'inspection manuelle des dossiers.
- **Pourquoi les tricheurs font ça :** brouiller les pistes et gêner la détection. Le fichier devient dur à trouver, identifier et analyser avec les méthodes standards, donc le cheat se cache en pleine vue ou dans une arborescence pénible à parcourir.
- **Détection :**
  - Everything en regex : `regex:[^\x00-\x7F]` trouve les caractères non-ASCII, et on peut viser des plages précises. L'outil "Unicode Detector" de Rancio est fait pour ça.
  - Inspection visuelle : se méfier des noms qui ont l'air "bizarre", avec des symboles inhabituels ou un espacement incohérent.
  - Rendu des outils : un point d'interrogation ou un affichage cassé est un indice.
  - Outils de parsing avancés : MFTECmd ou INDXRipper, qui lisent directement les métadonnées du système de fichiers, gèrent souvent mieux les chemins Unicode que les outils qui passent par les API de l'OS.
