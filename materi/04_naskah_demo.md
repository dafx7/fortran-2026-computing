# Naskah Demo Klik demi Klik

Untuk lead presenter, menit 24 sampai 35. Semua angka di bawah berasal dari seed tetap, sehingga keenam ruangan melihat hasil yang sama persis. Angka ini juga diperiksa oleh unit test.

Jika demo langsung gagal (laptop macet, alat tidak terbuka), tampilkan screenshot cadangan di `materi/screenshots/` sesuai nomor yang tertulis di setiap langkah, atau pakai slide 10 sampai 12.

## Persiapan (sebelum sesi dimulai)

1. Buka alat di browser laptop presenter. Tab **Praktik**.
2. Klik **Reset** lalu **OK**, kemudian klik **Siapkan Misi 1**. Skenario: **Jarak dan waktu tempuh** (8 titik data).
3. Pastikan pengaturan: learning rate **Pas**, **Jumlah langkah 100**, **Kecepatan animasi: sedang**, populasi **20**, generasi **30**, laju mutasi **Sedang (0,30)**, seed **2026**.
4. Gulir sampai kartu **Latih Model** berada di atas layar. Panel **Lanskap Error** di kanan tetap terlihat.
5. Jika ruangan besar, klik **Mode Presentasi** di kanan atas, atau perbesar browser dengan Ctrl dan tombol plus.

Titik putih berlabel "awal" di peta adalah titik awal GD, sama untuk semua kelompok.

## Demo A: Gradient Descent dengan tiga learning rate (menit 24 sampai 28)

| Langkah | Klik | Yang terlihat | Angka yang diharapkan | Screenshot cadangan |
|---|---|---|---|---|
| A1 | Tidak ada, tunjuk peta | Peta Lanskap Error, titik awal di kiri bawah lembah | Belum ada bintang | `01_alat_awal.png` |
| A2 | **Terlalu kecil**, lalu **Latih GD** | Bola merah merayap pelan selama sekitar 5 detik dan belum sampai lembah | Learning rate 0,0166. Error akhir **39,92 menit²**, selisih sekitar 16.642% dari jawaban terbaik. Garis y = 0,58·x + 14. Evaluasi 100. Muncul pesan "Belum sampai lembah". | `02_gd_terlalu_kecil.png` |
| A3 | **Pas**, lalu **Latih GD** | Bola turun ke dasar lembah dalam satu langkah, lalu menyusuri lembah menuju bintang | Learning rate 0,416. Error akhir **0,238 menit²**, selisih 0,02%. Garis y = 2,8·x + 3,2. Evaluasi 100. | `03_gd_pas.png` |
| A4 | **Terlalu besar**, lalu **Latih GD** | Bola melompat bolak-balik melewati lembah, makin jauh, lalu keluar peta | Learning rate 0,915. Berhenti setelah **11 langkah**. Pesan: "Error membesar, langkah terlalu jauh. Coba learning rate yang lebih kecil." | `04_gd_terlalu_besar.png` |
| A5 | **Pas**, lalu **Langsung selesai** | Kembali ke hasil bagus, siap untuk demo GA | Error 0,238 menit² | `03_gd_pas.png` |

**Ucapan kunci:** "Langkah terlalu kecil: lambat. Pas: cepat sampai. Terlalu besar: justru menjauh. Jadi Gradient Descent cepat, tapi sensitif terhadap learning rate."

Setelah latihan pertama, bintang emas muncul dengan label "jawaban terbaik (bisa dihitung karena modelnya kecil)". Garis putus-putus emas di grafik error adalah error jawaban terbaik, **0,238 menit²** (garis y = 2,79·x + 3,17).

Jika waktu mepet: lewati A2 dan pakai **Langsung selesai** untuk A3 dan A4.

## Demo B: Algoritma Genetika (menit 28 sampai 32)

| Langkah | Klik | Yang terlihat | Angka yang diharapkan | Screenshot cadangan |
|---|---|---|---|---|
| B1 | **Jalankan GA** | 20 titik hijau tosca tersebar di seluruh peta, lalu generasi demi generasi berkumpul di dekat bintang (sekitar 5 detik) | Generasi 1: error terbaik 72,86 menit² | `05_ga_generasi_1.png` |
| B2 | (animasi berjalan) | Populasi mulai mengumpul di lembah | Generasi 6: error terbaik sekitar 0,465 menit² | `06_ga_generasi_6.png` |
| B3 | (animasi selesai) | Populasi rapat di sekitar bintang | Error terbaik **0,238 menit²**, selisih 0,01%. Seed 2026. Evaluasi 20 x 30 = **600**. Baris perbandingan: "GD 100 (satu per langkah), GA 20 x 30 = 600". | `07_ga_generasi_30.png` |
| B4 | Tab **Pseudocode** | Pseudocode brute force, GD, dan GA | Tunjuk bagian GA: turnamen, campuran, mutasi, elitisme | `08_pseudocode.png` |
| B5 | Tab **Praktik** | Kembali ke alat | | |

