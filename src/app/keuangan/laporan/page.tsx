'use client';

import React from 'react';
import Link from 'next/link';
import { PieChart, TrendingUp, ArrowDownCircle, ChevronRight } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const reports = [
  {
    title: 'Laporan Neraca',
    description: 'Posisi keuangan: aset, kewajiban, dan aset bersih',
    icon: PieChart,
    href: '/laporan/neraca',
    color: '#00BCD4',
  },
  {
    title: 'Laporan Aktivitas',
    description: 'Pendapatan, beban, dan perubahan aset bersih',
    icon: TrendingUp,
    href: '/laporan/aktivitas',
    color: '#4CAF50',
  },
  {
    title: 'Laporan Arus Kas',
    description: 'Aliran kas masuk dan keluar',
    icon: ArrowDownCircle,
    href: '/laporan/arus-kas',
    color: '#FF9800',
  },
];

export default function LaporanPage() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="relative overflow-hidden bg-gradient-to-r from-white via-[#B2EBF2]/20 to-[#80DEEA]/20 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 py-6 rounded-b-3xl border-b border-[#00BCD4]/10">
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-gradient-to-br from-[#00BCD4]/20 to-[#80DEEA]/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-12 -left-12 w-32 h-32 bg-gradient-to-tr from-[#B2EBF2]/30 to-[#00BCD4]/20 rounded-full blur-2xl" />
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-1 h-8 bg-gradient-to-b from-[#00BCD4] to-[#006064] rounded-full" />
            <h1 className="text-3xl font-bold text-[#006064]">Laporan Keuangan</h1>
          </div>
          <p className="text-sm text-gray-600 ml-4">Laporan keuangan sesuai PSAK 45 / ISAK 35</p>
        </div>
      </div>

      {/* Report Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {reports.map((report) => (
          <Card
            key={report.href}
            className="group border-2 border-gray-100 rounded-2xl hover:shadow-xl hover:border-[#00BCD4]/40 transition-all duration-500 overflow-hidden"
          >
            <CardHeader>
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4 bg-gradient-to-br from-[#B2EBF2] to-[#80DEEA]/50 group-hover:scale-110 transition-transform duration-300"
              >
                <report.icon className="h-7 w-7 text-[#006064]" />
              </div>
              <CardTitle className="text-xl font-bold text-[#006064]">{report.title}</CardTitle>
              <CardDescription className="text-gray-600">{report.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                asChild
                variant="ghost"
                className="w-full justify-between text-[#00BCD4] hover:text-[#006064] hover:bg-[#B2EBF2]/50 rounded-xl h-12 font-semibold"
              >
                <Link href={report.href}>
                  Lihat Laporan
                  <ChevronRight className="h-5 w-5" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
