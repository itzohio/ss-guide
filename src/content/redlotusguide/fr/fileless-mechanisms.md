<!-- route: /screensharing-general-knowledge/eighth-section-common-bypass-techniques-in-screensharing/fileless-malware-and-living-off-the-land-binaries/mechanisms-of-evasion -->
# Le mécanisme de l'évasion

- **Living-off-the-Land (LotL) :** les scripts tournent avec des interpréteurs de confiance intégrés à Windows (`powershell.exe`, `cmd.exe`, `cscript.exe`/`wscript.exe` pour le VBS, `mshta.exe` pour les HTA) ou couramment installés (`python.exe`, `AutoIt3.exe`). Comme ces interpréteurs sont légitimes, leur exécution déclenche moins facilement un antivirus basique qu'un `.exe` inconnu.
- **Exécution sans fichier (surtout PowerShell) :** PowerShell permet de télécharger et exécuter du code directement en mémoire, sans jamais toucher le disque. Les commandes encodées passent en ligne de commande (`powershell.exe -EncodedCommand ...`), ce qui réduit les artefacts.
- **Obfuscation :** un script est du texte, donc facile à brouiller :
  - Encodage (Base64, très courant en PowerShell).
  - Substitution ou concaténation de caractères.
  - Découpage de la logique en petites fonctions aux noms incompréhensibles.
  - Ajout de code inutile ou de commentaires. Tout ça gêne l'analyse statique et les simples recherches de chaînes.
- **Automatisation des tâches malveillantes :** les scripts enchaînent très bien les actions utiles à un bypass :
  - Désactiver des services de sécurité ou des mécanismes de journalisation (arrêter SysMain, vider les journaux avec `wevtutil`).
  - Supprimer des fichiers ou artefacts (Prefetch, historique du navigateur, logs de cheat, clés de registre avec `reg delete`).
  - Modifier des réglages système (attributs de fichiers, stratégies de registre).
  - Télécharger et exécuter un payload secondaire (`Invoke-WebRequest` en PowerShell ou `certutil.exe` appelé depuis un script).
- **Interaction avec les composants système :** les scripts parlent directement à des interfaces puissantes :
  - Les API Windows (via le .NET de PowerShell ou des objets COM).
  - WMI, pour interroger le système, changer la config ou exécuter à distance.
  - Les objets COM, pour dialoguer avec des applis et composants système.
  - Le .NET, pour des opérations complexes, de la manipulation mémoire ou du chargement d'assemblies.
- **Exploitation des HTA :** les HTML Applications (`.hta` exécutés par `mshta.exe`) lancent des scripts embarqués (VBScript, JScript) hors du bac à sable du navigateur, souvent avec plus de privilèges, et donc avec un accès direct au système. Ça sert de loader livré par le web ou par mail.
- **Automatisation AutoIt :** AutoIt est un langage légitime pour automatiser l'interface Windows. Les attaquants le détournent pour créer des macros évoluées, des autoclickers ou des bots qui simulent les entrées utilisateur. Les scripts AutoIt compilés (`.exe`) sont parfois plus difficiles à analyser que du texte.
