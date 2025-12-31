# Dokumentasi Implementasi Modul Administratif KBTK Al Muhajirin

**Tanggal Implementasi:** 30-31 Desember 2025
**Developer:** Claude Code dengan Sub-Agent Architecture
**Status:** ✅ SELESAI DIIMPLEMENTASI

---

## 📋 Ringkasan Eksekutif

Modul Administratif KBTK Al Muhajirin adalah sistem manajemen komprehensif untuk administrasi Kelompok Bermain dan Taman Kanak-kanak. Sistem ini mencakup manajemen data siswa, pendaftaran, pembayaran, dan pelaporan lengkap.

### Fitur Utama
- ✅ Manajemen Data Siswa & Orang Tua
- ✅ Sistem Pendaftaran Siswa Baru
- ✅ Pembayaran Pendaftaran (Lunas/Cicilan)
- ✅ Manajemen SPP Bulanan dengan Tagihan
- ✅ Riwayat Pembayaran Lengkap
- ✅ Sistem Laporan Multi-Dimensi
- ✅ Dashboard Statistik Real-time

### Teknologi Stack
- **Frontend:** Next.js 15, React 18, TypeScript
- **UI Library:** Shadcn/ui, Tailwind CSS, Radix UI
- **Database:** PostgreSQL dengan Prisma ORM
- **Routing:** Multi-subdomain (kbtk.almuhajirin.or.id atau kbtk.localhost:3000)
- **Theme:** Al Muhajirin Official (Cyan #00BCD4, Teal #006064)

---

## 🗂 Struktur Direktori

```
src/
├── app/
│   ├── api/kbtk/                         # API Routes
│   │   ├── siswa/
│   │   │   ├── route.ts                  # GET, POST siswa
│   │   │   └── [id]/route.ts             # GET, PUT, DELETE siswa by ID
│   │   ├── orang-tua/
│   │   │   ├── route.ts                  # GET, POST orang tua
│   │   │   └── [id]/route.ts             # GET, PUT, DELETE orang tua by ID
│   │   ├── pendaftaran/
│   │   │   ├── route.ts                  # GET, POST pendaftaran
│   │   │   └── [id]/route.ts             # GET, PUT, DELETE pendaftaran by ID
│   │   ├── pembayaran-pendaftaran/
│   │   │   ├── route.ts                  # GET, POST pembayaran pendaftaran
│   │   │   └── [id]/route.ts             # GET, PUT, DELETE pembayaran pendaftaran by ID
│   │   ├── setting-spp/
│   │   │   └── route.ts                  # GET, POST, PUT setting SPP
│   │   ├── tagihan-spp/
│   │   │   ├── route.ts                  # GET, POST tagihan SPP
│   │   │   └── [id]/route.ts             # GET, PUT tagihan SPP by ID
│   │   ├── pembayaran-spp/
│   │   │   ├── route.ts                  # GET, POST pembayaran SPP
│   │   │   └── [id]/route.ts             # GET, PUT, DELETE pembayaran SPP by ID
│   │   ├── stats/
│   │   │   └── route.ts                  # GET dashboard statistics
│   │   └── laporan/
│   │       └── route.ts                  # GET berbagai laporan
│   │
│   └── units/kbtk/kelola/                # Frontend Pages
│       ├── layout.tsx                    # Layout dengan sidebar
│       ├── page.tsx                      # Dashboard utama
│       ├── data-siswa/
│       │   ├── page.tsx                  # List siswa
│       │   └── [id]/page.tsx             # Detail siswa
│       ├── pendaftaran/
│       │   ├── page.tsx                  # List pendaftaran
│       │   └── [id]/page.tsx             # Detail pendaftaran
│       ├── spp/
│       │   ├── page.tsx                  # Manajemen SPP & Tagihan
│       │   └── tagihan/[id]/page.tsx     # Detail tagihan
│       └── laporan/
│           ├── page.tsx                  # Dashboard laporan
│           ├── siswa-aktif/page.tsx      # Laporan siswa aktif
│           ├── rekap-spp/page.tsx        # Rekap SPP
│           ├── tunggakan/page.tsx        # Laporan tunggakan
│           ├── pemasukan/page.tsx        # Laporan pemasukan
│           └── pelunasan-pendaftaran/page.tsx # Pelunasan pendaftaran
│
├── components/kbtk/                      # React Components
│   ├── SiswaFormDialog.tsx               # Form tambah/edit siswa
│   ├── OrangTuaForm.tsx                  # Form data orang tua
│   ├── PendaftaranFormDialog.tsx         # Form pendaftaran
│   ├── PembayaranPendaftaranForm.tsx     # Form pembayaran pendaftaran
│   ├── SppSettingForm.tsx                # Form setting SPP
│   ├── TagihanSppTable.tsx               # Tabel tagihan SPP
│   ├── PembayaranSppForm.tsx             # Form pembayaran SPP
│   ├── GenerateTagihanDialog.tsx         # Dialog generate tagihan
│   └── laporan/
│       ├── ReportHeader.tsx              # Header laporan
│       └── PrintButton.tsx               # Tombol print
│
└── types/
    └── kbtk.ts                           # TypeScript Types & Utilities

prisma/
├── schema.prisma                         # Database Schema (7 models KBTK)
└── migrations/
    └── 20251230213715_add_kbtk_module/   # Migration KBTK

docs/profil/kbtk/
├── modul-aplikasi-kbtk.md                # Spesifikasi modul
├── checklist-implementasi-kbtk.md        # Checklist tracking
└── DOKUMENTASI-IMPLEMENTASI-KBTK.md      # Dokumen ini
```

---

## 🗃 Database Schema

### Overview
Database menggunakan PostgreSQL dengan Prisma ORM. Schema dirancang dengan prinsip:
- **Normalisasi** yang seimbang (tidak terlalu flat, tidak terlalu rumit)
- **Transaksi immutable** (pembayaran tidak dihapus, hanya ditambah)
- **Mudah di-query** untuk keperluan laporan

### Enumerasi (Enums)

```prisma
enum KbtkKelompokLevel {
  KB    // Kelompok Bermain
  TK    // Taman Kanak-kanak
}

enum KbtkKelompokKelas {
  A     // Kelas A
  B     // Kelas B
}

enum KbtkStatusSiswa {
  aktif
  cuti
  lulus
  keluar
}

enum KbtkStatusPendaftaran {
  daftar      // Baru daftar
  diterima    // Sudah diterima (pembayaran lunas)
  batal       // Pendaftaran dibatalkan
}

enum KbtkSchemaPembayaran {
  lunas       // Bayar lunas
  angsuran    // Bayar cicilan
}

enum KbtkStatusTagihan {
  belum_bayar
  bayar_sebagian
  lunas
}

enum KbtkMetodePembayaran {
  cash
  transfer
}

enum KbtkRelasi {
  ayah
  ibu
  wali
}
```

### Model Database

#### 1. KbtkSiswa
Model utama untuk data siswa

```prisma
model KbtkSiswa {
  id              String    @id @default(cuid())
  nomorInduk      String    @unique       // Auto-generated: KB-A-2025-001
  nama            String
  jenisKelamin    String                  // L/P
  tempatLahir     String
  tanggalLahir    DateTime
  agama           String
  alamat          String

  // Klasifikasi
  kelompokLevel   KbtkKelompokLevel       // KB atau TK
  kelompokKelas   KbtkKelompokKelas       // A atau B
  tahunMasuk      Int                     // Tahun masuk (2025)
  status          KbtkStatusSiswa @default(aktif)

  // Metadata
  fotoUrl         String?
  catatan         String?
  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt

  // Relations
  orangTua        KbtkOrangTua[]
  pendaftaran     KbtkPendaftaran[]
  tagihanSpp      KbtkTagihanSpp[]
}
```

**Fitur Khusus:**
- `nomorInduk` di-generate otomatis dengan format: `{Level}-{Kelas}-{Tahun}-{Sequential}`
  - Contoh: `KB-A-2025-001`, `TK-B-2025-015`
- `status` menentukan apakah siswa aktif, cuti, lulus, atau keluar

#### 2. KbtkOrangTua
Data orang tua/wali siswa (1 siswa bisa punya multiple orang tua)

```prisma
model KbtkOrangTua {
  id             String    @id @default(cuid())
  siswaId        String
  relasi         KbtkRelasi                   // ayah, ibu, wali
  nama           String
  nomorHp        String?
  pekerjaan      String?
  alamat         String?

  createdAt      DateTime  @default(now())
  updatedAt      DateTime  @updatedAt

  siswa          KbtkSiswa @relation(fields: [siswaId], references: [id], onDelete: Cascade)
}
```

**Relasi:**
- 1 siswa bisa memiliki beberapa orang tua (ayah, ibu, wali)
- Cascade delete: jika siswa dihapus, data orang tua juga terhapus

#### 3. KbtkPendaftaran
Data pendaftaran siswa baru

```prisma
model KbtkPendaftaran {
  id                String    @id @default(cuid())
  siswaId           String
  status            KbtkStatusPendaftaran @default(daftar)
  biayaPendaftaran  Float                          // Nominal total

  tanggalDaftar     DateTime  @default(now())
  catatan           String?
  createdAt         DateTime  @default(now())
  updatedAt         DateTime  @updatedAt

  siswa             KbtkSiswa @relation(fields: [siswaId], references: [id], onDelete: Cascade)
  pembayaran        KbtkPembayaranPendaftaran[]
}
```

**Business Logic:**
- Status `daftar`: siswa baru mendaftar, belum bayar atau masih cicil
- Status `diterima`: pembayaran sudah lunas, siswa resmi diterima
- Status `batal`: pendaftaran dibatalkan

#### 4. KbtkPembayaranPendaftaran
Riwayat pembayaran uang pendaftaran (mendukung cicilan)

```prisma
model KbtkPembayaranPendaftaran {
  id              String    @id @default(cuid())
  pendaftaranId   String
  schemaPembayaran KbtkSchemaPembayaran
  metodePembayaran KbtkMetodePembayaran

  nominal         Float
  keterangan      String?
  buktiUrl        String?                         // URL foto bukti transfer

  tanggalBayar    DateTime  @default(now())
  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt

  pendaftaran     KbtkPendaftaran @relation(fields: [pendaftaranId], references: [id], onDelete: Cascade)
}
```

**Fitur Khusus:**
- Mendukung pembayaran cicilan (multiple records)
- Otomatis update status pendaftaran menjadi `diterima` saat total pembayaran >= biaya pendaftaran
- Menyimpan bukti transfer (opsional)

#### 5. KbtkSettingSpp
Pengaturan nominal SPP per kelompok dan tahun ajaran

```prisma
model KbtkSettingSpp {
  id              String    @id @default(cuid())
  kelompokLevel   KbtkKelompokLevel
  kelompokKelas   KbtkKelompokKelas
  tahunAjaran     String                          // "2025/2026"
  nominal         Float

  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt

  @@unique([kelompokLevel, kelompokKelas, tahunAjaran])
}
```

**Contoh Data:**
- KB-A 2025/2026 → Rp 250.000
- KB-B 2025/2026 → Rp 275.000
- TK-A 2025/2026 → Rp 300.000
- TK-B 2025/2026 → Rp 325.000

#### 6. KbtkTagihanSpp
Tagihan SPP bulanan per siswa

```prisma
model KbtkTagihanSpp {
  id              String    @id @default(cuid())
  siswaId         String
  bulan           Int                             // 1-12
  tahun           Int                             // 2025
  nominal         Float
  status          KbtkStatusTagihan @default(belum_bayar)

  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt

  siswa           KbtkSiswa @relation(fields: [siswaId], references: [id], onDelete: Cascade)
  pembayaran      KbtkPembayaranSpp[]

  @@unique([siswaId, bulan, tahun])
}
```

**Business Logic:**
- Generate tagihan setiap bulan untuk semua siswa aktif
- Status otomatis update berdasarkan total pembayaran:
  - `belum_bayar`: total pembayaran = 0
  - `bayar_sebagian`: 0 < total pembayaran < nominal
  - `lunas`: total pembayaran >= nominal

#### 7. KbtkPembayaranSpp
Riwayat pembayaran SPP (mendukung partial payment)

```prisma
model KbtkPembayaranSpp {
  id              String    @id @default(cuid())
  tagihanId       String
  metodePembayaran KbtkMetodePembayaran

  nominal         Float
  keterangan      String?
  buktiUrl        String?

  tanggalBayar    DateTime  @default(now())
  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt

  tagihan         KbtkTagihanSpp @relation(fields: [tagihanId], references: [id], onDelete: Cascade)
}
```

**Fitur Khusus:**
- Mendukung partial payment (bayar sebagian dulu)
- Otomatis update status tagihan setelah pembayaran

---

## 🔌 API Routes

Semua API routes berada di `src/app/api/kbtk/` dengan pattern RESTful.

### 1. Siswa API

#### `GET /api/kbtk/siswa`
List semua siswa dengan filter dan pagination

**Query Parameters:**
- `kelompokLevel` (optional): KB atau TK
- `kelompokKelas` (optional): A atau B
- `status` (optional): aktif, cuti, lulus, keluar
- `tahunMasuk` (optional): tahun (2025)
- `search` (optional): cari berdasarkan nama atau nomor induk

**Response:**
```json
{
  "siswa": [
    {
      "id": "clx...",
      "nomorInduk": "KB-A-2025-001",
      "nama": "Ahmad Fauzi",
      "jenisKelamin": "L",
      "kelompokLevel": "KB",
      "kelompokKelas": "A",
      "status": "aktif",
      "orangTua": [...]
    }
  ]
}
```

#### `POST /api/kbtk/siswa`
Tambah siswa baru

**Request Body:**
```json
{
  "nama": "Ahmad Fauzi",
  "jenisKelamin": "L",
  "tempatLahir": "Jakarta",
  "tanggalLahir": "2020-05-15",
  "agama": "Islam",
  "alamat": "Jl. Contoh No. 123",
  "kelompokLevel": "KB",
  "kelompokKelas": "A",
  "tahunMasuk": 2025
}
```

**Response:**
```json
{
  "siswa": {
    "id": "clx...",
    "nomorInduk": "KB-A-2025-001",  // Auto-generated
    ...
  }
}
```

#### `GET /api/kbtk/siswa/[id]`
Detail siswa by ID (dengan relasi orang tua, pendaftaran, tagihan)

#### `PUT /api/kbtk/siswa/[id]`
Update data siswa

#### `DELETE /api/kbtk/siswa/[id]`
Hapus siswa (cascade delete: orang tua, pendaftaran, tagihan juga terhapus)

---

### 2. Orang Tua API

#### `GET /api/kbtk/orang-tua?siswaId=xxx`
List orang tua berdasarkan siswa

#### `POST /api/kbtk/orang-tua`
Tambah data orang tua

**Request Body:**
```json
{
  "siswaId": "clx...",
  "relasi": "ayah",
  "nama": "Budi Santoso",
  "nomorHp": "081234567890",
  "pekerjaan": "Wiraswasta",
  "alamat": "Jl. Contoh No. 123"
}
```

#### `PUT /api/kbtk/orang-tua/[id]`
Update data orang tua

#### `DELETE /api/kbtk/orang-tua/[id]`
Hapus data orang tua

---

### 3. Pendaftaran API

#### `GET /api/kbtk/pendaftaran`
List semua pendaftaran

**Query Parameters:**
- `status` (optional): daftar, diterima, batal
- `siswaId` (optional): filter by siswa

#### `POST /api/kbtk/pendaftaran`
Buat pendaftaran baru

**Request Body:**
```json
{
  "siswaId": "clx...",
  "biayaPendaftaran": 1500000,
  "catatan": "Pendaftaran KB-A 2025/2026"
}
```

#### `PUT /api/kbtk/pendaftaran/[id]`
Update pendaftaran (termasuk update status)

#### `DELETE /api/kbtk/pendaftaran/[id]`
Hapus pendaftaran

---

### 4. Pembayaran Pendaftaran API

#### `GET /api/kbtk/pembayaran-pendaftaran?pendaftaranId=xxx`
List pembayaran berdasarkan pendaftaran

**Response:**
```json
{
  "pembayaran": [...],
  "totalBayar": 1000000,
  "sisaTagihan": 500000
}
```

#### `POST /api/kbtk/pembayaran-pendaftaran`
Input pembayaran (lunas atau cicilan)

**Request Body:**
```json
{
  "pendaftaranId": "clx...",
  "schemaPembayaran": "angsuran",
  "metodePembayaran": "transfer",
  "nominal": 500000,
  "keterangan": "Cicilan 1 dari 3",
  "buktiUrl": "https://..."
}
```

**Business Logic:**
- Setelah pembayaran dibuat, sistem cek total pembayaran
- Jika total >= biaya pendaftaran, status pendaftaran otomatis jadi `diterima`

---

### 5. Setting SPP API

#### `GET /api/kbtk/setting-spp?tahunAjaran=2025/2026`
Get setting SPP

**Response:**
```json
{
  "settings": [
    {
      "kelompokLevel": "KB",
      "kelompokKelas": "A",
      "tahunAjaran": "2025/2026",
      "nominal": 250000
    }
  ]
}
```

#### `POST /api/kbtk/setting-spp`
Buat/update setting SPP

**Request Body:**
```json
{
  "kelompokLevel": "KB",
  "kelompokKelas": "A",
  "tahunAjaran": "2025/2026",
  "nominal": 250000
}
```

---

### 6. Tagihan SPP API

#### `GET /api/kbtk/tagihan-spp`
List tagihan SPP

**Query Parameters:**
- `siswaId` (optional)
- `bulan` (optional): 1-12
- `tahun` (optional): 2025
- `status` (optional): belum_bayar, bayar_sebagian, lunas

**Response:**
```json
{
  "tagihan": [
    {
      "id": "clx...",
      "siswa": { "nama": "Ahmad Fauzi", "nomorInduk": "KB-A-2025-001" },
      "bulan": 1,
      "tahun": 2025,
      "nominal": 250000,
      "status": "belum_bayar",
      "totalBayar": 0,
      "sisa": 250000
    }
  ]
}
```

#### `POST /api/kbtk/tagihan-spp`
Generate tagihan bulanan untuk semua siswa aktif

**Request Body:**
```json
{
  "bulan": 1,
  "tahun": 2025,
  "kelompokLevel": "KB",  // optional: generate untuk kelompok tertentu
  "kelompokKelas": "A"     // optional
}
```

**Business Logic:**
- Ambil semua siswa aktif dengan kelompok tertentu (atau semua jika tidak difilter)
- Untuk setiap siswa, buat tagihan berdasarkan setting SPP
- Skip jika tagihan untuk bulan/tahun tersebut sudah ada (unique constraint)

#### `PUT /api/kbtk/tagihan-spp/[id]`
Update tagihan (biasanya otomatis dari pembayaran)

---

### 7. Pembayaran SPP API

#### `GET /api/kbtk/pembayaran-spp?tagihanId=xxx`
List pembayaran untuk tagihan tertentu

#### `POST /api/kbtk/pembayaran-spp`
Input pembayaran SPP

**Request Body:**
```json
{
  "tagihanId": "clx...",
  "metodePembayaran": "cash",
  "nominal": 250000,
  "keterangan": "Lunas Januari 2025"
}
```

**Business Logic:**
- Setelah pembayaran, hitung total semua pembayaran untuk tagihan
- Update status tagihan:
  - total = 0 → `belum_bayar`
  - 0 < total < nominal → `bayar_sebagian`
  - total >= nominal → `lunas`

#### `DELETE /api/kbtk/pembayaran-spp/[id]`
Hapus pembayaran (dan re-calculate status tagihan)

---

### 8. Stats API

#### `GET /api/kbtk/stats`
Dashboard statistics

**Response:**
```json
{
  "totalSiswaAktif": 45,
  "totalSiswaKB": 20,
  "totalSiswaTK": 25,
  "pendaftaranBaru": 5,
  "totalTunggakan": 2500000,
  "pemasukanBulanIni": 15000000
}
```

---

### 9. Laporan API

#### `GET /api/kbtk/laporan?type=siswa-aktif`
Laporan siswa aktif per kelas

**Query Parameters:**
- `type`: siswa-aktif, rekap-spp, tunggakan, pemasukan, pelunasan-pendaftaran
- `bulan`, `tahun`, `kelompokLevel`, `kelompokKelas` (sesuai kebutuhan laporan)

**Response varies by type**

---

## 🎨 Frontend Pages & Components

### Layout Structure

#### `/kelola` - Layout dengan Sidebar
File: `src/app/units/kbtk/kelola/layout.tsx`

**Features:**
- Sidebar navigation dengan menu:
  - Dashboard
  - Data Siswa
  - Pendaftaran
  - SPP
  - Laporan
- Header dengan info unit
- Responsive design (mobile-friendly)
- Al Muhajirin theme integration

---

### Dashboard

#### `/kelola` - Dashboard Utama
File: `src/app/units/kbtk/kelola/page.tsx`

**Features:**
- Statistik cards:
  - Total Siswa Aktif (breakdown KB/TK)
  - Pendaftaran Baru
  - Total Tunggakan
  - Pemasukan Bulan Ini
- Quick actions:
  - Tambah Siswa Baru
  - Proses Pendaftaran
  - Generate Tagihan SPP
  - Lihat Laporan
- Recent activities/notifications

**Components Used:**
- `Card` from shadcn/ui
- Custom stats cards dengan icons
- Data fetching dari `/api/kbtk/stats`

---

### Data Siswa Module

#### `/kelola/data-siswa` - List Siswa
File: `src/app/units/kbtk/kelola/data-siswa/page.tsx`

**Features:**
- Table/Card view siswa
- Filter:
  - Kelompok (KB/TK)
  - Kelas (A/B)
  - Status (aktif, cuti, lulus, keluar)
  - Tahun Masuk
- Search by nama atau nomor induk
- Pagination
- Actions:
  - Tambah Siswa (dialog)
  - Edit Siswa (dialog)
  - Hapus Siswa (dengan konfirmasi)
  - Lihat Detail (navigate)

**Components Used:**
- `SiswaFormDialog` - Form add/edit siswa
- `DataTable` with sorting & filtering
- `Badge` untuk status
- `Button` dengan icons

#### `/kelola/data-siswa/[id]` - Detail Siswa
File: `src/app/units/kbtk/kelola/data-siswa/[id]/page.tsx`

**Features:**
- Info dasar siswa (dengan foto jika ada)
- Tabs:
  - **Tab Info**: Data lengkap siswa
  - **Tab Orang Tua**: List orang tua/wali dengan CRUD
  - **Tab Riwayat Pembayaran**: Gabungan pembayaran pendaftaran & SPP
  - **Tab Tagihan SPP**: Daftar tagihan SPP siswa (historical)
- Edit/Update siswa
- Quick actions

**Components Used:**
- `Tabs` from shadcn/ui
- `OrangTuaForm` - Form CRUD orang tua
- `Card` untuk display info
- `Table` untuk riwayat

---

### Pendaftaran Module

#### `/kelola/pendaftaran` - List Pendaftaran
File: `src/app/units/kbtk/kelola/pendaftaran/page.tsx`

**Features:**
- Table pendaftaran dengan columns:
  - Nomor Induk Siswa
  - Nama Siswa
  - Tanggal Daftar
  - Biaya Pendaftaran
  - Total Bayar
  - Sisa
  - Status
  - Actions
- Filter by status (daftar, diterima, batal)
- Badge untuk status (color-coded)
- Actions:
  - Tambah Pendaftaran (dialog)
  - Lihat Detail (navigate)
  - Update Status

**Components Used:**
- `PendaftaranFormDialog`
- `DataTable`
- `Badge` untuk status

#### `/kelola/pendaftaran/[id]` - Detail Pendaftaran
File: `src/app/units/kbtk/kelola/pendaftaran/[id]/page.tsx`

**Features:**
- Info pendaftaran & siswa
- Summary pembayaran:
  - Total Biaya
  - Total Bayar
  - Sisa
  - Progress bar
- Riwayat pembayaran (timeline view)
- Form input pembayaran (cicilan atau lunas)
- Tombol update status (terima/batal)

**Components Used:**
- `PembayaranPendaftaranForm`
- `Card` untuk summary
- `Timeline` atau `Table` untuk riwayat
- `Progress` untuk visual sisa pembayaran

---

### SPP Module

#### `/kelola/spp` - Manajemen SPP & Tagihan
File: `src/app/units/kbtk/kelola/spp/page.tsx`

**Features:**
- Tab 1: **Pengaturan SPP**
  - Form setting nominal SPP per kelompok & tahun ajaran
  - Table setting SPP existing
  - Edit nominal

- Tab 2: **Tagihan SPP**
  - Filter bulan, tahun, status
  - Table tagihan dengan columns:
    - Nomor Induk
    - Nama Siswa
    - Bulan/Tahun
    - Nominal
    - Total Bayar
    - Sisa
    - Status
    - Actions
  - Badge untuk status tagihan (merah untuk tunggakan)
  - Tombol Generate Tagihan (bulk untuk bulan tertentu)
  - Quick payment action

**Components Used:**
- `SppSettingForm`
- `TagihanSppTable`
- `GenerateTagihanDialog`
- `Tabs` untuk pemisahan setting & tagihan

#### `/kelola/spp/tagihan/[id]` - Detail Tagihan
File: `src/app/units/kbtk/kelola/spp/tagihan/[id]/page.tsx`

**Features:**
- Info tagihan & siswa
- Summary:
  - Nominal
  - Total Bayar
  - Sisa
  - Status
- Riwayat pembayaran untuk tagihan ini
- Form input pembayaran (lunas atau cicilan)
- Print kwitansi (opsional)

**Components Used:**
- `PembayaranSppForm`
- `Card` untuk summary
- `Table` untuk riwayat

---

### Laporan Module

#### `/kelola/laporan` - Dashboard Laporan
File: `src/app/units/kbtk/kelola/laporan/page.tsx`

**Features:**
- Grid cards untuk berbagai laporan:
  - Daftar Siswa Aktif
  - Rekap SPP
  - Daftar Tunggakan
  - Laporan Pemasukan
  - Status Pelunasan Pendaftaran
- Klik card navigate ke halaman laporan detail

#### `/kelola/laporan/siswa-aktif` - Laporan Siswa Aktif
File: `src/app/units/kbtk/kelola/laporan/siswa-aktif/page.tsx`

**Features:**
- Filter kelompok & kelas
- Table siswa aktif dengan grouping
- Summary count per kelompok
- Export/Print button

**Components Used:**
- `ReportHeader` - Header dengan title, filter, dan tombol print
- `PrintButton` - Tombol print dengan styling khusus print view
- `DataTable` with grouping

#### `/kelola/laporan/rekap-spp` - Rekap SPP
File: `src/app/units/kbtk/kelola/laporan/rekap-spp/page.tsx`

**Features:**
- Filter bulan & tahun
- Summary:
  - Total Tagihan
  - Total Terbayar
  - Total Tunggakan
  - Persentase pembayaran
- Breakdown per kelompok
- Export/Print

#### `/kelola/laporan/tunggakan` - Laporan Tunggakan
File: `src/app/units/kbtk/kelola/laporan/tunggakan/page.tsx`

**Features:**
- Filter periode
- Table siswa yang menunggak dengan:
  - Nama Siswa
  - Nomor Induk
  - Kelas
  - Bulan Tunggakan
  - Nominal Tunggakan
  - No. HP Orang Tua (untuk reminder)
- Tombol kirim reminder WA (opsional)
- Print/Export

#### `/kelola/laporan/pemasukan` - Laporan Pemasukan
File: `src/app/units/kbtk/kelola/laporan/pemasukan/page.tsx`

**Features:**
- Filter periode (start & end date)
- Summary total pemasukan
- Breakdown:
  - Pemasukan dari Pendaftaran
  - Pemasukan dari SPP
- Timeline/chart pemasukan harian
- Export/Print

#### `/kelola/laporan/pelunasan-pendaftaran` - Pelunasan Pendaftaran
File: `src/app/units/kbtk/kelola/laporan/pelunasan-pendaftaran/page.tsx`

**Features:**
- Filter tahun ajaran
- Table pendaftaran dengan status:
  - Lunas
  - Belum Lunas (cicilan)
  - Batal
- Summary count & nominal

---

## 🧩 Reusable Components

### 1. SiswaFormDialog
File: `src/components/kbtk/SiswaFormDialog.tsx`

**Props:**
- `open: boolean`
- `onOpenChange: (open: boolean) => void`
- `siswa?: KbtkSiswa` (untuk mode edit)
- `onSuccess: () => void`

**Features:**
- Form lengkap data siswa
- Auto-generate nomor induk (read-only display)
- Validasi form dengan React Hook Form
- Submit POST (add) atau PUT (edit)

### 2. OrangTuaForm
File: `src/components/kbtk/OrangTuaForm.tsx`

**Props:**
- `siswaId: string`
- `orangTua?: KbtkOrangTua` (untuk mode edit)
- `onSuccess: () => void`

**Features:**
- Form data orang tua (nama, relasi, no. HP, pekerjaan)
- Submit POST/PUT ke API
- Validasi form

### 3. PendaftaranFormDialog
File: `src/components/kbtk/PendaftaranFormDialog.tsx`

**Props:**
- `open: boolean`
- `onOpenChange: (open: boolean) => void`
- `onSuccess: () => void`

**Features:**
- Select siswa (dari siswa yang belum punya pendaftaran aktif)
- Input biaya pendaftaran
- Catatan
- Submit POST

### 4. PembayaranPendaftaranForm
File: `src/components/kbtk/PembayaranPendaftaranForm.tsx`

**Props:**
- `pendaftaranId: string`
- `sisaTagihan: number`
- `onSuccess: () => void`

**Features:**
- Select skema pembayaran (lunas/angsuran)
- Select metode pembayaran (cash/transfer)
- Input nominal (dengan validasi tidak boleh > sisa)
- Upload bukti transfer (opsional)
- Keterangan
- Submit POST

### 5. SppSettingForm
File: `src/components/kbtk/SppSettingForm.tsx`

**Props:**
- `setting?: KbtkSettingSpp` (untuk mode edit)
- `onSuccess: () => void`

**Features:**
- Select kelompok level & kelas
- Input tahun ajaran
- Input nominal SPP
- Submit POST

### 6. TagihanSppTable
File: `src/components/kbtk/TagihanSppTable.tsx`

**Props:**
- `tagihan: TagihanWithDetails[]`
- `onPaymentSuccess: () => void`

**Features:**
- Table tagihan dengan sorting
- Badge status (color-coded)
- Quick payment button (buka dialog pembayaran)
- Detail button (navigate)

### 7. PembayaranSppForm
File: `src/components/kbtk/PembayaranSppForm.tsx`

**Props:**
- `tagihanId: string`
- `sisaTagihan: number`
- `onSuccess: () => void`

**Features:**
- Select metode pembayaran
- Input nominal (validasi)
- Upload bukti (opsional)
- Keterangan
- Submit POST

### 8. GenerateTagihanDialog
File: `src/components/kbtk/GenerateTagihanDialog.tsx`

**Props:**
- `open: boolean`
- `onOpenChange: (open: boolean) => void`
- `onSuccess: () => void`

**Features:**
- Select bulan & tahun
- Select kelompok level & kelas (atau all)
- Preview jumlah siswa yang akan di-generate
- Submit POST bulk generate

### 9. ReportHeader
File: `src/components/kbtk/laporan/ReportHeader.tsx`

**Props:**
- `title: string`
- `children?: React.ReactNode` (untuk filter)

**Features:**
- Header laporan dengan title
- Slot untuk filter components
- Logo/info unit

### 10. PrintButton
File: `src/components/kbtk/laporan/PrintButton.tsx`

**Features:**
- Trigger window.print()
- Custom print CSS (hide sidebar, header, footer pada print)

---

## 🔧 Utility Functions & Types

File: `src/types/kbtk.ts`

### Re-exported Prisma Types
```typescript
export type {
  KbtkSiswa,
  KbtkOrangTua,
  KbtkPendaftaran,
  KbtkPembayaranPendaftaran,
  KbtkSettingSpp,
  KbtkTagihanSpp,
  KbtkPembayaranSpp,
  KbtkKelompokLevel,
  KbtkKelompokKelas,
  KbtkStatusSiswa,
  KbtkStatusPendaftaran,
  KbtkSchemaPembayaran,
  KbtkStatusTagihan,
  KbtkMetodePembayaran,
  KbtkRelasi,
} from '@prisma/client';
```

### Extended Types with Relations
```typescript
export type SiswaWithRelations = KbtkSiswa & {
  orangTua: KbtkOrangTua[];
  pendaftaran: (KbtkPendaftaran & {
    pembayaran: KbtkPembayaranPendaftaran[];
  })[];
  tagihanSpp: (KbtkTagihanSpp & {
    pembayaran: KbtkPembayaranSpp[];
  })[];
};

export type TagihanWithDetails = KbtkTagihanSpp & {
  siswa: Pick<KbtkSiswa, 'nama' | 'nomorInduk' | 'kelompokLevel' | 'kelompokKelas'>;
  pembayaran: KbtkPembayaranSpp[];
  totalBayar: number;
  sisa: number;
};

// ... dan lain-lain
```

### Constants/Options
```typescript
export const AGAMA_OPTIONS = [
  { value: 'Islam', label: 'Islam' },
  { value: 'Kristen', label: 'Kristen' },
  { value: 'Katolik', label: 'Katolik' },
  { value: 'Hindu', label: 'Hindu' },
  { value: 'Buddha', label: 'Buddha' },
  { value: 'Konghucu', label: 'Konghucu' },
];

export const JENIS_KELAMIN_OPTIONS = [
  { value: 'L', label: 'Laki-laki' },
  { value: 'P', label: 'Perempuan' },
];

export const KELOMPOK_LEVEL_OPTIONS = [
  { value: 'KB', label: 'KB (Kelompok Bermain)' },
  { value: 'TK', label: 'TK (Taman Kanak-kanak)' },
];

export const KELOMPOK_KELAS_OPTIONS = [
  { value: 'A', label: 'Kelas A' },
  { value: 'B', label: 'Kelas B' },
];

// ... dan lain-lain
```

### Utility Functions

#### `generateNomorInduk(level, kelas, tahun): string`
Generate nomor induk siswa

```typescript
generateNomorInduk('KB', 'A', 2025)
// Output: "KB-A-2025-001"
```

**Logic:**
- Query siswa terakhir dengan level, kelas, tahun yang sama
- Extract sequential number dari nomor induk terakhir
- Increment dan format dengan padding 3 digit

#### `formatUmur(tanggalLahir): string`
Hitung dan format umur dari tanggal lahir

```typescript
formatUmur(new Date('2020-05-15'))
// Output: "5 tahun 7 bulan"
```

#### `formatCurrency(amount): string`
Format angka ke format rupiah

```typescript
formatCurrency(250000)
// Output: "Rp 250.000"
```

#### `getTahunAjaranSekarang(): string`
Get tahun ajaran saat ini

```typescript
getTahunAjaranSekarang()
// Output: "2025/2026" (jika bulan >= 7, tahun+1)
```

---

## 🚀 Deployment & Testing

### Local Development

1. **Setup Database:**
   ```bash
   # Pastikan PostgreSQL running
   # Update DATABASE_URL di .env

   npx prisma migrate dev
   npx prisma generate
   ```

2. **Start Dev Server:**
   ```bash
   npm run dev
   ```

3. **Access:**
   - Main app: `http://localhost:3000`
   - KBTK subdomain: `http://kbtk.localhost:3000/kelola`

### Testing Checklist

#### Database & API Testing
- [x] Database migration berhasil tanpa error
- [ ] Seed data (create sample siswa, pendaftaran, dll)
- [ ] Test semua API endpoints:
  - [ ] GET/POST/PUT/DELETE siswa
  - [ ] GET/POST/PUT/DELETE orang tua
  - [ ] GET/POST/PUT/DELETE pendaftaran
  - [ ] POST pembayaran pendaftaran → check status update
  - [ ] POST/PUT setting SPP
  - [ ] POST generate tagihan SPP → check bulk create
  - [ ] POST pembayaran SPP → check status update
  - [ ] GET stats → verify calculations
  - [ ] GET laporan (all types)

#### Frontend Testing
- [ ] Login sebagai admin
- [ ] Navigate ke http://kbtk.localhost:3000/kelola
- [ ] Dashboard:
  - [ ] Verify stats display correctly
  - [ ] Click quick actions
- [ ] Data Siswa:
  - [ ] List siswa dengan filter & search
  - [ ] Tambah siswa baru → verify auto-generated nomorInduk
  - [ ] Edit siswa
  - [ ] Detail siswa → check all tabs
  - [ ] Tambah orang tua di tab Orang Tua
- [ ] Pendaftaran:
  - [ ] List pendaftaran
  - [ ] Tambah pendaftaran
  - [ ] Detail pendaftaran
  - [ ] Input pembayaran angsuran → check sisa update
  - [ ] Input pembayaran lunas → check status jadi "diterima"
- [ ] SPP:
  - [ ] Tab Setting: create/edit setting SPP
  - [ ] Tab Tagihan: generate tagihan → verify bulk create
  - [ ] Filter tagihan by bulan, status
  - [ ] Quick payment → check update
  - [ ] Detail tagihan → pembayaran cicilan
- [ ] Laporan:
  - [ ] Laporan Siswa Aktif → verify grouping
  - [ ] Rekap SPP → verify calculations
  - [ ] Tunggakan → verify filter
  - [ ] Pemasukan → verify breakdown
  - [ ] Pelunasan Pendaftaran
  - [ ] Print view (check CSS print)

#### Edge Cases
- [ ] Generate tagihan untuk bulan yang sama → should skip (unique constraint)
- [ ] Hapus siswa yang punya tagihan → cascade delete
- [ ] Pembayaran lebih dari tagihan → status tetap lunas
- [ ] Hapus pembayaran → recalculate status
- [ ] Search/filter dengan special characters

### Production Deployment

1. **Vercel Configuration:**
   - Add domain: `kbtk.almuhajirin.or.id`
   - Add subdomain to Vercel project settings
   - Configure DNS A/CNAME records

2. **Environment Variables:**
   - Ensure `DATABASE_URL` points to production PostgreSQL
   - Ensure `NEXTAUTH_URL` includes subdomain
   - All other env vars configured

3. **Database Migration:**
   ```bash
   # Di production, Vercel akan auto-run migration saat deploy
   # Atau manual:
   npx prisma migrate deploy
   ```

4. **Post-Deployment:**
   - Test akses `https://kbtk.almuhajirin.or.id/kelola`
   - Verify SSL certificate
   - Test all critical flows

---

## 📚 Best Practices & Conventions

### Code Structure
- **Server Components** (default): pages yang tidak butuh interaktivity
- **Client Components** (`'use client'`): forms, dialogs, interactive tables
- **API Routes**: handle di server-side dengan Prisma
- **Types**: import dari `@/types/kbtk` untuk consistency

### Database Operations
- **Prisma Client**: always use singleton from `@/utils/prisma`
- **Transactions**: use for operations that modify multiple tables
- **Soft Delete**: consider menggunakan status instead of hard delete untuk historical data

### UI/UX Patterns
- **Form Validation**: use React Hook Form + Zod
- **Loading States**: use Suspense atau loading.tsx
- **Error Handling**: try-catch di API routes, return proper status codes
- **Notifications**: use toast (shadcn/ui) untuk feedback

### Security
- **Authentication**: protect API routes dengan NextAuth session check
- **Authorization**: verify user has role "admin" or "moderator"
- **Input Validation**: validate di both client & server
- **SQL Injection**: Prisma auto-escapes (safe by default)

---

## 🐛 Troubleshooting

### Common Issues

#### 1. Migration Error
**Problem:** `npx prisma migrate dev` fails

**Solution:**
- Check DATABASE_URL is correct
- Ensure PostgreSQL is running
- Try `npx prisma migrate reset` (WARNING: deletes data)

#### 2. Subdomain Not Working Locally
**Problem:** `kbtk.localhost:3000` tidak resolve

**Solution:**
- Browser biasanya auto-handle `*.localhost`
- Atau edit `/etc/hosts`:
  ```
  127.0.0.1 kbtk.localhost
  ```

#### 3. Type Errors After Schema Change
**Problem:** TypeScript complains about Prisma types

**Solution:**
```bash
npx prisma generate
```

#### 4. API Returns 500
**Problem:** Internal server error di API route

**Solution:**
- Check server logs (`npm run dev` terminal)
- Ensure Prisma Client is connected
- Verify database connection string

---

## 📖 Referensi

### Dokumentasi Terkait
- [CLAUDE.md](../../../CLAUDE.md) - Project overview & architecture
- [modul-aplikasi-kbtk.md](./modul-aplikasi-kbtk.md) - Spesifikasi modul KBTK
- [checklist-implementasi-kbtk.md](./checklist-implementasi-kbtk.md) - Checklist tracking
- [Theme Guide](../../theme-guide-almuhajirin.md) - Al Muhajirin theme

### External Resources
- [Next.js 15 Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Shadcn/ui Components](https://ui.shadcn.com)
- [Tailwind CSS](https://tailwindcss.com/docs)

---

## 🎯 Next Steps & Future Enhancements

### Fase 2 (Opsional)
- [ ] Cetak kwitansi pembayaran (PDF generation)
- [ ] Upload bukti transfer dengan preview
- [ ] WhatsApp reminder untuk tunggakan SPP
- [ ] Dashboard kepala sekolah (read-only analytics)
- [ ] Export laporan ke Excel
- [ ] Multi-year data archiving

### Fase 3 (Advanced)
- [ ] Mobile app (React Native atau PWA)
- [ ] Parent portal (orang tua bisa lihat tagihan & riwayat)
- [ ] Online payment integration
- [ ] Absensi siswa
- [ ] Penilaian/rapor digital

---

## 👥 Credits

**Implementasi oleh:**
- Claude Code (AI Assistant)
- Sub-Agent Architecture:
  - Agent API Routes
  - Agent Layout Kelola
  - Agent Data Siswa
  - Agent Pendaftaran
  - Agent SPP
  - Agent Laporan

**Tanggal:** 30-31 Desember 2025

**Versi:** 1.0.0

---

*Dokumen ini merupakan dokumentasi lengkap implementasi Modul Administratif KBTK Al Muhajirin. Untuk pertanyaan atau issue, silakan hubungi developer atau buat issue di repository.*
