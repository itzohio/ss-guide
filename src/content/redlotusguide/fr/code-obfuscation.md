<!-- route: /screensharing-general-knowledge/eighth-section-common-bypass-techniques-in-screensharing/concealment-and-obfuscation/4-code-obfuscation -->
# L'obfuscation du code

- **Description :** ici on touche au code du cheat lui-même, pas juste à son nom ou à son emplacement. Les développeurs rendent volontairement le code source ou le bytecode difficile à lire, à comprendre et à rétro-ingénierer. C'est très courant sur les cheats distribués en mods Minecraft (`.jar`) ou en applications Java, mais ça s'applique aussi à d'autres langages compilés (C++, C#) et même à des scripts (encodage, renommage de variables…).
- **Mécanisme :** plusieurs techniques servent à brouiller le code :
  - Le renommage : les noms de classes, méthodes et variables deviennent courts ou aléatoires (`a.class`, `b()`, `zzXy_123`, `_a`, `_b`).
  - L'obfuscation du flot de contrôle : du code inutile, des prédicats opaques (des conditions qui donnent toujours le même résultat mais paraissent complexes), des boucles et conditions restructurées pour rendre la logique illisible.
  - Le chiffrement des chaînes : les textes en dur (interface, clés de config, noms de fonctions du cheat) sont chiffrés pour ne pas apparaître en clair dans l'analyse statique ou les scans mémoire.
  - Le packing/chiffrement : le gros du code est compressé ou chiffré dans un petit loader, qui le déchiffre en mémoire à l'exécution.
- **Pourquoi les tricheurs font ça :**
  - Contre l'analyse : compliquer la vie des SSers qui utilisent un décompilateur (Luyten, Recaf pour Java) ou un désassembleur. Déterminer la vraie fonction du code devient très long.
  - Contre le reverse engineering : protéger leur code ou leurs techniques des développeurs concurrents.
  - Éviter la détection par signature : le packing et le chiffrement changent la signature du fichier, ce qui peut passer à travers les détections par hash ou par motif des anticheat et des antivirus.
- **Détection :**
  - Décompilation/désassemblage : la méthode principale. Si le décompilateur sort un code illisible, bourré de noms sans sens ou avec les caractéristiques ci-dessus, c'est très probablement obfusqué.
  - Analyse d'entropie : un fichier packé ou chiffré a souvent une entropie élevée. Detect It Easy (DiE) ou VirusTotal la calculent ; au-delà de 7 sur 8, ça sent le packing.
  - Détection de packers : DiE a des signatures pour reconnaître les packers classiques (UPX, Themida, VMProtect).
  - Les règles du serveur : comme vérifier un code obfusqué pendant un screenshare est très long, beaucoup de serveurs interdisent purement et simplement les mods ou exécutables fortement obfusqués. Ne pas pouvoir déterminer ce que fait le code est un risque trop gros.
