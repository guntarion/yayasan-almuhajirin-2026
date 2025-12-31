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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Loader2, AlertCircle, CheckCircle, FileText } from 'lucide-react';
import {
  PAKET_LAYANAN_OPTIONS,
  BULAN_OPTIONS,
  generateYearOptions,
  getNamaBulan,
  getCurrentPeriod,
} from '@/types/daycare';

interface GenerateTagihanDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

interface PreviewData {
  totalAnak: number;
  sudahAdaTagihan: number;
  akanDiGenerate: number;
  loading: boolean;
}

export function GenerateTagihanDialog({
  open,
  onOpenChange,
  onSuccess,
}: GenerateTagihanDialogProps) {
  const currentPeriod = getCurrentPeriod();
  const yearOptions = generateYearOptions(2024, 5);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [bulan, setBulan] = useState(currentPeriod.bulan.toString());
  const [tahun, setTahun] = useState(currentPeriod.tahun.toString());
  const [paket, setPaket] = useState('all');

  const [preview, setPreview] = useState<PreviewData>({
    totalAnak: 0,
    sudahAdaTagihan: 0,
    akanDiGenerate: 0,
    loading: false,
  });

  // Fetch preview when filter changes
  useEffect(() => {
    const fetchPreview = async () => {
      if (!open) return;

      setPreview((prev) => ({ ...prev, loading: true }));

      try {
        // Get total anak with FULLDAY/AFTER_SCHOOL
        const anakParams = new URLSearchParams({
          status: 'aktif',
          pageSize: '1000', // Get all
        });

        if (paket !== 'all') {
          anakParams.append('paketLayanan', paket);
        } else {
          // For 'all', we need to filter FULLDAY and AFTER_SCHOOL
          // This will be done on server side
        }

        const anakResponse = await fetch(`/api/daycare/anak?${anakParams.toString()}`);
        const anakData = await anakResponse.json();

        // Filter only FULLDAY and AFTER_SCHOOL if paket is 'all'
        let filteredAnak = anakData.data || [];
        if (paket === 'all') {
          filteredAnak = filteredAnak.filter(
            (a: { paketLayanan: string }) =>
              a.paketLayanan === 'FULLDAY' || a.paketLayanan === 'AFTER_SCHOOL'
          );
        }

        // Get existing tagihan for this period
        const tagihanParams = new URLSearchParams({
          bulan: bulan,
          tahun: tahun,
          pageSize: '1000',
        });

        if (paket !== 'all') {
          tagihanParams.append('paket', paket);
        }

        const tagihanResponse = await fetch(`/api/daycare/tagihan-bulanan?${tagihanParams.toString()}`);
        const tagihanData = await tagihanResponse.json();

        const existingAnakIds = new Set(
          (tagihanData.data || []).map((t: { anakId: string }) => t.anakId)
        );

        const akanDiGenerate = filteredAnak.filter(
          (a: { id: string }) => !existingAnakIds.has(a.id)
        ).length;

        setPreview({
          totalAnak: filteredAnak.length,
          sudahAdaTagihan: existingAnakIds.size,
          akanDiGenerate,
          loading: false,
        });
      } catch (err) {
        console.error('Error fetching preview:', err);
        setPreview({
          totalAnak: 0,
          sudahAdaTagihan: 0,
          akanDiGenerate: 0,
          loading: false,
        });
      }
    };

    fetchPreview();
  }, [open, bulan, tahun, paket]);

  // Reset state when dialog opens
  useEffect(() => {
    if (open) {
      setError(null);
      setSuccess(null);
      setBulan(currentPeriod.bulan.toString());
      setTahun(currentPeriod.tahun.toString());
      setPaket('all');
    }
  }, [open, currentPeriod.bulan, currentPeriod.tahun]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (preview.akanDiGenerate === 0) {
      setError('Tidak ada tagihan yang perlu di-generate');
      return;
    }

    setIsSubmitting(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch('/api/daycare/tagihan-bulanan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bulan: parseInt(bulan),
          tahun: parseInt(tahun),
          paket: paket !== 'all' ? paket : undefined,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Gagal generate tagihan');
      }

      const result = await response.json();

      setSuccess(`Berhasil generate ${result.generated} tagihan untuk ${getNamaBulan(parseInt(bulan))} ${tahun}`);

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
            Generate Tagihan Bulanan
          </DialogTitle>
          <DialogDescription>
            Generate tagihan bulanan untuk semua anak aktif dengan paket FULLDAY atau AFTER SCHOOL
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Bulan</Label>
              <Select value={bulan} onValueChange={setBulan}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {BULAN_OPTIONS.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value.toString()}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Tahun</Label>
              <Select value={tahun} onValueChange={setTahun}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {yearOptions.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value.toString()}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Filter Paket (Opsional)</Label>
            <Select value={paket} onValueChange={setPaket}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Paket (FULLDAY & AFTER SCHOOL)</SelectItem>
                {PAKET_LAYANAN_OPTIONS.filter(
                  (opt) => opt.value === 'FULLDAY' || opt.value === 'AFTER_SCHOOL'
                ).map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
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
                  <span className="text-gray-600">Total Anak Aktif</span>
                  <span className="font-medium">{preview.totalAnak}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Sudah Ada Tagihan</span>
                  <span className="font-medium text-yellow-600">{preview.sudahAdaTagihan}</span>
                </div>
                <div className="flex justify-between border-t pt-1">
                  <span className="text-gray-700 font-medium">Akan Di-Generate</span>
                  <span className="font-bold text-[#006064]">{preview.akanDiGenerate}</span>
                </div>
              </div>
            )}
          </div>

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
              disabled={isSubmitting || preview.loading || preview.akanDiGenerate === 0}
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
