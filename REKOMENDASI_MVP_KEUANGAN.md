# Rekomendasi MVP Modul Keuangan Al Muhajirin 2026

## Executive Summary

Berdasarkan analisis mendalam terhadap sistem YAMR (electron-yamr), berikut adalah rekomendasi untuk MVP modul keuangan yang:
- **Sederhana & user-friendly** untuk non-akuntan
- **Fokus pada fungsi keuangan utama** (bukan evaluasi program)
- **Menggunakan layout website** dengan navigasi atas (bukan sidebar dashboard)
- **Tidak over-engineered** tapi cukup powerful untuk kebutuhan dasar

---

## 1. ANALISIS SISTEM YAMR

### Struktur Saat Ini
**Database**: SQLite/PostgreSQL dengan 13 tabel utama
- `kode_akun` (Chart of Accounts) - PSAK 45 compliant
- `program_kerja` (Program Planning)
- `program_items` (Line Items)
- `transactions` (Actual Transactions)
- `journal_entries` (Auto-generated double-entry)
- `jurnal_umum` (Manual Journals)
- `units`, `bidang`, `fiscal_periods`
- Dan 5 tabel lainnya untuk supporting data

**UI**: Sidebar dengan 14 menu items utama, 10.2K baris code React

**Kompleksitas Fitur**: ⭐⭐⭐⭐ (tinggi)
- Evaluasi program kerja (773 baris)
- Multiple report types (417 baris)
- Adjustment entries (574 baris)
- Period closing (608 baris)

---

## 2. REKOMENDASI NAVIGASI MENU (WEBSITE HEADER)

### Struktur Navigasi Top-Level
Gunakan layout website **Navbar + Sidebar Drawer** (responsive) bukan full sidebar seperti YAMR.

```
┌─────────────────────────────────────────────────────────────────┐
│ Logo  | Keuangan ▼ |  Menu Button  │              │ Login │ ▲ │
├─────────────────────────────────────────────────────────────────┤
│ Keuangan > Dashboard / Menu Item / Report                     │
└─────────────────────────────────────────────────────────────────┘
```

### Menu Dropdown "Keuangan"
```
Keuangan
├── Dashboard Keuangan
├── Transaksi
│   ├── Input Transaksi
│   ├── Daftar Transaksi
│   └── Riwayat Transaksi
├── Laporan
│   ├── Laporan Arus Kas
│   ├── Laporan Neraca (Balance Sheet)
│   ├── Laporan Aktivitas
│   └── Laporan per Unit
├── Pengaturan
│   ├── Chart of Accounts
│   ├── Periode Fiskal
│   └── Konfigurasi Unit
└── Admin
    └── Impor Data (jika diperlukan)
```

### Menu Items untuk MVP
| Menu | Sub-Menu | Prioritas | Alasan |
|------|----------|-----------|--------|
| Dashboard Keuangan | - | P0 | Overview quick stats |
| Transaksi | Input, Daftar, Filter | P0 | Core functionality |
| Laporan | Arus Kas, Neraca, Aktivitas | P1 | Essential reporting |
| Pengaturan | COA, Periode, Unit | P1 | System setup |
| Admin | - | P2 | Bukan MVP priority |

---

## 3. FITUR UNTUK MVP

### Level 1: HARUS ADA (MVP Minimum)

#### 1.1 Dashboard Keuangan (Sederhana)
```
┌─────────────────────────────────────────────────┐
│ DASHBOARD KEUANGAN                              │
├─────────────────────────────────────────────────┤
│                                                  │
│  [Periode: 2025 ▼]  [Unit: Semua ▼]  [Filter] │
│                                                  │
│  ┌──────────────┐  ┌──────────────┐            │
│  │ Total Kas    │  │ Total Utang  │            │
│  │ Rp XXX.XXX   │  │ Rp XXX.XXX   │            │
│  └──────────────┘  └──────────────┘            │
│                                                  │
│  ┌──────────────┐  ┌──────────────┐            │
│  │ Total Aset   │  │ Aset Bersih  │            │
│  │ Rp XXX.XXX   │  │ Rp XXX.XXX   │            │
│  └──────────────┘  └──────────────┘            │
│                                                  │
│  Aktivitas Terbaru:                             │
│  • Transfer dari BCA (Rp 5jt) - 24 Des         │
│  • Pembayaran SPP KBTK (Rp 2jt) - 23 Des       │
│  • Donasi Zakat (Rp 3jt) - 22 Des              │
│                                                  │
└─────────────────────────────────────────────────┘
```

