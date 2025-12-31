// src/app/units/daycare/kelola/page.tsx
'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Users,
  Baby,
  Sun,
  Moon,
  Calendar,
  UserPlus,
  CreditCard,
  AlertCircle,
  ArrowRight,
  Loader2,
  Clock,
  CheckCircle,
  ClipboardList,
  Wallet,
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface DashboardStats {
  totalAnak: number;
  anakFullday: number;
  anakAfterSchool: number;
  anakHarian: number;
  pendaftaranBaru: number;
  totalTunggakan: number;
  pemasukanBulanIni: number;
}

interface RecentActivity {
  id: string;
  type: 'pendaftaran' | 'pembayaran' | 'kehadiran' | 'report';
  title: string;
  description: string;
  date: string;
  status?: 'success' | 'pending' | 'warning';
}

interface PendingItem {
  id: string;
  type: string;
  title: string;
  dueDate?: string;
  count?: number;
}

// Static data for now - will be replaced with API call
const mockStats: DashboardStats = {
  totalAnak: 45,
  anakFullday: 20,
  anakAfterSchool: 15,
  anakHarian: 10,
  pendaftaranBaru: 5,
  totalTunggakan: 3500000,
  pemasukanBulanIni: 25000000,
};

const mockActivities: RecentActivity[] = [
  {
    id: '1',
    type: 'pendaftaran',
    title: 'Pendaftaran Anak Baru',
    description: 'Zahra Putri - Program FULLDAY',
    date: '2025-01-02',
    status: 'success',
  },
  {
    id: '2',
    type: 'pembayaran',
    title: 'Pembayaran Bulanan',
    description: 'Ahmad Fauzan - Januari 2025',
    date: '2025-01-02',
    status: 'success',
  },
  {
    id: '3',
    type: 'kehadiran',
    title: 'Kehadiran Hari Ini',
    description: '38 anak hadir dari 45 terdaftar',
    date: '2025-01-02',
    status: 'success',
  },
  {
    id: '4',
    type: 'report',
    title: 'Daily Report Terkirim',
    description: '35 laporan harian terkirim ke orangtua',
    date: '2025-01-01',
    status: 'success',
  },
];

const mockPendingItems: PendingItem[] = [
  {
    id: '1',
    type: 'tunggakan',
    title: 'Tagihan belum dibayar',
    count: 6,
  },
  {
    id: '2',
    type: 'report',
    title: 'Daily report belum dibuat',
    count: 3,
  },
  {
    id: '3',
    type: 'kehadiran',
    title: 'Kehadiran belum dicatat',
    count: 2,
  },
];

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

