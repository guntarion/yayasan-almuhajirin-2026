# Pengaturan Sistem

## Pendahuluan

Halaman Pengaturan digunakan untuk mengelola konfigurasi dasar sistem keuangan, termasuk struktur organisasi (bidang dan unit) serta periode tahun fiskal.

**URL**: `/pengaturan`

## Struktur Menu Pengaturan

```
Pengaturan
├── Chart of Accounts     → Link ke pengelolaan kode akun
├── Tab: Kelola Bidang    → Manajemen bidang/divisi
├── Tab: Kelola Unit      → Manajemen unit kerja
└── Tab: Periode Fiskal   → Manajemen tahun anggaran
```

## Quick Link

Di bagian atas halaman terdapat quick link ke **Chart of Accounts** untuk mengelola kode akun keuangan. Lihat [panduan Chart of Accounts](./06-chart-of-accounts.md) untuk detail lebih lanjut.

---

## Kelola Bidang

### Deskripsi

Bidang adalah divisi utama dalam struktur organisasi yayasan. Setiap bidang dapat memiliki beberapa unit kerja di bawahnya.

### Daftar Bidang

Tabel bidang menampilkan:
- **Kode**: Kode unik bidang (contoh: SK, KD, SS)
- **Nama Bidang**: Nama lengkap bidang
- **Kepala Bidang**: Nama kepala bidang (opsional)
- **Status**: Aktif atau Nonaktif
- **Aksi**: Edit dan Hapus

### Tambah Bidang Baru

1. Klik tombol **Tambah Bidang**
2. Isi form dialog:
   - **Kode Bidang** (wajib): Maksimal 10 karakter, huruf kapital
   - **Nama Bidang** (wajib): Nama lengkap bidang
   - **Kepala Bidang** (opsional): Nama kepala bidang
3. Klik **Simpan**

### Edit Bidang

1. Klik ikon pensil pada baris bidang
2. Ubah data yang diperlukan
   - Kode tidak dapat diubah
3. Klik **Simpan**

### Hapus Bidang

1. Klik ikon tong sampah pada baris bidang
2. Konfirmasi penghapusan

**Catatan**: Bidang yang memiliki unit tidak dapat dihapus. Hapus atau pindahkan unit terlebih dahulu.

### Contoh Bidang

| Kode | Nama |
|------|------|
| SK | KESEKRETARIATAN |
| KD | PENDIDIKAN |
| KA | KEAGAMAAN |
| SS | SOSIAL |
| KM | KEMANUSIAAN |

---

## Kelola Unit

### Deskripsi

Unit adalah sub-divisi di bawah bidang yang bertanggung jawab untuk pelaksanaan program kerja.

### Daftar Unit

Tabel unit menampilkan:
- **Kode**: Kode unik unit (contoh: SK-SEK, KD-KBTK)
- **Nama Unit**: Nama lengkap unit
- **Bidang**: Bidang induk (kode dan nama)
- **Kepala Unit**: Nama kepala unit (opsional)
- **Status**: Aktif atau Nonaktif
- **Aksi**: Edit dan Hapus

### Tambah Unit Baru

1. Klik tombol **Tambah Unit**
2. Isi form dialog:
   - **Bidang** (wajib): Pilih bidang induk
   - **Kode Unit** (wajib): Maksimal 20 karakter
   - **Nama Unit** (wajib): Nama lengkap unit
   - **Kepala Unit** (opsional): Nama kepala unit
3. Klik **Simpan**

### Edit Unit

1. Klik ikon pensil pada baris unit
2. Ubah data yang diperlukan
   - Kode tidak dapat diubah
   - Bidang dapat diubah jika tidak ada program terkait
3. Klik **Simpan**

### Hapus Unit

1. Klik ikon tong sampah pada baris unit
2. Konfirmasi penghapusan

**Catatan**: Unit yang memiliki program tidak dapat dihapus. Nonaktifkan saja atau hapus program terlebih dahulu.

### Contoh Unit

| Kode | Nama | Bidang |
|------|------|--------|
| SK-SEK | SEKRETARIAT | KESEKRETARIATAN |
| SK-PENG | PENGADAAN | KESEKRETARIATAN |
| KD-KBTK | KBTK | PENDIDIKAN |
| KD-DAY | DAYCARE | PENDIDIKAN |
| KA-TAK | KETAKMIRAN | KEAGAMAAN |

---

## Periode Fiskal

### Deskripsi

Periode Fiskal mendefinisikan tahun anggaran yang aktif. Hanya satu periode yang dapat aktif pada satu waktu.

### Daftar Periode

Tabel periode menampilkan:
- **Tahun**: Tahun fiskal
- **Nama**: Nama periode (contoh: Tahun Anggaran 2026)
- **Periode**: Rentang tanggal (awal - akhir)
- **Status**: Draft, Aktif, atau Ditutup
- **Aksi**: Edit

### Tambah Periode Baru

1. Klik tombol **Tambah Periode**
2. Isi form dialog:
   - **Tahun** (wajib): Tahun fiskal
   - **Nama Periode** (wajib): Nama deskriptif
   - **Tanggal Mulai** (wajib): Awal periode
   - **Tanggal Akhir** (wajib): Akhir periode
3. Klik **Simpan**

### Edit Periode

1. Klik ikon pensil pada baris periode
2. Ubah data yang diperlukan
3. Klik **Simpan**

**Catatan**: Periode yang sudah ditutup tidak dapat diedit.

### Status Periode

| Status | Warna | Deskripsi |
|--------|-------|-----------|
| Draft | Kuning | Periode baru, belum aktif |
| Aktif | Hijau | Periode sedang berjalan |
| Ditutup | Abu-abu | Periode sudah selesai |

### Siklus Periode

1. **Draft**: Periode dibuat, belum aktif
2. **Aktif**: Periode diaktifkan untuk input transaksi
3. **Ditutup**: Periode selesai, tidak dapat diinput transaksi

---

## Best Practices

### Struktur Bidang & Unit

1. **Konsistensi Kode**: Gunakan format kode yang konsisten
   - Bidang: 2-3 huruf (SK, KD, KA)
   - Unit: BIDANG-UNIT (SK-SEK, KD-KBTK)

2. **Penamaan**: Gunakan nama yang jelas dan deskriptif

3. **Hierarki Logis**: Pastikan unit berada di bawah bidang yang tepat

### Periode Fiskal

1. **Satu Periode Aktif**: Hanya aktifkan satu periode pada satu waktu

2. **Tutup Periode Tepat Waktu**: Tutup periode setelah audit selesai

3. **Backup Data**: Simpan backup sebelum menutup periode

4. **Periode Standar**: Gunakan 1 Januari - 31 Desember

---

## Troubleshooting

### Tidak Bisa Hapus Bidang

- Bidang memiliki unit di bawahnya
- Pindahkan atau hapus unit terlebih dahulu

### Tidak Bisa Hapus Unit

- Unit memiliki program terkait
- Selesaikan atau hapus program terlebih dahulu

### Periode Tidak Bisa Diaktifkan

- Mungkin ada periode lain yang masih aktif
- Tutup periode sebelumnya terlebih dahulu

### Data Tidak Tersimpan

- Periksa koneksi internet
- Pastikan semua field wajib terisi
- Periksa format data (kode huruf kapital)

---

## Navigasi

- [Chart of Accounts](./06-chart-of-accounts.md) - Kelola kode akun
- [Dashboard](./01-dashboard.md) - Kembali ke ringkasan
- [Program Kerja](./02-program-kerja.md) - Kelola program
