# Dokumentasi Implementasi Modul Administratif Daycare Al Muhajirin

## Ringkasan

Modul Administratif Daycare Al Muhajirin adalah sistem manajemen terpadu untuk layanan penitipan anak (daycare) yang mencakup pengelolaan data anak, pendaftaran, pembayaran, kehadiran, dan laporan perkembangan harian.

**Tanggal Implementasi:** 2025-12-31
**Status:** Selesai
**Akses:** `daycare.localhost:3000/kelola` (development) | `daycare.muhajirinrewwin.or.id/kelola` (production)

---

## Fitur Utama

### 1. Tiga Paket Layanan
- **FULLDAY**: Layanan penitipan penuh (07:00 - 17:00 WIB)
- **AFTER_SCHOOL**: Layanan setelah sekolah (setelah jam sekolah - 17:00 WIB)
- **HARIAN**: Layanan fleksibel dengan pembayaran per kehadiran

### 2. Dual Billing System
- **Tagihan Bulanan**: Untuk paket FULLDAY dan AFTER_SCHOOL
- **Tagihan Harian**: Untuk paket HARIAN berdasarkan kehadiran

### 3. Daily Report (Laporan Perkembangan Harian)
Digitalisasi sistem pelaporan yang sebelumnya menggunakan Google Form:
- Penilaian perilaku dengan skala Likert (1-5)
- Penilaian aktivitas, makan, dan tidur
- Checklist kegiatan harian
- Catatan guru

---

## Struktur Database

### Enums
| Enum | Nilai |
|------|-------|
| DaycarePaketLayanan | FULLDAY, AFTER_SCHOOL, HARIAN |
| DaycareStatusAnak | aktif, cuti, selesai, keluar |
| DaycareStatusPendaftaran | terdaftar, aktif, batal |
| DaycareSchemaPembayaran | lunas, angsuran |
| DaycareStatusTagihan | belum_bayar, bayar_sebagian, lunas |
| DaycareMetodePembayaran | cash, transfer |
| DaycareRelasi | ayah, ibu, wali |

### Models
| Model | Deskripsi |
|-------|-----------|
| DaycareAnak | Data anak dengan info kesehatan (alergi, catatan kesehatan, kebiasaan tidur) |
| DaycareOrangTua | Data orang tua/wali (multi-wali per anak) |
| DaycarePaket | Master paket layanan dengan harga default |
| DaycarePendaftaran | Pendaftaran anak baru |
| DaycarePembayaranPendaftaran | Pembayaran biaya pendaftaran (bisa cicil) |
| DaycareTagihanBulanan | Tagihan bulanan untuk FULLDAY/AFTER_SCHOOL |
| DaycarePembayaranBulanan | Pembayaran tagihan bulanan |
| DaycareKehadiranHarian | Log kehadiran untuk paket HARIAN |
| DaycareTagihanHarian | Tagihan harian untuk paket HARIAN |
| DaycarePembayaranHarian | Pembayaran tagihan harian |
| DaycareDailyReport | Laporan perkembangan anak harian |

---

## API Endpoints

### Anak
- `GET /api/daycare/anak` - List anak dengan filter (paket, status, search)
- `POST /api/daycare/anak` - Tambah anak baru
- `GET /api/daycare/anak/[id]` - Detail anak dengan relasi
- `PUT /api/daycare/anak/[id]` - Update data anak
- `DELETE /api/daycare/anak/[id]` - Hapus anak (soft delete via status)

### Orang Tua
- `GET /api/daycare/orang-tua` - List orang tua
- `POST /api/daycare/orang-tua` - Tambah orang tua
- `GET /api/daycare/orang-tua/[id]` - Detail orang tua
- `PUT /api/daycare/orang-tua/[id]` - Update orang tua
- `DELETE /api/daycare/orang-tua/[id]` - Hapus orang tua

### Paket Layanan
- `GET /api/daycare/paket` - List paket aktif
- `POST /api/daycare/paket` - Tambah paket
- `PUT /api/daycare/paket` - Update paket

### Pendaftaran
- `GET /api/daycare/pendaftaran` - List pendaftaran
- `POST /api/daycare/pendaftaran` - Daftarkan anak baru
- `GET /api/daycare/pendaftaran/[id]` - Detail pendaftaran
- `PUT /api/daycare/pendaftaran/[id]` - Update/aktivasi pendaftaran
- `DELETE /api/daycare/pendaftaran/[id]` - Batalkan pendaftaran

### Pembayaran Pendaftaran
- `GET /api/daycare/pembayaran-pendaftaran` - List pembayaran
- `POST /api/daycare/pembayaran-pendaftaran` - Tambah pembayaran (auto-update status)
- `GET /api/daycare/pembayaran-pendaftaran/[id]` - Detail pembayaran
- `DELETE /api/daycare/pembayaran-pendaftaran/[id]` - Hapus pembayaran

### Tagihan Bulanan
- `GET /api/daycare/tagihan-bulanan` - List tagihan dengan filter
- `POST /api/daycare/tagihan-bulanan` - Generate tagihan bulanan
- `GET /api/daycare/tagihan-bulanan/[id]` - Detail tagihan
- `PUT /api/daycare/tagihan-bulanan/[id]` - Update tagihan

