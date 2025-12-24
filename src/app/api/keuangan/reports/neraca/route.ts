import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/utils/prisma';

/**
 * Laporan Posisi Keuangan (Neraca) / Statement of Financial Position
 * Based on PSAK 45 / ISAK 35 for Non-Profit Organizations
 */

interface AccountBalance {
  kode: string;
  nama: string;
  saldo: number;
  subKategori: string | null;
  isContraAccount: boolean;
}

interface NeracaSection {
  title: string;
  accounts: AccountBalance[];
  total: number;
}

// GET /api/keuangan/reports/neraca
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const year = parseInt(searchParams.get('year') || new Date().getFullYear().toString());
    const month = searchParams.get('month') ? parseInt(searchParams.get('month')!) : null;

    // Get fiscal period
    const fiscalPeriod = await prisma.fiscalPeriod.findFirst({
      where: { year },
    });

    if (!fiscalPeriod) {
      return NextResponse.json(
        { error: 'Fiscal period not found' },
        { status: 404 }
      );
    }

    // Build date range
    const startDate = new Date(`${year}-01-01`);
    const endDate = month
      ? new Date(year, month, 0) // Last day of specified month
      : new Date(`${year}-12-31`);

    // Get all accounts grouped by category
    const accounts = await prisma.kodeAkun.findMany({
      where: { isActive: true },
      orderBy: { kode: 'asc' },
    });

    // Get journal entries for the period
    const journalEntries = await prisma.journalEntry.findMany({
      where: {
        transaction: {
          fiscalPeriodId: fiscalPeriod.id,
          transactionDate: {
            gte: startDate,
            lte: endDate,
          },
          isVoided: false,
        },
      },
      include: {
        akun: true,
      },
    });

    // Calculate balances for each account
    const balances: Record<string, number> = {};

    for (const entry of journalEntries) {
      const kode = entry.kodeAkun;
      if (!balances[kode]) {
        balances[kode] = 0;
      }

      const amount = Number(entry.amount);
      const akun = entry.akun;

      // Apply double-entry logic
      if (entry.entryType === 'debit') {
        if (akun.normalBalance === 'debit') {
          balances[kode] += amount;
        } else {
          balances[kode] -= amount;
        }
      } else {
        if (akun.normalBalance === 'credit') {
          balances[kode] += amount;
        } else {
          balances[kode] -= amount;
        }
      }
    }

    // Group accounts by category
    const asetLancar: AccountBalance[] = [];
    const asetTetap: AccountBalance[] = [];
    const kewajibanJangkaPendek: AccountBalance[] = [];
    const kewajibanJangkaPanjang: AccountBalance[] = [];
    const asetBersihTanpaPembatasan: AccountBalance[] = [];
    const asetBersihPembatasanTemporer: AccountBalance[] = [];
    const asetBersihPembatasanPermanen: AccountBalance[] = [];

    for (const akun of accounts) {
      const saldo = balances[akun.kode] || 0;
      if (saldo === 0 && akun.kategori !== 'aset_bersih') continue; // Skip zero balances except net assets

      const accountBalance: AccountBalance = {
        kode: akun.kode,
        nama: akun.nama,
        saldo: akun.isContraAccount ? -saldo : saldo,
        subKategori: akun.subKategori,
        isContraAccount: akun.isContraAccount || false,
      };

      switch (akun.kategori) {
        case 'aset':
          if (akun.subKategori === 'aset_lancar') {
            asetLancar.push(accountBalance);
          } else {
            asetTetap.push(accountBalance);
          }
          break;
        case 'kewajiban':
          if (akun.subKategori === 'jangka_pendek') {
            kewajibanJangkaPendek.push(accountBalance);
          } else {
            kewajibanJangkaPanjang.push(accountBalance);
          }
          break;
        case 'aset_bersih':
          if (akun.subKategori === 'unrestricted') {
            asetBersihTanpaPembatasan.push(accountBalance);
          } else if (akun.subKategori === 'temporarily_restricted') {
            asetBersihPembatasanTemporer.push(accountBalance);
          } else {
            asetBersihPembatasanPermanen.push(accountBalance);
          }
          break;
      }
    }

    // Calculate totals
    const calcTotal = (items: AccountBalance[]) =>
      items.reduce((sum, item) => sum + item.saldo, 0);

    const totalAsetLancar = calcTotal(asetLancar);
    const totalAsetTetap = calcTotal(asetTetap);
    const totalAset = totalAsetLancar + totalAsetTetap;

    const totalKewajibanJangkaPendek = calcTotal(kewajibanJangkaPendek);
    const totalKewajibanJangkaPanjang = calcTotal(kewajibanJangkaPanjang);
    const totalKewajiban = totalKewajibanJangkaPendek + totalKewajibanJangkaPanjang;

    const totalAsetBersihTanpaPembatasan = calcTotal(asetBersihTanpaPembatasan);
    const totalAsetBersihPembatasanTemporer = calcTotal(asetBersihPembatasanTemporer);
    const totalAsetBersihPembatasanPermanen = calcTotal(asetBersihPembatasanPermanen);
    const totalAsetBersih =
      totalAsetBersihTanpaPembatasan +
      totalAsetBersihPembatasanTemporer +
      totalAsetBersihPembatasanPermanen;

    const totalKewajibanDanAsetBersih = totalKewajiban + totalAsetBersih;

    return NextResponse.json({
      data: {
        period: {
          year,
          month,
          startDate,
          endDate,
          fiscalPeriodName: fiscalPeriod.name,
        },
        aset: {
          asetLancar: {
            title: 'Aset Lancar',
            accounts: asetLancar,
            total: totalAsetLancar,
          } as NeracaSection,
          asetTetap: {
            title: 'Aset Tetap',
            accounts: asetTetap,
            total: totalAsetTetap,
          } as NeracaSection,
          totalAset,
        },
        kewajiban: {
          jangkaPendek: {
            title: 'Kewajiban Jangka Pendek',
            accounts: kewajibanJangkaPendek,
            total: totalKewajibanJangkaPendek,
          } as NeracaSection,
          jangkaPanjang: {
            title: 'Kewajiban Jangka Panjang',
            accounts: kewajibanJangkaPanjang,
            total: totalKewajibanJangkaPanjang,
          } as NeracaSection,
          totalKewajiban,
        },
        asetBersih: {
          tanpaPembatasan: {
            title: 'Aset Bersih Tanpa Pembatasan',
            accounts: asetBersihTanpaPembatasan,
            total: totalAsetBersihTanpaPembatasan,
          } as NeracaSection,
          pembatasanTemporer: {
            title: 'Aset Bersih Dengan Pembatasan Temporer',
            accounts: asetBersihPembatasanTemporer,
            total: totalAsetBersihPembatasanTemporer,
          } as NeracaSection,
          pembatasanPermanen: {
            title: 'Aset Bersih Dengan Pembatasan Permanen',
            accounts: asetBersihPembatasanPermanen,
            total: totalAsetBersihPembatasanPermanen,
          } as NeracaSection,
          totalAsetBersih,
        },
        totalKewajibanDanAsetBersih,
        isBalanced: Math.abs(totalAset - totalKewajibanDanAsetBersih) < 0.01,
      },
    });
  } catch (error) {
    console.error('Neraca report error:', error);
    return NextResponse.json(
      { error: 'Failed to generate balance sheet' },
      { status: 500 }
    );
  }
}
