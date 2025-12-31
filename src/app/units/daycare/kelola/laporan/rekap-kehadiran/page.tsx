// src/app/units/daycare/kelola/laporan/rekap-kehadiran/page.tsx
'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  Calendar,
  Loader2,
  Users,
  CheckCircle,
  XCircle,
  BarChart3,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
import { ReportHeader } from '@/components/daycare/laporan/ReportHeader';
import { PrintStyles } from '@/components/daycare/laporan/PrintButton';
import {
  BULAN_OPTIONS,
  generateYearOptions,
  getNamaBulan,
} from '@/types/daycare';

interface KehadiranDetail {
  tanggal: string;
  isHadir: boolean;
}

interface KehadiranData {
  anak: {
    id: string;
    nomorInduk: string;
    namaLengkap: string;
  };
  totalHadir: number;
  totalTidakHadir: number;
  totalHari: number;
  details: KehadiranDetail[];
}

interface Summary {
  bulan: number;
  tahun: number;
  totalAnakHarian: number;
  totalKehadiran: number;
  totalTidakHadir: number;
}

export default function RekapKehadiranPage() {
  const now = new Date();
  const yearOptions = generateYearOptions(2024, 5);

  const [isLoading, setIsLoading] = useState(true);
  const [kehadiranList, setKehadiranList] = useState<KehadiranData[]>([]);
  const [summary, setSummary] = useState<Summary>({
    bulan: now.getMonth() + 1,
    tahun: now.getFullYear(),
    totalAnakHarian: 0,
    totalKehadiran: 0,
    totalTidakHadir: 0,
  });

  // Filters
  const [filterBulan, setFilterBulan] = useState(String(now.getMonth() + 1));
  const [filterTahun, setFilterTahun] = useState(String(now.getFullYear()));

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams({
        type: 'kehadiran',
        bulan: filterBulan,
        tahun: filterTahun,
      });

      const response = await fetch(`/api/daycare/laporan?${params.toString()}`);
      const result = await response.json();

      if (result.success) {
        setKehadiranList(result.data || []);
        setSummary(result.summary || {
          bulan: parseInt(filterBulan),
          tahun: parseInt(filterTahun),
          totalAnakHarian: 0,
          totalKehadiran: 0,
          totalTidakHadir: 0,
        });
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setIsLoading(false);
    }
  }, [filterBulan, filterTahun]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const getPersentaseKehadiran = (hadir: number, total: number) => {
    if (total === 0) return 0;
    return ((hadir / total) * 100).toFixed(0);
  };

  const filterSlot = (
    <div className="flex flex-wrap gap-4">
      <div className="min-w-[180px]">
        <label className="text-sm font-medium text-gray-700 mb-1 block">
          Bulan
        </label>
        <Select value={filterBulan} onValueChange={setFilterBulan}>
          <SelectTrigger>
            <SelectValue placeholder="Pilih Bulan" />
          </SelectTrigger>
          <SelectContent>
            {BULAN_OPTIONS.map((opt) => (
              <SelectItem key={opt.value} value={String(opt.value)}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="min-w-[180px]">
        <label className="text-sm font-medium text-gray-700 mb-1 block">
          Tahun
        </label>
        <Select value={filterTahun} onValueChange={setFilterTahun}>
          <SelectTrigger>
            <SelectValue placeholder="Pilih Tahun" />
          </SelectTrigger>
          <SelectContent>
            {yearOptions.map((opt) => (
              <SelectItem key={opt.value} value={String(opt.value)}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-10 w-10 animate-spin text-[#00BCD4]" />
          <p className="text-gray-600">Memuat data kehadiran...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PrintStyles />

      <ReportHeader
        title="Rekap Kehadiran"
        subtitle="Rekap kehadiran anak dengan paket HARIAN"
        filterSlot={filterSlot}
        printTitle={`Rekap Kehadiran ${getNamaBulan(summary.bulan)} ${summary.tahun} - Daycare Al Muhajirin`}
      />

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 no-print">
        <Card className="border-2 border-[#00BCD4]/30 bg-gradient-to-br from-[#E0F7FA] to-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Anak HARIAN</CardTitle>
            <Users className="h-4 w-4 text-[#00BCD4]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#006064]">
              {summary.totalAnakHarian}
            </div>
            <p className="text-xs text-gray-500 mt-1">anak terdaftar</p>
          </CardContent>
        </Card>

        <Card className="border-2 border-green-100 bg-gradient-to-br from-green-50 to-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Kehadiran</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {summary.totalKehadiran}
            </div>
            <p className="text-xs text-gray-500 mt-1">hari hadir</p>
          </CardContent>
        </Card>

        <Card className="border-2 border-red-100 bg-gradient-to-br from-red-50 to-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Tidak Hadir</CardTitle>
            <XCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {summary.totalTidakHadir}
            </div>
            <p className="text-xs text-gray-500 mt-1">hari tidak hadir</p>
          </CardContent>
        </Card>

        <Card className="border-2 border-purple-100 bg-gradient-to-br from-purple-50 to-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rata-rata Kehadiran</CardTitle>
            <BarChart3 className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              {getPersentaseKehadiran(summary.totalKehadiran, summary.totalKehadiran + summary.totalTidakHadir)}%
            </div>
            <p className="text-xs text-gray-500 mt-1">tingkat kehadiran</p>
          </CardContent>
        </Card>
      </div>

      {/* Print Summary */}
      <div className="print-only hidden print-summary rounded-lg">
        <h3 className="font-bold text-[#006064] mb-4">
          Periode: {getNamaBulan(summary.bulan)} {summary.tahun}
        </h3>
        <div className="grid grid-cols-4 gap-4 text-center">
          <div>
            <p className="text-sm text-gray-600">Total Anak HARIAN</p>
            <p className="text-xl font-bold text-[#006064]">{summary.totalAnakHarian}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Total Kehadiran</p>
            <p className="text-xl font-bold text-green-600">{summary.totalKehadiran} hari</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Total Tidak Hadir</p>
            <p className="text-xl font-bold text-red-600">{summary.totalTidakHadir} hari</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Rata-rata Kehadiran</p>
            <p className="text-xl font-bold text-purple-600">
              {getPersentaseKehadiran(summary.totalKehadiran, summary.totalKehadiran + summary.totalTidakHadir)}%
            </p>
          </div>
        </div>
      </div>

      {/* Data Table */}
      <Card className="border-2 border-gray-100 rounded-2xl">
        <CardHeader className="border-b border-gray-100">
          <CardTitle className="text-base text-[#006064] flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Rekap per Anak - {getNamaBulan(summary.bulan)} {summary.tahun}
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          {kehadiranList.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <Calendar className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p className="font-medium">Tidak ada data kehadiran</p>
              <p className="text-sm">Belum ada anak dengan paket HARIAN atau belum ada data kehadiran bulan ini</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50">
                    <TableHead className="w-12">No</TableHead>
                    <TableHead>No. Induk</TableHead>
                    <TableHead>Nama Anak</TableHead>
                    <TableHead className="text-center">Total Hadir</TableHead>
                    <TableHead className="text-center">Total Tidak Hadir</TableHead>
                    <TableHead className="text-center">Total Hari</TableHead>
                    <TableHead className="text-center">Persentase</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {kehadiranList.map((item, index) => {
                    const persentase = getPersentaseKehadiran(item.totalHadir, item.totalHari);
                    let persentaseColor = 'text-green-600';
                    if (Number(persentase) < 50) persentaseColor = 'text-red-600';
                    else if (Number(persentase) < 75) persentaseColor = 'text-yellow-600';

                    return (
                      <TableRow key={item.anak.id}>
                        <TableCell className="font-medium">{index + 1}</TableCell>
                        <TableCell className="font-mono text-sm">
                          {item.anak.nomorInduk}
                        </TableCell>
                        <TableCell className="font-medium">
                          {item.anak.namaLengkap}
                        </TableCell>
                        <TableCell className="text-center">
                          <Badge className="bg-green-100 text-green-800">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            {item.totalHadir} hari
                          </Badge>
                        </TableCell>
                        <TableCell className="text-center">
                          {item.totalTidakHadir > 0 ? (
                            <Badge className="bg-red-100 text-red-800">
                              <XCircle className="h-3 w-3 mr-1" />
                              {item.totalTidakHadir} hari
                            </Badge>
                          ) : (
                            <span className="text-gray-400">-</span>
                          )}
                        </TableCell>
                        <TableCell className="text-center font-medium">
                          {item.totalHari} hari
                        </TableCell>
                        <TableCell className="text-center">
                          <span className={`font-bold ${persentaseColor}`}>
                            {persentase}%
                          </span>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                  {/* Total Row */}
                  <TableRow className="bg-[#E0F7FA] font-bold">
                    <TableCell colSpan={3} className="text-right">
                      TOTAL
                    </TableCell>
                    <TableCell className="text-center text-green-600">
                      {summary.totalKehadiran} hari
                    </TableCell>
                    <TableCell className="text-center text-red-600">
                      {summary.totalTidakHadir} hari
                    </TableCell>
                    <TableCell className="text-center">
                      {summary.totalKehadiran + summary.totalTidakHadir} hari
                    </TableCell>
                    <TableCell className="text-center text-[#006064]">
                      {getPersentaseKehadiran(summary.totalKehadiran, summary.totalKehadiran + summary.totalTidakHadir)}%
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Note for print */}
      <div className="print-only hidden mt-8 pt-4 border-t border-gray-200">
        <p className="text-sm text-gray-500 text-center">
          Dokumen ini dicetak dari Sistem Daycare Al Muhajirin Rewwin
        </p>
      </div>
    </div>
  );
}
