<!-- route: /advanced-explanation-of-artifacts/program-execution/amcache-syscache -->
# Amcache / Syscache

## But et fonctionnement

Le fichier `Amcache.hve` est une ruche de registre qui fait partie du framework de compatibilité applicative de Windows. Sa fonction principale : stocker des métadonnées sur les applications récemment exécutées, ce qui aide Windows à gérer les réglages de compatibilité et à suivre les installations. Le `Syscache.hve` est son prédécesseur fonctionnel, présent sur les systèmes plus anciens comme Windows 7.

Vue DFIR, Amcache est une mine d'or. Il donne un enregistrement persistant et historique des exécutions, qui survit souvent à la désinstallation et au nettoyage basique des artefacts. Il est particulièrement utile pour identifier un logiciel malveillant par ses propriétés intrinsèques, comme son hash, plutôt que par son nom.

## Emplacement et structure

`Amcache.hve` est une ruche autonome, pas une partie des ruches `SYSTEM` ou `SOFTWARE`. Elle est en général verrouillée quand Windows tourne, ce qui demande souvent des outils dédiés ou une analyse hors ligne.

- Emplacement (Windows 8/10/11) : `C:\Windows\AppCompat\Programs\Amcache.hve`
- Emplacement (Syscache sur Windows 7) : souvent dans System Volume Information, par exemple `C:\Windows\System32\config\RegBack\`, ou directement dans `C:\Windows\appcompat\Programs\`.

La ruche contient plusieurs clés, mais les données les plus intéressantes sont en général sous un chemin du type :

`Root\File\{Volume-GUID}\{File-Reference-Number}`

Chaque entrée correspond à un exécutable unique suivi par le système, avec un paquet de métadonnées.

## Métadonnées stockées

Une entrée Amcache donne une empreinte détaillée d'un programme exécuté, bien au-delà du nom :

- Chemin complet : le chemin du fichier au moment où il a été suivi pour la première fois.
- Taille du fichier : en octets.
- Hash SHA1 : le hash cryptographique du contenu. C'est sans doute la métadonnée la plus importante, parce qu'elle permet d'identifier un fichier de façon définitive, quel que soit son nom ou son emplacement.
- Horodatages :
  - Première exécution : souvent dérivée de la date de création d'un fichier de lien ou d'un autre déclencheur système, elle indique quand le programme est apparu sur la machine.
  - Dernière modification : la date de modification du fichier, telle qu'enregistrée dans son entrée MFT.
- Linker timestamp : l'horodatage de compilation intégré à l'en-tête PE de l'exécutable.
- Type de binaire : l'architecture (PE32, PE64…).
- Infos produit et version : extraites du bloc de ressources de version, comme le nom du produit, la société et la version du fichier.

## Valeur forensique

Amcache est un artefact très robuste pour prouver qu'un programme a existé et a tourné sur une machine, même si les autres traces ont disparu.

- **Persistance :** les entrées Amcache restent souvent longtemps après la désinstallation ou la suppression des fichiers. Ça donne un historique qui résiste aux nettoyages simples.
- **Identification par hash :** le SHA1 est sa grande force. Il permet d'identifier un exécutable malveillant connu (en comparant le hash sur VirusTotal, par exemple) même si l'utilisateur l'a renommé en quelque chose d'innocent (`notACheat.exe`).
- **Corrélation de timeline :** l'horodatage de dernière exécution est moins fiable que Prefetch ou BAM pour la toute dernière activité, mais les dates de première exécution et de dernière modification sont très utiles pour savoir quand un programme est arrivé sur le système et pour recouper avec d'autres événements.
- **Détection de manipulation :** Amcache est géré par des services système. Le fichier peut être supprimé, mais son absence là où il devrait exister, ou une modification récente, peut indiquer une activité anti-forensique.

#### Points de réflexion (SS Contest)

Pour un SSer, Amcache sert à retrouver les fantômes des cheats passés et à identifier formellement un exécutable déguisé.

- **Le contrôle d'identité ultime (SHA1) :** c'est le point clé. Si un joueur fait tourner un fichier suspect nommé `explorer.exe` sur son bureau, le SSer peut extraire son entrée Amcache et vérifier le SHA1 sur VirusTotal. Si le hash correspond à un cheat connu comme Vape ou Kurium, l'affaire est close, quel que soit le nom du fichier.
- **Déjouer les contournements par renommage :** Amcache est une des meilleures défenses contre le simple renommage. Il prouve que le fichier, identifié par son hash unique, était présent sur le système.
- **Preuve historique :** si un joueur affirme n'avoir "jamais utilisé ce cheat" et qu'une entrée Amcache existe, c'est une preuve historique solide du contraire. Ça ne prouve pas forcément un usage "in instance", mais c'est décisif pour les contrôles d'évasion de ban ou pour renforcer un dossier avec d'autres artefacts récents.
- **Corroboration :** trouver un programme dans Amcache confirme les résultats d'autres outils. Si un chemin suspect sort d'un dump mémoire System Informer, vérifier Amcache pour ce chemin ou le hash du fichier confirme son identité et son historique.
