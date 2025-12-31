// ===========================================
// DAYCARE TYPES & UTILITIES
// ===========================================

// Re-export Prisma types
export type {
  DaycareAnak,
  DaycareOrangTua,
  DaycarePendaftaran,
  DaycarePembayaranPendaftaran,
  DaycareTagihanBulanan,
  DaycarePembayaranBulanan,
  DaycareKehadiranHarian,
  DaycareTagihanHarian,
  DaycarePembayaranHarian,
  DaycareDailyReport,
  DaycarePaketLayanan,
  DaycareStatusAnak,
  DaycareStatusPendaftaran,
  DaycareSchemaPembayaran,
  DaycareStatusTagihan,
  DaycareMetodePembayaran,
  DaycareRelasi,
} from '@prisma/client';

import type {
  DaycareAnak,
  DaycareOrangTua,
  DaycarePendaftaran,
  DaycarePembayaranPendaftaran,
  DaycareTagihanBulanan,
  DaycarePembayaranBulanan,
  DaycareKehadiranHarian,
  DaycareTagihanHarian,
  DaycarePembayaranHarian,
  DaycareDailyReport,
} from '@prisma/client';

// ===========================================
// CONSTANTS / OPTIONS
// ===========================================

export const PAKET_LAYANAN_OPTIONS = [
  { value: 'FULLDAY', label: 'FULLDAY', description: '07.00 - 17.00 WIB' },
  { value: 'AFTER_SCHOOL', label: 'AFTER SCHOOL', description: 'Setelah sekolah - 17.00 WIB' },
  { value: 'HARIAN', label: 'HARIAN', description: 'Pembayaran per hari' },
] as const;

export const STATUS_ANAK_OPTIONS = [
  { value: 'aktif', label: 'Aktif', color: 'green' },
  { value: 'cuti', label: 'Cuti', color: 'yellow' },
  { value: 'selesai', label: 'Selesai', color: 'blue' },
  { value: 'keluar', label: 'Keluar', color: 'red' },
] as const;

export const STATUS_PENDAFTARAN_OPTIONS = [
  { value: 'terdaftar', label: 'Terdaftar', color: 'yellow' },
  { value: 'aktif', label: 'Aktif', color: 'green' },
  { value: 'batal', label: 'Batal', color: 'red' },
] as const;

export const SCHEMA_PEMBAYARAN_OPTIONS = [
  { value: 'lunas', label: 'Lunas' },
  { value: 'angsuran', label: 'Angsuran' },
] as const;

export const STATUS_TAGIHAN_OPTIONS = [
  { value: 'belum_bayar', label: 'Belum Bayar', color: 'red' },
  { value: 'bayar_sebagian', label: 'Bayar Sebagian', color: 'yellow' },
  { value: 'lunas', label: 'Lunas', color: 'green' },
] as const;

export const METODE_PEMBAYARAN_OPTIONS = [
  { value: 'cash', label: 'Cash' },
  { value: 'transfer', label: 'Transfer' },
] as const;

export const RELASI_OPTIONS = [
  { value: 'ayah', label: 'Ayah' },
  { value: 'ibu', label: 'Ibu' },
  { value: 'wali', label: 'Wali' },
] as const;

export const JENIS_KELAMIN_OPTIONS = [
  { value: 'lelaki', label: 'Laki-laki' },
  { value: 'perempuan', label: 'Perempuan' },
] as const;

// Daily Report Scales
export const LIKERT_SCALE_OPTIONS = [
  { value: 1, label: '1' },
  { value: 2, label: '2' },
  { value: 3, label: '3' },
  { value: 4, label: '4' },
  { value: 5, label: '5' },
] as const;

export const PERILAKU_SCALE_LABELS = {
  1: 'Tidak Baik',
  2: 'Kurang Baik',
  3: 'Cukup Baik',
  4: 'Baik',
  5: 'Sangat Baik',
} as const;

export const AKTIVITAS_SCALE_LABELS = {
  1: 'Sangat Pasif',
  2: 'Pasif',
  3: 'Cukup Aktif',
  4: 'Aktif',
  5: 'Sangat Aktif',
} as const;

export const MAKAN_SCALE_LABELS = {
  1: 'Sangat Tidak Suka',
  2: 'Tidak Suka',
  3: 'Biasa',
  4: 'Suka',
  5: 'Sangat Suka',
} as const;

