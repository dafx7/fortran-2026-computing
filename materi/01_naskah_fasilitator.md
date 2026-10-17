# Naskah Fasilitator: "Dua Cara Belajar"

Computing Laboratory, FORTRAN 2026, Day 2 "The Forge of Excalibur"
Minggu, 18 Oktober 2026. Satu naskah yang sama untuk keenam sesi.

> Jargon acara: **"Stand as One. Rise as Knights."**
> Pesan inti sesi: **mesin belajar dengan mencari model yang error-nya paling kecil. Belajar adalah optimasi.**

## Ringkasan peran

| Peran | Tugas utama sepanjang sesi |
|---|---|
| **Lead presenter** (orang yang sama sepanjang hari di satu tim) | Membawakan materi, menjalankan demo di laptop presenter, memandu presentasi dan refleksi. |
| **Fasilitator lantai** | Berkeliling, membantu pembentukan kelompok, memastikan tiap kelompok punya satu laptop yang bisa membuka alat, membantu kelompok yang macet, mencari kelompok untuk presentasi. |
| **Timekeeper dan pencatat** | Memegang jam, memberi kode waktu ke lead, mengisi lembar catatan positif (file `05_rubrik_dan_lembar_catatan.md`), memegang kartu kontingensi. |

**Kode waktu dari timekeeper ke lead** (disepakati saat dry run):
- Angkat 2 jari: sisa 2 menit di blok ini.
- Kepalan tangan: blok harus selesai sekarang, lanjut ke blok berikutnya.
- Telapak terbuka menghadap bawah: pelankan, kita lebih cepat dari jadwal.

**Batas keras: menit ke-90.** Kelas berikutnya dan perpindahan ruangan bergantung pada ketepatan waktu kita.

## Jadwal ruangan

| Ronde | Waktu (WIB) | Computing A (Tim A) | Computing B (Tim B) |
|---|---|---|---|
| 1 | 08:20 sampai 09:50 | KU1.03.07 (Lamorak) | KU1.03.06 (Pellinore) |
| 2 | 10:05 sampai 11:35 | KU1.02.15 (Galahad) | KU1.02.16 (Gawain) |
| 3 | 13:05 sampai 14:35 | KU1.03.12 (Kay) | KU1.03.13 (Gareth) |

Perpindahan ronde 1 ke ronde 2 hanya 15 menit (lantai 3 ke lantai 2). Laptop presenter tetap menyala, cukup ditutup. ISHOMA 11:35 sampai 13:05.

## Persiapan sebelum masuk kelas (10 menit sebelum ronde)

- Laptop presenter: alat sudah terbuka di browser (tab **Praktik**, skenario "Jarak dan waktu tempuh"), slide terbuka di slide 1, mode layar penuh siap.
- Uji HDMI ke proyektor. Bawa adaptor HDMI dan USB-C.
- Tulis di papan tulis: tautan pendek alat `[KONFIRMASI: tautan pendek setelah deploy]` dan "Ruang Computing A/B, Ronde 1/2/3".
- Flashdisk berisi folder `site/` di saku fasilitator lantai.
- Timekeeper membuka lembar catatan dan menulis ruang, ronde, dan nama kelas (nama ksatria).
- Spidol papan tulis minimal 2 warna untuk refleksi dan kegiatan cadangan.

---

## Blok 1. Opening dan pengenalan konsep (menit 0 sampai 5)

### Menit 0-1: Salam dan perkenalan tim
- **Lead berkata:**
  - "Assalamualaikum, selamat pagi/siang semuanya. Salam sejahtera untuk kita semua."
  - "Kami dari Computing Laboratory, Fakultas Informatika. Saya [KONFIRMASI: nama lead], bersama [KONFIRMASI: nama fasilitator lantai] dan [KONFIRMASI: nama timekeeper]."
  - "Selamat datang di kelas [nama kelas, misalnya Lamorak]. Hari ini kita di The Forge of Excalibur, tempat para calon ksatria ditempa."
- **Layar:** Slide 1 (judul "Dua Cara Belajar").
- **Fasilitator lantai:** Berdiri di belakang kelas, melihat apakah semua peserta bisa membaca layar.
- **Timekeeper:** Mulai stopwatch tepat saat salam. Catat jam mulai.
- **Jika waktu mepet, potong ini:** Perkenalan cukup satu kalimat: "Kami bertiga dari Computing Laboratory."

