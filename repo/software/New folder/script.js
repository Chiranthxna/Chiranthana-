const syncStatus = document.getElementById('syncStatus');
const syncText = document.getElementById('syncText');
const pm25Value = document.getElementById('pm25Value');
const pm10Value = document.getElementById('pm10Value');
const pm25Status = document.getElementById('pm25Status');
const pm10Status = document.getElementById('pm10Status');
const pm25Wave = document.getElementById('pm25Wave');
const pm10Wave = document.getElementById('pm10Wave');
const pm25WaveLabel = document.getElementById('pm25WaveLabel');
const pm10WaveLabel = document.getElementById('pm10WaveLabel');
const barPm25 = document.getElementById('barPm25');
const barPm10 = document.getElementById('barPm10');
const barPm25Value = document.getElementById('barPm25Value');
const barPm10Value = document.getElementById('barPm10Value');
const pm25Chart = document.getElementById('pm25Chart');
const pm10Chart = document.getElementById('pm10Chart');
const recordTableBody = document.getElementById('recordTableBody');
const microSDCount = document.getElementById('microSDCount');
const locationInput = document.getElementById('locationInput');
const useGPSBtn = document.getElementById('useGPSBtn');
const savePendingBtn = document.getElementById('savePendingBtn');
const pendingRecordText = document.getElementById('pendingRecordText');
const sensorToggle = document.getElementById('sensorToggle');
const toggleStateText = document.getElementById('toggleStateText');
const navLinks = document.querySelectorAll('.nav-link[data-page]');
const backButtons = document.querySelectorAll('.back-btn');
const exportMicroSD = document.getElementById('exportMicroSD');
const microSDRecordsKey = 'microSDRecords';
let microSDRecords = [];
let currentLanguage = localStorage.getItem('selectedLanguage') || 'en';
let lastReadingWasViolation = false;

const pages = Array.from(document.querySelectorAll('.page'));
const pageSequence = ['page-live', 'page-health', 'page-safety'];
const pageOrder = { 'page-live': 0, 'page-health': 1, 'page-safety': 2 };

function showPage(pageId) {
  pages.forEach((page) => page.classList.toggle('active', page.id === pageId));
  navLinks.forEach((link) => link.classList.toggle('active', link.dataset.page === pageId));
  updateBackButtons(pageId);
}

function updateBackButtons(pageId) {
  const pageIndex = pageOrder[pageId];
  backButtons.forEach((button) => {
    button.disabled = pageIndex === 0;
  });
}

function handleNavClick(event) {
  event.preventDefault();
  const pageId = event.currentTarget.dataset.page;
  if (pageId) showPage(pageId);
}

function handleBackClick() {
  const activePage = document.querySelector('.page.active');
  if (!activePage) return;
  const index = pageOrder[activePage.id];
  if (index > 0) {
    showPage(pageSequence[index - 1]);
  }
}

function updateToggleVisual(connected) {
  const switchWrapper = sensorToggle.closest('.toggle-switch');
  if (!switchWrapper) return;
  switchWrapper.classList.toggle('active', connected);
}

const safeThresholds = { pm25: 35, pm10: 50 };
const maxValue = 150;
let pm25History = Array.from({ length: 12 }, () => 8 + Math.random() * 10);
let pm10History = Array.from({ length: 12 }, () => 12 + Math.random() * 18);
let isConnected = false;
let hasAutoRecordedSinceConnect = false;
let pendingRecord = null;
let sensorIntervalId = null;

let translations = {};

function updateSyncState() {
  if (!isConnected) {
    syncText.textContent = translations['disconnected'] || 'Disconnected';
    syncStatus.querySelector('.status-dot').classList.add('syncing');
    syncStatus.querySelector('.status-dot').style.background = '#f59e0b';
    toggleStateText.textContent = translations['toggle-off'] || 'OFF';
    return;
  }

  syncText.textContent = translations['connected'] || 'Connected';
  syncStatus.querySelector('.status-dot').classList.remove('syncing');
  syncStatus.querySelector('.status-dot').style.background = '#22c55e';
  toggleStateText.textContent = translations['toggle-on'] || 'ON';
}

