'use client';

import * as React from 'react';
import { useState, useEffect, useCallback } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
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
import { Loader2, Search, Baby } from 'lucide-react';
import {
  DaycareAnak,
  PendaftaranFormData,
  PAKET_LAYANAN_OPTIONS,
  SCHEMA_PEMBAYARAN_OPTIONS,
  formatRupiah,
  getPaketLabel,
} from '@/types/daycare';

interface PendaftaranFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

interface AnakOption {
  id: string;
  nomorInduk: string;
  namaLengkap: string;
  namaPanggilan?: string | null;
  paketLayanan: string;
}

export function PendaftaranFormDialog({
  open,
  onOpenChange,
  onSuccess,
}: PendaftaranFormDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Anak search state
  const [searchQuery, setSearchQuery] = useState('');
  const [anakOptions, setAnakOptions] = useState<AnakOption[]>([]);
  const [selectedAnak, setSelectedAnak] = useState<AnakOption | null>(null);
  const [isSearching, setIsSearching] = useState(false);

  // Pendaftaran form state
  const [formData, setFormData] = useState<Partial<PendaftaranFormData>>({
    paketDipilih: 'FULLDAY',
    biayaPendaftaran: 0,
    schemaPembayaran: 'lunas',
    catatan: '',
  });

  // Payment state (for lunas option)
  const [includePayment, setIncludePayment] = useState(true);
  const [paymentData, setPaymentData] = useState({
    metodePembayaran: 'cash' as 'cash' | 'transfer',
    buktiTransfer: '',
    catatan: '',
  });

  // Search for anak without pendaftaran
  const searchAnak = useCallback(async (query: string) => {
    if (!query || query.length < 2) {
      setAnakOptions([]);
      return;
    }

    setIsSearching(true);
    try {
      const response = await fetch(
        `/api/daycare/anak?search=${encodeURIComponent(query)}&noPendaftaran=true&pageSize=10`
      );
      const data = await response.json();
      setAnakOptions(
        data.data?.map((a: DaycareAnak) => ({
          id: a.id,
          nomorInduk: a.nomorInduk,
          namaLengkap: a.namaLengkap,
          namaPanggilan: a.namaPanggilan,
          paketLayanan: a.paketLayanan,
        })) || []
      );
    } catch {
      console.error('Error searching anak');
      setAnakOptions([]);
    } finally {
      setIsSearching(false);
    }
  }, []);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery) {
        searchAnak(searchQuery);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery, searchAnak]);

  // Update form when anak is selected
  useEffect(() => {
    if (selectedAnak) {
      setFormData((prev) => ({
        ...prev,
        anakId: selectedAnak.id,
        paketDipilih: selectedAnak.paketLayanan as 'FULLDAY' | 'AFTER_SCHOOL' | 'HARIAN',
      }));
    }
  }, [selectedAnak]);

  const handleSelectAnak = (anak: AnakOption) => {
    setSelectedAnak(anak);
    setSearchQuery(anak.namaLengkap);
    setAnakOptions([]);
  };

  const resetForm = () => {
    setSearchQuery('');
    setAnakOptions([]);
    setSelectedAnak(null);
    setFormData({
      paketDipilih: 'FULLDAY',
      biayaPendaftaran: 0,
      schemaPembayaran: 'lunas',
      catatan: '',
    });
    setIncludePayment(true);
    setPaymentData({
      metodePembayaran: 'cash',
      buktiTransfer: '',
      catatan: '',
    });
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      if (!selectedAnak) {
        throw new Error('Silakan pilih anak terlebih dahulu');
      }

      if (!formData.biayaPendaftaran || Number(formData.biayaPendaftaran) <= 0) {
        throw new Error('Biaya pendaftaran harus lebih dari 0');
      }

      // Create pendaftaran
      const response = await fetch('/api/daycare/pendaftaran', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          anakId: selectedAnak.id,
          paketDipilih: formData.paketDipilih,
          tanggalMulai: formData.tanggalMulai || null,
          biayaPendaftaran: Number(formData.biayaPendaftaran),
          schemaPembayaran: formData.schemaPembayaran,
          catatan: formData.catatan || null,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Gagal membuat pendaftaran');
      }

      const pendaftaranResult = await response.json();

      // Create payment if lunas and checked
      if (formData.schemaPembayaran === 'lunas' && includePayment) {
        const paymentResponse = await fetch('/api/daycare/pembayaran-pendaftaran', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            pendaftaranId: pendaftaranResult.id,
            nominal: Number(formData.biayaPendaftaran),
            metodePembayaran: paymentData.metodePembayaran,
            buktiTransfer: paymentData.buktiTransfer || null,
            catatan: paymentData.catatan || 'Pembayaran pendaftaran lunas',
          }),
        });

        if (!paymentResponse.ok) {
          console.warn('Payment created but pendaftaran exists');
        }
      }

      resetForm();
      onOpenChange(false);
      onSuccess?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Terjadi kesalahan');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-[#006064]">Pendaftaran Baru</DialogTitle>
          <DialogDescription>
            Daftarkan anak yang sudah terdaftar ke program Daycare
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Search Anak */}
          <div className="space-y-2">
            <Label>Pilih Anak (yang belum memiliki pendaftaran)</Label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Ketik nama atau nomor induk anak..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setSelectedAnak(null);
                }}
                className="pl-10"
              />
              {isSearching && (
                <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 animate-spin" />
              )}
            </div>

            {/* Search results */}
            {anakOptions.length > 0 && !selectedAnak && (
              <div className="border rounded-md max-h-48 overflow-y-auto">
                {anakOptions.map((anak) => (
                  <button
                    key={anak.id}
                    type="button"
                    onClick={() => handleSelectAnak(anak)}
                    className="w-full px-4 py-2 text-left hover:bg-gray-100 flex justify-between items-center"
                  >
                    <div>
                      <div className="font-medium">{anak.namaLengkap}</div>
                      <div className="text-sm text-gray-500">
                        {anak.nomorInduk} {anak.namaPanggilan && `(${anak.namaPanggilan})`}
                      </div>
                    </div>
                    <div className="text-sm text-gray-500">
                      {getPaketLabel(anak.paketLayanan)}
                    </div>
                  </button>
                ))}
              </div>
            )}

            {/* No results */}
            {searchQuery.length >= 2 && !isSearching && anakOptions.length === 0 && !selectedAnak && (
              <div className="text-center py-4 text-gray-500 border rounded-md">
                <Baby className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                <p className="text-sm">Tidak ada anak ditemukan atau semua sudah terdaftar</p>
              </div>
            )}

            {/* Selected anak display */}
            {selectedAnak && (
              <div className="p-3 bg-cyan-50 border border-cyan-200 rounded-md">
                <div className="font-medium text-[#006064]">{selectedAnak.namaLengkap}</div>
                <div className="text-sm text-gray-600">
                  {selectedAnak.nomorInduk} | {getPaketLabel(selectedAnak.paketLayanan)}
                </div>
              </div>
            )}
          </div>

          {/* Pendaftaran Form */}
          <div className="border-t pt-4 space-y-4">
            <h4 className="font-medium text-[#006064]">Data Pendaftaran</h4>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Paket Layanan</Label>
                <Select
                  value={formData.paketDipilih}
                  onValueChange={(v) => setFormData({ ...formData, paketDipilih: v as 'FULLDAY' | 'AFTER_SCHOOL' | 'HARIAN' })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {PAKET_LAYANAN_OPTIONS.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                        <span className="text-xs text-gray-500 ml-2">({opt.description})</span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="tanggalMulai">Tanggal Mulai</Label>
                <Input
                  id="tanggalMulai"
                  type="date"
                  value={formData.tanggalMulai ? new Date(formData.tanggalMulai).toISOString().split('T')[0] : ''}
                  onChange={(e) => setFormData({ ...formData, tanggalMulai: e.target.value ? new Date(e.target.value) : undefined })}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="biayaPendaftaran">Biaya Pendaftaran *</Label>
                <Input
                  id="biayaPendaftaran"
                  type="number"
                  min="0"
                  step="10000"
                  value={formData.biayaPendaftaran || ''}
                  onChange={(e) => setFormData({ ...formData, biayaPendaftaran: Number(e.target.value) })}
                  required
                  className="text-right"
                />
                {formData.biayaPendaftaran ? (
                  <p className="text-sm text-gray-500">{formatRupiah(formData.biayaPendaftaran)}</p>
                ) : null}
              </div>
              <div className="space-y-2">
                <Label>Skema Pembayaran</Label>
                <Select
                  value={formData.schemaPembayaran}
                  onValueChange={(v) => {
                    setFormData({ ...formData, schemaPembayaran: v as 'lunas' | 'angsuran' });
                    setIncludePayment(v === 'lunas');
                  }}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {SCHEMA_PEMBAYARAN_OPTIONS.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Payment for Lunas */}
            {formData.schemaPembayaran === 'lunas' && (
              <div className="bg-green-50 border border-green-200 rounded-md p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="text-green-800 font-medium">Input Pembayaran Langsung</Label>
                  <label className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={includePayment}
                      onChange={(e) => setIncludePayment(e.target.checked)}
                      className="rounded"
                    />
                    Ya, bayar sekarang
                  </label>
                </div>

                {includePayment && (
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Metode Pembayaran</Label>
                      <Select
                        value={paymentData.metodePembayaran}
                        onValueChange={(v) => setPaymentData({ ...paymentData, metodePembayaran: v as 'cash' | 'transfer' })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="cash">Cash/Tunai</SelectItem>
                          <SelectItem value="transfer">Transfer Bank</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    {paymentData.metodePembayaran === 'transfer' && (
                      <div className="space-y-2">
                        <Label htmlFor="buktiTransfer">URL Bukti Transfer</Label>
                        <Input
                          id="buktiTransfer"
                          type="url"
                          placeholder="https://..."
                          value={paymentData.buktiTransfer}
                          onChange={(e) => setPaymentData({ ...paymentData, buktiTransfer: e.target.value })}
                        />
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="catatan">Catatan</Label>
              <Textarea
                id="catatan"
                value={formData.catatan || ''}
                onChange={(e) => setFormData({ ...formData, catatan: e.target.value })}
                rows={2}
                placeholder="Catatan tambahan..."
              />
            </div>
          </div>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-md">
              {error}
            </div>
          )}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Batal
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || !selectedAnak}
              className="bg-[#00BCD4] hover:bg-[#006064]"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Menyimpan...
                </>
              ) : (
                'Simpan Pendaftaran'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
