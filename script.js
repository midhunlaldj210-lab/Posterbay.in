/* script.js — PosterBay.in | All 8 Enhancements */

document.addEventListener('DOMContentLoaded', () => {
  // Existing
  initScrollReveal();
  initForms();
  initAnnouncement();
  init3DHeroCard();
  initTiltCards();
  initCardShine();
  initCounterAnimation();

  // New enhancements
  initCursorGlow();       // 7
  initParticles();        // 2
  initTypewriter();       // 1
  initFomoCounter();      // 6
});

/* ══════════════════════════════════════════
   EXISTING: SCROLL REVEAL (Enhanced stagger)
══════════════════════════════════════════ */
function initScrollReveal() {
  const els = document.querySelectorAll('.reveal');
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('in-view');
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });
  els.forEach(el => io.observe(el));
}

/* ══════════════════════════════════════════
   EXISTING: FORMS
══════════════════════════════════════════ */
function initForms() {
  setupForm('footer-form', 'footer-email', 'footer-btn', 'footer-msg');
  initContactForm();
}

function setupForm(fId, eId, bId, mId) {
  const form = document.getElementById(fId);
  if (!form) return;
  const emailEl = document.getElementById(eId);
  const btnEl   = document.getElementById(bId);
  const msgEl   = document.getElementById(mId);

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const val = emailEl ? emailEl.value.trim() : '';
    if (!isEmail(val)) {
      showMsg(msgEl, '✕  Please enter a valid email.', 'error');
      return;
    }
    const lbl = btnEl.querySelector('.btn-label');
    const origText = lbl ? lbl.textContent : btnEl.textContent;
    if (lbl) lbl.textContent = 'Securing...';
    btnEl.disabled = true;

    setTimeout(() => {
      if (lbl) lbl.textContent = '✓ You\'re on the list!';
      btnEl.style.background = 'linear-gradient(135deg,#16a34a,#15803d)';
      emailEl.value = '';
      showMsg(msgEl, '✓  Welcome to the waitlist. See you on launch day.', 'success');

      // Bump FOMO counter on sign-up
      bumpFomoCounter();

      setTimeout(() => {
        if (lbl) lbl.textContent = origText;
        btnEl.disabled = false;
        btnEl.style.background = '';
        if (msgEl) { msgEl.textContent = ''; msgEl.className = 'form-msg'; }
      }, 7000);
    }, 1100);
  });
}

function isEmail(v) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v); }
function showMsg(el, txt, type) {
  if (!el) return;
  el.textContent = txt;
  el.className = 'form-msg ' + type;
}

/* ══════════════════════════════════════════
   EXISTING: ANNOUNCEMENT
══════════════════════════════════════════ */
function initAnnouncement() {
  const btn = document.getElementById('announce-close');
  const bar = document.getElementById('announce-bar');
  if (!btn || !bar) return;
  btn.addEventListener('click', () => {
    bar.style.transition = 'max-height .3s, opacity .3s, padding .3s';
    bar.style.overflow = 'hidden';
    bar.style.maxHeight = '0';
    bar.style.opacity = '0';
    bar.style.padding = '0';
    setTimeout(() => bar.remove(), 350);
  });
}

/* ══════════════════════════════════════════
   EXISTING: 3D HERO CARD MOUSE PARALLAX
══════════════════════════════════════════ */
function init3DHeroCard() {
  const card = document.getElementById('hero-card');
  const shine = document.getElementById('stage-shine');
  if (!card) return;

  let raf;
  let curX = 0, curY = 0, tgtX = 0, tgtY = 0;

  document.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    tgtX = (e.clientY - cy) / 30;
    tgtY = -(e.clientX - cx) / 30;
    if (shine) {
      const sx = ((e.clientX - rect.left) / rect.width) * 100;
      const sy = ((e.clientY - rect.top) / rect.height) * 100;
      shine.style.setProperty('--mx', sx + '%');
      shine.style.setProperty('--my', sy + '%');
    }
    if (!raf) raf = requestAnimationFrame(animateTilt);
  });

  function animateTilt() {
    curX += (tgtX - curX) * 0.08;
    curY += (tgtY - curY) * 0.08;
    card.style.transform = `translate(-50%, -50%) perspective(900px) rotateX(${curX}deg) rotateY(${curY}deg)`;
    raf = requestAnimationFrame(animateTilt);
  }

  document.addEventListener('mouseleave', () => { tgtX = 0; tgtY = 0; });
}

