// src/app/units/kbtk/kelola/page.tsx
'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Users,
  UserCheck,
  Baby,
  School,
  UserPlus,
  CreditCard,
  AlertCircle,
  TrendingUp,
  Calendar,
  ArrowRight,
  Loader2,
  GraduationCap,
  FileText,
  Clock,
  CheckCircle,
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface DashboardStats {
  totalSiswa: number;
  siswaAktif: number;
  siswaKB: number;
  siswaTK: number;
  pendaftaranBaru: number;
  totalTunggakan: number;
}

interface RecentActivity {
  id: string;
  type: 'pendaftaran' | 'pembayaran' | 'update';
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
  totalSiswa: 85,
  siswaAktif: 78,
  siswaKB: 25,
  siswaTK: 53,
  pendaftaranBaru: 12,
  totalTunggakan: 4500000,
};

const mockActivities: RecentActivity[] = [
  {
    id: '1',
    type: 'pendaftaran',
    title: 'Pendaftaran Siswa Baru',
    description: 'Ahmad Fauzan - KB',
    date: '2025-01-02',
    status: 'success',
  },
  {
    id: '2',
    type: 'pembayaran',
    title: 'Pembayaran SPP',
    description: 'Aisyah Putri - TK B - Januari 2025',
    date: '2025-01-02',
    status: 'success',
  },
  {
    id: '3',
    type: 'pendaftaran',
    title: 'Pendaftaran Siswa Baru',
    description: 'Muhammad Rizki - TK A',
    date: '2025-01-01',
    status: 'pending',
  },
  {
    id: '4',
    type: 'update',
    title: 'Update Data Siswa',
    description: 'Fatimah Azzahra - Alamat diperbarui',
    date: '2024-12-30',
    status: 'success',
  },
];

