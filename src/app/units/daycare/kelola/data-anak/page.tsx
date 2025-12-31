'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
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
import { AnakFormDialog } from '@/components/daycare/AnakFormDialog';
import {
  AnakListItem,
  PAKET_LAYANAN_OPTIONS,
  STATUS_ANAK_OPTIONS,
  hitungUmur,
  getStatusColor,
  getPaketLabel,
  getPaketColor,
} from '@/types/daycare';
import {
  Users,
  Baby,
  Sun,
  Clock,
  UserCheck,
  Plus,
  Search,
  Eye,
  Edit,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Loader2,
  LayoutGrid,
  List,
  Phone,
} from 'lucide-react';
import { toast } from 'sonner';

interface AnakListResponse {
  data: AnakListItem[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  stats: {
    total: number;
    fullday: number;
    afterSchool: number;
    harian: number;
    aktif: number;
  };
}

export default function DataAnakPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [anakList, setAnakList] = useState<AnakListItem[]>([]);
  const [stats, setStats] = useState({ total: 0, fullday: 0, afterSchool: 0, harian: 0, aktif: 0 });
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 10,
    total: 0,
    totalPages: 0,
  });

  // View mode
  const [viewMode, setViewMode] = useState<'table' | 'card'>('table');

  // Filters
  const [search, setSearch] = useState('');
  const [paketLayanan, setPaketLayanan] = useState('all');
  const [status, setStatus] = useState('all');

  // Dialog states
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingAnak, setEditingAnak] = useState<AnakListItem | null>(null);
  const [deleteAnakId, setDeleteAnakId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchAnak = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams({
        page: pagination.page.toString(),
        pageSize: pagination.pageSize.toString(),
        search,
        paketLayanan,
        status,
      });

      const response = await fetch(`/api/daycare/anak?${params}`);
      if (!response.ok) throw new Error('Failed to fetch anak');

      const data: AnakListResponse = await response.json();
      setAnakList(data.data);
      setStats(data.stats);
      setPagination((prev) => ({
        ...prev,
        total: data.total,
        totalPages: data.totalPages,
      }));
    } catch (error) {
      console.error('Error fetching anak:', error);
      toast.error('Gagal mengambil data anak');
    } finally {
      setIsLoading(false);
    }
  }, [pagination.page, pagination.pageSize, search, paketLayanan, status]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchAnak();
    }, 300);
    return () => clearTimeout(timer);
  }, [fetchAnak]);

  const handleOpenEdit = (anak: AnakListItem) => {
    setEditingAnak(anak);
    setIsFormOpen(true);
  };

  const handleOpenCreate = () => {
    setEditingAnak(null);
    setIsFormOpen(true);
  };

  const handleFormSuccess = () => {
    fetchAnak();
    setEditingAnak(null);
  };

  const handleViewDetail = (id: string) => {
    router.push(`/units/daycare/kelola/data-anak/${id}`);
  };

  const handleDelete = async () => {
    if (!deleteAnakId) return;

    setIsDeleting(true);
    try {
      const response = await fetch(`/api/daycare/anak/${deleteAnakId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Gagal menghapus data anak');
      }

      toast.success('Data anak berhasil dihapus');
      setDeleteAnakId(null);
      fetchAnak();
    } catch (error) {
      console.error('Error deleting anak:', error);
      toast.error(error instanceof Error ? error.message : 'Gagal menghapus data anak');
    } finally {
      setIsDeleting(false);
    }
  };

  const statsCards = [
    {
      title: 'Total Anak',
      value: stats.total,
      icon: Users,
      color: 'from-[#00BCD4] to-[#006064]',
    },
    {
      title: 'Fullday',
      value: stats.fullday,
      icon: Sun,
      color: 'from-cyan-400 to-cyan-600',
    },
    {
      title: 'After School',
      value: stats.afterSchool,
      icon: Clock,
      color: 'from-purple-400 to-purple-600',
    },
    {
      title: 'Anak Aktif',
      value: stats.aktif,
      icon: UserCheck,
      color: 'from-green-400 to-green-600',
    },
  ];

  const getPrimaryContact = (anak: AnakListItem) => {
    const primary = anak.orangTua?.find((ot) => ot.isPrimary);
    return primary || anak.orangTua?.[0];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-[#00BCD4]/5">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#006064] mb-2">Data Anak</h1>
          <p className="text-gray-600">
            Kelola data anak Daycare Al Muhajirin Rewwin
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {statsCards.map((stat) => (
            <Card
              key={stat.title}
              className="border-0 shadow-lg rounded-2xl overflow-hidden"
            >
              <div className={`bg-gradient-to-r ${stat.color} p-4`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white/80 text-sm font-medium">
                      {stat.title}
                    </p>
                    <p className="text-white text-3xl font-bold mt-1">
                      {stat.value}
                    </p>
                  </div>
                  <div className="bg-white/20 rounded-full p-3">
                    <stat.icon className="w-6 h-6 text-white" />
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Filters & Actions */}
        <Card className="mb-6 border-0 shadow-lg rounded-2xl">
          <CardHeader className="border-b bg-gradient-to-r from-[#00BCD4]/10 to-transparent">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <CardTitle className="text-lg text-[#006064]">
                Daftar Anak
              </CardTitle>
              <div className="flex items-center gap-2">
                {/* View Toggle */}
                <div className="flex items-center border rounded-xl overflow-hidden">
                  <Button
                    variant={viewMode === 'table' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('table')}
                    className={`rounded-none ${
                      viewMode === 'table'
                        ? 'bg-[#00BCD4] text-white hover:bg-[#006064]'
                        : 'text-gray-600'
                    }`}
                  >
                    <List className="w-4 h-4" />
                  </Button>
                  <Button
                    variant={viewMode === 'card' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('card')}
                    className={`rounded-none ${
                      viewMode === 'card'
                        ? 'bg-[#00BCD4] text-white hover:bg-[#006064]'
                        : 'text-gray-600'
                    }`}
                  >
                    <LayoutGrid className="w-4 h-4" />
                  </Button>
                </div>
                <Button
                  onClick={handleOpenCreate}
                  className="bg-[#00BCD4] hover:bg-[#006064] text-white rounded-xl"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Tambah Anak
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-4">
            {/* Filter Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <div className="lg:col-span-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Cari nama atau nomor induk..."
                    value={search}
                    onChange={(e) => {
                      setSearch(e.target.value);
                      setPagination((prev) => ({ ...prev, page: 1 }));
                    }}
                    className="pl-10 rounded-xl"
                  />
                </div>
              </div>

              <Select
                value={paketLayanan}
                onValueChange={(value) => {
                  setPaketLayanan(value);
                  setPagination((prev) => ({ ...prev, page: 1 }));
                }}
              >
                <SelectTrigger className="rounded-xl">
                  <SelectValue placeholder="Paket Layanan" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Paket</SelectItem>
                  {PAKET_LAYANAN_OPTIONS.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select
                value={status}
                onValueChange={(value) => {
                  setStatus(value);
                  setPagination((prev) => ({ ...prev, page: 1 }));
                }}
              >
                <SelectTrigger className="rounded-xl">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Status</SelectItem>
                  {STATUS_ANAK_OPTIONS.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Content */}
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 text-[#00BCD4] animate-spin" />
              </div>
            ) : anakList.length === 0 ? (
              <div className="text-center py-12">
                <Baby className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 text-lg">Tidak ada data anak</p>
                <p className="text-gray-400 text-sm">
                  Coba ubah filter atau tambah anak baru
                </p>
              </div>
            ) : viewMode === 'table' ? (
              /* Table View */
              <>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-gray-50">
                        <TableHead className="font-semibold">No. Induk</TableHead>
                        <TableHead className="font-semibold">Nama</TableHead>
                        <TableHead className="font-semibold">Paket</TableHead>
                        <TableHead className="font-semibold">Umur</TableHead>
                        <TableHead className="font-semibold">Orang Tua</TableHead>
                        <TableHead className="font-semibold">Status</TableHead>
                        <TableHead className="font-semibold text-center">Aksi</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {anakList.map((anak) => {
                        const primaryContact = getPrimaryContact(anak);
                        const umur = hitungUmur(anak.tanggalLahir);
                        return (
                          <TableRow
                            key={anak.id}
                            className="hover:bg-[#00BCD4]/5 cursor-pointer"
                            onClick={() => handleViewDetail(anak.id)}
                          >
                            <TableCell className="font-mono text-sm">
                              {anak.nomorInduk}
                            </TableCell>
                            <TableCell>
                              <div>
                                <p className="font-medium text-[#006064]">
                                  {anak.namaLengkap}
                                </p>
                                {anak.namaPanggilan && (
                                  <p className="text-sm text-gray-500">
                                    ({anak.namaPanggilan})
                                  </p>
                                )}
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge
                                variant="outline"
                                className={getPaketColor(anak.paketLayanan)}
                              >
                                {getPaketLabel(anak.paketLayanan)}
                              </Badge>
                            </TableCell>
                            <TableCell>{umur.text}</TableCell>
                            <TableCell>
                              {primaryContact ? (
                                <div>
                                  <p className="font-medium text-sm">{primaryContact.nama}</p>
                                  {primaryContact.nomorHP && (
                                    <p className="text-xs text-gray-500 flex items-center gap-1">
                                      <Phone className="w-3 h-3" />
                                      {primaryContact.nomorHP}
                                    </p>
                                  )}
                                </div>
                              ) : (
                                <span className="text-gray-400 text-sm">-</span>
                              )}
                            </TableCell>
                            <TableCell>
                              <Badge className={getStatusColor(anak.status)}>
                                {STATUS_ANAK_OPTIONS.find((s) => s.value === anak.status)
                                  ?.label || anak.status}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <div
                                className="flex items-center justify-center gap-2"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleViewDetail(anak.id)}
                                  className="border-[#00BCD4] text-[#006064] hover:bg-[#00BCD4]/10"
                                >
                                  <Eye className="w-4 h-4" />
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleOpenEdit(anak)}
                                  className="border-[#00BCD4] text-[#006064] hover:bg-[#00BCD4]/10"
                                >
                                  <Edit className="w-4 h-4" />
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => setDeleteAnakId(anak.id)}
                                  className="border-red-300 text-red-600 hover:bg-red-50"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>

                {/* Pagination */}
                <div className="flex items-center justify-between mt-4 pt-4 border-t">
                  <p className="text-sm text-gray-600">
                    Menampilkan {(pagination.page - 1) * pagination.pageSize + 1}-
                    {Math.min(pagination.page * pagination.pageSize, pagination.total)} dari{' '}
                    {pagination.total} anak
                  </p>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        setPagination((prev) => ({ ...prev, page: prev.page - 1 }))
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
                        setPagination((prev) => ({ ...prev, page: prev.page + 1 }))
                      }
                      disabled={pagination.page >= pagination.totalPages}
                      className="rounded-xl"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </>
            ) : (
              /* Card View */
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {anakList.map((anak) => {
                    const primaryContact = getPrimaryContact(anak);
                    const umur = hitungUmur(anak.tanggalLahir);
                    return (
                      <Card
                        key={anak.id}
                        className="border border-gray-200 hover:border-[#00BCD4] hover:shadow-lg transition-all cursor-pointer"
                        onClick={() => handleViewDetail(anak.id)}
                      >
                        <CardContent className="pt-4">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center gap-3">
                              <div className="w-12 h-12 bg-gradient-to-br from-[#00BCD4] to-[#006064] rounded-full flex items-center justify-center">
                                <Baby className="w-6 h-6 text-white" />
                              </div>
                              <div>
                                <p className="font-semibold text-[#006064]">
                                  {anak.namaLengkap}
                                </p>
                                <p className="text-xs text-gray-500 font-mono">
                                  {anak.nomorInduk}
                                </p>
                              </div>
                            </div>
                            <Badge className={getStatusColor(anak.status)}>
                              {STATUS_ANAK_OPTIONS.find((s) => s.value === anak.status)
                                ?.label || anak.status}
                            </Badge>
                          </div>

                          <div className="space-y-2 text-sm">
                            <div className="flex items-center justify-between">
                              <span className="text-gray-500">Paket</span>
                              <Badge
                                variant="outline"
                                className={getPaketColor(anak.paketLayanan)}
                              >
                                {getPaketLabel(anak.paketLayanan)}
                              </Badge>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-gray-500">Umur</span>
                              <span className="font-medium">{umur.text}</span>
                            </div>
                            {primaryContact && (
                              <div className="flex items-center justify-between">
                                <span className="text-gray-500">Orang Tua</span>
                                <span className="font-medium text-right">
                                  {primaryContact.nama}
                                </span>
                              </div>
                            )}
                          </div>

                          <div
                            className="flex items-center gap-2 mt-4 pt-3 border-t"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleViewDetail(anak.id)}
                              className="flex-1 border-[#00BCD4] text-[#006064] hover:bg-[#00BCD4]/10"
                            >
                              <Eye className="w-4 h-4 mr-1" />
                              Detail
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleOpenEdit(anak)}
                              className="border-[#00BCD4] text-[#006064] hover:bg-[#00BCD4]/10"
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setDeleteAnakId(anak.id)}
                              className="border-red-300 text-red-600 hover:bg-red-50"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>

                {/* Pagination for Card View */}
                <div className="flex items-center justify-between mt-6 pt-4 border-t">
                  <p className="text-sm text-gray-600">
                    Menampilkan {(pagination.page - 1) * pagination.pageSize + 1}-
                    {Math.min(pagination.page * pagination.pageSize, pagination.total)} dari{' '}
                    {pagination.total} anak
                  </p>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        setPagination((prev) => ({ ...prev, page: prev.page - 1 }))
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
                        setPagination((prev) => ({ ...prev, page: prev.page + 1 }))
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
      <AnakFormDialog
        open={isFormOpen}
        onOpenChange={(open) => {
          setIsFormOpen(open);
          if (!open) setEditingAnak(null);
        }}
        anak={editingAnak}
        onSuccess={handleFormSuccess}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={!!deleteAnakId}
        onOpenChange={() => setDeleteAnakId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Data Anak?</AlertDialogTitle>
            <AlertDialogDescription>
              Data anak beserta semua data terkait (orang tua, kehadiran, daily report)
              akan dihapus secara permanen. Tindakan ini tidak dapat dibatalkan.
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
