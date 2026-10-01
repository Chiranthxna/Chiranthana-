Add-Type -AssemblyName System.speech
$synth = New-Object System.Speech.Synthesis.SpeechSynthesizer
# Set voice properties
$synth.Rate = 0
$synth.Volume = 100
$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Definition
$narrationPath = Join-Path $scriptDir 'narration.txt'
$outPath = Join-Path $scriptDir 'quarry_narration.wav'
if (-Not (Test-Path $narrationPath)){
  Write-Error "narration.txt not found in script folder"
  exit 1
}
$text = Get-Content -Raw -Path $narrationPath
$synth.SetOutputToWaveFile($outPath)
$synth.Speak($text)
$synth.SetOutputToDefaultAudioDevice()
$synth.Dispose()
Write-Host "Saved narration to $outPath"