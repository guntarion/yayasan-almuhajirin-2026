import { PrismaClient } from '@prisma/client';
import { BIDANG_DATA } from '../src/data/keuangan/units';
import { KODE_AKUN_DATA } from '../src/data/keuangan/kode-akun';

const prisma = new PrismaClient();

// Unit data
const units = [
  { id: 'masjid', name: 'Ketakmiran Masjid', slug: 'masjid', subdomain: 'masjid', description: 'Unit pengelolaan kegiatan keagamaan masjid', color: '#059669' },
  { id: 'remas', name: 'Remaskidz', slug: 'remas', subdomain: 'remas', description: 'Remaja Masjid Al Muhajirin untuk anak-anak', color: '#7c3aed' },
  { id: 'tpq', name: 'TPQ Al Muhajirin', slug: 'tpq', subdomain: 'tpq', description: 'Taman Pendidikan Quran', color: '#0891b2' },
  { id: 'kemuslimatan', name: 'Kemuslimatan', slug: 'kemuslimatan', subdomain: 'kemuslimatan', description: 'Unit pemberdayaan muslimah', color: '#db2777' },
  { id: 'kbtk', name: 'KBTK Al Muhajirin', slug: 'kbtk', subdomain: 'kbtk', description: 'Kelompok Bermain dan Taman Kanak-kanak', color: '#ea580c' },
  { id: 'daycare', name: 'Daycare Al Muhajirin', slug: 'daycare', subdomain: 'daycare', description: 'Penitipan anak harian', color: '#f59e0b' },
  { id: 'pool', name: 'Kolam Renang', slug: 'pool', subdomain: 'pool', description: 'Kolam renang Al Muhajirin', color: '#0ea5e9' },
  { id: 'poliklinik', name: 'Poliklinik', slug: 'poliklinik', subdomain: 'poliklinik', description: 'Layanan kesehatan masyarakat', color: '#dc2626' },
  { id: 'lazmu', name: 'LAZ Muhajirin', slug: 'lazmu', subdomain: 'lazmu', description: 'Lembaga Amil Zakat Muhajirin', color: '#16a34a' },
  { id: 'wafmu', name: 'Wakaf Muhajirin', slug: 'wafmu', subdomain: 'wafmu', description: 'Pengelolaan wakaf', color: '#65a30d' },
  { id: 'ambulans', name: 'Ambulans', slug: 'ambulans', subdomain: 'ambulans', description: 'Layanan ambulans dan tanggap darurat', color: '#ef4444' },
  { id: 'usaha', name: 'Usaha & Pengadaan', slug: 'usaha', subdomain: 'usaha', description: 'Unit usaha dan pengadaan yayasan', color: '#8b5cf6' },
];

// Global categories
const globalCategories = [
  { name: 'Berita', slug: 'berita', icon: 'newspaper', color: '#3b82f6', isGlobal: true, order: 1 },
  { name: 'Kegiatan', slug: 'kegiatan', icon: 'calendar', color: '#10b981', isGlobal: true, order: 2 },
  { name: 'Pengumuman', slug: 'pengumuman', icon: 'megaphone', color: '#f59e0b', isGlobal: true, order: 3 },
  { name: 'Artikel', slug: 'artikel', icon: 'book', color: '#8b5cf6', isGlobal: true, order: 4 },
  { name: 'Galeri', slug: 'galeri', icon: 'images', color: '#ec4899', isGlobal: true, order: 5 },
  { name: 'Laporan', slug: 'laporan', icon: 'file-text', color: '#6b7280', isGlobal: true, order: 6 },
];

// Unit-specific categories
const unitCategories = [
  // Masjid
  { name: 'Jadwal Sholat', slug: 'jadwal-sholat', unitId: 'masjid', icon: 'clock', color: '#059669' },
  { name: 'Kajian', slug: 'kajian', unitId: 'masjid', icon: 'book-open', color: '#059669' },
  { name: 'Khutbah', slug: 'khutbah', unitId: 'masjid', icon: 'mic', color: '#059669' },
  // KBTK
  { name: 'Kurikulum', slug: 'kurikulum', unitId: 'kbtk', icon: 'graduation-cap', color: '#ea580c' },
  { name: 'Prestasi', slug: 'prestasi', unitId: 'kbtk', icon: 'trophy', color: '#ea580c' },
  { name: 'Pendaftaran', slug: 'pendaftaran', unitId: 'kbtk', icon: 'user-plus', color: '#ea580c' },
  // TPQ
  { name: 'Jadwal Mengaji', slug: 'jadwal-mengaji', unitId: 'tpq', icon: 'clock', color: '#0891b2' },
  { name: 'Wisuda', slug: 'wisuda', unitId: 'tpq', icon: 'award', color: '#0891b2' },
  { name: 'Tahfidz', slug: 'tahfidz', unitId: 'tpq', icon: 'book', color: '#0891b2' },
  // LAZMU
  { name: 'Zakat', slug: 'zakat', unitId: 'lazmu', icon: 'heart', color: '#16a34a' },
  { name: 'Infaq', slug: 'infaq', unitId: 'lazmu', icon: 'gift', color: '#16a34a' },
  { name: 'Penyaluran', slug: 'penyaluran', unitId: 'lazmu', icon: 'share', color: '#16a34a' },
  // Pool
  { name: 'Jadwal Berenang', slug: 'jadwal-berenang', unitId: 'pool', icon: 'clock', color: '#0ea5e9' },
  { name: 'Promo', slug: 'promo', unitId: 'pool', icon: 'tag', color: '#0ea5e9' },
  { name: 'Event', slug: 'event', unitId: 'pool', icon: 'calendar', color: '#0ea5e9' },
  // Poliklinik
  { name: 'Jadwal Dokter', slug: 'jadwal-dokter', unitId: 'poliklinik', icon: 'stethoscope', color: '#dc2626' },
  { name: 'Layanan Kesehatan', slug: 'layanan-kesehatan', unitId: 'poliklinik', icon: 'heart-pulse', color: '#dc2626' },
  // Ambulans
  { name: 'Layanan', slug: 'layanan', unitId: 'ambulans', icon: 'ambulance', color: '#ef4444' },
  { name: 'Kontak Darurat', slug: 'kontak-darurat', unitId: 'ambulans', icon: 'phone', color: '#ef4444' },
];

