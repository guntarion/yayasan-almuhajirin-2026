// src/app/units/poliklinik/pasien-klinik/page.tsx
'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import {
  Users,
  Search,
  Plus,
  ChevronLeft,
  ChevronRight,
  Edit,
  Eye,
  Phone,
  AlertTriangle,
  UserCheck,
  UserX,
  Calendar,
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
import { PasienFormDialog } from '@/components/poliklinik/PasienFormDialog';
import { PasienKlinikWithRelations, formatUmur, GENDER_OPTIONS } from '@/types/poliklinik';

export default function PasienKlinikPage() {
  const [pasienList, setPasienList] = useState<PasienKlinikWithRelations[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [jenisKelamin, setJenisKelamin] = useState('');
  const [isAktif, setIsAktif] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  // Dialog state
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editPasien, setEditPasien] = useState<PasienKlinikWithRelations | null>(null);

  // Stats
  const [stats, setStats] = useState({
    total: 0,
    aktif: 0,
    nonAktif: 0,
    punyaAlergi: 0,
  });

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        pageSize: '15',
      });

      if (search) params.append('search', search);
      if (jenisKelamin) params.append('jenisKelamin', jenisKelamin);
      if (isAktif) params.append('isAktif', isAktif);

      const res = await fetch(`/api/poliklinik/pasien?${params}`);
      const data = await res.json();

      setPasienList(data.data || []);
      setTotalPages(data.totalPages || 1);
      setTotal(data.total || 0);
    } catch (error) {
      console.error('Error fetching pasien:', error);
    } finally {
      setLoading(false);
    }
  }, [page, search, jenisKelamin, isAktif]);

  const fetchStats = async () => {
    try {
      // Fetch all stats in parallel
      const [totalRes, aktifRes] = await Promise.all([
        fetch('/api/poliklinik/pasien?pageSize=1'),
        fetch('/api/poliklinik/pasien?isAktif=true&pageSize=1'),
      ]);

      const totalData = await totalRes.json();
      const aktifData = await aktifRes.json();

      setStats({
        total: totalData.total || 0,
        aktif: aktifData.total || 0,
        nonAktif: (totalData.total || 0) - (aktifData.total || 0),
        punyaAlergi: 0, // TODO: Add filter for this
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    fetchStats();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchData();
  };

  const handleEdit = (pasien: PasienKlinikWithRelations) => {
    setEditPasien(pasien);
    setDialogOpen(true);
  };

  const handleAdd = () => {
    setEditPasien(null);
    setDialogOpen(true);
  };

  const handleSuccess = () => {
    fetchData();
    fetchStats();
  };

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
                <Users className="h-8 w-8" />
                Data Pasien
              </h1>
              <p className="text-purple-200 mt-1">Kelola data pasien Poliklinik Al Muhajirin</p>
            </div>
            <Button
              onClick={handleAdd}
              className="bg-white text-purple-700 hover:bg-purple-50"
            >
              <Plus className="h-4 w-4 mr-2" />
              Pasien Baru
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="pt-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Total Pasien</p>
                  <p className="text-2xl font-bold text-purple-700">{stats.total}</p>
                </div>
                <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center">
                  <Users className="h-5 w-5 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Pasien Aktif</p>
                  <p className="text-2xl font-bold text-green-700">{stats.aktif}</p>
                </div>
                <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                  <UserCheck className="h-5 w-5 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Non-Aktif</p>
                  <p className="text-2xl font-bold text-gray-700">{stats.nonAktif}</p>
                </div>
                <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center">
                  <UserX className="h-5 w-5 text-gray-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Punya Alergi</p>
                  <p className="text-2xl font-bold text-red-700">{stats.punyaAlergi}</p>
                </div>
                <div className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center">
                  <AlertTriangle className="h-5 w-5 text-red-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">Filter & Pencarian</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <Input
                  placeholder="Cari nama, No. RM, atau HP..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full"
                />
              </div>

              <Select value={jenisKelamin || 'all'} onValueChange={(v) => setJenisKelamin(v === 'all' ? '' : v)}>
                <SelectTrigger className="w-full md:w-40">
                  <SelectValue placeholder="Jenis Kelamin" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua</SelectItem>
                  {GENDER_OPTIONS.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={isAktif || 'all'} onValueChange={(v) => setIsAktif(v === 'all' ? '' : v)}>
                <SelectTrigger className="w-full md:w-40">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua</SelectItem>
                  <SelectItem value="true">Aktif</SelectItem>
                  <SelectItem value="false">Non-Aktif</SelectItem>
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
                    <TableHead className="font-semibold">No. RM</TableHead>
                    <TableHead className="font-semibold">Nama Pasien</TableHead>
                    <TableHead className="font-semibold">L/P</TableHead>
                    <TableHead className="font-semibold">Umur</TableHead>
                    <TableHead className="font-semibold">Telepon</TableHead>
                    <TableHead className="font-semibold">Kunjungan</TableHead>
                    <TableHead className="font-semibold">Status</TableHead>
                    <TableHead className="font-semibold text-right">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-8">
                        <div className="flex items-center justify-center">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : pasienList.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                        Tidak ada data pasien
                      </TableCell>
                    </TableRow>
                  ) : (
                    pasienList.map((pasien) => (
                      <TableRow key={pasien.id} className="hover:bg-purple-50/50">
                        <TableCell className="font-mono text-sm">{pasien.nomorRM}</TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium">{pasien.namaLengkap}</p>
                            {pasien.riwayatAlergi && (
                              <div className="flex items-center gap-1 text-red-600 text-xs mt-1">
                                <AlertTriangle className="h-3 w-3" />
                                <span>Alergi: {pasien.riwayatAlergi.substring(0, 30)}...</span>
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className={pasien.jenisKelamin === 'lelaki' ? 'border-blue-300 text-blue-700' : 'border-pink-300 text-pink-700'}>
                            {pasien.jenisKelamin === 'lelaki' ? 'L' : 'P'}
                          </Badge>
                        </TableCell>
                        <TableCell>{formatUmur(pasien.tanggalLahir)}</TableCell>
                        <TableCell>
                          {pasien.nomorHP ? (
                            <span className="flex items-center gap-1 text-sm">
                              <Phone className="h-3 w-3" />
                              {pasien.nomorHP}
                            </span>
                          ) : (
                            '-'
                          )}
                        </TableCell>
                        <TableCell>
                          <span className="flex items-center gap-1 text-sm">
                            <Calendar className="h-3 w-3" />
                            {pasien._count?.kunjungan || 0}x
                          </span>
                        </TableCell>
                        <TableCell>
                          <Badge className={pasien.isAktif ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                            {pasien.isAktif ? 'Aktif' : 'Non-Aktif'}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Link href={`/units/poliklinik/pasien-klinik/${pasien.id}`}>
                              <Button variant="ghost" size="sm" className="text-purple-600 hover:text-purple-800">
                                <Eye className="h-4 w-4" />
                              </Button>
                            </Link>
                            <Button variant="ghost" size="sm" onClick={() => handleEdit(pasien)} className="text-gray-600 hover:text-gray-800">
                              <Edit className="h-4 w-4" />
                            </Button>
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
                  Menampilkan {pasienList.length} dari {total} pasien
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

      {/* Form Dialog */}
      <PasienFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        pasien={editPasien}
        onSuccess={handleSuccess}
      />
    </div>
  );
}
