<!-- route: /screensharing-general-knowledge/fourth-section-common-windows-artifacts-and-their-basic-analysis/windows-event-logs-introduction/event-viewer -->
# L'Observateur d'événements (eventvwr.msc)

- **Rôle :** c'est l'outil graphique intégré à Windows pour parcourir, chercher, filtrer et gérer les journaux d'événements.
- **Accès :** via Win+R puis `eventvwr` ou `eventvwr.msc`, ou en cherchant "Observateur d'événements".
- **Utilisation de base :** un arbre à gauche pour naviguer entre les canaux (sous "Journaux Windows" et "Journaux des applications et des services"). Les fonctions importantes :
  - Voir le détail d'un événement (description, source, ID, utilisateur, heure).
  - Trier par colonne (date, niveau, ID…).
  - Filtrer : c'est le plus important pour aller vite. On peut filtrer par période ("Dernière heure", "Dernières 24 heures"), par niveau (Critique, Erreur, Avertissement, Information), par ID précis (`4616`, `1102`, `3079`), par mot-clé dans la description, par compte utilisateur ou par source.
- **Attention :** un journal contient énormément d'entrées. Parcourir sans objectif précis (un ID connu lié à un bypass suspecté, par exemple) prend un temps fou pour rien. Il faut savoir ce qu'on cherche en fonction du contexte. Les ID cités plus haut (4616, 1102, 3079, 104, 4798) sont les recherches ciblées typiques en screenshare.
