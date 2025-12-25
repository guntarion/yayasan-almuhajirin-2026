# Chart of Accounts (Kode Akun)

## Pendahuluan

Chart of Accounts (Bagan Akun) adalah daftar semua akun yang digunakan dalam sistem akuntansi yayasan. Setiap akun memiliki kode unik, nama, kategori, dan saldo normal.

**URL**: `/pengaturan/akun`

## Struktur Kode Akun

### Format Penomoran

Sistem menggunakan penomoran 5 digit:

| Digit | Arti | Contoh |
|-------|------|--------|
| 1 | Kategori | 1 = Aset |
| 2 | Sub-kategori | 11 = Aset Lancar |
| 3-5 | Nomor urut | 001-999 |

### Contoh Kode

| Kode | Nama | Kategori |
|------|------|----------|
| 11101 | Kas Yayasan | Aset Lancar |
| 11201 | Bank BRI | Aset Lancar |
| 21101 | Hutang Usaha | Kewajiban Jangka Pendek |
| 31101 | Aset Bersih Tidak Terikat | Aset Bersih |
| 41101 | Pendapatan SPP | Pendapatan |
| 51101 | Beban Gaji | Beban |

---

## Kategori Akun

### 1. Aset (1xxxx)

Harta yang dimiliki yayasan.

| Sub-kategori | Range | Contoh |
|--------------|-------|--------|
| Aset Lancar | 11xxx | Kas, Bank, Piutang |
| Aset Tetap | 12xxx | Tanah, Gedung, Kendaraan |
| Aset Lainnya | 13xxx | Deposito, Investasi |

**Normal Balance**: Debit

### 2. Kewajiban (2xxxx)

Hutang/liabilitas yayasan.

| Sub-kategori | Range | Contoh |
|--------------|-------|--------|
| Jangka Pendek | 21xxx | Hutang usaha, Pendapatan diterima dimuka |
| Jangka Panjang | 22xxx | Hutang bank |

**Normal Balance**: Kredit

### 3. Aset Bersih (3xxxx)

Ekuitas/modal yayasan (PSAK 45).

| Sub-kategori | Range | Deskripsi |
|--------------|-------|-----------|
| Tanpa Pembatasan | 31xxx | Dana bebas |
| Pembatasan Temporer | 32xxx | Dana terbatas waktu |
| Pembatasan Permanen | 33xxx | Dana abadi |

**Normal Balance**: Kredit

### 4. Pendapatan (4xxxx)

Penerimaan yayasan.

| Sub-kategori | Range | Contoh |
|--------------|-------|--------|
| Pendapatan Program | 41xxx | SPP, Uang kegiatan |
| Sumbangan | 42xxx | Infaq, Donasi |
| Pendapatan Lainnya | 43xxx | Hasil usaha |

**Normal Balance**: Kredit

### 5. Beban (5xxxx)

Pengeluaran/biaya yayasan.

| Sub-kategori | Range | Contoh |
|--------------|-------|--------|
| Beban Program | 51xxx | Beban kegiatan |
| Beban Operasional | 52xxx | Gaji, Listrik, ATK |
| Beban Lainnya | 53xxx | Beban bank, Penyusutan |

**Normal Balance**: Debit

---

## Mengelola Akun

### Daftar Akun

Halaman utama menampilkan tabel dengan kolom:
- **Kode**: Kode akun (5 digit)
- **Nama Akun**: Nama deskriptif
- **Kategori**: Aset, Kewajiban, dll
- **Balance**: Debit atau Kredit
- **Status**: Aktif atau Nonaktif
- **Aksi**: Edit, Hapus/Restore

### Filter Pencarian

| Filter | Deskripsi |
|--------|-----------|
| Pencarian | Cari berdasarkan kode atau nama |
| Kategori | Filter berdasarkan kategori akun |
| Balance | Filter berdasarkan normal balance |
| Tampilkan Nonaktif | Checkbox untuk menampilkan akun nonaktif |

### Tombol Reset

Klik **Reset** untuk menghapus semua filter dan menampilkan semua akun aktif.

