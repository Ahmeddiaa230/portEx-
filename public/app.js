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

  // Client-side credentials fallback (for static hosting like GitHub Pages)
  const LOCAL_CREDS = {
    admin: { password: 'portex2025', role: 'admin' },
    guest: { password: 'portex123', role: 'user' }
  };

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
    // Fallback: client-side auth when server is unavailable
    const cred = LOCAL_CREDS[username.toLowerCase()];
    if (cred && cred.password === password) {
      localStorage.setItem('portex_token', 'local_' + Date.now());
      localStorage.setItem('portex_role', cred.role);
      closeLoginModal();
      updateAuthUI();
      showToast(t('welcomeMsg') + ' <i class="fa-solid fa-face-smile"></i>');
    } else {
      errEl.textContent = t('loginError');
    }
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

// ─── Ports (embedded for static hosting) ──────────────────────────────────────
const LOCAL_PORTS = [
  {name:'Shanghai',country:'CN',code:'CNSHA',region:'Asia',baseRate:35},{name:'Ningbo',country:'CN',code:'CNNGB',region:'Asia',baseRate:35},{name:'Shenzhen',country:'CN',code:'CNSZX',region:'Asia',baseRate:30},{name:'Guangzhou',country:'CN',code:'CNGUA',region:'Asia',baseRate:30},{name:'Qingdao',country:'CN',code:'CNTAO',region:'Asia',baseRate:40},{name:'Tianjin',country:'CN',code:'CNTSN',region:'Asia',baseRate:45},{name:'Hong Kong',country:'HK',code:'HKHKG',region:'Asia',baseRate:25},{name:'Singapore',country:'SG',code:'SGSIN',region:'Asia',baseRate:30},{name:'Busan',country:'KR',code:'KRPUS',region:'Asia',baseRate:35},{name:'Tokyo',country:'JP',code:'JPTYO',region:'Asia',baseRate:50},{name:'Yokohama',country:'JP',code:'JPYOK',region:'Asia',baseRate:50},{name:'Osaka',country:'JP',code:'JPOSA',region:'Asia',baseRate:50},{name:'Mumbai',country:'IN',code:'INBOM',region:'Asia',baseRate:45},{name:'Chennai',country:'IN',code:'INMAA',region:'Asia',baseRate:45},{name:'Nhava Sheva',country:'IN',code:'INNSA',region:'Asia',baseRate:40},{name:'Colombo',country:'LK',code:'LKCMB',region:'Asia',baseRate:40},{name:'Port Klang',country:'MY',code:'MYPKG',region:'Asia',baseRate:35},{name:'Penang',country:'MY',code:'MYPNG',region:'Asia',baseRate:35},{name:'Laem Chabang',country:'TH',code:'THLCH',region:'Asia',baseRate:40},{name:'Bangkok',country:'TH',code:'THBKK',region:'Asia',baseRate:40},{name:'Jakarta',country:'ID',code:'IDJKT',region:'Asia',baseRate:45},{name:'Surabaya',country:'ID',code:'IDSUB',region:'Asia',baseRate:45},{name:'Manila',country:'PH',code:'PHMNL',region:'Asia',baseRate:50},{name:'Cebu',country:'PH',code:'PHCEB',region:'Asia',baseRate:50},{name:'Kaohsiung',country:'TW',code:'TWKHH',region:'Asia',baseRate:35},{name:'Keelung',country:'TW',code:'TWKEL',region:'Asia',baseRate:35},{name:'Ho Chi Minh',country:'VN',code:'VNSGN',region:'Asia',baseRate:40},{name:'Haiphong',country:'VN',code:'VNHPH',region:'Asia',baseRate:40},{name:'Chittagong',country:'BD',code:'BDCGP',region:'Asia',baseRate:55},{name:'Karachi',country:'PK',code:'PKKAR',region:'Asia',baseRate:55},{name:'Yangon',country:'MM',code:'MMRGN',region:'Asia',baseRate:60},
  {name:'Jebel Ali',country:'AE',code:'AEJEA',region:'MiddleEast',baseRate:45},{name:'Abu Dhabi',country:'AE',code:'AEAUH',region:'MiddleEast',baseRate:50},{name:'Sohar',country:'OM',code:'OMHOH',region:'MiddleEast',baseRate:55},{name:'Salalah',country:'OM',code:'OMSLL',region:'MiddleEast',baseRate:50},{name:'Jeddah',country:'SA',code:'SAJED',region:'MiddleEast',baseRate:50},{name:'Dammam',country:'SA',code:'SADMM',region:'MiddleEast',baseRate:55},{name:'Riyadh',country:'SA',code:'SARUH',region:'MiddleEast',baseRate:65},{name:'Aqaba',country:'JO',code:'JOAQJ',region:'MiddleEast',baseRate:60},{name:'Kuwait',country:'KW',code:'KWKWI',region:'MiddleEast',baseRate:65},{name:'Bahrain',country:'BH',code:'BHBAH',region:'MiddleEast',baseRate:65},{name:'Doha',country:'QA',code:'QADOH',region:'MiddleEast',baseRate:65},{name:'Bandar Abbas',country:'IR',code:'IRBND',region:'MiddleEast',baseRate:70},
  {name:'Rotterdam',country:'NL',code:'NLRTM',region:'Europe',baseRate:35},{name:'Antwerp',country:'BE',code:'BEANR',region:'Europe',baseRate:35},{name:'Hamburg',country:'DE',code:'DEHAM',region:'Europe',baseRate:40},{name:'Bremerhaven',country:'DE',code:'DEBRV',region:'Europe',baseRate:40},{name:'Felixstowe',country:'GB',code:'GBFXT',region:'Europe',baseRate:45},{name:'Southampton',country:'GB',code:'GBSOU',region:'Europe',baseRate:45},{name:'London',country:'GB',code:'GBLON',region:'Europe',baseRate:50},{name:'Le Havre',country:'FR',code:'FRLEH',region:'Europe',baseRate:45},{name:'Marseille',country:'FR',code:'FRMRS',region:'Europe',baseRate:50},{name:'Barcelona',country:'ES',code:'ESBCN',region:'Europe',baseRate:45},{name:'Valencia',country:'ES',code:'ESVLC',region:'Europe',baseRate:45},{name:'Algeciras',country:'ES',code:'ESALG',region:'Europe',baseRate:40},{name:'Piraeus',country:'GR',code:'GRPIR',region:'Europe',baseRate:50},{name:'Thessaloniki',country:'GR',code:'GRSKG',region:'Europe',baseRate:55},{name:'Istanbul',country:'TR',code:'TRIST',region:'Europe',baseRate:55},{name:'Mersin',country:'TR',code:'TRMER',region:'Europe',baseRate:60},{name:'Izmir',country:'TR',code:'TRIZM',region:'Europe',baseRate:60},{name:'Gemlik',country:'TR',code:'TRGEM',region:'Europe',baseRate:60},{name:'Derince',country:'TR',code:'TRDER',region:'Europe',baseRate:60},{name:'Ambarli',country:'TR',code:'TRAMB',region:'Europe',baseRate:55},{name:'Trieste',country:'IT',code:'ITTRS',region:'Europe',baseRate:55},{name:'Genoa',country:'IT',code:'ITGOA',region:'Europe',baseRate:50},{name:'Gioia Tauro',country:'IT',code:'ITGIT',region:'Europe',baseRate:50},{name:'Venice',country:'IT',code:'ITVCE',region:'Europe',baseRate:55},{name:'Livorno',country:'IT',code:'ITLIV',region:'Europe',baseRate:55},{name:'Dunkirk',country:'FR',code:'FRDKK',region:'Europe',baseRate:50},{name:'Gdansk',country:'PL',code:'PLGDN',region:'Europe',baseRate:65},{name:'Gdynia',country:'PL',code:'PLGDY',region:'Europe',baseRate:65},{name:'Constanta',country:'RO',code:'ROCSN',region:'Europe',baseRate:65},{name:'Koper',country:'SI',code:'SIKOP',region:'Europe',baseRate:60},{name:'Zeebrugge',country:'BE',code:'BEZEE',region:'Europe',baseRate:40},{name:'Gothenburg',country:'SE',code:'SEGOT',region:'Europe',baseRate:55},{name:'Oslo',country:'NO',code:'NOOSL',region:'Europe',baseRate:60},{name:'Copenhagen',country:'DK',code:'DKCPH',region:'Europe',baseRate:55},{name:'Helsinki',country:'FI',code:'FIHEL',region:'Europe',baseRate:65},{name:'Tallinn',country:'EE',code:'EETLL',region:'Europe',baseRate:70},{name:'Riga',country:'LV',code:'LVRIX',region:'Europe',baseRate:70},{name:'Klaipeda',country:'LT',code:'LTKLJ',region:'Europe',baseRate:70},{name:'Lisbon',country:'PT',code:'PTLIS',region:'Europe',baseRate:55},{name:'Porto',country:'PT',code:'PTOPO',region:'Europe',baseRate:55},{name:'Malta',country:'MT',code:'MTMLA',region:'Europe',baseRate:60},{name:'Limassol',country:'CY',code:'CYLMS',region:'Europe',baseRate:60},
  {name:'New York',country:'US',code:'USNYC',region:'Americas',baseRate:60},{name:'Los Angeles',country:'US',code:'USLAX',region:'Americas',baseRate:50},{name:'Long Beach',country:'US',code:'USLGB',region:'Americas',baseRate:50},{name:'Houston',country:'US',code:'USHOU',region:'Americas',baseRate:65},{name:'Savannah',country:'US',code:'USSAV',region:'Americas',baseRate:60},{name:'Miami',country:'US',code:'USMIA',region:'Americas',baseRate:60},{name:'Seattle',country:'US',code:'USSEA',region:'Americas',baseRate:55},{name:'Tacoma',country:'US',code:'USTCM',region:'Americas',baseRate:55},{name:'Baltimore',country:'US',code:'USBLT',region:'Americas',baseRate:65},{name:'Norfolk',country:'US',code:'USORF',region:'Americas',baseRate:65},{name:'Charleston',country:'US',code:'USCHS',region:'Americas',baseRate:60},{name:'New Orleans',country:'US',code:'USMSY',region:'Americas',baseRate:70},{name:'Vancouver',country:'CA',code:'CAVAN',region:'Americas',baseRate:60},{name:'Montreal',country:'CA',code:'CAMTR',region:'Americas',baseRate:70},{name:'Halifax',country:'CA',code:'CAHAL',region:'Americas',baseRate:70},{name:'Manzanillo',country:'MX',code:'MXZLO',region:'Americas',baseRate:65},{name:'Veracruz',country:'MX',code:'MXVER',region:'Americas',baseRate:70},{name:'Lazaro Cardenas',country:'MX',code:'MXLZC',region:'Americas',baseRate:65},{name:'Cartagena',country:'CO',code:'COCLO',region:'Americas',baseRate:75},{name:'Buenaventura',country:'CO',code:'COBUN',region:'Americas',baseRate:75},{name:'Santos',country:'BR',code:'BRSSZ',region:'Americas',baseRate:80},{name:'Rio de Janeiro',country:'BR',code:'BRRIO',region:'Americas',baseRate:85},{name:'Buenos Aires',country:'AR',code:'ARBUE',region:'Americas',baseRate:90},{name:'Montevideo',country:'UY',code:'UYMVD',region:'Americas',baseRate:85},{name:'Callao',country:'PE',code:'PELIM',region:'Americas',baseRate:80},{name:'Guayaquil',country:'EC',code:'ECGYE',region:'Americas',baseRate:80},{name:'Panama City',country:'PA',code:'PAPTY',region:'Americas',baseRate:70},{name:'Colon',country:'PA',code:'PACON',region:'Americas',baseRate:70},{name:'Kingston',country:'JM',code:'JMKIN',region:'Americas',baseRate:75},{name:'Puerto Rico',country:'US',code:'USSJP',region:'Americas',baseRate:75},
  {name:'Durban',country:'ZA',code:'ZADUR',region:'Africa',baseRate:80},{name:'Cape Town',country:'ZA',code:'ZACPT',region:'Africa',baseRate:85},{name:'Port Elizabeth',country:'ZA',code:'ZAELS',region:'Africa',baseRate:85},{name:'Richards Bay',country:'ZA',code:'ZARCS',region:'Africa',baseRate:90},{name:'Mombasa',country:'KE',code:'KEMBA',region:'Africa',baseRate:95},{name:'Dar es Salaam',country:'TZ',code:'TZDAR',region:'Africa',baseRate:95},{name:'Djibouti',country:'DJ',code:'DJJIB',region:'Africa',baseRate:90},{name:'Berbera',country:'SO',code:'SOBBO',region:'Africa',baseRate:100},{name:'Alexandria',country:'EG',code:'EGALY',region:'Africa',baseRate:65},{name:'Port Said',country:'EG',code:'EGPSD',region:'Africa',baseRate:65},{name:'Dakar',country:'SN',code:'SNDKR',region:'Africa',baseRate:85},{name:'Lagos',country:'NG',code:'NGLOS',region:'Africa',baseRate:100},{name:'Tema',country:'GH',code:'GHTEM',region:'Africa',baseRate:95},{name:'Abidjan',country:'CI',code:'CIABJ',region:'Africa',baseRate:95},{name:'Douala',country:'CM',code:'CMDLA',region:'Africa',baseRate:110},{name:'Luanda',country:'AO',code:'AOUAN',region:'Africa',baseRate:120},{name:'Maputo',country:'MZ',code:'MZMPM',region:'Africa',baseRate:100},{name:'Beira',country:'MZ',code:'MZBEW',region:'Africa',baseRate:105},{name:'Toamasina',country:'MG',code:'MGTMM',region:'Africa',baseRate:115},{name:'Casablanca',country:'MA',code:'MACAS',region:'Africa',baseRate:70},{name:'Tangier',country:'MA',code:'MATAN',region:'Africa',baseRate:65},{name:'Tunis',country:'TN',code:'TNTUN',region:'Africa',baseRate:75},{name:'Tripoli',country:'LY',code:'LYTIP',region:'Africa',baseRate:85},
  {name:'Sydney',country:'AU',code:'AUSYD',region:'Oceania',baseRate:75},{name:'Melbourne',country:'AU',code:'AUMEL',region:'Oceania',baseRate:75},{name:'Brisbane',country:'AU',code:'AUBNE',region:'Oceania',baseRate:80},{name:'Fremantle',country:'AU',code:'AUFRE',region:'Oceania',baseRate:80},{name:'Adelaide',country:'AU',code:'AUADL',region:'Oceania',baseRate:85},{name:'Darwin',country:'AU',code:'AUDRW',region:'Oceania',baseRate:95},{name:'Auckland',country:'NZ',code:'NZAKL',region:'Oceania',baseRate:85},{name:'Wellington',country:'NZ',code:'NZWLG',region:'Oceania',baseRate:90},{name:'Lyttelton',country:'NZ',code:'NZLYT',region:'Oceania',baseRate:90},{name:'Port Moresby',country:'PG',code:'PGPOM',region:'Oceania',baseRate:110},{name:'Suva',country:'FJ',code:'FJSUV',region:'Oceania',baseRate:120},{name:'Noumea',country:'NC',code:'NCNOU',region:'Oceania',baseRate:120}
];

