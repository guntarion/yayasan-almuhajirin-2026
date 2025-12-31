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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  AnakFormData,
  AnakListItem,
  AnakWithRelations,
  JENIS_KELAMIN_OPTIONS,
  PAKET_LAYANAN_OPTIONS,
  STATUS_ANAK_OPTIONS,
} from '@/types/daycare';
import { Loader2, Heart, Moon, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';

interface AnakFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  anak?: AnakListItem | AnakWithRelations | null;
  onSuccess?: () => void;
}

export function AnakFormDialog({
  open,
  onOpenChange,
  anak,
  onSuccess,
}: AnakFormDialogProps) {
  const isEdit = !!anak;
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<AnakFormData>({
    namaLengkap: '',
    namaPanggilan: '',
    jenisKelamin: 'lelaki',
    tanggalLahir: '',
    tempatLahir: '',
    paketLayanan: 'FULLDAY',
    tanggalMulai: '',
    alamat: '',
    alergiMakanan: '',
    catatanKesehatan: '',
    kebiasaanTidur: '',
    catatanKhusus: '',
  });

  // Reset form when dialog opens/closes or anak changes
  useEffect(() => {
    if (open) {
      if (anak) {
        setFormData({
          namaLengkap: anak.namaLengkap,
          namaPanggilan: anak.namaPanggilan || '',
          jenisKelamin: anak.jenisKelamin as 'lelaki' | 'perempuan',
          tanggalLahir: anak.tanggalLahir
            ? new Date(anak.tanggalLahir).toISOString().split('T')[0]
            : '',
          tempatLahir: (anak as AnakWithRelations).tempatLahir || '',
          paketLayanan: anak.paketLayanan as 'FULLDAY' | 'AFTER_SCHOOL' | 'HARIAN',
          tanggalMulai: (anak as AnakWithRelations).tanggalMulai
            ? new Date((anak as AnakWithRelations).tanggalMulai!).toISOString().split('T')[0]
            : '',
          alamat: (anak as AnakWithRelations).alamat || '',
          alergiMakanan: (anak as AnakWithRelations).alergiMakanan || '',
          catatanKesehatan: (anak as AnakWithRelations).catatanKesehatan || '',
          kebiasaanTidur: (anak as AnakWithRelations).kebiasaanTidur || '',
          catatanKhusus: (anak as AnakWithRelations).catatanKhusus || '',
        });
      } else {
        setFormData({
          namaLengkap: '',
          namaPanggilan: '',
          jenisKelamin: 'lelaki',
          tanggalLahir: '',
          tempatLahir: '',
          paketLayanan: 'FULLDAY',
          tanggalMulai: new Date().toISOString().split('T')[0],
          alamat: '',
          alergiMakanan: '',
          catatanKesehatan: '',
          kebiasaanTidur: '',
          catatanKhusus: '',
        });
      }
    }
  }, [open, anak]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!formData.namaLengkap.trim()) {
      toast.error('Nama lengkap wajib diisi');
      return;
    }

    if (!formData.tanggalLahir) {
      toast.error('Tanggal lahir wajib diisi');
      return;
    }

    if (!formData.alergiMakanan?.trim()) {
      toast.error('Informasi alergi makanan wajib diisi (isi "Tidak ada" jika tidak ada alergi)');
      return;
    }

    setIsLoading(true);
    try {
      const url = isEdit ? `/api/daycare/anak/${anak!.id}` : '/api/daycare/anak';
      const method = isEdit ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Gagal menyimpan data anak');
      }

      toast.success(isEdit ? 'Data anak berhasil diperbarui' : 'Anak berhasil ditambahkan');
      onOpenChange(false);
      onSuccess?.();
    } catch (error) {
      console.error('Error saving anak:', error);
      toast.error(error instanceof Error ? error.message : 'Gagal menyimpan data anak');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-[#006064]">
            {isEdit ? 'Edit Data Anak' : 'Tambah Anak Baru'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="font-semibold text-[#006064] border-b border-[#00BCD4]/30 pb-2">
              Data Diri Anak
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="namaLengkap">Nama Lengkap *</Label>
                <Input
                  id="namaLengkap"
                  value={formData.namaLengkap}
                  onChange={(e) => setFormData({ ...formData, namaLengkap: e.target.value })}
                  placeholder="Masukkan nama lengkap"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="namaPanggilan">Nama Panggilan</Label>
                <Input
                  id="namaPanggilan"
                  value={formData.namaPanggilan || ''}
                  onChange={(e) => setFormData({ ...formData, namaPanggilan: e.target.value })}
                  placeholder="Masukkan nama panggilan"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="jenisKelamin">Jenis Kelamin *</Label>
                <Select
                  value={formData.jenisKelamin}
                  onValueChange={(value: 'lelaki' | 'perempuan') =>
                    setFormData({ ...formData, jenisKelamin: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih jenis kelamin" />
                  </SelectTrigger>
                  <SelectContent>
                    {JENIS_KELAMIN_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="tempatLahir">Tempat Lahir</Label>
                <Input
                  id="tempatLahir"
                  value={formData.tempatLahir || ''}
                  onChange={(e) => setFormData({ ...formData, tempatLahir: e.target.value })}
                  placeholder="Masukkan tempat lahir"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="tanggalLahir">Tanggal Lahir *</Label>
                <Input
                  id="tanggalLahir"
                  type="date"
                  value={formData.tanggalLahir ? String(formData.tanggalLahir).split('T')[0] : ''}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      tanggalLahir: e.target.value,
                    })
                  }
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="paketLayanan">Paket Layanan *</Label>
                <Select
                  value={formData.paketLayanan}
                  onValueChange={(value: 'FULLDAY' | 'AFTER_SCHOOL' | 'HARIAN') =>
                    setFormData({ ...formData, paketLayanan: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih paket layanan" />
                  </SelectTrigger>
                  <SelectContent>
                    {PAKET_LAYANAN_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        <div className="flex flex-col">
                          <span>{option.label}</span>
                          <span className="text-xs text-gray-500">{option.description}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="tanggalMulai">Tanggal Mulai</Label>
                <Input
                  id="tanggalMulai"
                  type="date"
                  value={formData.tanggalMulai ? String(formData.tanggalMulai).split('T')[0] : ''}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      tanggalMulai: e.target.value,
                    })
                  }
                />
              </div>

              {isEdit && (
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select
                    value={(anak as AnakWithRelations)?.status || 'aktif'}
                    disabled
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih status" />
                    </SelectTrigger>
                    <SelectContent>
                      {STATUS_ANAK_OPTIONS.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-gray-500">Status hanya bisa diubah melalui menu khusus</p>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="alamat">Alamat</Label>
              <Textarea
                id="alamat"
                value={formData.alamat || ''}
                onChange={(e) => setFormData({ ...formData, alamat: e.target.value })}
                placeholder="Masukkan alamat lengkap"
                rows={2}
              />
            </div>
          </div>

          {/* Health Information */}
          <div className="space-y-4">
            <h3 className="font-semibold text-[#006064] border-b border-[#00BCD4]/30 pb-2 flex items-center gap-2">
              <Heart className="w-4 h-4 text-pink-500" />
              Informasi Kesehatan
            </h3>

            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-2">
                <Label htmlFor="alergiMakanan" className="flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-orange-500" />
                  Alergi Makanan *
                </Label>
                <Textarea
                  id="alergiMakanan"
                  value={formData.alergiMakanan || ''}
                  onChange={(e) => setFormData({ ...formData, alergiMakanan: e.target.value })}
                  placeholder="Contoh: Susu sapi, kacang tanah, seafood, dll. Tulis 'Tidak ada' jika tidak ada alergi."
                  rows={2}
                  className="border-orange-200 focus:border-orange-500"
                  required
                />
                <p className="text-xs text-orange-600">
                  Wajib diisi untuk keselamatan anak. Tulis &quot;Tidak ada&quot; jika tidak ada alergi.
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="catatanKesehatan">Catatan Kesehatan</Label>
                <Textarea
                  id="catatanKesehatan"
                  value={formData.catatanKesehatan || ''}
                  onChange={(e) => setFormData({ ...formData, catatanKesehatan: e.target.value })}
                  placeholder="Riwayat penyakit, kondisi khusus, obat-obatan rutin, dll."
                  rows={2}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="kebiasaanTidur" className="flex items-center gap-2">
                  <Moon className="w-4 h-4 text-purple-500" />
                  Kebiasaan Tidur
                </Label>
                <Textarea
                  id="kebiasaanTidur"
                  value={formData.kebiasaanTidur || ''}
                  onChange={(e) => setFormData({ ...formData, kebiasaanTidur: e.target.value })}
                  placeholder="Contoh: Butuh selimut khusus, harus ditemani sampai tidur, dll."
                  rows={2}
                />
              </div>
            </div>
          </div>

          {/* Additional Notes */}
          <div className="space-y-4">
            <h3 className="font-semibold text-[#006064] border-b border-[#00BCD4]/30 pb-2">
              Catatan Tambahan
            </h3>

            <div className="space-y-2">
              <Label htmlFor="catatanKhusus">Catatan Khusus</Label>
              <Textarea
                id="catatanKhusus"
                value={formData.catatanKhusus || ''}
                onChange={(e) => setFormData({ ...formData, catatanKhusus: e.target.value })}
                placeholder="Kebutuhan khusus, preferensi, hal-hal yang perlu diperhatikan, dll."
                rows={3}
              />
            </div>
          </div>

          <DialogFooter className="gap-2">
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
              {isEdit ? 'Simpan Perubahan' : 'Tambah Anak'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
