<!-- route: /screensharing-general-knowledge/eighth-section-common-bypass-techniques-in-screensharing/artifact-and-system-manipulation/disabling-system-features-via-registrygroup-policy -->
# Désactiver des fonctions Windows via le registre / les stratégies de groupe

- **Description :** Windows offre plein d'options de configuration via le registre et l'Éditeur de stratégies de groupe locales (`gpedit.msc`, dispo sur les éditions Pro/Enterprise). Un bypasser peut s'en servir pour désactiver ou modifier des fonctions système et gêner l'accès du SSer aux outils ou aux artefacts.
- **Mécanisme :** modifier des clés/valeurs de registre ou des stratégies de groupe. Les cibles courantes :
  - Désactiver le Program Compatibility Assistant (PCA) : valeurs `DisablePCA` sous `HKLM\SOFTWARE\Policies\Microsoft\Windows\AppCompat` ou `HKCU\Software\Policies\Microsoft\Windows\AppCompat`.
  - Bloquer l'invite de commandes : stratégie "Empêcher l'accès à l'invite de commandes" (Configuration utilisateur > Modèles d'administration > Système) ou la clé `HKCU\Software\Policies\Microsoft\Windows\System\DisableCMD` à `1` ou `2`.
  - Cacher des lecteurs dans l'Explorateur : valeur `NoDrives` sous `HKCU\Software\Microsoft\Windows\CurrentVersion\Policies\Explorer`, avec un masque de bits pour cacher certaines lettres de lecteur (elles restent accessibles par chemin direct).
  - Désactiver la boîte Exécuter : valeur `NoRun` dans la même clé de stratégies Explorateur, ce qui coupe Win+R.
  - Bloquer l'accès à l'éditeur du registre : stratégie "Empêcher l'accès aux outils d'édition du registre", qui bloque `regedit.exe`.
- **Pourquoi les tricheurs font ça :** gêner directement le SSer en désactivant des outils utilisés pendant les checks (`cmd.exe`, `regedit.exe`, la boîte Exécuter), cacher des emplacements de preuves (lecteurs masqués) ou empêcher certaines journalisations (PCA).
- **Détection :**
  - Vérifier les clés : aller voir les clés de stratégie ci-dessus dans `regedit` ou Registry Explorer.
  - Vérifier les stratégies : `gpresult /h gpreport.html` en CMD génère un rapport HTML des stratégies appliquées (locales et domaine). Chercher les restrictions.
  - Logs d'exécution : regarder les exécutions récentes de `regedit.exe` ou `reg.exe` dans Prefetch/BAM, ce qui peut indiquer un changement manuel récent.
  - Le comportement : tomber sur une fonction désactivée (CMD qui ne s'ouvre pas, boîte Exécuter bloquée) est une preuve immédiate que ces stratégies sont actives.