let portsData = [];

// ─── HS Code Lookup (client-side) ─────────────────────────────────────────────
const LOCAL_HS_TABLE = [
  {prefix:'01',category:'Food',minDuty:5,maxDuty:25},{prefix:'24',category:'Food',minDuty:5,maxDuty:25},
  {prefix:'28',category:'Chemicals',minDuty:2,maxDuty:6.5},{prefix:'38',category:'Chemicals',minDuty:2,maxDuty:6.5},
  {prefix:'39',category:'Plastics',minDuty:4,maxDuty:12},{prefix:'40',category:'Plastics',minDuty:4,maxDuty:12},
  {prefix:'48',category:'Paper',minDuty:0,maxDuty:5},{prefix:'49',category:'Paper',minDuty:0,maxDuty:5},
  {prefix:'50',category:'Textiles',minDuty:8,maxDuty:20},{prefix:'63',category:'Textiles',minDuty:8,maxDuty:20},
  {prefix:'72',category:'Steel/Metal',minDuty:3,maxDuty:10},{prefix:'73',category:'Steel/Metal',minDuty:3,maxDuty:10},
  {prefix:'84',category:'Machinery',minDuty:0,maxDuty:5},{prefix:'85',category:'Electronics',minDuty:0,maxDuty:3.5},
  {prefix:'87',category:'Vehicles',minDuty:5,maxDuty:25},{prefix:'94',category:'Furniture',minDuty:5,maxDuty:15}
];
function lookupHsCode(hsCode) {
  const codeStr = hsCode.replace('.','').substring(0,2);
  const codeInt = parseInt(codeStr,10);
  const match = LOCAL_HS_TABLE.find(t => {
    if (t.prefix === codeStr) return true;
    if (t.category === 'Food' && codeInt >= 1 && codeInt <= 24) return true;
    if (t.category === 'Chemicals' && codeInt >= 28 && codeInt <= 38) return true;
    if (t.category === 'Plastics' && codeInt >= 39 && codeInt <= 40) return true;
    if (t.category === 'Paper' && codeInt >= 48 && codeInt <= 49) return true;
    if (t.category === 'Textiles' && codeInt >= 50 && codeInt <= 63) return true;
    if (t.category === 'Steel/Metal' && codeInt >= 72 && codeInt <= 73) return true;
    return false;
  });
  if (match) return { found:true, category:match.category, dutyRate:match.maxDuty };
  return { found:false, category:null, dutyRate:5 };
}

