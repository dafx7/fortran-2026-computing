# Prompt untuk Claude Design: Slide "Dua Cara Belajar"

Salin seluruh blok di bawah garis ke Claude Design. Lampirkan juga gambar dari `materi/screenshots/` dan `materi/qr.png` yang disebut di tiap slide.

Sebelum dipakai di kelas, ganti semua `[KONFIRMASI: ...]` dengan informasi yang sudah dipastikan, atau hapus barisnya.

---

Buatkan slide deck presentasi 16:9 berisi **16 slide** (tidak lebih) untuk sesi trial class 90 menit milik Computing Laboratory, Fakultas Informatika, Telkom University, di acara kaderisasi FORTRAN 2026 (Day 2, "The Forge of Excalibur", tema "Crown of Iron: The Oath of Camelot", jargon "Stand as One. Rise as Knights."). Pesertanya mahasiswa S1 Informatika angkatan 2025 yang baru menyelesaikan pemrograman tahun pertama. Mereka belum belajar statistik, kalkulus, atau machine learning.

**Gaya visual**
- Warna utama navy `#0A2540`, aksen emas `#F7B125`, latar putih atau navy. Teks utama putih di atas navy, navy di atas putih.
- Aksen Camelot dan "Forge of Excalibur" yang halus: garis tipis berbentuk pedang atau percikan api tempaan di sudut, ornamen perisai sederhana, pola batu kastel yang samar. Jangan meniru atau memakai logo apa pun (logo FORTRAN, HIMAIF, Telkom University, atau logo lab). Sisakan area kosong kecil di pojok kanan atas untuk logo resmi yang akan ditempel panitia `[KONFIRMASI: logo yang boleh dipakai]`.
- Font sans-serif yang bersih dan mudah dibaca dari belakang kelas. Ukuran teks isi minimal 24 pt, judul minimal 36 pt. Maksimal 6 baris teks per slide.
- Bahasa Indonesia yang ramah dan cukup formal. Jangan memakai tanda em dash atau en dash. Hindari pola kalimat yang menyangkal satu hal lalu menggantinya dengan hal lain dalam satu kalimat.
- Tidak ada konten tentang AI Agent, LLM, atau chatbot selain menyebut judul publikasi lab di slide 6 apa adanya.
- Jangan menulis apa pun tentang pendaftaran atau rekrutmen anggota lab.

**Struktur, teks persis, catatan pembicara, dan gambar per slide**

### Slide 1. Judul (menit 0 sampai 1)
- Judul: **Dua Cara Belajar**
- Subjudul: Bagaimana mesin belajar? Kita coba sendiri.
- Baris bawah: Computing Laboratory · FORTRAN 2026 · The Forge of Excalibur
- Baris kecil: Stand as One. Rise as Knights.
- Gambar: tidak ada. Ilustrasi pedang tipis berwarna emas yang membentuk garis lurus naik di antara titik-titik putih (metafora garis prediksi).
- Catatan pembicara: Salam pembuka, perkenalan tiga anggota tim [KONFIRMASI: nama lead, fasilitator lantai, timekeeper], sebut nama kelas (nama ksatria).

### Slide 2. Bagaimana mesin belajar? (menit 1 sampai 3)
- Judul: **Kalau 7 km, berapa menit?**
- Isi: tabel kecil "2 km: 9 menit · 5 km: 17 menit · 10 km: 31 menit", lalu "7 km: ?" dengan tanda tanya besar berwarna emas.
- Baris bawah: Otak kita menebak dari pola. Bagaimana komputer melakukannya?
- Gambar: grafik titik sederhana (gambar ulang, tidak perlu screenshot).
- Catatan pembicara: Minta peserta menebak dalam hati, lalu angkat tangan bagi yang menebak 20 sampai 25 menit. Jawaban model nanti sekitar 23 menit.

### Slide 3. Alur 90 menit dan aturan (menit 3 sampai 5)
- Judul: **Alur kita hari ini**
- Isi (garis waktu horizontal): Pembukaan 5' · Lab dan karier 10' · Materi 25' · Praktik 30' · Hasil dan penutup 20'
- Kotak aturan: Saling menghargai · Boleh bertanya kapan saja · Tidak ada yang dipaksa presentasi · Tidak perlu menulis kode
- Catatan pembicara: Tekankan bahwa semua berjalan di browser dan presentasi bersifat sukarela.

### Slide 4. Computing Laboratory (menit 5 sampai 8)
- Judul: **Computing Laboratory**
- Isi:
  - Fakultas Informatika, Telkom University
  - Fokus: Computational Intelligence dan optimasi
  - Pondasi: competitive programming untuk cara berpikir algoritmik
  - Metaheuristik: algoritma genetika, PSO, ant colony, simulated annealing, Komodo Mlipir Algorithm (dikembangkan di Telkom University)
  - Peran di fakultas: [KONFIRMASI: peran spesifik lab di fakultas]
  - Aktivitas: [KONFIRMASI: aktivitas rutin lab]
