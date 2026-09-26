# UNDANGAN DIGITAL — ALVINO & INTAN

Undangan pernikahan statis (HTML/CSS/JS murni, tanpa build tool).
Desain mengikuti mockup di folder `../refrence/*.png`.

**Stack:** HTML + CSS + JavaScript vanilla · Google Fonts (Nunito Sans) + 2 font lokal · Gambar PNG/JPG/WebP · Musik MP3.

---

## 📁 STRUKTUR FOLDER

```
alvino-intan/
├── index.html          # semua section (11 halaman gulir)
├── style.css           # desain lengkap + responsif (mobile/tablet/desktop)
├── script.js           # interaksi + animasi
├── README.md
├── .git/
└── assets/
    ├── ayat/           flowers-top-ayat.png (garland maroon), photo-ayat-framed.webp, page4.webp*
    ├── bg/             bg-pattern.jpg (damask — dipakai semua halaman), a3.png*, divider-flourish.svg*
    ├── cover/          lampion-left.png, lampion-right.png, flowers-cover-bottom.png, powerclip.jpg*
    ├── fonts/          8273Windsong.woff2 (script), 2489calabassas-Regular.woff2 (serif),
    │                   9844Theater-Brillion.woff2*, 7190FLOWRISE.woff2*
    ├── flowers-fixed/  flowers-fixed-bottom.png (bunga tetap di bawah viewport)
    ├── gallery/        gallery-1..9.webp  (bingkai stamp)
    ├── gift/           bca-logo.png, gift-icon.png, aa342.png*
    ├── music/          song.mp3
    ├── profil/         groom-framed.webp, bride-framed.webp, orchid-top-left.png, orchid-bottom-right.png,
    │                   group-profil.webp*
    ├── resepsi/        photo-resepsi.jpg, flowers-top-resepsi.png (duplikat garland), event-v2*.webp*
    ├── rsvp/           photo-rsvp.jpg, a21.png*
    ├── save-date/      bitmap.webp (lace oval), sd-1..5.jpg, a11.png*, frame-lace-oval.png*
    └── thankyou/       photo-thankyou-framed.webp, corner-gold.png*
```

`*` = aset sisa dari versi sebelumnya, **tidak dipakai** (aman dihapus kalau mau; riwayatnya tetap ada di git).

---

## ⚙️ KONFIGURASI (`script.js` → `const CONFIG`)

| Kunci | Fungsi |
|---|---|
| `weddingDate` | Target countdown, default `2026-10-25T08:00:00+07:00` |
| `googleScriptURL` | URL Web App Google Sheet. **Kosong = mode demo** (RSVP & ucapan disimpan di `localStorage`) |
| `youtubeURL` | Link live streaming. Kosong → tombol menampilkan "LINK BELUM DIISI" |
| `demoWishes` | Ucapan contoh yang tampil di daftar |

### Link personalisasi nama tamu
```
https://undangan-kamu.netlify.app/?to=Bapak+Budi+Santoso
```
Masih kompatibel dengan `?name=` dan `?guest=`. Nama otomatis terisi di kartu cover dan form RSVP.
Membuka langsung ke section: `?to=Nama#rsvp`.

---

## 🔌 SETUP GOOGLE SHEET UNTUK RSVP & UCAPAN

1. Buat Google Sheet baru, header di baris 1:
   `timestamp | nama | kehadiran | jumlah | ucapan`
2. **Extensions → Apps Script**, tempel:

```javascript
const SHEET_ID = 'GANTI_DENGAN_ID_SHEET_KAMU';
const SHEET_NAME = 'Sheet1';

function doPost(e) {
  const data = JSON.parse(e.postData.contents);
  const sheet = SpreadsheetApp.openById(SHEET_ID).getSheetByName(SHEET_NAME);
  sheet.appendRow([
    data.timestamp || new Date(),
    data.nama || '',
    data.kehadiran || '',
    data.jumlah || '',
    data.ucapan || ''
  ]);
  return ContentService.createTextOutput(JSON.stringify({ok:true}))
    .setMimeType(ContentService.MimeType.JSON);
}

function doGet(e) {
  if (e.parameter.action === 'list') {
    const sheet = SpreadsheetApp.openById(SHEET_ID).getSheetByName(SHEET_NAME);
    const rows = sheet.getDataRange().getValues().slice(1);
    const wishes = rows
      .filter(r => r[4])
      .map(r => ({ nama: r[1], ucapan: r[4] }))
      .reverse();
    return ContentService.createTextOutput(JSON.stringify(wishes))
      .setMimeType(ContentService.MimeType.JSON);
  }
  return ContentService.createTextOutput('OK');
}
```

