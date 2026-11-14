<!-- route: /screensharing-minecraft-knowledge/sixth-section-mouse-macro-and-input-analysis-in-screensharing/3-debounce-time-analysis/general-detection-strategy -->
# Stratégie générale de détection

La détection passe donc par :

- **Identifier le modèle de souris :** déterminer le modèle exact utilisé par le joueur.
- **Vérifier le support logiciel :** savoir si ce modèle permet de régler le debounce via son logiciel (ce n'est pas le cas de toutes les souris gaming).
- **Inspecter les réglages du logiciel :** si le réglage existe, le regarder directement dans l'interface. Chercher des curseurs, listes ou cases liés à "Debounce Time", "Click Response Time" ou des termes proches.
- **Examiner les fichiers de config :** chercher dans les fichiers du logiciel (souvent les mêmes emplacements que pour les macros) les valeurs de debounce enregistrées. Mots-clés possibles : "debounce", "db_time", "click_latency", etc.