const mockPendingItems: PendingItem[] = [
  {
    id: '1',
    type: 'tunggakan',
    title: 'Siswa dengan tunggakan SPP',
    count: 8,
  },
  {
    id: '2',
    type: 'verifikasi',
    title: 'Pendaftaran perlu verifikasi',
    count: 3,
  },
  {
    id: '3',
    type: 'dokumen',
    title: 'Dokumen siswa belum lengkap',
    count: 5,
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
    case 'update':
      return FileText;
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

export default function KBTKKelolaDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [activities, setActivities] = useState<RecentActivity[]>([]);
  const [pendingItems, setPendingItems] = useState<PendingItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call - will be replaced with actual fetch
    async function fetchDashboard() {
      try {
        // In the future, this will fetch from /api/kbtk/stats
        // const response = await fetch('/api/kbtk/stats');
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
              Selamat datang di panel administrasi KBTK Al Muhajirin
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              asChild
              className="bg-gradient-to-r from-[#00BCD4] to-[#006064] hover:from-[#006064] hover:to-[#00BCD4] text-white shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl px-6 h-11 font-semibold"
            >
              <Link href="/units/kbtk/kelola/siswa/baru">
                <UserPlus className="h-5 w-5 mr-2" />
                Tambah Siswa Baru
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <StatsCard
          title="Total Siswa"
          value={stats.totalSiswa}
          icon={Users}
          color="#00BCD4"
          href="/units/kbtk/kelola/siswa"
        />
        <StatsCard
          title="Siswa Aktif"
          value={stats.siswaAktif}
          icon={UserCheck}
          color="#4CAF50"
          href="/units/kbtk/kelola/siswa?status=aktif"
        />
        <StatsCard
          title="KB"
          value={stats.siswaKB}
          icon={Baby}
          color="#FF9800"
          subtitle="Kelompok Bermain"
          href="/units/kbtk/kelola/siswa?jenjang=kb"
        />
        <StatsCard
          title="TK"
          value={stats.siswaTK}
          icon={School}
          color="#9C27B0"
          subtitle="Taman Kanak-Kanak"
          href="/units/kbtk/kelola/siswa?jenjang=tk"
        />
        <StatsCard
          title="Pendaftaran Baru"
          value={stats.pendaftaranBaru}
          icon={UserPlus}
          color="#2196F3"
          subtitle="Bulan ini"
          href="/units/kbtk/kelola/pendaftaran"
        />
        <StatsCard
          title="Tunggakan SPP"
          value={formatCurrency(stats.totalTunggakan)}
          icon={CreditCard}
          color="#F44336"
          href="/units/kbtk/kelola/pembayaran?status=tunggakan"
        />
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Button
          asChild
          variant="outline"
          className="h-auto p-6 border-2 border-[#00BCD4]/20 hover:bg-gradient-to-r hover:from-[#00BCD4]/10 hover:to-transparent hover:border-[#00BCD4]/50 rounded-2xl transition-all duration-300 justify-start"
        >
          <Link href="/units/kbtk/kelola/siswa/baru" className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-gradient-to-br from-[#00BCD4]/10 to-[#006064]/10">
              <UserPlus className="h-6 w-6 text-[#00BCD4]" />
            </div>
            <div className="text-left">
              <h3 className="font-semibold text-gray-900">Tambah Siswa Baru</h3>
              <p className="text-sm text-gray-500">Daftarkan siswa baru ke sistem</p>
            </div>
          </Link>
        </Button>

        <Button
          asChild
          variant="outline"
          className="h-auto p-6 border-2 border-[#00BCD4]/20 hover:bg-gradient-to-r hover:from-[#00BCD4]/10 hover:to-transparent hover:border-[#00BCD4]/50 rounded-2xl transition-all duration-300 justify-start"
        >
          <Link href="/units/kbtk/kelola/pembayaran/input" className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-gradient-to-br from-green-100 to-green-50">
              <CreditCard className="h-6 w-6 text-green-600" />
            </div>
            <div className="text-left">
              <h3 className="font-semibold text-gray-900">Input Pembayaran</h3>
              <p className="text-sm text-gray-500">Catat pembayaran SPP siswa</p>
            </div>
          </Link>
        </Button>

        <Button
          asChild
          variant="outline"
          className="h-auto p-6 border-2 border-[#00BCD4]/20 hover:bg-gradient-to-r hover:from-[#00BCD4]/10 hover:to-transparent hover:border-[#00BCD4]/50 rounded-2xl transition-all duration-300 justify-start"
        >
          <Link href="/units/kbtk/kelola/pembayaran?status=tunggakan" className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-gradient-to-br from-red-100 to-red-50">
              <AlertCircle className="h-6 w-6 text-red-600" />
            </div>
            <div className="text-left">
              <h3 className="font-semibold text-gray-900">Lihat Tunggakan</h3>
              <p className="text-sm text-gray-500">Daftar siswa dengan tunggakan</p>
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
              <Link href="/units/kbtk/kelola/aktivitas">
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

      {/* Statistics Summary */}
      <Card className="border-2 border-gray-100 rounded-2xl overflow-hidden hover:shadow-lg transition-all duration-300">
        <CardHeader className="bg-gradient-to-r from-[#B2EBF2]/20 to-transparent border-b border-[#00BCD4]/10">
          <div className="flex items-center gap-3">
            <div className="w-1 h-6 bg-gradient-to-b from-[#00BCD4] to-[#006064] rounded-full" />
            <div>
              <CardTitle className="text-lg text-[#006064]">
                Ringkasan Jenjang
              </CardTitle>
              <CardDescription>Distribusi siswa per jenjang pendidikan</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* KB Stats */}
            <div className="group p-6 rounded-2xl bg-gradient-to-br from-orange-50 to-white border-2 border-orange-100 hover:border-orange-200 hover:shadow-lg transition-all duration-300">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-xl bg-orange-100 group-hover:scale-110 transition-transform duration-300">
                    <Baby className="h-6 w-6 text-orange-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">Kelompok Bermain</h3>
                    <p className="text-xs text-gray-500">Usia 3-4 Tahun</p>
                  </div>
                </div>
              </div>
              <div className="text-3xl font-bold text-orange-600 mb-2">
                {stats.siswaKB} <span className="text-lg font-normal text-gray-400">siswa</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2.5">
                <div
                  className="h-2.5 rounded-full bg-gradient-to-r from-orange-400 to-orange-600 transition-all duration-700"
                  style={{ width: `${(stats.siswaKB / stats.totalSiswa) * 100}%` }}
                />
              </div>
              <p className="text-xs text-gray-500 mt-2">
                {Math.round((stats.siswaKB / stats.totalSiswa) * 100)}% dari total siswa
              </p>
            </div>

            {/* TK Stats */}
            <div className="group p-6 rounded-2xl bg-gradient-to-br from-purple-50 to-white border-2 border-purple-100 hover:border-purple-200 hover:shadow-lg transition-all duration-300">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-xl bg-purple-100 group-hover:scale-110 transition-transform duration-300">
                    <School className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">Taman Kanak-Kanak</h3>
                    <p className="text-xs text-gray-500">Usia 4-6 Tahun</p>
                  </div>
                </div>
              </div>
              <div className="text-3xl font-bold text-purple-600 mb-2">
                {stats.siswaTK} <span className="text-lg font-normal text-gray-400">siswa</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2.5">
                <div
                  className="h-2.5 rounded-full bg-gradient-to-r from-purple-400 to-purple-600 transition-all duration-700"
                  style={{ width: `${(stats.siswaTK / stats.totalSiswa) * 100}%` }}
                />
              </div>
              <p className="text-xs text-gray-500 mt-2">
                {Math.round((stats.siswaTK / stats.totalSiswa) * 100)}% dari total siswa
              </p>
            </div>

            {/* Overall Stats */}
            <div className="group p-6 rounded-2xl bg-gradient-to-br from-[#B2EBF2]/30 to-white border-2 border-[#00BCD4]/20 hover:border-[#00BCD4]/40 hover:shadow-lg transition-all duration-300">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-xl bg-[#B2EBF2] group-hover:scale-110 transition-transform duration-300">
                    <GraduationCap className="h-6 w-6 text-[#006064]" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">Total Keseluruhan</h3>
                    <p className="text-xs text-gray-500">Semua Jenjang</p>
                  </div>
                </div>
              </div>
              <div className="text-3xl font-bold text-[#006064] mb-2">
                {stats.totalSiswa} <span className="text-lg font-normal text-gray-400">siswa</span>
              </div>
              <div className="flex items-center gap-2 mt-4">
                <Badge className="bg-green-100 text-green-700 border-green-200 rounded-full">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  {stats.siswaAktif} Aktif
                </Badge>
                <Badge className="bg-gray-100 text-gray-600 border-gray-200 rounded-full">
                  {stats.totalSiswa - stats.siswaAktif} Non-aktif
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
