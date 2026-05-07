// ─── Theme ────────────────────────────────────────────────────────────────────
let isDark = localStorage.getItem('portex_theme') !== 'light';
function applyTheme() {
  document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
  document.getElementById('themeToggle').innerHTML = isDark ? '<i class="fa-solid fa-moon"></i>' : '<i class="fa-solid fa-sun"></i>';
  localStorage.setItem('portex_theme', isDark ? 'dark' : 'light');
}
applyTheme();
document.getElementById('themeToggle').addEventListener('click', () => { isDark = !isDark; applyTheme(); });

// ─── Mobile Nav ───────────────────────────────────────────────────────────────
const hamburgerBtn = document.getElementById('hamburgerBtn');
const topbarNav = document.getElementById('topbarNav');
const navBackdrop = document.getElementById('sidebarBackdrop');

hamburgerBtn.addEventListener('click', () => {
  topbarNav.classList.toggle('open');
  navBackdrop.classList.toggle('show');
});
navBackdrop.addEventListener('click', () => {
  topbarNav.classList.remove('open');
  navBackdrop.classList.remove('show');
});

document.querySelectorAll('.nav-item').forEach(item => {
  item.addEventListener('click', () => {
    document.querySelectorAll('.nav-item').forEach(i => i.classList.remove('active'));
    item.classList.add('active');
    topbarNav.classList.remove('open');
    navBackdrop.classList.remove('show');
  });
});

// ─── Toast ────────────────────────────────────────────────────────────────────
function showToast(msg, isError = false) {
  const old = document.querySelector('.toast');
  if (old) old.remove();
  const el = document.createElement('div');
  el.className = 'toast' + (isError ? ' error' : '');
  el.innerHTML = msg;
  document.body.appendChild(el);
  setTimeout(() => el.remove(), 3000);
}

// ─── Auth ─────────────────────────────────────────────────────────────────────
function getToken() { return localStorage.getItem('portex_token') || ''; }
function getRole() { return localStorage.getItem('portex_role') || ''; }

function updateAuthUI() {
  const role = getRole();
  const btn = document.getElementById('authBtn');
  const icon = btn.querySelector('.auth-icon');
  const label = btn.querySelector('.auth-label');
  btn.classList.remove('logged-in', 'admin');
  if (role === 'admin') {
    icon.innerHTML = '<i class="fa-regular fa-user"></i>';
    label.textContent = 'Admin';
    btn.classList.add('admin');
    btn.title = t('logoutBtn');
  } else if (role === 'user') {
    icon.innerHTML = '<i class="fa-regular fa-user"></i>';
    label.textContent = 'Guest';
    btn.classList.add('logged-in');
    btn.title = t('logoutBtn');
  } else {
    icon.innerHTML = '<i class="fa-solid fa-arrow-right-to-bracket"></i>';
    label.textContent = t('loginBtn');
  }
}

document.getElementById('authBtn').addEventListener('click', () => {
  if (getRole()) { doLogout(); } else { openLoginModal(); }
});

function openLoginModal() {
  document.getElementById('loginModal').classList.remove('hidden');
  document.getElementById('loginUser').focus();
}
function closeLoginModal() {
  document.getElementById('loginModal').classList.add('hidden');
  document.getElementById('loginError').textContent = '';
  document.getElementById('loginForm').reset();
}
document.getElementById('modalCloseBtn').addEventListener('click', closeLoginModal);
document.getElementById('loginModal').addEventListener('click', e => { if (e.target === document.getElementById('loginModal')) closeLoginModal(); });

document.getElementById('loginForm').addEventListener('submit', async e => {
  e.preventDefault();
  const username = document.getElementById('loginUser').value.trim();
  const password = document.getElementById('loginPass').value;
  const errEl = document.getElementById('loginError');
  const btn = document.getElementById('loginSubmitBtn');
  btn.textContent = '...';
  btn.disabled = true;
  try {
    const res = await fetch('/api/auth/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ username, password }) });
    const data = await res.json();
    if (data.success) {
      localStorage.setItem('portex_token', data.token);
      localStorage.setItem('portex_role', data.role);
      closeLoginModal();
      updateAuthUI();
      showToast(t('welcomeMsg') + ' <i class="fa-solid fa-face-smile"></i>');
    } else {
      errEl.textContent = t('loginError');
    }
  } catch (err) {
    errEl.textContent = 'Server error';
  } finally {
    btn.textContent = t('loginBtn');
    btn.disabled = false;
  }
});

async function doLogout() {
  const token = getToken();
  try { await fetch('/api/auth/logout', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ token }) }); } catch (_) { }
  localStorage.removeItem('portex_token');
  localStorage.removeItem('portex_role');
  updateAuthUI();
  showToast(t('goodbyeMsg') + ' <i class="fa-solid fa-face-smile-wink"></i>');
}