**Komponen**:
- 4 metric cards (Total Kas, Utang, Aset, Aset Bersih)
- Filter periode + unit
- Activity log terbaru (5-10 transaksi)
- Grafik arus kas sederhana (opsional)

**Kompleksitas**: Rendah (1-2 queries, 0 calculated fields)

#### 1.2 Input Transaksi (Form Sederhana)
```
┌──────────────────────────────────────────────┐
│ INPUT TRANSAKSI BARU                         │
├──────────────────────────────────────────────┤
│                                               │
│ Tanggal:        [Pilih Tanggal ▼]            │
│ Unit:           [Pilih Unit ▼]               │
│ Tipe:           [O Pemasukan O Pengeluaran]  │
│ Jumlah:         [_____________]              │
│ Deskripsi:      [_____________________]      │
│ Jenis Dana:     [Umum ▼]                     │
│ Keterangan:     [_____________________]      │
│                                               │
│              [Simpan]  [Batal]               │
└──────────────────────────────────────────────┘
```

**Fields Minimal**:
- Tanggal (date picker)
- Unit (dropdown dari units table)
- Tipe (Pemasukan/Pengeluaran)
- Jumlah (numeric)
- Deskripsi (textarea)
- Jenis Dana (Umum/Terbatas - dari aset bersih concept)
- Catatan opsional

**No di MVP**:
- ❌ Program linking (terlalu kompleks)
- ❌ Auto-journal generation (server-side saja)
- ❌ Multiple item lines (MVP gunakan single line)
- ❌ Attachment/bukti dokumentasi

**Kompleksitas**: Rendah (1 INSERT, basic validation)

#### 1.3 Daftar Transaksi (List + Filter)
```
┌─────────────────────────────────────────────────────────┐
│ DAFTAR TRANSAKSI                                        │
├─────────────────────────────────────────────────────────┤
│ Filter: [Unit ▼] [Tipe ▼] [Dari ▼] [Ke ▼] [Cari ▼]    │
├─────────────────────────────────────────────────────────┤
│ Tanggal    │ Unit      │ Deskripsi          │ Jumlah    │
├────────────┼───────────┼────────────────────┼───────────┤
│ 24 Des     │ Masjid    │ Donasi Zakat       │ Rp 3jt    │
│ 23 Des     │ KBTK      │ Pembayaran SPP     │ Rp 2jt    │
│ 22 Des     │ Daycare   │ Gaji Pengajar      │ Rp 5jt    │
│ 21 Des     │ Umum      │ Transfer dari BCA  │ Rp 5jt    │
│            │           │                    │           │
└─────────────────────────────────────────────────────────┘
```

**Fitur**:
- Sortable columns (Tanggal, Unit, Jumlah)
- Pagination (20 per halaman)
- Filter: Unit, Tipe (masuk/keluar), Tanggal range
- Search: Deskripsi
- Edit/Delete action (dalam row)

**Kompleksitas**: Rendah-Sedang (1-2 filtered queries, 20+ rows)

