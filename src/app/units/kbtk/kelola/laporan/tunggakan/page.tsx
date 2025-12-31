// src/app/units/kbtk/kelola/laporan/tunggakan/page.tsx
'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  AlertCircle,
  ArrowLeft,
  Printer,
  Loader2,
  Filter,
  MessageCircle,
  ArrowUpDown,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

interface TunggakanBulan {
  bulan: number;
  tahun: number;
  nominal: number;
}

interface SiswaTunggakan {
  id: string;
  siswaId: string;
  namaSiswa: string;
  nomorInduk: string;
  kelompokLevel: 'KB' | 'TK';
  kelompokKelas: 'A' | 'B';
  orangTuaUtama: string;
  nomorHP: string | null;
  tunggakanBulan: TunggakanBulan[];
  totalTunggakan: number;
}

// Mock data for development
const mockTunggakanData: SiswaTunggakan[] = [
  {
    id: '1',
    siswaId: '3',
    namaSiswa: 'Muhammad Rizki Pratama',
    nomorInduk: 'KBTK-2501-0003',
    kelompokLevel: 'TK',
    kelompokKelas: 'B',
    orangTuaUtama: 'Dewi Sartika',
    nomorHP: '08567891234',
    tunggakanBulan: [
      { bulan: 11, tahun: 2024, nominal: 200000 },
      { bulan: 12, tahun: 2024, nominal: 400000 },
      { bulan: 1, tahun: 2025, nominal: 150000 },
    ],
    totalTunggakan: 750000,
  },
  {
    id: '2',
    siswaId: '4',
    namaSiswa: 'Fatimah Azzahra',
    nomorInduk: 'KBTK-2501-0004',
    kelompokLevel: 'KB',
    kelompokKelas: 'A',
    orangTuaUtama: 'Abdul Rahman',
    nomorHP: '08132456789',
    tunggakanBulan: [
      { bulan: 1, tahun: 2025, nominal: 350000 },
    ],
    totalTunggakan: 350000,
  },
  {
    id: '3',
    siswaId: '6',
    namaSiswa: 'Khadijah binti Umar',
    nomorInduk: 'KBTK-2501-0006',
    kelompokLevel: 'TK',
    kelompokKelas: 'A',
    orangTuaUtama: 'Umar Farouq',
    nomorHP: '08219876000',
    tunggakanBulan: [
      { bulan: 10, tahun: 2024, nominal: 400000 },
      { bulan: 11, tahun: 2024, nominal: 400000 },
      { bulan: 12, tahun: 2024, nominal: 400000 },
      { bulan: 1, tahun: 2025, nominal: 400000 },
    ],
    totalTunggakan: 1600000,
  },
];

const BULAN_NAMES_SHORT = [
  'Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun',
  'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des',
];

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

function getTahunAjaranOptions(): string[] {
  const currentYear = new Date().getFullYear();
  const options: string[] = [];
  for (let i = 0; i < 3; i++) {
    options.push(`${currentYear - i}/${currentYear - i + 1}`);
  }
  return options;
}

function formatTunggakanBulan(tunggakanBulan: TunggakanBulan[]): string {
  return tunggakanBulan
    .map((t) => `${BULAN_NAMES_SHORT[t.bulan - 1]} ${t.tahun}`)
    .join(', ');
}

