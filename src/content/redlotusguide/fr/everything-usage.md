<!-- route: /screensharing-general-knowledge/seventh-section-manual-ss-techniques/search-everything-rapid-file-system-search/usage-in-screensharing -->
# Utilisation en screenshare

Search Everything sert à plein de choses pendant un screenshare :

- **Trouver des fichiers précis :** par nom exact (des cheats connus comme `vape.exe`, `kurium.dll`) ou partiel avec des jokers (`*clicker*.exe`, `raven?.jar`).
- **Repérer l'activité récente (tri et filtres) :**
  - Trier par date de modification : c'est sans doute la fonction la plus utile. Trier toute la vue par "Date Modified" décroissante fait remonter en haut les fichiers récemment modifiés ou créés, ce qui permet de repérer vite ce qui vient de la session en cours (cheat téléchargé, archive extraite, log ou config récent). C'est souvent la vue par défaut des SSers.
  - Filtrer par date : `dm:today`, `dm:yesterday`, `dm:last7days`.
  - Filtrer par taille : `size:1mb..20mb`, une plage courante pour certains cheats.
  - Filtrer par extension : `ext:exe`, `ext:dll`, `ext:jar`, ou exclure avec `!ext:log`.
  - Combiner : `dm:today !ext:pf !ext:log size:>1mb path:downloads` (fichiers modifiés aujourd'hui, hors prefetch et logs, de plus de 1 Mo, dans Téléchargements).
- **Détecter les fichiers cachés ou bizarres :**
  - Noms en Unicode ou obfusqués : `regex:[^\x00-\x7F]` trouve les caractères non-ASCII.
  - Fichiers sans extension : le filtre `ext:` (attention à l'espace) sert à les isoler ; on peut combiner avec la taille, par exemple `size:1mb..25mb ext:`. C'est une technique pour cacher un exe lancé via WMIC ou un script.
  - Fichiers cachés ou système : `attrib:h`, `attrib:s`, ou `attrib:hs`.
- **Recherche dans le contenu (à utiliser avec parcimonie) :**
  - Chercher un texte dans les fichiers est très puissant mais bien plus lent, puisque ça lit le contenu.
  - Exemple : `content:"cheat_feature_flag" ext:cfg` cherche un réglage précis dans des fichiers de config.
  - Exemple (exe renommé) : `dm:today size:1mb..20mb !ext:exe !ext:dll content:"This program cannot be run in DOS mode."` cherche l'en-tête PE standard dans des fichiers récents qui ne sont ni exe ni dll — et peut révéler un exécutable déguisé.
- **Aperçu des fichiers :** `ALT+P` affiche un volet d'aperçu pour lire rapidement du texte, des images (et parfois des PDF) sans ouvrir le fichier dans son programme par défaut. Ça fait gagner du temps et évite de lancer quelque chose par accident.
- **Surveillance en direct :** comme Everything surveille le journal USN en temps réel (si le service tourne), il montre les créations, suppressions et renommages au moment où ils arrivent. Ça permet parfois de surprendre un joueur en train de supprimer des fichiers pendant le screenshare.
