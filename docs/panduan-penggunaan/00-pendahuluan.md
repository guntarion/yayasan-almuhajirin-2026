# Panduan Penggunaan Modul Keuangan

## Pendahuluan

Modul Keuangan Yayasan Al Muhajirin adalah sistem manajemen keuangan berbasis web yang dirancang sesuai dengan standar akuntansi nirlaba Indonesia (PSAK 45 / ISAK 35). Modul ini dapat diakses melalui subdomain `keuangan.muhajirinrewwin.or.id`.

## Fitur Utama

| Fitur | Deskripsi |
|-------|-----------|
| Dashboard | Ringkasan keuangan dan metrik utama |
| Program Kerja | Pengelolaan program kerja dan anggaran (RAB) |
| Transaksi | Pencatatan transaksi keuangan |
| Laporan | Laporan keuangan (Neraca, Aktivitas, Arus Kas) |
| Pengaturan | Konfigurasi sistem (Bidang, Unit, Periode Fiskal) |
| Chart of Accounts | Pengelolaan kode akun keuangan |

## Struktur Menu

```
Keuangan
├── Dashboard         → Ringkasan & metrik keuangan
├── Program Kerja    → Daftar program & RAB
│   ├── Daftar       → List program
│   ├── Tambah       → Buat program baru
│   └── Detail/Edit  → Lihat/edit program
├── Transaksi        → Input transaksi
├── Laporan          → Laporan keuangan
│   ├── Neraca       → Laporan Posisi Keuangan
│   ├── Aktivitas    → Laporan Aktivitas
│   └── Arus Kas     → Laporan Arus Kas
└── Pengaturan       → Konfigurasi sistem
    ├── Bidang       → Kelola bidang/divisi
    ├── Unit         → Kelola unit kerja
    ├── Periode      → Periode tahun fiskal
    └── Chart of Accounts → Kode akun
```

## Akses Modul

### Development
```
http://keuangan.localhost:3000
```

### Production
```
https://keuangan.muhajirinrewwin.or.id
```

## Standar Akuntansi

Modul ini mengikuti standar akuntansi yang berlaku untuk organisasi nirlaba di Indonesia:

- **PSAK 45**: Pelaporan Keuangan Entitas Nirlaba
- **ISAK 35**: Penyajian Laporan Keuangan Entitas Berorientasi Nonlaba

### Kategori Akun

| Kategori | Deskripsi | Normal Balance |
|----------|-----------|----------------|
| Aset | Harta yang dimiliki | Debit |
| Kewajiban | Hutang/liability | Kredit |
| Aset Bersih | Ekuitas/modal | Kredit |
| Pendapatan | Penerimaan | Kredit |
| Beban | Pengeluaran | Debit |

### Jenis Pembatasan Aset Bersih

1. **Tanpa Pembatasan**: Dana yang dapat digunakan untuk tujuan umum
2. **Pembatasan Temporer**: Dana yang dibatasi penggunaannya untuk waktu tertentu
3. **Pembatasan Permanen**: Dana yang dibatasi secara permanen (endowment)

## Daftar Panduan

1. [Dashboard](./01-dashboard.md) - Memahami ringkasan keuangan
2. [Program Kerja](./02-program-kerja.md) - Mengelola program dan anggaran
3. [Transaksi](./03-transaksi.md) - Mencatat transaksi keuangan
4. [Laporan](./04-laporan.md) - Menghasilkan laporan keuangan
5. [Pengaturan](./05-pengaturan.md) - Mengkonfigurasi sistem
6. [Chart of Accounts](./06-chart-of-accounts.md) - Mengelola kode akun

## Persyaratan Sistem

- Browser modern (Chrome, Firefox, Safari, Edge)
- Koneksi internet stabil
- Resolusi layar minimal 1280x720
- Akun dengan akses ke modul keuangan

## Bantuan

Jika mengalami kendala, silakan hubungi:
- Tim IT Yayasan Al Muhajirin
- Email: it@muhajirinrewwin.or.id