export const TIDUR_SCALE_LABELS = {
  1: 'Sangat Sulit',
  2: 'Sulit',
  3: 'Cukup',
  4: 'Mudah',
  5: 'Sangat Mudah',
} as const;

export const KEGIATAN_OPTIONS = [
  { value: 'mengaji', label: 'Mengaji' },
  { value: 'hafalan_surat', label: 'Hafalan Surat Pendek' },
  { value: 'berenang', label: 'Berenang' },
  { value: 'bermain_musik', label: 'Bermain Musik' },
  { value: 'bermain_bersama', label: 'Bermain Bersama' },
  { value: 'gymnastic', label: 'Gymnastic' },
  { value: 'menggambar', label: 'Menggambar' },
  { value: 'mewarnai', label: 'Mewarnai' },
  { value: 'bernyanyi', label: 'Bernyanyi' },
  { value: 'shalat', label: 'Shalat' },
] as const;

export const BULAN_OPTIONS = [
  { value: 1, label: 'Januari' },
  { value: 2, label: 'Februari' },
  { value: 3, label: 'Maret' },
  { value: 4, label: 'April' },
  { value: 5, label: 'Mei' },
  { value: 6, label: 'Juni' },
  { value: 7, label: 'Juli' },
  { value: 8, label: 'Agustus' },
  { value: 9, label: 'September' },
  { value: 10, label: 'Oktober' },
  { value: 11, label: 'November' },
  { value: 12, label: 'Desember' },
] as const;

// ===========================================
// EXTENDED TYPES WITH RELATIONS
// ===========================================

export type AnakWithRelations = DaycareAnak & {
  orangTua: DaycareOrangTua[];
  pendaftaran?: (DaycarePendaftaran & {
    pembayaran: DaycarePembayaranPendaftaran[];
  }) | null;
  tagihanBulanan: (DaycareTagihanBulanan & {
    pembayaran: DaycarePembayaranBulanan[];
  })[];
  kehadiranHarian: DaycareKehadiranHarian[];
  dailyReports: DaycareDailyReport[];
};

export type AnakListItem = DaycareAnak & {
  orangTua: Pick<DaycareOrangTua, 'id' | 'nama' | 'nomorHP' | 'relasi' | 'isPrimary'>[];
  _count: {
    dailyReports: number;
  };
};

export type PendaftaranWithRelations = DaycarePendaftaran & {
  anak: DaycareAnak;
  pembayaran: DaycarePembayaranPendaftaran[];
};

export type TagihanBulananWithRelations = DaycareTagihanBulanan & {
  anak: Pick<DaycareAnak, 'id' | 'nomorInduk' | 'namaLengkap' | 'paketLayanan'>;
  pembayaran: DaycarePembayaranBulanan[];
};

export type TagihanHarianWithRelations = DaycareTagihanHarian & {
  kehadiran: DaycareKehadiranHarian[];
  pembayaran: DaycarePembayaranHarian[];
};

export type DailyReportWithAnak = DaycareDailyReport & {
  anak: Pick<DaycareAnak, 'id' | 'nomorInduk' | 'namaLengkap' | 'foto'>;
};

// ===========================================
// FORM DATA TYPES
// ===========================================

export interface AnakFormData {
  namaLengkap: string;
  namaPanggilan?: string;
  jenisKelamin: 'lelaki' | 'perempuan';
  tanggalLahir: Date | string;
  tempatLahir?: string;
  foto?: string;
  paketLayanan: 'FULLDAY' | 'AFTER_SCHOOL' | 'HARIAN';
  tanggalMulai?: Date | string;
  alamat?: string;
  alergiMakanan?: string;
  catatanKesehatan?: string;
  kebiasaanTidur?: string;
  catatanKhusus?: string;
}

export interface OrangTuaFormData {
  id?: string;
  anakId: string;
  nama: string;
  relasi: 'ayah' | 'ibu' | 'wali';
  nomorHP?: string;
  nomorHPDarurat?: string;
  email?: string;
  pekerjaan?: string;
  alamat?: string;
  isPrimary?: boolean;
}

export interface PendaftaranFormData {
  anakId: string;
  paketDipilih: 'FULLDAY' | 'AFTER_SCHOOL' | 'HARIAN';
  tanggalMulai?: Date | string;
  biayaPendaftaran: number;
  schemaPembayaran: 'lunas' | 'angsuran';
  catatan?: string;
}

