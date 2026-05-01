// ─── i18n ────────────────────────────────────────────────────────────────────
const i18n = {
  en: {
    navHome: 'Home', navCalculator: 'Calculator', navHistory: 'History', navStats: 'Stats', navAbout: 'About',
    totalCalculations: 'Total Calculations', avgCbm: 'Average CBM',
    topOrigins: 'Top Origins', topDestinations: 'Top Destinations',
    calcTitle: 'Rate Calculator', calcDesc: 'Calculate precise sea freight LCL rates instantly.',
    modeA: 'CBM Mode (A)', modeB: 'Dimensions Mode (B)',
    origin: 'Export Port', destination: 'Receiving Port',
    cbm: 'Total CBM', weightKg: 'Weight (KG)', packages: 'Packages',
    lengthCm: 'L (cm)', widthCm: 'W (cm)', heightCm: 'H (cm)', weightPerPkg: 'Wt/Pkg (KG)', qty: 'Qty',
    includeCustoms: 'Include Customs Duties (HS Code)', hsCodeLabel: 'HS Code',
    productDesc: 'Product Description (optional)', goodsValueLabel: 'Declared Goods Value (USD)',
    btnCalculate: 'Calculate', rateBreakdown: 'Rate Breakdown',
    totalCbm: 'Total CBM:', chargeableWeight: 'Chargeable Weight:', baseRate: 'Base Rate:',
    freightSubtotal: 'Freight Subtotal:', category: 'Category:', dutyRate: 'Duty Rate:',
    declaredValue: 'Declared Value:', cifValue: 'CIF Value:', customsClearance: 'Customs Clearance:',
    grandTotal: 'TOTAL (All Inclusive):', etaLabel: 'ETA: — days', incoterm: 'Incoterm: CFR — Port to Port',
    customsDisclaimer: '* Customs estimate only. Actual duties may vary by local regulations and declared cargo value.',
    calcDisclaimer: 'The information provided may not be accurate due to limited access to customs regulations.',
    welcomeMsg: 'Welcome sir', goodbyeMsg: 'Take care',
    historyTitle: 'Calculation History', date: 'Date', totalUsd: 'Total (USD)', mode: 'Mode', actions: 'Actions',
    noHistory: 'No calculations yet.', errorInvalidHs: 'Invalid HS Code format (XXXX.XX or XXXXXX)',
    errorNoPorts: 'Please select export and receiving ports',
    loginTitle: 'Sign In', loginSub: 'Access your freight workspace',
    username: 'Username', password: 'Password', loginBtn: 'Login',
    loginError: 'Invalid credentials', logoutBtn: 'Logout',
    footerTagline: 'Intelligent Freight Platform', footerCtaText: 'Need a freight quote?',
    waBtn: 'Get a Custom Quote',
    aboutTagline: 'Export Intelligence. Freight Precision.',
    cap1Title: 'EMENA Export Operations', cap1Desc: 'Full management of export operations across Europe, Middle East, and North Africa.',
    cap2Title: '40% Volume Growth', cap2Desc: 'Drove a 40% increase in annual export volume, expanding foreign market share.',
    cap3Title: '8 New Countries', cap3Desc: 'Opened exports to 8 countries via commercial agreements with international distributors.',
    cap4Title: '20% Faster Delivery', cap4Desc: 'Optimized customs and logistics processes, reducing average delivery time by 20%.',
    cap5Title: 'Pricing & Positioning', cap5Desc: 'Built competitive pricing and market entry strategies through deep market analysis.',
    cap6Title: 'Trade Exhibitions', cap6Desc: 'Represented the company at international exhibitions, establishing global partnerships.',
    cap7Title: 'E-Commerce Integration', cap7Desc: 'Boosted digital sales by integrating e-commerce channels with corporate networks.',
    cap8Title: '90%+ Satisfaction Rate', cap8Desc: 'Managed CRM systems achieving post-sales customer satisfaction above 90%.',
    cap9Title: 'Sales & Performance', cap9Desc: 'Led customer acquisition, target-setting, and performance analysis end-to-end.',
    cap10Title: 'Sales-Production Sync', cap10Desc: 'Improved demand planning efficiency via sales and production team coordination.',
    tipCbm: 'Total CBM = Total cubic meters of cargo',
    tipWeight: 'Chargeable Weight = Max of (CBM × 1000) or actual weight',
    tipBase: 'Base Rate = Freight cost for the cargo on the vessel only',
    tipBaf: 'BAF = Bunker Adjustment Factor — fuel surcharge',
    tipCaf: 'CAF = Currency Adjustment Factor — exchange rate surcharge',
    tipThcO: 'THC Origin = Terminal Handling Charge at the export port',
    tipThcD: 'THC Destination = Terminal Handling Charge at the receiving port'
  },
  ar: {
    navHome: 'الرئيسية', navCalculator: 'حاسبة الأسعار', navHistory: 'السجل', navStats: 'الإحصائيات', navAbout: 'عن المنصة',
    totalCalculations: 'إجمالي الحسابات', avgCbm: 'متوسط CBM',
    topOrigins: 'أهم موانئ التصدير', topDestinations: 'أهم موانئ الاستلام',
    calcTitle: 'حاسبة الأسعار', calcDesc: 'احسب أسعار الشحن البحري LCL بدقة على الفور.',
    modeA: 'وضع CBM (أ)', modeB: 'وضع الأبعاد (ب)',
    origin: 'ميناء التصدير', destination: 'ميناء الاستلام',
    cbm: 'إجمالي CBM', weightKg: 'الوزن (كجم)', packages: 'الحزم',
    lengthCm: 'الطول (سم)', widthCm: 'العرض (سم)', heightCm: 'الارتفاع (سم)', weightPerPkg: 'الوزن/الحزمة (كجم)', qty: 'الكمية',
    includeCustoms: 'تضمين رسوم الجمارك (كود HS)', hsCodeLabel: 'كود HS',
    productDesc: 'وصف المنتج (اختياري)', goodsValueLabel: 'قيمة البضاعة (دولار)',
    btnCalculate: 'حساب', rateBreakdown: 'تفصيل السعر',
    totalCbm: 'إجمالي CBM:', chargeableWeight: 'الوزن القابل للرسوم:', baseRate: 'السعر الأساسي:',
    freightSubtotal: 'المجموع الفرعي للشحن:', category: 'الفئة:', dutyRate: 'نسبة الرسوم:',
    declaredValue: 'القيمة المصرح بها:', cifValue: 'قيمة CIF:', customsClearance: 'الجمارك:',
    grandTotal: 'المجموع الكلي:', etaLabel: 'الوقت المتوقع: — أيام', incoterm: 'مصطلح الشحن: CFR — من ميناء إلى ميناء',
    customsDisclaimer: '* تقدير جمركي فقط. قد تختلف الرسوم الفعلية حسب اللوائح المحلية والقيمة المصرح بها.',
    calcDisclaimer: 'المعلومات الممنوحة قد تكون غير دقيقة بسبب عدم الاطلاع بشكل كافٍ على التصاريح الجمركية.',
    welcomeMsg: 'أهلاً بك سيدي', goodbyeMsg: 'وداعاً',
    historyTitle: 'سجل الحسابات', date: 'التاريخ', totalUsd: 'الإجمالي (USD)', mode: 'الوضع', actions: 'إجراءات',
    noHistory: 'لا توجد حسابات بعد.', errorInvalidHs: 'تنسيق كود HS غير صالح',
    errorNoPorts: 'يرجى تحديد ميناء التصدير وميناء الاستلام',
    loginTitle: 'تسجيل الدخول', loginSub: 'الوصول إلى منصة الشحن',
    username: 'اسم المستخدم', password: 'كلمة المرور', loginBtn: 'دخول',
    loginError: 'بيانات الدخول غير صحيحة', logoutBtn: 'خروج',
    footerTagline: 'منصة الشحن الذكية', footerCtaText: 'تحتاج عرض سعر؟',
    waBtn: 'احصل على عرض سعر مخصص',
    aboutTagline: 'ذكاء التصدير. دقة الشحن.',
    cap1Title: 'عمليات التصدير EMENA', cap1Desc: 'إدارة شاملة لعمليات التصدير في أوروبا والشرق الأوسط وشمال أفريقيا.',
    cap2Title: 'نمو 40% في الحجم', cap2Desc: 'حقق زيادة 40% في حجم الصادرات السنوية وتوسع في الأسواق الخارجية.',
    cap3Title: '8 دول جديدة', cap3Desc: 'فتح صادرات لـ 8 دول عبر اتفاقيات تجارية مع موزعين دوليين.',
    cap4Title: 'تسليم أسرع 20%', cap4Desc: 'تحسين إجراءات الجمارك واللوجستيات وتقليل وقت التسليم بنسبة 20%.',
    cap5Title: 'التسعير والتموضع', cap5Desc: 'بناء استراتيجيات تسعير تنافسية ودخول أسواق من خلال تحليل معمق.',
    cap6Title: 'المعارض التجارية', cap6Desc: 'تمثيل الشركة في المعارض الدولية وإنشاء شراكات عالمية.',
    cap7Title: 'التكامل الإلكتروني', cap7Desc: 'تعزيز المبيعات الرقمية بتكامل قنوات التجارة الإلكترونية مع الشبكات المؤسسية.',
    cap8Title: 'رضا 90%+', cap8Desc: 'إدارة أنظمة CRM مع رضا عملاء ما بعد البيع يتجاوز 90%.',
    cap9Title: 'المبيعات والأداء', cap9Desc: 'قيادة اكتساب العملاء وتحديد الأهداف وتحليل الأداء.',
    cap10Title: 'تنسيق المبيعات والإنتاج', cap10Desc: 'تحسين كفاءة تخطيط الطلب عبر تنسيق فرق المبيعات والإنتاج.',
    tipCbm: 'إجمالي CBM = إجمالي الأمتار المكعبة للشحنة',
    tipWeight: 'الوزن القابل للرسوم = الأكبر بين (CBM × 1000) أو الوزن الفعلي',
    tipBase: 'السعر الأساسي = سعر الحمولة على السفينة فقط',
    tipBaf: 'BAF = عامل تعديل الوقود — رسوم الوقود الإضافية',
    tipCaf: 'CAF = عامل تعديل العملة — رسوم سعر الصرف',
    tipThcO: 'THC التصدير = رسوم المناولة داخل ميناء التصدير',
    tipThcD: 'THC الاستلام = رسوم المناولة داخل ميناء الاستلام'
  },
  tr: {
    navHome: 'Ana Sayfa', navCalculator: 'Hesaplayıcı', navHistory: 'Geçmiş', navStats: 'İstatistikler', navAbout: 'Hakkında',
    totalCalculations: 'Toplam Hesaplamalar', avgCbm: 'Ortalama CBM',
    topOrigins: 'En İyi İhracat Limanları', topDestinations: 'En İyi Alım Limanları',
    calcTitle: 'Fiyat Hesaplayıcı', calcDesc: 'Hassas deniz taşımacılığı LCL fiyatlarını anında hesaplayın.',
    modeA: 'CBM Modu (A)', modeB: 'Boyutlar Modu (B)',
    origin: 'İhracat Limanı', destination: 'Alım Limanı',
    cbm: 'Toplam CBM', weightKg: 'Ağırlık (KG)', packages: 'Paketler',
    lengthCm: 'U (cm)', widthCm: 'G (cm)', heightCm: 'Y (cm)', weightPerPkg: 'Ağırlık/Paket (KG)', qty: 'Miktar',
    includeCustoms: 'Gümrük Vergilerini Dahil Et (HS Kodu)', hsCodeLabel: 'HS Kodu',
    productDesc: 'Ürün Açıklaması (isteğe bağlı)', goodsValueLabel: 'Mal Değeri (USD)',
    btnCalculate: 'Hesapla', rateBreakdown: 'Fiyat Detayları',
    totalCbm: 'Toplam CBM:', chargeableWeight: 'Ücrete Tabi Ağırlık:', baseRate: 'Temel Ücret:',
    freightSubtotal: 'Navlun Ara Toplamı:', category: 'Kategori:', dutyRate: 'Vergi Oranı:',
    declaredValue: 'Beyan Edilen Değer:', cifValue: 'CIF Değeri:', customsClearance: 'Gümrük Takas:',
    grandTotal: 'GENEL TOPLAM:', etaLabel: 'ETA: — gün', incoterm: 'Teslim Şekli: CFR — Limandan Limana',
    customsDisclaimer: '* Yalnızca tahmini gümrük vergisidir. Gerçek vergiler değişebilir.',
    calcDisclaimer: 'Sağlanan bilgiler, gümrük düzenlemelerine sınırlı erişim nedeniyle doğru olmayabilir.',
    welcomeMsg: 'Hoşgeldiniz', goodbyeMsg: 'Güle güle',
    historyTitle: 'Hesaplama Geçmişi', date: 'Tarih', totalUsd: 'Toplam (USD)', mode: 'Mod', actions: 'İşlemler',
    noHistory: 'Henüz hesaplama yok.', errorInvalidHs: 'Geçersiz HS Kodu formatı',
    errorNoPorts: 'Lütfen ihracat ve alım limanlarını seçin',
    loginTitle: 'Giriş Yap', loginSub: 'Navlun çalışma alanınıza erişin',
    username: 'Kullanıcı Adı', password: 'Şifre', loginBtn: 'Giriş',
    loginError: 'Geçersiz kimlik bilgileri', logoutBtn: 'Çıkış',
    footerTagline: 'Akıllı Navlun Platformu', footerCtaText: 'Navlun teklifi mi lazım?',
    waBtn: 'Özel Teklif Alın',
    aboutTagline: 'İhracat Zekası. Navlun Hassasiyeti.',
    cap1Title: 'EMENA İhracat Operasyonları', cap1Desc: 'Avrupa, Orta Doğu ve Kuzey Afrika genelinde ihracat operasyonlarının tam yönetimi.',
    cap2Title: '%40 Hacim Büyümesi', cap2Desc: 'Yıllık ihracat hacminde %40 artış sağlayarak yabancı pazar payını genişletti.',
    cap3Title: '8 Yeni Ülke', cap3Desc: 'Uluslararası distribütörlerle yapılan ticari anlaşmalar yoluyla 8 ülkeye ihracat açıldı.',
    cap4Title: '%20 Daha Hızlı Teslimat', cap4Desc: 'Gümrük ve lojistik süreçleri optimize edilerek ortalama teslimat süresi %20 azaltıldı.',
    cap5Title: 'Fiyatlandırma & Konumlandırma', cap5Desc: 'Derin pazar analizi ile rekabetçi fiyatlandırma stratejileri geliştirildi.',
    cap6Title: 'Ticaret Fuarları', cap6Desc: 'Uluslararası fuarlarda şirket temsil edilerek küresel ortaklıklar kuruldu.',
    cap7Title: 'E-Ticaret Entegrasyonu', cap7Desc: 'E-ticaret kanalları kurumsal ağlarla entegre edilerek dijital satışlar artırıldı.',
    cap8Title: '%90+ Memnuniyet Oranı', cap8Desc: 'CRM sistemleri yönetilerek satış sonrası müşteri memnuniyeti %90 üzerinde tutuldu.',
    cap9Title: 'Satış & Performans', cap9Desc: 'Müşteri kazanımı, hedef belirleme ve performans analizi uçtan uca yönetildi.',
    cap10Title: 'Satış-Üretim Senkronizasyonu', cap10Desc: 'Satış ve üretim ekipleri koordinasyonuyla talep planlama verimliliği artırıldı.',
    tipCbm: 'Toplam CBM = Yükün toplam metreküp hacmi',
    tipWeight: 'Ücrete Tabi Ağırlık = (CBM × 1000) veya gerçek ağırlıktan büyük olan',
    tipBase: 'Temel Ücret = Sadece gemideki yükün navlun maliyeti',
    tipBaf: 'BAF = Yakıt Düzeltme Faktörü — yakıt ek ücreti',
    tipCaf: 'CAF = Döviz Düzeltme Faktörü — kur farkı ek ücreti',
    tipThcO: 'THC İhracat = İhracat limanındaki terminal taşıma ücreti',
    tipThcD: 'THC Alım = Alım limanındaki terminal taşıma ücreti'
  }
};

