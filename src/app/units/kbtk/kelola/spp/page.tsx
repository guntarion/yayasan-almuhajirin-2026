'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  CreditCard,
  Settings,
  Search,
  RefreshCw,
  Plus,
  FileText,
  AlertCircle,
  CheckCircle,
  Clock,
  MoreHorizontal,
  Edit,
  Loader2,
} from 'lucide-react';
import { toast } from 'sonner';
import {
  TagihanSppTable,
  PembayaranSppForm,
  GenerateTagihanDialog,
  SppSettingForm,
} from '@/components/kbtk';
import {
  KbtkTagihanSppWithRelations,
  KbtkSettingSpp,
  BULAN_OPTIONS,
  KELOMPOK_LEVEL_OPTIONS,
  STATUS_TAGIHAN_OPTIONS,
  formatCurrency,
} from '@/types/kbtk';

interface TagihanStats {
  totalTagihan: number;
  lunas: number;
  belumBayar: number;
  bayarSebagian: number;
  totalTunggakan: number;
}

export default function SppPage() {
  const currentYear = new Date().getFullYear();

  // Tagihan state
  const [tagihan, setTagihan] = useState<KbtkTagihanSppWithRelations[]>([]);
  const [tagihanStats, setTagihanStats] = useState<TagihanStats>({
    totalTagihan: 0,
    lunas: 0,
    belumBayar: 0,
    bayarSebagian: 0,
    totalTunggakan: 0,
  });
  const [tagihanLoading, setTagihanLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Filters
  const [search, setSearch] = useState('');
  const [filterBulan, setFilterBulan] = useState<string>('all');
  const [filterTahun, setFilterTahun] = useState<string>(currentYear.toString());
  const [filterKelompok, setFilterKelompok] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  // Settings state
  const [settings, setSettings] = useState<KbtkSettingSpp[]>([]);
  const [settingsLoading, setSettingsLoading] = useState(true);

  // Dialogs
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);
  const [selectedTagihan, setSelectedTagihan] = useState<KbtkTagihanSppWithRelations | null>(null);
  const [paymentLoading, setPaymentLoading] = useState(false);

  const [generateDialogOpen, setGenerateDialogOpen] = useState(false);

  const [settingDialogOpen, setSettingDialogOpen] = useState(false);
  const [selectedSetting, setSelectedSetting] = useState<KbtkSettingSpp | null>(null);
  const [settingLoading, setSettingLoading] = useState(false);

  // Year options for filters
  const yearOptions = [currentYear - 1, currentYear, currentYear + 1];

  // Fetch tagihan
  const fetchTagihan = useCallback(async () => {
    setTagihanLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        pageSize: '10',
        search,
        bulan: filterBulan,
        tahun: filterTahun,
        kelompokLevel: filterKelompok,
        status: filterStatus,
      });

      const res = await fetch(`/api/kbtk/tagihan-spp?${params}`);
      const data = await res.json();

      if (data.error) {
        throw new Error(data.error);
      }

      setTagihan(data.data || []);
      setTotalPages(data.totalPages || 1);
      setTagihanStats(data.stats || {
        totalTagihan: 0,
        lunas: 0,
        belumBayar: 0,
        bayarSebagian: 0,
        totalTunggakan: 0,
      });
    } catch (error) {
      console.error('Error fetching tagihan:', error);
      toast.error('Gagal memuat data tagihan');
    } finally {
      setTagihanLoading(false);
    }
  }, [page, search, filterBulan, filterTahun, filterKelompok, filterStatus]);

  // Fetch settings
  const fetchSettings = useCallback(async () => {
    setSettingsLoading(true);
    try {
      const res = await fetch('/api/kbtk/setting-spp');
      const data = await res.json();

      if (data.error) {
        throw new Error(data.error);
      }

      setSettings(data.data || []);
    } catch (error) {
      console.error('Error fetching settings:', error);
      toast.error('Gagal memuat pengaturan SPP');
    } finally {
      setSettingsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTagihan();
  }, [fetchTagihan]);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  // Handle payment
  const handleOpenPayment = (tagihan: KbtkTagihanSppWithRelations) => {
    setSelectedTagihan(tagihan);
    setPaymentDialogOpen(true);
  };

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
      setSelectedTagihan(null);
      fetchTagihan();
    } catch (error) {
      console.error('Error saving payment:', error);
      toast.error(error instanceof Error ? error.message : 'Gagal menyimpan pembayaran');
    } finally {
      setPaymentLoading(false);
    }
  };

  // Handle generate tagihan
  const handleGenerateTagihan = async (data: { bulan: number; tahun: number }) => {
    try {
      const res = await fetch('/api/kbtk/tagihan-spp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.error || 'Gagal generate tagihan');
      }

      if (result.created > 0) {
        toast.success(`${result.created} tagihan berhasil dibuat`);
        fetchTagihan();
      }

      return {
        created: result.created || 0,
        skipped: result.skipped || 0,
        errors: result.errors || [],
      };
    } catch (error) {
      console.error('Error generating tagihan:', error);
      toast.error(error instanceof Error ? error.message : 'Gagal generate tagihan');
      throw error;
    }
  };

  // Handle settings
  const handleOpenSettingForm = (setting?: KbtkSettingSpp) => {
    setSelectedSetting(setting || null);
    setSettingDialogOpen(true);
  };

  const handleSubmitSetting = async (data: {
    tahunAjaran: string;
    kelompokLevel: 'KB' | 'TK';
    nominalSpp: number;
    keterangan?: string | null;
    isActive?: boolean;
  }) => {
    setSettingLoading(true);
    try {
      const isEdit = !!selectedSetting;
      const url = '/api/kbtk/setting-spp';
      const method = isEdit ? 'PUT' : 'POST';
      const body = isEdit ? { id: selectedSetting.id, ...data } : data;

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.error || 'Gagal menyimpan pengaturan');
      }

      toast.success(isEdit ? 'Pengaturan berhasil diupdate' : 'Pengaturan berhasil ditambahkan');
      setSettingDialogOpen(false);
      setSelectedSetting(null);
      fetchSettings();
    } catch (error) {
      console.error('Error saving setting:', error);
      toast.error(error instanceof Error ? error.message : 'Gagal menyimpan pengaturan');
    } finally {
      setSettingLoading(false);
    }
  };

  // Search with debounce
  const handleSearch = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#006064]">Manajemen SPP</h1>
          <p className="text-gray-500 mt-1">
            Kelola tagihan dan pembayaran SPP siswa KBTK
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <FileText className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Total Tagihan</p>
                <p className="text-lg font-bold text-gray-900">
                  {formatCurrency(tagihanStats.totalTagihan)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Lunas</p>
                <p className="text-lg font-bold text-green-600">
                  {tagihanStats.lunas}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-yellow-500">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Clock className="h-5 w-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Belum Bayar</p>
                <p className="text-lg font-bold text-yellow-600">
                  {tagihanStats.belumBayar + tagihanStats.bayarSebagian}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-red-500">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-100 rounded-lg">
                <AlertCircle className="h-5 w-5 text-red-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Tunggakan</p>
                <p className="text-lg font-bold text-red-600">
                  {formatCurrency(tagihanStats.totalTunggakan)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="tagihan" className="space-y-6">
        <TabsList className="bg-gradient-to-r from-[#00BCD4]/10 to-[#006064]/10">
          <TabsTrigger value="tagihan" className="data-[state=active]:bg-white">
            <CreditCard className="h-4 w-4 mr-2" />
            Tagihan SPP
          </TabsTrigger>
          <TabsTrigger value="pengaturan" className="data-[state=active]:bg-white">
            <Settings className="h-4 w-4 mr-2" />
            Pengaturan SPP
          </TabsTrigger>
        </TabsList>

        {/* Tagihan Tab */}
        <TabsContent value="tagihan" className="space-y-4">
          {/* Filters & Actions */}
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-col lg:flex-row gap-4">
                {/* Search */}
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Cari nama siswa..."
                    value={search}
                    onChange={(e) => handleSearch(e.target.value)}
                    className="pl-10"
                  />
                </div>

                {/* Filters */}
                <div className="flex flex-wrap gap-2">
                  <Select value={filterBulan} onValueChange={(v) => { setFilterBulan(v); setPage(1); }}>
                    <SelectTrigger className="w-32">
                      <SelectValue placeholder="Bulan" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Semua Bulan</SelectItem>
                      {BULAN_OPTIONS.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value.toString()}>
                          {opt.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select value={filterTahun} onValueChange={(v) => { setFilterTahun(v); setPage(1); }}>
                    <SelectTrigger className="w-28">
                      <SelectValue placeholder="Tahun" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Semua</SelectItem>
                      {yearOptions.map((year) => (
                        <SelectItem key={year} value={year.toString()}>
                          {year}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select value={filterKelompok} onValueChange={(v) => { setFilterKelompok(v); setPage(1); }}>
                    <SelectTrigger className="w-28">
                      <SelectValue placeholder="Kelompok" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Semua</SelectItem>
                      {KELOMPOK_LEVEL_OPTIONS.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value}>
                          {opt.value}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select value={filterStatus} onValueChange={(v) => { setFilterStatus(v); setPage(1); }}>
                    <SelectTrigger className="w-36">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Semua Status</SelectItem>
                      {STATUS_TAGIHAN_OPTIONS.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value}>
                          {opt.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => fetchTagihan()}
                    disabled={tagihanLoading}
                  >
                    <RefreshCw className={`h-4 w-4 ${tagihanLoading ? 'animate-spin' : ''}`} />
                  </Button>
                  <Button
                    onClick={() => setGenerateDialogOpen(true)}
                    className="bg-gradient-to-r from-[#00BCD4] to-[#006064] text-white"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Generate Tagihan
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tagihan Table */}
          <TagihanSppTable
            data={tagihan}
            onPayment={handleOpenPayment}
            loading={tagihanLoading}
          />

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
              >
                Sebelumnya
              </Button>
              <span className="text-sm text-gray-500">
                Halaman {page} dari {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
              >
                Selanjutnya
              </Button>
            </div>
          )}
        </TabsContent>

        {/* Pengaturan Tab */}
        <TabsContent value="pengaturan" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-[#006064]">Pengaturan Nominal SPP</CardTitle>
                <CardDescription>
                  Atur nominal SPP per tahun ajaran dan kelompok
                </CardDescription>
              </div>
              <Button
                onClick={() => handleOpenSettingForm()}
                className="bg-gradient-to-r from-[#00BCD4] to-[#006064] text-white"
              >
                <Plus className="h-4 w-4 mr-2" />
                Tambah Pengaturan
              </Button>
            </CardHeader>
            <CardContent>
              {settingsLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin text-[#00BCD4]" />
                </div>
              ) : settings.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Settings className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                  <p>Belum ada pengaturan SPP</p>
                  <p className="text-sm">Klik tombol &quot;Tambah Pengaturan&quot; untuk membuat</p>
                </div>
              ) : (
                <div className="rounded-lg border overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-gradient-to-r from-[#00BCD4]/5 to-[#006064]/5">
                        <TableHead className="font-semibold text-[#006064]">Tahun Ajaran</TableHead>
                        <TableHead className="font-semibold text-[#006064]">Kelompok</TableHead>
                        <TableHead className="font-semibold text-[#006064] text-right">Nominal SPP</TableHead>
                        <TableHead className="font-semibold text-[#006064]">Keterangan</TableHead>
                        <TableHead className="font-semibold text-[#006064]">Status</TableHead>
                        <TableHead className="font-semibold text-[#006064] text-center">Aksi</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {settings.map((setting) => (
                        <TableRow key={setting.id}>
                          <TableCell className="font-medium">{setting.tahunAjaran}</TableCell>
                          <TableCell>
                            <Badge variant="outline" className="text-[#006064] border-[#00BCD4]">
                              {setting.kelompokLevel === 'KB' ? 'Kelompok Bermain' : 'Taman Kanak-kanak'}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right font-semibold">
                            {formatCurrency(Number(setting.nominalSpp))}
                          </TableCell>
                          <TableCell className="text-gray-500 text-sm">
                            {setting.keterangan || '-'}
                          </TableCell>
                          <TableCell>
                            <Badge
                              className={
                                setting.isActive
                                  ? 'bg-green-100 text-green-800'
                                  : 'bg-gray-100 text-gray-800'
                              }
                            >
                              {setting.isActive ? 'Aktif' : 'Nonaktif'}
                            </Badge>
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
                                  <DropdownMenuItem onClick={() => handleOpenSettingForm(setting)}>
                                    <Edit className="h-4 w-4 mr-2" />
                                    Edit
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Payment Dialog */}
      <Dialog open={paymentDialogOpen} onOpenChange={setPaymentDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-[#006064]">Input Pembayaran SPP</DialogTitle>
            <DialogDescription>
              Masukkan data pembayaran SPP siswa
            </DialogDescription>
          </DialogHeader>
          {selectedTagihan && (
            <PembayaranSppForm
              tagihan={selectedTagihan}
              onSubmit={handleSubmitPayment}
              onCancel={() => {
                setPaymentDialogOpen(false);
                setSelectedTagihan(null);
              }}
              loading={paymentLoading}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Generate Tagihan Dialog */}
      <GenerateTagihanDialog
        open={generateDialogOpen}
        onOpenChange={setGenerateDialogOpen}
        onGenerate={handleGenerateTagihan}
      />

      {/* Setting Dialog */}
      <Dialog open={settingDialogOpen} onOpenChange={setSettingDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-[#006064]">
              {selectedSetting ? 'Edit Pengaturan SPP' : 'Tambah Pengaturan SPP'}
            </DialogTitle>
            <DialogDescription>
              {selectedSetting
                ? 'Update pengaturan nominal SPP'
                : 'Tambahkan pengaturan nominal SPP baru'}
            </DialogDescription>
          </DialogHeader>
          <SppSettingForm
            setting={selectedSetting}
            onSubmit={handleSubmitSetting}
            onCancel={() => {
              setSettingDialogOpen(false);
              setSelectedSetting(null);
            }}
            loading={settingLoading}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
