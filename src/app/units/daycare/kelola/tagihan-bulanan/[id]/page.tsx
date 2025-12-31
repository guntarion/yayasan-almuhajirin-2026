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
  Calendar,
  MapPin,
  Receipt,
} from 'lucide-react';
import {
  DaycarePembayaranBulanan,
  STATUS_TAGIHAN_OPTIONS,
  METODE_PEMBAYARAN_OPTIONS,
  formatTanggal,
  formatTanggalSingkat,
  formatRupiah,
  getStatusColor,
  getPaketLabel,
  getPaketColor,
  getNamaBulan,
  hitungUmur,
} from '@/types/daycare';
import { PembayaranBulananForm, TagihanBulananForPayment } from '@/components/daycare/PembayaranBulananForm';

interface TagihanDetailData {
  id: string;
  anakId: string;
  bulan: number;
  tahun: number;
  paket: string;
  nominal: number;
  diskon: number;
  totalTagihan: number;
  status: string;
  tanggalJatuhTempo?: string | null;
  catatan?: string | null;
  createdAt: string;
  updatedAt: string;
  _totalBayar: number;
  _sisaTagihan: number;
  anak: {
    id: string;
    nomorInduk: string;
    namaLengkap: string;
    namaPanggilan?: string | null;
    jenisKelamin: string;
    tanggalLahir?: string | null;
    paketLayanan: string;
    status: string;
    foto?: string | null;
    alamat?: string | null;
    orangTua?: {
      id: string;
      nama: string;
      relasi: string;
      nomorHP?: string | null;
      nomorHPDarurat?: string | null;
      email?: string | null;
      isPrimary: boolean;
    }[];
  };
  pembayaran: DaycarePembayaranBulanan[];
}

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function TagihanDetailPage({ params }: PageProps) {
  const { id } = use(params);
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(true);
  const [tagihan, setTagihan] = useState<TagihanDetailData | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Dialogs
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const [deletePaymentId, setDeletePaymentId] = useState<string | null>(null);
  const [isDeletingPayment, setIsDeletingPayment] = useState(false);

  const fetchTagihan = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/daycare/tagihan-bulanan/${id}`);

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Tagihan tidak ditemukan');
        }
        throw new Error('Gagal mengambil data tagihan');
      }

      const data = await response.json();
      setTagihan(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Terjadi kesalahan');
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchTagihan();
  }, [fetchTagihan]);

  const handleDeletePayment = async () => {
    if (!deletePaymentId) return;

    setIsDeletingPayment(true);
    try {
      const response = await fetch(`/api/daycare/pembayaran-bulanan/${deletePaymentId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        fetchTagihan();
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
    let cleanPhone = phone.replace(/[^\d+]/g, '');
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

  if (error || !tagihan) {
    return (
      <Card className="max-w-md mx-auto">
        <CardContent className="pt-6 text-center">
          <AlertCircle className="w-12 h-12 mx-auto mb-4 text-red-500" />
          <h2 className="text-lg font-semibold mb-2">Oops!</h2>
          <p className="text-gray-600 mb-4">{error || 'Tagihan tidak ditemukan'}</p>
          <Button onClick={() => router.push('/units/daycare/kelola/tagihan-bulanan')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Kembali
          </Button>
        </CardContent>
      </Card>
    );
  }

  // Calculate payment progress
  const totalBiaya = Number(tagihan.totalTagihan);
  const totalBayar = tagihan._totalBayar || 0;
  const sisaTagihan = tagihan._sisaTagihan || 0;
  const progressPercent = totalBiaya > 0 ? Math.min((totalBayar / totalBiaya) * 100, 100) : 0;
  const isLunas = sisaTagihan <= 0;

  const anak = tagihan.anak;
  const primaryOrangTua = anak?.orangTua?.find((ot) => ot.isPrimary) || anak?.orangTua?.[0];
  const umur = anak?.tanggalLahir ? hitungUmur(anak.tanggalLahir) : null;

  // Convert tagihan to TagihanBulananForPayment format
  const tagihanForPayment: TagihanBulananForPayment = {
    id: tagihan.id,
    anakId: tagihan.anakId,
    bulan: tagihan.bulan,
    tahun: tagihan.tahun,
    anak: {
      id: anak.id,
      nomorInduk: anak.nomorInduk,
      namaLengkap: anak.namaLengkap,
      paketLayanan: anak.paketLayanan as 'FULLDAY' | 'AFTER_SCHOOL' | 'HARIAN',
    },
    nominal: tagihan.nominal as unknown as import('@prisma/client/runtime/library').Decimal,
    diskon: tagihan.diskon as unknown as import('@prisma/client/runtime/library').Decimal,
    totalTagihan: tagihan.totalTagihan as unknown as import('@prisma/client/runtime/library').Decimal,
    paket: tagihan.paket as 'FULLDAY' | 'AFTER_SCHOOL' | 'HARIAN',
    status: tagihan.status as 'belum_bayar' | 'bayar_sebagian' | 'lunas',
    tanggalJatuhTempo: tagihan.tanggalJatuhTempo ? new Date(tagihan.tanggalJatuhTempo) : null,
    catatan: tagihan.catatan ?? null,
    createdAt: new Date(tagihan.createdAt),
    updatedAt: new Date(tagihan.updatedAt),
    pembayaran: tagihan.pembayaran,
    _totalBayar: tagihan._totalBayar,
    _sisaTagihan: tagihan._sisaTagihan,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" asChild>
            <Link href="/units/daycare/kelola/tagihan-bulanan">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Kembali
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-[#006064]">Detail Tagihan</h1>
            <p className="text-gray-600">
              {getNamaBulan(tagihan.bulan)} {tagihan.tahun} - {anak?.namaLengkap}
            </p>
          </div>
        </div>
        <Badge className={getStatusColor(tagihan.status)}>
          {STATUS_TAGIHAN_OPTIONS.find((s) => s.value === tagihan.status)?.label || tagihan.status}
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Tagihan Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Receipt className="w-5 h-5 text-[#00BCD4]" />
                Informasi Tagihan
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Periode</p>
                  <p className="font-medium">{getNamaBulan(tagihan.bulan)} {tagihan.tahun}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Paket</p>
                  <Badge className={getPaketColor(tagihan.paket)}>
                    {getPaketLabel(tagihan.paket)}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Nominal</p>
                  <p className="font-medium">{formatRupiah(Number(tagihan.nominal))}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Diskon</p>
                  <p className="font-medium text-green-600">
                    {Number(tagihan.diskon) > 0 ? formatRupiah(Number(tagihan.diskon)) : '-'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Total Tagihan</p>
                  <p className="font-bold text-lg text-[#006064]">{formatRupiah(totalBiaya)}</p>
                </div>
                {tagihan.tanggalJatuhTempo && (
                  <div>
                    <p className="text-sm text-gray-500">Jatuh Tempo</p>
                    <p className="font-medium">{formatTanggal(tagihan.tanggalJatuhTempo)}</p>
                  </div>
                )}
              </div>

              {tagihan.catatan && (
                <div className="pt-4 border-t">
                  <p className="text-sm text-gray-500">Catatan</p>
                  <p className="mt-1">{tagihan.catatan}</p>
                </div>
              )}
            </CardContent>
          </Card>

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
                  <p className="text-sm text-gray-500">Status</p>
                  <Badge className={getStatusColor(anak?.status || '')}>
                    {anak?.status}
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

          {/* Payment Summary */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-[#00BCD4]" />
                  Ringkasan Pembayaran
                </CardTitle>
                <CardDescription>Status pembayaran tagihan bulanan</CardDescription>
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
                  <p className="text-sm text-gray-500">Total Tagihan</p>
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
                <Progress value={progressPercent} className="h-3" />
                {isLunas && (
                  <div className="flex items-center gap-2 text-green-600 text-sm">
                    <CheckCircle className="w-4 h-4" />
                    Tagihan Lunas
                  </div>
                )}
              </div>

              {/* Payment History */}
              <div className="pt-4 border-t">
                <h4 className="font-medium mb-4">Riwayat Pembayaran</h4>
                {tagihan.pembayaran && tagihan.pembayaran.length > 0 ? (
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
                        {tagihan.pembayaran.map((payment: DaycarePembayaranBulanan) => (
                          <TableRow key={payment.id}>
                            <TableCell>{formatTanggalSingkat(payment.tanggalBayar)}</TableCell>
                            <TableCell className="text-right font-medium">
                              {formatRupiah(Number(payment.nominal))}
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline">
                                {METODE_PEMBAYARAN_OPTIONS.find(
                                  (m) => m.value === payment.metodePembayaran
                                )?.label || payment.metodePembayaran}
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
              </CardContent>
            </Card>
          )}

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
              <Button variant="outline" className="w-full justify-start" asChild>
                <Link href={`/units/daycare/kelola/data-anak/${anak?.id}`}>
                  <User className="w-4 h-4 mr-2" />
                  Lihat Data Anak
                </Link>
              </Button>
              {primaryOrangTua?.nomorHP && (
                <Button variant="outline" className="w-full justify-start" asChild>
                  <a
                    href={getWhatsAppLink(
                      primaryOrangTua.nomorHP,
                      `Assalamualaikum ${primaryOrangTua.nama}, informasi mengenai tagihan bulanan ${anak?.namaLengkap} periode ${getNamaBulan(tagihan.bulan)} ${tagihan.tahun} di Daycare Al Muhajirin. Total: ${formatRupiah(totalBiaya)}, Sisa: ${formatRupiah(sisaTagihan)}`
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

          {/* Other Tagihan for this child */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Tagihan Anak Ini
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Button variant="link" className="p-0 h-auto text-[#00BCD4]" asChild>
                <Link href={`/units/daycare/kelola/tagihan-bulanan?anakId=${anak?.id}`}>
                  Lihat semua tagihan {anak?.namaLengkap}
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Payment Dialog */}
      <PembayaranBulananForm
        open={showPaymentDialog}
        onOpenChange={setShowPaymentDialog}
        tagihan={tagihanForPayment}
        onSuccess={fetchTagihan}
      />

      {/* Delete Payment Confirmation */}
      <AlertDialog open={!!deletePaymentId} onOpenChange={() => setDeletePaymentId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Pembayaran?</AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin ingin menghapus pembayaran ini? Status tagihan akan diupdate secara otomatis.
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