**Ucapan kunci:** "GA tidak memakai kemiringan sama sekali. Ia hanya membandingkan error. Tapi lihat jumlah evaluasinya: 600, sedangkan GD cukup 100."

## Demo C: Jalankan 5 kali (menit 32 sampai 35)

Klik **Jalankan 5 kali** (hasil langsung tampil, tanpa animasi). Lima titik bernomor muncul di peta. Tabel yang diharapkan:

| Jalan | Seed | Error (menit²) | w | b | Evaluasi | Selisih |
|---|---|---|---|---|---|---|
| 1 | 2026 | 0,238 | 2,8 | 3,2 | 600 | 0,01% |
| 2 | 2027 | 0,238 | 2,8 | 3,2 | 600 | 0,00% (baris emas, terbaik) |
| 3 | 2028 | 0,239 | 2,8 | 3,2 | 600 | 0,31% |
| 4 | 2029 | 0,238 | 2,8 | 3,2 | 600 | 0,02% |
| 5 | 2030 | 0,241 | 2,8 | 3,1 | 600 | 1,05% |
| Terbaik | | 0,238 | | | | 0,00% |
| Terburuk | | 0,241 | | | | 1,05% |
| Rata-rata | | 0,239 | | | | 0,28% |

Screenshot cadangan: `09_ga_jalankan_5_kali.png`.

**Ucapan kunci (kalimat kejujuran, wajib):** "Metaheuristik tidak menjamin jawaban terbaik. Ia memberi jawaban yang cukup baik dalam waktu yang wajar. Karena itu kita selalu menjalankannya beberapa kali dan melaporkan hasil terbaik, terburuk, dan rata-ratanya apa adanya."

## Contoh prediksi dan Kartu Hasil (opsional, saat brief menit 37 sampai 39)

1. Di kotak **Prediksi**, ketik `7`, pilih **Keduanya**, klik **Prediksi**.
   - Hasil: "GD: Untuk jarak 7 km, perkiraan waktu tempuh sekitar 23 menit." dan "GA terbaik: Untuk jarak 7 km, perkiraan waktu tempuh sekitar 23 menit."
   - Screenshot cadangan: `10_prediksi.png`.
2. Ketik `15`, klik **Prediksi**: muncul catatan bahwa nilai berada di luar rentang data (1 sampai 10), jadi kurang dapat diandalkan.
3. Gulir ke **Kartu Hasil**, tunjukkan contohnya dengan Mode Presentasi. Screenshot cadangan: `11_kartu_hasil_mode_presentasi.png`.
4. Tampilan di HP: `12_tampilan_hp.png`.

## Jawaban tantangan tambahan (untuk fasilitator, skenario Jarak)

- **Learning rate terkecil yang masih mencapai selisih di bawah 10% dalam 50 langkah:** sekitar **0,46**. Menariknya, "Pas" (0,416) dengan 50 langkah masih menyisakan selisih sekitar 22%, karena "Pas" dipilih supaya aman dan stabil. Learning rate 0,6 sampai 0,7 mencapai selisih di bawah 1%, sedangkan 0,85 sudah divergen. Pesan untuk peserta: ada rentang learning rate yang baik, dan batasnya dekat dengan titik di mana semuanya meledak.
- **Populasi 6 dan generasi 5:** hanya 30 evaluasi. Selisihnya biasanya jauh lebih besar dan berbeda-beda antarseed. Pesan: metaheuristik butuh cukup banyak evaluasi.
- **Titik pencilan:** GD dan GA sama-sama ikut tertarik ke pencilan karena error dikuadratkan. Jawaban terbaik (bintang) juga ikut bergeser. Pesan: kualitas data memengaruhi model, apa pun cara melatihnya.

## Merekam ulang screenshot

```bash
npm run screenshots              # menulis ulang materi/screenshots/*.png
node scripts/capture-screenshots.mjs --video   # juga merekam video demo ke materi/screenshots/demo.webm
```