#### 1.4 Laporan Arus Kas (Cash Flow)
```
┌────────────────────────────────────────┐
│ LAPORAN ARUS KAS - 2025                │
├────────────────────────────────────────┤
│ [Periode: Jan-Dec ▼] [Download PDF]   │
├────────────────────────────────────────┤
│ PENERIMAAN (Desember 2025)             │
│ ├─ Donasi                 Rp XXX.XXX   │
│ ├─ SPP & Biaya            Rp XXX.XXX   │
│ ├─ Bunga Bank             Rp XXX.XXX   │
│ └─ Lainnya                Rp XXX.XXX   │
│ ─────────────────────────────────────  │
│ Total Penerimaan          Rp XXX.XXX   │
│                                         │
│ PENGELUARAN (Desember 2025)            │
│ ├─ Gaji Karyawan          Rp XXX.XXX   │
│ ├─ Operasional            Rp XXX.XXX   │
│ ├─ Program                Rp XXX.XXX   │
│ └─ Lainnya                Rp XXX.XXX   │
│ ─────────────────────────────────────  │
│ Total Pengeluaran         Rp XXX.XXX   │
│                                         │
│ NET ARUS KAS              Rp XXX.XXX   │
│ Saldo Awal                Rp XXX.XXX   │
│ SALDO AKHIR               Rp XXX.XXX   │
└────────────────────────────────────────┘
```

**Komponen**:
- Periode selector (month/year)
- 2 kategori utama: Penerimaan vs Pengeluaran
- Agregasi otomatis per kategori
- Export to PDF

**Kompleksitas**: Sedang (JOIN 3 tabel, SUM aggregation)

#### 1.5 Chart of Accounts (Read-Only untuk MVP)
```
┌────────────────────────────────────────────┐
│ DAFTAR AKUN                                │
├────────────────────────────────────────────┤
│ [Filter Kategori ▼] [Cari ▼]              │
├────────────────────────────────────────────┤
│ Kode   │ Nama Akun          │ Kategori    │
├────────┼────────────────────┼─────────────┤
│ 1101   │ Kas                │ Aset Lancar │
│ 1102   │ Bank - Umum        │ Aset Lancar │
│ 1103   │ Bank - Zakat       │ Aset Lancar │
│ 4101   │ Donasi             │ Pendapatan  │
│ ...    │ ...                │ ...         │
└────────────────────────────────────────────┘
```

**Fitur**:
- Dropdown kategori filter
- Search by nama
- Hanya READ (tidak ada add/edit/delete di MVP)

**Kompleksitas**: Sangat Rendah (1 SELECT query)

---

### Level 2: PERLU ADA TAPI BISA DISEDERHANAKAN (P1)

#### 2.1 Laporan Neraca (Balance Sheet)
Simplified version - hanya 3 section utama:
- **ASET**: Kas + Bank + Piutang
- **KEWAJIBAN**: Utang
- **ASET BERSIH**: Total (Aset - Kewajiban)

**Skip untuk MVP**:
- ❌ Detailed breakdown per restriction type
- ❌ Comparative analysis (tahun sebelumnya)
- ❌ Complex accounting adjustments

#### 2.2 Laporan Aktivitas (Income Statement)
Aggregated version hanya 2 section:
- **PENDAPATAN**: Semua sources
- **BEBAN**: Semua expenses
- **SURPLUS/DEFICIT**: Net result

**Skip untuk MVP**:
- ❌ Program-level matching
- ❌ Cost center allocation
- ❌ Multi-period comparison

#### 2.3 Pengaturan Periode Fiskal
Form sederhana untuk:
- Pilih tahun fiskal (dropdown)
- Tanggal mulai/akhir (auto-fill)
- Status (Open/Closed)

**Skip untuk MVP**:
- ❌ Period closing wizard
- ❌ Adjustment entries
- ❌ Carryforward calculations

---

### Level 3: DEFER KE PHASE 2 (Tidak di MVP)

#### 3.1 Program Kerja Integration ❌
**Alasan**: Terlalu kompleks, melibatkan:
- 667 baris code untuk form saja
- Nested line items
- Budget vs realization tracking
- Frequency multipliers
- Evaluation forms

**Alternative**: Dalam MVP, input transaksi tidak perlu link ke program. Cukup transaksi standalone.

