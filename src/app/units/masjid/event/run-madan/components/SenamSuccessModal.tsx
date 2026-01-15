'use client';

import React from 'react';
import {
  CheckCircle2,
  Ticket,
  Calendar,
  MapPin,
  Clock,
  Gift,
  Heart,
  Phone,
  Share2,
} from 'lucide-react';
import { SenamRegistrationData, COMMUNITY_INTERESTS, HEALTH_CONDITIONS } from './types';

interface SenamSuccessModalProps {
  data: SenamRegistrationData;
  onClose: () => void;
}

export function SenamSuccessModal({ data, onClose }: SenamSuccessModalProps) {
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Senam Sehat Run-Madan 2026',
        text: `Saya sudah daftar Senam Sehat Run-Madan 2026! Yuk ikut senam bersama GRATIS di Masjid Al Muhajirin Rewwin, 8 Februari 2026`,
        url: window.location.href,
      });
    }
  };

  const handleWhatsApp = () => {
    const message = `Halo, saya sudah mendaftar Senam Sehat Run-Madan 2026.

Nomor Registrasi: ${data.nomorRegistrasi}
Nama: ${data.nama}
Jumlah Peserta: ${data.jumlahPeserta}

Mohon informasi lebih lanjut. Terima kasih!`;

    window.open(`https://wa.me/628125906069?text=${encodeURIComponent(message)}`, '_blank');
  };

  const getHealthLabel = (value: string) => {
    return HEALTH_CONDITIONS.find((h) => h.value === value)?.label || value;
  };

  const getCommunityLabel = (value: string) => {
    return COMMUNITY_INTERESTS.find((c) => c.value === value)?.label || value;
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-300">
      <div className="bg-white rounded-2xl md:rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl animate-in zoom-in-95 duration-300">
        {/* Header */}
        <div className="bg-gradient-to-br from-[#4CAF50] to-[#2E7D32] text-white p-6 md:p-8 rounded-t-2xl md:rounded-t-3xl">
          <div className="text-center">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <CheckCircle2 className="h-10 w-10 text-[#C8E6C9]" />
            </div>
            <h3 className="text-2xl md:text-3xl font-black mb-2 text-[#C8E6C9]">
              Pendaftaran Berhasil!
            </h3>
            <p className="text-white/90 text-lg font-semibold">Selamat bergabung di Senam Sehat Run-Madan 2026</p>
            <div className="mt-4 bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2 inline-block">
              <p className="text-sm text-[#C8E6C9] font-bold">
                <Gift className="h-4 w-4 inline mr-1" />
                Simpan nomor kupon untuk doorprize!
              </p>
            </div>
          </div>
        </div>

        <div className="p-6 md:p-8 space-y-6">
          {/* Registration Number */}
          <div className="bg-[#E8F5E9] rounded-xl p-6 border-2 border-[#4CAF50]">
            <div className="text-sm font-bold text-gray-600 mb-2">Nomor Registrasi:</div>
            <div className="text-3xl font-black text-[#2E7D32]">{data.nomorRegistrasi}</div>
          </div>

          {/* Event Info */}
          <div className="bg-gray-50 rounded-xl p-5">
            <h4 className="font-bold text-gray-900 mb-3">Informasi Event:</h4>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2 text-gray-700">
                <Calendar className="h-4 w-4 text-[#4CAF50]" />
                <span>Minggu, 8 Februari 2026</span>
              </div>
              <div className="flex items-center gap-2 text-gray-700">
                <Clock className="h-4 w-4 text-[#4CAF50]" />
                <span>06:00 - 07:00 WIB</span>
              </div>
              <div className="flex items-center gap-2 text-gray-700">
                <MapPin className="h-4 w-4 text-[#4CAF50]" />
                <span>Lapangan Masjid Al Muhajirin Rewwin</span>
              </div>
            </div>
          </div>

          {/* Registrant Info */}
          <div>
            <h4 className="font-bold text-gray-900 mb-3">Data Pendaftar:</h4>
            <div className="space-y-1 text-gray-700 text-sm">
              <p><span className="font-semibold">Nama:</span> {data.nama}</p>
              <p><span className="font-semibold">Nomor HP:</span> {data.nomorHP}</p>
              {data.email && <p><span className="font-semibold">Email:</span> {data.email}</p>}
            </div>
          </div>

          {/* Participants & Kupon */}
          <div>
            <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
              <Ticket className="h-5 w-5 text-[#FFB300]" />
              Peserta & Nomor Kupon Doorprize:
            </h4>
            <div className="space-y-3">
              {data.participants.map((p, index) => (
                <div key={index} className="bg-gradient-to-r from-[#FFF8E1] to-[#FFECB3] p-4 rounded-xl border border-[#FFB300]">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="font-bold text-gray-900">
                        {index + 1}. {p.namaLengkap}
                      </p>
                      <p className="text-sm text-gray-600">{p.usia} tahun</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-600">Kupon:</p>
                      <p className="font-black text-[#F57C00]">{p.nomorKupon}</p>
                    </div>
                  </div>

                  {/* Health conditions */}
                  <div className="mt-2 pt-2 border-t border-[#FFB300]/30">
                    <p className="text-xs text-gray-600 mb-1">
                      <Heart className="h-3 w-3 inline mr-1" />
                      Kondisi kesehatan:
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {p.kondisiKesehatan.map((h, i) => (
                        <span key={i} className="text-xs bg-white/70 px-2 py-0.5 rounded-full text-gray-700">
                          {getHealthLabel(h)}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Community interests */}
                  <div className="mt-2">
                    <p className="text-xs text-gray-600 mb-1">Minat komunitas:</p>
                    <div className="flex flex-wrap gap-1">
                      {p.minatKomunitas.map((m, i) => (
                        <span key={i} className="text-xs bg-[#4CAF50]/20 px-2 py-0.5 rounded-full text-[#2E7D32] font-medium">
                          {getCommunityLabel(m)}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Dress Code Reminder */}
          <div className="bg-[#E3F2FD] rounded-xl p-4 border border-[#2196F3]/30">
            <p className="text-sm text-gray-700">
              <strong className="text-[#1976D2]">Pengingat:</strong> Harap mengenakan pakaian olahraga yang menutup aurat dengan nuansa warna <strong>biru atau putih</strong>.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <button
              onClick={handleWhatsApp}
              className="w-full bg-gradient-to-r from-[#4CAF50] to-[#2E7D32] text-white px-6 py-4 rounded-xl font-bold hover:opacity-90 transition-all flex items-center justify-center gap-2"
            >
              <Phone className="h-5 w-5" />
              Hubungi Panitia via WhatsApp
            </button>

            <button
              onClick={handleShare}
              className="w-full bg-[#E8F5E9] text-[#2E7D32] px-6 py-4 rounded-xl font-bold hover:bg-[#C8E6C9] transition-all flex items-center justify-center gap-2"
            >
              <Share2 className="h-5 w-5" />
              Bagikan ke Teman
            </button>

            <button
              onClick={onClose}
              className="w-full bg-gray-200 text-gray-900 px-6 py-3 rounded-xl font-bold hover:bg-gray-300 transition-all"
            >
              Tutup
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
