<!-- route: /screensharing-general-knowledge/eighth-section-common-bypass-techniques-in-screensharing/environment-and-hardware-bypasses/cloud-storage -->
# Le stockage cloud (OneDrive, Google Drive, etc.)

- **Description :** les services de stockage cloud synchronisent des fichiers entre le compte en ligne et un dossier local sur le PC. Les fichiers de ces dossiers existent donc en local et dans le cloud.
- **Mécanisme et évasion :** un cheat ou des fichiers liés peuvent être placés dans un dossier synchronisé (le dossier OneDrive local, par exemple). Le bypass vient de la manipulation à distance : un complice (ou le joueur depuis son téléphone ou un second PC connecté au même compte) peut supprimer, modifier ou remplacer le fichier via l'interface web ou un autre appareil synchronisé pendant le screenshare. Selon la vitesse du client de synchronisation, le fichier peut disparaître ou changer sur le disque local avec peu de logs, ou des logs décalés, ce qui peut perdre le SSer.
- **Ce qu'il faut vérifier :**
  - Les dossiers cloud classiques : inspecter `C:\Users\%username%\OneDrive`, Google Drive, Dropbox, etc., pour des fichiers suspects ou des modifications récentes.
  - Dates et journal : analyser les dates des fichiers de ces dossiers. Le journal USN logge les changements faits en local par le client de synchro (créations, suppressions, écrasements) : chercher une activité récente et inexpliquée sur des fichiers suspects dans ces dossiers.
  - Logs du client de synchro : l'application de synchronisation tient parfois des logs locaux détaillant les opérations, ce qui peut montrer une suppression ou une mise à jour venue du cloud (l'emplacement varie selon le service).
  - C'est moins courant que les autres méthodes, mais ça reste un vecteur de manipulation possible, surtout dans des scénarios coordonnés.
