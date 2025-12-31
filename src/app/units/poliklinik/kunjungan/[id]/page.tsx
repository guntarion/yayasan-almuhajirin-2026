// src/app/units/poliklinik/kunjungan/[id]/page.tsx
'use client';

import React, { useState, useEffect, use, useCallback } from 'react';
import Link from 'next/link';
import {
  ChevronLeft,
  AlertTriangle,
  Stethoscope,
  Activity,
  FileText,
  Pill,
  Plus,
  Save,
  Loader2,
  CheckCircle,
  Thermometer,
  Heart,
  Scale,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  KunjunganKlinikWithRelations,
  RekamMedisFormData,
  MasterObat,
  formatUmur,
  STATUS_KUNJUNGAN_OPTIONS,
  SATUAN_OBAT_OPTIONS,
  hitungIMT,
  kategoriIMT,
  kategoriTekananDarah,
} from '@/types/poliklinik';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function KunjunganDetailPage({ params }: PageProps) {
  const { id } = use(params);
  const [kunjungan, setKunjungan] = useState<KunjunganKlinikWithRelations | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Rekam medis form data
  const [rekamMedis, setRekamMedis] = useState<Partial<RekamMedisFormData>>({});
  const [isNewRekamMedis, setIsNewRekamMedis] = useState(true);

  // Resep dialog
  const [resepDialogOpen, setResepDialogOpen] = useState(false);
  const [obatList, setObatList] = useState<MasterObat[]>([]);
  const [resepForm, setResepForm] = useState({
    obatId: '',
    namaObat: '',
    dosis: '',
    aturanPakai: '',
    lamaPemakaian: '',
    jumlahObat: 1,
    satuan: 'tablet',
  });
  const [addingResep, setAddingResep] = useState(false);

  const fetchKunjungan = useCallback(async () => {
    try {
      const res = await fetch(`/api/poliklinik/kunjungan/${id}`);
      if (res.ok) {
        const data = await res.json();
        setKunjungan(data);

        // If rekam medis exists, populate the form
        if (data.rekamMedis) {
          setIsNewRekamMedis(false);
          setRekamMedis({
            kunjunganId: id,
            keluhanUtama: data.rekamMedis.keluhanUtama || data.keluhanUtama,
            riwayatPenyakitSekarang: data.rekamMedis.riwayatPenyakitSekarang,
            riwayatPenyakitDahulu: data.rekamMedis.riwayatPenyakitDahulu,
            riwayatAlergi: data.rekamMedis.riwayatAlergi || data.pasien?.riwayatAlergi,
            riwayatObat: data.rekamMedis.riwayatObat,
            tekananDarahSistolik: data.rekamMedis.tekananDarahSistolik,
            tekananDarahDiastolik: data.rekamMedis.tekananDarahDiastolik,
            nadi: data.rekamMedis.nadi,
            suhu: data.rekamMedis.suhu ? Number(data.rekamMedis.suhu) : undefined,
            pernapasan: data.rekamMedis.pernapasan,
            beratBadan: data.rekamMedis.beratBadan ? Number(data.rekamMedis.beratBadan) : undefined,
            tinggiBadan: data.rekamMedis.tinggiBadan ? Number(data.rekamMedis.tinggiBadan) : undefined,
            gulaDarah: data.rekamMedis.gulaDarah,
            kolesterol: data.rekamMedis.kolesterol,
            asamUrat: data.rekamMedis.asamUrat ? Number(data.rekamMedis.asamUrat) : undefined,
            catatanPemeriksaan: data.rekamMedis.catatanPemeriksaan,
            diagnosisUtama: data.rekamMedis.diagnosisUtama,
            diagnosisTambahan: data.rekamMedis.diagnosisTambahan,
            kodeICD10: data.rekamMedis.kodeICD10,
            tindakanMedis: data.rekamMedis.tindakanMedis,
            edukasiPasien: data.rekamMedis.edukasiPasien,
            rencanaSelanjutnya: data.rekamMedis.rencanaSelanjutnya,
            tanggalKontrol: data.rekamMedis.tanggalKontrol,
            rujukan: data.rekamMedis.rujukan,
          });
        } else {
          // Initialize with keluhan from kunjungan and alergi from pasien
          setRekamMedis({
            kunjunganId: id,
            keluhanUtama: data.keluhanUtama,
            riwayatAlergi: data.pasien?.riwayatAlergi,
          });
        }
      }
    } catch (error) {
      console.error('Error fetching kunjungan:', error);
    } finally {
      setLoading(false);
    }
  }, [id]);

  const fetchObat = async () => {
    try {
      const res = await fetch('/api/poliklinik/obat?isAktif=true&pageSize=100');
      if (res.ok) {
        const data = await res.json();
        setObatList(data.data || []);
      }
    } catch (error) {
      console.error('Error fetching obat:', error);
    }
  };

  useEffect(() => {
    fetchKunjungan();
    fetchObat();
  }, [fetchKunjungan]);

  // Calculate IMT when weight/height changes
  useEffect(() => {
    if (rekamMedis.beratBadan && rekamMedis.tinggiBadan) {
      // IMT is auto-calculated on server
    }
  }, [rekamMedis.beratBadan, rekamMedis.tinggiBadan]);

  const handleSaveRekamMedis = async () => {
    setSaving(true);
    setError(null);
    setSuccess(null);

    try {
      const url = isNewRekamMedis
        ? '/api/poliklinik/rekam-medis'
        : `/api/poliklinik/rekam-medis/${kunjungan?.rekamMedis?.id}`;

      const method = isNewRekamMedis ? 'POST' : 'PUT';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...rekamMedis,
          kunjunganId: id,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Gagal menyimpan rekam medis');
      }

      setSuccess('Rekam medis berhasil disimpan');
      fetchKunjungan();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Terjadi kesalahan');
    } finally {
      setSaving(false);
    }
  };

  const handleSelesaiKunjungan = async () => {
    try {
      await fetch(`/api/poliklinik/kunjungan/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ statusKunjungan: 'selesai' }),
      });
      fetchKunjungan();
      setSuccess('Kunjungan telah ditandai selesai');
    } catch {
      setError('Gagal mengupdate status kunjungan');
    }
  };

  const handleAddResep = async () => {
    if (!resepForm.namaObat) {
      setError('Nama obat wajib diisi');
      return;
    }

    if (!kunjungan?.rekamMedis?.id) {
      setError('Simpan rekam medis terlebih dahulu');
      return;
    }

    setAddingResep(true);
    try {
      const res = await fetch(`/api/poliklinik/rekam-medis/${kunjungan.rekamMedis.id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(resepForm),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Gagal menambahkan resep');
      }

      setResepDialogOpen(false);
      setResepForm({
        obatId: '',
        namaObat: '',
        dosis: '',
        aturanPakai: '',
        lamaPemakaian: '',
        jumlahObat: 1,
        satuan: 'tablet',
      });
      fetchKunjungan();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Terjadi kesalahan');
    } finally {
      setAddingResep(false);
    }
  };

  const handleSelectObat = (obatId: string) => {
    const obat = obatList.find((o) => o.id === obatId);
    if (obat) {
      setResepForm((prev) => ({
        ...prev,
        obatId: obat.id,
        namaObat: obat.nama,
        satuan: obat.satuan,
      }));
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (!kunjungan) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-700">Kunjungan Tidak Ditemukan</h2>
          <Link href="/units/poliklinik/kunjungan">
            <Button className="mt-4">Kembali ke Antrian</Button>
          </Link>
        </div>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    const opt = STATUS_KUNJUNGAN_OPTIONS.find((o) => o.value === status);
    return opt?.color || 'bg-gray-100 text-gray-800';
  };

  const calculatedIMT = rekamMedis.beratBadan && rekamMedis.tinggiBadan
    ? hitungIMT(rekamMedis.beratBadan, rekamMedis.tinggiBadan)
    : null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-700 text-white py-6">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <Link href="/units/poliklinik/kunjungan" className="text-purple-200 hover:text-white text-sm mb-2 inline-flex items-center">
            <ChevronLeft className="h-4 w-4 mr-1" />
            Kembali ke Antrian
          </Link>

          <div className="flex items-start justify-between mt-2">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <Badge className={getStatusColor(kunjungan.statusKunjungan)}>
                  {STATUS_KUNJUNGAN_OPTIONS.find((o) => o.value === kunjungan.statusKunjungan)?.label}
                </Badge>
                <span className="font-mono text-sm">{kunjungan.nomorKunjungan}</span>
              </div>
              <h1 className="text-2xl font-bold">{kunjungan.pasien?.namaLengkap}</h1>
              <p className="text-purple-200">
                {kunjungan.pasien?.nomorRM} | {kunjungan.pasien?.jenisKelamin === 'lelaki' ? 'L' : 'P'} | {formatUmur(kunjungan.pasien?.tanggalLahir)}
              </p>
            </div>
            <div className="flex gap-2">
              <Button onClick={handleSaveRekamMedis} disabled={saving} className="bg-white text-purple-700 hover:bg-purple-50">
                {saving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
                Simpan
              </Button>
              {kunjungan.statusKunjungan !== 'selesai' && kunjungan.rekamMedis && (
                <Button onClick={handleSelesaiKunjungan} variant="outline" className="bg-green-500 text-white hover:bg-green-600 border-0">
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Selesai
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Alerts */}
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        {success && (
          <Alert className="mb-4 bg-green-50 border-green-200">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">{success}</AlertDescription>
          </Alert>
        )}

        {/* Allergy Alert */}
        {kunjungan.pasien?.riwayatAlergi && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5" />
            <div>
              <h3 className="font-semibold text-red-800">ALERGI</h3>
              <p className="text-red-700">{kunjungan.pasien.riwayatAlergi}</p>
            </div>
          </div>
        )}

        <Tabs defaultValue="anamnesis" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:inline-grid">
            <TabsTrigger value="anamnesis">Anamnesis</TabsTrigger>
            <TabsTrigger value="pemeriksaan">Pemeriksaan</TabsTrigger>
            <TabsTrigger value="diagnosis">Diagnosis & Terapi</TabsTrigger>
            <TabsTrigger value="resep">Resep Obat</TabsTrigger>
          </TabsList>

          {/* Anamnesis Tab */}
          <TabsContent value="anamnesis">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-purple-600" />
                  Anamnesis
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="keluhanUtama">Keluhan Utama</Label>
                  <Textarea
                    id="keluhanUtama"
                    value={rekamMedis.keluhanUtama || ''}
                    onChange={(e) => setRekamMedis((prev) => ({ ...prev, keluhanUtama: e.target.value }))}
                    rows={3}
                    placeholder="Keluhan yang dirasakan pasien..."
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="riwayatPenyakitSekarang">Riwayat Penyakit Sekarang</Label>
                  <Textarea
                    id="riwayatPenyakitSekarang"
                    value={rekamMedis.riwayatPenyakitSekarang || ''}
                    onChange={(e) => setRekamMedis((prev) => ({ ...prev, riwayatPenyakitSekarang: e.target.value }))}
                    rows={3}
                    placeholder="Perjalanan penyakit saat ini..."
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="riwayatPenyakitDahulu">Riwayat Penyakit Dahulu</Label>
                    <Textarea
                      id="riwayatPenyakitDahulu"
                      value={rekamMedis.riwayatPenyakitDahulu || ''}
                      onChange={(e) => setRekamMedis((prev) => ({ ...prev, riwayatPenyakitDahulu: e.target.value }))}
                      rows={2}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="riwayatAlergi" className="text-red-600">Riwayat Alergi</Label>
                    <Textarea
                      id="riwayatAlergi"
                      value={rekamMedis.riwayatAlergi || ''}
                      onChange={(e) => setRekamMedis((prev) => ({ ...prev, riwayatAlergi: e.target.value }))}
                      rows={2}
                      className="border-red-200"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="riwayatObat">Obat yang Sedang Dikonsumsi</Label>
                  <Textarea
                    id="riwayatObat"
                    value={rekamMedis.riwayatObat || ''}
                    onChange={(e) => setRekamMedis((prev) => ({ ...prev, riwayatObat: e.target.value }))}
                    rows={2}
                    placeholder="Obat rutin yang sedang dikonsumsi pasien..."
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Pemeriksaan Tab */}
          <TabsContent value="pemeriksaan">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Stethoscope className="h-5 w-5 text-purple-600" />
                  Pemeriksaan Fisik
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Vital Signs */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Tanda Vital</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="space-y-2">
                      <Label className="flex items-center gap-1">
                        <Activity className="h-4 w-4 text-red-500" />
                        TD Sistolik (mmHg)
                      </Label>
                      <Input
                        type="number"
                        value={rekamMedis.tekananDarahSistolik || ''}
                        onChange={(e) => setRekamMedis((prev) => ({ ...prev, tekananDarahSistolik: e.target.value ? parseInt(e.target.value) : undefined }))}
                        placeholder="120"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="flex items-center gap-1">
                        <Activity className="h-4 w-4 text-red-500" />
                        TD Diastolik (mmHg)
                      </Label>
                      <Input
                        type="number"
                        value={rekamMedis.tekananDarahDiastolik || ''}
                        onChange={(e) => setRekamMedis((prev) => ({ ...prev, tekananDarahDiastolik: e.target.value ? parseInt(e.target.value) : undefined }))}
                        placeholder="80"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="flex items-center gap-1">
                        <Heart className="h-4 w-4 text-pink-500" />
                        Nadi (bpm)
                      </Label>
                      <Input
                        type="number"
                        value={rekamMedis.nadi || ''}
                        onChange={(e) => setRekamMedis((prev) => ({ ...prev, nadi: e.target.value ? parseInt(e.target.value) : undefined }))}
                        placeholder="80"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="flex items-center gap-1">
                        <Thermometer className="h-4 w-4 text-orange-500" />
                        Suhu (&deg;C)
                      </Label>
                      <Input
                        type="number"
                        step="0.1"
                        value={rekamMedis.suhu || ''}
                        onChange={(e) => setRekamMedis((prev) => ({ ...prev, suhu: e.target.value ? parseFloat(e.target.value) : undefined }))}
                        placeholder="36.5"
                      />
                    </div>
                  </div>

                  {/* Show BP category */}
                  {rekamMedis.tekananDarahSistolik && rekamMedis.tekananDarahDiastolik && (
                    <div className="mt-2">
                      <span className={`text-sm font-medium ${kategoriTekananDarah(rekamMedis.tekananDarahSistolik, rekamMedis.tekananDarahDiastolik).color}`}>
                        {kategoriTekananDarah(rekamMedis.tekananDarahSistolik, rekamMedis.tekananDarahDiastolik).label}
                      </span>
                    </div>
                  )}
                </div>

                {/* Anthropometry */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Antropometri</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="space-y-2">
                      <Label className="flex items-center gap-1">
                        <Scale className="h-4 w-4 text-blue-500" />
                        Berat Badan (kg)
                      </Label>
                      <Input
                        type="number"
                        step="0.1"
                        value={rekamMedis.beratBadan || ''}
                        onChange={(e) => setRekamMedis((prev) => ({ ...prev, beratBadan: e.target.value ? parseFloat(e.target.value) : undefined }))}
                        placeholder="60"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Tinggi Badan (cm)</Label>
                      <Input
                        type="number"
                        step="0.1"
                        value={rekamMedis.tinggiBadan || ''}
                        onChange={(e) => setRekamMedis((prev) => ({ ...prev, tinggiBadan: e.target.value ? parseFloat(e.target.value) : undefined }))}
                        placeholder="165"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>IMT</Label>
                      <div className="h-10 flex items-center px-3 bg-gray-100 rounded-md">
                        {calculatedIMT ? (
                          <span className={kategoriIMT(calculatedIMT).color}>
                            {calculatedIMT.toFixed(1)} ({kategoriIMT(calculatedIMT).label})
                          </span>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Pernapasan (/mnt)</Label>
                      <Input
                        type="number"
                        value={rekamMedis.pernapasan || ''}
                        onChange={(e) => setRekamMedis((prev) => ({ ...prev, pernapasan: e.target.value ? parseInt(e.target.value) : undefined }))}
                        placeholder="20"
                      />
                    </div>
                  </div>
                </div>

                {/* Lab (clinic simple) */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Pemeriksaan Cepat</h4>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label>Gula Darah (mg/dL)</Label>
                      <Input
                        type="number"
                        value={rekamMedis.gulaDarah || ''}
                        onChange={(e) => setRekamMedis((prev) => ({ ...prev, gulaDarah: e.target.value ? parseInt(e.target.value) : undefined }))}
                        placeholder="100"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Kolesterol (mg/dL)</Label>
                      <Input
                        type="number"
                        value={rekamMedis.kolesterol || ''}
                        onChange={(e) => setRekamMedis((prev) => ({ ...prev, kolesterol: e.target.value ? parseInt(e.target.value) : undefined }))}
                        placeholder="180"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Asam Urat (mg/dL)</Label>
                      <Input
                        type="number"
                        step="0.1"
                        value={rekamMedis.asamUrat || ''}
                        onChange={(e) => setRekamMedis((prev) => ({ ...prev, asamUrat: e.target.value ? parseFloat(e.target.value) : undefined }))}
                        placeholder="5.0"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Catatan Pemeriksaan Fisik</Label>
                  <Textarea
                    value={rekamMedis.catatanPemeriksaan || ''}
                    onChange={(e) => setRekamMedis((prev) => ({ ...prev, catatanPemeriksaan: e.target.value }))}
                    rows={3}
                    placeholder="Catatan tambahan pemeriksaan fisik..."
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Diagnosis Tab */}
          <TabsContent value="diagnosis">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Stethoscope className="h-5 w-5 text-purple-600" />
                  Diagnosis & Terapi
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="diagnosisUtama">Diagnosis Utama</Label>
                    <Textarea
                      id="diagnosisUtama"
                      value={rekamMedis.diagnosisUtama || ''}
                      onChange={(e) => setRekamMedis((prev) => ({ ...prev, diagnosisUtama: e.target.value }))}
                      rows={2}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="kodeICD10">Kode ICD-10</Label>
                    <Input
                      id="kodeICD10"
                      value={rekamMedis.kodeICD10 || ''}
                      onChange={(e) => setRekamMedis((prev) => ({ ...prev, kodeICD10: e.target.value }))}
                      placeholder="Contoh: J00"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="diagnosisTambahan">Diagnosis Tambahan</Label>
                  <Textarea
                    id="diagnosisTambahan"
                    value={rekamMedis.diagnosisTambahan || ''}
                    onChange={(e) => setRekamMedis((prev) => ({ ...prev, diagnosisTambahan: e.target.value }))}
                    rows={2}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tindakanMedis">Tindakan Medis</Label>
                  <Textarea
                    id="tindakanMedis"
                    value={rekamMedis.tindakanMedis || ''}
                    onChange={(e) => setRekamMedis((prev) => ({ ...prev, tindakanMedis: e.target.value }))}
                    rows={2}
                    placeholder="Tindakan yang dilakukan..."
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edukasiPasien">Edukasi Pasien</Label>
                  <Textarea
                    id="edukasiPasien"
                    value={rekamMedis.edukasiPasien || ''}
                    onChange={(e) => setRekamMedis((prev) => ({ ...prev, edukasiPasien: e.target.value }))}
                    rows={2}
                    placeholder="Edukasi yang diberikan kepada pasien..."
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="rencanaSelanjutnya">Rencana Selanjutnya</Label>
                    <Textarea
                      id="rencanaSelanjutnya"
                      value={rekamMedis.rencanaSelanjutnya || ''}
                      onChange={(e) => setRekamMedis((prev) => ({ ...prev, rencanaSelanjutnya: e.target.value }))}
                      rows={2}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="tanggalKontrol">Tanggal Kontrol</Label>
                    <Input
                      id="tanggalKontrol"
                      type="date"
                      value={rekamMedis.tanggalKontrol ? new Date(rekamMedis.tanggalKontrol).toISOString().split('T')[0] : ''}
                      onChange={(e) => setRekamMedis((prev) => ({ ...prev, tanggalKontrol: e.target.value ? new Date(e.target.value) : undefined }))}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="rujukan">Rujukan</Label>
                  <Textarea
                    id="rujukan"
                    value={rekamMedis.rujukan || ''}
                    onChange={(e) => setRekamMedis((prev) => ({ ...prev, rujukan: e.target.value }))}
                    rows={2}
                    placeholder="Catatan rujukan jika diperlukan..."
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Resep Tab */}
          <TabsContent value="resep">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Pill className="h-5 w-5 text-green-600" />
                    Resep Obat
                  </CardTitle>
                  <Button
                    onClick={() => setResepDialogOpen(true)}
                    disabled={!kunjungan.rekamMedis}
                    size="sm"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Tambah Obat
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {!kunjungan.rekamMedis ? (
                  <p className="text-center text-gray-500 py-8">
                    Simpan rekam medis terlebih dahulu sebelum menambahkan resep obat
                  </p>
                ) : !kunjungan.rekamMedis.resepObat || kunjungan.rekamMedis.resepObat.length === 0 ? (
                  <p className="text-center text-gray-500 py-8">
                    Belum ada resep obat
                  </p>
                ) : (
                  <div className="space-y-3">
                    {kunjungan.rekamMedis.resepObat.map((resep, index) => (
                      <div key={resep.id} className="flex items-start justify-between p-4 bg-green-50 rounded-lg border border-green-100">
                        <div className="flex items-start gap-3">
                          <div className="h-8 w-8 rounded-full bg-green-200 flex items-center justify-center text-green-700 font-bold">
                            {index + 1}
                          </div>
                          <div>
                            <p className="font-semibold">{resep.namaObat}</p>
                            <p className="text-sm text-gray-600">
                              {resep.dosis && `${resep.dosis} | `}
                              {resep.aturanPakai && `${resep.aturanPakai} | `}
                              {resep.jumlahObat} {resep.satuan}
                            </p>
                            {resep.lamaPemakaian && (
                              <p className="text-sm text-gray-500">{resep.lamaPemakaian}</p>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Resep Dialog */}
      <Dialog open={resepDialogOpen} onOpenChange={setResepDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Pill className="h-5 w-5 text-green-600" />
              Tambah Resep Obat
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Pilih dari Master Obat</Label>
              <Select onValueChange={handleSelectObat}>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih obat..." />
                </SelectTrigger>
                <SelectContent>
                  {obatList.map((obat) => (
                    <SelectItem key={obat.id} value={obat.id}>
                      {obat.nama} ({obat.satuan}) - Stok: {obat.stokSaatIni}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="namaObat">Nama Obat *</Label>
              <Input
                id="namaObat"
                value={resepForm.namaObat}
                onChange={(e) => setResepForm((prev) => ({ ...prev, namaObat: e.target.value }))}
                placeholder="Nama obat"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="dosis">Dosis</Label>
                <Input
                  id="dosis"
                  value={resepForm.dosis}
                  onChange={(e) => setResepForm((prev) => ({ ...prev, dosis: e.target.value }))}
                  placeholder="500mg"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="aturanPakai">Aturan Pakai</Label>
                <Input
                  id="aturanPakai"
                  value={resepForm.aturanPakai}
                  onChange={(e) => setResepForm((prev) => ({ ...prev, aturanPakai: e.target.value }))}
                  placeholder="3x1 pc"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="jumlahObat">Jumlah</Label>
                <Input
                  id="jumlahObat"
                  type="number"
                  value={resepForm.jumlahObat}
                  onChange={(e) => setResepForm((prev) => ({ ...prev, jumlahObat: parseInt(e.target.value) || 1 }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="satuan">Satuan</Label>
                <Select value={resepForm.satuan} onValueChange={(v) => setResepForm((prev) => ({ ...prev, satuan: v }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {SATUAN_OBAT_OPTIONS.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="lamaPemakaian">Lama Pakai</Label>
                <Input
                  id="lamaPemakaian"
                  value={resepForm.lamaPemakaian}
                  onChange={(e) => setResepForm((prev) => ({ ...prev, lamaPemakaian: e.target.value }))}
                  placeholder="5 hari"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Button variant="outline" onClick={() => setResepDialogOpen(false)}>
                Batal
              </Button>
              <Button onClick={handleAddResep} disabled={addingResep} className="bg-green-600 hover:bg-green-700">
                {addingResep && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                Tambah Resep
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
