/**
 * Comprehensive Seed Program Kerja from CSV Files
 * Yayasan Al Muhajirin Rewwin (YAMR)
 *
 * This script:
 * 1. Clears existing program data
 * 2. Imports all CSV data with standardized codes
 * 3. Associates each item with appropriate kode akun
 *
 * Code Format: BIDANG-UNIT-IN/OT-YEAR-###
 * Example: SO-KBT-IN-2026-001 (Pendapatan KBTK item 1)
 */

import { PrismaClient, Prisma } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const prisma = new PrismaClient();

// Mapping bidang names from CSV to database codes
const BIDANG_MAPPING: Record<string, { bidang: string; unit: string }> = {
  'SEKRETARIAT': { bidang: 'SK', unit: 'SEK' },
  'USAHA & PENGADAAN': { bidang: 'SK', unit: 'DAN' },
  'KEDAI': { bidang: 'SK', unit: 'KED' },
  'KOLAM RENANG': { bidang: 'SK', unit: 'KOL' },
  'PEMELIHARAAN & PEMBANGUNAN': { bidang: 'SK', unit: 'MAI' },
  'KEBERSIHAN KEAMANAN': { bidang: 'SK', unit: 'KEA' },
  'KEHUMASAN': { bidang: 'SK', unit: 'HUM' },
  'KETAKMIRAN': { bidang: 'AG', unit: 'TKM' },
  'REMASKIDZ': { bidang: 'AG', unit: 'KID' },
  'KEMUSLIMATAN': { bidang: 'AG', unit: 'MUS' },
  'TPQ': { bidang: 'SO', unit: 'TPQ' },
  'DAYCARE': { bidang: 'SO', unit: 'DCR' },
  'KBTK': { bidang: 'SO', unit: 'KBT' },
  'POLIKLINIK': { bidang: 'KM', unit: 'POL' },
  'POLIGIGI': { bidang: 'KM', unit: 'POL' }, // Same unit as Poliklinik
  'LAZMU': { bidang: 'KM', unit: 'LAZ' },
  'AMBULANS': { bidang: 'KM', unit: 'AMB' },
  'SAKITJENAZAH': { bidang: 'KM', unit: 'JNZ' },
  'WAFMU': { bidang: 'KM', unit: 'WAF' },
};

