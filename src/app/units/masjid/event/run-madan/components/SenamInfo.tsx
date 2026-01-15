'use client';

import React from 'react';
import Image from 'next/image';
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  Heart,
  Gift,
  CheckCircle2,
  HeartPulse,
  Sparkles,
  Ticket,
  Star,
  AlertCircle,
  ArrowRight,
} from 'lucide-react';
import { COMMUNITY_INTERESTS } from './types';

interface SenamInfoProps {
  onScrollToRegistration: () => void;
}

export function SenamInfo({ onScrollToRegistration }: SenamInfoProps) {
  const senamBenefits = [
    'Menjaga kebugaran dan kesehatan tubuh',
    'Memperkuat sendi dan tulang',
    'Melancarkan pernafasan',
    'Meningkatkan keseimbangan tubuh',
    'Mengurangi stres dan meningkatkan mood',
    'Membangun silaturahmi sesama warga',
  ];

  const whyJoin = [
    {
      icon: Ticket,
      title: 'Kupon Doorprize',
      description: 'Setiap peserta mendapat kupon doorprize menarik',
      color: 'from-[#FFB300] to-[#FF8F00]',
    },
    {
      icon: Users,
      title: 'Komunitas Sehat',
      description: 'Bergabung dengan komunitas olahraga Al Muhajirin',
      color: 'from-[#4CAF50] to-[#2E7D32]',
    },
    {
      icon: HeartPulse,
      title: 'Instruktur Profesional',
      description: 'Dipandu instruktur berpengalaman dengan gerakan yang aman',
      color: 'from-[#E91E63] to-[#C2185B]',
    },
    {
      icon: Gift,
      title: '100% GRATIS',
      description: 'Tidak dipungut biaya apapun untuk ikut senam',
      color: 'from-[#00BCD4] to-[#0097A7]',
    },
  ];

  return (
    <div className="space-y-16">
      {/* Hero Banner for Senam */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#4CAF50] via-[#2E7D32] to-[#1B5E20] text-white py-16">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#81C784]/20 rounded-full blur-3xl" />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-semibold mb-6">
              <Sparkles className="h-4 w-4" />
              100% GRATIS - Terbuka untuk Umum
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black mb-6">
              <span className="text-[#C8E6C9]">Senam Sehat</span>
              <span className="block text-2xl md:text-3xl font-bold text-white/90 mt-2">Run-Madan 2026</span>
            </h1>

            <p className="text-lg md:text-xl text-white/90 mb-6 max-w-3xl mx-auto leading-relaxed">
              Aktivitas olahraga ringan untuk <strong>semua usia</strong>, laki-laki maupun perempuan.
              Gerakan senam yang dirancang untuk <strong>menjaga kesehatan sendi</strong>, <strong>melancarkan pernafasan</strong>,
              dan <strong>meningkatkan kebugaran tubuh</strong> secara menyeluruh.
            </p>

            <div className="flex flex-wrap gap-4 justify-center text-sm mb-8">
              <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-lg">
                <Calendar className="h-5 w-5" />
                <span className="font-semibold">Minggu, 8 Februari 2026</span>
              </div>
              <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-lg">
                <Clock className="h-5 w-5" />
                <span className="font-semibold">06:00 - 07:00 WIB</span>
              </div>
              <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-lg">
                <MapPin className="h-5 w-5" />
                <span className="font-semibold">Lapangan Masjid Al Muhajirin</span>
              </div>
            </div>

            <button
              onClick={onScrollToRegistration}
              className="bg-white text-[#2E7D32] px-8 py-4 rounded-xl font-bold text-lg hover:bg-[#C8E6C9] transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 flex items-center justify-center gap-2 mx-auto"
            >
              <Users className="h-5 w-5" />
              Daftar Sekarang - GRATIS!
              <ArrowRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      </section>

      {/* Why Join Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-4">Mengapa Harus Daftar?</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Meskipun GRATIS, pendaftaran diperlukan untuk beberapa alasan penting
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {whyJoin.map((item, index) => (
              <div
                key={index}
                className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-6 border-2 border-gray-100 hover:shadow-lg transition-all duration-300 hover:border-[#4CAF50]/30"
              >
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-r ${item.color} flex items-center justify-center mb-4`}>
                  <item.icon className="h-7 w-7 text-white" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-600 text-sm">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 bg-gradient-to-b from-[#E8F5E9] to-white">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <div className="inline-flex items-center gap-2 bg-[#4CAF50]/10 text-[#2E7D32] px-4 py-2 rounded-full font-semibold mb-6">
                  <Heart className="h-5 w-5" />
                  Manfaat Senam
                </div>
                <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-6">
                  Sehat Bersama, Kuat Bersama
                </h2>
                <p className="text-gray-600 mb-8 leading-relaxed">
                  Senam pagi adalah cara terbaik untuk memulai hari. Dengan gerakan yang tepat dan teratur,
                  tubuh akan menjadi lebih bugar, sendi lebih lentur, dan pikiran lebih segar.
                </p>

                <div className="space-y-3">
                  {senamBenefits.map((benefit, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <CheckCircle2 className="h-5 w-5 text-[#4CAF50] mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="relative">
                <div className="relative h-80 md:h-96 rounded-2xl overflow-hidden shadow-2xl">
                  <Image
                    src="/images/masjid/events/senior-senam-bersama.jpg"
                    alt="Senam Sehat Al Muhajirin"
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  <div className="absolute bottom-6 left-6 right-6">
                    <p className="text-white font-bold text-lg">Senam bersama untuk kesehatan bersama</p>
                  </div>
                </div>
                <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-gradient-to-br from-[#4CAF50] to-[#2E7D32] rounded-2xl -z-10" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Community Programs */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-4">Program Komunitas Sehat</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Setelah event Run-Madan, kami akan membentuk komunitas olahraga rutin.
              Daftar sekarang dan pilih program yang Anda minati!
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {COMMUNITY_INTERESTS.map((program, index) => (
              <div
                key={index}
                className="bg-gradient-to-br from-[#E8F5E9] to-white rounded-2xl p-6 border-2 border-[#4CAF50]/20 hover:border-[#4CAF50] transition-all duration-300 hover:shadow-lg"
              >
                <div className="w-12 h-12 rounded-xl bg-[#4CAF50] flex items-center justify-center mb-4">
                  <HeartPulse className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{program.label}</h3>
                <p className="text-gray-600 text-sm">{program.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Dress Code Section */}
      <section className="py-16 bg-gradient-to-br from-[#E3F2FD] to-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl p-8 shadow-lg border-2 border-[#2196F3]/30">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-r from-[#2196F3] to-[#1976D2] flex items-center justify-center flex-shrink-0">
                  <Star className="h-7 w-7 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-black text-gray-900 mb-2">Ketentuan Pakaian</h3>
                  <p className="text-gray-600">Mohon perhatikan ketentuan berikut untuk kenyamanan bersama</p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-[#E3F2FD] rounded-xl p-5">
                  <h4 className="font-bold text-[#1976D2] mb-3 flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5" />
                    Wajib
                  </h4>
                  <ul className="space-y-2 text-gray-700 text-sm">
                    <li className="flex items-start gap-2">
                      <span className="text-[#1976D2]">•</span>
                      <span>Pakaian olahraga yang <strong>menutup aurat</strong></span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-[#1976D2]">•</span>
                      <span>Bagi muslimah: jilbab/kerudung dan pakaian tidak ketat</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-[#1976D2]">•</span>
                      <span>Sepatu olahraga yang nyaman</span>
                    </li>
                  </ul>
                </div>

                <div className="bg-gradient-to-br from-blue-100 to-white rounded-xl p-5 border-2 border-blue-200">
                  <h4 className="font-bold text-[#1976D2] mb-3 flex items-center gap-2">
                    <Sparkles className="h-5 w-5" />
                    Nuansa Warna
                  </h4>
                  <div className="flex gap-4 mb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-blue-500 border-2 border-white shadow-md" />
                      <span className="font-semibold text-gray-700">Biru</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-white border-2 border-gray-300 shadow-md" />
                      <span className="font-semibold text-gray-700">Putih</span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600">
                    Dianjurkan mengenakan pakaian bernuansa <strong>biru atau putih</strong> untuk keseragaman
                  </p>
                </div>
              </div>

              <div className="mt-6 bg-yellow-50 rounded-xl p-4 border border-yellow-200">
                <div className="flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-gray-700">
                    Peserta yang tidak memenuhi ketentuan pakaian akan diminta untuk memperbaiki terlebih dahulu
                    sebelum mengikuti kegiatan. Terima kasih atas pengertiannya.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-br from-[#4CAF50] via-[#2E7D32] to-[#1B5E20] text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-black mb-4 text-[#C8E6C9]">
            Yuk, Sehat Bersama!
          </h2>
          <p className="text-lg text-white/90 mb-8 max-w-2xl mx-auto">
            Daftarkan diri Anda dan keluarga sekarang. Pendaftaran GRATIS dan terbuka untuk semua usia!
          </p>
          <button
            onClick={onScrollToRegistration}
            className="bg-white text-[#2E7D32] px-10 py-5 rounded-xl font-bold text-xl hover:bg-[#C8E6C9] transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 flex items-center justify-center gap-3 mx-auto"
          >
            <Users className="h-6 w-6" />
            Daftar Sekarang
            <ArrowRight className="h-6 w-6" />
          </button>
        </div>
      </section>
    </div>
  );
}
