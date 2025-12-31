// src/app/units/kbtk/kelola/laporan/siswa-aktif/page.tsx
'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Users,
  ArrowLeft,
  Printer,
  Loader2,
  Filter,
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

interface OrangTua {
  nama: string;
  relasi: string;
  nomorHP: string | null;
  isPrimary: boolean;
}

interface Siswa {
  id: string;
  nomorInduk: string;
  namaLengkap: string;
  namaPanggilan: string | null;
  jenisKelamin: 'lelaki' | 'perempuan';
  kelompokLevel: 'KB' | 'TK';
  kelompokKelas: 'A' | 'B';
  tahunAjaran: string;
  tanggalMasuk: string;
  status: string;
  orangTua: OrangTua[];
}

// Mock data for development
const mockSiswaData: Siswa[] = [
  {
    id: '1',
    nomorInduk: 'KBTK-2501-0001',
    namaLengkap: 'Ahmad Fauzan Al-Farisi',
    namaPanggilan: 'Fauzan',
    jenisKelamin: 'lelaki',
    kelompokLevel: 'KB',
    kelompokKelas: 'A',
    tahunAjaran: '2024/2025',
    tanggalMasuk: '2024-07-15',
    status: 'aktif',
    orangTua: [
      { nama: 'Muhammad Al-Farisi', relasi: 'ayah', nomorHP: '08123456789', isPrimary: true },
      { nama: 'Siti Aminah', relasi: 'ibu', nomorHP: '08123456788', isPrimary: false },
    ],
  },
  {
    id: '2',
    nomorInduk: 'KBTK-2501-0002',
    namaLengkap: 'Aisyah Putri Ramadhani',
    namaPanggilan: 'Aisyah',
    jenisKelamin: 'perempuan',
    kelompokLevel: 'TK',
    kelompokKelas: 'A',
    tahunAjaran: '2024/2025',
    tanggalMasuk: '2024-07-15',
    status: 'aktif',
    orangTua: [
      { nama: 'Ahmad Ramadhani', relasi: 'ayah', nomorHP: '08129876543', isPrimary: true },
    ],
  },
  {
    id: '3',
    nomorInduk: 'KBTK-2501-0003',
    namaLengkap: 'Muhammad Rizki Pratama',
    namaPanggilan: 'Rizki',
    jenisKelamin: 'lelaki',
    kelompokLevel: 'TK',
    kelompokKelas: 'B',
    tahunAjaran: '2024/2025',
    tanggalMasuk: '2023-07-17',
    status: 'aktif',
    orangTua: [
      { nama: 'Heru Pratama', relasi: 'ayah', nomorHP: '08561234567', isPrimary: false },
      { nama: 'Dewi Sartika', relasi: 'ibu', nomorHP: '08567891234', isPrimary: true },
    ],
  },
  {
    id: '4',
    nomorInduk: 'KBTK-2501-0004',
    namaLengkap: 'Fatimah Azzahra',
    namaPanggilan: 'Fatim',
    jenisKelamin: 'perempuan',
    kelompokLevel: 'KB',
    kelompokKelas: 'A',
    tahunAjaran: '2024/2025',
    tanggalMasuk: '2024-07-15',
    status: 'aktif',
    orangTua: [
      { nama: 'Abdul Rahman', relasi: 'ayah', nomorHP: '08132456789', isPrimary: true },
    ],
  },
  {
    id: '5',
    nomorInduk: 'KBTK-2501-0005',
    namaLengkap: 'Zaid bin Abdullah',
    namaPanggilan: 'Zaid',
    jenisKelamin: 'lelaki',
    kelompokLevel: 'TK',
    kelompokKelas: 'A',
    tahunAjaran: '2024/2025',
    tanggalMasuk: '2023-07-17',
    status: 'aktif',
    orangTua: [
      { nama: 'Abdullah Malik', relasi: 'ayah', nomorHP: '08219876543', isPrimary: true },
      { nama: 'Khadijah', relasi: 'ibu', nomorHP: '08217654321', isPrimary: false },
    ],
  },
];

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
  for (let i = 0; i < 3; i++) {
    options.push(`${currentYear - i}/${currentYear - i + 1}`);
  }
  return options;
}

