// src/app/units/lazmu/laporan/page.tsx
'use client';

import React from 'react';
import Link from 'next/link';
import {
  FileText,
  Shield,
  BarChart3,
  Calendar,
  CheckCircle2,
  Eye,
  Download,
  Heart,
  ArrowRight,
  MessageCircle,
  Clock,
  Users,
  FileCheck,
} from 'lucide-react';

export default function LaporanPage() {
  const handleWhatsAppClick = () => {
    window.open('https://wa.me/6281223343416?text=Assalamualaikum,%20saya%20ingin%20meminta%20laporan%20penggunaan%20donasi', '_blank');
  };

  const transparansi = [
    {
      icon: Calendar,
      title: 'Laporan Keuangan Bulanan',
      description: 'Laporan penerimaan dan penyaluran dana setiap bulan',
    },
    {
      icon: FileCheck,
      title: 'Dokumentasi Penyaluran',
      description: 'Foto dan dokumentasi setiap kegiatan penyaluran program',
    },
    {
      icon: Eye,
      title: 'Audit Internal Berkala',
      description: 'Pemeriksaan internal untuk memastikan pengelolaan yang baik',
    },
    {
      icon: FileText,
      title: 'Publikasi Laporan Tahunan',
      description: 'Laporan lengkap tahunan yang dapat diakses publik',
    },
  ];

  const laporanList = [
    {
      title: 'Laporan Penerimaan & Penyaluran',
      period: 'Bulanan',
      description: 'Laporan rinci penerimaan dan penyaluran dana ZISWAF',
      icon: BarChart3,
    },
    {
      title: 'Laporan Program Beasiswa',
      period: 'Per Semester',
      description: 'Perkembangan penerima beasiswa dan penggunaan dana',
      icon: Users,
    },
    {
      title: 'Laporan Layanan Ambulance',
      period: 'Bulanan',
      description: 'Statistik layanan ambulance gratis',
      icon: FileText,
    },
    {
      title: 'Laporan Poliklinik',
      period: 'Bulanan',
      description: 'Jumlah pasien dan layanan yang diberikan',
      icon: FileText,
    },
    {
      title: 'Laporan Program Sosial',
      period: 'Per Kegiatan',
      description: 'Dokumentasi setiap program sosial yang dilaksanakan',
      icon: FileCheck,
    },
    {
      title: 'Laporan Tahunan',
      period: 'Tahunan',
      description: 'Ringkasan lengkap kegiatan dan keuangan selama setahun',
      icon: Calendar,
    },
  ];

  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-br from-[#1B5E20] via-[#2E7D32] to-[#388E3C]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-sm text-white px-4 py-2 rounded-full mb-6">
              <FileText className="h-5 w-5" />
              <span className="text-sm font-medium">Laporan & Akuntabilitas</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Transparansi Pengelolaan
            </h1>
            <p className="text-lg text-[#C8E6C9]">
              LAZ Muhajirin berkomitmen pada transparansi dalam pengelolaan dana ZISWAF.
              Setiap donasi Anda tercatat dan dilaporkan secara berkala.
            </p>
          </div>
        </div>
      </section>

      {/* Komitmen Transparansi */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center space-x-2 bg-[#E8F5E9] text-[#2E7D32] px-4 py-2 rounded-full mb-6">
              <Shield className="h-5 w-5" />
              <span className="text-sm font-semibold">Komitmen Kami</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Amanah & <span className="text-[#2E7D32]">Transparan</span>
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Kami berkomitmen untuk mengelola dana ZISWAF secara amanah, profesional,
              dan transparan kepada seluruh donatur dan masyarakat.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {transparansi.map((item, index) => (
              <div
                key={index}
                className="bg-[#E8F5E9] p-6 rounded-2xl text-center hover:shadow-lg transition-all duration-300"
              >
                <div className="w-14 h-14 bg-gradient-to-br from-[#4CAF50] to-[#2E7D32] rounded-xl flex items-center justify-center mx-auto mb-4">
                  <item.icon className="h-7 w-7 text-white" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-600 text-sm">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Jenis Laporan */}
      <section className="py-16 bg-[#E8F5E9]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center space-x-2 bg-white text-[#2E7D32] px-4 py-2 rounded-full mb-6">
              <BarChart3 className="h-5 w-5" />
              <span className="text-sm font-semibold">Jenis Laporan</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Laporan yang <span className="text-[#2E7D32]">Tersedia</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {laporanList.map((laporan, index) => (
              <div
                key={index}
                className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-[#4CAF50] to-[#2E7D32] rounded-xl flex items-center justify-center">
                    <laporan.icon className="h-6 w-6 text-white" />
                  </div>
                  <span className="bg-[#E8F5E9] text-[#2E7D32] text-xs font-semibold px-3 py-1 rounded-full">
                    {laporan.period}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{laporan.title}</h3>
                <p className="text-gray-600 text-sm">{laporan.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Request Report */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="bg-gradient-to-br from-[#1B5E20] to-[#2E7D32] rounded-3xl p-8 md:p-12 text-white text-center">
              <FileText className="h-16 w-16 mx-auto mb-6 text-[#FFB300]" />
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Minta Laporan Penggunaan Donasi
              </h2>
              <p className="text-lg text-[#C8E6C9] mb-8 max-w-2xl mx-auto">
                Sebagai donatur, Anda berhak mengetahui bagaimana donasi Anda digunakan.
                Hubungi kami untuk meminta laporan penggunaan dana.
              </p>
              <button
                onClick={handleWhatsAppClick}
                className="inline-flex items-center space-x-2 bg-gradient-to-r from-[#FFB300] to-[#FFC107] text-gray-900 px-8 py-4 rounded-full font-bold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              >
                <MessageCircle className="h-5 w-5" />
                <span>Minta Laporan via WhatsApp</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Info Box */}
      <section className="py-16 bg-[#E8F5E9]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white p-8 rounded-2xl shadow-lg">
              <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                Informasi Penting
              </h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 bg-[#E8F5E9] rounded-lg flex items-center justify-center flex-shrink-0">
                    <Clock className="h-5 w-5 text-[#2E7D32]" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 mb-1">Waktu Respon</h4>
                    <p className="text-gray-600 text-sm">
                      Permintaan laporan akan diproses dalam 1-3 hari kerja
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 bg-[#E8F5E9] rounded-lg flex items-center justify-center flex-shrink-0">
                    <Shield className="h-5 w-5 text-[#2E7D32]" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 mb-1">Kerahasiaan</h4>
                    <p className="text-gray-600 text-sm">
                      Data donatur dijaga kerahasiaannya sesuai ketentuan
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 bg-[#E8F5E9] rounded-lg flex items-center justify-center flex-shrink-0">
                    <CheckCircle2 className="h-5 w-5 text-[#2E7D32]" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 mb-1">Verifikasi</h4>
                    <p className="text-gray-600 text-sm">
                      Donatur dapat melakukan verifikasi langsung ke lokasi
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 bg-[#E8F5E9] rounded-lg flex items-center justify-center flex-shrink-0">
                    <Download className="h-5 w-5 text-[#2E7D32]" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 mb-1">Format Laporan</h4>
                    <p className="text-gray-600 text-sm">
                      Laporan tersedia dalam format PDF dan dapat dicetak
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Yakin dengan <span className="text-[#2E7D32]">Amanah Kami?</span>
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              Salurkan zakat, infaq, sedekah, dan wakaf Anda melalui LAZ Muhajirin.
              Kami jamin pengelolaan yang amanah dan transparan.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={handleWhatsAppClick}
                className="flex items-center justify-center space-x-2 bg-[#25D366] hover:bg-[#128C7E] text-white px-8 py-4 rounded-full font-semibold shadow-lg transition-all duration-300"
              >
                <MessageCircle className="h-5 w-5" />
                <span>Hubungi Kami</span>
              </button>
              <Link
                href="/donasi"
                className="flex items-center justify-center space-x-2 bg-gradient-to-r from-[#FFB300] to-[#FFC107] text-gray-900 px-8 py-4 rounded-full font-bold shadow-lg transition-all duration-300"
              >
                <Heart className="h-5 w-5" />
                <span>Donasi Sekarang</span>
                <ArrowRight className="h-5 w-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