// ─── State ───────────────────────────────────────────────────────────────────
let currentLang = localStorage.getItem('portex_lang') || 'en';
let portsData = [];
let currentMode = 'cbm';

function t(key) {
  return (i18n[currentLang] && i18n[currentLang][key]) || i18n.en[key] || key;
}

// ─── Translations ─────────────────────────────────────────────────────────────
function applyTranslations(lang) {
  currentLang = lang;
  localStorage.setItem('portex_lang', lang);
  document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
  document.documentElement.lang = lang;
  document.getElementById('langSwitcher').value = lang;
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    const val = t(key);
    if (el.tagName === 'INPUT' && el.type === 'text') el.placeholder = val;
    else el.textContent = val;
  });
  // Update tooltips
  document.querySelectorAll('[data-tip]').forEach(el => {
    el.title = t(el.getAttribute('data-tip'));
  });
  updateAuthUI();
}
applyTranslations(currentLang);

// ─── Theme ────────────────────────────────────────────────────────────────────
let isDark = localStorage.getItem('portex_theme') !== 'light';
function applyTheme() {
  document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
  document.getElementById('themeToggle').innerHTML = isDark ? '<i class="fa-solid fa-moon"></i>' : '<i class="fa-solid fa-sun"></i>';
  localStorage.setItem('portex_theme', isDark ? 'dark' : 'light');
}
applyTheme();
document.getElementById('themeToggle').addEventListener('click', () => { isDark = !isDark; applyTheme(); });
document.getElementById('langSwitcher').addEventListener('change', e => applyTranslations(e.target.value));

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
