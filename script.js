/* ============================================================
   UNDANGAN DIGITAL - ALVINO & INTAN
   - Cover lock + OPEN INVITATION (+ confetti & kelopak)
   - ?to= / ?name= / ?guest= untuk nama tamu
   - Countdown, slideshow, gift, bottom nav aktif, lightbox
   - Scroll animation bertahap (stagger) + parallax bunga bawah
   ============================================================ */

const CONFIG = {
  weddingDate: '2026-10-25T08:00:00+07:00',
  googleScriptURL: '',   // isi dengan URL Web App Google Sheet agar RSVP & ucapan tersimpan
  youtubeURL: '',        // isi dengan link live streaming YouTube
  demoWishes: [
    { nama: 'Rina Kusuma',    ucapan: 'Selamat menempuh hidup baru! Semoga sakinah mawaddah warahmah.' },
    { nama: 'Bagus Prasetyo', ucapan: 'Barakallahu lakuma. Semoga langgeng sampai jannah, aamiin.' },
    { nama: 'Dewi Anggraini', ucapan: 'Congrats Alvino & Intan! Bahagia selalu ya.' },
    { nama: 'Ferry Hartono',  ucapan: 'Wish you a lifetime of love and happiness. Barakallah!' },
    { nama: 'Sari Wulandari', ucapan: 'Semoga jadi keluarga yang samawa. Selamat ya!' }
  ]
};

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ---------- 1. NAMA TAMU ---------- */
(function setGuestName() {
  const params = new URLSearchParams(window.location.search);
  const raw = params.get('to') || params.get('name') || params.get('guest') || params.get('tamu') || '';
  const clean = raw.replace(/\+/g, ' ').trim();
  if (!clean) return;
  const value = decodeURIComponent(clean);
  const guestEl = document.getElementById('guestName');
  if (guestEl) guestEl.textContent = value;
  document.querySelectorAll('form input[name="nama"]').forEach(i => { if (!i.value) i.value = value; });
})();

/* ---------- 2. ELEMEN UTAMA ---------- */
const openLink     = document.getElementById('btn-cover');
const coverEl      = document.getElementById('cover');
const mainEl       = document.getElementById('main');
const audioEl      = document.getElementById('weddingAudio');
const audioButton  = document.getElementById('audioButton');
const fixedFlowers = document.getElementById('fixedFlowers');
const bottomNav    = document.getElementById('bottomNav');

document.body.style.overflow = 'hidden';

function enableScrolling()  { document.body.style.overflow = 'auto'; }
function disableScrolling() { document.body.style.overflow = 'hidden'; }

function startAudio() {
  if (!audioEl) return;
  audioEl.volume = 0.55;
  const p = audioEl.play();
  if (p !== undefined) {
    p.then(() => audioButton && audioButton.classList.add('show playing'))
     .catch(() => { if (audioButton) audioButton.classList.add('show'); });
  } else if (audioButton) {
    audioButton.classList.add('show');
  }
}

if (audioButton) {
  audioButton.addEventListener('click', () => {
    if (!audioEl) return;
    if (audioEl.paused) {
      audioEl.play();
      audioButton.classList.add('playing');
    } else {
      audioEl.pause();
      audioButton.classList.remove('playing');
    }
  });
}

document.addEventListener('visibilitychange', () => {
  if (document.hidden && audioEl && !audioEl.paused) {
    audioEl.pause();
    if (audioButton) audioButton.classList.remove('playing');
  }
});