export default function TunggakanPage() {
  const [loading, setLoading] = useState(true);
  const [tunggakanData, setTunggakanData] = useState<SiswaTunggakan[]>([]);
  const [tahunAjaran, setTahunAjaran] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'nama' | 'total'>('total');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  useEffect(() => {
    async function fetchData() {
      try {
        // In production, fetch from API:
        // const response = await fetch(`/api/kbtk/laporan/tunggakan?tahunAjaran=${tahunAjaran}`);
        // const data = await response.json();

        await new Promise((resolve) => setTimeout(resolve, 500));
        setTunggakanData(mockTunggakanData);
      } catch (error) {
        console.error('Failed to fetch tunggakan data:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [tahunAjaran]);

  const sortedData = useMemo(() => {
    return [...tunggakanData].sort((a, b) => {
      if (sortBy === 'nama') {
        return sortOrder === 'asc'
          ? a.namaSiswa.localeCompare(b.namaSiswa)
          : b.namaSiswa.localeCompare(a.namaSiswa);
      } else {
        return sortOrder === 'asc'
          ? a.totalTunggakan - b.totalTunggakan
          : b.totalTunggakan - a.totalTunggakan;
      }
    });
  }, [tunggakanData, sortBy, sortOrder]);

  const summary = useMemo(() => {
    const totalTunggakan = tunggakanData.reduce((acc, item) => acc + item.totalTunggakan, 0);
    const totalSiswa = tunggakanData.length;
    return { totalTunggakan, totalSiswa };
  }, [tunggakanData]);

  const handlePrint = () => {
    window.print();
  };

  const handleWhatsAppReminder = (siswa: SiswaTunggakan) => {
    const bulanList = formatTunggakanBulan(siswa.tunggakanBulan);
    const message = `Assalamualaikum Bapak/Ibu ${siswa.orangTuaUtama},

Dengan hormat, kami dari KBTK Al Muhajirin Rewwin ingin mengingatkan bahwa terdapat tunggakan SPP untuk ananda *${siswa.namaSiswa}* (${siswa.nomorInduk}):

Bulan: ${bulanList}
Total Tunggakan: ${formatCurrency(siswa.totalTunggakan)}

Mohon untuk segera melakukan pembayaran. Terima kasih atas perhatian dan kerjasamanya.

Wassalamualaikum,
Admin KBTK Al Muhajirin Rewwin`;

    const phoneNumber = siswa.nomorHP?.replace(/[^0-9]/g, '');
    const formattedPhone = phoneNumber?.startsWith('0')
      ? '62' + phoneNumber.slice(1)
      : phoneNumber;

    window.open(
      `https://wa.me/${formattedPhone}?text=${encodeURIComponent(message)}`,
      '_blank'
    );
  };

  const toggleSort = (field: 'nama' | 'total') => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder(field === 'total' ? 'desc' : 'asc');
    }
  };

  const today = new Date().toLocaleDateString('id-ID', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const periodLabel = tahunAjaran !== 'all' ? `Tahun Ajaran ${tahunAjaran}` : 'Semua Tahun Ajaran';

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-10 w-10 animate-spin text-[#00BCD4]" />
          <p className="text-gray-600">Memuat data tunggakan...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Print Header */}
      <div className="hidden print:block mb-6">
        <div className="flex items-center justify-between border-b-2 border-[#006064] pb-4 mb-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 relative">
              <Image
                src="/images/Logo-YAMR.png"
                alt="Logo KBTK"
                width={64}
                height={64}
                className="object-contain"
              />
            </div>
            <div>
              <h1 className="text-xl font-bold text-[#006064]">KBTK Al Muhajirin Rewwin</h1>
              <p className="text-sm text-gray-600">Kelompok Bermain & Taman Kanak-Kanak</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-600">Tanggal Cetak:</p>
            <p className="text-sm font-medium">{today}</p>
          </div>
        </div>
        <div className="text-center mb-4">
          <h2 className="text-lg font-bold text-gray-900">DAFTAR SISWA MENUNGGAK SPP</h2>
          <p className="text-sm text-gray-600">{periodLabel}</p>
        </div>
      </div>

      {/* Page Header */}
      <div className="no-print flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link
            href="/units/kbtk/kelola/laporan"
            className="p-2 rounded-xl hover:bg-[#B2EBF2]/30 transition-colors"
          >
            <ArrowLeft className="h-5 w-5 text-[#006064]" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-[#006064] flex items-center gap-2">
              <AlertCircle className="h-6 w-6" />
              Daftar Siswa Menunggak
            </h1>
            <p className="text-sm text-gray-600">{periodLabel}</p>
          </div>
        </div>
        <Button
          onClick={handlePrint}
          className="bg-gradient-to-r from-[#00BCD4] to-[#006064] hover:from-[#006064] hover:to-[#00BCD4] text-white rounded-xl"
        >
          <Printer className="h-4 w-4 mr-2" />
          Cetak Laporan
        </Button>
      </div>

      {/* Filters */}
      <Card className="no-print border-2 border-gray-100 rounded-2xl">
        <CardHeader className="pb-4">
          <CardTitle className="text-base flex items-center gap-2">
            <Filter className="h-4 w-4" />
            Filter Data
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Tahun Ajaran</label>
              <Select value={tahunAjaran} onValueChange={setTahunAjaran}>
                <SelectTrigger className="rounded-xl">
                  <SelectValue placeholder="Pilih Tahun Ajaran" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Tahun</SelectItem>
                  {getTahunAjaranOptions().map((ta) => (
                    <SelectItem key={ta} value={ta}>
                      {ta}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Urutkan</label>
              <div className="flex gap-2">
                <Button
                  variant={sortBy === 'total' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => toggleSort('total')}
                  className={`rounded-xl flex-1 ${sortBy === 'total' ? 'bg-[#006064]' : ''}`}
                >
                  <ArrowUpDown className="h-4 w-4 mr-1" />
                  Total Tunggakan {sortBy === 'total' && (sortOrder === 'desc' ? '(Tertinggi)' : '(Terendah)')}
                </Button>
                <Button
                  variant={sortBy === 'nama' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => toggleSort('nama')}
                  className={`rounded-xl flex-1 ${sortBy === 'nama' ? 'bg-[#006064]' : ''}`}
                >
                  <ArrowUpDown className="h-4 w-4 mr-1" />
                  Nama {sortBy === 'nama' && (sortOrder === 'asc' ? '(A-Z)' : '(Z-A)')}
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 gap-4 print:grid-cols-2">
        <Card className="border-2 border-red-200 rounded-2xl bg-red-50">
          <CardContent className="p-4">
            <p className="text-sm text-red-600">Total Siswa Menunggak</p>
            <p className="text-3xl font-bold text-red-700">{summary.totalSiswa}</p>
          </CardContent>
        </Card>
        <Card className="border-2 border-red-200 rounded-2xl bg-red-50">
          <CardContent className="p-4">
            <p className="text-sm text-red-600">Total Tunggakan</p>
            <p className="text-2xl font-bold text-red-700">{formatCurrency(summary.totalTunggakan)}</p>
          </CardContent>
        </Card>
      </div>

      {/* Data Table */}
      <Card className="border-2 border-gray-100 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50">
                <TableHead className="w-12 text-center">No</TableHead>
                <TableHead>Nama Siswa</TableHead>
                <TableHead className="text-center">Kelompok</TableHead>
                <TableHead>Bulan Tunggakan</TableHead>
                <TableHead className="text-right">Total Tunggakan</TableHead>
                <TableHead className="text-center no-print">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
                        <AlertCircle className="h-8 w-8 text-green-500" />
                      </div>
                      <p className="font-medium text-green-600">Tidak ada siswa yang menunggak!</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                sortedData.map((siswa, index) => (
                  <TableRow key={siswa.id}>
                    <TableCell className="text-center">{index + 1}</TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{siswa.namaSiswa}</p>
                        <p className="text-xs text-gray-500">{siswa.nomorInduk}</p>
                        <p className="text-xs text-gray-400">
                          {siswa.orangTuaUtama} - {siswa.nomorHP || '-'}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge
                        className={
                          siswa.kelompokLevel === 'KB'
                            ? 'bg-orange-100 text-orange-700 border-orange-200'
                            : 'bg-purple-100 text-purple-700 border-purple-200'
                        }
                      >
                        {siswa.kelompokLevel} {siswa.kelompokKelas}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {siswa.tunggakanBulan.map((t, idx) => (
                          <Badge
                            key={idx}
                            variant="outline"
                            className="text-xs bg-red-50 text-red-700 border-red-200"
                          >
                            {BULAN_NAMES_SHORT[t.bulan - 1]} {t.tahun} ({formatCurrency(t.nominal)})
                          </Badge>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell className="text-right font-bold text-red-600">
                      {formatCurrency(siswa.totalTunggakan)}
                    </TableCell>
                    <TableCell className="text-center no-print">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleWhatsAppReminder(siswa)}
                        className="text-green-600 border-green-300 hover:bg-green-50 rounded-lg"
                        disabled={!siswa.nomorHP}
                      >
                        <MessageCircle className="h-4 w-4 mr-1" />
                        WA
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </Card>

      {/* Footer for Print */}
      <div className="hidden print:block mt-8 pt-4 border-t border-gray-200">
        <div className="flex justify-between text-sm text-gray-600">
          <p>
            Total: {summary.totalSiswa} siswa | Total Tunggakan: {formatCurrency(summary.totalTunggakan)}
          </p>
          <p>Dicetak pada: {today}</p>
        </div>
      </div>
    </div>
  );
}
