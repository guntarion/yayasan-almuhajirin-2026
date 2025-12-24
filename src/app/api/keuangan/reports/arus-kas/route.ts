import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/utils/prisma';

/**
 * Laporan Arus Kas / Statement of Cash Flows
 * Based on PSAK 45 / ISAK 35 for Non-Profit Organizations
 *
 * Direct method showing cash inflows and outflows
 */

interface CashFlowItem {
  kode?: string;
  nama: string;
  jumlah: number;
}

interface CashFlowSection {
  title: string;
  items: CashFlowItem[];
  total: number;
}

// GET /api/keuangan/reports/arus-kas
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
      ? new Date(year, month, 0)
      : new Date(`${year}-12-31`);

    // Get transactions for the period
    const transactions = await prisma.transaction.findMany({
      where: {
        fiscalPeriodId: fiscalPeriod.id,
        transactionDate: {
          gte: startDate,
          lte: endDate,
        },
        isVoided: false,
      },
      include: {
        journalEntries: {
          include: {
            akun: true,
          },
        },
        bidang: true,
        unitKerja: true,
      },
      orderBy: { transactionDate: 'asc' },
    });

    // Cash accounts (1101-1105)
    const cashAccountCodes = ['1101', '1102', '1103', '1104', '1105'];

    // Group transactions by activity type
    const operatingInflows: CashFlowItem[] = [];
    const operatingOutflows: CashFlowItem[] = [];
    const investingInflows: CashFlowItem[] = [];
    const investingOutflows: CashFlowItem[] = [];
    const financingInflows: CashFlowItem[] = [];
    const financingOutflows: CashFlowItem[] = [];

    // Track cash changes by source
    const cashBySource: Record<string, number> = {};

    for (const transaction of transactions) {
      // Check if this transaction affects cash
      const cashEntry = transaction.journalEntries.find(
        entry => cashAccountCodes.includes(entry.kodeAkun)
      );

      if (!cashEntry) continue;

      const amount = Number(transaction.amount);
      const isInflow = transaction.type === 'income';
      const description = transaction.description;
      const unitName = transaction.unitKerja?.nama || 'Umum';

      // Determine activity type based on account codes
      const nonCashEntry = transaction.journalEntries.find(
        entry => !cashAccountCodes.includes(entry.kodeAkun)
      );

      if (!nonCashEntry) continue;

      const kodeAkun = nonCashEntry.kodeAkun;
      const item: CashFlowItem = {
        kode: kodeAkun,
        nama: `${description} (${unitName})`,
        jumlah: amount,
      };

      // Classify by account code
      if (kodeAkun.startsWith('4') || kodeAkun.startsWith('5')) {
        // Operating activities (revenue and expenses)
        if (isInflow) {
          operatingInflows.push(item);
        } else {
          operatingOutflows.push(item);
        }
      } else if (kodeAkun.startsWith('12')) {
        // Investing activities (fixed assets)
        if (isInflow) {
          investingInflows.push(item);
        } else {
          investingOutflows.push(item);
        }
      } else if (kodeAkun.startsWith('2')) {
        // Financing activities (liabilities)
        if (isInflow) {
          financingInflows.push(item);
        } else {
          financingOutflows.push(item);
        }
      } else {
        // Default to operating
        if (isInflow) {
          operatingInflows.push(item);
        } else {
          operatingOutflows.push(item);
        }
      }

      // Track by source/unit
      const sourceKey = unitName;
      if (!cashBySource[sourceKey]) {
        cashBySource[sourceKey] = 0;
      }
      cashBySource[sourceKey] += isInflow ? amount : -amount;
    }

    // Calculate totals
    const calcTotal = (items: CashFlowItem[]) =>
      items.reduce((sum, item) => sum + item.jumlah, 0);

    const totalOperatingInflows = calcTotal(operatingInflows);
    const totalOperatingOutflows = calcTotal(operatingOutflows);
    const netOperating = totalOperatingInflows - totalOperatingOutflows;

    const totalInvestingInflows = calcTotal(investingInflows);
    const totalInvestingOutflows = calcTotal(investingOutflows);
    const netInvesting = totalInvestingInflows - totalInvestingOutflows;

    const totalFinancingInflows = calcTotal(financingInflows);
    const totalFinancingOutflows = calcTotal(financingOutflows);
    const netFinancing = totalFinancingInflows - totalFinancingOutflows;

    const netCashChange = netOperating + netInvesting + netFinancing;

    // Get beginning and ending cash balances
    const cashAccounts = await prisma.kodeAkun.findMany({
      where: {
        kode: { in: cashAccountCodes },
        isActive: true,
      },
    });

    // Calculate beginning balance (before startDate)
    const beginningEntries = await prisma.journalEntry.findMany({
      where: {
        kodeAkun: { in: cashAccountCodes },
        transaction: {
          transactionDate: { lt: startDate },
          isVoided: false,
        },
      },
      include: { akun: true },
    });

    let beginningBalance = 0;
    for (const entry of beginningEntries) {
      const amount = Number(entry.amount);
      if (entry.entryType === 'debit') {
        beginningBalance += amount;
      } else {
        beginningBalance -= amount;
      }
    }

    const endingBalance = beginningBalance + netCashChange;

    // Get monthly breakdown
    const monthlyData: { month: number; inflow: number; outflow: number; net: number }[] = [];
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];

    for (let m = 1; m <= 12; m++) {
      const monthStart = new Date(year, m - 1, 1);
      const monthEnd = new Date(year, m, 0);

      let inflow = 0;
      let outflow = 0;

      for (const trx of transactions) {
        const trxDate = new Date(trx.transactionDate);
        if (trxDate >= monthStart && trxDate <= monthEnd) {
          if (trx.type === 'income') {
            inflow += Number(trx.amount);
          } else {
            outflow += Number(trx.amount);
          }
        }
      }

      monthlyData.push({
        month: m,
        inflow,
        outflow,
        net: inflow - outflow,
      });
    }

    return NextResponse.json({
      data: {
        period: {
          year,
          month,
          startDate,
          endDate,
          fiscalPeriodName: fiscalPeriod.name,
        },
        operatingActivities: {
          inflows: {
            title: 'Penerimaan Kas dari Aktivitas Operasi',
            items: operatingInflows,
            total: totalOperatingInflows,
          } as CashFlowSection,
          outflows: {
            title: 'Pengeluaran Kas untuk Aktivitas Operasi',
            items: operatingOutflows,
            total: totalOperatingOutflows,
          } as CashFlowSection,
          net: netOperating,
        },
        investingActivities: {
          inflows: {
            title: 'Penerimaan Kas dari Aktivitas Investasi',
            items: investingInflows,
            total: totalInvestingInflows,
          } as CashFlowSection,
          outflows: {
            title: 'Pengeluaran Kas untuk Aktivitas Investasi',
            items: investingOutflows,
            total: totalInvestingOutflows,
          } as CashFlowSection,
          net: netInvesting,
        },
        financingActivities: {
          inflows: {
            title: 'Penerimaan Kas dari Aktivitas Pendanaan',
            items: financingInflows,
            total: totalFinancingInflows,
          } as CashFlowSection,
          outflows: {
            title: 'Pengeluaran Kas untuk Aktivitas Pendanaan',
            items: financingOutflows,
            total: totalFinancingOutflows,
          } as CashFlowSection,
          net: netFinancing,
        },
        summary: {
          netCashChange,
          beginningBalance,
          endingBalance,
          cashAccounts: cashAccounts.map(a => ({
            kode: a.kode,
            nama: a.nama,
          })),
        },
        monthlyBreakdown: monthlyData.map((m, i) => ({
          ...m,
          monthName: monthNames[i],
        })),
        cashBySource: Object.entries(cashBySource).map(([source, amount]) => ({
          source,
          amount,
        })),
      },
    });
  } catch (error) {
    console.error('Arus kas report error:', error);
    return NextResponse.json(
      { error: 'Failed to generate cash flow statement' },
      { status: 500 }
    );
  }
}
