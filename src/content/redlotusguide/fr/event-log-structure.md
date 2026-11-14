<!-- route: /screensharing-general-knowledge/fourth-section-common-windows-artifacts-and-their-basic-analysis/windows-event-logs-introduction/event-log-structure -->
# La structure des journaux d'événements (.evtx)

- **Format :** les journaux modernes (`.evtx`) utilisent un format binaire propriétaire basé sur XML, ce qui permet un stockage structuré et efficace.
- **Canaux :** Windows range les événements dans différents journaux, appelés canaux, selon leur source ou leur but. Ceux qu'on regarde le plus en screenshare :
  - Application : les événements des logiciels installés (hors OS). Les rapports d'erreur arrivent souvent là.
  - Sécurité : les événements liés à la politique d'audit : connexions réussies ou ratées, gestion des comptes, accès aux objets (si activé), changements de politique et, surtout, le vidage des journaux (ID 1102). Y accéder demande souvent les droits admin.
  - Système : les événements des composants Windows : démarrage et arrêt de services, chargement de pilotes, erreurs matérielles, changements d'heure (ID 4616) et vidage de journaux non sécurité (ID 104).
  - Setup : l'installation et la configuration des logiciels et des mises à jour Windows.
  - ForwardedEvents : dans les entreprises, pour collecter les événements venus d'autres PC.
  - Journaux Applications et services : une catégorie plus large avec des journaux précis par logiciel, service ou fonction Windows (Microsoft-Windows-TaskScheduler/Operational, Microsoft-Windows-PowerShell/Operational, Microsoft-Windows-Ntfs/Operational pour la suppression du journal USN…). Il faut savoir lequel peut contenir l'info cherchée.
