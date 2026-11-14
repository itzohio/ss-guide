# AVANCE ALT CHECK - version francaise
# D'apres le script ADVANCE ALT CHECK (version italienne d'origine).
#
# Recherche un pseudo (ou n'importe quelle chaine) dans les fichiers
# .txt, .log, .jar et .json de C:\Users, puis ecrit la liste des fichiers
# trouves dans un CSV horodate.
#
# Les messages sont volontairement sans accents : un script lance via
# Invoke-RestMethod arrive en octets bruts, et la console Windows les
# decode en code page 437/850, ce qui casse les caracteres accentues.
#
# Usage : clic droit sur le fichier > "Executer avec PowerShell"
#         ou, dans une console PowerShell :
#           powershell -ExecutionPolicy Bypass -File .\avance-alt-check-fr.ps1

# Extensions analysees et dossier de depart
$extensions = "*.txt", "*.log", "*.jar", "*.json"
$path = "C:\Users"

# Evite que les fichiers verrouilles ou interdits n'interrompent le scan
$ErrorActionPreference = 'SilentlyContinue'

$results = @()

# Met en forme une duree : 1h 02m 03s, 02m 03s ou 03s
function Format-Duree {
    param (
        [Parameter(Mandatory = $true)]
        [TimeSpan]$Duree
    )
    if ($Duree.TotalHours -ge 1) {
        return "{0:h\h\ mm\m\ ss\s}" -f $Duree
    }
    elseif ($Duree.TotalMinutes -ge 1) {
        return "{0:mm\m\ ss\s}" -f $Duree
    }
    else {
        return "{0:ss\s}" -f $Duree
    }
}

Clear-Host
Write-Host "===============================================" -ForegroundColor Cyan
Write-Host "        AVANCE ALT CHECK - FRANCAIS           " -ForegroundColor Cyan
Write-Host "===============================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "Ce script va chercher une chaine dans tous les fichiers" -ForegroundColor Yellow
Write-Host "avec les extensions suivantes : $($extensions -join ', ')" -ForegroundColor Yellow
Write-Host "dans le dossier : $path" -ForegroundColor Yellow
Write-Host ""

$searchString = Read-Host "Pseudo ou chaine a rechercher"
Write-Host ""

if ([string]::IsNullOrWhiteSpace($searchString)) {
    Write-Host "Aucune chaine saisie, arret." -ForegroundColor Red
    exit
}

Write-Host "Lancement de la recherche..." -ForegroundColor Green
Write-Host ""
Write-Host "Analyse des fichiers en cours..." -ForegroundColor Gray

# Une seule enumeration de tous les fichiers concernes
$allFiles = Get-ChildItem -Path $path -Include $extensions -Recurse -File
$total = $allFiles.Count

if ($total -eq 0) {
    Write-Host "Aucun fichier trouve avec ces extensions." -ForegroundColor Red
    exit
}

Write-Host "$total fichiers a analyser." -ForegroundColor Gray
Start-Sleep -Seconds 1

$i = 0
$stopwatch = [System.Diagnostics.Stopwatch]::StartNew()

foreach ($file in $allFiles) {
    $i++
    $percentComplete = [math]::Round(($i / $total) * 100, 1)

    if ($i -gt 1) {
        $elapsedSeconds = $stopwatch.Elapsed.TotalSeconds
        $averageTimePerFile = $elapsedSeconds / $i
        $filesRemaining = $total - $i
        $estimatedSecondsRemaining = $averageTimePerFile * $filesRemaining
        $timeRemaining = [TimeSpan]::FromSeconds($estimatedSecondsRemaining)
        $formattedTimeRemaining = Format-Duree -Duree $timeRemaining
    }
    else {
        $formattedTimeRemaining = "calcul en cours..."
    }

    $statusText = "Fichier : $i/$total ($percentComplete %) - Temps restant : $formattedTimeRemaining"
    $activityText = "Analyse de : $($file.Name)"
    Write-Progress -Activity $activityText -Status $statusText -PercentComplete $percentComplete

    try {
        # -Raw lit le fichier entier d'un coup, plus rapide qu'une lecture ligne par ligne
        $content = Get-Content $file.FullName -Raw
        if ($content -and $content.Contains($searchString)) {
            $results += [PSCustomObject]@{
                Fichier              = $file.FullName
                ChaineRecherchee     = $searchString
                Taille               = "{0:N2} Ko" -f ($file.Length / 1KB)
                DerniereModification = $file.LastWriteTime
            }
        }
    }
    catch {
        # Fichier illisible ou verrouille : on passe au suivant sans bruit
    }
}

$stopwatch.Stop()
$ErrorActionPreference = 'Continue'

Write-Host ""
Write-Host "===============================================" -ForegroundColor Cyan
Write-Host "              RESULTATS DE RECHERCHE          " -ForegroundColor Cyan
Write-Host "===============================================" -ForegroundColor Cyan
Write-Host ""

$totalTime = $stopwatch.Elapsed
$formattedTotalTime = Format-Duree -Duree $totalTime

if ($results.Count -gt 0) {
    Write-Host "Trouve $($results.Count) fichier(s) contenant '$searchString'" -ForegroundColor Green
    Write-Host "Temps total d'analyse : $formattedTotalTime" -ForegroundColor Yellow
    Write-Host "Fichiers traites par seconde : $([math]::Round($total / $totalTime.TotalSeconds, 2))" -ForegroundColor Yellow
    Write-Host ""

    $timestamp = Get-Date -Format "yyyyMMdd-HHmmss"
    $outputPath = "ResultatsRecherche-$timestamp.csv"
    $results | Export-Csv -Path $outputPath -NoTypeInformation -Encoding UTF8
    Write-Host "Resultats enregistres dans : $outputPath" -ForegroundColor Green

    Write-Host "Les $([Math]::Min(5, $results.Count)) premieres correspondances :" -ForegroundColor White
    $results | Select-Object -First 5 | Format-Table -AutoSize -Property Fichier, Taille, DerniereModification
}
else {
    Write-Host "Aucune correspondance trouvee pour '$searchString'" -ForegroundColor Yellow
    Write-Host "Temps total d'analyse : $formattedTotalTime" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "===============================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Rappel : un fichier trouve n'est pas une preuve a lui seul." -ForegroundColor DarkGray
Write-Host "Verifie la date, le contexte autour de la chaine, et croise avec" -ForegroundColor DarkGray
Write-Host "les artefacts d'execution (Prefetch, BAM, SRUM, journal USN)." -ForegroundColor DarkGray
