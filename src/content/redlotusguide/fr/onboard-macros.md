<!-- route: /screensharing-minecraft-knowledge/sixth-section-mouse-macro-and-input-analysis-in-screensharing/2-macro-analysis/detecting-on-board-macros -->
# Détecter les macros embarquées

Les macros embarquées sont stockées dans la mémoire interne de la souris et fonctionnent même si le logiciel du fabricant n'est pas lancé ni installé. Pour les détecter, il faut observer le comportement des entrées de la souris en temps réel, pas juste les fichiers du PC.

Identifier le modèle de souris (première étape, cruciale)

Connaître le modèle exact est indispensable avant de tester : ça permet de savoir combien de boutons physiques la souris a et à quoi ils servent par défaut. Beaucoup de souris gaming ont des boutons en plus des classiques gauche, droit, molette, avant, arrière (boutons "sniper", changement de DPI, changement de profil, parfois appelés "Fire Keys"). Ne pas en tenir compte mène à des interprétations fausses pendant le test. Pour identifier le modèle :

- Demander au joueur (si les règles du serveur l'autorisent).
- Réglages Windows : Bluetooth et appareils > Appareils > Souris (ou l'équivalent selon la version). Le nom listé contient souvent le modèle.
- Gestionnaire de périphériques : "Souris et autres périphériques de pointage", propriétés, puis les Hardware IDs à chercher en ligne.
- Outils d'historique USB : USBDeview (Nirsoft) ou l'alternative USB d'Echo listent les appareils connectés avec leurs noms et IDs.
- Confirmation visuelle (si autorisé et faisable) : si les règles du serveur et la coopération du joueur le permettent, demander une photo ou une vidéo de la souris via Discord ou Telegram peut être décisif.

Procédure de test des boutons

- **Utiliser un testeur de boutons fiable :** un outil en ligne complet. Des sites comme cpstest.org/mouse-test/ ou cps-check.com/mouse-buttons-test sont souvent recommandés, parce qu'ils détectent plus de boutons (y compris les boutons latéraux et du dessus) que les menus de raccourcis du jeu ou les réglages Windows basiques.
- **Guider le joueur :** lui demander clairement d'appuyer physiquement sur chaque bouton de sa souris, un par un : les boutons latéraux, ceux du dessus (sauf peut-être les boutons dédiés au cycle DPI, sauf suspicion) et les boutons standards.
- **Observer attentivement :** surveiller la sortie du testeur pendant que le joueur appuie.
- **Repérer les incohérences (condition d'échec / signal) :** le marqueur d'une macro embarquée, c'est une incohérence répétée entre le bouton pressé et celui enregistré par l'outil. Par exemple :
  - Le joueur presse le bouton latéral "Avant", mais le testeur voit un "clic gauche".
  - Le joueur presse un bouton du dessus (une "Fire Key"), mais le testeur voit un "clic gauche".
  - Et ça se répète plusieurs fois de suite sur ce bouton précis.
- **Pourquoi ça se détecte :** pour stocker et déclencher une macro dans la mémoire de la souris, il faut en général reprogrammer un bouton physique dans le firmware pour exécuter la séquence au lieu de sa fonction normale ("Avant", "Arrière"). Ce bouton "sacrifié" devient le déclencheur de la macro de clics rapides, d'où l'incohérence observée.

TRÈS IMPORTANT : le protocole des deux tests

Il est absolument essentiel de faire toute la procédure de test deux fois, dans des conditions légèrement différentes :

- **Test 1, logiciel OUVERT :** faire le premier test avec le logiciel de la souris (G HUB, Synapse, Swarm…) ouvert et lancé (visible dans la barre des tâches, la zone de notification ou les processus).
- **Test 2, logiciel FERMÉ :** faire le second test seulement après avoir complètement fermé et tué le logiciel. Vérifier que le processus principal est bien terminé dans le Gestionnaire des tâches et qu'il ne tourne pas encore en réduit dans la zone de notification.

Pourquoi deux tests : certaines souris gaming (surtout certains modèles ou firmwares) privilégient les réglages du logiciel lancé sur ceux de la mémoire interne. Quand le logiciel tourne, il peut neutraliser les macros stockées sur la souris. Ce n'est qu'une fois le logiciel fermé que la souris repasse sur ses profils internes. Une macro embarquée peut donc n'être visible que pendant le second test. Ne pas faire les deux tests, c'est risquer de laisser passer une macro embarquée.