// Load translations for narration and UI text
async function loadTranslations() {
  try {
    const url = new URL('translations.json', window.location.href).href;
    const response = await fetch(url);
    const data = await response.json();
    const currentLang = localStorage.getItem('selectedLanguage') || 'en';
    translations = data.translations[currentLang] || {};
  } catch (error) {
    console.error('Failed to load translations:', error);
    translations = {};
  }
}

// Listen for language changes
window.addEventListener('languageChanged', async () => {
  await loadTranslations();
  updateSyncState();
  renderRecordTable();
  updatePendingRecordUI();
});

function getStatus(value, threshold) {
  return value <= threshold ? (translations['safe'] || 'Safe') : (translations['unsafe'] || 'Unsafe');
}

function getSeverity(value, threshold) {
  if (value <= threshold) return 'safe';
  if (value <= threshold * 1.5) return 'warning';
  return 'danger';
}

function getOverallSeverity(pm25Value, pm10Value) {
  const severities = [
    getSeverity(pm25Value, safeThresholds.pm25),
    getSeverity(pm10Value, safeThresholds.pm10)
  ];

  if (severities.includes('danger')) return 'danger';
  if (severities.includes('warning')) return 'warning';
  return 'safe';
}

function updateWaveMeter(waveEl, labelEl, severity) {
  if (!waveEl || !labelEl) return;

  const labelText = severity === 'warning'
    ? (translations['warning'] || 'Warning')
    : severity === 'danger'
      ? (translations['danger'] || 'Danger')
      : (translations['safe'] || 'Safe');

  waveEl.className = `wave-meter ${severity}`;
  labelEl.textContent = labelText;
  labelEl.className = `wave-caption ${severity}`;
}

function renderMetricValue(value, threshold) {
  return `${value.toFixed(0)} µg/m³`;
}

function renderChart(svgEl, values, color) {
  if (!svgEl) return;

  const width = 300;
  const height = 140;
  const padding = 18;
  const points = values.map((value, index) => {
    const x = padding + (index * (width - padding * 2)) / (values.length - 1);
    const y = height - padding - (value / maxValue) * (height - padding * 2);
    return `${x},${y}`;
  });

  svgEl.innerHTML = `
    <polyline class="chart-line" points="${points.join(' ')}" stroke="${color}" />
    <line x1="${padding}" y1="${height - padding}" x2="${width - padding}" y2="${height - padding}" stroke="#cbd5e1" stroke-width="1" />
    <line x1="${padding}" y1="${padding}" x2="${padding}" y2="${height - padding}" stroke="#cbd5e1" stroke-width="1" />
  `;
}

function updateBars() {
  if (!barPm25 || !barPm10 || !barPm25Value || !barPm10Value) return;

  const latestPm25 = pm25History[pm25History.length - 1];
  const latestPm10 = pm10History[pm10History.length - 1];
  const percentPm25 = Math.min(100, (latestPm25 / safeThresholds.pm25) * 100);
  const percentPm10 = Math.min(100, (latestPm10 / safeThresholds.pm10) * 100);

  barPm25.style.width = `${percentPm25}%`;
  barPm10.style.width = `${percentPm10}%`;
  barPm25Value.textContent = `${percentPm25.toFixed(0)}%`;
  barPm10Value.textContent = `${percentPm10.toFixed(0)}%`;
  barPm25.style.background = latestPm25 <= safeThresholds.pm25 ? '#22c55e' : '#dc2626';
  barPm10.style.background = latestPm10 <= safeThresholds.pm10 ? '#22c55e' : '#dc2626';
}

function formatTimestamp(date = new Date()) {
  return date.toLocaleString();
}

function loadMicroSDRecords() {
  try {
    const raw = localStorage.getItem(microSDRecordsKey);
    microSDRecords = raw ? JSON.parse(raw) : [];
  } catch {
    microSDRecords = [];
  }
}

function saveMicroSDRecords() {
  localStorage.setItem(microSDRecordsKey, JSON.stringify(microSDRecords));
}

function createRecordEntry(pm25, pm10, recordType = 'auto') {
  const location = locationInput.value.trim() || (translations['unknown-location'] || 'Unknown');
  const timestamp = formatTimestamp();
  const syncStatusKey = isConnected ? 'connected' : 'connecting';
  const statusLabel = translations[syncStatusKey] || (syncStatusKey === 'connected' ? 'Connected' : 'Connecting...');
  const microSDStatus = isConnected ? '✅' : '❌';
  const record = {
    timestamp,
    location,
    pm25: pm25.toFixed(0),
    pm10: pm10.toFixed(0),
    syncStatusKey,
    syncStatus: statusLabel,
    microSD: microSDStatus,
    recordType
  };
  microSDRecords.push(record);
  saveMicroSDRecords();
  renderRecordTable();
  return record;
}

