# Quarry Compliance Assets

Files included:
- `poster.html` — print-ready A3 poster (HTML/CSS).
- `poster.css` — styles for `poster.html` (print and screen).
- `social_tile.html` — simplified square tile for social/media.
- `narration.txt` — narration/voiceover script.
- `tts_powershell.ps1` — PowerShell script to save narration to `quarry_narration.wav` using Windows speech.
- `image_prompts.txt` — image-generation prompts for Midjourney / DALL·E / Stable Diffusion.

Quick steps:

1. Open `poster.html` in a browser to preview the poster. Use the browser Print dialog to save as PDF or print at A3.
2. For a social tile, open `social_tile.html` and export as PNG using a browser screenshot tool.
3. To create an audio narration (Windows PowerShell):

```powershell
cd "c:\Users\win10\OneDrive\Desktop\ipw\quarry_compliance"
.\tts_powershell.ps1
```

This generates `quarry_narration.wav` from `narration.txt`.

Legal note: This content is informational and not legal advice. Verify numeric emission limits and statutory details with CPCB/SPCB and legal counsel.
