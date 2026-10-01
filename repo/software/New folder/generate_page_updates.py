from pathlib import Path

health_risks_html = '''<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title data-i18n="health-page-title">Health Risks - Dust Exposure Warning</title>
  <link rel="stylesheet" href="i18n.css" />
  <link rel="stylesheet" href="styles.css" />
</head>
<body>
  <div class="language-switcher-container">
    <div class="language-switcher">
      <label for="lang-select" data-i18n="language-label">Language</label>
      <select id="lang-select" class="lang-select">
        <option value="en">English</option>
        <option value="hi">हिन्दी</option>
        <option value="kn">ಕನ್ನಡ</option>
        <option value="te">తెలుగు</option>
      </select>
    </div>
  </div>

  <nav class="top-nav">
    <a href="index.html" class="nav-link" data-i18n="nav-live">Live Dust Sensors</a>
    <a href="health-risks.html" class="nav-link active" data-i18n="nav-health">Health Risks</a>
    <a href="safety-measures.html" class="nav-link" data-i18n="nav-safety">Safety Measures</a>
  </nav>

  <audio id="narrationAudio" controls data-narration style="position:fixed;left:1rem;top:4rem;z-index:9999;background:#fff;padding:4px;border-radius:6px;">
    <span data-i18n="audio-fallback">Your browser does not support the audio element.</span>
  </audio>

  <div class="app-container">
    <header class="warning-header">
      <div class="warning-badge">
        <svg class="warning-icon" viewBox="0 0 24 24" fill="currentColor">
          <path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z"/>
        </svg>
        <span data-i18n="health-warning">⚠ Health Warning</span>
      </div>
      <div class="page-actions page-actions-top">
        <a href="index.html" class="btn btn-secondary back-btn" data-i18n="back">Back</a>
      </div>
      <h1 data-i18n="health">Health Risks of Dust Exposure</h1>
      <p class="subtitle" data-i18n="healthText">Understanding the dangers of prolonged dust inhalation and occupational respiratory diseases.</p>
    </header>

    <main class="content-grid">
      <section class="info-card">
        <h2 data-i18n="impact-respiratory">Impact on Respiratory System</h2>
        <p data-i18n="how-dust-damages">Dust particles penetrate deep into the lungs and damage airways, reducing oxygen exchange.</p>
      </section>

      <section class="lung-section">
        <article class="lung-card healthy">
          <h3 data-i18n="healthy-lungs">Healthy Lungs</h3>
          <svg class="lung-graphic" viewBox="0 0 200 280" aria-label="Healthy lungs illustration">
            <ellipse cx="60" cy="140" rx="35" ry="80" fill="#22c55e" opacity="0.8"/>
            <path d="M60 60 Q45 90 45 140 Q45 190 60 220" stroke="#16a34a" stroke-width="2" fill="none"/>
            <ellipse cx="140" cy="140" rx="35" ry="80" fill="#22c55e" opacity="0.8"/>
            <path d="M140 60 Q155 90 155 140 Q155 190 140 220" stroke="#16a34a" stroke-width="2" fill="none"/>
            <path d="M100 20 Q100 40 90 60" stroke="#4b5563" stroke-width="4" fill="none"/>
            <path d="M100 20 Q100 40 110 60" stroke="#4b5563" stroke-width="4" fill="none"/>
            <circle cx="70" cy="100" r="2" fill="#60a5fa" opacity="0.6"/>
            <circle cx="130" cy="120" r="2" fill="#60a5fa" opacity="0.6"/>
          </svg>
          <p data-i18n="clear-airways">Clear airways, efficient oxygen exchange.</p>
        </article>

        <article class="lung-card diseased">
          <h3 data-i18n="diseased-lungs">Diseased Lungs (Silicosis)</h3>
          <svg class="lung-graphic" viewBox="0 0 200 280" aria-label="Diseased lungs with silicosis">
            <ellipse cx="60" cy="140" rx="35" ry="80" fill="#fca5a5" opacity="0.7"/>
            <path d="M60 60 Q45 90 45 140 Q45 190 60 220" stroke="#dc2626" stroke-width="2" fill="none"/>
            <ellipse cx="140" cy="140" rx="35" ry="80" fill="#fca5a5" opacity="0.7"/>
            <path d="M140 60 Q155 90 155 140 Q155 190 140 220" stroke="#dc2626" stroke-width="2" fill="none"/>
            <path d="M100 20 Q100 40 90 60" stroke="#6b7280" stroke-width="4" fill="none"/>
            <path d="M100 20 Q100 40 110 60" stroke="#6b7280" stroke-width="4" fill="none"/>
            <circle cx="50" cy="80" r="3" fill="#374151"/>
            <circle cx="75" cy="110" r="2.5" fill="#4b5563"/>
            <circle cx="65" cy="150" r="3" fill="#374151"/>
            <circle cx="90" cy="170" r="2.5" fill="#4b5563"/>
            <circle cx="130" cy="100" r="3" fill="#374151"/>
            <circle cx="150" cy="140" r="2.5" fill="#4b5563"/>
            <circle cx="135" cy="180" r="3" fill="#374151"/>
            <line x1="50" y1="80" x2="65" y2="150" stroke="#9ca3af" stroke-width="1" opacity="0.6"/>
            <line x1="130" y1="100" x2="135" y2="180" stroke="#9ca3af" stroke-width="1" opacity="0.6"/>
          </svg>
          <p data-i18n="scarred-tissue">Scarred tissue, reduced oxygen capacity.</p>
        </article>
      </section>

      <section class="info-card">
        <h2 data-i18n="primary-risk">Primary Risk: Silicosis</h2>
        <p><strong data-i18n="what-is">What it is:</strong> <span data-i18n="silicosis-desc">A progressive lung disease caused by inhalation of crystalline silica dust. The silica particles scar lung tissue irreversibly.</span></p>
        <p><strong data-i18n="risk-groups">Risk Groups:</strong> <span data-i18n="risk-groups-desc">Construction workers, sandblasters, miners, stonemasons, and foundry workers.</span></p>
        <p><strong data-i18n="symptoms">Symptoms:</strong> <span data-i18n="symptoms-desc">Shortness of breath, chest tightness, persistent cough, and fatigue.</span></p>
        <p><strong data-i18n="severity">Severity:</strong> <span data-i18n="severity-desc">Can lead to chronic bronchitis, tuberculosis, and heart failure.</span></p>
        <p><strong data-i18n="prevention">Prevention:</strong> <span data-i18n="prevention-desc">Use respiratory protection, proper ventilation, wet cutting methods, and strict dust controls.</span></p>
      </section>

      <section class="conditions-section">
        <div class="section-header">
          <h2 data-i18n="related-conditions">Related Respiratory Conditions</h2>
          <p data-i18n="other-diseases">Other diseases linked to dust exposure.</p>
        </div>
        <div class="conditions-grid">
          <article class="condition-card">
            <h4 data-i18n="copd">Chronic Obstructive Pulmonary Disease (COPD)</h4>
            <p data-i18n="copd-desc">Airflow obstruction and lung damage from prolonged dust exposure.</p>
            <ul>
              <li data-i18n="emphysema">Emphysema</li>
              <li data-i18n="chronic-bronchitis">Chronic bronchitis</li>
            </ul>
          </article>
          <article class="condition-card">
            <h4 data-i18n="occupational-asthma">Occupational Asthma</h4>
            <p data-i18n="asthma-desc">Reactive airway disease triggered by workplace dust and particles.</p>
            <ul>
              <li data-i18n="wheezing">Wheezing</li>
              <li data-i18n="breathlessness">Breathlessness</li>
            </ul>
          </article>
          <article class="condition-card">
            <h4 data-i18n="pneumoconiosis">Pneumoconiosis</h4>
            <p data-i18n="pneumoconiosis-desc">Lung fibrosis from inhalation of mineral or metal dust.</p>
            <ul>
              <li data-i18n="coal-workers">Coal worker's pneumoconiosis</li>
              <li data-i18n="asbestosis">Asbestosis</li>
            </ul>
          </article>
          <article class="condition-card">
            <h4 data-i18n="infection-risk">Increased Infection Risk</h4>
            <p data-i18n="infection-desc">Weakened lungs more susceptible to tuberculosis and pneumonia.</p>
            <ul>
              <li data-i18n="tb-infection">TB infection</li>
              <li data-i18n="pneumonia">Pneumonia</li>
            </ul>
          </article>
        </div>
      </section>

      <section class="worker-section">
        <div class="section-header">
          <h2 data-i18n="workers-at-risk">Workers at Risk</h2>
          <p data-i18n="occupations-high">Occupations with high dust exposure.</p>
        </div>
        <div class="worker-grid">
          <article class="worker-profile">
            <h4 data-i18n="construction-workers">Construction Workers</h4>
            <p data-i18n="construction-desc">Exposed to silica dust during demolition, cutting, and drilling.</p>
          </article>
          <article class="worker-profile">
            <h4 data-i18n="miners">Miners</h4>
            <p data-i18n="miners-desc">Direct exposure to mineral dust in underground environments.</p>
          </article>
          <article class="worker-profile">
            <h4 data-i18n="factory-workers">Factory Workers</h4>
            <p data-i18n="factory-desc">Handling raw materials and machinery with particle emissions.</p>
          </article>
          <article class="worker-profile">
            <h4 data-i18n="agricultural-workers">Agricultural Workers</h4>
            <p data-i18n="agricultural-desc">Grain handling and crop processing with organic dust.</p>
          </article>
        </div>
      </section>

      <section class="info-card">
        <h2 data-i18n="protection-prevention">Protection & Prevention</h2>
        <ul class="feature-list">
          <li data-i18n="ppe">Use personal protective equipment such as N95 or P100 respirators.</li>
          <li data-i18n="engineering-controls">Use engineering controls like wet cutting and ventilation.</li>
          <li data-i18n="health-surveillance">Schedule regular health surveillance and lung function tests.</li>
          <li data-i18n="worker-training">Train workers to recognize warning signs and hazards.</li>
        </ul>
      </section>

      <section class="booking-callout">
        <div class="booking-panel">
          <h2 data-i18n="book-checkup">Book a Full Health Checkup</h2>
          <p data-i18n="booking-schedule">Schedule a medical review before you return to dusty work.</p>
          <a href="#" class="btn btn-primary" data-i18n="book-now">Book Now</a>
        </div>
      </section>
    </main>
  </div>

  <script src="i18n.js"></script>
  <script src="health-risks.js"></script>
</body>
</html>
'''

