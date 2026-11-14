<!-- route: /advanced-explanation-of-artifacts/system-configuration-and-persistence/windows-event-logs -->
# Journaux d'événements Windows

### But et fonctionnement

Les journaux d'événements Windows sont le mécanisme de diagnostic et d'audit principal de l'OS. Ce sont des journaux standardisés tenus par Windows et les applications pour enregistrer les événements importants : erreurs, avertissements, messages d'information. Ils forment un journal chronologique détaillé de l'activité système, essentiel au dépannage, à l'audit de sécurité et à l'analyse forensique.

Vue DFIR, c'est une source indispensable de preuves horodatées et fiables pour une multitude d'activités système. Ils contiennent souvent le seul enregistrement de certaines actions utilisateur, manipulations de services et techniques anti-forensiques.

### Emplacement et structure

Les journaux modernes sont des fichiers XML binaires (`.evtx`), ce qui permet une journalisation structurée et extensible.

- Emplacement : `C:\Windows\System32\winevt\Logs\`

Windows organise les événements en journaux, appelés canaux, selon leur source ou leur but. Les canaux souvent examinés :

- **System :** événements des composants système, comme le démarrage et l'arrêt des services, les problèmes de pilotes, les changements d'heure.
- **Security :** événements liés à la sécurité selon la stratégie d'audit : connexions et déconnexions, gestion des comptes, changements de stratégie et, surtout, effacement de journaux. L'accès demande les droits admin.
- **Application :** événements des applications installées (crashes, erreurs).
- **Setup :** installation de logiciels et mises à jour Windows.
- **Applications and Services Logs :** une catégorie plus large avec des journaux spécifiques (`Microsoft-Windows-TaskScheduler/Operational`, `Microsoft-Windows-PowerShell/Operational`, `Microsoft-Windows-Ntfs/Operational`…).

Tout le système dépend du service Windows Event Log (`eventlog`). S'il est arrêté, plus rien n'est enregistré.

### Métadonnées et Event IDs clés

Chaque entrée est un enregistrement structuré avec :

- Event ID : le numéro qui identifie le type d'événement.
- Horodatage précis.
- Source : le composant qui a généré l'événement.
- Niveau : gravité (Information, Avertissement, Erreur, Critique).
- Utilisateur : le compte associé.
- Données : une description souvent XML avec noms de processus, chemins, codes d'erreur.

Il y a des milliers d'Event IDs, mais certains sont capitaux :

- Event ID 4624 (Security) : ouverture de session réussie.
- Event ID 4616 (Security) : changement d'heure système.
- Event ID 1102 (Security) : effacement du journal d'audit de sécurité. Indicateur majeur d'anti-forensique.
- Event ID 104 (System) : effacement d'un journal (autre que Security).
- Event ID 7036 (System) : un service passe en marche ou en arrêt (`SysMain`, `eventlog`…).
- Event ID 3079 (Application) : suppression du journal USN, souvent via `fsutil.exe`.

### Valeur forensique

Les journaux donnent un enregistrement fiable, généré par le système, difficile à manipuler sans laisser de traces.

- **Détecter l'anti-forensique :** un de leurs rôles critiques. Ils enregistrent explicitement l'effacement d'autres journaux (1102, 104), la suppression du journal USN (3079) et les changements d'heure (4616). Autant de preuves directes d'une tentative de masquage.
- **Suivre les manipulations système et services :** ils donnent la timeline des arrêts et démarrages de services critiques (comme `SysMain` pour Prefetch), à recouper avec l'exécution de logiciels malveillants.
- **Auditer l'activité utilisateur :** les connexions et déconnexions aident à établir quand un utilisateur était actif.
- **Corroborer :** un événement donne le contexte d'une autre preuve. Un Prefetch de `cmd.exe` peut être relié à un Event ID 4616 montrant que `cmd.exe` a initié un changement d'heure.

L'analyse se fait en général avec l'Observateur d'événements (`eventvwr.msc`), qui permet de filtrer et chercher. Pour du volume, on utilise `wevtutil.exe` ou des parseurs comme `EvtxECmd` d'Eric Zimmerman.

#### Points de réflexion (SS Contest)

Pour un SSer, les journaux sont l'arbitre ultime pour les bypass système. Ils prouvent la manipulation de façon indéniable.

- **Les journaux qui cafardent :** ils sont conçus pour rapporter leur propre manipulation. Un Event ID 1102 (journal Security effacé) ou 104 (autre journal effacé) est une preuve flagrante que le joueur a voulu effacer son historique.
- **Attraper le suppresseur de journal :** l'Event ID 3079 est direct et conclusif. Si un joueur supprime son journal USN pour cacher des suppressions ou remplacements de fichiers, l'événement est journalisé, ce qui transforme un bypass sophistiqué en infraction simple.
- **Exposer la manipulation de service :** un bypass courant consiste à arrêter le service `SysMain` pour empêcher la journalisation Prefetch. On vérifie le journal System pour un Event ID 7036 de la source "Service Control Manager", qui donne l'heure exacte de l'arrêt.
- **Prouver la manipulation de l'heure :** un joueur peut changer l'heure système pour brouiller l'analyse temporelle. L'Event ID 4616 note le changement et souvent le processus qui l'a initié. Un changement d'heure par `cmd.exe` indique clairement une action manuelle.
