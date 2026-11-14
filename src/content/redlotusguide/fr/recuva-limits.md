<!-- route: /screensharing-general-knowledge/seventh-section-manual-ss-techniques/recuva/limitations -->
# Les limites

- **L'écrasement :** la limite principale. Si les secteurs où étaient les données du fichier supprimé ont été réécrits (ce qui arrive en permanence sur un système actif), la récupération est en général impossible. Plus le temps passe et plus le disque travaille, moins il y a de chances.
- **Les outils de suppression sécurisée :** un fichier effacé avec un outil de "secure delete" ou de shredder (qui écrase volontairement les données plusieurs fois) ne se récupère pas avec Recuva.
- **Les SSD :** la récupération est souvent moins fiable que sur un HDD à cause de TRIM. TRIM permet à l'OS d'indiquer au SSD quels blocs ne sont plus utilisés (après une suppression), et le contrôleur du SSD peut les effacer en interne pendant les périodes d'inactivité pour garder les performances. Ce nettoyage peut rendre les données irrécupérables très vite. Le taux de réussite varie beaucoup selon le modèle de SSD, le firmware, la version de Windows et le temps écoulé depuis la suppression.

Recuva peut parfois apporter la preuve d'un cheat supprimé, mais son succès est très variable et jamais garanti. C'est un outil à essayer, surtout quand on soupçonne des suppressions, mais il ne faut pas en faire une méthode de détection principale.