#### 3.2 Manual Journal Entries ❌
**Alasan**: Non-akuntan tidak perlu fitur ini di awal
- Perlu pemahaman debit/credit
- Perlu validasi balanced entries
- Complex untuk maintenance

**Alternative**: Auto-generate journal dari transactions di backend

#### 3.3 Adjustment Entries ❌
**Alasan**: Hanya digunakan untuk period closing
- Depreciation
- Accruals
- Write-offs

**Alternative**: Phase 2 setelah core system stable

#### 3.4 Evaluation Module ❌
**Alasan**: Bukan keuangan, tapi program evaluation
- 773 baris code
- Multi-field form
- Kompleks logic

**Alternative**: Completely separate modul di Phase 3

#### 3.5 Period Closing Wizard ❌
**Alasan**: Complex workflow
- Opening balances setup
- Adjustment entries
- Final verification

**Alternative**: Phase 2 setelah stabilisasi

---

## 4. DATABASE SCHEMA UNTUK MVP

### Minimal Tables (7 tables)

```sql
-- 1. Units (sudah ada di almuhajirin2026)
-- Reuse dari Unit model yang sudah ada

-- 2. Fiscal Periods (Simplified)
CREATE TABLE fiscal_periods (
  id SERIAL PRIMARY KEY,
  year INTEGER UNIQUE NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  is_current BOOLEAN DEFAULT false,
  is_closed BOOLEAN DEFAULT false
);

-- 3. Chart of Accounts (Simplified COA)
CREATE TABLE kode_akun (
  kode VARCHAR(10) PRIMARY KEY,
  nama VARCHAR(255) NOT NULL,
  kategori VARCHAR(50) NOT NULL,  -- 'aset', 'kewajiban', 'aset_bersih', 'pendapatan', 'beban'
  jenis_dana VARCHAR(50) DEFAULT 'umum',  -- 'umum', 'terbatas'
  normal_balance VARCHAR(10) NOT NULL  -- 'debit' atau 'credit'
);

-- 4. Transactions (Core table - SIMPLIFIED)
CREATE TABLE transactions (
  id SERIAL PRIMARY KEY,
  transaction_date DATE NOT NULL,
  unit_id VARCHAR(36) NOT NULL,
  transaction_type VARCHAR(20) NOT NULL,  -- 'pemasukan', 'pengeluaran'
  amount DECIMAL(15,2) NOT NULL,
  description TEXT NOT NULL,
  jenis_dana VARCHAR(50) DEFAULT 'umum',  -- fund type
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (unit_id) REFERENCES units(id)
);

-- 5. Journal Entries (AUTO-GENERATED, Read-only untuk user)
CREATE TABLE journal_entries (
  id SERIAL PRIMARY KEY,
  transaction_id INTEGER NOT NULL,
  kode_akun VARCHAR(10) NOT NULL,
  entry_type VARCHAR(10) NOT NULL,  -- 'debit' atau 'credit'
  amount DECIMAL(15,2) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (transaction_id) REFERENCES transactions(id),
  FOREIGN KEY (kode_akun) REFERENCES kode_akun(kode)
);

-- 6. Unit Opening Balances
CREATE TABLE unit_opening_balances (
  id SERIAL PRIMARY KEY,
  fiscal_period_id INTEGER NOT NULL,
  unit_id VARCHAR(36) NOT NULL,
  kode_akun VARCHAR(10) NOT NULL,
  opening_balance DECIMAL(15,2) DEFAULT 0,
  FOREIGN KEY (fiscal_period_id) REFERENCES fiscal_periods(id),
  FOREIGN KEY (unit_id) REFERENCES units(id),
  FOREIGN KEY (kode_akun) REFERENCES kode_akun(kode),
  UNIQUE(fiscal_period_id, unit_id, kode_akun)
);

-- 7. System Config
CREATE TABLE system_config (
  id INTEGER PRIMARY KEY CHECK (id = 1),
  fiscal_year_start DATE NOT NULL,
  fiscal_year_end DATE NOT NULL,
  default_unit_id VARCHAR(36)
);
```

