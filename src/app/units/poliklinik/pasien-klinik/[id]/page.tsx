// src/app/units/poliklinik/pasien-klinik/[id]/page.tsx
'use client';

import React, { useState, useEffect, use } from 'react';
import Link from 'next/link';
import {
  ChevronLeft,
  User,
  Calendar,
  Phone,
  MapPin,
  AlertTriangle,
  Heart,
  FileText,
  Plus,
  Stethoscope,
  Activity,
  Pill,
  Edit,
  Clock,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PasienFormDialog } from '@/components/poliklinik/PasienFormDialog';
import {
  PasienKlinikWithRelations,
  KunjunganKlinikWithRelations,
  formatUmur,
  formatTanggal,
  formatTanggalWaktu,
  STATUS_KUNJUNGAN_OPTIONS,
  kategoriIMT,
  kategoriTekananDarah,
} from '@/types/poliklinik';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function PasienDetailPage({ params }: PageProps) {
  const { id } = use(params);
  const [pasien, setPasien] = useState<PasienKlinikWithRelations | null>(null);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);

  const fetchPasien = React.useCallback(async () => {
    try {
      const res = await fetch(`/api/poliklinik/pasien/${id}`);
      if (res.ok) {
        const data = await res.json();
        setPasien(data);
      }
    } catch (error) {
      console.error('Error fetching pasien:', error);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchPasien();
  }, [fetchPasien]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (!pasien) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-700">Pasien Tidak Ditemukan</h2>
          <Link href="/units/poliklinik/pasien-klinik">
            <Button className="mt-4">Kembali ke Daftar Pasien</Button>
          </Link>
        </div>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    const opt = STATUS_KUNJUNGAN_OPTIONS.find((o) => o.value === status);
    return opt?.color || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-700 text-white py-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <Link href="/units/poliklinik/pasien-klinik" className="text-purple-200 hover:text-white text-sm mb-2 inline-flex items-center">
            <ChevronLeft className="h-4 w-4 mr-1" />
            Kembali ke Daftar Pasien
          </Link>

          <div className="flex items-start justify-between mt-4">
            <div>
              <div className="flex items-center gap-3">
                <div className="h-14 w-14 rounded-full bg-white/20 flex items-center justify-center">
                  <User className="h-8 w-8" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold">{pasien.namaLengkap}</h1>
                  <p className="text-purple-200 font-mono">{pasien.nomorRM}</p>
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setDialogOpen(true)} className="bg-white/10 border-white/30 text-white hover:bg-white/20">
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Button>
              <Link href={`/units/poliklinik/kunjungan/baru?pasienId=${pasien.id}`}>
                <Button className="bg-white text-purple-700 hover:bg-purple-50">
                  <Plus className="h-4 w-4 mr-2" />
                  Kunjungan Baru
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Alert for allergies */}
        {pasien.riwayatAlergi && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5" />
            <div>
              <h3 className="font-semibold text-red-800">Riwayat Alergi</h3>
              <p className="text-red-700">{pasien.riwayatAlergi}</p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Patient Info */}
          <div className="lg:col-span-1 space-y-6">
            {/* Basic Info */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <User className="h-5 w-5 text-purple-600" />
                  Informasi Pasien
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-500">Status</span>
                  <Badge className={pasien.isAktif ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                    {pasien.isAktif ? 'Aktif' : 'Non-Aktif'}
                  </Badge>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-gray-500">Jenis Kelamin</span>
                  <span className="font-medium">{pasien.jenisKelamin === 'lelaki' ? 'Laki-laki' : 'Perempuan'}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-gray-500">Umur</span>
                  <span className="font-medium">{formatUmur(pasien.tanggalLahir)}</span>
                </div>

                {pasien.tanggalLahir && (
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500">Tanggal Lahir</span>
                    <span className="font-medium flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {formatTanggal(pasien.tanggalLahir)}
                    </span>
                  </div>
                )}

                {pasien.golonganDarah && (
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500">Gol. Darah</span>
                    <Badge variant="outline" className="text-red-600 border-red-200">
                      {pasien.golonganDarah}
                    </Badge>
                  </div>
                )}

                {pasien.nomorHP && (
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500">Telepon</span>
                    <span className="font-medium flex items-center gap-1">
                      <Phone className="h-4 w-4" />
                      {pasien.nomorHP}
                    </span>
                  </div>
                )}

                {pasien.alamat && (
                  <div>
                    <span className="text-gray-500 block mb-1">Alamat</span>
                    <span className="text-sm flex items-start gap-1">
                      <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
                      {pasien.alamat}
                    </span>
                  </div>
                )}

                {pasien.penanggungJawab && (
                  <div className="pt-2 border-t">
                    <span className="text-gray-500 block mb-1">Penanggung Jawab</span>
                    <span className="font-medium">{pasien.penanggungJawab}</span>
                    {pasien.hubunganPenanggungJawab && (
                      <span className="text-gray-500 text-sm"> ({pasien.hubunganPenanggungJawab})</span>
                    )}
                  </div>
                )}

                <div className="pt-2 border-t">
                  <span className="text-gray-500 block mb-1">Terdaftar</span>
                  <span className="text-sm">{formatTanggal(pasien.tanggalPertamaKunjungan)}</span>
                </div>
              </CardContent>
            </Card>

            {/* Medical Notes */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Heart className="h-5 w-5 text-red-600" />
                  Catatan Medis
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {pasien.riwayatPenyakitKronis && (
                  <div>
                    <span className="text-gray-500 text-sm block mb-1">Penyakit Kronis</span>
                    <p className="text-sm bg-orange-50 p-2 rounded border border-orange-100">
                      {pasien.riwayatPenyakitKronis}
                    </p>
                  </div>
                )}

                {pasien.catatanKhusus && (
                  <div>
                    <span className="text-gray-500 text-sm block mb-1">Catatan Khusus</span>
                    <p className="text-sm bg-blue-50 p-2 rounded border border-blue-100">
                      {pasien.catatanKhusus}
                    </p>
                  </div>
                )}

                {!pasien.riwayatPenyakitKronis && !pasien.catatanKhusus && (
                  <p className="text-gray-400 text-sm italic">Tidak ada catatan medis</p>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Medical History */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <FileText className="h-5 w-5 text-purple-600" />
                    Riwayat Kunjungan
                  </CardTitle>
                  <Badge variant="outline" className="text-purple-600 border-purple-200">
                    {pasien.kunjungan?.length || 0} Kunjungan
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                {!pasien.kunjungan || pasien.kunjungan.length === 0 ? (
                  <div className="text-center py-12 text-gray-500">
                    <Stethoscope className="h-12 w-12 mx-auto mb-4 opacity-30" />
                    <p>Belum ada riwayat kunjungan</p>
                    <Link href={`/units/poliklinik/kunjungan/baru?pasienId=${pasien.id}`}>
                      <Button className="mt-4 bg-purple-600 hover:bg-purple-700">
                        <Plus className="h-4 w-4 mr-2" />
                        Buat Kunjungan Pertama
                      </Button>
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {pasien.kunjungan.map((kunjungan: KunjunganKlinikWithRelations) => (
                      <div key={kunjungan.id} className="border rounded-lg p-4 hover:bg-purple-50/50 transition-colors">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-mono text-sm text-gray-500">{kunjungan.nomorKunjungan}</span>
                              <Badge className={getStatusColor(kunjungan.statusKunjungan)}>
                                {STATUS_KUNJUNGAN_OPTIONS.find((o) => o.value === kunjungan.statusKunjungan)?.label || kunjungan.statusKunjungan}
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                              <Clock className="h-3 w-3" />
                              {formatTanggalWaktu(kunjungan.tanggalKunjungan)}
                            </p>
                          </div>
                          <Link href={`/units/poliklinik/kunjungan/${kunjungan.id}`}>
                            <Button variant="outline" size="sm">
                              Detail
                            </Button>
                          </Link>
                        </div>

                        {kunjungan.keluhanUtama && (
                          <p className="text-sm mb-2">
                            <span className="font-medium">Keluhan:</span> {kunjungan.keluhanUtama}
                          </p>
                        )}

                        {kunjungan.rekamMedis && (
                          <div className="mt-3 pt-3 border-t space-y-2">
                            {/* Vital Signs */}
                            <div className="flex flex-wrap gap-4 text-sm">
                              {kunjungan.rekamMedis.tekananDarahSistolik && kunjungan.rekamMedis.tekananDarahDiastolik && (
                                <div className="flex items-center gap-1">
                                  <Activity className="h-4 w-4 text-red-500" />
                                  <span className={kategoriTekananDarah(kunjungan.rekamMedis.tekananDarahSistolik, kunjungan.rekamMedis.tekananDarahDiastolik).color}>
                                    {kunjungan.rekamMedis.tekananDarahSistolik}/{kunjungan.rekamMedis.tekananDarahDiastolik} mmHg
                                  </span>
                                </div>
                              )}

                              {kunjungan.rekamMedis.imt && (
                                <div className="flex items-center gap-1">
                                  <span className="text-gray-500">IMT:</span>
                                  <span className={kategoriIMT(Number(kunjungan.rekamMedis.imt)).color}>
                                    {Number(kunjungan.rekamMedis.imt).toFixed(1)} ({kategoriIMT(Number(kunjungan.rekamMedis.imt)).label})
                                  </span>
                                </div>
                              )}

                              {kunjungan.rekamMedis.gulaDarah && (
                                <div className="flex items-center gap-1">
                                  <span className="text-gray-500">GDS:</span>
                                  <span>{kunjungan.rekamMedis.gulaDarah} mg/dL</span>
                                </div>
                              )}
                            </div>

                            {/* Diagnosis */}
                            {kunjungan.rekamMedis.diagnosisUtama && (
                              <div className="flex items-start gap-2">
                                <Stethoscope className="h-4 w-4 text-purple-600 mt-0.5" />
                                <div>
                                  <span className="font-medium text-sm">Diagnosis:</span>
                                  <p className="text-sm text-gray-700">{kunjungan.rekamMedis.diagnosisUtama}</p>
                                </div>
                              </div>
                            )}

                            {/* Prescriptions */}
                            {kunjungan.rekamMedis.resepObat && kunjungan.rekamMedis.resepObat.length > 0 && (
                              <div className="flex items-start gap-2">
                                <Pill className="h-4 w-4 text-green-600 mt-0.5" />
                                <div>
                                  <span className="font-medium text-sm">Obat ({kunjungan.rekamMedis.resepObat.length}):</span>
                                  <div className="flex flex-wrap gap-1 mt-1">
                                    {kunjungan.rekamMedis.resepObat.slice(0, 3).map((resep) => (
                                      <Badge key={resep.id} variant="outline" className="text-xs">
                                        {resep.namaObat}
                                      </Badge>
                                    ))}
                                    {kunjungan.rekamMedis.resepObat.length > 3 && (
                                      <Badge variant="outline" className="text-xs">
                                        +{kunjungan.rekamMedis.resepObat.length - 3} lainnya
                                      </Badge>
                                    )}
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Edit Dialog */}
      <PasienFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        pasien={pasien}
        onSuccess={fetchPasien}
      />
    </div>
  );
}
