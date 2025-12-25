# Laporan Keuangan

## Pendahuluan

Modul Laporan menyediakan laporan keuangan sesuai standar akuntansi nirlaba (PSAK 45 / ISAK 35). Tersedia tiga jenis laporan utama yang dapat dihasilkan.

**URL**: `/laporan`

## Jenis Laporan

| Laporan | Deskripsi | Standar |
|---------|-----------|---------|
| Neraca (Posisi Keuangan) | Posisi aset, kewajiban, dan aset bersih | Statement of Financial Position |
| Aktivitas | Pendapatan, beban, dan perubahan aset bersih | Statement of Activities |
| Arus Kas | Penerimaan dan pengeluaran kas | Statement of Cash Flows |

---

## Laporan Neraca (Posisi Keuangan)

**URL**: `/laporan/neraca`

### Deskripsi

Laporan Neraca menampilkan posisi keuangan yayasan pada tanggal tertentu, mencakup:
- Total Aset yang dimiliki
- Total Kewajiban (hutang)
- Total Aset Bersih (ekuitas)

### Struktur Laporan

#### Aset

| Kategori | Contoh Akun |
|----------|-------------|
| Aset Lancar | Kas, Bank, Piutang |
| Aset Tetap | Tanah, Gedung, Peralatan |

#### Kewajiban

| Kategori | Contoh Akun |
|----------|-------------|
| Jangka Pendek | Hutang usaha, Pendapatan diterima di muka |
| Jangka Panjang | Hutang bank jangka panjang |

#### Aset Bersih

| Kategori | Deskripsi |
|----------|-----------|
| Tanpa Pembatasan | Dana bebas yang dapat digunakan untuk tujuan umum |
| Pembatasan Temporer | Dana yang dibatasi untuk waktu/tujuan tertentu |
| Pembatasan Permanen | Dana abadi (endowment) |

### Indikator Neraca

- **Neraca Seimbang**: Total Aset = Total Kewajiban + Aset Bersih (hijau)
- **Neraca Tidak Seimbang**: Ada selisih yang perlu diperiksa (merah)

### Filter Laporan

| Filter | Opsi |
|--------|------|
| Tahun | 2024, 2025, 2026, dll |
| Bulan | Tahunan atau bulanan (Jan-Des) |

### Fitur

- **Cetak**: Mencetak laporan dengan format siap print
- **Export**: Download dalam format lain (mendatang)

---

## Laporan Aktivitas

**URL**: `/laporan/aktivitas`

### Deskripsi

Laporan Aktivitas menampilkan pendapatan dan beban selama periode tertentu, serta perubahan aset bersih.

### Struktur Laporan

#### Pendapatan

| Kategori | Contoh |
|----------|--------|
| Tanpa Pembatasan | SPP, Infaq rutin |
| Pembatasan Temporer | Donasi khusus program |
| Pembatasan Permanen | Dana abadi |

#### Beban

| Kategori | Contoh |
|----------|--------|
| Beban Program | Kegiatan program kerja |
| Beban Operasional | Gaji, utilitas, administrasi |

#### Perubahan Aset Bersih

Menampilkan selisih pendapatan dan beban per kategori:
- Perubahan Tanpa Pembatasan
- Perubahan Pembatasan Temporer
- Perubahan Pembatasan Permanen
- **Total Perubahan Aset Bersih**

### Kartu Ringkasan

Tiga kartu di bagian atas menampilkan:
1. **Total Pendapatan** (hijau)
2. **Total Beban** (merah)
3. **Perubahan Aset Bersih** (biru/oranye)

### Ringkasan Program Kerja

Tabel yang menampilkan realisasi program:
- Kode dan nama program
- Unit pelaksana
- Anggaran vs Realisasi
- Progress bar persentase

---

## Laporan Arus Kas

**URL**: `/laporan/arus-kas`

### Deskripsi

Laporan Arus Kas menampilkan pergerakan kas masuk dan keluar berdasarkan aktivitas.

### Struktur Laporan

#### Aktivitas Operasional

| Arus Masuk | Arus Keluar |
|------------|-------------|
| Penerimaan SPP | Pembayaran gaji |
| Penerimaan donasi | Pembayaran utilitas |
| Penerimaan infaq | Pembelian perlengkapan |

#### Aktivitas Investasi

| Arus Masuk | Arus Keluar |
|------------|-------------|
| Penjualan aset tetap | Pembelian aset tetap |
| Pencairan deposito | Penempatan deposito |

#### Aktivitas Pendanaan

| Arus Masuk | Arus Keluar |
|------------|-------------|
| Penerimaan pinjaman | Pembayaran pinjaman |
| Penerimaan hibah | - |

### Ringkasan Arus Kas

| Item | Deskripsi |
|------|-----------|
| Kas Awal | Saldo kas awal periode |
| Kenaikan/Penurunan | Total perubahan kas |
| Kas Akhir | Saldo kas akhir periode |

---

## Cara Menggunakan Laporan

### 1. Pilih Periode

1. Pilih tahun dari dropdown
2. Pilih bulan (opsional, default: tahunan)
3. Laporan akan diperbarui otomatis

### 2. Mencetak Laporan

1. Klik tombol **Cetak**
2. Dialog print browser akan muncul
3. Pilih printer atau Save as PDF
4. Elemen navigasi akan disembunyikan saat print

### 3. Export Laporan

1. Klik tombol **Export** (fitur mendatang)
2. Pilih format (PDF, Excel)
3. File akan didownload

## Interpretasi Laporan

### Neraca

- **Aset > Kewajiban**: Kondisi keuangan sehat
- **Aset < Kewajiban**: Perlu evaluasi
- **Neraca tidak seimbang**: Ada kesalahan pencatatan

### Aktivitas

- **Surplus (positif)**: Pendapatan > Beban
- **Defisit (negatif)**: Pendapatan < Beban
- **Evaluasi program**: Perhatikan realisasi vs anggaran

### Arus Kas

- **Arus kas positif**: Kas masuk > keluar
- **Arus kas negatif**: Kas keluar > masuk
- **Perhatikan aktivitas**: Operasional harus positif

## Tips Penggunaan

1. **Rutin Review**: Lihat laporan minimal bulanan
2. **Bandingkan Periode**: Lihat trend dari waktu ke waktu
3. **Cetak Berkala**: Simpan hardcopy untuk dokumentasi
4. **Analisis Varian**: Bandingkan anggaran vs realisasi
5. **Audit Trail**: Simpan laporan sebagai bukti audit

## Troubleshooting

### Data Tidak Muncul

- Pastikan ada transaksi di periode tersebut
- Coba refresh halaman
- Periksa filter yang aktif

### Neraca Tidak Balance

- Periksa transaksi terakhir
- Pastikan jurnal lengkap (debit = kredit)
- Hubungi admin untuk koreksi

### Laporan Loading Lama

- Tunggu hingga selesai (data besar)
- Coba gunakan filter bulan spesifik
- Refresh halaman jika stuck

## Navigasi

- [Dashboard](./01-dashboard.md) - Lihat ringkasan
- [Program Kerja](./02-program-kerja.md) - Detail program
- [Pengaturan](./05-pengaturan.md) - Konfigurasi periode
