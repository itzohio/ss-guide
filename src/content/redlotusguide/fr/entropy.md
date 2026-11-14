<!-- route: /screensharing-general-knowledge/ninth-section-more-artifact-analysis-for-screensharing/file-entropy-analysis -->
# L'analyse d'entropie d'un fichier

L'entropie d'un fichier, en simplifiant, c'est une mesure mathématique du désordre dans ses données. Elle se calcule sur la répartition des valeurs d'octets. En screenshare et en analyse de malware, c'est un indicateur utile, surtout pour repérer un fichier packé, chiffré ou obfusqué volontairement.

- **Pourquoi ça compte :** du code exécutable légitime non compressé et des formats de données classiques ont une structure et des répétitions, donc une entropie plutôt basse. À l'inverse, la compression, le chiffrement et les packers (des outils qui compressent les exe pour les protéger du reverse engineering) augmentent mécaniquement le caractère aléatoire des octets.
- **Comment lire la valeur :** l'entropie se mesure de 0 (ordre parfait, un fichier plein d'octets nuls) à 8 (aléatoire maximal, typique des données chiffrées ou compressées).
  - Entropie basse (< 6,0) : fichiers texte non compressés, exe simples avec beaucoup de données structurées, ou fichiers avec de grandes zones uniformes.
  - Entropie haute (> 7,0 - 7,5) : très bon indice que le fichier contient des données très aléatoires, donc du chiffrement, de la compression ou du code obfusqué avec un packer évolué (Themida, VMProtect). Les malwares et les cheats sont souvent packés ou chiffrés justement pour échapper aux détections par signature et compliquer l'analyse.
- **Comme indice de suspicion :** une entropie élevée ne prouve pas qu'un fichier est malveillant (des installeurs légitimes, des archives et des documents chiffrés en ont aussi). Mais un exe ou une DLL avec une entropie anormalement haute, surtout s'il n'est pas signé ou qu'il traîne dans un dossier suspect, c'est un gros signal. Ça suggère que sa vraie nature est cachée, et il faut creuser avec d'autres outils (analyse dynamique, tentative de dépacking, vérification de signature).
- **Outils :** plusieurs outils calculent et affichent l'entropie :
  - Detect It Easy (DiE) : l'entropie fait partie de son analyse PE, souvent section par section.
  - VirusTotal : le rapport d'analyse donne souvent une entropie globale.
  - Des outils forensic spécialisés ou des calculateurs d'entropie autonomes.

L'analyse d'entropie permet donc de repérer vite les exécutables potentiellement obfusqués qui méritent un examen plus poussé.
