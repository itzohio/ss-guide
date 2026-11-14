<!-- route: /screensharing-general-knowledge/seventh-section-manual-ss-techniques/windows-prefetch-analysis/understanding-prefetch -->
# Comprendre Prefetch

Comme vu plus haut, Prefetch est un mécanisme d'optimisation standard de Windows. Il surveille les accès aux fichiers lors du lancement d'un programme et stocke ces infos dans des fichiers dédiés. La fois suivante, Windows peut s'en servir pour charger les ressources en mémoire plus tôt, et donc démarrer plus vite.

- **Emplacement :** les données sont dans des fichiers `.pf` dans `C:\Windows\Prefetch`. L'accès demande en général les droits admin.
- **Nommage :** chaque `.pf` correspond à un exe lancé depuis un chemin précis, avec le modèle `NOM.EXE-HASH.pf`.
  - `NOM.EXE` : le nom de l'exécutable lancé (`NOTEPAD.EXE`, `JAVAW.EXE`…).
  - `HASH` : un hash hexa de 8 caractères calculé sur le chemin complet de l'exe. Du coup, lancer le même programme (`AnyDesk.exe`, par exemple) depuis deux endroits différents (Téléchargements et Bureau) crée deux `.pf` distincts.
- **Quand un `.pf` est créé :** en général, uniquement au lancement d'un `.exe`.
  - Lancer un `.jar` met à jour ou crée une entrée pour le runtime Java (`java.exe` ou `javaw.exe`) qui exécute le `.jar`.
  - Charger une `.dll` par injection ou normalement peut créer ou mettre à jour une entrée pour le processus hôte (`rundll32.exe`, `regsvr32.exe`, `dllhost.exe`) ou pour l'injecteur. On n'exécute pas une DLL directement, donc elle n'a pas son propre `.pf`.
