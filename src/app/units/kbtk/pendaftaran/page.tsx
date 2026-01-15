// src/app/units/kbtk/pendaftaran/page.tsx
'use client';

import React from 'react';
import Image from 'next/image';
import {
  FileText,
  CheckCircle,
  Baby,
  Sparkles,
  School,
  ClipboardList,
  Gift,
  MessageCircle,
  Phone
} from 'lucide-react';

export default function PendaftaranPage() {
  const handleWhatsAppClick = () => {
    window.open('https://wa.me/6281292359103?text=Assalamualaikum,%20saya%20ingin%20mendaftarkan%20anak%20saya%20di%20KBTK%20Al%20Muhajirin', '_blank');
  };

  const syaratPendaftaran = [
    { icon: FileText, text: 'Fotokopi Akta Kelahiran' },
    { icon: FileText, text: 'Fotokopi Kartu Keluarga (KK)' },
    { icon: FileText, text: 'Pas Foto Berwarna 3x4 (4 lembar)' },
    { icon: FileText, text: 'Fotokopi KTP Orang Tua/Wali' },
    { icon: ClipboardList, text: 'Formulir Pendaftaran yang Telah Diisi' },
  ];

  const jenjang = [
    {
      icon: Baby,
      title: 'Day Care',
      usia: '1 - 3 Tahun',
      description: 'Program penitipan anak dengan pengasuhan penuh kasih sayang',
      color: 'from-pink-500 to-rose-500',
      bgColor: 'bg-pink-50',
    },
    {
      icon: Sparkles,
      title: 'Kelompok Bermain (KB)',
      usia: '3 - 4 Tahun',
      description: 'Belajar sambil bermain dengan metode BCCT',
      color: 'from-[#00BCD4] to-[#006064]',
      bgColor: 'bg-[#E0F7FA]',
    },
    {
      icon: School,
      title: 'TK A',
      usia: '4 - 5 Tahun',
      description: 'Persiapan memasuki jenjang TK B',
      color: 'from-[#4CAF50] to-[#2E7D32]',
      bgColor: 'bg-green-50',
    },
    {
      icon: School,
      title: 'TK B',
      usia: '5 - 6 Tahun',
      description: 'Persiapan memasuki jenjang SD',
      color: 'from-[#FFB300] to-[#FF8F00]',
      bgColor: 'bg-amber-50',
    },
  ];

  const tataTertibMurid = [
    'Hadir 5 menit sebelum kegiatan belajar dimulai',
    'Membawa bekal makanan dan minuman sehat dengan wadah ramah lingkungan',
    'Tidak membawa mainan dari rumah',
    'Memakai seragam sekolah dengan rapi sesuai jadwal',
    'Tidak memakai perhiasan berlebihan atau cat kuku',
    'Bersikap ramah dan sopan dengan 5S (Senyum, Salam, Sapa, Sopan, Santun)',
    'Menjaga kebersihan, keamanan, dan ketertiban lingkungan sekolah',
    'Menjaga dan merawat fasilitas sekolah',
    'Perayaan ulang tahun hanya dalam bentuk do\'a bersama (tanpa tiup lilin/potong kue)',
  ];

  const tataTertibOrtu = [
    'Berpenampilan sopan dan rapi saat masuk lingkungan sekolah (berjilbab bagi muslimah)',
    'Mengantar dan menjemput hanya sampai pagar halaman sekolah',
    'Tidak berada di lingkungan sekolah selama KBM berlangsung',
    'Konsultasi dengan wali kelas dilakukan setelah KBM atau dengan janji',
    'Hadir saat menerima undangan dari sekolah',
    'Memberikan dukungan dan kerja sama penuh untuk program kegiatan siswa',
    'Tidak memberi hadiah dalam bentuk apapun kepada tenaga pendidik',
    'Pembayaran uang sekolah paling lambat tanggal 10 setiap bulan',
  ];

  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-br from-[#006064] to-[#00838F]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-sm text-white px-4 py-2 rounded-full mb-6">
              <ClipboardList className="h-5 w-5" />
              <span className="text-sm font-medium">Pendaftaran</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Pendaftaran Siswa Baru
            </h1>
            <p className="text-lg text-[#B2EBF2]">
              Daftarkan putra-putri Anda untuk mendapatkan pendidikan berkualitas dengan fondasi nilai-nilai Islami
            </p>
          </div>
        </div>
      </section>

      {/* Free Assessment Banner */}
      <section className="py-8 bg-gradient-to-r from-[#FFB300] to-[#FF8F00]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-center gap-4 text-center md:text-left">
            <Gift className="h-10 w-10 text-white" />
            <div>
              <h3 className="text-xl font-bold text-white">Asesmen Perkembangan Anak GRATIS!</h3>
              <p className="text-white/90">Isi formulir pendaftaran tanpa komitmen untuk mendaftar</p>
            </div>
            <button
              onClick={handleWhatsAppClick}
              className="bg-white hover:bg-gray-100 text-[#FF8F00] px-6 py-3 rounded-full font-semibold transition-colors"
            >
              Daftar Sekarang
            </button>
          </div>
        </div>
      </section>

      {/* Jenjang Pendidikan */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Jenjang Pendidikan</h2>
            <p className="text-gray-600">Pilih jenjang yang sesuai dengan usia putra-putri Anda</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {jenjang.map((item, index) => (
              <div
                key={index}
                className={`${item.bgColor} rounded-2xl p-6 hover:shadow-lg transition-shadow`}
              >
                <div className={`w-14 h-14 bg-gradient-to-r ${item.color} rounded-xl flex items-center justify-center mb-4`}>
                  <item.icon className="h-7 w-7 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-sm font-semibold text-[#006064] mb-2">Usia: {item.usia}</p>
                <p className="text-gray-600 text-sm">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Syarat Pendaftaran */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center space-x-2 bg-[#00BCD4]/10 text-[#006064] px-4 py-2 rounded-full mb-6">
                <FileText className="h-5 w-5" />
                <span className="text-sm font-medium">Syarat Pendaftaran</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Dokumen yang Diperlukan
              </h2>
              <div className="space-y-4">
                {syaratPendaftaran.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center space-x-4 p-4 bg-white rounded-xl shadow-sm"
                  >
                    <div className="w-10 h-10 bg-gradient-to-r from-[#00BCD4] to-[#006064] rounded-lg flex items-center justify-center flex-shrink-0">
                      <item.icon className="h-5 w-5 text-white" />
                    </div>
                    <span className="text-gray-700 font-medium">{item.text}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="relative h-96 rounded-2xl overflow-hidden shadow-2xl">
                <Image
                  src="/images/kbtk/kegiatan/kbtk-front-01.jpg"
                  alt="KBTK Al Muhajirin"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-gradient-to-br from-[#00BCD4] to-[#006064] rounded-2xl -z-10"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Tata Tertib */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Tata Tertib Sekolah</h2>
            <p className="text-gray-600">Untuk menciptakan lingkungan belajar yang kondusif</p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Tata Tertib Murid */}
            <div className="bg-gradient-to-br from-[#E0F7FA] to-[#B2EBF2] rounded-2xl p-8">
              <h3 className="text-xl font-bold text-[#006064] mb-6 flex items-center gap-2">
                <School className="h-6 w-6" />
                Tata Tertib Murid
              </h3>
              <div className="space-y-3">
                {tataTertibMurid.map((item, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <CheckCircle className="h-5 w-5 text-[#4CAF50] flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700 text-sm">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Tata Tertib Orang Tua */}
            <div className="bg-gradient-to-br from-[#FFF8E1] to-[#FFECB3] rounded-2xl p-8">
              <h3 className="text-xl font-bold text-[#FF8F00] mb-6 flex items-center gap-2">
                <Baby className="h-6 w-6" />
                Tata Tertib Orang Tua
              </h3>
              <div className="space-y-3">
                {tataTertibOrtu.map((item, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <CheckCircle className="h-5 w-5 text-[#FFB300] flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700 text-sm">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How to Register */}
      <section className="py-20 bg-gradient-to-br from-[#006064] to-[#00838F]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Cara Mendaftar</h2>
            <p className="text-[#B2EBF2]">Proses pendaftaran yang mudah dan cepat</p>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            {[
              { step: '1', title: 'Hubungi Kami', desc: 'Hubungi via WhatsApp untuk informasi dan konsultasi' },
              { step: '2', title: 'Kunjungi Sekolah', desc: 'Jadwalkan kunjungan untuk melihat fasilitas sekolah' },
              { step: '3', title: 'Siapkan Dokumen', desc: 'Lengkapi persyaratan dokumen yang diperlukan' },
              { step: '4', title: 'Daftar', desc: 'Isi formulir dan selesaikan proses pendaftaran' },
            ].map((item, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl font-bold text-white">{item.step}</span>
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{item.title}</h3>
                <p className="text-[#B2EBF2] text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-[#B2EBF2] via-[#80DEEA] to-[#B2EBF2]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-[#006064] mb-6">
              Siap Mendaftarkan Putra-Putri Anda?
            </h2>
            <p className="text-lg text-[#00838F] mb-8">
              Hubungi kami sekarang untuk informasi lebih lanjut atau langsung daftar via WhatsApp
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={handleWhatsAppClick}
                className="flex items-center justify-center space-x-2 bg-[#25D366] hover:bg-[#128C7E] text-white px-8 py-4 rounded-full font-semibold shadow-lg hover:shadow-xl transition-all"
              >
                <MessageCircle className="h-5 w-5" />
                <span>Daftar via WhatsApp</span>
              </button>
              <a
                href="tel:+6281292359103"
                className="flex items-center justify-center space-x-2 bg-[#006064] hover:bg-[#004D40] text-white px-8 py-4 rounded-full font-semibold shadow-lg hover:shadow-xl transition-all"
              >
                <Phone className="h-5 w-5" />
                <span>Telepon: +62 812-9235-9103</span>
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