// ─── Ports ────────────────────────────────────────────────────────────────────
async function loadPorts() {
  try {
    const res = await fetch('/api/ports');
    portsData = await res.json();
    const originSelect = document.getElementById('originPort');
    const destSelect = document.getElementById('destPort');
    let opts = '<option value="">Select Port...</option>';
    portsData.forEach(p => { opts += `<option value="${p.name}">${p.name}, ${p.country} (${p.code})</option>`; });
    originSelect.innerHTML = opts;
    destSelect.innerHTML = opts;
  } catch (e) { console.error('Failed to load ports', e); }
}

document.getElementById('swapPortsBtn').addEventListener('click', () => {
  const o = document.getElementById('originPort');
  const d = document.getElementById('destPort');
  const tmp = o.value; o.value = d.value; d.value = tmp;
});
// ─── Calculator Tabs ──────────────────────────────────────────────────────────
document.querySelectorAll('.tab-btn').forEach(btn => {
  btn.addEventListener('click', e => {
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    e.target.classList.add('active');
    currentMode = e.target.getAttribute('data-mode');
    document.getElementById('modeAFields').classList.toggle('hidden', currentMode !== 'cbm');
    document.getElementById('modeBFields').classList.toggle('hidden', currentMode !== 'dimensions');
  });
});

// Live preview Mode B
['inputL', 'inputW', 'inputH', 'inputQty'].forEach(id => {
  document.getElementById(id).addEventListener('input', () => {
    const l = parseFloat(document.getElementById('inputL').value) || 0;
    const w = parseFloat(document.getElementById('inputW').value) || 0;
    const h = parseFloat(document.getElementById('inputH').value) || 0;
    const q = parseFloat(document.getElementById('inputQty').value) || 0;
    document.getElementById('livePreview').textContent = `Preview: ${((l * w * h / 1000000) * q).toFixed(2)} m³`;
  });
});

// ─── Customs Toggle ───────────────────────────────────────────────────────────
document.getElementById('customsToggle').addEventListener('change', e => {
  const on = e.target.checked;
  document.getElementById('customsFields').classList.toggle('hidden', !on);
  document.getElementById('resCustomsBlock').classList.toggle('hidden', !on);
  document.getElementById('customsDisclaimer').classList.toggle('hidden', !on);
  if (!on) document.getElementById('hsError').textContent = '';
});

// ─── Calculate ────────────────────────────────────────────────────────────────
document.getElementById('calculateBtn').addEventListener('click', async () => {
  const originName = document.getElementById('originPort').value;
  const destName = document.getElementById('destPort').value;
  if (!originName || !destName) { showToast(t('errorNoPorts'), true); return; }

  let calcCbm = 0, weight = 0, pkgs = 0, len = null, wid = null, hgt = null;
  if (currentMode === 'cbm') {
    calcCbm = parseFloat(document.getElementById('inputCbm').value) || 0;
    weight = parseFloat(document.getElementById('inputWeight').value) || 0;
    pkgs = parseInt(document.getElementById('inputPkgs').value, 10) || 0;
  } else {
    len = parseFloat(document.getElementById('inputL').value) || 0;
    wid = parseFloat(document.getElementById('inputW').value) || 0;
    hgt = parseFloat(document.getElementById('inputH').value) || 0;
    const wt = parseFloat(document.getElementById('inputWtPkg').value) || 0;
    pkgs = parseInt(document.getElementById('inputQty').value, 10) || 0;
    calcCbm = (len * wid * hgt / 1000000) * pkgs;
    weight = wt * pkgs;
  }

  const useCustoms = document.getElementById('customsToggle').checked;
  let hsCode = null, goodsValue = 0;
  if (useCustoms) {
    hsCode = document.getElementById('hsCode').value.trim();
    if (!/^(\d{4}\.\d{2}|\d{6,10})$/.test(hsCode)) {
      document.getElementById('hsError').textContent = t('errorInvalidHs');
      return;
    }
    document.getElementById('hsError').textContent = '';
    goodsValue = parseFloat(document.getElementById('goodsValue').value) || 0;
  }

  const btn = document.getElementById('calculateBtn');
  btn.textContent = '...';
  btn.disabled = true;

  try {
    const res = await fetch('/api/calculate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${getToken()}` },
      body: JSON.stringify({
        mode: currentMode, origin: originName, destination: destName,
        cbm: calcCbm, weight_kg: weight, packages: pkgs,
        length_cm: len, width_cm: wid, height_cm: hgt,
        language: currentLang, hs_code: hsCode || null, goods_value: goodsValue
      })
    });

    const data = await res.json();
    if (!res.ok) { showToast(data.error || 'Server error', true); return; }

    // Update result card
    document.getElementById('resCbm').textContent = calcCbm.toFixed(2) + ' m³';
    document.getElementById('resChargeWeight').textContent = data.chargeableWeight.toFixed(0) + ' KG';
    document.getElementById('resBaseRate').textContent = '$' + data.baseRate.toFixed(2);
    document.getElementById('resBaf').textContent = '$' + data.baf.toFixed(2);
    document.getElementById('resCaf').textContent = '$' + data.caf.toFixed(2);
    document.getElementById('resThcOrigin').textContent = '$' + data.thcOrigin.toFixed(2);
    document.getElementById('resThcDest').textContent = '$' + data.thcDest.toFixed(2);
    document.getElementById('resFreightTotal').textContent = '$' + data.freightSubtotal.toFixed(2);
    document.getElementById('resGrandTotal').textContent = '$' + data.grandTotal.toFixed(2);
    document.getElementById('resEta').textContent = `ETA: ${data.etaDays} days`;

    if (useCustoms && data.cifValue !== null) {
      document.getElementById('resHsCode').textContent = hsCode;
      document.getElementById('resCategory').textContent = data.hsCategory || '-';
      document.getElementById('resDeclaredValue').textContent = '$' + goodsValue.toFixed(2);
      document.getElementById('resCifValue').textContent = '$' + data.cifValue.toFixed(2);
      document.getElementById('resDutyRate').textContent = data.dutyRate + '%';
      document.getElementById('resCustomsDuty').textContent = '$' + data.customsDuty.toFixed(2);
    }

    // Admin badge
    const adminBadge = document.getElementById('adminBadge');
    if (data.isAdmin) adminBadge.classList.remove('hidden');
    else adminBadge.classList.add('hidden');

    showToast('✅ Calculation saved!');
    await loadHistory();
    await loadStats();
  } catch (err) {
    showToast('Connection error', true);
  } finally {
    btn.textContent = t('btnCalculate');
    btn.disabled = false;
  }
});

