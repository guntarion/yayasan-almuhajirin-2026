// src/types/jamaah.ts

export type SebutanJamaah = 'Pak' | 'Bu' | 'Mas' | 'Mbak' | 'Kel' | 'Ustadz' | 'Ustadzah' | 'Haji' | 'Hajah';

export type AlamatRW = 'RW6' | 'RW8' | 'RW9' | 'RWLainnya';

export type AlamatWilayah = 'Rewwin' | 'Lainnya';

export type Gender = 'lelaki' | 'perempuan';

export interface Jamaah {
  id: string;
  nama: string;
  sebutan: SebutanJamaah | null;
  anonymizeDisplay: boolean;
  namaDisplay: string;
  nomerHandphone: string | null;
  email: string | null;
  alamatJalan: string | null;
  alamatRW: AlamatRW | null;
  alamatRT: string | null;
  alamatWilayah: AlamatWilayah | null;
  alamatDetail: string | null;
  alamatLengkap?: string;
  gender: Gender | null;
  tanggalLahir: string | null;
  profesi: string | null;
  isJamaahAktif: boolean;
  isPengunjungKlinik: boolean;
  isDonatur: boolean;
  catatan: string | null;
  createdAt: string;
  updatedAt: string;
  jumlahKunjunganKlinik?: number;
  jumlahDonasi?: number;
  totalDonasiVerified?: number;
}

export interface JamaahFormData {
  nama: string;
  sebutan: SebutanJamaah | '';
  anonymizeDisplay: boolean;
  nomerHandphone: string;
  email: string;
  alamatJalan: string;
  alamatRW: AlamatRW | '';
  alamatRT: string;
  alamatWilayah: AlamatWilayah | '';
  alamatDetail: string;
  gender: Gender | '';
  tanggalLahir: string;
  profesi: string;
  isJamaahAktif: boolean;
  isPengunjungKlinik: boolean;
  isDonatur: boolean;
  catatan: string;
}

export interface RiwayatKlinik {
  id: string;
  jamaahId: string;
  tanggalKunjungan: string;
  keluhan: string | null;
  diagnosa: string | null;
  tindakan: string | null;
  obat: string | null;
  dokter: string | null;
  catatan: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface DonasiJamaah {
  id: string;
  jamaahId: string;
  tanggalDonasi: string;
  jumlah: number;
  jenisDonasi: string;
  programDonasi: string | null;
  metodePembayaran: string | null;
  buktiTransfer: string | null;
  keterangan: string | null;
  isVerified: boolean;
  verifiedBy: string | null;
  verifiedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export const SEBUTAN_OPTIONS: { value: SebutanJamaah; label: string }[] = [
  { value: 'Pak', label: 'Pak' },
  { value: 'Bu', label: 'Bu' },
  { value: 'Mas', label: 'Mas' },
  { value: 'Mbak', label: 'Mbak' },
  { value: 'Kel', label: 'Kel.' },
  { value: 'Ustadz', label: 'Ustadz' },
  { value: 'Ustadzah', label: 'Ustadzah' },
  { value: 'Haji', label: 'Haji' },
  { value: 'Hajah', label: 'Hajah' },
];

export const ALAMAT_RW_OPTIONS: { value: AlamatRW; label: string }[] = [
  { value: 'RW6', label: 'RW 6' },
  { value: 'RW8', label: 'RW 8' },
  { value: 'RW9', label: 'RW 9' },
  { value: 'RWLainnya', label: 'RW Lainnya' },
];

export const ALAMAT_WILAYAH_OPTIONS: { value: AlamatWilayah; label: string }[] = [
  { value: 'Rewwin', label: 'Rewwin' },
  { value: 'Lainnya', label: 'Lainnya' },
];

export const GENDER_OPTIONS: { value: Gender; label: string }[] = [
  { value: 'lelaki', label: 'Laki-laki' },
  { value: 'perempuan', label: 'Perempuan' },
];

export const JENIS_DONASI_OPTIONS = [
  'Zakat Mal',
  'Zakat Fitrah',
  'Infaq',
  'Sedekah',
  'Wakaf',
  'Qurban',
  'Fidyah',
  'Lainnya',
];

export const METODE_PEMBAYARAN_OPTIONS = [
  'Transfer Bank',
  'Cash',
  'QRIS',
  'E-Wallet',
];
