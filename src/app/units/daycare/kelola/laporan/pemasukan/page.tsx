// src/app/units/daycare/kelola/laporan/pemasukan/page.tsx
'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  Wallet,
  Loader2,
  CreditCard,
  UserPlus,
  Calendar,
  Clock,
  TrendingUp,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { ReportHeader } from '@/components/daycare/laporan/ReportHeader';
import { PrintStyles } from '@/components/daycare/laporan/PrintButton';
import { formatRupiah, formatTanggal, formatTanggalSingkat } from '@/types/daycare';

interface PemasukanDetail {
  id: string;
  tanggal: string;
  jenis: string;
  anak: string;
  anakId: string;
  nominal: number;
  metodePembayaran: string;
}

interface Summary {
  periodStart: string;
  periodEnd: string;
  totalPemasukan: number;
  breakdown: {
    pendaftaran: number;
    bulanan: number;
    harian: number;
  };
  jumlahTransaksi: number;
}

export default function PemasukanReportPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [detailList, setDetailList] = useState<PemasukanDetail[]>([]);
  const [summary, setSummary] = useState<Summary>({
    periodStart: '',
    periodEnd: '',
    totalPemasukan: 0,
    breakdown: {
      pendaftaran: 0,
      bulanan: 0,
      harian: 0,
    },
    jumlahTransaksi: 0,
  });

  // Date filters - default to current month
  const now = new Date();
  const defaultStartDate = new Date(now.getFullYear(), now.getMonth(), 1)
    .toISOString()
    .split('T')[0];
  const defaultEndDate = new Date(now.getFullYear(), now.getMonth() + 1, 0)
    .toISOString()
    .split('T')[0];

  const [startDate, setStartDate] = useState(defaultStartDate);
  const [endDate, setEndDate] = useState(defaultEndDate);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams({
        type: 'pemasukan',
        startDate,
        endDate,
      });

      const response = await fetch(`/api/daycare/laporan?${params.toString()}`);
      const result = await response.json();

      if (result.success) {
        setDetailList(result.data || []);
        setSummary(result.summary || {
          periodStart: startDate,
          periodEnd: endDate,
          totalPemasukan: 0,
          breakdown: { pendaftaran: 0, bulanan: 0, harian: 0 },
          jumlahTransaksi: 0,
        });
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setIsLoading(false);
    }
  }, [startDate, endDate]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const getJenisColor = (jenis: string) => {
    if (jenis === 'Pendaftaran') return 'bg-blue-100 text-blue-800';
    if (jenis.includes('Bulanan')) return 'bg-cyan-100 text-cyan-800';
    if (jenis === 'Harian') return 'bg-orange-100 text-orange-800';
    return 'bg-gray-100 text-gray-800';
  };

  const getJenisIcon = (jenis: string) => {
    if (jenis === 'Pendaftaran') return <UserPlus className="h-3 w-3" />;
    if (jenis.includes('Bulanan')) return <CreditCard className="h-3 w-3" />;
    if (jenis === 'Harian') return <Calendar className="h-3 w-3" />;
    return <Clock className="h-3 w-3" />;
  };

  const getMetodeColor = (metode: string) => {
    if (metode === 'cash') return 'bg-green-100 text-green-800';
    if (metode === 'transfer') return 'bg-purple-100 text-purple-800';
    return 'bg-gray-100 text-gray-800';
  };

  const filterSlot = (
    <div className="flex flex-wrap items-end gap-4">
      <div className="min-w-[180px]">
        <label className="text-sm font-medium text-gray-700 mb-1 block">
          Tanggal Mulai
        </label>
        <Input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="w-full"
        />
      </div>

      <div className="min-w-[180px]">
        <label className="text-sm font-medium text-gray-700 mb-1 block">
          Tanggal Akhir
        </label>
        <Input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          className="w-full"
        />
      </div>

      <Button
        onClick={fetchData}
        className="bg-[#00BCD4] hover:bg-[#006064] text-white"
      >
        Tampilkan
      </Button>
    </div>
  );

  // Calculate percentage for breakdown
  const getPercentage = (value: number) => {
    if (summary.totalPemasukan === 0) return 0;
    return ((value / summary.totalPemasukan) * 100).toFixed(1);
  };

  if (isLoading) {
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
      <PrintStyles />

      <ReportHeader
        title="Laporan Pemasukan"
        subtitle="Rekap pemasukan dari pembayaran Daycare"
        filterSlot={filterSlot}
        printTitle={`Laporan Pemasukan ${formatTanggalSingkat(startDate)} - ${formatTanggalSingkat(endDate)}`}
      />

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 no-print">
        <Card className="border-2 border-[#00BCD4]/30 bg-gradient-to-br from-[#E0F7FA] to-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Pemasukan</CardTitle>
            <Wallet className="h-4 w-4 text-[#00BCD4]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#006064]">
              {formatRupiah(summary.totalPemasukan)}
            </div>
            <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
              <TrendingUp className="h-3 w-3" />
              {summary.jumlahTransaksi} transaksi
            </p>
          </CardContent>
        </Card>

        <Card className="border-2 border-blue-100 bg-gradient-to-br from-blue-50 to-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pendaftaran</CardTitle>
            <UserPlus className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {formatRupiah(summary.breakdown.pendaftaran)}
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {getPercentage(summary.breakdown.pendaftaran)}% dari total
            </p>
          </CardContent>
        </Card>

        <Card className="border-2 border-cyan-100 bg-gradient-to-br from-cyan-50 to-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Bulanan</CardTitle>
            <CreditCard className="h-4 w-4 text-cyan-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-cyan-600">
              {formatRupiah(summary.breakdown.bulanan)}
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {getPercentage(summary.breakdown.bulanan)}% dari total
            </p>
          </CardContent>
        </Card>

        <Card className="border-2 border-orange-100 bg-gradient-to-br from-orange-50 to-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Harian</CardTitle>
            <Calendar className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {formatRupiah(summary.breakdown.harian)}
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {getPercentage(summary.breakdown.harian)}% dari total
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Print Summary */}
      <div className="print-only hidden print-summary rounded-lg">
        <h3 className="font-bold text-[#006064] mb-4">
          Periode: {formatTanggal(summary.periodStart)} - {formatTanggal(summary.periodEnd)}
        </h3>
        <div className="grid grid-cols-4 gap-4 text-center">
          <div>
            <p className="text-sm text-gray-600">Total Pemasukan</p>
            <p className="text-xl font-bold text-[#006064]">{formatRupiah(summary.totalPemasukan)}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Pendaftaran</p>
            <p className="text-xl font-bold text-blue-600">{formatRupiah(summary.breakdown.pendaftaran)}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Bulanan</p>
            <p className="text-xl font-bold text-cyan-600">{formatRupiah(summary.breakdown.bulanan)}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Harian</p>
            <p className="text-xl font-bold text-orange-600">{formatRupiah(summary.breakdown.harian)}</p>
          </div>
        </div>
      </div>

      {/* Breakdown Chart (Visual) */}
      <Card className="border-2 border-gray-100 rounded-2xl no-print">
        <CardHeader className="pb-2">
          <CardTitle className="text-base text-[#006064]">Breakdown Pemasukan</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2 mb-4">
            <div className="flex-1 h-8 rounded-full overflow-hidden flex bg-gray-100">
              {summary.breakdown.pendaftaran > 0 && (
                <div
                  className="h-full bg-blue-500 flex items-center justify-center text-white text-xs font-medium"
                  style={{ width: `${getPercentage(summary.breakdown.pendaftaran)}%` }}
                >
                  {Number(getPercentage(summary.breakdown.pendaftaran)) > 10 && 'Pendaftaran'}
                </div>
              )}
              {summary.breakdown.bulanan > 0 && (
                <div
                  className="h-full bg-cyan-500 flex items-center justify-center text-white text-xs font-medium"
                  style={{ width: `${getPercentage(summary.breakdown.bulanan)}%` }}
                >
                  {Number(getPercentage(summary.breakdown.bulanan)) > 10 && 'Bulanan'}
                </div>
              )}
              {summary.breakdown.harian > 0 && (
                <div
                  className="h-full bg-orange-500 flex items-center justify-center text-white text-xs font-medium"
                  style={{ width: `${getPercentage(summary.breakdown.harian)}%` }}
                >
                  {Number(getPercentage(summary.breakdown.harian)) > 10 && 'Harian'}
                </div>
              )}
            </div>
          </div>
          <div className="flex gap-6">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-blue-500" />
              <span className="text-sm text-gray-600">Pendaftaran ({getPercentage(summary.breakdown.pendaftaran)}%)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-cyan-500" />
              <span className="text-sm text-gray-600">Bulanan ({getPercentage(summary.breakdown.bulanan)}%)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-orange-500" />
              <span className="text-sm text-gray-600">Harian ({getPercentage(summary.breakdown.harian)}%)</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Data Table */}
      <Card className="border-2 border-gray-100 rounded-2xl">
        <CardHeader className="border-b border-gray-100">
          <CardTitle className="text-base text-[#006064]">Detail Transaksi</CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          {detailList.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <Wallet className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p className="font-medium">Tidak ada transaksi</p>
              <p className="text-sm">Tidak ada pemasukan pada periode ini</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50">
                    <TableHead className="w-12">No</TableHead>
                    <TableHead>Tanggal</TableHead>
                    <TableHead>Jenis</TableHead>
                    <TableHead>Nama Anak</TableHead>
                    <TableHead>Metode</TableHead>
                    <TableHead className="text-right">Nominal</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {detailList.map((item, index) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{index + 1}</TableCell>
                      <TableCell>{formatTanggalSingkat(item.tanggal)}</TableCell>
                      <TableCell>
                        <Badge className={`${getJenisColor(item.jenis)} flex items-center gap-1 w-fit`}>
                          {getJenisIcon(item.jenis)}
                          {item.jenis}
                        </Badge>
                      </TableCell>
                      <TableCell>{item.anak}</TableCell>
                      <TableCell>
                        <Badge className={`${getMetodeColor(item.metodePembayaran)} capitalize`}>
                          {item.metodePembayaran}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right font-semibold text-[#006064]">
                        {formatRupiah(item.nominal)}
                      </TableCell>
                    </TableRow>
                  ))}
                  {/* Total Row */}
                  <TableRow className="bg-[#E0F7FA] font-bold">
                    <TableCell colSpan={5} className="text-right">
                      TOTAL
                    </TableCell>
                    <TableCell className="text-right text-[#006064]">
                      {formatRupiah(summary.totalPemasukan)}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
