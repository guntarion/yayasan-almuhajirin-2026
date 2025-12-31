// src/app/units/daycare/kelola/laporan/anak-aktif/page.tsx
'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  Users,
  Sun,
  Moon,
  Calendar,
  Loader2,
  Phone,
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
  PAKET_LAYANAN_OPTIONS,
  STATUS_ANAK_OPTIONS,
  hitungUmur,
  formatTanggalSingkat,
  getPaketLabel,
  getPaketColor,
  getStatusColor,
} from '@/types/daycare';

interface AnakData {
  id: string;
  nomorInduk: string;
  namaLengkap: string;
  namaPanggilan: string | null;
  jenisKelamin: string;
  tanggalLahir: string;
  paketLayanan: string;
  status: string;
  tanggalMulai: string;
  orangTua: {
    id: string;
    nama: string;
    nomorHP: string | null;
    relasi: string;
  }[];
}

interface GroupedData {
  FULLDAY: AnakData[];
  AFTER_SCHOOL: AnakData[];
  HARIAN: AnakData[];
}

interface Summary {
  totalAnak: number;
  totalFullday: number;
  totalAfterSchool: number;
  totalHarian: number;
}

export default function AnakAktifReportPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [anakList, setAnakList] = useState<AnakData[]>([]);
  const [groupedData, setGroupedData] = useState<GroupedData>({
    FULLDAY: [],
    AFTER_SCHOOL: [],
    HARIAN: [],
  });
  const [summary, setSummary] = useState<Summary>({
    totalAnak: 0,
    totalFullday: 0,
    totalAfterSchool: 0,
    totalHarian: 0,
  });

  // Filters
  const [filterPaket, setFilterPaket] = useState('all');
  const [filterStatus, setFilterStatus] = useState('aktif');

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams({
        type: 'anak-aktif',
      });

      if (filterPaket !== 'all') params.append('paket', filterPaket);
      if (filterStatus !== 'all') params.append('status', filterStatus);

      const response = await fetch(`/api/daycare/laporan?${params.toString()}`);
      const result = await response.json();

      if (result.success) {
        setAnakList(result.data || []);
        setGroupedData(result.grouped || { FULLDAY: [], AFTER_SCHOOL: [], HARIAN: [] });
        setSummary(result.summary || {
          totalAnak: 0,
          totalFullday: 0,
          totalAfterSchool: 0,
          totalHarian: 0,
        });
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setIsLoading(false);
    }
  }, [filterPaket, filterStatus]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const getPaketIcon = (paket: string) => {
    switch (paket) {
      case 'FULLDAY':
        return <Sun className="h-4 w-4" />;
      case 'AFTER_SCHOOL':
        return <Moon className="h-4 w-4" />;
      case 'HARIAN':
        return <Calendar className="h-4 w-4" />;
      default:
        return null;
    }
  };

  const renderAnakTable = (data: AnakData[], title: string, icon: React.ReactNode, color: string) => {
    if (data.length === 0) return null;

    return (
      <div className="avoid-break mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div
            className="p-2 rounded-lg"
            style={{ backgroundColor: `${color}20` }}
          >
            <div style={{ color }}>{icon}</div>
          </div>
          <div>
            <h3 className="text-lg font-bold text-[#006064]">{title}</h3>
            <p className="text-sm text-gray-500">{data.length} anak</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50">
                <TableHead className="w-12">No</TableHead>
                <TableHead>No. Induk</TableHead>
                <TableHead>Nama Lengkap</TableHead>
                <TableHead>Jenis Kelamin</TableHead>
                <TableHead>Usia</TableHead>
                <TableHead>Tanggal Mulai</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Kontak Orang Tua</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((anak, index) => {
                const umur = hitungUmur(anak.tanggalLahir);
                const primaryContact = anak.orangTua[0];

                return (
                  <TableRow key={anak.id}>
                    <TableCell className="font-medium">{index + 1}</TableCell>
                    <TableCell className="font-mono text-sm">
                      {anak.nomorInduk}
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{anak.namaLengkap}</p>
                        {anak.namaPanggilan && (
                          <p className="text-xs text-gray-500">
                            ({anak.namaPanggilan})
                          </p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      {anak.jenisKelamin === 'lelaki' ? 'Laki-laki' : 'Perempuan'}
                    </TableCell>
                    <TableCell>{umur.text}</TableCell>
                    <TableCell>{formatTanggalSingkat(anak.tanggalMulai)}</TableCell>
                    <TableCell>
                      <Badge className={`${getStatusColor(anak.status)} capitalize`}>
                        {anak.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {primaryContact ? (
                        <div>
                          <p className="text-sm">{primaryContact.nama}</p>
                          {primaryContact.nomorHP && (
                            <p className="text-xs text-gray-500 flex items-center gap-1">
                              <Phone className="h-3 w-3" />
                              {primaryContact.nomorHP}
                            </p>
                          )}
                        </div>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </div>
    );
  };

  const filterSlot = (
    <div className="flex flex-wrap gap-4">
      <div className="min-w-[180px]">
        <label className="text-sm font-medium text-gray-700 mb-1 block">
          Paket Layanan
        </label>
        <Select value={filterPaket} onValueChange={setFilterPaket}>
          <SelectTrigger>
            <SelectValue placeholder="Semua Paket" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Semua Paket</SelectItem>
            {PAKET_LAYANAN_OPTIONS.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="min-w-[180px]">
        <label className="text-sm font-medium text-gray-700 mb-1 block">
          Status
        </label>
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger>
            <SelectValue placeholder="Semua Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Semua Status</SelectItem>
            {STATUS_ANAK_OPTIONS.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
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
          <p className="text-gray-600">Memuat data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PrintStyles />

      <ReportHeader
        title="Daftar Anak Aktif"
        subtitle="Daftar anak yang terdaftar di Daycare Al Muhajirin"
        filterSlot={filterSlot}
        printTitle={`Daftar Anak ${filterStatus !== 'all' ? filterStatus.charAt(0).toUpperCase() + filterStatus.slice(1) : ''} - Daycare Al Muhajirin`}
      />

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 no-print">
        <Card className="border-2 border-gray-100 hover:border-[#00BCD4]/30 transition-colors">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Anak</CardTitle>
            <Users className="h-4 w-4 text-[#00BCD4]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#006064]">{summary.totalAnak}</div>
          </CardContent>
        </Card>

        <Card className="border-2 border-gray-100 hover:border-orange-200 transition-colors">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">FULLDAY</CardTitle>
            <Sun className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{summary.totalFullday}</div>
          </CardContent>
        </Card>

        <Card className="border-2 border-gray-100 hover:border-purple-200 transition-colors">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">AFTER SCHOOL</CardTitle>
            <Moon className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{summary.totalAfterSchool}</div>
          </CardContent>
        </Card>

        <Card className="border-2 border-gray-100 hover:border-green-200 transition-colors">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">HARIAN</CardTitle>
            <Calendar className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{summary.totalHarian}</div>
          </CardContent>
        </Card>
      </div>

      {/* Print Summary */}
      <div className="print-only hidden print-summary rounded-lg">
        <div className="grid grid-cols-4 gap-4 text-center">
          <div>
            <p className="text-sm text-gray-600">Total Anak</p>
            <p className="text-xl font-bold text-[#006064]">{summary.totalAnak}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">FULLDAY</p>
            <p className="text-xl font-bold text-orange-600">{summary.totalFullday}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">AFTER SCHOOL</p>
            <p className="text-xl font-bold text-purple-600">{summary.totalAfterSchool}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">HARIAN</p>
            <p className="text-xl font-bold text-green-600">{summary.totalHarian}</p>
          </div>
        </div>
      </div>

      {/* Data Tables */}
      <Card className="border-2 border-gray-100 rounded-2xl">
        <CardContent className="pt-6">
          {anakList.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <Users className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p className="font-medium">Tidak ada data anak</p>
              <p className="text-sm">Coba ubah filter untuk melihat data lainnya</p>
            </div>
          ) : filterPaket === 'all' ? (
            // Show grouped by paket
            <>
              {renderAnakTable(
                groupedData.FULLDAY,
                'Program FULLDAY',
                <Sun className="h-5 w-5" />,
                '#FF9800'
              )}
              {renderAnakTable(
                groupedData.AFTER_SCHOOL,
                'Program AFTER SCHOOL',
                <Moon className="h-5 w-5" />,
                '#9C27B0'
              )}
              {renderAnakTable(
                groupedData.HARIAN,
                'Program HARIAN',
                <Calendar className="h-5 w-5" />,
                '#4CAF50'
              )}
            </>
          ) : (
            // Show single list
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50">
                    <TableHead className="w-12">No</TableHead>
                    <TableHead>No. Induk</TableHead>
                    <TableHead>Nama Lengkap</TableHead>
                    <TableHead>Jenis Kelamin</TableHead>
                    <TableHead>Usia</TableHead>
                    <TableHead>Paket</TableHead>
                    <TableHead>Tanggal Mulai</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Kontak Orang Tua</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {anakList.map((anak, index) => {
                    const umur = hitungUmur(anak.tanggalLahir);
                    const primaryContact = anak.orangTua[0];

                    return (
                      <TableRow key={anak.id}>
                        <TableCell className="font-medium">{index + 1}</TableCell>
                        <TableCell className="font-mono text-sm">
                          {anak.nomorInduk}
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium">{anak.namaLengkap}</p>
                            {anak.namaPanggilan && (
                              <p className="text-xs text-gray-500">
                                ({anak.namaPanggilan})
                              </p>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          {anak.jenisKelamin === 'lelaki' ? 'Laki-laki' : 'Perempuan'}
                        </TableCell>
                        <TableCell>{umur.text}</TableCell>
                        <TableCell>
                          <Badge className={`${getPaketColor(anak.paketLayanan)} flex items-center gap-1 w-fit`}>
                            {getPaketIcon(anak.paketLayanan)}
                            {getPaketLabel(anak.paketLayanan)}
                          </Badge>
                        </TableCell>
                        <TableCell>{formatTanggalSingkat(anak.tanggalMulai)}</TableCell>
                        <TableCell>
                          <Badge className={`${getStatusColor(anak.status)} capitalize`}>
                            {anak.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {primaryContact ? (
                            <div>
                              <p className="text-sm">{primaryContact.nama}</p>
                              {primaryContact.nomorHP && (
                                <p className="text-xs text-gray-500 flex items-center gap-1">
                                  <Phone className="h-3 w-3" />
                                  {primaryContact.nomorHP}
                                </p>
                              )}
                            </div>
                          ) : (
                            <span className="text-gray-400">-</span>
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