### Pembayaran Bulanan
- `GET /api/daycare/pembayaran-bulanan` - List pembayaran
- `POST /api/daycare/pembayaran-bulanan` - Tambah pembayaran (auto-update status)
- `DELETE /api/daycare/pembayaran-bulanan/[id]` - Hapus pembayaran

### Kehadiran Harian
- `GET /api/daycare/kehadiran-harian` - List kehadiran
- `POST /api/daycare/kehadiran-harian` - Catat kehadiran (auto-generate tagihan)
- `PUT /api/daycare/kehadiran-harian/[id]` - Update kehadiran
- `DELETE /api/daycare/kehadiran-harian/[id]` - Hapus kehadiran

### Tagihan Harian
- `GET /api/daycare/tagihan-harian` - List tagihan harian
- `POST /api/daycare/tagihan-harian` - Generate tagihan
- `PUT /api/daycare/tagihan-harian/[id]` - Update tagihan

### Pembayaran Harian
- `GET /api/daycare/pembayaran-harian` - List pembayaran
- `POST /api/daycare/pembayaran-harian` - Tambah pembayaran
- `DELETE /api/daycare/pembayaran-harian/[id]` - Hapus pembayaran

### Daily Report
- `GET /api/daycare/daily-report` - List report dengan filter
- `POST /api/daycare/daily-report` - Buat report baru
- `GET /api/daycare/daily-report/[id]` - Detail report
- `PUT /api/daycare/daily-report/[id]` - Update report
- `DELETE /api/daycare/daily-report/[id]` - Hapus report

### Laporan
- `GET /api/daycare/laporan?type=anak-aktif` - Daftar anak aktif per paket
- `GET /api/daycare/laporan?type=tunggakan` - Daftar anak menunggak
- `GET /api/daycare/laporan?type=pemasukan` - Total pemasukan per periode
- `GET /api/daycare/laporan?type=kehadiran` - Rekap kehadiran

### Statistik
- `GET /api/daycare/stats` - Statistik dashboard

---

## Halaman Frontend

### Dashboard (`/kelola`)
- Statistik ringkasan (total anak, tunggakan, pemasukan)
- Quick access ke modul utama
- Grafik perkembangan

### Data Anak (`/kelola/data-anak`)
- Daftar anak dengan filter dan search
- Form tambah/edit anak dengan data kesehatan
- Detail anak dengan tabs (profil, orang tua, pembayaran, daily report)

### Pendaftaran (`/kelola/pendaftaran`)
- Daftar pendaftaran dengan status
- Form pendaftaran baru
- Detail dengan pembayaran cicilan

### Tagihan Bulanan (`/kelola/tagihan-bulanan`)
- Daftar tagihan dengan filter bulan/tahun/status
- Generate tagihan bulanan
- Detail dengan riwayat pembayaran

### Kehadiran Harian (`/kelola/kehadiran-harian`)
- Input kehadiran per tanggal
- Rekap kehadiran per anak

### Tagihan Harian (`/kelola/tagihan-harian`)
- Daftar tagihan harian
- Generate dari kehadiran
- Pembayaran tagihan

### Daily Report (`/kelola/daily-report`)
- Daftar report dengan filter
- Form input report dengan Likert scale
- Detail report dan riwayat per anak

### Laporan (`/kelola/laporan`)
- Dashboard laporan
- Laporan anak aktif per paket
- Laporan tunggakan
- Laporan pemasukan
- Rekap kehadiran

---

## Components

### Core Components
| Component | Lokasi | Deskripsi |
|-----------|--------|-----------|
| AnakFormDialog | `components/daycare/` | Form tambah/edit anak |
| OrangTuaForm | `components/daycare/` | Form data orang tua |
| PendaftaranFormDialog | `components/daycare/` | Form pendaftaran |
| PembayaranPendaftaranForm | `components/daycare/` | Form pembayaran pendaftaran |
| TagihanBulananTable | `components/daycare/` | Tabel tagihan bulanan |
| GenerateTagihanDialog | `components/daycare/` | Dialog generate tagihan |
| PembayaranBulananForm | `components/daycare/` | Form pembayaran bulanan |
| KehadiranForm | `components/daycare/` | Form input kehadiran |
| GenerateTagihanHarianDialog | `components/daycare/` | Dialog generate tagihan harian |
| PembayaranHarianForm | `components/daycare/` | Form pembayaran harian |
| DailyReportForm | `components/daycare/` | Form daily report |
| DailyReportCard | `components/daycare/` | Card display report |
| LikertScaleInput | `components/daycare/` | Input skala Likert 1-5 |

### Laporan Components
| Component | Lokasi | Deskripsi |
|-----------|--------|-----------|
| ReportHeader | `components/daycare/laporan/` | Header untuk cetak |
| PrintButton | `components/daycare/laporan/` | Tombol cetak |

---

## Types dan Utilities

### File: `src/types/daycare.ts`

