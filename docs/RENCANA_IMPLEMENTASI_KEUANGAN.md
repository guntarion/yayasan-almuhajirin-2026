# Rencana Implementasi Modul Keuangan - almuhajirin2026

## Overview

Modul keuangan untuk Yayasan Al Muhajirin yang diakses via subdomain `keuangan.almuhajirin.or.id` (development: `keuangan.localhost:3000`).

**Prinsip Utama:**
- MVP-focused: fitur minimal yang berfungsi penuh
- User-friendly: untuk non-akuntan
- Website layout dengan navigasi atas (bukan dashboard dengan sidebar)
- No auth required untuk development awal

---

## Tahap 1: Setup Foundation ✅ CURRENT

### 1.1 Update Middleware Subdomain
- [ ] Tambah route `keuangan` ke `SUBDOMAIN_ROUTES` di `src/middleware.ts`
- [ ] Path target: `/keuangan`

### 1.2 Prisma Schema
- [ ] `kode_akun` - Chart of Accounts
- [ ] `fiscal_periods` - Periode tahun fiskal
- [ ] `program_kerja` - Program kerja (simplified)
- [ ] `program_items` - Detail item program
- [ ] `transactions` - Transaksi keuangan
- [ ] `journal_entries` - Jurnal double-entry

### 1.3 Data Static
- [ ] `src/data/keuangan/units.ts` - Unit organisasi
- [ ] `src/data/keuangan/kode-akun.ts` - Chart of accounts
- [ ] `src/data/keuangan/lookups.ts` - Status, jenis, sifat, frekuensi

---

## Tahap 2: Layout & Navigasi

### 2.1 Struktur Folder
```
src/app/keuangan/
├── layout.tsx                # Layout dengan navbar keuangan
├── page.tsx                  # Dashboard keuangan
├── transaksi/
│   ├── page.tsx             # Daftar transaksi
│   └── input/
│       └── page.tsx         # Form input transaksi
├── program/
│   ├── page.tsx             # Daftar program kerja
│   └── [id]/
│       └── page.tsx         # Detail program
├── laporan/
│   ├── page.tsx             # Menu laporan
│   ├── neraca/
│   │   └── page.tsx         # Laporan Neraca
│   ├── aktivitas/
│   │   └── page.tsx         # Laporan Aktivitas
│   └── arus-kas/
│       └── page.tsx         # Laporan Arus Kas
└── pengaturan/
    ├── page.tsx             # Pengaturan umum
    └── akun/
        └── page.tsx         # Daftar kode akun
```

### 2.2 Komponen Navbar
- Logo YAMR
- Menu: Dashboard | Transaksi | Program | Laporan | Pengaturan
- Mobile: hamburger menu

---

## Tahap 3: Dashboard Keuangan

### 3.1 Metric Cards
1. Total Kas & Bank
2. Total Pendapatan (bulan ini)
3. Total Beban (bulan ini)
4. Surplus/Defisit

### 3.2 Quick Summary
- Grafik perbandingan pendapatan vs beban
- 10 transaksi terakhir
- Program dengan realisasi terendah

---

## Tahap 4: Manajemen Transaksi

### 4.1 Form Input Transaksi (Simplified)
Fields:
1. Tanggal (default: hari ini)
2. Jenis (Pemasukan/Pengeluaran)
3. Bidang & Unit (dropdown cascade)
4. Program Kerja (dropdown, optional)
5. Item Program (dropdown, optional)
6. Jumlah (currency input)
7. Keterangan (text)
8. Metode Pembayaran (Kas/Bank)

### 4.2 Auto-Journal Generation
- Otomatis buat journal entries sesuai kode akun
- Debit/Credit sesuai jenis transaksi

### 4.3 Daftar Transaksi
- Filter: periode, unit, jenis
- Pagination
- Export CSV

---

## Tahap 5: Program Kerja

### 5.1 Daftar Program
- Filter: bidang, unit, status, jenis
- View: card atau table
- Progress bar realisasi

### 5.2 Detail Program
- Info program
- Daftar items dengan budget & realisasi
- Daftar transaksi terkait

### 5.3 Seed Data
- Import dari CSV: program_digital_IN.csv, program_digital_OUT.csv

---

## Tahap 6: Laporan Keuangan

### 6.1 Neraca (Balance Sheet)
- Aset: lancar & tetap
- Kewajiban
- Aset Bersih: tanpa pembatasan, dengan pembatasan

### 6.2 Laporan Aktivitas
- Pendapatan: tanpa pembatasan, dengan pembatasan
- Beban: program & operasional
- Surplus/Defisit

### 6.3 Laporan Arus Kas
- Arus dari aktivitas operasi
- Arus dari aktivitas investasi
- Arus dari aktivitas pendanaan

---

## API Routes

```
src/app/api/keuangan/
├── dashboard/
│   └── route.ts          # GET metrics
├── transactions/
│   └── route.ts          # CRUD transaksi
├── programs/
│   ├── route.ts          # CRUD program
│   └── [id]/
│       ├── route.ts      # Detail program
│       └── items/
│           └── route.ts  # CRUD items
├── journals/
│   └── route.ts          # GET jurnal
├── reports/
│   ├── balance-sheet/
│   │   └── route.ts
│   ├── activity/
│   │   └── route.ts
│   └── cash-flow/
│       └── route.ts
└── seed/
    └── route.ts          # Seed data dari CSV
```

---

## Checklist Implementasi

### Tahap 1: Foundation
- [ ] Middleware subdomain keuangan
- [ ] Prisma schema
- [ ] Data static (units, kode-akun, lookups)
- [ ] Run migration
- [ ] /checkbuild
- [ ] /commit "feat(keuangan): setup foundation - schema dan data static"

### Tahap 2: Layout & Navigasi
- [ ] Layout dengan navbar
- [ ] Page dashboard (placeholder)
- [ ] Routing struktur
- [ ] /checkbuild
- [ ] /commit "feat(keuangan): layout dan navigasi"

### Tahap 3: Dashboard
- [ ] API dashboard metrics
- [ ] Komponen metric cards
- [ ] Grafik summary
- [ ] /checkbuild
- [ ] /commit "feat(keuangan): dashboard dengan metrics"

### Tahap 4: Transaksi
- [ ] API CRUD transaksi
- [ ] Form input transaksi
- [ ] Auto-journal generation
- [ ] Daftar transaksi
- [ ] /checkbuild
- [ ] /commit "feat(keuangan): manajemen transaksi"

### Tahap 5: Program Kerja
- [ ] API CRUD program
- [ ] Daftar program
- [ ] Detail program
- [ ] Seed data dari CSV
- [ ] /checkbuild
- [ ] /commit "feat(keuangan): manajemen program kerja"

### Tahap 6: Laporan
- [ ] API laporan
- [ ] Halaman neraca
- [ ] Halaman aktivitas
- [ ] Halaman arus kas
- [ ] /checkbuild
- [ ] /commit "feat(keuangan): laporan keuangan"

---

## Status: IN PROGRESS

**Current:** Tahap 1 - Setup Foundation
**Updated:** 2025-12-24
