'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  ArrowLeft,
  User,
  Calendar,
  CreditCard,
  AlertCircle,
  Plus,
  MoreHorizontal,
  Trash2,
  Loader2,
} from 'lucide-react';
import { toast } from 'sonner';
import { PembayaranSppForm } from '@/components/kbtk';
import {
  KbtkTagihanSppWithRelations,
  KbtkPembayaranSpp,
  formatCurrency,
  formatTanggal,
  formatTanggalSingkat,
  getNamaBulan,
  formatKelompok,
  getStatusTagihanColor,
  isTagihanOverdue,
  STATUS_TAGIHAN_OPTIONS,
  METODE_PEMBAYARAN_OPTIONS,
} from '@/types/kbtk';

export default function TagihanDetailPage() {
  const params = useParams();
  const id = params?.id as string;

  const [tagihan, setTagihan] = useState<KbtkTagihanSppWithRelations | null>(null);
  const [loading, setLoading] = useState(true);

  // Payment dialog
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);
  const [paymentLoading, setPaymentLoading] = useState(false);

  // Delete dialog
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletePaymentId, setDeletePaymentId] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Fetch tagihan detail
  const fetchTagihan = useCallback(async () => {
    if (!id) return;

    setLoading(true);
    try {
      const res = await fetch(`/api/kbtk/tagihan-spp/${id}`);
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Gagal memuat data tagihan');
      }

      setTagihan(data);
    } catch (error) {
      console.error('Error fetching tagihan:', error);
      toast.error(error instanceof Error ? error.message : 'Gagal memuat data tagihan');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchTagihan();
  }, [fetchTagihan]);

  // Handle payment
  const handleSubmitPayment = async (data: {
    tagihanId: string;
    tanggalBayar: string;
    nominal: number;
    metodePembayaran: 'cash' | 'transfer';
    buktiTransfer?: string;
    catatan?: string;
  }) => {
    setPaymentLoading(true);
    try {
      const res = await fetch('/api/kbtk/pembayaran-spp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.error || 'Gagal menyimpan pembayaran');
      }

      toast.success('Pembayaran berhasil disimpan');
      setPaymentDialogOpen(false);
      fetchTagihan();
    } catch (error) {
      console.error('Error saving payment:', error);
      toast.error(error instanceof Error ? error.message : 'Gagal menyimpan pembayaran');
    } finally {
      setPaymentLoading(false);
    }
  };

  // Handle delete payment
  const handleDeletePayment = async () => {
    if (!deletePaymentId) return;

    setDeleteLoading(true);
    try {
      const res = await fetch(`/api/kbtk/pembayaran-spp/${deletePaymentId}`, {
        method: 'DELETE',
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.error || 'Gagal menghapus pembayaran');
      }

      toast.success('Pembayaran berhasil dihapus');
      setDeleteDialogOpen(false);
      setDeletePaymentId(null);
      fetchTagihan();
    } catch (error) {
      console.error('Error deleting payment:', error);
      toast.error(error instanceof Error ? error.message : 'Gagal menghapus pembayaran');
    } finally {
      setDeleteLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-[#00BCD4]" />
      </div>
    );
  }

  if (!tagihan) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="h-12 w-12 mx-auto text-red-500 mb-4" />
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Tagihan Tidak Ditemukan</h2>
        <p className="text-gray-500 mb-4">Data tagihan tidak dapat ditemukan</p>
        <Button asChild variant="outline">
          <Link href="/units/kbtk/kelola/spp">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Kembali ke SPP
          </Link>
        </Button>
      </div>
    );
  }

  const totalTagihan = Number(tagihan.totalTagihan);
  const totalBayar = tagihan._totalBayar || 0;
  const sisaTagihan = tagihan._sisaTagihan || 0;
  const progressPercent = totalTagihan > 0 ? Math.min((totalBayar / totalTagihan) * 100, 100) : 0;
  const overdue = isTagihanOverdue(tagihan.bulan, tagihan.tahun) && tagihan.status !== 'lunas';
  const statusOption = STATUS_TAGIHAN_OPTIONS.find((s) => s.value === tagihan.status);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button asChild variant="ghost" size="icon">
            <Link href="/units/kbtk/kelola/spp">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-[#006064]">Detail Tagihan SPP</h1>
            <p className="text-gray-500 mt-1">
              {getNamaBulan(tagihan.bulan)} {tagihan.tahun}
            </p>
          </div>
        </div>
        {tagihan.status !== 'lunas' && (
          <Button
            onClick={() => setPaymentDialogOpen(true)}
            className="bg-gradient-to-r from-[#00BCD4] to-[#006064] text-white"
          >
            <Plus className="h-4 w-4 mr-2" />
            Input Pembayaran
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Tagihan Info Card */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-[#006064]">Informasi Tagihan</CardTitle>
                <div className="flex items-center gap-2">
                  {overdue && (
                    <Badge className="bg-red-100 text-red-800">
                      <AlertCircle className="h-3 w-3 mr-1" />
                      Terlambat
                    </Badge>
                  )}
                  <Badge className={getStatusTagihanColor(tagihan.status)}>
                    {statusOption?.label || tagihan.status}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Progress Bar */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Progress Pembayaran</span>
                  <span className="font-medium">{progressPercent.toFixed(0)}%</span>
                </div>
                <Progress
                  value={progressPercent}
                  className="h-3"
                />
              </div>

              {/* Amount Summary */}
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <p className="text-xs text-gray-500 mb-1">Total Tagihan</p>
                  <p className="text-lg font-bold text-blue-600">
                    {formatCurrency(totalTagihan)}
                  </p>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <p className="text-xs text-gray-500 mb-1">Sudah Bayar</p>
                  <p className="text-lg font-bold text-green-600">
                    {formatCurrency(totalBayar)}
                  </p>
                </div>
                <div className="text-center p-4 bg-red-50 rounded-lg">
                  <p className="text-xs text-gray-500 mb-1">Sisa Tagihan</p>
                  <p className="text-lg font-bold text-red-600">
                    {formatCurrency(sisaTagihan)}
                  </p>
                </div>
              </div>

              {/* Detail Info */}
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-500">Periode:</span>
                  <p className="font-medium">
                    {getNamaBulan(tagihan.bulan)} {tagihan.tahun}
                  </p>
                </div>
                <div>
                  <span className="text-gray-500">Nominal SPP:</span>
                  <p className="font-medium">{formatCurrency(Number(tagihan.nominal))}</p>
                </div>
                {Number(tagihan.diskon) > 0 && (
                  <div>
                    <span className="text-gray-500">Diskon:</span>
                    <p className="font-medium text-green-600">
                      - {formatCurrency(Number(tagihan.diskon))}
                    </p>
                  </div>
                )}
                {tagihan.tanggalJatuhTempo && (
                  <div>
                    <span className="text-gray-500">Jatuh Tempo:</span>
                    <p className="font-medium">
                      {formatTanggal(tagihan.tanggalJatuhTempo)}
                    </p>
                  </div>
                )}
              </div>

              {tagihan.catatan && (
                <div className="p-3 bg-gray-50 rounded-lg">
                  <span className="text-xs text-gray-500">Catatan:</span>
                  <p className="text-sm mt-1">{tagihan.catatan}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Payment History Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-[#006064]">Riwayat Pembayaran</CardTitle>
              <CardDescription>
                Daftar pembayaran yang sudah dilakukan
              </CardDescription>
            </CardHeader>
            <CardContent>
              {tagihan.pembayaran && tagihan.pembayaran.length > 0 ? (
                <div className="rounded-lg border overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-gradient-to-r from-[#00BCD4]/5 to-[#006064]/5">
                        <TableHead className="font-semibold text-[#006064]">Tanggal</TableHead>
                        <TableHead className="font-semibold text-[#006064] text-right">Nominal</TableHead>
                        <TableHead className="font-semibold text-[#006064]">Metode</TableHead>
                        <TableHead className="font-semibold text-[#006064]">Catatan</TableHead>
                        <TableHead className="font-semibold text-[#006064] text-center">Aksi</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {tagihan.pembayaran.map((payment: KbtkPembayaranSpp) => {
                        const metode = METODE_PEMBAYARAN_OPTIONS.find(
                          (m) => m.value === payment.metodePembayaran
                        );
                        return (
                          <TableRow key={payment.id}>
                            <TableCell>
                              {formatTanggalSingkat(payment.tanggalBayar)}
                            </TableCell>
                            <TableCell className="text-right font-semibold text-green-600">
                              {formatCurrency(Number(payment.nominal))}
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline">
                                {metode?.label || payment.metodePembayaran}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-gray-500 text-sm max-w-[200px] truncate">
                              {payment.catatan || '-'}
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center justify-center">
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon" className="h-8 w-8">
                                      <MoreHorizontal className="h-4 w-4" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end">
                                    <DropdownMenuItem
                                      className="text-red-600"
                                      onClick={() => {
                                        setDeletePaymentId(payment.id);
                                        setDeleteDialogOpen(true);
                                      }}
                                    >
                                      <Trash2 className="h-4 w-4 mr-2" />
                                      Hapus
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </div>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <CreditCard className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                  <p>Belum ada pembayaran</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar - Student Info */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-[#006064]">Data Siswa</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="h-16 w-16 rounded-full bg-gradient-to-br from-[#00BCD4] to-[#006064] flex items-center justify-center">
                  <User className="h-8 w-8 text-white" />
                </div>
                <div>
                  <p className="font-semibold text-lg">{tagihan.siswa?.namaLengkap}</p>
                  <p className="text-sm text-gray-500">{tagihan.siswa?.nomorInduk}</p>
                </div>
              </div>

              <div className="space-y-3 pt-4 border-t">
                <div className="flex items-center gap-3 text-sm">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  <div>
                    <span className="text-gray-500">Kelompok:</span>
                    <p className="font-medium">
                      {tagihan.siswa &&
                        formatKelompok(
                          tagihan.siswa.kelompokLevel,
                          tagihan.siswa.kelompokKelas
                        )}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  <div>
                    <span className="text-gray-500">Tahun Ajaran:</span>
                    <p className="font-medium">{tagihan.siswa?.tahunAjaran}</p>
                  </div>
                </div>
              </div>

              <Button
                asChild
                variant="outline"
                className="w-full mt-4"
              >
                <Link href={`/units/kbtk/kelola/siswa/${tagihan.siswa?.id}`}>
                  Lihat Profil Siswa
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Payment Dialog */}
      <Dialog open={paymentDialogOpen} onOpenChange={setPaymentDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-[#006064]">Input Pembayaran SPP</DialogTitle>
            <DialogDescription>
              Masukkan data pembayaran SPP siswa
            </DialogDescription>
          </DialogHeader>
          <PembayaranSppForm
            tagihan={tagihan}
            onSubmit={handleSubmitPayment}
            onCancel={() => setPaymentDialogOpen(false)}
            loading={paymentLoading}
          />
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Pembayaran</AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin ingin menghapus pembayaran ini? Tindakan ini tidak dapat dibatalkan dan status tagihan akan diperbarui.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleteLoading}>Batal</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeletePayment}
              disabled={deleteLoading}
              className="bg-red-600 hover:bg-red-700"
            >
              {deleteLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
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