### TIDAK di MVP:
- ❌ `program_kerja`
- ❌ `program_items`
- ❌ `jurnal_umum` (manual journals)
- ❌ `jurnal_umum_details`
- ❌ `evaluations`
- ❌ `bidang` (use units directly)

**Total**: Dari 13 tables YAMR → 7 tables MVP (46% reduction)

---

## 5. USER INTERFACE REKOMENDASI

### Layout Pattern: Website + Drawer

```
┌─────────────────────────────────────────┐
│ ☰ │ Logo │ Keuangan ▼ │    │ User ▼   │
└─────────────────────────────────────────┘
┌─────────────────────────────────────────┐
│ Dashboard > [Current Page]              │
└─────────────────────────────────────────┘
┌─────────────────────────────────────────┐
│                                          │
│  [Content Area]                          │
│                                          │
│  Responsive: Mobile drawer, Desktop tab │
└─────────────────────────────────────────┘
```

### Tech Stack
- **Navbar**: Reuse dari `website/Navbar.tsx` component
- **Drawer**: shadcn/ui `Sheet` component (sudah ada)
- **Forms**: shadcn/ui `Form` + React Hook Form
- **Tables**: shadcn/ui `Table` + tanstack/react-table
- **Charts**: Recharts (simple bar/line charts)
- **Export**: jsPDF + html2pdf (lightweight)

### Form Design Principles

**✅ DO**:
- Gunakan label yang jelas & short
- Default values (tanggal hari ini, unit current user)
- Real-time validation feedback
- Success toast notification
- Loading states

**❌ DON'T**:
- Modal forms (gunakan page baru)
- Nested dropdowns (max 2 level)
- Required indicator asterisks (gunakan label)
- Inline editing (gunakan separate form)

---

## 6. IMPLEMENTASI TIMELINE

### Phase 1: MVP (12-14 minggu)

| Minggu | Task | Effort |
|--------|------|--------|
| 1-2 | Setup Prisma schema + API routes | 1 dev |
| 3-4 | Dashboard + Transaction input | 1-2 dev |
| 5-6 | Transaction list + filters | 1 dev |
| 7-8 | Basic reports (Cash flow, Balance sheet) | 1-2 dev |
| 9-10 | Settings page (COA, Periods) | 1 dev |
| 11-12 | Testing + Documentation | 1-2 dev |
| 13-14 | Buffer + Refinement | 1 dev |

### Phase 2: Enhancement (Weeks 15-20)

- [ ] Manual journal entries
- [ ] Opening balance setup wizard
- [ ] Period closing process
- [ ] Better charts/analytics
- [ ] Audit log

### Phase 3: Integration (Weeks 21+)

- [ ] Program kerja linkage
- [ ] Evaluation module
- [ ] Advanced reports
- [ ] Mobile app

---

## 7. FORMS INPUT YANG USER-FRIENDLY

### Input Transaksi (MVP) - Design Tips

```typescript
interface TransactionForm {
  // Simplified fields (7 total)
  tanggal: Date;           // Date picker (default: today)
  unit: string;            // Dropdown (pre-selected if only 1 unit)
  tipe: 'in' | 'out';      // Radio or Button group (visual)
  jumlah: number;          // Number input (currency formatted)
  deskripsi: string;       // Text input (required)
  jenisDana: 'umum' | 'terbatas';  // Dropdown or radio
  catatan?: string;        // Textarea (optional)
}

// Validation
- Tanggal: tidak boleh di masa depan, tidak boleh sebelum periode dibuka
- Unit: required
- Tipe: required
- Jumlah: > 0, max 9 digits
- Deskripsi: 5-200 chars
```

### Key UX Improvements vs YAMR:

