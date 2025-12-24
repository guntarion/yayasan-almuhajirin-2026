// src/app/units/masjid/kontak/page.tsx
'use client';

import React from 'react';
import Image from 'next/image';
import {
  MapPin,
  Phone,
  Clock,
  Mail,
  MessageCircle,
  Facebook,
  Instagram,
  Youtube,
  ExternalLink,
  Copy,
  Check,
} from 'lucide-react';

export default function KontakPage() {
  const [copied, setCopied] = React.useState(false);

  const handleWhatsAppClick = () => {
    window.open('https://wa.me/6282126380665?text=Assalamualaikum,%20saya%20ingin%20bertanya%20tentang%20Masjid%20Al%20Muhajirin%20Rewwin', '_blank');
  };

  const handleCopyRekening = () => {
    navigator.clipboard.writeText('7195656578');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const contactInfo = [
    {
      icon: MapPin,
      title: 'Alamat',
      content: 'Jl. Rajawali No. 207, Rewwin, Waru, Sidoarjo, Jawa Timur 61256',
      action: {
        label: 'Lihat di Google Maps',
        href: 'https://maps.app.goo.gl/WBXFy8CczJ5o4us27',
        external: true,
      },
      color: 'from-[#FF9800] to-[#E65100]',
    },
    {
      icon: Phone,
      title: 'WhatsApp',
      content: '0821-2638-0665',
      action: {
        label: 'Chat via WhatsApp',
        onClick: handleWhatsAppClick,
      },
      color: 'from-[#25D366] to-[#128C7E]',
    },
    {
      icon: Clock,
      title: 'Jam Operasional',
      content: 'Masjid: 24 Jam\nSekretariat: Senin - Jumat, 08.00 - 17.00 WIB',
      color: 'from-[#00BCD4] to-[#006064]',
    },
    {
      icon: Mail,
      title: 'Email',
      content: 'masjid@almuhajirin.or.id',
      action: {
        label: 'Kirim Email',
        href: 'mailto:masjid@almuhajirin.or.id',
      },
      color: 'from-[#4CAF50] to-[#2E7D32]',
    },
  ];

  const socialMedia = [
    {
      icon: Instagram,
      name: 'Instagram',
      handle: '@almuhajirinrewwin',
      href: 'https://instagram.com/almuhajirinrewwin',
      color: 'from-[#833AB4] via-[#FD1D1D] to-[#F77737]',
    },
    {
      icon: Facebook,
      name: 'Facebook',
      handle: 'Masjid Al Muhajirin',
      href: 'https://facebook.com/masjidalmuhajirin',
      color: 'from-[#1877F2] to-[#0D65D9]',
    },
    {
      icon: Youtube,
      name: 'YouTube',
      handle: 'Masjid Al Muhajirin',
      href: 'https://youtube.com/@masjidalmuhajirin',
      color: 'from-[#FF0000] to-[#CC0000]',
    },
  ];

  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-br from-[#006064] via-[#00838F] to-[#00BCD4]">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-32 h-32 border-2 border-white rounded-full"></div>
          <div className="absolute bottom-10 right-10 w-48 h-48 border-2 border-white rounded-full"></div>
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-sm text-white px-4 py-2 rounded-full mb-6">
              <MapPin className="h-5 w-5" />
              <span className="text-sm font-medium">Kontak Kami</span>
            </div>

            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Hubungi Kami
            </h1>

            <p className="text-lg text-white/90 leading-relaxed">
              Kami siap melayani pertanyaan dan informasi seputar kegiatan Masjid Al Muhajirin
            </p>
          </div>
        </div>
      </section>

      {/* Contact Info Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {contactInfo.map((info, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all duration-300"
              >
                <div className="flex items-start space-x-4">
                  <div className={`w-14 h-14 rounded-xl bg-gradient-to-r ${info.color} flex items-center justify-center flex-shrink-0`}>
                    <info.icon className="h-7 w-7 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-900 mb-2">{info.title}</h3>
                    <p className="text-gray-600 whitespace-pre-line">{info.content}</p>
                    {info.action && (
                      <div className="mt-3">
                        {info.action.onClick ? (
                          <button
                            onClick={info.action.onClick}
                            className="inline-flex items-center text-sm font-medium text-[#00BCD4] hover:text-[#006064] transition-colors"
                          >
                            {info.action.label}
                            <ExternalLink className="h-4 w-4 ml-1" />
                          </button>
                        ) : (
                          <a
                            href={info.action.href}
                            target={info.action.external ? '_blank' : undefined}
                            rel={info.action.external ? 'noopener noreferrer' : undefined}
                            className="inline-flex items-center text-sm font-medium text-[#00BCD4] hover:text-[#006064] transition-colors"
                          >
                            {info.action.label}
                            <ExternalLink className="h-4 w-4 ml-1" />
                          </a>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                Lokasi Masjid
              </h2>
              <p className="text-gray-600">
                Masjid Al Muhajirin berlokasi di Perumahan Rewwin, Waru, Sidoarjo
              </p>
            </div>

            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="aspect-[16/9] relative">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3956.7089397394377!2d112.7383!3d-7.3548!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zN8KwMjEnMTcuMyJTIDExMsKwNDQnMTguMCJF!5e0!3m2!1sen!2sid!4v1234567890"
                  width="100%"
                  height="100%"
                  style={{ border: 0, position: 'absolute', inset: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
              </div>
              <div className="p-4 bg-gradient-to-r from-[#00BCD4]/10 to-[#006064]/10">
                <a
                  href="https://maps.app.goo.gl/WBXFy8CczJ5o4us27"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-[#006064] font-medium hover:text-[#00BCD4] transition-colors"
                >
                  <MapPin className="h-5 w-5 mr-2" />
                  Buka di Google Maps
                  <ExternalLink className="h-4 w-4 ml-1" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Social Media Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                Ikuti Media Sosial Kami
              </h2>
              <p className="text-gray-600">
                Dapatkan informasi terbaru seputar kegiatan masjid
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {socialMedia.map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all duration-300 group"
                >
                  <div className="flex items-center space-x-4">
                    <div className={`w-14 h-14 rounded-xl bg-gradient-to-r ${social.color} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                      <social.icon className="h-7 w-7 text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900">{social.name}</h3>
                      <p className="text-sm text-gray-600">{social.handle}</p>
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Donation Info Section */}
      <section className="py-16 bg-gradient-to-br from-[#006064] to-[#00838F]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div className="text-white">
                <h2 className="text-2xl md:text-3xl font-bold mb-4">
                  Infaq & Donasi
                </h2>
                <p className="text-[#B2EBF2] mb-6">
                  Dukung program-program masjid melalui infaq dan donasi Anda.
                  Setiap kontribusi akan digunakan untuk kemakmuran masjid.
                </p>
                <button
                  onClick={handleWhatsAppClick}
                  className="inline-flex items-center space-x-2 bg-[#25D366] hover:bg-[#128C7E] text-white px-6 py-3 rounded-full font-semibold transition-colors"
                >
                  <MessageCircle className="h-5 w-5" />
                  <span>Konfirmasi Donasi</span>
                </button>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
                <p className="text-white/80 text-sm mb-2">Transfer ke:</p>
                <div className="bg-white rounded-xl p-4 mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <Image
                      src="/images/Logo-Yayasan-AlMuhajirin.png"
                      alt="BSI"
                      width={60}
                      height={30}
                      className="object-contain"
                    />
                    <span className="text-sm text-gray-500">Bank BSI</span>
                  </div>
                  <p className="text-2xl font-bold text-[#006064]">719.5656.578</p>
                  <p className="text-sm text-gray-600">a/n. Infaq Masjid Al-Muhajirin Rewwin</p>
                </div>
                <button
                  onClick={handleCopyRekening}
                  className="w-full bg-white/10 hover:bg-white/20 text-white py-3 rounded-xl font-medium transition-colors flex items-center justify-center space-x-2"
                >
                  {copied ? <Check className="h-5 w-5" /> : <Copy className="h-5 w-5" />}
                  <span>{copied ? 'Tersalin!' : 'Salin No. Rekening'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-[#B2EBF2] via-[#80DEEA] to-[#B2EBF2]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-[#006064] mb-4">
              Ada Pertanyaan?
            </h2>
            <p className="text-[#00838F] mb-6">
              Jangan ragu untuk menghubungi kami. Tim kami siap membantu Anda.
            </p>
            <button
              onClick={handleWhatsAppClick}
              className="inline-flex items-center space-x-2 bg-gradient-to-r from-[#00BCD4] to-[#006064] text-white px-8 py-4 rounded-full font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              <MessageCircle className="h-5 w-5" />
              <span>Chat via WhatsApp</span>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