### Menit 1-3: Hook "Bagaimana mesin belajar?"
- **Lead berkata:**
  - "Coba bayangkan. Kalian punya catatan perjalanan: 2 km butuh 9 menit, 5 km butuh 17 menit, 10 km butuh 31 menit."
  - "Kalau besok perjalanannya 7 km, kira-kira berapa menit? Silakan tebak dalam hati."
  - "Siapa yang tebakannya sekitar 20 sampai 25 menit? Angkat tangan." (tunggu sebentar)
  - "Nah, otak kita baru saja melakukan sesuatu: mencari pola dari data, lalu memakainya untuk menebak. Pertanyaannya, bagaimana komputer melakukan hal yang sama? Hari ini kita akan melihatnya sendiri, dan kalian akan membuat alat prediksi sederhana."
- **Layar:** Slide 2 (titik data jarak dan waktu, tanda tanya di 7 km).
- **Fasilitator lantai:** Ikut mengangkat tangan untuk memancing partisipasi.
- **Timekeeper:** Kode 2 jari pada menit 2:30 jika lead masih bercerita.
- **Jika waktu mepet, potong ini:** Lewati angkat tangan. Langsung sebutkan "jawabannya sekitar 23 menit, dan hari ini kita lihat bagaimana komputer menemukannya."

### Menit 3-4: Alur 90 menit dan aturan
- **Lead berkata:**
  - "Alurnya begini: sedikit perkenalan lab dan karier, materi singkat, lalu 30 menit praktik dalam kelompok, dan ditutup dengan beberapa kelompok berbagi hasil."
  - "Tidak ada yang perlu menulis kode hari ini. Semua berjalan di browser."
  - "Aturannya sederhana: saling menghargai, boleh bertanya kapan saja, dan tidak ada kelompok yang dipaksa presentasi. Yang mau berbagi, kami persilakan."
- **Layar:** Slide 3 (alur 90 menit dan aturan).
- **Fasilitator lantai:** Mengamati apakah ada peserta yang belum punya tempat duduk.
- **Timekeeper:** Siap memberi kode kepalan pada menit 4:00.
- **Jika waktu mepet, potong ini:** Baca aturan saja, alur cukup ditunjuk di slide.

### Menit 4-5: Buffer
- Dipakai jika ada keterlambatan masuk kelas atau proyektor. Jika tidak terpakai, lanjut lebih awal ke Blok 2.

---

## Blok 2. Pengenalan Kelompok Keahlian dan karier (menit 5 sampai 15)

### Menit 5-8: Identitas lab, fokus, aktivitas, peran di fakultas
- **Lead berkata:**
  - "Computing Laboratory adalah laboratorium di Fakultas Informatika Telkom University."
  - "Fokus kami adalah Computational Intelligence dan optimasi. Pondasinya adalah competitive programming, karena di sana kita melatih cara berpikir algoritmik."
  - "Di lab, kami memandang belajar sebagai optimasi. Kami mempelajari metaheuristik seperti algoritma genetika, particle swarm optimization, ant colony optimization, simulated annealing, dan Komodo Mlipir Algorithm yang dikembangkan di Telkom University."
  - "Kami juga mendalami machine learning yang berpijak pada optimasi. Tujuannya supaya kita paham apa yang terjadi di dalam, tidak berhenti pada memanggil library."
  - "Peran lab di fakultas: [KONFIRMASI: peran spesifik lab di fakultas, misalnya mendukung praktikum mata kuliah tertentu atau riset dosen]."
  - "Aktivitas rutin kami: [KONFIRMASI: aktivitas rutin lab, misalnya kajian, pelatihan, atau pendampingan lomba]."
- **Layar:** Slide 4 (Computing Laboratory).
- **Fasilitator lantai:** Bersiap menghitung jumlah peserta untuk pembentukan kelompok (lihat menit 15).
- **Timekeeper:** Hitung jumlah peserta yang hadir secara diam-diam dan tulis di lembar catatan. Sampaikan angkanya ke fasilitator lantai.
- **Jika waktu mepet, potong ini:** Lewati daftar lima metaheuristik, sebut "algoritma genetika dan kawan-kawannya".

### Menit 8-11: Ruang lingkup DSIS dan keterkaitan lab
- **Lead berkata:**
  - "Kita hari ini hadir untuk Kelompok Keahlian DSIS, Data Science and AI."
  - "Secara sederhana, DSIS membahas cara mengolah data menjadi pengetahuan, lalu membangun sistem yang bisa memprediksi atau mengambil keputusan dari data itu."
  - "Hubungannya dengan lab kami ada di jantung prosesnya. Hampir setiap model machine learning dilatih dengan cara mencari pengaturan terbaik. Itu masalah optimasi. Computing Laboratory fokus pada bagian itu: Computational Intelligence dan optimasi, termasuk machine learning yang berpijak pada optimasi."
  - "Teknologi yang dipakai di lab: [KONFIRMASI: tumpukan teknologi lab, misalnya bahasa pemrograman dan pustaka yang dipakai]."
