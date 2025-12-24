'use client';

import React from 'react';
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
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { formatCurrency, formatCurrencyShort, formatDate } from '@/utils/keuangan';

// Temporary mock data - will be replaced with actual API calls
const mockDashboardData = {
  kasBank: 125500000,
  totalPendapatan: 2850000000,
  totalBeban: 2650000000,
  surplusDefisit: 200000000,
  pendapatanBulanIni: 285000000,
  bebanBulanIni: 245000000,
  realisasiProgram: 75,
  transaksiTerakhir: [
    {
      id: '1',
      code: 'TRX-202601-001',
      date: new Date('2026-01-15'),
      description: 'SPP KBTK Januari 2026',
      amount: 15000000,
      type: 'income' as const,
      unit: 'KBTK',
    },
    {
      id: '2',
      code: 'TRX-202601-002',
      date: new Date('2026-01-14'),
      description: 'Gaji Guru KBTK',
      amount: 13800000,
      type: 'expense' as const,
      unit: 'KBTK',
    },
    {
      id: '3',
      code: 'TRX-202601-003',
      date: new Date('2026-01-13'),
      description: 'Infaq Jumat ke-2',
      amount: 5200000,
      type: 'income' as const,
      unit: 'Ketakmiran',
    },
    {
      id: '4',
      code: 'TRX-202601-004',
      date: new Date('2026-01-12'),
      description: 'Listrik Masjid',
      amount: 5000000,
      type: 'expense' as const,
      unit: 'Ketakmiran',
    },
    {
      id: '5',
      code: 'TRX-202601-005',
      date: new Date('2026-01-11'),
      description: 'SPP Daycare Januari',
      amount: 28900000,
      type: 'income' as const,
      unit: 'Daycare',
    },
  ],
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
    <Card className="hover:shadow-lg transition-all duration-300 cursor-pointer border border-gray-200 hover:border-[#00BCD4]/30">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">{title}</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
            {trendValue && (
              <div className="flex items-center mt-2">
                {trend === 'up' && <TrendingUp className="h-4 w-4 text-green-500 mr-1" />}
                {trend === 'down' && <TrendingDown className="h-4 w-4 text-red-500 mr-1" />}
                <span
                  className={`text-sm ${
                    trend === 'up' ? 'text-green-600' : trend === 'down' ? 'text-red-600' : 'text-gray-600'
                  }`}
                >
                  {trendValue}
                </span>
              </div>
            )}
          </div>
          <div
            className="p-3 rounded-xl"
            style={{ backgroundColor: `${color}15` }}
          >
            <Icon className="h-6 w-6" style={{ color }} />
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
  const data = mockDashboardData;
  const isSurplus = data.surplusDefisit >= 0;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#006064]">Dashboard Keuangan</h1>
          <p className="text-sm text-gray-600 mt-1">Ringkasan keuangan Yayasan Al Muhajirin</p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            asChild
            className="bg-gradient-to-r from-[#00BCD4] to-[#006064] hover:from-[#006064] hover:to-[#00BCD4] text-white shadow-lg"
          >
            <Link href="/keuangan/transaksi/input">
              <Plus className="h-4 w-4 mr-2" />
              Input Transaksi
            </Link>
          </Button>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Kas & Bank"
          value={formatCurrency(data.kasBank)}
          icon={Wallet}
          color="#00BCD4"
        />
        <MetricCard
          title="Total Pendapatan"
          value={formatCurrencyShort(data.totalPendapatan)}
          icon={ArrowUpCircle}
          trend="up"
          trendValue="+12% dari tahun lalu"
          color="#4CAF50"
        />
        <MetricCard
          title="Total Beban"
          value={formatCurrencyShort(data.totalBeban)}
          icon={ArrowDownCircle}
          trend="up"
          trendValue="+8% dari tahun lalu"
          color="#FF9800"
        />
        <MetricCard
          title={isSurplus ? 'Surplus' : 'Defisit'}
          value={formatCurrency(Math.abs(data.surplusDefisit))}
          icon={isSurplus ? TrendingUp : TrendingDown}
          color={isSurplus ? '#4CAF50' : '#F44336'}
        />
      </div>

      {/* Quick Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border border-gray-200 hover:shadow-lg transition-all duration-300">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-green-500" />
              Pendapatan Bulan Ini
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-gray-900">{formatCurrency(data.pendapatanBulanIni)}</p>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-3">
              <div
                className="h-2 rounded-full bg-gradient-to-r from-green-400 to-green-600"
                style={{ width: '78%' }}
              />
            </div>
            <p className="text-xs text-gray-500 mt-2">78% dari target bulanan</p>
          </CardContent>
        </Card>

        <Card className="border border-gray-200 hover:shadow-lg transition-all duration-300">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
              <TrendingDown className="h-4 w-4 text-orange-500" />
              Beban Bulan Ini
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-gray-900">{formatCurrency(data.bebanBulanIni)}</p>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-3">
              <div
                className="h-2 rounded-full bg-gradient-to-r from-orange-400 to-orange-600"
                style={{ width: '92%' }}
              />
            </div>
            <p className="text-xs text-gray-500 mt-2">92% dari anggaran bulanan</p>
          </CardContent>
        </Card>

        <Card className="border border-gray-200 hover:shadow-lg transition-all duration-300">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
              <PieChart className="h-4 w-4 text-[#00BCD4]" />
              Realisasi Program
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-gray-900">{data.realisasiProgram}%</p>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-3">
              <div
                className="h-2 rounded-full bg-gradient-to-r from-[#00BCD4] to-[#006064]"
                style={{ width: `${data.realisasiProgram}%` }}
              />
            </div>
            <p className="text-xs text-gray-500 mt-2">dari total anggaran program</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Transactions */}
        <Card className="lg:col-span-2 border border-gray-200">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-lg text-[#006064] flex items-center gap-2">
                <FileText className="h-5 w-5 text-[#00BCD4]" />
                Transaksi Terbaru
              </CardTitle>
              <CardDescription>5 transaksi terakhir</CardDescription>
            </div>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/keuangan/transaksi" className="text-[#00BCD4]">
                Lihat Semua
                <ArrowRight className="h-4 w-4 ml-1" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {data.transaksiTerakhir.map((trx) => (
                <div
                  key={trx.id}
                  className="flex items-center justify-between p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`p-2 rounded-lg ${
                        trx.type === 'income' ? 'bg-green-100' : 'bg-orange-100'
                      }`}
                    >
                      {trx.type === 'income' ? (
                        <ArrowUpCircle className="h-4 w-4 text-green-600" />
                      ) : (
                        <ArrowDownCircle className="h-4 w-4 text-orange-600" />
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{trx.description}</p>
                      <p className="text-xs text-gray-500">
                        {formatDate(trx.date)} - {trx.unit}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p
                      className={`text-sm font-semibold ${
                        trx.type === 'income' ? 'text-green-600' : 'text-orange-600'
                      }`}
                    >
                      {trx.type === 'income' ? '+' : '-'}
                      {formatCurrency(trx.amount)}
                    </p>
                    <p className="text-xs text-gray-400">{trx.code}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="border border-gray-200">
          <CardHeader>
            <CardTitle className="text-lg text-[#006064] flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-[#00BCD4]" />
              Aksi Cepat
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button
              asChild
              variant="outline"
              className="w-full justify-start border-[#00BCD4]/30 hover:bg-[#00BCD4]/5 hover:border-[#00BCD4]"
            >
              <Link href="/keuangan/transaksi/input">
                <Plus className="h-4 w-4 mr-2 text-[#00BCD4]" />
                Input Transaksi Baru
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="w-full justify-start border-[#00BCD4]/30 hover:bg-[#00BCD4]/5 hover:border-[#00BCD4]"
            >
              <Link href="/keuangan/laporan/neraca">
                <PieChart className="h-4 w-4 mr-2 text-[#00BCD4]" />
                Lihat Neraca
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="w-full justify-start border-[#00BCD4]/30 hover:bg-[#00BCD4]/5 hover:border-[#00BCD4]"
            >
              <Link href="/keuangan/laporan/aktivitas">
                <TrendingUp className="h-4 w-4 mr-2 text-[#00BCD4]" />
                Laporan Aktivitas
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="w-full justify-start border-[#00BCD4]/30 hover:bg-[#00BCD4]/5 hover:border-[#00BCD4]"
            >
              <Link href="/keuangan/program">
                <Wallet className="h-4 w-4 mr-2 text-[#00BCD4]" />
                Daftar Program Kerja
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Unit Summary */}
      <Card className="border border-gray-200">
        <CardHeader>
          <CardTitle className="text-lg text-[#006064]">Ringkasan Per Bidang</CardTitle>
          <CardDescription>Realisasi anggaran per bidang</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { name: 'Kesekretariatan', realisasi: 72, color: '#00BCD4' },
              { name: 'Keagamaan', realisasi: 85, color: '#4CAF50' },
              { name: 'Sosial', realisasi: 68, color: '#FF9800' },
              { name: 'Kemanusiaan', realisasi: 45, color: '#9C27B0' },
            ].map((bidang) => (
              <div key={bidang.name} className="p-4 rounded-xl bg-gray-50">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">{bidang.name}</span>
                  <Badge
                    variant="outline"
                    style={{ borderColor: bidang.color, color: bidang.color }}
                  >
                    {bidang.realisasi}%
                  </Badge>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="h-2 rounded-full transition-all duration-500"
                    style={{
                      width: `${bidang.realisasi}%`,
                      backgroundColor: bidang.color,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
