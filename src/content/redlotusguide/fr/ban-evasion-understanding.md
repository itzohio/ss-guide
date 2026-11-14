<!-- route: /screensharing-general-knowledge/ban-evasion-and-alt-account-detection/understanding-ban-evasion -->
# Comprendre l'évasion de ban

L'évasion de ban regroupe plusieurs tactiques pour contourner un ban. Savoir comment elles marchent aide le SSer à savoir quoi chercher :

- **Les comptes alternatifs ("alts") :** la méthode la plus courante. Le joueur utilise un autre compte de jeu (acheté ou emprunté) après le ban de son compte principal. La détection repose sur le lien entre la session ou la machine actuelle et l'identité bannie.
- **Le changement d'identifiants matériels (HWID spoofing) :** certains serveurs bannissent par HWID, en liant le ban au compte mais aussi à des identifiants tirés du matériel (CPU, carte mère, adresse MAC, numéros de série des disques…). Pour contourner :
  - Utiliser un autre ordinateur.
  - Employer un logiciel de "HWID spoofer" qui modifie ou intercepte les infos matérielles remontées par le système ou le client. Détecter un spoofer passe souvent par la recherche de processus, pilotes ou modifications système spécifiques.
- **Les machines virtuelles :** comme vu plus haut, faire tourner le jeu dans une VM cache le vrai matériel de l'hôte aux systèmes de détection HWID qui tournent dans l'OS invité.
- **Le changement d'adresse IP :** VPN, proxy ou simple nouvelle IP (si l'adresse est dynamique) permettent d'échapper aux bans ou à la surveillance par IP. Détecter un VPN ou un proxy passe par les processus en cours, la table de routage (`route print`) ou l'analyse des connexions vers des IP non résidentielles.
