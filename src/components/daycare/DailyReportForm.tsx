'use client';

import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LikertScaleInput } from './LikertScaleInput';
import {
  DailyReportFormData,
  DaycareAnak,
  KEGIATAN_OPTIONS,
  parseKegiatanHariIni,
} from '@/types/daycare';
import {
  Loader2,
  Heart,
  Users,
  Utensils,
  Moon,
  ClipboardList,
  MessageSquare,
  Baby,
} from 'lucide-react';
import { toast } from 'sonner';

interface DailyReportFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  anakList: Pick<DaycareAnak, 'id' | 'namaLengkap' | 'nomorInduk'>[];
  existingReport?: {
    id: string;
    anakId: string;
    tanggal: Date | string;
    guruPengisi?: string | null;
    moodSikap?: number | null;
    interaksiTeman?: number | null;
    catatanPerilaku?: string | null;
    partisipasiBelajar?: number | null;
    responBermain?: number | null;
    catatanAktivitas?: string | null;
    makanSiang?: number | null;
    snack?: number | null;
    catatanMakan?: string | null;
    tidurSiang?: number | null;
    durasiTidur?: string | null;
    catatanTidur?: string | null;
    kegiatanHariIni?: string | null;
    catatanGuru?: string | null;
  } | null;
  preselectedAnakId?: string;
  preselectedTanggal?: string;
  onSuccess?: () => void;
}

