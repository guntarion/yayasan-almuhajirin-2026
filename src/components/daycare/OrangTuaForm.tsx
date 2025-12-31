'use client';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { OrangTuaFormData, RELASI_OPTIONS } from '@/types/daycare';
import { Trash2, Phone, Mail, Star, PhoneCall } from 'lucide-react';

interface OrangTuaFormProps {
  data: OrangTuaFormData;
  index: number;
  onChange: (data: OrangTuaFormData) => void;
  onRemove: () => void;
  canRemove?: boolean;
}

function getWhatsAppLink(phone: string): string {
  const cleaned = phone.replace(/\D/g, '');
  const formatted = cleaned.startsWith('0') ? '62' + cleaned.slice(1) : cleaned;
  return `https://wa.me/${formatted}`;
}

export function OrangTuaForm({
  data,
  index,
  onChange,
  onRemove,
  canRemove = true,
}: OrangTuaFormProps) {
  const handleChange = (field: keyof OrangTuaFormData, value: string | boolean) => {
    onChange({ ...data, [field]: value });
  };

  const relasiLabel = RELASI_OPTIONS.find(r => r.value === data.relasi)?.label || data.relasi;

  return (
    <Card className="border border-[#00BCD4]/30 bg-gradient-to-br from-white to-[#00BCD4]/5">
      <CardHeader className="pb-3 pt-4 px-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium text-[#006064] flex items-center gap-2">
            {data.isPrimary && (
              <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
            )}
            {relasiLabel || `Orang Tua ${index + 1}`}
            {data.nama && ` - ${data.nama}`}
          </CardTitle>
          {canRemove && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={onRemove}
              className="text-red-500 hover:text-red-700 hover:bg-red-50 h-8 w-8 p-0"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="px-4 pb-4 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor={`nama-${index}`}>Nama *</Label>
            <Input
              id={`nama-${index}`}
              value={data.nama}
              onChange={(e) => handleChange('nama', e.target.value)}
              placeholder="Nama orang tua"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor={`relasi-${index}`}>Relasi *</Label>
            <Select
              value={data.relasi}
              onValueChange={(value: 'ayah' | 'ibu' | 'wali') => handleChange('relasi', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Pilih relasi" />
              </SelectTrigger>
              <SelectContent>
                {RELASI_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor={`nomorHP-${index}`}>Nomor HP</Label>
            <div className="flex gap-2">
              <Input
                id={`nomorHP-${index}`}
                value={data.nomorHP || ''}
                onChange={(e) => handleChange('nomorHP', e.target.value)}
                placeholder="08xxxxxxxxxx"
                className="flex-1"
              />
              {data.nomorHP && (
                <a
                  href={getWhatsAppLink(data.nomorHP)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center w-9 h-9 rounded-md border border-green-500 text-green-600 hover:bg-green-50"
                >
                  <Phone className="w-4 h-4" />
                </a>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor={`nomorHPDarurat-${index}`} className="flex items-center gap-2">
              <PhoneCall className="w-4 h-4 text-red-500" />
              Nomor HP Darurat
            </Label>
            <Input
              id={`nomorHPDarurat-${index}`}
              value={data.nomorHPDarurat || ''}
              onChange={(e) => handleChange('nomorHPDarurat', e.target.value)}
              placeholder="Nomor untuk keadaan darurat"
              className="border-red-200 focus:border-red-500"
            />
            <p className="text-xs text-gray-500">
              Nomor alternatif untuk dihubungi saat darurat
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor={`email-${index}`}>Email</Label>
            <div className="flex gap-2">
              <Input
                id={`email-${index}`}
                type="email"
                value={data.email || ''}
                onChange={(e) => handleChange('email', e.target.value)}
                placeholder="email@example.com"
                className="flex-1"
              />
              {data.email && (
                <a
                  href={`mailto:${data.email}`}
                  className="inline-flex items-center justify-center w-9 h-9 rounded-md border border-blue-500 text-blue-600 hover:bg-blue-50"
                >
                  <Mail className="w-4 h-4" />
                </a>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor={`pekerjaan-${index}`}>Pekerjaan</Label>
            <Input
              id={`pekerjaan-${index}`}
              value={data.pekerjaan || ''}
              onChange={(e) => handleChange('pekerjaan', e.target.value)}
              placeholder="Pekerjaan"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor={`alamat-${index}`}>Alamat</Label>
          <Textarea
            id={`alamat-${index}`}
            value={data.alamat || ''}
            onChange={(e) => handleChange('alamat', e.target.value)}
            placeholder="Alamat (jika berbeda dari anak)"
            rows={2}
          />
        </div>

        <div className="flex items-center space-x-2 pt-2">
          <Checkbox
            id={`isPrimary-${index}`}
            checked={data.isPrimary || false}
            onCheckedChange={(checked) => handleChange('isPrimary', checked === true)}
          />
          <Label
            htmlFor={`isPrimary-${index}`}
            className="text-sm font-normal cursor-pointer flex items-center gap-1"
          >
            <Star className="w-4 h-4 text-yellow-500" />
            Kontak Utama (untuk penagihan & komunikasi)
          </Label>
        </div>
      </CardContent>
    </Card>
  );
}
