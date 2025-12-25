'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Plus, Trash2, Save, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface LookupItem {
  value: string;
  label: string;
}

interface KodeAkunItem extends LookupItem {
  kategori: string;
  normalBalance: string;
}

interface BidangWithUnits extends LookupItem {
  units: LookupItem[];
}

interface ProgramItem {
  kodeItem: string;
  namaItem: string;
  keterangan: string;
  volume: number;
  satuan: string;
  hargaSatuan: number;
  jumlah: number;
  kodeAkun: string;
}

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

export default function NewProgramPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form data
  const [nama, setNama] = useState('');
  const [jenis, setJenis] = useState<'pendapatan' | 'pengeluaran'>('pengeluaran');
  const [sifat, setSifat] = useState('rutin');
  const [bidangKode, setBidangKode] = useState('');
  const [unitKerjaKode, setUnitKerjaKode] = useState('');
  const [fiscalYear, setFiscalYear] = useState(2026);
  const [deskripsi, setDeskripsi] = useState('');

  // Items
  const [items, setItems] = useState<ProgramItem[]>([]);
  const [newItem, setNewItem] = useState<ProgramItem>({
    kodeItem: '',
    namaItem: '',
    keterangan: '',
    volume: 1,
    satuan: 'unit',
    hargaSatuan: 0,
    jumlah: 0,
    kodeAkun: '',
  });

  // Lookups
  const [bidangOptions, setBidangOptions] = useState<BidangWithUnits[]>([]);
  const [kodeAkunOptions, setKodeAkunOptions] = useState<KodeAkunItem[]>([]);

  useEffect(() => {
    fetchLookups();
  }, []);

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

  const selectedBidang = bidangOptions.find(b => b.value === bidangKode);
  const unitOptions = selectedBidang?.units || [];

  // Auto-generate kode
  const generateKode = () => {
    if (bidangKode && unitKerjaKode) {
      const prefix = jenis === 'pendapatan' ? 'P' : 'K';
      const timestamp = Date.now().toString().slice(-4);
      return `${prefix}-${bidangKode}${unitKerjaKode}-${timestamp}`;
    }
    return '';
  };

  const handleItemChange = (field: keyof ProgramItem, value: string | number) => {
    const updated = { ...newItem, [field]: value };
    if (field === 'volume' || field === 'hargaSatuan') {
      updated.jumlah = Number(updated.volume) * Number(updated.hargaSatuan);
    }
    setNewItem(updated);
  };

  const addItem = () => {
    if (!newItem.namaItem) {
      alert('Nama item harus diisi');
      return;
    }

    const itemCount = items.length + 1;
    const kodeItem = `${bidangKode}${unitKerjaKode}-ITEM-${itemCount.toString().padStart(3, '0')}`;

    setItems([...items, { ...newItem, kodeItem }]);
    setNewItem({
      kodeItem: '',
      namaItem: '',
      keterangan: '',
      volume: 1,
      satuan: 'unit',
      hargaSatuan: 0,
      jumlah: 0,
      kodeAkun: '',
    });
  };

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const totalAnggaran = items.reduce((sum, item) => sum + item.jumlah, 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!nama || !bidangKode || !unitKerjaKode) {
      setError('Nama program, bidang, dan unit harus diisi');
      return;
    }

    try {
      setLoading(true);
      const kode = generateKode();

      const response = await fetch('/api/keuangan/programs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          kode,
          nama,
          jenis,
          sifat,
          bidangKode,
          unitKerjaKode,
          fiscalYear,
          deskripsi: deskripsi || null,
          items: items.map(item => ({
            kodeItem: item.kodeItem,
            namaItem: item.namaItem,
            keterangan: item.keterangan || null,
            volume: item.volume,
            satuan: item.satuan,
            hargaSatuan: item.hargaSatuan,
            kodeAkun: item.kodeAkun || null,
          })),
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Gagal menyimpan program');
      }

      router.push('/program');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Terjadi kesalahan');
    } finally {
      setLoading(false);
    }
  };

  // Filter accounts based on jenis
  const filteredAccounts = kodeAkunOptions.filter(acc => {
    if (jenis === 'pengeluaran') {
      return acc.kategori === 'beban' || acc.kategori === 'aset';
    }
    return acc.kategori === 'pendapatan' || acc.kategori === 'aset';
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="relative overflow-hidden bg-gradient-to-r from-white via-[#B2EBF2]/20 to-[#80DEEA]/20 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 py-6 rounded-b-3xl border-b border-[#00BCD4]/10">
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-gradient-to-br from-[#00BCD4]/20 to-[#80DEEA]/20 rounded-full blur-3xl" />
        <div className="relative flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild className="hover:bg-[#00BCD4]/10 rounded-xl">
            <Link href="/program">
              <ArrowLeft className="h-5 w-5 text-[#006064]" />
            </Link>
          </Button>
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-1 h-8 bg-gradient-to-b from-[#00BCD4] to-[#006064] rounded-full" />
              <h1 className="text-3xl font-bold text-[#006064]">Tambah Program Baru</h1>
            </div>
            <p className="text-sm text-gray-600 ml-4">Buat program kerja baru dengan rincian item</p>
          </div>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <Card className="border-2 border-red-200 bg-red-50 rounded-2xl">
          <CardContent className="pt-4">
            <div className="flex items-center gap-2 text-red-600">
              <div className="p-2 rounded-lg bg-red-100">
                <AlertCircle className="h-5 w-5" />
              </div>
              <span>{error}</span>
            </div>
          </CardContent>
        </Card>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Informasi Program */}
        <Card className="border-2 border-gray-100 rounded-2xl hover:shadow-lg hover:border-[#00BCD4]/40 transition-all duration-300">
          <CardHeader className="bg-gradient-to-r from-[#B2EBF2]/20 to-transparent border-b border-[#00BCD4]/10">
            <CardTitle className="text-lg flex items-center gap-2">
              <div className="p-2 rounded-lg bg-[#B2EBF2]">
                <FileText className="h-5 w-5 text-[#006064]" />
              </div>
              <span className="text-[#006064]">Informasi Program</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Row 1: Nama + Jenis */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
              <div className="md:col-span-8 space-y-2">
                <Label htmlFor="nama">Nama Program *</Label>
                <Input
                  id="nama"
                  value={nama}
                  onChange={(e) => setNama(e.target.value)}
                  placeholder="Contoh: Pengadaan ATK Kantor"
                  className="border-2 focus:border-[#00BCD4] rounded-xl"
                  required
                />
              </div>
              <div className="md:col-span-4 space-y-2">
                <Label>Jenis Program *</Label>
                <div className="flex gap-4 h-10 items-center">
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name="jenis"
                      checked={jenis === 'pengeluaran'}
                      onChange={() => setJenis('pengeluaran')}
                      className="mr-2"
                    />
                    <span className="text-sm">Pengeluaran</span>
                  </label>
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name="jenis"
                      checked={jenis === 'pendapatan'}
                      onChange={() => setJenis('pendapatan')}
                      className="mr-2"
                    />
                    <span className="text-sm">Pendapatan</span>
                  </label>
                </div>
              </div>
            </div>

            {/* Row 2: Bidang + Unit */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Bidang *</Label>
                <Select value={bidangKode} onValueChange={(v) => { setBidangKode(v); setUnitKerjaKode(''); }}>
                  <SelectTrigger className="border-2 focus:border-[#00BCD4] rounded-xl">
                    <SelectValue placeholder="Pilih Bidang" />
                  </SelectTrigger>
                  <SelectContent>
                    {bidangOptions.map((b) => (
                      <SelectItem key={b.value} value={b.value}>
                        {b.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Unit Kerja *</Label>
                <Select value={unitKerjaKode} onValueChange={setUnitKerjaKode} disabled={!bidangKode}>
                  <SelectTrigger className="border-2 focus:border-[#00BCD4] rounded-xl">
                    <SelectValue placeholder="Pilih Unit" />
                  </SelectTrigger>
                  <SelectContent>
                    {unitOptions.map((u) => (
                      <SelectItem key={u.value} value={u.value}>
                        {u.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Row 3: Tahun + Sifat */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Tahun Anggaran</Label>
                <Input
                  type="number"
                  value={fiscalYear}
                  onChange={(e) => setFiscalYear(parseInt(e.target.value))}
                  className="border-2 focus:border-[#00BCD4] rounded-xl"
                />
              </div>
              <div className="space-y-2">
                <Label>Sifat Program</Label>
                <Select value={sifat} onValueChange={setSifat}>
                  <SelectTrigger className="border-2 focus:border-[#00BCD4] rounded-xl">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="rutin">Rutin</SelectItem>
                    <SelectItem value="proyek">Proyek</SelectItem>
                    <SelectItem value="insidentil">Insidentil</SelectItem>
                    <SelectItem value="event">Event</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Row 4: Deskripsi */}
            <div className="space-y-2">
              <Label>Deskripsi</Label>
              <Textarea
                value={deskripsi}
                onChange={(e) => setDeskripsi(e.target.value)}
                placeholder="Deskripsi program (opsional)"
                className="border-2 focus:border-[#00BCD4] rounded-xl"
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        {/* Ringkasan Anggaran */}
        <Card className="border-2 border-gray-100 rounded-2xl hover:shadow-lg hover:border-[#00BCD4]/40 transition-all duration-300">
          <CardHeader className="bg-gradient-to-r from-[#B2EBF2]/20 to-transparent border-b border-[#00BCD4]/10">
            <CardTitle className="text-lg text-[#006064]">Ringkasan Anggaran</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600">Jumlah Item</p>
                <p className="text-2xl font-bold text-blue-900">{items.length}</p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600">Total Anggaran</p>
                <p className="text-2xl font-bold text-green-900">{formatCurrency(totalAnggaran)}</p>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600">Kode Program</p>
                <p className="text-lg font-mono font-bold text-purple-900">
                  {generateKode() || '(otomatis)'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Rincian Item */}
        <Card className="border-2 border-gray-100 rounded-2xl hover:shadow-lg hover:border-[#00BCD4]/40 transition-all duration-300">
          <CardHeader className="bg-gradient-to-r from-[#B2EBF2]/20 to-transparent border-b border-[#00BCD4]/10">
            <CardTitle className="text-lg text-[#006064]">Rincian Item Program (RAB)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Input New Item */}
            <div className="grid grid-cols-12 gap-2 items-end p-4 bg-gray-50 rounded-lg">
              <div className="col-span-3">
                <Label className="text-xs">Nama Item</Label>
                <Input
                  value={newItem.namaItem}
                  onChange={(e) => handleItemChange('namaItem', e.target.value)}
                  placeholder="Contoh: ATK Kantor"
                  className="border-2 focus:border-[#00BCD4] rounded-xl"
                />
              </div>
              <div className="col-span-1">
                <Label className="text-xs">Volume</Label>
                <Input
                  type="number"
                  min={1}
                  value={newItem.volume}
                  onChange={(e) => handleItemChange('volume', parseFloat(e.target.value) || 1)}
                  className="border-2 focus:border-[#00BCD4] rounded-xl"
                />
              </div>
              <div className="col-span-1">
                <Label className="text-xs">Satuan</Label>
                <Input
                  value={newItem.satuan}
                  onChange={(e) => handleItemChange('satuan', e.target.value)}
                  placeholder="unit"
                  className="border-2 focus:border-[#00BCD4] rounded-xl"
                />
              </div>
              <div className="col-span-2">
                <Label className="text-xs">Harga Satuan</Label>
                <Input
                  type="number"
                  min={0}
                  value={newItem.hargaSatuan}
                  onChange={(e) => handleItemChange('hargaSatuan', parseFloat(e.target.value) || 0)}
                  className="border-2 focus:border-[#00BCD4] rounded-xl"
                />
              </div>
              <div className="col-span-2">
                <Label className="text-xs">Jumlah</Label>
                <Input
                  type="text"
                  value={formatCurrency(newItem.jumlah)}
                  disabled
                  className="bg-gray-100"
                />
              </div>
              <div className="col-span-2">
                <Label className="text-xs">Kode Akun</Label>
                <Select
                  value={newItem.kodeAkun}
                  onValueChange={(v) => handleItemChange('kodeAkun', v)}
                >
                  <SelectTrigger className="border-2 focus:border-[#00BCD4] rounded-xl">
                    <SelectValue placeholder="Pilih" />
                  </SelectTrigger>
                  <SelectContent>
                    {filteredAccounts.map((acc) => (
                      <SelectItem key={acc.value} value={acc.value}>
                        {acc.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="col-span-1">
                <Button type="button" onClick={addItem} size="sm" className="w-full bg-gradient-to-r from-[#00BCD4] to-[#006064] hover:from-[#006064] hover:to-[#00BCD4] text-white shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Items Table */}
            {items.length > 0 && (
              <div className="border-2 border-gray-100 rounded-xl overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-gradient-to-r from-[#00BCD4]/10 to-[#80DEEA]/10 border-b">
                    <tr>
                      <th className="text-left py-2 px-3 font-bold text-[#006064]">Nama Item</th>
                      <th className="text-center py-2 px-3 font-bold text-[#006064]">Volume</th>
                      <th className="text-center py-2 px-3 font-bold text-[#006064]">Satuan</th>
                      <th className="text-right py-2 px-3 font-bold text-[#006064]">Harga Satuan</th>
                      <th className="text-right py-2 px-3 font-bold text-[#006064]">Jumlah</th>
                      <th className="text-left py-2 px-3 font-bold text-[#006064]">Akun</th>
                      <th className="text-center py-2 px-3 font-bold text-[#006064] w-12">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {items.map((item, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="py-2 px-3">{item.namaItem}</td>
                        <td className="py-2 px-3 text-center">{item.volume}</td>
                        <td className="py-2 px-3 text-center">{item.satuan}</td>
                        <td className="py-2 px-3 text-right tabular-nums">
                          {formatCurrency(item.hargaSatuan)}
                        </td>
                        <td className="py-2 px-3 text-right tabular-nums font-medium">
                          {formatCurrency(item.jumlah)}
                        </td>
                        <td className="py-2 px-3 text-xs text-gray-600">{item.kodeAkun}</td>
                        <td className="py-2 px-3 text-center">
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => removeItem(index)}
                            className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                    <tr className="bg-gray-100 font-bold">
                      <td colSpan={4} className="py-2 px-3 text-right">Total Anggaran:</td>
                      <td className="py-2 px-3 text-right tabular-nums">{formatCurrency(totalAnggaran)}</td>
                      <td colSpan={2}></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}

            {items.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <p>Belum ada item. Tambahkan item di form di atas.</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Form Actions */}
        <div className="flex justify-end gap-3">
          <Button type="button" variant="outline" asChild>
            <Link href="/program">Batal</Link>
          </Button>
          <Button type="submit" disabled={loading} className="bg-gradient-to-r from-[#00BCD4] to-[#006064] hover:from-[#006064] hover:to-[#00BCD4] text-white shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl">
            {loading ? (
              <>
                <div className="relative mr-2">
                  <div className="absolute inset-0 bg-white/20 rounded-full blur-sm animate-pulse" />
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white relative"></div>
                </div>
              </>
            ) : (
              <Save className="h-4 w-4 mr-2" />
            )}
            Simpan Program
          </Button>
        </div>
      </form>
    </div>
  );
}
