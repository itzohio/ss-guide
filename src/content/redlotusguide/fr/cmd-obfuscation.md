<!-- route: /screensharing-general-knowledge/eighth-section-common-bypass-techniques-in-screensharing/artifact-and-system-manipulation/command-prompt-obfuscation -->
# Obfusquer l'invite de commandes

- **Description :** cette technique n'empêche pas les commandes de s'exécuter, elle cache visuellement ce qui est tapé ou affiché dans la fenêtre `cmd.exe` pendant le screenshare.
- **Mécanisme :** on bricole les propriétés de la fenêtre CMD :
  - Transparence : mettre l'opacité presque à zéro, la fenêtre devient quasi invisible.
  - Couleurs identiques : mettre la couleur du texte identique à celle du fond (texte noir sur noir, ou blanc sur blanc). Les commandes et la sortie deviennent invisibles.
- **Pourquoi les tricheurs font ça :** cacher ce qu'ils font en CMD (lancer un script de nettoyage, un cheat, supprimer des fichiers avec `del`) pour que le SSer ne le voie pas en direct, en espérant qu'il ne regardera pas les autres logs.
- **Détection :**
  - Vérifier les propriétés de la fenêtre : si un CMD semble bloqué ou vide, clic droit sur la barre de titre > Propriétés > onglet Couleurs. Vérifier si le texte et le fond ont la même couleur, ou si l'opacité est anormale. Remettre les couleurs par défaut révèle le texte.
  - Les logs parallèles : ça ne touche que l'affichage. Les commandes peuvent rester ailleurs :
    - L'historique PowerShell (`ConsoleHost_history.txt`) si les commandes sont passées par PowerShell.
    - Certains journaux d'événements (création de processus, ID 4688, si activé avec les lignes de commande).
    - Les traces laissées par les commandes elles-mêmes (Prefetch pour les programmes lancés via CMD, entrées du journal USN pour les fichiers supprimés avec `del`).
