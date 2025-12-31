// src/components/poliklinik/PasienFormDialog.tsx
'use client';

import React, { useEffect, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
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
import { AlertCircle, Loader2, Search, UserPlus } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  PasienFormData,
  STATUS_PERNIKAHAN_OPTIONS,
  GOLONGAN_DARAH_OPTIONS,
  GENDER_OPTIONS,
  PasienKlinikWithRelations,
} from '@/types/poliklinik';
import { Jamaah } from '@prisma/client';

interface PasienFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  pasien?: PasienKlinikWithRelations | null;
  onSuccess?: () => void;
}

export function PasienFormDialog({
  open,
  onOpenChange,
  pasien,
  onSuccess,
}: PasienFormDialogProps) {
  const isEdit = !!pasien;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Jamaah lookup state
  const [searchJamaah, setSearchJamaah] = useState('');
  const [jamaahList, setJamaahList] = useState<Jamaah[]>([]);
  const [searchingJamaah, setSearchingJamaah] = useState(false);
  const [selectedJamaah, setSelectedJamaah] = useState<Jamaah | null>(null);

  // Form state
  const [formData, setFormData] = useState<PasienFormData>({
    namaLengkap: '',
    jenisKelamin: 'lelaki',
    tanggalLahir: null,
    tempatLahir: null,
    golonganDarah: null,
    alamat: null,
    nomorHP: null,
    nomorHPDarurat: null,
    statusPernikahan: null,
    pekerjaan: null,
    penanggungJawab: null,
    hubunganPenanggungJawab: null,
    riwayatAlergi: null,
    riwayatPenyakitKronis: null,
    catatanKhusus: null,
  });

  // Reset form when dialog opens/closes or pasien changes
  useEffect(() => {
    if (open) {
      if (pasien) {
        setFormData({
          jamaahId: pasien.jamaahId,
          namaLengkap: pasien.namaLengkap,
          jenisKelamin: pasien.jenisKelamin as 'lelaki' | 'perempuan',
          tanggalLahir: pasien.tanggalLahir,
          tempatLahir: pasien.tempatLahir,
          golonganDarah: pasien.golonganDarah as PasienFormData['golonganDarah'],
          alamat: pasien.alamat,
          nomorHP: pasien.nomorHP,
          nomorHPDarurat: pasien.nomorHPDarurat,
          statusPernikahan: pasien.statusPernikahan as PasienFormData['statusPernikahan'],
          pekerjaan: pasien.pekerjaan,
          penanggungJawab: pasien.penanggungJawab,
          hubunganPenanggungJawab: pasien.hubunganPenanggungJawab,
          riwayatAlergi: pasien.riwayatAlergi,
          riwayatPenyakitKronis: pasien.riwayatPenyakitKronis,
          catatanKhusus: pasien.catatanKhusus,
        });
        setSelectedJamaah(pasien.jamaah || null);
      } else {
        setFormData({
          namaLengkap: '',
          jenisKelamin: 'lelaki',
          tanggalLahir: null,
          tempatLahir: null,
          golonganDarah: null,
          alamat: null,
          nomorHP: null,
          nomorHPDarurat: null,
          statusPernikahan: null,
          pekerjaan: null,
          penanggungJawab: null,
          hubunganPenanggungJawab: null,
          riwayatAlergi: null,
          riwayatPenyakitKronis: null,
          catatanKhusus: null,
        });
        setSelectedJamaah(null);
      }
      setSearchJamaah('');
      setJamaahList([]);
      setError(null);
    }
  }, [open, pasien]);

  // Search jamaah
  const handleSearchJamaah = async () => {
    if (!searchJamaah.trim()) return;

    setSearchingJamaah(true);
    try {
      const res = await fetch(`/api/jamaah?search=${encodeURIComponent(searchJamaah)}&pageSize=10`);
      const data = await res.json();
      setJamaahList(data.data || []);
    } catch {
      setJamaahList([]);
    } finally {
      setSearchingJamaah(false);
    }
  };

  // Select jamaah and populate form
  const handleSelectJamaah = (jamaah: Jamaah) => {
    setSelectedJamaah(jamaah);
    setFormData((prev) => ({
      ...prev,
      jamaahId: jamaah.id,
      namaLengkap: jamaah.nama,
      jenisKelamin: (jamaah.gender || 'lelaki') as 'lelaki' | 'perempuan',
      tanggalLahir: jamaah.tanggalLahir,
      alamat: [
        jamaah.alamatJalan,
        jamaah.alamatRT ? `RT ${jamaah.alamatRT}` : null,
        jamaah.alamatRW ? jamaah.alamatRW.replace('RW', 'RW ') : null,
        jamaah.alamatWilayah,
      ]
        .filter(Boolean)
        .join(', ') || null,
      nomorHP: jamaah.nomerHandphone,
      pekerjaan: jamaah.profesi,
    }));
    setJamaahList([]);
    setSearchJamaah('');
  };

  // Clear selected jamaah
  const handleClearJamaah = () => {
    setSelectedJamaah(null);
    setFormData((prev) => ({
      ...prev,
      jamaahId: null,
    }));
  };

  // Handle form submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const url = isEdit ? `/api/poliklinik/pasien/${pasien.id}` : '/api/poliklinik/pasien';
      const method = isEdit ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Gagal menyimpan data');
      }

      onOpenChange(false);
      onSuccess?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Terjadi kesalahan');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-purple-700">
            <UserPlus className="h-5 w-5" />
            {isEdit ? 'Edit Data Pasien' : 'Pendaftaran Pasien Baru'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Jamaah Lookup */}
          {!isEdit && (
            <div className="p-4 bg-purple-50 rounded-lg border border-purple-100">
              <Label className="text-sm font-medium text-purple-800 mb-2 block">
                Cari dari Data Jamaah (Opsional)
              </Label>
              <div className="flex gap-2">
                <Input
                  placeholder="Ketik nama jamaah..."
                  value={searchJamaah}
                  onChange={(e) => setSearchJamaah(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleSearchJamaah();
                    }
                  }}
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleSearchJamaah}
                  disabled={searchingJamaah}
                >
                  {searchingJamaah ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
                </Button>
              </div>

              {jamaahList.length > 0 && (
                <div className="mt-2 border rounded-md divide-y max-h-40 overflow-y-auto">
                  {jamaahList.map((j) => (
                    <button
                      key={j.id}
                      type="button"
                      onClick={() => handleSelectJamaah(j)}
                      className="w-full px-3 py-2 text-left hover:bg-purple-100 text-sm"
                    >
                      <span className="font-medium">{j.sebutan ? `${j.sebutan} ` : ''}{j.nama}</span>
                      {j.nomerHandphone && (
                        <span className="text-gray-500 ml-2">{j.nomerHandphone}</span>
                      )}
                    </button>
                  ))}
                </div>
              )}

              {selectedJamaah && (
                <div className="mt-2 flex items-center justify-between bg-white p-2 rounded border border-purple-200">
                  <span className="text-sm">
                    Terhubung dengan: <strong>{selectedJamaah.nama}</strong>
                  </span>
                  <Button type="button" variant="ghost" size="sm" onClick={handleClearJamaah}>
                    Hapus
                  </Button>
                </div>
              )}
            </div>
          )}

          {/* Data Identitas */}
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900 border-b pb-2">Data Identitas</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="namaLengkap">
                  Nama Lengkap <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="namaLengkap"
                  value={formData.namaLengkap}
                  onChange={(e) => setFormData((prev) => ({ ...prev, namaLengkap: e.target.value }))}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="jenisKelamin">
                  Jenis Kelamin <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={formData.jenisKelamin}
                  onValueChange={(v) => setFormData((prev) => ({ ...prev, jenisKelamin: v as 'lelaki' | 'perempuan' }))}
                >
                  <SelectTrigger>
                    <SelectValue />
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

              <div className="space-y-2">
                <Label htmlFor="tempatLahir">Tempat Lahir</Label>
                <Input
                  id="tempatLahir"
                  value={formData.tempatLahir || ''}
                  onChange={(e) => setFormData((prev) => ({ ...prev, tempatLahir: e.target.value || null }))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="tanggalLahir">Tanggal Lahir</Label>
                <Input
                  id="tanggalLahir"
                  type="date"
                  value={formData.tanggalLahir ? new Date(formData.tanggalLahir).toISOString().split('T')[0] : ''}
                  onChange={(e) => setFormData((prev) => ({ ...prev, tanggalLahir: e.target.value ? new Date(e.target.value) : null }))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="golonganDarah">Golongan Darah</Label>
                <Select
                  value={formData.golonganDarah || 'none'}
                  onValueChange={(v) => setFormData((prev) => ({ ...prev, golonganDarah: v === 'none' ? null : v as PasienFormData['golonganDarah'] }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih golongan darah" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Tidak diketahui</SelectItem>
                    {GOLONGAN_DARAH_OPTIONS.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="statusPernikahan">Status Pernikahan</Label>
                <Select
                  value={formData.statusPernikahan || 'none'}
                  onValueChange={(v) => setFormData((prev) => ({ ...prev, statusPernikahan: v === 'none' ? null : v as PasienFormData['statusPernikahan'] }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">-</SelectItem>
                    {STATUS_PERNIKAHAN_OPTIONS.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Kontak */}
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900 border-b pb-2">Kontak</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="nomorHP">Nomor HP</Label>
                <Input
                  id="nomorHP"
                  value={formData.nomorHP || ''}
                  onChange={(e) => setFormData((prev) => ({ ...prev, nomorHP: e.target.value || null }))}
                  placeholder="08xxxxxxxxxx"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="nomorHPDarurat">Nomor HP Darurat (Keluarga)</Label>
                <Input
                  id="nomorHPDarurat"
                  value={formData.nomorHPDarurat || ''}
                  onChange={(e) => setFormData((prev) => ({ ...prev, nomorHPDarurat: e.target.value || null }))}
                  placeholder="08xxxxxxxxxx"
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="alamat">Alamat</Label>
                <Textarea
                  id="alamat"
                  value={formData.alamat || ''}
                  onChange={(e) => setFormData((prev) => ({ ...prev, alamat: e.target.value || null }))}
                  rows={2}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="pekerjaan">Pekerjaan</Label>
                <Input
                  id="pekerjaan"
                  value={formData.pekerjaan || ''}
                  onChange={(e) => setFormData((prev) => ({ ...prev, pekerjaan: e.target.value || null }))}
                />
              </div>
            </div>
          </div>

          {/* Penanggung Jawab */}
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900 border-b pb-2">Penanggung Jawab (untuk anak/lansia)</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="penanggungJawab">Nama Penanggung Jawab</Label>
                <Input
                  id="penanggungJawab"
                  value={formData.penanggungJawab || ''}
                  onChange={(e) => setFormData((prev) => ({ ...prev, penanggungJawab: e.target.value || null }))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="hubunganPenanggungJawab">Hubungan dengan Pasien</Label>
                <Input
                  id="hubunganPenanggungJawab"
                  value={formData.hubunganPenanggungJawab || ''}
                  onChange={(e) => setFormData((prev) => ({ ...prev, hubunganPenanggungJawab: e.target.value || null }))}
                  placeholder="Contoh: Orang tua, Anak, dll"
                />
              </div>
            </div>
          </div>

          {/* Catatan Medis */}
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900 border-b pb-2">Catatan Medis Penting</h3>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="riwayatAlergi" className="text-red-600 font-medium">
                  Riwayat Alergi
                </Label>
                <Textarea
                  id="riwayatAlergi"
                  value={formData.riwayatAlergi || ''}
                  onChange={(e) => setFormData((prev) => ({ ...prev, riwayatAlergi: e.target.value || null }))}
                  rows={2}
                  placeholder="Alergi obat, makanan, dll"
                  className="border-red-200 focus:border-red-400"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="riwayatPenyakitKronis">Riwayat Penyakit Kronis</Label>
                <Textarea
                  id="riwayatPenyakitKronis"
                  value={formData.riwayatPenyakitKronis || ''}
                  onChange={(e) => setFormData((prev) => ({ ...prev, riwayatPenyakitKronis: e.target.value || null }))}
                  rows={2}
                  placeholder="Diabetes, hipertensi, asma, dll"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="catatanKhusus">Catatan Khusus</Label>
                <Textarea
                  id="catatanKhusus"
                  value={formData.catatanKhusus || ''}
                  onChange={(e) => setFormData((prev) => ({ ...prev, catatanKhusus: e.target.value || null }))}
                  rows={2}
                  placeholder="Disabilitas, kondisi khusus, dll"
                />
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
              Batal
            </Button>
            <Button type="submit" disabled={loading} className="bg-purple-600 hover:bg-purple-700">
              {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              {isEdit ? 'Simpan Perubahan' : 'Daftarkan Pasien'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
