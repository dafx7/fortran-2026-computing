# Prediktor: Dua Cara Belajar

Materi dan alat praktik **Computing Laboratory** untuk sesi trial class FORTRAN 2026, Day 2 "The Forge of Excalibur", Minggu 18 Oktober 2026 (Kelompok Keahlian DSIS).

**Prediktor** adalah alat di browser untuk melatih model garis lurus `y = w·x + b` dengan dua cara: **Gradient Descent** dan **Algoritma Genetika**. Peserta membandingkan keduanya, lalu memakai model hasil latihan untuk menebak nilai baru. Pesan intinya: belajar adalah optimasi.

- Tanpa server, tanpa akun, tanpa API key, tanpa dependensi runtime, tanpa CDN atau web font.
- Tetap jalan tanpa internet setelah dibuka sekali (service worker), dan bisa dibuka langsung dari flashdisk (`file://`).
- Dwibahasa: Bahasa Indonesia sebagai bawaan, dengan tombol **EN** di kanan atas untuk bahasa Inggris. Tautan dengan `?lang=en` (contoh `https://alamat-alat/?lang=en`) langsung membuka versi Inggris. Pilihan bahasa diingat di browser.
- Tidak mengumpulkan data apa pun. Draf isian hanya disimpan di `localStorage` browser peserta sendiri.

## Isi repositori

```
site/        alat yang di-deploy (index.html, style.css, core.js, i18n.js, app.js, sw.js, manifest, ikon, qr.svg)
materi/      naskah fasilitator, handout, prompt slide, naskah demo, rubrik, kartu kontingensi, checklist, requirement panitia
materi/screenshots/  tangkapan layar demo sebagai cadangan
tests/       unit test (node:test) dan e2e (Playwright)
scripts/     server statis, pembuat QR, lint teks, pengambil screenshot, cek ukuran
```

## Menjalankan secara lokal

Cara paling sederhana: buka `site/index.html` langsung di browser (klik dua kali).

Atau sajikan lewat server lokal:

```bash
npx serve site            # memakai paket serve (perlu internet saat pertama kali)
node scripts/serve.mjs    # tanpa dependensi apa pun, cukup Node.js 18 ke atas
```

## Versi yang dipakai (dikunci persis)

| Alat | Versi |
|---|---|
| Node.js (yang dipakai saat pengujian) | 22.22.0 |
| @playwright/test (dev) | 1.56.1 |
| qrcode (dev) | 1.5.4 |
| actions/checkout | v4.2.2 |
| actions/configure-pages | v5.0.0 |
| actions/upload-pages-artifact | v3.0.1 |
| actions/deploy-pages | v4.0.5 |

Runtime alat tidak punya dependensi sama sekali.

```bash
npm ci                    # pasang dev dependencies sesuai package-lock.json
npm run test:unit         # unit test
npm run lint:text         # lint teks Bahasa Indonesia
npm run test:e2e          # e2e Playwright (memakai Chromium yang sudah terpasang)
npm run size              # cek ukuran situs (< 200 KB tanpa QR)
npm run screenshots       # ambil ulang screenshot demo ke materi/screenshots/
```

## Deploy

### (a) Netlify Drop (default)

1. Buka https://app.netlify.com/drop (bisa tanpa akun; tanpa akun situs akan kedaluwarsa, jadi sebaiknya masuk dengan akun lab).
2. Seret folder **`site`** (foldernya, tidak perlu di-zip) ke halaman itu.
3. Tunggu sampai muncul alamat seperti `https://nama-acak-123.netlify.app`.
4. Buka **Site configuration** lalu **Change site name**, ganti menjadi nama yang mudah, misalnya `prediktor-computinglab`. Alamat menjadi `https://prediktor-computinglab.netlify.app`.
5. Buka alamat itu di laptop dan HP untuk memastikan alat tampil.

Untuk memperbarui: buka situsnya di Netlify, tab **Deploys**, lalu seret folder `site` lagi ke kotak unggah.

### (b) GitHub Pages lewat Actions

Workflow sudah tersedia di `.github/workflows/pages.yml`.

1. Di GitHub, buka **Settings** lalu **Pages**. Pada **Source**, pilih **GitHub Actions**.
2. Gabungkan perubahan ke branch `main` (atau jalankan workflow secara manual dari tab **Actions**, pilih "Deploy ke GitHub Pages", lalu **Run workflow**).
3. Setelah selesai, alamatnya tampil di ringkasan workflow, biasanya `https://<pemilik>.github.io/fortran-2026-computing/`.

## Memperbarui QR setelah deploy

Alat sudah aktif di **https://prediktor-computinglab.netlify.app/** (versi Inggris: `https://prediktor-computinglab.netlify.app/?lang=en`), dan QR sudah menuju alamat itu. Jika alamat berubah:

```bash
node scripts/make-qr.mjs https://alamat-baru.netlify.app/
```

Perintah ini menulis ulang `site/qr.svg` (tampil di tab Panduan) dan `materi/qr.png` (untuk slide). Setelah itu:

1. Naikkan versi cache di `site/sw.js` (misalnya `prediktor-v1` menjadi `prediktor-v2`) supaya perangkat yang sudah pernah membuka alat mendapat QR baru.
2. Deploy ulang folder `site`.
3. Ganti gambar QR di slide dengan `materi/qr.png` dan pindai sekali dengan HP untuk memastikan alamatnya benar.

## Cadangan jika ada masalah

- **Tanpa internet:** setiap perangkat yang sudah membuka alat sekali (misalnya saat panitia membagikan tautan sebelum sesi) tetap bisa memakainya tanpa internet.
- **Flashdisk (USB):** salin folder `site` ke flashdisk. Di laptop peserta, salin folder itu lalu buka `index.html`. Semua fitur jalan; hanya mode luring (service worker) yang dilewati di `file://`.
- **Hotspot laptop fasilitator:** nyalakan hotspot di laptop fasilitator, lalu jalankan
  ```bash
  node scripts/serve.mjs site 8080
  ```
  Perintah ini mencetak alamat seperti `http://192.168.137.1:8080/`. Peserta menyambung ke hotspot itu dan membuka alamat tersebut. `npx serve site -l 8080` juga bisa dipakai jika paket `serve` sudah terpasang. Jika firewall Windows bertanya, izinkan akses jaringan privat.
- **Tanpa perangkat sama sekali:** lihat kegiatan unplugged di `materi/06_kartu_kontingensi.md`.

## Privasi

Alat ini tidak mengumpulkan data apa pun: tanpa analytics, tanpa formulir, tanpa cookie, tanpa akun, dan tanpa permintaan jaringan saat dipakai. Isian (data, nomor kelompok, kesimpulan) hanya tersimpan di browser perangkat itu sendiri dan bisa dihapus dengan tombol **Reset**.

## Kanal resmi

Instagram [@computing.lab](https://www.instagram.com/computing.lab/) · [computinglab.tech](https://computinglab.tech)
