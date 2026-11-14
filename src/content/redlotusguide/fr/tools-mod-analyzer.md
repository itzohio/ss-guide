<!-- route: /screenshare-tools/redlotus-tools/redlotus-mod-analyzer -->
# Analyse des mods Minecraft

detect.ac n'a pas d'analyseur de mods `.jar`. Pour ça, on utilise **HabibiModAnalyzer**, de la section [Principaux scripts RedLotus](/screenshare-tools/specific-powershell-scripts/key-categories-and-examples), complété par les vérifications manuelles.

#### ⚙️ HabibiModAnalyzer

- Auteur : HadronCollision.
- Ce qu'il fait : il compare les hash des `.jar` d'un dossier `mods` à la base **Modrinth**, ce qui identifie immédiatement un mod trafiqué ou une fausse version au même nom. Il cherche aussi des chaînes de cheats connues et lit le flux `Zone.Identifier` pour retrouver l'origine du téléchargement.
- Limite : les mods qui ne sont pas sur Modrinth (builds privés, mods maison, vieilles versions) ne peuvent pas être vérifiés par hash, il faut alors passer à la main.

Commande :

```powershell
  powershell Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass && powershell Invoke-Expression (Invoke-RestMethod https://raw.githubusercontent.com/HadronCollision/PowershellScripts/refs/heads/main/HabibiModAnalyzer.ps1)
```

#### 🛡️ Les vérifications manuelles qui complètent

- **Trier par date :** le dossier `mods` et chaque `.jar` — un mod modifié quelques minutes avant le check, c'est déjà une piste.
- **Tailles anormales :** un mod connu pour peser 24-30 Ko qui en fait 64 Ko ou 10 Ko mérite un coup d'œil.
- **Décompiler :** Luyten ou Recaf sur le `.jar` suspect, et regarder les packages et classes (`killaura`, `reach`, `velocity`, `autoclicker`…), ainsi que la présence d'obfuscation.
- **Cohérence avec la mémoire :** comparer la liste des mods sur le disque avec ce que `javaw.exe` a réellement chargé (recherche de chaînes System Informer sur `\mods`). Un mod présent en mémoire mais absent du dossier, ou l'inverse, doit s'expliquer.

Pour la procédure complète, voir la page [Analyse des mods Forge](/screensharing-minecraft-knowledge/fifth-section-specific-context-minecraft/specific-analysis-for-minecraft/forge-mod-analysis).
