# Panduan Peserta: Prediktor, Dua Cara Belajar

Computing Laboratory · FORTRAN 2026 · Day 2 "The Forge of Excalibur"

> Isi berkas ini sama dengan tab **Panduan** di alat. Peserta membaca versi di dalam alat; berkas ini untuk arsip dan pemeriksaan.

## Apa yang kita lakukan hari ini?

Kita membuat alat prediksi sederhana. Modelnya garis lurus **y = w·x + b**. Mesin dikatakan "belajar" ketika ia mencari pasangan **w** (kemiringan) dan **b** (titik potong) yang membuat **error** paling kecil. Kita melatihnya dengan dua cara, lalu membandingkan hasilnya.

- **Cara 1, Gradient Descent (GD):** mengikuti kemiringan error menuju lembah. Cepat, tapi sensitif terhadap learning rate.
- **Cara 2, Algoritma Genetika (GA):** sekumpulan tebakan diseleksi, dicampur, dan dimutasi dari generasi ke generasi. Tidak butuh kemiringan. Hasilnya bisa sedikit berbeda setiap kali dijalankan.

Tidak perlu menulis kode. Semua berjalan di browser, juga tanpa internet setelah halaman pernah dibuka. Tombol **EN** di kanan atas mengganti tampilan ke bahasa Inggris.

## Misi 1 (8 menit): kenali dua cara

1. Di tab **Praktik**, pakai skenario **Jarak dan waktu tempuh** (atau klik **Siapkan Misi 1**).
2. Klik **Terlalu kecil**, lalu **Latih GD**. Bola merah merayap pelan.
3. Klik **Pas**, lalu **Latih GD**. Bola turun ke lembah dan mendekati bintang.
4. Klik **Terlalu besar**, lalu **Latih GD**. Bola melompat makin jauh dan error membesar.
5. Klik **Jalankan GA**. Titik hijau tosca berkumpul menuju bintang. Bandingkan jumlah evaluasinya dengan GD.

## Misi 2 (13 menit): Prediktor kelompok kalian

1. Pilih skenario lain atau **Skenario sendiri**. Isi nama skenario, label, dan satuan x serta y.
2. Isi 6 sampai 10 titik data fiktif di tabel, atau klik grafik untuk menambah titik.
3. Latih GD dengan **Pas**.
4. Klik **Jalankan 5 kali** untuk GA. Lihat terbaik, terburuk, dan rata-ratanya.
5. Di kotak **Prediksi**, coba 2 atau 3 nilai x baru.
6. Isi nomor kelompok dan satu kalimat kesimpulan di **Kartu Hasil**, lalu nyalakan **Mode Presentasi** jika akan tampil.

Macet? Klik **Pakai preset**. Ingin mengulang dari awal? Klik **Reset**.

## Arti setiap kontrol

| Istilah | Arti |
|---|---|
| Error (MSE) | Rata-rata kuadrat selisih antara tebakan garis dan data asli. Makin kecil makin pas. Satuannya satuan y dikuadratkan. |
| Lanskap Error | Peta semua pasangan (w, b). Warna terang berarti error kecil, gelap berarti error besar. Bintang emas adalah jawaban terbaik, yang bisa dihitung langsung karena modelnya kecil. |
| Learning rate | Ukuran langkah GD. Terlalu kecil membuat lambat, terlalu besar membuat bola melompat dan error membesar. |
| Jumlah langkah | Berapa kali GD melangkah. |
| Ukuran populasi | Banyaknya tebakan (w, b) dalam satu generasi GA. |
| Jumlah generasi | Berapa kali populasi diperbarui. |
| Laju mutasi | Peluang setiap anak digeser sedikit secara acak. Rendah membuat populasi cepat seragam, tinggi membuat pencarian lebih menyebar. |
| Seed | Angka awal pengacak. Seed yang sama selalu memberi hasil yang sama, sehingga hasil bisa diulang. |
| Evaluasi | Berapa kali error dihitung. GD: satu kali per langkah. GA: ukuran populasi dikali jumlah generasi. Dipakai untuk membandingkan secara adil. |

## Cara membaca Kartu Hasil

- **GD:** pengaturan learning rate dan langkah, error akhir, serta selisihnya dengan jawaban terbaik.
- **GA 5 kali:** error terbaik, terburuk, dan rata-rata dari lima seed berbeda. Selisih dalam persen menunjukkan seberapa jauh dari jawaban terbaik.
- **Jawaban terbaik:** error dari rumus pasti, sebagai kunci jawaban.
- **Prediksi:** contoh pemakaian model untuk nilai x baru.
- **Kesimpulan:** satu kalimat dari kelompok kalian.

## Catatan kejujuran tentang metaheuristik

Algoritma genetika dan metaheuristik lain tidak menjamin jawaban terbaik. Mereka memberi jawaban yang cukup baik dalam waktu yang wajar. Karena itu kita menjalankannya beberapa kali dan melaporkan hasil terbaik, terburuk, dan rata-ratanya apa adanya. Untuk garis lurus, jawaban terbaik bisa dihitung dengan rumus. Metaheuristik berguna untuk masalah yang tidak punya kemiringan, misalnya menyusun urutan rute perjalanan.

## Pertanyaan lanjutan dan kanal resmi

Pertanyaan yang belum terjawab bisa disampaikan ke presenter setelah sesi atau lewat kanal resmi Computing Laboratory:

- Instagram: [@computing.lab](https://www.instagram.com/computing.lab/)
- Situs: [computinglab.tech](https://computinglab.tech)

Alat ini tidak mengumpulkan data apa pun. Isian hanya tersimpan di browser kalian sendiri.
