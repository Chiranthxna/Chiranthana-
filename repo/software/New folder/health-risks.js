// Animate lung illustrations on scroll
const observerOptions = {
  threshold: 0.3,
  rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('animated');
      observer.unobserve(entry.target);
    }
  });
}, observerOptions);

// Observe lung cards and condition cards
document.querySelectorAll('.lung-card, .condition-card, .prevention-card').forEach(el => {
  observer.observe(el);
});

// Add animation styles dynamically
const style = document.createElement('style');
style.textContent = `
  .lung-card,
  .condition-card,
  .prevention-card {
    opacity: 0;
    transform: translateY(20px);
    transition: all 0.6s ease-out;
  }

  .lung-card.animated,
  .condition-card.animated,
  .prevention-card.animated {
    opacity: 1;
    transform: translateY(0);
  }

  .lung-card.diseased {
    animation: pulse-warning 2s ease-in-out infinite;
  }

  @keyframes pulse-warning {
    0%, 100% { box-shadow: 0 20px 50px rgba(220, 38, 38, 0.1); }
    50% { box-shadow: 0 20px 50px rgba(220, 38, 38, 0.2); }
  }
`;
document.head.appendChild(style);

// Animate the warning badge
const warningBadge = document.querySelector('.warning-badge');
if (warningBadge) {
  warningBadge.style.animation = 'slide-in 0.8s ease-out';
  const badgeStyle = document.createElement('style');
  badgeStyle.textContent = `
    @keyframes slide-in {
      from { opacity: 0; transform: translateY(-20px); }
      to { opacity: 1; transform: translateY(0); }
    }
  `;
  document.head.appendChild(badgeStyle);
}

// Smooth scroll to sections
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const href = this.getAttribute('href');
    if (href !== '#') {
      e.preventDefault();
      const target = document.querySelector(href);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    }
  });
});

// Floating narration button removed to keep the health risks section focused and premium.

// Booking modal logic
const bookingBtn = document.getElementById('bookCheckupBtn');
const bookingModal = document.getElementById('bookingModal');
const modalCloseBtn = document.getElementById('modalCloseBtn');
const modalCancel = document.getElementById('modalCancel');
const bookingForm = document.getElementById('bookingForm');

function openBookingModal() {
  if (!bookingModal) return;
  bookingModal.setAttribute('aria-hidden', 'false');
}

function closeBookingModal() {
  if (!bookingModal) return;
  bookingModal.setAttribute('aria-hidden', 'true');
}

if (bookingBtn) bookingBtn.addEventListener('click', openBookingModal);
if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeBookingModal);
if (modalCancel) modalCancel.addEventListener('click', closeBookingModal);

if (bookingForm) {
  bookingForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('bookingName').value.trim();
    const email = document.getElementById('bookingEmail').value.trim();
    const phone = document.getElementById('bookingPhone').value.trim();
    const datetime = document.getElementById('bookingDatetime').value;
    const notes = document.getElementById('bookingNotes').value.trim();

    if (!name || !email || !datetime) {
      showToast(translate('booking-required', 'Please complete required fields'));
      return;
    }

    const bookings = JSON.parse(localStorage.getItem('healthBookings') || '[]');
    bookings.push({ id: Date.now(), name, email, phone, datetime, notes });
    localStorage.setItem('healthBookings', JSON.stringify(bookings));
    closeBookingModal();
    showToast(translate('booking-confirmation', 'Booking submitted — we will contact you to confirm.'));
    bookingForm.reset();
  });
}

// Simple toast
function showToast(msg, timeout = 3500) {
  const t = document.createElement('div');
  t.className = 'toast';
  t.textContent = msg;
  document.body.appendChild(t);
  setTimeout(() => { t.style.opacity = '0'; }, timeout - 500);
  setTimeout(() => { t.remove(); }, timeout);
}

