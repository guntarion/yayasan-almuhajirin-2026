// src/app/units/masjid/jamaah/page.tsx
'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import {
  Users,
  Plus,
  Search,
  Filter,
  LayoutGrid,
  Table2,
  Eye,
  Edit,
  MapPin,
  Phone,
  Heart,
  Stethoscope,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
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

export default function MasjidJamaahPage() {
  const [jamaahList, setJamaahList] = useState<Jamaah[]>([]);
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
  const [filterAktif, setFilterAktif] = useState('');

  // UI State
  const [viewMode, setViewMode] = useState<'card' | 'table'>('table');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingJamaah, setEditingJamaah] = useState<Jamaah | null>(null);

  const fetchJamaah = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.append('page', pagination.page.toString());
      params.append('limit', pagination.limit.toString());
      if (search) params.append('search', search);
      if (filterRW) params.append('alamatRW', filterRW);
      if (filterGender) params.append('gender', filterGender);
      if (filterAktif) params.append('isJamaahAktif', filterAktif);

      const response = await fetch(`/api/jamaah?${params.toString()}`);
      const result = await response.json();

      if (response.ok) {
        setJamaahList(result.data);
        setPagination(result.pagination);
      }
    } catch (error) {
      console.error('Error fetching jamaah:', error);
    } finally {
      setLoading(false);
    }
  }, [pagination.page, pagination.limit, search, filterRW, filterGender, filterAktif]);

  useEffect(() => {
    fetchJamaah();
  }, [fetchJamaah]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPagination((prev) => ({ ...prev, page: 1 }));
    fetchJamaah();
  };

  const handleEdit = (jamaah: Jamaah) => {
    setEditingJamaah(jamaah);
    setDialogOpen(true);
  };

  const handleAddNew = () => {
    setEditingJamaah(null);
    setDialogOpen(true);
  };

  const handleDialogSuccess = () => {
    fetchJamaah();
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
  const totalJamaah = pagination.total;
  const jamaahAktif = jamaahList.filter((j) => j.isJamaahAktif).length;
  const donaturCount = jamaahList.filter((j) => j.isDonatur).length;
  const pengunjungKlinik = jamaahList.filter((j) => j.isPengunjungKlinik).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#B2EBF2]/5 to-[#80DEEA]/5">
      {/* Header */}
      <div className="relative overflow-hidden bg-gradient-to-r from-white via-[#B2EBF2]/20 to-[#80DEEA]/20 px-4 sm:px-6 lg:px-8 py-6 rounded-b-3xl border-b border-[#00BCD4]/10">
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-gradient-to-br from-[#00BCD4]/20 to-[#80DEEA]/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-12 -left-12 w-32 h-32 bg-gradient-to-tr from-[#B2EBF2]/30 to-[#00BCD4]/20 rounded-full blur-2xl" />

        <div className="relative z-10 container mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-1 h-8 bg-gradient-to-b from-[#00BCD4] to-[#006064] rounded-full" />
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-[#006064]">Data Jamaah</h1>
                <p className="text-sm text-gray-600">Kelola data jamaah Masjid Al Muhajirin</p>
              </div>
            </div>
            <Button
              onClick={handleAddNew}
              className="bg-gradient-to-r from-[#00BCD4] to-[#006064] hover:from-[#006064] hover:to-[#00BCD4] text-white rounded-xl shadow-lg"
            >
              <Plus className="h-4 w-4 mr-2" />
              Tambah Jamaah
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <Card className="border-2 border-gray-100 rounded-2xl hover:shadow-lg hover:border-[#00BCD4]/40 transition-all duration-300 overflow-hidden">
            <div className="h-1 bg-gradient-to-r from-[#00BCD4] to-[#006064]" />
            <CardContent className="pt-4">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-xl bg-gradient-to-br from-[#B2EBF2] to-[#80DEEA]/50">
                  <Users className="h-6 w-6 text-[#006064]" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Jamaah</p>
                  <p className="text-2xl font-bold text-[#006064]">{totalJamaah}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 border-gray-100 rounded-2xl hover:shadow-lg hover:border-[#4CAF50]/40 transition-all duration-300 overflow-hidden">
            <div className="h-1 bg-gradient-to-r from-[#4CAF50] to-[#2E7D32]" />
            <CardContent className="pt-4">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-xl bg-gradient-to-br from-green-100 to-green-50">
                  <Users className="h-6 w-6 text-green-700" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Jamaah Aktif</p>
                  <p className="text-2xl font-bold text-green-700">{jamaahAktif}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 border-gray-100 rounded-2xl hover:shadow-lg hover:border-[#FFB300]/40 transition-all duration-300 overflow-hidden">
            <div className="h-1 bg-gradient-to-r from-[#FFB300] to-[#FF8F00]" />
            <CardContent className="pt-4">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-xl bg-gradient-to-br from-amber-100 to-amber-50">
                  <Heart className="h-6 w-6 text-amber-700" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Donatur</p>
                  <p className="text-2xl font-bold text-amber-700">{donaturCount}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 border-gray-100 rounded-2xl hover:shadow-lg hover:border-[#9C27B0]/40 transition-all duration-300 overflow-hidden">
            <div className="h-1 bg-gradient-to-r from-[#9C27B0] to-[#6A1B9A]" />
            <CardContent className="pt-4">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-xl bg-gradient-to-br from-purple-100 to-purple-50">
                  <Stethoscope className="h-6 w-6 text-purple-700" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Pengunjung Klinik</p>
                  <p className="text-2xl font-bold text-purple-700">{pengunjungKlinik}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-6 border-2 border-[#00BCD4]/10 rounded-2xl">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg flex items-center gap-2">
              <Filter className="h-5 w-5 text-[#00BCD4]" />
              <span className="text-[#006064]">Filter & Pencarian</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <div className="md:col-span-2 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Cari nama, HP, alamat..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10 border-2 focus:border-[#00BCD4] rounded-xl"
                />
              </div>

              <Select value={filterRW || 'all'} onValueChange={(v) => setFilterRW(v === 'all' ? '' : v)}>
                <SelectTrigger className="border-2 focus:border-[#00BCD4] rounded-xl">
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
                <SelectTrigger className="border-2 focus:border-[#00BCD4] rounded-xl">
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

              <Select value={filterAktif || 'all'} onValueChange={(v) => setFilterAktif(v === 'all' ? '' : v)}>
                <SelectTrigger className="border-2 focus:border-[#00BCD4] rounded-xl">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Status</SelectItem>
                  <SelectItem value="true">Aktif</SelectItem>
                  <SelectItem value="false">Tidak Aktif</SelectItem>
                </SelectContent>
              </Select>
            </form>

            <div className="flex items-center justify-between mt-4 pt-4 border-t">
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={fetchJamaah}
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
                  className={`rounded-lg ${viewMode === 'card' ? 'bg-gradient-to-r from-[#00BCD4] to-[#006064] text-white' : ''}`}
                >
                  <LayoutGrid className="h-4 w-4 mr-2" />
                  Kartu
                </Button>
                <Button
                  variant={viewMode === 'table' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('table')}
                  className={`rounded-lg ${viewMode === 'table' ? 'bg-gradient-to-r from-[#00BCD4] to-[#006064] text-white' : ''}`}
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
            {jamaahList.map((jamaah) => (
              <Card
                key={jamaah.id}
                className="group hover:shadow-2xl transition-all duration-500 cursor-pointer border border-gray-200 hover:border-[#00BCD4]/50 rounded-2xl overflow-hidden hover:scale-[1.02]"
              >
                <div className="bg-gradient-to-br from-[#00BCD4]/5 via-[#80DEEA]/5 to-[#B2EBF2]/5">
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg font-bold text-[#006064]">
                          {jamaah.namaDisplay}
                        </CardTitle>
                        <div className="flex items-center gap-2 mt-1">
                          {jamaah.gender && (
                            <Badge variant="outline" className="text-xs">
                              {jamaah.gender === 'lelaki' ? 'Laki-laki' : 'Perempuan'}
                            </Badge>
                          )}
                          {jamaah.isJamaahAktif ? (
                            <Badge className="bg-green-100 text-green-700 text-xs">Aktif</Badge>
                          ) : (
                            <Badge className="bg-gray-100 text-gray-600 text-xs">Tidak Aktif</Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-3">
                    {(jamaah.alamatRW || jamaah.alamatWilayah) && (
                      <div className="flex items-start text-sm text-gray-600">
                        <MapPin className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0 text-[#4CAF50]" />
                        <span>
                          {[
                            jamaah.alamatRT && `RT ${jamaah.alamatRT}`,
                            formatRW(jamaah.alamatRW),
                            jamaah.alamatWilayah === 'Rewwin' ? 'Rewwin' : jamaah.alamatDetail,
                          ]
                            .filter(Boolean)
                            .join(', ')}
                        </span>
                      </div>
                    )}

                    {jamaah.nomerHandphone && (
                      <div className="flex items-center text-sm text-gray-600">
                        <Phone className="h-4 w-4 mr-2 flex-shrink-0 text-[#00BCD4]" />
                        <span>{jamaah.nomerHandphone}</span>
                      </div>
                    )}

                    {jamaah.profesi && (
                      <p className="text-sm text-gray-500">Profesi: {jamaah.profesi}</p>
                    )}

                    <div className="flex gap-2 pt-2">
                      {jamaah.isDonatur && (
                        <Badge className="bg-amber-100 text-amber-700 text-xs">
                          <Heart className="h-3 w-3 mr-1" />
                          Donatur
                        </Badge>
                      )}
                      {jamaah.isPengunjungKlinik && (
                        <Badge className="bg-purple-100 text-purple-700 text-xs">
                          <Stethoscope className="h-3 w-3 mr-1" />
                          Pasien Klinik
                        </Badge>
                      )}
                    </div>

                    <div className="flex gap-2 pt-3 border-t">
                      <Button
                        asChild
                        size="sm"
                        className="flex-1 h-9 rounded-xl font-semibold shadow-lg transition-all duration-300 hover:shadow-xl bg-gradient-to-r from-[#00BCD4] to-[#006064] text-white"
                      >
                        <Link href={`/jamaah/${jamaah.id}`}>
                          <Eye className="h-4 w-4 mr-2" />
                          Detail
                        </Link>
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(jamaah)}
                        className="h-9 px-4 rounded-xl border-2 hover:bg-[#B2EBF2]/20 transition-all duration-300"
                        style={{ borderColor: '#00BCD4', color: '#006064' }}
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
          <Card className="border-2 border-[#00BCD4]/10 rounded-2xl overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-gradient-to-r from-[#00BCD4]/10 to-[#80DEEA]/10">
                  <TableHead className="font-bold text-[#006064]">Nama</TableHead>
                  <TableHead className="font-bold text-[#006064]">Gender</TableHead>
                  <TableHead className="font-bold text-[#006064]">Alamat</TableHead>
                  <TableHead className="font-bold text-[#006064]">HP</TableHead>
                  <TableHead className="font-bold text-[#006064]">Status</TableHead>
                  <TableHead className="font-bold text-[#006064] text-center">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {jamaahList.map((jamaah) => (
                  <TableRow key={jamaah.id} className="hover:bg-[#00BCD4]/5 transition-colors">
                    <TableCell>
                      <div>
                        <p className="font-medium">{jamaah.namaDisplay}</p>
                        {jamaah.profesi && (
                          <p className="text-xs text-gray-500">{jamaah.profesi}</p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      {jamaah.gender === 'lelaki'
                        ? 'L'
                        : jamaah.gender === 'perempuan'
                          ? 'P'
                          : '-'}
                    </TableCell>
                    <TableCell>
                      {[
                        jamaah.alamatRT && `RT ${jamaah.alamatRT}`,
                        formatRW(jamaah.alamatRW),
                      ]
                        .filter(Boolean)
                        .join(', ') || '-'}
                    </TableCell>
                    <TableCell>{jamaah.nomerHandphone || '-'}</TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {jamaah.isJamaahAktif ? (
                          <Badge className="bg-green-100 text-green-700 text-xs">Aktif</Badge>
                        ) : (
                          <Badge className="bg-gray-100 text-gray-600 text-xs">Tidak Aktif</Badge>
                        )}
                        {jamaah.isDonatur && (
                          <Badge className="bg-amber-100 text-amber-700 text-xs">Donatur</Badge>
                        )}
                        {jamaah.isPengunjungKlinik && (
                          <Badge className="bg-purple-100 text-purple-700 text-xs">Pasien</Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-center gap-2">
                        <Button
                          asChild
                          size="sm"
                          className="h-8 rounded-lg font-semibold bg-gradient-to-r from-[#00BCD4] to-[#006064] text-white"
                        >
                          <Link href={`/jamaah/${jamaah.id}`}>Detail</Link>
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(jamaah)}
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
              {pagination.total} jamaah
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
        {!loading && jamaahList.length === 0 && (
          <Card className="border-2 border-dashed border-gray-300 rounded-2xl">
            <CardContent className="py-12 text-center">
              <Users className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold text-gray-600 mb-2">Belum Ada Data Jamaah</h3>
              <p className="text-gray-500 mb-4">
                Mulai tambahkan data jamaah untuk mengelola komunitas masjid.
              </p>
              <Button
                onClick={handleAddNew}
                className="bg-gradient-to-r from-[#00BCD4] to-[#006064] hover:from-[#006064] hover:to-[#00BCD4] text-white rounded-xl"
              >
                <Plus className="h-4 w-4 mr-2" />
                Tambah Jamaah Pertama
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Form Dialog */}
      <JamaahFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        jamaah={editingJamaah}
        onSuccess={handleDialogSuccess}
        mode="masjid"
      />
    </div>
  );
}
