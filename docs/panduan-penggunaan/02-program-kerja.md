# Program Kerja

## Pendahuluan

Program Kerja adalah modul untuk mengelola anggaran dan rencana kegiatan yayasan. Setiap program memiliki Rencana Anggaran Biaya (RAB) yang terdiri dari item-item dengan volume dan harga satuan.

**URL**: `/program`

## Daftar Program

### Tampilan

Halaman utama menampilkan daftar program dalam format kartu (card) dengan informasi:
- Nama dan kode program
- Status (Draft, Aktif, Selesai)
- Bidang dan unit kerja
- Progress bar realisasi
- Total anggaran dan realisasi
- Jenis (Pendapatan/Pengeluaran)

### Filter & Pencarian

| Filter | Deskripsi |
|--------|-----------|
| Pencarian | Cari berdasarkan nama atau kode program |
| Bidang | Filter berdasarkan bidang (Kesekretariatan, Keagamaan, dll) |
| Jenis | Filter berdasarkan jenis (Pendapatan/Pengeluaran) |
| Status | Filter berdasarkan status (Draft, Aktif, Selesai) |

### Aksi pada Kartu Program

| Ikon | Aksi | Deskripsi |
|------|------|-----------|
| Mata | Lihat | Lihat detail program |
| Pensil | Edit | Edit informasi program |
| Tong Sampah | Hapus | Hapus program |

## Tambah Program Baru

**URL**: `/program/new`

### Langkah-langkah

1. Klik tombol **Tambah Program** di halaman daftar program
2. Isi informasi program:
   - **Nama Program** (wajib): Nama deskriptif program
   - **Jenis Program** (wajib): Pilih Pendapatan atau Pengeluaran
   - **Bidang** (wajib): Pilih bidang yang bertanggung jawab
   - **Unit Kerja** (wajib): Pilih unit di bawah bidang
   - **Tahun Anggaran**: Tahun fiskal (default: tahun berjalan)
   - **Sifat Program**: Rutin, Proyek, Insidentil, atau Event
   - **Deskripsi** (opsional): Penjelasan detail program