// Bookings manager: create modal, render list, delete, export CSV
function createBookingsManager() {
  if (document.getElementById('bookingsManagerModal')) return;

  const modal = document.createElement('div');
  modal.id = 'bookingsManagerModal';
  modal.className = 'modal';
  modal.setAttribute('aria-hidden', 'true');
  modal.innerHTML = `
    <div class="modal-backdrop"></div>
    <div class="modal-panel" role="dialog" aria-modal="true">
      <button class="modal-close" id="managerCloseBtn">✕</button>
      <h3>${translate('manage-bookings', 'Manage Bookings')}</h3>
      <p class="muted">${translate('manage-bookings-description', 'View, delete, or export bookings stored locally.')}</p>
      <div id="bookingsList" style="max-height:360px;overflow:auto;margin:12px 0;padding:6px;border-radius:6px;border:1px solid var(--muted-border,#e5e7eb);background:var(--panel,#fff);"></div>
      <div style="display:flex;gap:8px;justify-content:flex-end;margin-top:12px;">
        <button id="exportCsvBtn" class="btn btn-outline">${translate('export-csv', 'Export CSV')}</button>
        <button id="closeManagerBtn" class="btn btn-secondary">${translate('close', 'Close')}</button>
      </div>
    </div>
  `;

  document.body.appendChild(modal);

  document.getElementById('managerCloseBtn').addEventListener('click', closeBookingsManager);
  document.getElementById('closeManagerBtn').addEventListener('click', closeBookingsManager);
  document.getElementById('exportCsvBtn').addEventListener('click', exportBookingsCSV);
}

function openBookingsManager() {
  createBookingsManager();
  const modal = document.getElementById('bookingsManagerModal');
  if (!modal) return;
  modal.setAttribute('aria-hidden', 'false');
  renderBookingsList();
}

function closeBookingsManager() {
  const modal = document.getElementById('bookingsManagerModal');
  if (!modal) return;
  modal.setAttribute('aria-hidden', 'true');
}

function renderBookingsList() {
  const container = document.getElementById('bookingsList');
  if (!container) return;
  const bookings = JSON.parse(localStorage.getItem('healthBookings') || '[]');
  if (!bookings.length) {
    container.innerHTML = `<div class="muted">${translate('no-bookings-found', 'No bookings found.')}</div>`;
    return;
  }

  container.innerHTML = '';
  bookings.slice().reverse().forEach(b => {
    const item = document.createElement('div');
    item.style.padding = '10px';
    item.style.borderBottom = '1px solid #eef2f7';
    item.innerHTML = `
      <div style="display:flex;justify-content:space-between;align-items:center;gap:8px;">
        <div>
          <div style="font-weight:600">${escapeHtml(b.name)} <span style="font-weight:400;color:#6b7280">• ${new Date(b.datetime).toLocaleString()}</span></div>
          <div style="font-size:0.9rem;color:#374151">${escapeHtml(b.email || '')} ${b.phone ? '• ' + escapeHtml(b.phone) : ''}</div>
          <div style="font-size:0.9rem;color:#6b7280;margin-top:6px">${escapeHtml(b.notes || '')}</div>
        </div>
        <div style="display:flex;flex-direction:column;gap:6px;align-items:flex-end">
          <button class="btn btn-outline small" data-delete-id="${b.id}">${translate('delete', 'Delete')}</button>
        </div>
      </div>
    `;

    container.appendChild(item);
  });

  // Wire delete buttons
  container.querySelectorAll('[data-delete-id]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const id = Number(btn.getAttribute('data-delete-id'));
      deleteBookingById(id);
    });
  });
}

function deleteBookingById(id) {
  let bookings = JSON.parse(localStorage.getItem('healthBookings') || '[]');
  const before = bookings.length;
  bookings = bookings.filter(b => b.id !== id);
  localStorage.setItem('healthBookings', JSON.stringify(bookings));
  renderBookingsList();
  showToast(before === bookings.length + 1 ? translate('booking-deleted', 'Booking deleted') : translate('no-booking-removed', 'No booking removed'));
}

function exportBookingsCSV() {
  const bookings = JSON.parse(localStorage.getItem('healthBookings') || '[]');
  if (!bookings.length) { showToast(translate('no-bookings-to-export', 'No bookings to export')); return; }

  const headers = ['id','name','email','phone','datetime','notes'];
  const rows = bookings.map(b => [b.id, b.name, b.email, b.phone, b.datetime, b.notes]);

  const csvContent = [headers, ...rows].map(r => r.map(cell => '"' + (String(cell || '').replace(/"/g,'""')) + '"').join(',')).join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `bookings_${new Date().toISOString().slice(0,19).replace(/[:T]/g,'-')}.csv`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
  showToast(translate('bookings-exported', 'Bookings exported'));
}

function escapeHtml(str) {
  if (!str) return '';
  return String(str).replace(/[&<>"']/g, s => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":"&#39;"}[s]));
}

// Wire Manage Bookings button
const manageBtn = document.getElementById('manageBookingsBtn');
if (manageBtn) manageBtn.addEventListener('click', openBookingsManager);