/* ══════════════════════════════════════════
   EXISTING: TILT CARDS (Product Cards)
══════════════════════════════════════════ */
function initTiltCards() {
  document.querySelectorAll('.tilt-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const dx = (e.clientX - rect.left - rect.width / 2) / (rect.width / 2);
      const dy = (e.clientY - rect.top - rect.height / 2) / (rect.height / 2);
      card.style.transform = `perspective(700px) rotateX(${-dy * 6}deg) rotateY(${dx * 6}deg) translateZ(8px) scale(1.03)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(700px) rotateX(0) rotateY(0) translateZ(0) scale(1)';
    });
  });
}

/* ══════════════════════════════════════════
   EXISTING: CARD SHINE
══════════════════════════════════════════ */
function initCardShine() {
  document.querySelectorAll('.prod-card, .why-card').forEach(card => {
    const shine = card.querySelector('.card-shine-layer');
    if (!shine) return;
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      shine.style.setProperty('--mx', x + '%');
      shine.style.setProperty('--my', y + '%');
    });
  });
}

/* ══════════════════════════════════════════
   EXISTING: COUNTER ANIMATION (Stats)
══════════════════════════════════════════ */
function initCounterAnimation() {
  const els = document.querySelectorAll('.why-num');
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const el = e.target;
      const raw = el.textContent;
      const match = raw.match(/^(\d+)/);
      if (match) {
        const num = parseInt(match[1]);
        const suffix = raw.slice(match[0].length);
        animateNum(el, 0, num, 1400, suffix);
      }
      io.unobserve(el);
    });
  }, { threshold: 0.5 });
  els.forEach(el => io.observe(el));
}

function animateNum(el, from, to, dur, suffix = '') {
  const start = performance.now();
  function tick(now) {
    const pct = Math.min((now - start) / dur, 1);
    const ease = 1 - Math.pow(1 - pct, 4);
    el.textContent = Math.round(from + (to - from) * ease) + suffix;
    if (pct < 1) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}

/* ══════════════════════════════════════════
   ENHANCEMENT 7: CURSOR GLOW
══════════════════════════════════════════ */
function initCursorGlow() {
  const glow = document.getElementById('cursor-glow');
  if (!glow) return;

  let mx = window.innerWidth / 2, my = window.innerHeight / 2;
  let cx = mx, cy = my;
  let raf;

  document.addEventListener('mousemove', (e) => {
    mx = e.clientX; my = e.clientY;
    if (!raf) raf = requestAnimationFrame(moveGlow);
  });

  function moveGlow() {
    cx += (mx - cx) * 0.12;
    cy += (my - cy) * 0.12;
    glow.style.left = cx + 'px';
    glow.style.top  = cy + 'px';
    raf = requestAnimationFrame(moveGlow);
  }

  document.addEventListener('mouseleave', () => {
    glow.style.opacity = '0';
  });
  document.addEventListener('mouseenter', () => {
    glow.style.opacity = '1';
  });
}

/* ══════════════════════════════════════════
   ENHANCEMENT 2: PARTICLE CANVAS
══════════════════════════════════════════ */
function initParticles() {
  const canvas = document.getElementById('particle-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let W, H, particles = [];

  function resize() {
    const section = canvas.parentElement;
    W = canvas.width  = section.offsetWidth;
    H = canvas.height = section.offsetHeight;
  }

  function Particle() {
    this.reset = function() {
      this.x  = Math.random() * W;
      this.y  = Math.random() * H + H;     // start below
      this.r  = Math.random() * 1.5 + 0.4;
      this.vy = -(Math.random() * 0.4 + 0.15); // drift upward
      this.vx = (Math.random() - 0.5) * 0.15;
      this.alpha = Math.random() * 0.7 + 0.3;
      this.life = 0;
      this.maxLife = Math.random() * 400 + 200;
    };
    this.reset();
    this.y = Math.random() * H; // seed randomly on init
  }

  Particle.prototype.update = function() {
    this.x += this.vx;
    this.y += this.vy;
    this.life++;
    if (this.y < -10 || this.life > this.maxLife) this.reset();
  };

  Particle.prototype.draw = function() {
    const fade = Math.min(this.life / 40, 1) * Math.min((this.maxLife - this.life) / 40, 1);
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(232,86,10,${this.alpha * fade})`;
    ctx.fill();
  };

  const COUNT = 80;
  for (let i = 0; i < COUNT; i++) particles.push(new Particle());
  resize();
  window.addEventListener('resize', resize);

  function loop() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => { p.update(); p.draw(); });
    requestAnimationFrame(loop);
  }
  loop();
}

/* ══════════════════════════════════════════
   ENHANCEMENT 1: TYPEWRITER / CYCLING TEXT
══════════════════════════════════════════ */
function initTypewriter() {
  const el = document.getElementById('tw-text');
  if (!el) return;

  const words = ['Rapid Prototypes.', 'Premium Wall Art.', '3D Decor Frames.', 'Small Batch Parts.'];
  let idx = 0;

  function cycle() {
    // Fade out
    el.classList.add('fading');
    setTimeout(() => {
      idx = (idx + 1) % words.length;
      el.classList.remove('fading');
      el.classList.add('entering');
      el.textContent = words[idx];
      // Force reflow so transition fires
      el.getBoundingClientRect();
      el.classList.remove('entering');
    }, 380);
  }

  setInterval(cycle, 2800);
}

