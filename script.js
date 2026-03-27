/* ================================================================
   TEJAS PANDURE — PREMIUM PORTFOLIO · script.js v4
   Apple-quality: Aurora Canvas · Magnetic Buttons · Smooth Reveals
   ================================================================ */
'use strict';

/* ── PREMIUM GLOWING ORBS (BOKEH) BACKGROUND ───────────────────
   Distinct, soft-glowing colorful balls drifting elegantly.
   Apple-like depth of field with varied sizes and opacities.
   ─────────────────────────────────────────────────────────── */
(function initPremiumOrbs() {
  const canvas = document.getElementById('particleCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W, H;
  const ORB_COUNT = 35; /* Fewer, high-quality orbs */
  const orbs = [];

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize, { passive: true });

  /* Premium palette: Cyan, Violet, Emerald, Magenta */
  const colors = [
    [56, 189, 248],   /* Cyan */
    [167, 139, 250],  /* Violet */
    [52, 211, 153],   /* Emerald */
    [236, 72, 153],   /* Magenta */
  ];

  /* Easing and random helpers */
  const rand = (min, max) => Math.random() * (max - min) + min;

  class GlowingOrb {
    constructor() {
      this.reset(true);
    }
    reset(initial = false) {
      /* Base size between 10px and 220px to simulate extreme depth of field */
      this.r = rand(10, 220);
      /* Position */
      this.x = rand(0, W);
      this.y = initial ? rand(0, H) : H + this.r + 10;
      /* Speed depends inversely on size (parallax: bigger = closer = faster) */
      const speedFactor = this.r / 100;
      this.vy = rand(-0.2, -0.6) * speedFactor;
      this.vx = rand(-0.15, 0.15);
      /* Wobble (sine wave drift) */
      this.wobbleSpeed = rand(0.005, 0.02);
      this.wobblePhase = rand(0, Math.PI * 2);
      this.wobbleAmp = rand(10, 40) * speedFactor;
      this.baseX = this.x;
      
      /* Color and opacity */
      this.rgb = colors[Math.floor(Math.random() * colors.length)];
      /* Bigger = more out of focus = lower opacity */
      this.baseAlpha = rand(0.05, 0.25) * (150 / (this.r + 50)); 
    }
    update() {
      this.y += this.vy;
      this.baseX += this.vx;
      this.x = this.baseX + Math.sin(Date.now() * this.wobbleSpeed + this.wobblePhase) * this.wobbleAmp;

      if (this.y < -this.r || this.x < -this.r || this.x > W + this.r) {
        this.reset();
      }
    }
    draw() {
      ctx.beginPath();
      // Creating a soft glowing radial gradient for each orb
      const grad = ctx.createRadialGradient(this.x, this.y, this.r * 0.1, this.x, this.y, this.r);
      const [r, g, b] = this.rgb;
      grad.addColorStop(0, `rgba(${r}, ${g}, ${b}, ${this.baseAlpha})`);
      grad.addColorStop(0.5, `rgba(${r}, ${g}, ${b}, ${this.baseAlpha * 0.5})`);
      grad.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`);
      
      ctx.fillStyle = grad;
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  for (let i = 0; i < ORB_COUNT; i++) {
    orbs.push(new GlowingOrb());
  }

  function loop() {
    ctx.clearRect(0, 0, W, H);
    // Additive blending makes overlapping orbs look like light
    ctx.globalCompositeOperation = 'screen';
    
    orbs.forEach(orb => {
      orb.update();
      orb.draw();
    });
    
    requestAnimationFrame(loop);
  }
  loop();
})();

/* ── CUSTOM CURSOR ───────────────────────────────────────────── */
(function initCursor() {
  const dot  = document.getElementById('cursorDot');
  const ring = document.getElementById('cursorRing');
  if (!dot || !ring) return;

  let mx = -300, my = -300, rx = -300, ry = -300;

  document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    dot.style.left = mx + 'px';
    dot.style.top  = my + 'px';
  });

  (function animRing() {
    rx += (mx - rx) * .1;
    ry += (my - ry) * .1;
    ring.style.left = rx + 'px';
    ring.style.top  = ry + 'px';
    requestAnimationFrame(animRing);
  })();

  const hoverSel = 'a,button,[role="button"],input,textarea,.proj-card,.cert-card,.edu-card,.tag-cloud span,.pillar-card';
  document.addEventListener('mouseover', e => {
    if (e.target.closest(hoverSel)) { dot.classList.add('hov'); ring.classList.add('hov'); }
  });
  document.addEventListener('mouseout', e => {
    if (e.target.closest(hoverSel)) { dot.classList.remove('hov'); ring.classList.remove('hov'); }
  });
  document.addEventListener('mouseleave', () => { dot.style.opacity = ring.style.opacity = '0'; });
  document.addEventListener('mouseenter', () => { dot.style.opacity = ring.style.opacity = '1'; });
})();

/* ── MAGNETIC BUTTONS (Apple signature interaction) ──────────
   Buttons gently "pull" toward the cursor inside their bounds.
   ─────────────────────────────────────────────────────────── */
(function initMagneticButtons() {
  const magnetEls = document.querySelectorAll('.btn-primary, .btn-ghost, .btn-resume, .proj-link');
  magnetEls.forEach(el => {
    el.addEventListener('mousemove', e => {
      const r    = el.getBoundingClientRect();
      const cx   = r.left + r.width  / 2;
      const cy   = r.top  + r.height / 2;
      const dx   = (e.clientX - cx) * 0.28;   /* pull strength */
      const dy   = (e.clientY - cy) * 0.28;
      el.style.transform = `translate(${dx}px,${dy}px) translateY(-2px)`;
    });
    el.addEventListener('mouseleave', () => {
      el.style.transform = '';
    });
  });
})();

/* ── NAVBAR SCROLL STATE ─────────────────────────────────────── */
(function initNav() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;
  const tick = () => navbar.classList.toggle('scrolled', window.scrollY > 40);
  window.addEventListener('scroll', tick, { passive: true });
  tick();
})();

/* ── ACTIVE NAV LINK ─────────────────────────────────────────── */
(function initActiveLink() {
  const sections = document.querySelectorAll('section[id]');
  const links    = document.querySelectorAll('.nav-link');
  if (!sections.length) return;
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting)
        links.forEach(l => l.classList.toggle('active', l.getAttribute('href') === '#' + e.target.id));
    });
  }, { rootMargin: '-38% 0px -56% 0px' });
  sections.forEach(s => obs.observe(s));
})();

/* ── MOBILE MENU ─────────────────────────────────────────────── */
(function initMobile() {
  const btn   = document.getElementById('burgerBtn');
  const nav   = document.getElementById('mobileNav');
  const close = document.getElementById('mobileClose');
  if (!btn || !nav) return;
  const open = () => { nav.classList.add('open');  btn.setAttribute('aria-expanded','true');  document.body.style.overflow = 'hidden'; };
  const shut = () => { nav.classList.remove('open'); btn.setAttribute('aria-expanded','false'); document.body.style.overflow = ''; };
  btn.addEventListener('click', open);
  if (close) close.addEventListener('click', shut);
  nav.querySelectorAll('.mobile-link').forEach(l => l.addEventListener('click', shut));
  document.addEventListener('keydown', e => { if (e.key === 'Escape') shut(); });
})();

/* ── TYPING ANIMATION ────────────────────────────────────────── */
(function initTyping() {
  const el     = document.getElementById('typedText');
  const cursor = document.querySelector('.tagline-cursor');
  if (!el) return;
  const phrases = [
    'RAG Systems.',
    'LLM Pipelines.',
    'AI Agents.',
    'Tool-Calling Bots.',
    'Flask APIs.',
    'Production AI.',
  ];
  let pi = 0, ci = 0, del = false;
  const TYPE_SPD = 62, DEL_SPD = 30, PAUSE = 2300;
  const setBlink = on => cursor && cursor.classList.toggle('blink', on);
  function tick() {
    const word = phrases[pi];
    if (!del) {
      el.textContent = word.slice(0, ++ci);
      setBlink(false);
      if (ci === word.length) { del = true; setBlink(true); setTimeout(tick, PAUSE); return; }
      setTimeout(tick, TYPE_SPD);
    } else {
      el.textContent = word.slice(0, --ci);
      setBlink(false);
      if (ci === 0) { del = false; pi = (pi + 1) % phrases.length; setTimeout(tick, 350); return; }
      setTimeout(tick, DEL_SPD);
    }
  }
  setTimeout(tick, 950);
})();

/* ── SCROLL REVEAL (staggered, Apple-style) ──────────────────── */
(function initReveal() {
  /* Hero elements: delay driven by data-delay attr */
  document.querySelectorAll('.reveal[data-delay]').forEach(el => {
    el.style.transitionDelay = el.dataset.delay + 'ms';
  });
  setTimeout(() => document.querySelectorAll('.reveal').forEach(el => el.classList.add('in')), 80);

  /* Section elements: staggered cascade */
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('in');
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.08 });

  document.querySelectorAll('.fade-up').forEach((el, i) => {
    el.style.transitionDelay = (i % 5) * 75 + 'ms';
    obs.observe(el);
  });
})();

/* ── SKILL BARS ──────────────────────────────────────────────── */
(function initBars() {
  const bars = document.querySelectorAll('.bar-fill');
  if (!bars.length) return;
  bars.forEach(b => b.style.setProperty('--w', b.dataset.w + '%'));
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('animated'); obs.unobserve(e.target); } });
  }, { threshold: 0.25 });
  bars.forEach(b => obs.observe(b));
})();

/* ── COUNT-UP ────────────────────────────────────────────────── */
(function initCount() {
  const els = document.querySelectorAll('.count-up');
  if (!els.length) return;
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      obs.unobserve(e.target);
      const el = e.target, target = +el.dataset.target, dur = 1800;
      const start = performance.now();
      (function frame(now) {
        const p = Math.min((now - start) / dur, 1);
        el.textContent = Math.round((1 - Math.pow(1 - p, 3)) * target);
        if (p < 1) requestAnimationFrame(frame);
      })(start);
    });
  }, { threshold: .5 });
  els.forEach(el => obs.observe(el));
})();

/* ── 3D CARD TILT ────────────────────────────────────────────── */
(function initTilt() {
  document.querySelectorAll('.proj-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const r = card.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width  - .5;
      const y = (e.clientY - r.top)  / r.height - .5;
      card.style.transform = `perspective(800px) rotateY(${x * 7}deg) rotateX(${-y * 5}deg) translateY(-5px)`;
    });
    card.addEventListener('mouseleave', () => { card.style.transform = ''; });
  });
})();

/* ── SMOOTH SCROLL ───────────────────────────────────────────── */
(function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const target = document.querySelector(a.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const offset = document.getElementById('siteHeader')?.offsetHeight || 0;
      window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - offset, behavior: 'smooth' });
    });
  });
})();

/* ── HERO PARALLAX ───────────────────────────────────────────── */
(function initParallax() {
  const heroContent = document.querySelector('.hero-content');
  const heroAvatar  = document.querySelector('.hero-avatar-wrap');
  if (!heroContent || !heroAvatar) return;
  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    heroContent.style.transform = `translateY(${y * 0.12}px)`;
    heroAvatar.style.transform  = `translateY(${y * 0.06}px)`;
  }, { passive: true });
})();

/* ── REDUCED MOTION GUARD ────────────────────────────────────── */
if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  document.querySelectorAll('.fade-up,.reveal').forEach(el => {
    el.classList.add('in'); el.style.transitionDelay = '0ms';
  });
  document.querySelectorAll('.bar-fill').forEach(el => el.classList.add('animated'));
}