safety_measures_html = '''<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title data-i18n="safety-page-title">Precautionary Measures - Safety First</title>
  <link rel="stylesheet" href="i18n.css" />
  <link rel="stylesheet" href="styles.css" />
</head>
<body>
  <div class="language-switcher-container">
    <div class="language-switcher">
      <label for="lang-select" data-i18n="language-label">Language</label>
      <select id="lang-select" class="lang-select">
        <option value="en">English</option>
        <option value="hi">हिन्दी</option>
        <option value="kn">ಕನ್ನಡ</option>
        <option value="te">తెలుగు</option>
      </select>
    </div>
  </div>

  <nav class="top-nav">
    <a href="index.html" class="nav-link" data-i18n="nav-live">Live Dust Sensors</a>
    <a href="health-risks.html" class="nav-link" data-i18n="nav-health">Health Risks</a>
    <a href="safety-measures.html" class="nav-link active" data-i18n="nav-safety">Safety Measures</a>
  </nav>

  <audio id="narrationAudio" controls data-narration style="position:fixed;left:1rem;top:4rem;z-index:9999;background:#fff;padding:4px;border-radius:6px;">
    <span data-i18n="audio-fallback">Your browser does not support the audio element.</span>
  </audio>

  <div class="safety-container">
    <div class="safety-banner">
      <div class="banner-content">
        <div class="page-actions page-actions-top">
          <a href="health-risks.html" class="btn btn-secondary back-btn" data-i18n="back">Back</a>
        </div>
        <h1 class="banner-title" data-i18n="safety">🛡️ SAFETY FIRST</h1>
        <p class="banner-tagline" data-i18n="safetyText">Protect Your Health. Prevent Occupational Lung Disease.</p>
        <div class="banner-highlight" data-i18n="well-being-priority">Your well-being is our priority.</div>
      </div>
    </div>

    <main class="main-content">
      <section class="ppe-section">
        <div class="section-header">
          <h2 data-i18n="ppe">Personal Protective Equipment (PPE)</h2>
          <p data-i18n="ppe-subtitle">Essential gear to protect against dust exposure.</p>
        </div>
        <div class="ppe-grid">
          <article class="ppe-card">
            <h3 data-i18n="n95-masks">N95/N100 Masks</h3>
            <p data-i18n="n95-desc">Filters 95-99% of airborne particles.</p>
            <ul>
              <li data-i18n="rated-for-silica">Rated for silica dust.</li>
              <li data-i18n="reusable">Disposable or reusable options.</li>
              <li data-i18n="proper-fit">Requires proper fit to seal correctly.</li>
              <li data-i18n="cost-effective">Cost-effective protection for light environments.</li>
            </ul>
          </article>
          <article class="ppe-card">
            <h3 data-i18n="papr-systems">PAPR Systems</h3>
            <p data-i18n="papr-desc">Powered Air-Purifying Respirator with continuous airflow.</p>
            <ul>
              <li data-i18n="battery-powered">Battery-powered air filtration.</li>
              <li data-i18n="continuous-airflow">Continuous airflow reduces breathing effort.</li>
              <li data-i18n="face-shield">Face shield included.</li>
              <li data-i18n="extended-wear">Ideal for extended wear in heavy dust.</li>
            </ul>
          </article>
          <article class="ppe-card">
            <h3 data-i18n="supplied-air">Supplied Air Respirator</h3>
            <p data-i18n="supplied-desc">Provides maximum protection from a clean external air source.</p>
            <ul>
              <li data-i18n="air-source">Air from a clean external source.</li>
              <li data-i18n="hose-connected">Hose-connected to a compressor or air supply.</li>
              <li data-i18n="extreme-conditions">Designed for extreme conditions.</li>
              <li data-i18n="highest-safety">Highest safety level available.</li>
            </ul>
          </article>
          <article class="ppe-card">
            <h3 data-i18n="full-body">Full Body Protection</h3>
            <p data-i18n="full-body-desc">Complete coverage to prevent skin and eye contact.</p>
            <ul>
              <li data-i18n="protective-suit">Protective suits or coveralls.</li>
              <li data-i18n="gloves-eye">Gloves and eye protection.</li>
              <li data-i18n="sealed-seams">Sealed seams for added safety.</li>
              <li data-i18n="prolonged-exposure">For prolonged heavy exposure.</li>
            </ul>
          </article>
        </div>
      </section>

      <section class="gallery-section">
        <div class="section-header">
          <h2 data-i18n="visual-techniques">Visual Techniques</h2>
          <p data-i18n="visual-techniques-desc">Examples of effective suppression and PPE in the field.</p>
        </div>
        <div class="gallery-grid">
          <figure class="image-card">
            <img src="https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&w=1000&q=60" alt="Water spray suppressing dust" />
            <figcaption data-i18n="water-spraying">Water spraying systems</figcaption>
          </figure>
          <figure class="image-card">
            <img src="https://images.unsplash.com/photo-1571171637578-41bc2dd41cd2?auto=format&fit=crop&w=1000&q=60" alt="Worker with respirator" />
            <figcaption data-i18n="ppe">Personal protective equipment</figcaption>
          </figure>
          <figure class="image-card">
            <img src="https://images.unsplash.com/photo-1581091012184-7b8fcb3f2a7b?auto=format&fit=crop&w=1000&q=60" alt="Enclosure ventilation" />
            <figcaption data-i18n="enclosure">Enclosure & ventilation</figcaption>
          </figure>
        </div>
      </section>

      <section class="practice-section">
        <div class="section-header">
          <h2 data-i18n="workplace-safety">Safe Work Practices</h2>
          <p data-i18n="workplace-safety-desc">Guidelines for workplace safety and dust control.</p>
        </div>
        <div class="safety-practices">
          <article class="practice-card">
            <h3 data-i18n="engineering-controls">Use Engineering Controls</h3>
            <ul>
              <li data-i18n="local-exhaust">Install local exhaust ventilation.</li>
              <li data-i18n="dust-collectors">Use dust collection systems.</li>
              <li data-i18n="equipment-maintenance">Maintain equipment properly.</li>
              <li data-i18n="less-dusty-methods">Upgrade to less dusty methods.</li>
            </ul>
          </article>
          <article class="practice-card">
            <h3 data-i18n="dust-suppression">Dust Suppression Methods</h3>
            <ul>
              <li data-i18n="wet-cutting">Wet cutting and grinding.</li>
              <li data-i18n="water-spraying">Water spraying systems.</li>
              <li data-i18n="enclosure">Enclosures around work areas.</li>
              <li data-i18n="housekeeping">Regular cleaning and vacuuming.</li>
            </ul>
          </article>
          <article class="practice-card">
            <h3 data-i18n="work-schedule">Work Schedule Management</h3>
            <ul>
              <li data-i18n="rotate-workers">Rotate workers from high-dust areas.</li>
              <li data-i18n="limit-duration">Limit exposure duration.</li>
              <li data-i18n="scheduled-breaks">Schedule breaks in clean areas.</li>
              <li data-i18n="avoid-peak-hours">Avoid peak dust hours.</li>
            </ul>
          </article>
          <article class="practice-card">
            <h3 data-i18n="housekeeping">Housekeeping Standards</h3>
            <ul>
              <li data-i18n="hepa-vacuums">Clean with HEPA-filtered vacuums.</li>
              <li data-i18n="wet-mopping">Wet mopping instead of dry sweeping.</li>
              <li data-i18n="remove-dust">Remove accumulated dust regularly.</li>
              <li data-i18n="safe-disposal">Dispose of waste safely.</li>
            </ul>
          </article>
        </div>
      </section>

      <section class="suppression-section">
        <div class="section-header">
          <h2 data-i18n="suppression-methods">Dust Suppression Methods</h2>
          <p data-i18n="suppression-description">Visual demonstration of effective techniques.</p>
        </div>
        <div class="suppression-grid">
          <article class="suppression-card active">
            <h3 data-i18n="water-spraying">Water Spraying System</h3>
            <p data-i18n="water-spraying-desc">Continuous water spray suppresses dust particles before they become airborne. Effective for construction and mining operations.</p>
          </article>
          <article class="suppression-card">
            <h3 data-i18n="enclosure">Enclosure & Ventilation</h3>
            <p data-i18n="enclosure-desc">Fully enclosed work areas with exhaust ventilation capture and remove dust at the source.</p>
          </article>
          <article class="suppression-card">
            <h3 data-i18n="wet-grinding">Wet Grinding Process</h3>
            <p data-i18n="wet-grinding-desc">Water-based grinding eliminates airborne dust by keeping particles wet and heavy.</p>
          </article>
          <article class="suppression-card">
            <h3 data-i18n="hepa-collector">HEPA Dust Collector</h3>
            <p data-i18n="hepa-desc">HEPA filters capture 99.97% of particles, protecting workers and the environment.</p>
          </article>
        </div>
      </section>

      <section class="info-card">
        <h2 data-i18n="health-checkups">Regular Health Checkups</h2>
        <p data-i18n="early-detection">Early detection saves lives.</p>
        <ul class="feature-list">
          <li data-i18n="baseline-exam">Baseline medical exam before starting dusty work.</li>
          <li data-i18n="annual-checkups">Annual chest X-rays and spirometry tests.</li>
          <li data-i18n="clinical-monitoring">Clinical monitoring if symptoms develop.</li>
          <li data-i18n="early-detection">Early detection prevents long-term damage.</li>
        </ul>
      </section>

      <section class="info-card">
        <h2 data-i18n="employer-responsibilities">Employer Responsibilities</h2>
        <p data-i18n="creating-safe">Create a safe workplace by providing PPE, training, and dust monitoring.</p>
        <ul class="feature-list">
          <li data-i18n="provide-ppe">Supply PPE at no cost.</li>
          <li data-i18n="dust-monitoring">Conduct regular dust monitoring.</li>
          <li data-i18n="maintenance">Maintain ventilation and dust control equipment.</li>
          <li data-i18n="communication">Keep workers informed of hazards and safety measures.</li>
        </ul>
      </section>

      <section class="final-cta">
        <h2 data-i18n="your-health">Your Health is Non-Negotiable</h2>
        <p data-i18n="implement-today">Implement these precautionary measures today to protect yourself and your workforce tomorrow.</p>
        <div class="cta-actions">
          <a href="health-risks.html" class="cta-btn-secondary" data-i18n="back-health">← Back to Health Risks</a>
          <a href="index.html" class="cta-btn-primary" data-i18n="check-quality">Check Air Quality Dashboard</a>
        </div>
        <p data-i18n="commitment-text">A safe workplace is a productive workplace. Together, we can eliminate occupational respiratory diseases.</p>
      </section>
    </main>
  </div>

  <script src="i18n.js"></script>
  <script src="safety-measures.js"></script>
</body>
</html>
'''

Path('health-risks.html').write_text(health_risks_html, encoding='utf-8')
Path('safety-measures.html').write_text(safety_measures_html, encoding='utf-8')
print('Updated health-risks.html and safety-measures.html')
