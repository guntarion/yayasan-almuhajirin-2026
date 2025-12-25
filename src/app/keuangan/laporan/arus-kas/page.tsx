'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Download, Printer, Calendar, ArrowUpCircle, ArrowDownCircle, Wallet } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

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

interface MonthlyData {
  month: number;
  monthName: string;
  inflow: number;
  outflow: number;
  net: number;
}

interface CashBySource {
  source: string;
  amount: number;
}

interface ArusKasData {
  period: {
    year: number;
    month: number | null;
    startDate: string;
    endDate: string;
    fiscalPeriodName: string;
  };
  operatingActivities: {
    inflows: CashFlowSection;
    outflows: CashFlowSection;
    net: number;
  };
  investingActivities: {
    inflows: CashFlowSection;
    outflows: CashFlowSection;
    net: number;
  };
  financingActivities: {
    inflows: CashFlowSection;
    outflows: CashFlowSection;
    net: number;
  };
  summary: {
    netCashChange: number;
    beginningBalance: number;
    endingBalance: number;
    cashAccounts: { kode: string; nama: string }[];
  };
  monthlyBreakdown: MonthlyData[];
  cashBySource: CashBySource[];
}

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

const months = [
  { value: 'all', label: 'Tahunan (Semua Bulan)' },
  { value: '1', label: 'Januari' },
  { value: '2', label: 'Februari' },
  { value: '3', label: 'Maret' },
  { value: '4', label: 'April' },
  { value: '5', label: 'Mei' },
  { value: '6', label: 'Juni' },
  { value: '7', label: 'Juli' },
  { value: '8', label: 'Agustus' },
  { value: '9', label: 'September' },
  { value: '10', label: 'Oktober' },
  { value: '11', label: 'November' },
  { value: '12', label: 'Desember' },
];

function CashFlowActivitySection({
  title,
  inflows,
  outflows,
  net,
  color,
}: {
  title: string;
  inflows: CashFlowSection;
  outflows: CashFlowSection;
  net: number;
  color: string;
}) {
  const colorClasses: Record<string, { bg: string; text: string; header: string; gradient: string }> = {
    blue: {
      bg: 'bg-blue-50',
      text: 'text-blue-800',
      header: 'bg-gradient-to-r from-blue-50 to-blue-100/50',
      gradient: 'from-blue-100/70 to-blue-50'
    },
    purple: {
      bg: 'bg-purple-50',
      text: 'text-purple-800',
      header: 'bg-gradient-to-r from-purple-50 to-purple-100/50',
      gradient: 'from-purple-100/70 to-purple-50'
    },
    amber: {
      bg: 'bg-amber-50',
      text: 'text-amber-800',
      header: 'bg-gradient-to-r from-amber-50 to-amber-100/50',
      gradient: 'from-amber-100/70 to-amber-50'
    },
  };

  const c = colorClasses[color] || colorClasses.blue;

  return (
    <Card className="border-2 border-gray-100 rounded-2xl">
      <CardHeader className={`${c.header} border-b`}>
        <CardTitle className={`${c.text} font-bold`}>{title}</CardTitle>
      </CardHeader>
      <CardContent className="pt-4 space-y-4">
        {/* Inflows */}
        {inflows.items.length > 0 && (
          <div>
            <h4 className="font-medium text-green-700 flex items-center gap-2 mb-2">
              <ArrowUpCircle className="h-4 w-4" />
              {inflows.title}
            </h4>
            <div className="space-y-1 pl-6">
              {inflows.items.map((item, idx) => (
                <div key={idx} className="flex justify-between items-center py-1">
                  <span className="text-sm text-gray-700">{item.nama}</span>
                  <span className="text-sm font-medium text-green-600 tabular-nums">
                    {formatCurrency(item.jumlah)}
                  </span>
                </div>
              ))}
              <div className="flex justify-between items-center py-2 border-t font-medium">
                <span className="text-green-700">Total Penerimaan</span>
                <span className="text-green-700 tabular-nums">{formatCurrency(inflows.total)}</span>
              </div>
            </div>
          </div>
        )}

        {/* Outflows */}
        {outflows.items.length > 0 && (
          <div>
            <h4 className="font-medium text-red-700 flex items-center gap-2 mb-2">
              <ArrowDownCircle className="h-4 w-4" />
              {outflows.title}
            </h4>
            <div className="space-y-1 pl-6">
              {outflows.items.map((item, idx) => (
                <div key={idx} className="flex justify-between items-center py-1">
                  <span className="text-sm text-gray-700">{item.nama}</span>
                  <span className="text-sm font-medium text-red-600 tabular-nums">
                    ({formatCurrency(item.jumlah)})
                  </span>
                </div>
              ))}
              <div className="flex justify-between items-center py-2 border-t font-medium">
                <span className="text-red-700">Total Pengeluaran</span>
                <span className="text-red-700 tabular-nums">({formatCurrency(outflows.total)})</span>
              </div>
            </div>
          </div>
        )}

        {/* Net */}
        <div className={`flex justify-between items-center py-3 px-4 bg-gradient-to-r ${c.gradient} rounded-xl font-bold ${c.text}`}>
          <span>Arus Kas Bersih {title}</span>
          <span className="tabular-nums">{formatCurrency(net)}</span>
        </div>
      </CardContent>
    </Card>
  );
}