| Aspek | YAMR | MVP Recommended | Alasan |
|-------|------|-----------------|--------|
| Fields | 12+ | 7 | Mengurangi cognitive load |
| Dropdown levels | 3+ (bidang→unit→program→item) | 1-2 | Faster selection |
| Mandatory fields | 8+ | 4-5 | Less validation errors |
| Form height | Scrollable (400px+) | Viewport fit | Better UX |
| Validation | Submit-time | Real-time inline | Immediate feedback |
| Error messages | Generic | Specific guidance | Clear what's wrong |

---

## 8. METRIC DASHBOARD REKOMENDASI

### KPI Untuk Dashboard

```
┌─────────────────────────────────────────┐
│ RINGKASAN KEUANGAN 2025                 │
├─────────────────────────────────────────┤
│                                          │
│ ┌──────────────┐  ┌──────────────┐    │
│ │ 💰 Kas       │  │ 💳 Utang     │    │
│ │ Rp 250 Juta  │  │ Rp 50 Juta   │    │
│ └──────────────┘  └──────────────┘    │
│                                          │
│ ┌──────────────┐  ┌──────────────┐    │
│ │ 📊 Total Aset│  │ 💼 Aset Brsih│    │
│ │ Rp 300 Juta  │  │ Rp 250 Juta  │    │
│ └──────────────┘  └──────────────┘    │
│                                          │
│ Penerimaan Bulan Ini:  Rp 125 Juta     │
│ Pengeluaran Bulan Ini: Rp 75 Juta      │
│ Surplus Bulan Ini:     Rp 50 Juta      │
│                                          │
└─────────────────────────────────────────┘
```

**Metrics yang penting**:
1. **Total Kas** - Most important (mudah dipahami)
2. **Total Aset** - For completeness
3. **Total Utang** - Risk indicator
4. **Aset Bersih** - Non-profit metric
5. **Penerimaan Bulan Ini** - Activity indicator
6. **Pengeluaran Bulan Ini** - Activity indicator
7. **Surplus/Deficit** - Bottom line

**NOT di MVP**:
- ❌ Restricted vs Unrestricted breakdown (terlalu technical)
- ❌ Unit comparison (bisa Phase 2)
- ❌ YoY comparison (perlu data historical)
- ❌ Forecast/Budget (belum ada program kerja)

---

## 9. API ROUTES YANG DIPERLUKAN

### Minimal API Endpoints untuk MVP

```
GET    /api/keuangan/dashboard        → Dashboard metrics
GET    /api/keuangan/transactions     → List transactions (with filters)
POST   /api/keuangan/transactions     → Create transaction
PUT    /api/keuangan/transactions/:id → Update transaction
DELETE /api/keuangan/transactions/:id → Delete transaction

GET    /api/keuangan/reports/cashflow → Cash flow report
GET    /api/keuangan/reports/balance-sheet → Balance sheet
GET    /api/keuangan/reports/activities → Activity report

GET    /api/keuangan/accounts         → List COA (read-only)
GET    /api/keuangan/units            → List units
GET    /api/keuangan/periods          → List fiscal periods

POST   /api/keuangan/export/pdf       → Export report to PDF
```

**Total**: 13 endpoints (vs YAMR ~40+ endpoints)

---

## 10. FITUR YANG HARUS DI-SKIP (Jelasan)

### ❌ Tidak di MVP

| Fitur | Kompleksitas | Alasan Skip | Timeline |
|-------|--------------|------------|----------|
| Program Kerja | ⭐⭐⭐⭐⭐ | Terlalu kompleks untuk MVP | Phase 3 |
| Manual Journal | ⭐⭐⭐ | Perlu akuntansi knowledge | Phase 2 |
| Adjustment Entries | ⭐⭐⭐⭐ | Hanya for period close | Phase 2 |
| Evaluasi Program | ⭐⭐⭐⭐ | Bukan modul keuangan | Separate |
| Period Closing | ⭐⭐⭐ | Workflow kompleks | Phase 2 |
| Bidang Consolidation | ⭐⭐⭐ | Kompleks aggregation | Phase 2 |
| Budget Variance Analysis | ⭐⭐⭐ | Perlu program linking | Phase 2 |
| Multiple COA | ⭐⭐⭐ | Maintenance overhead | v2.0 |

