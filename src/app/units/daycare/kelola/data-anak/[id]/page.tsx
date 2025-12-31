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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { AnakFormDialog } from '@/components/daycare/AnakFormDialog';
import { OrangTuaForm } from '@/components/daycare/OrangTuaForm';
import {
  AnakWithRelations,
  OrangTuaFormData,
  DaycareDailyReport,
  RELASI_OPTIONS,
  STATUS_ANAK_OPTIONS,
  STATUS_TAGIHAN_OPTIONS,
  hitungUmur,
  formatTanggal,
  formatTanggalSingkat,
  formatRupiah,
  getStatusColor,
  getPaketLabel,
  getPaketColor,
  getNamaBulan,
  parseKegiatanHariIni,
  getLikertLabel,
  getLikertColor,
  KEGIATAN_OPTIONS,
} from '@/types/daycare';
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
  Heart,
  Moon,
  FileText,
  Activity,
  AlertTriangle,
  PhoneCall,
} from 'lucide-react';
import { toast } from 'sonner';

interface PageProps {
  params: Promise<{ id: string }>;
}

function getWhatsAppLink(phone: string): string {
  const cleaned = phone.replace(/\D/g, '');
  const formatted = cleaned.startsWith('0') ? '62' + cleaned.slice(1) : cleaned;
  return `https://wa.me/${formatted}`;
}

