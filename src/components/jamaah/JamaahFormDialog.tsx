// src/components/jamaah/JamaahFormDialog.tsx
'use client';

import React, { useState, useEffect } from 'react';
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
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Loader2, Save, X } from 'lucide-react';
import {
  Jamaah,
  JamaahFormData,
  SEBUTAN_OPTIONS,
  ALAMAT_RW_OPTIONS,
  ALAMAT_WILAYAH_OPTIONS,
  GENDER_OPTIONS,
} from '@/types/jamaah';

interface JamaahFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  jamaah?: Jamaah | null;
  onSuccess: () => void;
  mode?: 'masjid' | 'lazmu' | 'poliklinik';
}

const initialFormData: JamaahFormData = {
  nama: '',
  sebutan: '',
  anonymizeDisplay: false,
  nomerHandphone: '',
  email: '',
  alamatJalan: '',
  alamatRW: '',
  alamatRT: '',
  alamatWilayah: '',
  alamatDetail: '',
  gender: '',
  tanggalLahir: '',
  profesi: '',
  isJamaahAktif: true,
  isPengunjungKlinik: false,
  isDonatur: false,
  catatan: '',
};

export function JamaahFormDialog({
  open,
  onOpenChange,
  jamaah,
  onSuccess,
  mode = 'masjid',
}: JamaahFormDialogProps) {
  const [formData, setFormData] = useState<JamaahFormData>(initialFormData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isEditing = !!jamaah;

  useEffect(() => {
    if (jamaah) {
      setFormData({
        nama: jamaah.nama || '',
        sebutan: jamaah.sebutan || '',
        anonymizeDisplay: jamaah.anonymizeDisplay || false,
        nomerHandphone: jamaah.nomerHandphone || '',
        email: jamaah.email || '',
        alamatJalan: jamaah.alamatJalan || '',
        alamatRW: jamaah.alamatRW || '',
        alamatRT: jamaah.alamatRT || '',
        alamatWilayah: jamaah.alamatWilayah || '',
        alamatDetail: jamaah.alamatDetail || '',
        gender: jamaah.gender || '',
        tanggalLahir: jamaah.tanggalLahir
          ? new Date(jamaah.tanggalLahir).toISOString().split('T')[0]
          : '',
        profesi: jamaah.profesi || '',
        isJamaahAktif: jamaah.isJamaahAktif,
        isPengunjungKlinik: jamaah.isPengunjungKlinik,
        isDonatur: jamaah.isDonatur,
        catatan: jamaah.catatan || '',
      });
    } else {
      // Set default based on mode
      const defaults = { ...initialFormData };
      if (mode === 'lazmu') {
        defaults.isDonatur = true;
      } else if (mode === 'poliklinik') {
        defaults.isPengunjungKlinik = true;
      }
      setFormData(defaults);
    }
    setError(null);
  }, [jamaah, open, mode]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const payload = {
        ...formData,
        sebutan: formData.sebutan || null,
        alamatRW: formData.alamatRW || null,
        alamatWilayah: formData.alamatWilayah || null,
        gender: formData.gender || null,
        tanggalLahir: formData.tanggalLahir || null,
      };

      const url = isEditing ? `/api/jamaah/${jamaah.id}` : '/api/jamaah';
      const method = isEditing ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Terjadi kesalahan');
      }

      onSuccess();
      onOpenChange(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Terjadi kesalahan');
    } finally {
      setLoading(false);
    }
  };

  const getTitle = () => {
    if (isEditing) return 'Edit Data Jamaah';
    switch (mode) {
      case 'lazmu':
        return 'Tambah Donatur Baru';
      case 'poliklinik':
        return 'Tambah Pasien Baru';
      default:
        return 'Tambah Jamaah Baru';
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-[#006064]">{getTitle()}</DialogTitle>
          <DialogDescription>
            {isEditing
              ? 'Perbarui informasi jamaah di bawah ini.'
              : 'Isi data jamaah baru. Field dengan tanda (*) wajib diisi.'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm">
                {error}
              </div>
            )}

            {/* Nama & Sebutan */}
            <div className="grid grid-cols-4 gap-4">
              <div className="col-span-1">
                <Label htmlFor="sebutan">Sebutan</Label>
                <Select
                  value={formData.sebutan}
                  onValueChange={(value) =>
                    setFormData({ ...formData, sebutan: value as JamaahFormData['sebutan'] })
                  }
                >
                  <SelectTrigger className="border-2 focus:border-[#00BCD4] rounded-xl">
                    <SelectValue placeholder="Pilih" />
                  </SelectTrigger>
                  <SelectContent>
                    {SEBUTAN_OPTIONS.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="col-span-3">
                <Label htmlFor="nama">
                  Nama Lengkap <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="nama"
                  value={formData.nama}
                  onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
                  className="border-2 focus:border-[#00BCD4] rounded-xl"
                  placeholder="Masukkan nama lengkap"
                  required
                />
              </div>
            </div>

            {/* Gender & Tanggal Lahir */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="gender">Jenis Kelamin</Label>
                <Select
                  value={formData.gender}
                  onValueChange={(value) =>
                    setFormData({ ...formData, gender: value as JamaahFormData['gender'] })
                  }
                >
                  <SelectTrigger className="border-2 focus:border-[#00BCD4] rounded-xl">
                    <SelectValue placeholder="Pilih" />
                  </SelectTrigger>
                  <SelectContent>
                    {GENDER_OPTIONS.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="tanggalLahir">Tanggal Lahir</Label>
                <Input
                  id="tanggalLahir"
                  type="date"
                  value={formData.tanggalLahir}
                  onChange={(e) => setFormData({ ...formData, tanggalLahir: e.target.value })}
                  className="border-2 focus:border-[#00BCD4] rounded-xl"
                />
              </div>
            </div>

            {/* Profesi */}
            <div>
              <Label htmlFor="profesi">Profesi</Label>
              <Input
                id="profesi"
                value={formData.profesi}
                onChange={(e) => setFormData({ ...formData, profesi: e.target.value })}
                className="border-2 focus:border-[#00BCD4] rounded-xl"
                placeholder="Misal: Wiraswasta, PNS, Ibu Rumah Tangga, dll"
              />
            </div>

            {/* Kontak */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="nomerHandphone">No. HP/WhatsApp</Label>
                <Input
                  id="nomerHandphone"
                  value={formData.nomerHandphone}
                  onChange={(e) => setFormData({ ...formData, nomerHandphone: e.target.value })}
                  className="border-2 focus:border-[#00BCD4] rounded-xl"
                  placeholder="08xxxxxxxxxx"
                />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="border-2 focus:border-[#00BCD4] rounded-xl"
                  placeholder="email@example.com"
                />
              </div>
            </div>

            {/* Alamat */}
            <div className="space-y-4 p-4 bg-gray-50 rounded-xl">
              <h4 className="font-semibold text-[#006064]">Alamat</h4>

              <div>
                <Label htmlFor="alamatJalan">Jalan/Gang</Label>
                <Input
                  id="alamatJalan"
                  value={formData.alamatJalan}
                  onChange={(e) => setFormData({ ...formData, alamatJalan: e.target.value })}
                  className="border-2 focus:border-[#00BCD4] rounded-xl"
                  placeholder="Nama jalan atau gang"
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="alamatRT">RT</Label>
                  <Input
                    id="alamatRT"
                    value={formData.alamatRT}
                    onChange={(e) => setFormData({ ...formData, alamatRT: e.target.value })}
                    className="border-2 focus:border-[#00BCD4] rounded-xl"
                    placeholder="1-20"
                  />
                </div>
                <div>
                  <Label htmlFor="alamatRW">RW</Label>
                  <Select
                    value={formData.alamatRW}
                    onValueChange={(value) =>
                      setFormData({ ...formData, alamatRW: value as JamaahFormData['alamatRW'] })
                    }
                  >
                    <SelectTrigger className="border-2 focus:border-[#00BCD4] rounded-xl">
                      <SelectValue placeholder="Pilih RW" />
                    </SelectTrigger>
                    <SelectContent>
                      {ALAMAT_RW_OPTIONS.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value}>
                          {opt.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="alamatWilayah">Wilayah</Label>
                  <Select
                    value={formData.alamatWilayah}
                    onValueChange={(value) =>
                      setFormData({
                        ...formData,
                        alamatWilayah: value as JamaahFormData['alamatWilayah'],
                      })
                    }
                  >
                    <SelectTrigger className="border-2 focus:border-[#00BCD4] rounded-xl">
                      <SelectValue placeholder="Pilih Wilayah" />
                    </SelectTrigger>
                    <SelectContent>
                      {ALAMAT_WILAYAH_OPTIONS.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value}>
                          {opt.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {formData.alamatWilayah === 'Lainnya' && (
                <div>
                  <Label htmlFor="alamatDetail">Detail Wilayah Lainnya</Label>
                  <Input
                    id="alamatDetail"
                    value={formData.alamatDetail}
                    onChange={(e) => setFormData({ ...formData, alamatDetail: e.target.value })}
                    className="border-2 focus:border-[#00BCD4] rounded-xl"
                    placeholder="Kecamatan, Kota, dll"
                  />
                </div>
              )}
            </div>

            {/* Status Flags */}
            <div className="space-y-4 p-4 bg-gradient-to-r from-[#B2EBF2]/20 to-transparent rounded-xl">
              <h4 className="font-semibold text-[#006064]">Status</h4>
              <div className="grid grid-cols-3 gap-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="isJamaahAktif"
                    checked={formData.isJamaahAktif}
                    onCheckedChange={(checked) =>
                      setFormData({ ...formData, isJamaahAktif: checked as boolean })
                    }
                  />
                  <Label htmlFor="isJamaahAktif" className="font-normal cursor-pointer">
                    Jamaah Aktif
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="isPengunjungKlinik"
                    checked={formData.isPengunjungKlinik}
                    onCheckedChange={(checked) =>
                      setFormData({ ...formData, isPengunjungKlinik: checked as boolean })
                    }
                  />
                  <Label htmlFor="isPengunjungKlinik" className="font-normal cursor-pointer">
                    Pengunjung Klinik
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="isDonatur"
                    checked={formData.isDonatur}
                    onCheckedChange={(checked) =>
                      setFormData({ ...formData, isDonatur: checked as boolean })
                    }
                  />
                  <Label htmlFor="isDonatur" className="font-normal cursor-pointer">
                    Donatur LAZMU
                  </Label>
                </div>
              </div>
            </div>

            {/* Privacy */}
            <div className="flex items-center space-x-2 p-4 bg-yellow-50 rounded-xl">
              <Checkbox
                id="anonymizeDisplay"
                checked={formData.anonymizeDisplay}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, anonymizeDisplay: checked as boolean })
                }
              />
              <Label htmlFor="anonymizeDisplay" className="font-normal cursor-pointer">
                Samarkan nama saat ditampilkan (untuk privasi)
              </Label>
            </div>

            {/* Catatan */}
            <div>
              <Label htmlFor="catatan">Catatan</Label>
              <Textarea
                id="catatan"
                value={formData.catatan}
                onChange={(e) => setFormData({ ...formData, catatan: e.target.value })}
                className="border-2 focus:border-[#00BCD4] rounded-xl"
                placeholder="Catatan tambahan..."
                rows={3}
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="rounded-xl"
            >
              <X className="h-4 w-4 mr-2" />
              Batal
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="bg-gradient-to-r from-[#00BCD4] to-[#006064] hover:from-[#006064] hover:to-[#00BCD4] text-white rounded-xl"
            >
              {loading ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Save className="h-4 w-4 mr-2" />
              )}
              {isEditing ? 'Simpan Perubahan' : 'Simpan'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
