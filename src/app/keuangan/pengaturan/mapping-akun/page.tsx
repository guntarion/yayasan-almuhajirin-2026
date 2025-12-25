'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Save, Search, Filter, RefreshCw, Check, AlertCircle, BookOpen } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface LookupItem {
  value: string;
  label: string;
}

interface BidangWithUnits extends LookupItem {
  units: LookupItem[];
}

interface KodeAkunItem extends LookupItem {
  kategori: string;
  normalBalance: string;
}

interface ProgramItemMapping {
  id: string;
  programId: string;
  programKode: string;
  programNama: string;
  programJenis: 'pendapatan' | 'pengeluaran';
  kodeItem: string;
  namaItem: string;
  kodeAkun: string;
  akun: {
    kode: string;
    nama: string;
    kategori: string;
    normalBalance: string;
  } | null;
  bidang: { kode: string; nama: string };
  unit: { kode: string; nama: string };
}

export default function MappingAkunPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [items, setItems] = useState<ProgramItemMapping[]>([]);
  const [editedItems, setEditedItems] = useState<Map<string, string>>(new Map());
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [search, setSearch] = useState('');
  const [selectedBidang, setSelectedBidang] = useState('');
  const [selectedUnit, setSelectedUnit] = useState('');
  const [selectedJenis, setSelectedJenis] = useState('');

  // Lookups
  const [bidangOptions, setBidangOptions] = useState<BidangWithUnits[]>([]);
  const [kodeAkunOptions, setKodeAkunOptions] = useState<KodeAkunItem[]>([]);

  useEffect(() => {
    fetchLookups();
    fetchItems();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    fetchItems();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedBidang, selectedUnit, selectedJenis]);

  const fetchLookups = async () => {
    try {
      const response = await fetch('/api/keuangan/lookups');
      const result = await response.json();
      if (result.bidang) {
        setBidangOptions(result.bidang);
      }
      if (result.kodeAkun) {
        setKodeAkunOptions(result.kodeAkun);
      }
    } catch (err) {
      console.error('Error fetching lookups:', err);
    }
  };

  const fetchItems = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (selectedBidang) params.set('bidangKode', selectedBidang);
      if (selectedUnit) params.set('unitKerjaKode', selectedUnit);
      if (selectedJenis) params.set('jenis', selectedJenis);
      if (search) params.set('search', search);

      const response = await fetch(`/api/keuangan/pengaturan/mapping-akun?${params}`);
      const result = await response.json();
      if (result.data) {
        setItems(result.data);
      }
    } catch (err) {
      console.error('Error fetching items:', err);
      setError('Gagal memuat data');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    fetchItems();
  };

  const handleAkunChange = (itemId: string, kodeAkun: string) => {
    const newEdited = new Map(editedItems);
    const originalItem = items.find(i => i.id === itemId);

    // If the value is same as original, remove from edited
    if (originalItem?.kodeAkun === kodeAkun) {
      newEdited.delete(itemId);
    } else {
      newEdited.set(itemId, kodeAkun);
    }
    setEditedItems(newEdited);
  };

  const getCurrentAkun = (item: ProgramItemMapping) => {
    if (editedItems.has(item.id)) {
      const kode = editedItems.get(item.id)!;
      const akun = kodeAkunOptions.find(a => a.value === kode);
      return akun ? { kode: akun.value, nama: akun.label } : null;
    }
    return item.akun;
  };

  const saveChanges = async () => {
    if (editedItems.size === 0) return;

    try {
      setSaving(true);
      setError(null);

      const mappings = Array.from(editedItems.entries()).map(([itemId, kodeAkun]) => ({
        itemId,
        kodeAkun,
      }));

      const response = await fetch('/api/keuangan/pengaturan/mapping-akun', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mappings }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Gagal menyimpan');
      }

      setEditedItems(new Map());
      setSuccessMessage(`${result.updated} item berhasil diperbarui`);
      fetchItems();

      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Gagal menyimpan perubahan');
    } finally {
      setSaving(false);
    }
  };

  const resetFilters = () => {
    setSearch('');
    setSelectedBidang('');
    setSelectedUnit('');
    setSelectedJenis('');
    setEditedItems(new Map());
  };

  const selectedBidangData = bidangOptions.find(b => b.value === selectedBidang);
  const unitOptions = selectedBidangData?.units || [];

  // Filter akun options based on jenis
  // Currently showing all options, but preserved for future filtering logic
  const _filteredAkunOptions = kodeAkunOptions.filter(_akun => {
    // For pendapatan, show income accounts (4xxx)
    // For pengeluaran, show expense accounts (5xxx)
    // But also allow all for flexibility
    return true; // Show all, let user decide
  });

  // Group akun by category for easier selection
  const akunByCategory = kodeAkunOptions.reduce((acc, akun) => {
    const category = akun.kategori;
    if (!acc[category]) acc[category] = [];
    acc[category].push(akun);
    return acc;
  }, {} as Record<string, KodeAkunItem[]>);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/pengaturan">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-[#006064] flex items-center gap-2">
            <BookOpen className="h-6 w-6" />
            Mapping Akun Program
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            Kelola asosiasi antara item program kerja dengan kode akun
          </p>
        </div>
        {editedItems.size > 0 && (
          <Button
            onClick={saveChanges}
            disabled={saving}
            className="bg-[#00BCD4] hover:bg-[#006064]"
          >
            {saving ? (
              <>
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                Menyimpan...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Simpan ({editedItems.size} perubahan)
              </>
            )}
          </Button>
        )}
      </div>

      {/* Success Message */}
      {successMessage && (
        <Card className="border-green-200 bg-green-50">
          <CardContent className="pt-4">
            <div className="flex items-center gap-2 text-green-600">
              <Check className="h-5 w-5" />
              <span>{successMessage}</span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Error */}
      {error && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-4">
            <div className="flex items-center gap-2 text-red-600">
              <AlertCircle className="h-5 w-5" />
              <span>{error}</span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Info Card */}
      <Card className="border-[#00BCD4]/30 bg-[#00BCD4]/5">
        <CardContent className="pt-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-[#00BCD4] mt-0.5" />
            <div className="text-sm">
              <p className="font-medium text-[#006064]">Tentang Mapping Akun</p>
              <p className="text-gray-600 mt-1">
                Setiap item program kerja perlu diasosiasikan dengan kode akun yang sesuai.
                Saat transaksi dicatat menggunakan item tersebut, sistem akan otomatis menggunakan
                kode akun yang sudah di-mapping untuk membuat jurnal entry.
              </p>
              <ul className="mt-2 space-y-1 text-gray-600">
                <li>• <strong>Pendapatan:</strong> Gunakan akun kategori Pendapatan (4xxx)</li>
                <li>• <strong>Pengeluaran:</strong> Gunakan akun kategori Beban (5xxx)</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Filters */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-lg flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filter
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="space-y-2">
              <Label>Pencarian</Label>
              <div className="flex gap-2">
                <Input
                  placeholder="Cari nama item..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Jenis</Label>
              <Select value={selectedJenis} onValueChange={setSelectedJenis}>
                <SelectTrigger>
                  <SelectValue placeholder="Semua jenis" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua jenis</SelectItem>
                  <SelectItem value="pendapatan">Pendapatan</SelectItem>
                  <SelectItem value="pengeluaran">Pengeluaran</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Bidang</Label>
              <Select
                value={selectedBidang}
                onValueChange={(v) => {
                  setSelectedBidang(v === 'all' ? '' : v);
                  setSelectedUnit('');
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Semua bidang" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua bidang</SelectItem>
                  {bidangOptions.map((b) => (
                    <SelectItem key={b.value} value={b.value}>
                      {b.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Unit</Label>
              <Select
                value={selectedUnit}
                onValueChange={(v) => setSelectedUnit(v === 'all' ? '' : v)}
                disabled={!selectedBidang}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Semua unit" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua unit</SelectItem>
                  {unitOptions.map((u) => (
                    <SelectItem key={u.value} value={u.value}>
                      {u.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>&nbsp;</Label>
              <div className="flex gap-2">
                <Button onClick={handleSearch} variant="outline" className="flex-1">
                  <Search className="h-4 w-4 mr-2" />
                  Cari
                </Button>
                <Button onClick={resetFilters} variant="ghost" size="icon">
                  <RefreshCw className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Data Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg">Daftar Item Program</CardTitle>
              <CardDescription>
                {items.length} item ditemukan
                {editedItems.size > 0 && (
                  <span className="text-orange-500 ml-2">
                    ({editedItems.size} belum disimpan)
                  </span>
                )}
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#00BCD4]"></div>
            </div>
          ) : items.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <p>Tidak ada data item program</p>
              <p className="text-sm mt-1">Coba ubah filter atau tambah program kerja terlebih dahulu</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50">
                    <TableHead className="w-[100px]">Bidang</TableHead>
                    <TableHead className="w-[100px]">Unit</TableHead>
                    <TableHead className="w-[120px]">Kode Item</TableHead>
                    <TableHead>Nama Item</TableHead>
                    <TableHead className="w-[100px]">Jenis</TableHead>
                    <TableHead className="w-[300px]">Kode Akun</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {items.map((item) => {
                    const currentAkun = getCurrentAkun(item);
                    const isEdited = editedItems.has(item.id);

                    return (
                      <TableRow
                        key={item.id}
                        className={isEdited ? 'bg-yellow-50' : ''}
                      >
                        <TableCell className="text-xs">
                          <Badge variant="outline">{item.bidang.kode}</Badge>
                        </TableCell>
                        <TableCell className="text-xs">
                          <Badge variant="secondary">{item.unit.kode}</Badge>
                        </TableCell>
                        <TableCell className="font-mono text-xs">
                          {item.kodeItem}
                        </TableCell>
                        <TableCell>
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <span className="text-sm cursor-help">
                                  {item.namaItem.length > 40
                                    ? `${item.namaItem.substring(0, 40)}...`
                                    : item.namaItem}
                                </span>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p className="max-w-xs">{item.namaItem}</p>
                                <p className="text-xs text-gray-400 mt-1">{item.programNama}</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </TableCell>
                        <TableCell>
                          <Badge
                            className={
                              item.programJenis === 'pendapatan'
                                ? 'bg-green-100 text-green-700'
                                : 'bg-red-100 text-red-700'
                            }
                          >
                            {item.programJenis === 'pendapatan' ? 'Masuk' : 'Keluar'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Select
                            value={editedItems.get(item.id) || item.kodeAkun}
                            onValueChange={(v) => handleAkunChange(item.id, v)}
                          >
                            <SelectTrigger className={`text-xs ${isEdited ? 'border-orange-400' : ''}`}>
                              <SelectValue>
                                {currentAkun
                                  ? `${currentAkun.kode} - ${currentAkun.nama}`
                                  : 'Pilih akun'}
                              </SelectValue>
                            </SelectTrigger>
                            <SelectContent className="max-h-[300px]">
                              {Object.entries(akunByCategory).map(([category, akuns]) => (
                                <div key={category}>
                                  <div className="px-2 py-1.5 text-xs font-semibold text-gray-500 bg-gray-50">
                                    {category}
                                  </div>
                                  {akuns.map((akun) => (
                                    <SelectItem key={akun.value} value={akun.value}>
                                      <span className="font-mono text-xs">{akun.value}</span>
                                      <span className="ml-2 text-xs">{akun.label}</span>
                                    </SelectItem>
                                  ))}
                                </div>
                              ))}
                            </SelectContent>
                          </Select>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
