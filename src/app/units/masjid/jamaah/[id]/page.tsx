// src/app/units/masjid/jamaah/[id]/page.tsx
'use client';

import React, { useState, useEffect, useCallback, use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Edit,
  Trash2,
  User,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Briefcase,
  Heart,
  Stethoscope,
  Users,
  Clock,
  AlertCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
import { JamaahFormDialog } from '@/components/jamaah';
import { Jamaah, RiwayatKlinik, DonasiJamaah } from '@/types/jamaah';

interface JamaahDetail extends Jamaah {
  riwayatKlinikTerbaru?: RiwayatKlinik[];
  donasiTerbaru?: DonasiJamaah[];
}

export default function MasjidJamaahDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [jamaah, setJamaah] = useState<JamaahDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const fetchJamaah = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/jamaah/${id}`);
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Gagal mengambil data jamaah');
      }

      setJamaah(result.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Terjadi kesalahan');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchJamaah();
  }, [fetchJamaah]);

  const handleDelete = async () => {
    setDeleting(true);
    try {
      const response = await fetch(`/api/jamaah/${id}`, {
        method: 'DELETE',
      });

      const result = await response.json();

      if (!response.ok) {
        if (result.hasRelatedRecords) {
          setError(
            `Jamaah memiliki ${result.riwayatKlinik} riwayat klinik dan ${result.donasiLazmu} donasi. Hapus data terkait terlebih dahulu.`
          );
          return;
        }
        throw new Error(result.error || 'Gagal menghapus jamaah');
      }

      router.push('/jamaah');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Terjadi kesalahan');
    } finally {
      setDeleting(false);
      setDeleteDialogOpen(false);
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#B2EBF2]/5 to-[#80DEEA]/5 p-6">
        <div className="container mx-auto max-w-4xl">
          <Skeleton className="h-8 w-48 mb-6" />
          <Card className="rounded-2xl">
            <CardContent className="pt-6">
              <div className="space-y-4">
                <Skeleton className="h-10 w-3/4" />
                <Skeleton className="h-6 w-1/2" />
                <Skeleton className="h-24 w-full" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (error || !jamaah) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#B2EBF2]/5 to-[#80DEEA]/5 p-6">
        <div className="container mx-auto max-w-4xl">
          <Card className="border-2 border-red-200 bg-gradient-to-br from-red-50 to-red-100/50 rounded-2xl">
            <CardContent className="pt-6 text-center">
              <div className="mx-auto w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mb-4">
                <AlertCircle className="h-6 w-6 text-red-600" />
              </div>
              <p className="text-red-600 font-medium">{error || 'Jamaah tidak ditemukan'}</p>
              <Button
                asChild
                variant="outline"
                className="mt-4 rounded-xl"
              >
                <Link href="/jamaah">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Kembali ke Daftar Jamaah
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#B2EBF2]/5 to-[#80DEEA]/5">
      {/* Header */}
      <div className="relative overflow-hidden bg-gradient-to-r from-white via-[#B2EBF2]/20 to-[#80DEEA]/20 px-4 sm:px-6 lg:px-8 py-6 rounded-b-3xl border-b border-[#00BCD4]/10">
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-gradient-to-br from-[#00BCD4]/20 to-[#80DEEA]/20 rounded-full blur-3xl" />

        <div className="relative z-10 container mx-auto max-w-4xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                asChild
                className="hover:bg-[#B2EBF2]/50 rounded-xl"
              >
                <Link href="/jamaah">
                  <ArrowLeft className="h-5 w-5 text-[#006064]" />
                </Link>
              </Button>
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <div className="w-1 h-6 bg-gradient-to-b from-[#00BCD4] to-[#006064] rounded-full" />
                  <h1 className="text-2xl font-bold text-[#006064]">{jamaah.namaDisplay}</h1>
                </div>
                <div className="flex items-center gap-2 ml-4">
                  {jamaah.isJamaahAktif ? (
                    <Badge className="bg-green-100 text-green-700">Jamaah Aktif</Badge>
                  ) : (
                    <Badge className="bg-gray-100 text-gray-600">Tidak Aktif</Badge>
                  )}
                  {jamaah.isDonatur && (
                    <Badge className="bg-amber-100 text-amber-700">Donatur</Badge>
                  )}
                  {jamaah.isPengunjungKlinik && (
                    <Badge className="bg-purple-100 text-purple-700">Pasien Klinik</Badge>
                  )}
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setEditDialogOpen(true)}
                className="rounded-xl border-2 border-[#00BCD4]/30 hover:border-[#00BCD4] hover:bg-[#B2EBF2]/20"
              >
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Button>
              <Button
                variant="outline"
                onClick={() => setDeleteDialogOpen(true)}
                className="rounded-xl border-2 border-red-300 text-red-600 hover:bg-red-50"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-6">
        {/* Info Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <Card className="border-2 border-gray-100 rounded-2xl">
            <CardContent className="pt-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-[#B2EBF2]">
                  <User className="h-5 w-5 text-[#006064]" />
                </div>
                <div>
                  <p className="text-xs text-gray-600">Gender</p>
                  <p className="text-sm font-bold text-gray-900">
                    {jamaah.gender === 'lelaki'
                      ? 'Laki-laki'
                      : jamaah.gender === 'perempuan'
                        ? 'Perempuan'
                        : '-'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 border-gray-100 rounded-2xl">
            <CardContent className="pt-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-amber-100">
                  <Heart className="h-5 w-5 text-amber-700" />
                </div>
                <div>
                  <p className="text-xs text-gray-600">Total Donasi</p>
                  <p className="text-sm font-bold text-gray-900">{jamaah.jumlahDonasi || 0}x</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 border-gray-100 rounded-2xl">
            <CardContent className="pt-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-purple-100">
                  <Stethoscope className="h-5 w-5 text-purple-700" />
                </div>
                <div>
                  <p className="text-xs text-gray-600">Kunjungan Klinik</p>
                  <p className="text-sm font-bold text-gray-900">
                    {jamaah.jumlahKunjunganKlinik || 0}x
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 border-gray-100 rounded-2xl">
            <CardContent className="pt-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-green-100">
                  <Clock className="h-5 w-5 text-green-700" />
                </div>
                <div>
                  <p className="text-xs text-gray-600">Terdaftar</p>
                  <p className="text-sm font-bold text-gray-900">
                    {new Date(jamaah.createdAt).toLocaleDateString('id-ID', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="info" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6 bg-gradient-to-r from-[#00BCD4]/10 to-[#80DEEA]/10 p-1 rounded-xl">
            <TabsTrigger
              value="info"
              className="rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#00BCD4] data-[state=active]:to-[#006064] data-[state=active]:text-white font-semibold transition-all duration-300"
            >
              <User className="h-4 w-4 mr-2" />
              Informasi
            </TabsTrigger>
            <TabsTrigger
              value="donasi"
              className="rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#00BCD4] data-[state=active]:to-[#006064] data-[state=active]:text-white font-semibold transition-all duration-300"
            >
              <Heart className="h-4 w-4 mr-2" />
              Donasi
            </TabsTrigger>
            <TabsTrigger
              value="klinik"
              className="rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#00BCD4] data-[state=active]:to-[#006064] data-[state=active]:text-white font-semibold transition-all duration-300"
            >
              <Stethoscope className="h-4 w-4 mr-2" />
              Riwayat Klinik
            </TabsTrigger>
          </TabsList>

          <TabsContent value="info">
            <Card className="border-2 border-[#00BCD4]/20 rounded-2xl">
              <CardHeader className="bg-gradient-to-r from-[#B2EBF2]/20 to-transparent border-b border-[#00BCD4]/10">
                <CardTitle className="flex items-center gap-2 text-[#006064]">
                  <Users className="h-5 w-5 text-[#00BCD4]" />
                  Informasi Lengkap
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6 space-y-6">
                {/* Personal Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl bg-gradient-to-r from-[#80DEEA]/10 to-[#00BCD4]/10">
                    <p className="text-sm font-semibold text-[#006064] mb-1">Nama Lengkap</p>
                    <p className="text-gray-700">
                      {jamaah.sebutan ? `${jamaah.sebutan} ` : ''}
                      {jamaah.nama}
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-gradient-to-r from-[#80DEEA]/10 to-[#00BCD4]/10">
                    <p className="text-sm font-semibold text-[#006064] mb-1">Profesi</p>
                    <p className="text-gray-700">{jamaah.profesi || '-'}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-start gap-3 p-4 rounded-xl border">
                    <Calendar className="h-5 w-5 text-[#00BCD4] mt-0.5" />
                    <div>
                      <p className="text-sm font-semibold text-[#006064]">Tanggal Lahir</p>
                      <p className="text-gray-700">{formatDate(jamaah.tanggalLahir)}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-4 rounded-xl border">
                    <Briefcase className="h-5 w-5 text-[#00BCD4] mt-0.5" />
                    <div>
                      <p className="text-sm font-semibold text-[#006064]">Profesi</p>
                      <p className="text-gray-700">{jamaah.profesi || '-'}</p>
                    </div>
                  </div>
                </div>

                {/* Contact */}
                <div className="space-y-3">
                  <h4 className="font-semibold text-[#006064]">Kontak</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center gap-3 p-4 rounded-xl border">
                      <Phone className="h-5 w-5 text-[#00BCD4]" />
                      <div>
                        <p className="text-sm font-semibold text-[#006064]">No. HP/WhatsApp</p>
                        <p className="text-gray-700">{jamaah.nomerHandphone || '-'}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 p-4 rounded-xl border">
                      <Mail className="h-5 w-5 text-[#00BCD4]" />
                      <div>
                        <p className="text-sm font-semibold text-[#006064]">Email</p>
                        <p className="text-gray-700">{jamaah.email || '-'}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Address */}
                <div className="space-y-3">
                  <h4 className="font-semibold text-[#006064]">Alamat</h4>
                  <div className="flex items-start gap-3 p-4 rounded-xl border bg-gray-50">
                    <MapPin className="h-5 w-5 text-[#4CAF50] mt-0.5" />
                    <div>
                      <p className="text-gray-700">{jamaah.alamatLengkap || '-'}</p>
                      {jamaah.alamatJalan && (
                        <p className="text-sm text-gray-500 mt-1">{jamaah.alamatJalan}</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Notes */}
                {jamaah.catatan && (
                  <div className="space-y-3">
                    <h4 className="font-semibold text-[#006064]">Catatan</h4>
                    <div className="p-4 rounded-xl bg-gradient-to-r from-[#00BCD4]/10 to-[#006064]/10">
                      <p className="text-gray-700 whitespace-pre-wrap">{jamaah.catatan}</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="donasi">
            <Card className="border-2 border-[#00BCD4]/20 rounded-2xl">
              <CardHeader className="bg-gradient-to-r from-amber-100/50 to-transparent border-b border-amber-200/50">
                <CardTitle className="flex items-center gap-2 text-amber-700">
                  <Heart className="h-5 w-5" />
                  Riwayat Donasi LAZMU
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                {jamaah.totalDonasiVerified !== undefined && jamaah.totalDonasiVerified > 0 && (
                  <div className="p-4 rounded-xl bg-gradient-to-r from-amber-100 to-amber-50 mb-6">
                    <p className="text-sm text-amber-700">Total Donasi Terverifikasi</p>
                    <p className="text-2xl font-bold text-amber-800">
                      {formatCurrency(jamaah.totalDonasiVerified)}
                    </p>
                  </div>
                )}

                {jamaah.donasiTerbaru && jamaah.donasiTerbaru.length > 0 ? (
                  <div className="space-y-4">
                    {jamaah.donasiTerbaru.map((donasi) => (
                      <div
                        key={donasi.id}
                        className="p-4 rounded-xl border hover:border-amber-300 transition-colors"
                      >
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <p className="font-semibold">{donasi.jenisDonasi}</p>
                            {donasi.programDonasi && (
                              <p className="text-sm text-gray-500">{donasi.programDonasi}</p>
                            )}
                          </div>
                          <Badge className={donasi.isVerified ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}>
                            {donasi.isVerified ? 'Terverifikasi' : 'Pending'}
                          </Badge>
                        </div>
                        <div className="flex justify-between items-center">
                          <p className="text-lg font-bold text-amber-700">
                            {formatCurrency(donasi.jumlah)}
                          </p>
                          <p className="text-sm text-gray-500">{formatDate(donasi.tanggalDonasi)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <Heart className="h-12 w-12 mx-auto text-gray-300 mb-3" />
                    <p>Belum ada riwayat donasi</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="klinik">
            <Card className="border-2 border-[#00BCD4]/20 rounded-2xl">
              <CardHeader className="bg-gradient-to-r from-purple-100/50 to-transparent border-b border-purple-200/50">
                <CardTitle className="flex items-center gap-2 text-purple-700">
                  <Stethoscope className="h-5 w-5" />
                  Riwayat Kunjungan Poliklinik
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                {jamaah.riwayatKlinikTerbaru && jamaah.riwayatKlinikTerbaru.length > 0 ? (
                  <div className="space-y-4">
                    {jamaah.riwayatKlinikTerbaru.map((riwayat) => (
                      <div
                        key={riwayat.id}
                        className="p-4 rounded-xl border hover:border-purple-300 transition-colors"
                      >
                        <div className="flex justify-between items-start mb-3">
                          <p className="font-semibold text-purple-700">
                            {formatDate(riwayat.tanggalKunjungan)}
                          </p>
                          {riwayat.dokter && (
                            <Badge variant="outline" className="text-purple-600 border-purple-300">
                              {riwayat.dokter}
                            </Badge>
                          )}
                        </div>
                        {riwayat.keluhan && (
                          <div className="mb-2">
                            <p className="text-xs font-semibold text-gray-500">Keluhan:</p>
                            <p className="text-sm">{riwayat.keluhan}</p>
                          </div>
                        )}
                        {riwayat.diagnosa && (
                          <div className="mb-2">
                            <p className="text-xs font-semibold text-gray-500">Diagnosa:</p>
                            <p className="text-sm">{riwayat.diagnosa}</p>
                          </div>
                        )}
                        {riwayat.tindakan && (
                          <div>
                            <p className="text-xs font-semibold text-gray-500">Tindakan:</p>
                            <p className="text-sm">{riwayat.tindakan}</p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <Stethoscope className="h-12 w-12 mx-auto text-gray-300 mb-3" />
                    <p>Belum ada riwayat kunjungan klinik</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Edit Dialog */}
      <JamaahFormDialog
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        jamaah={jamaah}
        onSuccess={fetchJamaah}
        mode="masjid"
      />

      {/* Delete Confirmation */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent className="rounded-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Data Jamaah?</AlertDialogTitle>
            <AlertDialogDescription>
              Tindakan ini tidak dapat dibatalkan. Data jamaah &quot;{jamaah.namaDisplay}&quot; akan
              dihapus permanen dari sistem.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-xl">Batal</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={deleting}
              className="bg-red-600 hover:bg-red-700 rounded-xl"
            >
              {deleting ? 'Menghapus...' : 'Ya, Hapus'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
