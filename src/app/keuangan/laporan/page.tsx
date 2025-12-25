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
      <div>
        <h1 className="text-2xl font-bold text-[#006064]">Laporan Keuangan</h1>
        <p className="text-sm text-gray-600 mt-1">Laporan keuangan sesuai PSAK 45 / ISAK 35</p>
      </div>

      {/* Report Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {reports.map((report) => (
          <Card
            key={report.href}
            className="hover:shadow-lg transition-all duration-300 border border-gray-200 hover:border-[#00BCD4]/30 cursor-pointer"
          >
            <CardHeader>
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center mb-3"
                style={{ backgroundColor: `${report.color}15` }}
              >
                <report.icon className="h-6 w-6" style={{ color: report.color }} />
              </div>
              <CardTitle className="text-lg text-[#006064]">{report.title}</CardTitle>
              <CardDescription>{report.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild variant="ghost" className="w-full justify-between text-[#00BCD4]">
                <Link href={report.href}>
                  Lihat Laporan
                  <ChevronRight className="h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