- **Layar:** Slide 5 (Lab dan DSIS).
- **Fasilitator lantai:** Mulai memetakan baris tempat duduk untuk menghitung kelompok.
- **Timekeeper:** Kode 2 jari di menit 10.
- **Jika waktu mepet, potong ini:** Bagian teknologi dilewati.

### Menit 11-14: Karier dan contoh publikasi lab 2026
- **Lead berkata:**
  - "Tiga peran yang dekat dengan DSIS: Data Scientist, Machine Learning Engineer, dan AI Engineer."
  - "Data Scientist menggali pola dari data dan menjelaskannya untuk pengambilan keputusan. Machine Learning Engineer membangun dan melatih model supaya bisa dipakai dengan andal. AI Engineer merancang sistem cerdas yang memakai model itu untuk menyelesaikan masalah nyata."
  - "Ketiganya butuh satu kemampuan yang sama: memahami bagaimana model menjadi lebih baik, yaitu optimasi."
  - "Beberapa topik riset yang dipublikasikan lab tahun 2026: bias warna kulit pada AI dermatologi, small language model terkuantisasi 4-bit dengan teknik prompting CoT dan PoT, video-LLM yang bisa berjalan di perangkat edge, dan algoritma hybrid bee colony untuk rekomendasi rencana perjalanan."
  - "Yang terakhir nanti akan kita singgung lagi, karena itu contoh masalah yang tidak bisa diselesaikan dengan cara biasa."
- **Layar:** Slide 6 (Karier dan riset lab 2026).
- **Fasilitator lantai:** Siap di depan barisan pertama untuk memulai hitungan kelompok.
- **Timekeeper:** Kode kepalan di menit 14:00.
- **Jika waktu mepet, potong ini:** Sebut tiga peran tanpa penjelasan masing-masing. Sebut dua topik riset saja (bias AI dermatologi dan bee colony).

> Catatan: jangan menyebut pendaftaran atau rekrutmen anggota lab. Jika ditanya, jawab: "Informasi resmi selalu ada di Instagram @computing.lab dan computinglab.tech."

### Menit 14-15: Buffer

---

## Blok 3. Pemaparan materi (menit 15 sampai 40)

### Menit 15-18: Bentuk kelompok, maksimal 5 orang
- **Cara membentuk kelompok: hitung urut tempat duduk.** Kelompok terbentuk dari peserta yang duduk berdekatan, sehingga tidak perlu banyak berpindah.
  1. Timekeeper sudah memberi jumlah peserta (N). Tentukan jumlah kelompok dengan tabel di bawah.
  2. Fasilitator lantai mulai dari pojok depan kiri, menunjuk peserta berurutan mengikuti baris (zig-zag antarbaris), dan menyebut nomor kelompok untuk tiap blok peserta yang duduk berdekatan.
  3. Lead menulis nomor kelompok di papan tulis dan meminta tiap kelompok menulis nomornya di kertas yang diletakkan di meja.
  4. Fasilitator lantai bertanya ke setiap kelompok: "Ada minimal satu laptop yang menyala?" Jika ada kelompok tanpa laptop, tukar satu anggota dengan kelompok tetangga yang punya dua laptop. Ukuran kelompok tetap maksimal 5.
  5. Anggota yang hanya membawa HP bergabung ke laptop teman sekelompok. HP tetap bisa membuka alat untuk mengikuti.

  | Jumlah peserta (N) | Jumlah kelompok | Ukuran |
  |---|---|---|
  | 25 sampai 30 | 6 | 4 atau 5 orang |
  | 31 sampai 35 | 7 | 4 atau 5 orang |
  | 36 sampai 40 | 8 | 4 atau 5 orang |
  | 41 sampai 45 | 9 | 4 atau 5 orang |

  Rumus umum: jumlah kelompok = N dibagi 5, dibulatkan ke atas. Sisa peserta disebar supaya ukuran kelompok hanya berbeda paling banyak satu orang.
- **Lead berkata:**
  - "Sekarang kita bentuk kelompok, maksimal lima orang. Supaya cepat, kita hitung berdasarkan tempat duduk. Kakak fasilitator akan menunjuk, cukup ingat nomor kelompok kalian."
  - "Pastikan setiap kelompok punya minimal satu laptop. Buka tautan di papan tulis atau pindai QR di layar."
