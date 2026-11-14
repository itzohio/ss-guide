<!-- route: /screensharing-general-knowledge/eighth-section-common-bypass-techniques-in-screensharing/environment-and-hardware-bypasses/virtual-machines -->
# Les machines virtuelles (VM)

- **Description :** une machine virtuelle permet de faire tourner un OS complet et séparé (l'OS "invité") dans une fenêtre, sur l'OS principal (l'hôte). VMware Workstation/Player, VirtualBox ou Hyper-V font ça.
- **Mécanisme et évasion :** l'idée est de faire tourner le jeu (Minecraft, par exemple) dans la VM et les cheats ou outils sur l'hôte. Quand le SSer se connecte en AnyDesk/TeamViewer à la VM, il ne voit rien de l'hôte et n'y a aucun accès. Les cheats qui tournent sur l'hôte sont totalement hors du champ du screenshare fait dans la VM.
- **Pourquoi les tricheurs font ça :** isoler complètement les outils de triche de l'environnement inspecté, ce qui rend les techniques classiques inutiles si le staffer ne sait pas qu'il est dans une VM.
- **Détection :** il est crucial de savoir si le screenshare se déroule dans une VM. Plusieurs méthodes :
  - Informations système (`msinfo32`) : vérifier les champs "Modèle du système" ou "Version/date du BIOS" pour "VMware", "VirtualBox", "Hyper-V" ou "Virtual Machine".
  - Processus et services : chercher ceux liés aux logiciels de virtualisation (`vmtoolsd.exe`, `VBoxService.exe`).
  - Matériel et pilotes : le Gestionnaire de périphériques peut montrer du matériel virtualisé (adaptateur VMware SVGA).
  - Clés de registre : certaines indiquent l'installation d'un logiciel de VM.
  - Outils dédiés (VMAware, par exemple) : ils détectent la virtualisation de façon plus fiable, même face à des tentatives de durcissement.
    - VMAware : une bibliothèque C++ et un outil en ligne de commande multiplateforme (Windows, macOS, Linux) conçus pour la détection complète de VM.
      - Capacités : plus de 115 techniques de détection, visant les hyperviseurs (VMware, VirtualBox, Hyper-V, QEMU), les émulateurs, les conteneurs et les bacs à sable. Il reste efficace face aux techniques de durcissement qui cachent l'environnement virtuel.
      - Utilisation : intégrable comme bibliothèque ou exécutable en ligne de commande. Il indique en général s'il détecte une VM, la marque ou le type probable, et un pourcentage de confiance.
      - Disponibilité : open source sur GitHub. Des binaires précompilés sont parfois dans les releases, sinon on compile.
      - Intérêt : en screenshare, ça donne une vérification plus solide que `msinfo32` ou la liste des processus, et augmente les chances de repérer un bypass par VM.
  - Règles serveur : à cause du potentiel d'évasion, la plupart des serveurs compétitifs interdisent explicitement de jouer ou de passer un screenshare dans une VM. Constater que le joueur est en VM pendant le check, souvent avec `msinfo32` ou un détecteur comme VMAware, suffit fréquemment à sanctionner sur cette seule règle.