- Catatan pembicara: Belajar dipandang sebagai optimasi. Lab mendalami machine learning yang berpijak pada optimasi supaya tidak berhenti pada memanggil library.

### Slide 5. Lab dan DSIS (menit 8 sampai 11)
- Judul: **Lab kami dan KK DSIS**
- Isi: diagram dua lingkaran beririsan. Kiri "DSIS: Data Science and AI, mengolah data menjadi prediksi dan keputusan". Kanan "Computing Lab: Computational Intelligence dan optimasi". Irisan: "Melatih model = mencari pengaturan terbaik".
- Baris bawah: Teknologi: [KONFIRMASI: tumpukan teknologi lab]
- Catatan pembicara: Hampir setiap model machine learning dilatih dengan optimasi. Di situlah lab kami bekerja.

### Slide 6. Karier dan riset lab 2026 (menit 11 sampai 15)
- Judul: **Ke mana arahnya?**
- Kolom kiri, tiga kartu peran: Data Scientist (menggali pola dari data) · Machine Learning Engineer (membangun dan melatih model) · AI Engineer (merancang sistem cerdas untuk masalah nyata)
- Kolom kanan, "Topik publikasi lab 2026": bias warna kulit pada AI dermatologi · small language model 4-bit dengan prompting CoT dan PoT · video-LLM untuk perangkat edge · hybrid bee colony untuk rekomendasi perjalanan
- Catatan pembicara: Ketiga peran butuh pemahaman optimasi. Topik bee colony akan dibahas lagi di slide 12.

### Slide 7. Bentuk kelompok (menit 15 sampai 18)
- Judul: **Bentuk kelompok, maksimal 5 orang**
- Isi: 1. Ikuti hitungan kakak fasilitator berdasarkan tempat duduk. 2. Minimal satu laptop per kelompok. 3. Buka alat lewat QR atau tautan di papan tulis.
- Gambar: `materi/qr.png` berukuran besar di kanan, dengan tautan pendek di bawahnya [KONFIRMASI: tautan pendek setelah deploy].
- Catatan pembicara: Jumlah kelompok = jumlah peserta dibagi 5, dibulatkan ke atas. Teman yang hanya membawa HP bergabung ke laptop teman sekelompok.

### Slide 8. Belajar = mencari error terkecil (menit 18 sampai 21)
- Judul: **Belajar = mencari error terkecil**
- Isi: Model: y = w·x + b · w = kemiringan, b = titik potong · Error = rata-rata kuadrat selisih tebakan dan data · Tujuan: cari w dan b dengan error paling kecil
- Gambar: `materi/screenshots/01_alat_awal.png` (potong bagian grafik data dan Lanskap Error).
- Catatan pembicara: Jelaskan Lanskap Error. Terang = error kecil, gelap = error besar. Kita ingin turun ke lembah yang terang.

### Slide 9. Coba semua? Brute force (menit 21 sampai 24)
- Judul: **Coba semua kemungkinan?**
- Isi: 100 nilai w × 100 nilai b = 10.000 kali hitung error · Model sungguhan punya jutaan angka pengatur · Brute force terlalu lambat, kita perlu mencari dengan cerdas
- Gambar: grid kotak kecil yang mengembang (gambar ulang).
- Catatan pembicara: Kaitkan dengan kebiasaan di praktikum Go dan competitive programming: perulangan yang mencoba semua lalu menyimpan yang terbaik.

### Slide 10. Cara 1: Gradient Descent (menit 24 sampai 28)
- Judul: **Cara 1: Gradient Descent**
- Isi: Rasakan kemiringan, melangkah ke arah menurun, ulangi · Learning rate = ukuran langkah · Cepat, tapi sensitif terhadap learning rate
- Gambar: tiga panel kecil berdampingan dari `materi/screenshots/02_gd_terlalu_kecil.png`, `03_gd_pas.png`, `04_gd_terlalu_besar.png` (potong bagian Lanskap Error), berlabel "Terlalu kecil", "Pas", "Terlalu besar".
- Catatan pembicara: Demo langsung di alat (lihat `04_naskah_demo.md`, Demo A). Slide ini cadangan jika demo gagal.

### Slide 11. Cara 2: Algoritma Genetika (menit 28 sampai 32)
- Judul: **Cara 2: Algoritma Genetika**
- Isi: Populasi tebakan acak · Seleksi: yang lebih baik lebih sering jadi induk · Crossover: campur dua induk · Mutasi: geser sedikit secara acak · Elitisme: simpan yang terbaik · Tidak butuh kemiringan
- Gambar: tiga panel dari `05_ga_generasi_1.png`, `06_ga_generasi_6.png`, `07_ga_generasi_30.png` (potong Lanskap Error) berlabel "Generasi 1", "Generasi 6", "Generasi 30". Gambar kecil `08_pseudocode.png` di pojok.
- Catatan pembicara: Demo langsung (Demo B). Tunjukkan tab Pseudocode sebentar.