// Kode Akun mapping based on item categories
// This maps kategori/keterangan patterns to specific account codes
const INCOME_ACCOUNT_MAPPING: Array<{ pattern: RegExp; kodeAkun: string }> = [
  // KBTK
  { pattern: /pendaftaran.*kb|formulir.*kb/i, kodeAkun: '4110' },
  { pattern: /pendaftaran.*tk|formulir.*tk/i, kodeAkun: '4110' },
  { pattern: /uang pangkal|daftar ulang/i, kodeAkun: '4110' },
  { pattern: /spp.*kbtk|syariyah|spp.*kb|spp.*tk/i, kodeAkun: '4110' },
  { pattern: /kegiatan.*sekolah|kegiatan.*kb|kegiatan.*tk/i, kodeAkun: '4110' },
  { pattern: /buku.*kb|buku.*tk/i, kodeAkun: '4110' },
  { pattern: /seragam.*siswa/i, kodeAkun: '4110' },
  { pattern: /bop.*kb|bop.*tk|bop/i, kodeAkun: '4110' },

  // Daycare
  { pattern: /daycare|day.*care/i, kodeAkun: '4111' },
  { pattern: /spp.*daycare/i, kodeAkun: '4111' },

  // Kolam Renang
  { pattern: /kolam.*renang|tiket.*masuk|membership/i, kodeAkun: '4112' },

  // Kedai
  { pattern: /kedai|usaha.*kedai/i, kodeAkun: '4113' },

  // Ambulans
  { pattern: /ambulan/i, kodeAkun: '4120' },

  // Jenazah
  { pattern: /jenazah/i, kodeAkun: '4121' },

  // Poliklinik
  { pattern: /poliklinik|poligigi|gigi|pelayanan.*kesehatan/i, kodeAkun: '4122' },

  // Qurban
  { pattern: /qurban|kurban/i, kodeAkun: '4130' },

  // Zakat
  { pattern: /zakat.*maal|zakat.*mal/i, kodeAkun: '4201' },
  { pattern: /zakat.*fitrah/i, kodeAkun: '4201' },

  // Wakaf
  { pattern: /wakaf/i, kodeAkun: '4202' },

  // Infaq Jumat
  { pattern: /infaq.*jumat|infaq.*jum'at|sholat.*jumat/i, kodeAkun: '4102' },

  // Infaq Ramadan
  { pattern: /ramadhan|ramadan|tarawih|idul.*fitri|lebaran/i, kodeAkun: '4203' },

  // Infaq Terikat
  { pattern: /infaq.*terikat|donasi.*terikat/i, kodeAkun: '4205' },

  // TPQ
  { pattern: /tpq|spp.*tpq|pendaftaran.*tpq/i, kodeAkun: '4101' },

  // Ketakmiran - Infaq Masjid
  { pattern: /infaq.*masjid|operasional.*masjid|kajian/i, kodeAkun: '4102' },

  // Alokasi Operasional (internal transfer)
  { pattern: /alokasi.*operasional/i, kodeAkun: '4190' },

  // Default - Donasi Umum
  { pattern: /infaq.*bebas|donasi|sumbangan/i, kodeAkun: '4101' },
];

const EXPENSE_ACCOUNT_MAPPING: Array<{ pattern: RegExp; kodeAkun: string }> = [
  // Gaji & Honor
  { pattern: /gaji|honor|hr.*petugas|hr.*dokter|hr.*asisten/i, kodeAkun: '5201' },
  { pattern: /kesejahteraan/i, kodeAkun: '5201' },

  // THR & Tunjangan
  { pattern: /thr|tunjangan|transport.*pengurus|kinerja.*pengurus/i, kodeAkun: '5202' },
  { pattern: /^thr /i, kodeAkun: '5203' },

  // Utilities
  { pattern: /listrik|rekening.*listrik/i, kodeAkun: '5210' },
  { pattern: /pdam|air|rekening.*air/i, kodeAkun: '5211' },
  { pattern: /wifi|internet|telpon|telepon/i, kodeAkun: '5212' },

  // Pemeliharaan
  { pattern: /pemeliharaan|perbaikan|renovasi|perawatan/i, kodeAkun: '5220' },

  // ATK
  { pattern: /atk|alat.*tulis|fotocopy|percetakan/i, kodeAkun: '5240' },

  // Kebersihan & Keamanan
  { pattern: /kebersihan|cleaning|sampah|potong.*rumput/i, kodeAkun: '5241' },
  { pattern: /keamanan|satpam|security|cctv/i, kodeAkun: '5242' },

  // Konsumsi & Rapat
  { pattern: /konsumsi|rapat|makan.*minum|snack|katering/i, kodeAkun: '5260' },
  { pattern: /nasi.*bungkus|nasi.*jumat/i, kodeAkun: '5260' },

  // Publikasi
  { pattern: /publikasi|kehumasan|cetak|brosur|kalender|website|desain/i, kodeAkun: '5270' },

  // TPQ
  { pattern: /tpq/i, kodeAkun: '5111' },
  { pattern: /ekstrakurikuler|ekstra.*banjari|ekstra.*kaligrafi|ekstra.*angklung/i, kodeAkun: '5111' },

  // Ketakmiran
  { pattern: /marbot|muadzin|imam|khatib/i, kodeAkun: '5112' },
  { pattern: /pengajian|kajian/i, kodeAkun: '5112' },
  { pattern: /ketakmiran/i, kodeAkun: '5112' },

  // Remas/Kids
  { pattern: /remas|mkidz|remaja.*masjid/i, kodeAkun: '5113' },

  // Kemuslimatan
  { pattern: /kemuslim|muslimah/i, kodeAkun: '5114' },

  // KBTK
  { pattern: /kbtk/i, kodeAkun: '5121' },
  { pattern: /guru.*kbtk|ustadzah.*kbtk/i, kodeAkun: '5121' },
  { pattern: /seragam.*siswa|perlengkapan.*sekolah|media.*pembelajaran/i, kodeAkun: '5121' },

  // Daycare
  { pattern: /daycare|day.*care/i, kodeAkun: '5122' },
  { pattern: /ustadzah.*daycare|pengasuh/i, kodeAkun: '5122' },

  // Poliklinik
  { pattern: /poliklinik|poligigi|dokter|obat/i, kodeAkun: '5123' },

  // Kolam Renang
  { pattern: /kolam.*renang/i, kodeAkun: '5124' },

  // LAZ
  { pattern: /laz|beasiswa|penyaluran.*zakat/i, kodeAkun: '5131' },

  // Ambulans
  { pattern: /ambulan/i, kodeAkun: '5132' },

  // Jenazah
  { pattern: /jenazah|kafan|kematian|santunan/i, kodeAkun: '5133' },

  // Qurban
  { pattern: /qurban|kurban/i, kodeAkun: '5280' },

  // Proyek Infrastruktur (Capital expenditure - map to maintenance for now)
  { pattern: /proyek|infrastruktur|renovasi.*terencana/i, kodeAkun: '5220' },

  // Alokasi Operasional (to Sekretariat)
  { pattern: /alokasi.*operasional.*sekretariat/i, kodeAkun: '5290' },
  { pattern: /kontribusi/i, kodeAkun: '5290' },

  // Sewa
  { pattern: /sewa.*gedung/i, kodeAkun: '5290' },

  // P3K
  { pattern: /p3k/i, kodeAkun: '5123' },

  // Program PHBI
  { pattern: /phbi|isra.*mi'raj|maulid|tahun.*baru.*hijriyah/i, kodeAkun: '5112' },
  { pattern: /halal.*bihalal|idul.*adha|ramadhan|ramadan/i, kodeAkun: '5112' },
];

// Default kode akun if no pattern matches
const DEFAULT_KODE_AKUN = {
  pendapatan: '4190', // Pendapatan Lain-lain
  pengeluaran: '5290', // Beban Lain-lain
};

interface CSVRow {
  idur: string;
  no: string;
  bidang: string;
  kodeOriginal: string;
  kategori: string;
  keterangan: string;
  total: string;
  jan: string;
  feb: string;
  mar: string;
  apr: string;
  mei: string;
  jun: string;
  jul: string;
  agu: string;
  sep: string;
  okt: string;
  nov: string;
  des: string;
}

interface ProcessedItem {
  kodeItem: string;
  namaItem: string;
  keterangan: string | null;
  kategori: string;
  total: number;
  kodeAkun: string;
  monthly: {
    jan: number;
    feb: number;
    mar: number;
    apr: number;
    mei: number;
    jun: number;
    jul: number;
    agu: number;
    sep: number;
    okt: number;
    nov: number;
    des: number;
  };
}

function parseNumber(value: string): number {
  if (!value || value.trim() === '') return 0;
  const cleaned = value.replace(/\./g, '').replace(/,/g, '.').trim();
  return parseFloat(cleaned) || 0;
}

function parseCSVLine(line: string): string[] {
  const values: string[] = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      values.push(current.trim().replace(/^"|"$/g, ''));
      current = '';
    } else {
      current += char;
    }
  }
  values.push(current.trim().replace(/^"|"$/g, ''));
  return values;
}

