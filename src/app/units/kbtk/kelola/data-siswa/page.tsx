'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
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
import { SiswaFormDialog } from '@/components/kbtk/SiswaFormDialog';
import {
  KbtkSiswaWithRelations,
  KELOMPOK_LEVEL_OPTIONS,
  KELOMPOK_KELAS_OPTIONS,
  STATUS_SISWA_OPTIONS,
  getTahunAjaranOptions,
  getTahunAjaranSekarang,
  formatUmur,
  formatKelompok,
  getStatusSiswaColor,
} from '@/types/kbtk';
import {
  Users,
  Baby,
  GraduationCap,
  UserCheck,
  Plus,
  Search,
  Eye,
  Edit,
  ChevronLeft,
  ChevronRight,
  Loader2,
} from 'lucide-react';
import { toast } from 'sonner';

interface SiswaListResponse {
  data: KbtkSiswaWithRelations[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  stats: {
    total: number;
    kb: number;
    tk: number;
    aktif: number;
  };
}

export default function DataSiswaPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [siswaList, setSiswaList] = useState<KbtkSiswaWithRelations[]>([]);
  const [stats, setStats] = useState({ total: 0, kb: 0, tk: 0, aktif: 0 });
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 10,
    total: 0,
    totalPages: 0,
  });

  // Filters
  const [search, setSearch] = useState('');
  const [kelompokLevel, setKelompokLevel] = useState('all');
  const [kelompokKelas, setKelompokKelas] = useState('all');
  const [status, setStatus] = useState('all');
  const [tahunAjaran, setTahunAjaran] = useState(getTahunAjaranSekarang());

  // Dialog
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingSiswa, setEditingSiswa] = useState<KbtkSiswaWithRelations | null>(null);

  const tahunAjaranOptions = getTahunAjaranOptions(5);

  const fetchSiswa = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams({
        page: pagination.page.toString(),
        pageSize: pagination.pageSize.toString(),
        search,
        kelompokLevel,
        kelompokKelas,
        status,
        tahunAjaran,
      });

      const response = await fetch(`/api/kbtk/siswa?${params}`);
      if (!response.ok) throw new Error('Failed to fetch siswa');

      const data: SiswaListResponse = await response.json();
      setSiswaList(data.data);
      setStats(data.stats);
      setPagination((prev) => ({
        ...prev,
        total: data.total,
        totalPages: data.totalPages,
      }));
    } catch (error) {
      console.error('Error fetching siswa:', error);
      toast.error('Gagal mengambil data siswa');
    } finally {
      setIsLoading(false);
    }
  }, [pagination.page, pagination.pageSize, search, kelompokLevel, kelompokKelas, status, tahunAjaran]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchSiswa();
    }, 300);
    return () => clearTimeout(timer);
  }, [fetchSiswa]);

  const handleOpenEdit = (siswa: KbtkSiswaWithRelations) => {
    setEditingSiswa(siswa);
    setIsFormOpen(true);
  };

  const handleOpenCreate = () => {
    setEditingSiswa(null);
    setIsFormOpen(true);
  };

  const handleFormSuccess = () => {
    fetchSiswa();
    setEditingSiswa(null);
  };

  const handleViewDetail = (id: string) => {
    router.push(`/units/kbtk/kelola/data-siswa/${id}`);
  };

  const statsCards = [
    {
      title: 'Total Siswa',
      value: stats.total,
      icon: Users,
      color: 'from-[#00BCD4] to-[#006064]',
    },
    {
      title: 'Kelompok Bermain',
      value: stats.kb,
      icon: Baby,
      color: 'from-pink-400 to-pink-600',
    },
    {
      title: 'Taman Kanak-kanak',
      value: stats.tk,
      icon: GraduationCap,
      color: 'from-purple-400 to-purple-600',
    },
    {
      title: 'Siswa Aktif',
      value: stats.aktif,
      icon: UserCheck,
      color: 'from-green-400 to-green-600',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-[#00BCD4]/5">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#006064] mb-2">Data Siswa</h1>
          <p className="text-gray-600">
            Kelola data siswa KBTK Al Muhajirin Rewwin
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {statsCards.map((stat) => (
            <Card
              key={stat.title}
              className="border-0 shadow-lg rounded-2xl overflow-hidden"
            >
              <div className={`bg-gradient-to-r ${stat.color} p-4`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white/80 text-sm font-medium">
                      {stat.title}
                    </p>
                    <p className="text-white text-3xl font-bold mt-1">
                      {stat.value}
                    </p>
                  </div>
                  <div className="bg-white/20 rounded-full p-3">
                    <stat.icon className="w-6 h-6 text-white" />
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Filters & Actions */}
        <Card className="mb-6 border-0 shadow-lg rounded-2xl">
          <CardHeader className="border-b bg-gradient-to-r from-[#00BCD4]/10 to-transparent">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <CardTitle className="text-lg text-[#006064]">
                Daftar Siswa
              </CardTitle>
              <Button
                onClick={handleOpenCreate}
                className="bg-[#00BCD4] hover:bg-[#006064] text-white rounded-xl"
              >
                <Plus className="w-4 h-4 mr-2" />
                Tambah Siswa
              </Button>
            </div>
          </CardHeader>
          <CardContent className="pt-4">
            {/* Filter Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4 mb-6">
              <div className="lg:col-span-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Cari nama atau nomor induk..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-10 rounded-xl"
                  />
                </div>
              </div>

              <Select value={tahunAjaran} onValueChange={setTahunAjaran}>
                <SelectTrigger className="rounded-xl">
                  <SelectValue placeholder="Tahun Ajaran" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Tahun</SelectItem>
                  {tahunAjaranOptions.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={kelompokLevel} onValueChange={setKelompokLevel}>
                <SelectTrigger className="rounded-xl">
                  <SelectValue placeholder="Kelompok" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Kelompok</SelectItem>
                  {KELOMPOK_LEVEL_OPTIONS.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={kelompokKelas} onValueChange={setKelompokKelas}>
                <SelectTrigger className="rounded-xl">
                  <SelectValue placeholder="Kelas" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Kelas</SelectItem>
                  {KELOMPOK_KELAS_OPTIONS.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger className="rounded-xl">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Status</SelectItem>
                  {STATUS_SISWA_OPTIONS.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Table */}
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 text-[#00BCD4] animate-spin" />
              </div>
            ) : siswaList.length === 0 ? (
              <div className="text-center py-12">
                <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 text-lg">Tidak ada data siswa</p>
                <p className="text-gray-400 text-sm">
                  Coba ubah filter atau tambah siswa baru
                </p>
              </div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-gray-50">
                        <TableHead className="font-semibold">No. Induk</TableHead>
                        <TableHead className="font-semibold">Nama</TableHead>
                        <TableHead className="font-semibold">Kelompok</TableHead>
                        <TableHead className="font-semibold">Umur</TableHead>
                        <TableHead className="font-semibold">Status</TableHead>
                        <TableHead className="font-semibold text-center">Aksi</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {siswaList.map((siswa) => (
                        <TableRow
                          key={siswa.id}
                          className="hover:bg-[#00BCD4]/5 cursor-pointer"
                          onClick={() => handleViewDetail(siswa.id)}
                        >
                          <TableCell className="font-mono text-sm">
                            {siswa.nomorInduk}
                          </TableCell>
                          <TableCell>
                            <div>
                              <p className="font-medium text-[#006064]">
                                {siswa.namaLengkap}
                              </p>
                              {siswa.namaPanggilan && (
                                <p className="text-sm text-gray-500">
                                  ({siswa.namaPanggilan})
                                </p>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant="outline"
                              className={`${
                                siswa.kelompokLevel === 'KB'
                                  ? 'border-pink-500 text-pink-600 bg-pink-50'
                                  : 'border-purple-500 text-purple-600 bg-purple-50'
                              }`}
                            >
                              {formatKelompok(siswa.kelompokLevel, siswa.kelompokKelas)}
                            </Badge>
                          </TableCell>
                          <TableCell>{formatUmur(siswa.tanggalLahir)}</TableCell>
                          <TableCell>
                            <Badge className={getStatusSiswaColor(siswa.status)}>
                              {STATUS_SISWA_OPTIONS.find((s) => s.value === siswa.status)
                                ?.label || siswa.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div
                              className="flex items-center justify-center gap-2"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleViewDetail(siswa.id)}
                                className="border-[#00BCD4] text-[#006064] hover:bg-[#00BCD4]/10"
                              >
                                <Eye className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleOpenEdit(siswa)}
                                className="border-[#00BCD4] text-[#006064] hover:bg-[#00BCD4]/10"
                              >
                                <Edit className="w-4 h-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                {/* Pagination */}
                <div className="flex items-center justify-between mt-4 pt-4 border-t">
                  <p className="text-sm text-gray-600">
                    Menampilkan {(pagination.page - 1) * pagination.pageSize + 1}-
                    {Math.min(pagination.page * pagination.pageSize, pagination.total)} dari{' '}
                    {pagination.total} siswa
                  </p>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        setPagination((prev) => ({ ...prev, page: prev.page - 1 }))
                      }
                      disabled={pagination.page === 1}
                      className="rounded-xl"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </Button>
                    <span className="text-sm text-gray-600">
                      {pagination.page} / {pagination.totalPages}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        setPagination((prev) => ({ ...prev, page: prev.page + 1 }))
                      }
                      disabled={pagination.page >= pagination.totalPages}
                      className="rounded-xl"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Form Dialog */}
      <SiswaFormDialog
        open={isFormOpen}
        onOpenChange={(open) => {
          setIsFormOpen(open);
          if (!open) setEditingSiswa(null);
        }}
        siswa={editingSiswa}
        onSuccess={handleFormSuccess}
      />
    </div>
  );
}
