'use client';

import { useState, useEffect, useCallback, use } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
import { SiswaFormDialog } from '@/components/kbtk/SiswaFormDialog';
import { OrangTuaForm } from '@/components/kbtk/OrangTuaForm';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  KbtkSiswaWithRelations,
  KbtkTagihanSppWithRelations,
  OrangTuaFormData,
  RELASI_OPTIONS,
  STATUS_SISWA_OPTIONS,
  STATUS_TAGIHAN_OPTIONS,
  formatUmur,
  formatTanggal,
  formatTanggalSingkat,
  formatKelompok,
  formatCurrency,
  getStatusSiswaColor,
  getStatusTagihanColor,
  getNamaBulan,
  getWhatsAppLink,
} from '@/types/kbtk';
import {
  ArrowLeft,
  Edit,
  User,
  Users,
  Phone,
  Mail,
  MapPin,
  Briefcase,
  Star,
  Calendar,
  CreditCard,
  AlertCircle,
  CheckCircle,
  Plus,
  Trash2,
  Loader2,
} from 'lucide-react';
import { toast } from 'sonner';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function SiswaDetailPage({ params }: PageProps) {
  const { id } = use(params);
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(true);
  const [siswa, setSiswa] = useState<KbtkSiswaWithRelations | null>(null);

  // Dialogs
  const [isEditFormOpen, setIsEditFormOpen] = useState(false);
  const [isOrangTuaDialogOpen, setIsOrangTuaDialogOpen] = useState(false);
  const [editingOrangTua, setEditingOrangTua] = useState<OrangTuaFormData | null>(null);
  const [isOrangTuaSaving, setIsOrangTuaSaving] = useState(false);
  const [deleteOrangTuaId, setDeleteOrangTuaId] = useState<string | null>(null);

  const fetchSiswa = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/kbtk/siswa/${id}`);
      if (!response.ok) {
        if (response.status === 404) {
          toast.error('Siswa tidak ditemukan');
          router.push('/units/kbtk/kelola/data-siswa');
          return;
        }
        throw new Error('Failed to fetch siswa');
      }
      const data = await response.json();
      setSiswa(data);
    } catch (error) {
      console.error('Error fetching siswa:', error);
      toast.error('Gagal mengambil data siswa');
    } finally {
      setIsLoading(false);
    }
  }, [id, router]);

  useEffect(() => {
    fetchSiswa();
  }, [fetchSiswa]);

  const handleEditSuccess = () => {
    fetchSiswa();
    setIsEditFormOpen(false);
  };

  // Orang Tua CRUD handlers
  const handleAddOrangTua = () => {
    setEditingOrangTua({
      nama: '',
      relasi: 'wali',
      nomorHP: '',
      email: '',
      pekerjaan: '',
      alamat: '',
      isPrimary: !siswa?.orangTua || siswa.orangTua.length === 0,
    });
    setIsOrangTuaDialogOpen(true);
  };

  const handleEditOrangTua = (ot: OrangTuaFormData & { id: string }) => {
    setEditingOrangTua({
      id: ot.id,
      nama: ot.nama,
      relasi: ot.relasi,
      nomorHP: ot.nomorHP || '',
      email: ot.email || '',
      pekerjaan: ot.pekerjaan || '',
      alamat: ot.alamat || '',
      isPrimary: ot.isPrimary,
    });
    setIsOrangTuaDialogOpen(true);
  };

  const handleSaveOrangTua = async () => {
    if (!editingOrangTua || !siswa) return;

    if (!editingOrangTua.nama.trim()) {
      toast.error('Nama orang tua wajib diisi');
      return;
    }

    setIsOrangTuaSaving(true);
    try {
      const isEdit = !!editingOrangTua.id;
      const url = isEdit
        ? `/api/kbtk/orang-tua/${editingOrangTua.id}`
        : '/api/kbtk/orang-tua';

      const response = await fetch(url, {
        method: isEdit ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...editingOrangTua,
          siswaId: siswa.id,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Gagal menyimpan data orang tua');
      }

      toast.success(isEdit ? 'Orang tua berhasil diperbarui' : 'Orang tua berhasil ditambahkan');
      setIsOrangTuaDialogOpen(false);
      setEditingOrangTua(null);
      fetchSiswa();
    } catch (error) {
      console.error('Error saving orang tua:', error);
      toast.error(error instanceof Error ? error.message : 'Gagal menyimpan data orang tua');
    } finally {
      setIsOrangTuaSaving(false);
    }
  };

  const handleDeleteOrangTua = async () => {
    if (!deleteOrangTuaId) return;

    try {
      const response = await fetch(`/api/kbtk/orang-tua/${deleteOrangTuaId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Gagal menghapus orang tua');
      }

      toast.success('Orang tua berhasil dihapus');
      setDeleteOrangTuaId(null);
      fetchSiswa();
    } catch (error) {
      console.error('Error deleting orang tua:', error);
      toast.error(error instanceof Error ? error.message : 'Gagal menghapus orang tua');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-[#00BCD4]/5 flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-[#00BCD4] animate-spin" />
      </div>
    );
  }

  if (!siswa) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-[#00BCD4]/5 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <p className="text-gray-600 text-lg">Data siswa tidak ditemukan</p>
          <Button
            onClick={() => router.push('/units/kbtk/kelola/data-siswa')}
            className="mt-4"
          >
            Kembali ke Daftar Siswa
          </Button>
        </div>
      </div>
    );
  }

  const statusOption = STATUS_SISWA_OPTIONS.find((s) => s.value === siswa.status);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-[#00BCD4]/5">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              onClick={() => router.push('/units/kbtk/kelola/data-siswa')}
              className="rounded-xl"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Kembali
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-[#006064]">Detail Siswa</h1>
              <p className="text-gray-500">{siswa.nomorInduk}</p>
            </div>
          </div>
          <Button
            onClick={() => setIsEditFormOpen(true)}
            className="bg-[#00BCD4] hover:bg-[#006064] text-white rounded-xl"
          >
            <Edit className="w-4 h-4 mr-2" />
            Edit Data
          </Button>
        </div>

        {/* Profile Card */}
        <Card className="mb-6 border-0 shadow-lg rounded-2xl overflow-hidden">
          <div className="bg-gradient-to-r from-[#00BCD4] to-[#006064] p-6">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
              {/* Photo Placeholder */}
              <div className="w-24 h-24 bg-white/20 rounded-2xl flex items-center justify-center">
                <User className="w-12 h-12 text-white" />
              </div>

              {/* Basic Info */}
              <div className="flex-1 text-white">
                <h2 className="text-2xl font-bold">{siswa.namaLengkap}</h2>
                {siswa.namaPanggilan && (
                  <p className="text-white/80">({siswa.namaPanggilan})</p>
                )}
                <div className="flex flex-wrap items-center gap-3 mt-3">
                  <Badge
                    variant="outline"
                    className="border-white/50 text-white bg-white/10"
                  >
                    {formatKelompok(siswa.kelompokLevel, siswa.kelompokKelas)}
                  </Badge>
                  <Badge className={`${getStatusSiswaColor(siswa.status)}`}>
                    {statusOption?.label || siswa.status}
                  </Badge>
                  <span className="text-white/80">
                    TA {siswa.tahunAjaran}
                  </span>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-4 text-white text-center">
                <div className="bg-white/10 rounded-xl px-4 py-2">
                  <p className="text-2xl font-bold">
                    {formatUmur(siswa.tanggalLahir).split(' ')[0]}
                  </p>
                  <p className="text-xs text-white/70">Umur</p>
                </div>
                <div className="bg-white/10 rounded-xl px-4 py-2">
                  <p className="text-2xl font-bold">{siswa.orangTua?.length || 0}</p>
                  <p className="text-xs text-white/70">Orang Tua</p>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Tabs */}
        <Tabs defaultValue="data-siswa" className="space-y-4">
          <TabsList className="bg-white shadow rounded-xl p-1">
            <TabsTrigger
              value="data-siswa"
              className="rounded-lg data-[state=active]:bg-[#00BCD4] data-[state=active]:text-white"
            >
              <User className="w-4 h-4 mr-2" />
              Data Siswa
            </TabsTrigger>
            <TabsTrigger
              value="orang-tua"
              className="rounded-lg data-[state=active]:bg-[#00BCD4] data-[state=active]:text-white"
            >
              <Users className="w-4 h-4 mr-2" />
              Data Orang Tua
            </TabsTrigger>
            <TabsTrigger
              value="pembayaran"
              className="rounded-lg data-[state=active]:bg-[#00BCD4] data-[state=active]:text-white"
            >
              <CreditCard className="w-4 h-4 mr-2" />
              Riwayat Pembayaran
            </TabsTrigger>
          </TabsList>

          {/* Data Siswa Tab */}
          <TabsContent value="data-siswa">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="border-0 shadow-lg rounded-2xl">
                <CardHeader className="border-b bg-gradient-to-r from-[#00BCD4]/10 to-transparent">
                  <CardTitle className="text-lg text-[#006064]">
                    Informasi Pribadi
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-4 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Nama Lengkap</p>
                      <p className="font-medium">{siswa.namaLengkap}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Nama Panggilan</p>
                      <p className="font-medium">{siswa.namaPanggilan || '-'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Jenis Kelamin</p>
                      <p className="font-medium">
                        {siswa.jenisKelamin === 'lelaki' ? 'Laki-laki' : 'Perempuan'}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Tempat Lahir</p>
                      <p className="font-medium">{siswa.tempatLahir || '-'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Tanggal Lahir</p>
                      <p className="font-medium">{formatTanggal(siswa.tanggalLahir)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Umur</p>
                      <p className="font-medium">{formatUmur(siswa.tanggalLahir)}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Alamat</p>
                    <p className="font-medium">{siswa.alamat || '-'}</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg rounded-2xl">
                <CardHeader className="border-b bg-gradient-to-r from-[#00BCD4]/10 to-transparent">
                  <CardTitle className="text-lg text-[#006064]">
                    Informasi Akademik
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-4 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Nomor Induk</p>
                      <p className="font-mono font-medium">{siswa.nomorInduk}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Kelompok/Kelas</p>
                      <Badge
                        variant="outline"
                        className={`${
                          siswa.kelompokLevel === 'KB'
                            ? 'border-pink-500 text-pink-600 bg-pink-50'
                            : 'border-purple-500 text-purple-600 bg-purple-50'
                        }`}
                      >
                        {formatKelompok(siswa.kelompokLevel, siswa.kelompokKelas)}
                      </Badge>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Tahun Ajaran</p>
                      <p className="font-medium">{siswa.tahunAjaran}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Tanggal Masuk</p>
                      <p className="font-medium">{formatTanggal(siswa.tanggalMasuk)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Status</p>
                      <Badge className={getStatusSiswaColor(siswa.status)}>
                        {statusOption?.label || siswa.status}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {siswa.catatanKhusus && (
                <Card className="border-0 shadow-lg rounded-2xl lg:col-span-2">
                  <CardHeader className="border-b bg-gradient-to-r from-yellow-50 to-transparent">
                    <CardTitle className="text-lg text-yellow-700 flex items-center gap-2">
                      <AlertCircle className="w-5 h-5" />
                      Catatan Khusus
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <p className="text-gray-700 whitespace-pre-wrap">
                      {siswa.catatanKhusus}
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          {/* Orang Tua Tab */}
          <TabsContent value="orang-tua">
            <Card className="border-0 shadow-lg rounded-2xl">
              <CardHeader className="border-b bg-gradient-to-r from-[#00BCD4]/10 to-transparent">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg text-[#006064]">
                    Data Orang Tua / Wali
                  </CardTitle>
                  <Button
                    onClick={handleAddOrangTua}
                    className="bg-[#00BCD4] hover:bg-[#006064] text-white rounded-xl"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Tambah Orang Tua
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="pt-4">
                {siswa.orangTua && siswa.orangTua.length > 0 ? (
                  <div className="grid gap-4">
                    {siswa.orangTua.map((ot) => (
                      <Card
                        key={ot.id}
                        className="border border-gray-200 bg-gradient-to-br from-white to-gray-50"
                      >
                        <CardContent className="pt-4">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                {ot.isPrimary && (
                                  <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                                )}
                                <h4 className="font-semibold text-lg text-[#006064]">
                                  {ot.nama}
                                </h4>
                                <Badge variant="outline">
                                  {RELASI_OPTIONS.find((r) => r.value === ot.relasi)?.label ||
                                    ot.relasi}
                                </Badge>
                              </div>

                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                                {ot.nomorHP && (
                                  <div className="flex items-center gap-2">
                                    <Phone className="w-4 h-4 text-gray-400" />
                                    <a
                                      href={getWhatsAppLink(ot.nomorHP)}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="text-green-600 hover:underline"
                                    >
                                      {ot.nomorHP}
                                    </a>
                                  </div>
                                )}
                                {ot.email && (
                                  <div className="flex items-center gap-2">
                                    <Mail className="w-4 h-4 text-gray-400" />
                                    <a
                                      href={`mailto:${ot.email}`}
                                      className="text-blue-600 hover:underline"
                                    >
                                      {ot.email}
                                    </a>
                                  </div>
                                )}
                                {ot.pekerjaan && (
                                  <div className="flex items-center gap-2">
                                    <Briefcase className="w-4 h-4 text-gray-400" />
                                    <span>{ot.pekerjaan}</span>
                                  </div>
                                )}
                                {ot.alamat && (
                                  <div className="flex items-center gap-2">
                                    <MapPin className="w-4 h-4 text-gray-400" />
                                    <span>{ot.alamat}</span>
                                  </div>
                                )}
                              </div>
                            </div>

                            <div className="flex gap-2 ml-4">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() =>
                                  handleEditOrangTua({
                                    id: ot.id,
                                    nama: ot.nama,
                                    relasi: ot.relasi as 'ayah' | 'ibu' | 'wali',
                                    nomorHP: ot.nomorHP || '',
                                    email: ot.email || '',
                                    pekerjaan: ot.pekerjaan || '',
                                    alamat: ot.alamat || '',
                                    isPrimary: ot.isPrimary,
                                  })
                                }
                                className="border-[#00BCD4] text-[#006064] hover:bg-[#00BCD4]/10"
                              >
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setDeleteOrangTuaId(ot.id)}
                                className="border-red-300 text-red-600 hover:bg-red-50"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500 text-lg">
                      Belum ada data orang tua
                    </p>
                    <Button
                      onClick={handleAddOrangTua}
                      className="mt-4 bg-[#00BCD4] hover:bg-[#006064] text-white"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Tambah Orang Tua
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Pembayaran Tab */}
          <TabsContent value="pembayaran">
            <div className="space-y-6">
              {/* Pendaftaran Section */}
              <Card className="border-0 shadow-lg rounded-2xl">
                <CardHeader className="border-b bg-gradient-to-r from-[#00BCD4]/10 to-transparent">
                  <CardTitle className="text-lg text-[#006064] flex items-center gap-2">
                    <Calendar className="w-5 h-5" />
                    Biaya Pendaftaran
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-4">
                  {siswa.pendaftaran ? (
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="bg-gray-50 rounded-xl p-4">
                          <p className="text-sm text-gray-500">Total Biaya</p>
                          <p className="text-lg font-bold text-[#006064]">
                            {formatCurrency(Number(siswa.pendaftaran.biayaPendaftaran))}
                          </p>
                        </div>
                        <div className="bg-green-50 rounded-xl p-4">
                          <p className="text-sm text-gray-500">Sudah Dibayar</p>
                          <p className="text-lg font-bold text-green-600">
                            {formatCurrency(siswa.pendaftaran._totalBayar || 0)}
                          </p>
                        </div>
                        <div className="bg-red-50 rounded-xl p-4">
                          <p className="text-sm text-gray-500">Sisa Tagihan</p>
                          <p className="text-lg font-bold text-red-600">
                            {formatCurrency(siswa.pendaftaran._sisaTagihan || 0)}
                          </p>
                        </div>
                        <div className="bg-blue-50 rounded-xl p-4">
                          <p className="text-sm text-gray-500">Status</p>
                          <Badge
                            className={`mt-1 ${
                              (siswa.pendaftaran._sisaTagihan || 0) <= 0
                                ? 'bg-green-100 text-green-800'
                                : 'bg-yellow-100 text-yellow-800'
                            }`}
                          >
                            {(siswa.pendaftaran._sisaTagihan || 0) <= 0 ? (
                              <><CheckCircle className="w-3 h-3 mr-1" /> Lunas</>
                            ) : (
                              'Belum Lunas'
                            )}
                          </Badge>
                        </div>
                      </div>

                      {siswa.pendaftaran.pembayaran &&
                        siswa.pendaftaran.pembayaran.length > 0 && (
                          <div className="mt-4">
                            <h4 className="font-medium text-gray-700 mb-2">
                              Riwayat Pembayaran Pendaftaran
                            </h4>
                            <Table>
                              <TableHeader>
                                <TableRow className="bg-gray-50">
                                  <TableHead>Tanggal</TableHead>
                                  <TableHead>Nominal</TableHead>
                                  <TableHead>Metode</TableHead>
                                  <TableHead>Catatan</TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {siswa.pendaftaran.pembayaran.map((p) => (
                                  <TableRow key={p.id}>
                                    <TableCell>
                                      {formatTanggalSingkat(p.tanggalBayar)}
                                    </TableCell>
                                    <TableCell className="font-medium">
                                      {formatCurrency(Number(p.nominal))}
                                    </TableCell>
                                    <TableCell className="capitalize">
                                      {p.metodePembayaran}
                                    </TableCell>
                                    <TableCell>{p.catatan || '-'}</TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          </div>
                        )}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <CreditCard className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                      <p>Belum ada data pendaftaran</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* SPP Section */}
              <Card className="border-0 shadow-lg rounded-2xl">
                <CardHeader className="border-b bg-gradient-to-r from-[#00BCD4]/10 to-transparent">
                  <CardTitle className="text-lg text-[#006064] flex items-center gap-2">
                    <CreditCard className="w-5 h-5" />
                    Riwayat Tagihan SPP
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-4">
                  {siswa.tagihanSpp && siswa.tagihanSpp.length > 0 ? (
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-gray-50">
                          <TableHead>Periode</TableHead>
                          <TableHead>Tagihan</TableHead>
                          <TableHead>Dibayar</TableHead>
                          <TableHead>Sisa</TableHead>
                          <TableHead>Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {(siswa.tagihanSpp as KbtkTagihanSppWithRelations[]).map(
                          (tagihan) => (
                            <TableRow key={tagihan.id}>
                              <TableCell className="font-medium">
                                {getNamaBulan(tagihan.bulan)} {tagihan.tahun}
                              </TableCell>
                              <TableCell>
                                {formatCurrency(Number(tagihan.totalTagihan))}
                              </TableCell>
                              <TableCell className="text-green-600">
                                {formatCurrency(tagihan._totalBayar || 0)}
                              </TableCell>
                              <TableCell
                                className={
                                  (tagihan._sisaTagihan || 0) > 0
                                    ? 'text-red-600 font-medium'
                                    : ''
                                }
                              >
                                {formatCurrency(tagihan._sisaTagihan || 0)}
                              </TableCell>
                              <TableCell>
                                <Badge className={getStatusTagihanColor(tagihan.status)}>
                                  {STATUS_TAGIHAN_OPTIONS.find(
                                    (s) => s.value === tagihan.status
                                  )?.label || tagihan.status}
                                </Badge>
                              </TableCell>
                            </TableRow>
                          )
                        )}
                      </TableBody>
                    </Table>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <CreditCard className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                      <p>Belum ada data tagihan SPP</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Edit Siswa Dialog */}
      <SiswaFormDialog
        open={isEditFormOpen}
        onOpenChange={setIsEditFormOpen}
        siswa={siswa}
        onSuccess={handleEditSuccess}
      />

      {/* Orang Tua Form Dialog */}
      <Dialog open={isOrangTuaDialogOpen} onOpenChange={setIsOrangTuaDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-[#006064]">
              {editingOrangTua?.id ? 'Edit Orang Tua' : 'Tambah Orang Tua'}
            </DialogTitle>
          </DialogHeader>
          {editingOrangTua && (
            <OrangTuaForm
              data={editingOrangTua}
              index={0}
              onChange={setEditingOrangTua}
              onRemove={() => {}}
              canRemove={false}
            />
          )}
          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => setIsOrangTuaDialogOpen(false)}
              disabled={isOrangTuaSaving}
            >
              Batal
            </Button>
            <Button
              onClick={handleSaveOrangTua}
              disabled={isOrangTuaSaving}
              className="bg-[#00BCD4] hover:bg-[#006064] text-white"
            >
              {isOrangTuaSaving && (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              )}
              Simpan
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Orang Tua Confirmation */}
      <AlertDialog
        open={!!deleteOrangTuaId}
        onOpenChange={() => setDeleteOrangTuaId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Orang Tua?</AlertDialogTitle>
            <AlertDialogDescription>
              Data orang tua akan dihapus secara permanen. Tindakan ini tidak dapat
              dibatalkan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteOrangTua}
              className="bg-red-500 hover:bg-red-600"
            >
              Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
