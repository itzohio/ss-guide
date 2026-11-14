<!-- route: /screensharing-general-knowledge/seventh-section-manual-ss-techniques/process-hacker-system-informer-introduction-and-configuration/general-process-filtering-steps -->
# La méthode générale de filtrage des processus

La technique manuelle la plus courante avec System Informer en screenshare, c'est de chercher des chaînes précises dans la mémoire des processus clés. Le déroulé :

- **Trouver le processus cible :** repérer dans la liste celui qu'on veut analyser (`explorer.exe`, `javaw.exe`, `csrss.exe`, ou le `svchost.exe` d'un service comme DPS ou PcaSvc).
- **Ouvrir les propriétés :** clic droit sur le processus > Properties.
- **Aller dans la mémoire :** dans la fenêtre, onglet Memory.
- **Lancer la recherche :** cliquer sur le bouton Strings.
- **Régler les options :** une fenêtre de config s'ouvre.
  - Longueur minimale : ça filtre les chaînes trop courtes, souvent inutiles. 5 ou 6 est une bonne valeur. Trop bas (3), ça sort un bruit énorme ; trop haut, on rate des chaînes courtes intéressantes. (Les vieux guides disent 4, mais 5 ou 6 va mieux sur les systèmes modernes.)
  - Types de mémoire : cocher en général Mapped et Private. La case Image scanne l'image de l'exe en mémoire ; la décocher réduit le bruit des chaînes statiques du binaire, mais au début mieux vaut la laisser cochée pour ne rien rater.
  - Encodage : vérifier que Extended Unicode (UTF-16) est coché pour attraper les chaînes avec des caractères non-ASCII.
  - OK.
- **Filtrer :** la fenêtre Strings s'ouvre avec les résultats. Cliquer sur Filter (l'icône entonnoir).
  - Choisir le type :
    - Contains (insensible à la casse) : pour un mot-clé simple ("autoclicker", ".jar", le nom d'un cheat connu).
    - Regex (insensible à la casse) : pour un motif, par exemple un chemin `^[A-Z]:\\.+\\.exe$` ou un format de commande précis.
  - Taper le terme ou la regex et valider.

Point important : pendant que la recherche tourne (surtout sur un gros processus comme `explorer.exe`), il ne faut pas laisser le joueur appuyer sur Échap. Ça annule le filtrage et on peut rater une preuve. Cliquer sur une autre fenêtre, ou parfois garder Ctrl enfoncé pendant le dialogue, limite les dégâts.