function renderRecordTable() {
  recordTableBody.innerHTML = '';
  updateMicroSDHeader();
  if (!microSDRecords.length) {
    const row = document.createElement('tr');
    const cell = document.createElement('td');
    cell.colSpan = 6;
    cell.textContent = translations['no-records'] || 'No records yet.';
    row.appendChild(cell);
    recordTableBody.appendChild(row);
    return;
  }

  microSDRecords.slice().reverse().forEach((record) => {
    const row = document.createElement('tr');
    ['timestamp','location','pm25','pm10','syncStatus','recordType'].forEach((key) => {
      const cell = document.createElement('td');
      if (key === 'syncStatus') {
        cell.textContent = translations[record.syncStatusKey] || record.syncStatus;
      } else if (key === 'recordType') {
        cell.textContent = translations[record.recordType === 'save' ? 'saved-label' : 'auto-label'] || (record.recordType === 'save' ? 'Saved' : 'Auto');
      } else {
        cell.textContent = record[key];
      }
      row.appendChild(cell);
    });
    recordTableBody.appendChild(row);
  });
}

function updateMicroSDHeader() {
  if (!microSDCount) return;
  const countLabel = translations['saved-records'] || 'Saved records';
  microSDCount.textContent = `${microSDRecords.length} ${countLabel}`;
}

function updatePendingRecordUI() {
  if (!pendingRecordText || !savePendingBtn) return;
  if (pendingRecord && isConnected) {
    const label = translations['save-button'] || 'Save';
    pendingRecordText.textContent = `${translations['save-button'] || 'Save'}: ${pendingRecord.pm25.toFixed(0)} µg/m³ PM2.5, ${pendingRecord.pm10.toFixed(0)} µg/m³ PM10`;
    savePendingBtn.disabled = false;
  } else {
    pendingRecordText.textContent = translations['no-pending-record'] || 'No pending compliant reading.';
    savePendingBtn.disabled = true;
  }
}

