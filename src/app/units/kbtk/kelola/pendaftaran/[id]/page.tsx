'use client';

import { useState, useEffect, useCallback, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
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
  ArrowLeft,
  Plus,
  Trash2,
  User,
  CreditCard,
  Phone,
  Mail,
  Loader2,
  AlertCircle,
  CheckCircle,
} from 'lucide-react';
import {
  KbtkPendaftaranWithRelations,
  KbtkPembayaranPendaftaran,
  STATUS_PENDAFTARAN_OPTIONS,
  METODE_PEMBAYARAN_OPTIONS,
  formatTanggal,
  formatTanggalSingkat,
  formatCurrency,
  formatKelompok,
  getStatusPendaftaranColor,
  getWhatsAppLink,
} from '@/types/kbtk';
import { PembayaranPendaftaranForm } from '@/components/kbtk';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function PendaftaranDetailPage({ params }: PageProps) {
  const { id } = use(params);
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(true);
  const [pendaftaran, setPendaftaran] = useState<KbtkPendaftaranWithRelations | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Status update
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  // Dialogs
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const [deletePaymentId, setDeletePaymentId] = useState<string | null>(null);
  const [isDeletingPayment, setIsDeletingPayment] = useState(false);

  const fetchPendaftaran = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/kbtk/pendaftaran/${id}`);

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Pendaftaran tidak ditemukan');
        }
        throw new Error('Gagal mengambil data pendaftaran');
      }

      const data = await response.json();
      setPendaftaran(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Terjadi kesalahan');
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchPendaftaran();
  }, [fetchPendaftaran]);

  const handleStatusChange = async (newStatus: string) => {
    if (!pendaftaran) return;

    setIsUpdatingStatus(true);
    try {
      const response = await fetch(`/api/kbtk/pendaftaran/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        fetchPendaftaran();
      } else {
        const data = await response.json();
        alert(data.error || 'Gagal mengubah status');
      }
    } catch (err) {
      console.error('Error updating status:', err);
      alert('Terjadi kesalahan');
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const handleDeletePayment = async () => {
    if (!deletePaymentId) return;

    setIsDeletingPayment(true);
    try {
      const response = await fetch(`/api/kbtk/pembayaran-pendaftaran/${deletePaymentId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        fetchPendaftaran();
      } else {
        const data = await response.json();
        alert(data.error || 'Gagal menghapus pembayaran');
      }
    } catch (err) {
      console.error('Error deleting payment:', err);
      alert('Terjadi kesalahan');
    } finally {
      setIsDeletingPayment(false);
      setDeletePaymentId(null);
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 flex justify-center items-center min-h-[50vh]">
        <Loader2 className="w-8 h-8 animate-spin text-[#00BCD4]" />
      </div>
    );
  }

  if (error || !pendaftaran) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-md mx-auto">
          <CardContent className="pt-6 text-center">
            <AlertCircle className="w-12 h-12 mx-auto mb-4 text-red-500" />
            <h2 className="text-lg font-semibold mb-2">Oops!</h2>
            <p className="text-gray-600 mb-4">{error || 'Pendaftaran tidak ditemukan'}</p>
            <Button onClick={() => router.push('/units/kbtk/kelola/pendaftaran')}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Kembali
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Calculate payment progress
  const totalBiaya = Number(pendaftaran.biayaPendaftaran);
  const totalBayar = pendaftaran._totalBayar || 0;
  const sisaTagihan = pendaftaran._sisaTagihan || 0;
  const progressPercent = totalBiaya > 0 ? Math.min((totalBayar / totalBiaya) * 100, 100) : 0;
  const isLunas = sisaTagihan <= 0;

  const siswa = pendaftaran.siswa;
  const primaryOrangTua = siswa?.orangTua?.find((ot) => ot.isPrimary) || siswa?.orangTua?.[0];

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" asChild>
            <Link href="/units/kbtk/kelola/pendaftaran">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Kembali
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-[#006064]">Detail Pendaftaran</h1>
            <p className="text-gray-600">{siswa?.namaLengkap}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Select
            value={pendaftaran.status}
            onValueChange={handleStatusChange}
            disabled={isUpdatingStatus}
          >
            <SelectTrigger className="w-40">
              {isUpdatingStatus ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <SelectValue />
              )}
            </SelectTrigger>
            <SelectContent>
              {STATUS_PENDAFTARAN_OPTIONS.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Badge className={getStatusPendaftaranColor(pendaftaran.status)}>
            {STATUS_PENDAFTARAN_OPTIONS.find((s) => s.value === pendaftaran.status)?.label}
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Registration Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5 text-[#00BCD4]" />
                Informasi Pendaftaran
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Nama Siswa</p>
                  <p className="font-medium">{siswa?.namaLengkap}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Nomor Induk</p>
                  <p className="font-medium">{siswa?.nomorInduk}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Kelompok</p>
                  <p className="font-medium">
                    {formatKelompok(siswa?.kelompokLevel || '', siswa?.kelompokKelas || '')}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Tahun Ajaran</p>
                  <p className="font-medium">{pendaftaran.tahunAjaran}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Tanggal Daftar</p>
                  <p className="font-medium">{formatTanggal(pendaftaran.tanggalDaftar)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Program</p>
                  <Badge variant="outline">{pendaftaran.program}</Badge>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Skema Pembayaran</p>
                  <p className="font-medium capitalize">{pendaftaran.schemaPembayaran}</p>
                </div>
                {pendaftaran.tanggalDiterima && (
                  <div>
                    <p className="text-sm text-gray-500">Tanggal Diterima</p>
                    <p className="font-medium">{formatTanggal(pendaftaran.tanggalDiterima)}</p>
                  </div>
                )}
              </div>

              {pendaftaran.catatan && (
                <div className="pt-4 border-t">
                  <p className="text-sm text-gray-500">Catatan</p>
                  <p className="mt-1">{pendaftaran.catatan}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Payment Summary */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-[#00BCD4]" />
                  Ringkasan Pembayaran
                </CardTitle>
                <CardDescription>Status pembayaran biaya pendaftaran</CardDescription>
              </div>
              <Button
                onClick={() => setShowPaymentDialog(true)}
                className="bg-[#00BCD4] hover:bg-[#006064]"
              >
                <Plus className="w-4 h-4 mr-2" />
                Tambah Pembayaran
              </Button>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Summary */}
              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-500">Total Biaya</p>
                  <p className="text-xl font-bold text-[#006064]">{formatCurrency(totalBiaya)}</p>
                </div>
                <div className="p-4 bg-green-50 rounded-lg">
                  <p className="text-sm text-gray-500">Sudah Dibayar</p>
                  <p className="text-xl font-bold text-green-600">{formatCurrency(totalBayar)}</p>
                </div>
                <div className={`p-4 rounded-lg ${isLunas ? 'bg-green-50' : 'bg-red-50'}`}>
                  <p className="text-sm text-gray-500">Sisa Tagihan</p>
                  <p className={`text-xl font-bold ${isLunas ? 'text-green-600' : 'text-red-600'}`}>
                    {formatCurrency(sisaTagihan)}
                  </p>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Progress Pembayaran</span>
                  <span className={isLunas ? 'text-green-600 font-medium' : 'text-gray-600'}>
                    {progressPercent.toFixed(0)}%
                  </span>
                </div>
                <Progress
                  value={progressPercent}
                  className="h-3"
                />
                {isLunas && (
                  <div className="flex items-center gap-2 text-green-600 text-sm">
                    <CheckCircle className="w-4 h-4" />
                    Pembayaran Lunas
                  </div>
                )}
              </div>

              {/* Payment History */}
              <div className="pt-4 border-t">
                <h4 className="font-medium mb-4">Riwayat Pembayaran</h4>
                {pendaftaran.pembayaran && pendaftaran.pembayaran.length > 0 ? (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Tanggal</TableHead>
                          <TableHead className="text-right">Nominal</TableHead>
                          <TableHead>Metode</TableHead>
                          <TableHead>Catatan</TableHead>
                          <TableHead className="text-right">Aksi</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {pendaftaran.pembayaran.map((payment: KbtkPembayaranPendaftaran) => (
                          <TableRow key={payment.id}>
                            <TableCell>{formatTanggalSingkat(payment.tanggalBayar)}</TableCell>
                            <TableCell className="text-right font-medium">
                              {formatCurrency(Number(payment.nominal))}
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline">
                                {METODE_PEMBAYARAN_OPTIONS.find((m) => m.value === payment.metodePembayaran)?.label}
                              </Badge>
                            </TableCell>
                            <TableCell className="max-w-xs truncate">
                              {payment.catatan || '-'}
                            </TableCell>
                            <TableCell className="text-right">
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                onClick={() => setDeletePaymentId(payment.id)}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <CreditCard className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                    <p>Belum ada pembayaran</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Parent/Guardian Info */}
          {primaryOrangTua && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Orang Tua / Wali</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-sm text-gray-500">Nama</p>
                  <p className="font-medium">{primaryOrangTua.nama}</p>
                  <Badge variant="outline" className="mt-1">
                    {primaryOrangTua.relasi}
                  </Badge>
                </div>
                {primaryOrangTua.nomorHP && (
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-gray-400" />
                    <a
                      href={getWhatsAppLink(primaryOrangTua.nomorHP)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#00BCD4] hover:underline"
                    >
                      {primaryOrangTua.nomorHP}
                    </a>
                  </div>
                )}
                {primaryOrangTua.email && (
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-gray-400" />
                    <a
                      href={`mailto:${primaryOrangTua.email}`}
                      className="text-[#00BCD4] hover:underline"
                    >
                      {primaryOrangTua.email}
                    </a>
                  </div>
                )}
                {primaryOrangTua.pekerjaan && (
                  <div>
                    <p className="text-sm text-gray-500">Pekerjaan</p>
                    <p>{primaryOrangTua.pekerjaan}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Student Status */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Status Siswa</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-500">Status</span>
                <Badge className={siswa?.status === 'aktif' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                  {siswa?.status}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-500">Kelompok</span>
                <span className="font-medium">
                  {formatKelompok(siswa?.kelompokLevel || '', siswa?.kelompokKelas || '')}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-500">Tahun Ajaran</span>
                <span>{siswa?.tahunAjaran}</span>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Aksi Cepat</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => setShowPaymentDialog(true)}
              >
                <Plus className="w-4 h-4 mr-2" />
                Tambah Pembayaran
              </Button>
              {primaryOrangTua?.nomorHP && (
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  asChild
                >
                  <a
                    href={getWhatsAppLink(
                      primaryOrangTua.nomorHP,
                      `Assalamualaikum ${primaryOrangTua.nama}, informasi mengenai pendaftaran ${siswa?.namaLengkap} di KBTK Al Muhajirin.`
                    )}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Phone className="w-4 h-4 mr-2" />
                    Hubungi via WhatsApp
                  </a>
                </Button>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Payment Dialog */}
      <PembayaranPendaftaranForm
        open={showPaymentDialog}
        onOpenChange={setShowPaymentDialog}
        pendaftaran={pendaftaran}
        onSuccess={fetchPendaftaran}
      />

      {/* Delete Payment Confirmation */}
      <AlertDialog open={!!deletePaymentId} onOpenChange={() => setDeletePaymentId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Pembayaran?</AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin ingin menghapus pembayaran ini? Status pendaftaran mungkin akan berubah jika total pembayaran tidak lagi mencukupi.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeletePayment}
              disabled={isDeletingPayment}
              className="bg-red-600 hover:bg-red-700"
            >
              {isDeletingPayment ? (
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
