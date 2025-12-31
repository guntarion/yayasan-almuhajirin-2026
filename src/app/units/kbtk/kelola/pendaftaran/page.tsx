'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  Plus,
  Search,
  MoreHorizontal,
  Eye,
  Trash2,
  Users,
  CheckCircle,
  AlertCircle,
  DollarSign,
  Loader2,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import {
  KbtkPendaftaranWithRelations,
  getTahunAjaranOptions,
  getTahunAjaranSekarang,
  KELOMPOK_LEVEL_OPTIONS,
  STATUS_PENDAFTARAN_OPTIONS,
  formatTanggalSingkat,
  formatCurrency,
  getStatusPendaftaranColor,
} from '@/types/kbtk';
import { PendaftaranFormDialog } from '@/components/kbtk';

interface PendaftaranStats {
  totalPendaftaran: number;
  totalDiterima: number;
  totalBelumLunas: number;
  totalPemasukan: number;
}

export default function PendaftaranListPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [pendaftaranList, setPendaftaranList] = useState<KbtkPendaftaranWithRelations[]>([]);
  const [stats, setStats] = useState<PendaftaranStats>({
    totalPendaftaran: 0,
    totalDiterima: 0,
    totalBelumLunas: 0,
    totalPemasukan: 0,
  });

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const pageSize = 10;

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [filterTahunAjaran, setFilterTahunAjaran] = useState(getTahunAjaranSekarang());
  const [filterProgram, setFilterProgram] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterLunas, setFilterLunas] = useState('all');

  // Dialogs
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const tahunAjaranOptions = getTahunAjaranOptions(5);

  const fetchPendaftaran = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        pageSize: pageSize.toString(),
      });

      if (searchQuery) params.append('search', searchQuery);
      if (filterTahunAjaran !== 'all') params.append('tahunAjaran', filterTahunAjaran);
      if (filterProgram !== 'all') params.append('program', filterProgram);
      if (filterStatus !== 'all') params.append('status', filterStatus);
      if (filterLunas !== 'all') params.append('lunas', filterLunas);

      const response = await fetch(`/api/kbtk/pendaftaran?${params.toString()}`);
      const data = await response.json();

      if (response.ok) {
        setPendaftaranList(data.data || []);
        setTotalPages(data.totalPages || 1);
        setTotalItems(data.total || 0);
        setStats(data.stats || {
          totalPendaftaran: 0,
          totalDiterima: 0,
          totalBelumLunas: 0,
          totalPemasukan: 0,
        });
      }
    } catch (error) {
      console.error('Error fetching pendaftaran:', error);
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, searchQuery, filterTahunAjaran, filterProgram, filterStatus, filterLunas]);

  useEffect(() => {
    fetchPendaftaran();
  }, [fetchPendaftaran]);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setCurrentPage(1);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleDelete = async () => {
    if (!deleteId) return;

    setIsDeleting(true);
    try {
      const response = await fetch(`/api/kbtk/pendaftaran/${deleteId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        fetchPendaftaran();
      } else {
        const data = await response.json();
        alert(data.error || 'Gagal menghapus pendaftaran');
      }
    } catch (error) {
      console.error('Error deleting pendaftaran:', error);
      alert('Terjadi kesalahan saat menghapus');
    } finally {
      setIsDeleting(false);
      setDeleteId(null);
    }
  };

  const getPaymentBadge = (pendaftaran: KbtkPendaftaranWithRelations) => {
    const sisaTagihan = pendaftaran._sisaTagihan ?? 0;
    const totalBayar = pendaftaran._totalBayar ?? 0;

    if (sisaTagihan <= 0) {
      return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Lunas</Badge>;
    }
    if (totalBayar > 0) {
      return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Sebagian</Badge>;
    }
    return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Belum Bayar</Badge>;
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#006064]">Pendaftaran</h1>
          <p className="text-gray-600">Kelola pendaftaran siswa KBTK</p>
        </div>
        <Button
          onClick={() => setShowAddDialog(true)}
          className="bg-[#00BCD4] hover:bg-[#006064]"
        >
          <Plus className="w-4 h-4 mr-2" />
          Pendaftaran Baru
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Pendaftaran</CardTitle>
            <Users className="h-4 w-4 text-[#00BCD4]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalPendaftaran}</div>
            <p className="text-xs text-gray-500">TA {filterTahunAjaran !== 'all' ? filterTahunAjaran : 'Semua'}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Diterima</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.totalDiterima}</div>
            <p className="text-xs text-gray-500">Siswa diterima</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Belum Lunas</CardTitle>
            <AlertCircle className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{stats.totalBelumLunas}</div>
            <p className="text-xs text-gray-500">Masih ada sisa tagihan</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Pemasukan</CardTitle>
            <DollarSign className="h-4 w-4 text-[#00BCD4]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#006064]">{formatCurrency(stats.totalPemasukan)}</div>
            <p className="text-xs text-gray-500">Dari biaya pendaftaran</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Filter & Pencarian</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Cari nama siswa..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            <Select value={filterTahunAjaran} onValueChange={setFilterTahunAjaran}>
              <SelectTrigger>
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

            <Select value={filterProgram} onValueChange={setFilterProgram}>
              <SelectTrigger>
                <SelectValue placeholder="Program" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Program</SelectItem>
                {KELOMPOK_LEVEL_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Status</SelectItem>
                {STATUS_PENDAFTARAN_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={filterLunas} onValueChange={setFilterLunas}>
              <SelectTrigger>
                <SelectValue placeholder="Pembayaran" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua</SelectItem>
                <SelectItem value="lunas">Lunas</SelectItem>
                <SelectItem value="belum">Belum Lunas</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardHeader>
          <CardTitle>Daftar Pendaftaran</CardTitle>
          <CardDescription>
            Menampilkan {pendaftaranList.length} dari {totalItems} pendaftaran
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-[#00BCD4]" />
            </div>
          ) : pendaftaranList.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <Users className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p>Tidak ada data pendaftaran</p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Tanggal Daftar</TableHead>
                      <TableHead>Siswa</TableHead>
                      <TableHead>Program</TableHead>
                      <TableHead className="text-right">Biaya</TableHead>
                      <TableHead className="text-right">Sudah Bayar / Sisa</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Aksi</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pendaftaranList.map((pendaftaran) => (
                      <TableRow key={pendaftaran.id}>
                        <TableCell className="whitespace-nowrap">
                          {formatTanggalSingkat(pendaftaran.tanggalDaftar)}
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">{pendaftaran.siswa?.namaLengkap}</div>
                            <div className="text-sm text-gray-500">{pendaftaran.siswa?.nomorInduk}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{pendaftaran.program}</Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          {formatCurrency(Number(pendaftaran.biayaPendaftaran))}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="space-y-1">
                            <div className="text-green-600">
                              {formatCurrency(pendaftaran._totalBayar || 0)}
                            </div>
                            <div className="text-sm text-red-600">
                              {formatCurrency(pendaftaran._sisaTagihan || 0)}
                            </div>
                            {getPaymentBadge(pendaftaran)}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={getStatusPendaftaranColor(pendaftaran.status)}>
                            {STATUS_PENDAFTARAN_OPTIONS.find((s) => s.value === pendaftaran.status)?.label}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreHorizontal className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem asChild>
                                <Link href={`/units/kbtk/kelola/pendaftaran/${pendaftaran.id}`}>
                                  <Eye className="w-4 h-4 mr-2" />
                                  Lihat Detail
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                className="text-red-600"
                                onClick={() => setDeleteId(pendaftaran.id)}
                              >
                                <Trash2 className="w-4 h-4 mr-2" />
                                Hapus
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between mt-4">
                  <p className="text-sm text-gray-500">
                    Halaman {currentPage} dari {totalPages}
                  </p>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                      disabled={currentPage === totalPages}
                    >
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* Add Dialog */}
      <PendaftaranFormDialog
        open={showAddDialog}
        onOpenChange={setShowAddDialog}
        onSuccess={() => {
          fetchPendaftaran();
        }}
      />

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Pendaftaran?</AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin ingin menghapus pendaftaran ini? Data pembayaran yang terkait juga akan dihapus.
              Tindakan ini tidak dapat dibatalkan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Menghapus...
                </>
              ) : (
                'Hapus'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
