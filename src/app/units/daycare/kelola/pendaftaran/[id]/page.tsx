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
  Baby,
  MapPin,
} from 'lucide-react';
import {
  PendaftaranWithRelations,
  DaycarePembayaranPendaftaran,
  STATUS_PENDAFTARAN_OPTIONS,
  METODE_PEMBAYARAN_OPTIONS,
  formatTanggal,
  formatTanggalSingkat,
  formatRupiah,
  getStatusColor,
  getPaketLabel,
  getPaketColor,
  hitungUmur,
} from '@/types/daycare';
import { PembayaranPendaftaranForm } from '@/components/daycare/PembayaranPendaftaranForm';

interface PendaftaranDetailData extends PendaftaranWithRelations {
  _totalBayar: number;
  _sisaTagihan: number;
  anak: PendaftaranWithRelations['anak'] & {
    orangTua?: {
      id: string;
      nama: string;
      relasi: string;
      nomorHP?: string | null;
      nomorHPDarurat?: string | null;
      email?: string | null;
      pekerjaan?: string | null;
      alamat?: string | null;
      isPrimary: boolean;
    }[];
  };
}

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function PendaftaranDetailPage({ params }: PageProps) {
  const { id } = use(params);
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(true);
  const [pendaftaran, setPendaftaran] = useState<PendaftaranDetailData | null>(null);
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
      const response = await fetch(`/api/daycare/pendaftaran/${id}`);

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
      const response = await fetch(`/api/daycare/pendaftaran/${id}`, {
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
      const response = await fetch(`/api/daycare/pembayaran-pendaftaran/${deletePaymentId}`, {
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

  const getWhatsAppLink = (phone: string, message?: string) => {
    // Remove any non-numeric characters except +
    let cleanPhone = phone.replace(/[^\d+]/g, '');
    // If starts with 0, replace with 62 (Indonesia country code)
    if (cleanPhone.startsWith('0')) {
      cleanPhone = '62' + cleanPhone.substring(1);
    }
    const baseUrl = `https://wa.me/${cleanPhone}`;
    return message ? `${baseUrl}?text=${encodeURIComponent(message)}` : baseUrl;
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <Loader2 className="w-8 h-8 animate-spin text-[#00BCD4]" />
      </div>
    );
  }

  if (error || !pendaftaran) {
    return (
      <Card className="max-w-md mx-auto">
        <CardContent className="pt-6 text-center">
          <AlertCircle className="w-12 h-12 mx-auto mb-4 text-red-500" />
          <h2 className="text-lg font-semibold mb-2">Oops!</h2>
          <p className="text-gray-600 mb-4">{error || 'Pendaftaran tidak ditemukan'}</p>
          <Button onClick={() => router.push('/units/daycare/kelola/pendaftaran')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Kembali
          </Button>
        </CardContent>
      </Card>
    );
  }

  // Calculate payment progress
  const totalBiaya = Number(pendaftaran.biayaPendaftaran);
  const totalBayar = pendaftaran._totalBayar || 0;
  const sisaTagihan = pendaftaran._sisaTagihan || 0;
  const progressPercent = totalBiaya > 0 ? Math.min((totalBayar / totalBiaya) * 100, 100) : 0;
  const isLunas = sisaTagihan <= 0;

  const anak = pendaftaran.anak;
  const primaryOrangTua = anak?.orangTua?.find((ot) => ot.isPrimary) || anak?.orangTua?.[0];
  const umur = anak?.tanggalLahir ? hitungUmur(anak.tanggalLahir) : null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" asChild>
            <Link href="/units/daycare/kelola/pendaftaran">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Kembali
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-[#006064]">Detail Pendaftaran</h1>
            <p className="text-gray-600">{anak?.namaLengkap}</p>
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
          <Badge className={getStatusColor(pendaftaran.status)}>
            {STATUS_PENDAFTARAN_OPTIONS.find((s) => s.value === pendaftaran.status)?.label}
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Child Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Baby className="w-5 h-5 text-[#00BCD4]" />
                Informasi Anak
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Nama Lengkap</p>
                  <p className="font-medium">{anak?.namaLengkap}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Nama Panggilan</p>
                  <p className="font-medium">{anak?.namaPanggilan || '-'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Nomor Induk</p>
                  <p className="font-medium">{anak?.nomorInduk}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Jenis Kelamin</p>
                  <p className="font-medium capitalize">{anak?.jenisKelamin || '-'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Tanggal Lahir</p>
                  <p className="font-medium">
                    {anak?.tanggalLahir ? formatTanggal(anak.tanggalLahir) : '-'}
                    {umur && <span className="text-gray-500 text-sm ml-2">({umur.text})</span>}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Paket Layanan</p>
                  <Badge className={getPaketColor(pendaftaran.paketDipilih)}>
                    {getPaketLabel(pendaftaran.paketDipilih)}
                  </Badge>
                </div>
              </div>

              {anak?.alamat && (
                <div className="pt-4 border-t">
                  <div className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-500">Alamat</p>
                      <p>{anak.alamat}</p>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

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
                  <p className="text-sm text-gray-500">Tanggal Daftar</p>
                  <p className="font-medium">{formatTanggal(pendaftaran.tanggalDaftar)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Tanggal Mulai</p>
                  <p className="font-medium">
                    {pendaftaran.tanggalMulai ? formatTanggal(pendaftaran.tanggalMulai) : '-'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Skema Pembayaran</p>
                  <p className="font-medium capitalize">{pendaftaran.schemaPembayaran}</p>
                </div>
                {pendaftaran.tanggalAktif && (
                  <div>
                    <p className="text-sm text-gray-500">Tanggal Aktif</p>
                    <p className="font-medium">{formatTanggal(pendaftaran.tanggalAktif)}</p>
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
                disabled={isLunas}
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
                  <p className="text-xl font-bold text-[#006064]">{formatRupiah(totalBiaya)}</p>
                </div>
                <div className="p-4 bg-green-50 rounded-lg">
                  <p className="text-sm text-gray-500">Sudah Dibayar</p>
                  <p className="text-xl font-bold text-green-600">{formatRupiah(totalBayar)}</p>
                </div>
                <div className={`p-4 rounded-lg ${isLunas ? 'bg-green-50' : 'bg-red-50'}`}>
                  <p className="text-sm text-gray-500">Sisa Tagihan</p>
                  <p className={`text-xl font-bold ${isLunas ? 'text-green-600' : 'text-red-600'}`}>
                    {formatRupiah(sisaTagihan)}
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
                    Pembayaran Lunas - Status pendaftaran otomatis menjadi Aktif
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
                        {pendaftaran.pembayaran.map((payment: DaycarePembayaranPendaftaran) => (
                          <TableRow key={payment.id}>
                            <TableCell>{formatTanggalSingkat(payment.tanggalBayar)}</TableCell>
                            <TableCell className="text-right font-medium">
                              {formatRupiah(Number(payment.nominal))}
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline">
                                {METODE_PEMBAYARAN_OPTIONS.find((m) => m.value === payment.metodePembayaran)?.label || payment.metodePembayaran}
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
                  <Badge variant="outline" className="mt-1 capitalize">
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

          {/* Child Status */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Status Anak</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-500">Status</span>
                <Badge className={getStatusColor(anak?.status || '')}>
                  {anak?.status}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-500">Paket Layanan</span>
                <Badge className={getPaketColor(anak?.paketLayanan || '')}>
                  {getPaketLabel(anak?.paketLayanan || '')}
                </Badge>
              </div>
              {anak?.tanggalMulai && (
                <div className="flex items-center justify-between">
                  <span className="text-gray-500">Mulai Aktif</span>
                  <span className="text-sm">{formatTanggalSingkat(anak.tanggalMulai)}</span>
                </div>
              )}
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
                disabled={isLunas}
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
                      `Assalamualaikum ${primaryOrangTua.nama}, informasi mengenai pendaftaran ${anak?.namaLengkap} di Daycare Al Muhajirin.`
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

          {/* Health & Special Notes */}
          {(anak?.alergiMakanan || anak?.catatanKesehatan || anak?.catatanKhusus) && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Catatan Penting</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {anak?.alergiMakanan && (
                  <div>
                    <p className="text-sm text-gray-500">Alergi Makanan</p>
                    <p className="text-red-600">{anak.alergiMakanan}</p>
                  </div>
                )}
                {anak?.catatanKesehatan && (
                  <div>
                    <p className="text-sm text-gray-500">Catatan Kesehatan</p>
                    <p>{anak.catatanKesehatan}</p>
                  </div>
                )}
                {anak?.catatanKhusus && (
                  <div>
                    <p className="text-sm text-gray-500">Catatan Khusus</p>
                    <p>{anak.catatanKhusus}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
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
