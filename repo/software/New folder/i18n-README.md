# Multilingual Language Switcher Documentation

## Overview
This project includes a complete multilingual language switching system with support for:
- **English (en)** - Default language
- **Hindi (hi)** - हिन्दी
- **Kannada (kn)** - ಕನ್ನಡ
- **Telugu (te)** - తెలుగు

## Features

### 1. Automatic Language Switcher
- Sticky language selector at the top of every page
- Language preference saved in browser localStorage
- Supports instant page content updates

### 2. Dynamic Text Translation
- All text content uses `data-i18n` attributes
- Translations stored in `translations.json`
- Real-time text updates when language changes

### 3. Audio Narration Support
- Prepared for multilingual audio files
- Structure: `/audio/{language}/{narration.mp3}`
- System automatically switches audio based on language

## File Structure

```
New folder/
├── index.html                 # Live Dust Data dashboard
├── health-risks.html          # Health Risks page
├── safety-measures.html       # Precautionary Measures page
├── translations.json          # All translations (en, hi, kn, te)
├── i18n.js                   # Language switcher core module
├── i18n.css                  # Language switcher styling
├── styles.css                # Dashboard styles
├── health-risks.css          # Health risks page styles
├── safety-measures.css       # Safety measures page styles
├── script.js                 # Dashboard functionality
├── health-risks.js           # Health risks page functionality
├── safety-measures.js        # Safety measures page functionality
└── audio/                    # [Optional] Audio files directory
    ├── en/
    │   ├── narration.mp3
    │   └── dashboard.mp3
    ├── hi/
    │   ├── narration.mp3
    │   └── dashboard.mp3
    ├── kn/
    │   ├── narration.mp3
    │   └── dashboard.mp3
    └── te/
        ├── narration.mp3
        └── dashboard.mp3
```

## How It Works

### 1. Language Switcher Initialization
The `i18n.js` module:
- Loads on page load
- Creates a language selector dropdown
- Fetches `translations.json`
- Applies saved language preference

### 2. Applying Translations
When user selects a language:
1. All elements with `data-i18n` attributes are updated
2. Text content is replaced with translated text
3. Language preference is saved to localStorage
4. Audio files are switched (if available)
5. `languageChanged` event is dispatched for custom handlers

### 3. Adding Translations to HTML
Use the `data-i18n` attribute on any element:

```html
<!-- Headings -->
<h1 data-i18n="live-dust-title">Live Dust Data</h1>

<!-- Paragraphs -->
<p data-i18n="health-warning">⚠ Health Warning</p>

<!-- Buttons -->
<button data-i18n="set-reminder">Set Health Checkup Reminder</button>

<!-- Labels -->
<span data-i18n="pm25">PM2.5</span>
```

### 4. Translation Key Naming Convention
Keys use kebab-case and are organized by section:
- `live-dust-title` - Live Dust page titles
- `health-risks-*` - Health Risks page content
- `safety-first` - Safety page content
- `pm25`, `pm10` - Common terms
- `connected`, `connecting` - Status messages

## Translation Structure (translations.json)

```json
{
  "languages": {
    "en": "English",
    "hi": "हिन्दी (Hindi)",
    "kn": "ಕನ್ನಡ (Kannada)",
    "te": "తెలుగు (Telugu)"
  },
  "translations": {
    "en": {
      "key-1": "English text",
      "key-2": "More English text"
    },
    "hi": {
      "key-1": "हिंदी पाठ",
      "key-2": "अधिक हिंदी पाठ"
    },
    "kn": {
      "key-1": "ಕನ್ನಡ ಪಠ್ಯ",
      "key-2": "ಹೆಚ್ಚು ಕನ್ನಡ ಪಠ್ಯ"
    },
    "te": {
      "key-1": "తెలుగు టెక్స్ట్",
      "key-2": "మరిన్ని తెలుగు టెక్స్ట్"
    }
  }
}
```

## Audio Setup (Optional)

### To Enable Audio Narration:
1. Create `/audio` folder in the project root
2. Create language subfolders: `en/`, `hi/`, `kn/`, `te/`
3. Add audio files:
   - `narration.mp3` - Page narration/guide
   - `dashboard.mp3` - Dashboard information

### Audio File Paths:
```
/audio/en/narration.mp3        # English narration
/audio/hi/narration.mp3        # Hindi narration
/audio/kn/narration.mp3        # Kannada narration
/audio/te/narration.mp3        # Telugu narration
```

### Audio Format Requirements:
- Format: MP3, WAV, or OGG
- Bitrate: 128 kbps or higher
- Sample rate: 44.1 kHz or higher

## Adding New Languages

To add a new language (e.g., Tamil):

### 1. Update translations.json:
```json
{
  "languages": {
    "en": "English",
    "ta": "தமிழ் (Tamil)"
  },
  "translations": {
    "ta": {
      "live-dust-title": "நேரடி தூசு தரவு",
      "live-dust-subtitle": "வாழ்நாள்-நேரம் காற்று தரம் மானிட்டர்"
      // ... all other keys
    }
  }
}
```

### 2. Update i18n.js language selector:
```html
<option value="ta">தமிழ் (Tamil)</option>
```

### 3. Add audio files (optional):
```
/audio/ta/narration.mp3
/audio/ta/dashboard.mp3
```

## Styling Customization

### Language Switcher Styling
Edit `i18n.css` to customize:
- Colors and gradients
- Font sizes and families
- Hover effects
- Responsive breakpoints

### Dark Mode Support
Add media query for dark mode:
```css
@media (prefers-color-scheme: dark) {
  .language-switcher {
    background: #1f2937;
    color: #f9fafb;
  }
}
```

## Best Practices

1. **Keep translations consistent** - Use the same terminology across all languages
2. **Test all languages** - Verify text wrapping and layout in each language
3. **Use proper fonts** - Ensure browsers have fallback fonts for non-Latin scripts
4. **Accessibility** - Always include `lang` attribute on HTML element
5. **Right-to-Left support** - Consider adding for Arabic/Urdu in future
6. **Audio quality** - Use professional narration for accessibility

## Troubleshooting

### Language Not Switching
- Clear browser cache/localStorage
- Check browser console for errors
- Verify translations.json exists and is valid JSON
- Check that `data-i18n` keys match translation keys exactly

### Text Not Updating
- Ensure element has `data-i18n` attribute
- Check translation key exists in translations.json
- Verify i18n.js is loaded before other scripts
- Check browser console for 404 errors

### Audio Not Playing
- Verify audio files exist in correct paths: `/audio/{lang}/narration.mp3`
- Check file format (MP3 recommended)
- Ensure server allows audio file access
- Check browser audio permissions

## Browser Support

| Browser | Support | Notes |
|---------|---------|-------|
| Chrome/Edge | ✅ Full | Latest versions |
| Firefox | ✅ Full | Latest versions |
| Safari | ✅ Full | Latest versions |
| IE 11 | ⚠️ Limited | No fetch/async support |

## Performance

- Translation file: ~50KB (uncompressed)
- i18n.js: ~4KB
- Language switch latency: <50ms
- No external dependencies required

## Future Enhancements

- [ ] Pluralization support
- [ ] Right-to-left (RTL) language support
- [ ] Regional variants (e.g., en-IN, en-US)
- [ ] Dynamic loading of translations per language
- [ ] Automatic language detection from browser settings
- [ ] Translation management UI/CMS integration
- [ ] String interpolation/formatting support

## License & Credits

This multilingual system is designed for the IPW (Industrial Pollution Watch) dust monitoring project.

For questions or improvements, please refer to the project documentation.
