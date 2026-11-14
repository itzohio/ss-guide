<!-- route: /screensharing-general-knowledge/seventh-section-manual-ss-techniques/journal-analysis/application-in-screensharing -->
# L'utilisation en screenshare

Analyser le journal USN est indispensable pour dénicher des activités cachées et confirmer des opérations sur les fichiers :

- **Suivre la vie d'un fichier :** voir la séquence exacte des événements — création, renommage éventuel (avec l'ancien et le nouveau nom), modification (`DATA_OVERWRITE`/`EXTEND`, changements d'attributs via `BASIC_INFO_CHANGE`), puis suppression (`FILE_DELETE`). C'est essentiel pour reconstituer l'histoire d'un fichier suspect.
- **Prouver une suppression :** le journal donne la preuve et l'heure exacte d'une suppression. Très utile pour confirmer qu'un cheat, un log (`.log`), un Prefetch (`.pf`), une macro (`.xml`, `.json`, certaines extensions) ou n'importe quoi d'autre a été supprimé juste avant ou pendant le screenshare.
- **Repérer un renommage :** voir si un fichier suspect (`cheat.exe`) a été renommé en quelque chose d'innocent (`notes.txt`). Chercher les paires `RENAME_OLD_NAME` et `RENAME_NEW_NAME` avec le même horodatage et le même FRN mais des noms différents.
- **Détecter la manipulation d'attributs :** le code `BASIC_INFO_CHANGE` sert à repérer :
  - Les tentatives de timestomping : changer les horodatages d'un fichier génère cet événement.
  - Le contournement par attribut lecture seule : mettre cet attribut sur des artefacts comme les `.pf` pour empêcher la mise à jour des dates déclenche aussi cet événement. Un `BASIC_INFO_CHANGE` sur des `.pf`, c'est très suspect.
- **Suivre les modifications de données :** `DATA_OVERWRITE` ou `DATA_EXTEND` indiquent un changement de contenu, ce qui peut coller avec de l'édition hexadécimale ou une sauvegarde de config de cheat.
- **Détecter JnativeHook :** voir des `JnativeHook*.dll` créés (`FILE_CREATE`) puis supprimés (`FILE_DELETE`) dans `%temp%` via le journal, c'est un bon indice qu'un autoclicker Java a tourné.
- **Vérifier les affirmations et recouper :** le journal sert à confirmer ou contredire ce que montrent les autres outils. Si LastActivityView affiche un accès récent à un fichier qui n'existe plus, le journal doit normalement montrer le `FILE_DELETE` correspondant.
