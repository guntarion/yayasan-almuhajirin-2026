'use client';

import React, { useState } from 'react';
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
import { Loader2 } from 'lucide-react';
import {
  KbtkTagihanSppWithRelations,
  METODE_PEMBAYARAN_OPTIONS,
  formatCurrency,
  getNamaBulan,
} from '@/types/kbtk';

interface PembayaranSppFormProps {
  tagihan: KbtkTagihanSppWithRelations;
  onSubmit: (data: PembayaranFormData) => Promise<void>;
  onCancel: () => void;
  loading?: boolean;
}

interface PembayaranFormData {
  tagihanId: string;
  tanggalBayar: string;
  nominal: number;
  metodePembayaran: 'cash' | 'transfer';
  buktiTransfer?: string;
  catatan?: string;
}

export function PembayaranSppForm({
  tagihan,
  onSubmit,
  onCancel,
  loading = false,
}: PembayaranSppFormProps) {
  const sisaTagihan = tagihan._sisaTagihan || 0;
  const today = new Date().toISOString().split('T')[0];

  const [formData, setFormData] = useState<PembayaranFormData>({
    tagihanId: tagihan.id,
    tanggalBayar: today,
    nominal: sisaTagihan,
    metodePembayaran: 'cash',
    buktiTransfer: '',
    catatan: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'nominal' ? parseFloat(value) || 0 : value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.tanggalBayar) {
      newErrors.tanggalBayar = 'Tanggal bayar wajib diisi';
    }

    if (!formData.nominal || formData.nominal <= 0) {
      newErrors.nominal = 'Nominal harus lebih dari 0';
    }

    if (!formData.metodePembayaran) {
      newErrors.metodePembayaran = 'Metode pembayaran wajib dipilih';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    await onSubmit(formData);
  };

  const handleQuickFill = (percentage: number) => {
    setFormData((prev) => ({
      ...prev,
      nominal: Math.round(sisaTagihan * percentage),
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Tagihan Info */}
      <div className="bg-gradient-to-r from-[#00BCD4]/5 to-[#006064]/5 rounded-lg p-4 border border-[#00BCD4]/20">
        <h4 className="font-semibold text-[#006064] mb-2">Informasi Tagihan</h4>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-500">Siswa:</span>
            <p className="font-medium">{tagihan.siswa?.namaLengkap}</p>
          </div>
          <div>
            <span className="text-gray-500">Periode:</span>
            <p className="font-medium">
              {getNamaBulan(tagihan.bulan)} {tagihan.tahun}
            </p>
          </div>
          <div>
            <span className="text-gray-500">Total Tagihan:</span>
            <p className="font-medium">{formatCurrency(Number(tagihan.totalTagihan))}</p>
          </div>
          <div>
            <span className="text-gray-500">Sisa Tagihan:</span>
            <p className="font-bold text-red-600">{formatCurrency(sisaTagihan)}</p>
          </div>
        </div>
      </div>

      {/* Tanggal Bayar */}
      <div className="space-y-2">
        <Label htmlFor="tanggalBayar">Tanggal Bayar *</Label>
        <Input
          id="tanggalBayar"
          name="tanggalBayar"
          type="date"
          value={formData.tanggalBayar}
          onChange={handleChange}
          className={errors.tanggalBayar ? 'border-red-500' : ''}
        />
        {errors.tanggalBayar && (
          <p className="text-sm text-red-500">{errors.tanggalBayar}</p>
        )}
      </div>

      {/* Nominal */}
      <div className="space-y-2">
        <Label htmlFor="nominal">Nominal Pembayaran *</Label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
            Rp
          </span>
          <Input
            id="nominal"
            name="nominal"
            type="number"
            value={formData.nominal || ''}
            onChange={handleChange}
            className={`pl-10 ${errors.nominal ? 'border-red-500' : ''}`}
            placeholder="0"
          />
        </div>
        {errors.nominal && (
          <p className="text-sm text-red-500">{errors.nominal}</p>
        )}
        {/* Quick fill buttons */}
        <div className="flex gap-2 mt-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => handleQuickFill(0.5)}
            className="text-xs"
          >
            50%
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => handleQuickFill(1)}
            className="text-xs"
          >
            100% (Lunas)
          </Button>
        </div>
      </div>

      {/* Metode Pembayaran */}
      <div className="space-y-2">
        <Label htmlFor="metodePembayaran">Metode Pembayaran *</Label>
        <Select
          value={formData.metodePembayaran}
          onValueChange={(value) => handleSelectChange('metodePembayaran', value)}
        >
          <SelectTrigger className={errors.metodePembayaran ? 'border-red-500' : ''}>
            <SelectValue placeholder="Pilih metode" />
          </SelectTrigger>
          <SelectContent>
            {METODE_PEMBAYARAN_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.metodePembayaran && (
          <p className="text-sm text-red-500">{errors.metodePembayaran}</p>
        )}
      </div>

      {/* Bukti Transfer (if transfer selected) */}
      {formData.metodePembayaran === 'transfer' && (
        <div className="space-y-2">
          <Label htmlFor="buktiTransfer">Bukti Transfer (URL)</Label>
          <Input
            id="buktiTransfer"
            name="buktiTransfer"
            type="url"
            value={formData.buktiTransfer}
            onChange={handleChange}
            placeholder="https://..."
          />
          <p className="text-xs text-gray-500">
            Masukkan URL gambar bukti transfer (opsional)
          </p>
        </div>
      )}

      {/* Catatan */}
      <div className="space-y-2">
        <Label htmlFor="catatan">Catatan</Label>
        <Textarea
          id="catatan"
          name="catatan"
          value={formData.catatan}
          onChange={handleChange}
          placeholder="Catatan tambahan (opsional)"
          rows={3}
        />
      </div>

      {/* Buttons */}
      <div className="flex gap-3 justify-end pt-4 border-t">
        <Button type="button" variant="outline" onClick={onCancel}>
          Batal
        </Button>
        <Button
          type="submit"
          disabled={loading}
          className="bg-gradient-to-r from-[#00BCD4] to-[#006064] text-white"
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Menyimpan...
            </>
          ) : (
            'Simpan Pembayaran'
          )}
        </Button>
      </div>
    </form>
  );
}