- **Layar:** Slide 7 (Bentuk kelompok, dengan QR alat).
- **Fasilitator lantai:** Menjalankan hitungan. Memeriksa laptop per kelompok.
- **Timekeeper:** Mencatat jumlah kelompok di lembar catatan. Kode kepalan di menit 18:00, walaupun beberapa kelompok belum membuka alat (mereka masih punya waktu sampai menit 40).
- **Jika waktu mepet, potong ini:** Lewati penulisan nomor di kertas. Cukup nomor di papan tulis.

### Menit 18-21: Belajar = mencari error terkecil
- **Lead berkata:**
  - "Kembali ke data perjalanan tadi. Kita ingin sebuah garis lurus yang paling pas dengan titik-titik ini."
  - "Garis lurus punya dua angka pengatur: w, kemiringannya, dan b, titik awalnya. Rumusnya y = w kali x ditambah b."
  - "Bagaimana tahu garis mana yang paling pas? Kita ukur seberapa jauh garis meleset dari setiap titik, dikuadratkan, lalu dirata-rata. Itu namanya error, tepatnya mean squared error."
  - "Jadi masalahnya berubah menjadi: cari pasangan w dan b yang error-nya paling kecil. Ada yang dicari (w dan b), ada yang dinilai (error). Itulah masalah optimasi."
  - "Dan inilah inti hari ini: ketika orang bilang mesin belajar, sebenarnya mesin sedang mencari pengaturan dengan error terkecil."
- **Layar:** Slide 8. Lalu pindah ke alat: tab Praktik, tunjukkan grafik data dan **Lanskap Error** di kanan. "Setiap titik di peta ini adalah satu pasangan w dan b. Warna terang berarti error kecil, gelap berarti error besar. Kita ingin turun ke lembah yang terang."
- **Fasilitator lantai:** Membantu kelompok yang masih kesulitan membuka tautan.
- **Timekeeper:** Kode 2 jari di menit 20.
- **Jika waktu mepet, potong ini:** Tidak perlu pindah ke alat. Cukup slide.

### Menit 21-24: Brute force terlalu lambat
- **Lead berkata:**
  - "Di praktikum Go, kalian pasti pernah menulis perulangan yang mencoba semua kemungkinan lalu menyimpan yang terbaik. Itu brute force, dan di competitive programming itu sering jadi langkah pertama."
  - "Kita bisa melakukan hal yang sama: coba 100 nilai w dan 100 nilai b. Itu sudah 10.000 kali menghitung error, hanya untuk dua angka."
  - "Model sungguhan punya jutaan angka pengatur. Kalau tiap angka dicoba 100 nilai, jumlah kombinasinya jauh melebihi kemampuan komputer mana pun."
  - "Jadi kita butuh cara mencari yang lebih cerdas. Hari ini kita lihat dua cara."
- **Layar:** Slide 9 (brute force: kotak grid w dan b, jumlah kombinasi yang meledak).
- **Fasilitator lantai:** Tetap membantu yang belum membuka alat.
- **Timekeeper:** Kode kepalan di menit 24:00.
- **Jika waktu mepet, potong ini:** Lewati contoh jutaan parameter. Langsung ke "kita butuh cara yang lebih cerdas".

### Menit 24-28: Cara 1, Gradient Descent, dan demo learning rate
- Demo lengkap klik demi klik ada di `04_naskah_demo.md` (Demo A).
- **Lead berkata:**
  - "Cara pertama: Gradient Descent. Bayangkan kalian berdiri di lereng bukit dalam kabut. Kalian tidak bisa melihat lembahnya, tapi kaki bisa merasakan arah turunan. Maka kalian melangkah ke arah yang paling menurun, lalu ulangi."
  - "Arah turunan itu disebut kemiringan atau gradien. Seberapa jauh kita melangkah disebut learning rate."
  - "Kita coba tiga ukuran langkah."
  - (Klik **Terlalu kecil**, **Latih**) "Langkahnya kecil sekali. Bolanya merayap dan belum sampai lembah setelah 100 langkah."
  - (Klik **Pas**, **Latih**) "Ukuran pas. Bola cepat turun ke dasar lembah, lalu menyusuri lembah sampai dekat bintang."
  - (Klik **Terlalu besar**, **Latih**) "Langkahnya terlalu jauh. Bola melompat melewati lembah, makin lama makin jauh. Error justru membesar."
  - "Jadi Gradient Descent cepat, tapi sensitif terhadap learning rate."
