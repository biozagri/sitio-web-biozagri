/* ══════════════════════════════════════════
   BIOZAGRI SAS – Main JavaScript
   Control Research BIOZAGRI SAS
   ══════════════════════════════════════════ */

'use strict';

/* ════════════════════════════════════════
   RENDERIZADOR — Testimonios y Blog
   Lee window.BZ (data/biozagri-data.js)
════════════════════════════════════════ */
(function initDynamicContent() {

  /* — helpers — */
  function stars(n) {
    let h = '';
    for (let i = 1; i <= 5; i++) {
      if (i <= Math.floor(n))    h += '<i class="fas fa-star"></i>';
      else if (i - 0.5 <= n)    h += '<i class="fas fa-star-half-alt"></i>';
      else                       h += '<i class="far fa-star"></i>';
    }
    return h;
  }

  /* ─── TESTIMONIOS ─── */
  function renderTestimonios() {
    const data  = window.BZ && window.BZ.testimonios;
    const track = document.getElementById('testiTrack');
    const dots  = document.getElementById('testiDots');
    if (!data || !track || !dots) return;

    track.innerHTML = data.map((t, i) => `
      <div class="testi-card${i === 0 ? ' active' : ''}">
        <div class="testi-stars">${stars(t.estrellas)}</div>
        <p class="testi-quote">"${t.texto}"</p>
        <div class="testi-author">
          <div class="testi-avatar" style="background:${t.color}"><span>${t.iniciales}</span></div>
          <div class="testi-info">
            <strong>${t.nombre}</strong>
            <span>${t.cargo}</span>
          </div>
        </div>
      </div>`).join('');

    dots.innerHTML = data.map((_, i) =>
      `<span class="t-dot${i === 0 ? ' active' : ''}"></span>`
    ).join('');
  }

  /* ─── COLORES POR CATEGORÍA (foto de portada automática) ─── */
  const TAG_BG = {
    'Casos de Éxito':     'linear-gradient(145deg,#071f3a 0%,#0d4a7a 100%)',
    'Fitosanidad':        'linear-gradient(145deg,#071f12 0%,#0d6b32 100%)',
    'Nutrición Vegetal':  'linear-gradient(145deg,#12200a 0%,#3d7a14 100%)',
    'Regulaciones':       'linear-gradient(145deg,#1a0a2e 0%,#4a1a8a 100%)',
    'Agronomía':          'linear-gradient(145deg,#0a1f14 0%,#1a5a36 100%)',
    'Novedades BIOZAGRI': 'linear-gradient(145deg,#2a1000 0%,#7a3010 100%)',
  };
  const TAG_DEFAULT = 'linear-gradient(145deg,#071228 0%,#0e2a4a 100%)';

  function mediaStyle(post) {
    if (post.imagen) {
      return `style="background:url('${post.imagen}') center/cover no-repeat"`;
    }
    const bg = TAG_BG[post.tag] || TAG_DEFAULT;
    return `style="background:${bg}"`;
  }

  /* ─── BLOG — solo 3 tarjetas + lista expandible ─── */
  const BLOG_VISIBLE = 3;

  function renderCard(post, i) {
    const featured = post.featured && i === 0;
    const delay    = i > 0 ? `style="--delay:${i * 0.12}s"` : '';
    const lectura  = post.lectura
      ? `<span><i class="fas fa-clock"></i> ${post.lectura}</span>` : '';
    const pdfBadge = post.pdf
      ? `<span class="bc-pdf-badge"><i class="fas fa-file-pdf"></i> PDF</span>` : '';
    return `
      <article class="blog-card${featured ? ' blog-card-featured' : ''} reveal-up" ${delay}>
        <div class="bc-media" ${mediaStyle(post)}>
          <span class="bc-tag">${post.tag}</span>
          ${pdfBadge}
        </div>
        <div class="bc-body">
          <div class="bc-meta">
            <span><i class="fas fa-calendar"></i> ${post.fecha}</span>
            ${lectura}
          </div>
          <h3>${post.titulo}</h3>
          <p>${post.resumen}</p>
          <button class="bc-read-more" onclick="BZ.openPost('${post.id}')">
            Leer artículo <i class="fas fa-arrow-right"></i>
          </button>
        </div>
      </article>`;
  }

  function renderListItem(post) {
    const bg = TAG_BG[post.tag] || TAG_DEFAULT;
    return `
      <div class="bli-item">
        <div class="bli-dot" style="background:${bg}">
          <i class="fas fa-newspaper"></i>
        </div>
        <div class="bli-info">
          <span class="bli-tag">${post.tag}</span>
          <h4 class="bli-titulo">${post.titulo}</h4>
          <div class="bli-meta">
            <span><i class="fas fa-calendar"></i> ${post.fecha}</span>
            ${post.lectura ? `<span><i class="fas fa-clock"></i> ${post.lectura}</span>` : ''}
            ${post.pdf ? `<span class="bli-pdf"><i class="fas fa-file-pdf"></i> PDF</span>` : ''}
          </div>
        </div>
        <button class="bli-btn" onclick="BZ.openPost('${post.id}')">
          <i class="fas fa-arrow-right"></i>
        </button>
      </div>`;
  }

  function renderBlog() {
    const data = window.BZ && window.BZ.blog;
    const grid = document.getElementById('blogGrid');
    if (!data || !grid) return;

    const visible = data.slice(0, BLOG_VISIBLE);
    const rest    = data.slice(BLOG_VISIBLE);

    grid.innerHTML = visible.map((p, i) => renderCard(p, i)).join('');

    /* quitar botón anterior si existe */
    const oldWrap = document.getElementById('blogVerMasWrap');
    if (oldWrap) oldWrap.remove();

    if (rest.length === 0) return;

    /* botón + lista expandible */
    const wrap = document.createElement('div');
    wrap.id        = 'blogVerMasWrap';
    wrap.className = 'blog-ver-mas-wrap';
    wrap.innerHTML = `
      <button class="btn-ver-mas-blog" id="btnVerMasBlog" aria-expanded="false">
        <i class="fas fa-th-list"></i>
        Ver todos los artículos
        <span class="bvm-count">${data.length}</span>
        <i class="fas fa-chevron-down bvm-arrow"></i>
      </button>
      <div class="blog-lista-extra" id="blogListaExtra" hidden>
        ${rest.map(p => renderListItem(p)).join('')}
      </div>`;
    grid.parentElement.appendChild(wrap);

    document.getElementById('btnVerMasBlog').addEventListener('click', function () {
      const lista   = document.getElementById('blogListaExtra');
      const arrow   = this.querySelector('.bvm-arrow');
      const abierto = !lista.hidden;
      lista.hidden  = abierto;
      arrow.classList.toggle('fa-chevron-down', abierto);
      arrow.classList.toggle('fa-chevron-up', !abierto);
      this.setAttribute('aria-expanded', String(!abierto));
    });
  }

  /* ─── MODAL ─── */
  function initBlogModal() {
    const overlay  = document.getElementById('blogModal');
    const closeBtn = document.getElementById('blogModalClose');
    if (!overlay) return;

    function close() {
      overlay.classList.remove('active');
      document.body.style.overflow = '';
      /* limpiar iframe para que no quede cargando */
      const fr = document.getElementById('blogModalPdfFrame');
      if (fr) fr.src = '';
    }

    if (closeBtn) closeBtn.addEventListener('click', close);
    overlay.addEventListener('click', e => { if (e.target === overlay) close(); });
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && overlay.classList.contains('active')) close();
    });
  }

  /* abre un post por ID */
  window.BZ = window.BZ || {};
  window.BZ.openPost = function (id) {
    const data = window.BZ && window.BZ.blog;
    const post = data && data.find(p => p.id === id);
    if (!post) return;

    document.getElementById('blogModalTitle').textContent = post.titulo;

    const lectura = post.lectura
      ? `<span><i class="fas fa-clock"></i> ${post.lectura}</span>` : '';
    document.getElementById('blogModalMeta').innerHTML =
      `<span><i class="fas fa-calendar"></i> ${post.fecha}</span>
       ${lectura}
       <span class="bc-tag">${post.tag}</span>`;

    /* — cuerpo del modal — */
    const bodyEl = document.getElementById('blogModalBody');
    const pdfEl  = document.getElementById('blogModalPdfFrame');
    const dlBtn  = document.getElementById('blogModalPdfBtn');

    if (post.pdf) {
      /* mostrar PDF embebido + botón descarga */
      if (pdfEl) {
        pdfEl.src   = post.pdf + '#toolbar=1&navpanes=0&scrollbar=1';
        pdfEl.style.display = 'block';
      }
      if (dlBtn) {
        dlBtn.href  = post.pdf;
        dlBtn.style.display = 'inline-flex';
      }
      /* resumen de texto debajo del PDF */
      if (bodyEl) bodyEl.innerHTML =
        `<details class="bm-text-toggle">
          <summary><i class="fas fa-align-left"></i> Ver resumen en texto</summary>
          <div class="bm-text-content">${post.contenido}</div>
         </details>`;
    } else {
      if (pdfEl) { pdfEl.src = ''; pdfEl.style.display = 'none'; }
      if (dlBtn) dlBtn.style.display = 'none';
      if (bodyEl) { bodyEl.innerHTML = post.contenido; bodyEl.scrollTop = 0; }
    }

    const overlay = document.getElementById('blogModal');
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  };

  /* — arranque — */
  renderTestimonios();
  renderBlog();
  initBlogModal();

})();