---

## Tambah Akun Baru

### Langkah-langkah

1. Klik tombol **Tambah Akun**
2. Isi form dialog:

| Field | Wajib | Deskripsi |
|-------|-------|-----------|
| Kode Akun | Ya | 5 digit, unik |
| Nama Akun | Ya | Nama deskriptif |
| Kategori | Ya | Pilih dari 5 kategori |
| Sub Kategori | Tidak | Keterangan tambahan |
| Normal Balance | Ya | Debit atau Kredit |
| Deskripsi | Tidak | Penjelasan akun |
| Contra Account | Tidak | Centang jika contra |
| Terbatas | Tidak | Centang jika restricted |
| Aktif | Ya | Default: aktif |

3. Jika **Terbatas** dicentang, pilih **Tipe Pembatasan**:
   - Temporer: Waktu terbatas
   - Permanen: Tidak terbatas waktu

4. Klik **Simpan**

### Aturan Penomoran

- Gunakan format yang konsisten dengan kategori
- Aset: mulai dengan 1
- Kewajiban: mulai dengan 2
- Aset Bersih: mulai dengan 3
- Pendapatan: mulai dengan 4
- Beban: mulai dengan 5

---

## Edit Akun

### Langkah-langkah

1. Klik ikon pensil pada baris akun
2. Ubah data yang diperlukan:
   - **Kode tidak dapat diubah**
   - Nama dapat diubah
   - Kategori dapat diubah
   - Balance dapat diubah
3. Klik **Simpan**

### Batasan Edit

- Kode akun tidak dapat diubah setelah dibuat
- Akun yang sudah memiliki transaksi, kategori tidak dapat diubah

---

## Nonaktifkan/Hapus Akun

### Nonaktifkan (Soft Delete)

1. Klik ikon tong sampah pada baris akun aktif
2. Konfirmasi di dialog
3. Klik **Nonaktifkan**

Akun akan dinonaktifkan (tidak dihapus permanen):
- Tidak muncul di dropdown transaksi
- Data histori tetap ada
- Dapat diaktifkan kembali

### Aktifkan Kembali (Restore)

1. Centang **Tampilkan Nonaktif** pada filter
2. Cari akun yang nonaktif
3. Klik ikon restore (panah melingkar)
4. Akun akan aktif kembali

---

## Akun Khusus

### Contra Account

Akun yang mengurangi saldo akun utama:
- Akumulasi Penyusutan (contra dari Aset Tetap)
- Diskon Penjualan (contra dari Pendapatan)

Cara menandai:
1. Centang **Contra Account** saat tambah/edit
2. Akan ditampilkan dengan label "Contra"
3. Warna berbeda di laporan

### Akun Terbatas (Restricted)

Untuk dana dengan pembatasan penggunaan:

| Tipe | Deskripsi | Contoh |
|------|-----------|--------|
| Temporer | Terbatas waktu/tujuan | Dana Ramadhan 2026 |
| Permanen | Tidak bisa digunakan pokok | Dana Abadi/Endowment |

---

## Best Practices

### Penamaan Akun

1. **Konsisten**: Gunakan format yang sama
2. **Deskriptif**: Nama jelas dan mudah dipahami
3. **Singkat**: Tidak terlalu panjang
4. **Tanpa Singkatan**: Hindari singkatan yang tidak umum

### Pengelolaan

1. **Jangan Hapus**: Nonaktifkan saja, jangan hapus
2. **Review Berkala**: Periksa akun tidak terpakai
3. **Dokumentasi**: Catat perubahan kode akun
4. **Backup**: Simpan daftar akun secara berkala

### Kesalahan Umum

| Kesalahan | Solusi |
|-----------|--------|
| Kategori salah | Edit akun, ubah kategori |
| Duplikat kode | Gunakan kode berbeda |
| Normal balance salah | Edit dan perbaiki |
| Nama tidak jelas | Ubah nama lebih deskriptif |

---

## Troubleshooting

### Akun Tidak Muncul di Transaksi