- **Layar:** Slide 10 sebentar, lalu alat (Lanskap Error dan grafik error per iterasi).
- **Fasilitator lantai:** Mengamati apakah peserta di belakang bisa melihat demo. Jika tidak, minta lead memperbesar dengan tombol **Mode Presentasi**.
- **Timekeeper:** Kode 2 jari di menit 27.
- **Jika waktu mepet, potong ini:** Jalankan dengan **Langsung selesai** sehingga animasi tidak ditunggu. Lewati "Terlalu kecil", cukup "Pas" dan "Terlalu besar".

### Menit 28-32: Cara 2, Algoritma Genetika, demo generasi dan pseudocode
- Demo lengkap ada di `04_naskah_demo.md` (Demo B).
- **Lead berkata:**
  - "Cara kedua tidak butuh kemiringan sama sekali. Namanya Algoritma Genetika, terinspirasi dari seleksi alam."
  - "Kita mulai dengan sekelompok tebakan acak, misalnya 20 pasangan w dan b. Itu satu populasi."
  - "Setiap tebakan dinilai error-nya. Tebakan yang lebih baik lebih sering terpilih menjadi orang tua. Dua orang tua dicampur jadi anak, itu crossover. Lalu anak diubah sedikit secara acak, itu mutasi. Tebakan terbaik selalu dibawa ke generasi berikutnya."
  - "Ulangi terus, dan populasi bergerak ke arah lembah."
  - (Klik **Jalankan GA**) "Lihat titik-titik ini. Awalnya tersebar, lalu generasi demi generasi berkumpul di dekat bintang."
  - (Buka tab **Pseudocode** sebentar) "Ini langkahnya dalam pseudocode. Hanya perulangan, perbandingan, dan sedikit angka acak. Kalian sudah bisa menulisnya dengan Go."
- **Layar:** Slide 11, lalu alat, lalu tab Pseudocode, lalu kembali ke tab Praktik.
- **Fasilitator lantai:** Mencatat kelompok yang sudah membuka alat.
- **Timekeeper:** Kode 2 jari di menit 31.
- **Jika waktu mepet, potong ini:** Lewati tab Pseudocode. Sebutkan "pseudocode-nya ada di tab Pseudocode, silakan dibaca nanti."

### Menit 32-35: Tidak ada jaminan, jalankan 5 kali
- **Lead berkata:**
  - "GA memakai angka acak. Artinya, setiap kali dijalankan dengan seed berbeda, hasilnya bisa sedikit berbeda."
  - (Klik **Jalankan 5 kali**) "Ini lima kali jalan dengan seed berbeda. Ada yang sangat dekat dengan jawaban terbaik, ada yang sedikit lebih jauh. Lihat kolom selisih dalam persen."
  - **Kalimat kejujuran tentang metaheuristik (wajib diucapkan):** "Metaheuristik tidak menjamin jawaban terbaik. Ia memberi jawaban yang cukup baik dalam waktu yang wajar. Karena itu, kita selalu menjalankannya beberapa kali dan melaporkan hasil terbaik, terburuk, dan rata-ratanya apa adanya."
  - "Untuk garis lurus, jawaban terbaik sebenarnya bisa dihitung langsung dengan rumus. Itu bintang di peta. Kita memakainya sebagai kunci jawaban untuk menilai kedua cara."
- **Layar:** Alat, tabel 5 kali jalan.
- **Fasilitator lantai:** Siap membantu kelompok untuk praktik.
- **Timekeeper:** Kode kepalan di menit 35:00.
- **Jika waktu mepet, potong ini:** Tidak dipotong. Kalimat kejujuran selalu diucapkan, walau hanya kalimat itu saja.

### Menit 35-37: Masalah tanpa kemiringan: rute dan bee colony
- **Lead berkata:**
  - "Kalau ada rumus, kenapa repot dengan GA? Karena banyak masalah nyata tidak punya kemiringan."
  - "Contohnya menyusun rencana perjalanan wisata: urutan tempat yang dikunjungi. Urutan tidak bisa digeser sedikit demi sedikit seperti angka. Tidak ada lereng yang bisa diikuti."
  - "Di situlah metaheuristik berguna. Salah satu publikasi lab tahun ini memakai algoritma hybrid bee colony untuk rekomendasi rencana perjalanan."
- **Layar:** Slide 12.
- **Fasilitator lantai:** Pastikan setiap kelompok sudah bisa membuka alat. Laporkan kelompok bermasalah ke lead dengan isyarat.
- **Timekeeper:** Kode 2 jari di menit 36.
- **Jika waktu mepet, potong ini:** Cukup satu kalimat: "Banyak masalah nyata seperti menyusun rute tidak punya kemiringan, dan di sanalah metaheuristik dipakai."