export default function ArusKasPage() {
  const [year, setYear] = useState(2026);
  const [month, setMonth] = useState('all');
  const [data, setData] = useState<ArusKasData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const params = new URLSearchParams({ year: year.toString() });
        if (month && month !== 'all') params.append('month', month);

        const response = await fetch(`/api/keuangan/reports/arus-kas?${params}`);
        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.error || 'Failed to fetch data');
        }

        setData(result.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [year, month]);

  const handlePrint = () => {
    window.print();
  };

  const isPositive = (value: number) => value >= 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="relative overflow-hidden bg-gradient-to-r from-white via-[#B2EBF2]/20 to-[#80DEEA]/20 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 py-6 rounded-b-3xl border-b border-[#00BCD4]/10">
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-gradient-to-br from-[#00BCD4]/20 to-[#80DEEA]/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-12 -left-12 w-32 h-32 bg-gradient-to-tr from-[#B2EBF2]/30 to-[#00BCD4]/20 rounded-full blur-2xl" />
        <div className="relative z-10 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              asChild
              className="hover:bg-[#B2EBF2]/50 rounded-xl"
            >
              <Link href="/laporan">
                <ArrowLeft className="h-5 w-5" />
              </Link>
            </Button>
            <div>
              <div className="flex items-center gap-3 mb-1">
                <div className="w-1 h-6 bg-gradient-to-b from-[#00BCD4] to-[#006064] rounded-full" />
                <h1 className="text-2xl font-bold text-[#006064]">Laporan Arus Kas</h1>
              </div>
              <p className="text-sm text-gray-600 ml-4">Statement of Cash Flows - PSAK 45 / ISAK 35</p>
            </div>
          </div>
          <div className="flex gap-2 print:hidden">
            <Button
              variant="outline"
              size="sm"
              onClick={handlePrint}
              className="border-2 border-[#00BCD4]/30 hover:border-[#00BCD4] hover:bg-[#B2EBF2]/20 rounded-xl"
            >
              <Printer className="h-4 w-4 mr-2" />
              Cetak
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="border-2 border-[#00BCD4]/30 hover:border-[#00BCD4] hover:bg-[#B2EBF2]/20 rounded-xl"
            >
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>
      </div>

      {/* Filters */}
      <Card className="print:hidden border-2 border-[#00BCD4]/10 rounded-2xl">
        <CardContent className="pt-4">
          <div className="flex gap-4 items-center">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-[#00BCD4]" />
              <span className="text-sm font-semibold text-[#006064]">Periode:</span>
            </div>
            <Select value={year.toString()} onValueChange={(v) => setYear(parseInt(v))}>
              <SelectTrigger className="w-32 border-2 focus:border-[#00BCD4] rounded-xl">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="2024">2024</SelectItem>
                <SelectItem value="2025">2025</SelectItem>
                <SelectItem value="2026">2026</SelectItem>
              </SelectContent>
            </Select>
            <Select value={month} onValueChange={setMonth}>
              <SelectTrigger className="w-48 border-2 focus:border-[#00BCD4] rounded-xl">
                <SelectValue placeholder="Pilih Bulan" />
              </SelectTrigger>
              <SelectContent>
                {months.map((m) => (
                  <SelectItem key={m.value} value={m.value}>
                    {m.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#00BCD4]"></div>
        </div>
      )}

      {/* Error State */}
      {error && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-4">
            <div className="flex items-center gap-2 text-red-600">
              <span>{error}</span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Report Content */}
      {data && !loading && (
        <div className="space-y-6">
          {/* Report Header */}
          <div className="text-center border-b pb-4 print:border-b-2">
            <h2 className="text-xl font-bold">YAYASAN AL MUHAJIRIN REWWIN</h2>
            <h3 className="text-lg font-semibold text-gray-700">Laporan Arus Kas</h3>
            <p className="text-sm text-gray-600">
              Untuk Periode yang Berakhir {new Date(data.period.endDate).toLocaleDateString('id-ID', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })}
            </p>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="bg-gray-50">
              <CardContent className="pt-4">
                <div className="flex items-center gap-3">
                  <Wallet className="h-8 w-8 text-gray-600" />
                  <div>
                    <p className="text-sm text-gray-600">Saldo Awal</p>
                    <p className="text-xl font-bold text-gray-800">
                      {formatCurrency(data.summary.beginningBalance)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className={data.summary.netCashChange >= 0 ? 'bg-green-50' : 'bg-red-50'}>
              <CardContent className="pt-4">
                <div className="flex items-center gap-3">
                  {data.summary.netCashChange >= 0 ? (
                    <ArrowUpCircle className="h-8 w-8 text-green-600" />
                  ) : (
                    <ArrowDownCircle className="h-8 w-8 text-red-600" />
                  )}
                  <div>
                    <p className={`text-sm ${data.summary.netCashChange >= 0 ? 'text-green-700' : 'text-red-700'}`}>
                      Perubahan Kas Bersih
                    </p>
                    <p className={`text-xl font-bold ${data.summary.netCashChange >= 0 ? 'text-green-800' : 'text-red-800'}`}>
                      {formatCurrency(data.summary.netCashChange)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-[#00BCD4]/10">
              <CardContent className="pt-4">
                <div className="flex items-center gap-3">
                  <Wallet className="h-8 w-8 text-[#006064]" />
                  <div>
                    <p className="text-sm text-[#006064]">Saldo Akhir</p>
                    <p className="text-xl font-bold text-[#006064]">
                      {formatCurrency(data.summary.endingBalance)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Cash Flow Activities */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <CashFlowActivitySection
              title="Aktivitas Operasi"
              inflows={data.operatingActivities.inflows}
              outflows={data.operatingActivities.outflows}
              net={data.operatingActivities.net}
              color="blue"
            />
            <CashFlowActivitySection
              title="Aktivitas Investasi"
              inflows={data.investingActivities.inflows}
              outflows={data.investingActivities.outflows}
              net={data.investingActivities.net}
              color="purple"
            />
            <CashFlowActivitySection
              title="Aktivitas Pendanaan"
              inflows={data.financingActivities.inflows}
              outflows={data.financingActivities.outflows}
              net={data.financingActivities.net}
              color="amber"
            />
          </div>

          {/* Total Summary */}
          <Card className="bg-gradient-to-r from-[#006064] to-[#00838F] text-white border-2 border-[#006064] rounded-2xl">
            <CardContent className="py-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <p className="text-sm text-white/80 font-medium">Aktivitas Operasi</p>
                  <p className="text-lg font-bold tabular-nums">
                    {formatCurrency(data.operatingActivities.net)}
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-white/80 font-medium">Aktivitas Investasi</p>
                  <p className="text-lg font-bold tabular-nums">
                    {formatCurrency(data.investingActivities.net)}
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-white/80 font-medium">Aktivitas Pendanaan</p>
                  <p className="text-lg font-bold tabular-nums">
                    {formatCurrency(data.financingActivities.net)}
                  </p>
                </div>
                <div className="text-center border-l border-white/30 pl-4">
                  <p className="text-sm text-white/80 font-medium">Total Perubahan Kas</p>
                  <p className="text-xl font-bold tabular-nums">
                    {formatCurrency(data.summary.netCashChange)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Monthly Breakdown Chart */}
          <Card className="border-2 border-[#00BCD4]/10 rounded-2xl">
            <CardHeader className="bg-gradient-to-r from-[#00BCD4]/10 to-[#80DEEA]/10 border-b">
              <CardTitle className="text-[#006064] font-bold">Arus Kas Bulanan</CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gradient-to-r from-[#00BCD4]/10 to-[#80DEEA]/10">
                      <th className="text-left py-3 px-3 text-[#006064] font-semibold">Bulan</th>
                      <th className="text-right py-3 px-3 text-[#006064] font-semibold">Penerimaan</th>
                      <th className="text-right py-3 px-3 text-[#006064] font-semibold">Pengeluaran</th>
                      <th className="text-right py-3 px-3 text-[#006064] font-semibold">Arus Kas Bersih</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.monthlyBreakdown.map((m) => (
                      <tr key={m.month} className="border-b hover:bg-[#B2EBF2]/20 transition-colors">
                        <td className="py-3 px-3 font-medium">{m.monthName}</td>
                        <td className="py-3 px-3 text-right tabular-nums text-green-600">
                          {formatCurrency(m.inflow)}
                        </td>
                        <td className="py-3 px-3 text-right tabular-nums text-red-600">
                          {formatCurrency(m.outflow)}
                        </td>
                        <td className={`py-3 px-3 text-right tabular-nums font-medium ${
                          isPositive(m.net) ? 'text-green-700' : 'text-red-700'
                        }`}>
                          {formatCurrency(m.net)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="bg-gradient-to-r from-[#006064] to-[#00838F] text-white font-bold">
                      <td className="py-3 px-3">TOTAL</td>
                      <td className="py-3 px-3 text-right tabular-nums">
                        {formatCurrency(data.monthlyBreakdown.reduce((sum, m) => sum + m.inflow, 0))}
                      </td>
                      <td className="py-3 px-3 text-right tabular-nums">
                        {formatCurrency(data.monthlyBreakdown.reduce((sum, m) => sum + m.outflow, 0))}
                      </td>
                      <td className="py-3 px-3 text-right tabular-nums">
                        {formatCurrency(data.summary.netCashChange)}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Cash by Source */}
          {data.cashBySource.length > 0 && (
            <Card className="border-2 border-[#00BCD4]/10 rounded-2xl">
              <CardHeader className="bg-gradient-to-r from-[#00BCD4]/10 to-[#80DEEA]/10 border-b">
                <CardTitle className="text-[#006064] font-bold">Arus Kas per Unit</CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {data.cashBySource.map((source) => (
                    <div
                      key={source.source}
                      className={`p-4 rounded-xl border-2 ${
                        isPositive(source.amount)
                          ? 'bg-gradient-to-br from-green-50 to-green-100/50 border-green-200'
                          : 'bg-gradient-to-br from-red-50 to-red-100/50 border-red-200'
                      }`}
                    >
                      <p className="text-sm font-semibold text-gray-600 mb-1">{source.source}</p>
                      <p className={`text-lg font-bold tabular-nums ${
                        isPositive(source.amount) ? 'text-green-700' : 'text-red-700'
                      }`}>
                        {formatCurrency(source.amount)}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Cash Accounts */}
          <Card className="border-2 border-[#00BCD4]/10 rounded-2xl">
            <CardHeader className="bg-gradient-to-r from-[#00BCD4]/10 to-[#80DEEA]/10 border-b">
              <CardTitle className="text-[#006064] font-bold">Akun Kas & Setara Kas</CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {data.summary.cashAccounts.map((account) => (
                  <div key={account.kode} className="p-3 bg-gradient-to-br from-[#B2EBF2]/30 to-[#80DEEA]/20 rounded-xl border border-[#00BCD4]/20">
                    <p className="text-xs text-gray-500 font-semibold">{account.kode}</p>
                    <p className="text-sm font-medium text-[#006064]">{account.nama}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Footer Notes */}
          <div className="text-sm text-gray-500 border-t pt-4 print:mt-8">
            <p>Catatan: Laporan ini disusun dengan metode langsung (direct method) sesuai dengan PSAK 45 / ISAK 35.</p>
            <p className="mt-1">Dicetak pada: {new Date().toLocaleString('id-ID')}</p>
          </div>
        </div>
      )}
    </div>
  );
}