- Akun mungkin nonaktif
- Periksa filter di Chart of Accounts
- Aktifkan kembali jika perlu

### Tidak Bisa Hapus Akun

- Akun sudah digunakan di transaksi
- Nonaktifkan saja (soft delete)

### Laporan Tidak Balance

- Periksa normal balance akun
- Pastikan debit = kredit di jurnal
- Koreksi transaksi yang salah

### Data Tidak Tersimpan

- Periksa koneksi internet
- Pastikan kode unik
- Isi semua field wajib

---

## Referensi PSAK 45 / ISAK 35

### Klasifikasi Aset Bersih

| Klasifikasi | Deskripsi |
|-------------|-----------|
| Tanpa Pembatasan | Dana yang dapat digunakan untuk tujuan umum organisasi |
| Dengan Pembatasan Temporer | Dana yang dibatasi oleh pemberi untuk waktu atau tujuan tertentu |
| Dengan Pembatasan Permanen | Dana yang dibatasi secara permanen oleh pemberi |

### Catatan

Standar PSAK 45 telah dicabut dan diganti dengan ISAK 35, namun konsep klasifikasi aset bersih tetap berlaku.

---

## Penggunaan Akun dalam Program Kerja

### Mapping Akun Program

Setiap item dalam program kerja dapat dihubungkan (di-mapping) ke kode akun yang sesuai. Mapping ini penting karena:

1. **Jurnal Otomatis**: Saat transaksi menggunakan item program, sistem otomatis menggunakan kode akun yang di-mapping
2. **Pelaporan Akurat**: Laporan keuangan menampilkan data sesuai kategori akun
3. **Konsistensi**: Transaksi dari item yang sama selalu tercatat ke akun yang sama

### Cara Melakukan Mapping

Ada dua cara untuk mengatur mapping akun:

#### 1. Melalui Halaman Mapping Akun (Direkomendasikan)

**URL**: `/pengaturan/mapping-akun`

1. Buka menu **Pengaturan** > **Mapping Akun Program**
2. Filter berdasarkan bidang, unit, atau jenis program
3. Pilih kode akun dari dropdown untuk setiap item
4. Klik **Simpan Perubahan**

Lihat [Mapping Akun Program](./02-program-kerja.md#mapping-akun-program) untuk panduan lengkap.

#### 2. Saat Membuat/Edit Item Program

1. Buka halaman edit program kerja
2. Pada setiap item RAB, pilih **Kode Akun** yang sesuai
3. Simpan program

### Rekomendasi Pemilihan Akun

| Jenis Transaksi | Kategori Akun | Range Kode |
|-----------------|---------------|------------|
| Pendapatan SPP/Sekolah | Pendapatan Program | 41xxx |
| Infaq/Sumbangan | Sumbangan | 42xxx |
| Hasil Usaha | Pendapatan Lainnya | 43xxx |
| Beban Kegiatan | Beban Program | 51xxx |
| Gaji/Honor | Beban Operasional | 52xxx |
| ATK/Pembelian | Beban Operasional | 52xxx |
| Beban Lain-lain | Beban Lainnya | 53xxx |

### Akun Default

Jika item program tidak di-mapping ke akun tertentu, sistem menggunakan akun default:

| Jenis | Kode Default | Nama Akun |
|-------|--------------|-----------|
| Pendapatan | 4190 | Pendapatan Lain-lain |
| Pengeluaran | 5290 | Beban Lain-lain |
| Kas | 1101 | Kas |
| Bank | 1102 | Bank Rekening Umum |

> **Tips**: Untuk pencatatan yang lebih akurat, selalu lakukan mapping akun untuk setiap item program kerja. Gunakan halaman Mapping Akun Program untuk mengelola semua mapping secara terpusat.

---

## Navigasi

- [Pengaturan](./05-pengaturan.md) - Kembali ke pengaturan
- [Program Kerja](./02-program-kerja.md) - Kelola program dan mapping
- [Transaksi](./03-transaksi.md) - Input transaksi
- [Laporan](./04-laporan.md) - Lihat laporan keuangan