function StatsCard({
  title,
  value,
  icon: Icon,
  color,
  href,
  subtitle,
}: {
  title: string;
  value: string | number;
  icon: React.ElementType;
  color: string;
  href?: string;
  subtitle?: string;
}) {
  const content = (
    <Card className="group hover:shadow-xl transition-all duration-500 cursor-pointer border-2 border-gray-100 hover:border-[#00BCD4]/40 rounded-2xl overflow-hidden hover:-translate-y-1">
      <CardContent className="p-6 bg-gradient-to-br from-white via-white to-[#B2EBF2]/10">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500">{title}</p>
            <p className="text-2xl font-bold text-[#006064] mt-1">{value}</p>
            {subtitle && (
              <p className="text-xs text-gray-400 mt-1">{subtitle}</p>
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

function getActivityIcon(type: string) {
  switch (type) {
    case 'pendaftaran':
      return UserPlus;
    case 'pembayaran':
      return CreditCard;
    case 'kehadiran':
      return Calendar;
    case 'report':
      return ClipboardList;
    default:
      return Clock;
  }
}

function getStatusBadge(status?: string) {
  switch (status) {
    case 'success':
      return (
        <Badge className="bg-green-100 text-green-700 border-green-200 rounded-full">
          <CheckCircle className="h-3 w-3 mr-1" />
          Selesai
        </Badge>
      );
    case 'pending':
      return (
        <Badge className="bg-yellow-100 text-yellow-700 border-yellow-200 rounded-full">
          <Clock className="h-3 w-3 mr-1" />
          Pending
        </Badge>
      );
    case 'warning':
      return (
        <Badge className="bg-red-100 text-red-700 border-red-200 rounded-full">
          <AlertCircle className="h-3 w-3 mr-1" />
          Perlu Tindakan
        </Badge>
      );
    default:
      return null;
  }
}

export default function DaycareKelolaDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [activities, setActivities] = useState<RecentActivity[]>([]);
  const [pendingItems, setPendingItems] = useState<PendingItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDashboard() {
      try {
        // In the future, this will fetch from /api/daycare/stats
        // const response = await fetch('/api/daycare/stats');
        // const data = await response.json();

        // Using mock data for now
        await new Promise((resolve) => setTimeout(resolve, 500)); // Simulate loading
        setStats(mockStats);
        setActivities(mockActivities);
        setPendingItems(mockPendingItems);
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
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

  if (!stats) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Card className="border-2 border-red-100 bg-gradient-to-br from-red-50 to-white rounded-2xl p-8 text-center max-w-md">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-100 flex items-center justify-center">
            <AlertCircle className="h-8 w-8 text-red-500" />
          </div>
          <p className="text-red-600 mb-4 font-medium">Data tidak tersedia</p>
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
              <h1 className="text-3xl font-bold text-[#006064]">Dashboard</h1>
            </div>
            <p className="text-gray-600 ml-4">
              Selamat datang di panel administrasi Daycare Al Muhajirin
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              asChild
              className="bg-gradient-to-r from-[#00BCD4] to-[#006064] hover:from-[#006064] hover:to-[#00BCD4] text-white shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl px-6 h-11 font-semibold"
            >
              <Link href="/units/daycare/kelola/pendaftaran/baru">
                <UserPlus className="h-5 w-5 mr-2" />
                Tambah Anak Baru
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        <StatsCard
          title="Total Anak Aktif"
          value={stats.totalAnak}
          icon={Users}
          color="#00BCD4"
          href="/units/daycare/kelola/data-anak"
        />
        <StatsCard
          title="Anak FULLDAY"
          value={stats.anakFullday}
          icon={Sun}
          color="#FF9800"
          subtitle="07:00 - 17:00 WIB"
          href="/units/daycare/kelola/data-anak?program=fullday"
        />
        <StatsCard
          title="Anak AFTER SCHOOL"
          value={stats.anakAfterSchool}
          icon={Moon}
          color="#9C27B0"
          subtitle="11:00 - 17:00 WIB"
          href="/units/daycare/kelola/data-anak?program=afterschool"
        />
        <StatsCard
          title="Anak HARIAN"
          value={stats.anakHarian}
          icon={Calendar}
          color="#4CAF50"
          subtitle="Per kedatangan"
          href="/units/daycare/kelola/data-anak?program=harian"
        />
      </div>

      {/* Financial Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <StatsCard
          title="Pendaftaran Baru"
          value={stats.pendaftaranBaru}
          icon={UserPlus}
          color="#2196F3"
          subtitle="Bulan ini"
          href="/units/daycare/kelola/pendaftaran"
        />
        <StatsCard
          title="Total Tunggakan"
          value={formatCurrency(stats.totalTunggakan)}
          icon={AlertCircle}
          color="#F44336"
          href="/units/daycare/kelola/tagihan-bulanan?status=tunggakan"
        />
        <StatsCard
          title="Pemasukan Bulan Ini"
          value={formatCurrency(stats.pemasukanBulanIni)}
          icon={Wallet}
          color="#4CAF50"
          href="/units/daycare/kelola/laporan"
        />
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Button
          asChild
          variant="outline"
          className="h-auto p-6 border-2 border-[#00BCD4]/20 hover:bg-gradient-to-r hover:from-[#00BCD4]/10 hover:to-transparent hover:border-[#00BCD4]/50 rounded-2xl transition-all duration-300 justify-start"
        >
          <Link href="/units/daycare/kelola/pendaftaran/baru" className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-gradient-to-br from-[#00BCD4]/10 to-[#006064]/10">
              <UserPlus className="h-6 w-6 text-[#00BCD4]" />
            </div>
            <div className="text-left">
              <h3 className="font-semibold text-gray-900">Daftar Anak Baru</h3>
              <p className="text-sm text-gray-500">Tambah pendaftaran</p>
            </div>
          </Link>
        </Button>

        <Button
          asChild
          variant="outline"
          className="h-auto p-6 border-2 border-[#00BCD4]/20 hover:bg-gradient-to-r hover:from-[#00BCD4]/10 hover:to-transparent hover:border-[#00BCD4]/50 rounded-2xl transition-all duration-300 justify-start"
        >
          <Link href="/units/daycare/kelola/kehadiran-harian" className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-gradient-to-br from-green-100 to-green-50">
              <Calendar className="h-6 w-6 text-green-600" />
            </div>
            <div className="text-left">
              <h3 className="font-semibold text-gray-900">Catat Kehadiran</h3>
              <p className="text-sm text-gray-500">Absensi harian</p>
            </div>
          </Link>
        </Button>

        <Button
          asChild
          variant="outline"
          className="h-auto p-6 border-2 border-[#00BCD4]/20 hover:bg-gradient-to-r hover:from-[#00BCD4]/10 hover:to-transparent hover:border-[#00BCD4]/50 rounded-2xl transition-all duration-300 justify-start"
        >
          <Link href="/units/daycare/kelola/daily-report" className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-gradient-to-br from-purple-100 to-purple-50">
              <ClipboardList className="h-6 w-6 text-purple-600" />
            </div>
            <div className="text-left">
              <h3 className="font-semibold text-gray-900">Daily Report</h3>
              <p className="text-sm text-gray-500">Buat laporan harian</p>
            </div>
          </Link>
        </Button>

        <Button
          asChild
          variant="outline"
          className="h-auto p-6 border-2 border-[#00BCD4]/20 hover:bg-gradient-to-r hover:from-[#00BCD4]/10 hover:to-transparent hover:border-[#00BCD4]/50 rounded-2xl transition-all duration-300 justify-start"
        >
          <Link href="/units/daycare/kelola/tagihan-bulanan?status=tunggakan" className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-gradient-to-br from-red-100 to-red-50">
              <AlertCircle className="h-6 w-6 text-red-600" />
            </div>
            <div className="text-left">
              <h3 className="font-semibold text-gray-900">Lihat Tunggakan</h3>
              <p className="text-sm text-gray-500">Tagihan belum lunas</p>
            </div>
          </Link>
        </Button>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activities */}
        <Card className="lg:col-span-2 border-2 border-gray-100 rounded-2xl overflow-hidden hover:shadow-lg transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between bg-gradient-to-r from-[#B2EBF2]/20 to-transparent border-b border-[#00BCD4]/10">
            <div>
              <CardTitle className="text-lg text-[#006064] flex items-center gap-2">
                <div className="p-2 rounded-lg bg-[#B2EBF2]">
                  <Clock className="h-5 w-5 text-[#006064]" />
                </div>
                Aktivitas Terbaru
              </CardTitle>
              <CardDescription className="mt-1">
                Aktivitas terkini di sistem
              </CardDescription>
            </div>
            <Button
              variant="ghost"
              size="sm"
              asChild
              className="text-[#00BCD4] hover:text-[#006064] hover:bg-[#B2EBF2]/50 rounded-xl"
            >
              <Link href="/units/daycare/kelola/aktivitas">
                Lihat Semua
                <ArrowRight className="h-4 w-4 ml-1" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent className="pt-4">
            {activities.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                  <Clock className="h-8 w-8 text-gray-300" />
                </div>
                <p className="font-medium">Belum ada aktivitas</p>
              </div>
            ) : (
              <div className="space-y-3">
                {activities.map((activity) => {
                  const Icon = getActivityIcon(activity.type);
                  return (
                    <div
                      key={activity.id}
                      className="group flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-gray-50 to-white hover:from-[#B2EBF2]/20 hover:to-white border border-transparent hover:border-[#00BCD4]/20 transition-all duration-300"
                    >
                      <div className="flex items-center gap-4">
                        <div className="p-3 rounded-xl bg-[#B2EBF2]/50 transition-transform duration-300 group-hover:scale-110">
                          <Icon className="h-5 w-5 text-[#006064]" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">
                            {activity.title}
                          </p>
                          <p className="text-sm text-gray-500">
                            {activity.description}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        {getStatusBadge(activity.status)}
                        <p className="text-xs text-gray-400 mt-1">
                          {formatDate(activity.date)}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Pending Items */}
        <Card className="border-2 border-gray-100 rounded-2xl overflow-hidden hover:shadow-lg transition-all duration-300">
          <CardHeader className="bg-gradient-to-r from-[#B2EBF2]/20 to-transparent border-b border-[#00BCD4]/10">
            <CardTitle className="text-lg text-[#006064] flex items-center gap-2">
              <div className="p-2 rounded-lg bg-yellow-100">
                <AlertCircle className="h-5 w-5 text-yellow-600" />
              </div>
              Perlu Perhatian
            </CardTitle>
            <CardDescription>Item yang memerlukan tindakan</CardDescription>
          </CardHeader>
          <CardContent className="pt-4 space-y-3">
            {pendingItems.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-green-100 flex items-center justify-center">
                  <CheckCircle className="h-6 w-6 text-green-500" />
                </div>
                <p className="font-medium text-sm">Semua sudah ditangani!</p>
              </div>
            ) : (
              pendingItems.map((item) => (
                <div
                  key={item.id}
                  className="group p-4 rounded-xl border-2 border-gray-100 hover:border-yellow-200 bg-gradient-to-r from-yellow-50/50 to-white hover:shadow-md transition-all duration-300 cursor-pointer"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900 text-sm">
                        {item.title}
                      </p>
                      {item.dueDate && (
                        <p className="text-xs text-gray-500 mt-1">
                          <Calendar className="h-3 w-3 inline mr-1" />
                          {formatDate(item.dueDate)}
                        </p>
                      )}
                    </div>
                    {item.count !== undefined && (
                      <Badge className="bg-yellow-100 text-yellow-700 border-yellow-200 rounded-full font-bold px-3">
                        {item.count}
                      </Badge>
                    )}
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>

      {/* Program Distribution */}
      <Card className="border-2 border-gray-100 rounded-2xl overflow-hidden hover:shadow-lg transition-all duration-300">
        <CardHeader className="bg-gradient-to-r from-[#B2EBF2]/20 to-transparent border-b border-[#00BCD4]/10">
          <div className="flex items-center gap-3">
            <div className="w-1 h-6 bg-gradient-to-b from-[#00BCD4] to-[#006064] rounded-full" />
            <div>
              <CardTitle className="text-lg text-[#006064]">
                Ringkasan Program
              </CardTitle>
              <CardDescription>Distribusi anak per program layanan</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* FULLDAY Stats */}
            <div className="group p-6 rounded-2xl bg-gradient-to-br from-orange-50 to-white border-2 border-orange-100 hover:border-orange-200 hover:shadow-lg transition-all duration-300">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-xl bg-orange-100 group-hover:scale-110 transition-transform duration-300">
                    <Sun className="h-6 w-6 text-orange-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">FULLDAY</h3>
                    <p className="text-xs text-gray-500">07:00 - 17:00 WIB</p>
                  </div>
                </div>
              </div>
              <div className="text-3xl font-bold text-orange-600 mb-2">
                {stats.anakFullday} <span className="text-lg font-normal text-gray-400">anak</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2.5">
                <div
                  className="h-2.5 rounded-full bg-gradient-to-r from-orange-400 to-orange-600 transition-all duration-700"
                  style={{ width: `${(stats.anakFullday / stats.totalAnak) * 100}%` }}
                />
              </div>
              <p className="text-xs text-gray-500 mt-2">
                {Math.round((stats.anakFullday / stats.totalAnak) * 100)}% dari total anak
              </p>
            </div>

            {/* AFTER SCHOOL Stats */}
            <div className="group p-6 rounded-2xl bg-gradient-to-br from-purple-50 to-white border-2 border-purple-100 hover:border-purple-200 hover:shadow-lg transition-all duration-300">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-xl bg-purple-100 group-hover:scale-110 transition-transform duration-300">
                    <Moon className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">AFTER SCHOOL</h3>
                    <p className="text-xs text-gray-500">11:00 - 17:00 WIB</p>
                  </div>
                </div>
              </div>
              <div className="text-3xl font-bold text-purple-600 mb-2">
                {stats.anakAfterSchool} <span className="text-lg font-normal text-gray-400">anak</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2.5">
                <div
                  className="h-2.5 rounded-full bg-gradient-to-r from-purple-400 to-purple-600 transition-all duration-700"
                  style={{ width: `${(stats.anakAfterSchool / stats.totalAnak) * 100}%` }}
                />
              </div>
              <p className="text-xs text-gray-500 mt-2">
                {Math.round((stats.anakAfterSchool / stats.totalAnak) * 100)}% dari total anak
              </p>
            </div>

            {/* HARIAN Stats */}
            <div className="group p-6 rounded-2xl bg-gradient-to-br from-green-50 to-white border-2 border-green-100 hover:border-green-200 hover:shadow-lg transition-all duration-300">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-xl bg-green-100 group-hover:scale-110 transition-transform duration-300">
                    <Calendar className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">HARIAN</h3>
                    <p className="text-xs text-gray-500">Per kedatangan</p>
                  </div>
                </div>
              </div>
              <div className="text-3xl font-bold text-green-600 mb-2">
                {stats.anakHarian} <span className="text-lg font-normal text-gray-400">anak</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2.5">
                <div
                  className="h-2.5 rounded-full bg-gradient-to-r from-green-400 to-green-600 transition-all duration-700"
                  style={{ width: `${(stats.anakHarian / stats.totalAnak) * 100}%` }}
                />
              </div>
              <p className="text-xs text-gray-500 mt-2">
                {Math.round((stats.anakHarian / stats.totalAnak) * 100)}% dari total anak
              </p>
            </div>
          </div>

          {/* Total Summary */}
          <div className="mt-6 p-4 rounded-2xl bg-gradient-to-r from-[#006064] to-[#00838F] text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-white/10">
                  <Baby className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="font-bold">Total Keseluruhan</h3>
                  <p className="text-xs text-white/70">Semua program layanan</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-3xl font-bold">{stats.totalAnak}</p>
                <p className="text-xs text-white/70">anak terdaftar</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
