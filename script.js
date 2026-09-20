/* ============================================================
   UNDANGAN DIGITAL - ALVINO & INTAN
   Persis template GoodChoice "ALISHA"
   - Cover lock + OPEN INVITATION
   - ?to= query (persis Alisha, kompatibel ?name=, ?guest=)
   - Audio ala Alisha (#weddingAudio + #audioButton)
   - Countdown, slideshow, gift toggle, bottom nav, lightbox
   ============================================================ */

const CONFIG = {
  weddingDate: '2026-10-25T08:00:00+07:00',
  googleScriptURL: '',
  demoWishes: [
    { nama: 'Rina Kusuma',   ucapan: 'Selamat menempuh hidup baru! Semoga sakinah mawaddah warahmah.' },
    { nama: 'Bagus Prasetyo', ucapan: 'Barakallahu lakuma. Semoga langgeng sampai jannah, aamiin.' },
    { nama: 'Dewi Anggraini', ucapan: 'Congrats Alvino & Intan! Bahagia selalu ya.' },
    { nama: 'Ferry Hartono',  ucapan: 'Wish you a lifetime of love and happiness. Barakallah!' },
    { nama: 'Sari Wulandari', ucapan: 'Semoga jadi keluarga yang samawa. Selamat ya!' }
  ]
};

/* ---------- 1. NAMA TAMU: ?to= (persis Alisha), fallback ?name= ?guest= ?tamu= ---------- */
(function setGuestName() {
  const params = new URLSearchParams(window.location.search);
  const raw = params.get('to') || params.get('name') || params.get('guest') || params.get('tamu') || '';
  const clean = raw.replace(/\+/g, ' ').trim();
  if (clean) {
    const guestEl = document.getElementById('guestName');
    if (guestEl) guestEl.textContent = decodeURIComponent(clean);
    // Prefill nama di form RSVP & ucapan
    document.querySelectorAll('form input[name="nama"]').forEach(i => { if (!i.value) i.value = decodeURIComponent(clean); });
  }
})();

/* ---------- 2. OPEN INVITATION ala Alisha ---------- */
const openLink     = document.getElementById('btn-cover');
const coverEl      = document.getElementById('cover');
const mainEl       = document.getElementById('main');
const audioEl      = document.getElementById('weddingAudio');
const audioButton  = document.getElementById('audioButton');
const fixedFlowers = document.getElementById('fixedFlowers');
const bottomNav    = document.getElementById('bottomNav');

document.body.style.overflow = 'hidden';

function disableScrolling() {
  document.body.style.overflow = 'hidden';
}
function enableScrolling() {
  document.body.style.overflow = 'auto';
}

function toggleAudio() {
  if (!audioEl) return;
  audioEl.volume = 0.6;
  const p = audioEl.play();
  if (p !== undefined) {
    p.then(() => audioButton.classList.add('playing'))
     .catch(() => { /* user bisa tap tombol manual */ });
  }
}

if (openLink) {
  openLink.addEventListener('click', (e) => {
    e.preventDefault();
    mainEl.classList.remove('main-hidden');
    mainEl.classList.add('main-visible');
    coverEl.classList.add('closed');
    enableScrolling();
    window.scrollTo({ top: 0, behavior: 'auto' });
    toggleAudio();
    if (audioButton) audioButton.classList.add('show');
    if (fixedFlowers) fixedFlowers.classList.add('show');
    if (bottomNav) bottomNav.classList.add('show');
    setTimeout(triggerScrollAnim, 100);
    setTimeout(() => {
      const target = document.getElementById('ayatsuci');
      if (target) target.scrollIntoView({ behavior: 'smooth' });
    }, 150);
  });
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

// Pause saat tab disembunyikan (perilaku Alisha)
document.addEventListener('visibilitychange', () => {
  if (document.hidden && audioEl && !audioEl.paused) {
    audioEl.pause();
    if (audioButton) audioButton.classList.remove('playing');
  }
});

/* ---------- 3. COUNTDOWN ---------- */
(function countdown() {
  const target = new Date(CONFIG.weddingDate).getTime();
  const $days = document.getElementById('cdDays');
  if (!$days) return;
  const $hrs = document.getElementById('cdHours');
  const $min = document.getElementById('cdMinutes');
  const $sec = document.getElementById('cdSeconds');
  const pad = n => String(n).padStart(2, '0');
  function tick() {
    const diff = target - Date.now();
    if (diff <= 0) {
      $days.textContent = $hrs.textContent = $min.textContent = $sec.textContent = '00';
      return;
    }
    $days.textContent = pad(Math.floor(diff / 86400000));
    $hrs.textContent  = pad(Math.floor((diff % 86400000) / 3600000));
    $min.textContent  = pad(Math.floor((diff % 3600000) / 60000));
    $sec.textContent  = pad(Math.floor((diff % 60000) / 1000));
  }
  tick();
  setInterval(tick, 1000);
})();

/* ---------- 4. SAVE THE DATE rotate ---------- */
(function rotateSdPhotos() {
  const photos = document.querySelectorAll('.sd-photo');
  if (!photos.length) return;
  let i = 0;
  setInterval(() => {
    photos[i].classList.remove('active');
    i = (i + 1) % photos.length;
    photos[i].classList.add('active');
  }, 1500);
})();

/* ---------- 5. SCROLL ANIMATIONS ---------- */
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
  }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });
  els.forEach(el => io.observe(el));
}