/* ---------- 3. EFEK: KONFETTI + KELOPAK ---------- */
function celebrate() {
  const layer = document.getElementById('fxLayer');
  if (!layer || reduceMotion) return;

  const petalColors = ['#8f2b2b', '#b5453f', '#d98b7d', '#f0d9c0', '#7a2222', '#e7b7a1', '#fdf3e6'];
  const confColors  = ['#8f2b2b', '#c9a227', '#f0d9c0', '#fdf3e6', '#b5453f'];

  const spawn = (cls, count, palette, minSize, maxSize) => {
    for (let i = 0; i < count; i++) {
      const el = document.createElement('span');
      el.className = cls;
      const w = minSize + Math.random() * (maxSize - minSize);
      el.style.left = (Math.random() * 100) + 'vw';
      el.style.width = w.toFixed(1) + 'px';
      el.style.height = cls === 'petal' ? (w * 1.35).toFixed(1) + 'px' : (w * 1.6).toFixed(1) + 'px';
      el.style.background = palette[(Math.random() * palette.length) | 0];
      el.style.setProperty('--drift', ((Math.random() * 180) - 90).toFixed(0) + 'px');
      el.style.setProperty('--spin', ((Math.random() * 900) - 450).toFixed(0) + 'deg');
      el.style.animationDuration = (cls === 'petal' ? 4.2 + Math.random() * 3.6 : 2.6 + Math.random() * 2.2).toFixed(2) + 's';
      el.style.animationDelay = (Math.random() * (cls === 'petal' ? 3.2 : 1.1)).toFixed(2) + 's';
      layer.appendChild(el);
      setTimeout(() => el.remove(), 11000);
    }
  };

  spawn('confetti', 46, confColors, 5, 10);
  spawn('petal', 26, petalColors, 9, 20);
}