#### Constants
```typescript
PAKET_LAYANAN_OPTIONS   // Opsi paket untuk dropdown
STATUS_ANAK_OPTIONS     // Opsi status anak
STATUS_PENDAFTARAN_OPTIONS
SCHEMA_PEMBAYARAN_OPTIONS
STATUS_TAGIHAN_OPTIONS
METODE_PEMBAYARAN_OPTIONS
RELASI_OPTIONS
LIKERT_SCALE_OPTIONS    // Skala 1-5 untuk daily report
KEGIATAN_OPTIONS        // Checklist kegiatan
```

#### Extended Types
```typescript
AnakWithRelations       // Anak dengan orang tua, pendaftaran
PendaftaranWithRelations
TagihanBulananWithRelations
DailyReportWithAnak
```

#### Utility Functions
```typescript
generateNomorIndukDaycare(tahun, bulan, seq) // DC-YYMM-XXXX
hitungUmur(tanggalLahir)           // Hitung umur dari DOB
formatRupiah(amount)               // Format mata uang
formatTanggal(date)               // Format tanggal Indonesia
getLikertLabel(value)             // Label skala Likert
getLikertColor(value)             // Warna untuk badge
```

---

## Alur Bisnis

### 1. Pendaftaran Anak Baru
```
1. Input data anak (nama, tanggal lahir, paket, info kesehatan)
2. Input data orang tua (bisa multi-wali)
3. Pilih skema pembayaran (lunas/angsuran)
4. Bayar biaya pendaftaran
5. Aktivasi setelah lunas
```

### 2. Pembayaran Bulanan (FULLDAY/AFTER_SCHOOL)
```
1. Generate tagihan bulanan (bulk atau per anak)
2. Tagihan muncul di daftar dengan status "Belum Bayar"
3. Input pembayaran (bisa cicil)
4. Status otomatis update: bayar_sebagian -> lunas
```

### 3. Kehadiran & Tagihan Harian (HARIAN)
```
1. Input kehadiran (tanggal, jam masuk/pulang)
2. Tagihan otomatis ter-generate dari kehadiran
3. Bayar tagihan harian
```

### 4. Daily Report
```
1. Pilih anak dan tanggal
2. Input penilaian (Likert 1-5):
   - Perilaku: mood, interaksi
   - Aktivitas: partisipasi belajar, respons bermain
   - Makan: makan siang, snack
   - Tidur: kualitas, durasi
3. Pilih kegiatan hari ini (checklist)
4. Tambahkan catatan guru
5. Report tersimpan dan bisa dilihat di profil anak
```

---

## Perbedaan dengan Modul KBTK

| Aspek | KBTK | Daycare |
|-------|------|---------|
| Struktur | Kelas + Kelompok | 3 Paket Layanan |
| Billing | Bulanan saja | Dual (Bulanan + Harian) |
| Data Kesehatan | Opsional | Wajib (alergi, catatan, kebiasaan tidur) |
| Kehadiran | Tidak ada | Wajib untuk paket HARIAN |
| Daily Report | Tidak ada | Ada (Likert scale + checklist) |
| Nomor Induk | KB-YYMM-XXXX | DC-YYMM-XXXX |

---

## Theme

Menggunakan Al Muhajirin Theme Guide:
- **Primary**: Cyan #00BCD4
- **Secondary**: Teal #006064
- **Background**: Light gray gradients
- **Cards**: White dengan shadow subtle

---

## Testing

### Akses Development
```
http://daycare.localhost:3000/kelola
```

### Checklist Manual Testing
- [ ] Dashboard menampilkan statistik
- [ ] CRUD anak berfungsi
- [ ] Pendaftaran + pembayaran cicilan
- [ ] Generate tagihan bulanan
- [ ] Input kehadiran + auto-generate tagihan harian
- [ ] Pembayaran dengan auto-update status
- [ ] Daily report dengan Likert scale
- [ ] Semua laporan dapat diakses
- [ ] Print view berfungsi

---

## Deployment

1. Pastikan migration sudah dijalankan:
   ```bash
   npx prisma migrate deploy
   ```

2. Generate Prisma Client:
   ```bash
   npx prisma generate
   ```

3. Build dan deploy:
   ```bash
   npm run build
   ```

4. Konfigurasi subdomain di Vercel:
   - Tambahkan `daycare.muhajirinrewwin.or.id`
   - Pastikan DNS record mengarah ke Vercel

---

## Catatan Teknis

### Auto-Status Update
- Pembayaran pendaftaran: Otomatis update status pendaftaran ke `aktif` saat lunas
- Tagihan bulanan/harian: Otomatis update `belum_bayar` -> `bayar_sebagian` -> `lunas`

### Immutable Transactions
- Pembayaran tidak bisa diedit, hanya dihapus (untuk audit trail)
- Daily report bisa diedit/dihapus oleh guru

### Nomor Induk Format
- Format: `DC-YYMM-XXXX`
- Contoh: `DC-2512-0001` (Daycare, Desember 2025, nomor 1)

---

*Dokumentasi dibuat: 2025-12-31*
*Versi: 1.0*