### Menit 37-39: Brief mini project dan QR
- **Lead berkata:**
  - "Sekarang giliran kalian. Mini project kita bernama **Prediktor**."
  - "Misi 1, delapan menit: pakai data jarak dan waktu tempuh. Coba tiga learning rate, lalu jalankan GA."
  - "Misi 2, tiga belas menit: pilih skenario lain atau buat skenario sendiri, isi 6 sampai 10 data, latih dengan GD dan GA lima kali, lalu pakai model kalian untuk menebak data baru."
  - "Hasilnya kalian rangkum di Kartu Hasil di bagian bawah. Semua langkah juga tertulis di panel Misi dan di tab Panduan."
  - "Data harus fiktif dan netral. Jangan memakai data pribadi atau nilai siapa pun."
- **Layar:** Slide 13 (Mini project Prediktor, QR, ringkasan misi).
- **Fasilitator lantai:** Bersiap berkeliling.
- **Timekeeper:** Kode kepalan di menit 39:00.
- **Jika waktu mepet, potong ini:** Cukup "Ikuti panel Misi di alat, mulai dari Misi 1."

### Menit 39-40: Buffer

---

## Blok 4. Praktik langsung (menit 40 sampai 70)

Selama praktik, slide 13 tetap di layar. Lead ikut berkeliling bersama fasilitator lantai.

### Menit 40-42: Buka alat
- **Lead berkata:** "Silakan buka alat di laptop kelompok. Mulai dari panel Misi 1. Kami akan berkeliling."
- **Fasilitator lantai:** Cek setiap kelompok: alat terbuka, skenario "Jarak dan waktu tempuh".
- **Timekeeper:** Umumkan "Misi 1 dimulai" di menit 42.
- **Jika laptop tidak bisa membuka alat:** lihat `06_kartu_kontingensi.md`.

### Menit 42-50: Misi 1
- Langkah di alat: skenario Jarak, **Terlalu kecil** lalu **Latih**, **Pas** lalu **Latih**, **Terlalu besar** lalu **Latih**, lalu **Jalankan GA**.
- **Pertanyaan pancingan untuk kelompok** (fasilitator lantai dan lead):
  - "Learning rate mana yang paling cepat sampai lembah?"
  - "Kenapa yang terlalu besar justru makin jauh?"
  - "GA butuh berapa evaluasi, GD berapa? Mana yang lebih hemat?"
- **Timekeeper:** Umumkan "dua menit lagi menuju Misi 2" di menit 48. Umumkan "Misi 2 dimulai" di menit 50.
- **Jika waktu mepet, potong ini:** Misi 1 cukup GD "Pas" dan satu kali GA.

### Menit 50-63: Misi 2
- Langkah di alat: pilih skenario (Suhu dan es teh, Pengunjung kantin, atau Skenario sendiri), isi 6 sampai 10 titik, latih GD, **Jalankan 5 kali** untuk GA, isi prediksi untuk 2 atau 3 nilai x baru, isi nomor kelompok dan kesimpulan di **Kartu Hasil**.
- **Jika kelompok macet:** arahkan ke tombol **Pakai preset**. Tidak perlu merasa kalah. Yang penting mereka bisa membandingkan.
- **Pertanyaan pancingan:**
  - "Apa yang terjadi kalau satu titik kalian ubah jadi sangat jauh?"
  - "Dari lima kali jalan GA, berapa selisih terburuk dengan jawaban terbaik?"
  - "Prediksi kalian masuk akal? Bagaimana kalau x-nya jauh di luar data?"
- **Fasilitator lantai dan lead:** Cari 2 atau 3 kelompok dengan hasil yang menarik dan berbeda (misalnya satu kelompok GA-nya sangat dekat, satu kelompok GD-nya menyimpang karena learning rate, satu kelompok dengan skenario sendiri yang kreatif). Tanyakan secara pribadi: "Kalau nanti mau berbagi hasil tiga menit, boleh? Kalau tidak mau juga tidak apa-apa." Catat siapa yang bersedia.
- **Timekeeper:** Isi lembar catatan positif sambil berkeliling (apa yang dibangun, catatan positif). Umumkan "lima menit lagi" di menit 58 dan "Misi 2 selesai, siapkan Kartu Hasil" di menit 63.
- **Jika waktu mepet, potong ini:** Prediksi cukup satu nilai. Jalankan 5 kali tetap dilakukan karena itu inti perbandingan.

