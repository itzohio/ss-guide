<!-- route: /screensharing-general-knowledge/ninth-section-more-artifact-analysis-for-screensharing/srum-analysis -->
# Analyse du SRUM (System Resource Usage Monitor)

Souvent appelé "mine d'or" de l'analyse, le System Resource Usage Monitor (SRUM) fournit un historique étendu de l'activité des processus et du réseau. Actif depuis Windows 8, SRUM utilise une base Extensible Storage Engine (ESE) nommée `SRUDB.dat`, dans `C:\Windows\System32\sru\`. Cette base logge des métriques d'usage détaillées sur une période glissante, en général 30 à 60 jours.

SRUM suit énormément d'infos utiles :

- **Historique d'exécution :** les processus qui ont tourné, avec nom, chemin et le SID de l'utilisateur. Ça donne un historique plus long que Prefetch ou BAM pour certaines instances.
- **Activité réseau :** les données échangées (octets envoyés et reçus) par application et par interface, ainsi que la durée des connexions. Très utile pour repérer une application qui communique, et donc potentiellement un cheat, un loader ou un C2.
- **Consommation de ressources :** temps CPU (premier plan et arrière-plan), I/O disque (lectures/écritures) et autres métriques par application.
- **Notifications push :** la table `PushNotifications` garde des détails sur les notifications, avec l'AppID responsable et les dates, ce qui aide parfois à attribuer une activité à une application précise, comme un lanceur de cheat.
- **Temps d'utilisation :** les données `AppTimelineProvider` suivent le temps où l'application était au premier plan, utile pour recouper avec les périodes d'activité du joueur.

Comme les données sont riches et profondes dans le temps, l'analyse SRUM révèle souvent des preuves d'exécution, de communication réseau ou de rythme d'activité qui persistent longtemps après le nettoyage d'artefacts plus volatils. L'outil standard pour lire `SRUDB.dat` est SrumECmd (Eric Zimmerman) : il exporte les tables en CSV, à analyser ensuite dans Timeline Explorer pour filtrer, trier et croiser par date, utilisateur, application ou réseau. Attention, certains horodatages du SRUM sont en format Epoch et demandent une conversion pour être lisibles.
