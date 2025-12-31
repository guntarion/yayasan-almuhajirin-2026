'use client';

import { useState, useEffect, useCallback, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
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
import { LikertScaleDisplay } from '@/components/daycare';
import {
  formatTanggal,
  parseKegiatanHariIni,
  KEGIATAN_OPTIONS,
  getPaketLabel,
  hitungUmur,
} from '@/types/daycare';
import {
  ArrowLeft,
  Trash2,
  ClipboardList,
  Heart,
  Users,
  Utensils,
  Moon,
  Calendar,
  User,
  Baby,
  MessageSquare,
  Loader2,
  AlertTriangle,
  Printer,
} from 'lucide-react';
import { toast } from 'sonner';

interface DailyReportDetail {
  id: string;
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
  createdAt: Date | string;
  updatedAt: Date | string;
  anak: {
    id: string;
    nomorInduk: string;
    namaLengkap: string;
    namaPanggilan?: string | null;
    foto?: string | null;
    paketLayanan: string;
    tanggalLahir: Date | string;
    alergiMakanan?: string | null;
    catatanKesehatan?: string | null;
    kebiasaanTidur?: string | null;
  };
}

export default function DailyReportDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [report, setReport] = useState<DailyReportDetail | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchReport = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/daycare/daily-report/${id}`);
      if (!response.ok) {
        if (response.status === 404) {
          toast.error('Daily report tidak ditemukan');
          router.push('/units/daycare/kelola/daily-report');
          return;
        }
        throw new Error('Failed to fetch report');
      }

      const data = await response.json();
      setReport(data);
    } catch (error) {
      console.error('Error fetching report:', error);
      toast.error('Gagal mengambil data daily report');
    } finally {
      setIsLoading(false);
    }
  }, [id, router]);

  useEffect(() => {
    fetchReport();
  }, [fetchReport]);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const response = await fetch(`/api/daycare/daily-report/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Gagal menghapus daily report');
      }

      toast.success('Daily report berhasil dihapus');
      router.push('/units/daycare/kelola/daily-report');
    } catch (error) {
      console.error('Error deleting report:', error);
      toast.error(
        error instanceof Error ? error.message : 'Gagal menghapus daily report'
      );
    } finally {
      setIsDeleting(false);
      setShowDeleteDialog(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 text-[#00BCD4] animate-spin" />
      </div>
    );
  }

  if (!report) {
    return (
      <div className="text-center py-12">
        <ClipboardList className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <p className="text-gray-500 text-lg">Daily report tidak ditemukan</p>
        <Link href="/units/daycare/kelola/daily-report">
          <Button className="mt-4 bg-[#00BCD4] hover:bg-[#006064] text-white">
            Kembali ke Daftar
          </Button>
        </Link>
      </div>
    );
  }

  const kegiatan = parseKegiatanHariIni(report.kegiatanHariIni);
  const kegiatanLabels = kegiatan.map(
    (k) => KEGIATAN_OPTIONS.find((opt) => opt.value === k)?.label || k
  );
  const umur = hitungUmur(report.anak.tanggalLahir);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-[#00BCD4]/5">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-6 no-print">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-4">
              <Link href="/units/daycare/kelola/daily-report">
                <Button
                  variant="outline"
                  size="icon"
                  className="rounded-xl border-[#00BCD4] text-[#006064] hover:bg-[#00BCD4]/10"
                >
                  <ArrowLeft className="w-4 h-4" />
                </Button>
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-[#006064] flex items-center gap-2">
                  <ClipboardList className="w-6 h-6" />
                  Detail Daily Report
                </h1>
                <p className="text-gray-600">{formatTanggal(report.tanggal)}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                onClick={handlePrint}
                className="rounded-xl border-gray-300"
              >
                <Printer className="w-4 h-4 mr-2" />
                Cetak
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowDeleteDialog(true)}
                className="rounded-xl border-red-300 text-red-600 hover:bg-red-50"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Hapus
              </Button>
            </div>
          </div>
        </div>

        {/* Print Header - Only visible when printing */}
        <div className="hidden print-only">
          <div className="text-center mb-6">
            <h1 className="text-xl font-bold">DAILY REPORT DAYCARE AL MUHAJIRIN</h1>
            <p className="text-sm text-gray-600">Yayasan Al Muhajirin Rewwin</p>
          </div>
        </div>

        {/* Anak Info Card */}
        <Card className="mb-6 border-0 shadow-lg rounded-2xl overflow-hidden">
          <div className="bg-gradient-to-r from-[#00BCD4] to-[#006064] p-6">
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                <Baby className="w-8 h-8 text-white" />
              </div>
              <div className="flex-1 text-white">
                <h2 className="text-2xl font-bold">{report.anak.namaLengkap}</h2>
                <p className="text-white/80 font-mono">{report.anak.nomorInduk}</p>
                <div className="flex flex-wrap items-center gap-4 mt-2">
                  <Badge
                    variant="outline"
                    className="bg-white/20 text-white border-white/30"
                  >
                    {getPaketLabel(report.anak.paketLayanan)}
                  </Badge>
                  <span className="text-white/80">{umur.text}</span>
                </div>
              </div>
              <div className="text-right text-white/80">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>{formatTanggal(report.tanggal)}</span>
                </div>
                {report.guruPengisi && (
                  <div className="flex items-center gap-2 mt-1">
                    <User className="w-4 h-4" />
                    <span>Diisi oleh: {report.guruPengisi}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Alergi Warning */}
          {report.anak.alergiMakanan &&
            report.anak.alergiMakanan.toLowerCase() !== 'tidak ada' && (
              <div className="bg-orange-50 border-b border-orange-200 p-4 flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-orange-800">Alergi Makanan</p>
                  <p className="text-orange-700 text-sm">
                    {report.anak.alergiMakanan}
                  </p>
                </div>
              </div>
            )}
        </Card>

        {/* Report Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Perilaku */}
          <Card className="border-0 shadow-lg rounded-2xl overflow-hidden">
            <CardHeader className="bg-pink-50 border-b border-pink-100">
              <CardTitle className="text-base font-semibold text-pink-700 flex items-center gap-2">
                <Heart className="w-5 h-5" />
                Perilaku
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4 space-y-4">
              <div>
                <p className="text-sm text-gray-500 mb-2">Mood & Sikap</p>
                <LikertScaleDisplay
                  type="perilaku"
                  value={report.moodSikap}
                  size="md"
                />
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-2">Interaksi dengan Teman</p>
                <LikertScaleDisplay
                  type="perilaku"
                  value={report.interaksiTeman}
                  size="md"
                />
              </div>
              {report.catatanPerilaku && (
                <div className="pt-2 border-t">
                  <p className="text-sm text-gray-500 mb-1">Catatan:</p>
                  <p className="text-gray-700">{report.catatanPerilaku}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Aktivitas */}
          <Card className="border-0 shadow-lg rounded-2xl overflow-hidden">
            <CardHeader className="bg-blue-50 border-b border-blue-100">
              <CardTitle className="text-base font-semibold text-blue-700 flex items-center gap-2">
                <Users className="w-5 h-5" />
                Aktivitas
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4 space-y-4">
              <div>
                <p className="text-sm text-gray-500 mb-2">Partisipasi Belajar</p>
                <LikertScaleDisplay
                  type="aktivitas"
                  value={report.partisipasiBelajar}
                  size="md"
                />
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-2">Respon Bermain</p>
                <LikertScaleDisplay
                  type="aktivitas"
                  value={report.responBermain}
                  size="md"
                />
              </div>
              {report.catatanAktivitas && (
                <div className="pt-2 border-t">
                  <p className="text-sm text-gray-500 mb-1">Catatan:</p>
                  <p className="text-gray-700">{report.catatanAktivitas}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Makan */}
          <Card className="border-0 shadow-lg rounded-2xl overflow-hidden">
            <CardHeader className="bg-orange-50 border-b border-orange-100">
              <CardTitle className="text-base font-semibold text-orange-700 flex items-center gap-2">
                <Utensils className="w-5 h-5" />
                Makan & Nutrisi
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4 space-y-4">
              <div>
                <p className="text-sm text-gray-500 mb-2">Makan Siang</p>
                <LikertScaleDisplay
                  type="makan"
                  value={report.makanSiang}
                  size="md"
                />
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-2">Snack</p>
                <LikertScaleDisplay
                  type="makan"
                  value={report.snack}
                  size="md"
                />
              </div>
              {report.catatanMakan && (
                <div className="pt-2 border-t">
                  <p className="text-sm text-gray-500 mb-1">Catatan:</p>
                  <p className="text-gray-700">{report.catatanMakan}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Tidur */}
          <Card className="border-0 shadow-lg rounded-2xl overflow-hidden">
            <CardHeader className="bg-purple-50 border-b border-purple-100">
              <CardTitle className="text-base font-semibold text-purple-700 flex items-center gap-2">
                <Moon className="w-5 h-5" />
                Tidur Siang
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4 space-y-4">
              <div>
                <p className="text-sm text-gray-500 mb-2">Kemudahan Tidur</p>
                <LikertScaleDisplay
                  type="tidur"
                  value={report.tidurSiang}
                  size="md"
                />
              </div>
              {report.durasiTidur && (
                <div>
                  <p className="text-sm text-gray-500 mb-1">Durasi Tidur</p>
                  <p className="text-lg font-medium text-purple-700">
                    {report.durasiTidur}
                  </p>
                </div>
              )}
              {report.catatanTidur && (
                <div className="pt-2 border-t">
                  <p className="text-sm text-gray-500 mb-1">Catatan:</p>
                  <p className="text-gray-700">{report.catatanTidur}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Kegiatan Hari Ini */}
        {kegiatan.length > 0 && (
          <Card className="mt-6 border-0 shadow-lg rounded-2xl overflow-hidden">
            <CardHeader className="bg-[#00BCD4]/10 border-b border-[#00BCD4]/20">
              <CardTitle className="text-base font-semibold text-[#006064] flex items-center gap-2">
                <ClipboardList className="w-5 h-5" />
                Kegiatan Hari Ini
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="flex flex-wrap gap-2">
                {kegiatanLabels.map((label) => (
                  <Badge
                    key={label}
                    className="bg-[#00BCD4]/10 text-[#006064] border-[#00BCD4]/30 px-3 py-1"
                  >
                    {label}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Catatan Guru */}
        {report.catatanGuru && (
          <Card className="mt-6 border-0 shadow-lg rounded-2xl overflow-hidden">
            <CardHeader className="bg-gray-50 border-b border-gray-100">
              <CardTitle className="text-base font-semibold text-gray-700 flex items-center gap-2">
                <MessageSquare className="w-5 h-5" />
                Catatan Guru untuk Orang Tua
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <p className="text-gray-700 whitespace-pre-wrap">
                {report.catatanGuru}
              </p>
            </CardContent>
          </Card>
        )}

        {/* Footer - Timestamp */}
        <div className="mt-6 text-center text-sm text-gray-500">
          <p>
            Dibuat: {formatTanggal(report.createdAt)} | Diperbarui:{' '}
            {formatTanggal(report.updatedAt)}
          </p>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Daily Report?</AlertDialogTitle>
            <AlertDialogDescription>
              Daily report untuk {report.anak.namaLengkap} pada tanggal{' '}
              {formatTanggal(report.tanggal)} akan dihapus secara permanen.
              Tindakan ini tidak dapat dibatalkan.
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
