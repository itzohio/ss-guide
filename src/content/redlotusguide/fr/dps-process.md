<!-- route: /screensharing-general-knowledge/seventh-section-manual-ss-techniques/specific-processes-to-analyze-and-search-patterns/4-svchostexe -->
# svchost.exe (-s dps) (Diagnostic Policy Service)

- **Rôle :** officiellement, il diagnostique les problèmes système (surtout réseau), mais le Diagnostic Policy Service logge souvent des infos sur les processus exécutés : chemins, et parfois les dates de compilation gravées dans l'en-tête de l'exe.
- **Trouver le processus :** repérer l'instance de `svchost.exe` qui héberge le service "DPS".
- **Motifs courants (regex, insensible à la casse) :**
  - `^([a-zA-Z]:\\.+)\\?$` : motif large qui révèle souvent les chemins complets des `.exe` exécutés. Les chaînes autour contiennent parfois la date de compilation.
  - `^!![A-Z]((?!Exe).)*$` : cible les chemins loggés par DPS qui ne finissent pas par `.exe`, pour attraper les exécutables renommés ou sans extension.