/* ════════════════════════════════════════
   COOKIE BANNER
════════════════════════════════════════ */
(function initCookieBanner() {
  const banner = document.getElementById('cookieBanner');
  const btn    = document.getElementById('cookieAccept');
  if (!banner) return;
  // Mostrar solo si el usuario no ha aceptado antes
  if (!localStorage.getItem('biozagri_cookies_accepted')) {
    setTimeout(() => { banner.style.display = 'block'; }, 1500);
  }
  if (btn) {
    btn.addEventListener('click', () => {
      localStorage.setItem('biozagri_cookies_accepted', '1');
      banner.style.animation = 'none';
      banner.style.transition = 'opacity .3s, transform .3s';
      banner.style.opacity = '0';
      banner.style.transform = 'translateY(100%)';
      setTimeout(() => { banner.style.display = 'none'; }, 320);
    });
  }
})();

/* ════════════════════════════════════════
   PRELOADER
════════════════════════════════════════ */
(function initPreloader() {
  const preloader = document.getElementById('preloader');
  if (!preloader) return;

  function dismiss() {
    preloader.classList.add('fade-out');
    setTimeout(() => { preloader.style.display = 'none'; }, 700);
  }

  window.addEventListener('load', () => setTimeout(dismiss, 300));
  setTimeout(dismiss, 3200);
})();


