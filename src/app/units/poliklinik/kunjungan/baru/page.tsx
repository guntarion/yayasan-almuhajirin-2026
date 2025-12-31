// src/app/units/poliklinik/kunjungan/baru/page.tsx
'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import {
  ChevronLeft,
  Plus,
  Search,
  User,
  AlertTriangle,
  Loader2,
  UserPlus,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { PasienFormDialog } from '@/components/poliklinik/PasienFormDialog';
import {
  PasienKlinikWithRelations,
  JENIS_PELAYANAN_OPTIONS,
  formatUmur,
} from '@/types/poliklinik';

function KunjunganBaruContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const preselectedPasienId = searchParams.get('pasienId');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Pasien search
  const [searchPasien, setSearchPasien] = useState('');
  const [pasienList, setPasienList] = useState<PasienKlinikWithRelations[]>([]);
  const [searchingPasien, setSearchingPasien] = useState(false);
  const [selectedPasien, setSelectedPasien] = useState<PasienKlinikWithRelations | null>(null);

  // Pasien dialog
  const [pasienDialogOpen, setPasienDialogOpen] = useState(false);

  // Form state
  const [jenisPelayanan, setJenisPelayanan] = useState('umum');
  const [dokter, setDokter] = useState('');
  const [keluhanUtama, setKeluhanUtama] = useState('');

  // Load preselected pasien
  useEffect(() => {
    if (preselectedPasienId) {
      fetchPasienById(preselectedPasienId);
    }
  }, [preselectedPasienId]);

  const fetchPasienById = async (id: string) => {
    try {
      const res = await fetch(`/api/poliklinik/pasien/${id}`);
      if (res.ok) {
        const data = await res.json();
        setSelectedPasien(data);
      }
    } catch (error) {
      console.error('Error fetching pasien:', error);
    }
  };

  const handleSearchPasien = async () => {
    if (!searchPasien.trim()) return;

    setSearchingPasien(true);
    try {
      const res = await fetch(`/api/poliklinik/pasien?search=${encodeURIComponent(searchPasien)}&pageSize=10`);
      const data = await res.json();
      setPasienList(data.data || []);
    } catch {
      setPasienList([]);
    } finally {
      setSearchingPasien(false);
    }
  };

  const handleSelectPasien = (pasien: PasienKlinikWithRelations) => {
    setSelectedPasien(pasien);
    setPasienList([]);
    setSearchPasien('');
  };

  const handlePasienCreated = () => {
    // Refresh search or prompt user
    setPasienDialogOpen(false);
    setSearchPasien('');
    setPasienList([]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedPasien) {
      setError('Pilih pasien terlebih dahulu');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/poliklinik/kunjungan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pasienId: selectedPasien.id,
          jenisPelayanan,
          dokter: dokter || null,
          keluhanUtama: keluhanUtama || null,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Gagal mendaftarkan kunjungan');
      }

      const kunjungan = await res.json();
      router.push(`/units/poliklinik/kunjungan/${kunjungan.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Terjadi kesalahan');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-700 text-white py-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <Link href="/units/poliklinik/kunjungan" className="text-purple-200 hover:text-white text-sm mb-2 inline-flex items-center">
            <ChevronLeft className="h-4 w-4 mr-1" />
            Kembali ke Antrian
          </Link>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Plus className="h-8 w-8" />
            Pendaftaran Kunjungan Baru
          </h1>
          <p className="text-purple-200 mt-1">Daftarkan pasien untuk kunjungan hari ini</p>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-3xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Pasien Selection */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <User className="h-5 w-5 text-purple-600" />
                Pilih Pasien
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {!selectedPasien ? (
                <>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Cari nama atau No. RM..."
                      value={searchPasien}
                      onChange={(e) => setSearchPasien(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleSearchPasien();
                        }
                      }}
                    />
                    <Button type="button" variant="outline" onClick={handleSearchPasien} disabled={searchingPasien}>
                      {searchingPasien ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
                    </Button>
                    <Button type="button" variant="outline" onClick={() => setPasienDialogOpen(true)}>
                      <UserPlus className="h-4 w-4" />
                    </Button>
                  </div>

                  {pasienList.length > 0 && (
                    <div className="border rounded-lg divide-y max-h-60 overflow-y-auto">
                      {pasienList.map((pasien) => (
                        <button
                          key={pasien.id}
                          type="button"
                          onClick={() => handleSelectPasien(pasien)}
                          className="w-full px-4 py-3 text-left hover:bg-purple-50 flex items-center justify-between"
                        >
                          <div>
                            <p className="font-medium">{pasien.namaLengkap}</p>
                            <p className="text-sm text-gray-500">
                              {pasien.nomorRM} | {pasien.jenisKelamin === 'lelaki' ? 'L' : 'P'} | {formatUmur(pasien.tanggalLahir)}
                            </p>
                          </div>
                          {pasien.riwayatAlergi && (
                            <Badge variant="destructive" className="text-xs">
                              <AlertTriangle className="h-3 w-3 mr-1" />
                              Alergi
                            </Badge>
                          )}
                        </button>
                      ))}
                    </div>
                  )}

                  {searchPasien && pasienList.length === 0 && !searchingPasien && (
                    <p className="text-sm text-gray-500 text-center py-4">
                      Tidak ditemukan pasien dengan nama tersebut.{' '}
                      <button
                        type="button"
                        onClick={() => setPasienDialogOpen(true)}
                        className="text-purple-600 hover:underline"
                      >
                        Daftarkan pasien baru
                      </button>
                    </p>
                  )}
                </>
              ) : (
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-semibold text-lg">{selectedPasien.namaLengkap}</p>
                      <p className="text-sm text-gray-600">
                        {selectedPasien.nomorRM} | {selectedPasien.jenisKelamin === 'lelaki' ? 'Laki-laki' : 'Perempuan'} | {formatUmur(selectedPasien.tanggalLahir)}
                      </p>
                      {selectedPasien.nomorHP && (
                        <p className="text-sm text-gray-500">{selectedPasien.nomorHP}</p>
                      )}
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedPasien(null)}
                    >
                      Ganti
                    </Button>
                  </div>

                  {selectedPasien.riwayatAlergi && (
                    <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
                      <AlertTriangle className="h-4 w-4 text-red-600 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-red-800">Alergi:</p>
                        <p className="text-sm text-red-700">{selectedPasien.riwayatAlergi}</p>
                      </div>
                    </div>
                  )}

                  {selectedPasien.riwayatPenyakitKronis && (
                    <div className="mt-2 p-3 bg-orange-50 border border-orange-200 rounded-lg">
                      <p className="text-sm font-medium text-orange-800">Penyakit Kronis:</p>
                      <p className="text-sm text-orange-700">{selectedPasien.riwayatPenyakitKronis}</p>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Kunjungan Details */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Detail Kunjungan</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="jenisPelayanan">Jenis Pelayanan</Label>
                  <Select value={jenisPelayanan} onValueChange={setJenisPelayanan}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {JENIS_PELAYANAN_OPTIONS.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value}>
                          {opt.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dokter">Dokter/Petugas</Label>
                  <Input
                    id="dokter"
                    value={dokter}
                    onChange={(e) => setDokter(e.target.value)}
                    placeholder="Nama dokter/petugas"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="keluhanUtama">Keluhan Utama</Label>
                <Textarea
                  id="keluhanUtama"
                  value={keluhanUtama}
                  onChange={(e) => setKeluhanUtama(e.target.value)}
                  rows={3}
                  placeholder="Keluhan yang dirasakan pasien..."
                />
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex justify-end gap-3">
            <Link href="/units/poliklinik/kunjungan">
              <Button type="button" variant="outline" disabled={loading}>
                Batal
              </Button>
            </Link>
            <Button type="submit" disabled={loading || !selectedPasien} className="bg-purple-600 hover:bg-purple-700">
              {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Daftarkan Kunjungan
            </Button>
          </div>
        </form>
      </div>

      {/* Pasien Dialog */}
      <PasienFormDialog
        open={pasienDialogOpen}
        onOpenChange={setPasienDialogOpen}
        onSuccess={handlePasienCreated}
      />
    </div>
  );
}

export default function KunjunganBaruPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    }>
      <KunjunganBaruContent />
    </Suspense>
  );
}
