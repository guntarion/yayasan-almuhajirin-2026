'use client';

import * as React from 'react';
import { useState } from 'react';
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
import { Loader2, AlertCircle, CheckCircle } from 'lucide-react';
import {
  PembayaranFormData,
  METODE_PEMBAYARAN_OPTIONS,
  formatRupiah,
  formatTanggal,
} from '@/types/daycare';

export interface TagihanHarianForPayment {
  id: string;
  anakId: string;
  tanggal: Date | string;
  nominal: number | string;
  status: string;
  anak?: {
    id: string;
    nomorInduk: string;
    namaLengkap: string;
    namaPanggilan?: string | null;
  } | null;
  _totalBayar?: number;
  _sisaTagihan?: number;
}

interface PembayaranHarianFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tagihan: TagihanHarianForPayment | null;
  onSuccess?: () => void;
}

export function PembayaranHarianForm({
  open,
  onOpenChange,
  tagihan,
  onSuccess,
}: PembayaranHarianFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState<Partial<PembayaranFormData>>({
    nominal: 0,
    metodePembayaran: 'cash',
    buktiTransfer: '',
    catatan: '',
  });

  // Calculate remaining amount
  const totalTagihan = tagihan ? Number(tagihan.nominal) : 0;
  const totalBayar = tagihan?._totalBayar ?? 0;
  const sisaTagihan = tagihan?._sisaTagihan ?? (totalTagihan - totalBayar);

  // Reset form when dialog opens
  React.useEffect(() => {
    if (open && tagihan) {
      setFormData({
        nominal: sisaTagihan > 0 ? sisaTagihan : 0,
        metodePembayaran: 'cash',
        buktiTransfer: '',
        catatan: '',
      });
      setError(null);
    }
  }, [open, sisaTagihan, tagihan]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!tagihan) {
      setError('Data tagihan tidak valid');
      return;
    }

    if (!formData.nominal || Number(formData.nominal) <= 0) {
      setError('Nominal pembayaran harus lebih dari 0');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch('/api/daycare/pembayaran-harian', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tagihanId: tagihan.id,
          nominal: Number(formData.nominal),
          metodePembayaran: formData.metodePembayaran,
          buktiTransfer: formData.buktiTransfer || null,
          catatan: formData.catatan || null,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Gagal menyimpan pembayaran');
      }

      onOpenChange(false);
      onSuccess?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Terjadi kesalahan');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!tagihan) return null;

  const isAlreadyPaid = tagihan.status === 'lunas';

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-[#006064]">Bayar Tagihan Harian</DialogTitle>
          <DialogDescription>
            {tagihan.anak?.namaLengkap} - {formatTanggal(tagihan.tanggal)}
          </DialogDescription>
        </DialogHeader>

        {/* Payment Summary */}
        <div className="bg-gray-50 rounded-md p-4 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Total Tagihan</span>
            <span className="font-medium">{formatRupiah(totalTagihan)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Sudah Dibayar</span>
            <span className="font-medium text-green-600">
              {formatRupiah(totalBayar)}
            </span>
          </div>
          <div className="flex justify-between text-sm border-t pt-2">
            <span className="text-gray-600 font-medium">Sisa Tagihan</span>
            <span className={`font-bold ${sisaTagihan > 0 ? 'text-red-600' : 'text-green-600'}`}>
              {formatRupiah(sisaTagihan)}
            </span>
          </div>
        </div>

        {isAlreadyPaid && (
          <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 text-green-700 rounded-md text-sm">
            <CheckCircle className="w-4 h-4 flex-shrink-0" />
            <span>Tagihan sudah lunas!</span>
          </div>
        )}

        {!isAlreadyPaid && (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="nominal">Nominal Pembayaran *</Label>
              <Input
                id="nominal"
                type="number"
                min="0"
                step="10000"
                value={formData.nominal || ''}
                onChange={(e) => setFormData({ ...formData, nominal: Number(e.target.value) })}
                required
                className="text-right"
              />
              {formData.nominal ? (
                <p className="text-sm text-gray-500">{formatRupiah(formData.nominal)}</p>
              ) : null}
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setFormData({ ...formData, nominal: sisaTagihan })}
                >
                  Bayar Lunas ({formatRupiah(sisaTagihan)})
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Metode Pembayaran</Label>
              <Select
                value={formData.metodePembayaran}
                onValueChange={(v) =>
                  setFormData({ ...formData, metodePembayaran: v as 'cash' | 'transfer' })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {METODE_PEMBAYARAN_OPTIONS.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {formData.metodePembayaran === 'transfer' && (
              <div className="space-y-2">
                <Label htmlFor="buktiTransfer">URL Bukti Transfer</Label>
                <Input
                  id="buktiTransfer"
                  type="url"
                  placeholder="https://..."
                  value={formData.buktiTransfer || ''}
                  onChange={(e) => setFormData({ ...formData, buktiTransfer: e.target.value })}
                />
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="catatan">Catatan</Label>
              <Textarea
                id="catatan"
                value={formData.catatan || ''}
                onChange={(e) => setFormData({ ...formData, catatan: e.target.value })}
                rows={2}
                placeholder="Keterangan tambahan..."
              />
            </div>

            {error && (
              <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 text-red-700 rounded-md text-sm">
                <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Batal
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="bg-[#00BCD4] hover:bg-[#006064]"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Menyimpan...
                  </>
                ) : (
                  'Simpan Pembayaran'
                )}
              </Button>
            </DialogFooter>
          </form>
        )}

        {isAlreadyPaid && (
          <DialogFooter>
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Tutup
            </Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
}
