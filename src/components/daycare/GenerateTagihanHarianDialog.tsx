'use client';

import * as React from 'react';
import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Loader2, AlertCircle, CheckCircle, FileText, Calendar } from 'lucide-react';
import { formatRupiah, formatTanggal } from '@/types/daycare';

interface GenerateTagihanHarianDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

interface PreviewData {
  totalKehadiran: number;
  sudahAdaTagihan: number;
  akanDiGenerate: number;
  hargaPerHari: number;
  loading: boolean;
}

export function GenerateTagihanHarianDialog({
  open,
  onOpenChange,
  onSuccess,
}: GenerateTagihanHarianDialogProps) {
  const today = new Date();
  const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [tanggalStart, setTanggalStart] = useState(
    firstDayOfMonth.toISOString().split('T')[0]
  );
  const [tanggalEnd, setTanggalEnd] = useState(
    today.toISOString().split('T')[0]
  );

  const [preview, setPreview] = useState<PreviewData>({
    totalKehadiran: 0,
    sudahAdaTagihan: 0,
    akanDiGenerate: 0,
    hargaPerHari: 0,
    loading: false,
  });

  // Fetch preview when date changes
  useEffect(() => {
    const fetchPreview = async () => {
      if (!open) return;

      setPreview((prev) => ({ ...prev, loading: true }));

      try {
        // Get kehadiran data for date range
        const kehadiranParams = new URLSearchParams({
          tanggalStart,
          tanggalEnd,
          isHadir: 'true',
          pageSize: '1000',
        });

        const kehadiranResponse = await fetch(`/api/daycare/kehadiran-harian?${kehadiranParams.toString()}`);
        const kehadiranData = await kehadiranResponse.json();

        // Filter only HARIAN anak and those without tagihan
        const harianKehadiran = (kehadiranData.data || []).filter(
          (k: { anak: { paketLayanan: string }; tagihanId: string | null }) =>
            k.anak?.paketLayanan === 'HARIAN'
        );

        const withoutTagihan = harianKehadiran.filter(
          (k: { tagihanId: string | null }) => !k.tagihanId
        );

        // Get harga harian from paket
        const paketResponse = await fetch('/api/daycare/paket');
        const paketData = await paketResponse.json();
        const harianPaket = (paketData.data || paketData || []).find(
          (p: { tipePaket: string }) => p.tipePaket === 'HARIAN'
        );

        setPreview({
          totalKehadiran: harianKehadiran.length,
          sudahAdaTagihan: harianKehadiran.length - withoutTagihan.length,
          akanDiGenerate: withoutTagihan.length,
          hargaPerHari: harianPaket ? Number(harianPaket.hargaDefault) : 0,
          loading: false,
        });
      } catch (err) {
        console.error('Error fetching preview:', err);
        setPreview({
          totalKehadiran: 0,
          sudahAdaTagihan: 0,
          akanDiGenerate: 0,
          hargaPerHari: 0,
          loading: false,
        });
      }
    };

    fetchPreview();
  }, [open, tanggalStart, tanggalEnd]);

  // Reset state when dialog opens
  useEffect(() => {
    if (open) {
      setError(null);
      setSuccess(null);
      const today = new Date();
      const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
      setTanggalStart(firstDay.toISOString().split('T')[0]);
      setTanggalEnd(today.toISOString().split('T')[0]);
    }
  }, [open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (preview.akanDiGenerate === 0) {
      setError('Tidak ada kehadiran yang perlu di-generate tagihannya');
      return;
    }

    if (!tanggalStart || !tanggalEnd) {
      setError('Tanggal mulai dan akhir wajib diisi');
      return;
    }

    if (new Date(tanggalStart) > new Date(tanggalEnd)) {
      setError('Tanggal mulai tidak boleh lebih besar dari tanggal akhir');
      return;
    }

    setIsSubmitting(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch('/api/daycare/tagihan-harian', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tanggalStart,
          tanggalEnd,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Gagal generate tagihan');
      }

      const result = await response.json();

      setSuccess(`Berhasil generate ${result.generated} tagihan harian`);

      // Wait a moment to show success message, then close
      setTimeout(() => {
        onOpenChange(false);
        onSuccess?.();
      }, 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Terjadi kesalahan');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-[#006064] flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Generate Tagihan Harian
          </DialogTitle>
          <DialogDescription>
            Generate tagihan dari kehadiran anak dengan paket HARIAN yang belum memiliki tagihan
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="tanggalStart">
                <Calendar className="w-4 h-4 inline mr-1" />
                Tanggal Mulai
              </Label>
              <Input
                id="tanggalStart"
                type="date"
                value={tanggalStart}
                onChange={(e) => setTanggalStart(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="tanggalEnd">
                <Calendar className="w-4 h-4 inline mr-1" />
                Tanggal Akhir
              </Label>
              <Input
                id="tanggalEnd"
                type="date"
                value={tanggalEnd}
                onChange={(e) => setTanggalEnd(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Preview */}
          <div className="bg-gray-50 rounded-md p-4 space-y-2">
            <h4 className="font-medium text-sm text-gray-700">Preview</h4>
            {preview.loading ? (
              <div className="flex items-center gap-2 text-gray-500">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Memuat data...</span>
              </div>
            ) : (
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Periode</span>
                  <span className="font-medium">
                    {formatTanggal(tanggalStart)} - {formatTanggal(tanggalEnd)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Kehadiran HARIAN</span>
                  <span className="font-medium">{preview.totalKehadiran}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Sudah Ada Tagihan</span>
                  <span className="font-medium text-yellow-600">{preview.sudahAdaTagihan}</span>
                </div>
                <div className="flex justify-between border-t pt-1">
                  <span className="text-gray-700 font-medium">Akan Di-Generate</span>
                  <span className="font-bold text-[#006064]">{preview.akanDiGenerate}</span>
                </div>
                {preview.hargaPerHari > 0 && (
                  <>
                    <div className="flex justify-between border-t pt-1">
                      <span className="text-gray-600">Harga Per Hari</span>
                      <span className="font-medium">{formatRupiah(preview.hargaPerHari)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-700 font-medium">Total Tagihan</span>
                      <span className="font-bold text-[#006064]">
                        {formatRupiah(preview.akanDiGenerate * preview.hargaPerHari)}
                      </span>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>

          {preview.hargaPerHari === 0 && !preview.loading && (
            <div className="flex items-start gap-2 p-3 bg-yellow-50 border border-yellow-200 text-yellow-700 rounded-md text-sm">
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <span>Harga paket HARIAN belum diatur. Silakan setup harga paket terlebih dahulu.</span>
            </div>
          )}

          {error && (
            <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 text-red-700 rounded-md text-sm">
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="flex items-start gap-2 p-3 bg-green-50 border border-green-200 text-green-700 rounded-md text-sm">
              <CheckCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <span>{success}</span>
            </div>
          )}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Batal
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || preview.loading || preview.akanDiGenerate === 0 || preview.hargaPerHari === 0}
              className="bg-[#00BCD4] hover:bg-[#006064]"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                <>Generate {preview.akanDiGenerate} Tagihan</>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