// ─── ETA Ranges ───────────────────────────────────────────────────────────────
const etaRanges = {
  'Asia-Asia':{min:5,max:14},'Asia-MiddleEast':{min:8,max:16},'Asia-Europe':{min:20,max:28},
  'Asia-Americas':{min:18,max:35},'Asia-Africa':{min:18,max:30},'Asia-Oceania':{min:10,max:20},
  'MiddleEast-Europe':{min:12,max:18},'MiddleEast-Americas':{min:22,max:32},'MiddleEast-Africa':{min:8,max:16},
  'Europe-Europe':{min:3,max:10},'Europe-Americas':{min:10,max:18},'Europe-Africa':{min:8,max:16},
  'Americas-Americas':{min:5,max:14},'Africa-Africa':{min:7,max:14},'Oceania-Oceania':{min:4,max:10}
};
function getEta(r1,r2) {
  const range = etaRanges[r1+'-'+r2] || etaRanges[r2+'-'+r1] || {min:20,max:35};
  return Math.floor(Math.random()*(range.max-range.min+1))+range.min;
}

// ─── LocalStorage History helpers ─────────────────────────────────────────────
function getLocalHistory() { return JSON.parse(localStorage.getItem('portex_history') || '[]'); }
function saveLocalHistory(h) { localStorage.setItem('portex_history', JSON.stringify(h)); }

