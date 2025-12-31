// src/app/units/poliklinik/obat/page.tsx
'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import {
  Pill,
  Search,
  Plus,
  ChevronLeft,
  ChevronRight,
  Edit,
  AlertTriangle,
  Package,
  PackagePlus,
  Loader2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  MasterObatWithRelations,
  KATEGORI_OBAT_OPTIONS,
  SATUAN_OBAT_OPTIONS,
} from '@/types/poliklinik';

export default function MasterObatPage() {
  const [obatList, setObatList] = useState<MasterObatWithRelations[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [kategori, setKategori] = useState('');
  const [stokRendah, setStokRendah] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [lowStockCount, setLowStockCount] = useState(0);

  // Dialog state
  const [dialogOpen, setDialogOpen] = useState(false);
  const [stokDialogOpen, setStokDialogOpen] = useState(false);
  const [editObat, setEditObat] = useState<MasterObatWithRelations | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    kode: '',
    nama: '',
    namaGenerik: '',
    satuan: 'tablet',
    stokAwal: 0,
    stokMinimum: 10,
    kategori: '',
    keterangan: '',
  });

  // Stok masuk form
  const [stokForm, setStokForm] = useState({
    jumlah: 0,
    sumber: '',
    keterangan: '',
  });

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        pageSize: '20',
      });

      if (search) params.append('search', search);
      if (kategori) params.append('kategori', kategori);
      if (stokRendah) params.append('stokRendah', 'true');

      const res = await fetch(`/api/poliklinik/obat?${params}`);
      const data = await res.json();

      setObatList(data.data || []);
      setTotalPages(data.totalPages || 1);
      setTotal(data.total || 0);
      setLowStockCount(data.lowStockCount || 0);
    } catch (error) {
      console.error('Error fetching obat:', error);
    } finally {
      setLoading(false);
    }
  }, [page, search, kategori, stokRendah]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchData();
  };

  const handleAdd = () => {
    setEditObat(null);
    setFormData({
      kode: '',
      nama: '',
      namaGenerik: '',
      satuan: 'tablet',
      stokAwal: 0,
      stokMinimum: 10,
      kategori: '',
      keterangan: '',
    });
    setDialogOpen(true);
  };

  const handleEdit = (obat: MasterObatWithRelations) => {
    setEditObat(obat);
    setFormData({
      kode: obat.kode,
      nama: obat.nama,
      namaGenerik: obat.namaGenerik || '',
      satuan: obat.satuan,
      stokAwal: obat.stokAwal,
      stokMinimum: obat.stokMinimum,
      kategori: obat.kategori || '',
      keterangan: obat.keterangan || '',
    });
    setDialogOpen(true);
  };

  const handleTambahStok = (obat: MasterObatWithRelations) => {
    setEditObat(obat);
    setStokForm({ jumlah: 0, sumber: '', keterangan: '' });
    setStokDialogOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      const url = editObat ? `/api/poliklinik/obat/${editObat.id}` : '/api/poliklinik/obat';
      const method = editObat ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Gagal menyimpan obat');
      }

      setDialogOpen(false);
      fetchData();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Terjadi kesalahan');
    } finally {
      setSaving(false);
    }
  };

  const handleSaveStok = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editObat) return;

    setSaving(true);
    setError(null);

    try {
      const res = await fetch(`/api/poliklinik/obat/${editObat.id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(stokForm),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Gagal menambah stok');
      }

      setStokDialogOpen(false);
      fetchData();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Terjadi kesalahan');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-700 text-white py-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <Link href="/units/poliklinik" className="text-purple-200 hover:text-white text-sm mb-2 inline-flex items-center">
                <ChevronLeft className="h-4 w-4 mr-1" />
                Kembali ke Poliklinik
              </Link>
              <h1 className="text-3xl font-bold flex items-center gap-3">
                <Pill className="h-8 w-8" />
                Master Obat
              </h1>
              <p className="text-purple-200 mt-1">Kelola inventaris obat Poliklinik</p>
            </div>
            <Button onClick={handleAdd} className="bg-white text-purple-700 hover:bg-purple-50">
              <Plus className="h-4 w-4 mr-2" />
              Tambah Obat
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
          <Card>
            <CardContent className="pt-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Total Jenis Obat</p>
                  <p className="text-2xl font-bold text-purple-700">{total}</p>
                </div>
                <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center">
                  <Package className="h-5 w-5 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className={lowStockCount > 0 ? 'border-2 border-red-200' : ''}>
            <CardContent className="pt-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Stok Menipis</p>
                  <p className="text-2xl font-bold text-red-700">{lowStockCount}</p>
                </div>
                <div className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center">
                  <AlertTriangle className="h-5 w-5 text-red-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="md:col-span-1">
            <CardContent className="pt-4">
              <Button
                variant={stokRendah ? 'default' : 'outline'}
                className={stokRendah ? 'w-full bg-red-600 hover:bg-red-700' : 'w-full'}
                onClick={() => setStokRendah(!stokRendah)}
              >
                {stokRendah ? 'Tampilkan Semua' : 'Lihat Stok Menipis'}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">Filter & Pencarian</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <Input
                  placeholder="Cari kode atau nama obat..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full"
                />
              </div>

              <Select value={kategori || 'all'} onValueChange={(v) => setKategori(v === 'all' ? '' : v)}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="Kategori" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Kategori</SelectItem>
                  {KATEGORI_OBAT_OPTIONS.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Button type="submit" className="bg-purple-600 hover:bg-purple-700">
                <Search className="h-4 w-4 mr-2" />
                Cari
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Table */}
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-purple-50">
                    <TableHead className="font-semibold">Kode</TableHead>
                    <TableHead className="font-semibold">Nama Obat</TableHead>
                    <TableHead className="font-semibold">Kategori</TableHead>
                    <TableHead className="font-semibold">Satuan</TableHead>
                    <TableHead className="font-semibold text-center">Stok</TableHead>
                    <TableHead className="font-semibold text-right">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8">
                        <div className="flex items-center justify-center">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : obatList.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                        Tidak ada data obat
                      </TableCell>
                    </TableRow>
                  ) : (
                    obatList.map((obat) => (
                      <TableRow key={obat.id} className={`hover:bg-purple-50/50 ${obat.stokSaatIni <= obat.stokMinimum ? 'bg-red-50' : ''}`}>
                        <TableCell className="font-mono text-sm">{obat.kode}</TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium">{obat.nama}</p>
                            {obat.namaGenerik && (
                              <p className="text-sm text-gray-500">{obat.namaGenerik}</p>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          {obat.kategori ? (
                            <Badge variant="outline">
                              {KATEGORI_OBAT_OPTIONS.find((o) => o.value === obat.kategori)?.label || obat.kategori}
                            </Badge>
                          ) : (
                            '-'
                          )}
                        </TableCell>
                        <TableCell>{obat.satuan}</TableCell>
                        <TableCell className="text-center">
                          <div className="flex flex-col items-center">
                            <span className={`font-bold ${obat.stokSaatIni <= obat.stokMinimum ? 'text-red-600' : 'text-green-600'}`}>
                              {obat.stokSaatIni}
                            </span>
                            {obat.stokSaatIni <= obat.stokMinimum && (
                              <span className="text-xs text-red-500 flex items-center gap-1">
                                <AlertTriangle className="h-3 w-3" />
                                Min: {obat.stokMinimum}
                              </span>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button variant="ghost" size="sm" onClick={() => handleTambahStok(obat)} className="text-green-600 hover:text-green-800">
                              <PackagePlus className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm" onClick={() => handleEdit(obat)} className="text-gray-600 hover:text-gray-800">
                              <Edit className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between px-4 py-4 border-t">
                <p className="text-sm text-gray-500">
                  Menampilkan {obatList.length} dari {total} obat
                </p>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <span className="text-sm">
                    Halaman {page} dari {totalPages}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Obat Form Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Pill className="h-5 w-5 text-purple-600" />
              {editObat ? 'Edit Obat' : 'Tambah Obat Baru'}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSave} className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="kode">Kode Obat *</Label>
                <Input
                  id="kode"
                  value={formData.kode}
                  onChange={(e) => setFormData((prev) => ({ ...prev, kode: e.target.value }))}
                  placeholder="OBT-001"
                  required
                  disabled={!!editObat}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="satuan">Satuan</Label>
                <Select
                  value={formData.satuan}
                  onValueChange={(v) => setFormData((prev) => ({ ...prev, satuan: v }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {SATUAN_OBAT_OPTIONS.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="nama">Nama Obat *</Label>
              <Input
                id="nama"
                value={formData.nama}
                onChange={(e) => setFormData((prev) => ({ ...prev, nama: e.target.value }))}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="namaGenerik">Nama Generik</Label>
              <Input
                id="namaGenerik"
                value={formData.namaGenerik}
                onChange={(e) => setFormData((prev) => ({ ...prev, namaGenerik: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="kategori">Kategori</Label>
              <Select
                value={formData.kategori || 'none'}
                onValueChange={(v) => setFormData((prev) => ({ ...prev, kategori: v === 'none' ? '' : v }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Pilih kategori" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">-</SelectItem>
                  {KATEGORI_OBAT_OPTIONS.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="stokAwal">Stok Awal</Label>
                <Input
                  id="stokAwal"
                  type="number"
                  value={formData.stokAwal}
                  onChange={(e) => setFormData((prev) => ({ ...prev, stokAwal: parseInt(e.target.value) || 0 }))}
                  disabled={!!editObat}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="stokMinimum">Stok Minimum</Label>
                <Input
                  id="stokMinimum"
                  type="number"
                  value={formData.stokMinimum}
                  onChange={(e) => setFormData((prev) => ({ ...prev, stokMinimum: parseInt(e.target.value) || 0 }))}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="keterangan">Keterangan</Label>
              <Textarea
                id="keterangan"
                value={formData.keterangan}
                onChange={(e) => setFormData((prev) => ({ ...prev, keterangan: e.target.value }))}
                rows={2}
              />
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)} disabled={saving}>
                Batal
              </Button>
              <Button type="submit" disabled={saving} className="bg-purple-600 hover:bg-purple-700">
                {saving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                Simpan
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Stok Masuk Dialog */}
      <Dialog open={stokDialogOpen} onOpenChange={setStokDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <PackagePlus className="h-5 w-5 text-green-600" />
              Tambah Stok Masuk
            </DialogTitle>
          </DialogHeader>

          {editObat && (
            <form onSubmit={handleSaveStok} className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="font-medium">{editObat.nama}</p>
                <p className="text-sm text-gray-500">Stok saat ini: {editObat.stokSaatIni} {editObat.satuan}</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="jumlah">Jumlah Masuk *</Label>
                <Input
                  id="jumlah"
                  type="number"
                  value={stokForm.jumlah}
                  onChange={(e) => setStokForm((prev) => ({ ...prev, jumlah: parseInt(e.target.value) || 0 }))}
                  min={1}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="sumber">Sumber</Label>
                <Input
                  id="sumber"
                  value={stokForm.sumber}
                  onChange={(e) => setStokForm((prev) => ({ ...prev, sumber: e.target.value }))}
                  placeholder="Donasi, Pembelian, dll"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="keterangan">Keterangan</Label>
                <Textarea
                  id="keterangan"
                  value={stokForm.keterangan}
                  onChange={(e) => setStokForm((prev) => ({ ...prev, keterangan: e.target.value }))}
                  rows={2}
                />
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <Button type="button" variant="outline" onClick={() => setStokDialogOpen(false)} disabled={saving}>
                  Batal
                </Button>
                <Button type="submit" disabled={saving || stokForm.jumlah <= 0} className="bg-green-600 hover:bg-green-700">
                  {saving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                  Tambah Stok
                </Button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
