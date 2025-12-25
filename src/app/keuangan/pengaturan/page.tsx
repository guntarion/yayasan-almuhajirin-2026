'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Settings, Plus, Pencil, Trash2, Building2, Users, BookOpen, Calendar, Link2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
// Textarea removed - not currently used
import { Badge } from '@/components/ui/badge';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
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

interface Bidang {
  kode: string;
  nama: string;
  kepalaNama: string | null;
  isActive: boolean;
}

interface UnitKerja {
  kode: string;
  nama: string;
  kepalaUnit: string | null;
  bidangKode: string;
  bidangNama: string;
  isActive: boolean;
}

interface FiscalPeriod {
  id: string;
  name: string;
  year: number;
  startDate: string;
  endDate: string;
  isActive: boolean;
  isClosed: boolean;
}

export default function PengaturanPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Bidang state
  const [bidangList, setBidangList] = useState<Bidang[]>([]);
  const [showBidangForm, setShowBidangForm] = useState(false);
  const [editingBidang, setEditingBidang] = useState<Bidang | null>(null);
  const [bidangForm, setBidangForm] = useState({ kode: '', nama: '', kepalaNama: '' });

  // Unit state
  const [unitList, setUnitList] = useState<UnitKerja[]>([]);
  const [showUnitForm, setShowUnitForm] = useState(false);
  const [editingUnit, setEditingUnit] = useState<UnitKerja | null>(null);
  const [unitForm, setUnitForm] = useState({ kode: '', nama: '', bidangKode: '', kepalaUnit: '' });

  // Fiscal Period state
  const [fiscalPeriods, setFiscalPeriods] = useState<FiscalPeriod[]>([]);
  const [showPeriodForm, setShowPeriodForm] = useState(false);
  const [editingPeriod, setEditingPeriod] = useState<FiscalPeriod | null>(null);
  const [periodForm, setPeriodForm] = useState({
    name: '',
    year: new Date().getFullYear(),
    startDate: '',
    endDate: '',
  });

  // Delete dialogs
  const [deleteBidangDialog, setDeleteBidangDialog] = useState<{ open: boolean; bidang: Bidang | null }>({
    open: false,
    bidang: null,
  });
  const [deleteUnitDialog, setDeleteUnitDialog] = useState<{ open: boolean; unit: UnitKerja | null }>({
    open: false,
    unit: null,
  });

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      await Promise.all([fetchBidang(), fetchUnits(), fetchFiscalPeriods()]);
    } finally {
      setLoading(false);
    }
  };

  const fetchBidang = async () => {
    try {
      const response = await fetch('/api/keuangan/pengaturan/bidang');
      const result = await response.json();
      if (result.data) {
        setBidangList(result.data);
      }
    } catch (error) {
      console.error('Error fetching bidang:', error);
    }
  };

  const fetchUnits = async () => {
    try {
      const response = await fetch('/api/keuangan/pengaturan/unit');
      const result = await response.json();
      if (result.data) {
        setUnitList(result.data);
      }
    } catch (error) {
      console.error('Error fetching units:', error);
    }
  };

  const fetchFiscalPeriods = async () => {
    try {
      const response = await fetch('/api/keuangan/pengaturan/fiscal-period');
      const result = await response.json();
      if (result.data) {
        setFiscalPeriods(result.data);
      }
    } catch (error) {
      console.error('Error fetching fiscal periods:', error);
    }
  };

  // Bidang handlers
  const openBidangForm = (bidang?: Bidang) => {
    if (bidang) {
      setEditingBidang(bidang);
      setBidangForm({
        kode: bidang.kode,
        nama: bidang.nama,
        kepalaNama: bidang.kepalaNama || '',
      });
    } else {
      setEditingBidang(null);
      setBidangForm({ kode: '', nama: '', kepalaNama: '' });
    }
    setShowBidangForm(true);
  };

  const saveBidang = async () => {
    if (!bidangForm.kode || !bidangForm.nama) {
      alert('Kode dan nama bidang harus diisi');
      return;
    }

    setSaving(true);
    try {
      const url = editingBidang
        ? `/api/keuangan/pengaturan/bidang/${editingBidang.kode}`
        : '/api/keuangan/pengaturan/bidang';
      const method = editingBidang ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bidangForm),
      });

      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.error || 'Gagal menyimpan bidang');
      }

      setShowBidangForm(false);
      fetchBidang();
      fetchUnits();
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Gagal menyimpan bidang');
    } finally {
      setSaving(false);
    }
  };

  const deleteBidang = async () => {
    if (!deleteBidangDialog.bidang) return;

    try {
      const response = await fetch(`/api/keuangan/pengaturan/bidang/${deleteBidangDialog.bidang.kode}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.error || 'Gagal menghapus bidang');
      }

      setDeleteBidangDialog({ open: false, bidang: null });
      fetchBidang();
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Gagal menghapus bidang');
    }
  };

  // Unit handlers
  const openUnitForm = (unit?: UnitKerja) => {
    if (unit) {
      setEditingUnit(unit);
      setUnitForm({
        kode: unit.kode,
        nama: unit.nama,
        bidangKode: unit.bidangKode,
        kepalaUnit: unit.kepalaUnit || '',
      });
    } else {
      setEditingUnit(null);
      setUnitForm({ kode: '', nama: '', bidangKode: '', kepalaUnit: '' });
    }
    setShowUnitForm(true);
  };

  const saveUnit = async () => {
    if (!unitForm.kode || !unitForm.nama || !unitForm.bidangKode) {
      alert('Kode, nama, dan bidang harus diisi');
      return;
    }

    setSaving(true);
    try {
      const url = editingUnit
        ? `/api/keuangan/pengaturan/unit/${editingUnit.kode}`
        : '/api/keuangan/pengaturan/unit';
      const method = editingUnit ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(unitForm),
      });

      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.error || 'Gagal menyimpan unit');
      }

      setShowUnitForm(false);
      fetchUnits();
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Gagal menyimpan unit');
    } finally {
      setSaving(false);
    }
  };

  const deleteUnit = async () => {
    if (!deleteUnitDialog.unit) return;

    try {
      const response = await fetch(`/api/keuangan/pengaturan/unit/${deleteUnitDialog.unit.kode}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.error || 'Gagal menghapus unit');
      }

      setDeleteUnitDialog({ open: false, unit: null });
      fetchUnits();
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Gagal menghapus unit');
    }
  };

  // Fiscal Period handlers
  const openPeriodForm = (period?: FiscalPeriod) => {
    if (period) {
      setEditingPeriod(period);
      setPeriodForm({
        name: period.name,
        year: period.year,
        startDate: period.startDate.split('T')[0],
        endDate: period.endDate.split('T')[0],
      });
    } else {
      setEditingPeriod(null);
      const year = new Date().getFullYear();
      setPeriodForm({
        name: `Tahun Anggaran ${year}`,
        year,
        startDate: `${year}-01-01`,
        endDate: `${year}-12-31`,
      });
    }
    setShowPeriodForm(true);
  };

  const savePeriod = async () => {
    if (!periodForm.name || !periodForm.year || !periodForm.startDate || !periodForm.endDate) {
      alert('Semua field harus diisi');
      return;
    }

    setSaving(true);
    try {
      const url = editingPeriod
        ? `/api/keuangan/pengaturan/fiscal-period/${editingPeriod.id}`
        : '/api/keuangan/pengaturan/fiscal-period';
      const method = editingPeriod ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(periodForm),
      });

      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.error || 'Gagal menyimpan periode');
      }

      setShowPeriodForm(false);
      fetchFiscalPeriods();
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Gagal menyimpan periode');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#00BCD4]"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="relative overflow-hidden bg-gradient-to-r from-white via-[#B2EBF2]/20 to-[#80DEEA]/20 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 py-6 rounded-b-3xl border-b border-[#00BCD4]/10">
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-gradient-to-br from-[#00BCD4]/20 to-[#80DEEA]/20 rounded-full blur-3xl" />
        <div className="relative">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-1 h-8 bg-gradient-to-b from-[#00BCD4] to-[#006064] rounded-full" />
            <h1 className="text-3xl font-bold text-[#006064] flex items-center gap-2">
              <Settings className="h-7 w-7" />
              Pengaturan Sistem
            </h1>
          </div>
          <p className="text-sm text-gray-600 ml-4">Kelola konfigurasi sistem keuangan</p>
        </div>
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Link href="/pengaturan/akun">
          <Card className="border-2 border-gray-100 rounded-2xl hover:shadow-lg hover:border-[#00BCD4]/40 transition-all duration-300 hover:scale-105 cursor-pointer">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-gradient-to-br from-[#B2EBF2] to-[#80DEEA]/50">
                  <BookOpen className="h-6 w-6 text-[#006064]" />
                </div>
                <div>
                  <h3 className="font-semibold text-[#006064]">Chart of Accounts</h3>
                  <p className="text-sm text-gray-500">Kelola kode akun keuangan</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link href="/pengaturan/mapping-akun">
          <Card className="border-2 border-gray-100 rounded-2xl hover:shadow-lg hover:border-[#00BCD4]/40 transition-all duration-300 hover:scale-105 cursor-pointer">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-gradient-to-br from-[#B2EBF2] to-[#80DEEA]/50">
                  <Link2 className="h-6 w-6 text-[#006064]" />
                </div>
                <div>
                  <h3 className="font-semibold text-[#006064]">Mapping Akun Program</h3>
                  <p className="text-sm text-gray-500">Asosiasi item program ke akun</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="bidang" className="space-y-4">
        <TabsList className="bg-gradient-to-r from-[#00BCD4]/10 to-[#80DEEA]/10 p-1 rounded-xl">
          <TabsTrigger value="bidang" className="rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#00BCD4] data-[state=active]:to-[#006064] data-[state=active]:text-white flex items-center gap-2">
            <Building2 className="h-4 w-4" />
            Kelola Bidang
          </TabsTrigger>
          <TabsTrigger value="unit" className="rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#00BCD4] data-[state=active]:to-[#006064] data-[state=active]:text-white flex items-center gap-2">
            <Users className="h-4 w-4" />
            Kelola Unit
          </TabsTrigger>
          <TabsTrigger value="period" className="rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#00BCD4] data-[state=active]:to-[#006064] data-[state=active]:text-white flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Periode Fiskal
          </TabsTrigger>
        </TabsList>

        {/* Bidang Tab */}
        <TabsContent value="bidang" className="space-y-4">
          <div className="flex justify-between items-center">
            <p className="text-sm text-gray-600">
              Kelola bidang/divisi dalam organisasi
            </p>
            <Button onClick={() => openBidangForm()} className="bg-gradient-to-r from-[#00BCD4] to-[#006064] hover:from-[#006064] hover:to-[#00BCD4] text-white rounded-xl">
              <Plus className="h-4 w-4 mr-2" />
              Tambah Bidang
            </Button>
          </div>

          <Card className="border-2 border-gray-100 rounded-2xl">
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gradient-to-r from-[#00BCD4]/10 to-[#80DEEA]/10">
                    <tr>
                      <th className="text-left py-3 px-4 text-xs font-semibold text-[#006064] uppercase">Kode</th>
                      <th className="text-left py-3 px-4 text-xs font-semibold text-[#006064] uppercase">Nama Bidang</th>
                      <th className="text-left py-3 px-4 text-xs font-semibold text-[#006064] uppercase">Kepala Bidang</th>
                      <th className="text-center py-3 px-4 text-xs font-semibold text-[#006064] uppercase">Status</th>
                      <th className="text-right py-3 px-4 text-xs font-semibold text-[#006064] uppercase">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {bidangList.map((bidang) => (
                      <tr key={bidang.kode} className={`hover:bg-gray-50 ${!bidang.isActive ? 'opacity-50' : ''}`}>
                        <td className="py-3 px-4 font-mono text-sm font-medium">{bidang.kode}</td>
                        <td className="py-3 px-4 text-sm">{bidang.nama}</td>
                        <td className="py-3 px-4 text-sm text-gray-600">{bidang.kepalaNama || '-'}</td>
                        <td className="py-3 px-4 text-center">
                          <Badge className={bidang.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}>
                            {bidang.isActive ? 'Aktif' : 'Nonaktif'}
                          </Badge>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <div className="flex justify-end gap-1">
                            <Button variant="ghost" size="icon" onClick={() => openBidangForm(bidang)} className="h-8 w-8">
                              <Pencil className="h-4 w-4 text-blue-600" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => setDeleteBidangDialog({ open: true, bidang })}
                              className="h-8 w-8"
                            >
                              <Trash2 className="h-4 w-4 text-red-600" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {bidangList.length === 0 && (
                      <tr>
                        <td colSpan={5} className="py-8 text-center text-gray-500">
                          Belum ada data bidang
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Unit Tab */}
        <TabsContent value="unit" className="space-y-4">
          <div className="flex justify-between items-center">
            <p className="text-sm text-gray-600">
              Kelola unit/sub-divisi di bawah bidang
            </p>
            <Button onClick={() => openUnitForm()} className="bg-gradient-to-r from-[#00BCD4] to-[#006064] hover:from-[#006064] hover:to-[#00BCD4] text-white rounded-xl">
              <Plus className="h-4 w-4 mr-2" />
              Tambah Unit
            </Button>
          </div>

          <Card className="border-2 border-gray-100 rounded-2xl">
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gradient-to-r from-[#00BCD4]/10 to-[#80DEEA]/10">
                    <tr>
                      <th className="text-left py-3 px-4 text-xs font-semibold text-[#006064] uppercase">Kode</th>
                      <th className="text-left py-3 px-4 text-xs font-semibold text-[#006064] uppercase">Nama Unit</th>
                      <th className="text-left py-3 px-4 text-xs font-semibold text-[#006064] uppercase">Bidang</th>
                      <th className="text-left py-3 px-4 text-xs font-semibold text-[#006064] uppercase">Kepala Unit</th>
                      <th className="text-center py-3 px-4 text-xs font-semibold text-[#006064] uppercase">Status</th>
                      <th className="text-right py-3 px-4 text-xs font-semibold text-[#006064] uppercase">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {unitList.map((unit) => (
                      <tr key={unit.kode} className={`hover:bg-gray-50 ${!unit.isActive ? 'opacity-50' : ''}`}>
                        <td className="py-3 px-4 font-mono text-sm font-medium">{unit.kode}</td>
                        <td className="py-3 px-4 text-sm">{unit.nama}</td>
                        <td className="py-3 px-4 text-sm">
                          <Badge variant="outline" className="mr-2">{unit.bidangKode}</Badge>
                          <span className="text-gray-600">{unit.bidangNama}</span>
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-600">{unit.kepalaUnit || '-'}</td>
                        <td className="py-3 px-4 text-center">
                          <Badge className={unit.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}>
                            {unit.isActive ? 'Aktif' : 'Nonaktif'}
                          </Badge>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <div className="flex justify-end gap-1">
                            <Button variant="ghost" size="icon" onClick={() => openUnitForm(unit)} className="h-8 w-8">
                              <Pencil className="h-4 w-4 text-blue-600" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => setDeleteUnitDialog({ open: true, unit })}
                              className="h-8 w-8"
                            >
                              <Trash2 className="h-4 w-4 text-red-600" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {unitList.length === 0 && (
                      <tr>
                        <td colSpan={6} className="py-8 text-center text-gray-500">
                          Belum ada data unit
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Fiscal Period Tab */}
        <TabsContent value="period" className="space-y-4">
          <div className="flex justify-between items-center">
            <p className="text-sm text-gray-600">
              Kelola periode tahun fiskal
            </p>
            <Button onClick={() => openPeriodForm()} className="bg-gradient-to-r from-[#00BCD4] to-[#006064] hover:from-[#006064] hover:to-[#00BCD4] text-white rounded-xl">
              <Plus className="h-4 w-4 mr-2" />
              Tambah Periode
            </Button>
          </div>

          <Card className="border-2 border-gray-100 rounded-2xl">
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gradient-to-r from-[#00BCD4]/10 to-[#80DEEA]/10">
                    <tr>
                      <th className="text-left py-3 px-4 text-xs font-semibold text-[#006064] uppercase">Tahun</th>
                      <th className="text-left py-3 px-4 text-xs font-semibold text-[#006064] uppercase">Nama</th>
                      <th className="text-left py-3 px-4 text-xs font-semibold text-[#006064] uppercase">Periode</th>
                      <th className="text-center py-3 px-4 text-xs font-semibold text-[#006064] uppercase">Status</th>
                      <th className="text-right py-3 px-4 text-xs font-semibold text-[#006064] uppercase">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {fiscalPeriods.map((period) => (
                      <tr key={period.id} className="hover:bg-gray-50">
                        <td className="py-3 px-4 font-mono text-sm font-medium">{period.year}</td>
                        <td className="py-3 px-4 text-sm">{period.name}</td>
                        <td className="py-3 px-4 text-sm text-gray-600">
                          {new Date(period.startDate).toLocaleDateString('id-ID')} -{' '}
                          {new Date(period.endDate).toLocaleDateString('id-ID')}
                        </td>
                        <td className="py-3 px-4 text-center">
                          <div className="flex justify-center gap-1">
                            {period.isActive && (
                              <Badge className="bg-green-100 text-green-700">Aktif</Badge>
                            )}
                            {period.isClosed && (
                              <Badge className="bg-gray-100 text-gray-700">Ditutup</Badge>
                            )}
                            {!period.isActive && !period.isClosed && (
                              <Badge className="bg-yellow-100 text-yellow-700">Draft</Badge>
                            )}
                          </div>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <Button variant="ghost" size="icon" onClick={() => openPeriodForm(period)} className="h-8 w-8">
                            <Pencil className="h-4 w-4 text-blue-600" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                    {fiscalPeriods.length === 0 && (
                      <tr>
                        <td colSpan={5} className="py-8 text-center text-gray-500">
                          Belum ada periode fiskal
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Bidang Form Dialog */}
      <Dialog open={showBidangForm} onOpenChange={setShowBidangForm}>
        <DialogContent className="rounded-2xl">
          <DialogHeader className="border-b border-[#00BCD4]/10 pb-4">
            <DialogTitle className="text-[#006064]">{editingBidang ? 'Edit Bidang' : 'Tambah Bidang Baru'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Kode Bidang *</Label>
                <Input
                  value={bidangForm.kode}
                  onChange={(e) => setBidangForm({ ...bidangForm, kode: e.target.value.toUpperCase() })}
                  disabled={!!editingBidang}
                  placeholder="SK"
                  maxLength={10}
                />
              </div>
              <div className="space-y-2">
                <Label>Nama Bidang *</Label>
                <Input
                  value={bidangForm.nama}
                  onChange={(e) => setBidangForm({ ...bidangForm, nama: e.target.value })}
                  placeholder="KESEKRETARIATAN"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Kepala Bidang</Label>
              <Input
                value={bidangForm.kepalaNama}
                onChange={(e) => setBidangForm({ ...bidangForm, kepalaNama: e.target.value })}
                placeholder="Nama kepala bidang (opsional)"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowBidangForm(false)} disabled={saving} className="rounded-xl">
              Batal
            </Button>
            <Button onClick={saveBidang} disabled={saving} className="bg-gradient-to-r from-[#00BCD4] to-[#006064] hover:from-[#006064] hover:to-[#00BCD4] text-white rounded-xl">
              {saving ? 'Menyimpan...' : 'Simpan'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Unit Form Dialog */}
      <Dialog open={showUnitForm} onOpenChange={setShowUnitForm}>
        <DialogContent className="rounded-2xl">
          <DialogHeader className="border-b border-[#00BCD4]/10 pb-4">
            <DialogTitle className="text-[#006064]">{editingUnit ? 'Edit Unit' : 'Tambah Unit Baru'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Bidang *</Label>
              <Select
                value={unitForm.bidangKode}
                onValueChange={(v) => setUnitForm({ ...unitForm, bidangKode: v })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Pilih Bidang" />
                </SelectTrigger>
                <SelectContent>
                  {bidangList.filter(b => b.isActive).map((bidang) => (
                    <SelectItem key={bidang.kode} value={bidang.kode}>
                      {bidang.kode} - {bidang.nama}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Kode Unit *</Label>
                <Input
                  value={unitForm.kode}
                  onChange={(e) => setUnitForm({ ...unitForm, kode: e.target.value.toUpperCase() })}
                  disabled={!!editingUnit}
                  placeholder="SK-SEK"
                  maxLength={20}
                />
              </div>
              <div className="space-y-2">
                <Label>Nama Unit *</Label>
                <Input
                  value={unitForm.nama}
                  onChange={(e) => setUnitForm({ ...unitForm, nama: e.target.value })}
                  placeholder="SEKRETARIAT"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Kepala Unit</Label>
              <Input
                value={unitForm.kepalaUnit}
                onChange={(e) => setUnitForm({ ...unitForm, kepalaUnit: e.target.value })}
                placeholder="Nama kepala unit (opsional)"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowUnitForm(false)} disabled={saving} className="rounded-xl">
              Batal
            </Button>
            <Button onClick={saveUnit} disabled={saving} className="bg-gradient-to-r from-[#00BCD4] to-[#006064] hover:from-[#006064] hover:to-[#00BCD4] text-white rounded-xl">
              {saving ? 'Menyimpan...' : 'Simpan'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Fiscal Period Form Dialog */}
      <Dialog open={showPeriodForm} onOpenChange={setShowPeriodForm}>
        <DialogContent className="rounded-2xl">
          <DialogHeader className="border-b border-[#00BCD4]/10 pb-4">
            <DialogTitle className="text-[#006064]">{editingPeriod ? 'Edit Periode Fiskal' : 'Tambah Periode Fiskal'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Tahun *</Label>
                <Input
                  type="number"
                  value={periodForm.year}
                  onChange={(e) => setPeriodForm({ ...periodForm, year: parseInt(e.target.value) })}
                />
              </div>
              <div className="space-y-2">
                <Label>Nama Periode *</Label>
                <Input
                  value={periodForm.name}
                  onChange={(e) => setPeriodForm({ ...periodForm, name: e.target.value })}
                  placeholder="Tahun Anggaran 2026"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Tanggal Mulai *</Label>
                <Input
                  type="date"
                  value={periodForm.startDate}
                  onChange={(e) => setPeriodForm({ ...periodForm, startDate: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Tanggal Akhir *</Label>
                <Input
                  type="date"
                  value={periodForm.endDate}
                  onChange={(e) => setPeriodForm({ ...periodForm, endDate: e.target.value })}
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowPeriodForm(false)} disabled={saving} className="rounded-xl">
              Batal
            </Button>
            <Button onClick={savePeriod} disabled={saving} className="bg-gradient-to-r from-[#00BCD4] to-[#006064] hover:from-[#006064] hover:to-[#00BCD4] text-white rounded-xl">
              {saving ? 'Menyimpan...' : 'Simpan'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Bidang Dialog */}
      <AlertDialog open={deleteBidangDialog.open} onOpenChange={(open) => setDeleteBidangDialog({ open, bidang: null })}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Bidang?</AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin ingin menghapus bidang &quot;{deleteBidangDialog.bidang?.nama}&quot;?
              Bidang yang memiliki unit tidak dapat dihapus.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction onClick={deleteBidang} className="bg-red-600 hover:bg-red-700">
              Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete Unit Dialog */}
      <AlertDialog open={deleteUnitDialog.open} onOpenChange={(open) => setDeleteUnitDialog({ open, unit: null })}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Unit?</AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin ingin menghapus unit &quot;{deleteUnitDialog.unit?.nama}&quot;?
              Unit yang memiliki program tidak dapat dihapus.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction onClick={deleteUnit} className="bg-red-600 hover:bg-red-700">
              Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