### Menit 63-67: Siapkan presentasi
- **Lead berkata:** "Kartu Hasil kalian sudah jadi. Nyalakan **Mode Presentasi** kalau nanti tampil di proyektor. Kelompok yang bersedia berbagi, siapkan satu orang untuk bercerita: skenario apa, mana yang lebih baik, dan satu hal yang mengejutkan."
- **Fasilitator lantai:** Konfirmasi ulang 2 atau 3 kelompok yang bersedia. Siapkan urutan tampil. Jika laptop kelompok tidak bisa disambungkan ke proyektor, kelompok cukup membacakan Kartu Hasil, atau salin ringkasan ke laptop presenter.
- **Timekeeper:** Kode kepalan di menit 67.

### Menit 67-70: Buffer atau tantangan tambahan
- Kelompok yang sudah selesai mengerjakan **Tantangan tambahan** di panel Misi: tambah titik pencilan, coba populasi sangat kecil, cari learning rate terkecil yang masih selesai dalam 50 langkah.

---

## Blok 5. Presentasi hasil dan penutup (menit 70 sampai 90)

### Menit 70-71: Transisi
- **Lead berkata:** "Waktu praktik selesai. Terima kasih sudah bekerja keras. Sekarang kita dengar dua atau tiga kelompok berbagi hasil."
- **Layar:** Slide 14.

### Menit 71-80: 2 sampai 3 kelompok, masing-masing 3 menit
- **Cara mengundang tanpa tekanan:**
  1. **Relawan dulu.** "Ada kelompok yang ingin berbagi? Silakan angkat tangan." Tunggu sekitar 5 detik dengan tenang.
  2. **Jika belum ada relawan,** undang kelompok yang tadi sudah bersedia saat dihampiri: "Kelompok 3, tadi hasilnya menarik sekali karena GA-nya hampir sama dengan jawaban terbaik. Mau berbagi?"
  3. **Pilih hasil yang kontras,** misalnya satu kelompok GD-nya unggul dan satu kelompok GA-nya unggul, atau satu skenario preset dan satu skenario sendiri.
  4. **Selalu sediakan jalan keluar.** "Kalau belum siap, tidak apa-apa, kami bisa lanjut ke kelompok lain." Tidak ada penunjukan acak.
  5. Jika tidak ada satu pun yang bersedia: lead menampilkan satu hasil di laptop presenter dan membahasnya bersama kelas. Lihat kartu kontingensi.
- **Pertanyaan pemandu untuk kelompok yang tampil** (lead membantu jika kelompok gugup):
  - "Skenario kalian apa, dan berapa data yang dipakai?"
  - "Mana yang lebih dekat ke jawaban terbaik, GD atau GA? Berapa evaluasi yang dipakai masing-masing?"
  - "Coba satu prediksi. Masuk akal?"
- **Setelah setiap kelompok:** "Terima kasih, Kelompok [nomor]. Mari beri tepuk tangan." Sebut satu hal positif yang spesifik.
- **Timekeeper:** Tiap kelompok 3 menit. Kode 2 jari di menit ke-2 tiap kelompok. Catat hal positif di lembar catatan.
- **Jika waktu mepet, potong ini:** Cukup 2 kelompok.

### Menit 80-83: Refleksi seluruh kelas
- **Lead berkata:**
  - "Angkat tangan: kelompok yang GD-nya lebih dekat ke jawaban terbaik?" (lead menghitung, tulis di papan tulis)
  - "Kelompok yang GA-nya lebih dekat?" (tulis)
  - "Berapa selisih terburuk GA dari lima kali jalan di kelompok kalian? Ada yang di bawah 1 persen? Di atas 10 persen?" (tulis beberapa angka)
  - "Dari angka-angka ini kita lihat: GD cepat dan sangat tepat kalau learning rate-nya pas. GA tidak butuh kemiringan, tapi hasilnya bervariasi. Masing-masing punya tempat."
- **Layar:** Papan tulis. Slide 14 tetap tampil.
- **Timekeeper:** Kode kepalan di menit 83.
- **Jika waktu mepet, potong ini:** Satu pertanyaan saja (GD atau GA yang lebih dekat).

### Menit 83-86: Rangkuman dan kaitan riset lab
- **Lead berkata:**
  - "Tiga hal untuk dibawa pulang."
  - "Pertama, belajar adalah optimasi: mencari pengaturan dengan error terkecil."
  - "Kedua, ada banyak cara mencari. Gradient Descent memakai kemiringan, cepat, tapi perlu learning rate yang tepat. Algoritma Genetika tidak butuh kemiringan, fleksibel, tapi hasilnya perlu dicek dengan beberapa kali jalan."
  - "Ketiga, masalah nyata sering tidak punya kemiringan, seperti menyusun rute. Riset di Computing Laboratory banyak bergerak di sana, misalnya hybrid bee colony untuk rekomendasi perjalanan."
  - "Stand as One. Rise as Knights. Hari ini kalian bekerja sebagai satu tim dan menempa alat prediksi kalian sendiri."
