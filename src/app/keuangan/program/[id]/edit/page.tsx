'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useParams } from 'next/navigation';
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
  id?: string;
  kodeItem: string;
  namaItem: string;
  keterangan: string;
  volume: number;
  satuan: string;
  hargaSatuan: number;
  jumlah: number;
  realisasi?: number;
  kodeAkun: string;
}

interface ProgramData {
  id: string;
  kode: string;
  nama: string;
  jenis: 'pendapatan' | 'pengeluaran';
  sifat: string;
  status: string;
  fiscalYear: number;
  deskripsi: string | null;
  bidang: { kode: string; nama: string };
  unit: { kode: string; nama: string };
  items: Array<{
    id: string;
    kodeItem: string;
    namaItem: string;
    keterangan: string | null;
    volume: number;
    satuan: string;
    hargaSatuan: number;
    jumlah: number;
    realisasi: number;
    kodeAkun: { kode: string; nama: string } | null;
  }>;
}

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

export default function EditProgramPage() {
  const router = useRouter();
  const params = useParams();
  const programId = params.id as string;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form data
  const [kode, setKode] = useState('');
  const [nama, setNama] = useState('');
  const [jenis, setJenis] = useState<'pendapatan' | 'pengeluaran'>('pengeluaran');
  const [sifat, setSifat] = useState('rutin');
  const [status, setStatus] = useState('draft');
  const [bidangKode, setBidangKode] = useState('');
  const [unitKerjaKode, setUnitKerjaKode] = useState('');
  const [fiscalYear, setFiscalYear] = useState(2026);
  const [deskripsi, setDeskripsi] = useState('');

  // Items (read-only for edit, item management is separate)
  const [items, setItems] = useState<ProgramItem[]>([]);

  // Lookups
  const [bidangOptions, setBidangOptions] = useState<BidangWithUnits[]>([]);
  const [kodeAkunOptions, setKodeAkunOptions] = useState<KodeAkunItem[]>([]);

  useEffect(() => {
    fetchLookups();
    if (programId) {
      fetchProgram();
    }
  }, [programId]);

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

  const fetchProgram = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/keuangan/programs/${programId}`);
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Program tidak ditemukan');
      }

      const program: ProgramData = result.data;
      setKode(program.kode);
      setNama(program.nama);
      setJenis(program.jenis);
      setSifat(program.sifat);
      setStatus(program.status);
      setBidangKode(program.bidang.kode);
      setUnitKerjaKode(program.unit.kode);
      setFiscalYear(program.fiscalYear);
      setDeskripsi(program.deskripsi || '');
      setItems(program.items.map(item => ({
        id: item.id,
        kodeItem: item.kodeItem,
        namaItem: item.namaItem,
        keterangan: item.keterangan || '',
        volume: item.volume,
        satuan: item.satuan,
        hargaSatuan: item.hargaSatuan,
        jumlah: item.jumlah,
        realisasi: item.realisasi,
        kodeAkun: item.kodeAkun?.kode || '',
      })));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Terjadi kesalahan');
    } finally {
      setLoading(false);
    }
  };

  const selectedBidang = bidangOptions.find(b => b.value === bidangKode);
  const unitOptions = selectedBidang?.units || [];

  const totalAnggaran = items.reduce((sum, item) => sum + item.jumlah, 0);
  const totalRealisasi = items.reduce((sum, item) => sum + (item.realisasi || 0), 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!nama || !bidangKode || !unitKerjaKode) {
      setError('Nama program, bidang, dan unit harus diisi');
      return;
    }

    try {
      setSaving(true);

      const response = await fetch(`/api/keuangan/programs/${programId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nama,
          jenis,
          sifat,
          status,
          bidangKode,
          unitKerjaKode,
          deskripsi: deskripsi || null,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Gagal menyimpan program');
      }

      router.push(`/program/${programId}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Terjadi kesalahan');
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
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href={`/program/${programId}`}>
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-[#006064]">Edit Program</h1>
          <p className="text-sm text-gray-500 font-mono">{kode}</p>
        </div>
      </div>

      {/* Error Alert */}
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

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Informasi Program */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Informasi Program</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Kode (read-only) */}
            <div className="space-y-2">
              <Label>Kode Program</Label>
              <Input value={kode} disabled className="bg-gray-100 font-mono" />
            </div>

            {/* Row 1: Nama + Jenis */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
              <div className="md:col-span-8 space-y-2">
                <Label htmlFor="nama">Nama Program *</Label>
                <Input
                  id="nama"
                  value={nama}
                  onChange={(e) => setNama(e.target.value)}
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
                  <SelectTrigger>
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
                  <SelectTrigger>
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

            {/* Row 3: Sifat + Status */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Sifat Program</Label>
                <Select value={sifat} onValueChange={setSifat}>
                  <SelectTrigger>
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
              <div className="space-y-2">
                <Label>Status</Label>
                <Select value={status} onValueChange={setStatus}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="aktif">Aktif</SelectItem>
                    <SelectItem value="selesai">Selesai</SelectItem>
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
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        {/* Ringkasan Anggaran */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Ringkasan Anggaran</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600">Jumlah Item</p>
                <p className="text-2xl font-bold text-blue-900">{items.length}</p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600">Total Anggaran</p>
                <p className="text-2xl font-bold text-green-900">{formatCurrency(totalAnggaran)}</p>
              </div>
              <div className="bg-orange-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600">Total Realisasi</p>
                <p className="text-2xl font-bold text-orange-900">{formatCurrency(totalRealisasi)}</p>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600">Tahun Fiskal</p>
                <p className="text-2xl font-bold text-purple-900">{fiscalYear}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Existing Items (Read-Only) */}
        {items.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Rincian Item Program</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="border rounded-lg overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="text-left py-2 px-3 font-medium">Kode</th>
                      <th className="text-left py-2 px-3 font-medium">Nama Item</th>
                      <th className="text-center py-2 px-3 font-medium">Volume</th>
                      <th className="text-right py-2 px-3 font-medium">Harga</th>
                      <th className="text-right py-2 px-3 font-medium">Jumlah</th>
                      <th className="text-right py-2 px-3 font-medium">Realisasi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {items.map((item, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="py-2 px-3 font-mono text-xs">{item.kodeItem}</td>
                        <td className="py-2 px-3">{item.namaItem}</td>
                        <td className="py-2 px-3 text-center">{item.volume} {item.satuan}</td>
                        <td className="py-2 px-3 text-right tabular-nums">
                          {formatCurrency(item.hargaSatuan)}
                        </td>
                        <td className="py-2 px-3 text-right tabular-nums font-medium">
                          {formatCurrency(item.jumlah)}
                        </td>
                        <td className="py-2 px-3 text-right tabular-nums">
                          {formatCurrency(item.realisasi || 0)}
                        </td>
                      </tr>
                    ))}
                    <tr className="bg-gray-100 font-bold">
                      <td colSpan={4} className="py-2 px-3 text-right">Total:</td>
                      <td className="py-2 px-3 text-right tabular-nums">{formatCurrency(totalAnggaran)}</td>
                      <td className="py-2 px-3 text-right tabular-nums">{formatCurrency(totalRealisasi)}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p className="text-sm text-gray-500 mt-2">
                * Untuk mengedit item, gunakan fitur pengelolaan item terpisah
              </p>
            </CardContent>
          </Card>
        )}

        {/* Form Actions */}
        <div className="flex justify-end gap-3">
          <Button type="button" variant="outline" asChild>
            <Link href={`/program/${programId}`}>Batal</Link>
          </Button>
          <Button type="submit" disabled={saving} className="bg-[#00BCD4] hover:bg-[#006064]">
            {saving ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
            ) : (
              <Save className="h-4 w-4 mr-2" />
            )}
            Simpan Perubahan
          </Button>
        </div>
      </form>
    </div>
  );
}
