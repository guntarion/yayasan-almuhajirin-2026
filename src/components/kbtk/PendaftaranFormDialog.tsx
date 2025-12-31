'use client';

import * as React from 'react';
import { useState, useEffect, useCallback } from 'react';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2, Search, UserPlus } from 'lucide-react';
import {
  KbtkSiswaWithRelations,
  PendaftaranFormData,
  SiswaFormData,
  getTahunAjaranOptions,
  getTahunAjaranSekarang,
  KELOMPOK_LEVEL_OPTIONS,
  KELOMPOK_KELAS_OPTIONS,
  SCHEMA_PEMBAYARAN_OPTIONS,
  GENDER_OPTIONS,
  RELASI_OPTIONS,
  formatCurrency,
} from '@/types/kbtk';

interface PendaftaranFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

interface SiswaOption {
  id: string;
  nomorInduk: string;
  namaLengkap: string;
  kelompokLevel: string;
  kelompokKelas: string;
  tahunAjaran: string;
}

export function PendaftaranFormDialog({
  open,
  onOpenChange,
  onSuccess,
}: PendaftaranFormDialogProps) {
  const [activeTab, setActiveTab] = useState<'existing' | 'new'>('existing');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Siswa search state
  const [searchQuery, setSearchQuery] = useState('');
  const [siswaOptions, setSiswaOptions] = useState<SiswaOption[]>([]);
  const [selectedSiswa, setSelectedSiswa] = useState<SiswaOption | null>(null);
  const [isSearching, setIsSearching] = useState(false);

  // Pendaftaran form state
  const [formData, setFormData] = useState<Partial<PendaftaranFormData>>({
    tahunAjaran: getTahunAjaranSekarang(),
    program: 'KB',
    biayaPendaftaran: 0,
    schemaPembayaran: 'lunas',
    catatan: '',
  });

  // New siswa form state
  const [newSiswaData, setNewSiswaData] = useState<Partial<SiswaFormData>>({
    namaLengkap: '',
    namaPanggilan: '',
    jenisKelamin: 'lelaki',
    kelompokLevel: 'KB',
    kelompokKelas: 'A',
    tahunAjaran: getTahunAjaranSekarang(),
    alamat: '',
    catatanKhusus: '',
    orangTua: [
      {
        nama: '',
        relasi: 'ayah',
        nomorHP: '',
        isPrimary: true,
      },
    ],
  });

  // Payment state (for lunas option)
  const [includePayment, setIncludePayment] = useState(true);
  const [paymentData, setPaymentData] = useState({
    metodePembayaran: 'cash' as 'cash' | 'transfer',
    buktiTransfer: '',
    catatan: '',
  });

  const tahunAjaranOptions = getTahunAjaranOptions(3);

  // Search for siswa without pendaftaran
  const searchSiswa = useCallback(async (query: string) => {
    if (!query || query.length < 2) {
      setSiswaOptions([]);
      return;
    }

    setIsSearching(true);
    try {
      const response = await fetch(
        `/api/kbtk/siswa?search=${encodeURIComponent(query)}&noPendaftaran=true&pageSize=10`
      );
      const data = await response.json();
      setSiswaOptions(
        data.data?.map((s: KbtkSiswaWithRelations) => ({
          id: s.id,
          nomorInduk: s.nomorInduk,
          namaLengkap: s.namaLengkap,
          kelompokLevel: s.kelompokLevel,
          kelompokKelas: s.kelompokKelas,
          tahunAjaran: s.tahunAjaran,
        })) || []
      );
    } catch {
      console.error('Error searching siswa');
      setSiswaOptions([]);
    } finally {
      setIsSearching(false);
    }
  }, []);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery) {
        searchSiswa(searchQuery);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery, searchSiswa]);

  // Update form when siswa is selected
  useEffect(() => {
    if (selectedSiswa) {
      setFormData((prev) => ({
        ...prev,
        siswaId: selectedSiswa.id,
        tahunAjaran: selectedSiswa.tahunAjaran,
        program: selectedSiswa.kelompokLevel as 'KB' | 'TK',
      }));
    }
  }, [selectedSiswa]);

  const handleSelectSiswa = (siswa: SiswaOption) => {
    setSelectedSiswa(siswa);
    setSearchQuery(siswa.namaLengkap);
    setSiswaOptions([]);
  };

  const resetForm = () => {
    setActiveTab('existing');
    setSearchQuery('');
    setSiswaOptions([]);
    setSelectedSiswa(null);
    setFormData({
      tahunAjaran: getTahunAjaranSekarang(),
      program: 'KB',
      biayaPendaftaran: 0,
      schemaPembayaran: 'lunas',
      catatan: '',
    });
    setNewSiswaData({
      namaLengkap: '',
      namaPanggilan: '',
      jenisKelamin: 'lelaki',
      kelompokLevel: 'KB',
      kelompokKelas: 'A',
      tahunAjaran: getTahunAjaranSekarang(),
      alamat: '',
      catatanKhusus: '',
      orangTua: [
        {
          nama: '',
          relasi: 'ayah',
          nomorHP: '',
          isPrimary: true,
        },
      ],
    });
    setIncludePayment(true);
    setPaymentData({
      metodePembayaran: 'cash',
      buktiTransfer: '',
      catatan: '',
    });
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      let siswaId = selectedSiswa?.id;

      // If creating new siswa
      if (activeTab === 'new') {
        if (!newSiswaData.namaLengkap) {
          throw new Error('Nama lengkap siswa wajib diisi');
        }

        const siswaResponse = await fetch('/api/kbtk/siswa', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newSiswaData),
        });

        if (!siswaResponse.ok) {
          const errorData = await siswaResponse.json();
          throw new Error(errorData.error || 'Gagal membuat data siswa');
        }

        const newSiswa = await siswaResponse.json();
        siswaId = newSiswa.id;
      }

      if (!siswaId) {
        throw new Error('Silakan pilih atau buat siswa terlebih dahulu');
      }

      if (!formData.biayaPendaftaran || Number(formData.biayaPendaftaran) <= 0) {
        throw new Error('Biaya pendaftaran harus lebih dari 0');
      }

      // Create pendaftaran
      const pendaftaranPayload: Record<string, unknown> = {
        siswaId,
        tahunAjaran: formData.tahunAjaran || (activeTab === 'new' ? newSiswaData.tahunAjaran : getTahunAjaranSekarang()),
        program: formData.program || (activeTab === 'new' ? newSiswaData.kelompokLevel : 'KB'),
        biayaPendaftaran: Number(formData.biayaPendaftaran),
        schemaPembayaran: formData.schemaPembayaran,
        catatan: formData.catatan || null,
      };

      // Include payment if lunas and checked
      if (formData.schemaPembayaran === 'lunas' && includePayment) {
        pendaftaranPayload.pembayaranAwal = {
          nominal: Number(formData.biayaPendaftaran),
          metodePembayaran: paymentData.metodePembayaran,
          buktiTransfer: paymentData.buktiTransfer || null,
          catatan: paymentData.catatan || null,
        };
      }

      const response = await fetch('/api/kbtk/pendaftaran', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(pendaftaranPayload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Gagal membuat pendaftaran');
      }

      resetForm();
      onOpenChange(false);
      onSuccess?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Terjadi kesalahan');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-[#006064]">Pendaftaran Baru</DialogTitle>
          <DialogDescription>
            Daftarkan siswa baru atau siswa yang sudah ada ke program KB/TK
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'existing' | 'new')}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="existing">Pilih Siswa Existing</TabsTrigger>
              <TabsTrigger value="new">
                <UserPlus className="w-4 h-4 mr-2" />
                Siswa Baru
              </TabsTrigger>
            </TabsList>

            {/* Existing Siswa Tab */}
            <TabsContent value="existing" className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label>Cari Siswa (yang belum memiliki pendaftaran)</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    placeholder="Ketik nama atau nomor induk siswa..."
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setSelectedSiswa(null);
                    }}
                    className="pl-10"
                  />
                  {isSearching && (
                    <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 animate-spin" />
                  )}
                </div>

                {/* Search results */}
                {siswaOptions.length > 0 && !selectedSiswa && (
                  <div className="border rounded-md max-h-48 overflow-y-auto">
                    {siswaOptions.map((siswa) => (
                      <button
                        key={siswa.id}
                        type="button"
                        onClick={() => handleSelectSiswa(siswa)}
                        className="w-full px-4 py-2 text-left hover:bg-gray-100 flex justify-between items-center"
                      >
                        <div>
                          <div className="font-medium">{siswa.namaLengkap}</div>
                          <div className="text-sm text-gray-500">{siswa.nomorInduk}</div>
                        </div>
                        <div className="text-sm text-gray-500">
                          {siswa.kelompokLevel}-{siswa.kelompokKelas}
                        </div>
                      </button>
                    ))}
                  </div>
                )}

                {/* Selected siswa display */}
                {selectedSiswa && (
                  <div className="p-3 bg-cyan-50 border border-cyan-200 rounded-md">
                    <div className="font-medium text-[#006064]">{selectedSiswa.namaLengkap}</div>
                    <div className="text-sm text-gray-600">
                      {selectedSiswa.nomorInduk} | {selectedSiswa.kelompokLevel}-{selectedSiswa.kelompokKelas} | TA {selectedSiswa.tahunAjaran}
                    </div>
                  </div>
                )}
              </div>
            </TabsContent>

            {/* New Siswa Tab */}
            <TabsContent value="new" className="space-y-4 mt-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="namaLengkap">Nama Lengkap *</Label>
                  <Input
                    id="namaLengkap"
                    value={newSiswaData.namaLengkap}
                    onChange={(e) => setNewSiswaData({ ...newSiswaData, namaLengkap: e.target.value })}
                    required={activeTab === 'new'}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="namaPanggilan">Nama Panggilan</Label>
                  <Input
                    id="namaPanggilan"
                    value={newSiswaData.namaPanggilan || ''}
                    onChange={(e) => setNewSiswaData({ ...newSiswaData, namaPanggilan: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Jenis Kelamin *</Label>
                  <Select
                    value={newSiswaData.jenisKelamin}
                    onValueChange={(v) => setNewSiswaData({ ...newSiswaData, jenisKelamin: v as 'lelaki' | 'perempuan' })}
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
                  <Label>Kelompok *</Label>
                  <Select
                    value={newSiswaData.kelompokLevel}
                    onValueChange={(v) => {
                      setNewSiswaData({ ...newSiswaData, kelompokLevel: v as 'KB' | 'TK' });
                      setFormData({ ...formData, program: v as 'KB' | 'TK' });
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {KELOMPOK_LEVEL_OPTIONS.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value}>
                          {opt.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Kelas</Label>
                  <Select
                    value={newSiswaData.kelompokKelas}
                    onValueChange={(v) => setNewSiswaData({ ...newSiswaData, kelompokKelas: v as 'A' | 'B' })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {KELOMPOK_KELAS_OPTIONS.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value}>
                          {opt.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Tahun Ajaran *</Label>
                  <Select
                    value={newSiswaData.tahunAjaran}
                    onValueChange={(v) => {
                      setNewSiswaData({ ...newSiswaData, tahunAjaran: v });
                      setFormData({ ...formData, tahunAjaran: v });
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {tahunAjaranOptions.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value}>
                          {opt.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tanggalLahir">Tanggal Lahir</Label>
                  <Input
                    id="tanggalLahir"
                    type="date"
                    value={newSiswaData.tanggalLahir ? new Date(newSiswaData.tanggalLahir).toISOString().split('T')[0] : ''}
                    onChange={(e) => setNewSiswaData({ ...newSiswaData, tanggalLahir: e.target.value ? new Date(e.target.value) : null })}
                  />
                </div>
              </div>

              {/* Orang Tua / Wali */}
              <div className="border-t pt-4">
                <Label className="text-base font-medium">Data Orang Tua / Wali</Label>
                <div className="grid grid-cols-3 gap-4 mt-2">
                  <div className="space-y-2">
                    <Label htmlFor="namaOrtu">Nama</Label>
                    <Input
                      id="namaOrtu"
                      value={newSiswaData.orangTua?.[0]?.nama || ''}
                      onChange={(e) =>
                        setNewSiswaData({
                          ...newSiswaData,
                          orangTua: [{ ...newSiswaData.orangTua![0], nama: e.target.value }],
                        })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Relasi</Label>
                    <Select
                      value={newSiswaData.orangTua?.[0]?.relasi || 'ayah'}
                      onValueChange={(v) =>
                        setNewSiswaData({
                          ...newSiswaData,
                          orangTua: [{ ...newSiswaData.orangTua![0], relasi: v as 'ayah' | 'ibu' | 'wali' }],
                        })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {RELASI_OPTIONS.map((opt) => (
                          <SelectItem key={opt.value} value={opt.value}>
                            {opt.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="nomorHP">Nomor HP</Label>
                    <Input
                      id="nomorHP"
                      value={newSiswaData.orangTua?.[0]?.nomorHP || ''}
                      onChange={(e) =>
                        setNewSiswaData({
                          ...newSiswaData,
                          orangTua: [{ ...newSiswaData.orangTua![0], nomorHP: e.target.value }],
                        })
                      }
                    />
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>

          {/* Pendaftaran Form */}
          <div className="border-t mt-6 pt-6 space-y-4">
            <h4 className="font-medium text-[#006064]">Data Pendaftaran</h4>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Program</Label>
                <Select
                  value={formData.program}
                  onValueChange={(v) => setFormData({ ...formData, program: v as 'KB' | 'TK' })}
                  disabled={activeTab === 'existing' && !!selectedSiswa}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {KELOMPOK_LEVEL_OPTIONS.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Tahun Ajaran</Label>
                <Select
                  value={formData.tahunAjaran}
                  onValueChange={(v) => setFormData({ ...formData, tahunAjaran: v })}
                  disabled={activeTab === 'existing' && !!selectedSiswa}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {tahunAjaranOptions.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="biayaPendaftaran">Biaya Pendaftaran *</Label>
                <Input
                  id="biayaPendaftaran"
                  type="number"
                  min="0"
                  step="10000"
                  value={formData.biayaPendaftaran || ''}
                  onChange={(e) => setFormData({ ...formData, biayaPendaftaran: Number(e.target.value) })}
                  required
                  className="text-right"
                />
                {formData.biayaPendaftaran ? (
                  <p className="text-sm text-gray-500">{formatCurrency(formData.biayaPendaftaran)}</p>
                ) : null}
              </div>
              <div className="space-y-2">
                <Label>Skema Pembayaran</Label>
                <Select
                  value={formData.schemaPembayaran}
                  onValueChange={(v) => {
                    setFormData({ ...formData, schemaPembayaran: v as 'lunas' | 'angsuran' });
                    setIncludePayment(v === 'lunas');
                  }}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {SCHEMA_PEMBAYARAN_OPTIONS.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Payment for Lunas */}
            {formData.schemaPembayaran === 'lunas' && (
              <div className="bg-green-50 border border-green-200 rounded-md p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="text-green-800 font-medium">Input Pembayaran Langsung</Label>
                  <label className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={includePayment}
                      onChange={(e) => setIncludePayment(e.target.checked)}
                      className="rounded"
                    />
                    Ya, bayar sekarang
                  </label>
                </div>

                {includePayment && (
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Metode Pembayaran</Label>
                      <Select
                        value={paymentData.metodePembayaran}
                        onValueChange={(v) => setPaymentData({ ...paymentData, metodePembayaran: v as 'cash' | 'transfer' })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="cash">Cash/Tunai</SelectItem>
                          <SelectItem value="transfer">Transfer Bank</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    {paymentData.metodePembayaran === 'transfer' && (
                      <div className="space-y-2">
                        <Label htmlFor="buktiTransfer">URL Bukti Transfer</Label>
                        <Input
                          id="buktiTransfer"
                          type="url"
                          placeholder="https://..."
                          value={paymentData.buktiTransfer}
                          onChange={(e) => setPaymentData({ ...paymentData, buktiTransfer: e.target.value })}
                        />
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="catatan">Catatan</Label>
              <Textarea
                id="catatan"
                value={formData.catatan || ''}
                onChange={(e) => setFormData({ ...formData, catatan: e.target.value })}
                rows={2}
              />
            </div>
          </div>

          {error && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-md">
              {error}
            </div>
          )}

          <DialogFooter className="mt-6">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Batal
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || (activeTab === 'existing' && !selectedSiswa)}
              className="bg-[#00BCD4] hover:bg-[#006064]"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Menyimpan...
                </>
              ) : (
                'Simpan Pendaftaran'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