/* ══════════════════════════════════════════
   ENHANCEMENT 6: FOMO LIVE COUNTER
══════════════════════════════════════════ */
let fomoCount = 47;

function initFomoCounter() {
  // Randomly increment every 30–60 seconds
  function scheduleNext() {
    const delay = (Math.random() * 30 + 30) * 1000; // 30–60s
    setTimeout(() => {
      bumpFomoCounter();
      scheduleNext();
    }, delay);
  }
  scheduleNext();
}

function bumpFomoCounter() {
  const el = document.getElementById('fomo-count');
  if (!el) return;
  fomoCount++;
  // Animate the number change
  el.style.transition = 'transform .2s, opacity .2s';
  el.style.transform = 'translateY(-6px)';
  el.style.opacity = '0';
  setTimeout(() => {
    el.textContent = fomoCount;
    el.style.transform = 'translateY(4px)';
    setTimeout(() => {
      el.style.transform = 'translateY(0)';
      el.style.opacity = '1';
    }, 20);
  }, 200);
}

/* ══════════════════════════════════════════
   ENHANCEMENT 4: LIVE COUNTDOWN TIMER
══════════════════════════════════════════ */
function initCountdown() {
  // Target: 30 days from now
  const target = new Date();
  target.setDate(target.getDate() + 30);
  target.setHours(0, 0, 0, 0);

  const daysEl  = document.getElementById('cd-days');
  const hoursEl = document.getElementById('cd-hours');
  const minsEl  = document.getElementById('cd-mins');
  const secsEl  = document.getElementById('cd-secs');

  if (!daysEl) return;

  // Previous values for flip detection
  let prevD = -1, prevH = -1, prevM = -1, prevS = -1;

  function pad(n) { return String(n).padStart(2, '0'); }

  function flipEl(el, val, prev) {
    if (val !== prev) {
      el.textContent = pad(val);
      el.classList.remove('flip');
      void el.offsetWidth; // reflow
      el.classList.add('flip');
    }
  }

  function tick() {
    const now  = Date.now();
    const diff = Math.max(0, target.getTime() - now);

    const d = Math.floor(diff / 86400000);
    const h = Math.floor((diff % 86400000) / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    const s = Math.floor((diff % 60000) / 1000);

    flipEl(daysEl,  d, prevD);
    flipEl(hoursEl, h, prevH);
    flipEl(minsEl,  m, prevM);
    flipEl(secsEl,  s, prevS);

    prevD = d; prevH = h; prevM = m; prevS = s;
  }

  tick();
  setInterval(tick, 1000);
}

/* ══════════════════════════════════════════
   NEW: CONTACT FORM HANDLER
   ══════════════════════════════════════════ */
function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;
  const nameEl = document.getElementById('contact-name');
  const emailEl = document.getElementById('contact-email');
  const typeEl = document.getElementById('contact-type');
  const msgEl = document.getElementById('contact-message');
  const btnEl = document.getElementById('contact-btn');
  const statusEl = document.getElementById('contact-msg');

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = nameEl ? nameEl.value.trim() : '';
    const email = emailEl ? emailEl.value.trim() : '';
    const type = typeEl ? typeEl.value : '';
    const message = msgEl ? msgEl.value.trim() : '';

    if (!name || !email || !message) {
      showMsg(statusEl, '✕ Please fill in all required fields.', 'error');
      return;
    }
    if (!isEmail(email)) {
      showMsg(statusEl, '✕ Please enter a valid email address.', 'error');
      return;
    }

    const lbl = btnEl.querySelector('.btn-label');
    const origText = lbl ? lbl.textContent : btnEl.textContent;
    if (lbl) lbl.textContent = 'Sending Message...';
    btnEl.disabled = true;

    setTimeout(() => {
      if (lbl) lbl.textContent = '✓ Sent Successfully!';
      btnEl.style.background = 'linear-gradient(135deg,#16a34a,#15803d)';
      
      if (nameEl) nameEl.value = '';
      if (emailEl) emailEl.value = '';
      if (typeEl) typeEl.selectedIndex = 0;
      if (msgEl) msgEl.value = '';
      
      showMsg(statusEl, '✓ Thank you! We will get back to you shortly.', 'success');

      setTimeout(() => {
        if (lbl) lbl.textContent = origText;
        btnEl.disabled = false;
        btnEl.style.background = '';
        if (statusEl) { statusEl.textContent = ''; statusEl.className = 'form-msg'; }
      }, 5000);
    }, 1200);
  });
}
