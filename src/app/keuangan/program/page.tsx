'use client';

import React from 'react';
import { Search, Filter, ChevronRight } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { formatCurrency, calculateRealisasiProgress } from '@/utils/keuangan';

// Mock data - will be replaced with API calls
const mockPrograms = [
  {
    id: '1',
    kode: 'SK-SEK-OT-2026-001',
    nama: 'ATK & Perlengkapan Kantor',
    bidang: 'Kesekretariatan',
    unit: 'Sekretariat',
    jenis: 'pengeluaran',
    budget: 6000000,
    realisasi: 4500000,
    status: 'aktif',
  },
  {
    id: '2',
    kode: 'AG-TKM-OT-2026-003',
    nama: 'Gaji Marbot dan Muadzin',
    bidang: 'Keagamaan',
    unit: 'Ketakmiran',
    jenis: 'pengeluaran',
    budget: 48000000,
    realisasi: 40000000,
    status: 'aktif',
  },
  {
    id: '3',
    kode: 'SO-KBT-IN-2026-001',
    nama: 'SPP KBTK',
    bidang: 'Sosial',
    unit: 'KBTK',
    jenis: 'pendapatan',
    budget: 600000000,
    realisasi: 480000000,
    status: 'aktif',
  },
  {
    id: '4',
    kode: 'KM-LAZ-IN-2026-001',
    nama: 'Zakat Maal LAZ',
    bidang: 'Kemanusiaan',
    unit: 'LAZ Muhajirin',
    jenis: 'pendapatan',
    budget: 35000000,
    realisasi: 35000000,
    status: 'selesai',
  },
];

export default function ProgramPage() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#006064]">Program Kerja</h1>
          <p className="text-sm text-gray-600 mt-1">Daftar program kerja tahun 2026</p>
        </div>
      </div>

      {/* Filter Section */}
      <Card className="border-2" style={{ borderColor: 'rgba(0, 188, 212, 0.1)' }}>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Filter className="h-5 w-5 text-[#00BCD4]" />
            Filter & Pencarian
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Cari program..."
                className="pl-10 border-2 focus:border-[#00BCD4] rounded-xl"
              />
            </div>
            <Button variant="outline" className="border-[#00BCD4] text-[#006064]">
              Semua Bidang
            </Button>
            <Button variant="outline" className="border-[#00BCD4] text-[#006064]">
              Semua Jenis
            </Button>
            <Button variant="outline" className="border-[#00BCD4] text-[#006064]">
              Semua Status
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Programs List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {mockPrograms.map((program) => {
          const progress = calculateRealisasiProgress(program.realisasi, program.budget);
          const isPendapatan = program.jenis === 'pendapatan';

          return (
            <Card
              key={program.id}
              className="hover:shadow-lg transition-all duration-300 border border-gray-200 hover:border-[#00BCD4]/30"
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-base text-[#006064]">{program.nama}</CardTitle>
                    <CardDescription className="text-xs mt-1">
                      {program.kode}
                    </CardDescription>
                  </div>
                  <Badge
                    className={`${
                      program.status === 'aktif'
                        ? 'bg-green-100 text-green-700'
                        : program.status === 'selesai'
                        ? 'bg-blue-100 text-blue-700'
                        : 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    {program.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Badge variant="outline">{program.bidang}</Badge>
                  <span>-</span>
                  <span>{program.unit}</span>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Realisasi</span>
                    <span className="font-medium">{progress}%</span>
                  </div>
                  <Progress
                    value={progress}
                    className="h-2"
                    style={
                      {
                        '--progress-color': isPendapatan ? '#4CAF50' : '#FF9800',
                      } as React.CSSProperties
                    }
                  />
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>{formatCurrency(program.realisasi)}</span>
                    <span>dari {formatCurrency(program.budget)}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                  <Badge
                    variant="outline"
                    className={`${
                      isPendapatan
                        ? 'border-green-500 text-green-600'
                        : 'border-orange-500 text-orange-600'
                    }`}
                  >
                    {isPendapatan ? 'Pendapatan' : 'Pengeluaran'}
                  </Badge>
                  <Button variant="ghost" size="sm" className="text-[#00BCD4]">
                    Detail
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
