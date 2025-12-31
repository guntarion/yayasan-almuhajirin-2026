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
import { Progress } from '@/components/ui/progress';
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
  Baby,
} from 'lucide-react';
import {
  PendaftaranWithRelations,
  PAKET_LAYANAN_OPTIONS,
  STATUS_PENDAFTARAN_OPTIONS,
  formatTanggalSingkat,
  formatRupiah,
  getStatusColor,
  getPaketLabel,
  getPaketColor,
} from '@/types/daycare';
import { PendaftaranFormDialog } from '@/components/daycare/PendaftaranFormDialog';

interface PendaftaranStats {
  totalPendaftaran: number;
  totalAktif: number;
  totalBelumLunas: number;
  totalPemasukan: number;
}

export default function PendaftaranListPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [pendaftaranList, setPendaftaranList] = useState<(PendaftaranWithRelations & { _totalBayar: number; _sisaTagihan: number })[]>([]);
  const [stats, setStats] = useState<PendaftaranStats>({
    totalPendaftaran: 0,
    totalAktif: 0,
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
  const [filterPaket, setFilterPaket] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  // Dialogs
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchPendaftaran = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        pageSize: pageSize.toString(),
      });

      if (searchQuery) params.append('search', searchQuery);
      if (filterPaket !== 'all') params.append('paketDipilih', filterPaket);
      if (filterStatus !== 'all') params.append('status', filterStatus);

      const response = await fetch(`/api/daycare/pendaftaran?${params.toString()}`);
      const data = await response.json();

      if (response.ok) {
        setPendaftaranList(data.data || []);
        setTotalPages(data.totalPages || 1);
        setTotalItems(data.total || 0);

        // Calculate stats
        const allData = data.data || [];
        const totalAktif = allData.filter((p: { status: string }) => p.status === 'aktif').length;
        const totalBelumLunas = allData.filter((p: { _sisaTagihan: number }) => p._sisaTagihan > 0).length;
        const totalPemasukan = allData.reduce((sum: number, p: { _totalBayar: number }) => sum + (p._totalBayar || 0), 0);

        setStats({
          totalPendaftaran: data.total || 0,
          totalAktif,
          totalBelumLunas,
          totalPemasukan,
        });
      }
    } catch (error) {
      console.error('Error fetching pendaftaran:', error);
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, searchQuery, filterPaket, filterStatus]);

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
      const response = await fetch(`/api/daycare/pendaftaran/${deleteId}`, {
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

  const getPaymentBadge = (pendaftaran: { _sisaTagihan: number; _totalBayar: number }) => {
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

  const getProgressPercent = (pendaftaran: { biayaPendaftaran: number | { toNumber: () => number }; _totalBayar: number }) => {
    const biaya = typeof pendaftaran.biayaPendaftaran === 'object'
      ? pendaftaran.biayaPendaftaran.toNumber()
      : Number(pendaftaran.biayaPendaftaran);
    const bayar = pendaftaran._totalBayar || 0;
    return biaya > 0 ? Math.min((bayar / biaya) * 100, 100) : 0;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#006064]">Pendaftaran</h1>
          <p className="text-gray-600">Kelola pendaftaran anak Daycare</p>
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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Pendaftaran</CardTitle>
            <Users className="h-4 w-4 text-[#00BCD4]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalPendaftaran}</div>
            <p className="text-xs text-gray-500">Semua pendaftaran</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Aktif</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.totalAktif}</div>
            <p className="text-xs text-gray-500">Anak aktif terdaftar</p>
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
            <div className="text-2xl font-bold text-[#006064]">{formatRupiah(stats.totalPemasukan)}</div>
            <p className="text-xs text-gray-500">Dari biaya pendaftaran</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Filter & Pencarian</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Cari nama anak..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            <Select value={filterPaket} onValueChange={setFilterPaket}>
              <SelectTrigger>
                <SelectValue placeholder="Paket Layanan" />
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
              <Baby className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p>Tidak ada data pendaftaran</p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Tanggal Daftar</TableHead>
                      <TableHead>Nama Anak</TableHead>
                      <TableHead>Paket</TableHead>
                      <TableHead className="text-right">Biaya</TableHead>
                      <TableHead>Pembayaran</TableHead>
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
                            <div className="font-medium">{pendaftaran.anak?.namaLengkap}</div>
                            <div className="text-sm text-gray-500">{pendaftaran.anak?.nomorInduk}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={getPaketColor(pendaftaran.paketDipilih)}>
                            {getPaketLabel(pendaftaran.paketDipilih)}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          {formatRupiah(Number(pendaftaran.biayaPendaftaran))}
                        </TableCell>
                        <TableCell>
                          <div className="space-y-2 min-w-[180px]">
                            <div className="flex justify-between text-sm">
                              <span className="text-green-600">{formatRupiah(pendaftaran._totalBayar || 0)}</span>
                              <span className="text-red-600">{formatRupiah(pendaftaran._sisaTagihan || 0)}</span>
                            </div>
                            <Progress
                              value={getProgressPercent(pendaftaran)}
                              className="h-2"
                            />
                            {getPaymentBadge(pendaftaran)}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(pendaftaran.status)}>
                            {STATUS_PENDAFTARAN_OPTIONS.find((s) => s.value === pendaftaran.status)?.label || pendaftaran.status}
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
                                <Link href={`/units/daycare/kelola/pendaftaran/${pendaftaran.id}`}>
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
              Apakah Anda yakin ingin menghapus pendaftaran ini? Pendaftaran yang sudah memiliki pembayaran tidak dapat dihapus.
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
