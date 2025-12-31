'use client';

import { useState, useEffect, useCallback } from 'react';
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
import { KehadiranForm } from '@/components/daycare';
import {
  DaycareAnak,
  formatTanggal,
  getPaketLabel,
  getPaketColor,
} from '@/types/daycare';
import {
  Plus,
  Search,
  Calendar,
  Check,
  X,
  Clock,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Edit,
  Trash2,
  Users,
  UserCheck,
  UserX,
  CalendarDays,
} from 'lucide-react';
import { toast } from 'sonner';

interface KehadiranWithAnak {
  id: string;
  anakId: string;
  tanggal: Date | string;
  jamMasuk?: Date | string | null;
  jamPulang?: Date | string | null;
  isHadir: boolean;
  catatan?: string | null;
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

interface KehadiranStats {
  total: number;
  hadir: number;
  tidakHadir: number;
}

export default function KehadiranHarianPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [kehadiranList, setKehadiranList] = useState<KehadiranWithAnak[]>([]);
  const [anakList, setAnakList] = useState<AnakSimple[]>([]);
  const [stats, setStats] = useState<KehadiranStats>({
    total: 0,
    hadir: 0,
    tidakHadir: 0,
  });
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 20,
    total: 0,
    totalPages: 0,
  });

  // Filters
  const [search, setSearch] = useState('');
  const [tanggal, setTanggal] = useState(new Date().toISOString().split('T')[0]);
  const [selectedAnakId, setSelectedAnakId] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  // Dialog states
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingKehadiran, setEditingKehadiran] = useState<KehadiranWithAnak | null>(null);
  const [deleteKehadiranId, setDeleteKehadiranId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Fetch anak list
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

  // Fetch kehadiran
  const fetchKehadiran = useCallback(async () => {
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
      if (statusFilter && statusFilter !== 'all') {
        params.set('isHadir', statusFilter === 'hadir' ? 'true' : 'false');
      }

      const response = await fetch(`/api/daycare/kehadiran-harian?${params}`);
      if (!response.ok) throw new Error('Failed to fetch kehadiran');

      const data = await response.json();
      setKehadiranList(data.data);
      setStats(data.stats);
      setPagination((prev) => ({
        ...prev,
        total: data.total,
        totalPages: data.totalPages,
      }));
    } catch (error) {
      console.error('Error fetching kehadiran:', error);
      toast.error('Gagal mengambil data kehadiran');
    } finally {
      setIsLoading(false);
    }
  }, [pagination.page, pagination.pageSize, search, tanggal, selectedAnakId, statusFilter]);

  useEffect(() => {
    fetchAnakList();
  }, [fetchAnakList]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchKehadiran();
    }, 300);
    return () => clearTimeout(timer);
  }, [fetchKehadiran]);

  const handleOpenEdit = (kehadiran: KehadiranWithAnak) => {
    setEditingKehadiran(kehadiran);
    setIsFormOpen(true);
  };

  const handleOpenCreate = () => {
    setEditingKehadiran(null);
    setIsFormOpen(true);
  };

  const handleFormSuccess = () => {
    fetchKehadiran();
    setEditingKehadiran(null);
  };

  const handleDelete = async () => {
    if (!deleteKehadiranId) return;

    setIsDeleting(true);
    try {
      const response = await fetch(
        `/api/daycare/kehadiran-harian/${deleteKehadiranId}`,
        {
          method: 'DELETE',
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Gagal menghapus kehadiran');
      }

      toast.success('Kehadiran berhasil dihapus');
      setDeleteKehadiranId(null);
      fetchKehadiran();
    } catch (error) {
      console.error('Error deleting kehadiran:', error);
      toast.error(
        error instanceof Error ? error.message : 'Gagal menghapus kehadiran'
      );
    } finally {
      setIsDeleting(false);
    }
  };

  const formatTime = (date: Date | string | null | undefined) => {
    if (!date) return '-';
    const d = new Date(date);
    return d.toLocaleTimeString('id-ID', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Navigate dates
  const goToPreviousDay = () => {
    const date = new Date(tanggal);
    date.setDate(date.getDate() - 1);
    setTanggal(date.toISOString().split('T')[0]);
  };

  const goToNextDay = () => {
    const date = new Date(tanggal);
    date.setDate(date.getDate() + 1);
    setTanggal(date.toISOString().split('T')[0]);
  };

  const goToToday = () => {
    setTanggal(new Date().toISOString().split('T')[0]);
  };

  const isToday =
    tanggal === new Date().toISOString().split('T')[0];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-[#00BCD4]/5">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#006064] mb-2 flex items-center gap-3">
            <Calendar className="w-8 h-8" />
            Kehadiran Harian
          </h1>
          <p className="text-gray-600">
            Pencatatan kehadiran harian anak Daycare Al Muhajirin Rewwin
          </p>
        </div>

        {/* Date Navigation */}
        <Card className="mb-6 border-0 shadow-lg rounded-2xl overflow-hidden">
          <div className="bg-gradient-to-r from-[#00BCD4] to-[#006064] p-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center gap-4">
                <Button
                  variant="secondary"
                  size="icon"
                  onClick={goToPreviousDay}
                  className="rounded-full bg-white/20 hover:bg-white/30 text-white"
                >
                  <ChevronLeft className="w-5 h-5" />
                </Button>
                <div className="text-center">
                  <p className="text-white/80 text-sm">Tanggal</p>
                  <p className="text-white text-xl font-bold">
                    {formatTanggal(tanggal)}
                  </p>
                </div>
                <Button
                  variant="secondary"
                  size="icon"
                  onClick={goToNextDay}
                  className="rounded-full bg-white/20 hover:bg-white/30 text-white"
                >
                  <ChevronRight className="w-5 h-5" />
                </Button>
              </div>
              <div className="flex items-center gap-2">
                {!isToday && (
                  <Button
                    variant="secondary"
                    onClick={goToToday}
                    className="bg-white/20 hover:bg-white/30 text-white"
                  >
                    <CalendarDays className="w-4 h-4 mr-2" />
                    Hari Ini
                  </Button>
                )}
                <Input
                  type="date"
                  value={tanggal}
                  onChange={(e) => setTanggal(e.target.value)}
                  className="bg-white/20 border-white/30 text-white placeholder:text-white/60"
                />
              </div>
            </div>
          </div>
        </Card>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <Card className="border-0 shadow-lg rounded-2xl overflow-hidden">
            <div className="bg-gradient-to-r from-blue-400 to-blue-600 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/80 text-sm font-medium">Total Kehadiran</p>
                  <p className="text-white text-3xl font-bold mt-1">
                    {stats.total}
                  </p>
                </div>
                <div className="bg-white/20 rounded-full p-3">
                  <Users className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          </Card>

          <Card className="border-0 shadow-lg rounded-2xl overflow-hidden">
            <div className="bg-gradient-to-r from-green-400 to-green-600 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/80 text-sm font-medium">Hadir</p>
                  <p className="text-white text-3xl font-bold mt-1">
                    {stats.hadir}
                  </p>
                </div>
                <div className="bg-white/20 rounded-full p-3">
                  <UserCheck className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          </Card>

          <Card className="border-0 shadow-lg rounded-2xl overflow-hidden">
            <div className="bg-gradient-to-r from-red-400 to-red-600 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/80 text-sm font-medium">Tidak Hadir</p>
                  <p className="text-white text-3xl font-bold mt-1">
                    {stats.tidakHadir}
                  </p>
                </div>
                <div className="bg-white/20 rounded-full p-3">
                  <UserX className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Filters & Table */}
        <Card className="mb-6 border-0 shadow-lg rounded-2xl">
          <CardHeader className="border-b bg-gradient-to-r from-[#00BCD4]/10 to-transparent">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <CardTitle className="text-lg text-[#006064]">
                Daftar Kehadiran
              </CardTitle>
              <Button
                onClick={handleOpenCreate}
                className="bg-[#00BCD4] hover:bg-[#006064] text-white rounded-xl"
              >
                <Plus className="w-4 h-4 mr-2" />
                Catat Kehadiran
              </Button>
            </div>
          </CardHeader>
          <CardContent className="pt-4">
            {/* Filter Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <div>
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

              <Select
                value={statusFilter}
                onValueChange={(value) => {
                  setStatusFilter(value);
                  setPagination((prev) => ({ ...prev, page: 1 }));
                }}
              >
                <SelectTrigger className="rounded-xl">
                  <SelectValue placeholder="Status Kehadiran" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Status</SelectItem>
                  <SelectItem value="hadir">Hadir</SelectItem>
                  <SelectItem value="tidak_hadir">Tidak Hadir</SelectItem>
                </SelectContent>
              </Select>

              <Button
                variant="outline"
                onClick={() => {
                  setSearch('');
                  setSelectedAnakId('all');
                  setStatusFilter('all');
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
            ) : kehadiranList.length === 0 ? (
              <div className="text-center py-12">
                <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 text-lg">Tidak ada data kehadiran</p>
                <p className="text-gray-400 text-sm mb-4">
                  Belum ada kehadiran yang dicatat untuk{' '}
                  {formatTanggal(tanggal)}
                </p>
                <Button
                  onClick={handleOpenCreate}
                  className="bg-[#00BCD4] hover:bg-[#006064] text-white rounded-xl"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Catat Kehadiran Pertama
                </Button>
              </div>
            ) : (
              <>
                {/* Table */}
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-gray-50">
                        <TableHead className="font-semibold">No. Induk</TableHead>
                        <TableHead className="font-semibold">Nama Anak</TableHead>
                        <TableHead className="font-semibold">Paket</TableHead>
                        <TableHead className="font-semibold text-center">
                          Status
                        </TableHead>
                        <TableHead className="font-semibold text-center">
                          Jam Masuk
                        </TableHead>
                        <TableHead className="font-semibold text-center">
                          Jam Pulang
                        </TableHead>
                        <TableHead className="font-semibold">Catatan</TableHead>
                        <TableHead className="font-semibold text-center">
                          Aksi
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {kehadiranList.map((kehadiran) => (
                        <TableRow
                          key={kehadiran.id}
                          className="hover:bg-[#00BCD4]/5"
                        >
                          <TableCell className="font-mono text-sm">
                            {kehadiran.anak.nomorInduk}
                          </TableCell>
                          <TableCell>
                            <div>
                              <p className="font-medium text-[#006064]">
                                {kehadiran.anak.namaLengkap}
                              </p>
                              {kehadiran.anak.namaPanggilan && (
                                <p className="text-sm text-gray-500">
                                  ({kehadiran.anak.namaPanggilan})
                                </p>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            {kehadiran.anak.paketLayanan && (
                              <Badge
                                variant="outline"
                                className={getPaketColor(
                                  kehadiran.anak.paketLayanan
                                )}
                              >
                                {getPaketLabel(kehadiran.anak.paketLayanan)}
                              </Badge>
                            )}
                          </TableCell>
                          <TableCell className="text-center">
                            {kehadiran.isHadir ? (
                              <Badge className="bg-green-100 text-green-800 border-green-300">
                                <Check className="w-3 h-3 mr-1" />
                                Hadir
                              </Badge>
                            ) : (
                              <Badge className="bg-red-100 text-red-800 border-red-300">
                                <X className="w-3 h-3 mr-1" />
                                Tidak Hadir
                              </Badge>
                            )}
                          </TableCell>
                          <TableCell className="text-center">
                            {kehadiran.isHadir ? (
                              <div className="flex items-center justify-center gap-1">
                                <Clock className="w-3 h-3 text-green-600" />
                                <span className="font-medium">
                                  {formatTime(kehadiran.jamMasuk)}
                                </span>
                              </div>
                            ) : (
                              '-'
                            )}
                          </TableCell>
                          <TableCell className="text-center">
                            {kehadiran.isHadir && kehadiran.jamPulang ? (
                              <div className="flex items-center justify-center gap-1">
                                <Clock className="w-3 h-3 text-orange-600" />
                                <span className="font-medium">
                                  {formatTime(kehadiran.jamPulang)}
                                </span>
                              </div>
                            ) : (
                              '-'
                            )}
                          </TableCell>
                          <TableCell>
                            <p className="text-sm text-gray-600 truncate max-w-[200px]">
                              {kehadiran.catatan || '-'}
                            </p>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center justify-center gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleOpenEdit(kehadiran)}
                                className="border-[#00BCD4] text-[#006064] hover:bg-[#00BCD4]/10"
                              >
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() =>
                                  setDeleteKehadiranId(kehadiran.id)
                                }
                                className="border-red-300 text-red-600 hover:bg-red-50"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                {/* Pagination */}
                <div className="flex items-center justify-between mt-4 pt-4 border-t">
                  <p className="text-sm text-gray-600">
                    Menampilkan{' '}
                    {(pagination.page - 1) * pagination.pageSize + 1}-
                    {Math.min(
                      pagination.page * pagination.pageSize,
                      pagination.total
                    )}{' '}
                    dari {pagination.total} kehadiran
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
      <KehadiranForm
        open={isFormOpen}
        onOpenChange={(open) => {
          setIsFormOpen(open);
          if (!open) setEditingKehadiran(null);
        }}
        anakList={anakList}
        existingKehadiran={editingKehadiran}
        preselectedTanggal={tanggal}
        onSuccess={handleFormSuccess}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={!!deleteKehadiranId}
        onOpenChange={() => setDeleteKehadiranId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Kehadiran?</AlertDialogTitle>
            <AlertDialogDescription>
              Data kehadiran ini akan dihapus secara permanen. Tindakan ini tidak
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
