```
const paketLayanan = [
    {
      title: "FULLDAY",
      icon: "🌅",
      subtitle: "Untuk anak usia 3 bulan - 3 tahun",
      schedule: "07.00 - 17.00 WIB",
      features: [
        "Makan 2x + Snack sore",
        "Program pembelajaran lengkap",
        "Tidur siang teratur",
        "Stimulasi 6 aspek perkembangan"
      ],
      price: "Mulai dari Rp 1.400.000/bulan",
      popular: true
    },
    {
      title: "AFTER SCHOOL",
      icon: "🎒",
      subtitle: "Untuk anak usia 2 - 6 tahun",
      schedule: "setelah sekolah - 17.00 WIB",
      features: [
        "Makan 1x + Snack sore",
        "Bimbingan PR & aktivitas",
        "Program pengembangan bakat",
        "Pembentukan karakter Islami"
      ],
      price: "Mulai dari Rp 900.000/bulan",
      popular: false
    },
    {
      title: "HARIAN",
      icon: "☀️",
      subtitle: "Untuk kebutuhan fleksibel",
      schedule: "Sesuai kebutuhan",
      features: [
        "Pembayaran per hari",
        "Fasilitas sama dengan fullday",
        "Cocok untuk jadwal tidak tetap",
        "Tetap berkualitas"
      ],
      price: "Mulai dari Rp 80.000/hari",
      popular: false
    }
  ];

  const jadwalKegiatan = [
    { time: "07.00-07.30", activity: "Penyambutan & morning check", icon: "👋" },
    { time: "07.30-08.00", activity: "Doa bersama & fisik motorik", icon: "🤲" },
    { time: "08.00-08.30", activity: "Sarapan & toilet training", icon: "🍽️" },
    { time: "08.30-10.00", activity: "Pembelajaran terprogram", icon: "📚" },
    { time: "10.30-11.00", activity: "Sosialisasi & bermain", icon: "🎈" },
    { time: "11.30-12.00", activity: "Makan siang", icon: "🍛" },
    { time: "12.00-15.00", activity: "Tidur siang", icon: "😴" },
    { time: "15.00-16.00", activity: "Mandi sore & Shalat Ashar", icon: "🛁" },
    { time: "16.00-17.00", activity: "Snack & mengaji (TPQ)", icon: "📖" },
  ];

```





Bantu saya menyusun **konsep dan fitur aplikasi Daycare Al Muhajirin** secara **terstruktur, realistis, dan konsisten** dengan KBTK (agar satu yayasan → satu ekosistem), dengan fokus pada **administrasi + monitoring perkembangan anak** yang selama ini masih via Google Form.

Saya bagi menjadi **3 domain besar** sesuai permintaan:

1. **Pendaftaran & pelunasan (termasuk cicilan)**
2. **Administrasi pembayaran layanan sesuai paket**
3. **Monitoring & reporting perkembangan anak (digitalisasi Google Form)**

Di akhir, saya beri **opini arsitektural** agar tidak salah arah sejak awal.

------

# 1. Modul Pendaftaran Daycare & Pelunasan

## 1.1 Data Anak Daycare

Mirip KBTK, tapi **lebih detail pada usia dini (0–6 tahun)**.

**Data inti**

- Nomor induk daycare
- Nama anak
- Tanggal lahir (usia auto-calc, penting untuk penempatan)
- Jenis kelamin
- Tanggal mulai layanan
- Status:
  - Aktif
  - Cuti
  - Selesai
  - Keluar

**Data pendukung khusus daycare**

- Alergi makanan
- Catatan kesehatan ringan
- Kebiasaan tidur
- Catatan khusus orang tua

👉 **Opini saya:**
Field alergi & kebiasaan tidur **wajib** di daycare, tidak boleh opsional.

------

## 1.2 Data Orang Tua / Wali

Bisa **reuse 100%** dari modul KBTK:

- Ayah / Ibu / Wali
- No HP (WA aktif)
- Kontak darurat (opsional tapi penting)

Catatan: klien dari Daycare bisa jadi merupakan pelanggan dari KBTK: yakni dari KBTK, dengan paket setengah hari, sepulang sekolah sampai sore. Demikian juga sebaliknya: klien Daycare bisa jadi menjadi siswa di KBTK.

------

## 1.3 Pendaftaran Daycare

Setiap anak **harus terikat ke paket layanan**.

**Data pendaftaran**

- Anak
- Paket layanan:
  - FULLDAY
  - AFTER SCHOOL
  - HARIAN
- Usia saat masuk (auto)
- Tanggal daftar
- Tanggal mulai
- Status pendaftaran:
  - Terdaftar
  - Aktif
  - Batal

------

## 1.4 Biaya Pendaftaran & Pelunasan

Jika daycare menerapkan **uang pangkal/pendaftaran**.

**Fitur**

- Total biaya pendaftaran
- Skema pembayaran:
  - Lunas
  - Angsuran
- Riwayat pembayaran
- Sisa tagihan (auto)
- Status:
  - Belum lunas
  - Lunas

