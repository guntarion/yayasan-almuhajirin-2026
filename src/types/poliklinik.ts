// src/types/poliklinik.ts
// Type definitions for Poliklinik module

import {
  PasienKlinik as PrismaPasienKlinik,
  KunjunganKlinik as PrismaKunjunganKlinik,
  RekamMedisKlinik as PrismaRekamMedisKlinik,
  ResepObatKlinik as PrismaResepObatKlinik,
  MasterObat as PrismaMasterObat,
  StokObatMasuk as PrismaStokObatMasuk,
  Jamaah,
} from '@prisma/client';

// Re-export Prisma types
export type PasienKlinik = PrismaPasienKlinik;
export type KunjunganKlinik = PrismaKunjunganKlinik;
export type RekamMedisKlinik = PrismaRekamMedisKlinik;
export type ResepObatKlinik = PrismaResepObatKlinik;
export type MasterObat = PrismaMasterObat;
export type StokObatMasuk = PrismaStokObatMasuk;

// ============================================
// CONSTANTS / OPTIONS
// ============================================

export const STATUS_PERNIKAHAN_OPTIONS = [
  { value: 'belum_menikah', label: 'Belum Menikah' },
  { value: 'menikah', label: 'Menikah' },
  { value: 'cerai_hidup', label: 'Cerai Hidup' },
  { value: 'cerai_mati', label: 'Cerai Mati' },
] as const;

export const STATUS_KUNJUNGAN_OPTIONS = [
  { value: 'menunggu', label: 'Menunggu', color: 'bg-yellow-100 text-yellow-800' },
  { value: 'dalam_pemeriksaan', label: 'Dalam Pemeriksaan', color: 'bg-blue-100 text-blue-800' },
  { value: 'selesai', label: 'Selesai', color: 'bg-green-100 text-green-800' },
  { value: 'dirujuk', label: 'Dirujuk', color: 'bg-purple-100 text-purple-800' },
  { value: 'batal', label: 'Batal', color: 'bg-red-100 text-red-800' },
] as const;

export const JENIS_PELAYANAN_OPTIONS = [
  { value: 'umum', label: 'Umum' },
  { value: 'gigi', label: 'Gigi' },
  { value: 'konsultasi', label: 'Konsultasi' },
] as const;

export const GOLONGAN_DARAH_OPTIONS = [
  { value: 'A', label: 'A' },
  { value: 'B', label: 'B' },
  { value: 'AB', label: 'AB' },
  { value: 'O', label: 'O' },
  { value: 'tidak_tahu', label: 'Tidak Tahu' },
] as const;

export const GENDER_OPTIONS = [
  { value: 'lelaki', label: 'Laki-laki' },
  { value: 'perempuan', label: 'Perempuan' },
] as const;

export const KATEGORI_OBAT_OPTIONS = [
  { value: 'analgesik', label: 'Analgesik (Pereda Nyeri)' },
  { value: 'antipiretik', label: 'Antipiretik (Penurun Demam)' },
  { value: 'antibiotik', label: 'Antibiotik' },
  { value: 'antialergi', label: 'Antialergi' },
  { value: 'antasida', label: 'Antasida (Maag)' },
  { value: 'antidiare', label: 'Antidiare' },
  { value: 'vitamin', label: 'Vitamin & Suplemen' },
  { value: 'obat_batuk', label: 'Obat Batuk' },
  { value: 'obat_flu', label: 'Obat Flu' },
  { value: 'obat_luar', label: 'Obat Luar (Salep)' },
  { value: 'lainnya', label: 'Lainnya' },
] as const;

export const SATUAN_OBAT_OPTIONS = [
  { value: 'tablet', label: 'Tablet' },
  { value: 'kapsul', label: 'Kapsul' },
  { value: 'sirup', label: 'Sirup (Botol)' },
  { value: 'ampul', label: 'Ampul' },
  { value: 'sachet', label: 'Sachet' },
  { value: 'tube', label: 'Tube' },
  { value: 'botol', label: 'Botol' },
  { value: 'strip', label: 'Strip' },
  { value: 'box', label: 'Box' },
] as const;

