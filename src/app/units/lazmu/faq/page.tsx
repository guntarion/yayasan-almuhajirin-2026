// src/app/units/lazmu/faq/page.tsx
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  HelpCircle,
  ChevronDown,
  Heart,
  ArrowRight,
  MessageCircle,
  Search,
} from 'lucide-react';

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [searchQuery, setSearchQuery] = useState('');

  const handleWhatsAppClick = () => {
    window.open('https://wa.me/6281223343416?text=Assalamualaikum,%20saya%20ingin%20bertanya%20tentang%20LAZ%20Muhajirin', '_blank');
  };

  const faqs = [
    {
      question: 'Apakah LAZ Muhajirin resmi dan terdaftar?',
      answer: 'Ya, LAZ Muhajirin beroperasi dengan SK resmi NO.001/S.K PENGURUS/MPZ/IX/1446H/2025M dan merupakan mitra resmi LAZNAS Dewan Da\'wah Islamiyah Indonesia Provinsi Jawa Timur. Kami beroperasi sesuai regulasi BAZNAS dan Kementerian Agama RI.',
    },
    {
      question: 'Bagaimana cara mendapatkan laporan penggunaan donasi saya?',
      answer: 'Anda dapat menghubungi kami via WhatsApp di 0812-2334-3416 untuk meminta laporan penggunaan dana. Kami menyediakan laporan keuangan bulanan, dokumentasi penyaluran program, dan laporan tahunan yang dapat diakses oleh donatur.',
    },
    {
      question: 'Apakah ada layanan jemput zakat?',
      answer: 'Ya, kami menyediakan layanan jemput zakat, infaq, dan sedekah ke rumah atau kantor Anda di wilayah Sidoarjo dan sekitarnya. Layanan ini gratis tanpa biaya tambahan. Hubungi 0812-2334-3416 untuk menjadwalkan penjemputan.',
    },
    {
      question: 'Siapa saja yang berhak menerima zakat (mustahik)?',
      answer: 'Sesuai syariat Islam, ada 8 golongan mustahik yang berhak menerima zakat: (1) Fakir, (2) Miskin, (3) Amil (pengelola zakat), (4) Muallaf, (5) Hamba Sahaya, (6) Gharimin (orang yang berutang), (7) Fisabilillah, dan (8) Ibnu Sabil (musafir yang kehabisan bekal).',
    },
    {
      question: 'Bagaimana cara menghitung zakat?',
      answer: 'Anda dapat menghubungi kami untuk konsultasi perhitungan zakat. Tim kami akan membantu menghitung zakat maal, zakat profesi, atau jenis zakat lainnya sesuai dengan kondisi Anda. Hubungi WhatsApp 0812-2334-3416 untuk konsultasi.',
    },
    {
      question: 'Apa saja program unggulan LAZ Muhajirin?',
      answer: 'Program unggulan kami meliputi: (1) Beasiswa Pendidikan untuk 40 siswa/tahun, (2) Ambulance Gratis 24 jam, (3) Poliklinik Gratis setiap Selasa & Jumat, (4) Khitan Ceria untuk 75 anak/tahun, (5) Perawatan Jenazah, (6) Tanggap Bencana, dan berbagai program sosial kemanusiaan lainnya.',
    },
    {
      question: 'Bagaimana cara berdonasi di LAZ Muhajirin?',
      answer: 'Ada 3 cara berdonasi: (1) Transfer Bank ke rekening Bank Muamalat kami (ZIS: 707.000.7500, Wakaf: 707.000.7498, Zakat Maal: 707.000.7499), (2) Scan QRIS kami yang bisa digunakan dengan semua e-wallet dan mobile banking, (3) Layanan jemput zakat ke lokasi Anda.',
    },
    {
      question: 'Apakah donasi saya aman?',
      answer: 'Ya, donasi Anda aman dan tercatat dengan baik. Kami mengelola dana ZISWAF secara amanah, profesional, dan transparan. Setiap donasi akan mendapat bukti penerimaan dan Anda dapat meminta laporan penggunaan dana kapan saja.',
    },
    {
      question: 'Apa perbedaan zakat, infaq, sedekah, dan wakaf?',
      answer: 'Zakat adalah kewajiban bagi muslim yang memenuhi syarat nisab. Infaq adalah pengeluaran sukarela untuk kebaikan. Sedekah lebih luas, bisa berupa harta atau perbuatan baik. Wakaf adalah menyerahkan harta untuk kepentingan umum secara permanen. Semua dapat disalurkan melalui LAZ Muhajirin.',
    },
    {
      question: 'Bagaimana cara menggunakan layanan ambulance gratis?',
      answer: 'Layanan ambulance gratis tersedia 24 jam. Hubungi call center kami di 081-55-4444-576 kapan saja Anda membutuhkan. Layanan ini gratis untuk masyarakat yang membutuhkan.',
    },
    {
      question: 'Apakah LAZ Muhajirin menerima donasi non-tunai (barang)?',
      answer: 'Ya, kami menerima donasi dalam bentuk barang seperti sembako, pakaian layak pakai, dan barang kebutuhan lainnya. Hubungi kami terlebih dahulu untuk koordinasi penyerahan barang.',
    },
    {
      question: 'Bagaimana cara menjadi donatur tetap?',
      answer: 'Untuk menjadi donatur tetap, hubungi kami via WhatsApp di 0812-2334-3416. Tim kami akan membantu mengatur jadwal donasi rutin Anda dan Anda akan mendapatkan laporan berkala penggunaan dana.',
    },
  ];

  const filteredFaqs = faqs.filter(
    (faq) =>
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-br from-[#1B5E20] via-[#2E7D32] to-[#388E3C]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-sm text-white px-4 py-2 rounded-full mb-6">
              <HelpCircle className="h-5 w-5" />
              <span className="text-sm font-medium">Pertanyaan Umum</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              FAQ
            </h1>
            <p className="text-lg text-[#C8E6C9]">
              Temukan jawaban atas pertanyaan yang sering diajukan tentang
              LAZ Muhajirin dan layanan kami.
            </p>
          </div>
        </div>
      </section>

      {/* Search Section */}
      <section className="py-8 bg-white border-b">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Cari pertanyaan..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:border-[#4CAF50] focus:outline-none transition-colors"
              />
            </div>
          </div>
        </div>
      </section>

      {/* FAQ List */}
      <section className="py-16 bg-[#E8F5E9]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            {filteredFaqs.length === 0 ? (
              <div className="text-center py-12">
                <HelpCircle className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 text-lg">
                  Tidak ada pertanyaan yang cocok dengan pencarian Anda.
                </p>
                <button
                  onClick={handleWhatsAppClick}
                  className="mt-4 inline-flex items-center space-x-2 text-[#2E7D32] font-semibold hover:underline"
                >
                  <MessageCircle className="h-5 w-5" />
                  <span>Tanyakan langsung via WhatsApp</span>
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredFaqs.map((faq, index) => (
                  <div
                    key={index}
                    className="bg-white rounded-2xl shadow-md overflow-hidden"
                  >
                    <button
                      onClick={() => setOpenIndex(openIndex === index ? null : index)}
                      className="w-full flex items-center justify-between p-6 text-left hover:bg-gray-50 transition-colors"
                    >
                      <span className="font-semibold text-gray-900 pr-4">
                        {faq.question}
                      </span>
                      <ChevronDown
                        className={`h-5 w-5 text-[#4CAF50] flex-shrink-0 transition-transform duration-300 ${
                          openIndex === index ? 'rotate-180' : ''
                        }`}
                      />
                    </button>
                    <div
                      className={`overflow-hidden transition-all duration-300 ${
                        openIndex === index ? 'max-h-96' : 'max-h-0'
                      }`}
                    >
                      <div className="px-6 pb-6">
                        <div className="pt-2 border-t border-gray-100">
                          <p className="text-gray-600 leading-relaxed mt-4">
                            {faq.answer}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Still Have Questions */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="bg-gradient-to-br from-[#1B5E20] to-[#2E7D32] rounded-3xl p-8 md:p-12 text-white text-center">
              <HelpCircle className="h-16 w-16 mx-auto mb-6 text-[#FFB300]" />
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Masih Punya Pertanyaan?
              </h2>
              <p className="text-lg text-[#C8E6C9] mb-8 max-w-2xl mx-auto">
                Jika pertanyaan Anda belum terjawab, jangan ragu untuk menghubungi
                kami langsung. Tim kami siap membantu Anda.
              </p>
              <button
                onClick={handleWhatsAppClick}
                className="inline-flex items-center space-x-2 bg-[#25D366] hover:bg-[#128C7E] text-white px-8 py-4 rounded-full font-semibold shadow-lg transition-all duration-300 transform hover:scale-105"
              >
                <MessageCircle className="h-5 w-5" />
                <span>Tanya via WhatsApp</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-[#E8F5E9]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Siap Menyalurkan <span className="text-[#2E7D32]">ZISWAF?</span>
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              Tunaikan zakat, infaq, sedekah, dan wakaf Anda melalui LAZ Muhajirin.
              Amanah dalam mengelola, profesional dalam menyalurkan.
            </p>
            <Link
              href="/donasi"
              className="inline-flex items-center space-x-2 bg-gradient-to-r from-[#FFB300] to-[#FFC107] text-gray-900 px-8 py-4 rounded-full font-bold shadow-lg transition-all duration-300 transform hover:scale-105"
            >
              <Heart className="h-5 w-5" />
              <span>Donasi Sekarang</span>
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