/* ════════════════════════════════════════
   HERO PARTICLE CANVAS
════════════════════════════════════════ */
(function initParticles() {
  const canvas = document.getElementById('heroParticles');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W, H, particles = [];

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  function mkParticle() {
    return {
      x: Math.random() * (W || 1),
      y: Math.random() * (H || 1),
      r: Math.random() * 1.4 + 0.3,
      dx: (Math.random() - 0.5) * 0.25,
      dy: -(Math.random() * 0.35 + 0.08),
      a: Math.random() * 0.55 + 0.08,
      col: Math.random() > 0.55 ? [76,175,80] : [201,168,76]
    };
  }

  function init() {
    resize();
    particles = Array.from({ length: 85 }, mkParticle);
  }

  function loop() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach((p, i) => {
      p.x += p.dx; p.y += p.dy;
      if (p.y < -5) { particles[i] = mkParticle(); particles[i].y = H + 5; }
      if (p.x < -5) p.x = W + 5;
      if (p.x > W + 5) p.x = -5;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${p.col[0]},${p.col[1]},${p.col[2]},${p.a})`;
      ctx.fill();
    });
    requestAnimationFrame(loop);
  }

  init();
  loop();
  window.addEventListener('resize', resize, { passive: true });
})();


/* ════════════════════════════════════════
   CINEMATIC SCROLL-EXPAND HERO
════════════════════════════════════════ */
class ScrollExpandHero {
  constructor() {
    this.section    = document.getElementById('hero-section');
    this.card       = document.getElementById('heroCard');
    this.vid1       = document.getElementById('heroVid1');
    this.vid2       = document.getElementById('heroVid2');
    this.ambient    = document.getElementById('heroAmbient');
    this.titleL     = document.getElementById('heroTitleLeft');
    this.titleR     = document.getElementById('heroTitleRight');
    this.scrollHint = document.getElementById('heroScrollHint');
    this.revealed   = document.getElementById('heroRevealed');
    this.scrollDn   = document.getElementById('heroScrollDown');
    this.phase1     = document.getElementById('heroPhase1');
    this.phase2     = document.getElementById('heroPhase2');

    if (!this.card) return;

    this.p       = 0;       // current rendered progress [0,1]
    this.target  = 0;       // target progress being animated to
    this.expanded = false;
    this.raf     = null;
    this.txY     = 0;       // touch start Y

    this._wheel  = this._onWheel.bind(this);
    this._ts     = this._onTouchStart.bind(this);
    this._tm     = this._onTouchMove.bind(this);
    this._te     = this._onTouchEnd.bind(this);

    window.addEventListener('wheel', this._wheel, { passive: false });
    window.addEventListener('touchstart', this._ts, { passive: true });
    window.addEventListener('touchmove', this._tm, { passive: false });
    window.addEventListener('touchend', this._te, { passive: true });

    /* Lock page scroll during expansion */
    document.documentElement.style.overflow = 'hidden';
    document.body.style.overflow = 'hidden';

    this._render(0);
    if (this.vid1) this.vid1.play().catch(() => {});
  }

  /* ── Wheel ── */
  _onWheel(e) {
    if (this.expanded) {
      /* Collapse when scrolling up at very top of page */
      if (e.deltaY < 0 && window.scrollY <= 2) {
        e.preventDefault();
        this._animateTo(0, 650);
        this.expanded = false;
        document.documentElement.style.overflow = 'hidden';
        document.body.style.overflow = 'hidden';
      }
      return; /* else normal scroll */
    }
    e.preventDefault();
    const delta = e.deltaY > 0 ? 0.025 : -0.025;
    const step  = Math.min(Math.abs(e.deltaY) * 0.005, 0.08) * Math.sign(e.deltaY);
    this.target = Math.max(0, Math.min(1, this.target + step + delta * 0.2));
    this._runRaf();
  }

  /* ── Touch ── */
  _onTouchStart(e) { this.txY = e.touches[0].clientY; }
  _onTouchMove(e) {
    if (this.expanded) return;
    e.preventDefault();
    const dy = (this.txY - e.touches[0].clientY) * 0.007;
    this.target = Math.max(0, Math.min(1, this.target + dy));
    this.txY = e.touches[0].clientY;
    this._runRaf();
  }
  _onTouchEnd(e) {
    if (this.expanded) return;
    if (this.p > 0.55) this._animateTo(1, 450);
    else if (this.p < 0.2) this._animateTo(0, 350);
  }

  /* ── RAF loop ── */
  _runRaf() {
    if (this.raf) return;
    const step = () => {
      const diff = this.target - this.p;
      if (Math.abs(diff) < 0.0008) {
        this.p = this.target;
        this._render(this.p);
        if (this.p >= 1 && !this.expanded) this._complete();
        this.raf = null;
        return;
      }
      this.p += diff * 0.11;
      this._render(this.p);
      if (this.p >= 0.999 && !this.expanded) {
        this.p = 1;
        this._render(1);
        this._complete();
        this.raf = null;
        return;
      }
      this.raf = requestAnimationFrame(step);
    };
    this.raf = requestAnimationFrame(step);
  }

  _animateTo(target, ms) {
    const s0 = this.p, t0 = performance.now();
    const go = (now) => {
      const t  = Math.min((now - t0) / ms, 1);
      const e  = t < 0.5 ? 2*t*t : -1+(4-2*t)*t;
      this.p   = s0 + (target - s0) * e;
      this.target = this.p;
      this._render(this.p);
      if (t < 1) requestAnimationFrame(go);
      else {
        this.p = target;
        this._render(target);
      }
    };
    requestAnimationFrame(go);
  }

  _complete() {
    this.expanded = true;
    document.documentElement.style.overflow = '';
    document.body.style.overflow = '';
    if (this.scrollDn) {
      this.scrollDn.classList.add('visible');
      this.scrollDn.addEventListener('click', () => {
        document.getElementById('estadisticas')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, { once: true });
    }
  }

  /* ── Render at progress p [0,1] ── */
  _render(p) {
    const vw = window.innerWidth;
    const vh = window.innerHeight;

    /* Card size */
    const sw = Math.min(320, vw * 0.88);
    const sh = Math.min(440, vh * 0.66);
    const cw = sw + p * (vw - sw);
    const ch = sh + p * (vh - sh);

    if (this.card) {
      this.card.style.width        = cw + 'px';
      this.card.style.height       = ch + 'px';
      this.card.style.borderRadius = (24 * (1 - p)) + 'px';
    }

    /* Ambient fade */
    if (this.ambient) this.ambient.style.opacity = String(Math.max(0, 1 - p * 1.8));

    /* Title split */
    const shift = 34;
    if (this.titleL) {
      /* translateY(-50%) keeps vertical center from top:50% CSS */
      this.titleL.style.transform = `translateX(-${p * shift}vw) translateY(-50%)`;
      this.titleL.style.opacity   = String(Math.max(0, 1 - p * 2.2));
    }
    if (this.titleR) {
      this.titleR.style.transform = `translateX(${p * shift}vw) translateY(-50%)`;
      this.titleR.style.opacity   = String(Math.max(0, 1 - p * 2.2));
    }

    /* Scroll hint */
    if (this.scrollHint) this.scrollHint.style.opacity = String(Math.max(0, 1 - p * 7));

    /* Phase tags */
    if (this.phase1) this.phase1.style.opacity = String(p < 0.45 ? 1 : Math.max(0, 1 - (p - 0.45) * 9));
    if (this.phase2) this.phase2.style.opacity = String(p > 0.52 ? Math.min(1, (p - 0.52) * 7) : 0);

    /* Video 2: aerial fumigation fades in */
    if (this.vid2) {
      const v2 = p > 0.54 ? Math.min(1, (p - 0.54) / 0.32) : 0;
      this.vid2.style.opacity = String(v2);
      if (v2 > 0.05 && this.vid2.paused) this.vid2.play().catch(() => {});
    }

    /* Revealed content */
    if (this.revealed) {
      if (p > 0.76) {
        const rp = Math.min(1, (p - 0.76) / 0.24);
        this.revealed.style.opacity   = String(rp);
        this.revealed.style.transform = `translateY(${(1 - rp) * 28}px)`;
        if (rp > 0.5) this.revealed.classList.add('active');
      } else {
        this.revealed.style.opacity   = '0';
        this.revealed.style.transform = 'translateY(28px)';
        this.revealed.classList.remove('active');
      }
    }

    /* Scroll-down indicator */
    if (this.scrollDn && p < 0.97) this.scrollDn.classList.remove('visible');
  }
}


/* ════════════════════════════════════════
   NAVBAR
════════════════════════════════════════ */
(function initNavbar() {
  const navbar   = document.getElementById('navbar');
  const toggle   = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');
  const scrollTopBtn = document.getElementById('scrollTop');
  const allLinks = document.querySelectorAll('.nav-link');
  if (!navbar) return;

  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 80);
    if (scrollTopBtn) scrollTopBtn.classList.toggle('visible', window.scrollY > 500);
    _updateActive();
  }, { passive: true });

  if (toggle && navLinks) {
    toggle.addEventListener('click', () => {
      const open = navLinks.classList.toggle('open');
      toggle.classList.toggle('open', open);
      toggle.setAttribute('aria-expanded', String(open));
      document.querySelector('.nav-actions')?.classList.toggle('open', open);
    });
  }

  allLinks.forEach(link => {
    link.addEventListener('click', () => {
      navLinks?.classList.remove('open');
      toggle?.classList.remove('open');
      document.querySelector('.nav-actions')?.classList.remove('open');
    });
  });

  if (scrollTopBtn) {
    scrollTopBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  }

  function _updateActive() {
    let current = '';
    document.querySelectorAll('section[id]').forEach(s => {
      if (window.scrollY >= s.offsetTop - 150) current = s.id;
    });
    allLinks.forEach(l => l.classList.toggle('active', l.getAttribute('href') === '#' + current));
  }
})();


/* ════════════════════════════════════════
   SMOOTH ANCHOR SCROLL
════════════════════════════════════════ */
(function initAnchors() {
  document.addEventListener('click', e => {
    const a = e.target.closest('a[href^="#"]');
    if (!a) return;
    const href = a.getAttribute('href');
    if (href === '#') return;
    const target = document.querySelector(href);
    if (!target) return;
    e.preventDefault();
    const navH = document.getElementById('navbar')?.offsetHeight || 80;
    const top  = target.getBoundingClientRect().top + window.scrollY - navH;
    window.scrollTo({ top: Math.max(0, top), behavior: 'smooth' });
  });
})();


/* ════════════════════════════════════════
   SCROLL REVEAL
════════════════════════════════════════ */
(function initReveal() {
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el    = entry.target;
      const delay = parseFloat(getComputedStyle(el).getPropertyValue('--delay') || '0') * 1000;
      setTimeout(() => el.classList.add('in'), delay);
      obs.unobserve(el);
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -48px 0px' });

  document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right').forEach(el => obs.observe(el));
})();


/* ════════════════════════════════════════
   STATS COUNTERS
════════════════════════════════════════ */
(function initCounters() {
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const card   = entry.target;
      const numEl  = card.querySelector('.stat-num');
      const target = parseInt(card.dataset.count, 10);
      if (!numEl || isNaN(target)) return;
      obs.unobserve(card);
      const t0 = performance.now();
      const dur = 1900;
      const tick = (now) => {
        const t = Math.min((now - t0) / dur, 1);
        const e = 1 - Math.pow(1 - t, 3);
        numEl.textContent = Math.floor(e * target);
        if (t < 1) requestAnimationFrame(tick);
        else numEl.textContent = target;
      };
      requestAnimationFrame(tick);
    });
  }, { threshold: 0.45 });

  document.querySelectorAll('.stat-card[data-count]').forEach(c => obs.observe(c));
})();


/* ════════════════════════════════════════
   PRODUCT FILTER & SEARCH
════════════════════════════════════════ */
(function initProducts() {
  const filterBtns  = document.querySelectorAll('.filter-btn');
  const searchInput = document.getElementById('searchInput');
  const cards       = document.querySelectorAll('.product-card');
  const emptyMsg    = document.getElementById('catalogEmpty');
  let activeFilter  = 'all';

  function apply() {
    const q = searchInput ? searchInput.value.toLowerCase().trim() : '';
    let visible = 0;
    cards.forEach(card => {
      const cat  = card.dataset.category || '';
      const name = (card.dataset.name || '').toLowerCase();
      const desc = (card.querySelector('.pc-desc')?.textContent || '').toLowerCase();
      const show = (activeFilter === 'all' || cat === activeFilter) &&
                   (!q || name.includes(q) || desc.includes(q) || cat.includes(q));
      card.style.display = show ? '' : 'none';
      if (show) visible++;
    });
    if (emptyMsg) emptyMsg.style.display = visible === 0 ? 'flex' : 'none';
  }

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeFilter = btn.dataset.filter;
      apply();
    });
  });

  if (searchInput) searchInput.addEventListener('input', apply);

  /* Hover tilt */
  cards.forEach(card => {
    card.addEventListener('mousemove', e => {
      const r = card.getBoundingClientRect();
      const x = ((e.clientX - r.left) / r.width  - 0.5) * 10;
      const y = ((e.clientY - r.top)  / r.height - 0.5) * -10;
      card.style.transform = `translateY(-6px) rotateX(${y}deg) rotateY(${x}deg)`;
    });
    card.addEventListener('mouseleave', () => { card.style.transform = ''; });
  });
})();


/* ════════════════════════════════════════
   TESTIMONIALS CAROUSEL
════════════════════════════════════════ */
(function initTesti() {
  const cards = document.querySelectorAll('.testi-card');
  const dots  = document.querySelectorAll('.t-dot');
  const prev  = document.getElementById('testiPrev');
  const next  = document.getElementById('testiNext');
  const track = document.getElementById('testiTrack');
  if (cards.length === 0) return;

  let idx = 0, timer;

  function show(i) {
    idx = ((i % cards.length) + cards.length) % cards.length;
    cards.forEach((c, j) => c.classList.toggle('active', j === idx));
    dots.forEach( (d, j) => d.classList.toggle('active', j === idx));
  }

  function autoplay() {
    clearInterval(timer);
    timer = setInterval(() => show(idx + 1), 5500);
  }

  if (prev) prev.addEventListener('click', () => { show(idx - 1); autoplay(); });
  if (next) next.addEventListener('click', () => { show(idx + 1); autoplay(); });
  dots.forEach((d, i) => d.addEventListener('click', () => { show(i); autoplay(); }));

  if (track) {
    let sx = 0;
    track.addEventListener('touchstart', e => { sx = e.touches[0].clientX; }, { passive: true });
    track.addEventListener('touchend', e => {
      const diff = e.changedTouches[0].clientX - sx;
      if (Math.abs(diff) > 40) { show(diff < 0 ? idx + 1 : idx - 1); autoplay(); }
    }, { passive: true });
  }

  show(0);
  autoplay();
})();


/* ════════════════════════════════════════
   CONTACT FORM → EMAIL (Formspree)
════════════════════════════════════════
   INSTRUCCIONES PARA ACTIVAR EL CORREO:
   1. Ve a https://formspree.io y regístrate con cr.biozagri.sas@gmail.com
   2. Crea un nuevo formulario → te dará un ID como "xyzabcde"
   3. Reemplaza YOUR_FORMSPREE_ID aquí abajo por ese ID
════════════════════════════════════════ */
(function initForm() {
  const FORMSPREE_ID = 'YOUR_FORMSPREE_ID'; // ← pega aquí tu ID de Formspree

  const form    = document.getElementById('contactoForm');
  const btn     = document.getElementById('formSubmit');
  const success = document.getElementById('formSuccess');
  if (!form) return;

  form.addEventListener('submit', async e => {
    e.preventDefault();

    // Validación de campos requeridos
    const missing = [form.nombre, form.telefono, form.asunto, form.mensaje].filter(f => !f.value.trim());
    if (missing.length) {
      missing.forEach(f => {
        f.style.borderColor = '#ef5350';
        setTimeout(() => { f.style.borderColor = ''; }, 2500);
      });
      return;
    }

    if (btn) {
      btn.disabled = true;
      btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> <span>Enviando…</span>';
    }

    const data = {
      nombre:   form.nombre.value.trim(),
      telefono: form.telefono.value.trim(),
      correo:   form.correo.value.trim() || 'No indicado',
      asunto:   form.asunto.value,
      mensaje:  form.mensaje.value.trim()
    };

    try {
      const res = await fetch(`https://formspree.io/f/${FORMSPREE_ID}`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body:    JSON.stringify(data)
      });

      if (res.ok) {
        if (success) success.style.display = 'flex';
        if (btn) btn.innerHTML = '<i class="fas fa-check"></i> <span>¡Mensaje enviado!</span>';
        form.reset();
      } else {
        throw new Error('Error en envío');
      }
    } catch {
      // Fallback: abre WhatsApp si Formspree no está configurado aún
      const msg = encodeURIComponent(
        `*Nueva consulta desde BIOZAGRI.com*\n\n` +
        `*Nombre:* ${data.nombre}\n*Teléfono:* ${data.telefono}\n` +
        `*Correo:* ${data.correo}\n*Asunto:* ${data.asunto}\n\n*Mensaje:*\n${data.mensaje}`
      );
      window.open(`https://wa.me/573148953551?text=${msg}`, '_blank');
      if (btn) btn.innerHTML = '<i class="fas fa-check"></i> <span>Enviado</span>';
    }

    setTimeout(() => {
      if (btn) {
        btn.disabled = false;
        btn.innerHTML = '<i class="fas fa-paper-plane"></i> <span>Enviar Mensaje</span>';
      }
      if (success) success.style.display = 'none';
    }, 5000);
  });
})();


