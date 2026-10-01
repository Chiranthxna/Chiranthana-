# Generates 1-second silent WAV files and saves them as narration.mp3 in language folders
$root = Split-Path -Parent $MyInvocation.MyCommand.Definition
$languages = @('en','kn','te','hi')
$sampleRate = 16000
$duration = 1 # seconds
$bits = 16
$channels = 1
$numSamples = $sampleRate * $duration
$dataSize = $numSamples * $channels * ($bits / 8)
$fileSize = 36 + $dataSize

foreach ($lang in $languages) {
    $dir = Join-Path $root "audio\$lang"
    if (-not (Test-Path $dir)) { New-Item -ItemType Directory -Path $dir -Force | Out-Null }
    $outPath = Join-Path $dir 'narration.mp3'

    $ms = New-Object System.IO.MemoryStream
    $bw = New-Object System.IO.BinaryWriter($ms)

    $bw.Write([System.Text.Encoding]::ASCII.GetBytes("RIFF"))
    $bw.Write([int]$fileSize)
    $bw.Write([System.Text.Encoding]::ASCII.GetBytes("WAVE"))
    $bw.Write([System.Text.Encoding]::ASCII.GetBytes("fmt "))
    $bw.Write([int]16)
    $bw.Write([short]1)
    $bw.Write([short]$channels)
    $bw.Write([int]$sampleRate)
    $bw.Write([int]($sampleRate * $channels * ($bits / 8)))
    $bw.Write([short]($channels * ($bits / 8)))
    $bw.Write([short]$bits)
    $bw.Write([System.Text.Encoding]::ASCII.GetBytes("data"))
    $bw.Write([int]$dataSize)

    for ($i = 0; $i -lt $numSamples; $i++) { $bw.Write([int16]0) }

    $bw.Flush()
    [System.IO.File]::WriteAllBytes($outPath, $ms.ToArray())
    Write-Host "Wrote placeholder audio for $lang -> $outPath"
}
Write-Host "Done creating placeholder audio files."
