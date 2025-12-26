// src/app/units/lazmu/donasi/page.tsx
'use client';

import React from 'react';
import {
  Heart,
  CreditCard,
  QrCode,
  Truck,
  Phone,
  Copy,
  Check,
  ArrowRight,
  MessageCircle,
  Wallet,
  Gift,
  Calculator,
} from 'lucide-react';

export default function DonasiPage() {
  const [copied, setCopied] = React.useState<string | null>(null);

  const handleWhatsAppClick = () => {
    window.open('https://wa.me/6281223343416?text=Assalamualaikum,%20saya%20ingin%20menjadwalkan%20jemput%20zakat', '_blank');
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const bankAccounts = [
    {
      id: 'zis',
      type: 'Zakat, Infaq, Sedekah',
      bank: 'Bank Muamalat',
      accountNumber: '707.000.7500',
      accountName: 'LAZ Muhajirin Rewwin',
      icon: Heart,
      color: 'from-green-500 to-green-600',
    },
    {
      id: 'wakaf',
      type: 'Wakaf',
      bank: 'Bank Muamalat',
      accountNumber: '707.000.7498',
      accountName: 'LAZ Muhajirin Rewwin',
      icon: Gift,
      color: 'from-blue-500 to-blue-600',
    },
    {
      id: 'zakatmaal',
      type: 'Zakat Maal',
      bank: 'Bank Muamalat',
      accountNumber: '707.000.7499',
      accountName: 'LAZ Muhajirin Rewwin',
      icon: Wallet,
      color: 'from-amber-500 to-amber-600',
    },
  ];

  const donationSteps = [
    {
      step: 1,
      title: 'Pilih Jenis Donasi',
      description: 'Tentukan jenis donasi: Zakat, Infaq, Sedekah, Wakaf, atau program spesifik',
    },
    {
      step: 2,
      title: 'Pilih Metode Pembayaran',
      description: 'Transfer bank, QRIS, atau gunakan layanan jemput zakat',
    },
    {
      step: 3,
      title: 'Konfirmasi Donasi',
      description: 'Kirim bukti transfer via WhatsApp untuk konfirmasi penerimaan',
    },
    {
      step: 4,
      title: 'Terima Laporan',
      description: 'Dapatkan laporan penggunaan donasi secara berkala',
    },
  ];

  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-br from-[#1B5E20] via-[#2E7D32] to-[#388E3C]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-sm text-white px-4 py-2 rounded-full mb-6">
              <Heart className="h-5 w-5 text-[#FFB300]" />
              <span className="text-sm font-medium">Cara Berdonasi</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Salurkan Donasi Anda
            </h1>
            <p className="text-lg text-[#C8E6C9]">
              Berbagai kemudahan untuk menyalurkan zakat, infaq, sedekah, dan wakaf Anda
              melalui LAZ Muhajirin.
            </p>
          </div>
        </div>
      </section>

      {/* Donation Methods Overview */}
      <section className="py-12 bg-white border-b">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="bg-gradient-to-br from-[#E8F5E9] to-[#C8E6C9] p-6 rounded-2xl text-center">
              <div className="w-16 h-16 bg-white rounded-2xl shadow-lg flex items-center justify-center mx-auto mb-4">
                <CreditCard className="h-8 w-8 text-[#2E7D32]" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">Transfer Bank</h3>
              <p className="text-gray-600 text-sm">Bank Muamalat</p>
            </div>
            <div className="bg-gradient-to-br from-[#E8F5E9] to-[#C8E6C9] p-6 rounded-2xl text-center">
              <div className="w-16 h-16 bg-white rounded-2xl shadow-lg flex items-center justify-center mx-auto mb-4">
                <QrCode className="h-8 w-8 text-[#2E7D32]" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">QRIS</h3>
              <p className="text-gray-600 text-sm">Semua E-Wallet</p>
            </div>
            <div className="bg-gradient-to-br from-[#E8F5E9] to-[#C8E6C9] p-6 rounded-2xl text-center">
              <div className="w-16 h-16 bg-white rounded-2xl shadow-lg flex items-center justify-center mx-auto mb-4">
                <Truck className="h-8 w-8 text-[#2E7D32]" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">Jemput Zakat</h3>
              <p className="text-gray-600 text-sm">Layanan Antar Jemput</p>
            </div>
          </div>
        </div>
      </section>

      {/* Bank Transfer Section */}
      <section id="bank" className="py-16 bg-[#E8F5E9]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center space-x-2 bg-white text-[#2E7D32] px-4 py-2 rounded-full mb-6">
              <CreditCard className="h-5 w-5" />
              <span className="text-sm font-semibold">Transfer Bank</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Rekening <span className="text-[#2E7D32]">Donasi</span>
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Transfer donasi Anda ke rekening Bank Muamalat berikut sesuai jenis donasi
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {bankAccounts.map((account) => (
              <div
                key={account.id}
                className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300"
              >
                <div className={`h-2 bg-gradient-to-r ${account.color}`}></div>
                <div className="p-6">
                  <div className={`w-14 h-14 bg-gradient-to-r ${account.color} rounded-xl flex items-center justify-center mb-4`}>
                    <account.icon className="h-7 w-7 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-1">{account.type}</h3>
                  <p className="text-gray-600 mb-4">{account.bank}</p>

                  <div className="bg-gray-50 p-4 rounded-xl mb-4">
                    <p className="text-sm text-gray-500 mb-1">No. Rekening</p>
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-mono font-bold text-gray-900">
                        {account.accountNumber}
                      </span>
                      <button
                        onClick={() => copyToClipboard(account.accountNumber.replace(/\./g, ''), account.id)}
                        className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                      >
                        {copied === account.id ? (
                          <Check className="h-5 w-5 text-green-500" />
                        ) : (
                          <Copy className="h-5 w-5 text-gray-400" />
                        )}
                      </button>
                    </div>
                  </div>

                  <p className="text-sm text-gray-600">
                    <span className="font-semibold">a.n.</span> {account.accountName}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* QRIS Section */}
      <section id="qris" className="py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <div className="inline-flex items-center space-x-2 bg-[#E8F5E9] text-[#2E7D32] px-4 py-2 rounded-full mb-6">
                  <QrCode className="h-5 w-5" />
                  <span className="text-sm font-semibold">QRIS</span>
                </div>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                  Scan & <span className="text-[#2E7D32]">Pay</span>
                </h2>
                <p className="text-gray-600 mb-6">
                  Scan kode QRIS kami untuk kemudahan pembayaran dari berbagai e-wallet
                  dan mobile banking.
                </p>
                <div className="space-y-3">
                  <p className="flex items-center space-x-2 text-gray-700">
                    <Check className="h-5 w-5 text-[#4CAF50]" />
                    <span>Semua E-Wallet (GoPay, OVO, DANA, dll)</span>
                  </p>
                  <p className="flex items-center space-x-2 text-gray-700">
                    <Check className="h-5 w-5 text-[#4CAF50]" />
                    <span>Mobile Banking</span>
                  </p>
                  <p className="flex items-center space-x-2 text-gray-700">
                    <Check className="h-5 w-5 text-[#4CAF50]" />
                    <span>Cepat & Mudah</span>
                  </p>
                </div>
              </div>
              <div className="bg-[#E8F5E9] p-8 rounded-2xl text-center">
                <div className="bg-white p-6 rounded-xl shadow-lg inline-block mb-4">
                  <QrCode className="h-48 w-48 text-gray-300" />
                </div>
                <p className="text-gray-600 text-sm">
                  Scan kode QR di atas atau hubungi kami untuk mendapatkan kode QRIS
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Jemput Zakat Section */}
      <section id="jemput" className="py-16 bg-[#E8F5E9]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="order-2 md:order-1">
                <div className="bg-white p-8 rounded-2xl shadow-lg">
                  <div className="w-20 h-20 bg-gradient-to-br from-[#4CAF50] to-[#2E7D32] rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <Truck className="h-10 w-10 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-center text-gray-900 mb-4">
                    Jadwalkan Jemput Zakat
                  </h3>
                  <p className="text-gray-600 text-center mb-6">
                    Hubungi kami untuk menjadwalkan jemput zakat, infaq, dan sedekah
                    langsung ke rumah atau kantor Anda.
                  </p>
                  <button
                    onClick={handleWhatsAppClick}
                    className="w-full flex items-center justify-center space-x-2 bg-[#25D366] hover:bg-[#128C7E] text-white py-4 rounded-xl font-semibold transition-all duration-300"
                  >
                    <MessageCircle className="h-5 w-5" />
                    <span>Hubungi via WhatsApp</span>
                  </button>
                  <div className="mt-4 text-center">
                    <a href="tel:081223343416" className="flex items-center justify-center space-x-2 text-[#2E7D32] font-semibold">
                      <Phone className="h-5 w-5" />
                      <span>0812-2334-3416</span>
                    </a>
                  </div>
                </div>
              </div>
              <div className="order-1 md:order-2">
                <div className="inline-flex items-center space-x-2 bg-white text-[#2E7D32] px-4 py-2 rounded-full mb-6">
                  <Truck className="h-5 w-5" />
                  <span className="text-sm font-semibold">Layanan Jemput</span>
                </div>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                  Jemput <span className="text-[#2E7D32]">Zakat</span>
                </h2>
                <p className="text-gray-600 mb-6">
                  Kami menyediakan layanan jemput zakat, infaq, dan sedekah ke rumah
                  atau kantor Anda di wilayah Sidoarjo dan sekitarnya.
                </p>
                <div className="space-y-3">
                  <p className="flex items-center space-x-2 text-gray-700">
                    <Check className="h-5 w-5 text-[#4CAF50]" />
                    <span>Gratis, tanpa biaya tambahan</span>
                  </p>
                  <p className="flex items-center space-x-2 text-gray-700">
                    <Check className="h-5 w-5 text-[#4CAF50]" />
                    <span>Wilayah Sidoarjo dan sekitarnya</span>
                  </p>
                  <p className="flex items-center space-x-2 text-gray-700">
                    <Check className="h-5 w-5 text-[#4CAF50]" />
                    <span>Penjadwalan fleksibel</span>
                  </p>
                  <p className="flex items-center space-x-2 text-gray-700">
                    <Check className="h-5 w-5 text-[#4CAF50]" />
                    <span>Bukti penerimaan resmi</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Donation Steps */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Langkah <span className="text-[#2E7D32]">Berdonasi</span>
            </h2>
          </div>
          <div className="grid md:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {donationSteps.map((item, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-[#4CAF50] to-[#2E7D32] rounded-full flex items-center justify-center mx-auto mb-4 text-white text-2xl font-bold">
                  {item.step}
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-600 text-sm">{item.description}</p>
                {index < donationSteps.length - 1 && (
                  <ArrowRight className="h-6 w-6 text-gray-300 mx-auto mt-4 hidden md:block rotate-0 md:rotate-0" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Zakat Calculator CTA */}
      <section className="py-16 bg-gradient-to-br from-[#1B5E20] via-[#2E7D32] to-[#388E3C]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <Calculator className="h-16 w-16 text-[#FFB300] mx-auto mb-6" />
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Hitung Zakat Anda
            </h2>
            <p className="text-lg text-[#C8E6C9] mb-8">
              Belum tahu berapa zakat yang harus Anda keluarkan? Hubungi kami untuk
              konsultasi perhitungan zakat Anda.
            </p>
            <button
              onClick={handleWhatsAppClick}
              className="inline-flex items-center space-x-2 bg-gradient-to-r from-[#FFB300] to-[#FFC107] text-gray-900 px-8 py-4 rounded-full font-bold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              <MessageCircle className="h-5 w-5" />
              <span>Konsultasi Zakat</span>
            </button>
          </div>
        </div>
      </section>

      {/* Confirmation CTA */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Sudah Transfer? <span className="text-[#2E7D32]">Konfirmasi Donasi</span>
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              Kirimkan bukti transfer Anda via WhatsApp untuk konfirmasi penerimaan
              dan mendapatkan laporan penggunaan donasi.
            </p>
            <button
              onClick={handleWhatsAppClick}
              className="flex items-center justify-center space-x-2 bg-[#25D366] hover:bg-[#128C7E] text-white px-8 py-4 rounded-full font-semibold shadow-lg transition-all duration-300 mx-auto"
            >
              <MessageCircle className="h-5 w-5" />
              <span>Konfirmasi via WhatsApp</span>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