/* ════════════════════════════════════════
   WHATSAPP CHATBOT
════════════════════════════════════════ */
(function initChatbot() {
  const waBtn     = document.getElementById('waBtn');
  const panel     = document.getElementById('chatPanel');
  const closeBtn  = document.getElementById('chatClose');
  const msgs      = document.getElementById('chatMessages');
  const inp       = document.getElementById('chatInput');
  const sendBtn   = document.getElementById('chatSend');
  const qr        = document.getElementById('quickReplies');
  const badge     = document.getElementById('waBadge');
  const waIcon    = document.getElementById('waIcon');
  const closeIcon = document.getElementById('waCloseIcon');
  if (!waBtn || !panel) return;

  let isOpen = false, greeted = false;

  const DB = {
    greeting: {
      msg:  '¡Hola! Soy el asistente de <strong>BIOZAGRI</strong>. ¿En qué le puedo ayudar?',
      opts: ['Ver productos', 'Asesoría técnica', 'Nuestras sedes', 'Hablar con asesor', 'Certificaciones ICA'],
    },
    'ver productos': {
      msg:  'Contamos con 2 líneas certificadas ICA:<br><br><b>Bioestimulantes</b> – ComCat, AgraAlgen, BioRaíz MAX<br><b>Nutrición vegetal</b> – Cibusil, AgraCoMoP, AgraActivador12',
      opts: ['Bioestimulantes', 'Nutrición vegetal', 'Hablar con asesor'],
    },
    'bioestimulantes': {
      msg:  '<b>ComCat</b> activa resistencia sistémica SAR.<br><b>AgraAlgen</b> es extracto de <em>Ascophyllum nodosum</em>.<br><b>BioRaíz MAX</b> combina Rhizobium + Azospirillum.<br><br>Perfectos para banano, aguacate, flores y café.',
      opts: ['Hablar con asesor', 'Ver todos los productos'],
    },
    'nutrición vegetal': {
      msg:  '<b>Cibusil</b> aporta silicio soluble de alta biodisponibilidad.<br><b>AgraCoMoP</b> combina Cobalto + Molibdeno + Potasio.<br><b>AgraActivador12</b> potencia la absorción foliar y radical.',
      opts: ['Hablar con asesor', 'Ver todos los productos'],
    },
    'ver todos los productos': {
      msg:  'Vea el catálogo completo en la sección <strong>Portafolio</strong> de esta página, o hablemos directamente.',
      opts: ['Hablar con asesor', 'Nuestras sedes'],
    },
    'asesoría técnica': {
      msg:  'Brindamos <strong>asesoría personalizada</strong> en campo para banano, aguacate, café, flores, cítricos y hortalizas.<br><br>Nuestros técnicos diseñan el programa de nutrición y fitosanidad ideal para su cultivo.',
      opts: ['Hablar con asesor', 'Nuestras sedes'],
    },
    'nuestras sedes': {
      msg:  'Contamos con <strong>2 sedes en Antioquia</strong>:<br><br>📌 <b>Sabaneta</b> – Cra 46C #80 Sur 155, Área Metropolitana de Medellín<br>📌 <b>Apartadó</b> – Kr 100 #43-262 LC 23, Región de Urabá<br><br>📞 +57 314 895 3551<br>📞 +57 320 563 2733<br>📧 cr.biozagri.sas@gmail.com',
      opts: ['Hablar con asesor', 'Ver productos'],
    },
    'hablar con asesor': {
      msg:  'Le conectamos con un asesor BIOZAGRI ahora mismo por WhatsApp.',
      opts: ['Abrir WhatsApp'],
    },
    'abrir whatsapp': {
      msg:  '¡Hasta pronto! Un asesor le atenderá en breve. 🌿',
      opts: [],
      go:   'https://wa.me/573148953551?text=Hola%20BIOZAGRI%2C%20me%20comunic%C3%B3%20su%20asistente%20virtual',
    },
    'certificaciones ica': {
      msg:  'Todos nuestros productos tienen <strong>Registro ICA</strong> vigente — garantía de calidad, eficacia y legalidad en Colombia.<br><br>Puede solicitar los certificados de cualquier producto a nuestro equipo.',
      opts: ['Ver productos', 'Hablar con asesor'],
    },
  };

  function addMsg(text, type) {
    const d = document.createElement('div');
    d.className = `chat-msg ${type}`;
    d.innerHTML = text;
    msgs.appendChild(d);
    msgs.scrollTop = msgs.scrollHeight;
  }

  function showTyping() {
    const d = document.createElement('div');
    d.className = 'chat-typing';
    d.id = 'chatTyping';
    d.innerHTML = '<span></span><span></span><span></span>';
    msgs.appendChild(d);
    msgs.scrollTop = msgs.scrollHeight;
  }

  function removeTyping() { document.getElementById('chatTyping')?.remove(); }

  function showOpts(opts) {
    if (!qr) return;
    qr.innerHTML = '';
    opts.forEach(opt => {
      const b = document.createElement('button');
      b.className = 'qr-btn' + (opt === 'Abrir WhatsApp' ? ' qr-wa' : '');
      b.textContent = opt;
      b.addEventListener('click', () => respond(opt));
      qr.appendChild(b);
    });
  }

  function respond(text) {
    addMsg(text, 'user');
    if (qr) qr.innerHTML = '';
    showTyping();
    const key  = text.toLowerCase().trim();
    const match = Object.keys(DB).find(k => key.includes(k));
    const res  = match ? DB[match] : {
      msg:  'Para una respuesta más precisa, le recomiendo hablar directamente con nuestro equipo.',
      opts: ['Hablar con asesor', 'Nuestras sedes'],
    };
    setTimeout(() => {
      removeTyping();
      addMsg(res.msg, 'bot');
      showOpts(res.opts || []);
      if (res.go) setTimeout(() => window.open(res.go, '_blank'), 500);
    }, 700 + Math.random() * 450);
  }

  function openChat() {
    isOpen = true;
    panel.classList.remove('chat-hidden');
    if (waIcon)    waIcon.style.display    = 'none';
    if (closeIcon) closeIcon.style.display = 'block';
    if (badge)     badge.style.display     = 'none';
    if (!greeted) {
      greeted = true;
      showTyping();
      setTimeout(() => {
        removeTyping();
        addMsg(DB.greeting.msg, 'bot');
        showOpts(DB.greeting.opts);
      }, 700);
    }
  }

  function closeChat() {
    isOpen = false;
    panel.classList.add('chat-hidden');
    if (waIcon)    waIcon.style.display    = 'block';
    if (closeIcon) closeIcon.style.display = 'none';
  }

  waBtn.addEventListener('click', () => isOpen ? closeChat() : openChat());
  if (closeBtn) closeBtn.addEventListener('click', closeChat);

  if (sendBtn) sendBtn.addEventListener('click', () => {
    const v = inp?.value.trim();
    if (v) { respond(v); if (inp) inp.value = ''; }
  });

  if (inp) inp.addEventListener('keydown', e => {
    if (e.key === 'Enter') {
      const v = inp.value.trim();
      if (v) { respond(v); inp.value = ''; }
    }
  });

  /* Show badge after 9s if user hasn't opened chat */
  setTimeout(() => {
    if (!greeted && badge) { badge.style.display = 'flex'; badge.textContent = '1'; }
  }, 9000);
})();


