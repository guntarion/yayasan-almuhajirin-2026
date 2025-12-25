'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Save, Loader2, AlertCircle, Info, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Progress } from '@/components/ui/progress';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { formatCurrency } from '@/utils/keuangan';

interface LookupItem {
  value: string;
  label: string;
}

interface BidangWithUnits extends LookupItem {
  units: LookupItem[];
}

interface ProgramItem {
  id: string;
  programId: string;
  programKode: string;
  programNama: string;
  programJenis: 'pendapatan' | 'pengeluaran';
  kodeItem: string;
  namaItem: string;
  keterangan: string | null;
  volume: number;
  satuan: string;
  hargaSatuan: number;
  jumlah: number;
  realisasi: number;
  sisaAnggaran: number;
  progress: number;
  kodeAkun: string;
  akun: {
    kode: string;
    nama: string;
    kategori: string;
    normalBalance: string;
  } | null;
  bidang: string;
  unit: string;
}

const paymentMethodOptions = [
  { value: 'cash', label: 'Kas/Tunai' },
  { value: 'bank', label: 'Bank Transfer' },
  { value: 'transfer', label: 'Transfer Digital' },
];

const transactionTypeOptions = [
  { value: 'income', label: 'Pendapatan (Kas Masuk)' },
  { value: 'expense', label: 'Pengeluaran (Kas Keluar)' },
];

const formatDisplayAmount = (value: string, inThousands: boolean): string => {
  if (!value) return '';
  const num = parseFloat(value);
  if (isNaN(num)) return value;

  const displayValue = inThousands ? num * 1000 : num;
  return new Intl.NumberFormat('id-ID').format(displayValue);
};

