<!-- route: /screenshare-tools/specific-powershell-scripts/key-categories-and-examples -->
# Principaux scripts RedLotus

## Scripts PowerShell approuvés

Les scripts PowerShell sont des outils puissants pour automatiser des recherches complexes et collecter des données efficacement. Pour garantir la sécurité et la standardisation, il est obligatoire d'utiliser uniquement les scripts de cette liste, lancés avec les commandes fournies. Les scripts non autorisés ou modifiés sont strictement interdits.

Note d'exécution : toutes les commandes incluent `Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass`. Ça autorise le script pour la session de terminal en cours seulement, sans modifier durablement les stratégies de sécurité du système du joueur.

#### Catégorie : collecte et analyse forensique complète

**RL Collector (RedLotus Collector)**

- Auteur : Red Lotus (basé sur les outils d'Eric Zimmerman)
- But : collecte forensique automatique et complète d'un large éventail d'artefacts critiques (Prefetch, SRUM, ruches de registre, journaux d'événements, Activities Cache, ShellBags…), enregistrés dans un dossier structuré pour l'analyse. L'outil idéal à lancer au début d'une enquête complexe pour préserver les preuves.
- Commande :

```powershell
  powershell -Command "Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass; Invoke-Expression (Invoke-RestMethod 'https://pastebin.com/raw/Eb6r6Vau')"
```

**Master Timeline Script**

- Auteur : communauté Red Lotus
- But : script de post-analyse à utiliser sur les données du RL Collector. Il agrège les nombreux `.csv` produits par les différents parseurs en une seule "timeline maîtresse" chronologique, ce qui transforme des données éparpillées en un récit séquentiel des événements.
- Ouvrir le lien, copier le contenu et le coller dans PowerShell.

#### Catégorie : analyse de fichiers et d'intégrité

**RedLotus Signatures**

- Auteur : bacanoicua / Red Lotus
- But : analyse une liste de chemins depuis un `paths.txt` et vérifie le statut de signature Authenticode de chacun. Essentiel pour repérer vite les exécutables ou DLL non signés, altérés (`HashMismatch`) ou non fiables.
- Commande :

```powershell
  powershell Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass && powershell Invoke-Expression (Invoke-RestMethod https://raw.githubusercontent.com/bacanoicua/Screenshare/main/RedLotusSignatures.ps1)
```

**RedLotus Prefetch Integrity Analyzer**

- Auteur : bacanoicua / Red Lotus
- But : scanne le dossier Prefetch pour trouver les anomalies et les techniques de manipulation. Il vérifie les attributs (lecture seule, par exemple), la validité de l'en-tête ("MAM") et détecte les hash en double, ce qui peut indiquer un bypass par `type` ou `echo`.
- Commande :

```powershell
  powershell Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass && powershell Invoke-Expression (Invoke-RestMethod https://raw.githubusercontent.com/bacanoicua/Screenshare/main/RedLotusPrefetchIntegrityAnalyzer.ps1)
```

**HabibiModAnalyzer**

- Auteur : HadronCollision
- But : automatise l'analyse des mods Minecraft. Il compare les hash des `.jar` à la base Modrinth, cherche des chaînes de cheats connues et analyse le `Zone.Identifier` pour déterminer l'origine du téléchargement.
- Commande :

```powershell
  powershell Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass && powershell Invoke-Expression (Invoke-RestMethod https://raw.githubusercontent.com/HadronCollision/PowershellScripts/refs/heads/main/HabibiModAnalyzer.ps1)
```

#### Catégorie : analyse d'artefacts précis

**RedLotus BAM Script (BAM Parser)**

- Auteur : PureIntent / spokwn
- But : extrait et affiche les entrées du BAM, avec l'heure d'exécution, le chemin et le statut de signature. La version de spokwn génère un rapport HTML interactif.
- Commande (PureIntent) :

```powershell
  powershell Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass && powershell Invoke-Expression (Invoke-RestMethod https://raw.githubusercontent.com/PureIntent/ScreenShare/main/RedLotusBam.ps1)
```

- Commande (spokwn) :

```powershell
  powershell Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass && powershell Invoke-Expression (Invoke-RestMethod https://raw.githubusercontent.com/spokwn/powershells/refs/heads/main/bamparser.ps1)
```

**Streams Script**

- Auteur : spokwn
- But : scanne un dossier (ou récursivement) pour identifier les fichiers avec des Alternate Data Streams, avec le nom, le hash, le propriétaire et le contenu du flux `Zone.Identifier`.
- Commande :

```powershell
  powershell Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass && powershell Invoke-Expression (Invoke-RestMethod https://raw.githubusercontent.com/spokwn/powershells/refs/heads/main/Streams.ps1)
```

**Script ActivitiesCache Parser**

- Auteur : spokwn
- But : automatise le téléchargement et l'exécution d'un parseur de la base `ActivitiesCache.db` (Timeline Windows), en filtrant les activités de la session utilisateur en cours.
- Commande :

```powershell
  powershell Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass && powershell Invoke-Expression (Invoke-RestMethod https://raw.githubusercontent.com/spokwn/powershells/refs/heads/main/activitiescache.ps1)
```

**Parseurs du Planificateur de tâches (N0LW et Rio)**

- Auteurs : N0LW, Rio/ObsessiveBf
- But : une suite de scripts pour analyser le Planificateur. `ManualTasks` liste les tâches créées par l'utilisateur, `SuspiciousScheduler` signale celles qui lancent des commandes suspectes, et le parseur de Rio extrait les commandes et arguments des fichiers XML des tâches.
- Commande ManualTasks (N0LW) :

```powershell
  powershell -Command "Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass; Invoke-Expression (Invoke-RestMethod 'https://raw.githubusercontent.com/nolww/project-mohr/refs/heads/main/ManualTasks.ps1')"
```

- Commande SuspiciousScheduler (N0LW) :

```powershell
  powershell -Command "Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass; Invoke-Expression (Invoke-RestMethod 'https://raw.githubusercontent.com/nolww/project-mohr/refs/heads/main/SuspiciousScheduler.ps1')"
```

- Commande Task Parser (Rio) :

```powershell
  powershell -Command "Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass; Invoke-Expression (Invoke-RestMethod 'https://raw.githubusercontent.com/ObsessiveBf/Task-Scheduler-Parser/main/script.ps1')"
```

#### Catégorie : utilitaires et collecte d'informations

**RedLotus HardDiskVolume Converter**

- Auteur : bacanoicua / Red Lotus
- But : convertit les chemins au format `\Device\HarddiskVolumeX` (courants dans les logs DPS) en chemins classiques avec lettre de lecteur (`C:\...`).
- Commande :

```powershell
  powershell Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass && powershell Invoke-Expression (Invoke-RestMethod https://raw.githubusercontent.com/bacanoicua/Screenshare/main/RedLotusHardDiskVolumeConverter.ps1)
```

**Services.ps1 (Lilith-PS)**

- Auteur : praiselily
- But : rassemble et affiche un résumé détaillé du système : heure de démarrage, uptime, disques connectés, état des services critiques, réglages du registre et historique d'événements (effacements, arrêts, changements d'heure).
- Commande :

```powershell
  powershell Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass && powershell Invoke-Expression (Invoke-RestMethod https://raw.githubusercontent.com/praiselily/lilith-ps/refs/heads/main/Services.ps1)
```

**Alt Account Finder (version française)**

- Auteur : notre version, d'après le script ADVANCE ALT CHECK (version italienne d'origine).
- But : on lui donne un pseudo à chercher (un alt banni connu), il parcourt récursivement `C:\Users` et sort la liste des fichiers qui contiennent cette chaîne. Utile pour retrouver les traces d'un compte dans les logs de lanceurs, les `accounts.json` comme dans `.lunarclient` ou `.emberclient`, les configs et les fichiers de mods.
- Détail : il analyse les fichiers `.txt`, `.log`, `.jar` et `.json`, affiche une barre de progression avec le temps restant, puis le nombre de fichiers trouvés, les 5 premières correspondances (chemin, taille, date de modification) et exporte tout dans un `ResultatsRecherche-<date>.csv` ouvrable dans Excel.
- Commande :

```powershell
  powershell -NoProfile -ExecutionPolicy Bypass -Command "iex (irm 'https://itzohio.github.io/ss-guide/assets/scripts/avance-alt-check-fr.ps1')"
```

- À savoir : les messages du script sont écrits sans accents, exprès — récupéré via `Invoke-RestMethod`, le texte arrive en octets bruts et la console Windows le décode en code page 437, ce qui casserait les accents. Et un fichier trouvé n'est pas une preuve à lui seul : un pseudo courant génère des faux positifs, les `.jar` sont compressés donc la recherche y est peu fiable, et il faut recouper avec les dates et les artefacts d'exécution (Prefetch, BAM, SRUM, journal USN).
