<!-- route: /screensharing-general-knowledge/seventh-section-manual-ss-techniques/specific-processes-to-analyze-and-search-patterns/2-csrssexe -->
# csrss.exe (Client Server Runtime Subsystem)

- **Rôle :** processus critique de Windows : il gère les fenêtres console (comme l'invite de commandes), crée et détruit des threads, et s'occupe d'une partie du sous-système graphique. Comme il bosse très bas niveau, sa mémoire contient souvent les chemins des fichiers exécutés (`.exe`) et des bibliothèques chargées (`.dll`).
- **Accès :** c'est un processus protégé. Pour lire sa mémoire, il faut les droits admin et le pilote noyau activé dans System Informer. Les antivirus mettent parfois le bazar, et l'accès peut être bloqué sur des systèmes très verrouillés. Il y a en général deux instances de `csrss.exe`.
- **Logique de filtrage (deux instances) :**
  - Pour trouver les `.exe` exécutés (extensions normales), on analyse l'instance avec le moins de private bytes.
  - Pour trouver les `.dll` chargées ou injectées, ou des `.exe` avec une extension maquillée, on analyse l'instance avec le plus de private bytes.
- **Motifs courants (regex, insensible à la casse) :**
  - `^[A-Z]:\\.+.exe$` : chemins complets finissant en `.exe`. Surtout sur l'instance avec le moins de private bytes.
  - `^[A-Z]:\\.+.dll$` : chemins finissant en `.dll`. Surtout sur l'instance avec le plus de private bytes. Indispensable pour les injections de DLL classiques. Faire gaffe aux DLL non signées trouvées comme ça.
  - `^(?:\\\\)?[A-Za-z]:\\.+$` : motif plus large, chemins complets avec ou sans extension. Utile sur l'instance la plus grosse pour les exécutables déguisés (`.tmp`, `.png`) ou lancés sans extension. Aide aussi à trouver des DLL.
