'use client';

import React, { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Save, Loader2, AlertCircle, Info, TrendingUp, Ban } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Progress } from '@/components/ui/progress';
// Badge removed - not currently used
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
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
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
  jumlah: number;
  realisasi: number;
  sisaAnggaran: number;
  progress: number;
  kodeAkun: string;
  akun: {
    kode: string;
    nama: string;
  } | null;
}

interface TransactionData {
  id: string;
  code: string;
  transactionDate: string;
  type: 'income' | 'expense';
  amount: number;
  description: string;
  entityName: string | null;
  paymentMethod: string;
  notes: string | null;
  isVoided: boolean;
  voidReason: string | null;
  bidang: { kode: string; nama: string } | null;
  unitKerja: { kode: string; nama: string } | null;
  programItem: { id: string; kodeItem: string; namaItem: string } | null;
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

export default function EditTransaksiPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedBidang, setSelectedBidang] = useState('');
  const [inThousands, setInThousands] = useState(false);
  const [bidangOptions, setBidangOptions] = useState<BidangWithUnits[]>([]);
  const [programItems, setProgramItems] = useState<ProgramItem[]>([]);
  const [loadingItems, setLoadingItems] = useState(false);
  const [selectedProgramItem, setSelectedProgramItem] = useState<ProgramItem | null>(null);
  const [originalData, setOriginalData] = useState<TransactionData | null>(null);
  const [voidReason, setVoidReason] = useState('');
  const [isVoiding, setIsVoiding] = useState(false);

  const [formData, setFormData] = useState({
    transactionDate: '',
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
    fetchTransaction();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  useEffect(() => {
    if (formData.unit && formData.type) {
      fetchProgramItems();
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

  const fetchTransaction = async () => {
    try {
      setIsFetching(true);
      const response = await fetch(`/api/keuangan/transaksi/${id}`);
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Gagal memuat data transaksi');
      }

      const data = result.data as TransactionData;
      setOriginalData(data);

      // Populate form
      const bidangKode = data.bidang?.kode || '';
      const unitKode = data.unitKerja?.kode || '';

      setSelectedBidang(bidangKode);
      setFormData({
        transactionDate: data.transactionDate.split('T')[0],
        type: data.type,
        bidang: bidangKode,
        unit: unitKode,
        programItemId: data.programItem?.id || '',
        amount: data.amount.toString(),
        description: data.description,
        paymentMethod: data.paymentMethod,
        entityName: data.entityName || '',
        notes: data.notes || '',
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Terjadi kesalahan');
    } finally {
      setIsFetching(false);
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

        // Select the current program item if it exists
        if (formData.programItemId) {
          const item = result.data.find((i: ProgramItem) => i.id === formData.programItemId);
          setSelectedProgramItem(item || null);
        }
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

      const actualAmount = inThousands
        ? parseFloat(formData.amount) * 1000
        : parseFloat(formData.amount);

      const response = await fetch(`/api/keuangan/transaksi/${id}`, {
        method: 'PUT',
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

  const handleVoid = async () => {
    try {
      setIsVoiding(true);
      const response = await fetch(`/api/keuangan/transaksi/${id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason: voidReason || 'Dibatalkan' }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Gagal membatalkan transaksi');
      }

      router.push('/transaksi');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Terjadi kesalahan');
    } finally {
      setIsVoiding(false);
    }
  };

  if (isFetching) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#00BCD4]"></div>
      </div>
    );
  }

  if (originalData?.isVoided) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.back()}
            className="rounded-xl"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Kembali
          </Button>
        </div>
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3 text-red-600">
              <Ban className="h-6 w-6" />
              <div>
                <p className="font-semibold">Transaksi Sudah Dibatalkan</p>
                <p className="text-sm">Transaksi yang sudah dibatalkan tidak dapat diedit.</p>
                {originalData.voidReason && (
                  <p className="text-sm mt-2">Alasan: {originalData.voidReason}</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="relative overflow-hidden bg-gradient-to-r from-white via-[#B2EBF2]/20 to-[#80DEEA]/20 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 py-6 rounded-b-3xl border-b border-[#00BCD4]/10">
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-gradient-to-br from-[#00BCD4]/20 to-[#80DEEA]/20 rounded-full blur-3xl" />
        <div className="relative flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
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
                <h1 className="text-3xl font-bold text-[#006064]">Edit Transaksi</h1>
              </div>
              <p className="text-sm text-gray-600 ml-4">
                {originalData?.code}
              </p>
            </div>
          </div>

          {/* Void Button */}
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" size="sm" className="rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
                <Ban className="h-4 w-4 mr-2" />
                Batalkan Transaksi
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="rounded-2xl">
            <AlertDialogHeader>
              <AlertDialogTitle>Batalkan Transaksi?</AlertDialogTitle>
              <AlertDialogDescription>
                Transaksi yang dibatalkan tidak dapat dikembalikan. Jurnal akan tetap ada
                untuk keperluan audit, namun nilai realisasi akan dikurangi.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <div className="py-4">
              <Label htmlFor="voidReason">Alasan Pembatalan</Label>
              <Input
                id="voidReason"
                placeholder="Masukkan alasan pembatalan..."
                value={voidReason}
                onChange={(e) => setVoidReason(e.target.value)}
                className="mt-2 border-2 focus:border-[#00BCD4] rounded-xl"
              />
            </div>
            <AlertDialogFooter>
              <AlertDialogCancel className="rounded-xl border-2 hover:border-[#00BCD4] transition-all duration-300">Batal</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleVoid}
                disabled={isVoiding}
                className="bg-red-600 hover:bg-red-700 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
              >
                {isVoiding ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Membatalkan...
                  </>
                ) : (
                  'Ya, Batalkan'
                )}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
          </AlertDialog>
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
            <span>Form Edit Transaksi</span>
          </CardTitle>
          <CardDescription>
            Ubah data transaksi. Jurnal akan diperbarui secara otomatis.
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

              {/* Rincian Anggaran */}
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
                    Simpan Perubahan
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
