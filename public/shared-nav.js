/* shared-nav.js — inject navbar + loading screen into every page */
(function () {
  const WA_NUMBER = '+447781505971';
  const WA_LINK = `https://wa.me/${WA_NUMBER.replace(/\D/g, '')}`;

  const ACTIVE_PAGE = (() => {
    const p = window.location.pathname.split('/').pop() || 'index.html';
    return p;
  })();

  const isActive = (page) => ACTIVE_PAGE === page ? 'active' : '';

  /* ─── Loading Screen ─── */
  const loadingHTML = `
  <div id="loadingScreen">
    <div class="loading-ocean">
      <svg viewBox="0 0 340 160" xmlns="http://www.w3.org/2000/svg">
        <!-- Ocean waves -->
        <defs>
          <linearGradient id="oceanGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" style="stop-color:#1e3a5f;stop-opacity:1" />
            <stop offset="100%" style="stop-color:#0a1628;stop-opacity:1" />
          </linearGradient>
        </defs>
        <rect width="340" height="160" fill="url(#oceanGrad)"/>
        
        <!-- Wave 1 -->
        <g class="wave-path">
          <path d="M0 110 Q20 100 40 110 Q60 120 80 110 Q100 100 120 110 Q140 120 160 110 Q180 100 200 110 Q220 120 240 110 Q260 100 280 110 Q300 120 320 110 Q340 100 360 110 L360 160 L0 160 Z" fill="rgba(59,130,246,0.3)"/>
          <path d="M-80 110 Q-60 100 -40 110 Q-20 120 0 110" fill="rgba(59,130,246,0.3)"/>
        </g>
        <!-- Wave 2 -->
        <g class="wave-path-2">
          <path d="M0 118 Q25 108 50 118 Q75 128 100 118 Q125 108 150 118 Q175 128 200 118 Q225 108 250 118 Q275 128 300 118 Q325 108 350 118 L350 160 L0 160 Z" fill="rgba(59,130,246,0.2)"/>
        </g>

        <!-- Ship -->
        <g class="ship-body" transform="translate(120, 55)">
          <!-- Hull -->
          <path d="M10 55 L90 55 L80 70 L20 70 Z" fill="#1e3a5f" stroke="#3B82F6" stroke-width="1.5"/>
          <!-- Deck -->
          <rect x="15" y="45" width="70" height="12" rx="2" fill="#1a3050" stroke="#3B82F6" stroke-width="1"/>
          <!-- Cabin -->
          <rect x="30" y="28" width="35" height="20" rx="3" fill="#0f1f35" stroke="#3B82F6" stroke-width="1"/>
          <!-- Windows -->
          <rect x="34" y="33" width="8" height="6" rx="1" fill="#60a5fa" opacity="0.8"/>
          <rect x="46" y="33" width="8" height="6" rx="1" fill="#60a5fa" opacity="0.8"/>
          <rect x="58" y="33" width="8" height="6" rx="1" fill="#60a5fa" opacity="0.5"/>
          <!-- Mast -->
          <line x1="50" y1="0" x2="50" y2="28" stroke="#3B82F6" stroke-width="2"/>
          <!-- Flag -->
          <polygon points="50,3 68,10 50,17" fill="#3B82F6" opacity="0.9"/>
          <!-- Smoke -->
          <circle cx="40" cy="22" r="4" fill="rgba(150,150,170,0.3)" style="animation: smokePuff 1.5s ease-in-out infinite"/>
          <circle cx="35" cy="15" r="5" fill="rgba(150,150,170,0.2)" style="animation: smokePuff 1.5s ease-in-out 0.3s infinite"/>
        </g>
      </svg>
    </div>
    <div class="loading-brand">Port<span>Ex</span></div>
    <div class="loading-bar-wrap"><div class="loading-bar"></div></div>
  </div>`;

  /* ─── Navbar ─── */
  const navbarHTML = `
  <nav class="top-navbar" id="topNavbar">
    <a href="index.html" class="navbar-logo">
      Port<span class="logo-accent">Ex</span>
      <div class="logo-dot"></div>
    </a>
    <ul class="navbar-links">
      <li><a href="index.html" class="${isActive('index.html')}">Home</a></li>
      <li><a href="calculator.html" class="${isActive('calculator.html')}">Calculator</a></li>
      <li><a href="activities.html" class="${isActive('activities.html')}">Our Activities</a></li>
      <li><a href="about.html" class="${isActive('about.html')}">About Us</a></li>
      <li><a href="contact.html" class="${isActive('contact.html')}">Contact</a></li>
    </ul>
    <div class="navbar-right">
      <!-- Auth button -->
      <div class="auth-area" id="authArea">
        <button class="auth-btn" id="authBtn" aria-label="Sign in">
          <span class="auth-icon"><i class="fa-solid fa-arrow-right-to-bracket"></i></span>
          <span class="auth-label" data-i18n="loginBtn">Login</span>
        </button>
      </div>
      <select class="nav-lang-switcher" id="navLang">
        <option value="en">EN</option>
        <option value="ar">AR</option>
        <option value="tr">TR</option>
      </select>
      <button class="nav-theme-btn" id="navThemeBtn">🌙</button>
      <button class="nav-hamburger" id="navHamburger">☰</button>
    </div>
  </nav>
  <div class="mobile-nav-drawer" id="mobileDrawer">
    <a href="index.html" class="${isActive('index.html')}">Home</a>
    <a href="calculator.html" class="${isActive('calculator.html')}">Calculator</a>
    <a href="activities.html" class="${isActive('activities.html')}">Our Activities</a>
    <a href="about.html" class="${isActive('about.html')}">About Us</a>
    <a href="contact.html" class="${isActive('contact.html')}">Contact</a>
  </div>
  <div class="navbar-spacer"></div>`;

  /* ─── Floating WhatsApp ─── */
  const waHTML = `
  <a href="${WA_LINK}" target="_blank" rel="noopener" class="floating-whatsapp" aria-label="WhatsApp">
    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
    </svg>
    <span class="wa-label">WhatsApp</span>
  </a>`;

  /* ─── Inject ─── */
  function initNav() {
    // Inject loading screen
    const loader = document.createElement('div');
    loader.innerHTML = loadingHTML;
    if (document.body.firstElementChild) {
      document.body.insertBefore(loader.firstElementChild, document.body.firstElementChild);
    } else {
      document.body.appendChild(loader.firstElementChild);
    }

    // Inject navbar
    const navWrapper = document.createElement('div');
    navWrapper.innerHTML = navbarHTML;
    
    // Insert after login modal if it exists, else at top
    const modal = document.getElementById('loginModal');
    if (modal && modal.nextSibling) {
      document.body.insertBefore(navWrapper, modal.nextSibling);
    } else if (document.body.firstElementChild) {
      document.body.insertBefore(navWrapper, document.body.firstElementChild.nextSibling || document.body.firstElementChild);
    } else {
      document.body.appendChild(navWrapper);
    }
    
    while (navWrapper.firstChild) {
      document.body.insertBefore(navWrapper.firstChild, navWrapper);
    }
    navWrapper.remove();

    // Inject floating WA
    const waEl = document.createElement('div');
    waEl.innerHTML = waHTML;
    document.body.appendChild(waEl.firstElementChild);

    // Hide loading screen after page load
    window.addEventListener('load', () => {
      setTimeout(() => {
        const ls = document.getElementById('loadingScreen');
        if (ls) ls.classList.add('hidden');
      }, 800);
    });
    // Fallback
    setTimeout(() => {
      const ls = document.getElementById('loadingScreen');
      if (ls) ls.classList.add('hidden');
    }, 2500);

    // Navbar scroll effect
    const navbar = document.getElementById('topNavbar');
    if (navbar) {
      window.addEventListener('scroll', () => {
        navbar.classList.toggle('scrolled', window.scrollY > 20);
      });
    }

    // Hamburger toggle
    const navHamburger = document.getElementById('navHamburger');
    if (navHamburger) {
      navHamburger.addEventListener('click', () => {
        document.getElementById('mobileDrawer').classList.toggle('open');
      });
    }

    // Language switcher sync
    const navLang = document.getElementById('navLang');
    const savedLang = localStorage.getItem('portex_lang') || 'en';
    if (navLang) {
      navLang.value = savedLang;
      navLang.addEventListener('change', (e) => {
        localStorage.setItem('portex_lang', e.target.value);
        if (typeof applyTranslations === 'function') {
          applyTranslations(e.target.value);
        } else {
          window.location.reload(); 
        }
      });
    }

    // Theme toggle
    const themeBtn = document.getElementById('navThemeBtn');
    if (themeBtn) {
      const savedTheme = localStorage.getItem('portex_theme') !== 'light' ? 'dark' : 'light';
      document.documentElement.setAttribute('data-theme', savedTheme);
      themeBtn.innerHTML = savedTheme === 'dark' ? '<i class="fa-solid fa-moon"></i>' : '<i class="fa-solid fa-sun"></i>';

      themeBtn.addEventListener('click', () => {
        const current = document.documentElement.getAttribute('data-theme');
        const next = current === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', next);
        localStorage.setItem('portex_theme', next);
        themeBtn.innerHTML = next === 'dark' ? '<i class="fa-solid fa-moon"></i>' : '<i class="fa-solid fa-sun"></i>';
      });
    }

    // Auth Button logic for multipage
    const authBtn = document.getElementById('authBtn');
    if (authBtn) {
      authBtn.addEventListener('click', () => {
        if (!document.getElementById('loginModal')) {
          window.location.href = 'calculator.html';
        }
      });
    }
  }

  // Execute synchronously since script is at the end of body
  initNav();
})();
