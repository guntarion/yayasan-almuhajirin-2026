/**
 * Keuangan Utility Functions
 * Yayasan Al Muhajirin Rewwin (YAMR)
 */

import { Decimal } from '@prisma/client/runtime/library';

// Currency Formatting
export function formatCurrency(amount: number | Decimal | null | undefined): string {
  if (amount === null || amount === undefined) return 'Rp 0';

  const numAmount = typeof amount === 'number' ? amount : Number(amount);

  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(numAmount);
}

// Short currency format (e.g., "1.5 Jt", "2.3 M")
export function formatCurrencyShort(amount: number | Decimal | null | undefined): string {
  if (amount === null || amount === undefined) return 'Rp 0';

  const numAmount = typeof amount === 'number' ? amount : Number(amount);

  if (numAmount >= 1_000_000_000) {
    return `Rp ${(numAmount / 1_000_000_000).toFixed(1)} M`;
  }
  if (numAmount >= 1_000_000) {
    return `Rp ${(numAmount / 1_000_000).toFixed(1)} Jt`;
  }
  if (numAmount >= 1_000) {
    return `Rp ${(numAmount / 1_000).toFixed(0)} Rb`;
  }
  return formatCurrency(numAmount);
}

// Parse currency string to number
export function parseCurrency(value: string): number {
  // Remove non-numeric characters except minus and comma/period
  const cleaned = value.replace(/[^\d,-]/g, '').replace(',', '.');
  return parseFloat(cleaned) || 0;
}

// Number formatting
export function formatNumber(num: number | null | undefined): string {
  if (num === null || num === undefined) return '0';
  return new Intl.NumberFormat('id-ID').format(num);
}

// Date Formatting
export function formatDate(date: Date | string | null | undefined): string {
  if (!date) return '-';
  const d = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(d);
}

export function formatDateLong(date: Date | string | null | undefined): string {
  if (!date) return '-';
  const d = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(d);
}

export function formatDateISO(date: Date): string {
  return date.toISOString().split('T')[0];
}

// Transaction Code Generator
export function generateTransactionCode(date: Date = new Date()): string {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const timestamp = Date.now().toString().slice(-6);
  return `TRX-${year}${month}-${timestamp}`;
}

// Program Code Generator
export function generateProgramCode(
  year: number,
  bidangKode: string,
  unitKode: string,
  jenis: 'pendapatan' | 'pengeluaran',
  sequence: number
): string {
  const jenisPrefix = jenis === 'pendapatan' ? 'IN' : 'OT';
  return `${bidangKode}-${unitKode}-${jenisPrefix}-${year}-${sequence.toString().padStart(3, '0')}`;
}

// Percentage Calculation
export function calculatePercentage(value: number, total: number): number {
  if (total === 0) return 0;
  return Math.round((value / total) * 100);
}

// Realisasi Progress
export function calculateRealisasiProgress(realisasi: number | Decimal, budget: number | Decimal): number {
  const numRealisasi = typeof realisasi === 'number' ? realisasi : Number(realisasi);
  const numBudget = typeof budget === 'number' ? budget : Number(budget);

  if (numBudget === 0) return 0;
  return Math.min(Math.round((numRealisasi / numBudget) * 100), 100);
}

// Get Realisasi Status
export function getRealisasiStatus(
  realisasi: number | Decimal,
  budget: number | Decimal
): 'under' | 'normal' | 'over' {
  const numRealisasi = typeof realisasi === 'number' ? realisasi : Number(realisasi);
  const numBudget = typeof budget === 'number' ? budget : Number(budget);

  if (numBudget === 0) return 'normal';
  const percentage = (numRealisasi / numBudget) * 100;

  if (percentage < 50) return 'under';
  if (percentage > 100) return 'over';
  return 'normal';
}

// Get surplus/defisit
export function calculateSurplusDefisit(pendapatan: number, beban: number): {
  amount: number;
  status: 'surplus' | 'defisit' | 'balanced';
} {
  const difference = pendapatan - beban;

  if (difference > 0) {
    return { amount: difference, status: 'surplus' };
  } else if (difference < 0) {
    return { amount: Math.abs(difference), status: 'defisit' };
  }
  return { amount: 0, status: 'balanced' };
}

// Month utilities
export function getCurrentMonth(): number {
  return new Date().getMonth() + 1;
}

export function getCurrentYear(): number {
  return new Date().getFullYear();
}

export function getMonthName(month: number): string {
  const months = [
    'Januari',
    'Februari',
    'Maret',
    'April',
    'Mei',
    'Juni',
    'Juli',
    'Agustus',
    'September',
    'Oktober',
    'November',
    'Desember',
  ];
  return months[month - 1] || '';
}

// Get fiscal year period dates
export function getFiscalYearDates(year: number): { startDate: Date; endDate: Date } {
  return {
    startDate: new Date(year, 0, 1), // January 1
    endDate: new Date(year, 11, 31), // December 31
  };
}

// Decimal to number
export function decimalToNumber(value: Decimal | number | null | undefined): number {
  if (value === null || value === undefined) return 0;
  return typeof value === 'number' ? value : Number(value);
}

// Sum decimal array
export function sumDecimals(values: (Decimal | number | null | undefined)[]): number {
  return values.reduce<number>((sum, val) => sum + decimalToNumber(val), 0);
}

// Validate amount is positive
export function isValidAmount(amount: number): boolean {
  return amount > 0 && !isNaN(amount) && isFinite(amount);
}

// Truncate text
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength - 3) + '...';
}
