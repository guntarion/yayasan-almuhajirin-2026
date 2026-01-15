'use client';

import React, { useState } from 'react';
import { track } from '@vercel/analytics';
import {
  Users,
  User,
  Activity,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Heart,
  Ticket,
  Phone,
  Gift,
} from 'lucide-react';
import {
  SenamParticipant,
  SenamRegistrant,
  SenamRegistrationData,
  HEALTH_CONDITIONS,
  COMMUNITY_INTERESTS,
} from './types';

interface SenamRegistrationProps {
  onSuccess: (data: SenamRegistrationData) => void;
}

export function SenamRegistration({ onSuccess }: SenamRegistrationProps) {
  const [registrant, setRegistrant] = useState<SenamRegistrant>({
    nama: '',
    nomorHP: '',
    email: '',
    alamat: '',
  });

  const [participants, setParticipants] = useState<SenamParticipant[]>([
    {
      id: '1',
      namaLengkap: '',
      jenisKelamin: 'perempuan',
      tanggalLahir: '',
      kondisiKesehatan: [],
      kondisiLainnya: '',
      minatKomunitas: [],
    },
  ]);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formErrors, setFormErrors] = useState<string[]>([]);

  // Add participant
  const addParticipant = () => {
    const newId = (participants.length + 1).toString();
    setParticipants([
      ...participants,
      {
        id: newId,
        namaLengkap: '',
        jenisKelamin: 'perempuan',
        tanggalLahir: '',
        kondisiKesehatan: [],
        kondisiLainnya: '',
        minatKomunitas: [],
      },
    ]);
  };

  // Remove participant
  const removeParticipant = (id: string) => {
    if (participants.length > 1) {
      setParticipants(participants.filter((p) => p.id !== id));
    }
  };

  // Update participant field
  const updateParticipant = (id: string, field: keyof SenamParticipant, value: string | string[]) => {
    setParticipants(participants.map((p) => (p.id === id ? { ...p, [field]: value } : p)));
  };

  // Toggle health condition
  const toggleHealthCondition = (participantId: string, condition: string) => {
    const participant = participants.find((p) => p.id === participantId);
    if (!participant) return;

    let newConditions: string[];

    // If selecting "TIDAK_ADA", clear all others
    if (condition === 'TIDAK_ADA') {
      newConditions = participant.kondisiKesehatan.includes('TIDAK_ADA') ? [] : ['TIDAK_ADA'];
    } else {
      // If selecting other condition, remove "TIDAK_ADA"
      const filtered = participant.kondisiKesehatan.filter((c) => c !== 'TIDAK_ADA');
      if (filtered.includes(condition)) {
        newConditions = filtered.filter((c) => c !== condition);
      } else {
        newConditions = [...filtered, condition];
      }
    }

    updateParticipant(participantId, 'kondisiKesehatan', newConditions);
  };

  // Toggle community interest
  const toggleCommunityInterest = (participantId: string, interest: string) => {
    const participant = participants.find((p) => p.id === participantId);
    if (!participant) return;

    let newInterests: string[];
    if (participant.minatKomunitas.includes(interest)) {
      newInterests = participant.minatKomunitas.filter((i) => i !== interest);
    } else {
      newInterests = [...participant.minatKomunitas, interest];
    }

    updateParticipant(participantId, 'minatKomunitas', newInterests);
  };

  // Validate form
  const validateForm = (): boolean => {
    const errors: string[] = [];

    // Validate registrant
    if (!registrant.nama.trim()) errors.push('Nama pendaftar harus diisi');
    if (!registrant.nomorHP.trim()) errors.push('Nomor HP pendaftar harus diisi');
    if (!registrant.alamat.trim()) errors.push('Alamat pendaftar harus diisi');

    // Validate participants
    participants.forEach((p, index) => {
      if (!p.namaLengkap.trim()) errors.push(`Nama peserta ${index + 1} harus diisi`);
      if (!p.tanggalLahir) errors.push(`Tanggal lahir peserta ${index + 1} harus diisi`);
      if (p.kondisiKesehatan.length === 0) errors.push(`Kondisi kesehatan peserta ${index + 1} harus dipilih`);
      if (p.minatKomunitas.length === 0) errors.push(`Minat komunitas peserta ${index + 1} harus dipilih minimal satu`);
      if (p.kondisiKesehatan.includes('LAINNYA') && !p.kondisiLainnya.trim()) {
        errors.push(`Mohon jelaskan kondisi kesehatan lainnya untuk peserta ${index + 1}`);
      }
    });

    setFormErrors(errors);
    return errors.length === 0;
  };

  // Submit form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setFormErrors([]);

    try {
      const response = await fetch('/api/run-madan/senam', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          registrant,
          participants: participants.map((p) => ({
            namaLengkap: p.namaLengkap,
            jenisKelamin: p.jenisKelamin,
            tanggalLahir: p.tanggalLahir,
            kondisiKesehatan: p.kondisiKesehatan,
            kondisiLainnya: p.kondisiLainnya,
            minatKomunitas: p.minatKomunitas,
          })),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Terjadi kesalahan');
      }

      // Track successful registration
      track('SenamRegistration', {
        participants: data.data.jumlahPeserta,
        registrationNumber: data.data.nomorRegistrasi,
      });

      // Success
      onSuccess(data.data);

      // Reset form
      setRegistrant({ nama: '', nomorHP: '', email: '', alamat: '' });
      setParticipants([
        {
          id: '1',
          namaLengkap: '',
          jenisKelamin: 'perempuan',
          tanggalLahir: '',
          kondisiKesehatan: [],
          kondisiLainnya: '',
          minatKomunitas: [],
        },
      ]);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Terjadi kesalahan saat mendaftar';
      setFormErrors([message]);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="senam-registration" className="py-20 bg-gradient-to-b from-white to-[#E8F5E9]">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-[#4CAF50] text-white px-4 py-2 rounded-full font-semibold mb-4">
              <Users className="h-5 w-5" />
              Formulir Pendaftaran Senam Sehat
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">Daftar Senam Sehat</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Pendaftaran <strong className="text-[#4CAF50]">100% GRATIS</strong>. Anda dapat mendaftarkan beberapa peserta sekaligus
              (diri sendiri, keluarga, atau teman).
            </p>

            {/* FREE Badge */}
            <div className="mt-6 inline-flex items-center gap-3 bg-gradient-to-r from-[#4CAF50] to-[#2E7D32] text-white px-6 py-3 rounded-xl shadow-lg">
              <Gift className="h-6 w-6" />
              <span className="text-xl font-black">GRATIS - Tanpa Biaya Apapun!</span>
            </div>
          </div>

          {/* Form Errors */}
          {formErrors.length > 0 && (
            <div className="mb-8 bg-red-50 border-2 border-red-500 rounded-xl p-6">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-6 w-6 text-red-600 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-red-900 mb-2">Mohon lengkapi data berikut:</h3>
                  <ul className="space-y-1">
                    {formErrors.map((error, index) => (
                      <li key={index} className="text-red-700">
                        • {error}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Registrant Information */}
            <div className="bg-white rounded-2xl p-8 shadow-lg border-2 border-[#4CAF50]">
              <h3 className="text-2xl font-black text-[#2E7D32] mb-6 flex items-center gap-3">
                <User className="h-6 w-6" />
                Data Pendaftar (Penanggung Jawab)
              </h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Nama Lengkap <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={registrant.nama}
                    onChange={(e) => setRegistrant({ ...registrant, nama: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:border-[#4CAF50] focus:outline-none transition-colors duration-200"
                    placeholder="Masukkan nama lengkap"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Nomor HP (WhatsApp) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    value={registrant.nomorHP}
                    onChange={(e) => setRegistrant({ ...registrant, nomorHP: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:border-[#4CAF50] focus:outline-none transition-colors duration-200"
                    placeholder="08123456789"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Email (Opsional)</label>
                  <input
                    type="email"
                    value={registrant.email}
                    onChange={(e) => setRegistrant({ ...registrant, email: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:border-[#4CAF50] focus:outline-none transition-colors duration-200"
                    placeholder="email@example.com"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Alamat Lengkap <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={registrant.alamat}
                    onChange={(e) => setRegistrant({ ...registrant, alamat: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:border-[#4CAF50] focus:outline-none transition-colors duration-200"
                    placeholder="Alamat lengkap (RT/RW, Kelurahan, Kecamatan)"
                    rows={2}
                    required
                  />
                </div>
              </div>
            </div>

            {/* Participants */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-black text-gray-900 flex items-center gap-3">
                  <Activity className="h-6 w-6 text-[#4CAF50]" />
                  Data Peserta Senam
                </h3>
                <span className="text-sm font-bold text-[#4CAF50] bg-[#E8F5E9] px-4 py-2 rounded-full">
                  {participants.length} Peserta
                </span>
              </div>

              {participants.map((participant, index) => (
                <div
                  key={participant.id}
                  className="bg-white rounded-2xl p-6 md:p-8 shadow-lg border-2 border-gray-200 relative hover:border-[#4CAF50]/50 transition-all duration-300"
                >
                  {/* Remove button */}
                  {participants.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeParticipant(participant.id)}
                      className="w-full md:w-auto md:absolute top-4 right-4 mb-4 md:mb-0 px-4 py-2 bg-red-100 text-red-700 hover:bg-red-200 rounded-lg transition-colors font-bold text-sm flex items-center justify-center gap-2"
                    >
                      <AlertCircle className="h-4 w-4" />
                      Hapus Peserta
                    </button>
                  )}

                  <h4 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                    <span className="w-8 h-8 bg-[#4CAF50] text-white rounded-full flex items-center justify-center text-sm font-black">
                      {index + 1}
                    </span>
                    Peserta #{index + 1}
                  </h4>

                  <div className="space-y-6">
                    {/* Basic Info */}
                    <div className="grid md:grid-cols-3 gap-4">
                      <div className="md:col-span-1">
                        <label className="block text-sm font-bold text-gray-700 mb-2">
                          Nama Lengkap <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={participant.namaLengkap}
                          onChange={(e) => updateParticipant(participant.id, 'namaLengkap', e.target.value)}
                          className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:border-[#4CAF50] focus:outline-none transition-colors"
                          placeholder="Nama lengkap peserta"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">
                          Jenis Kelamin <span className="text-red-500">*</span>
                        </label>
                        <select
                          value={participant.jenisKelamin}
                          onChange={(e) => updateParticipant(participant.id, 'jenisKelamin', e.target.value)}
                          className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:border-[#4CAF50] focus:outline-none transition-colors"
                          required
                        >
                          <option value="lelaki">Laki-laki</option>
                          <option value="perempuan">Perempuan</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">
                          Tanggal Lahir <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="date"
                          value={participant.tanggalLahir}
                          onChange={(e) => updateParticipant(participant.id, 'tanggalLahir', e.target.value)}
                          className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:border-[#4CAF50] focus:outline-none transition-colors"
                          required
                        />
                      </div>
                    </div>

                    {/* Health Conditions */}
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-3">
                        <Heart className="h-4 w-4 inline mr-1" />
                        Kondisi Kesehatan <span className="text-red-500">*</span>
                        <span className="font-normal text-gray-500 ml-2">(boleh pilih lebih dari satu)</span>
                      </label>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                        {HEALTH_CONDITIONS.map((condition) => (
                          <button
                            key={condition.value}
                            type="button"
                            onClick={() => toggleHealthCondition(participant.id, condition.value)}
                            className={`p-3 rounded-lg text-left text-sm transition-all duration-200 border-2 ${
                              participant.kondisiKesehatan.includes(condition.value)
                                ? condition.value === 'TIDAK_ADA'
                                  ? 'bg-green-100 border-green-500 text-green-800'
                                  : 'bg-[#FFF3E0] border-[#FF9800] text-[#E65100]'
                                : 'bg-gray-50 border-gray-200 text-gray-700 hover:border-gray-400'
                            }`}
                          >
                            <span className="flex items-center gap-2">
                              {participant.kondisiKesehatan.includes(condition.value) && (
                                <CheckCircle2 className="h-4 w-4 flex-shrink-0" />
                              )}
                              <span className={participant.kondisiKesehatan.includes(condition.value) ? 'font-semibold' : ''}>
                                {condition.label}
                              </span>
                            </span>
                          </button>
                        ))}
                      </div>

                      {/* Additional health condition input */}
                      {participant.kondisiKesehatan.includes('LAINNYA') && (
                        <div className="mt-3">
                          <input
                            type="text"
                            value={participant.kondisiLainnya}
                            onChange={(e) => updateParticipant(participant.id, 'kondisiLainnya', e.target.value)}
                            className="w-full px-4 py-3 rounded-lg border-2 border-[#FF9800] focus:border-[#E65100] focus:outline-none bg-[#FFF3E0]"
                            placeholder="Jelaskan kondisi kesehatan lainnya..."
                          />
                        </div>
                      )}
                    </div>

                    {/* Community Interests */}
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-3">
                        <Users className="h-4 w-4 inline mr-1" />
                        Minat Bergabung Komunitas <span className="text-red-500">*</span>
                        <span className="font-normal text-gray-500 ml-2">(boleh pilih lebih dari satu)</span>
                      </label>
                      <div className="grid md:grid-cols-2 gap-3">
                        {COMMUNITY_INTERESTS.map((interest) => (
                          <button
                            key={interest.value}
                            type="button"
                            onClick={() => toggleCommunityInterest(participant.id, interest.value)}
                            className={`p-4 rounded-xl text-left transition-all duration-200 border-2 ${
                              participant.minatKomunitas.includes(interest.value)
                                ? 'bg-[#E8F5E9] border-[#4CAF50] shadow-md'
                                : 'bg-gray-50 border-gray-200 hover:border-[#4CAF50]/50'
                            }`}
                          >
                            <div className="flex items-start gap-3">
                              <div
                                className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5 ${
                                  participant.minatKomunitas.includes(interest.value)
                                    ? 'bg-[#4CAF50] border-[#4CAF50]'
                                    : 'border-gray-400'
                                }`}
                              >
                                {participant.minatKomunitas.includes(interest.value) && (
                                  <CheckCircle2 className="h-4 w-4 text-white" />
                                )}
                              </div>
                              <div>
                                <p className={`font-bold ${participant.minatKomunitas.includes(interest.value) ? 'text-[#2E7D32]' : 'text-gray-800'}`}>
                                  {interest.label}
                                </p>
                                <p className="text-xs text-gray-600 mt-1">{interest.description}</p>
                              </div>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {/* Add Participant Button */}
              <button
                type="button"
                onClick={addParticipant}
                className="w-full bg-[#E8F5E9] text-[#2E7D32] px-6 py-4 rounded-xl font-bold hover:bg-[#C8E6C9] transition-all duration-300 flex items-center justify-center gap-3 border-2 border-[#4CAF50] border-dashed"
              >
                <Users className="h-5 w-5" />
                Tambah Peserta Lagi
              </button>
            </div>

            {/* Submit Button */}
            <div className="bg-gradient-to-br from-[#4CAF50] to-[#2E7D32] rounded-2xl p-8 text-center">
              <div className="mb-6">
                <div className="flex items-center justify-center gap-2 text-white/90 text-lg font-semibold mb-2">
                  <Ticket className="h-5 w-5" />
                  Setiap peserta akan mendapat kupon doorprize
                </div>
                <div className="text-5xl font-black text-[#C8E6C9]">GRATIS</div>
                <div className="text-white/80 text-sm mt-2">{participants.length} Peserta Terdaftar</div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-white text-[#2E7D32] px-12 py-5 rounded-xl font-black text-xl hover:bg-[#C8E6C9] transition-all duration-300 shadow-2xl hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 mx-auto"
              >
                {isSubmitting ? (
                  <>
                    <Activity className="h-6 w-6 animate-spin" />
                    Memproses...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="h-6 w-6" />
                    Daftar Sekarang
                    <ArrowRight className="h-6 w-6" />
                  </>
                )}
              </button>

              <p className="text-white/80 text-sm mt-4">
                Setelah mendaftar, Anda akan mendapatkan nomor registrasi dan kupon doorprize
              </p>
            </div>
          </form>

          {/* Info Note */}
          <div className="mt-8 bg-[#E3F2FD] rounded-xl p-6 border border-[#2196F3]/30">
            <div className="flex items-start gap-3">
              <Phone className="h-6 w-6 text-[#1976D2] flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-[#1976D2] mb-1">Ada pertanyaan?</p>
                <p className="text-gray-700 text-sm">
                  Hubungi panitia via WhatsApp di <strong>+62 812-5906-069</strong> untuk informasi lebih lanjut
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