export default function AnakDetailPage({ params }: PageProps) {
  const { id } = use(params);
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(true);
  const [anak, setAnak] = useState<AnakWithRelations | null>(null);

  // Dialogs
  const [isEditFormOpen, setIsEditFormOpen] = useState(false);
  const [isOrangTuaDialogOpen, setIsOrangTuaDialogOpen] = useState(false);
  const [editingOrangTua, setEditingOrangTua] = useState<OrangTuaFormData | null>(null);
  const [isOrangTuaSaving, setIsOrangTuaSaving] = useState(false);
  const [deleteOrangTuaId, setDeleteOrangTuaId] = useState<string | null>(null);

  const fetchAnak = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/daycare/anak/${id}`);
      if (!response.ok) {
        if (response.status === 404) {
          toast.error('Anak tidak ditemukan');
          router.push('/units/daycare/kelola/data-anak');
          return;
        }
        throw new Error('Failed to fetch anak');
      }
      const data = await response.json();
      setAnak(data);
    } catch (error) {
      console.error('Error fetching anak:', error);
      toast.error('Gagal mengambil data anak');
    } finally {
      setIsLoading(false);
    }
  }, [id, router]);

  useEffect(() => {
    fetchAnak();
  }, [fetchAnak]);

  const handleEditSuccess = () => {
    fetchAnak();
    setIsEditFormOpen(false);
  };

  // Orang Tua CRUD handlers
  const handleAddOrangTua = () => {
    setEditingOrangTua({
      anakId: id,
      nama: '',
      relasi: 'wali',
      nomorHP: '',
      nomorHPDarurat: '',
      email: '',
      pekerjaan: '',
      alamat: '',
      isPrimary: !anak?.orangTua || anak.orangTua.length === 0,
    });
    setIsOrangTuaDialogOpen(true);
  };

  const handleEditOrangTua = (ot: OrangTuaFormData & { id: string }) => {
    setEditingOrangTua({
      id: ot.id,
      anakId: id,
      nama: ot.nama,
      relasi: ot.relasi,
      nomorHP: ot.nomorHP || '',
      nomorHPDarurat: ot.nomorHPDarurat || '',
      email: ot.email || '',
      pekerjaan: ot.pekerjaan || '',
      alamat: ot.alamat || '',
      isPrimary: ot.isPrimary,
    });
    setIsOrangTuaDialogOpen(true);
  };

  const handleSaveOrangTua = async () => {
    if (!editingOrangTua || !anak) return;

    if (!editingOrangTua.nama.trim()) {
      toast.error('Nama orang tua wajib diisi');
      return;
    }

    setIsOrangTuaSaving(true);
    try {
      const isEdit = !!editingOrangTua.id;
      const url = isEdit
        ? `/api/daycare/orang-tua/${editingOrangTua.id}`
        : '/api/daycare/orang-tua';

      const response = await fetch(url, {
        method: isEdit ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...editingOrangTua,
          anakId: anak.id,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Gagal menyimpan data orang tua');
      }

      toast.success(isEdit ? 'Orang tua berhasil diperbarui' : 'Orang tua berhasil ditambahkan');
      setIsOrangTuaDialogOpen(false);
      setEditingOrangTua(null);
      fetchAnak();
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
      const response = await fetch(`/api/daycare/orang-tua/${deleteOrangTuaId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Gagal menghapus orang tua');
      }

      toast.success('Orang tua berhasil dihapus');
      setDeleteOrangTuaId(null);
      fetchAnak();
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

  if (!anak) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-[#00BCD4]/5 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <p className="text-gray-600 text-lg">Data anak tidak ditemukan</p>
          <Button
            onClick={() => router.push('/units/daycare/kelola/data-anak')}
            className="mt-4"
          >
            Kembali ke Daftar Anak
          </Button>
        </div>
      </div>
    );
  }

  const statusOption = STATUS_ANAK_OPTIONS.find((s) => s.value === anak.status);
  const umur = hitungUmur(anak.tanggalLahir);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-[#00BCD4]/5">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              onClick={() => router.push('/units/daycare/kelola/data-anak')}
              className="rounded-xl"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Kembali
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-[#006064]">Detail Anak</h1>
              <p className="text-gray-500">{anak.nomorInduk}</p>
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
                <h2 className="text-2xl font-bold">{anak.namaLengkap}</h2>
                {anak.namaPanggilan && (
                  <p className="text-white/80">({anak.namaPanggilan})</p>
                )}
                <div className="flex flex-wrap items-center gap-3 mt-3">
                  <Badge
                    variant="outline"
                    className="border-white/50 text-white bg-white/10"
                  >
                    {getPaketLabel(anak.paketLayanan)}
                  </Badge>
                  <Badge className={`${getStatusColor(anak.status)}`}>
                    {statusOption?.label || anak.status}
                  </Badge>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-4 text-white text-center">
                <div className="bg-white/10 rounded-xl px-4 py-2">
                  <p className="text-2xl font-bold">
                    {umur.tahun > 0 ? `${umur.tahun}th` : `${umur.bulan}bln`}
                  </p>
                  <p className="text-xs text-white/70">Umur</p>
                </div>
                <div className="bg-white/10 rounded-xl px-4 py-2">
                  <p className="text-2xl font-bold">{anak.orangTua?.length || 0}</p>
                  <p className="text-xs text-white/70">Orang Tua</p>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Tabs */}
        <Tabs defaultValue="info-anak" className="space-y-4">
          <TabsList className="bg-white shadow rounded-xl p-1 flex-wrap h-auto">
            <TabsTrigger
              value="info-anak"
              className="rounded-lg data-[state=active]:bg-[#00BCD4] data-[state=active]:text-white"
            >
              <User className="w-4 h-4 mr-2" />
              Info Anak
            </TabsTrigger>
            <TabsTrigger
              value="orang-tua"
              className="rounded-lg data-[state=active]:bg-[#00BCD4] data-[state=active]:text-white"
            >
              <Users className="w-4 h-4 mr-2" />
              Orang Tua
            </TabsTrigger>
            <TabsTrigger
              value="daily-reports"
              className="rounded-lg data-[state=active]:bg-[#00BCD4] data-[state=active]:text-white"
            >
              <FileText className="w-4 h-4 mr-2" />
              Daily Reports
            </TabsTrigger>
            <TabsTrigger
              value="pembayaran"
              className="rounded-lg data-[state=active]:bg-[#00BCD4] data-[state=active]:text-white"
            >
              <CreditCard className="w-4 h-4 mr-2" />
              Riwayat Pembayaran
            </TabsTrigger>
          </TabsList>

          {/* Info Anak Tab */}
          <TabsContent value="info-anak">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Personal Info */}
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
                      <p className="font-medium">{anak.namaLengkap}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Nama Panggilan</p>
                      <p className="font-medium">{anak.namaPanggilan || '-'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Jenis Kelamin</p>
                      <p className="font-medium">
                        {anak.jenisKelamin === 'lelaki' ? 'Laki-laki' : 'Perempuan'}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Tempat Lahir</p>
                      <p className="font-medium">{anak.tempatLahir || '-'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Tanggal Lahir</p>
                      <p className="font-medium">{formatTanggal(anak.tanggalLahir)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Umur</p>
                      <p className="font-medium">{umur.text}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Alamat</p>
                    <p className="font-medium">{anak.alamat || '-'}</p>
                  </div>
                </CardContent>
              </Card>

              {/* Daycare Info */}
              <Card className="border-0 shadow-lg rounded-2xl">
                <CardHeader className="border-b bg-gradient-to-r from-[#00BCD4]/10 to-transparent">
                  <CardTitle className="text-lg text-[#006064]">
                    Informasi Daycare
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-4 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Nomor Induk</p>
                      <p className="font-mono font-medium">{anak.nomorInduk}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Paket Layanan</p>
                      <Badge
                        variant="outline"
                        className={getPaketColor(anak.paketLayanan)}
                      >
                        {getPaketLabel(anak.paketLayanan)}
                      </Badge>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Tanggal Mulai</p>
                      <p className="font-medium">{formatTanggal(anak.tanggalMulai)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Status</p>
                      <Badge className={getStatusColor(anak.status)}>
                        {statusOption?.label || anak.status}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Health Info */}
              <Card className="border-0 shadow-lg rounded-2xl lg:col-span-2">
                <CardHeader className="border-b bg-gradient-to-r from-pink-50 to-transparent">
                  <CardTitle className="text-lg text-pink-700 flex items-center gap-2">
                    <Heart className="w-5 h-5" />
                    Informasi Kesehatan
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <AlertTriangle className="w-4 h-4 text-orange-500" />
                        <p className="text-sm font-medium text-gray-700">Alergi Makanan</p>
                      </div>
                      <div className="bg-orange-50 border border-orange-200 rounded-xl p-3">
                        <p className={`text-sm ${anak.alergiMakanan ? 'text-orange-800 font-medium' : 'text-gray-500'}`}>
                          {anak.alergiMakanan || 'Tidak ada alergi'}
                        </p>
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <Activity className="w-4 h-4 text-blue-500" />
                        <p className="text-sm font-medium text-gray-700">Catatan Kesehatan</p>
                      </div>
                      <div className="bg-blue-50 border border-blue-200 rounded-xl p-3">
                        <p className="text-sm text-gray-700">
                          {anak.catatanKesehatan || '-'}
                        </p>
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <Moon className="w-4 h-4 text-purple-500" />
                        <p className="text-sm font-medium text-gray-700">Kebiasaan Tidur</p>
                      </div>
                      <div className="bg-purple-50 border border-purple-200 rounded-xl p-3">
                        <p className="text-sm text-gray-700">
                          {anak.kebiasaanTidur || '-'}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Special Notes */}
              {anak.catatanKhusus && (
                <Card className="border-0 shadow-lg rounded-2xl lg:col-span-2">
                  <CardHeader className="border-b bg-gradient-to-r from-yellow-50 to-transparent">
                    <CardTitle className="text-lg text-yellow-700 flex items-center gap-2">
                      <AlertCircle className="w-5 h-5" />
                      Catatan Khusus
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <p className="text-gray-700 whitespace-pre-wrap">
                      {anak.catatanKhusus}
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
                {anak.orangTua && anak.orangTua.length > 0 ? (
                  <div className="grid gap-4">
                    {anak.orangTua.map((ot) => (
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
                                {ot.nomorHPDarurat && (
                                  <div className="flex items-center gap-2">
                                    <PhoneCall className="w-4 h-4 text-red-400" />
                                    <span className="text-red-600">{ot.nomorHPDarurat}</span>
                                    <Badge variant="outline" className="text-xs border-red-300 text-red-600">
                                      Darurat
                                    </Badge>
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
                                  <div className="flex items-center gap-2 sm:col-span-2">
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
                                    anakId: id,
                                    nama: ot.nama,
                                    relasi: ot.relasi as 'ayah' | 'ibu' | 'wali',
                                    nomorHP: ot.nomorHP || '',
                                    nomorHPDarurat: ot.nomorHPDarurat || '',
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

          {/* Daily Reports Tab */}
          <TabsContent value="daily-reports">
            <Card className="border-0 shadow-lg rounded-2xl">
              <CardHeader className="border-b bg-gradient-to-r from-[#00BCD4]/10 to-transparent">
                <CardTitle className="text-lg text-[#006064] flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Daily Reports Terbaru
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                {anak.dailyReports && anak.dailyReports.length > 0 ? (
                  <div className="space-y-4">
                    {anak.dailyReports.map((report: DaycareDailyReport) => {
                      const kegiatan = parseKegiatanHariIni(report.kegiatanHariIni);
                      return (
                        <Card key={report.id} className="border border-gray-200">
                          <CardHeader className="pb-2">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <Calendar className="w-4 h-4 text-[#00BCD4]" />
                                <span className="font-semibold text-[#006064]">
                                  {formatTanggal(report.tanggal)}
                                </span>
                              </div>
                              {report.guruPengisi && (
                                <span className="text-sm text-gray-500">
                                  Pengisi: {report.guruPengisi}
                                </span>
                              )}
                            </div>
                          </CardHeader>
                          <CardContent className="pt-2">
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                              {/* Perilaku */}
                              <div className="space-y-2">
                                <p className="text-xs font-medium text-gray-500 uppercase">Perilaku</p>
                                <div className="space-y-1">
                                  <div className="flex items-center justify-between">
                                    <span className="text-xs text-gray-600">Mood/Sikap</span>
                                    <Badge className={getLikertColor(report.moodSikap)}>
                                      {getLikertLabel('perilaku', report.moodSikap)}
                                    </Badge>
                                  </div>
                                  <div className="flex items-center justify-between">
                                    <span className="text-xs text-gray-600">Interaksi</span>
                                    <Badge className={getLikertColor(report.interaksiTeman)}>
                                      {getLikertLabel('perilaku', report.interaksiTeman)}
                                    </Badge>
                                  </div>
                                </div>
                              </div>

                              {/* Aktivitas */}
                              <div className="space-y-2">
                                <p className="text-xs font-medium text-gray-500 uppercase">Aktivitas</p>
                                <div className="space-y-1">
                                  <div className="flex items-center justify-between">
                                    <span className="text-xs text-gray-600">Belajar</span>
                                    <Badge className={getLikertColor(report.partisipasiBelajar)}>
                                      {getLikertLabel('aktivitas', report.partisipasiBelajar)}
                                    </Badge>
                                  </div>
                                  <div className="flex items-center justify-between">
                                    <span className="text-xs text-gray-600">Bermain</span>
                                    <Badge className={getLikertColor(report.responBermain)}>
                                      {getLikertLabel('aktivitas', report.responBermain)}
                                    </Badge>
                                  </div>
                                </div>
                              </div>

                              {/* Makan */}
                              <div className="space-y-2">
                                <p className="text-xs font-medium text-gray-500 uppercase">Makan</p>
                                <div className="space-y-1">
                                  <div className="flex items-center justify-between">
                                    <span className="text-xs text-gray-600">Makan Siang</span>
                                    <Badge className={getLikertColor(report.makanSiang)}>
                                      {getLikertLabel('makan', report.makanSiang)}
                                    </Badge>
                                  </div>
                                  <div className="flex items-center justify-between">
                                    <span className="text-xs text-gray-600">Snack</span>
                                    <Badge className={getLikertColor(report.snack)}>
                                      {getLikertLabel('makan', report.snack)}
                                    </Badge>
                                  </div>
                                </div>
                              </div>

                              {/* Tidur */}
                              <div className="space-y-2">
                                <p className="text-xs font-medium text-gray-500 uppercase">Tidur</p>
                                <div className="space-y-1">
                                  <div className="flex items-center justify-between">
                                    <span className="text-xs text-gray-600">Tidur Siang</span>
                                    <Badge className={getLikertColor(report.tidurSiang)}>
                                      {getLikertLabel('tidur', report.tidurSiang)}
                                    </Badge>
                                  </div>
                                  {report.durasiTidur && (
                                    <div className="flex items-center justify-between">
                                      <span className="text-xs text-gray-600">Durasi</span>
                                      <span className="text-xs font-medium">{report.durasiTidur}</span>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>

                            {/* Kegiatan */}
                            {kegiatan.length > 0 && (
                              <div className="mt-4 pt-3 border-t">
                                <p className="text-xs font-medium text-gray-500 uppercase mb-2">Kegiatan Hari Ini</p>
                                <div className="flex flex-wrap gap-2">
                                  {kegiatan.map((k) => (
                                    <Badge key={k} variant="outline" className="bg-[#00BCD4]/10 text-[#006064]">
                                      {KEGIATAN_OPTIONS.find((opt) => opt.value === k)?.label || k}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            )}

                            {/* Catatan Guru */}
                            {report.catatanGuru && (
                              <div className="mt-4 pt-3 border-t">
                                <p className="text-xs font-medium text-gray-500 uppercase mb-2">Catatan Guru</p>
                                <p className="text-sm text-gray-700 whitespace-pre-wrap">{report.catatanGuru}</p>
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-12 text-gray-500">
                    <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p>Belum ada daily report</p>
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
                  {anak.pendaftaran ? (
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="bg-gray-50 rounded-xl p-4">
                          <p className="text-sm text-gray-500">Total Biaya</p>
                          <p className="text-lg font-bold text-[#006064]">
                            {formatRupiah(Number(anak.pendaftaran.biayaPendaftaran))}
                          </p>
                        </div>
                        <div className="bg-green-50 rounded-xl p-4">
                          <p className="text-sm text-gray-500">Sudah Dibayar</p>
                          <p className="text-lg font-bold text-green-600">
                            {formatRupiah((anak.pendaftaran as {_totalBayar?: number})._totalBayar || 0)}
                          </p>
                        </div>
                        <div className="bg-red-50 rounded-xl p-4">
                          <p className="text-sm text-gray-500">Sisa Tagihan</p>
                          <p className="text-lg font-bold text-red-600">
                            {formatRupiah((anak.pendaftaran as {_sisaTagihan?: number})._sisaTagihan || 0)}
                          </p>
                        </div>
                        <div className="bg-blue-50 rounded-xl p-4">
                          <p className="text-sm text-gray-500">Status</p>
                          <Badge
                            className={`mt-1 ${
                              ((anak.pendaftaran as {_sisaTagihan?: number})._sisaTagihan || 0) <= 0
                                ? 'bg-green-100 text-green-800'
                                : 'bg-yellow-100 text-yellow-800'
                            }`}
                          >
                            {((anak.pendaftaran as {_sisaTagihan?: number})._sisaTagihan || 0) <= 0 ? (
                              <><CheckCircle className="w-3 h-3 mr-1" /> Lunas</>
                            ) : (
                              'Belum Lunas'
                            )}
                          </Badge>
                        </div>
                      </div>

                      {anak.pendaftaran.pembayaran &&
                        anak.pendaftaran.pembayaran.length > 0 && (
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
                                {anak.pendaftaran.pembayaran.map((p) => (
                                  <TableRow key={p.id}>
                                    <TableCell>
                                      {formatTanggalSingkat(p.tanggalBayar)}
                                    </TableCell>
                                    <TableCell className="font-medium">
                                      {formatRupiah(Number(p.nominal))}
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

              {/* Tagihan Bulanan Section */}
              <Card className="border-0 shadow-lg rounded-2xl">
                <CardHeader className="border-b bg-gradient-to-r from-[#00BCD4]/10 to-transparent">
                  <CardTitle className="text-lg text-[#006064] flex items-center gap-2">
                    <CreditCard className="w-5 h-5" />
                    Riwayat Tagihan Bulanan
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-4">
                  {anak.tagihanBulanan && anak.tagihanBulanan.length > 0 ? (
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
                        {anak.tagihanBulanan.map((tagihan) => (
                          <TableRow key={tagihan.id}>
                            <TableCell className="font-medium">
                              {getNamaBulan(tagihan.bulan)} {tagihan.tahun}
                            </TableCell>
                            <TableCell>
                              {formatRupiah(Number(tagihan.totalTagihan))}
                            </TableCell>
                            <TableCell className="text-green-600">
                              {formatRupiah((tagihan as {_totalBayar?: number})._totalBayar || 0)}
                            </TableCell>
                            <TableCell
                              className={
                                ((tagihan as {_sisaTagihan?: number})._sisaTagihan || 0) > 0
                                  ? 'text-red-600 font-medium'
                                  : ''
                              }
                            >
                              {formatRupiah((tagihan as {_sisaTagihan?: number})._sisaTagihan || 0)}
                            </TableCell>
                            <TableCell>
                              <Badge className={getStatusColor(tagihan.status)}>
                                {STATUS_TAGIHAN_OPTIONS.find(
                                  (s) => s.value === tagihan.status
                                )?.label || tagihan.status}
                              </Badge>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <CreditCard className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                      <p>Belum ada data tagihan bulanan</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Edit Anak Dialog */}
      <AnakFormDialog
        open={isEditFormOpen}
        onOpenChange={setIsEditFormOpen}
        anak={anak}
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