export interface PembayaranFormData {
  nominal: number;
  metodePembayaran: 'cash' | 'transfer';
  buktiTransfer?: string;
  catatan?: string;
}

export interface DailyReportFormData {
  anakId: string;
  tanggal: Date | string;
  guruPengisi?: string;
  // Perilaku
  moodSikap?: number;
  interaksiTeman?: number;
  catatanPerilaku?: string;
  // Aktivitas
  partisipasiBelajar?: number;
  responBermain?: number;
  catatanAktivitas?: string;
  // Makan
  makanSiang?: number;
  snack?: number;
  catatanMakan?: string;
  // Tidur
  tidurSiang?: number;
  durasiTidur?: string;
  catatanTidur?: string;
  // Kegiatan
  kegiatanHariIni?: string[];
  // Catatan
  catatanGuru?: string;
}

export interface KehadiranFormData {
  anakId: string;
  tanggal: Date | string;
  jamMasuk?: Date | string;
  jamPulang?: Date | string;
  isHadir?: boolean;
  catatan?: string;
}

// ===========================================
// API RESPONSE TYPES
// ===========================================

export interface DaycareStatsResponse {
  totalAnak: number;
  totalAnakAktif: number;
  anakFullday: number;
  anakAfterSchool: number;
  anakHarian: number;
  pendaftaranBaru: number;
  totalTunggakan: number;
  pemasukanBulanIni: number;
  dailyReportsHariIni: number;
}

export interface LaporanPemasukanResponse {
  periodStart: Date;
  periodEnd: Date;
  totalPemasukan: number;
  breakdown: {
    pendaftaran: number;
    bulanan: number;
    harian: number;
  };
  details: {
    tanggal: Date;
    jenis: string;
    anak: string;
    nominal: number;
  }[];
}

export interface LaporanTunggakanResponse {
  totalTunggakan: number;
  jumlahAnakMenunggak: number;
  tunggakanList: {
    anak: {
      id: string;
      nomorInduk: string;
      namaLengkap: string;
      paketLayanan: string;
    };
    orangTuaKontak?: {
      nama: string;
      nomorHP?: string;
    };
    tunggakan: {
      bulan: number;
      tahun: number;
      nominal: number;
    }[];
    totalTunggakan: number;
  }[];
}

// ===========================================
// UTILITY FUNCTIONS
// ===========================================

/**
 * Generate nomor induk anak daycare
 * Format: DC-YYMM-XXXX
 */
export function generateNomorIndukDaycare(
  tahun: number,
  bulan: number,
  sequenceNumber: number
): string {
  const yy = String(tahun).slice(-2);
  const mm = String(bulan).padStart(2, '0');
  const seq = String(sequenceNumber).padStart(4, '0');
  return `DC-${yy}${mm}-${seq}`;
}

/**
 * Hitung umur dari tanggal lahir
 */
export function hitungUmur(tanggalLahir: Date | string): {
  tahun: number;
  bulan: number;
  text: string;
} {
  const birthDate = new Date(tanggalLahir);
  const today = new Date();

  let years = today.getFullYear() - birthDate.getFullYear();
  let months = today.getMonth() - birthDate.getMonth();

  if (months < 0) {
    years--;
    months += 12;
  }

  if (today.getDate() < birthDate.getDate()) {
    months--;
    if (months < 0) {
      years--;
      months += 12;
    }
  }

  let text = '';
  if (years > 0) {
    text = `${years} tahun`;
    if (months > 0) {
      text += ` ${months} bulan`;
    }
  } else {
    text = `${months} bulan`;
  }

  return { tahun: years, bulan: months, text };
}

/**
 * Format currency ke Rupiah
 */
export function formatRupiah(amount: number | string | null | undefined): string {
  if (amount === null || amount === undefined) return 'Rp 0';
  const num = typeof amount === 'string' ? parseFloat(amount) : amount;
  if (isNaN(num)) return 'Rp 0';
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(num);
}

/**
 * Format tanggal ke format Indonesia
 */