function parseCSV(content: string, isIncome: boolean): CSVRow[] {
  const lines = content.trim().split('\n');
  const rows: CSVRow[] = [];

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i];
    if (!line.trim()) continue;

    const values = parseCSVLine(line);
    if (values.length < 19) continue;

    // IN.csv: IDUR,NO,BIDANG,KODE,KETERANGAN,KATEGORI,TOTAL,...
    // OUT.csv: IDUR,NO,BIDANG,KODE,KATEGORI,KETERANGAN,TOTAL,...
    const row: CSVRow = isIncome
      ? {
          idur: values[0],
          no: values[1],
          bidang: values[2],
          kodeOriginal: values[3],
          keterangan: values[4],
          kategori: values[5],
          total: values[6],
          jan: values[7],
          feb: values[8],
          mar: values[9],
          apr: values[10],
          mei: values[11],
          jun: values[12],
          jul: values[13],
          agu: values[14],
          sep: values[15],
          okt: values[16],
          nov: values[17],
          des: values[18],
        }
      : {
          idur: values[0],
          no: values[1],
          bidang: values[2],
          kodeOriginal: values[3],
          kategori: values[4],
          keterangan: values[5],
          total: values[6],
          jan: values[7],
          feb: values[8],
          mar: values[9],
          apr: values[10],
          mei: values[11],
          jun: values[12],
          jul: values[13],
          agu: values[14],
          sep: values[15],
          okt: values[16],
          nov: values[17],
          des: values[18],
        };

    rows.push(row);
  }

  return rows;
}

