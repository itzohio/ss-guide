<!-- route: /screensharing-general-knowledge/third-section-windows-fundamentals/key-ntfs-components/logfile-specific-log-for-metadata-changes -->
# $LogFile — le journal des métadonnées

Le $LogFile ressemble au $UsnJrnl dans l'idée (garder une trace pour rester cohérent) mais pas dans ce qu'il fait. Le $UsnJrnl suit un large éventail d'événements sur les fichiers et dossiers via les enregistrements USN. Le $LogFile, lui, est un journal transactionnel spécialisé : il enregistre les changements de métadonnées avant qu'ils soient vraiment écrits dans des structures comme le $MFT.

Il note les mises à jour d'attributs, les modifications d'horodatages MACB dans le $MFT, les changements d'enregistrements MFT, les mises à jour d'index de dossiers et les autres modifications structurelles. Sa fonction système, c'est la récupération : garder le système de fichiers cohérent même si le PC plante pendant une mise à jour de métadonnées.

Pour l'analyse, le $LogFile est très précieux, mais chiant à lire. Il donne un historique très fin et à court terme des modifications de métadonnées, ce qui peut révéler :

- Une preuve directe de timestomping, avec parfois l'horodatage d'origine et le faux dans la même transaction.
- Des manipulations d'attributs (passer un fichier en lecture seule ou caché, par exemple).
- Une séquence d'événements plus précise pour des créations, suppressions ou renommages en rafale que ce que montrent le $MFT ou même le $UsnJrnl.

Le problème, c'est que le $LogFile est réputé très dur à parser : format interne complexe, mal documenté, et circulaire (il écrase vite les vieilles entrées sur un système actif). Il faut des outils spécialisés comme "NTFS Log Parser" ou les fonctions avancées des suites forensic pour en tirer quelque chose. En général, on considère ça comme une technique avancée.
