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
  const colorClasses: Record<string, { bg: string; text: string; header: string }> = {
    blue: { bg: 'bg-blue-50', text: 'text-blue-800', header: 'bg-blue-100' },
    purple: { bg: 'bg-purple-50', text: 'text-purple-800', header: 'bg-purple-100' },
    amber: { bg: 'bg-amber-50', text: 'text-amber-800', header: 'bg-amber-100' },
  };

  const c = colorClasses[color] || colorClasses.blue;

  return (
    <Card>
      <CardHeader className={`${c.header} border-b`}>
        <CardTitle className={c.text}>{title}</CardTitle>
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
        <div className={`flex justify-between items-center py-3 px-4 ${c.bg} rounded-lg font-bold ${c.text}`}>
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
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/keuangan/laporan">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-[#006064]">Laporan Arus Kas</h1>
            <p className="text-sm text-gray-600 mt-1">Statement of Cash Flows - PSAK 45 / ISAK 35</p>
          </div>
        </div>
        <div className="flex gap-2 print:hidden">
          <Button variant="outline" size="sm" onClick={handlePrint}>
            <Printer className="h-4 w-4 mr-2" />
            Cetak
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card className="print:hidden">
        <CardContent className="pt-4">
          <div className="flex gap-4 items-center">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-gray-500" />
              <span className="text-sm font-medium">Periode:</span>
            </div>
            <Select value={year.toString()} onValueChange={(v) => setYear(parseInt(v))}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="2024">2024</SelectItem>
                <SelectItem value="2025">2025</SelectItem>
                <SelectItem value="2026">2026</SelectItem>
              </SelectContent>
            </Select>
            <Select value={month} onValueChange={setMonth}>
              <SelectTrigger className="w-48">
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
          <Card className="bg-[#006064] text-white">
            <CardContent className="py-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <p className="text-sm text-white/80">Aktivitas Operasi</p>
                  <p className="text-lg font-bold tabular-nums">
                    {formatCurrency(data.operatingActivities.net)}
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-white/80">Aktivitas Investasi</p>
                  <p className="text-lg font-bold tabular-nums">
                    {formatCurrency(data.investingActivities.net)}
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-white/80">Aktivitas Pendanaan</p>
                  <p className="text-lg font-bold tabular-nums">
                    {formatCurrency(data.financingActivities.net)}
                  </p>
                </div>
                <div className="text-center border-l border-white/30 pl-4">
                  <p className="text-sm text-white/80">Total Perubahan Kas</p>
                  <p className="text-xl font-bold tabular-nums">
                    {formatCurrency(data.summary.netCashChange)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Monthly Breakdown Chart */}
          <Card>
            <CardHeader className="border-b">
              <CardTitle className="text-[#006064]">Arus Kas Bulanan</CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2 px-2">Bulan</th>
                      <th className="text-right py-2 px-2">Penerimaan</th>
                      <th className="text-right py-2 px-2">Pengeluaran</th>
                      <th className="text-right py-2 px-2">Arus Kas Bersih</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.monthlyBreakdown.map((m) => (
                      <tr key={m.month} className="border-b hover:bg-gray-50">
                        <td className="py-2 px-2 font-medium">{m.monthName}</td>
                        <td className="py-2 px-2 text-right tabular-nums text-green-600">
                          {formatCurrency(m.inflow)}
                        </td>
                        <td className="py-2 px-2 text-right tabular-nums text-red-600">
                          {formatCurrency(m.outflow)}
                        </td>
                        <td className={`py-2 px-2 text-right tabular-nums font-medium ${
                          isPositive(m.net) ? 'text-green-700' : 'text-red-700'
                        }`}>
                          {formatCurrency(m.net)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="bg-gray-100 font-bold">
                      <td className="py-2 px-2">TOTAL</td>
                      <td className="py-2 px-2 text-right tabular-nums text-green-700">
                        {formatCurrency(data.monthlyBreakdown.reduce((sum, m) => sum + m.inflow, 0))}
                      </td>
                      <td className="py-2 px-2 text-right tabular-nums text-red-700">
                        {formatCurrency(data.monthlyBreakdown.reduce((sum, m) => sum + m.outflow, 0))}
                      </td>
                      <td className={`py-2 px-2 text-right tabular-nums ${
                        isPositive(data.summary.netCashChange) ? 'text-green-700' : 'text-red-700'
                      }`}>
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
            <Card>
              <CardHeader className="border-b">
                <CardTitle className="text-[#006064]">Arus Kas per Unit</CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {data.cashBySource.map((source) => (
                    <div
                      key={source.source}
                      className={`p-3 rounded-lg ${
                        isPositive(source.amount) ? 'bg-green-50' : 'bg-red-50'
                      }`}
                    >
                      <p className="text-sm text-gray-600">{source.source}</p>
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
          <Card>
            <CardHeader className="border-b">
              <CardTitle className="text-[#006064]">Akun Kas & Setara Kas</CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {data.summary.cashAccounts.map((account) => (
                  <div key={account.kode} className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-xs text-gray-500">{account.kode}</p>
                    <p className="text-sm font-medium">{account.nama}</p>
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