function getKodeAkun(keterangan: string, kategori: string, isIncome: boolean): string {
  const searchText = `${keterangan} ${kategori}`.toLowerCase();
  const mapping = isIncome ? INCOME_ACCOUNT_MAPPING : EXPENSE_ACCOUNT_MAPPING;

  for (const { pattern, kodeAkun } of mapping) {
    if (pattern.test(searchText)) {
      return kodeAkun;
    }
  }

  return isIncome ? DEFAULT_KODE_AKUN.pendapatan : DEFAULT_KODE_AKUN.pengeluaran;
}

function processRows(
  rows: CSVRow[],
  isIncome: boolean,
  sequenceCounters: Map<string, number>
): Map<string, ProcessedItem[]> {
  const programItems = new Map<string, ProcessedItem[]>();

  for (const row of rows) {
    const bidangName = row.bidang.toUpperCase().trim();
    const mapping = BIDANG_MAPPING[bidangName];

    if (!mapping) {
      console.log(`  ⚠️  Unknown bidang: ${bidangName}`);
      continue;
    }

    const total = parseNumber(row.total);
    // Include all items, even with 0 values (they're budget placeholders)

    const type = isIncome ? 'IN' : 'OT';
    const programKey = `${mapping.bidang}-${mapping.unit}-${type}`;

    // Get next sequence number for this program
    const currentSeq = (sequenceCounters.get(programKey) || 0) + 1;
    sequenceCounters.set(programKey, currentSeq);

    // Generate standardized code
    const kodeItem = `${mapping.bidang}-${mapping.unit}-${type}-2026-${currentSeq.toString().padStart(3, '0')}`;

    // Determine kode akun
    const kodeAkun = getKodeAkun(row.keterangan, row.kategori, isIncome);

    const item: ProcessedItem = {
      kodeItem,
      namaItem: row.keterangan || row.kategori || `Item ${currentSeq}`,
      keterangan: row.kategori || null,
      kategori: row.kategori,
      total,
      kodeAkun,
      monthly: {
        jan: parseNumber(row.jan),
        feb: parseNumber(row.feb),
        mar: parseNumber(row.mar),
        apr: parseNumber(row.apr),
        mei: parseNumber(row.mei),
        jun: parseNumber(row.jun),
        jul: parseNumber(row.jul),
        agu: parseNumber(row.agu),
        sep: parseNumber(row.sep),
        okt: parseNumber(row.okt),
        nov: parseNumber(row.nov),
        des: parseNumber(row.des),
      },
    };

    if (!programItems.has(programKey)) {
      programItems.set(programKey, []);
    }
    programItems.get(programKey)!.push(item);
  }

  return programItems;
}