/* ════════════════════════════════════════
   ANIMATED GRADIENT BACKGROUND (Jaguar Section)
   Vanilla JS port of AnimatedGradientBackground
════════════════════════════════════════ */
(function initGradientCanvas() {
  const canvas = document.getElementById('gradientCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  /* Brand palette stops */
  const STOPS = [
    { pct: 0,   color: '#050505' },
    { pct: 28,  color: '#050a12' },
    { pct: 45,  color: '#081524' },
    { pct: 58,  color: '#0A2A4A' },
    { pct: 70,  color: '#1F5E9C' },
    { pct: 82,  color: '#1E4D3A' },
    { pct: 92,  color: '#6FAF4F' },
    { pct: 100, color: '#050505' },
  ];

  let W, H;
  let width = 125;      /* gradient radius % — will breathe */
  let dir   = 1;
  const SPEED  = 0.018;
  const RANGE  = 6;
  const BASE   = 125;

  function resize() {
    W = canvas.width  = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  }

  function draw() {
    if (!W || !H) { resize(); }

    /* Breathing */
    width += dir * SPEED;
    if (width >= BASE + RANGE) dir = -1;
    if (width <= BASE - RANGE) dir = 1;

    /* Radial gradient centered 50% 20% (from top-center) */
    const cx = W * 0.5;
    const cy = H * 0.2;
    const rx = W * (width / 100);
    const ry = H * ((width + 8) / 100);
    const r  = Math.max(rx, ry);

    const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
    STOPS.forEach(s => {
      grad.addColorStop(s.pct / 100, s.color);
    });

    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, W, H);

    requestAnimationFrame(draw);
  }

  resize();
  window.addEventListener('resize', resize, { passive: true });

  /* Fade in on entry into viewport */
  const obs = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting) { draw(); obs.disconnect(); }
  }, { threshold: 0.1 });
  const section = document.getElementById('jaguar-showcase');
  if (section) obs.observe(section); else draw();
})();


