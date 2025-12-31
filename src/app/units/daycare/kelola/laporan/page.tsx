// src/app/units/daycare/kelola/laporan/page.tsx
'use client';

import React from 'react';
import Link from 'next/link';
import {
  Users,
  AlertCircle,
  Wallet,
  Calendar,
  FileText,
  ArrowRight,
  BarChart3,
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface ReportCardProps {
  title: string;
  description: string;
  icon: React.ElementType;
  href: string;
  color: string;
  bgColor: string;
}

function ReportCard({
  title,
  description,
  icon: Icon,
  href,
  color,
  bgColor,
}: ReportCardProps) {
  return (
    <Link href={href}>
      <Card className="group h-full border-2 border-gray-100 hover:border-[#00BCD4]/40 rounded-2xl overflow-hidden hover:-translate-y-1 hover:shadow-xl transition-all duration-500 cursor-pointer">
        <CardContent className="p-6 bg-gradient-to-br from-white via-white to-[#B2EBF2]/10">
          <div className="flex items-start justify-between mb-4">
            <div
              className="p-4 rounded-2xl transition-transform duration-300 group-hover:scale-110"
              style={{ backgroundColor: bgColor }}
            >
              <Icon className="h-7 w-7" style={{ color }} />
            </div>
            <ArrowRight
              className="h-5 w-5 text-gray-300 group-hover:text-[#00BCD4] transition-all duration-300 group-hover:translate-x-1"
            />
          </div>
          <h3 className="text-lg font-bold text-[#006064] mb-2 group-hover:text-[#00BCD4] transition-colors duration-300">
            {title}
          </h3>
          <p className="text-sm text-gray-600">{description}</p>
        </CardContent>
      </Card>
    </Link>
  );
}

export default function LaporanDashboardPage() {
  const reports: ReportCardProps[] = [
    {
      title: 'Daftar Anak Aktif',
      description: 'Lihat daftar anak yang aktif berdasarkan paket layanan. Cocok untuk rekap data anak.',
      icon: Users,
      href: '/units/daycare/kelola/laporan/anak-aktif',
      color: '#00BCD4',
      bgColor: '#E0F7FA',
    },
    {
      title: 'Daftar Tunggakan',
      description: 'Lihat daftar anak yang memiliki tunggakan pembayaran. Lengkap dengan kontak orang tua untuk reminder.',
      icon: AlertCircle,
      href: '/units/daycare/kelola/laporan/tunggakan',
      color: '#F44336',
      bgColor: '#FFEBEE',
    },
    {
      title: 'Laporan Pemasukan',
      description: 'Rekap pemasukan dari pembayaran pendaftaran, bulanan, dan harian dalam periode tertentu.',
      icon: Wallet,
      href: '/units/daycare/kelola/laporan/pemasukan',
      color: '#4CAF50',
      bgColor: '#E8F5E9',
    },
    {
      title: 'Rekap Kehadiran',
      description: 'Rekap kehadiran anak dengan paket HARIAN per bulan. Berguna untuk evaluasi dan billing.',
      icon: Calendar,
      href: '/units/daycare/kelola/laporan/rekap-kehadiran',
      color: '#FF9800',
      bgColor: '#FFF3E0',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="relative overflow-hidden bg-gradient-to-r from-white via-[#B2EBF2]/20 to-[#80DEEA]/20 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 py-6 rounded-b-3xl border-b border-[#00BCD4]/10">
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-gradient-to-br from-[#00BCD4]/20 to-[#80DEEA]/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-gradient-to-br from-[#80DEEA]/20 to-[#B2EBF2]/20 rounded-full blur-3xl" />
        <div className="relative">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-1 h-8 bg-gradient-to-b from-[#00BCD4] to-[#006064] rounded-full" />
            <h1 className="text-3xl font-bold text-[#006064]">Laporan</h1>
          </div>
          <p className="text-gray-600 ml-4">
            Akses berbagai laporan untuk analisis dan evaluasi Daycare Al Muhajirin
          </p>
        </div>
      </div>

      {/* Quick Stats Info */}
      <Card className="border-2 border-[#00BCD4]/20 rounded-2xl overflow-hidden bg-gradient-to-r from-[#E0F7FA] to-white">
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-4 rounded-2xl bg-white shadow-sm">
              <BarChart3 className="h-8 w-8 text-[#006064]" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-[#006064]">
                Pusat Laporan Daycare
              </h2>
              <p className="text-gray-600">
                Pilih jenis laporan yang ingin Anda lihat. Setiap laporan dapat dicetak atau diunduh.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Report Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {reports.map((report) => (
          <ReportCard key={report.href} {...report} />
        ))}
      </div>

      {/* Additional Info */}
      <Card className="border-2 border-gray-100 rounded-2xl">
        <CardHeader className="bg-gradient-to-r from-[#B2EBF2]/20 to-transparent border-b border-[#00BCD4]/10">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-[#B2EBF2]">
              <FileText className="h-5 w-5 text-[#006064]" />
            </div>
            <div>
              <CardTitle className="text-lg text-[#006064]">
                Tips Penggunaan Laporan
              </CardTitle>
              <CardDescription>
                Beberapa tips untuk memaksimalkan penggunaan fitur laporan
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-gray-50 border border-gray-100">
              <h4 className="font-semibold text-gray-900 mb-2">Filter Data</h4>
              <p className="text-sm text-gray-600">
                Gunakan filter yang tersedia untuk mempersempit data sesuai kebutuhan Anda.
              </p>
            </div>
            <div className="p-4 rounded-xl bg-gray-50 border border-gray-100">
              <h4 className="font-semibold text-gray-900 mb-2">Cetak Laporan</h4>
              <p className="text-sm text-gray-600">
                Klik tombol &quot;Cetak Laporan&quot; untuk mencetak atau menyimpan sebagai PDF.
              </p>
            </div>
            <div className="p-4 rounded-xl bg-gray-50 border border-gray-100">
              <h4 className="font-semibold text-gray-900 mb-2">WhatsApp Reminder</h4>
              <p className="text-sm text-gray-600">
                Pada laporan tunggakan, Anda dapat langsung mengirim reminder via WhatsApp.
              </p>
            </div>
            <div className="p-4 rounded-xl bg-gray-50 border border-gray-100">
              <h4 className="font-semibold text-gray-900 mb-2">Data Real-time</h4>
              <p className="text-sm text-gray-600">
                Semua laporan menampilkan data terbaru dari sistem secara real-time.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