### Slide 12. Jujur soal metaheuristik (menit 32 sampai 37)
- Judul: **Tidak ada jaminan, maka kita uji berkali-kali**
- Isi: GA memakai angka acak, hasilnya bisa sedikit berbeda · Jalankan 5 kali, laporkan terbaik, terburuk, rata-rata · Banyak masalah nyata tidak punya kemiringan, misalnya menyusun rute wisata · Di sanalah metaheuristik dipakai, seperti hybrid bee colony di riset lab
- Gambar: `materi/screenshots/09_ga_jalankan_5_kali.png` (potong tabel 5 kali jalan).
- Kotak sorotan emas: "Metaheuristik tidak menjamin jawaban terbaik. Ia memberi jawaban yang cukup baik dalam waktu yang wajar."
- Catatan pembicara: Kalimat kejujuran wajib diucapkan. Bintang di peta adalah jawaban terbaik yang bisa dihitung dengan rumus karena modelnya kecil.

### Slide 13. Mini project: Prediktor (menit 37 sampai 70, tetap tampil selama praktik)
- Judul: **Mini project: Prediktor**
- Kiri: **Misi 1 (8')** Skenario jarak · GD dengan 3 learning rate · Jalankan GA. **Misi 2 (13')** Pilih atau buat skenario · 6 sampai 10 data fiktif · GD dan GA 5 kali · Prediksi 2 sampai 3 nilai · Isi Kartu Hasil.
- Kanan: `materi/qr.png` besar dan tautan pendek [KONFIRMASI: tautan pendek setelah deploy].
- Baris bawah: Data fiktif dan netral, tanpa data pribadi. Macet? Klik "Pakai preset".
- Gambar kecil: `materi/screenshots/12_tampilan_hp.png`.
- Catatan pembicara: Fasilitator berkeliling. Timekeeper mengumumkan pergantian misi di menit 50 dan 63.

### Slide 14. Berbagi hasil dan refleksi (menit 70 sampai 83)
- Judul: **Berbagi hasil**
- Isi: 2 sampai 3 kelompok, masing-masing 3 menit · Skenario apa? · Mana yang lebih dekat ke jawaban terbaik, GD atau GA? · Satu prediksi kalian
- Bagian refleksi: "Angkat tangan: GD lebih dekat? GA lebih dekat? Selisih terburuk GA berapa persen?"
- Gambar: `materi/screenshots/11_kartu_hasil_mode_presentasi.png` sebagai contoh Kartu Hasil.
- Catatan pembicara: Relawan dulu. Jika belum ada, undang kelompok yang sudah bersedia saat praktik. Selalu beri pilihan untuk menolak. Tidak ada penunjukan acak.

### Slide 15. Rangkuman dan kanal resmi (menit 83 sampai 90)
- Judul: **Yang kita bawa pulang**
- Isi: 1. Belajar adalah optimasi: mencari error terkecil. 2. Gradient Descent cepat, perlu learning rate yang tepat. Algoritma Genetika tanpa kemiringan, perlu dicek beberapa kali. 3. Masalah nyata sering tanpa kemiringan, dan di sanalah riset metaheuristik bergerak.
- Kotak kanal resmi: Instagram @computing.lab · computinglab.tech
- Penutup besar: **Stand as One. Rise as Knights.** Terima kasih!
- Catatan pembicara: Pertanyaan lanjutan diarahkan ke presenter setelah sesi atau ke kanal resmi. Jangan menyebut pendaftaran.

### Slide 16. Cadangan: kegiatan tanpa perangkat (dipakai hanya jika perangkat tidak bisa dipakai)
- Judul: **GA Manusia**
- Isi:
  - Data: x (km) 1, 2, 4, 6, 8 · y (menit) 6, 9, 15, 19, 26
  - 1. Tiap kelompok mengusulkan (w, b) dan menghitung error dengan tangan.
  - 2. Seleksi: ambil dua usulan terbaik. Crossover: rata-ratakan keduanya.
  - 3. Mutasi: geser sedikit, misalnya w ± 0,25 dan b ± 1.
  - 4. Ulangi 2 sampai 3 generasi. Apakah error terkecil makin turun?
- Catatan pembicara: Kunci jawaban: garis terbaik sekitar w = 2,8 dan b = 3,3 dengan error sekitar 0,3. Contoh: (w, b) = (3, 2) memberi error 0,8.

**Output yang diminta:** deck 16 slide dengan catatan pembicara di setiap slide, siap diekspor ke PDF dan PPTX. Pastikan QR di slide 7 dan 13 berukuran minimal sepertiga tinggi slide agar mudah dipindai dari belakang kelas.
