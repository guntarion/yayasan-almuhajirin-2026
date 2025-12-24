/**
 * Chart of Accounts (Kode Akun) for Non-Profit Organization
 * Yayasan Al Muhajirin Rewwin (YAMR)
 *
 * Based on Indonesian PSAK 45 / ISAK 35 (Pelaporan Keuangan Organisasi Nirlaba)
 */

export type AccountCategory = 'aset' | 'kewajiban' | 'aset_bersih' | 'pendapatan' | 'beban';
export type NormalBalance = 'debit' | 'credit';
export type RestrictionType = 'temporary' | 'permanent' | null;

export interface KodeAkun {
  kode: string;
  nama: string;
  kategori: AccountCategory;
  subKategori?: string;
  normalBalance: NormalBalance;
  isContraAccount?: boolean;
  isRestricted?: boolean;
  restrictionType?: RestrictionType;
  deskripsi?: string;
  isActive: boolean;
}

export const KODE_AKUN_DATA: KodeAkun[] = [
  // ============================================================
  // 1. ASET (ASSETS)
  // ============================================================

  // 1100 - Aset Lancar (Current Assets)
  {
    kode: '1101',
    nama: 'Kas',
    kategori: 'aset',
    subKategori: 'aset_lancar',
    normalBalance: 'debit',
    deskripsi: 'Uang tunai di kantor',
    isActive: true,
  },
  {
    kode: '1102',
    nama: 'Bank - Rekening Umum',
    kategori: 'aset',
    subKategori: 'aset_lancar',
    normalBalance: 'debit',
    deskripsi: 'Rekening bank untuk operasional umum',
    isActive: true,
  },
  {
    kode: '1103',
    nama: 'Bank - Rekening Zakat',
    kategori: 'aset',
    subKategori: 'aset_lancar',
    normalBalance: 'debit',
    isRestricted: true,
    restrictionType: 'temporary',
    deskripsi: 'Rekening khusus dana zakat (harus disalurkan)',
    isActive: true,
  },
  {
    kode: '1104',
    nama: 'Bank - Rekening Wakaf',
    kategori: 'aset',
    subKategori: 'aset_lancar',
    normalBalance: 'debit',
    isRestricted: true,
    restrictionType: 'permanent',
    deskripsi: 'Rekening khusus dana wakaf (dana abadi)',
    isActive: true,
  },
  {
    kode: '1105',
    nama: 'Bank - Deposito',
    kategori: 'aset',
    subKategori: 'aset_lancar',
    normalBalance: 'debit',
    deskripsi: 'Deposito jangka pendek (< 1 tahun)',
    isActive: true,
  },
  {
    kode: '1110',
    nama: 'Piutang KBTK',
    kategori: 'aset',
    subKategori: 'aset_lancar',
    normalBalance: 'debit',
    deskripsi: 'Tagihan SPP atau uang pangkal KBTK',
    isActive: true,
  },
  {
    kode: '1111',
    nama: 'Piutang Kolam Renang',
    kategori: 'aset',
    subKategori: 'aset_lancar',
    normalBalance: 'debit',
    deskripsi: 'Tagihan sewa/membership kolam renang',
    isActive: true,
  },
  {
    kode: '1112',
    nama: 'Piutang Karyawan',
    kategori: 'aset',
    subKategori: 'aset_lancar',
    normalBalance: 'debit',
    deskripsi: 'Pinjaman/kasbon karyawan',
    isActive: true,
  },
  {
    kode: '1120',
    nama: 'Biaya Dibayar Dimuka',
    kategori: 'aset',
    subKategori: 'aset_lancar',
    normalBalance: 'debit',
    deskripsi: 'Asuransi, sewa dibayar di muka',
    isActive: true,
  },
  {
    kode: '1130',
    nama: 'Persediaan Kedai',
    kategori: 'aset',
    subKategori: 'aset_lancar',
    normalBalance: 'debit',
    deskripsi: 'Stok barang di kedai yayasan',
    isActive: true,
  },

  // 1200 - Aset Tetap (Fixed Assets)
  {
    kode: '1201',
    nama: 'Tanah',
    kategori: 'aset',
    subKategori: 'aset_tetap',
    normalBalance: 'debit',
    deskripsi: 'Tanah milik yayasan (tidak disusutkan)',
    isActive: true,
  },
  {
    kode: '1202',
    nama: 'Gedung Masjid',
    kategori: 'aset',
    subKategori: 'aset_tetap',
    normalBalance: 'debit',
    deskripsi: 'Bangunan masjid',
    isActive: true,
  },
  {
    kode: '1203',
    nama: 'Gedung KBTK',
    kategori: 'aset',
    subKategori: 'aset_tetap',
    normalBalance: 'debit',
    deskripsi: 'Bangunan sekolah KBTK',
    isActive: true,
  },
  {
    kode: '1204',
    nama: 'Gedung Daycare',
    kategori: 'aset',
    subKategori: 'aset_tetap',
    normalBalance: 'debit',
    deskripsi: 'Bangunan daycare',
    isActive: true,
  },
  {
    kode: '1205',
    nama: 'Gedung Poliklinik',
    kategori: 'aset',
    subKategori: 'aset_tetap',
    normalBalance: 'debit',
    deskripsi: 'Bangunan poliklinik',
    isActive: true,
  },
  {
    kode: '1210',
    nama: 'Kendaraan - Ambulans',
    kategori: 'aset',
    subKategori: 'aset_tetap',
    normalBalance: 'debit',
    deskripsi: 'Mobil ambulans',
    isActive: true,
  },
  {
    kode: '1211',
    nama: 'Kendaraan Operasional',
    kategori: 'aset',
    subKategori: 'aset_tetap',
    normalBalance: 'debit',
    deskripsi: 'Mobil/motor untuk operasional yayasan',
    isActive: true,
  },
  {
    kode: '1220',
    nama: 'Peralatan Kantor',
    kategori: 'aset',
    subKategori: 'aset_tetap',
    normalBalance: 'debit',
    deskripsi: 'Komputer, printer, meja, kursi, dll',
    isActive: true,
  },
  {
    kode: '1221',
    nama: 'Peralatan TPQ',
    kategori: 'aset',
    subKategori: 'aset_tetap',
    normalBalance: 'debit',
    deskripsi: 'Alat pembelajaran TPQ',
    isActive: true,
  },
  {
    kode: '1222',
    nama: 'Peralatan KBTK',
    kategori: 'aset',
    subKategori: 'aset_tetap',
    normalBalance: 'debit',
    deskripsi: 'Mainan edukatif, alat pembelajaran KBTK',
    isActive: true,
  },

  // Akumulasi Penyusutan (Contra Assets)
  {
    kode: '1230',
    nama: 'Akumulasi Penyusutan Gedung',
    kategori: 'aset',
    subKategori: 'aset_tetap',
    normalBalance: 'credit',
    isContraAccount: true,
    deskripsi: 'Akumulasi penyusutan gedung (contra account)',
    isActive: true,
  },
  {
    kode: '1231',
    nama: 'Akumulasi Penyusutan Kendaraan',
    kategori: 'aset',
    subKategori: 'aset_tetap',
    normalBalance: 'credit',
    isContraAccount: true,
    deskripsi: 'Akumulasi penyusutan kendaraan (contra account)',
    isActive: true,
  },
  {
    kode: '1232',
    nama: 'Akumulasi Penyusutan Peralatan',
    kategori: 'aset',
    subKategori: 'aset_tetap',
    normalBalance: 'credit',
    isContraAccount: true,
    deskripsi: 'Akumulasi penyusutan peralatan (contra account)',
    isActive: true,
  },

  // ============================================================
  // 2. KEWAJIBAN / LIABILITAS (LIABILITIES)
  // ============================================================

  // 2100 - Kewajiban Jangka Pendek
  {
    kode: '2101',
    nama: 'Utang Operasional',
    kategori: 'kewajiban',
    subKategori: 'jangka_pendek',
    normalBalance: 'credit',
    deskripsi: 'Utang listrik, air, telpon, dll',
    isActive: true,
  },
  {
    kode: '2102',
    nama: 'Utang Gaji',
    kategori: 'kewajiban',
    subKategori: 'jangka_pendek',
    normalBalance: 'credit',
    deskripsi: 'Gaji karyawan yang belum dibayar',
    isActive: true,
  },
  {
    kode: '2103',
    nama: 'Pendapatan Diterima Dimuka',
    kategori: 'kewajiban',
    subKategori: 'jangka_pendek',
    normalBalance: 'credit',
    deskripsi: 'SPP KBTK yang dibayar di muka',
    isActive: true,
  },
  {
    kode: '2104',
    nama: 'Dana Zakat Belum Disalurkan',
    kategori: 'kewajiban',
    subKategori: 'jangka_pendek',
    normalBalance: 'credit',
    isRestricted: true,
    restrictionType: 'temporary',
    deskripsi: 'Zakat yang sudah diterima tapi belum disalurkan (kewajiban)',
    isActive: true,
  },

  // 2200 - Kewajiban Jangka Panjang
  {
    kode: '2201',
    nama: 'Utang Bank Jangka Panjang',
    kategori: 'kewajiban',
    subKategori: 'jangka_panjang',
    normalBalance: 'credit',
    deskripsi: 'Pinjaman bank dengan jangka waktu > 1 tahun',
    isActive: true,
  },

  // ============================================================
  // 3. ASET BERSIH (NET ASSETS) - Pengganti Ekuitas di NPO
  // ============================================================

  {
    kode: '3101',
    nama: 'Aset Bersih Tanpa Pembatasan',
    kategori: 'aset_bersih',
    subKategori: 'unrestricted',
    normalBalance: 'credit',
    deskripsi: 'Dana yang dapat digunakan bebas untuk tujuan yayasan',
    isActive: true,
  },
  {
    kode: '3201',
    nama: 'Aset Bersih Dengan Pembatasan Temporer - Zakat',
    kategori: 'aset_bersih',
    subKategori: 'temporarily_restricted',
    normalBalance: 'credit',
    isRestricted: true,
    restrictionType: 'temporary',
    deskripsi: 'Dana zakat yang harus disalurkan untuk 8 asnaf',
    isActive: true,
  },
  {
    kode: '3202',
    nama: 'Aset Bersih Dengan Pembatasan Temporer - Program Khusus',
    kategori: 'aset_bersih',
    subKategori: 'temporarily_restricted',
    normalBalance: 'credit',
    isRestricted: true,
    restrictionType: 'temporary',
    deskripsi: 'Dana untuk program tertentu (Ramadan, pembangunan, dll)',
    isActive: true,
  },
  {
    kode: '3301',
    nama: 'Aset Bersih Dengan Pembatasan Permanen - Wakaf',
    kategori: 'aset_bersih',
    subKategori: 'permanently_restricted',
    normalBalance: 'credit',
    isRestricted: true,
    restrictionType: 'permanent',
    deskripsi: 'Dana wakaf (tidak boleh digunakan, hanya hasilnya)',
    isActive: true,
  },

  // ============================================================
  // 4. PENDAPATAN (REVENUE) - Kode 4xxx
  // ============================================================

  // 4100 - Pendapatan Tanpa Pembatasan (Unrestricted Revenue)
  {
    kode: '4101',
    nama: 'Pendapatan Donasi Umum',
    kategori: 'pendapatan',
    subKategori: 'unrestricted',
    normalBalance: 'credit',
    deskripsi: 'Donasi tanpa spesifikasi penggunaan',
    isActive: true,
  },
  {
    kode: '4102',
    nama: 'Pendapatan Infaq Jumat',
    kategori: 'pendapatan',
    subKategori: 'unrestricted',
    normalBalance: 'credit',
    deskripsi: 'Infaq dari sholat Jumat',
    isActive: true,
  },
  {
    kode: '4110',
    nama: 'Pendapatan KBTK',
    kategori: 'pendapatan',
    subKategori: 'unrestricted',
    normalBalance: 'credit',
    deskripsi: 'SPP dan uang pangkal KBTK',
    isActive: true,
  },
  {
    kode: '4111',
    nama: 'Pendapatan Daycare',
    kategori: 'pendapatan',
    subKategori: 'unrestricted',
    normalBalance: 'credit',
    deskripsi: 'SPP daycare',
    isActive: true,
  },
  {
    kode: '4112',
    nama: 'Pendapatan Kolam Renang',
    kategori: 'pendapatan',
    subKategori: 'unrestricted',
    normalBalance: 'credit',
    deskripsi: 'Sewa kolam renang',
    isActive: true,
  },
  {
    kode: '4113',
    nama: 'Pendapatan Kedai',
    kategori: 'pendapatan',
    subKategori: 'unrestricted',
    normalBalance: 'credit',
    deskripsi: 'Penjualan di kedai yayasan',
    isActive: true,
  },
  {
    kode: '4120',
    nama: 'Pendapatan Layanan Ambulans',
    kategori: 'pendapatan',
    subKategori: 'unrestricted',
    normalBalance: 'credit',
    deskripsi: 'Sewa atau sumbangan layanan ambulans',
    isActive: true,
  },
  {
    kode: '4121',
    nama: 'Pendapatan Layanan Jenazah',
    kategori: 'pendapatan',
    subKategori: 'unrestricted',
    normalBalance: 'credit',
    deskripsi: 'Sewa atau sumbangan layanan jenazah',
    isActive: true,
  },
  {
    kode: '4122',
    nama: 'Pendapatan Poliklinik',
    kategori: 'pendapatan',
    subKategori: 'unrestricted',
    normalBalance: 'credit',
    deskripsi: 'Infaq pelayanan poliklinik',
    isActive: true,
  },
  {
    kode: '4130',
    nama: 'Pendapatan Usaha Qurban',
    kategori: 'pendapatan',
    subKategori: 'unrestricted',
    normalBalance: 'credit',
    deskripsi: 'Pendapatan dari usaha qurban',
    isActive: true,
  },
  {
    kode: '4190',
    nama: 'Pendapatan Lain-lain',
    kategori: 'pendapatan',
    subKategori: 'unrestricted',
    normalBalance: 'credit',
    deskripsi: 'Pendapatan lain yang tidak terkategori',
    isActive: true,
  },

  // 4200 - Pendapatan Dengan Pembatasan (Restricted Revenue)
  {
    kode: '4201',
    nama: 'Pendapatan Zakat',
    kategori: 'pendapatan',
    subKategori: 'restricted',
    normalBalance: 'credit',
    isRestricted: true,
    restrictionType: 'temporary',
    deskripsi: 'Zakat mal, fitrah, profesi (harus disalurkan ke 8 asnaf)',
    isActive: true,
  },
  {
    kode: '4202',
    nama: 'Pendapatan Wakaf',
    kategori: 'pendapatan',
    subKategori: 'restricted',
    normalBalance: 'credit',
    isRestricted: true,
    restrictionType: 'permanent',
    deskripsi: 'Wakaf uang atau aset (dana abadi)',
    isActive: true,
  },
  {
    kode: '4203',
    nama: 'Pendapatan Donasi Program Ramadan',
    kategori: 'pendapatan',
    subKategori: 'restricted',
    normalBalance: 'credit',
    isRestricted: true,
    restrictionType: 'temporary',
    deskripsi: 'Donasi khusus untuk program Ramadan',
    isActive: true,
  },
  {
    kode: '4204',
    nama: 'Pendapatan Donasi Pembangunan',
    kategori: 'pendapatan',
    subKategori: 'restricted',
    normalBalance: 'credit',
    isRestricted: true,
    restrictionType: 'temporary',
    deskripsi: 'Donasi khusus untuk pembangunan',
    isActive: true,
  },
  {
    kode: '4205',
    nama: 'Pendapatan Infaq Terikat',
    kategori: 'pendapatan',
    subKategori: 'restricted',
    normalBalance: 'credit',
    isRestricted: true,
    restrictionType: 'temporary',
    deskripsi: 'Infaq dengan peruntukan khusus',
    isActive: true,
  },

  // ============================================================
  // 5. BEBAN (EXPENSES) - Kode 5xxx
  // ============================================================

  // 5100 - Beban Program (Program Expenses)

  // 5110 - Beban Program Keagamaan
  {
    kode: '5111',
    nama: 'Beban TPQ',
    kategori: 'beban',
    subKategori: 'program_keagamaan',
    normalBalance: 'debit',
    deskripsi: 'Gaji ustadz, alat tulis, snack anak TPQ',
    isActive: true,
  },
  {
    kode: '5112',
    nama: 'Beban Ketakmiran',
    kategori: 'beban',
    subKategori: 'program_keagamaan',
    normalBalance: 'debit',
    deskripsi: 'Honor imam, muadzin, biaya kajian',
    isActive: true,
  },
  {
    kode: '5113',
    nama: 'Beban Remaja Masjid & Kids',
    kategori: 'beban',
    subKategori: 'program_keagamaan',
    normalBalance: 'debit',
    deskripsi: 'Kegiatan remaja dan anak-anak',
    isActive: true,
  },
  {
    kode: '5114',
    nama: 'Beban Kemuslimahan',
    kategori: 'beban',
    subKategori: 'program_keagamaan',
    normalBalance: 'debit',
    deskripsi: 'Kegiatan pengajian ibu-ibu',
    isActive: true,
  },

  // 5120 - Beban Program Sosial
  {
    kode: '5121',
    nama: 'Beban KBTK',
    kategori: 'beban',
    subKategori: 'program_sosial',
    normalBalance: 'debit',
    deskripsi: 'Gaji guru, ATK, alat main anak KBTK',
    isActive: true,
  },
  {
    kode: '5122',
    nama: 'Beban Daycare',
    kategori: 'beban',
    subKategori: 'program_sosial',
    normalBalance: 'debit',
    deskripsi: 'Gaji pengasuh, makanan anak daycare',
    isActive: true,
  },
  {
    kode: '5123',
    nama: 'Beban Poliklinik',
    kategori: 'beban',
    subKategori: 'program_sosial',
    normalBalance: 'debit',
    deskripsi: 'Obat-obatan, honor dokter',
    isActive: true,
  },
  {
    kode: '5124',
    nama: 'Beban Kolam Renang',
    kategori: 'beban',
    subKategori: 'program_sosial',
    normalBalance: 'debit',
    deskripsi: 'Kaporit, listrik pompa, perawatan kolam',
    isActive: true,
  },

  // 5130 - Beban Program Kemanusiaan
  {
    kode: '5131',
    nama: 'Beban LAZ (Lembaga Amil Zakat)',
    kategori: 'beban',
    subKategori: 'program_kemanusiaan',
    normalBalance: 'debit',
    isRestricted: true,
    restrictionType: 'temporary',
    deskripsi: 'Penyaluran zakat, honor amil (max 12.5%)',
    isActive: true,
  },
  {
    kode: '5132',
    nama: 'Beban Layanan Ambulans',
    kategori: 'beban',
    subKategori: 'program_kemanusiaan',
    normalBalance: 'debit',
    deskripsi: 'BBM, perawatan ambulans',
    isActive: true,
  },
  {
    kode: '5133',
    nama: 'Beban Layanan Jenazah',
    kategori: 'beban',
    subKategori: 'program_kemanusiaan',
    normalBalance: 'debit',
    deskripsi: 'Kain kafan, peralatan jenazah',
    isActive: true,
  },

  // 5200 - Beban Operasional (Operating Expenses)
  {
    kode: '5201',
    nama: 'Beban Gaji Pengurus/Staff',
    kategori: 'beban',
    subKategori: 'operasional',
    normalBalance: 'debit',
    deskripsi: 'Gaji karyawan tetap yayasan',
    isActive: true,
  },
  {
    kode: '5202',
    nama: 'Beban Tunjangan',
    kategori: 'beban',
    subKategori: 'operasional',
    normalBalance: 'debit',
    deskripsi: 'Tunjangan transport, makan, dll',
    isActive: true,
  },
  {
    kode: '5203',
    nama: 'Beban THR',
    kategori: 'beban',
    subKategori: 'operasional',
    normalBalance: 'debit',
    deskripsi: 'Tunjangan Hari Raya',
    isActive: true,
  },
  {
    kode: '5210',
    nama: 'Beban Listrik',
    kategori: 'beban',
    subKategori: 'operasional',
    normalBalance: 'debit',
    deskripsi: 'Tagihan listrik',
    isActive: true,
  },
  {
    kode: '5211',
    nama: 'Beban Air',
    kategori: 'beban',
    subKategori: 'operasional',
    normalBalance: 'debit',
    deskripsi: 'Tagihan air PDAM',
    isActive: true,
  },
  {
    kode: '5212',
    nama: 'Beban Telepon & Internet',
    kategori: 'beban',
    subKategori: 'operasional',
    normalBalance: 'debit',
    deskripsi: 'Tagihan telepon dan internet',
    isActive: true,
  },
  {
    kode: '5220',
    nama: 'Beban Pemeliharaan Gedung',
    kategori: 'beban',
    subKategori: 'operasional',
    normalBalance: 'debit',
    deskripsi: 'Perbaikan dan perawatan gedung',
    isActive: true,
  },
  {
    kode: '5221',
    nama: 'Beban Pemeliharaan Kendaraan',
    kategori: 'beban',
    subKategori: 'operasional',
    normalBalance: 'debit',
    deskripsi: 'Service kendaraan, ganti oli, dll',
    isActive: true,
  },
  {
    kode: '5230',
    nama: 'Beban Penyusutan Gedung',
    kategori: 'beban',
    subKategori: 'operasional',
    normalBalance: 'debit',
    deskripsi: 'Penyusutan gedung per tahun',
    isActive: true,
  },
  {
    kode: '5231',
    nama: 'Beban Penyusutan Kendaraan',
    kategori: 'beban',
    subKategori: 'operasional',
    normalBalance: 'debit',
    deskripsi: 'Penyusutan kendaraan per tahun',
    isActive: true,
  },
  {
    kode: '5232',
    nama: 'Beban Penyusutan Peralatan',
    kategori: 'beban',
    subKategori: 'operasional',
    normalBalance: 'debit',
    deskripsi: 'Penyusutan peralatan per tahun',
    isActive: true,
  },
  {
    kode: '5240',
    nama: 'Beban ATK (Alat Tulis Kantor)',
    kategori: 'beban',
    subKategori: 'operasional',
    normalBalance: 'debit',
    deskripsi: 'Kertas, tinta printer, alat tulis',
    isActive: true,
  },
  {
    kode: '5241',
    nama: 'Beban Kebersihan',
    kategori: 'beban',
    subKategori: 'operasional',
    normalBalance: 'debit',
    deskripsi: 'Gaji cleaning service, alat kebersihan',
    isActive: true,
  },
  {
    kode: '5242',
    nama: 'Beban Keamanan',
    kategori: 'beban',
    subKategori: 'operasional',
    normalBalance: 'debit',
    deskripsi: 'Gaji satpam',
    isActive: true,
  },
  {
    kode: '5250',
    nama: 'Beban Administrasi Bank',
    kategori: 'beban',
    subKategori: 'operasional',
    normalBalance: 'debit',
    deskripsi: 'Biaya admin bank, transfer, dll',
    isActive: true,
  },
  {
    kode: '5251',
    nama: 'Beban Pajak',
    kategori: 'beban',
    subKategori: 'operasional',
    normalBalance: 'debit',
    deskripsi: 'PBB, pajak lainnya',
    isActive: true,
  },
  {
    kode: '5260',
    nama: 'Beban Konsumsi & Rapat',
    kategori: 'beban',
    subKategori: 'operasional',
    normalBalance: 'debit',
    deskripsi: 'Konsumsi rapat, makan minum harian',
    isActive: true,
  },
  {
    kode: '5270',
    nama: 'Beban Publikasi & Kehumasan',
    kategori: 'beban',
    subKategori: 'operasional',
    normalBalance: 'debit',
    deskripsi: 'Cetak brosur, media sosial, website',
    isActive: true,
  },
  {
    kode: '5280',
    nama: 'Beban Usaha Qurban',
    kategori: 'beban',
    subKategori: 'operasional',
    normalBalance: 'debit',
    deskripsi: 'Pembelian hewan qurban',
    isActive: true,
  },
  {
    kode: '5290',
    nama: 'Beban Lain-lain',
    kategori: 'beban',
    subKategori: 'operasional',
    normalBalance: 'debit',
    deskripsi: 'Beban lain yang tidak terkategori',
    isActive: true,
  },
];