async function loadPorts() {
  try {
    const res = await fetch('/api/ports');
    if (!res.ok) throw new Error('API unavailable');
    portsData = await res.json();
  } catch (e) {
    portsData = LOCAL_PORTS;
  }
  const originSelect = document.getElementById('originPort');
  const destSelect = document.getElementById('destPort');
  let opts = '<option value="">Select Port...</option>';
  portsData.forEach(p => { opts += `<option value="${p.name}">${p.name}, ${p.country} (${p.code})</option>`; });
  originSelect.innerHTML = opts;
  destSelect.innerHTML = opts;
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

  // Client-side calculation function
  function calculateLocally() {
    const findPort = (q) => {
      const ql = q.toLowerCase();
      return portsData.find(p => p.name === q) || portsData.find(p => p.name.toLowerCase() === ql);
    };
    const originPort = findPort(originName);
    const destPort = findPort(destName);
    if (!originPort || !destPort) { showToast('Unknown port', true); return null; }

    const isAdmin = getRole() === 'admin';
    const chargeableWeight = Math.max(calcCbm * 1000, weight);
    const chargeableCbm = chargeableWeight / 1000;
    const baseRatePerCbm = destPort.baseRate;
    const totalBase = chargeableCbm * baseRatePerCbm;
    const baf = totalBase * 0.15;
    const caf = totalBase * 0.05;
    const thcOrigin = 120 + (calcCbm * 5);
    const thcDest = 150 + (calcCbm * 5);
    const rawFreight = totalBase + baf + caf + thcOrigin + thcDest;
    const freightMultiplier = isAdmin ? 1.0 : (rawFreight >= 500 ? 1.05 : 1.10);
    const adjustedBase = totalBase * freightMultiplier;
    const adjustedBaf = baf * freightMultiplier;
    const adjustedCaf = caf * freightMultiplier;
    const adjustedThcOrigin = thcOrigin * freightMultiplier;
    const adjustedThcDest = thcDest * freightMultiplier;
    const freightSubtotal = adjustedBase + adjustedBaf + adjustedCaf + adjustedThcOrigin + adjustedThcDest;

    let customsDuty = null, dutyRate = null, cifValue = null, hsCategory = null;
    if (hsCode) {
      const hsResult = lookupHsCode(hsCode);
      dutyRate = hsResult.dutyRate;
      hsCategory = hsResult.category;
      cifValue = goodsValue + freightSubtotal + (goodsValue * 0.015);
      customsDuty = cifValue * (dutyRate / 100);
    }

    let grandTotal = freightSubtotal;
    if (customsDuty !== null) {
      const rawGrand = freightSubtotal + customsDuty;
      const grandMultiplier = isAdmin ? 1.0 : (rawGrand >= 500 ? 1.05 : 1.10);
      grandTotal = freightSubtotal * grandMultiplier + customsDuty * grandMultiplier;
    }

    const etaDays = getEta(originPort.region, destPort.region);

    return {
      chargeableWeight, chargeableCbm, baseRate: adjustedBase,
      baf: adjustedBaf, caf: adjustedCaf, thcOrigin: adjustedThcOrigin,
      thcDest: adjustedThcDest, freightSubtotal, cifValue, customsDuty,
      dutyRate, hsCategory, grandTotal, etaDays, isAdmin
    };
  }

  function renderResult(data) {
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
    const adminBadge = document.getElementById('adminBadge');
    if (data.isAdmin) adminBadge.classList.remove('hidden');
    else adminBadge.classList.add('hidden');
  }

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
    if (!res.ok) throw new Error(data.error || 'Server error');
    renderResult(data);
    showToast('✅ Calculation complete!');
    await loadHistory();
    await loadStats();
  } catch (err) {
    // Fallback: client-side calculation when server is unavailable
    const data = calculateLocally();
    if (!data) { btn.textContent = t('btnCalculate'); btn.disabled = false; return; }
    renderResult(data);
    // Save to localStorage history
    const history = getLocalHistory();
    history.unshift({
      id: Date.now(), created_at: new Date().toISOString(),
      origin: originName, destination: destName,
      cbm: calcCbm, total_usd: data.grandTotal, mode: currentMode
    });
    if (history.length > 50) history.pop();
    saveLocalHistory(history);
    showToast('✅ Calculation complete!');
    loadHistory();
    loadStats();
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
  let history = [];
  try {
    const res = await fetch('/api/history');
    if (!res.ok) throw new Error('API unavailable');
    const json = await res.json();
    history = json.history || json;
  } catch (e) {
    history = getLocalHistory();
  }
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
    const cells = [date, row.origin, row.destination, row.cbm.toFixed(2), '$' + row.total_usd.toFixed(2), row.mode];
    cells.forEach(val => {
      const td = document.createElement('td');
      td.textContent = val;
      tr.appendChild(td);
    });
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
}

