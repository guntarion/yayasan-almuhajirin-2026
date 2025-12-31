// src/app/units/kbtk/kelola/laporan/rekap-spp/page.tsx
'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Receipt,
  ArrowLeft,
  Printer,
  Loader2,
  Filter,
  CheckCircle,
  AlertCircle,
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

interface TagihanSppData {
  id: string;
  siswaId: string;
  namaSiswa: string;
  nomorInduk: string;
  kelompokLevel: 'KB' | 'TK';
  kelompokKelas: 'A' | 'B';
  bulan: number;
  tahun: number;
  nominal: number;
  diskon: number;
  totalTagihan: number;
  totalBayar: number;
  sisa: number;
  status: 'belum_bayar' | 'bayar_sebagian' | 'lunas';
}

// Mock data for development
const mockSppData: TagihanSppData[] = [
  {
    id: '1',
    siswaId: '1',
    namaSiswa: 'Ahmad Fauzan Al-Farisi',
    nomorInduk: 'KBTK-2501-0001',
    kelompokLevel: 'KB',
    kelompokKelas: 'A',
    bulan: 1,
    tahun: 2025,
    nominal: 350000,
    diskon: 0,
    totalTagihan: 350000,
    totalBayar: 350000,
    sisa: 0,
    status: 'lunas',
  },
  {
    id: '2',
    siswaId: '2',
    namaSiswa: 'Aisyah Putri Ramadhani',
    nomorInduk: 'KBTK-2501-0002',
    kelompokLevel: 'TK',
    kelompokKelas: 'A',
    bulan: 1,
    tahun: 2025,
    nominal: 400000,
    diskon: 0,
    totalTagihan: 400000,
    totalBayar: 400000,
    sisa: 0,
    status: 'lunas',
  },
  {
    id: '3',
    siswaId: '3',
    namaSiswa: 'Muhammad Rizki Pratama',
    nomorInduk: 'KBTK-2501-0003',
    kelompokLevel: 'TK',
    kelompokKelas: 'B',
    bulan: 1,
    tahun: 2025,
    nominal: 400000,
    diskon: 50000,
    totalTagihan: 350000,
    totalBayar: 200000,
    sisa: 150000,
    status: 'bayar_sebagian',
  },
  {
    id: '4',
    siswaId: '4',
    namaSiswa: 'Fatimah Azzahra',
    nomorInduk: 'KBTK-2501-0004',
    kelompokLevel: 'KB',
    kelompokKelas: 'A',
    bulan: 1,
    tahun: 2025,
    nominal: 350000,
    diskon: 0,
    totalTagihan: 350000,
    totalBayar: 0,
    sisa: 350000,
    status: 'belum_bayar',
  },
  {
    id: '5',
    siswaId: '5',
    namaSiswa: 'Zaid bin Abdullah',
    nomorInduk: 'KBTK-2501-0005',
    kelompokLevel: 'TK',
    kelompokKelas: 'A',
    bulan: 1,
    tahun: 2025,
    nominal: 400000,
    diskon: 0,
    totalTagihan: 400000,
    totalBayar: 400000,
    sisa: 0,
    status: 'lunas',
  },
];

const BULAN_NAMES = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember',
];

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
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
    case 'bayar_sebagian':
      return (
        <Badge className="bg-yellow-100 text-yellow-700 border-yellow-200">
          <Clock className="h-3 w-3 mr-1" />
          Sebagian
        </Badge>
      );
    case 'belum_bayar':
      return (
        <Badge className="bg-red-100 text-red-700 border-red-200">
          <AlertCircle className="h-3 w-3 mr-1" />
          Belum Bayar
        </Badge>
      );
    default:
      return null;
  }
}

function getYearOptions(): number[] {
  const currentYear = new Date().getFullYear();
  const options: number[] = [];
  for (let i = 0; i < 3; i++) {
    options.push(currentYear - i);
  }
  return options;
}

