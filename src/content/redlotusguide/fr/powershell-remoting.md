<!-- route: /screensharing-general-knowledge/eighth-section-common-bypass-techniques-in-screensharing/powershell-remoting -->
# PowerShell à distance (Remoting)

- **Vue d'ensemble :** PowerShell Remoting est une fonction légitime de Windows, faite pour les admins système : elle permet de gérer des machines à distance en y exécutant des commandes et des scripts PowerShell via le réseau. Elle utilise WS-Management (Windows Remote Management, WinRM) pour communiquer.
- **Usage détourné pendant un screenshare :** ce n'est pas une méthode d'injection de cheat en soi, mais c'est un vecteur d'interférence externe possible si la machine du joueur a le Remoting activé et qu'un tiers a les identifiants et l'accès réseau. Un complice pourrait théoriquement s'en servir pour :
  - Exécuter discrètement des commandes qui suppriment des fichiers ou des clés de registre contenant des preuves pendant que le SSer regarde ailleurs.
  - Tuer des processus, comme le cheat que le SSer est sur le point de trouver, ou même ses outils (AnyDesk, System Informer).
  - Lancer des scripts qui modifient des réglages (réactiver un service désactivé, changer des permissions).
  - Démarrer des applis ou scripts discrets pour cacher ou gêner encore plus.
- **Pertinence et détection :** le risque réel pendant un screenshare classique est faible, sauf si le joueur a configuré un accès distant ou est en train de collaborer en direct avec quelqu'un. Mais ça reste bon à savoir :
  - Vérifier si le service WinRM tourne (`sc query WinRM`).
  - Vérifier les connexions réseau (System Informer ou `netstat -ano`) pour des connexions établies sur les ports WinRM (5985/5986 par défaut) venant de sources inattendues.
  - Les journaux PowerShell (si activés) peuvent montrer une exécution de commandes à distance.
  - Un arrêt inexpliqué des outils ou une suppression de fichiers pendant le SS peut, dans de rares cas complexes, faire penser à une interférence externe, même si les explications simples sont en général plus probables.