export default function InputTransaksiPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedBidang, setSelectedBidang] = useState('');
  const [inThousands, setInThousands] = useState(false);
  const [bidangOptions, setBidangOptions] = useState<BidangWithUnits[]>([]);
  const [programItems, setProgramItems] = useState<ProgramItem[]>([]);
  const [loadingItems, setLoadingItems] = useState(false);
  const [selectedProgramItem, setSelectedProgramItem] = useState<ProgramItem | null>(null);

  const [formData, setFormData] = useState({
    transactionDate: new Date().toISOString().split('T')[0],
    type: '',
    bidang: '',
    unit: '',
    programItemId: '',
    amount: '',
    description: '',
    paymentMethod: 'bank',
    entityName: '',
    notes: '',
  });

  useEffect(() => {
    fetchLookups();
  }, []);

  // Fetch program items when unit is selected
  useEffect(() => {
    if (formData.unit && formData.type) {
      fetchProgramItems();
    } else {
      setProgramItems([]);
      setSelectedProgramItem(null);
      setFormData(prev => ({ ...prev, programItemId: '' }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData.unit, formData.type]);

  const fetchLookups = async () => {
    try {
      const response = await fetch('/api/keuangan/lookups');
      const result = await response.json();
      if (result.bidang) {
        setBidangOptions(result.bidang);
      }
    } catch (err) {
      console.error('Error fetching lookups:', err);
    }
  };

  const fetchProgramItems = async () => {
    if (!formData.unit) return;

    try {
      setLoadingItems(true);
      const jenis = formData.type === 'income' ? 'pendapatan' : 'pengeluaran';
      const params = new URLSearchParams({
        unitKerjaKode: formData.unit,
        jenis,
      });

      const response = await fetch(`/api/keuangan/program-items?${params}`);
      const result = await response.json();

      if (result.data) {
        setProgramItems(result.data);
      }
    } catch (err) {
      console.error('Error fetching program items:', err);
    } finally {
      setLoadingItems(false);
    }
  };

  const handleProgramItemSelect = (itemId: string) => {
    const item = programItems.find(i => i.id === itemId);
    setSelectedProgramItem(item || null);
    setFormData(prev => ({ ...prev, programItemId: itemId }));

    // Auto-fill description if empty
    if (item && !formData.description) {
      setFormData(prev => ({ ...prev, description: item.namaItem }));
    }
  };

  const selectedBidangData = bidangOptions.find(b => b.value === selectedBidang);
  const unitOptions = selectedBidangData?.units || [];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!formData.type || !formData.amount || !formData.description) {
      setError('Jenis transaksi, jumlah, dan deskripsi harus diisi');
      return;
    }

    try {
      setIsLoading(true);

      // Calculate actual amount (multiply by 1000 if in thousands mode)
      const actualAmount = inThousands
        ? parseFloat(formData.amount) * 1000
        : parseFloat(formData.amount);

      const response = await fetch('/api/keuangan/transaksi', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          transactionDate: formData.transactionDate,
          type: formData.type,
          amount: actualAmount,
          description: formData.description,
          bidangKode: selectedBidang || null,
          unitKerjaKode: formData.unit || null,
          paymentMethod: formData.paymentMethod,
          entityName: formData.entityName || null,
          notes: formData.notes || null,
          programItemId: formData.programItemId || null,
          // Account codes will be auto-determined by API based on programItem or defaults
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Gagal menyimpan transaksi');
      }

      router.push('/transaksi');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Terjadi kesalahan');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="relative overflow-hidden bg-gradient-to-r from-white via-[#B2EBF2]/20 to-[#80DEEA]/20 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 py-6 rounded-b-3xl border-b border-[#00BCD4]/10">
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-gradient-to-br from-[#00BCD4]/20 to-[#80DEEA]/20 rounded-full blur-3xl" />
        <div className="relative flex items-center gap-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.back()}
            className="rounded-xl border-2 hover:border-[#00BCD4] transition-all duration-300"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Kembali
          </Button>
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-1 h-8 bg-gradient-to-b from-[#00BCD4] to-[#006064] rounded-full" />
              <h1 className="text-3xl font-bold text-[#006064]">Input Transaksi</h1>
            </div>
            <p className="text-sm text-gray-600 ml-4">Catat transaksi baru</p>
          </div>
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

      {/* Form */}
      <Card className="border-2 border-gray-100 rounded-2xl hover:shadow-lg hover:border-[#00BCD4]/40 transition-all duration-300">
        <CardHeader className="bg-gradient-to-r from-[#B2EBF2]/20 to-transparent border-b border-[#00BCD4]/10">
          <CardTitle className="text-lg text-[#006064] flex items-center gap-2">
            <div className="p-2 rounded-lg bg-[#B2EBF2]">
              <Save className="h-5 w-5 text-[#006064]" />
            </div>
            <span>Form Transaksi</span>
          </CardTitle>
          <CardDescription>
            Isi data transaksi dengan lengkap. Jurnal akan dibuat secara otomatis.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Tanggal */}
              <div className="space-y-2">
                <Label htmlFor="transactionDate">Tanggal Transaksi</Label>
                <Input
                  id="transactionDate"
                  type="date"
                  value={formData.transactionDate}
                  onChange={(e) =>
                    setFormData({ ...formData, transactionDate: e.target.value })
                  }
                  className="border-2 focus:border-[#00BCD4] rounded-xl"
                  required
                />
              </div>

              {/* Jenis Transaksi */}
              <div className="space-y-2">
                <Label htmlFor="type">Jenis Transaksi *</Label>
                <Select
                  value={formData.type}
                  onValueChange={(value) => setFormData({ ...formData, type: value })}
                >
                  <SelectTrigger className="border-2 focus:border-[#00BCD4] rounded-xl">
                    <SelectValue placeholder="Pilih jenis transaksi" />
                  </SelectTrigger>
                  <SelectContent>
                    {transactionTypeOptions.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Bidang */}
              <div className="space-y-2">
                <Label htmlFor="bidang">Bidang</Label>
                <Select
                  value={selectedBidang}
                  onValueChange={(value) => {
                    setSelectedBidang(value);
                    setFormData({ ...formData, bidang: value, unit: '' });
                  }}
                >
                  <SelectTrigger className="border-2 focus:border-[#00BCD4] rounded-xl">
                    <SelectValue placeholder="Pilih bidang" />
                  </SelectTrigger>
                  <SelectContent>
                    {bidangOptions.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Unit */}
              <div className="space-y-2">
                <Label htmlFor="unit">Unit</Label>
                <Select
                  value={formData.unit}
                  onValueChange={(value) => setFormData({ ...formData, unit: value })}
                  disabled={!selectedBidang}
                >
                  <SelectTrigger className="border-2 focus:border-[#00BCD4] rounded-xl">
                    <SelectValue placeholder="Pilih unit" />
                  </SelectTrigger>
                  <SelectContent>
                    {unitOptions.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Rincian Anggaran / Program Item */}
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="programItem">Rincian Anggaran (Opsional)</Label>
                <Select
                  value={formData.programItemId}
                  onValueChange={handleProgramItemSelect}
                  disabled={!formData.unit || !formData.type || loadingItems}
                >
                  <SelectTrigger className="border-2 focus:border-[#00BCD4] rounded-xl">
                    <SelectValue placeholder={
                      loadingItems
                        ? "Memuat rincian anggaran..."
                        : !formData.unit
                          ? "Pilih unit terlebih dahulu"
                          : !formData.type
                            ? "Pilih jenis transaksi terlebih dahulu"
                            : "Pilih rincian anggaran"
                    } />
                  </SelectTrigger>
                  <SelectContent>
                    {programItems.map((item) => (
                      <SelectItem key={item.id} value={item.id}>
                        <div className="flex flex-col">
                          <span className="font-medium">{item.kodeItem} - {item.namaItem}</span>
                          <span className="text-xs text-gray-500">
                            {item.programNama} | Sisa: {formatCurrency(item.sisaAnggaran)}
                          </span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {/* Selected Program Item Info */}
                {selectedProgramItem && (
                  <Card className="border-2 border-[#00BCD4]/30 bg-gradient-to-r from-[#B2EBF2]/20 to-white rounded-xl mt-3">
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <div className="p-2 rounded-lg bg-[#00BCD4]/20">
                          <Info className="h-5 w-5 text-[#00BCD4] flex-shrink-0" />
                        </div>
                        <div className="flex-1 space-y-3">
                          <div>
                            <p className="font-medium text-[#006064]">{selectedProgramItem.namaItem}</p>
                            <p className="text-sm text-gray-600">{selectedProgramItem.programNama}</p>
                          </div>

                          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                            <div>
                              <p className="text-gray-500">Anggaran</p>
                              <p className="font-semibold">{formatCurrency(selectedProgramItem.jumlah)}</p>
                            </div>
                            <div>
                              <p className="text-gray-500">Realisasi</p>
                              <p className="font-semibold text-orange-600">{formatCurrency(selectedProgramItem.realisasi)}</p>
                            </div>
                            <div>
                              <p className="text-gray-500">Sisa</p>
                              <p className={`font-semibold ${selectedProgramItem.sisaAnggaran < 0 ? 'text-red-600' : 'text-green-600'}`}>
                                {formatCurrency(selectedProgramItem.sisaAnggaran)}
                              </p>
                            </div>
                            <div>
                              <p className="text-gray-500">Kode Akun</p>
                              <p className="font-semibold">{selectedProgramItem.kodeAkun}</p>
                            </div>
                          </div>

                          <div className="space-y-1">
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-gray-500 flex items-center gap-1">
                                <TrendingUp className="h-3 w-3" />
                                Progress
                              </span>
                              <span className="font-semibold">{selectedProgramItem.progress}%</span>
                            </div>
                            <Progress
                              value={Math.min(selectedProgramItem.progress, 100)}
                              className="h-2"
                            />
                          </div>

                          {selectedProgramItem.akun && (
                            <p className="text-xs text-gray-500">
                              Akun: {selectedProgramItem.akun.kode} - {selectedProgramItem.akun.nama}
                            </p>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>

              {/* Jumlah with Dalam Ribuan Toggle */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="amount">Jumlah (Rp) *</Label>
                  <div className="flex items-center gap-2">
                    <Label htmlFor="thousands-mode" className="text-xs text-gray-500 cursor-pointer">
                      Dalam ribuan
                    </Label>
                    <Switch
                      id="thousands-mode"
                      checked={inThousands}
                      onCheckedChange={setInThousands}
                    />
                  </div>
                </div>
                <div className="relative">
                  <Input
                    id="amount"
                    type="number"
                    placeholder={inThousands ? "Contoh: 500 = Rp 500.000" : "0"}
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                    className="border-2 focus:border-[#00BCD4] rounded-xl"
                    required
                    min="0"
                  />
                  {inThousands && (
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-xs text-gray-400">
                      x 1.000
                    </div>
                  )}
                </div>
                {formData.amount && (
                  <p className="text-sm text-gray-500">
                    Nilai aktual: <span className="font-semibold text-[#006064]">
                      Rp {formatDisplayAmount(formData.amount, inThousands)}
                    </span>
                  </p>
                )}
              </div>

              {/* Metode Pembayaran */}
              <div className="space-y-2">
                <Label htmlFor="paymentMethod">Metode Pembayaran</Label>
                <Select
                  value={formData.paymentMethod}
                  onValueChange={(value) =>
                    setFormData({ ...formData, paymentMethod: value })
                  }
                >
                  <SelectTrigger className="border-2 focus:border-[#00BCD4] rounded-xl">
                    <SelectValue placeholder="Pilih metode" />
                  </SelectTrigger>
                  <SelectContent>
                    {paymentMethodOptions.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Journal Entry Preview */}
              {formData.type && (
                <div className="space-y-2 md:col-span-2">
                  <Label>Preview Jurnal Entry</Label>
                  <Card className="border-2 border-[#00BCD4]/20 bg-gradient-to-r from-[#B2EBF2]/10 to-white rounded-xl">
                    <CardContent className="p-4">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="space-y-1">
                          <p className="font-medium text-green-700">DEBIT:</p>
                          {formData.type === 'income' ? (
                            <p className="text-gray-700">
                              {formData.paymentMethod === 'cash' ? '1101 - Kas' : '1102 - Bank Rekening Umum'}
                            </p>
                          ) : (
                            <p className="text-gray-700">
                              {selectedProgramItem?.akun
                                ? `${selectedProgramItem.akun.kode} - ${selectedProgramItem.akun.nama}`
                                : '5290 - Beban Lain-lain (default)'}
                            </p>
                          )}
                        </div>
                        <div className="space-y-1">
                          <p className="font-medium text-red-700">KREDIT:</p>
                          {formData.type === 'expense' ? (
                            <p className="text-gray-700">
                              {formData.paymentMethod === 'cash' ? '1101 - Kas' : '1102 - Bank Rekening Umum'}
                            </p>
                          ) : (
                            <p className="text-gray-700">
                              {selectedProgramItem?.akun
                                ? `${selectedProgramItem.akun.kode} - ${selectedProgramItem.akun.nama}`
                                : '4190 - Pendapatan Lain-lain (default)'}
                            </p>
                          )}
                        </div>
                      </div>
                      {!selectedProgramItem && (
                        <p className="text-xs text-gray-500 mt-3 border-t pt-2">
                          💡 Pilih &quot;Rincian Anggaran&quot; untuk menggunakan kode akun spesifik dari program kerja
                        </p>
                      )}
                    </CardContent>
                  </Card>
                </div>
              )}

              {/* Deskripsi */}
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="description">Deskripsi *</Label>
                <Input
                  id="description"
                  placeholder="Deskripsi transaksi"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  className="border-2 focus:border-[#00BCD4] rounded-xl"
                  required
                />
              </div>

              {/* Entitas/Supplier/Donor */}
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="entityName">Nama Pihak Terkait (Opsional)</Label>
                <Input
                  id="entityName"
                  placeholder="Nama supplier, donatur, atau pihak terkait"
                  value={formData.entityName}
                  onChange={(e) =>
                    setFormData({ ...formData, entityName: e.target.value })
                  }
                  className="border-2 focus:border-[#00BCD4] rounded-xl"
                />
              </div>

              {/* Catatan */}
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="notes">Catatan (Opsional)</Label>
                <Textarea
                  id="notes"
                  placeholder="Catatan tambahan..."
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="border-2 focus:border-[#00BCD4] rounded-xl resize-none"
                  rows={3}
                />
              </div>
            </div>

            {/* Submit Buttons */}
            <div className="flex items-center justify-end gap-4 pt-4 border-t border-gray-200">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
                disabled={isLoading}
                className="rounded-xl border-2 hover:border-[#00BCD4] transition-all duration-300"
              >
                Batal
              </Button>
              <Button
                type="submit"
                disabled={isLoading}
                className="bg-gradient-to-r from-[#00BCD4] to-[#006064] hover:from-[#006064] hover:to-[#00BCD4] text-white shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Menyimpan...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Simpan Transaksi
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
