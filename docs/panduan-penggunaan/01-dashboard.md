# Dashboard Keuangan

## Akses

Dashboard dapat diakses melalui halaman utama modul keuangan setelah login.

**URL**: `/` atau `/keuangan` (dari subdomain keuangan)

## Tampilan Dashboard

### 1. Header

Bagian atas halaman menampilkan:
- Judul "Dashboard Keuangan"
- Subjudul "Ringkasan keuangan Yayasan Al Muhajirin"
- Tombol **Input Transaksi** untuk akses cepat ke pencatatan transaksi

### 2. Kartu Metrik Utama

Empat kartu metrik menampilkan ringkasan posisi keuangan:

| Kartu | Deskripsi | Warna |
|-------|-----------|-------|
| Kas & Bank | Saldo kas dan bank saat ini | Biru Cyan |
| Total Pendapatan | Akumulasi pendapatan tahun berjalan | Hijau |
| Total Beban | Akumulasi beban/pengeluaran tahun berjalan | Oranye |
| Surplus/Defisit | Selisih pendapatan dan beban | Hijau (surplus) / Merah (defisit) |

Setiap kartu menampilkan:
- Nama metrik
- Nilai dalam Rupiah
- Perbandingan dengan periode sebelumnya (jika tersedia)

### 3. Ringkasan Bulanan

Tiga kartu kecil menampilkan data bulan berjalan:

1. **Pendapatan Bulan Ini**
   - Total pendapatan bulan ini
   - Progress bar persentase dari target

2. **Beban Bulan Ini**
   - Total beban bulan ini
   - Progress bar persentase dari anggaran

3. **Realisasi Program**
   - Persentase realisasi program kerja
   - Progress bar visual

### 4. Transaksi Terbaru

Tabel yang menampilkan 5 transaksi terakhir dengan informasi:
- Ikon (panah hijau untuk pendapatan, oranye untuk pengeluaran)
- Deskripsi transaksi
- Tanggal dan unit terkait
- Nominal (positif/negatif)
- Kode transaksi

Klik **Lihat Semua** untuk melihat daftar lengkap transaksi.

### 5. Aksi Cepat

Panel navigasi cepat ke fitur-fitur utama:
- Input Transaksi Baru
- Lihat Neraca
- Laporan Aktivitas
- Daftar Program Kerja

### 6. Ringkasan Per Bidang

Menampilkan realisasi anggaran untuk setiap bidang:
- Nama bidang
- Persentase realisasi
- Progress bar berwarna

Bidang yang ditampilkan:
- Kesekretariatan
- Keagamaan
- Sosial
- Kemanusiaan

## Fitur Interaktif

### Navigasi

Klik pada:
- Kartu metrik → Detail laporan terkait
- Baris transaksi → Detail transaksi
- Tombol aksi cepat → Halaman tujuan

### Refresh Data

Data dashboard diperbarui setiap kali halaman dimuat. Untuk memperbarui:
1. Refresh halaman browser (F5 atau Ctrl+R)
2. Atau navigasi ke halaman lain dan kembali

## Format Angka

- **Nilai besar**: Disingkat (contoh: Rp 2,85M untuk Rp 2.850.000.000)
- **Nilai detail**: Format lengkap dengan pemisah ribuan
- **Tanggal**: Format Indonesia (DD/MM/YYYY)

## Tips Penggunaan

1. **Monitoring Harian**: Periksa dashboard setiap pagi untuk memantau kas
2. **Realisasi Program**: Perhatikan persentase realisasi untuk evaluasi
3. **Trend Keuangan**: Bandingkan surplus/defisit dengan periode sebelumnya
4. **Transaksi Terbaru**: Verifikasi transaksi terakhir yang dicatat

## Navigasi Selanjutnya

- [Program Kerja](./02-program-kerja.md) - Kelola program dan anggaran
- [Transaksi](./03-transaksi.md) - Input transaksi baru
- [Laporan](./04-laporan.md) - Lihat laporan keuangan lengkap
