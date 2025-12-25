# Input Transaksi

## Pendahuluan

Modul Transaksi digunakan untuk mencatat seluruh transaksi keuangan yayasan. Setiap transaksi yang dicatat akan secara otomatis membuat jurnal akuntansi sesuai dengan kode akun yang dipilih.

**URL**: `/transaksi/input`

## Akses Input Transaksi

Ada beberapa cara untuk mengakses form input transaksi:

1. **Dari Dashboard**: Klik tombol **Input Transaksi** di header dashboard
2. **Dari Menu**: Navigasi ke Transaksi > Input Transaksi
3. **Dari Aksi Cepat**: Klik **Input Transaksi Baru** di panel aksi cepat

## Form Input Transaksi

### Field yang Tersedia

| Field | Wajib | Deskripsi |
|-------|-------|-----------|
| Tanggal Transaksi | Ya | Tanggal terjadinya transaksi |
| Jenis Transaksi | Ya | Jenis transaksi (Pendapatan/Pengeluaran) |
| Bidang | Tidak | Bidang terkait transaksi |
| Unit | Tidak | Unit kerja di bawah bidang |
| Rincian Anggaran | Tidak | Item program kerja yang terkait (lihat [di bawah](#rincian-anggaran)) |
| Jumlah (Rp) | Ya | Nominal transaksi |
| Metode Pembayaran | Ya | Kas, Bank, Transfer, dll |
| Deskripsi | Ya | Keterangan singkat transaksi |
| Nama Pihak Terkait | Tidak | Nama supplier, donatur, dll |
| Catatan | Tidak | Informasi tambahan (opsional) |

### Langkah-langkah Input

1. **Isi Tanggal Transaksi**
   - Default: tanggal hari ini
   - Dapat diubah sesuai tanggal aktual transaksi

2. **Pilih Jenis Transaksi**
   - Pendapatan: Penerimaan kas/bank
   - Pengeluaran: Pembayaran kas/bank

3. **Pilih Bidang dan Unit**
   - Pilih bidang terlebih dahulu
   - Pilih unit akan muncul sesuai bidang yang dipilih

4. **Masukkan Jumlah**
   - Nominal dalam Rupiah
   - Tanpa titik atau koma (angka saja)

5. **Pilih Metode Pembayaran**
   - Kas: Pembayaran tunai
   - Bank: Transfer atau cek

6. **Isi Deskripsi**
   - Keterangan jelas tentang transaksi
   - Contoh: "SPP KBTK Januari 2026", "Gaji Guru Desember"

7. **Tambahkan Catatan (Opsional)**
   - Informasi tambahan jika diperlukan
   - Contoh: "Pembayaran untuk 25 siswa"

8. **Simpan Transaksi**
   - Klik tombol **Simpan Transaksi**
   - Sistem akan memproses dan membuat jurnal

## Jenis Transaksi

### Pendapatan

| Jenis | Contoh |
|-------|--------|
| SPP/Uang Sekolah | SPP KBTK, Daycare |
| Infaq | Infaq Jumat, Infaq Ramadhan |
| Sumbangan | Donasi pembangunan |
| Zakat | Zakat fitrah, Zakat mal |
| Hasil Usaha | Pendapatan kolam renang |

### Pengeluaran

| Jenis | Contoh |
|-------|--------|
| Gaji & Honor | Gaji guru, Honor pengajar |
| Operasional | Listrik, Air, Internet |
| Pembelian | ATK, Perlengkapan |
| Pemeliharaan | Perbaikan gedung |
| Program | Kegiatan Ramadhan |

## Metode Pembayaran

| Metode | Kode | Deskripsi |
|--------|------|-----------|
| Kas | cash | Pembayaran tunai |
| Bank Transfer | bank | Transfer antar bank |
| QRIS | qris | Pembayaran via QR |
| E-Wallet | ewallet | OVO, GoPay, dll |

## Validasi Input

Sistem akan memvalidasi input sebelum menyimpan:

- Tanggal tidak boleh kosong
- Jenis transaksi harus dipilih
- Bidang dan unit harus dipilih
- Jumlah harus lebih dari 0
- Deskripsi tidak boleh kosong

Jika ada validasi yang gagal, akan muncul pesan error dan form tidak akan tersimpan.

## Rincian Anggaran

**Rincian Anggaran** adalah fitur untuk menghubungkan transaksi dengan item program kerja. Fitur ini opsional namun sangat direkomendasikan karena:

1. **Tracking Realisasi**: Realisasi anggaran per item program akan terupdate otomatis
2. **Kode Akun Otomatis**: Sistem menggunakan kode akun dari item program untuk jurnal
3. **Pelaporan**: Memudahkan analisis realisasi per program kerja

### Cara Menggunakan Rincian Anggaran

1. Pilih **Jenis Transaksi** terlebih dahulu
2. Pilih **Bidang** kemudian **Unit**
3. Dropdown **Rincian Anggaran** akan menampilkan item yang sesuai:
   - Untuk Pendapatan: menampilkan item program pendapatan
   - Untuk Pengeluaran: menampilkan item program pengeluaran
4. Pilih item yang sesuai
5. Informasi item akan ditampilkan:
   - Anggaran total
   - Realisasi saat ini
   - Sisa anggaran
   - Progress (%)
   - **Kode Akun** yang akan digunakan

## Preview Jurnal Entry

Setelah memilih jenis transaksi, form akan menampilkan **Preview Jurnal Entry** yang menunjukkan:

### Untuk Pendapatan (Kas Masuk)

| Akun | Sisi |
|------|------|
| Kas/Bank (sesuai metode pembayaran) | **DEBIT** |
| Akun Pendapatan (dari rincian anggaran atau default 4190) | **KREDIT** |

### Untuk Pengeluaran (Kas Keluar)

| Akun | Sisi |
|------|------|
| Akun Beban (dari rincian anggaran atau default 5290) | **DEBIT** |
| Kas/Bank (sesuai metode pembayaran) | **KREDIT** |

### Akun Default

Jika tidak memilih Rincian Anggaran:
- **Pendapatan**: 4190 - Pendapatan Lain-lain
- **Pengeluaran**: 5290 - Beban Lain-lain
- **Kas**: 1101 - Kas
- **Bank**: 1102 - Bank Rekening Umum

> **Tips**: Untuk pencatatan yang lebih akurat, selalu gunakan Rincian Anggaran dan pastikan item program sudah di-mapping ke kode akun yang tepat. Lihat [Mapping Akun Program](./02-program-kerja.md#mapping-akun-program).

## Setelah Transaksi Tersimpan

Setelah transaksi berhasil disimpan:

1. Jurnal akuntansi (double-entry) dibuat secara otomatis
2. Saldo kas/bank diperbarui sesuai metode pembayaran
3. Jika menggunakan Rincian Anggaran, realisasi item program diperbarui
4. Laporan keuangan diperbarui
5. User diarahkan ke daftar transaksi

## Daftar Transaksi

**URL**: `/transaksi`

Halaman daftar transaksi menampilkan:
- Semua transaksi yang sudah tercatat
- Filter berdasarkan periode, bidang, unit
- Pencarian berdasarkan deskripsi
- Detail setiap transaksi

## Tips Penggunaan

1. **Catat Segera**: Input transaksi sesegera mungkin setelah terjadi
2. **Deskripsi Jelas**: Gunakan deskripsi yang jelas dan konsisten
3. **Verifikasi**: Periksa kembali nominal sebelum menyimpan
4. **Bukti Transaksi**: Simpan bukti fisik/digital untuk audit
5. **Periode**: Pastikan tanggal sesuai periode fiskal yang aktif

## Troubleshooting

### Transaksi Tidak Tersimpan

- Periksa koneksi internet
- Pastikan semua field wajib terisi
- Pastikan nominal dalam format angka

### Salah Input Transaksi

- Hubungi admin untuk koreksi
- Transaksi tidak dapat dihapus langsung oleh user biasa

### Bidang/Unit Tidak Muncul

- Mungkin belum diaktifkan di Pengaturan
- Hubungi admin untuk mengaktifkan

## Navigasi

- [Dashboard](./01-dashboard.md) - Kembali ke dashboard
- [Program Kerja](./02-program-kerja.md) - Lihat program terkait
- [Laporan](./04-laporan.md) - Lihat laporan keuangan
