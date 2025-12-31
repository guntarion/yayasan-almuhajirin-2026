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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
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
} from 'lucide-react';
import {
  PAKET_LAYANAN_OPTIONS,
  STATUS_TAGIHAN_OPTIONS,
  BULAN_OPTIONS,
  generateYearOptions,
  formatRupiah,
  getCurrentPeriod,
} from '@/types/daycare';
import { TagihanBulananTable, TagihanBulananListItem } from '@/components/daycare/TagihanBulananTable';
import { GenerateTagihanDialog } from '@/components/daycare/GenerateTagihanDialog';
import { PembayaranBulananForm, TagihanBulananForPayment } from '@/components/daycare/PembayaranBulananForm';

interface TagihanStats {
  totalTagihan: number;
  totalTerbayar: number;
  totalTunggakan: number;
  totalLunas: number;
  totalSebagian: number;
  totalBelumBayar: number;
}

export default function TagihanBulananPage() {
  const currentPeriod = getCurrentPeriod();
  const yearOptions = generateYearOptions(2024, 5);

  const [isLoading, setIsLoading] = useState(true);
  const [tagihanList, setTagihanList] = useState<TagihanBulananListItem[]>([]);
  const [stats, setStats] = useState<TagihanStats>({
    totalTagihan: 0,
    totalTerbayar: 0,
    totalTunggakan: 0,
    totalLunas: 0,
    totalSebagian: 0,
    totalBelumBayar: 0,
  });

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const pageSize = 10;

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [filterBulan, setFilterBulan] = useState(currentPeriod.bulan.toString());
  const [filterTahun, setFilterTahun] = useState(currentPeriod.tahun.toString());
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterPaket, setFilterPaket] = useState('all');

  // Dialogs
  const [showGenerateDialog, setShowGenerateDialog] = useState(false);
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const [selectedTagihan, setSelectedTagihan] = useState<TagihanBulananForPayment | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchTagihan = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        pageSize: pageSize.toString(),
        bulan: filterBulan,
        tahun: filterTahun,
      });

      if (searchQuery) params.append('search', searchQuery);
      if (filterStatus !== 'all') params.append('status', filterStatus);
      if (filterPaket !== 'all') params.append('paket', filterPaket);

      const response = await fetch(`/api/daycare/tagihan-bulanan?${params.toString()}`);
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
          totalSebagian: 0,
          totalBelumBayar: 0,
        });
      }
    } catch (error) {
      console.error('Error fetching tagihan:', error);
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, searchQuery, filterBulan, filterTahun, filterStatus, filterPaket]);

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
  }, [filterBulan, filterTahun, filterStatus, filterPaket]);

  const handleQuickPayment = (tagihan: TagihanBulananListItem) => {
    setSelectedTagihan(tagihan as TagihanBulananForPayment);
    setShowPaymentDialog(true);
  };

  const handleDelete = async () => {
    if (!deleteId) return;

    setIsDeleting(true);
    try {
      const response = await fetch(`/api/daycare/tagihan-bulanan/${deleteId}`, {
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#006064]">Tagihan Bulanan</h1>
          <p className="text-gray-600">Kelola tagihan bulanan anak Daycare</p>
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
            <p className="text-xs text-gray-500">{stats.totalBelumBayar + stats.totalSebagian} tagihan</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sebagian Bayar</CardTitle>
            <DollarSign className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{stats.totalSebagian}</div>
            <p className="text-xs text-gray-500">tagihan angsuran</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Filter & Pencarian</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Cari nama anak..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            <Select value={filterBulan} onValueChange={setFilterBulan}>
              <SelectTrigger>
                <SelectValue placeholder="Bulan" />
              </SelectTrigger>
              <SelectContent>
                {BULAN_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value.toString()}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={filterTahun} onValueChange={setFilterTahun}>
              <SelectTrigger>
                <SelectValue placeholder="Tahun" />
              </SelectTrigger>
              <SelectContent>
                {yearOptions.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value.toString()}>
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
                {STATUS_TAGIHAN_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={filterPaket} onValueChange={setFilterPaket}>
              <SelectTrigger>
                <SelectValue placeholder="Paket" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Paket</SelectItem>
                {PAKET_LAYANAN_OPTIONS.filter(
                  (opt) => opt.value !== 'HARIAN'
                ).map((opt) => (
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
          <CardTitle>Daftar Tagihan</CardTitle>
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
              <TagihanBulananTable
                data={tagihanList}
                onQuickPayment={handleQuickPayment}
                onDelete={(id) => setDeleteId(id)}
              />

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
      <GenerateTagihanDialog
        open={showGenerateDialog}
        onOpenChange={setShowGenerateDialog}
        onSuccess={fetchTagihan}
      />

      {/* Payment Dialog */}
      <PembayaranBulananForm
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