3. Tambahkan item RAB:
   - **Nama Item**: Nama barang/jasa
   - **Volume**: Jumlah/kuantitas
   - **Satuan**: Unit pengukuran (unit, paket, bulan, dll)
   - **Harga Satuan**: Harga per satuan
   - **Jumlah**: Dihitung otomatis (volume x harga satuan)
   - **Kode Akun**: Pilih kode akun yang sesuai (lihat [Mapping Akun](#mapping-akun-program))

4. Klik tombol **+** untuk menambahkan item ke daftar
5. Ulangi langkah 3-4 untuk item lainnya
6. Klik **Simpan Program**

### Ringkasan Anggaran

Panel ringkasan menampilkan:
- **Jumlah Item**: Total item dalam RAB
- **Total Anggaran**: Akumulasi dari semua item
- **Kode Program**: Kode yang digenerate otomatis

### Format Kode Program

Kode program digenerate otomatis dengan format:
```
[JENIS]-[BIDANG][UNIT]-[TIMESTAMP]
```

Contoh:
- `K-SKPENG-1234` → Pengeluaran Kesekretariatan Pengadaan
- `P-KDKBTK-5678` → Pendapatan Pendidikan KBTK

## Detail Program

**URL**: `/program/[id]`

Halaman detail menampilkan:
- Informasi lengkap program
- Daftar item RAB dalam tabel
- Progress realisasi
- Histori perubahan (jika ada)

### Informasi yang Ditampilkan

| Field | Deskripsi |
|-------|-----------|
| Kode | Kode unik program |
| Nama | Nama program |
| Jenis | Pendapatan atau Pengeluaran |
| Sifat | Rutin, Proyek, Insidentil, Event |
| Bidang | Bidang yang bertanggung jawab |
| Unit | Unit kerja pelaksana |
| Status | Draft, Aktif, atau Selesai |
| Tahun | Tahun anggaran |
| Total Anggaran | Jumlah total anggaran |
| Realisasi | Jumlah yang sudah terealisasi |
| Sisa | Selisih anggaran dan realisasi |

## Edit Program

**URL**: `/program/[id]/edit`

### Langkah-langkah

1. Klik ikon pensil pada kartu program
2. Edit informasi yang diperlukan:
   - Nama program
   - Jenis, bidang, unit (jika belum ada transaksi)
   - Tahun anggaran
   - Sifat program
   - Deskripsi
3. Klik **Simpan Perubahan**

> **Catatan**: Item RAB tidak dapat diedit dari halaman ini. Perubahan item akan dikembangkan di fitur mendatang.

## Hapus Program

### Langkah-langkah

1. Klik ikon tong sampah pada kartu program
2. Konfirmasi penghapusan di dialog yang muncul
3. Klik **Hapus** untuk mengkonfirmasi

### Aturan Penghapusan

- Program yang sudah memiliki transaksi **tidak dapat dihapus**
- Jika program memiliki transaksi, nonaktifkan saja (ubah status ke Selesai)

## Tips Penggunaan

1. **Penamaan**: Gunakan nama program yang deskriptif dan konsisten
2. **Detail RAB**: Rinci item sebanyak mungkin untuk tracking lebih baik
3. **Kode Akun**: Pastikan menggunakan kode akun yang sesuai kategori (beban untuk pengeluaran, pendapatan untuk penerimaan)
4. **Monitoring**: Pantau progress realisasi secara berkala
5. **Backup**: Export data program sebelum akhir periode

## Status Program

| Status | Warna | Deskripsi |
|--------|-------|-----------|
| Draft | Abu-abu | Program baru, belum aktif |
| Aktif | Hijau | Program sedang berjalan |
| Selesai | Biru | Program sudah selesai/ditutup |

## Mapping Akun Program

**URL**: `/pengaturan/mapping-akun`

### Apa itu Mapping Akun?

Mapping akun adalah fitur untuk menghubungkan item program kerja dengan kode akun pada Chart of Accounts. Asosiasi ini penting karena:

1. **Jurnal Otomatis**: Saat transaksi dicatat menggunakan item program, sistem otomatis menggunakan kode akun yang sudah di-mapping untuk membuat jurnal entry (double-entry bookkeeping)
2. **Pelaporan Akurat**: Laporan keuangan akan menampilkan data sesuai kategori akun yang benar
3. **Konsistensi**: Memastikan semua transaksi dari item yang sama tercatat ke akun yang sama

### Mengakses Mapping Akun

1. Buka menu **Pengaturan**
2. Klik kartu **Mapping Akun Program**
3. Atau langsung ke URL `/pengaturan/mapping-akun`

### Cara Mengatur Mapping

1. Filter berdasarkan bidang, unit, atau jenis program
2. Temukan item yang ingin di-mapping
3. Klik dropdown **Kode Akun** pada baris item
4. Pilih kode akun yang sesuai:
   - **Pendapatan**: Pilih akun kategori Pendapatan (4xxx)
   - **Pengeluaran**: Pilih akun kategori Beban (5xxx)
5. Klik **Simpan** untuk menyimpan perubahan

### Rekomendasi Pemilihan Akun

| Jenis Item | Kategori Akun | Contoh |
|------------|---------------|--------|
| SPP/Uang Sekolah | Pendapatan Program (41xx) | 4101 - Pendapatan SPP |
| Infaq Jumat | Sumbangan (42xx) | 4102 - Pendapatan Infaq Jumat |
| Gaji/Honor | Beban Operasional (52xx) | 5201 - Beban Gaji |
| Pembelian ATK | Beban Operasional (52xx) | 5203 - Beban ATK |
| Kegiatan Program | Beban Program (51xx) | 5101 - Beban Program |

### Efek pada Transaksi

Ketika mapping sudah diatur, saat input transaksi:

1. Pilih **Rincian Anggaran** (item program)
2. **Preview Jurnal Entry** akan menampilkan kode akun yang akan digunakan
3. Sistem otomatis membuat jurnal:
   - **Pendapatan**: Debit Kas/Bank, Kredit akun dari mapping
   - **Pengeluaran**: Debit akun dari mapping, Kredit Kas/Bank

## Navigasi

- [Transaksi](./03-transaksi.md) - Input realisasi program
- [Laporan](./04-laporan.md) - Lihat laporan keuangan
- [Pengaturan](./05-pengaturan.md) - Kelola bidang dan unit
- [Chart of Accounts](./06-chart-of-accounts.md) - Kelola kode akun