// ─── History ──────────────────────────────────────────────────────────────────
function esc(str) {
  const d = document.createElement('div');
  d.textContent = str;
  return d.innerHTML;
}

async function loadHistory() {
  try {
    const res = await fetch('/api/history');
    const json = await res.json();
    const history = json.history || json;
    const tbody = document.getElementById('historyBody');
    const emptyEl = document.getElementById('emptyHistory');

    if (!history.length) {
      tbody.innerHTML = '';
      emptyEl.classList.remove('hidden');
      return;
    }
    emptyEl.classList.add('hidden');
    tbody.innerHTML = '';

    history.forEach(row => {
      const tr = document.createElement('tr');
      const date = new Date(row.created_at).toLocaleDateString();
      // Use textContent via DOM — no innerHTML for server data (XSS fix)
      const cells = [date, row.origin, row.destination, row.cbm.toFixed(2), '$' + row.total_usd.toFixed(2), row.mode];
      cells.forEach(val => {
        const td = document.createElement('td');
        td.textContent = val;
        tr.appendChild(td);
      });
      // Actions cell
      const tdAct = document.createElement('td');
      const delBtn = document.createElement('button');
      delBtn.className = 'delete-btn';
      delBtn.dataset.id = row.id;
      delBtn.textContent = 'Delete';
      delBtn.setAttribute('aria-label', 'Delete record ' + row.id);
      tdAct.appendChild(delBtn);
      tr.appendChild(tdAct);
      tbody.appendChild(tr);
    });
  } catch (e) { console.error('Failed to load history', e); }
}

// Event delegation for delete — no window.deleteHistory
document.getElementById('historyBody').addEventListener('click', async e => {
  const btn = e.target.closest('.delete-btn');
  if (!btn) return;
  const id = btn.dataset.id;
  try {
    await fetch(`/api/history/${id}`, { method: 'DELETE' });
    await loadHistory();
    await loadStats();
  } catch (err) { console.error(err); }
});

// ─── Stats ────────────────────────────────────────────────────────────────────
async function loadStats() {
  try {
    const res = await fetch('/api/stats');
    const stats = await res.json();
    document.getElementById('statTotal').textContent = stats.total;
    document.getElementById('statAvgCbm').textContent = parseFloat(stats.avgCbm).toFixed(2);

    function renderBars(containerId, data) {
      const container = document.getElementById(containerId);
      container.innerHTML = '';
      if (!data || !data.length) return;
      const max = Math.max(...data.map(d => d.count));
      data.forEach(item => {
        const pct = (item.count / max) * 100;
        const wrap = document.createElement('div');
        wrap.className = 'bar-row';
        const lbl = document.createElement('div');
        lbl.className = 'bar-label';
        lbl.title = item.name;
        lbl.textContent = item.name;
        const track = document.createElement('div');
        track.className = 'bar-track';
        const fill = document.createElement('div');
        fill.className = 'bar-fill';
        fill.style.width = '0%';
        track.appendChild(fill);
        const val = document.createElement('div');
        val.className = 'bar-val';
        val.textContent = item.count;
        wrap.appendChild(lbl);
        wrap.appendChild(track);
        wrap.appendChild(val);
        container.appendChild(wrap);
        setTimeout(() => { fill.style.width = pct + '%'; }, 50);
      });
    }

    renderBars('originsChart', stats.topOrigins);
    renderBars('destinationsChart', stats.topDestinations);
  } catch (e) { console.error('Failed to load stats', e); }
}

// ─── Init ─────────────────────────────────────────────────────────────────────
async function init() {
  await loadPorts();
  await loadHistory();
  await loadStats();
}

init();
