'use client';

import { useState, useEffect, useCallback } from 'react';
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
  FileText,
  Search,
  DollarSign,
  AlertCircle,
  CheckCircle,
  Loader2,
  ChevronLeft,
  ChevronRight,
  Receipt,
  Calendar,
  CreditCard,
  Trash2,
} from 'lucide-react';
import {
  STATUS_TAGIHAN_OPTIONS,
  formatRupiah,
  formatTanggal,
  getStatusColor,
} from '@/types/daycare';
import { GenerateTagihanHarianDialog } from '@/components/daycare/GenerateTagihanHarianDialog';
import { PembayaranHarianForm, TagihanHarianForPayment } from '@/components/daycare/PembayaranHarianForm';

interface TagihanHarianListItem {
  id: string;
  anakId: string;
  tanggal: string;
  nominal: number;
  status: string;
  catatan?: string;
  anak?: {
    id: string;
    nomorInduk: string;
    namaLengkap: string;
    namaPanggilan?: string | null;
    foto?: string | null;
    paketLayanan: string;
    orangTua?: { nama: string; nomorHP?: string }[];
  } | null;
  pembayaran: {
    id: string;
    nominal: number;
    tanggalBayar: string;
    metodePembayaran: string;
  }[];
  _totalBayar: number;
  _sisaTagihan: number;
}

interface TagihanStats {
  totalTagihan: number;
  totalTerbayar: number;
  totalTunggakan: number;
  totalLunas: number;
  totalBelumBayar: number;
}

