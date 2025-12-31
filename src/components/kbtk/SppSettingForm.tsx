'use client';

import React, { useState, useEffect } from 'react';
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
import { Loader2 } from 'lucide-react';
import {
  KbtkSettingSpp,
  SettingSppFormData,
  KELOMPOK_LEVEL_OPTIONS,
  getTahunAjaranOptions,
} from '@/types/kbtk';

interface SppSettingFormProps {
  setting?: KbtkSettingSpp | null;
  onSubmit: (data: SettingSppFormData) => Promise<void>;
  onCancel: () => void;
  loading?: boolean;
}

export function SppSettingForm({
  setting,
  onSubmit,
  onCancel,
  loading = false,
}: SppSettingFormProps) {
  const tahunAjaranOptions = getTahunAjaranOptions(5);
  const isEdit = !!setting;

  const [formData, setFormData] = useState<SettingSppFormData>({
    tahunAjaran: setting?.tahunAjaran || tahunAjaranOptions[0]?.value || '',
    kelompokLevel: (setting?.kelompokLevel as 'KB' | 'TK') || 'KB',
    nominalSpp: setting ? Number(setting.nominalSpp) : 0,
    keterangan: setting?.keterangan || '',
    isActive: setting?.isActive ?? true,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (setting) {
      setFormData({
        tahunAjaran: setting.tahunAjaran,
        kelompokLevel: setting.kelompokLevel as 'KB' | 'TK',
        nominalSpp: Number(setting.nominalSpp),
        keterangan: setting.keterangan || '',
        isActive: setting.isActive,
      });
    }
  }, [setting]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'nominalSpp' ? parseFloat(value) || 0 : value,
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

  const handleSwitchChange = (checked: boolean) => {
    setFormData((prev) => ({ ...prev, isActive: checked }));
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.tahunAjaran) {
      newErrors.tahunAjaran = 'Tahun ajaran wajib dipilih';
    }

    if (!formData.kelompokLevel) {
      newErrors.kelompokLevel = 'Kelompok level wajib dipilih';
    }

    if (!formData.nominalSpp || formData.nominalSpp <= 0) {
      newErrors.nominalSpp = 'Nominal SPP harus lebih dari 0';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    await onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Tahun Ajaran */}
      <div className="space-y-2">
        <Label htmlFor="tahunAjaran">Tahun Ajaran *</Label>
        <Select
          value={formData.tahunAjaran}
          onValueChange={(value) => handleSelectChange('tahunAjaran', value)}
          disabled={isEdit}
        >
          <SelectTrigger className={errors.tahunAjaran ? 'border-red-500' : ''}>
            <SelectValue placeholder="Pilih tahun ajaran" />
          </SelectTrigger>
          <SelectContent>
            {tahunAjaranOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.tahunAjaran && (
          <p className="text-sm text-red-500">{errors.tahunAjaran}</p>
        )}
        {isEdit && (
          <p className="text-xs text-gray-500">
            Tahun ajaran tidak dapat diubah untuk pengaturan yang sudah ada
          </p>
        )}
      </div>

      {/* Kelompok Level */}
      <div className="space-y-2">
        <Label htmlFor="kelompokLevel">Kelompok *</Label>
        <Select
          value={formData.kelompokLevel}
          onValueChange={(value) => handleSelectChange('kelompokLevel', value)}
          disabled={isEdit}
        >
          <SelectTrigger className={errors.kelompokLevel ? 'border-red-500' : ''}>
            <SelectValue placeholder="Pilih kelompok" />
          </SelectTrigger>
          <SelectContent>
            {KELOMPOK_LEVEL_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.kelompokLevel && (
          <p className="text-sm text-red-500">{errors.kelompokLevel}</p>
        )}
        {isEdit && (
          <p className="text-xs text-gray-500">
            Kelompok tidak dapat diubah untuk pengaturan yang sudah ada
          </p>
        )}
      </div>

      {/* Nominal SPP */}
      <div className="space-y-2">
        <Label htmlFor="nominalSpp">Nominal SPP Bulanan *</Label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
            Rp
          </span>
          <Input
            id="nominalSpp"
            name="nominalSpp"
            type="number"
            value={formData.nominalSpp || ''}
            onChange={handleChange}
            className={`pl-10 ${errors.nominalSpp ? 'border-red-500' : ''}`}
            placeholder="0"
          />
        </div>
        {errors.nominalSpp && (
          <p className="text-sm text-red-500">{errors.nominalSpp}</p>
        )}
      </div>

      {/* Keterangan */}
      <div className="space-y-2">
        <Label htmlFor="keterangan">Keterangan</Label>
        <Textarea
          id="keterangan"
          name="keterangan"
          value={formData.keterangan || ''}
          onChange={handleChange}
          placeholder="Keterangan tambahan (opsional)"
          rows={3}
        />
      </div>

      {/* Status Active */}
      <div className="flex items-center justify-between rounded-lg border p-4">
        <div className="space-y-0.5">
          <Label htmlFor="isActive">Status Aktif</Label>
          <p className="text-sm text-gray-500">
            Pengaturan yang aktif akan digunakan untuk generate tagihan
          </p>
        </div>
        <Switch
          id="isActive"
          checked={formData.isActive}
          onCheckedChange={handleSwitchChange}
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
          ) : isEdit ? (
            'Update Pengaturan'
          ) : (
            'Simpan Pengaturan'
          )}
        </Button>
      </div>
    </form>
  );
}