- **Layar:** Slide 15.

### Menit 86-88: Kanal resmi untuk pertanyaan lanjutan
- **Lead berkata:**
  - "Kalau ada pertanyaan yang belum sempat terjawab, silakan hubungi kami lewat kanal resmi: Instagram @computing.lab dan situs computinglab.tech. Kalian juga bisa bertanya langsung ke kami setelah sesi ini."
  - "Alatnya tetap bisa dibuka setelah hari ini lewat tautan yang sama."
- **Layar:** Slide 15 (kanal resmi).
- **Catatan:** Jangan menyebut pendaftaran atau rekrutmen.

### Menit 88-89: Terima kasih
- **Lead berkata:** "Terima kasih atas semangat dan kerja sama kalian. Semoga sukses untuk hari kedua FORTRAN. Wassalamualaikum, selamat pagi/siang."
- **Timekeeper:** Catat jam selesai di lembar catatan.

### Menit 89-90: Buffer
- **Batas keras di menit 90.** Bereskan kabel dengan cepat. Untuk ronde 1, tim langsung menuju lantai 2.

---

## Kegiatan cadangan tanpa perangkat (unplugged)

Dipakai jika proyektor, Wi-Fi, dan laptop sama sekali tidak bisa dipakai. Ditampilkan sebagai slide 16 jika proyektor masih menyala. Waktunya menggantikan Blok 4 (menit 40 sampai 70).

1. **Data di papan tulis (3 menit).** Lead menulis 5 titik data jarak dan waktu tempuh:

   | x (km) | 1 | 2 | 4 | 6 | 8 |
   |---|---|---|---|---|---|
   | y (menit) | 6 | 9 | 15 | 19 | 26 |

2. **Tebakan pertama (7 menit).** Setiap kelompok mengusulkan satu pasangan (w, b), misalnya w = 3 dan b = 2. Kelompok menghitung tebakan y untuk setiap x, selisihnya dengan y asli, mengkuadratkan selisih, lalu merata-ratakan. Itu error kelompok. Lead menulis semua (w, b) dan error di papan tulis.
3. **GA manusia (15 menit, 2 sampai 3 generasi).**
   - **Seleksi:** pilih dua usulan dengan error terkecil.
   - **Crossover:** rata-ratakan keduanya. Contoh (3, 2) dan (2,5; 4) menjadi (2,75; 3).
   - **Mutasi:** setiap kelompok menggeser sedikit hasil itu, misalnya w ditambah atau dikurangi 0,25, dan b ditambah atau dikurangi 1. Setiap kelompok memilih geseran yang berbeda.
   - Hitung error lagi. Ulangi 2 atau 3 generasi. Tunjukkan bahwa error terkecil di papan tulis makin turun.
4. **Penutup kegiatan (5 menit).** "Kita baru saja menjalankan algoritma genetika dengan tangan. Komputer melakukan hal yang sama ribuan kali per detik." Sebagai kunci jawaban, garis terbaik untuk data ini kira-kira w = 2,8 dan b = 3,3 dengan error sekitar 0,3.

Kelompok yang tampil di Blok 5 menceritakan generasi mereka di papan tulis.

---

## Pertanyaan yang belum terjawab

- Jawab dengan jujur jika tahu. Jika tidak tahu: "Pertanyaan bagus. Kami belum bisa menjawabnya dengan tepat sekarang. Silakan kirim ke Instagram @computing.lab atau lewat computinglab.tech supaya kami jawab dengan benar."
- Pertanyaan tentang pendaftaran atau rekrutmen lab: arahkan ke kanal resmi, tanpa menjanjikan apa pun.
- Pertanyaan teknis tentang acara (jadwal, penilaian, kelas): arahkan ke panitia.

## Hal yang harus dikonfirmasi sebelum sesi

- [KONFIRMASI: nama lead, fasilitator lantai, dan timekeeper untuk Tim A dan Tim B]
- [KONFIRMASI: peran spesifik lab di fakultas]
- [KONFIRMASI: aktivitas rutin lab]
- [KONFIRMASI: tumpukan teknologi lab]
- [KONFIRMASI: tautan pendek alat setelah deploy]
- [KONFIRMASI: ketersediaan proyektor, HDMI, dan papan tulis di keenam ruangan]