// ============================================
// EXTENDED TYPES WITH RELATIONS
// ============================================

export interface PasienKlinikWithRelations extends PasienKlinik {
  jamaah?: Jamaah | null;
  kunjungan?: KunjunganKlinikWithRelations[];
  _count?: {
    kunjungan: number;
  };
}

export interface KunjunganKlinikWithRelations extends KunjunganKlinik {
  pasien?: PasienKlinik;
  rekamMedis?: RekamMedisKlinikWithRelations | null;
}

export interface RekamMedisKlinikWithRelations extends RekamMedisKlinik {
  kunjungan?: KunjunganKlinikWithRelations;
  resepObat?: ResepObatKlinikWithRelations[];
}

export interface ResepObatKlinikWithRelations extends ResepObatKlinik {
  obat?: MasterObat | null;
}

export interface MasterObatWithRelations extends MasterObat {
  _count?: {
    resep: number;
    stokMasukList: number;
  };
  stokMasukList?: StokObatMasuk[];
}

// ============================================
// FORM DATA TYPES
// ============================================

export interface PasienFormData {
  jamaahId?: string | null;
  namaLengkap: string;
  jenisKelamin: 'lelaki' | 'perempuan';
  tanggalLahir?: Date | null;
  tempatLahir?: string | null;
  golonganDarah?: 'A' | 'B' | 'AB' | 'O' | 'tidak_tahu' | null;
  alamat?: string | null;
  nomorHP?: string | null;
  nomorHPDarurat?: string | null;
  statusPernikahan?: 'belum_menikah' | 'menikah' | 'cerai_hidup' | 'cerai_mati' | null;
  pekerjaan?: string | null;
  penanggungJawab?: string | null;
  hubunganPenanggungJawab?: string | null;
  riwayatAlergi?: string | null;
  riwayatPenyakitKronis?: string | null;
  catatanKhusus?: string | null;
}

export interface KunjunganFormData {
  pasienId: string;
  tanggalKunjungan?: Date;
  jenisPelayanan?: 'umum' | 'gigi' | 'konsultasi';
  dokter?: string | null;
  keluhanUtama?: string | null;
  statusKunjungan?: 'menunggu' | 'dalam_pemeriksaan' | 'selesai' | 'dirujuk' | 'batal';
}

export interface RekamMedisFormData {
  kunjunganId: string;
  // Anamnesis
  keluhanUtama?: string | null;
  riwayatPenyakitSekarang?: string | null;
  riwayatPenyakitDahulu?: string | null;
  riwayatAlergi?: string | null;
  riwayatObat?: string | null;
  // Pemeriksaan Fisik
  tekananDarahSistolik?: number | null;
  tekananDarahDiastolik?: number | null;
  nadi?: number | null;
  suhu?: number | null;
  pernapasan?: number | null;
  beratBadan?: number | null;
  tinggiBadan?: number | null;
  gulaDarah?: number | null;
  kolesterol?: number | null;
  asamUrat?: number | null;
  catatanPemeriksaan?: string | null;
  // Diagnosis
  diagnosisUtama?: string | null;
  diagnosisTambahan?: string | null;
  kodeICD10?: string | null;
  // Tindakan
  tindakanMedis?: string | null;
  edukasiPasien?: string | null;
  // Rencana
  rencanaSelanjutnya?: string | null;
  tanggalKontrol?: Date | null;
  rujukan?: string | null;
}

export interface ResepObatFormData {
  rekamMedisId: string;
  obatId?: string | null;
  namaObat: string;
  dosis?: string | null;
  aturanPakai?: string | null;
  lamaPemakaian?: string | null;
  jumlahObat: number;
  satuan: string;
  keterangan?: string | null;
}

export interface MasterObatFormData {
  kode: string;
  nama: string;
  namaGenerik?: string | null;
  satuan: string;
  stokAwal?: number;
  stokMinimum?: number;
  kategori?: string | null;
  keterangan?: string | null;
}

