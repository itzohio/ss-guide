<!-- route: /screensharing-minecraft-knowledge/fifth-section-specific-context-minecraft/minecraft-and-java/minecraft-architecture -->
# L'architecture de Minecraft (Java, JVM)

Minecraft est développé en Java, ce qui a de grosses conséquences sur son exécution :

- **La Java Virtual Machine (JVM) :** contrairement à beaucoup de jeux compilés en exécutable natif (`Game.exe`), Minecraft tourne dans une JVM, un environnement logiciel qui interprète et exécute le bytecode Java. Du coup, le processus du jeu visible dans le Gestionnaire des tâches ou System Informer ne s'appelle pas `minecraft.exe` : c'est une instance du runtime Java, en général `java.exe` (souvent pour les instances en ligne de commande ou serveur) ou, plus souvent pour le client graphique, `javaw.exe` (Java Windowed).
- **Identifier le processus :** quand on analyse les processus pendant un screenshare pour une activité Minecraft (recherche de chaînes en mémoire, analyse de modules), la cible est donc `javaw.exe` (ou `java.exe`), pas un processus nommé Minecraft. La première étape, c'est de repérer la bonne instance de `javaw.exe` (s'il y a plusieurs applications Java ouvertes).