// Helper functions
export function getAkunByKode(kode: string): KodeAkun | undefined {
  return KODE_AKUN_DATA.find((akun) => akun.kode === kode);
}

export function getAkunByKategori(kategori: AccountCategory): KodeAkun[] {
  return KODE_AKUN_DATA.filter((akun) => akun.kategori === kategori && akun.isActive);
}

export function getAkunPendapatan(): KodeAkun[] {
  return getAkunByKategori('pendapatan');
}

export function getAkunBeban(): KodeAkun[] {
  return getAkunByKategori('beban');
}

export function getAkunAset(): KodeAkun[] {
  return getAkunByKategori('aset');
}

export function getRestrictedAccounts(): KodeAkun[] {
  return KODE_AKUN_DATA.filter((akun) => akun.isRestricted && akun.isActive);
}

export function getUnrestrictedAccounts(): KodeAkun[] {
  return KODE_AKUN_DATA.filter((akun) => !akun.isRestricted && akun.isActive);
}

// For dropdowns
export function getAkunOptions(kategori?: AccountCategory) {
  const akuns = kategori ? getAkunByKategori(kategori) : KODE_AKUN_DATA.filter((a) => a.isActive);
  return akuns.map((a) => ({
    value: a.kode,
    label: `${a.kode} - ${a.nama}`,
    kategori: a.kategori,
  }));
}

// Group accounts by category for display
export function getAkunGroupedByKategori() {
  const groups: Record<AccountCategory, KodeAkun[]> = {
    aset: [],
    kewajiban: [],
    aset_bersih: [],
    pendapatan: [],
    beban: [],
  };

  KODE_AKUN_DATA.filter((a) => a.isActive).forEach((akun) => {
    groups[akun.kategori].push(akun);
  });

  return groups;
}

// Get kas/bank accounts for payment methods
export function getKasAccounts(): KodeAkun[] {
  return KODE_AKUN_DATA.filter(
    (a) =>
      a.isActive &&
      a.kategori === 'aset' &&
      a.subKategori === 'aset_lancar' &&
      (a.kode.startsWith('1101') || a.kode.startsWith('1102') || a.kode.startsWith('1103') || a.kode.startsWith('1104'))
  );
}

// Seed data for database
export function getKodeAkunSeedData() {
  return KODE_AKUN_DATA.map((akun) => ({
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
  }));
}