export default function RekapSppPage() {
  const [loading, setLoading] = useState(true);
  const [sppData, setSppData] = useState<TagihanSppData[]>([]);
  const [bulan, setBulan] = useState<string>(String(new Date().getMonth() + 1));
  const [tahun, setTahun] = useState<string>(String(new Date().getFullYear()));

  useEffect(() => {
    async function fetchData() {
      try {
        // In production, fetch from API:
        // const response = await fetch(`/api/kbtk/tagihan-spp?bulan=${bulan}&tahun=${tahun}`);
        // const data = await response.json();

        await new Promise((resolve) => setTimeout(resolve, 500));
        setSppData(mockSppData);
      } catch (error) {
        console.error('Failed to fetch SPP data:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [bulan, tahun]);

  const summary = useMemo(() => {
    const totalTagihan = sppData.reduce((acc, item) => acc + item.totalTagihan, 0);
    const totalBayar = sppData.reduce((acc, item) => acc + item.totalBayar, 0);
    const totalTunggakan = sppData.reduce((acc, item) => acc + item.sisa, 0);
    const jumlahLunas = sppData.filter((item) => item.status === 'lunas').length;
    const jumlahBelumLunas = sppData.filter((item) => item.status !== 'lunas').length;

    return {
      totalTagihan,
      totalBayar,
      totalTunggakan,
      jumlahLunas,
      jumlahBelumLunas,
      total: sppData.length,
    };
  }, [sppData]);

  const handlePrint = () => {
    window.print();
  };

  const today = new Date().toLocaleDateString('id-ID', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const periodLabel = `${BULAN_NAMES[parseInt(bulan) - 1]} ${tahun}`;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-10 w-10 animate-spin text-[#00BCD4]" />
          <p className="text-gray-600">Memuat data SPP...</p>
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
          <h2 className="text-lg font-bold text-gray-900">REKAP SPP BULANAN</h2>
          <p className="text-sm text-gray-600">Periode: {periodLabel}</p>
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
              <Receipt className="h-6 w-6" />
              Rekap SPP per Bulan
            </h1>
            <p className="text-sm text-gray-600">Periode: {periodLabel}</p>
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
            Filter Periode
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Bulan</label>
              <Select value={bulan} onValueChange={setBulan}>
                <SelectTrigger className="rounded-xl">
                  <SelectValue placeholder="Pilih Bulan" />
                </SelectTrigger>
                <SelectContent>
                  {BULAN_NAMES.map((name, index) => (
                    <SelectItem key={index} value={String(index + 1)}>
                      {name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Tahun</label>
              <Select value={tahun} onValueChange={setTahun}>
                <SelectTrigger className="rounded-xl">
                  <SelectValue placeholder="Pilih Tahun" />
                </SelectTrigger>
                <SelectContent>
                  {getYearOptions().map((year) => (
                    <SelectItem key={year} value={String(year)}>
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 print:grid-cols-3">
        <Card className="border-2 border-gray-100 rounded-2xl">
          <CardContent className="p-4">
            <p className="text-sm text-gray-500">Total Siswa</p>
            <p className="text-2xl font-bold text-[#006064]">{summary.total}</p>
          </CardContent>
        </Card>
        <Card className="border-2 border-green-200 rounded-2xl bg-green-50">
          <CardContent className="p-4">
            <p className="text-sm text-green-600">Lunas</p>
            <p className="text-2xl font-bold text-green-700">{summary.jumlahLunas}</p>
          </CardContent>
        </Card>
        <Card className="border-2 border-red-200 rounded-2xl bg-red-50">
          <CardContent className="p-4">
            <p className="text-sm text-red-600">Belum Lunas</p>
            <p className="text-2xl font-bold text-red-700">{summary.jumlahBelumLunas}</p>
          </CardContent>
        </Card>
        <Card className="border-2 border-blue-200 rounded-2xl bg-blue-50">
          <CardContent className="p-4">
            <p className="text-sm text-blue-600">Total Tagihan</p>
            <p className="text-lg font-bold text-blue-700">{formatCurrency(summary.totalTagihan)}</p>
          </CardContent>
        </Card>
        <Card className="border-2 border-green-200 rounded-2xl bg-green-50">
          <CardContent className="p-4">
            <p className="text-sm text-green-600">Total Bayar</p>
            <p className="text-lg font-bold text-green-700">{formatCurrency(summary.totalBayar)}</p>
          </CardContent>
        </Card>
        <Card className="border-2 border-red-200 rounded-2xl bg-red-50">
          <CardContent className="p-4">
            <p className="text-sm text-red-600">Total Tunggakan</p>
            <p className="text-lg font-bold text-red-700">{formatCurrency(summary.totalTunggakan)}</p>
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
                <TableHead className="text-right">Nominal</TableHead>
                <TableHead className="text-right">Bayar</TableHead>
                <TableHead className="text-right">Sisa</TableHead>
                <TableHead className="text-center">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sppData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                    Tidak ada data SPP untuk periode ini
                  </TableCell>
                </TableRow>
              ) : (
                sppData.map((item, index) => (
                  <TableRow key={item.id}>
                    <TableCell className="text-center">{index + 1}</TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{item.namaSiswa}</p>
                        <p className="text-xs text-gray-500">{item.nomorInduk}</p>
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge
                        className={
                          item.kelompokLevel === 'KB'
                            ? 'bg-orange-100 text-orange-700 border-orange-200'
                            : 'bg-purple-100 text-purple-700 border-purple-200'
                        }
                      >
                        {item.kelompokLevel} {item.kelompokKelas}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      {formatCurrency(item.totalTagihan)}
                      {item.diskon > 0 && (
                        <p className="text-xs text-green-600">
                          Diskon: {formatCurrency(item.diskon)}
                        </p>
                      )}
                    </TableCell>
                    <TableCell className="text-right font-medium text-green-600">
                      {formatCurrency(item.totalBayar)}
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

        {/* Table Footer / Summary */}
        <div className="border-t border-gray-200 bg-gray-50 p-4">
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div>
              <span className="text-gray-600">Total Tagihan:</span>
              <span className="ml-2 font-bold">{formatCurrency(summary.totalTagihan)}</span>
            </div>
            <div>
              <span className="text-gray-600">Total Bayar:</span>
              <span className="ml-2 font-bold text-green-600">{formatCurrency(summary.totalBayar)}</span>
            </div>
            <div>
              <span className="text-gray-600">Total Tunggakan:</span>
              <span className="ml-2 font-bold text-red-600">{formatCurrency(summary.totalTunggakan)}</span>
            </div>
          </div>
        </div>
      </Card>

      {/* Footer for Print */}
      <div className="hidden print:block mt-8 pt-4 border-t border-gray-200">
        <div className="flex justify-between text-sm text-gray-600">
          <p>
            Total: {summary.total} siswa | Lunas: {summary.jumlahLunas} | Belum Lunas: {summary.jumlahBelumLunas}
          </p>
          <p>Dicetak pada: {today}</p>
        </div>
      </div>
    </div>
  );
}
