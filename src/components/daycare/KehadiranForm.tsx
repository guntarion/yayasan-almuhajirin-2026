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
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { KehadiranFormData, DaycareAnak } from '@/types/daycare';
import { Loader2, Calendar, Clock, Baby, Check, X } from 'lucide-react';
import { toast } from 'sonner';

interface KehadiranFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  anakList: Pick<DaycareAnak, 'id' | 'namaLengkap' | 'nomorInduk'>[];
  existingKehadiran?: {
    id: string;
    anakId: string;
    tanggal: Date | string;
    jamMasuk?: Date | string | null;
    jamPulang?: Date | string | null;
    isHadir?: boolean;
    catatan?: string | null;
  } | null;
  preselectedAnakId?: string;
  preselectedTanggal?: string;
  onSuccess?: () => void;
}

export function KehadiranForm({
  open,
  onOpenChange,
  anakList,
  existingKehadiran,
  preselectedAnakId,
  preselectedTanggal,
  onSuccess,
}: KehadiranFormProps) {
  const isEdit = !!existingKehadiran;
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<KehadiranFormData>({
    anakId: '',
    tanggal: new Date().toISOString().split('T')[0],
    jamMasuk: undefined,
    jamPulang: undefined,
    isHadir: true,
    catatan: '',
  });

  // Reset form when dialog opens/closes
  useEffect(() => {
    if (open) {
      if (existingKehadiran) {
        const jamMasuk = existingKehadiran.jamMasuk
          ? new Date(existingKehadiran.jamMasuk).toTimeString().slice(0, 5)
          : '';
        const jamPulang = existingKehadiran.jamPulang
          ? new Date(existingKehadiran.jamPulang).toTimeString().slice(0, 5)
          : '';

        setFormData({
          anakId: existingKehadiran.anakId,
          tanggal: new Date(existingKehadiran.tanggal)
            .toISOString()
            .split('T')[0],
          jamMasuk: jamMasuk || undefined,
          jamPulang: jamPulang || undefined,
          isHadir: existingKehadiran.isHadir ?? true,
          catatan: existingKehadiran.catatan || '',
        });
      } else {
        setFormData({
          anakId: preselectedAnakId || '',
          tanggal: preselectedTanggal || new Date().toISOString().split('T')[0],
          jamMasuk: undefined,
          jamPulang: undefined,
          isHadir: true,
          catatan: '',
        });
      }
    }
  }, [open, existingKehadiran, preselectedAnakId, preselectedTanggal]);

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
      // Prepare datetime values
      const tanggal = formData.tanggal as string;
      const payload: Record<string, unknown> = {
        anakId: formData.anakId,
        tanggal: new Date(tanggal).toISOString(),
        isHadir: formData.isHadir,
        catatan: formData.catatan,
      };

      if (formData.jamMasuk) {
        const [hours, minutes] = (formData.jamMasuk as string).split(':');
        const jamMasukDate = new Date(tanggal);
        jamMasukDate.setHours(parseInt(hours), parseInt(minutes));
        payload.jamMasuk = jamMasukDate.toISOString();
      }

      if (formData.jamPulang) {
        const [hours, minutes] = (formData.jamPulang as string).split(':');
        const jamPulangDate = new Date(tanggal);
        jamPulangDate.setHours(parseInt(hours), parseInt(minutes));
        payload.jamPulang = jamPulangDate.toISOString();
      }

      const url = isEdit
        ? `/api/daycare/kehadiran-harian/${existingKehadiran!.id}`
        : '/api/daycare/kehadiran-harian';
      const method = isEdit ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Gagal menyimpan kehadiran');
      }

      toast.success(
        isEdit
          ? 'Kehadiran berhasil diperbarui'
          : 'Kehadiran berhasil dicatat'
      );
      onOpenChange(false);
      onSuccess?.();
    } catch (error) {
      console.error('Error saving kehadiran:', error);
      toast.error(
        error instanceof Error ? error.message : 'Gagal menyimpan kehadiran'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-[#006064] flex items-center gap-2">
            <Calendar className="w-6 h-6" />
            {isEdit ? 'Edit Kehadiran' : 'Catat Kehadiran'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Anak Selection */}
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

          {/* Tanggal */}
          <div className="space-y-2">
            <Label htmlFor="tanggal" className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-[#00BCD4]" />
              Tanggal *
            </Label>
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

          {/* Status Kehadiran */}
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-2">
              {formData.isHadir ? (
                <Check className="w-5 h-5 text-green-600" />
              ) : (
                <X className="w-5 h-5 text-red-600" />
              )}
              <Label
                htmlFor="isHadir"
                className={`font-medium ${
                  formData.isHadir ? 'text-green-700' : 'text-red-700'
                }`}
              >
                {formData.isHadir ? 'Hadir' : 'Tidak Hadir'}
              </Label>
            </div>
            <Switch
              id="isHadir"
              checked={formData.isHadir ?? true}
              onCheckedChange={(checked) =>
                setFormData({ ...formData, isHadir: checked })
              }
              className="data-[state=checked]:bg-green-500"
            />
          </div>

          {/* Jam Masuk & Pulang - Only show if hadir */}
          {formData.isHadir && (
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="jamMasuk" className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-[#00BCD4]" />
                  Jam Masuk
                </Label>
                <Input
                  id="jamMasuk"
                  type="time"
                  value={(formData.jamMasuk as string) || ''}
                  onChange={(e) =>
                    setFormData({ ...formData, jamMasuk: e.target.value })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="jamPulang" className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-gray-400" />
                  Jam Pulang
                </Label>
                <Input
                  id="jamPulang"
                  type="time"
                  value={(formData.jamPulang as string) || ''}
                  onChange={(e) =>
                    setFormData({ ...formData, jamPulang: e.target.value })
                  }
                />
              </div>
            </div>
          )}

          {/* Catatan */}
          <div className="space-y-2">
            <Label htmlFor="catatan">Catatan</Label>
            <Textarea
              id="catatan"
              value={formData.catatan || ''}
              onChange={(e) =>
                setFormData({ ...formData, catatan: e.target.value })
              }
              placeholder="Catatan kehadiran (opsional)..."
              rows={2}
            />
          </div>

          <DialogFooter className="gap-2 pt-4">
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
              {isEdit ? 'Simpan Perubahan' : 'Simpan Kehadiran'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// Quick attendance input component for batch entry
interface QuickKehadiranInputProps {
  anak: Pick<DaycareAnak, 'id' | 'namaLengkap' | 'nomorInduk' | 'paketLayanan'>;
  tanggal: string;
  existingKehadiran?: {
    id: string;
    isHadir: boolean;
    jamMasuk?: Date | string | null;
    jamPulang?: Date | string | null;
  } | null;
  onSave: (data: KehadiranFormData) => Promise<void>;
  disabled?: boolean;
}

export function QuickKehadiranInput({
  anak,
  tanggal,
  existingKehadiran,
  onSave,
  disabled = false,
}: QuickKehadiranInputProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isHadir, setIsHadir] = useState(existingKehadiran?.isHadir ?? true);
  const [jamMasuk, setJamMasuk] = useState(
    existingKehadiran?.jamMasuk
      ? new Date(existingKehadiran.jamMasuk).toTimeString().slice(0, 5)
      : '07:00'
  );

  const handleSave = async () => {
    setIsLoading(true);
    try {
      const [hours, minutes] = jamMasuk.split(':');
      const jamMasukDate = new Date(tanggal);
      jamMasukDate.setHours(parseInt(hours), parseInt(minutes));

      await onSave({
        anakId: anak.id,
        tanggal,
        jamMasuk: jamMasukDate.toISOString(),
        isHadir,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-3 p-3 bg-white border rounded-lg">
      <div className="flex-1">
        <p className="font-medium text-[#006064]">{anak.namaLengkap}</p>
        <p className="text-xs text-gray-500">{anak.nomorInduk}</p>
      </div>

      <div className="flex items-center gap-2">
        <Switch
          checked={isHadir}
          onCheckedChange={setIsHadir}
          disabled={disabled || isLoading}
          className="data-[state=checked]:bg-green-500"
        />

        {isHadir && (
          <Input
            type="time"
            value={jamMasuk}
            onChange={(e) => setJamMasuk(e.target.value)}
            className="w-24"
            disabled={disabled || isLoading}
          />
        )}

        <Button
          size="sm"
          onClick={handleSave}
          disabled={disabled || isLoading}
          className="bg-[#00BCD4] hover:bg-[#006064] text-white"
        >
          {isLoading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : existingKehadiran ? (
            'Update'
          ) : (
            'Simpan'
          )}
        </Button>
      </div>
    </div>
  );
}
