// src/app/units/kbtk/kelola/laporan/page.tsx
'use client';

import React from 'react';
import Link from 'next/link';
import {
  FileText,
  Users,
  Receipt,
  AlertCircle,
  TrendingUp,
  ClipboardCheck,
  ArrowRight,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface ReportCard {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  href: string;
  color: string;
  bgColor: string;
}

const reportCards: ReportCard[] = [
  {
    id: 'siswa-aktif',
    title: 'Daftar Siswa Aktif',
    description: 'Laporan daftar siswa yang aktif dengan informasi lengkap orang tua dan kelompok belajar',
    icon: Users,
    href: '/units/kbtk/kelola/laporan/siswa-aktif',
    color: 'text-blue-600',
    bgColor: 'bg-blue-100',
  },
  {
    id: 'rekap-spp',
    title: 'Rekap SPP per Bulan',
    description: 'Rekap tagihan dan pembayaran SPP bulanan dengan status pembayaran setiap siswa',
    icon: Receipt,
    href: '/units/kbtk/kelola/laporan/rekap-spp',
    color: 'text-green-600',
    bgColor: 'bg-green-100',
  },
  {
    id: 'tunggakan',
    title: 'Daftar Siswa Menunggak',
    description: 'Daftar siswa dengan tunggakan SPP beserta detail bulan dan nominal tunggakan',
    icon: AlertCircle,
    href: '/units/kbtk/kelola/laporan/tunggakan',
    color: 'text-red-600',
    bgColor: 'bg-red-100',
  },
  {
    id: 'pemasukan',
    title: 'Laporan Pemasukan',
    description: 'Laporan pemasukan dari pendaftaran dan SPP dalam periode tertentu',
    icon: TrendingUp,
    href: '/units/kbtk/kelola/laporan/pemasukan',
    color: 'text-purple-600',
    bgColor: 'bg-purple-100',
  },
  {
    id: 'pelunasan-pendaftaran',
    title: 'Status Pelunasan Pendaftaran',
    description: 'Status pelunasan biaya pendaftaran siswa dengan detail cicilan',
    icon: ClipboardCheck,
    href: '/units/kbtk/kelola/laporan/pelunasan-pendaftaran',
    color: 'text-orange-600',
    bgColor: 'bg-orange-100',
  },
];

export default function LaporanPage() {
  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="relative overflow-hidden bg-gradient-to-r from-white via-[#B2EBF2]/20 to-[#80DEEA]/20 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 py-6 rounded-b-3xl border-b border-[#00BCD4]/10">
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-gradient-to-br from-[#00BCD4]/20 to-[#80DEEA]/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-gradient-to-br from-[#80DEEA]/20 to-[#B2EBF2]/20 rounded-full blur-3xl" />
        <div className="relative">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-1 h-8 bg-gradient-to-b from-[#00BCD4] to-[#006064] rounded-full" />
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-[#B2EBF2]">
                <FileText className="h-6 w-6 text-[#006064]" />
              </div>
              <h1 className="text-3xl font-bold text-[#006064]">Laporan</h1>
            </div>
          </div>
          <p className="text-gray-600 ml-4">
            Pilih jenis laporan yang ingin Anda lihat atau cetak
          </p>
        </div>
      </div>

      {/* Report Cards Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {reportCards.map((report) => {
          const Icon = report.icon;
          return (
            <Link key={report.id} href={report.href}>
              <Card className="h-full group cursor-pointer border-2 border-gray-100 hover:border-[#00BCD4]/40 hover:shadow-xl transition-all duration-300 rounded-2xl overflow-hidden hover:-translate-y-1">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className={`p-4 rounded-2xl ${report.bgColor} transition-transform duration-300 group-hover:scale-110`}>
                      <Icon className={`h-7 w-7 ${report.color}`} />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 group-hover:text-[#006064] transition-colors">
                        {report.title}
                      </h3>
                      <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                        {report.description}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center justify-end mt-4 pt-4 border-t border-gray-100">
                    <span className="text-sm font-medium text-[#00BCD4] group-hover:text-[#006064] flex items-center gap-1 transition-all group-hover:gap-2">
                      Lihat Laporan
                      <ArrowRight className="h-4 w-4" />
                    </span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>

      {/* Info Box */}
      <Card className="border-2 border-[#00BCD4]/20 bg-gradient-to-r from-[#B2EBF2]/10 to-white rounded-2xl">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-xl bg-[#B2EBF2]">
              <FileText className="h-6 w-6 text-[#006064]" />
            </div>
            <div>
              <h3 className="font-semibold text-[#006064]">Petunjuk Penggunaan</h3>
              <ul className="text-sm text-gray-600 mt-2 space-y-1">
                <li>- Klik pada kartu laporan untuk melihat detail laporan</li>
                <li>- Setiap laporan memiliki filter untuk menyaring data</li>
                <li>- Gunakan tombol &quot;Cetak Laporan&quot; untuk mencetak atau menyimpan sebagai PDF</li>
                <li>- Laporan akan dicetak dalam format yang rapi dan siap pakai</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
