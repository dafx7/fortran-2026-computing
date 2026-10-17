# Kartu Kontingensi Fasilitator

Satu halaman. Dipegang timekeeper, dibaca cepat saat ada masalah. Prinsipnya: **tetap tenang, sesi tetap jalan, batas keras menit 90.**

| Situasi | Tindakan |
|---|---|
| **Wi-Fi mati** | Alat tetap jalan di perangkat yang sudah pernah membukanya. Perangkat yang belum: (1) sambungkan ke **hotspot laptop fasilitator** dan buka alamat dari `node scripts/serve.mjs site 8080` (contoh `http://192.168.137.1:8080/`), atau (2) salin folder `site` dari **flashdisk** lalu buka `index.html`. Hotspot HP fasilitator juga bisa dipakai untuk membuka tautan online. |
| **Proyektor atau HDMI gagal** (semua ruangan sudah dipastikan punya proyektor, HDMI, dan papan tulis) | Coba adaptor cadangan (HDMI, USB-C). Jika tetap gagal dalam 2 menit: lanjut tanpa slide. Lead membacakan poin slide, peserta mengikuti demo di laptop masing-masing (tab Praktik, langkah yang sama). Gambar lanskap dan garis di papan tulis jika perlu. |
| **Laptop peserta tidak bisa membuka halaman** | Coba browser lain (Chrome, Edge, Firefox). Matikan mode hemat data. Coba hotspot atau flashdisk. Jika tetap gagal, kelompok bergabung menonton laptop kelompok tetangga, atau anggota memakai HP untuk membuka alat. |
| **Alat bermasalah (bug)** | Klik **Reset**, lalu muat ulang halaman (Ctrl+Shift+R). Jika masih bermasalah, kelompok memakai skenario preset. Demo presenter diganti screenshot di `materi/screenshots/` (lihat `04_naskah_demo.md`). Catat masalahnya di lembar catatan sesi. |
| **Sesi terlambat** | Potong berurutan: (1) buffer, (2) "Terlalu kecil" pada demo GD, (3) tab Pseudocode pada demo GA, (4) contoh publikasi, sisakan dua, (5) Misi 1 hanya GD Pas dan satu GA, (6) presentasi cukup 2 kelompok, (7) refleksi cukup satu pertanyaan. **Jangan dipotong:** kalimat kejujuran tentang metaheuristik, kanal resmi, dan ucapan terima kasih. |
| **Sesi lebih cepat** | Tambah Tantangan tambahan di panel Misi. Undang kelompok ketiga untuk berbagi. Tanya jawab terbuka tentang materi hari ini. Jangan menambah materi baru di luar naskah. |
| **Kelompok macet** | Tanya "Sudah sampai langkah mana?". Arahkan ke panel Misi dan tombol **Pakai preset**. Jika data Skenario sendiri belum siap, pakai skenario preset dulu. Puji hal kecil yang sudah berhasil. |
| **Kelompok selesai lebih awal** | Berikan Tantangan tambahan: titik pencilan, populasi 6 dan generasi 5, cari learning rate terkecil yang selesai dalam 50 langkah. Minta mereka menyiapkan cerita 3 menit. |
| **Tidak ada yang mau presentasi** | Jangan memaksa dan jangan menunjuk acak. Undang kelompok yang saat praktik sudah bilang bersedia. Jika tetap tidak ada, lead menampilkan satu Kartu Hasil (minta izin kelompoknya, atau pakai contoh `11_kartu_hasil_mode_presentasi.png`) dan membahasnya bersama kelas, lalu langsung ke refleksi angkat tangan. |
| **Peserta merasa tidak enak badan** | Hentikan bagian yang melibatkan peserta itu. Fasilitator lantai mendampingi dengan tenang dan segera menghubungi panitia sesuai rantai komando panitia (panitia penanggung jawab ruangan). Lead melanjutkan sesi untuk peserta lain. Jangan memberi obat. Catat waktunya di catatan sesi, tanpa nama. |
| **Pertanyaan yang tidak bisa kami jawab** | "Pertanyaan bagus. Supaya jawabannya tepat, silakan kirim ke Instagram @computing.lab atau lewat computinglab.tech." Untuk pertanyaan tentang acara, arahkan ke panitia. Untuk pendaftaran lab, arahkan ke kanal resmi tanpa menjanjikan apa pun. |
| **Perubahan presenter, materi, atau kegiatan** | Bukan wewenang tim di ruangan. Hubungi koordinator lab, yang akan berkoordinasi dengan panitia. |

## Kegiatan cadangan tanpa perangkat: "GA Manusia"

Dipakai jika proyektor, Wi-Fi, dan laptop sama sekali tidak bisa dipakai. Menggantikan praktik (menit 40 sampai 70). Slide 16 jika proyektor masih menyala.

1. **Tulis 5 titik di papan tulis (3 menit).**

   | x (km) | 1 | 2 | 4 | 6 | 8 |
   |---|---|---|---|---|---|
   | y (menit) | 6 | 9 | 15 | 19 | 26 |

2. **Tebakan pertama (7 menit).** Setiap kelompok mengusulkan (w, b). Untuk setiap x: tebakan = w·x + b, selisih = tebakan dikurangi y, kuadratkan, jumlahkan, bagi 5. Itu error kelompok. Tulis semua (w, b) dan error di papan tulis. Contoh: (3, 2) memberi tebakan 5, 8, 14, 20, 26, selisih -1, -1, -1, 1, 0, error = 4/5 = 0,8.
3. **GA manusia, 2 sampai 3 generasi (15 menit).**
   - **Seleksi:** ambil dua usulan dengan error terkecil.
   - **Crossover:** rata-ratakan keduanya. Contoh (3, 2) dan (2,5; 4) menjadi (2,75; 3).
   - **Mutasi:** tiap kelompok menggeser sedikit dengan arah berbeda, misalnya w ± 0,25 dan b ± 1.
   - Hitung error lagi, tulis di papan tulis. Ulangi.
4. **Penutup kegiatan (5 menit).** Tunjukkan error terkecil yang makin turun dari generasi ke generasi. "Komputer melakukan hal yang sama ribuan kali per detik." Kunci jawaban: garis terbaik sekitar **w = 2,8 dan b = 3,3 dengan error sekitar 0,3**.

Perlu: spidol 2 warna, kertas dan pulpen per kelompok (tercantum di requirement peserta).