3. **Deploy → New deployment → Web app** (Execute as: *Me*, Access: *Anyone*), salin URL.
4. Tempel URL itu ke `CONFIG.googleScriptURL` di `script.js`.

---

## 🚀 CARA DEPLOY

- **Netlify Drop**: drag & drop folder ke [app.netlify.com/drop](https://app.netlify.com/drop).
- **Vercel / hosting sendiri**: upload seluruh isi folder.
- Kecualikan `.git/` bila memakai FTP (tidak ikut terpakai oleh browser).

---

## 🎨 DESIGN SYSTEM

| Token | Nilai |
|---|---|
| Latar | damask cream `#f1e8da` (`assets/bg/bg-pattern.jpg`) |
| Panel | `rgba(255,252,246,.74)` + radius 34px |
| Maroon (teks & tombol) | `#8f2b2b` / `#7a2222` |
| Kartu gift | `#f4ecd0` |
| Tombol cover | `#1a0708` |
| Font script | **Windsong** (`--f-script`) — nama cover, semua judul seksi |
| Font serif | **Calabassas** (`--f-serif`) — "THE WEDDING OF", nama mempelai, RSVP, countdown |
| Font body | **Nunito Sans** (Google Fonts) — paragraf, form, tombol |

---

## ✨ ANIMASI & EFEK

| Elemen | Efek |
|---|---|
| Lampion kiri & kanan | Turun dari atas saat halaman dibuka (delay 0.35s / 0.85s) |
| Bunga bawah cover | Fade in setelah lampion |
| Nama **Alvino & Intan** | Shimmer cahaya berjalan (gradient text, loop 5s) |
| Kartu tamu | Fade-up (delay 1.55s) |
| **OPEN INVITATION** | Confetti + kelopak jatuh, cover menutup, bunga/nav/tombol musik muncul, musik mulai |
| Semua elemen isi | Fade-up saat masuk viewport, **stagger** 90ms antar saudara |
| Countdown detik | Pop/beat tiap detik berubah |
| Foto save-the-date | Crossfade tiap 2.6 detik |
| Foto gallery | Naik + shadow saat hover |
| Kartu gift | Naik saat hover; tombol salin → "TERSALIN ✓" hijau |
| Bunga bawah (fixed) | Parallax halus mengikuti posisi scroll |
| Bottom nav | Muncul dari bawah, ikon **aktif** mengikuti section yang sedang dilihat |
| Lightbox | Klik foto → navigasi (panah kiri/kanan, Esc, usap kiri/kanan) |
| Tombol | Hover naik, active mengecil |
| `prefers-reduced-motion` | Semua animasi dimatikan |

---

## 📱 SECTION (urut guliran)

1. **Cover** — lampion, nama script, kartu tamu
2. **Ayat Suci** — foto + garland maroon, QS. Ar-Rum 21
3. **Mempelai** — bismillah, 2 foto lace oval berdampingan, nama & orang tua
4. **Save the Date** — lace oval + hitung mundur 4 kartu
5. **Akad Nikah & Resepsi** — 2 kartu berkarland + foto
6. **Live Streaming**
7. **RSVP** — foto, deskripsi, form (nama, kehadiran, jumlah, ucapan)
8. **Gallery** — 9 foto bingkai stamp, grid 3 kolom bertingkat + lightbox
9. **Kisah Cinta** — timeline 3 tahap
10. **Ucapan & Doa** — form + daftar ucapan
11. **Gift** — 2 rekening BCA + alamat kirim + catatan
12. **Thankyou** — foto lace oval + penutup

---

## 🖼 REGENERASI ASET

Ukurannya sudah dioptimalkan untuk tampilan 390px @3x (total folder ~19 MB, tidak termasuk `.git`).

| Aset | Ukuran sekarang | Format |
|---|---|---|
| `bg/bg-pattern.jpg` | 1500 × 2667 | JPG q84 |
| `gallery/gallery-*.webp` | 760 × 977 | WebP q85 + alpha |
| `profil/groom-framed.webp`, `bride-framed.webp` | 900 × 1080 | WebP q88 + alpha |
| `ayat/photo-ayat-framed.webp` | 1150 × 1789 | WebP q88 |
| `thankyou/photo-thankyou-framed.webp` | 940 × 1253 | WebP q88 + alpha |
| `save-date/sd-*.jpg` | 1000 × 1250 | JPG q84 |
| `cover/lampion-*.png` | 760 × 1368 | PNG |
| `flowers-fixed/flowers-fixed-bottom.png` | 1500 × 694 | PNG |

Rasio tampilan lain mengikuti CSS (`aspect-ratio` / `width: %`), jadi aman diganti selama rasio tetap.

> Bila menambah foto baru, cukup letakkan dengan nama yang sama di `assets/` lalu sesuaikan referensi di `index.html`.
