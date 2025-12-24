'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Plus, Search, Filter, Pencil, Trash2, RotateCcw } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
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
  DialogFooter,
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

interface Account {
  kode: string;
  nama: string;
  kategori: string;
  subKategori: string | null;
  normalBalance: string;
  isContraAccount: boolean;
  isRestricted: boolean;
  restrictionType: string | null;
  deskripsi: string | null;
  isActive: boolean;
}

const kategoriOptions = [
  { value: 'aset', label: 'Aset' },
  { value: 'kewajiban', label: 'Kewajiban' },
  { value: 'aset_bersih', label: 'Aset Bersih' },
  { value: 'pendapatan', label: 'Pendapatan' },
  { value: 'beban', label: 'Beban' },
];

const normalBalanceOptions = [
  { value: 'debit', label: 'Debit' },
  { value: 'credit', label: 'Kredit' },
];

const restrictionTypeOptions = [
  { value: 'temporary', label: 'Temporer' },
  { value: 'permanent', label: 'Permanen' },
];

export default function PengaturanAkunPage() {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState('');
  const [kategoriFilter, setKategoriFilter] = useState('all');
  const [normalBalanceFilter, setNormalBalanceFilter] = useState('all');
  const [includeInactive, setIncludeInactive] = useState(false);

  // Modal states
  const [showForm, setShowForm] = useState(false);
  const [editingAccount, setEditingAccount] = useState<Account | null>(null);
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; account: Account | null }>({
    open: false,
    account: null,
  });

  // Form data
  const [formData, setFormData] = useState<Partial<Account>>({
    kode: '',
    nama: '',
    kategori: 'aset',
    subKategori: '',
    normalBalance: 'debit',
    isContraAccount: false,
    isRestricted: false,
    restrictionType: null,
    deskripsi: '',
    isActive: true,
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchAccounts();
  }, [search, kategoriFilter, normalBalanceFilter, includeInactive]);

  const fetchAccounts = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (kategoriFilter !== 'all') params.append('kategori', kategoriFilter);
      if (normalBalanceFilter !== 'all') params.append('normalBalance', normalBalanceFilter);
      if (includeInactive) params.append('includeInactive', 'true');

      const response = await fetch(`/api/keuangan/akun?${params}`);
      const result = await response.json();

      if (result.data) {
        setAccounts(result.data);
      }
    } catch (error) {
      console.error('Error fetching accounts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleNew = () => {
    setEditingAccount(null);
    setFormData({
      kode: '',
      nama: '',
      kategori: 'aset',
      subKategori: '',
      normalBalance: 'debit',
      isContraAccount: false,
      isRestricted: false,
      restrictionType: null,
      deskripsi: '',
      isActive: true,
    });
    setShowForm(true);
  };

  const handleEdit = (account: Account) => {
    setEditingAccount(account);
    setFormData({
      kode: account.kode,
      nama: account.nama,
      kategori: account.kategori,
      subKategori: account.subKategori || '',
      normalBalance: account.normalBalance,
      isContraAccount: account.isContraAccount,
      isRestricted: account.isRestricted,
      restrictionType: account.restrictionType,
      deskripsi: account.deskripsi || '',
      isActive: account.isActive,
    });
    setShowForm(true);
  };

  const handleSubmit = async () => {
    if (!formData.kode || !formData.nama || !formData.kategori || !formData.normalBalance) {
      alert('Kode, nama, kategori, dan normal balance wajib diisi');
      return;
    }

    setSaving(true);
    try {
      const url = editingAccount
        ? `/api/keuangan/akun/${editingAccount.kode}`
        : '/api/keuangan/akun';
      const method = editingAccount ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Gagal menyimpan akun');
      }

      setShowForm(false);
      fetchAccounts();
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Gagal menyimpan akun');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteDialog.account) return;

    try {
      const response = await fetch(`/api/keuangan/akun/${deleteDialog.account.kode}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.error || 'Gagal menghapus akun');
      }

      setDeleteDialog({ open: false, account: null });
      fetchAccounts();
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Gagal menghapus akun');
    }
  };

  const handleRestore = async (account: Account) => {
    try {
      const response = await fetch(`/api/keuangan/akun/${account.kode}`, {
        method: 'PATCH',
      });

      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.error || 'Gagal mengaktifkan akun');
      }

      fetchAccounts();
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Gagal mengaktifkan akun');
    }
  };

  const resetFilters = () => {
    setSearch('');
    setKategoriFilter('all');
    setNormalBalanceFilter('all');
    setIncludeInactive(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/pengaturan">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-[#006064]">Chart of Accounts</h1>
            <p className="text-sm text-gray-600 mt-1">Kelola kode akun keuangan yayasan</p>
          </div>
        </div>
        <Button onClick={handleNew} className="bg-[#00BCD4] hover:bg-[#006064]">
          <Plus className="h-4 w-4 mr-2" />
          Tambah Akun
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Filter className="h-5 w-5 text-[#00BCD4]" />
            Filter
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Cari kode/nama..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={kategoriFilter} onValueChange={setKategoriFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Semua Kategori" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Kategori</SelectItem>
                {kategoriOptions.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={normalBalanceFilter} onValueChange={setNormalBalanceFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Semua Balance" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Balance</SelectItem>
                {normalBalanceOptions.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <Checkbox
                  checked={includeInactive}
                  onCheckedChange={(checked) => setIncludeInactive(checked === true)}
                />
                <span className="text-sm">Tampilkan nonaktif</span>
              </label>
              <Button variant="outline" size="sm" onClick={resetFilters}>
                Reset
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#00BCD4]"></div>
            </div>
          ) : accounts.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              Tidak ada data akun ditemukan
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase">Kode</th>
                    <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase">Nama Akun</th>
                    <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase">Kategori</th>
                    <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase">Balance</th>
                    <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase">Status</th>
                    <th className="text-right py-3 px-4 text-xs font-medium text-gray-500 uppercase">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {accounts.map((account) => (
                    <tr
                      key={account.kode}
                      className={`hover:bg-gray-50 ${!account.isActive ? 'bg-gray-100 opacity-60' : ''}`}
                    >
                      <td className="py-3 px-4 font-mono text-sm font-medium">{account.kode}</td>
                      <td className="py-3 px-4 text-sm">
                        {account.nama}
                        {account.isContraAccount && (
                          <Badge variant="outline" className="ml-2 text-xs">Contra</Badge>
                        )}
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-600">
                        <span className="capitalize">{account.kategori.replace('_', ' ')}</span>
                        {account.subKategori && (
                          <span className="text-gray-400 ml-1">/ {account.subKategori}</span>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        <Badge
                          className={
                            account.normalBalance === 'debit'
                              ? 'bg-green-100 text-green-700'
                              : 'bg-red-100 text-red-700'
                          }
                        >
                          {account.normalBalance === 'debit' ? 'Debit' : 'Kredit'}
                        </Badge>
                      </td>
                      <td className="py-3 px-4">
                        <Badge
                          className={
                            account.isActive
                              ? 'bg-green-100 text-green-700'
                              : 'bg-gray-100 text-gray-700'
                          }
                        >
                          {account.isActive ? 'Aktif' : 'Nonaktif'}
                        </Badge>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEdit(account)}
                            className="h-8 w-8"
                          >
                            <Pencil className="h-4 w-4 text-blue-600" />
                          </Button>
                          {account.isActive ? (
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => setDeleteDialog({ open: true, account })}
                              className="h-8 w-8"
                            >
                              <Trash2 className="h-4 w-4 text-red-600" />
                            </Button>
                          ) : (
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleRestore(account)}
                              className="h-8 w-8"
                            >
                              <RotateCcw className="h-4 w-4 text-green-600" />
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          <div className="px-4 py-3 bg-gray-50 border-t text-sm text-gray-600">
            Menampilkan {accounts.length} akun
          </div>
        </CardContent>
      </Card>

      {/* Form Dialog */}
      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingAccount ? 'Edit Akun' : 'Tambah Akun Baru'}
            </DialogTitle>
            <DialogDescription>
              {editingAccount ? 'Perbarui informasi akun' : 'Masukkan informasi akun baru'}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Kode Akun *</Label>
                <Input
                  value={formData.kode || ''}
                  onChange={(e) => setFormData({ ...formData, kode: e.target.value })}
                  disabled={!!editingAccount}
                  placeholder="Contoh: 11101"
                />
              </div>
              <div className="space-y-2">
                <Label>Nama Akun *</Label>
                <Input
                  value={formData.nama || ''}
                  onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
                  placeholder="Contoh: Kas Yayasan"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Kategori *</Label>
                <Select
                  value={formData.kategori || 'aset'}
                  onValueChange={(v) => setFormData({ ...formData, kategori: v })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {kategoriOptions.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Sub Kategori</Label>
                <Input
                  value={formData.subKategori || ''}
                  onChange={(e) => setFormData({ ...formData, subKategori: e.target.value })}
                  placeholder="Opsional"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Normal Balance *</Label>
                <Select
                  value={formData.normalBalance || 'debit'}
                  onValueChange={(v) => setFormData({ ...formData, normalBalance: v })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {normalBalanceOptions.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Deskripsi</Label>
                <Input
                  value={formData.deskripsi || ''}
                  onChange={(e) => setFormData({ ...formData, deskripsi: e.target.value })}
                  placeholder="Keterangan tambahan"
                />
              </div>
            </div>

            <div className="flex flex-wrap gap-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <Checkbox
                  checked={formData.isContraAccount || false}
                  onCheckedChange={(checked) => setFormData({ ...formData, isContraAccount: checked === true })}
                />
                <span className="text-sm">Contra Account</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <Checkbox
                  checked={formData.isRestricted || false}
                  onCheckedChange={(checked) => setFormData({ ...formData, isRestricted: checked === true })}
                />
                <span className="text-sm">Terbatas</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <Checkbox
                  checked={formData.isActive !== false}
                  onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked === true })}
                />
                <span className="text-sm">Aktif</span>
              </label>
            </div>

            {formData.isRestricted && (
              <div className="space-y-2">
                <Label>Tipe Pembatasan</Label>
                <Select
                  value={formData.restrictionType || 'temporary'}
                  onValueChange={(v) => setFormData({ ...formData, restrictionType: v })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {restrictionTypeOptions.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowForm(false)} disabled={saving}>
              Batal
            </Button>
            <Button onClick={handleSubmit} disabled={saving} className="bg-[#00BCD4] hover:bg-[#006064]">
              {saving ? 'Menyimpan...' : 'Simpan'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialog.open} onOpenChange={(open) => setDeleteDialog({ open, account: null })}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Nonaktifkan Akun?</AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin ingin menonaktifkan akun &quot;{deleteDialog.account?.kode} - {deleteDialog.account?.nama}&quot;?
              Akun yang sudah digunakan tidak dapat dihapus permanen.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
              Nonaktifkan
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
