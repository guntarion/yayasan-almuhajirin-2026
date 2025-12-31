// src/app/units/poliklinik/kunjungan/page.tsx
'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import {
  ClipboardList,
  Search,
  Plus,
  ChevronLeft,
  ChevronRight,
  Clock,
  Stethoscope,
  CheckCircle,
  AlertTriangle,
  User,
  Calendar,
  ArrowRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import {
  KunjunganKlinikWithRelations,
  formatUmur,
  formatTanggalWaktu,
  STATUS_KUNJUNGAN_OPTIONS,
} from '@/types/poliklinik';

export default function KunjunganPage() {
  const [kunjunganList, setKunjunganList] = useState<KunjunganKlinikWithRelations[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [tanggal, setTanggal] = useState(new Date().toISOString().split('T')[0]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  // Today's queue stats
  const [queueStats, setQueueStats] = useState({
    menunggu: 0,
    dalamPemeriksaan: 0,
    selesai: 0,
    total: 0,
  });

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        pageSize: '20',
        tanggal,
      });

      if (search) params.append('search', search);
      if (status) params.append('status', status);

      const res = await fetch(`/api/poliklinik/kunjungan?${params}`);
      const data = await res.json();

      setKunjunganList(data.data || []);
      setTotalPages(data.totalPages || 1);
      setTotal(data.total || 0);

      // Calculate queue stats from data
      const today = new Date().toISOString().split('T')[0];
      if (tanggal === today) {
        const menunggu = data.data?.filter((k: KunjunganKlinikWithRelations) => k.statusKunjungan === 'menunggu').length || 0;
        const dalamPemeriksaan = data.data?.filter((k: KunjunganKlinikWithRelations) => k.statusKunjungan === 'dalam_pemeriksaan').length || 0;
        const selesai = data.data?.filter((k: KunjunganKlinikWithRelations) => k.statusKunjungan === 'selesai').length || 0;
        setQueueStats({
          menunggu,
          dalamPemeriksaan,
          selesai,
          total: data.total || 0,
        });
      }
    } catch (error) {
      console.error('Error fetching kunjungan:', error);
    } finally {
      setLoading(false);
    }
  }, [page, search, status, tanggal]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchData();
  };

  const getStatusColor = (statusValue: string) => {
    const opt = STATUS_KUNJUNGAN_OPTIONS.find((o) => o.value === statusValue);
    return opt?.color || 'bg-gray-100 text-gray-800';
  };

  const updateStatus = async (kunjunganId: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/poliklinik/kunjungan/${kunjunganId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ statusKunjungan: newStatus }),
      });

      if (res.ok) {
        fetchData();
      }
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const isToday = tanggal === new Date().toISOString().split('T')[0];

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-700 text-white py-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <Link href="/units/poliklinik" className="text-purple-200 hover:text-white text-sm mb-2 inline-flex items-center">
                <ChevronLeft className="h-4 w-4 mr-1" />
                Kembali ke Poliklinik
              </Link>
              <h1 className="text-3xl font-bold flex items-center gap-3">
                <ClipboardList className="h-8 w-8" />
                {isToday ? 'Antrian Hari Ini' : 'Riwayat Kunjungan'}
              </h1>
              <p className="text-purple-200 mt-1">
                {isToday ? 'Kelola antrian pasien' : `Kunjungan tanggal ${new Date(tanggal).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}`}
              </p>
            </div>
            <Link href="/units/poliklinik/kunjungan/baru">
              <Button className="bg-white text-purple-700 hover:bg-purple-50">
                <Plus className="h-4 w-4 mr-2" />
                Daftarkan Pasien
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Queue Stats (Today only) */}
        {isToday && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <Card className="border-2 border-yellow-200">
              <CardContent className="pt-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-yellow-600">Menunggu</p>
                    <p className="text-3xl font-bold text-yellow-700">{queueStats.menunggu}</p>
                  </div>
                  <div className="h-12 w-12 rounded-full bg-yellow-100 flex items-center justify-center">
                    <Clock className="h-6 w-6 text-yellow-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 border-blue-200">
              <CardContent className="pt-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-blue-600">Dalam Pemeriksaan</p>
                    <p className="text-3xl font-bold text-blue-700">{queueStats.dalamPemeriksaan}</p>
                  </div>
                  <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                    <Stethoscope className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 border-green-200">
              <CardContent className="pt-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-green-600">Selesai</p>
                    <p className="text-3xl font-bold text-green-700">{queueStats.selesai}</p>
                  </div>
                  <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
                    <CheckCircle className="h-6 w-6 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 border-purple-200">
              <CardContent className="pt-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-purple-600">Total</p>
                    <p className="text-3xl font-bold text-purple-700">{queueStats.total}</p>
                  </div>
                  <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center">
                    <User className="h-6 w-6 text-purple-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Filters */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">Filter & Pencarian</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <Input
                  placeholder="Cari nama pasien atau No. Kunjungan..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full"
                />
              </div>

              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-gray-500" />
                <Input
                  type="date"
                  value={tanggal}
                  onChange={(e) => {
                    setTanggal(e.target.value);
                    setPage(1);
                  }}
                  className="w-auto"
                />
              </div>

              <Select value={status || 'all'} onValueChange={(v) => setStatus(v === 'all' ? '' : v)}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Status</SelectItem>
                  {STATUS_KUNJUNGAN_OPTIONS.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Button type="submit" className="bg-purple-600 hover:bg-purple-700">
                <Search className="h-4 w-4 mr-2" />
                Cari
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Table */}
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-purple-50">
                    <TableHead className="font-semibold w-16">No</TableHead>
                    <TableHead className="font-semibold">No. Kunjungan</TableHead>
                    <TableHead className="font-semibold">Pasien</TableHead>
                    <TableHead className="font-semibold">Keluhan</TableHead>
                    <TableHead className="font-semibold">Status</TableHead>
                    <TableHead className="font-semibold text-right">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8">
                        <div className="flex items-center justify-center">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : kunjunganList.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                        {isToday ? 'Belum ada pasien hari ini' : 'Tidak ada kunjungan pada tanggal ini'}
                      </TableCell>
                    </TableRow>
                  ) : (
                    kunjunganList.map((kunjungan) => (
                      <TableRow key={kunjungan.id} className={`hover:bg-purple-50/50 ${kunjungan.statusKunjungan === 'dalam_pemeriksaan' ? 'bg-blue-50' : ''}`}>
                        <TableCell className="font-bold text-lg text-purple-600">
                          {kunjungan.nomorAntrian || '-'}
                        </TableCell>
                        <TableCell>
                          <p className="font-mono text-sm">{kunjungan.nomorKunjungan}</p>
                          <p className="text-xs text-gray-500">{formatTanggalWaktu(kunjungan.tanggalKunjungan)}</p>
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium">{kunjungan.pasien?.namaLengkap}</p>
                            <div className="flex items-center gap-2 text-xs text-gray-500">
                              <span className="font-mono">{kunjungan.pasien?.nomorRM}</span>
                              <span>|</span>
                              <span>{kunjungan.pasien?.jenisKelamin === 'lelaki' ? 'L' : 'P'}</span>
                              <span>|</span>
                              <span>{formatUmur(kunjungan.pasien?.tanggalLahir)}</span>
                            </div>
                            {kunjungan.pasien?.riwayatAlergi && (
                              <div className="flex items-center gap-1 text-red-600 text-xs mt-1">
                                <AlertTriangle className="h-3 w-3" />
                                <span>Alergi</span>
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <p className="text-sm max-w-xs truncate">{kunjungan.keluhanUtama || '-'}</p>
                        </TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(kunjungan.statusKunjungan)}>
                            {STATUS_KUNJUNGAN_OPTIONS.find((o) => o.value === kunjungan.statusKunjungan)?.label || kunjungan.statusKunjungan}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            {isToday && kunjungan.statusKunjungan === 'menunggu' && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => updateStatus(kunjungan.id, 'dalam_pemeriksaan')}
                                className="text-blue-600 border-blue-200 hover:bg-blue-50"
                              >
                                Panggil
                              </Button>
                            )}

                            <Link href={`/units/poliklinik/kunjungan/${kunjungan.id}`}>
                              <Button size="sm" className="bg-purple-600 hover:bg-purple-700">
                                {kunjungan.rekamMedis ? 'Lihat RM' : 'Isi RM'}
                                <ArrowRight className="h-3 w-3 ml-1" />
                              </Button>
                            </Link>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between px-4 py-4 border-t">
                <p className="text-sm text-gray-500">
                  Menampilkan {kunjunganList.length} dari {total} kunjungan
                </p>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <span className="text-sm">
                    Halaman {page} dari {totalPages}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