### ✅ Alternatif untuk MVP

1. **Jika perlu tracking program**:
   - Simpan program name di transaction.notes
   - Bukan linking, hanya searchable text

2. **Jika perlu journal entries**:
   - Auto-generate di backend (hidden dari user)
   - Hanya tampilkan di audit log/admin panel

3. **Jika perlu budgeting**:
   - Input budget manual (single number per period)
   - Bandingkan dengan actual spending

---

## 11. REKOMENDASI PRIORITAS PENGEMBANGAN

### Quick Wins (1-2 minggu)

```
✅ Dashboard (copy YAMR dashboard, simplify)
✅ Transaction List (use shadcn Table)
✅ Chart of Accounts (read-only list)
✅ Fiscal Period selector
```

### Core Features (3-4 minggu)

```
✅ Transaction Input Form
✅ Basic Cash Flow Report
✅ Simple Balance Sheet
✅ Delete/Edit transactions
```

### Polish (2-3 minggu)

```
✅ Real-time search & filter
✅ Export to PDF
✅ Success/Error notifications
✅ Mobile responsive
✅ Form validation
```

### Testing (2 minggu)

```
✅ Unit tests untuk business logic
✅ Integration tests untuk API
✅ E2E tests untuk critical flows
✅ UAT dengan stakeholder
```

---

## 12. STRUKTUR FOLDER PROJECT

### Rekomendasi folder structure untuk fitur keuangan di almuhajirin2026

```
src/
├── app/
│   ├── (DashboardLayout)/
│   │   └── keuangan/
│   │       ├── layout.tsx
│   │       ├── page.tsx                    # Dashboard
│   │       ├── transaksi/
│   │       │   ├── page.tsx               # List
│   │       │   └── baru/
│   │       │       └── page.tsx           # Input form
│   │       ├── laporan/
│   │       │   ├── arus-kas/
│   │       │   │   └── page.tsx
│   │       │   ├── neraca/
│   │       │   │   └── page.tsx
│   │       │   └── aktivitas/
│   │       │       └── page.tsx
│   │       └── pengaturan/
│   │           ├── page.tsx               # Settings overview
│   │           ├── periode-fiskal/
│   │           └── chart-akun/
│   └── api/
│       └── keuangan/
│           ├── dashboard/
│           │   └── route.ts
│           ├── transactions/
│           │   └── route.ts
│           ├── reports/
│           │   ├── cashflow/
│           │   ├── balance-sheet/
│           │   └── activities/
│           └── accounts/
│               └── route.ts
│
├── components/
│   └── keuangan/
│       ├── TransactionForm.tsx
│       ├── TransactionTable.tsx
│       ├── DashboardMetrics.tsx
│       ├── ReportTemplate.tsx
│       └── CashFlowChart.tsx
│
├── hooks/
│   └── keuangan/
│       ├── useTransactions.ts
│       ├── useReports.ts
│       └── useDashboard.ts
│
├── lib/
│   └── keuangan/
│       ├── calculations.ts          # Business logic
│       ├── formatting.ts            # Currency, date formatting
│       └── validators.ts            # Form validation
│
├── types/
│   └── keuangan.ts                  # TypeScript types
│
└── utils/
    └── keuangan/
        ├── api-client.ts            # API calls
        └── export.ts                # PDF export
```

---

## 13. REKOMENDASI TEKNIS

### Technology Choices untuk MVP

| Aspek | Pilihan | Alasan |
|-------|---------|--------|
| **Database** | PostgreSQL + Prisma | Sudah ada di project |
| **API** | Next.js API Routes | Sudah ada setup |
| **UI Components** | shadcn/ui + Tailwind | Sudah ada di project |
| **Forms** | React Hook Form | Minimal bundle size |
| **Tables** | shadcn/ui Table | No extra dependency |
| **Charts** | Recharts | Lightweight, good for simple charts |
| **Export** | html2pdf/jsPDF | Easy to implement |
| **Validation** | Zod | Type-safe, lightweight |
| **State** | React Context + useCallback | No Redux needed for MVP |