/* ---------- 6. GIFT TOGGLE ala Alisha ---------- */
(function giftToggle() {
  const btn = document.getElementById('toggleGift');
  const area = document.getElementById('giftArea');
  if (!btn || !area) return;
  btn.addEventListener('click', () => {
    const open = area.classList.toggle('is-open');
    btn.textContent = open ? 'SEMBUNYIKAN' : 'TAMPILKAN GIFT';
    if (open) {
      area.querySelectorAll('.gift-card').forEach((card, i) => {
        card.style.transitionDelay = (0.1 + i * 0.15) + 's';
      });
      setTimeout(triggerScrollAnim, 50);
    }
  });
})();

/* ---------- 7. COPY ---------- */
document.querySelectorAll('.btn-copy').forEach(btn => {
  btn.addEventListener('click', async () => {
    const text = btn.getAttribute('data-copy');
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const ta = document.createElement('textarea');
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
    }
    const original = btn.textContent;
    btn.textContent = 'TERSALIN ✓';
    setTimeout(() => { btn.textContent = original; }, 1500);
  });
});

/* ---------- 8. WISHES RENDER ---------- */
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

async function saveWish(data, statusEl) {
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
    await new Promise(r => setTimeout(r, 500));
  }
}

/* ---------- 9. RSVP FORM ---------- */
const rsvpForm = document.getElementById('rsvpForm');
const rsvpStatus = document.getElementById('rsvpStatus');
if (rsvpForm) {
  rsvpForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const checked = rsvpForm.querySelector('input[name="kehadiran"]:checked');
    const data = {
      nama: rsvpForm.nama.value.trim(),
      kehadiran: checked ? checked.value : '',
      jumlah: rsvpForm.jumlah.value,
      ucapan: '',
      timestamp: new Date().toISOString()
    };
    rsvpStatus.textContent = 'Mengirim...';
    rsvpStatus.className = 'rsvp-status';
    try {
      await saveWish(data, rsvpStatus);
      rsvpStatus.textContent = 'Terima kasih! RSVP kamu berhasil dikirim ❤';
      rsvpStatus.classList.add('ok');
      rsvpForm.reset();
    } catch (err) {
      console.error(err);
      rsvpStatus.textContent = 'Gagal mengirim, coba lagi ya.';
      rsvpStatus.classList.add('err');
    }
  });
}

/* ---------- 10. WISH FORM (Ucapan & Doa ala Alisha) ---------- */
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
      await saveWish(data, wishStatus);
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

/* ---------- 11. GALLERY LIGHTBOX ---------- */
(function lightbox() {
  const lb = document.getElementById('lightbox');
  const lbImg = document.getElementById('lightboxImg');
  if (!lb) return;
  document.querySelectorAll('.gallery-grid img').forEach(img => {
    img.addEventListener('click', () => {
      lbImg.src = img.src;
      lb.classList.add('open');
    });
  });
  lb.addEventListener('click', (e) => {
    if (e.target === lb || e.target.classList.contains('lightbox-close')) {
      lb.classList.remove('open');
      lbImg.src = '';
    }
  });
})();

/* ---------- 12. BOTTOM NAV smooth scroll + active state ---------- */
(function bottomNavFn() {
  const nav = document.getElementById('bottomNav');
  if (!nav) return;
  nav.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', (e) => {
      const id = a.getAttribute('href');
      if (id === '#cover') {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }
      const target = document.querySelector(id);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });
})();
