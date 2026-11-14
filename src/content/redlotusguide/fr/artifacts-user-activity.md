<!-- route: /advanced-explanation-of-artifacts/user-activity-and-knowledge -->
# Activité et connaissances de l'utilisateur

Les chapitres précédents parlaient des preuves laissées par les programmes et le système de fichiers. Ici, on s'intéresse à l'utilisateur lui-même. Les artefacts de ce chapitre donnent une fenêtre sur les actions directes, les intentions et les connaissances de la personne qui utilise la machine. Ils aident à répondre à d'autres questions que la simple exécution : qu'a fait l'utilisateur ? Où a-t-il regardé ? Qu'a-t-il téléchargé ? Quelles commandes a-t-il tapées ?

Comprendre ces artefacts est essentiel pour raconter un incident en entier. Ça permet de passer de "j'ai trouvé un fichier suspect" à "l'utilisateur savait ce qu'il faisait en le lançant". On va suivre les miettes laissées par les interactions du quotidien : navigation dans les dossiers, navigation web et ligne de commande.

Au programme :

- Shellbags : des clés de registre qui suivent l'historique de navigation d'un utilisateur dans ses dossiers, et prouvent qu'il avait "connaissance de" et a accédé à des dossiers précis, même s'ils sont vides ou supprimés aujourd'hui.
- Historique des commandes PowerShell : un journal en texte brut de chaque commande tapée dans la console PowerShell, qui donne une vue directe de l'administration manuelle et des éventuelles activités anti-forensiques.
- Fichiers temporaires : le contenu de `%temp%`, qui peut révéler des archives récemment extraites ou des fichiers de bibliothèque précis comme `JnativeHook`, typiques de certaines applications.

En analysant ces artefacts, une enquête peut retrouver le contexte autour d'un fichier malveillant, remonter à son téléchargement et exposer les commandes utilisées pour l'exécuter ou le cacher. C'est ce qui transforme une collection de données techniques en une histoire cohérente.
