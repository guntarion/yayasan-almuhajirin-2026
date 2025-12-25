'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Wallet,
  TrendingUp,
  TrendingDown,
  ArrowUpCircle,
  ArrowDownCircle,
  PieChart,
  BarChart3,
  FileText,
  Plus,
  ArrowRight,
  Loader2,
  Building2,
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { formatCurrency, formatCurrencyShort, formatDate } from '@/utils/keuangan';

interface DashboardData {
  fiscalPeriod: {
    year: number;
    name: string;
    isActive: boolean;
  };
  summary: {
    kasBank: number;
    totalPendapatan: number;
    totalBeban: number;
    surplusDefisit: number;
    pendapatanBulanIni: number;
    bebanBulanIni: number;
    realisasiProgram: number;
  };
  transaksiTerakhir: Array<{
    id: string;
    code: string;
    date: string;
    description: string;
    amount: number;
    type: 'income' | 'expense';
    unit: string;
    bidang: string;
  }>;
  ringkasanBidang: Array<{
    kode: string;
    nama: string;
    anggaran: number;
    realisasi: number;
    persenRealisasi: number;
    pendapatan: number;
    pengeluaran: number;
  }>;
  featuredUnitSummaries: Array<{
    kode: string;
    nama: string;
    anggaranPendapatan: number;
    anggaranPengeluaran: number;
    realisasiPendapatan: number;
    realisasiPengeluaran: number;
    saldo: number;
    persenRealisasi: number;
  }>;
}

const BIDANG_COLORS: Record<string, string> = {
  'SK': '#00BCD4',
  'AG': '#4CAF50',
  'SO': '#FF9800',
  'KM': '#9C27B0',
};

const UNIT_COLORS: Record<string, string> = {
  'TKM': '#4CAF50',
  'DCR': '#FF9800',
  'KBT': '#2196F3',
  'LAZ': '#9C27B0',
};

function MetricCard({
  title,
  value,
  icon: Icon,
  trend,
  trendValue,
  color,
  href,
}: {
  title: string;
  value: string;
  icon: React.ElementType;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
  color: string;
  href?: string;
}) {
  const content = (
    <Card className="group hover:shadow-xl transition-all duration-500 cursor-pointer border-2 border-gray-100 hover:border-[#00BCD4]/40 rounded-2xl overflow-hidden hover:-translate-y-1">
      <CardContent className="p-6 bg-gradient-to-br from-white via-white to-[#B2EBF2]/10">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500">{title}</p>
            <p className="text-2xl font-bold text-[#006064] mt-1">{value}</p>
            {trendValue && (
              <div className="flex items-center mt-2">
                {trend === 'up' && <TrendingUp className="h-4 w-4 text-green-500 mr-1" />}
                {trend === 'down' && <TrendingDown className="h-4 w-4 text-red-500 mr-1" />}
                <span
                  className={`text-sm font-medium ${
                    trend === 'up' ? 'text-green-600' : trend === 'down' ? 'text-red-600' : 'text-gray-600'
                  }`}
                >
                  {trendValue}
                </span>
              </div>
            )}
          </div>
          <div
            className="p-4 rounded-2xl transition-transform duration-300 group-hover:scale-110"
            style={{ backgroundColor: `${color}15` }}
          >
            <Icon className="h-7 w-7" style={{ color }} />
          </div>
        </div>
      </CardContent>
    </Card>
  );

  if (href) {
    return <Link href={href}>{content}</Link>;
  }
  return content;
}

