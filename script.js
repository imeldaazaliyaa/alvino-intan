/* Alvino & Intan - main script */

const CONFIG = {
  weddingDate: '2026-10-25T11:30:00+07:00',
  googleScriptURL: '',
  demoWishes: [
    { nama: 'Rina Kusuma',   ucapan: 'Selamat menempuh hidup baru! Semoga sakinah mawaddah warahmah.' },
    { nama: 'Bagus Prasetyo', ucapan: 'Barakallahu lakuma. Semoga langgeng sampai jannah, aamiin.' },
    { nama: 'Dewi Anggraini', ucapan: 'Congrats Alvino & Intan! Bahagia selalu ya.' },
    { nama: 'Ferry Hartono',  ucapan: 'Wish you a lifetime of love and happiness. Barakallah!' },
    { nama: 'Sari Wulandari', ucapan: 'Semoga jadi keluarga yang samawa. Selamat ya!' }
  ]
};

/* Image fallback (multi-extension) — sekaligus warn ke console */
document.querySelectorAll('img[data-fallback]').forEach(img => {
  const original = img.src;
  const fallbacks = img.getAttribute('data-fallback').split('|').filter(Boolean);
  let idx = 0;
  img.addEventListener('error', () => {
    if (idx < fallbacks.length) {
      img.src = fallbacks[idx++];
    } else {
      console.warn(
        '⚠️ Foto tidak ditemukan. Sudah coba: ' + [original, ...fallbacks].join(', ') +
        '\nBuka folder assets kamu dan pastikan salah satu file di atas ada.'
      );
      // Sembunyikan img yang broken supaya tidak muncul icon
      img.style.display = 'none';
    }
  });
});

(function setGuestName() {
  const to = new URLSearchParams(window.location.search).get('to');
  if (to) {
    const el = document.getElementById('guestName');
    if (el) el.textContent = decodeURIComponent(to.replace(/\+/g, ' '));
  }
})();

const openBtn      = document.getElementById('openInvitation');
const coverEl      = document.getElementById('cover');
const mainEl       = document.getElementById('main');
const musicEl      = document.getElementById('bgMusic');
const musicToggle  = document.getElementById('musicToggle');
const fixedFlowers = document.getElementById('fixedFlowers');
const phoneFrame   = document.querySelector('.phone-frame');

document.body.style.overflow = 'hidden';

openBtn.addEventListener('click', () => {
  mainEl.classList.remove('main-hidden');
  coverEl.classList.add('closed');
  if (window.innerWidth >= 900) {
    phoneFrame.scrollTo({ top: 0, behavior: 'auto' });
  } else {
    document.body.style.overflow = 'auto';
    window.scrollTo({ top: 0, behavior: 'auto' });
  }
  playMusic();
  musicToggle.classList.add('show');
  fixedFlowers.classList.add('show');
  setTimeout(triggerScrollAnim, 100);
});

function playMusic() {
  if (!musicEl) return;
  musicEl.volume = 0.6;
  const p = musicEl.play();
  if (p !== undefined) p.then(() => musicToggle.classList.add('playing')).catch(()=>{});
}
musicToggle.addEventListener('click', () => {
  if (musicEl.paused) { musicEl.play(); musicToggle.classList.add('playing'); }
  else { musicEl.pause(); musicToggle.classList.remove('playing'); }
});

(function countdown() {
  const target = new Date(CONFIG.weddingDate).getTime();
  const $d=document.getElementById('cdDays'), $h=document.getElementById('cdHours'),
        $m=document.getElementById('cdMinutes'), $s=document.getElementById('cdSeconds');
  if (!$d) return;
  const pad = n => String(n).padStart(2,'0');
  function tick(){
    const diff = target - Date.now();
    if (diff <= 0){ $d.textContent=$h.textContent=$m.textContent=$s.textContent='00'; return; }
    $d.textContent = pad(Math.floor(diff/86400000));
    $h.textContent = pad(Math.floor((diff%86400000)/3600000));
    $m.textContent = pad(Math.floor((diff%3600000)/60000));
    $s.textContent = pad(Math.floor((diff%60000)/1000));
  }
  tick(); setInterval(tick, 1000);
})();

(function rotateSdPhotos() {
  const photos = document.querySelectorAll('.sd-photo');
  if (!photos.length) return;
  let i = 0;
  setInterval(() => {
    photos[i].classList.remove('active');
    i = (i + 1) % photos.length;
    photos[i].classList.add('active');
  }, 1000);
})();

function triggerScrollAnim() {
  const els = document.querySelectorAll('[data-anim]');
  if (!('IntersectionObserver' in window)) {
    els.forEach(el => el.classList.add('in-view'));
    return;
  }
  const root = window.innerWidth >= 900 ? phoneFrame : null;
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('in-view'); io.unobserve(e.target); }
    });
  }, { root, threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
  els.forEach(el => io.observe(el));
}

document.querySelectorAll('.btn-copy').forEach(btn => {
  btn.addEventListener('click', async () => {
    const text = btn.getAttribute('data-copy');
    try { await navigator.clipboard.writeText(text); }
    catch {
      const ta = document.createElement('textarea');
      ta.value = text; document.body.appendChild(ta); ta.select();
      document.execCommand('copy'); document.body.removeChild(ta);
    }
    const original = btn.textContent;
    btn.textContent = 'TERSALIN ✓';
    setTimeout(() => { btn.textContent = original; }, 1500);
  });
});

const rsvpForm   = document.getElementById('rsvpForm');
const rsvpStatus = document.getElementById('rsvpStatus');
rsvpForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const data = {
    nama: rsvpForm.nama.value.trim(),
    kehadiran: rsvpForm.kehadiran.value,
    jumlah: rsvpForm.jumlah.value,
    ucapan: rsvpForm.ucapan.value.trim(),
    timestamp: new Date().toISOString()
  };
  rsvpStatus.textContent = 'Mengirim...';
  rsvpStatus.className = 'rsvp-status';
  try {
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
    rsvpStatus.textContent = 'Terima kasih! RSVP berhasil dikirim ❤';
    rsvpStatus.classList.add('ok');
    rsvpForm.reset();
    if (data.ucapan) prependWish({ nama: data.nama, ucapan: data.ucapan });
  } catch (err) {
    console.error(err);
    rsvpStatus.textContent = 'Gagal mengirim, coba lagi ya.';
    rsvpStatus.classList.add('err');
  }
});

const wishesList = document.getElementById('wishesList');
function renderWish(w) {
  const div = document.createElement('div');
  div.className = 'wish-item';
  div.innerHTML = `<div class="wish-name">${esc(w.nama)}</div><div class="wish-text">${esc(w.ucapan)}</div>`;
  return div;
}
function prependWish(w) { wishesList.insertBefore(renderWish(w), wishesList.firstChild); }
function esc(s = '') {
  return s.replace(/[&<>"']/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
}
async function loadWishes() {
  let wishes = [];
  if (CONFIG.googleScriptURL) {
    try { const r = await fetch(CONFIG.googleScriptURL + '?action=list'); wishes = await r.json(); }
    catch { wishes = CONFIG.demoWishes; }
  } else {
    const local = JSON.parse(localStorage.getItem('demoRSVP') || '[]').filter(x => x.ucapan);
    wishes = [...local, ...CONFIG.demoWishes];
  }
  wishesList.innerHTML = '';
  wishes.forEach(w => wishesList.appendChild(renderWish(w)));
}
loadWishes();
