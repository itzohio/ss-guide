<!-- route: /screensharing-general-knowledge/third-section-windows-fundamentals/file-systems-the-foundation/journaling -->
# Journalisation (définition, utilité)

La journalisation, c'est une fonction des systèmes de fichiers modernes comme NTFS (et ext4, APFS…). Elle sert à fiabiliser les données et à garder le système de fichiers cohérent, surtout quand le PC s'éteint brutalement, plante ou perd le courant.

Au lieu de modifier directement les structures du disque (comme la Master File Table ou les index de dossiers) dès qu'un changement est demandé, un système journalisé note d'abord l'opération prévue dans un fichier de log : le journal. L'entrée décrit ce qui va être fait (écrire des données, créer un fichier, en supprimer un). C'est seulement une fois l'intention enregistrée que le système applique vraiment le changement.

Le but principal, c'est la reprise après crash. Si le système plante en pleine écriture, au redémarrage il n'a pas besoin de scanner tout le disque pour chercher des incohérences (comme le vieux chkdsk sur les systèmes non journalisés). Il lit le journal : il voit ce qui était fini avant le crash, ce qui était noté mais pas terminé, et ce qui est peut-être bancal. Il peut alors rejouer les opérations incomplètes ou les annuler, et revenir très vite à un état stable. Résultat : démarrage plus rapide après un plantage et beaucoup moins de risques de corruption.

Sur NTFS, deux fichiers de métadonnées jouent ce rôle : $UsnJrnl (le journal qui suit les changements de fichiers et dossiers) et $LogFile (les changements de métadonnées).
