/* ============================================================
   TEJAS PANDURE — WORLD-CLASS PORTFOLIO  ·  script.js
   ============================================================ */

'use strict';

/* ── CUSTOM CURSOR ─────────────────────────────────────────── */
(function initCursor() {
  const dot  = document.getElementById('cursorDot');
  const glow = document.getElementById('cursorGlow');
  if (!dot || !glow) return;

  let mouseX = -200, mouseY = -200;
  let glowX  = -200, glowY  = -200;
  let raf;

  document.addEventListener('mousemove', e => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    dot.style.left = mouseX + 'px';
    dot.style.top  = mouseY + 'px';
  });

  function animateGlow() {
    glowX += (mouseX - glowX) * 0.12;
    glowY += (mouseY - glowY) * 0.12;
    glow.style.left = glowX + 'px';
    glow.style.top  = glowY + 'px';
    raf = requestAnimationFrame(animateGlow);
  }
  animateGlow();

  // Hover state on interactive elements
  const interactives = 'a, button, [role="button"], input, textarea, select, label, .tag-cloud span, .pillar-card, .proj-card, .cert-card, .edu-card';
  document.addEventListener('mouseover', e => {
    if (e.target.closest(interactives)) {
      dot.classList.add('is-hovering');
      glow.classList.add('is-hovering');
    }
  });
  document.addEventListener('mouseout', e => {
    if (e.target.closest(interactives)) {
      dot.classList.remove('is-hovering');
      glow.classList.remove('is-hovering');
    }
  });

  // Hide cursor when leaving window
  document.addEventListener('mouseleave', () => {
    dot.style.opacity  = '0';
    glow.style.opacity = '0';
  });
  document.addEventListener('mouseenter', () => {
    dot.style.opacity  = '1';
    glow.style.opacity = '1';
  });
})();

/* ── HERO SPOTLIGHT ────────────────────────────────────────── */
(function initSpotlight() {
  const hero      = document.getElementById('hero');
  const spotlight = document.getElementById('heroSpotlight');
  if (!hero || !spotlight) return;

  hero.addEventListener('mousemove', e => {
    const rect = hero.getBoundingClientRect();
    spotlight.style.left = (e.clientX - rect.left) + 'px';
    spotlight.style.top  = (e.clientY - rect.top)  + 'px';
  });
})();

/* ── NAVBAR SCROLL STATE ───────────────────────────────────── */
(function initNavScroll() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;

  const onScroll = () => {
    navbar.classList.toggle('scrolled', window.scrollY > 40);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();

/* ── ACTIVE NAV LINK (IntersectionObserver) ────────────────── */
(function initActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');
  if (!sections.length || !navLinks.length) return;

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        navLinks.forEach(link => {
          link.classList.toggle('active', link.getAttribute('href') === '#' + id);
        });
      }
    });
  }, { rootMargin: '-40% 0px -55% 0px' });

  sections.forEach(s => observer.observe(s));
})();

/* ── MOBILE MENU ───────────────────────────────────────────── */
(function initMobileMenu() {
  const burgerBtn  = document.getElementById('burgerBtn');
  const mobileNav  = document.getElementById('mobileNav');
  const mobileClose = document.getElementById('mobileClose');
  const mobileLinks = document.querySelectorAll('.mobile-link');
  if (!burgerBtn || !mobileNav) return;

  function openMenu() {
    mobileNav.classList.add('open');
    burgerBtn.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }
  function closeMenu() {
    mobileNav.classList.remove('open');
    burgerBtn.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  burgerBtn.addEventListener('click', openMenu);
  if (mobileClose) mobileClose.addEventListener('click', closeMenu);
  mobileLinks.forEach(link => link.addEventListener('click', closeMenu));

  // Close on Escape key
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && mobileNav.classList.contains('open')) closeMenu();
  });
})();

/* ── TYPING ANIMATION ──────────────────────────────────────── */
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

  let phraseIdx  = 0;
  let charIdx    = 0;
  let isDeleting = false;
  let pauseTimer = null;

  const TYPING_SPEED   = 65;
  const DELETING_SPEED = 35;
  const PAUSE_AFTER    = 2000;

  function setCursorBlinking(on) {
    if (!cursor) return;
    cursor.classList.toggle('blinking', on);
  }

  function tick() {
    const current = phrases[phraseIdx];

    if (!isDeleting) {
      charIdx++;
      el.textContent = current.slice(0, charIdx);
      setCursorBlinking(false); // solid while typing

      if (charIdx === current.length) {
        isDeleting = true;
        setCursorBlinking(true); // blink during pause
        pauseTimer = setTimeout(tick, PAUSE_AFTER);
        return;
      }
      pauseTimer = setTimeout(tick, TYPING_SPEED);
    } else {
      charIdx--;
      el.textContent = current.slice(0, charIdx);
      setCursorBlinking(false); // solid while deleting

      if (charIdx === 0) {
        isDeleting = false;
        phraseIdx  = (phraseIdx + 1) % phrases.length;
        pauseTimer = setTimeout(tick, 350);
        return;
      }
      pauseTimer = setTimeout(tick, DELETING_SPEED);
    }
  }

  pauseTimer = setTimeout(tick, 800);
})();

/* ── FADE-IN ON SCROLL (IntersectionObserver) ──────────────── */
(function initFadeIn() {
  const fadeEls = document.querySelectorAll('.fade-in');
  if (!fadeEls.length) return;

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  fadeEls.forEach(el => observer.observe(el));
})();

/* ── SKILL BARS ANIMATE ON SCROLL ──────────────────────────── */
(function initSkillBars() {
  const bars = document.querySelectorAll('.sbi-fill');
  if (!bars.length) return;

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  bars.forEach(bar => observer.observe(bar));
})();

/* ── COUNT-UP ANIMATION ────────────────────────────────────── */
(function initCountUp() {
  const counters = document.querySelectorAll('.count-num');
  if (!counters.length) return;

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      observer.unobserve(entry.target);

      const el     = entry.target;
      const target = parseInt(el.getAttribute('data-target'), 10) || 0;
      const dur    = 1400; // ms
      const start  = performance.now();

      function update(now) {
        const elapsed  = now - start;
        const progress = Math.min(elapsed / dur, 1);
        // Ease-out cubic
        const eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.round(eased * target);
        if (progress < 1) requestAnimationFrame(update);
      }
      requestAnimationFrame(update);
    });
  }, { threshold: 0.5 });

  counters.forEach(c => observer.observe(c));
})();

/* ── PROJECT CARD SHINE EFFECT ─────────────────────────────── */
(function initProjShine() {
  const cards = document.querySelectorAll('.proj-card');
  cards.forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width  * 100).toFixed(1);
      const y = ((e.clientY - rect.top)  / rect.height * 100).toFixed(1);
      card.style.setProperty('--mx', x + '%');
      card.style.setProperty('--my', y + '%');
    });
  });
})();

/* ── SMOOTH SCROLL FOR ANCHOR LINKS ───────────────────────── */
(function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const offset = document.getElementById('siteHeader')?.offsetHeight || 0;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
})();

/* ── REDUCE MOTION GUARD ───────────────────────────────────── */
if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  // Reveal all fade-in elements immediately
  document.querySelectorAll('.fade-in').forEach(el => {
    el.classList.add('visible');
  });
  // Activate all skill bars immediately
  document.querySelectorAll('.sbi-fill').forEach(el => {
    el.classList.add('active');
  });
}