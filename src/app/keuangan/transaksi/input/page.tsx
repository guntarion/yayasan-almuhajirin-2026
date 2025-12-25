'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Save, Loader2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
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
import { getBidangOptions, getUnitOptions } from '@/data/keuangan/units';
import { getPaymentMethodOptions, getTransactionTypeOptions } from '@/data/keuangan/lookups';

export default function InputTransaksiPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedBidang, setSelectedBidang] = useState('');
  const [formData, setFormData] = useState({
    transactionDate: new Date().toISOString().split('T')[0],
    type: '',
    bidang: '',
    unit: '',
    amount: '',
    description: '',
    paymentMethod: 'bank',
    notes: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // TODO: Implement actual API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    setIsLoading(false);
    router.push('/transaksi');
  };

  const bidangOptions = getBidangOptions();
  const unitOptions = selectedBidang ? getUnitOptions(selectedBidang) : [];
  const paymentOptions = getPaymentMethodOptions();
  const typeOptions = getTransactionTypeOptions();

  return (
    <div className="space-y-6">
      {/* Page Header */}
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
        <div>
          <h1 className="text-2xl font-bold text-[#006064]">Input Transaksi</h1>
          <p className="text-sm text-gray-600 mt-1">Catat transaksi baru</p>
        </div>
      </div>

      {/* Form */}
      <Card className="border-2" style={{ borderColor: 'rgba(0, 188, 212, 0.2)' }}>
        <CardHeader>
          <CardTitle className="text-lg text-[#006064]">Form Transaksi</CardTitle>
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
                <Label htmlFor="type">Jenis Transaksi</Label>
                <Select
                  value={formData.type}
                  onValueChange={(value) => setFormData({ ...formData, type: value })}
                >
                  <SelectTrigger className="border-2 focus:border-[#00BCD4] rounded-xl">
                    <SelectValue placeholder="Pilih jenis transaksi" />
                  </SelectTrigger>
                  <SelectContent>
                    {typeOptions.map((opt) => (
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

              {/* Jumlah */}
              <div className="space-y-2">
                <Label htmlFor="amount">Jumlah (Rp)</Label>
                <Input
                  id="amount"
                  type="number"
                  placeholder="0"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  className="border-2 focus:border-[#00BCD4] rounded-xl"
                  required
                  min="0"
                />
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
                    {paymentOptions.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Deskripsi */}
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="description">Deskripsi</Label>
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
              >
                Batal
              </Button>
              <Button
                type="submit"
                disabled={isLoading}
                className="bg-gradient-to-r from-[#00BCD4] to-[#006064] hover:from-[#006064] hover:to-[#00BCD4] text-white shadow-lg"
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