// Seed Keuangan data
async function seedKeuangan() {
  console.log('💰 Seeding keuangan data...');

  // 1. Seed Fiscal Period (2026)
  console.log('📅 Seeding fiscal period...');
  await prisma.fiscalPeriod.upsert({
    where: { year: 2026 },
    update: {
      name: 'Tahun Anggaran 2026',
      startDate: new Date('2026-01-01'),
      endDate: new Date('2026-12-31'),
      isActive: true,
      isClosed: false,
    },
    create: {
      year: 2026,
      name: 'Tahun Anggaran 2026',
      startDate: new Date('2026-01-01'),
      endDate: new Date('2026-12-31'),
      isActive: true,
      isClosed: false,
    },
  });
  console.log('✅ Seeded fiscal period 2026');

  // 2. Seed Bidang
  console.log('🏢 Seeding bidang...');
  for (const bidang of BIDANG_DATA) {
    await prisma.bidang.upsert({
      where: { kode: bidang.kode },
      update: {
        nama: bidang.nama,
      },
      create: {
        kode: bidang.kode,
        nama: bidang.nama,
      },
    });

    // 3. Seed UnitKerja for each bidang
    for (const unit of bidang.units) {
      await prisma.unitKerja.upsert({
        where: { kode: unit.kode },
        update: {
          nama: unit.nama,
          bidangKode: bidang.kode,
        },
        create: {
          kode: unit.kode,
          nama: unit.nama,
          bidangKode: bidang.kode,
        },
      });
    }
  }
  console.log(`✅ Seeded ${BIDANG_DATA.length} bidang with units`);

  // 4. Seed Kode Akun
  console.log('📒 Seeding kode akun...');
  for (const akun of KODE_AKUN_DATA) {
    await prisma.kodeAkun.upsert({
      where: { kode: akun.kode },
      update: {
        nama: akun.nama,
        kategori: akun.kategori,
        subKategori: akun.subKategori || null,
        normalBalance: akun.normalBalance,
        isContraAccount: akun.isContraAccount || false,
        isRestricted: akun.isRestricted || false,
        restrictionType: akun.restrictionType || null,
        deskripsi: akun.deskripsi || null,
        isActive: akun.isActive,
      },
      create: {
        kode: akun.kode,
        nama: akun.nama,
        kategori: akun.kategori,
        subKategori: akun.subKategori || null,
        normalBalance: akun.normalBalance,
        isContraAccount: akun.isContraAccount || false,
        isRestricted: akun.isRestricted || false,
        restrictionType: akun.restrictionType || null,
        deskripsi: akun.deskripsi || null,
        isActive: akun.isActive,
      },
    });
  }
  console.log(`✅ Seeded ${KODE_AKUN_DATA.length} kode akun`);

  console.log('💰 Keuangan seeding completed!');
}

async function main() {
  console.log('🌱 Starting seed...');

  // Seed Units
  console.log('📦 Seeding units...');
  for (const unit of units) {
    await prisma.unit.upsert({
      where: { id: unit.id },
      update: unit,
      create: unit,
    });
  }
  console.log(`✅ Seeded ${units.length} units`);

  // Seed Global Categories
  console.log('📂 Seeding global categories...');
  for (const category of globalCategories) {
    const existing = await prisma.category.findFirst({
      where: { slug: category.slug, isGlobal: true, unitId: null },
    });
    if (existing) {
      await prisma.category.update({
        where: { id: existing.id },
        data: category,
      });
    } else {
      await prisma.category.create({
        data: category,
      });
    }
  }
  console.log(`✅ Seeded ${globalCategories.length} global categories`);

  // Seed Unit Categories
  console.log('📂 Seeding unit categories...');
  for (const category of unitCategories) {
    await prisma.category.upsert({
      where: { slug_unitId: { slug: category.slug, unitId: category.unitId } },
      update: category,
      create: category,
    });
  }
  console.log(`✅ Seeded ${unitCategories.length} unit categories`);

  // Seed Keuangan
  await seedKeuangan();

  console.log('🎉 Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
