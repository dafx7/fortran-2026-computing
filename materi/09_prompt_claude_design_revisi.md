# Prompt Revisi Claude Design: Publikasi Ilmiah dan Foto Kegiatan

Dipakai **setelah** deck dari `03_prompt_claude_design.md` jadi. Salin blok di bawah garis ke Claude Design di proyek deck FORTRAN.

**Sebelum menempel prompt, unggah file foto berikut ke proyek deck FORTRAN.** Semuanya diambil dari proyek "Open Mind Computing Lab 2026". Prompt menyebut file dengan nama yang sama.

| File | Dipakai di |
|---|---|
| `assets/computing-logo.png` | Slide 1 dan 4 (logo lab) |
| `assets/aslab/advance-cp-dok.jpg` | Slide 4 |
| `assets/aslab/advance-aiml-dok.jpg` | Slide 4 |
| `assets/aslab/riset-dok.jpeg` | Slide 4 |
| `assets/aslab/icpc-dok.png` | Slide 4 |
| `assets/aslab/gemastik-dok.jpg` | Slide 4 |
| `assets/aslab/conference-dok.jpeg` | Slide 6 |
| `assets/photos/3_suasana_kontes_lab.jpg` | Slide 9 |
| `assets/photos/1_foto_bersama_peserta_panitia.jpg` | Slide 15 |

**Jangan diunggah atau dipakai:**
- `qr-pendaftaran.jpg`: rekrutmen tahun ini sudah ditutup, dan sesi FORTRAN tidak boleh menyebut pendaftaran.
- `qr-presensi.jpg`: QR presensi milik acara lain.
- Foto wajah per orang (folder `assets/aslab/` dengan nama orang). Kecuali jika ingin menampilkan tiga presenter ruangan di slide 1, dan ketiganya sudah setuju.

---

Revisi deck "Dua Cara Belajar" ini. Pertahankan gaya, warna (navy `#0A2540`, emas `#F7B125`), font, dan aksen Camelot yang sudah ada. **Jumlah slide tetap 16.** Jangan menambah slide baru. Ikuti aturan teks yang sama: Bahasa Indonesia, tanpa em dash atau en dash, tanpa menyebut pendaftaran atau rekrutmen, tanpa angka statistik lab (jumlah anggota, prestasi, dan sebagainya) yang tidak tertulis di bawah ini.

### 1. Slide 5 menjadi "Lab, DSIS, dan karier"
Gabungkan isi karier dari slide 6 lama ke slide 5.
- Judul: **Lab kami, DSIS, dan arah karier**
- Kiri: diagram dua lingkaran beririsan yang sudah ada (DSIS dan Computing Lab, irisan "Melatih model = mencari pengaturan terbaik").
- Kanan: tiga kartu peran yang ringkas, yaitu **Data Scientist** (menggali pola dari data), **Machine Learning Engineer** (membangun dan melatih model), dan **AI Engineer** (merancang sistem cerdas untuk masalah nyata).
- Catatan pembicara: "Ketiga peran ini butuh satu kemampuan yang sama: memahami bagaimana model menjadi lebih baik, yaitu optimasi."

### 2. Slide 6 menjadi "Publikasi Ilmiah Terpilih 2026"
Ganti seluruh isi slide 6.
- Judul: **Publikasi Ilmiah Terpilih 2026**
- Isi: daftar bernomor 1 sampai 5. Setiap butir berupa judul makalah (tebal, ukuran sedang) dan nama venue di bawahnya (warna emas, lebih kecil). Teks persis:
  1. **Gradient-Free Token Eviction for Edge-Deployable Video-LLMs in Ecological Monitoring**
     TENCON 2026
  2. **A Contrastive and Uncertainty-Aware Analytics Framework for Reliable Lung Disease Detection from Chest Imaging**
     Healthcare Analytics (Elsevier)
  3. **An Empirical Analysis of Skin-Tone Bias and the Limitations of Random Oversampling in Dermatology AI**
     ICoICT 2026
  4. **Syntactic Centrality in Classical Arabic: A Social Network Analysis of the Quranic Dependency Treebank**
     ICoDSA 2026
  5. **XHABC: Enhanced Hybrid Artificial Bee Colony Algorithm for Recommending the Personalized Multi-Day Mixed Destination Tour**
     Journal of Big Data (Springer Nature)
- Butir 5 diberi penanda kecil berwarna emas bertuliskan "dibahas lagi di slide 12", karena slide 12 menyinggung bee colony.
- Foto: `conference-dok.jpeg` sebagai foto vertikal di sisi kanan (sekitar 30% lebar slide), dengan sudut membulat dan bingkai tipis emas. Keterangan foto: "Dokumentasi konferensi Computing Laboratory".
- Judul makalah tetap dalam bahasa Inggris, persis seperti di atas. Jangan diterjemahkan atau dipendekkan.
- Pastikan kelima judul terbaca dari belakang kelas (minimal 20 pt). Jika tidak muat, kecilkan foto, jangan kecilkan teks.
- Catatan pembicara: "Ini lima publikasi lab tahun ini. Topiknya beragam, dari AI untuk kesehatan, AI yang adil untuk semua warna kulit, model video yang ringan untuk perangkat kecil, analisis jaringan pada teks, sampai algoritma bee colony untuk menyusun rencana wisata. Benang merahnya sama: mencari solusi terbaik secara cerdas. Yang nomor lima akan kita bahas lagi nanti."

### 3. Slide 4 "Computing Laboratory": tambahkan foto kegiatan
- Pertahankan teks yang ada di kiri (sekitar 55% lebar).
- Kanan: kolase rapi 2 x 2 dari `advance-cp-dok.jpg`, `advance-aiml-dok.jpg`, `riset-dok.jpeg`, dan `icpc-dok.png`. Boleh menambah `gemastik-dok.jpg` sebagai foto kelima yang lebih kecil jika rapi.
- Keterangan kecil di setiap foto (pakai keterangan yang sama dengan deck Open Mind jika ada; jika tidak, pakai ini): "Kelas competitive programming", "Kelas AI dan machine learning", "Riset", "ICPC", "Gemastik".
- Logo `computing-logo.png` kecil di pojok kiri atas judul.
- Jangan menambah angka atau klaim prestasi apa pun.

### 4. Slide 9 "Coba semua kemungkinan?": foto suasana kontes
- Tambahkan `3_suasana_kontes_lab.jpg` di sisi kanan sebagai ilustrasi competitive programming, dengan keterangan "Suasana kontes di Computing Laboratory".
- Grid kotak yang mengembang tetap ada, diperkecil seperlunya.

### 5. Slide 15 "Yang kita bawa pulang": foto bersama sebagai latar
- Pakai `1_foto_bersama_peserta_panitia.jpg` sebagai latar penuh dengan lapisan navy 80% supaya teks tetap terbaca.
- Teks, kotak kanal resmi (Instagram @computing.lab · computinglab.tech), dan penutup "Stand as One. Rise as Knights." tetap sama.

### 6. Slide 1 (opsional)
- Logo `computing-logo.png` di samping judul.
- Jika diminta, tiga foto kecil berbingkai lingkaran untuk presenter ruangan, dengan nama di bawahnya. Biarkan kosong jika foto dan nama belum diberikan.

### Hal yang tidak boleh berubah
- Slide 7 dan 13 tetap memakai QR alat `qr.png` (menuju `prediktor-computinglab.netlify.app`), bukan QR lain.
- Slide 12 tetap memuat kalimat kejujuran tentang metaheuristik.
- Slide 16 (kegiatan tanpa perangkat) tetap ada.
