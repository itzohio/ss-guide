<!-- route: /screensharing-general-knowledge/fourth-section-common-windows-artifacts-and-their-basic-analysis/windows-registry-introduction/registry-structure-hives-keys-and-values -->
# La structure du registre : ruches, clés et valeurs

Le registre est organisé en arbre, un peu comme les dossiers et fichiers d'un disque.

- **Les ruches :** les conteneurs de premier niveau, l'équivalent des dossiers racine. Chacune correspond à une grande partie de la configuration. Les principales :
  - `HKEY_LOCAL_MACHINE` (HKLM) : les réglages système, matériel, configuration de l'OS et logiciels installés, valables pour tous les utilisateurs. Physiquement, c'est stocké dans plusieurs fichiers sans extension dans `C:\Windows\System32\config`, comme `SAM`, `SECURITY`, `SOFTWARE` et `SYSTEM`.
  - `HKEY_CURRENT_USER` (HKCU) : les réglages de l'utilisateur connecté (préférences, configs d'applications, bureau, variables d'environnement…). Le fichier est dans le profil de l'utilisateur, en général `C:\Users\{username}\NTUSER.DAT`.
  - `HKEY_USERS` (HKU) : contient la ruche de l'utilisateur connecté et celles des autres profils chargés (profils par défaut et système, identifiés par leur SID).
  - `HKEY_CLASSES_ROOT` (HKCR) : les associations de fichiers, l'enregistrement des objets COM et les infos d'interface. C'est surtout une vue fusionnée de clés de HKLM\Software\Classes et HKCU\Software\Classes.
  - `HKEY_CURRENT_CONFIG` (HKCC) : le profil matériel utilisé actuellement, généralement dérivé de clés de HKLM.
- **Clés et sous-clés :** dans chaque ruche, les infos sont rangées en clés et sous-clés, comme des dossiers et sous-dossiers. Par exemple, `HKCU\Software\Microsoft\Windows` contient plein de sous-clés liées aux réglages Windows de l'utilisateur.
- **Valeurs :** les données stockées dans les clés. Chacune a trois parties :
  - Nom : l'identifiant du réglage (`EnablePrefetcher`, par exemple). Une clé peut avoir une valeur "(Default)", avec ou sans données.
  - Type de donnée : le format stocké (voir plus bas).
  - Données : la valeur elle-même (`3`, `C:\Program Files\MyApp`, `0x00000001`…).