function exportMicroSDData() {
  const header = ['Timestamp', 'Location', 'PM2.5', 'PM10', 'Sync Status', 'Record Type', 'Micro SD Record'];
  const csvRows = [header.join(',')];
  microSDRecords.forEach((record) => {
    const syncLabel = translations[record.syncStatusKey] || record.syncStatus;
    const recordTypeLabel = translations[record.recordType === 'save' ? 'saved-label' : 'auto-label'] || (record.recordType === 'save' ? 'Saved' : 'Auto');
    csvRows.push([
      record.timestamp,
      `"${record.location.replace(/"/g, '""')}"`,
      record.pm25,
      record.pm10,
      `"${syncLabel.replace(/"/g, '""')}"`,
      `"${recordTypeLabel.replace(/"/g, '""')}"`,
      record.microSD
    ].join(','));
  });
  const blob = new Blob([csvRows.join('\n')], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'micro_sd_records.csv';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

useGPSBtn.addEventListener('click', async () => {
  if (!navigator.geolocation) {
    locationInput.value = translations['gps-unavailable'] || 'GPS unavailable';
    return;
  }

  navigator.geolocation.getCurrentPosition(
    (position) => {
      locationInput.value = `${position.coords.latitude.toFixed(4)}, ${position.coords.longitude.toFixed(4)}`;
    },
    () => {
      locationInput.value = translations['gps-failed'] || 'Unable to determine location';
    }
  );
});

exportMicroSD.addEventListener('click', () => {
  exportMicroSDData();
});

savePendingBtn.addEventListener('click', () => {
  if (!pendingRecord || !isConnected) return;
  createRecordEntry(pendingRecord.pm25, pendingRecord.pm10, 'save');
  pendingRecord = null;
  updatePendingRecordUI();
});

sensorToggle.addEventListener('change', () => {
  if (sensorToggle.checked) {
    isConnected = true;
    hasAutoRecordedSinceConnect = false;
    pendingRecord = null;
    updateSyncState();
    updateToggleVisual(true);
    runSensorUpdates();
  } else {
    isConnected = false;
    updateSyncState();
    updateToggleVisual(false);
    stopSensorUpdates();
  }
});

navLinks.forEach((link) => link.addEventListener('click', handleNavClick));
backButtons.forEach((button) => button.addEventListener('click', handleBackClick));

function stopSensorUpdates() {
  if (sensorIntervalId) {
    clearInterval(sensorIntervalId);
    sensorIntervalId = null;
  }
}

function runSensorUpdates() {
  if (sensorIntervalId) return;
  simulateSensorUpdate();
  sensorIntervalId = setInterval(simulateSensorUpdate, 2200);
}

function refreshMicroSDHeader() {
  updateMicroSDHeader();
}

function updateReadings() {
  const currentPm25 = pm25History[pm25History.length - 1] ?? 0;
  const currentPm10 = pm10History[pm10History.length - 1] ?? 0;
  const exceedsPm25 = currentPm25 > safeThresholds.pm25;
  const exceedsPm10 = currentPm10 > safeThresholds.pm10;
  const hasViolation = exceedsPm25 || exceedsPm10;

  if (pm25Value) {
    pm25Value.textContent = renderMetricValue(currentPm25, safeThresholds.pm25);
  }
  if (pm10Value) {
    pm10Value.textContent = renderMetricValue(currentPm10, safeThresholds.pm10);
  }
  const overallSeverity = getOverallSeverity(currentPm25, currentPm10);

  if (pm25Status) {
    pm25Status.textContent = overallSeverity === 'safe' ? (translations['safe'] || 'Safe') : (translations['unsafe'] || 'Unsafe');
    pm25Status.className = `metric-status ${overallSeverity === 'safe' ? 'safe' : 'unsafe'}`;
  }
  if (pm10Status) {
    pm10Status.textContent = overallSeverity === 'safe' ? (translations['safe'] || 'Safe') : (translations['unsafe'] || 'Unsafe');
    pm10Status.className = `metric-status ${overallSeverity === 'safe' ? 'safe' : 'unsafe'}`;
  }

  updateWaveMeter(pm25Wave, pm25WaveLabel, overallSeverity);
  updateWaveMeter(pm10Wave, pm10WaveLabel, overallSeverity);

  renderChart(pm25Chart, pm25History, '#16a34a');
  renderChart(pm10Chart, pm10History, '#f97316');
  updateBars();

  if (!isConnected) {
    pendingRecord = null;
    lastReadingWasViolation = false;
    updatePendingRecordUI();
    return;
  }

  if (!hasAutoRecordedSinceConnect) {
    createRecordEntry(currentPm25, currentPm10, 'auto');
    hasAutoRecordedSinceConnect = true;
    lastReadingWasViolation = hasViolation;
    pendingRecord = null;
    updatePendingRecordUI();
    return;
  }

  if (hasViolation && !lastReadingWasViolation) {
    createRecordEntry(currentPm25, currentPm10, 'auto');
    pendingRecord = null;
  } else if (!hasViolation) {
    pendingRecord = { pm25: currentPm25, pm10: currentPm10, timestamp: formatTimestamp() };
  } else {
    pendingRecord = null;
  }

  lastReadingWasViolation = hasViolation;
  updatePendingRecordUI();
}

function simulateSensorUpdate() {
  const nextPm25 = Math.max(3, pm25History[pm25History.length - 1] + (Math.random() - 0.45) * 8);
  const nextPm10 = Math.max(6, pm10History[pm10History.length - 1] + (Math.random() - 0.45) * 12);
  pm25History.push(Math.min(maxValue, nextPm25));
  pm10History.push(Math.min(maxValue, nextPm10));
  pm25History = pm25History.slice(-12);
  pm10History = pm10History.slice(-12);
  updateReadings();
}

loadTranslations().then(() => {
  loadMicroSDRecords();
  renderRecordTable();
  updatePendingRecordUI();
  updateSyncState();
  showPage('page-live');
  updateToggleVisual(false);
  updateReadings();

  sensorToggle.checked = true;
  isConnected = true;
  hasAutoRecordedSinceConnect = false;
  pendingRecord = null;
  updateSyncState();
  updateToggleVisual(true);
  runSensorUpdates();
});