/* ════════════════════════════════════════
   GOOEY TEXT MORPHING  (Jaguar Showcase)
   Faithful vanilla-JS port of the React
   GooeyText component — uses the identical
   time-based loop and 8/fraction−8 blur
   formula to match the original exactly.
════════════════════════════════════════ */
(function initGooeyText() {
  const span1  = document.getElementById('gooeyA');   /* text1Ref (outgoing) */
  const span2  = document.getElementById('gooeyB');   /* text2Ref (incoming) */
  const tagEl  = document.getElementById('gooeyTagline');
  const dotsEl = document.getElementById('gooeyDots');
  if (!span1 || !span2) return;

  /* ── Company name sequence ─────────────────────────── */
  const ITEMS = [
    { word: 'BIOZAGRI',      sub: 'Control Research SAS'       },
    { word: 'CONTROL',       sub: 'Insumos Agrícolas Certif.'  },
    { word: 'RESEARCH',      sub: 'Tecnología de Vanguardia'   },
    { word: 'SAS',           sub: 'Sabaneta · Antioquia'       },
    { word: 'Colombia',      sub: 'Reg. ICA · Bioinsumos'      },
  ];
  const texts = ITEMS.map(i => i.word);

  /* ── Config — mirrors React component props ─────────── */
  const MORPH_TIME    = 1.0;   /* seconds  — transition speed   */
  const COOLDOWN_TIME = 2.2;   /* seconds  — hold per word       */

  /* ── State (identical to React useEffect vars) ──────── */
  let textIndex = texts.length - 1;
  let time      = new Date();
  let morph     = 0;
  let cooldown  = COOLDOWN_TIME;

  /* Init: span2 is the first visible word, span1 is hidden */
  span1.textContent = texts[textIndex % texts.length];
  span2.textContent = texts[(textIndex + 1) % texts.length];
  _dots(0);
  if (tagEl) tagEl.textContent = ITEMS[0].sub;

  /* ─── Exact blur / opacity formula from React component ─── */
  function _setMorph(fraction) {
    /* incoming (span2): sharpens + fades in */
    span2.style.filter  = `blur(${Math.min(8 / fraction - 8, 100).toFixed(2)}px)`;
    span2.style.opacity = `${(Math.pow(fraction, 0.4) * 100).toFixed(1)}%`;
    /* outgoing (span1): blurs + fades out */
    const inv = 1 - fraction;
    span1.style.filter  = `blur(${Math.min(8 / inv - 8, 100).toFixed(2)}px)`;
    span1.style.opacity = `${(Math.pow(inv, 0.4) * 100).toFixed(1)}%`;
  }

  /* Called every frame while cooldown > 0: hold current word */
  function _doCooldown() {
    morph = 0;
    span2.style.filter = '';  span2.style.opacity = '100%';
    span1.style.filter = '';  span1.style.opacity = '0%';
  }

  /* Called every frame while cooldown ≤ 0: advance morph */
  function _doMorph() {
    morph    -= cooldown;   /* cooldown ≤ 0, so morph grows */
    cooldown  = 0;
    let fraction = morph / MORPH_TIME;

    if (fraction > 1) {
      /* Morph complete — begin next hold period */
      cooldown = COOLDOWN_TIME;
      fraction = 1;
      const vi = (textIndex + 1) % ITEMS.length;
      _dots(vi);
      if (tagEl) tagEl.textContent = ITEMS[vi].sub;
    }
    _setMorph(fraction);
  }

  function _dots(active) {
    if (!dotsEl) return;
    dotsEl.querySelectorAll('.gd').forEach((d, i) =>
      d.classList.toggle('active', i === active)
    );
  }

  /* ─── Animation loop — identical to React's animate() ─── */
  function _animate() {
    requestAnimationFrame(_animate);
    const now             = new Date();
    const shouldIncrement = cooldown > 0;          /* captured before dt */
    const dt              = (now.getTime() - time.getTime()) / 1000;
    time = now;

    cooldown -= dt;

    if (cooldown <= 0) {
      if (shouldIncrement) {
        /* Cooldown just expired — swap text content */
        textIndex       = (textIndex + 1) % texts.length;
        span1.textContent = texts[textIndex % texts.length];
        span2.textContent = texts[(textIndex + 1) % texts.length];
      }
      _doMorph();
    } else {
      _doCooldown();
    }
  }

  _animate();
})();


/* ════════════════════════════════════════
   INIT SCROLL-EXPAND HERO (after DOM ready)
════════════════════════════════════════ */
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => { window._hero = new ScrollExpandHero(); });
} else {
  window._hero = new ScrollExpandHero();
}
