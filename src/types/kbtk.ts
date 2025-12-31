// src/types/kbtk.ts
// Type definitions for KBTK (Kelompok Bermain & Taman Kanak-kanak) module

import {
  KbtkSiswa as PrismaKbtkSiswa,
  KbtkOrangTua as PrismaKbtkOrangTua,
  KbtkPendaftaran as PrismaKbtkPendaftaran,
  KbtkPembayaranPendaftaran as PrismaKbtkPembayaranPendaftaran,
  KbtkSettingSpp as PrismaKbtkSettingSpp,
  KbtkTagihanSpp as PrismaKbtkTagihanSpp,
  KbtkPembayaranSpp as PrismaKbtkPembayaranSpp,
} from '@prisma/client';

// Re-export Prisma types
export type KbtkSiswa = PrismaKbtkSiswa;
export type KbtkOrangTua = PrismaKbtkOrangTua;
export type KbtkPendaftaran = PrismaKbtkPendaftaran;
export type KbtkPembayaranPendaftaran = PrismaKbtkPembayaranPendaftaran;
export type KbtkSettingSpp = PrismaKbtkSettingSpp;
export type KbtkTagihanSpp = PrismaKbtkTagihanSpp;
export type KbtkPembayaranSpp = PrismaKbtkPembayaranSpp;

// ============================================
// CONSTANTS / OPTIONS
// ============================================

export const KELOMPOK_LEVEL_OPTIONS = [
  { value: 'KB', label: 'Kelompok Bermain (KB)' },
  { value: 'TK', label: 'Taman Kanak-kanak (TK)' },
] as const;

export const KELOMPOK_KELAS_OPTIONS = [
  { value: 'A', label: 'Kelas A' },
  { value: 'B', label: 'Kelas B' },
] as const;

export const STATUS_SISWA_OPTIONS = [
  { value: 'aktif', label: 'Aktif', color: 'bg-green-100 text-green-800' },
  { value: 'cuti', label: 'Cuti', color: 'bg-yellow-100 text-yellow-800' },
  { value: 'lulus', label: 'Lulus', color: 'bg-blue-100 text-blue-800' },
  { value: 'keluar', label: 'Keluar', color: 'bg-red-100 text-red-800' },
] as const;

export const STATUS_PENDAFTARAN_OPTIONS = [
  { value: 'daftar', label: 'Mendaftar', color: 'bg-yellow-100 text-yellow-800' },
  { value: 'diterima', label: 'Diterima', color: 'bg-green-100 text-green-800' },
  { value: 'batal', label: 'Batal', color: 'bg-red-100 text-red-800' },
] as const;

export const SCHEMA_PEMBAYARAN_OPTIONS = [
  { value: 'lunas', label: 'Lunas' },
  { value: 'angsuran', label: 'Angsuran/Cicilan' },
] as const;

export const STATUS_TAGIHAN_OPTIONS = [
  { value: 'belum_bayar', label: 'Belum Bayar', color: 'bg-red-100 text-red-800' },
  { value: 'bayar_sebagian', label: 'Bayar Sebagian', color: 'bg-yellow-100 text-yellow-800' },
  { value: 'lunas', label: 'Lunas', color: 'bg-green-100 text-green-800' },
] as const;

export const METODE_PEMBAYARAN_OPTIONS = [
  { value: 'cash', label: 'Cash/Tunai' },
  { value: 'transfer', label: 'Transfer Bank' },
] as const;

export const RELASI_OPTIONS = [
  { value: 'ayah', label: 'Ayah' },
  { value: 'ibu', label: 'Ibu' },
  { value: 'wali', label: 'Wali' },
] as const;

