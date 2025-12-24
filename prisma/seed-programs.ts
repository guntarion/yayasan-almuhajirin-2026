/**
 * Seed Program Kerja from CSV Files
 * Yayasan Al Muhajirin Rewwin (YAMR)
 */

import { PrismaClient, Prisma } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

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
  'POLIGIGI': { bidang: 'KM', unit: 'POL' },
  'LAZMU': { bidang: 'KM', unit: 'LAZ' },
  'AMBULANS': { bidang: 'KM', unit: 'AMB' },
  'SAKITJENAZAH': { bidang: 'KM', unit: 'JNZ' },
  'WAFMU': { bidang: 'KM', unit: 'WAF' },
};

// Default kode akun for income and expense per unit
const UNIT_KODE_AKUN: Record<string, { pendapatan: string; pengeluaran: string }> = {
  'SEK': { pendapatan: '4101', pengeluaran: '5240' }, // Sekretariat -> ATK
  'DAN': { pendapatan: '4101', pengeluaran: '5290' }, // Usaha & Pengadaan -> Lain-lain
  'KED': { pendapatan: '4113', pengeluaran: '5290' }, // Kedai -> Pendapatan Kedai
  'KOL': { pendapatan: '4112', pengeluaran: '5124' }, // Kolam Renang
  'MAI': { pendapatan: '4101', pengeluaran: '5220' }, // Pemeliharaan -> Beban Pemeliharaan Gedung
  'KEA': { pendapatan: '4101', pengeluaran: '5241' }, // Kebersihan Keamanan
  'HUM': { pendapatan: '4101', pengeluaran: '5270' }, // Kehumasan -> Publikasi
  'TKM': { pendapatan: '4102', pengeluaran: '5112' }, // Ketakmiran
  'KID': { pendapatan: '4101', pengeluaran: '5113' }, // Remaskidz
  'MUS': { pendapatan: '4101', pengeluaran: '5114' }, // Kemuslimatan
  'TPQ': { pendapatan: '4101', pengeluaran: '5111' }, // TPQ
  'DCR': { pendapatan: '4111', pengeluaran: '5122' }, // Daycare
  'KBT': { pendapatan: '4110', pengeluaran: '5121' }, // KBTK
  'POL': { pendapatan: '4122', pengeluaran: '5123' }, // Poliklinik
  'LAZ': { pendapatan: '4201', pengeluaran: '5131' }, // LAZMU
  'AMB': { pendapatan: '4120', pengeluaran: '5132' }, // Ambulans
  'JNZ': { pendapatan: '4121', pengeluaran: '5133' }, // Jenazah
  'WAF': { pendapatan: '4202', pengeluaran: '5290' }, // WAFMU -> Wakaf
};

const DEFAULT_KODE_AKUN = {
  pendapatan: '4190', // Pendapatan Lain-lain
  pengeluaran: '5290', // Beban Lain-lain
};

interface CSVRow {
  idur: string;
  no: string;
  bidang: string;
  kode: string;
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

function parseNumber(value: string): number {
  if (!value || value.trim() === '') return 0;
  // Remove dots (thousand separators) and convert to number
  const cleaned = value.replace(/\./g, '').replace(/,/g, '.').trim();
  return parseFloat(cleaned) || 0;
}

function parseCSV(content: string, isIncome: boolean): CSVRow[] {
  const lines = content.trim().split('\n');
  const rows: CSVRow[] = [];

  // Skip header
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i];
    if (!line.trim()) continue;

    // Handle CSV with potential commas in quoted fields
    const values = line.split(',').map(v => v.trim().replace(/^"|"$/g, ''));

    if (values.length < 19) continue;

