// src/app/units/poliklinik/pasien/page.tsx
'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import {
  Stethoscope,
  Plus,
  Search,
  Filter,
  LayoutGrid,
  Table2,
  Eye,
  Edit,
  MapPin,
  Phone,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  Users,
  Calendar,
  Activity,
  ArrowLeft,
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
import { Skeleton } from '@/components/ui/skeleton';
import { JamaahFormDialog } from '@/components/jamaah';
import { Jamaah, ALAMAT_RW_OPTIONS, GENDER_OPTIONS } from '@/types/jamaah';

interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export default function PoliklinikPasienPage() {
  const [pasienList, setPasienList] = useState<Jamaah[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState<PaginationInfo>({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
  });

  // Filters
  const [search, setSearch] = useState('');
  const [filterRW, setFilterRW] = useState('');
  const [filterGender, setFilterGender] = useState('');

  // UI State
  const [viewMode, setViewMode] = useState<'card' | 'table'>('table');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingPasien, setEditingPasien] = useState<Jamaah | null>(null);

  const fetchPasien = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.append('page', pagination.page.toString());
      params.append('limit', pagination.limit.toString());
      params.append('isPengunjungKlinik', 'true'); // Filter only klinik visitors
      if (search) params.append('search', search);
      if (filterRW) params.append('alamatRW', filterRW);
      if (filterGender) params.append('gender', filterGender);

      const response = await fetch(`/api/jamaah?${params.toString()}`);
      const result = await response.json();

      if (response.ok) {
        setPasienList(result.data);
        setPagination(result.pagination);
      }
    } catch (error) {
      console.error('Error fetching pasien:', error);
    } finally {
      setLoading(false);
    }
  }, [pagination.page, pagination.limit, search, filterRW, filterGender]);

  useEffect(() => {
    fetchPasien();
  }, [fetchPasien]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPagination((prev) => ({ ...prev, page: 1 }));
    fetchPasien();
  };

  const handleEdit = (pasien: Jamaah) => {
    setEditingPasien(pasien);
    setDialogOpen(true);
  };

  const handleAddNew = () => {
    setEditingPasien(null);
    setDialogOpen(true);
  };

  const handleDialogSuccess = () => {
    fetchPasien();
  };

  const formatRW = (rw: string | null) => {
    const map: Record<string, string> = {
      RW6: 'RW 6',
      RW8: 'RW 8',
      RW9: 'RW 9',
      RWLainnya: 'Lainnya',
    };
    return rw ? map[rw] || rw : '-';
  };

  // Stats
  const totalPasien = pagination.total;
  const pasienLelaki = pasienList.filter((p) => p.gender === 'lelaki').length;
  const pasienPerempuan = pasienList.filter((p) => p.gender === 'perempuan').length;
  const totalKunjungan = pasienList.reduce((sum, p) => sum + (p.jumlahKunjunganKlinik || 0), 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50/50 to-indigo-50/50">
      {/* Header */}
      <div className="relative overflow-hidden bg-gradient-to-r from-white via-purple-100/30 to-indigo-100/30 px-4 sm:px-6 lg:px-8 py-6 rounded-b-3xl border-b border-purple-200/50">
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-gradient-to-br from-purple-200/30 to-indigo-200/30 rounded-full blur-3xl" />
        <div className="absolute -bottom-12 -left-12 w-32 h-32 bg-gradient-to-tr from-purple-100/30 to-indigo-100/30 rounded-full blur-2xl" />

        <div className="relative z-10 container mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                asChild
                className="hover:bg-purple-100/50 rounded-xl"
              >
                <Link href="/">
                  <ArrowLeft className="h-5 w-5 text-purple-700" />
                </Link>
              </Button>
              <div className="flex items-center gap-3">
                <div className="w-1 h-8 bg-gradient-to-b from-purple-500 to-indigo-600 rounded-full" />
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold text-purple-800">Data Pasien</h1>
                  <p className="text-sm text-purple-600">Kelola data pasien Poliklinik Al Muhajirin</p>
                </div>
              </div>
            </div>
            <Button
              onClick={handleAddNew}
              className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-indigo-600 hover:to-purple-600 text-white rounded-xl shadow-lg"
            >
              <Plus className="h-4 w-4 mr-2" />
              Tambah Pasien
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <Card className="border-2 border-gray-100 rounded-2xl hover:shadow-lg hover:border-purple-300/50 transition-all duration-300 overflow-hidden">
            <div className="h-1 bg-gradient-to-r from-purple-500 to-indigo-600" />
            <CardContent className="pt-4">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-xl bg-gradient-to-br from-purple-100 to-indigo-100">
                  <Users className="h-6 w-6 text-purple-700" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Pasien</p>
                  <p className="text-2xl font-bold text-purple-700">{totalPasien}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 border-gray-100 rounded-2xl hover:shadow-lg hover:border-blue-300/50 transition-all duration-300 overflow-hidden">
            <div className="h-1 bg-gradient-to-r from-blue-500 to-cyan-600" />
            <CardContent className="pt-4">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-xl bg-gradient-to-br from-blue-100 to-cyan-100">
                  <Users className="h-6 w-6 text-blue-700" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Laki-laki</p>
                  <p className="text-2xl font-bold text-blue-700">{pasienLelaki}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 border-gray-100 rounded-2xl hover:shadow-lg hover:border-pink-300/50 transition-all duration-300 overflow-hidden">
            <div className="h-1 bg-gradient-to-r from-pink-500 to-rose-600" />
            <CardContent className="pt-4">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-xl bg-gradient-to-br from-pink-100 to-rose-100">
                  <Users className="h-6 w-6 text-pink-700" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Perempuan</p>
                  <p className="text-2xl font-bold text-pink-700">{pasienPerempuan}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 border-gray-100 rounded-2xl hover:shadow-lg hover:border-green-300/50 transition-all duration-300 overflow-hidden">
            <div className="h-1 bg-gradient-to-r from-green-500 to-emerald-600" />
            <CardContent className="pt-4">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-xl bg-gradient-to-br from-green-100 to-emerald-100">
                  <Activity className="h-6 w-6 text-green-700" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Kunjungan</p>
                  <p className="text-2xl font-bold text-green-700">{totalKunjungan}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-6 border-2 border-purple-200/50 rounded-2xl">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg flex items-center gap-2">
              <Filter className="h-5 w-5 text-purple-600" />
              <span className="text-purple-800">Filter & Pencarian</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="md:col-span-2 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Cari nama, HP, alamat..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10 border-2 focus:border-purple-500 rounded-xl"
                />
              </div>

              <Select value={filterRW || 'all'} onValueChange={(v) => setFilterRW(v === 'all' ? '' : v)}>
                <SelectTrigger className="border-2 focus:border-purple-500 rounded-xl">
                  <SelectValue placeholder="Semua RW" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua RW</SelectItem>
                  {ALAMAT_RW_OPTIONS.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={filterGender || 'all'} onValueChange={(v) => setFilterGender(v === 'all' ? '' : v)}>
                <SelectTrigger className="border-2 focus:border-purple-500 rounded-xl">
                  <SelectValue placeholder="Semua Gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Gender</SelectItem>
                  {GENDER_OPTIONS.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </form>

            <div className="flex items-center justify-between mt-4 pt-4 border-t">
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={fetchPasien}
                  className="rounded-xl"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Refresh
                </Button>
              </div>

              <div className="flex items-center gap-2 border border-gray-300 rounded-xl p-1">
                <Button
                  variant={viewMode === 'card' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('card')}
                  className={`rounded-lg ${viewMode === 'card' ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white' : ''}`}
                >
                  <LayoutGrid className="h-4 w-4 mr-2" />
                  Kartu
                </Button>
                <Button
                  variant={viewMode === 'table' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('table')}
                  className={`rounded-lg ${viewMode === 'table' ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white' : ''}`}
                >
                  <Table2 className="h-4 w-4 mr-2" />
                  Tabel
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Content */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="rounded-2xl">
                <CardContent className="pt-4">
                  <Skeleton className="h-6 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-1/2 mb-4" />
                  <Skeleton className="h-4 w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : viewMode === 'card' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {pasienList.map((pasien) => (
              <Card
                key={pasien.id}
                className="group hover:shadow-2xl transition-all duration-500 cursor-pointer border border-gray-200 hover:border-purple-400/50 rounded-2xl overflow-hidden hover:scale-[1.02]"
              >
                <div className="bg-gradient-to-br from-purple-50/50 via-indigo-50/30 to-white">
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg font-bold text-purple-800">
                          {pasien.namaDisplay}
                        </CardTitle>
                        <div className="flex items-center gap-2 mt-1">
                          {pasien.gender && (
                            <Badge variant="outline" className="text-xs">
                              {pasien.gender === 'lelaki' ? 'Laki-laki' : 'Perempuan'}
                            </Badge>
                          )}
                          <Badge className="bg-purple-100 text-purple-700 text-xs">
                            <Calendar className="h-3 w-3 mr-1" />
                            {pasien.jumlahKunjunganKlinik || 0} Kunjungan
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-3">
                    {(pasien.alamatRW || pasien.alamatWilayah) && (
                      <div className="flex items-start text-sm text-gray-600">
                        <MapPin className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0 text-purple-600" />
                        <span>
                          {[
                            pasien.alamatRT && `RT ${pasien.alamatRT}`,
                            formatRW(pasien.alamatRW),
                            pasien.alamatWilayah === 'Rewwin' ? 'Rewwin' : pasien.alamatDetail,
                          ]
                            .filter(Boolean)
                            .join(', ')}
                        </span>
                      </div>
                    )}

                    {pasien.nomerHandphone && (
                      <div className="flex items-center text-sm text-gray-600">
                        <Phone className="h-4 w-4 mr-2 flex-shrink-0 text-purple-600" />
                        <span>{pasien.nomerHandphone}</span>
                      </div>
                    )}

                    {pasien.tanggalLahir && (
                      <div className="flex items-center text-sm text-gray-600">
                        <Calendar className="h-4 w-4 mr-2 flex-shrink-0 text-purple-600" />
                        <span>
                          {new Date(pasien.tanggalLahir).toLocaleDateString('id-ID', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric',
                          })}
                        </span>
                      </div>
                    )}

                    <div className="flex gap-2 pt-3 border-t">
                      <Button
                        asChild
                        size="sm"
                        className="flex-1 h-9 rounded-xl font-semibold shadow-lg transition-all duration-300 hover:shadow-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white"
                      >
                        <Link href={`/pasien/${pasien.id}`}>
                          <Eye className="h-4 w-4 mr-2" />
                          Detail
                        </Link>
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(pasien)}
                        className="h-9 px-4 rounded-xl border-2 hover:bg-purple-50 transition-all duration-300"
                        style={{ borderColor: '#9333EA', color: '#7C3AED' }}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="border-2 border-purple-200/50 rounded-2xl overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-gradient-to-r from-purple-100/50 to-indigo-100/50">
                  <TableHead className="font-bold text-purple-800">Nama</TableHead>
                  <TableHead className="font-bold text-purple-800">Gender</TableHead>
                  <TableHead className="font-bold text-purple-800">Usia</TableHead>
                  <TableHead className="font-bold text-purple-800">Alamat</TableHead>
                  <TableHead className="font-bold text-purple-800">HP</TableHead>
                  <TableHead className="font-bold text-purple-800">Kunjungan</TableHead>
                  <TableHead className="font-bold text-purple-800 text-center">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pasienList.map((pasien) => (
                  <TableRow key={pasien.id} className="hover:bg-purple-50/50 transition-colors">
                    <TableCell>
                      <div>
                        <p className="font-medium">{pasien.namaDisplay}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      {pasien.gender === 'lelaki'
                        ? 'L'
                        : pasien.gender === 'perempuan'
                          ? 'P'
                          : '-'}
                    </TableCell>
                    <TableCell>
                      {pasien.tanggalLahir
                        ? `${Math.floor((Date.now() - new Date(pasien.tanggalLahir).getTime()) / (365.25 * 24 * 60 * 60 * 1000))} th`
                        : '-'}
                    </TableCell>
                    <TableCell>
                      {[
                        pasien.alamatRT && `RT ${pasien.alamatRT}`,
                        formatRW(pasien.alamatRW),
                      ]
                        .filter(Boolean)
                        .join(', ') || '-'}
                    </TableCell>
                    <TableCell>{pasien.nomerHandphone || '-'}</TableCell>
                    <TableCell>
                      <Badge className="bg-purple-100 text-purple-700">
                        {pasien.jumlahKunjunganKlinik || 0}x
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-center gap-2">
                        <Button
                          asChild
                          size="sm"
                          className="h-8 rounded-lg font-semibold bg-gradient-to-r from-purple-600 to-indigo-600 text-white"
                        >
                          <Link href={`/pasien/${pasien.id}`}>Detail</Link>
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(pasien)}
                          className="h-8 rounded-lg"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        )}

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="flex items-center justify-between mt-6">
            <p className="text-sm text-gray-600">
              Menampilkan {(pagination.page - 1) * pagination.limit + 1} -{' '}
              {Math.min(pagination.page * pagination.limit, pagination.total)} dari{' '}
              {pagination.total} pasien
            </p>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={pagination.page === 1}
                onClick={() => setPagination((prev) => ({ ...prev, page: prev.page - 1 }))}
                className="rounded-xl"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="text-sm">
                Halaman {pagination.page} dari {pagination.totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                disabled={pagination.page === pagination.totalPages}
                onClick={() => setPagination((prev) => ({ ...prev, page: prev.page + 1 }))}
                className="rounded-xl"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!loading && pasienList.length === 0 && (
          <Card className="border-2 border-dashed border-purple-300 rounded-2xl">
            <CardContent className="py-12 text-center">
              <Stethoscope className="h-12 w-12 mx-auto text-purple-300 mb-4" />
              <h3 className="text-lg font-semibold text-purple-700 mb-2">Belum Ada Data Pasien</h3>
              <p className="text-purple-600 mb-4">
                Mulai tambahkan data pasien untuk mengelola rekam medis.
              </p>
              <Button
                onClick={handleAddNew}
                className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-indigo-600 hover:to-purple-600 text-white rounded-xl"
              >
                <Plus className="h-4 w-4 mr-2" />
                Tambah Pasien Pertama
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Form Dialog */}
      <JamaahFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        jamaah={editingPasien}
        onSuccess={handleDialogSuccess}
        mode="poliklinik"
      />
    </div>
  );
}
