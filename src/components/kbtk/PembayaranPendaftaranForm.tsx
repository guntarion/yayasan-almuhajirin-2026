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
import { Loader2, AlertCircle } from 'lucide-react';
import {
  KbtkPendaftaranWithRelations,
  PembayaranPendaftaranFormData,
  METODE_PEMBAYARAN_OPTIONS,
  formatCurrency,
} from '@/types/kbtk';

interface PembayaranPendaftaranFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  pendaftaran: KbtkPendaftaranWithRelations | null;
  onSuccess?: () => void;
}

export function PembayaranPendaftaranForm({
  open,
  onOpenChange,
  pendaftaran,
  onSuccess,
}: PembayaranPendaftaranFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState<Partial<PembayaranPendaftaranFormData>>({
    tanggalBayar: new Date(),
    nominal: 0,
    metodePembayaran: 'cash',
    buktiTransfer: '',
    catatan: '',
  });

  // Calculate remaining amount
  const sisaTagihan = pendaftaran?._sisaTagihan ??
    (Number(pendaftaran?.biayaPendaftaran || 0) -
      (pendaftaran?.pembayaran?.reduce((sum, p) => sum + Number(p.nominal), 0) || 0));

  // Reset form when dialog opens
  React.useEffect(() => {
    if (open) {
      setFormData({
        tanggalBayar: new Date(),
        nominal: sisaTagihan > 0 ? sisaTagihan : 0,
        metodePembayaran: 'cash',
        buktiTransfer: '',
        catatan: '',
      });
      setError(null);
    }
  }, [open, sisaTagihan]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!pendaftaran) {
      setError('Data pendaftaran tidak valid');
      return;
    }

    if (!formData.nominal || Number(formData.nominal) <= 0) {
      setError('Nominal pembayaran harus lebih dari 0');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch('/api/kbtk/pembayaran-pendaftaran', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pendaftaranId: pendaftaran.id,
          tanggalBayar: formData.tanggalBayar,
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

  if (!pendaftaran) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-[#006064]">Tambah Pembayaran</DialogTitle>
          <DialogDescription>
            Input pembayaran untuk {pendaftaran.siswa?.namaLengkap}
          </DialogDescription>
        </DialogHeader>

        {/* Payment Summary */}
        <div className="bg-gray-50 rounded-md p-4 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Total Biaya</span>
            <span className="font-medium">{formatCurrency(Number(pendaftaran.biayaPendaftaran))}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Sudah Dibayar</span>
            <span className="font-medium text-green-600">
              {formatCurrency(pendaftaran._totalBayar || 0)}
            </span>
          </div>
          <div className="flex justify-between text-sm border-t pt-2">
            <span className="text-gray-600 font-medium">Sisa Tagihan</span>
            <span className={`font-bold ${sisaTagihan > 0 ? 'text-red-600' : 'text-green-600'}`}>
              {formatCurrency(sisaTagihan)}
            </span>
          </div>
        </div>

        {sisaTagihan <= 0 && (
          <div className="flex items-center gap-2 p-3 bg-yellow-50 border border-yellow-200 text-yellow-700 rounded-md text-sm">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>Pembayaran sudah lunas. Anda masih bisa menambahkan pembayaran jika diperlukan.</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="tanggalBayar">Tanggal Pembayaran</Label>
            <Input
              id="tanggalBayar"
              type="date"
              value={
                formData.tanggalBayar
                  ? new Date(formData.tanggalBayar).toISOString().split('T')[0]
                  : new Date().toISOString().split('T')[0]
              }
              onChange={(e) =>
                setFormData({ ...formData, tanggalBayar: new Date(e.target.value) })
              }
              required
            />
          </div>

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
              <p className="text-sm text-gray-500">{formatCurrency(formData.nominal)}</p>
            ) : null}
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
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-md text-sm">
              {error}
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
      </DialogContent>
    </Dialog>
  );
}