async function seedProgramsComprehensive() {
  console.log('📊 Starting comprehensive program kerja seeding...');
  console.log('');

  // 1. Clear existing program data
  console.log('🗑️  Clearing existing program data...');
  await prisma.programItem.deleteMany({});
  await prisma.programKerja.deleteMany({});
  console.log('   ✅ Cleared existing data');
  console.log('');

  // 2. Get or create fiscal period for 2026
  let fiscalPeriod = await prisma.fiscalPeriod.findFirst({
    where: { year: 2026 },
  });

  if (!fiscalPeriod) {
    fiscalPeriod = await prisma.fiscalPeriod.create({
      data: {
        year: 2026,
        name: 'Tahun Anggaran 2026',
        startDate: new Date('2026-01-01'),
        endDate: new Date('2026-12-31'),
        isActive: true,
        isClosed: false,
      },
    });
    console.log('📅 Created fiscal period 2026');
  } else {
    console.log('📅 Using existing fiscal period 2026');
  }
  console.log('');

  // 3. Read CSV files
  const incomePath = path.join(__dirname, '../docs/Materi/program_digital_IN.csv');
  const expensePath = path.join(__dirname, '../docs/Materi/program_digital_OUT.csv');

  const incomeContent = fs.readFileSync(incomePath, 'utf-8');
  const expenseContent = fs.readFileSync(expensePath, 'utf-8');

  const incomeRows = parseCSV(incomeContent, true);
  const expenseRows = parseCSV(expenseContent, false);

  console.log(`📥 Found ${incomeRows.length} income items from CSV`);
  console.log(`📤 Found ${expenseRows.length} expense items from CSV`);
  console.log('');

  // 4. Process rows and generate standardized codes
  const sequenceCounters = new Map<string, number>();

  const incomeItems = processRows(incomeRows, true, sequenceCounters);
  const expenseItems = processRows(expenseRows, false, sequenceCounters);

  console.log(`📊 Processed ${incomeItems.size} income programs`);
  console.log(`📊 Processed ${expenseItems.size} expense programs`);
  console.log('');

  // 5. Create programs and items
  let programCount = 0;
  let itemCount = 0;

  // Process income programs
  for (const [programKey, items] of incomeItems) {
    const [bidangKode, unitKode, type] = programKey.split('-');
    const programKode = `${programKey}-2026`;

    // Find bidang name for program name
    let bidangName = '';
    for (const [name, mapping] of Object.entries(BIDANG_MAPPING)) {
      if (mapping.bidang === bidangKode && mapping.unit === unitKode) {
        bidangName = name;
        break;
      }
    }

    const program = await prisma.programKerja.create({
      data: {
        kode: programKode,
        nama: `Program Pendapatan ${bidangName || unitKode}`,
        jenis: 'pendapatan',
        sifat: 'rutin',
        status: 'aktif',
        fiscalYear: 2026,
        bidangKode,
        unitKerjaKode: unitKode,
        fiscalPeriodId: fiscalPeriod.id,
      },
    });

    programCount++;

    // Create items
    for (const item of items) {
      await prisma.programItem.create({
        data: {
          programId: program.id,
          kodeItem: item.kodeItem,
          namaItem: item.namaItem,
          keterangan: item.keterangan,
          volume: new Prisma.Decimal(1),
          satuan: 'paket',
          hargaSatuan: new Prisma.Decimal(item.total),
          jumlah: new Prisma.Decimal(item.total),
          kodeAkun: item.kodeAkun,
          jan: item.monthly.jan > 0 ? new Prisma.Decimal(item.monthly.jan) : null,
          feb: item.monthly.feb > 0 ? new Prisma.Decimal(item.monthly.feb) : null,
          mar: item.monthly.mar > 0 ? new Prisma.Decimal(item.monthly.mar) : null,
          apr: item.monthly.apr > 0 ? new Prisma.Decimal(item.monthly.apr) : null,
          mei: item.monthly.mei > 0 ? new Prisma.Decimal(item.monthly.mei) : null,
          jun: item.monthly.jun > 0 ? new Prisma.Decimal(item.monthly.jun) : null,
          jul: item.monthly.jul > 0 ? new Prisma.Decimal(item.monthly.jul) : null,
          agu: item.monthly.agu > 0 ? new Prisma.Decimal(item.monthly.agu) : null,
          sep: item.monthly.sep > 0 ? new Prisma.Decimal(item.monthly.sep) : null,
          okt: item.monthly.okt > 0 ? new Prisma.Decimal(item.monthly.okt) : null,
          nov: item.monthly.nov > 0 ? new Prisma.Decimal(item.monthly.nov) : null,
          des: item.monthly.des > 0 ? new Prisma.Decimal(item.monthly.des) : null,
        },
      });
      itemCount++;
    }

    console.log(`   ✅ ${programKode}: ${items.length} items`);
  }

  // Process expense programs
  for (const [programKey, items] of expenseItems) {
    const [bidangKode, unitKode, type] = programKey.split('-');
    const programKode = `${programKey}-2026`;

    // Find bidang name for program name
    let bidangName = '';
    for (const [name, mapping] of Object.entries(BIDANG_MAPPING)) {
      if (mapping.bidang === bidangKode && mapping.unit === unitKode) {
        bidangName = name;
        break;
      }
    }

    const program = await prisma.programKerja.create({
      data: {
        kode: programKode,
        nama: `Program Pengeluaran ${bidangName || unitKode}`,
        jenis: 'pengeluaran',
        sifat: 'rutin',
        status: 'aktif',
        fiscalYear: 2026,
        bidangKode,
        unitKerjaKode: unitKode,
        fiscalPeriodId: fiscalPeriod.id,
      },
    });

    programCount++;

    // Create items
    for (const item of items) {
      await prisma.programItem.create({
        data: {
          programId: program.id,
          kodeItem: item.kodeItem,
          namaItem: item.namaItem,
          keterangan: item.keterangan,
          volume: new Prisma.Decimal(1),
          satuan: 'paket',
          hargaSatuan: new Prisma.Decimal(item.total),
          jumlah: new Prisma.Decimal(item.total),
          kodeAkun: item.kodeAkun,
          jan: item.monthly.jan > 0 ? new Prisma.Decimal(item.monthly.jan) : null,
          feb: item.monthly.feb > 0 ? new Prisma.Decimal(item.monthly.feb) : null,
          mar: item.monthly.mar > 0 ? new Prisma.Decimal(item.monthly.mar) : null,
          apr: item.monthly.apr > 0 ? new Prisma.Decimal(item.monthly.apr) : null,
          mei: item.monthly.mei > 0 ? new Prisma.Decimal(item.monthly.mei) : null,
          jun: item.monthly.jun > 0 ? new Prisma.Decimal(item.monthly.jun) : null,
          jul: item.monthly.jul > 0 ? new Prisma.Decimal(item.monthly.jul) : null,
          agu: item.monthly.agu > 0 ? new Prisma.Decimal(item.monthly.agu) : null,
          sep: item.monthly.sep > 0 ? new Prisma.Decimal(item.monthly.sep) : null,
          okt: item.monthly.okt > 0 ? new Prisma.Decimal(item.monthly.okt) : null,
          nov: item.monthly.nov > 0 ? new Prisma.Decimal(item.monthly.nov) : null,
          des: item.monthly.des > 0 ? new Prisma.Decimal(item.monthly.des) : null,
        },
      });
      itemCount++;
    }

    console.log(`   ✅ ${programKode}: ${items.length} items`);
  }

  console.log('');
  console.log('═══════════════════════════════════════════════════════════════');
  console.log(`📊 SEEDING COMPLETED!`);
  console.log(`   Programs created: ${programCount}`);
  console.log(`   Items created: ${itemCount}`);
  console.log('═══════════════════════════════════════════════════════════════');
}

// Run if called directly
seedProgramsComprehensive()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

export { seedProgramsComprehensive };