export default function SiswaAktifPage() {
  const [loading, setLoading] = useState(true);
  const [siswaData, setSiswaData] = useState<Siswa[]>([]);
  const [tahunAjaran, setTahunAjaran] = useState<string>('all');
  const [kelompokLevel, setKelompokLevel] = useState<string>('all');
  const [kelompokKelas, setKelompokKelas] = useState<string>('all');

  useEffect(() => {
    async function fetchData() {
      try {
        // In production, fetch from API:
        // const response = await fetch('/api/kbtk/siswa?status=aktif');
        // const data = await response.json();

        await new Promise((resolve) => setTimeout(resolve, 500));
        setSiswaData(mockSiswaData);
      } catch (error) {
        console.error('Failed to fetch siswa data:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  const filteredData = useMemo(() => {
    return siswaData.filter((siswa) => {
      if (tahunAjaran !== 'all' && siswa.tahunAjaran !== tahunAjaran) return false;
      if (kelompokLevel !== 'all' && siswa.kelompokLevel !== kelompokLevel) return false;
      if (kelompokKelas !== 'all' && siswa.kelompokKelas !== kelompokKelas) return false;
      return true;
    });
  }, [siswaData, tahunAjaran, kelompokLevel, kelompokKelas]);

  const summary = useMemo(() => {
    const byKelompok: Record<string, number> = {};
    filteredData.forEach((siswa) => {
      const key = `${siswa.kelompokLevel} ${siswa.kelompokKelas}`;
      byKelompok[key] = (byKelompok[key] || 0) + 1;
    });
    return {
      total: filteredData.length,
      byKelompok,
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

  const periodLabel = useMemo(() => {
    const parts: string[] = [];
    if (tahunAjaran !== 'all') parts.push(`Tahun Ajaran ${tahunAjaran}`);
    if (kelompokLevel !== 'all') parts.push(`Kelompok ${kelompokLevel}`);
    if (kelompokKelas !== 'all') parts.push(`Kelas ${kelompokKelas}`);
    return parts.length > 0 ? parts.join(' - ') : 'Semua Data';
  }, [tahunAjaran, kelompokLevel, kelompokKelas]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-10 w-10 animate-spin text-[#00BCD4]" />
          <p className="text-gray-600">Memuat data siswa...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Print Header - Only visible when printing */}
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
          <h2 className="text-lg font-bold text-gray-900">DAFTAR SISWA AKTIF</h2>
          <p className="text-sm text-gray-600">{periodLabel}</p>
        </div>
      </div>

      {/* Page Header - Hidden when printing */}
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
              <Users className="h-6 w-6" />
              Daftar Siswa Aktif
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

      {/* Filters - Hidden when printing */}
      <Card className="no-print border-2 border-gray-100 rounded-2xl">
        <CardHeader className="pb-4">
          <CardTitle className="text-base flex items-center gap-2">
            <Filter className="h-4 w-4" />
            Filter Data
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">
                Tahun Ajaran
              </label>
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
              <label className="text-sm font-medium text-gray-700 mb-1 block">
                Kelompok
              </label>
              <Select value={kelompokLevel} onValueChange={setKelompokLevel}>
                <SelectTrigger className="rounded-xl">
                  <SelectValue placeholder="Pilih Kelompok" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Kelompok</SelectItem>
                  <SelectItem value="KB">KB (Kelompok Bermain)</SelectItem>
                  <SelectItem value="TK">TK (Taman Kanak-Kanak)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">
                Kelas
              </label>
              <Select value={kelompokKelas} onValueChange={setKelompokKelas}>
                <SelectTrigger className="rounded-xl">
                  <SelectValue placeholder="Pilih Kelas" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Kelas</SelectItem>
                  <SelectItem value="A">Kelas A</SelectItem>
                  <SelectItem value="B">Kelas B</SelectItem>
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
            <p className="text-sm text-gray-500">Total Siswa</p>
            <p className="text-2xl font-bold text-[#006064]">{summary.total}</p>
          </CardContent>
        </Card>
        {Object.entries(summary.byKelompok).map(([kelompok, count]) => (
          <Card key={kelompok} className="border-2 border-gray-100 rounded-2xl">
            <CardContent className="p-4">
              <p className="text-sm text-gray-500">{kelompok}</p>
              <p className="text-2xl font-bold text-[#006064]">{count}</p>
            </CardContent>
          </Card>
        ))}
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
                <TableHead className="text-center">Kelas</TableHead>
                <TableHead>Tanggal Masuk</TableHead>
                <TableHead>Orang Tua (Utama)</TableHead>
                <TableHead>No. HP</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                    Tidak ada data siswa yang sesuai filter
                  </TableCell>
                </TableRow>
              ) : (
                filteredData.map((siswa, index) => {
                  const primaryOrangTua = siswa.orangTua.find((ot) => ot.isPrimary) || siswa.orangTua[0];
                  return (
                    <TableRow key={siswa.id}>
                      <TableCell className="text-center">{index + 1}</TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{siswa.namaLengkap}</p>
                          <p className="text-xs text-gray-500">{siswa.nomorInduk}</p>
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
                          {siswa.kelompokLevel}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge variant="outline">{siswa.kelompokKelas}</Badge>
                      </TableCell>
                      <TableCell>{formatDate(siswa.tanggalMasuk)}</TableCell>
                      <TableCell>
                        {primaryOrangTua ? (
                          <div>
                            <p className="font-medium">{primaryOrangTua.nama}</p>
                            <p className="text-xs text-gray-500 capitalize">
                              {primaryOrangTua.relasi}
                            </p>
                          </div>
                        ) : (
                          '-'
                        )}
                      </TableCell>
                      <TableCell>
                        {primaryOrangTua?.nomorHP || '-'}
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>
      </Card>

      {/* Footer for Print */}
      <div className="hidden print:block mt-8 pt-4 border-t border-gray-200">
        <div className="flex justify-between text-sm text-gray-600">
          <p>Total: {summary.total} siswa</p>
          <p>Dicetak pada: {today}</p>
        </div>
      </div>
    </div>
  );
}
