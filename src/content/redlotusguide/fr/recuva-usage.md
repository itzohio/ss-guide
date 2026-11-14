<!-- route: /screensharing-general-knowledge/seventh-section-manual-ss-techniques/recuva/usage-in-screensharing -->
# L'utilisation en screenshare

Le rôle de Recuva pendant un screenshare, c'est d'essayer de récupérer des fichiers récemment supprimés : cheats, outils, logs ou configs que le joueur a pu effacer juste avant ou pendant le check pour passer inaperçu.

- **Scanner :** lancer Recuva (les versions portables sont souvent préférées en screenshare). Choisir le disque (C:, une clé USB…) et le type de scan. Un scan rapide va plus vite mais rate les fichiers profondément enfouis ; un scan profond prend beaucoup plus de temps mais est plus complet. En pratique, commencer par un scan rapide sur les endroits probables (Téléchargements, Bureau, Temp) est souvent suffisant.
- **Lire les résultats :** Recuva liste les fichiers récupérables avec en général :
  - Le nom (si récupérable).
  - Le chemin d'origine (si récupérable).
  - La date de dernière modification du fichier d'origine.
  - La taille.
  - Les chances de récupération, souvent en couleur : vert (excellentes chances, probablement pas écrasé), orange (partielles, peut-être écrasé ou fragmenté), rouge (irrécupérable, probablement écrasé).
- **Chercher les fichiers suspects :** filtrer ou trier les résultats (par chemin, date de modification ou suppression) et regarder les fichiers récemment supprimés avec des noms, extensions (`.exe`, `.dll`, `.jar`, `.bat`, `.ps1`) ou chemins suspects (dossiers de cheats, dossiers temporaires). Vérifier l'heure estimée de suppression quand elle est dispo.
- **Récupérer (avec beaucoup de prudence) :** si un fichier très suspect est en vert, on peut le récupérer pour l'analyser.
  - Point crucial : récupérer le fichier dans un autre dossier, dédié (par exemple un nouveau dossier "RecoveredEvidence" sur le Bureau), jamais à son emplacement d'origine. Ça évite d'écraser d'autres données sur le disque cible.
  - Une fois récupéré, on peut l'analyser (VirusTotal, décompilateur, éditeur hexa, comparaison de hash avec des cheats connus).
- **Cas FAT32/exFAT :** sur ces systèmes sans journalisation solide, les outils de récupération comme Recuva (avec des visionneuses comme FTK Imager) deviennent le moyen principal pour savoir si des fichiers ont été supprimés récemment, et pour tenter de les récupérer. Recuva indique si l'espace a probablement été écrasé, ce qui aide à juger.