    // IN.csv: IDUR,NO,BIDANG,KODE,KETERANGAN,KATEGORI,TOTAL,...
    // OUT.csv: IDUR,NO,BIDANG,KODE,KATEGORI,KETERANGAN,TOTAL,...
    const row: CSVRow = isIncome
      ? {
          idur: values[0],
          no: values[1],
          bidang: values[2],
          kode: values[3],
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
          kode: values[3],
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

async function seedPrograms() {
  console.log('📊 Seeding program kerja from CSV...');

  // Get fiscal period for 2026
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
  }

  // Read CSV files
  const incomePath = path.join(__dirname, '../docs/Materi/program_digital_IN.csv');
  const expensePath = path.join(__dirname, '../docs/Materi/program_digital_OUT.csv');

  const incomeContent = fs.readFileSync(incomePath, 'utf-8');
  const expenseContent = fs.readFileSync(expensePath, 'utf-8');

  const incomeRows = parseCSV(incomeContent, true);
  const expenseRows = parseCSV(expenseContent, false);

  console.log(`  📥 Found ${incomeRows.length} income programs`);
  console.log(`  📤 Found ${expenseRows.length} expense programs`);

  // Group by bidang for program kerja
  const programGroups = new Map<string, CSVRow[]>();

  // Process income rows
  for (const row of incomeRows) {
    const bidangName = row.bidang.toUpperCase().trim();
    const key = `${bidangName}_pendapatan`;
    if (!programGroups.has(key)) {
      programGroups.set(key, []);
    }
    programGroups.get(key)!.push(row);
  }

  // Process expense rows
  for (const row of expenseRows) {
    const bidangName = row.bidang.toUpperCase().trim();
    const key = `${bidangName}_pengeluaran`;
    if (!programGroups.has(key)) {
      programGroups.set(key, []);
    }
    programGroups.get(key)!.push(row);
  }

  let programCount = 0;
  let itemCount = 0;

  for (const [key, rows] of programGroups) {
    const [bidangName, jenis] = key.split('_');
    const mapping = BIDANG_MAPPING[bidangName];

    if (!mapping) {
      console.log(`  ⚠️  Skipping unknown bidang: ${bidangName}`);
      continue;
    }

    // Skip if no valid rows
    const validRows = rows.filter(r => parseNumber(r.total) > 0);
    if (validRows.length === 0) continue;

    // Generate program code
    const programKode = `${mapping.bidang}-${mapping.unit}-${jenis === 'pendapatan' ? 'IN' : 'OT'}-2026`;

    // Check if program already exists
    const existing = await prisma.programKerja.findFirst({
      where: { kode: programKode },
    });

    if (existing) {
      console.log(`  ⏭️  Skipping existing program: ${programKode}`);
      continue;
    }

    // Create program
    const program = await prisma.programKerja.create({
      data: {
        kode: programKode,
        nama: `Program ${jenis === 'pendapatan' ? 'Pendapatan' : 'Pengeluaran'} ${bidangName}`,
        jenis: jenis as 'pendapatan' | 'pengeluaran',
        sifat: 'rutin',
        status: 'aktif',
        fiscalYear: 2026,
        bidangKode: mapping.bidang,
        unitKerjaKode: mapping.unit,
        fiscalPeriodId: fiscalPeriod.id,
      },
    });

    programCount++;

    // Create program items
    for (let i = 0; i < validRows.length; i++) {
      const row = validRows[i];
      const total = parseNumber(row.total);
      if (total === 0) continue;

      const kodeItem = row.kode || `${programKode}-${(i + 1).toString().padStart(3, '0')}`;
      const namaItem = row.keterangan || row.kategori || `Item ${i + 1}`;

      // Get monthly values
      const jan = parseNumber(row.jan);
      const feb = parseNumber(row.feb);
      const mar = parseNumber(row.mar);
      const apr = parseNumber(row.apr);
      const mei = parseNumber(row.mei);
      const jun = parseNumber(row.jun);
      const jul = parseNumber(row.jul);
      const agu = parseNumber(row.agu);
      const sep = parseNumber(row.sep);
      const okt = parseNumber(row.okt);
      const nov = parseNumber(row.nov);
      const des = parseNumber(row.des);

      await prisma.programItem.create({
        data: {
          programId: program.id,
          kodeItem,
          namaItem,
          keterangan: row.kategori || null,
          volume: new Prisma.Decimal(1),
          satuan: 'paket',
          hargaSatuan: new Prisma.Decimal(total),
          jumlah: new Prisma.Decimal(total),
          kodeAkun: UNIT_KODE_AKUN[mapping.unit]?.[jenis as 'pendapatan' | 'pengeluaran']
            || (jenis === 'pendapatan' ? DEFAULT_KODE_AKUN.pendapatan : DEFAULT_KODE_AKUN.pengeluaran),
          jan: jan > 0 ? new Prisma.Decimal(jan) : null,
          feb: feb > 0 ? new Prisma.Decimal(feb) : null,
          mar: mar > 0 ? new Prisma.Decimal(mar) : null,
          apr: apr > 0 ? new Prisma.Decimal(apr) : null,
          mei: mei > 0 ? new Prisma.Decimal(mei) : null,
          jun: jun > 0 ? new Prisma.Decimal(jun) : null,
          jul: jul > 0 ? new Prisma.Decimal(jul) : null,
          agu: agu > 0 ? new Prisma.Decimal(agu) : null,
          sep: sep > 0 ? new Prisma.Decimal(sep) : null,
          okt: okt > 0 ? new Prisma.Decimal(okt) : null,
          nov: nov > 0 ? new Prisma.Decimal(nov) : null,
          des: des > 0 ? new Prisma.Decimal(des) : null,
        },
      });

      itemCount++;
    }

    console.log(`  ✅ Created: ${programKode} with ${validRows.length} items`);
  }

  console.log(`📊 Seeding completed: ${programCount} programs, ${itemCount} items`);
}

// Run if called directly
seedPrograms()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

export { seedPrograms };
