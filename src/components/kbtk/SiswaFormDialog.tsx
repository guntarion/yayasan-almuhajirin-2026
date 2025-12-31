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
import { OrangTuaForm } from './OrangTuaForm';
import {
  SiswaFormData,
  OrangTuaFormData,
  KbtkSiswaWithRelations,
  GENDER_OPTIONS,
  KELOMPOK_LEVEL_OPTIONS,
  KELOMPOK_KELAS_OPTIONS,
  STATUS_SISWA_OPTIONS,
  getTahunAjaranOptions,
  getTahunAjaranSekarang,
} from '@/types/kbtk';
import { Loader2, Plus, User } from 'lucide-react';
import { toast } from 'sonner';

interface SiswaFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  siswa?: KbtkSiswaWithRelations | null;
  onSuccess?: () => void;
}

export function SiswaFormDialog({
  open,
  onOpenChange,
  siswa,
  onSuccess,
}: SiswaFormDialogProps) {
  const isEdit = !!siswa;
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<SiswaFormData>({
    namaLengkap: '',
    namaPanggilan: '',
    jenisKelamin: 'lelaki',
    tanggalLahir: null,
    tempatLahir: '',
    kelompokLevel: 'KB',
    kelompokKelas: 'A',
    tahunAjaran: getTahunAjaranSekarang(),
    tanggalMasuk: new Date(),
    status: 'aktif',
    alamat: '',
    catatanKhusus: '',
    orangTua: [],
  });

  const tahunAjaranOptions = getTahunAjaranOptions(5);

  // Reset form when dialog opens/closes or siswa changes
  useEffect(() => {
    if (open) {
      if (siswa) {
        setFormData({
          namaLengkap: siswa.namaLengkap,
          namaPanggilan: siswa.namaPanggilan || '',
          jenisKelamin: siswa.jenisKelamin as 'lelaki' | 'perempuan',
          tanggalLahir: siswa.tanggalLahir ? new Date(siswa.tanggalLahir) : null,
          tempatLahir: siswa.tempatLahir || '',
          kelompokLevel: siswa.kelompokLevel as 'KB' | 'TK',
          kelompokKelas: siswa.kelompokKelas as 'A' | 'B',
          tahunAjaran: siswa.tahunAjaran,
          tanggalMasuk: siswa.tanggalMasuk ? new Date(siswa.tanggalMasuk) : new Date(),
          status: siswa.status as 'aktif' | 'cuti' | 'lulus' | 'keluar',
          alamat: siswa.alamat || '',
          catatanKhusus: siswa.catatanKhusus || '',
          orangTua: siswa.orangTua?.map(ot => ({
            id: ot.id,
            nama: ot.nama,
            relasi: ot.relasi as 'ayah' | 'ibu' | 'wali',
            nomorHP: ot.nomorHP || '',
            email: ot.email || '',
            pekerjaan: ot.pekerjaan || '',
            alamat: ot.alamat || '',
            isPrimary: ot.isPrimary,
          })) || [],
        });
      } else {
        setFormData({
          namaLengkap: '',
          namaPanggilan: '',
          jenisKelamin: 'lelaki',
          tanggalLahir: null,
          tempatLahir: '',
          kelompokLevel: 'KB',
          kelompokKelas: 'A',
          tahunAjaran: getTahunAjaranSekarang(),
          tanggalMasuk: new Date(),
          status: 'aktif',
          alamat: '',
          catatanKhusus: '',
          orangTua: [],
        });
      }
    }
  }, [open, siswa]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.namaLengkap.trim()) {
      toast.error('Nama lengkap wajib diisi');
      return;
    }

    setIsLoading(true);
    try {
      const url = isEdit ? `/api/kbtk/siswa/${siswa.id}` : '/api/kbtk/siswa';
      const method = isEdit ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Gagal menyimpan data siswa');
      }

      toast.success(isEdit ? 'Siswa berhasil diperbarui' : 'Siswa berhasil ditambahkan');
      onOpenChange(false);
      onSuccess?.();
    } catch (error) {
      console.error('Error saving siswa:', error);
      toast.error(error instanceof Error ? error.message : 'Gagal menyimpan data siswa');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOrangTuaChange = (index: number, data: OrangTuaFormData) => {
    const newOrangTua = [...(formData.orangTua || [])];
    newOrangTua[index] = data;
    setFormData({ ...formData, orangTua: newOrangTua });
  };

  const handleOrangTuaRemove = (index: number) => {
    const newOrangTua = [...(formData.orangTua || [])];
    newOrangTua.splice(index, 1);
    setFormData({ ...formData, orangTua: newOrangTua });
  };

  const addOrangTua = () => {
    const isFirst = !formData.orangTua || formData.orangTua.length === 0;
    setFormData({
      ...formData,
      orangTua: [
        ...(formData.orangTua || []),
        {
          nama: '',
          relasi: 'ayah',
          nomorHP: '',
          email: '',
          pekerjaan: '',
          alamat: '',
          isPrimary: isFirst,
        },
      ],
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-[#006064]">
            {isEdit ? 'Edit Data Siswa' : 'Tambah Siswa Baru'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="font-semibold text-[#006064] border-b border-[#00BCD4]/30 pb-2">
              Data Diri Siswa
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
                    {GENDER_OPTIONS.map((option) => (
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
                <Label htmlFor="tanggalLahir">Tanggal Lahir</Label>
                <Input
                  id="tanggalLahir"
                  type="date"
                  value={formData.tanggalLahir ? new Date(formData.tanggalLahir).toISOString().split('T')[0] : ''}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      tanggalLahir: e.target.value ? new Date(e.target.value) : null,
                    })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="tanggalMasuk">Tanggal Masuk</Label>
                <Input
                  id="tanggalMasuk"
                  type="date"
                  value={formData.tanggalMasuk ? new Date(formData.tanggalMasuk).toISOString().split('T')[0] : ''}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      tanggalMasuk: e.target.value ? new Date(e.target.value) : undefined,
                    })
                  }
                />
              </div>
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

          {/* Academic Information */}
          <div className="space-y-4">
            <h3 className="font-semibold text-[#006064] border-b border-[#00BCD4]/30 pb-2">
              Data Akademik
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label htmlFor="kelompokLevel">Kelompok *</Label>
                <Select
                  value={formData.kelompokLevel}
                  onValueChange={(value: 'KB' | 'TK') =>
                    setFormData({ ...formData, kelompokLevel: value })
                  }
                >
                  <SelectTrigger>
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
              </div>

              <div className="space-y-2">
                <Label htmlFor="kelompokKelas">Kelas</Label>
                <Select
                  value={formData.kelompokKelas || 'A'}
                  onValueChange={(value: 'A' | 'B') =>
                    setFormData({ ...formData, kelompokKelas: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih kelas" />
                  </SelectTrigger>
                  <SelectContent>
                    {KELOMPOK_KELAS_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="tahunAjaran">Tahun Ajaran *</Label>
                <Select
                  value={formData.tahunAjaran}
                  onValueChange={(value) => setFormData({ ...formData, tahunAjaran: value })}
                >
                  <SelectTrigger>
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
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  value={formData.status || 'aktif'}
                  onValueChange={(value: 'aktif' | 'cuti' | 'lulus' | 'keluar') =>
                    setFormData({ ...formData, status: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih status" />
                  </SelectTrigger>
                  <SelectContent>
                    {STATUS_SISWA_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="catatanKhusus">Catatan Khusus</Label>
              <Textarea
                id="catatanKhusus"
                value={formData.catatanKhusus || ''}
                onChange={(e) => setFormData({ ...formData, catatanKhusus: e.target.value })}
                placeholder="Alergi, kebutuhan khusus, dll"
                rows={2}
              />
            </div>
          </div>

          {/* Orang Tua Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-[#00BCD4]/30 pb-2">
              <h3 className="font-semibold text-[#006064]">Data Orang Tua / Wali</h3>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addOrangTua}
                className="border-[#00BCD4] text-[#006064] hover:bg-[#00BCD4]/10"
              >
                <Plus className="w-4 h-4 mr-1" />
                Tambah Orang Tua
              </Button>
            </div>

            {formData.orangTua && formData.orangTua.length > 0 ? (
              <div className="space-y-4">
                {formData.orangTua.map((ot, index) => (
                  <OrangTuaForm
                    key={index}
                    data={ot}
                    index={index}
                    onChange={(data) => handleOrangTuaChange(index, data)}
                    onRemove={() => handleOrangTuaRemove(index)}
                    canRemove={formData.orangTua!.length > 1}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
                <User className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-500 mb-3">Belum ada data orang tua</p>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addOrangTua}
                  className="border-[#00BCD4] text-[#006064] hover:bg-[#00BCD4]/10"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Tambah Orang Tua
                </Button>
              </div>
            )}
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
              {isEdit ? 'Simpan Perubahan' : 'Tambah Siswa'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