export function formatTanggal(date: Date | string | null | undefined): string {
  if (!date) return '-';
  const d = new Date(date);
  return d.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

/**
 * Format tanggal ke format singkat
 */
export function formatTanggalSingkat(date: Date | string | null | undefined): string {
  if (!date) return '-';
  const d = new Date(date);
  return d.toLocaleDateString('id-ID', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}

/**
 * Get nama bulan dari angka
 */
export function getNamaBulan(bulan: number): string {
  const bulanNames = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ];
  return bulanNames[bulan - 1] || '';
}

/**
 * Get status badge color
 */
export function getStatusColor(status: string): string {
  const colorMap: Record<string, string> = {
    // Status Anak
    aktif: 'bg-green-100 text-green-800',
    cuti: 'bg-yellow-100 text-yellow-800',
    selesai: 'bg-blue-100 text-blue-800',
    keluar: 'bg-red-100 text-red-800',
    // Status Pendaftaran
    terdaftar: 'bg-yellow-100 text-yellow-800',
    batal: 'bg-red-100 text-red-800',
    // Status Tagihan
    belum_bayar: 'bg-red-100 text-red-800',
    bayar_sebagian: 'bg-yellow-100 text-yellow-800',
    lunas: 'bg-green-100 text-green-800',
  };
  return colorMap[status] || 'bg-gray-100 text-gray-800';
}

/**
 * Get paket layanan label
 */
export function getPaketLabel(paket: string): string {
  const paketMap: Record<string, string> = {
    FULLDAY: 'FULLDAY',
    AFTER_SCHOOL: 'AFTER SCHOOL',
    HARIAN: 'HARIAN',
  };
  return paketMap[paket] || paket;
}

/**
 * Get paket layanan color
 */
export function getPaketColor(paket: string): string {
  const colorMap: Record<string, string> = {
    FULLDAY: 'bg-cyan-100 text-cyan-800',
    AFTER_SCHOOL: 'bg-purple-100 text-purple-800',
    HARIAN: 'bg-orange-100 text-orange-800',
  };
  return colorMap[paket] || 'bg-gray-100 text-gray-800';
}

/**
 * Calculate total pembayaran dari array pembayaran
 */
export function calculateTotalPembayaran(pembayaran: { nominal: number | string | { toNumber: () => number } }[]): number {
  return pembayaran.reduce((sum, p) => {
    const nominal = typeof p.nominal === 'object' && 'toNumber' in p.nominal
      ? p.nominal.toNumber()
      : typeof p.nominal === 'string'
        ? parseFloat(p.nominal)
        : p.nominal;
    return sum + (isNaN(nominal) ? 0 : nominal);
  }, 0);
}

/**
 * Parse kegiatan JSON string to array
 */
export function parseKegiatanHariIni(kegiatan: string | null | undefined): string[] {
  if (!kegiatan) return [];
  try {
    return JSON.parse(kegiatan);
  } catch {
    return [];
  }
}

/**
 * Get Likert scale label
 */
export function getLikertLabel(
  type: 'perilaku' | 'aktivitas' | 'makan' | 'tidur',
  value: number | null | undefined
): string {
  if (!value) return '-';

  const labelMap = {
    perilaku: PERILAKU_SCALE_LABELS,
    aktivitas: AKTIVITAS_SCALE_LABELS,
    makan: MAKAN_SCALE_LABELS,
    tidur: TIDUR_SCALE_LABELS,
  };

  return labelMap[type][value as keyof typeof labelMap[typeof type]] || '-';
}

/**
 * Get Likert scale color
 */
export function getLikertColor(value: number | null | undefined): string {
  if (!value) return 'bg-gray-100 text-gray-600';

  const colorMap: Record<number, string> = {
    1: 'bg-red-100 text-red-800',
    2: 'bg-orange-100 text-orange-800',
    3: 'bg-yellow-100 text-yellow-800',
    4: 'bg-lime-100 text-lime-800',
    5: 'bg-green-100 text-green-800',
  };

  return colorMap[value] || 'bg-gray-100 text-gray-600';
}

/**
 * Get current tahun/bulan
 */
export function getCurrentPeriod(): { tahun: number; bulan: number } {
  const now = new Date();
  return {
    tahun: now.getFullYear(),
    bulan: now.getMonth() + 1,
  };
}

/**
 * Generate array of years for dropdown
 */
export function generateYearOptions(startYear: number = 2024, count: number = 5): { value: number; label: string }[] {
  return Array.from({ length: count }, (_, i) => ({
    value: startYear + i,
    label: String(startYear + i),
  }));
}