export default function TagihanHarianPage() {
  const today = new Date();
  const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

  const [isLoading, setIsLoading] = useState(true);
  const [tagihanList, setTagihanList] = useState<TagihanHarianListItem[]>([]);
  const [stats, setStats] = useState<TagihanStats>({
    totalTagihan: 0,
    totalTerbayar: 0,
    totalTunggakan: 0,
    totalLunas: 0,
    totalBelumBayar: 0,
  });

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const pageSize = 20;

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [tanggalStart, setTanggalStart] = useState(
    firstDayOfMonth.toISOString().split('T')[0]
  );
  const [tanggalEnd, setTanggalEnd] = useState(
    today.toISOString().split('T')[0]
  );
  const [filterStatus, setFilterStatus] = useState('all');

  // Dialogs
  const [showGenerateDialog, setShowGenerateDialog] = useState(false);
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const [selectedTagihan, setSelectedTagihan] = useState<TagihanHarianForPayment | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchTagihan = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        pageSize: pageSize.toString(),
      });

      if (tanggalStart) params.append('tanggalStart', tanggalStart);
      if (tanggalEnd) params.append('tanggalEnd', tanggalEnd);
      if (searchQuery) params.append('search', searchQuery);
      if (filterStatus !== 'all') params.append('status', filterStatus);

      const response = await fetch(`/api/daycare/tagihan-harian?${params.toString()}`);
      const data = await response.json();

      if (response.ok) {
        setTagihanList(data.data || []);
        setTotalPages(data.totalPages || 1);
        setTotalItems(data.total || 0);
        setStats(data.stats || {
          totalTagihan: 0,
          totalTerbayar: 0,
          totalTunggakan: 0,
          totalLunas: 0,
          totalBelumBayar: 0,
        });
      }
    } catch (error) {
      console.error('Error fetching tagihan:', error);
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, tanggalStart, tanggalEnd, searchQuery, filterStatus]);

  useEffect(() => {
    fetchTagihan();
  }, [fetchTagihan]);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setCurrentPage(1);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [tanggalStart, tanggalEnd, filterStatus]);

  const handleQuickPayment = (tagihan: TagihanHarianListItem) => {
    setSelectedTagihan({
      id: tagihan.id,
      anakId: tagihan.anakId,
      tanggal: tagihan.tanggal,
      nominal: tagihan.nominal,
      status: tagihan.status,
      anak: tagihan.anak,
      _totalBayar: tagihan._totalBayar,
      _sisaTagihan: tagihan._sisaTagihan,
    });
    setShowPaymentDialog(true);
  };

  const handleDelete = async () => {
    if (!deleteId) return;

    setIsDeleting(true);
    try {
      const response = await fetch(`/api/daycare/tagihan-harian/${deleteId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        fetchTagihan();
      } else {
        const data = await response.json();
        alert(data.error || 'Gagal menghapus tagihan');
      }
    } catch (error) {
      console.error('Error deleting tagihan:', error);
      alert('Terjadi kesalahan saat menghapus');
    } finally {
      setIsDeleting(false);
      setDeleteId(null);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusOption = STATUS_TAGIHAN_OPTIONS.find((s) => s.value === status);
    return (
      <Badge className={getStatusColor(status)}>
        {statusOption?.label || status}
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#006064]">Tagihan Harian</h1>
          <p className="text-gray-600">Kelola tagihan harian anak Daycare (paket HARIAN)</p>
        </div>
        <Button
          onClick={() => setShowGenerateDialog(true)}
          className="bg-[#00BCD4] hover:bg-[#006064]"
        >
          <FileText className="w-4 h-4 mr-2" />
          Generate Tagihan
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Tagihan</CardTitle>
            <Receipt className="h-4 w-4 text-[#00BCD4]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#006064]">{formatRupiah(stats.totalTagihan)}</div>
            <p className="text-xs text-gray-500">{totalItems} tagihan</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Terbayar</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{formatRupiah(stats.totalTerbayar)}</div>
            <p className="text-xs text-gray-500">{stats.totalLunas} lunas</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tunggakan</CardTitle>
            <AlertCircle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{formatRupiah(stats.totalTunggakan)}</div>
            <p className="text-xs text-gray-500">{stats.totalBelumBayar} tagihan</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Belum Bayar</CardTitle>
            <DollarSign className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{stats.totalBelumBayar}</div>
            <p className="text-xs text-gray-500">tagihan pending</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Filter & Pencarian</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Cari nama anak..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                type="date"
                value={tanggalStart}
                onChange={(e) => setTanggalStart(e.target.value)}
                className="pl-10"
              />
            </div>

            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                type="date"
                value={tanggalEnd}
                onChange={(e) => setTanggalEnd(e.target.value)}
                className="pl-10"
              />
            </div>

            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Status</SelectItem>
                <SelectItem value="belum_bayar">Belum Bayar</SelectItem>
                <SelectItem value="lunas">Lunas</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardHeader>
          <CardTitle>Daftar Tagihan Harian</CardTitle>
          <CardDescription>
            Menampilkan {tagihanList.length} dari {totalItems} tagihan
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-[#00BCD4]" />
            </div>
          ) : tagihanList.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <Receipt className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p>Tidak ada tagihan untuk periode ini</p>
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => setShowGenerateDialog(true)}
              >
                <FileText className="w-4 h-4 mr-2" />
                Generate Tagihan
              </Button>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Tanggal</TableHead>
                      <TableHead>Anak</TableHead>
                      <TableHead className="text-right">Nominal</TableHead>
                      <TableHead className="text-center">Status</TableHead>
                      <TableHead className="text-right">Dibayar</TableHead>
                      <TableHead className="text-right">Sisa</TableHead>
                      <TableHead className="text-center">Aksi</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {tagihanList.map((tagihan) => (
                      <TableRow key={tagihan.id}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-gray-400" />
                            {formatTanggal(tagihan.tanggal)}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium">
                              {tagihan.anak?.namaLengkap || 'N/A'}
                            </p>
                            <p className="text-xs text-gray-500">
                              {tagihan.anak?.nomorInduk || '-'}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell className="text-right font-medium">
                          {formatRupiah(tagihan.nominal)}
                        </TableCell>
                        <TableCell className="text-center">
                          {getStatusBadge(tagihan.status)}
                        </TableCell>
                        <TableCell className="text-right text-green-600">
                          {formatRupiah(tagihan._totalBayar)}
                        </TableCell>
                        <TableCell className="text-right">
                          <span className={tagihan._sisaTagihan > 0 ? 'text-red-600' : 'text-green-600'}>
                            {formatRupiah(tagihan._sisaTagihan)}
                          </span>
                        </TableCell>
                        <TableCell>
                          <div className="flex justify-center gap-2">
                            {tagihan.status !== 'lunas' && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleQuickPayment(tagihan)}
                                className="text-green-600 hover:text-green-700"
                              >
                                <CreditCard className="w-4 h-4" />
                              </Button>
                            )}
                            {tagihan.pembayaran.length === 0 && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setDeleteId(tagihan.id)}
                                className="text-red-600 hover:text-red-700"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            )}
                          </div>
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

      {/* Generate Dialog */}
      <GenerateTagihanHarianDialog
        open={showGenerateDialog}
        onOpenChange={setShowGenerateDialog}
        onSuccess={fetchTagihan}
      />

      {/* Payment Dialog */}
      <PembayaranHarianForm
        open={showPaymentDialog}
        onOpenChange={setShowPaymentDialog}
        tagihan={selectedTagihan}
        onSuccess={fetchTagihan}
      />

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Tagihan?</AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin ingin menghapus tagihan ini? Tagihan yang sudah memiliki pembayaran tidak dapat dihapus.
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