export default function KeuanganDashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchDashboard() {
      try {
        const response = await fetch('/api/keuangan/dashboard?year=2026');
        if (!response.ok) {
          throw new Error('Failed to fetch dashboard data');
        }
        const result = await response.json();
        setData(result);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    }
    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-[#00BCD4] to-[#006064] rounded-full blur-md opacity-30 animate-pulse" />
            <Loader2 className="h-10 w-10 animate-spin text-[#00BCD4] relative" />
          </div>
          <p className="text-gray-600 font-medium">Memuat data dashboard...</p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Card className="border-2 border-red-100 bg-gradient-to-br from-red-50 to-white rounded-2xl p-8 text-center max-w-md">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-100 flex items-center justify-center">
            <Wallet className="h-8 w-8 text-red-500" />
          </div>
          <p className="text-red-600 mb-4 font-medium">{error || 'Data tidak tersedia'}</p>
          <Button
            onClick={() => window.location.reload()}
            className="bg-gradient-to-r from-[#00BCD4] to-[#006064] hover:from-[#006064] hover:to-[#00BCD4] text-white rounded-xl"
          >
            Coba Lagi
          </Button>
        </Card>
      </div>
    );
  }

  const isSurplus = data.summary.surplusDefisit >= 0;

  // Calculate target percentages
  const targetPendapatan = data.summary.totalPendapatan > 0
    ? Math.min(100, Math.round((data.summary.pendapatanBulanIni / (data.summary.totalPendapatan / 12)) * 100))
    : 0;
  const targetBeban = data.summary.totalBeban > 0
    ? Math.min(100, Math.round((data.summary.bebanBulanIni / (data.summary.totalBeban / 12)) * 100))
    : 0;

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="relative overflow-hidden bg-gradient-to-r from-white via-[#B2EBF2]/20 to-[#80DEEA]/20 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 py-6 rounded-b-3xl border-b border-[#00BCD4]/10">
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-gradient-to-br from-[#00BCD4]/20 to-[#80DEEA]/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-gradient-to-br from-[#80DEEA]/20 to-[#B2EBF2]/20 rounded-full blur-3xl" />
        <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-1 h-8 bg-gradient-to-b from-[#00BCD4] to-[#006064] rounded-full" />
              <h1 className="text-3xl font-bold text-[#006064]">Dashboard Keuangan</h1>
            </div>
            <p className="text-gray-600 ml-4">
              Ringkasan keuangan Yayasan Al Muhajirin - <span className="font-semibold text-[#00838F]">Tahun {data.fiscalPeriod.year}</span>
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              asChild
              className="bg-gradient-to-r from-[#00BCD4] to-[#006064] hover:from-[#006064] hover:to-[#00BCD4] text-white shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl px-6 h-11 font-semibold"
            >
              <Link href="/transaksi/input">
                <Plus className="h-5 w-5 mr-2" />
                Input Transaksi
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Kas & Bank"
          value={formatCurrency(data.summary.kasBank)}
          icon={Wallet}
          color="#00BCD4"
        />
        <MetricCard
          title="Total Pendapatan"
          value={formatCurrencyShort(data.summary.totalPendapatan)}
          icon={ArrowUpCircle}
          color="#4CAF50"
        />
        <MetricCard
          title="Total Beban"
          value={formatCurrencyShort(data.summary.totalBeban)}
          icon={ArrowDownCircle}
          color="#FF9800"
        />
        <MetricCard
          title={isSurplus ? 'Surplus' : 'Defisit'}
          value={formatCurrency(Math.abs(data.summary.surplusDefisit))}
          icon={isSurplus ? TrendingUp : TrendingDown}
          color={isSurplus ? '#4CAF50' : '#F44336'}
        />
      </div>

      {/* Quick Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="group border-2 border-gray-100 hover:border-green-200 hover:shadow-xl transition-all duration-500 rounded-2xl overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-green-100/50 to-transparent rounded-full -translate-y-1/2 translate-x-1/2" />
          <CardHeader className="pb-2 relative">
            <CardTitle className="text-sm font-semibold text-gray-600 flex items-center gap-2">
              <div className="p-2 rounded-lg bg-green-100 group-hover:scale-110 transition-transform duration-300">
                <TrendingUp className="h-4 w-4 text-green-600" />
              </div>
              Pendapatan Bulan Ini
            </CardTitle>
          </CardHeader>
          <CardContent className="relative">
            <p className="text-2xl font-bold text-green-700">{formatCurrency(data.summary.pendapatanBulanIni)}</p>
            <div className="w-full bg-gray-100 rounded-full h-2.5 mt-4">
              <div
                className="h-2.5 rounded-full bg-gradient-to-r from-green-400 to-green-600 transition-all duration-700"
                style={{ width: `${targetPendapatan}%` }}
              />
            </div>
            <p className="text-xs text-gray-500 mt-2 font-medium">{targetPendapatan}% dari target bulanan</p>
          </CardContent>
        </Card>

        <Card className="group border-2 border-gray-100 hover:border-orange-200 hover:shadow-xl transition-all duration-500 rounded-2xl overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-orange-100/50 to-transparent rounded-full -translate-y-1/2 translate-x-1/2" />
          <CardHeader className="pb-2 relative">
            <CardTitle className="text-sm font-semibold text-gray-600 flex items-center gap-2">
              <div className="p-2 rounded-lg bg-orange-100 group-hover:scale-110 transition-transform duration-300">
                <TrendingDown className="h-4 w-4 text-orange-600" />
              </div>
              Beban Bulan Ini
            </CardTitle>
          </CardHeader>
          <CardContent className="relative">
            <p className="text-2xl font-bold text-orange-700">{formatCurrency(data.summary.bebanBulanIni)}</p>
            <div className="w-full bg-gray-100 rounded-full h-2.5 mt-4">
              <div
                className="h-2.5 rounded-full bg-gradient-to-r from-orange-400 to-orange-600 transition-all duration-700"
                style={{ width: `${targetBeban}%` }}
              />
            </div>
            <p className="text-xs text-gray-500 mt-2 font-medium">{targetBeban}% dari anggaran bulanan</p>
          </CardContent>
        </Card>

        <Card className="group border-2 border-gray-100 hover:border-[#00BCD4]/40 hover:shadow-xl transition-all duration-500 rounded-2xl overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#80DEEA]/30 to-transparent rounded-full -translate-y-1/2 translate-x-1/2" />
          <CardHeader className="pb-2 relative">
            <CardTitle className="text-sm font-semibold text-gray-600 flex items-center gap-2">
              <div className="p-2 rounded-lg bg-[#B2EBF2] group-hover:scale-110 transition-transform duration-300">
                <PieChart className="h-4 w-4 text-[#006064]" />
              </div>
              Realisasi Program
            </CardTitle>
          </CardHeader>
          <CardContent className="relative">
            <p className="text-2xl font-bold text-[#006064]">{data.summary.realisasiProgram}%</p>
            <div className="w-full bg-gray-100 rounded-full h-2.5 mt-4">
              <div
                className="h-2.5 rounded-full bg-gradient-to-r from-[#00BCD4] to-[#006064] transition-all duration-700"
                style={{ width: `${data.summary.realisasiProgram}%` }}
              />
            </div>
            <p className="text-xs text-gray-500 mt-2 font-medium">dari total anggaran program</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Transactions */}
        <Card className="lg:col-span-2 border-2 border-gray-100 rounded-2xl overflow-hidden hover:shadow-lg transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between bg-gradient-to-r from-[#B2EBF2]/20 to-transparent border-b border-[#00BCD4]/10">
            <div>
              <CardTitle className="text-lg text-[#006064] flex items-center gap-2">
                <div className="p-2 rounded-lg bg-[#B2EBF2]">
                  <FileText className="h-5 w-5 text-[#006064]" />
                </div>
                Transaksi Terbaru
              </CardTitle>
              <CardDescription className="mt-1">5 transaksi terakhir</CardDescription>
            </div>
            <Button variant="ghost" size="sm" asChild className="text-[#00BCD4] hover:text-[#006064] hover:bg-[#B2EBF2]/50 rounded-xl">
              <Link href="/transaksi">
                Lihat Semua
                <ArrowRight className="h-4 w-4 ml-1" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent className="pt-4">
            {data.transaksiTerakhir.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                  <FileText className="h-8 w-8 text-gray-300" />
                </div>
                <p className="font-medium">Belum ada transaksi</p>
                <Button asChild variant="link" className="mt-2 text-[#00BCD4]">
                  <Link href="/transaksi/input">Input transaksi pertama</Link>
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                {data.transaksiTerakhir.map((trx) => (
                  <div
                    key={trx.id}
                    className="group flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-gray-50 to-white hover:from-[#B2EBF2]/20 hover:to-white border border-transparent hover:border-[#00BCD4]/20 transition-all duration-300"
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className={`p-3 rounded-xl transition-transform duration-300 group-hover:scale-110 ${
                          trx.type === 'income' ? 'bg-green-100' : 'bg-orange-100'
                        }`}
                      >
                        {trx.type === 'income' ? (
                          <ArrowUpCircle className="h-5 w-5 text-green-600" />
                        ) : (
                          <ArrowDownCircle className="h-5 w-5 text-orange-600" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{trx.description}</p>
                        <p className="text-sm text-gray-500">
                          {formatDate(new Date(trx.date))} - {trx.unit}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p
                        className={`font-bold ${
                          trx.type === 'income' ? 'text-green-600' : 'text-orange-600'
                        }`}
                      >
                        {trx.type === 'income' ? '+' : '-'}
                        {formatCurrency(trx.amount)}
                      </p>
                      <p className="text-xs text-gray-400 font-mono">{trx.code}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="border-2 border-gray-100 rounded-2xl overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-[#B2EBF2]/20 to-transparent border-b border-[#00BCD4]/10">
            <CardTitle className="text-lg text-[#006064] flex items-center gap-2">
              <div className="p-2 rounded-lg bg-[#B2EBF2]">
                <BarChart3 className="h-5 w-5 text-[#006064]" />
              </div>
              Aksi Cepat
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 pt-4">
            <Button
              asChild
              variant="outline"
              className="w-full justify-start border-2 border-[#00BCD4]/20 hover:bg-gradient-to-r hover:from-[#00BCD4]/10 hover:to-transparent hover:border-[#00BCD4]/50 rounded-xl h-12 transition-all duration-300"
            >
              <Link href="/transaksi/input">
                <Plus className="h-5 w-5 mr-3 text-[#00BCD4]" />
                <span className="font-medium">Input Transaksi Baru</span>
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="w-full justify-start border-2 border-[#00BCD4]/20 hover:bg-gradient-to-r hover:from-[#00BCD4]/10 hover:to-transparent hover:border-[#00BCD4]/50 rounded-xl h-12 transition-all duration-300"
            >
              <Link href="/laporan/neraca">
                <PieChart className="h-5 w-5 mr-3 text-[#00BCD4]" />
                <span className="font-medium">Lihat Neraca</span>
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="w-full justify-start border-2 border-[#00BCD4]/20 hover:bg-gradient-to-r hover:from-[#00BCD4]/10 hover:to-transparent hover:border-[#00BCD4]/50 rounded-xl h-12 transition-all duration-300"
            >
              <Link href="/laporan/aktivitas">
                <TrendingUp className="h-5 w-5 mr-3 text-[#00BCD4]" />
                <span className="font-medium">Laporan Aktivitas</span>
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="w-full justify-start border-2 border-[#00BCD4]/20 hover:bg-gradient-to-r hover:from-[#00BCD4]/10 hover:to-transparent hover:border-[#00BCD4]/50 rounded-xl h-12 transition-all duration-300"
            >
              <Link href="/program">
                <Wallet className="h-5 w-5 mr-3 text-[#00BCD4]" />
                <span className="font-medium">Daftar Program Kerja</span>
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Bidang Summary */}
      <Card className="border-2 border-gray-100 rounded-2xl overflow-hidden hover:shadow-lg transition-all duration-300">
        <CardHeader className="bg-gradient-to-r from-[#B2EBF2]/20 to-transparent border-b border-[#00BCD4]/10">
          <div className="flex items-center gap-3">
            <div className="w-1 h-6 bg-gradient-to-b from-[#00BCD4] to-[#006064] rounded-full" />
            <div>
              <CardTitle className="text-lg text-[#006064]">Ringkasan Per Bidang</CardTitle>
              <CardDescription>Realisasi anggaran per bidang</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {data.ringkasanBidang.map((bidang) => {
              const color = BIDANG_COLORS[bidang.kode] || '#00BCD4';
              return (
                <div key={bidang.kode} className="group p-5 rounded-2xl bg-gradient-to-br from-gray-50 to-white border-2 border-gray-100 hover:border-[#00BCD4]/30 hover:shadow-md transition-all duration-300">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-semibold text-gray-700">{bidang.nama}</span>
                    <Badge
                      className="rounded-full font-bold px-3"
                      style={{ backgroundColor: `${color}20`, color: color, borderColor: color }}
                    >
                      {bidang.persenRealisasi}%
                    </Badge>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2.5">
                    <div
                      className="h-2.5 rounded-full transition-all duration-700"
                      style={{
                        width: `${bidang.persenRealisasi}%`,
                        backgroundColor: color,
                      }}
                    />
                  </div>
                  <div className="mt-3 text-xs text-gray-500 font-medium">
                    Anggaran: <span className="text-gray-700">{formatCurrencyShort(bidang.anggaran)}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Featured Units Summary */}
      <Card className="border-2 border-gray-100 rounded-2xl overflow-hidden hover:shadow-lg transition-all duration-300">
        <CardHeader className="bg-gradient-to-r from-[#B2EBF2]/20 to-transparent border-b border-[#00BCD4]/10">
          <CardTitle className="text-lg text-[#006064] flex items-center gap-3">
            <div className="p-2 rounded-lg bg-[#B2EBF2]">
              <Building2 className="h-5 w-5 text-[#006064]" />
            </div>
            Posisi Keuangan Unit Unggulan
          </CardTitle>
          <CardDescription>Ringkasan anggaran dan realisasi unit kerja utama</CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {data.featuredUnitSummaries.map((unit) => {
              const color = UNIT_COLORS[unit.kode] || '#00BCD4';
              const isPositive = unit.saldo >= 0;
              return (
                <div
                  key={unit.kode}
                  className="group p-5 rounded-2xl border-2 border-gray-100 bg-gradient-to-br from-white to-gray-50/50 hover:shadow-lg hover:border-[#00BCD4]/30 transition-all duration-500 relative overflow-hidden"
                >
                  <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r" style={{ backgroundImage: `linear-gradient(to right, ${color}, ${color}80)` }} />
                  <div className="flex items-center justify-between mb-4 pt-1">
                    <h4 className="font-bold text-gray-900">{unit.nama}</h4>
                    <Badge
                      className={`rounded-full px-3 font-semibold ${isPositive ? 'bg-green-100 text-green-700 border-green-200' : 'bg-red-100 text-red-700 border-red-200'}`}
                    >
                      {isPositive ? 'Surplus' : 'Defisit'}
                    </Badge>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-2 rounded-lg bg-green-50/50">
                      <span className="text-xs text-gray-600 flex items-center gap-1.5 font-medium">
                        <ArrowUpCircle className="h-3.5 w-3.5 text-green-500" />
                        Pendapatan
                      </span>
                      <span className="text-sm font-bold text-green-600">
                        {formatCurrencyShort(unit.anggaranPendapatan)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center p-2 rounded-lg bg-orange-50/50">
                      <span className="text-xs text-gray-600 flex items-center gap-1.5 font-medium">
                        <ArrowDownCircle className="h-3.5 w-3.5 text-orange-500" />
                        Pengeluaran
                      </span>
                      <span className="text-sm font-bold text-orange-600">
                        {formatCurrencyShort(unit.anggaranPengeluaran)}
                      </span>
                    </div>
                    <div className="border-t-2 border-dashed border-gray-100 pt-3">
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-semibold text-gray-600">Saldo</span>
                        <span className={`text-base font-bold ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
                          {isPositive ? '+' : ''}{formatCurrencyShort(unit.saldo)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4">
                    <div className="flex justify-between text-xs text-gray-500 mb-1.5 font-medium">
                      <span>Realisasi</span>
                      <span className="font-bold" style={{ color }}>{unit.persenRealisasi}%</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2">
                      <div
                        className="h-2 rounded-full transition-all duration-700"
                        style={{
                          width: `${unit.persenRealisasi}%`,
                          backgroundColor: color,
                        }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