### Performance Targets

```
- Dashboard load: < 1s
- Transaction list load: < 2s (50 items)
- Report generation: < 3s
- Form submission: < 1s
- Mobile first responsive: 320px+
```

---

## 14. RISK MITIGATION

### Potensi Masalah & Solusi

| Risiko | Severity | Solusi |
|--------|----------|--------|
| Data validation error → double entry salah | High | Server-side validation, automated journal |
| User input berlebihan → system overload | Medium | Input limits, pagination, rate limiting |
| Incomplete transaction data | Medium | Form validation, required fields clear |
| Accidental delete transactions | High | Soft delete, audit log, confirmation dialog |
| Currency rounding issues | Medium | Use Decimal type in DB, proper formatting |
| Multi-user concurrent edits | Medium | Optimistic locking atau read-only after date |
| Report generation timeout (large data) | Low | Pagination, export in background |

---

## 15. SUCCESS METRICS

### Untuk evaluasi MVP

```
✅ Semua 7 menu items dapat diakses tanpa error
✅ Dashboard load < 1 second
✅ Transaction dapat dibuat & ditampilkan
✅ Laporan dapat di-generate dalam 3 detik
✅ Responsif di mobile (320px) dan desktop
✅ Zero critical bugs setelah 2 minggu UAT
✅ User dapat mengerti fitur tanpa training
✅ Data integrity (debit = credit selalu)
```

---

## KESIMPULAN

### MVP Keuangan untuk almuhajirin2026

**Scope**: 46% lebih sederhana dari YAMR
- **7 tabel** (dari 13)
- **10 halaman** (dari 20+)
- **13 API endpoints** (dari 40+)
- **5 form types** (dari 12+)

**Timeline**: 12-14 minggu development

**User Experience**:
- Website navbar + responsive drawer
- Minimal fields per form (7 vs 12+)
- Real-time validation
- Clear success feedback

**Struktur**:
- Dashboard dengan 7 metrics
- Transaction CRUD dengan filters
- 3 basic reports (cash flow, balance sheet, activities)
- Simple settings page
- COA read-only

**Tidak termasuk MVP**:
- Program kerja linkage
- Manual journal entries
- Period closing wizard
- Evaluation forms

**Roadmap Phase 2/3**:
- Program integration
- Advanced reporting
- Batch operations
- Mobile app

---

## APPENDIX: Chart of Accounts PSAK 45 (Simplified)

```
ASET (Assets)
├─ 1100 Aset Lancar (Current)
│  ├─ 1101 Kas
│  ├─ 1102 Bank Umum
│  ├─ 1103 Bank Zakat (Restricted)
│  ├─ 1104 Bank Wakaf (Restricted)
│  └─ 1105 Piutang
│
└─ 1200 Aset Tetap (Fixed)
   ├─ 1201 Tanah
   ├─ 1202 Bangunan
   └─ 1203 Peralatan

KEWAJIBAN (Liabilities)
├─ 2101 Utang
└─ 2102 Utang Pajak

ASET BERSIH (Net Assets)
├─ 3101 Aset Bersih Tidak Terbatas
└─ 3102 Aset Bersih Terbatas

PENDAPATAN (Revenue)
├─ 4101 Donasi
├─ 4102 Zakat Masuk
├─ 4103 SPP
├─ 4104 Sewa
└─ 4105 Bunga Bank

BEBAN (Expenses)
├─ 5101 Gaji
├─ 5102 Operasional
├─ 5103 Program
└─ 5104 Penyusutan
```

---

**Prepared**: December 24, 2025
**Version**: MVP 1.0 Recommendations
**Status**: Ready for Development
