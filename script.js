/* ================================================================
   TEJAS PANDURE — PREMIUM PORTFOLIO · script.js v4
   Apple-quality: Aurora Canvas · Magnetic Buttons · Smooth Reveals
   ================================================================ */
'use strict';

/* ── PREMIUM STARRY SKY WITH SHOOTING STAR ───────────────
   Distinct, gently twinkling stars with an occasional
   smooth shooting star streaking across the background.
   ─────────────────────────────────────────────────────────── */
(function initStarrySky() {
  const canvas = document.getElementById('particleCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W, H;
  
  const STAR_COUNT = 150;
  const stars = [];
  
  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize, { passive: true });

  const rand = (min, max) => Math.random() * (max - min) + min;

  /* --- Twinkling Stars --- */
  class Star {
    constructor() {
      this.reset(true);
    }
    reset(initial = false) {
      this.x = rand(0, W);
      this.y = rand(0, H);
      this.r = rand(0.4, 1.8); /* Tiny, elegant stars */
      this.baseAlpha = rand(0.1, 0.8);
      /* Slow drift so the sky feels slightly alive */
      this.vx = rand(-0.03, 0.03); 
      this.vy = rand(-0.03, 0.03);
      /* Twinkle sine wave */
      this.twinklePhase = rand(0, Math.PI * 2);
      this.twinkleSpeed = rand(0.005, 0.02);
    }
    update() {
      this.x += this.vx;
      this.y += this.vy;
      if (this.x < 0) this.x = W;
      if (this.x > W) this.x = 0;
      if (this.y < 0) this.y = H;
      if (this.y > H) this.y = 0;
    }
    draw() {
      ctx.beginPath();
      // Apply sine wave twinkle to base alpha
      const a = this.baseAlpha * (0.5 + 0.5 * Math.sin(Date.now() * this.twinkleSpeed + this.twinklePhase));
      ctx.fillStyle = `rgba(180, 220, 255, ${a})`;
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  for (let i = 0; i < STAR_COUNT; i++) {
    stars.push(new Star());
  }

  /* --- Shooting Star --- */
  class ShootingStar {
    constructor() {
      this.reset();
    }
    reset() {
      this.active = false;
      this.x = 0;
      this.y = 0;
      this.len = 0;
      this.vx = 0;
      this.vy = 0;
      this.alpha = 0;
      this.wait = rand(100, 300); /* Wait X frames before shooting */
    }
    spawn() {
      this.active = true;
      /* Spawn from top or right off-screen */
      if (Math.random() > 0.5) {
        this.x = rand(0, W);
        this.y = -50;
      } else {
        this.x = W + 50;
        this.y = rand(0, H * 0.5);
      }
      /* Diagonal streak downwards right-to-left or left-to-right */
      const angle = rand(Math.PI / 4, (3 * Math.PI) / 4);
      const speed = rand(12, 24);
      this.vx = -Math.cos(angle) * speed; 
      this.vy = Math.sin(angle) * speed;
      this.len = rand(80, 200);
      this.alpha = 1;
    }
    update() {
      if (!this.active) {
        this.wait--;
        if (this.wait <= 0) this.spawn();
        return;
      }
      this.x += this.vx;
      this.y += this.vy;
      
      if (this.x < -this.len || this.x > W + this.len || this.y > H + this.len) {
        this.reset();
      }
    }
    draw() {
      if (!this.active) return;
      ctx.beginPath();
      const grad = ctx.createLinearGradient(this.x, this.y, this.x - this.vx * (this.len / 10), this.y - this.vy * (this.len / 10));
      grad.addColorStop(0, `rgba(255, 255, 255, 0.9)`);
      grad.addColorStop(1, `rgba(100, 180, 255, 0)`);
      
      ctx.strokeStyle = grad;
      ctx.lineWidth = 1.5;
      ctx.lineCap = 'round';
      ctx.moveTo(this.x, this.y);
      ctx.lineTo(this.x - this.vx * (this.len / 10), this.y - this.vy * (this.len / 10));
      ctx.stroke();
    }
  }
  
  const shooter = new ShootingStar();

  function loop() {
    ctx.clearRect(0, 0, W, H);
    // Draw stars
    stars.forEach(star => {
      star.update();
      star.draw();
    });
    // Draw shooting star
    shooter.update();
    shooter.draw();
    
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