export const GENDER_OPTIONS = [
  { value: 'lelaki', label: 'Laki-laki' },
  { value: 'perempuan', label: 'Perempuan' },
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

// ============================================
// EXTENDED TYPES WITH RELATIONS
// ============================================

export interface KbtkSiswaWithRelations extends KbtkSiswa {
  orangTua?: KbtkOrangTua[];
  pendaftaran?: KbtkPendaftaranWithRelations | null;
  tagihanSpp?: KbtkTagihanSppWithRelations[];
  _count?: {
    orangTua: number;
    tagihanSpp: number;
  };
}

export interface KbtkOrangTuaWithRelations extends KbtkOrangTua {
  siswa?: KbtkSiswa;
}

export interface KbtkPendaftaranWithRelations extends KbtkPendaftaran {
  siswa?: KbtkSiswaWithRelations;
  pembayaran?: KbtkPembayaranPendaftaran[];
  _totalBayar?: number;
  _sisaTagihan?: number;
}

export interface KbtkTagihanSppWithRelations extends KbtkTagihanSpp {
  siswa?: KbtkSiswa;
  pembayaran?: KbtkPembayaranSpp[];
  _totalBayar?: number;
  _sisaTagihan?: number;
}

// ============================================
// FORM DATA TYPES
// ============================================

export interface SiswaFormData {
  namaLengkap: string;
  namaPanggilan?: string | null;
  jenisKelamin: 'lelaki' | 'perempuan';
  tanggalLahir?: Date | null;
  tempatLahir?: string | null;
  foto?: string | null;
  kelompokLevel: 'KB' | 'TK';
  kelompokKelas?: 'A' | 'B';
  tahunAjaran: string;
  tanggalMasuk?: Date;
  status?: 'aktif' | 'cuti' | 'lulus' | 'keluar';
  alamat?: string | null;
  catatanKhusus?: string | null;
  // Embedded orang tua data
  orangTua?: OrangTuaFormData[];
}

export interface OrangTuaFormData {
  id?: string;
  nama: string;
  relasi: 'ayah' | 'ibu' | 'wali';
  nomorHP?: string | null;
  email?: string | null;
  pekerjaan?: string | null;
  alamat?: string | null;
  isPrimary?: boolean;
}

export interface PendaftaranFormData {
  siswaId: string;
  tahunAjaran: string;
  tanggalDaftar?: Date;
  program: 'KB' | 'TK';
  biayaPendaftaran: number;
  schemaPembayaran: 'lunas' | 'angsuran';
  status?: 'daftar' | 'diterima' | 'batal';
  catatan?: string | null;
}

export interface PembayaranPendaftaranFormData {
  pendaftaranId: string;
  tanggalBayar?: Date;
  nominal: number;
  metodePembayaran: 'cash' | 'transfer';
  buktiTransfer?: string | null;
  catatan?: string | null;
}

export interface SettingSppFormData {
  tahunAjaran: string;
  kelompokLevel: 'KB' | 'TK';
  nominalSpp: number;
  keterangan?: string | null;
  isActive?: boolean;
}

export interface TagihanSppFormData {
  siswaId: string;
  bulan: number;
  tahun: number;
  nominal: number;
  diskon?: number;
  catatan?: string | null;
}

export interface PembayaranSppFormData {
  tagihanId: string;
  tanggalBayar?: Date;
  nominal: number;
  metodePembayaran: 'cash' | 'transfer';
  buktiTransfer?: string | null;
  catatan?: string | null;
}

// ============================================
// API RESPONSE TYPES
// ============================================

export interface SiswaListResponse {
  data: KbtkSiswaWithRelations[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface PendaftaranListResponse {
  data: KbtkPendaftaranWithRelations[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface TagihanSppListResponse {
  data: KbtkTagihanSppWithRelations[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface KbtkDashboardStats {
  totalSiswa: number;
  siswaAktif: number;
  siswaKB: number;
  siswaTK: number;
  pendaftaranBaru: number;
  totalTunggakan: number;
  siswaMenunggak: number;
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

/**
 * Generate nomor induk siswa: KBTK-YYMM-XXXX
 */
export function generateNomorInduk(sequence: number): string {
  const now = new Date();
  const yy = now.getFullYear().toString().slice(-2);
  const mm = (now.getMonth() + 1).toString().padStart(2, '0');
  const seq = sequence.toString().padStart(4, '0');
  return `KBTK-${yy}${mm}-${seq}`;
}

/**
 * Get current academic year
 * Academic year runs from July to June
 */
export function getTahunAjaranSekarang(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1;

  // If before July, academic year is previous year/current year
  if (month < 7) {
    return `${year - 1}/${year}`;
  }
  // If July or after, academic year is current year/next year
  return `${year}/${year + 1}`;
}

/**
 * Get list of academic year options for dropdown
 */
export function getTahunAjaranOptions(count: number = 5): { value: string; label: string }[] {
  const options: { value: string; label: string }[] = [];
  const currentYear = new Date().getFullYear();

  for (let i = -1; i < count; i++) {
    const startYear = currentYear - i;
    const endYear = startYear + 1;
    const value = `${startYear}/${endYear}`;
    options.push({ value, label: value });
  }

  return options;
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
 * Format tanggal singkat
 */
export function formatTanggalSingkat(date: Date | string | null | undefined): string {
  if (!date) return '-';
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

/**
 * Format currency Indonesia
 */
export function formatCurrency(value: number | string | null | undefined): string {
  if (value === null || value === undefined) return 'Rp 0';
  const numValue = typeof value === 'string' ? parseFloat(value) : value;
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(numValue);
}

/**
 * Get nama bulan
 */
export function getNamaBulan(bulan: number): string {
  return BULAN_OPTIONS.find(b => b.value === bulan)?.label || '-';
}

/**
 * Get status badge color
 */
export function getStatusSiswaColor(status: string): string {
  return STATUS_SISWA_OPTIONS.find(s => s.value === status)?.color || 'bg-gray-100 text-gray-800';
}

/**
 * Get status tagihan badge color
 */
export function getStatusTagihanColor(status: string): string {
  return STATUS_TAGIHAN_OPTIONS.find(s => s.value === status)?.color || 'bg-gray-100 text-gray-800';
}

/**
 * Get status pendaftaran badge color
 */
export function getStatusPendaftaranColor(status: string): string {
  return STATUS_PENDAFTARAN_OPTIONS.find(s => s.value === status)?.color || 'bg-gray-100 text-gray-800';
}

/**
 * Check if tagihan is overdue (lewat bulan)
 */
export function isTagihanOverdue(bulan: number, tahun: number): boolean {
  const now = new Date();
  const currentMonth = now.getMonth() + 1;
  const currentYear = now.getFullYear();

  if (tahun < currentYear) return true;
  if (tahun === currentYear && bulan < currentMonth) return true;
  return false;
}

/**
 * Format kelompok display (e.g., "KB-A", "TK-B")
 */
export function formatKelompok(level: string, kelas: string): string {
  return `${level}-${kelas}`;
}

/**
 * Format WhatsApp link
 */
export function getWhatsAppLink(phone: string, message?: string): string {
  // Clean phone number
  let cleanPhone = phone.replace(/\D/g, '');

  // Convert 08xxx to 628xxx
  if (cleanPhone.startsWith('0')) {
    cleanPhone = '62' + cleanPhone.slice(1);
  }

  const baseUrl = `https://wa.me/${cleanPhone}`;
  if (message) {
    return `${baseUrl}?text=${encodeURIComponent(message)}`;
  }
  return baseUrl;
}
