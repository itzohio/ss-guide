<!-- route: /screensharing-general-knowledge/eighth-section-common-bypass-techniques-in-screensharing/permission-and-inheritance-modification/using-cacls-for-permission-changes -->
# Changer les permissions avec cacls (et équivalents)

- **Description :** utiliser des utilitaires en ligne de commande pour modifier directement les listes de contrôle d'accès (ACL), donc les permissions des fichiers ou dossiers. `cacls` est l'ancienne commande, `icacls` est la version moderne et plus complète, et PowerShell propose `Get-Acl` et `Set-Acl`.
- **Mécanisme :** le bypasser lance des commandes pour accorder ou, plus souvent, refuser des permissions à certains comptes sur des objets ciblés.
  - Exemple classique (bypass Prefetch) : modifier les permissions de `C:\Windows\Prefetch`. En refusant l'écriture au compte `SYSTEM` ou à un compte de service (SysMain, par exemple) avec `icacls`, le système ne peut plus créer de `.pf` ni les mettre à jour. Le dossier reste visible, mais la journalisation est cassée en silence. La commande ressemble à `icacls C:\Windows\Prefetch /deny SYSTEM:(WD)` (refus d'écriture des données) ou une variante.
  - Cacher des dossiers : refuser au compte du SSer (ou au groupe `Users`) le droit de lister le contenu ou de lire un dossier le rend invisible dans l'Explorateur, même avec l'affichage des fichiers cachés activé.
- **Pourquoi les tricheurs font ça :** couper un artefact de journalisation (Prefetch) sans arrêter le service, ou cacher des dossiers de cheats au regard pendant le screenshare.
- **Détection :**
  - Vérifier les paramètres de sécurité : inspecter les permissions des dossiers suspects (surtout `C:\Windows\Prefetch`). Clic droit > Propriétés > onglet Sécurité > Avancé. Chercher des refus explicites, des permissions manquantes (l'écriture de SYSTEM sur Prefetch, par exemple) ou un propriétaire inhabituel.
  - Journal USN (`$UsnJrnl`) : un changement de permissions génère un `SECURITY_CHANGE` sur le chemin concerné. Des `SECURITY_CHANGE` récents sur des emplacements critiques comme `C:\Windows\Prefetch` indiquent fortement une manipulation.
  - Logs de commandes : chercher des exécutions de `icacls.exe`, `cacls.exe` ou de commandes PowerShell (`Set-Acl`) dans Prefetch, BAM ou l'historique.
