// Scroll animations for cards
const observerOptions = {
  threshold: 0.15,
  rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('animate-in');
      observer.unobserve(entry.target);
    }
  });
}, observerOptions);

// Add animation styles
const animationStyle = document.createElement('style');
animationStyle.textContent = `
  .ppe-card,
  .practice-card,
  .suppression-card,
  .checkup-card,
  .responsibility-card {
    opacity: 0;
    transform: translateY(30px);
    transition: all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
  }

  .ppe-card.animate-in,
  .practice-card.animate-in,
  .suppression-card.animate-in,
  .checkup-card.animate-in,
  .responsibility-card.animate-in {
    opacity: 1;
    transform: translateY(0);
  }

  @keyframes banner-slide {
    from { opacity: 0; transform: translateY(-40px); }
    to { opacity: 1; transform: translateY(0); }
  }

  .safety-banner {
    animation: banner-slide 0.8s ease-out;
  }

  @keyframes pulse-safety {
    0%, 100% { box-shadow: 0 0 0 0 rgba(5, 150, 105, 0.7); }
    50% { box-shadow: 0 0 0 15px rgba(5, 150, 105, 0); }
  }

  .btn-reminder {
    animation: pulse-safety 2.5s ease-in-out infinite;
  }
`;
document.head.appendChild(animationStyle);

// Observe all cards
document.querySelectorAll('.ppe-card, .practice-card, .suppression-card, .checkup-card, .responsibility-card').forEach(el => {
  observer.observe(el);
});

// Suppression card interactivity
document.querySelectorAll('.suppression-card').forEach((card, index) => {
  if (index === 0) {
    card.classList.add('active');
  }

  card.addEventListener('click', () => {
    document.querySelectorAll('.suppression-card').forEach(c => c.classList.remove('active'));
    card.classList.add('active');
  });
});

function translate(key, fallback) {
  if (window.languageSwitcher && typeof window.languageSwitcher.getTranslation === 'function') {
    return window.languageSwitcher.getTranslation(key) || fallback || key;
  }
  return fallback || key;
}

// Health checkup reminder button
const reminderBtn = document.querySelector('.btn-reminder');
if (reminderBtn) {
  reminderBtn.addEventListener('click', () => {
    alert(translate('reminder-alert-text', '⏰ Health Checkup Reminder Set!\n\nYou will receive reminders for:\n• Annual lung function tests\n• Chest X-rays\n• Clinical consultations if needed\n\nStay safe and healthy!'));
    reminderBtn.textContent = translate('reminder-set', '✓ Reminder Set!');
    reminderBtn.style.background = '#059669';
    setTimeout(() => {
      reminderBtn.textContent = translate('set-reminder', 'Set Health Checkup Reminder');
      reminderBtn.style.background = 'linear-gradient(135deg, #059669 0%, #10b981 100%)';
    }, 2000);
  });
}

// Floating audio button removed to keep the Safety Measures section polished and uncluttered.

// Counter animation for sections
const animateCounters = () => {
  const counters = document.querySelectorAll('.prevention-number, .checkup-marker');
  counters.forEach(counter => {
    const text = counter.textContent.trim();
    if (/^\d+$/.test(text)) {
      const target = parseInt(text);
      let count = 0;
      const increment = Math.ceil(target / 20);
      const timer = setInterval(() => {
        count += increment;
        if (count >= target) {
          counter.textContent = target;
          clearInterval(timer);
        } else {
          counter.textContent = count;
        }
      }, 30);
    }
  });
};

// Trigger counter animation when section comes into view
const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animateCounters();
      counterObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.3 });

document.querySelectorAll('.checkup-timeline, .prevention-grid').forEach(el => {
  if (el) counterObserver.observe(el);
});

// Smooth scroll for internal links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const href = this.getAttribute('href');
    if (href !== '#') {
      e.preventDefault();
      const target = document.querySelector(href);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  });
});

// Log when page loads to test everything works
console.log('Safety Measures page loaded successfully with animations and narration support.');