export interface StokMasukFormData {
  obatId: string;
  jumlah: number;
  sumber?: string | null;
  keterangan?: string | null;
}

// ============================================
// API RESPONSE TYPES
// ============================================

export interface PasienListResponse {
  data: PasienKlinikWithRelations[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface KunjunganListResponse {
  data: KunjunganKlinikWithRelations[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface MasterObatListResponse {
  data: MasterObatWithRelations[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

/**
 * Generate nomor rekam medis: RM-YYMM-XXXX
 */
export function generateNomorRM(sequence: number): string {
  const now = new Date();
  const yy = now.getFullYear().toString().slice(-2);
  const mm = (now.getMonth() + 1).toString().padStart(2, '0');
  const seq = sequence.toString().padStart(4, '0');
  return `RM-${yy}${mm}-${seq}`;
}

/**
 * Generate nomor kunjungan: KJ-YYMMDD-XXX
 */
export function generateNomorKunjungan(sequence: number): string {
  const now = new Date();
  const yy = now.getFullYear().toString().slice(-2);
  const mm = (now.getMonth() + 1).toString().padStart(2, '0');
  const dd = now.getDate().toString().padStart(2, '0');
  const seq = sequence.toString().padStart(3, '0');
  return `KJ-${yy}${mm}${dd}-${seq}`;
}

/**
 * Calculate age from birth date
 */
export function hitungUmur(tanggalLahir: Date | string): { tahun: number; bulan: number } {
  const birthDate = typeof tanggalLahir === 'string' ? new Date(tanggalLahir) : tanggalLahir;
  const now = new Date();

  let years = now.getFullYear() - birthDate.getFullYear();
  let months = now.getMonth() - birthDate.getMonth();

  if (months < 0) {
    years--;
    months += 12;
  }

  if (now.getDate() < birthDate.getDate()) {
    months--;
    if (months < 0) {
      years--;
      months = 11;
    }
  }

  return { tahun: years, bulan: months };
}

/**
 * Format umur untuk display
 */
export function formatUmur(tanggalLahir: Date | string | null | undefined): string {
  if (!tanggalLahir) return '-';
  const { tahun, bulan } = hitungUmur(tanggalLahir);
  if (tahun < 1) {
    return `${bulan} bulan`;
  }
  return tahun >= 5 ? `${tahun} tahun` : `${tahun} tahun ${bulan} bulan`;
}

/**
 * Calculate IMT (Body Mass Index)
 */
export function hitungIMT(beratBadan: number, tinggiBadan: number): number {
  const tinggiMeter = tinggiBadan / 100;
  return parseFloat((beratBadan / (tinggiMeter * tinggiMeter)).toFixed(1));
}

/**
 * Get IMT category
 */
export function kategoriIMT(imt: number): { label: string; color: string } {
  if (imt < 18.5) return { label: 'Kurus', color: 'text-yellow-600' };
  if (imt < 25) return { label: 'Normal', color: 'text-green-600' };
  if (imt < 30) return { label: 'Overweight', color: 'text-orange-600' };
  return { label: 'Obesitas', color: 'text-red-600' };
}

/**
 * Get tekanan darah category
 */
export function kategoriTekananDarah(sistolik: number, diastolik: number): { label: string; color: string } {
  if (sistolik < 120 && diastolik < 80) return { label: 'Normal', color: 'text-green-600' };
  if (sistolik < 130 && diastolik < 80) return { label: 'Elevated', color: 'text-yellow-600' };
  if (sistolik < 140 || diastolik < 90) return { label: 'Hipertensi Stage 1', color: 'text-orange-600' };
  if (sistolik >= 140 || diastolik >= 90) return { label: 'Hipertensi Stage 2', color: 'text-red-600' };
  return { label: '-', color: 'text-gray-600' };
}

/**
 * Format tanggal Indonesia
 */
export function formatTanggal(date: Date | string | null | undefined): string {
  if (!date) return '-';
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

/**
 * Format tanggal dan waktu Indonesia
 */
export function formatTanggalWaktu(date: Date | string | null | undefined): string {
  if (!date) return '-';
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}