export function DailyReportForm({
  open,
  onOpenChange,
  anakList,
  existingReport,
  preselectedAnakId,
  preselectedTanggal,
  onSuccess,
}: DailyReportFormProps) {
  const isEdit = !!existingReport;
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<DailyReportFormData>({
    anakId: '',
    tanggal: new Date().toISOString().split('T')[0],
    guruPengisi: '',
    moodSikap: undefined,
    interaksiTeman: undefined,
    catatanPerilaku: '',
    partisipasiBelajar: undefined,
    responBermain: undefined,
    catatanAktivitas: '',
    makanSiang: undefined,
    snack: undefined,
    catatanMakan: '',
    tidurSiang: undefined,
    durasiTidur: '',
    catatanTidur: '',
    kegiatanHariIni: [],
    catatanGuru: '',
  });

  // Reset form when dialog opens/closes
  useEffect(() => {
    if (open) {
      if (existingReport) {
        setFormData({
          anakId: existingReport.anakId,
          tanggal: new Date(existingReport.tanggal).toISOString().split('T')[0],
          guruPengisi: existingReport.guruPengisi || '',
          moodSikap: existingReport.moodSikap || undefined,
          interaksiTeman: existingReport.interaksiTeman || undefined,
          catatanPerilaku: existingReport.catatanPerilaku || '',
          partisipasiBelajar: existingReport.partisipasiBelajar || undefined,
          responBermain: existingReport.responBermain || undefined,
          catatanAktivitas: existingReport.catatanAktivitas || '',
          makanSiang: existingReport.makanSiang || undefined,
          snack: existingReport.snack || undefined,
          catatanMakan: existingReport.catatanMakan || '',
          tidurSiang: existingReport.tidurSiang || undefined,
          durasiTidur: existingReport.durasiTidur || '',
          catatanTidur: existingReport.catatanTidur || '',
          kegiatanHariIni: parseKegiatanHariIni(existingReport.kegiatanHariIni),
          catatanGuru: existingReport.catatanGuru || '',
        });
      } else {
        setFormData({
          anakId: preselectedAnakId || '',
          tanggal: preselectedTanggal || new Date().toISOString().split('T')[0],
          guruPengisi: '',
          moodSikap: undefined,
          interaksiTeman: undefined,
          catatanPerilaku: '',
          partisipasiBelajar: undefined,
          responBermain: undefined,
          catatanAktivitas: '',
          makanSiang: undefined,
          snack: undefined,
          catatanMakan: '',
          tidurSiang: undefined,
          durasiTidur: '',
          catatanTidur: '',
          kegiatanHariIni: [],
          catatanGuru: '',
        });
      }
    }
  }, [open, existingReport, preselectedAnakId, preselectedTanggal]);

  const toggleKegiatan = (kegiatan: string) => {
    const current = formData.kegiatanHariIni || [];
    if (current.includes(kegiatan)) {
      setFormData({
        ...formData,
        kegiatanHariIni: current.filter((k) => k !== kegiatan),
      });
    } else {
      setFormData({
        ...formData,
        kegiatanHariIni: [...current, kegiatan],
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!formData.anakId) {
      toast.error('Pilih anak terlebih dahulu');
      return;
    }

    if (!formData.tanggal) {
      toast.error('Tanggal wajib diisi');
      return;
    }

    setIsLoading(true);
    try {
      const url = isEdit
        ? `/api/daycare/daily-report/${existingReport!.id}`
        : '/api/daycare/daily-report';
      const method = isEdit ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Gagal menyimpan daily report');
      }

      toast.success(
        isEdit
          ? 'Daily report berhasil diperbarui'
          : 'Daily report berhasil dibuat'
      );
      onOpenChange(false);
      onSuccess?.();
    } catch (error) {
      console.error('Error saving daily report:', error);
      toast.error(
        error instanceof Error ? error.message : 'Gagal menyimpan daily report'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-[#006064] flex items-center gap-2">
            <ClipboardList className="w-6 h-6" />
            {isEdit ? 'Edit Daily Report' : 'Buat Daily Report Baru'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Header Info */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-[#00BCD4]/5 rounded-xl">
            <div className="space-y-2">
              <Label htmlFor="anakId" className="flex items-center gap-2">
                <Baby className="w-4 h-4 text-[#00BCD4]" />
                Pilih Anak *
              </Label>
              <Select
                value={formData.anakId}
                onValueChange={(value) =>
                  setFormData({ ...formData, anakId: value })
                }
                disabled={isEdit}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Pilih anak" />
                </SelectTrigger>
                <SelectContent>
                  {anakList.map((anak) => (
                    <SelectItem key={anak.id} value={anak.id}>
                      {anak.namaLengkap} ({anak.nomorInduk})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="tanggal">Tanggal *</Label>
              <Input
                id="tanggal"
                type="date"
                value={String(formData.tanggal).split('T')[0]}
                onChange={(e) =>
                  setFormData({ ...formData, tanggal: e.target.value })
                }
                disabled={isEdit}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="guruPengisi">Guru Pengisi</Label>
              <Input
                id="guruPengisi"
                value={formData.guruPengisi || ''}
                onChange={(e) =>
                  setFormData({ ...formData, guruPengisi: e.target.value })
                }
                placeholder="Nama guru/pengasuh"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Perilaku Section */}
            <Card className="border-pink-200">
              <CardHeader className="bg-pink-50 rounded-t-lg py-3">
                <CardTitle className="text-base font-semibold text-pink-700 flex items-center gap-2">
                  <Heart className="w-4 h-4" />
                  Perilaku
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4 space-y-4">
                <LikertScaleInput
                  type="perilaku"
                  label="Mood & Sikap"
                  value={formData.moodSikap}
                  onChange={(value) =>
                    setFormData({ ...formData, moodSikap: value })
                  }
                />
                <LikertScaleInput
                  type="perilaku"
                  label="Interaksi dengan Teman"
                  value={formData.interaksiTeman}
                  onChange={(value) =>
                    setFormData({ ...formData, interaksiTeman: value })
                  }
                />
                <div className="space-y-2">
                  <Label htmlFor="catatanPerilaku" className="text-sm">
                    Catatan Perilaku
                  </Label>
                  <Textarea
                    id="catatanPerilaku"
                    value={formData.catatanPerilaku || ''}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        catatanPerilaku: e.target.value,
                      })
                    }
                    placeholder="Catatan tambahan tentang perilaku anak..."
                    rows={2}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Aktivitas Section */}
            <Card className="border-blue-200">
              <CardHeader className="bg-blue-50 rounded-t-lg py-3">
                <CardTitle className="text-base font-semibold text-blue-700 flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  Aktivitas
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4 space-y-4">
                <LikertScaleInput
                  type="aktivitas"
                  label="Partisipasi Belajar"
                  value={formData.partisipasiBelajar}
                  onChange={(value) =>
                    setFormData({ ...formData, partisipasiBelajar: value })
                  }
                />
                <LikertScaleInput
                  type="aktivitas"
                  label="Respon Bermain"
                  value={formData.responBermain}
                  onChange={(value) =>
                    setFormData({ ...formData, responBermain: value })
                  }
                />
                <div className="space-y-2">
                  <Label htmlFor="catatanAktivitas" className="text-sm">
                    Catatan Aktivitas
                  </Label>
                  <Textarea
                    id="catatanAktivitas"
                    value={formData.catatanAktivitas || ''}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        catatanAktivitas: e.target.value,
                      })
                    }
                    placeholder="Catatan tambahan tentang aktivitas anak..."
                    rows={2}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Makan Section */}
            <Card className="border-orange-200">
              <CardHeader className="bg-orange-50 rounded-t-lg py-3">
                <CardTitle className="text-base font-semibold text-orange-700 flex items-center gap-2">
                  <Utensils className="w-4 h-4" />
                  Makan & Nutrisi
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4 space-y-4">
                <LikertScaleInput
                  type="makan"
                  label="Makan Siang"
                  value={formData.makanSiang}
                  onChange={(value) =>
                    setFormData({ ...formData, makanSiang: value })
                  }
                />
                <LikertScaleInput
                  type="makan"
                  label="Snack"
                  value={formData.snack}
                  onChange={(value) =>
                    setFormData({ ...formData, snack: value })
                  }
                />
                <div className="space-y-2">
                  <Label htmlFor="catatanMakan" className="text-sm">
                    Catatan Makan
                  </Label>
                  <Textarea
                    id="catatanMakan"
                    value={formData.catatanMakan || ''}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        catatanMakan: e.target.value,
                      })
                    }
                    placeholder="Menu yang dimakan, porsi, dll..."
                    rows={2}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Tidur Section */}
            <Card className="border-purple-200">
              <CardHeader className="bg-purple-50 rounded-t-lg py-3">
                <CardTitle className="text-base font-semibold text-purple-700 flex items-center gap-2">
                  <Moon className="w-4 h-4" />
                  Tidur Siang
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4 space-y-4">
                <LikertScaleInput
                  type="tidur"
                  label="Kemudahan Tidur"
                  value={formData.tidurSiang}
                  onChange={(value) =>
                    setFormData({ ...formData, tidurSiang: value })
                  }
                />
                <div className="space-y-2">
                  <Label htmlFor="durasiTidur" className="text-sm">
                    Durasi Tidur
                  </Label>
                  <Input
                    id="durasiTidur"
                    value={formData.durasiTidur || ''}
                    onChange={(e) =>
                      setFormData({ ...formData, durasiTidur: e.target.value })
                    }
                    placeholder="Contoh: 2 jam, 1.5 jam"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="catatanTidur" className="text-sm">
                    Catatan Tidur
                  </Label>
                  <Textarea
                    id="catatanTidur"
                    value={formData.catatanTidur || ''}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        catatanTidur: e.target.value,
                      })
                    }
                    placeholder="Kualitas tidur, gangguan, dll..."
                    rows={2}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Kegiatan Hari Ini */}
          <Card className="border-[#00BCD4]">
            <CardHeader className="bg-[#00BCD4]/10 rounded-t-lg py-3">
              <CardTitle className="text-base font-semibold text-[#006064] flex items-center gap-2">
                <ClipboardList className="w-4 h-4" />
                Kegiatan Hari Ini
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                {KEGIATAN_OPTIONS.map((kegiatan) => {
                  const isChecked = (formData.kegiatanHariIni || []).includes(
                    kegiatan.value
                  );
                  return (
                    <label
                      key={kegiatan.value}
                      className={`flex items-center gap-2 p-3 rounded-lg border cursor-pointer transition-all ${
                        isChecked
                          ? 'bg-[#00BCD4]/10 border-[#00BCD4] text-[#006064]'
                          : 'bg-white border-gray-200 hover:border-[#00BCD4]/50'
                      }`}
                    >
                      <Checkbox
                        checked={isChecked}
                        onCheckedChange={() => toggleKegiatan(kegiatan.value)}
                        className="data-[state=checked]:bg-[#00BCD4] data-[state=checked]:border-[#00BCD4]"
                      />
                      <span className="text-sm font-medium">
                        {kegiatan.label}
                      </span>
                    </label>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Catatan Guru */}
          <Card className="border-gray-200">
            <CardHeader className="bg-gray-50 rounded-t-lg py-3">
              <CardTitle className="text-base font-semibold text-gray-700 flex items-center gap-2">
                <MessageSquare className="w-4 h-4" />
                Catatan Umum Guru
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <Textarea
                id="catatanGuru"
                value={formData.catatanGuru || ''}
                onChange={(e) =>
                  setFormData({ ...formData, catatanGuru: e.target.value })
                }
                placeholder="Catatan umum untuk orang tua tentang hari ini..."
                rows={4}
              />
            </CardContent>
          </Card>

          <DialogFooter className="gap-2 pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              Batal
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="bg-[#00BCD4] hover:bg-[#006064] text-white"
            >
              {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              {isEdit ? 'Simpan Perubahan' : 'Simpan Daily Report'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
