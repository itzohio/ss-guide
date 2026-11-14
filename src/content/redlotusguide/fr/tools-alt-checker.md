<!-- route: /screenshare-tools/redlotus-tools/redlotus-alt-checker -->
# Recherche de comptes alternatifs

detect.ac n'a pas d'outil dédié aux comptes alternatifs. La base, c'est le script **Alt Account Finder**, de la section [Principaux scripts RedLotus](/screenshare-tools/specific-powershell-scripts/key-categories-and-examples) : il scanne les dossiers de jeu et les logs à la recherche de chaînes comme "user" ou "username" pour retrouver des traces de comptes.

Commande :

```powershell
  powershell -NoProfile -ExecutionPolicy Bypass -Command "iex (irm 'https://itzohio.github.io/ss-guide/assets/scripts/avance-alt-check-fr.ps1')"
```

#### ⚙️ Où chercher à la main

- **Lanceurs Minecraft :** Lunar, Badlion, Feather, Prism, MultiMC, CurseForge… leurs dossiers de config et leurs logs gardent les profils utilisés et les UUID.
- **Clients de cheats :** les dossiers de config des clients connus contiennent souvent le pseudo associé au compte qui les a lancés.
- **Autres plateformes :** Steam, Discord, Hytale, et les profils Windows eux-mêmes (ruches `NTUSER.DAT`).
- **Résolution des UUID :** un UUID trouvé dans un log se traduit en pseudo via l'API Mojang, ce qui rend la trace exploitable.
- **Variantes de pseudo :** penser aux remplacements de lettres (`TheGamer` / `Th3_G4m3r_01`) et aux fautes de frappe, une recherche exacte les rate.

#### 🛡️ Recouper avec le journal USN

Un compte alternatif utilisé puis nettoyé laisse des traces dans le journal USN : suppressions et modifications de fichiers de lanceurs ou de logs. Les outils comme Authoruns++ et JournalTrace++ de detect.ac aident à dater ces manipulations, et le script **Alt Account Finder** donne les noms à comparer.

Dans tous les cas, on reste sur des pseudos publics : pas de mots de passe, pas d'e-mails, pas de jetons de session.
