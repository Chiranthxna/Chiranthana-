// Language Switcher Module - i18n System
class LanguageSwitcher {
  constructor() {
    this.currentLanguage = localStorage.getItem('selectedLanguage') || 'en';
    this.translations = null;
    // Prefer root-relative audio path for HTTP served sites; use relative path for file:// preview.
    this.audioBasePath = window.location.protocol.startsWith('http') ? '/audio' : 'audio';
    this.init();
  }

  async init() {
    // Load translations
    try {
      const url = new URL('translations.json', window.location.href).href;
      const response = await fetch(url);
      const data = await response.json();
      this.translations = data.translations;
    } catch (error) {
      console.warn('Failed to load translations via fetch; falling back to empty translations or embedded fallback.', error);
      // Fallback: leave translations empty but support basic keys to avoid runtime errors
      this.translations = { en: {}, hi: {}, kn: {}, te: {} };
    }

    this.setupLanguageSwitcher();
    this.applyLanguage(this.currentLanguage);
  }

  setupLanguageSwitcher() {
    // Look for existing switcher in DOM
    const langSelect = document.getElementById('lang-select');
    if (!langSelect) {
      // Language selector is intentionally removed from the UI.
      return;
    }

    // Use existing switcher
    langSelect.value = this.currentLanguage;
    langSelect.addEventListener('change', (e) => {
      this.setLanguage(e.target.value);
    });
  }

  createLanguageSwitcher() {
    const switcherHTML = `
      <div class="language-switcher-container">
        <div class="language-switcher">
          <label for="lang-select">Language</label>
          <select id="lang-select" class="lang-select">
            <option value="en">English</option>
            <option value="hi">हिन्दी</option>
            <option value="kn">ಕನ್ನಡ</option>
            <option value="te">తెలుగు</option>
          </select>
        </div>
      </div>
    `;

    const switcherContainer = document.createElement('div');
    switcherContainer.innerHTML = switcherHTML;
    document.body.insertBefore(switcherContainer, document.body.firstChild);

    const langSelect = document.getElementById('lang-select');
    langSelect.value = this.currentLanguage;
    langSelect.addEventListener('change', (e) => {
      this.setLanguage(e.target.value);
    });
  }

  setLanguage(lang) {
    this.currentLanguage = lang;
    localStorage.setItem('selectedLanguage', lang);
    // Update text on the page
    this.applyLanguage(lang);

    // Attempt to switch audio, falling back to TTS if playback fails
    try {
      this.switchAudio(lang);
    } catch (err) {
      console.warn('switchAudio failed', err);
      this.speakFallback(lang);
    }
  }

  applyLanguage(lang) {
    const translationMap = this.translations[lang] || {};

    // Update all elements with data-i18n attribute
    document.querySelectorAll('[data-i18n]').forEach((element) => {
      const key = element.getAttribute('data-i18n');
      // Prefer target language, fall back to English, then leave existing text
      const translation = (translationMap && translationMap[key]) || (this.translations.en && this.translations.en[key]);
      if (translation) {
        if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
          element.placeholder = translation;
        } else {
          element.textContent = translation;
        }
      }
    });

    // Update document language attribute
    document.documentElement.lang = lang;

    // Trigger custom event for any additional handlers
    window.dispatchEvent(
      new CustomEvent('languageChanged', { detail: { language: lang } })
    );
  }

  switchAudio(lang) {
    // Prefer a single designated narration audio element with id 'narrationAudio'
    const audio = document.getElementById('narrationAudio') || document.querySelector('audio[data-narration]');
    if (!audio) return;
    const newSrc = `${this.audioBasePath}/${lang}/narration.mp3`;

    // Check whether the audio file exists; if not, fall back to SpeechSynthesis
    fetch(newSrc, { method: 'HEAD' })
      .then((res) => {
        if (res.ok) {
          try {
            if (!audio.src || !audio.src.endsWith(newSrc)) {
              audio.src = newSrc;
              audio.load();
            }
            const playPromise = audio.play();
            if (playPromise && playPromise.catch) {
              playPromise.catch((err) => {
                console.warn('Audio play failed, falling back to TTS', err);
                this.speakFallback(lang);
              });
            }
          } catch (err) {
            console.warn('Audio play failed', err);
            this.speakFallback(lang);
          }
        } else {
          this.speakFallback(lang);
        }
      })
      .catch(() => this.speakFallback(lang));
  }

  speakFallback(lang) {
    try {
      const narration = this.getTranslation('narration') || '';
      const microSdNarration = this.getTranslation('micro-sd-narration') || '';
      const text = [narration, microSdNarration].filter(Boolean).join(' ');
      if (!text) return;
      if ('speechSynthesis' in window) {
        const utter = new SpeechSynthesisUtterance(text);
        // Map short language codes to BCP-47 where available
        utter.lang = (lang === 'hi') ? 'hi-IN' : (lang === 'kn') ? 'kn-IN' : (lang === 'te') ? 'te-IN' : 'en-IN';
        window.speechSynthesis.cancel();
        window.speechSynthesis.speak(utter);
      }
    } catch (err) {
      console.warn('Speech fallback failed', err);
    }
  }

  getTranslation(key) {
    return (this.translations[this.currentLanguage] || {})[key] || key;
  }
}

// Initialize on page load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    window.languageSwitcher = new LanguageSwitcher();
  });
} else {
  window.languageSwitcher = new LanguageSwitcher();
}
