<!-- route: /screensharing-general-knowledge/ninth-section-more-artifact-analysis-for-screensharing/detect-it-easy -->
# Detect It Easy (DiE)

Detect It Easy (DiE) est un utilitaire gratuit et polyvalent, fait surtout pour identifier le type d'un fichier et analyser la structure des exécutables, avec un focus sur les PE (Portable Executable) de Windows (`.exe`, `.dll`, `.sys`…), mais il gère aussi l'ELF (Linux) et le Mach-O (macOS). Il aide à comprendre comment un fichier a été compilé, quel packer ou protecteur a pu être utilisé, et quelles ressources ou dépendances il contient.

Ses fonctions utiles en screenshare :

- **Détection de packer/protecteur/compilateur :** DiE a une grosse base de signatures pour reconnaître les packers courants (UPX, Themida, VMProtect, Aspack…), les protecteurs (Safeguard, Enigma), les compilateurs (MS Visual C++, Delphi, GCC) et les linkers. Repérer un packer, surtout un packer commercial balèze comme Themida ou VMProtect, sur un exe inconnu est très suspect : c'est souvent utilisé pour obfusquer malware et cheats.
- **Analyse de la structure PE :** examen détaillé des en-têtes (DOS, NT, optionnel), des sections (`.text`, `.data`, `.rsrc`…), de la table d'imports (les DLL et fonctions utilisées), de la table d'exports (les fonctions fournies, utile pour les DLL) et des ressources. Des anomalies de structure (noms de sections bizarres, point d'entrée non standard) indiquent une modification ou du packing.
- **Extraction de chaînes :** DiE sort les chaînes ASCII et Unicode. Les lire révèle parfois des noms de fonctions internes, des commentaires de développeur, des messages d'erreur, des clés de config, des URL, ou des mots-clés liés à la triche (`aimbot`, `esp`, `hwid`) ou à l'anti-analyse (`VirtualBox`, `Debugger`).
- **Calcul d'entropie :** il calcule et affiche souvent l'entropie du fichier et de chaque section, ce qui aide à repérer les sections packées ou chiffrées (voir plus haut).
- **Visionneuse de dépendances :** la table d'imports montre quelles DLL système (`kernel32.dll`, `user32.dll`) et quelles DLL non standard l'exe utilise. Des imports liés à la manipulation mémoire (`WriteProcessMemory`), au hooking (`SetWindowsHookEx`) ou à la détection de debugger (`IsDebuggerPresent`) mettent la puce à l'oreille.
- **Analyser un fichier qui ne s'exécute pas :** si un exe suspect refuse de se lancer pendant un screenshare ou se ferme aussitôt (peut-être parce qu'il a détecté AnyDesk), DiE permet d'analyser sa structure, ses chaînes, ses imports et son packer sans l'exécuter, et parfois de comprendre son but ou de confirmer sa nature malveillante.

DiE est donc un outil d'analyse statique précieux : il aide à disséquer un exécutable pour repérer l'obfuscation, les dépendances louches, les chaînes intégrées et les indices structurels de malveillance ou de triche.
