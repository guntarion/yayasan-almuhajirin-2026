// src/app/units/kbtk/kelola/laporan/pelunasan-pendaftaran/page.tsx
'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  ClipboardCheck,
  ArrowLeft,
  Printer,
  Loader2,
  Filter,
  CheckCircle,
  Clock,
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
import { Progress } from '@/components/ui/progress';

interface PendaftaranData {
  id: string;
  siswaId: string;
  namaSiswa: string;
  nomorInduk: string;
  program: 'KB' | 'TK';
  tahunAjaran: string;
  tanggalDaftar: string;
  biayaPendaftaran: number;
  totalBayar: number;
  sisa: number;
  schemaPembayaran: 'lunas' | 'angsuran';
  status: 'lunas' | 'belum_lunas';
  jumlahCicilan: number;
}

// Mock data for development
const mockPendaftaranData: PendaftaranData[] = [
  {
    id: '1',
    siswaId: '1',
    namaSiswa: 'Ahmad Fauzan Al-Farisi',
    nomorInduk: 'KBTK-2501-0001',
    program: 'KB',
    tahunAjaran: '2024/2025',
    tanggalDaftar: '2024-06-15',
    biayaPendaftaran: 1500000,
    totalBayar: 1500000,
    sisa: 0,
    schemaPembayaran: 'lunas',
    status: 'lunas',
    jumlahCicilan: 1,
  },
  {
    id: '2',
    siswaId: '2',
    namaSiswa: 'Aisyah Putri Ramadhani',
    nomorInduk: 'KBTK-2501-0002',
    program: 'TK',
    tahunAjaran: '2024/2025',
    tanggalDaftar: '2024-06-20',
    biayaPendaftaran: 2000000,
    totalBayar: 2000000,
    sisa: 0,
    schemaPembayaran: 'angsuran',
    status: 'lunas',
    jumlahCicilan: 3,
  },
  {
    id: '3',
    siswaId: '7',
    namaSiswa: 'Hana Maulida',
    nomorInduk: 'KBTK-2501-0007',
    program: 'KB',
    tahunAjaran: '2025/2026',
    tanggalDaftar: '2025-01-03',
    biayaPendaftaran: 1500000,
    totalBayar: 1500000,
    sisa: 0,
    schemaPembayaran: 'lunas',
    status: 'lunas',
    jumlahCicilan: 1,
  },
  {
    id: '4',
    siswaId: '8',
    namaSiswa: 'Bilal Habibie',
    nomorInduk: 'KBTK-2501-0008',
    program: 'TK',
    tahunAjaran: '2025/2026',
    tanggalDaftar: '2025-01-05',
    biayaPendaftaran: 2000000,
    totalBayar: 500000,
    sisa: 1500000,
    schemaPembayaran: 'angsuran',
    status: 'belum_lunas',
    jumlahCicilan: 1,
  },
  {
    id: '5',
    siswaId: '9',
    namaSiswa: 'Ummu Kultsum',
    nomorInduk: 'KBTK-2501-0009',
    program: 'TK',
    tahunAjaran: '2025/2026',
    tanggalDaftar: '2025-01-06',
    biayaPendaftaran: 2000000,
    totalBayar: 1000000,
    sisa: 1000000,
    schemaPembayaran: 'angsuran',
    status: 'belum_lunas',
    jumlahCicilan: 2,
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

function getTahunAjaranOptions(): string[] {
  const currentYear = new Date().getFullYear();
  const options: string[] = [];
  for (let i = -1; i < 3; i++) {
    options.push(`${currentYear - i}/${currentYear - i + 1}`);
  }
  return options;
}

function getStatusBadge(status: string) {
  switch (status) {
    case 'lunas':
      return (
        <Badge className="bg-green-100 text-green-700 border-green-200">
          <CheckCircle className="h-3 w-3 mr-1" />
          Lunas
        </Badge>
      );
    case 'belum_lunas':
      return (
        <Badge className="bg-yellow-100 text-yellow-700 border-yellow-200">
          <Clock className="h-3 w-3 mr-1" />
          Belum Lunas
        </Badge>
      );
    default:
      return null;
  }
}

export default function PelunasanPendaftaranPage() {
  const [loading, setLoading] = useState(true);
  const [pendaftaranData, setPendaftaranData] = useState<PendaftaranData[]>([]);
  const [tahunAjaran, setTahunAjaran] = useState<string>('all');

  useEffect(() => {
    async function fetchData() {
      try {
        // In production, fetch from API:
        // const response = await fetch(`/api/kbtk/pendaftaran?tahunAjaran=${tahunAjaran}`);
        // const data = await response.json();

        await new Promise((resolve) => setTimeout(resolve, 500));
        setPendaftaranData(mockPendaftaranData);
      } catch (error) {
        console.error('Failed to fetch pendaftaran data:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [tahunAjaran]);

  const filteredData = useMemo(() => {
    if (tahunAjaran === 'all') return pendaftaranData;
    return pendaftaranData.filter((p) => p.tahunAjaran === tahunAjaran);
  }, [pendaftaranData, tahunAjaran]);

  const summary = useMemo(() => {
    const totalDaftar = filteredData.length;
    const lunas = filteredData.filter((p) => p.status === 'lunas').length;
    const belumLunas = filteredData.filter((p) => p.status === 'belum_lunas').length;
    const persentaseLunas = totalDaftar > 0 ? Math.round((lunas / totalDaftar) * 100) : 0;

    const totalBiaya = filteredData.reduce((acc, p) => acc + p.biayaPendaftaran, 0);
    const totalTerbayar = filteredData.reduce((acc, p) => acc + p.totalBayar, 0);
    const totalSisa = filteredData.reduce((acc, p) => acc + p.sisa, 0);

    return {
      totalDaftar,
      lunas,
      belumLunas,
      persentaseLunas,
      totalBiaya,
      totalTerbayar,
      totalSisa,
    };
  }, [filteredData]);

  const handlePrint = () => {
    window.print();
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
          <p className="text-gray-600">Memuat data pendaftaran...</p>
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
          <h2 className="text-lg font-bold text-gray-900">STATUS PELUNASAN PENDAFTARAN</h2>
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
              <ClipboardCheck className="h-6 w-6" />
              Status Pelunasan Pendaftaran
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
          </div>
        </CardContent>
      </Card>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 print:grid-cols-4">
        <Card className="border-2 border-gray-100 rounded-2xl">
          <CardContent className="p-4">
            <p className="text-sm text-gray-500">Total Pendaftar</p>
            <p className="text-2xl font-bold text-[#006064]">{summary.totalDaftar}</p>
          </CardContent>
        </Card>
        <Card className="border-2 border-green-200 rounded-2xl bg-green-50">
          <CardContent className="p-4">
            <p className="text-sm text-green-600">Lunas</p>
            <p className="text-2xl font-bold text-green-700">{summary.lunas}</p>
          </CardContent>
        </Card>
        <Card className="border-2 border-yellow-200 rounded-2xl bg-yellow-50">
          <CardContent className="p-4">
            <p className="text-sm text-yellow-600">Belum Lunas</p>
            <p className="text-2xl font-bold text-yellow-700">{summary.belumLunas}</p>
          </CardContent>
        </Card>
        <Card className="border-2 border-blue-200 rounded-2xl bg-blue-50">
          <CardContent className="p-4">
            <p className="text-sm text-blue-600">Persentase Lunas</p>
            <p className="text-2xl font-bold text-blue-700">{summary.persentaseLunas}%</p>
          </CardContent>
        </Card>
      </div>

      {/* Financial Summary */}
      <Card className="border-2 border-gray-100 rounded-2xl">
        <CardHeader className="pb-4">
          <CardTitle className="text-base">Ringkasan Keuangan</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-4 rounded-xl bg-blue-50">
              <p className="text-sm text-blue-600">Total Biaya Pendaftaran</p>
              <p className="text-xl font-bold text-blue-700">{formatCurrency(summary.totalBiaya)}</p>
            </div>
            <div className="text-center p-4 rounded-xl bg-green-50">
              <p className="text-sm text-green-600">Total Terbayar</p>
              <p className="text-xl font-bold text-green-700">{formatCurrency(summary.totalTerbayar)}</p>
            </div>
            <div className="text-center p-4 rounded-xl bg-red-50">
              <p className="text-sm text-red-600">Total Sisa</p>
              <p className="text-xl font-bold text-red-700">{formatCurrency(summary.totalSisa)}</p>
            </div>
          </div>
          <div className="mt-4">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-600">Progress Pelunasan</span>
              <span className="font-medium">{summary.persentaseLunas}%</span>
            </div>
            <Progress value={summary.persentaseLunas} className="h-3" />
          </div>
        </CardContent>
      </Card>

      {/* Data Table */}
      <Card className="border-2 border-gray-100 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50">
                <TableHead className="w-12 text-center">No</TableHead>
                <TableHead>Nama Siswa</TableHead>
                <TableHead className="text-center">Program</TableHead>
                <TableHead className="text-right">Biaya</TableHead>
                <TableHead className="text-right">Dibayar</TableHead>
                <TableHead className="text-right">Sisa</TableHead>
                <TableHead className="text-center">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                    Tidak ada data pendaftaran untuk periode ini
                  </TableCell>
                </TableRow>
              ) : (
                filteredData.map((item, index) => (
                  <TableRow key={item.id}>
                    <TableCell className="text-center">{index + 1}</TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{item.namaSiswa}</p>
                        <p className="text-xs text-gray-500">{item.nomorInduk}</p>
                        <p className="text-xs text-gray-400">
                          Daftar: {formatDate(item.tanggalDaftar)} | TA {item.tahunAjaran}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge
                        className={
                          item.program === 'KB'
                            ? 'bg-orange-100 text-orange-700 border-orange-200'
                            : 'bg-purple-100 text-purple-700 border-purple-200'
                        }
                      >
                        {item.program}
                      </Badge>
                      <p className="text-xs text-gray-400 mt-1 capitalize">
                        {item.schemaPembayaran}
                      </p>
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      {formatCurrency(item.biayaPendaftaran)}
                    </TableCell>
                    <TableCell className="text-right font-medium text-green-600">
                      {formatCurrency(item.totalBayar)}
                      {item.jumlahCicilan > 1 && (
                        <p className="text-xs text-gray-400">
                          ({item.jumlahCicilan} cicilan)
                        </p>
                      )}
                    </TableCell>
                    <TableCell className="text-right font-medium text-red-600">
                      {item.sisa > 0 ? formatCurrency(item.sisa) : '-'}
                    </TableCell>
                    <TableCell className="text-center">
                      {getStatusBadge(item.status)}
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
        <div className="grid grid-cols-4 gap-4 text-sm">
          <div>
            <span className="text-gray-600">Total:</span>
            <span className="ml-2 font-bold">{summary.totalDaftar}</span>
          </div>
          <div>
            <span className="text-gray-600">Lunas:</span>
            <span className="ml-2 font-bold text-green-600">{summary.lunas}</span>
          </div>
          <div>
            <span className="text-gray-600">Belum Lunas:</span>
            <span className="ml-2 font-bold text-yellow-600">{summary.belumLunas}</span>
          </div>
          <div>
            <span className="text-gray-600">Persentase:</span>
            <span className="ml-2 font-bold">{summary.persentaseLunas}%</span>
          </div>
        </div>
        <p className="text-right text-sm text-gray-500 mt-4">Dicetak pada: {today}</p>
      </div>
    </div>
  );
}