/* ---------- 4. OPEN INVITATION ---------- */
function openInvitation(instant) {
  if (!mainEl) return;
  mainEl.classList.remove('main-hidden');
  mainEl.classList.add('main-visible');
  if (coverEl) coverEl.classList.add('closed');
  enableScrolling();
  window.scrollTo({ top: 0, behavior: 'auto' });
  startAudio();
  if (audioButton) audioButton.classList.add('show');
  if (fixedFlowers) fixedFlowers.classList.add('show');
  if (bottomNav) bottomNav.classList.add('show');

  prepareStagger();
  setTimeout(triggerScrollAnim, 60);

  if (!instant) {
    celebrate();
    setTimeout(() => {
      const target = document.getElementById('ayatsuci');
      if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 420);
  }
}

if (openLink) {
  openLink.addEventListener('click', (e) => {
    e.preventDefault();
    openInvitation(false);
  });
}

/* Buka langsung bila ada hash tujuan (mis. link ?name=Tamu#rsvp) */
window.addEventListener('load', () => {
  if (window.location.hash && window.location.hash !== '#cover') {
    openInvitation(true);
    setTimeout(() => {
      const t = document.querySelector(window.location.hash);
      if (t) t.scrollIntoView({ behavior: 'auto', block: 'start' });
    }, 80);
  }
});

/* ---------- 5. COUNTDOWN ---------- */
(function countdown() {
  const target = new Date(CONFIG.weddingDate).getTime();
  const $days = document.getElementById('cdDays');
  if (!$days) return;
  const $hrs  = document.getElementById('cdHours');
  const $min  = document.getElementById('cdMinutes');
  const $sec  = document.getElementById('cdSeconds');
  const pad = n => String(n).padStart(2, '0');
  let lastSec = null;

  function tick() {
    const diff = target - Date.now();
    if (diff <= 0) {
      $days.textContent = $hrs.textContent = $min.textContent = $sec.textContent = '00';
      return;
    }
    const d = Math.floor(diff / 86400000);
    const h = Math.floor((diff % 86400000) / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    const s = Math.floor((diff % 60000) / 1000);

    $days.textContent = pad(d);
    $hrs.textContent  = pad(h);
    $min.textContent  = pad(m);
    $sec.textContent  = pad(s);

    if (lastSec !== null && s !== lastSec && !reduceMotion) {
      const item = $sec.closest('.cd-item');
      if (item) {
        item.classList.remove('tick');
        void item.offsetWidth;
        item.classList.add('tick');
      }
    }
    lastSec = s;
  }
  tick();
  setInterval(tick, 1000);
})();

/* ---------- 6. SAVE THE DATE ROTATE ---------- */
(function rotateSdPhotos() {
  const photos = document.querySelectorAll('.sd-photo');
  if (!photos.length) return;
  let i = 0;
  setInterval(() => {
    photos[i].classList.remove('active');
    i = (i + 1) % photos.length;
    photos[i].classList.add('active');
  }, 2600);
})();

/* ---------- 7. SCROLL ANIMATION (STAGGER) ---------- */
function prepareStagger() {
  document.querySelectorAll('.page-inner').forEach(container => {
    const groups = new Map();
    container.querySelectorAll('[data-anim]').forEach(el => {
      const parent = el.parentElement;
      const idx = groups.get(parent) || 0;
      groups.set(parent, idx + 1);
      el.style.transitionDelay = Math.min(idx, 7) * 0.09 + 's';
    });
  });
}

function triggerScrollAnim() {
  const els = document.querySelectorAll('[data-anim]');
  if (!('IntersectionObserver' in window)) {
    els.forEach(el => el.classList.add('in-view'));
    return;
  }
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
  els.forEach(el => io.observe(el));
}
prepareStagger();

/* ---------- 8. COPY ---------- */
document.querySelectorAll('.btn-copy').forEach(btn => {
  const original = btn.textContent;
  btn.addEventListener('click', async () => {
    const text = btn.getAttribute('data-copy');
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const ta = document.createElement('textarea');
      ta.value = text;
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
    }
    btn.textContent = 'TERSALIN ✓';
    btn.style.background = '#1d7a2e';
    setTimeout(() => {
      btn.textContent = original;
      btn.style.background = '';
    }, 1800);
  });
});

/* ---------- 9. WISHES ---------- */
const wishesList = document.getElementById('wishesList');

function escapeHTML(s = '') {
  return s.replace(/[&<>"']/g, m => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[m]));
}

function renderWish(w) {
  const div = document.createElement('div');
  div.className = 'wish-item';
  const initial = (w.nama || '?').trim().charAt(0).toUpperCase();
  div.innerHTML =
    '<div class="wish-avatar">' + escapeHTML(initial) + '</div>' +
    '<div class="wish-body">' +
      '<div class="wish-name">' + escapeHTML(w.nama) + '</div>' +
      '<div class="wish-text">' + escapeHTML(w.ucapan) + '</div>' +
    '</div>';
  return div;
}

function prependWish(w) {
  if (wishesList) wishesList.insertBefore(renderWish(w), wishesList.firstChild);
}

async function loadWishes() {
  if (!wishesList) return;
  let wishes = [];
  if (CONFIG.googleScriptURL) {
    try {
      const r = await fetch(CONFIG.googleScriptURL + '?action=list');
      wishes = await r.json();
    } catch { wishes = CONFIG.demoWishes; }
  } else {
    const local = JSON.parse(localStorage.getItem('demoRSVP') || '[]').filter(x => x.ucapan);
    wishes = [...local, ...CONFIG.demoWishes];
  }
  wishesList.innerHTML = '';
  wishes.forEach(w => wishesList.appendChild(renderWish(w)));
}
loadWishes();

async function saveWish(data) {
  if (CONFIG.googleScriptURL) {
    await fetch(CONFIG.googleScriptURL, {
      method: 'POST', mode: 'no-cors',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
  } else {
    const arr = JSON.parse(localStorage.getItem('demoRSVP') || '[]');
    arr.unshift(data);
    localStorage.setItem('demoRSVP', JSON.stringify(arr));
    await new Promise(r => setTimeout(r, 450));
  }
}

/* ---------- 10. RSVP ---------- */
const rsvpForm = document.getElementById('rsvpForm');
const rsvpStatus = document.getElementById('rsvpStatus');
if (rsvpForm) {
  rsvpForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const data = {
      nama: rsvpForm.nama.value.trim(),
      kehadiran: rsvpForm.kehadiran.value,
      jumlah: rsvpForm.jumlah.value,
      ucapan: (rsvpForm.ucapan ? rsvpForm.ucapan.value.trim() : ''),
      timestamp: new Date().toISOString()
    };
    rsvpStatus.textContent = 'Mengirim...';
    rsvpStatus.className = 'rsvp-status';
    try {
      await saveWish(data);
      rsvpStatus.textContent = 'Terima kasih! RSVP kamu berhasil dikirim ❤';
      rsvpStatus.classList.add('ok');
      if (data.ucapan) prependWish({ nama: data.nama, ucapan: data.ucapan });
      rsvpForm.reset();
    } catch (err) {
      console.error(err);
      rsvpStatus.textContent = 'Gagal mengirim, coba lagi ya.';
      rsvpStatus.classList.add('err');
    }
  });
}

/* ---------- 11. UCAPAN & DOA ---------- */
const wishForm = document.getElementById('wishForm');
const wishStatus = document.getElementById('wishStatus');
if (wishForm) {
  wishForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const data = {
      nama: wishForm.nama.value.trim(),
      kehadiran: '',
      jumlah: '',
      ucapan: wishForm.ucapan.value.trim(),
      timestamp: new Date().toISOString()
    };
    wishStatus.textContent = 'Mengirim...';
    wishStatus.className = 'rsvp-status';
    try {
      await saveWish(data);
      wishStatus.textContent = 'Terima kasih atas doanya ❤';
      wishStatus.classList.add('ok');
      wishForm.reset();
      if (data.ucapan) prependWish({ nama: data.nama, ucapan: data.ucapan });
    } catch (err) {
      console.error(err);
      wishStatus.textContent = 'Gagal mengirim, coba lagi ya.';
      wishStatus.classList.add('err');
    }
  });
}

/* ---------- 12. GALLERY LIGHTBOX (navigasi) ---------- */
(function lightbox() {
  const lb = document.getElementById('lightbox');
  const lbImg = document.getElementById('lightboxImg');
  if (!lb) return;
  const imgs = Array.from(document.querySelectorAll('.gallery-grid img'));
  let idx = 0;

  const show = (i) => {
    idx = (i + imgs.length) % imgs.length;
    lbImg.src = imgs[idx].currentSrc || imgs[idx].src;
    lb.classList.add('open');
    document.body.style.overflow = 'hidden';
  };
  const close = () => {
    lb.classList.remove('open');
    lbImg.src = '';
    document.body.style.overflow = 'auto';
  };

  imgs.forEach((img, i) => img.addEventListener('click', () => show(i)));
  lb.addEventListener('click', (e) => {
    if (e.target === lb || e.target.classList.contains('lightbox-close')) close();
    else if (e.target === lbImg) show(idx + 1);
  });
  document.addEventListener('keydown', (e) => {
    if (!lb.classList.contains('open')) return;
    if (e.key === 'Escape') close();
    if (e.key === 'ArrowRight') show(idx + 1);
    if (e.key === 'ArrowLeft') show(idx - 1);
  });

  let startX = 0;
  lb.addEventListener('touchstart', (e) => { startX = e.touches[0].clientX; }, { passive: true });
  lb.addEventListener('touchend', (e) => {
    const dx = e.changedTouches[0].clientX - startX;
    if (Math.abs(dx) > 50) show(dx < 0 ? idx + 1 : idx - 1);
  }, { passive: true });
})();

/* ---------- 13. BOTTOM NAV + STATE AKTIF + PARALLAX ---------- */
(function bottomNavFn() {
  const nav = document.getElementById('bottomNav');
  if (!nav) return;

  nav.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', (e) => {
      const id = a.getAttribute('href');
      e.preventDefault();
      if (id === '#cover') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }
      const target = document.querySelector(id);
      if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });

  const anchors = Array.from(nav.querySelectorAll('a'))
    .map(a => ({ link: a, el: document.querySelector(a.getAttribute('href')) }))
    .filter(x => x.el);

  const setActive = () => {
    const y = window.scrollY + window.innerHeight * 0.4;
    let current = anchors[0];
    anchors.forEach(item => {
      if (item.el.offsetTop <= y) current = item;
    });
    anchors.forEach(item => item.link.classList.toggle('active', item === current));
  };

  let ticking = false;
  const flowersImg = fixedFlowers ? fixedFlowers.querySelector('img') : null;

  const onScroll = () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      setActive();
      if (flowersImg && !reduceMotion) {
        const max = document.documentElement.scrollHeight - window.innerHeight;
        const p = max > 0 ? Math.min(window.scrollY / max, 1) : 0;
        flowersImg.style.transform = 'translateY(' + (-p * 12).toFixed(1) + 'px) scale(' + (1 + p * 0.05).toFixed(3) + ')';
      }
      ticking = false;
    });
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  onScroll();
})();

/* ---------- 14. LIVE STREAMING ---------- */
(function liveLink() {
  const btn = document.getElementById('liveYoutubeBtn');
  if (!btn) return;
  if (CONFIG.youtubeURL) {
    btn.setAttribute('href', CONFIG.youtubeURL);
  } else {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const original = btn.textContent;
      btn.textContent = 'LINK BELUM DIISI';
      setTimeout(() => { btn.textContent = original; }, 1800);
    });
  }
})();
