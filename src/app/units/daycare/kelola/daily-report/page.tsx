'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
import { DailyReportForm, DailyReportCard } from '@/components/daycare';
import { DaycareAnak, formatTanggal } from '@/types/daycare';
import {
  Plus,
  Search,
  Calendar,
  ClipboardList,
  ChevronLeft,
  ChevronRight,
  Loader2,
  FileText,
} from 'lucide-react';
import { toast } from 'sonner';

interface DailyReportWithAnak {
  id: string;
  anakId: string;
  tanggal: Date | string;
  guruPengisi?: string | null;
  moodSikap?: number | null;
  interaksiTeman?: number | null;
  catatanPerilaku?: string | null;
  partisipasiBelajar?: number | null;
  responBermain?: number | null;
  catatanAktivitas?: string | null;
  makanSiang?: number | null;
  snack?: number | null;
  catatanMakan?: string | null;
  tidurSiang?: number | null;
  durasiTidur?: string | null;
  catatanTidur?: string | null;
  kegiatanHariIni?: string | null;
  catatanGuru?: string | null;
  anak: {
    id: string;
    nomorInduk: string;
    namaLengkap: string;
    namaPanggilan?: string | null;
    foto?: string | null;
    paketLayanan?: string;
  };
}

interface AnakSimple {
  id: string;
  namaLengkap: string;
  nomorInduk: string;
}