👉 **Prinsip penting:**
Sama seperti KBTK → **tagihan ≠ pembayaran**.

------

# 2. Modul Administrasi Pembayaran Layanan (Paket)

## 2.1 Master Paket Layanan

Mengacu langsung ke struktur yang Anda kirim.

**Field utama**

- Nama paket
- Rentang usia
- Jam layanan
- Sistem pembayaran:
  - Bulanan (FULLDAY, AFTER SCHOOL)
  - Harian (HARIAN)
- Harga default
- Deskripsi layanan

👉 Harga **boleh override per anak** (diskon, saudara).

------

## 2.2 Tagihan Layanan (Billing Engine Sederhana)

### A. Paket Bulanan (FULLDAY, AFTER SCHOOL)

Setiap bulan sistem membuat **tagihan otomatis**.

**Tagihan bulanan**

- Anak
- Bulan & tahun
- Paket
- Nominal
- Status:
  - Belum bayar
  - Bayar sebagian
  - Lunas

**Pembayaran**

- Tanggal
- Nominal
- Metode
- Catatan

👉 Bisa **cicil dalam bulan yang sama**.

------

### B. Paket Harian

Lebih fleksibel.

**Log kehadiran harian**

- Tanggal
- Paket harian
- Status hadir

**Tagihan**

- Bisa:
  - Dibayar langsung
  - Direkap mingguan / bulanan

👉 **Pendapat saya:**
Jangan otomatis bulanan untuk paket harian. Lebih aman **berbasis kehadiran**.

------

## 2.3 Tracking & Penunggakan

Sama seperti KBTK, tapi per paket.

**Fitur**

- Daftar anak menunggak
- Total tunggakan per anak
- Filter per paket
- Flag visual (warna)

------

## 2.4 Riwayat Keuangan Anak

Satu layar:

- Pendaftaran
- Paket bulanan
- Paket harian
- Total dibayar
- Total tunggakan

Ini **penting untuk kepercayaan orang tua**.

------

# 3. Modul Monitoring & Reporting Perkembangan Anak

(Digitalisasi Google Form)

Bagian ini **sangat strategis** karena:

- Bernilai tinggi bagi orang tua
- Membeda-kan daycare profesional vs biasa

------

## 3.1 Daily Report (Harian)

Mengambil langsung struktur Google Form yang Anda lampirkan.

### A. Perilaku Anak

Skala Likert:

- Sangat Baik → Tidak Baik
- Mood & sikap
- Interaksi dengan teman

------

### B. Aktivitas Harian

Skala:

- Sangat Pasif → Sangat Aktif
- Partisipasi belajar
- Respon bermain

------

### C. Makan & Nutrisi

Skala:

- Sangat Tidak Suka → Sangat Suka
- Makan siang
- Camilan

------

### D. Tidur Siang

Skala:

- Sangat Sulit → Sangat Mudah

------

### E. Kegiatan Hari Ini (Checklist)

- Mengaji
- Hafalan surat pendek
- Berenang
- Bermain musik
- Bermain bersama
- Gymnastic

------

### F. Catatan Guru

- Teks bebas

👉 **Opini saya:**
Form ini **sudah sangat baik**, hanya perlu:

- Tanggal
- Guru pengisi
- Anak

------

## 3.2 Riwayat & Timeline Perkembangan

Untuk orang tua & manajemen.

**Tampilan**

- Kalender / list harian
- Klik tanggal → detail laporan
- Highlight pola:
  - Sering sulit tidur
  - Makan kurang
  - Mood menurun

------

## 3.3 Ringkasan Mingguan / Bulanan

Nilai tambah besar.

**Contoh**

- Mood dominan bulan ini
- Aktivitas paling disukai
- Pola makan
- Konsistensi tidur siang

👉 **Pendapat saya:**
Ringkasan deskriptif jauh lebih berguna daripada grafik rumit.

------

## 3.4 Akses Orang Tua (Read-only)

Minimal:

- Lihat laporan harian anaknya
- Lihat riwayat
- Download PDF

------

# 4. Integrasi dengan KBTK (Level Yayasan)

Sangat saya anjurkan.

- Satu **database anak & orang tua** | note by Guntar: SEPAKAT!
- Anak bisa:
  - Daycare → KBTK
- Riwayat tetap utuh
- Laporan ke yayasan jadi mudah

------

# Ringkasan Konsep Daycare Al Muhajirin

**Administratif**

- Pendaftaran + cicilan
- Billing paket (bulanan & harian)
- Tracking tunggakan
- Riwayat pembayaran

**Operasional**

- Daily report digital
- Monitoring perkembangan
- Riwayat & ringkasan

**Strategis**

- Transparansi ke orang tua
- Standarisasi guru
- Data jangka panjang yayasan

------

## Rekomendasi Langkah Selanjutnya

Lanjutkan dengan:

1. Finalisasi **daily report schema**
2. **Skema tabel database khusus daycare**
3. **Flow guru vs admin vs orang tua**
4. Satukan **billing logic KBTK & Daycare**
5. Tentukan **MVP (fitur wajib 3 bulan)**
6. Desain UI & implementasi

