<!-- route: /advanced-explanation-of-artifacts/program-execution/userassist -->
# UserAssist

### But et fonctionnement

UserAssist, c'est un ensemble de clés de registre dans le profil de chaque utilisateur, qui fait office de liste MRU (Most Recently Used) pour les applications lancées via le shell graphique Windows (menu Démarrer, Bureau, Explorateur). Son but système : remplir les listes de programmes fréquents pour personnaliser l'expérience.

Vue DFIR, UserAssist est une source précieuse pour savoir quelles applications graphiques un utilisateur précis a lancées, combien de fois, et quand pour la dernière fois. Ça donne une vision centrée utilisateur de l'historique d'exécution.

### Emplacement et structure

Les données UserAssist sont dans la ruche `NTUSER.DAT` de l'utilisateur courant. On les trouve aussi dans `UsrClass.dat` sur les Windows récents.

- Emplacement : `HKEY_CURRENT_USER\Software\Microsoft\Windows\CurrentVersion\Explorer\UserAssist\`

Dans cette clé, il y a en général deux sous-clés ou plus, chacune identifiée par un GUID correspondant à un type de programme ou de raccourci :

- `{CEBFF5CD-ACE2-4F4F-9178-9926F41749EA}` : suit l'exécution des `.exe` et des éléments système.
- `{F4E57C4B-2036-45F0-A9AB-443BCFE33D9F}` : suit l'exécution des `.lnk` (raccourcis).

Dans chaque clé GUID, une sous-clé `Count` contient les valeurs où se trouvent les vraies données forensiques.

### Encodage et métadonnées

Particularité de UserAssist : les données sont encodées en ROT-13, un simple chiffrement par substitution de lettres. Les noms des valeurs sont les chemins ou noms des programmes exécutés, encodés en ROT-13. Il faut un outil dédié pour les décoder.

Une fois décodée, chaque entrée donne :

- **Nom de l'exécutable ou du raccourci :** le programme lancé, avec le chemin complet possible pour les éléments lancés depuis un emplacement précis.
- **Run Count :** le nombre total de fois où le programme a été exécuté par l'utilisateur.
- **Dernière exécution :** un horodatage `FILETIME` de la dernière fois.
- **Focus Time/Count (Windows 10+) :** les versions récentes peuvent aussi noter combien de temps l'application est restée au premier plan et combien de fois elle y est revenue.

### Valeur forensique

UserAssist permet de dresser un profil d'usage des applications d'un utilisateur. Son intérêt :

- **Preuve liée à l'utilisateur :** les données sont dans la ruche privée de l'utilisateur, ce qui relie directement l'exécution à un compte précis. Important en environnement multi-utilisateurs.
- **Timeline historique :** il donne un historique des lancements, avec un compteur qui aide à voir les habitudes.
- **Preuve d'exécution :** il prouve directement qu'un utilisateur a lancé une application graphique, en complément de Prefetch et BAM.
- **Détection d'anti-forensique :** les clés UserAssist sont une cible classique des utilitaires de nettoyage (CCleaner, par exemple) et des suppressions manuelles. Les trouver vides sur un système clairement utilisé tous les jours, ou voir qu'elles ont été supprimées récemment (avec un parseur de registre), est un fort indicateur de tentative de masquage.

À noter : UserAssist suit surtout les programmes lancés via l'interface graphique. Une application lancée uniquement en ligne de commande peut ne pas créer d'entrée.

#### Points de réflexion (SS Contest)

Pour un SSer, UserAssist donne du contexte sur les habitudes d'un utilisateur et peut corroborer les autres artefacts d'exécution.

- **Preuve complémentaire :** si Prefetch et BAM montrent un `.exe` suspect, une entrée UserAssist correspondante confirme que le lancement a été fait via l'interface, donc directement par l'utilisateur.
- **Le Run Count comme indicateur :** un compteur élevé sur un cheat ou un outil suspect démolit l'excuse du "je l'ai lancé une fois par erreur". Ça montre un usage répété.
- **Suivre les cheats renommés :** UserAssist note le nom de l'exécutable au moment du lancement. Si un tricheur lance `vape.exe` puis le renomme `homework.exe`, l'entrée UserAssist pointe toujours vers `vape.exe`, avec le nom d'origine.