export default function DailyReportPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [reports, setReports] = useState<DailyReportWithAnak[]>([]);
  const [anakList, setAnakList] = useState<AnakSimple[]>([]);
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 12,
    total: 0,
    totalPages: 0,
  });

  // Filters
  const [search, setSearch] = useState('');
  const [tanggal, setTanggal] = useState('');
  const [selectedAnakId, setSelectedAnakId] = useState('all');

  // Dialog states
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingReport, setEditingReport] = useState<DailyReportWithAnak | null>(null);
  const [deleteReportId, setDeleteReportId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Fetch anak list for filter and form
  const fetchAnakList = useCallback(async () => {
    try {
      const response = await fetch('/api/daycare/anak?pageSize=100&status=aktif');
      if (response.ok) {
        const data = await response.json();
        setAnakList(
          data.data.map((a: DaycareAnak) => ({
            id: a.id,
            namaLengkap: a.namaLengkap,
            nomorInduk: a.nomorInduk,
          }))
        );
      }
    } catch (error) {
      console.error('Error fetching anak list:', error);
    }
  }, []);

  // Fetch daily reports
  const fetchReports = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams({
        page: pagination.page.toString(),
        pageSize: pagination.pageSize.toString(),
      });

      if (search) params.set('search', search);
      if (tanggal) params.set('tanggal', tanggal);
      if (selectedAnakId && selectedAnakId !== 'all') {
        params.set('anakId', selectedAnakId);
      }

      const response = await fetch(`/api/daycare/daily-report?${params}`);
      if (!response.ok) throw new Error('Failed to fetch reports');

      const data = await response.json();
      setReports(data.data);
      setPagination((prev) => ({
        ...prev,
        total: data.total,
        totalPages: data.totalPages,
      }));
    } catch (error) {
      console.error('Error fetching reports:', error);
      toast.error('Gagal mengambil data daily report');
    } finally {
      setIsLoading(false);
    }
  }, [pagination.page, pagination.pageSize, search, tanggal, selectedAnakId]);

  useEffect(() => {
    fetchAnakList();
  }, [fetchAnakList]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchReports();
    }, 300);
    return () => clearTimeout(timer);
  }, [fetchReports]);

  const handleOpenEdit = (report: DailyReportWithAnak) => {
    setEditingReport(report);
    setIsFormOpen(true);
  };

  const handleOpenCreate = () => {
    setEditingReport(null);
    setIsFormOpen(true);
  };

  const handleViewDetail = (id: string) => {
    router.push(`/units/daycare/kelola/daily-report/${id}`);
  };

  const handleFormSuccess = () => {
    fetchReports();
    setEditingReport(null);
  };

  const handleDelete = async () => {
    if (!deleteReportId) return;

    setIsDeleting(true);
    try {
      const response = await fetch(`/api/daycare/daily-report/${deleteReportId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Gagal menghapus daily report');
      }

      toast.success('Daily report berhasil dihapus');
      setDeleteReportId(null);
      fetchReports();
    } catch (error) {
      console.error('Error deleting report:', error);
      toast.error(
        error instanceof Error ? error.message : 'Gagal menghapus daily report'
      );
    } finally {
      setIsDeleting(false);
    }
  };

  // Stats
  const todayReports = reports.filter((r) => {
    const reportDate = new Date(r.tanggal).toDateString();
    return reportDate === new Date().toDateString();
  }).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-[#00BCD4]/5">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#006064] mb-2 flex items-center gap-3">
            <ClipboardList className="w-8 h-8" />
            Daily Report
          </h1>
          <p className="text-gray-600">
            Laporan harian perkembangan anak Daycare Al Muhajirin Rewwin
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <Card className="border-0 shadow-lg rounded-2xl overflow-hidden">
            <div className="bg-gradient-to-r from-[#00BCD4] to-[#006064] p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/80 text-sm font-medium">
                    Total Report
                  </p>
                  <p className="text-white text-3xl font-bold mt-1">
                    {pagination.total}
                  </p>
                </div>
                <div className="bg-white/20 rounded-full p-3">
                  <FileText className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          </Card>

          <Card className="border-0 shadow-lg rounded-2xl overflow-hidden">
            <div className="bg-gradient-to-r from-green-400 to-green-600 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/80 text-sm font-medium">
                    Hari Ini
                  </p>
                  <p className="text-white text-3xl font-bold mt-1">
                    {todayReports}
                  </p>
                </div>
                <div className="bg-white/20 rounded-full p-3">
                  <Calendar className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          </Card>

          <Card className="border-0 shadow-lg rounded-2xl overflow-hidden">
            <div className="bg-gradient-to-r from-purple-400 to-purple-600 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/80 text-sm font-medium">
                    Anak Aktif
                  </p>
                  <p className="text-white text-3xl font-bold mt-1">
                    {anakList.length}
                  </p>
                </div>
                <div className="bg-white/20 rounded-full p-3">
                  <ClipboardList className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Filters & Actions */}
        <Card className="mb-6 border-0 shadow-lg rounded-2xl">
          <CardHeader className="border-b bg-gradient-to-r from-[#00BCD4]/10 to-transparent">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <CardTitle className="text-lg text-[#006064]">
                Daftar Daily Report
              </CardTitle>
              <Button
                onClick={handleOpenCreate}
                className="bg-[#00BCD4] hover:bg-[#006064] text-white rounded-xl"
              >
                <Plus className="w-4 h-4 mr-2" />
                Buat Daily Report
              </Button>
            </div>
          </CardHeader>
          <CardContent className="pt-4">
            {/* Filter Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <div className="lg:col-span-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Cari nama anak..."
                    value={search}
                    onChange={(e) => {
                      setSearch(e.target.value);
                      setPagination((prev) => ({ ...prev, page: 1 }));
                    }}
                    className="pl-10 rounded-xl"
                  />
                </div>
              </div>

              <div>
                <Input
                  type="date"
                  value={tanggal}
                  onChange={(e) => {
                    setTanggal(e.target.value);
                    setPagination((prev) => ({ ...prev, page: 1 }));
                  }}
                  className="rounded-xl"
                  placeholder="Filter tanggal"
                />
              </div>

              <Select
                value={selectedAnakId}
                onValueChange={(value) => {
                  setSelectedAnakId(value);
                  setPagination((prev) => ({ ...prev, page: 1 }));
                }}
              >
                <SelectTrigger className="rounded-xl">
                  <SelectValue placeholder="Filter Anak" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Anak</SelectItem>
                  {anakList.map((anak) => (
                    <SelectItem key={anak.id} value={anak.id}>
                      {anak.namaLengkap}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Button
                variant="outline"
                onClick={() => {
                  setSearch('');
                  setTanggal('');
                  setSelectedAnakId('all');
                  setPagination((prev) => ({ ...prev, page: 1 }));
                }}
                className="rounded-xl"
              >
                Reset Filter
              </Button>
            </div>

            {/* Content */}
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 text-[#00BCD4] animate-spin" />
              </div>
            ) : reports.length === 0 ? (
              <div className="text-center py-12">
                <ClipboardList className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 text-lg">Tidak ada daily report</p>
                <p className="text-gray-400 text-sm mb-4">
                  {tanggal
                    ? `Tidak ada report untuk tanggal ${formatTanggal(tanggal)}`
                    : 'Belum ada daily report yang dibuat'}
                </p>
                <Button
                  onClick={handleOpenCreate}
                  className="bg-[#00BCD4] hover:bg-[#006064] text-white rounded-xl"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Buat Daily Report Pertama
                </Button>
              </div>
            ) : (
              <>
                {/* Report Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                  {reports.map((report) => (
                    <DailyReportCard
                      key={report.id}
                      report={report}
                      onView={handleViewDetail}
                      onEdit={(r) => handleOpenEdit(r as DailyReportWithAnak)}
                      onDelete={(id) => setDeleteReportId(id)}
                    />
                  ))}
                </div>

                {/* Pagination */}
                <div className="flex items-center justify-between mt-6 pt-4 border-t">
                  <p className="text-sm text-gray-600">
                    Menampilkan{' '}
                    {(pagination.page - 1) * pagination.pageSize + 1}-
                    {Math.min(
                      pagination.page * pagination.pageSize,
                      pagination.total
                    )}{' '}
                    dari {pagination.total} report
                  </p>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        setPagination((prev) => ({
                          ...prev,
                          page: prev.page - 1,
                        }))
                      }
                      disabled={pagination.page === 1}
                      className="rounded-xl"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </Button>
                    <span className="text-sm text-gray-600">
                      {pagination.page} / {pagination.totalPages || 1}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        setPagination((prev) => ({
                          ...prev,
                          page: prev.page + 1,
                        }))
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
      <DailyReportForm
        open={isFormOpen}
        onOpenChange={(open) => {
          setIsFormOpen(open);
          if (!open) setEditingReport(null);
        }}
        anakList={anakList}
        existingReport={editingReport}
        onSuccess={handleFormSuccess}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={!!deleteReportId}
        onOpenChange={() => setDeleteReportId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Daily Report?</AlertDialogTitle>
            <AlertDialogDescription>
              Daily report ini akan dihapus secara permanen. Tindakan ini tidak
              dapat dibatalkan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Batal</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-red-500 hover:bg-red-600"
            >
              {isDeleting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
