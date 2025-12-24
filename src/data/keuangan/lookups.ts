/**
 * Lookup Data for Keuangan Module
 * Yayasan Al Muhajirin Rewwin (YAMR)
 */

// Status Program
export interface StatusProgram {
  code: string;
  name: string;
  description: string;
}

export const STATUS_PROGRAM: StatusProgram[] = [
  { code: 'draft', name: 'Draft', description: 'Draft (not started)' },
  { code: 'aktif', name: 'Aktif', description: 'Active (currently running)' },
  { code: 'selesai', name: 'Selesai', description: 'Completed' },
  { code: 'ditunda', name: 'Ditunda', description: 'Postponed' },
  { code: 'batal', name: 'Batal', description: 'Cancelled' },
];

// Jenis Program
export interface JenisProgram {
  value: string;
  description: string;
}

export const JENIS_PROGRAM: JenisProgram[] = [
  { value: 'pendapatan', description: 'Program yang menghasilkan pendapatan' },
  { value: 'pengeluaran', description: 'Program pengeluaran/beban (default)' },
];

// Sifat Program
export interface SifatProgram {
  value: string;
  description: string;
}

export const SIFAT_PROGRAM: SifatProgram[] = [
  { value: 'rutin', description: 'Program yang dilaksanakan secara rutin/berkala (mingguan, bulanan, tahunan)' },
  { value: 'proyek', description: 'Program berbentuk proyek dengan waktu mulai dan selesai yang jelas' },
  { value: 'insidental', description: 'Program yang dilaksanakan sewaktu-waktu sesuai kebutuhan' },
];

// Frekuensi Program
export interface FrekuensiProgram {
  value: string;
  multiplier: number | 'custom';
  description: string;
}

export const FREKUENSI_PROGRAM: FrekuensiProgram[] = [
  { value: 'satupekanan', multiplier: 48, description: 'Dilaksanakan 1x per minggu (48x per tahun)' },
  { value: 'duapekanan', multiplier: 24, description: 'Dilaksanakan 2x per bulan (24x per tahun)' },
  { value: 'bulanan', multiplier: 12, description: 'Dilaksanakan 1x per bulan (12x per tahun)' },
  { value: 'tahunan', multiplier: 1, description: 'Dilaksanakan 1x per tahun' },
  { value: 'custom', multiplier: 'custom', description: 'Frekuensi kustom (isi frekuensi_kustom)' },
];

// Payment Method
export interface PaymentMethod {
  value: string;
  label: string;
  kodeAkun: string; // Default kode akun for this payment method
}

export const PAYMENT_METHODS: PaymentMethod[] = [
  { value: 'cash', label: 'Tunai', kodeAkun: '1101' },
  { value: 'bank', label: 'Transfer Bank', kodeAkun: '1102' },
  { value: 'transfer', label: 'Transfer QRIS', kodeAkun: '1102' },
];

// Transaction Type
export interface TransactionType {
  value: string;
  label: string;
}

export const TRANSACTION_TYPES: TransactionType[] = [
  { value: 'income', label: 'Pemasukan' },
  { value: 'expense', label: 'Pengeluaran' },
];

// Restriction Type Option (for dropdown/display)
export interface RestrictionTypeOption {
  value: string;
  label: string;
  description: string;
}

export const RESTRICTION_TYPES: RestrictionTypeOption[] = [
  { value: 'none', label: 'Tanpa Pembatasan', description: 'Dana dapat digunakan bebas' },
  { value: 'temporary', label: 'Pembatasan Temporer', description: 'Dana harus disalurkan untuk tujuan tertentu' },
  { value: 'permanent', label: 'Pembatasan Permanen', description: 'Dana abadi (hanya hasil yang dapat digunakan)' },
];

// Month names in Indonesian
export const MONTH_NAMES = [
  { value: 1, short: 'Jan', full: 'Januari' },
  { value: 2, short: 'Feb', full: 'Februari' },
  { value: 3, short: 'Mar', full: 'Maret' },
  { value: 4, short: 'Apr', full: 'April' },
  { value: 5, short: 'Mei', full: 'Mei' },
  { value: 6, short: 'Jun', full: 'Juni' },
  { value: 7, short: 'Jul', full: 'Juli' },
  { value: 8, short: 'Agu', full: 'Agustus' },
  { value: 9, short: 'Sep', full: 'September' },
  { value: 10, short: 'Okt', full: 'Oktober' },
  { value: 11, short: 'Nov', full: 'November' },
  { value: 12, short: 'Des', full: 'Desember' },
];

// Helper functions
export function getStatusByCode(code: string): StatusProgram | undefined {
  return STATUS_PROGRAM.find((s) => s.code === code);
}

export function getFrekuensiMultiplier(value: string): number {
  const frekuensi = FREKUENSI_PROGRAM.find((f) => f.value === value);
  if (!frekuensi || frekuensi.multiplier === 'custom') return 1;
  return frekuensi.multiplier;
}

export function getPaymentMethodKodeAkun(method: string): string {
  const pm = PAYMENT_METHODS.find((p) => p.value === method);
  return pm?.kodeAkun || '1102';
}

// For dropdowns
export function getStatusOptions() {
  return STATUS_PROGRAM.map((s) => ({
    value: s.code,
    label: s.name,
  }));
}

export function getJenisOptions() {
  return JENIS_PROGRAM.map((j) => ({
    value: j.value,
    label: j.value === 'pendapatan' ? 'Pendapatan' : 'Pengeluaran',
  }));
}

export function getSifatOptions() {
  return SIFAT_PROGRAM.map((s) => ({
    value: s.value,
    label: s.value.charAt(0).toUpperCase() + s.value.slice(1),
  }));
}

export function getFrekuensiOptions() {
  return FREKUENSI_PROGRAM.map((f) => ({
    value: f.value,
    label: f.description,
  }));
}

export function getPaymentMethodOptions() {
  return PAYMENT_METHODS.map((p) => ({
    value: p.value,
    label: p.label,
  }));
}

export function getTransactionTypeOptions() {
  return TRANSACTION_TYPES.map((t) => ({
    value: t.value,
    label: t.label,
  }));
}

export function getRestrictionTypeOptions() {
  return RESTRICTION_TYPES.map((r) => ({
    value: r.value,
    label: r.label,
  }));
}

export function getMonthOptions() {
  return MONTH_NAMES.map((m) => ({
    value: m.value,
    label: m.full,
  }));
}
