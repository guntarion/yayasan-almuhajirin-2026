// src/app/units/kbtk/kelola/laporan/pemasukan/page.tsx
'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  TrendingUp,
  ArrowLeft,
  Printer,
  Loader2,
  Filter,
  Receipt,
  UserPlus,
  Wallet,
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

interface PembayaranData {
  id: string;
  tanggal: string;
  jenis: 'pendaftaran' | 'spp';
  namaSiswa: string;
  nomorInduk: string;
  nominal: number;
  metodePembayaran: 'cash' | 'transfer';
  keterangan: string;
}

// Mock data for development
const mockPembayaranData: PembayaranData[] = [
  {
    id: '1',
    tanggal: '2025-01-02',
    jenis: 'spp',
    namaSiswa: 'Ahmad Fauzan Al-Farisi',
    nomorInduk: 'KBTK-2501-0001',
    nominal: 350000,
    metodePembayaran: 'transfer',
    keterangan: 'SPP Januari 2025',
  },
  {
    id: '2',
    tanggal: '2025-01-02',
    jenis: 'spp',
    namaSiswa: 'Aisyah Putri Ramadhani',
    nomorInduk: 'KBTK-2501-0002',
    nominal: 400000,
    metodePembayaran: 'cash',
    keterangan: 'SPP Januari 2025',
  },
  {
    id: '3',
    tanggal: '2025-01-03',
    jenis: 'pendaftaran',
    namaSiswa: 'Hana Maulida',
    nomorInduk: 'KBTK-2501-0007',
    nominal: 1500000,
    metodePembayaran: 'transfer',
    keterangan: 'Biaya Pendaftaran KB TA 2025/2026',
  },
  {
    id: '4',
    tanggal: '2025-01-03',
    jenis: 'spp',
    namaSiswa: 'Zaid bin Abdullah',
    nomorInduk: 'KBTK-2501-0005',
    nominal: 400000,
    metodePembayaran: 'transfer',
    keterangan: 'SPP Januari 2025',
  },
  {
    id: '5',
    tanggal: '2025-01-05',
    jenis: 'pendaftaran',
    namaSiswa: 'Bilal Habibie',
    nomorInduk: 'KBTK-2501-0008',
    nominal: 500000,
    metodePembayaran: 'cash',
    keterangan: 'Cicilan 1 Pendaftaran TK A TA 2025/2026',
  },
  {
    id: '6',
    tanggal: '2025-01-05',
    jenis: 'spp',
    namaSiswa: 'Muhammad Rizki Pratama',
    nomorInduk: 'KBTK-2501-0003',
    nominal: 200000,
    metodePembayaran: 'cash',
    keterangan: 'Cicilan SPP Januari 2025',
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

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

function getYearOptions(): number[] {
  const currentYear = new Date().getFullYear();
  const options: number[] = [];
  for (let i = 0; i < 3; i++) {
    options.push(currentYear - i);
  }
  return options;
}

export default function PemasukanPage() {
  const [loading, setLoading] = useState(true);
  const [pembayaranData, setPembayaranData] = useState<PembayaranData[]>([]);
  const [bulanDari, setBulanDari] = useState<string>(String(new Date().getMonth() + 1));
  const [tahunDari, setTahunDari] = useState<string>(String(new Date().getFullYear()));
  const [bulanSampai, setBulanSampai] = useState<string>(String(new Date().getMonth() + 1));
  const [tahunSampai, setTahunSampai] = useState<string>(String(new Date().getFullYear()));

  useEffect(() => {
    async function fetchData() {
      try {
        // In production, fetch from API:
        // const response = await fetch(`/api/kbtk/laporan/pemasukan?dari=${bulanDari}-${tahunDari}&sampai=${bulanSampai}-${tahunSampai}`);
        // const data = await response.json();

        await new Promise((resolve) => setTimeout(resolve, 500));
        setPembayaranData(mockPembayaranData);
      } catch (error) {
        console.error('Failed to fetch pemasukan data:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [bulanDari, tahunDari, bulanSampai, tahunSampai]);

  const summary = useMemo(() => {
    const pemasukanPendaftaran = pembayaranData
      .filter((p) => p.jenis === 'pendaftaran')
      .reduce((acc, item) => acc + item.nominal, 0);

    const pemasukanSpp = pembayaranData
      .filter((p) => p.jenis === 'spp')
      .reduce((acc, item) => acc + item.nominal, 0);

    const totalPemasukan = pemasukanPendaftaran + pemasukanSpp;

    const byCash = pembayaranData
      .filter((p) => p.metodePembayaran === 'cash')
      .reduce((acc, item) => acc + item.nominal, 0);

    const byTransfer = pembayaranData
      .filter((p) => p.metodePembayaran === 'transfer')
      .reduce((acc, item) => acc + item.nominal, 0);

    return {
      pemasukanPendaftaran,
      pemasukanSpp,
      totalPemasukan,
      byCash,
      byTransfer,
      totalTransaksi: pembayaranData.length,
    };
  }, [pembayaranData]);

  const handlePrint = () => {
    window.print();
  };

  const today = new Date().toLocaleDateString('id-ID', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const periodLabel = bulanDari === bulanSampai && tahunDari === tahunSampai
    ? `${BULAN_NAMES[parseInt(bulanDari) - 1]} ${tahunDari}`
    : `${BULAN_NAMES[parseInt(bulanDari) - 1]} ${tahunDari} - ${BULAN_NAMES[parseInt(bulanSampai) - 1]} ${tahunSampai}`;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-10 w-10 animate-spin text-[#00BCD4]" />
          <p className="text-gray-600">Memuat data pemasukan...</p>
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
          <h2 className="text-lg font-bold text-gray-900">LAPORAN PEMASUKAN</h2>
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
              <TrendingUp className="h-6 w-6" />
              Laporan Pemasukan
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
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Dari Bulan</label>
              <Select value={bulanDari} onValueChange={setBulanDari}>
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
              <label className="text-sm font-medium text-gray-700 mb-1 block">Dari Tahun</label>
              <Select value={tahunDari} onValueChange={setTahunDari}>
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
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Sampai Bulan</label>
              <Select value={bulanSampai} onValueChange={setBulanSampai}>
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
              <label className="text-sm font-medium text-gray-700 mb-1 block">Sampai Tahun</label>
              <Select value={tahunSampai} onValueChange={setTahunSampai}>
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
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 print:grid-cols-3">
        <Card className="border-2 border-blue-200 rounded-2xl bg-gradient-to-br from-blue-50 to-white">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-blue-100">
                <UserPlus className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-blue-600">Pendaftaran</p>
                <p className="text-2xl font-bold text-blue-700">
                  {formatCurrency(summary.pemasukanPendaftaran)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-2 border-green-200 rounded-2xl bg-gradient-to-br from-green-50 to-white">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-green-100">
                <Receipt className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-green-600">SPP</p>
                <p className="text-2xl font-bold text-green-700">
                  {formatCurrency(summary.pemasukanSpp)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-2 border-purple-200 rounded-2xl bg-gradient-to-br from-purple-50 to-white col-span-2 lg:col-span-1">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-purple-100">
                <Wallet className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-purple-600">Total Pemasukan</p>
                <p className="text-2xl font-bold text-purple-700">
                  {formatCurrency(summary.totalPemasukan)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Secondary Stats */}
      <div className="grid grid-cols-3 gap-4 print:hidden">
        <Card className="border-2 border-gray-100 rounded-2xl">
          <CardContent className="p-4 text-center">
            <p className="text-sm text-gray-500">Total Transaksi</p>
            <p className="text-2xl font-bold text-[#006064]">{summary.totalTransaksi}</p>
          </CardContent>
        </Card>
        <Card className="border-2 border-gray-100 rounded-2xl">
          <CardContent className="p-4 text-center">
            <p className="text-sm text-gray-500">Via Cash</p>
            <p className="text-lg font-bold text-gray-700">{formatCurrency(summary.byCash)}</p>
          </CardContent>
        </Card>
        <Card className="border-2 border-gray-100 rounded-2xl">
          <CardContent className="p-4 text-center">
            <p className="text-sm text-gray-500">Via Transfer</p>
            <p className="text-lg font-bold text-gray-700">{formatCurrency(summary.byTransfer)}</p>
          </CardContent>
        </Card>
      </div>

      {/* Data Table */}
      <Card className="border-2 border-gray-100 rounded-2xl overflow-hidden">
        <CardHeader className="bg-gray-50 border-b">
          <CardTitle className="text-base">Rincian Transaksi</CardTitle>
        </CardHeader>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50">
                <TableHead className="w-12 text-center">No</TableHead>
                <TableHead>Tanggal</TableHead>
                <TableHead className="text-center">Jenis</TableHead>
                <TableHead>Nama Siswa</TableHead>
                <TableHead className="text-right">Nominal</TableHead>
                <TableHead className="text-center">Metode</TableHead>
                <TableHead>Keterangan</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pembayaranData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                    Tidak ada data transaksi untuk periode ini
                  </TableCell>
                </TableRow>
              ) : (
                pembayaranData.map((item, index) => (
                  <TableRow key={item.id}>
                    <TableCell className="text-center">{index + 1}</TableCell>
                    <TableCell>{formatDate(item.tanggal)}</TableCell>
                    <TableCell className="text-center">
                      <Badge
                        className={
                          item.jenis === 'pendaftaran'
                            ? 'bg-blue-100 text-blue-700 border-blue-200'
                            : 'bg-green-100 text-green-700 border-green-200'
                        }
                      >
                        {item.jenis === 'pendaftaran' ? 'Pendaftaran' : 'SPP'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{item.namaSiswa}</p>
                        <p className="text-xs text-gray-500">{item.nomorInduk}</p>
                      </div>
                    </TableCell>
                    <TableCell className="text-right font-medium text-green-600">
                      {formatCurrency(item.nominal)}
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge variant="outline" className="capitalize">
                        {item.metodePembayaran}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-gray-600">
                      {item.keterangan}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Table Footer */}
        <div className="border-t border-gray-200 bg-gray-50 p-4">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">
              Total {pembayaranData.length} transaksi
            </span>
            <span className="text-lg font-bold text-[#006064]">
              Total: {formatCurrency(summary.totalPemasukan)}
            </span>
          </div>
        </div>
      </Card>

      {/* Footer for Print */}
      <div className="hidden print:block mt-8 pt-4 border-t border-gray-200">
        <div className="grid grid-cols-3 gap-4 text-sm">
          <div>
            <span className="text-gray-600">Pendaftaran:</span>
            <span className="ml-2 font-bold">{formatCurrency(summary.pemasukanPendaftaran)}</span>
          </div>
          <div>
            <span className="text-gray-600">SPP:</span>
            <span className="ml-2 font-bold">{formatCurrency(summary.pemasukanSpp)}</span>
          </div>
          <div>
            <span className="text-gray-600">Total:</span>
            <span className="ml-2 font-bold">{formatCurrency(summary.totalPemasukan)}</span>
          </div>
        </div>
        <p className="text-right text-sm text-gray-500 mt-4">Dicetak pada: {today}</p>
      </div>
    </div>
  );
}