// Event delegation for delete
document.getElementById('historyBody').addEventListener('click', async e => {
  const btn = e.target.closest('.delete-btn');
  if (!btn) return;
  const id = btn.dataset.id;
  try {
    const res = await fetch(`/api/history/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('API unavailable');
  } catch (err) {
    // Fallback: delete from localStorage
    const history = getLocalHistory().filter(h => String(h.id) !== String(id));
    saveLocalHistory(history);
  }
  await loadHistory();
  await loadStats();
});

// ─── Stats ────────────────────────────────────────────────────────────────────
async function loadStats() {
  let stats;
  try {
    const res = await fetch('/api/stats');
    if (!res.ok) throw new Error('API unavailable');
    stats = await res.json();
  } catch (e) {
    // Fallback: compute stats from localStorage
    const history = getLocalHistory();
    const total = history.length;
    const avgCbm = total > 0 ? history.reduce((s, h) => s + h.cbm, 0) / total : 0;
    const originCounts = {}, destCounts = {};
    history.forEach(h => {
      originCounts[h.origin] = (originCounts[h.origin] || 0) + 1;
      destCounts[h.destination] = (destCounts[h.destination] || 0) + 1;
    });
    const topOrigins = Object.entries(originCounts).map(([name, count]) => ({ name, count })).sort((a, b) => b.count - a.count).slice(0, 5);
    const topDestinations = Object.entries(destCounts).map(([name, count]) => ({ name, count })).sort((a, b) => b.count - a.count).slice(0, 5);
    stats = { total, avgCbm, topOrigins, topDestinations };
  }

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
}

// ─── Init ─────────────────────────────────────────────────────────────────────
async function init() {
  await loadPorts();
  await loadHistory();
  await loadStats();
}

init();
