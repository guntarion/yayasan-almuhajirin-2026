// src/app/units/lazmu/kontak/page.tsx
'use client';

import React from 'react';
import Link from 'next/link';
import {
  Phone,
  MapPin,
  Clock,
  MessageCircle,
  Instagram,
  ExternalLink,
  Heart,
  ArrowRight,
  Ambulance,
  Users,
  Building2,
} from 'lucide-react';

export default function KontakPage() {
  const handleWhatsAppClick = () => {
    window.open('https://wa.me/6281223343416?text=Assalamualaikum,%20saya%20ingin%20bertanya%20tentang%20LAZ%20Muhajirin', '_blank');
  };

  const contacts = [
    {
      icon: Phone,
      title: 'Careline',
      value: '031-8674030',
      link: 'tel:0318674030',
      color: 'bg-blue-500',
    },
    {
      icon: MessageCircle,
      title: 'WhatsApp Info/Donasi',
      value: '0812-2334-3416',
      link: 'https://wa.me/6281223343416',
      color: 'bg-green-500',
    },
    {
      icon: Ambulance,
      title: 'Ambulance Gratis',
      value: '081-55-4444-576',
      link: 'tel:081554444576',
      subtitle: '24 Jam',
      color: 'bg-red-500',
    },
    {
      icon: Users,
      title: 'Perawatan Jenazah',
      value: '0813-3102-6307',
      link: 'tel:081331026307',
      color: 'bg-gray-600',
    },
  ];

  const socialMedia = [
    {
      icon: Instagram,
      title: 'LAZ Muhajirin',
      handle: '@lazmuhajirinrewwin',
      link: 'https://instagram.com/lazmuhajirinrewwin',
      color: 'from-purple-500 to-pink-500',
    },
    {
      icon: Instagram,
      title: 'Yayasan Al Muhajirin',
      handle: '@almuhajirinrewwin',
      link: 'https://instagram.com/almuhajirinrewwin',
      color: 'from-purple-500 to-pink-500',
    },
    {
      icon: ExternalLink,
      title: 'Linktree',
      handle: 'lazmuhajirinrewwin',
      link: 'https://linktr.ee/lazmuhajirinrewwin',
      color: 'from-green-400 to-green-600',
    },
  ];

  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-br from-[#1B5E20] via-[#2E7D32] to-[#388E3C]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-sm text-white px-4 py-2 rounded-full mb-6">
              <Phone className="h-5 w-5" />
              <span className="text-sm font-medium">Kontak Kami</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Hubungi Kami
            </h1>
            <p className="text-lg text-[#C8E6C9]">
              Kami siap melayani pertanyaan, konsultasi zakat, dan informasi program
              LAZ Muhajirin.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Cards */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {contacts.map((contact, index) => (
              <a
                key={index}
                href={contact.link}
                target={contact.link.startsWith('http') ? '_blank' : undefined}
                rel={contact.link.startsWith('http') ? 'noopener noreferrer' : undefined}
                className="bg-white border-2 border-gray-100 p-6 rounded-2xl text-center hover:shadow-xl hover:border-[#4CAF50] transition-all duration-300 group"
              >
                <div className={`w-16 h-16 ${contact.color} rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <contact.icon className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-1">{contact.title}</h3>
                {contact.subtitle && (
                  <p className="text-sm text-gray-500 mb-1">{contact.subtitle}</p>
                )}
                <p className="text-xl font-semibold text-[#2E7D32]">{contact.value}</p>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Address & Map */}
      <section className="py-16 bg-[#E8F5E9]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-5xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12">
              {/* Address Info */}
              <div>
                <div className="inline-flex items-center space-x-2 bg-white text-[#2E7D32] px-4 py-2 rounded-full mb-6">
                  <MapPin className="h-5 w-5" />
                  <span className="text-sm font-semibold">Sekretariat</span>
                </div>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                  LAZ Muhajirin <span className="text-[#2E7D32]">Rewwin</span>
                </h2>

                <div className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center flex-shrink-0 shadow-md">
                      <MapPin className="h-6 w-6 text-[#2E7D32]" />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 mb-1">Alamat</h4>
                      <p className="text-gray-600">
                        Jl. Rajawali No. 207, Rewwin<br />
                        Kecamatan Waru, Sidoarjo<br />
                        Jawa Timur, Indonesia 61256
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center flex-shrink-0 shadow-md">
                      <Clock className="h-6 w-6 text-[#2E7D32]" />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 mb-1">Jam Operasional</h4>
                      <p className="text-gray-600">
                        Senin - Jumat: 08.00 - 16.00 WIB<br />
                        Sabtu: 08.00 - 12.00 WIB<br />
                        <span className="text-red-500 font-semibold">Ambulance: 24 Jam</span>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center flex-shrink-0 shadow-md">
                      <Building2 className="h-6 w-6 text-[#2E7D32]" />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 mb-1">Lokasi</h4>
                      <p className="text-gray-600">
                        Berada di kompleks Masjid Al Muhajirin Rewwin
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Map Placeholder */}
              <div className="bg-white p-4 rounded-2xl shadow-lg">
                <div className="bg-gray-200 rounded-xl h-80 flex items-center justify-center">
                  <div className="text-center text-gray-500">
                    <MapPin className="h-12 w-12 mx-auto mb-2" />
                    <p className="font-medium">Google Maps</p>
                    <p className="text-sm">Masjid Al Muhajirin Rewwin</p>
                    <a
                      href="https://maps.google.com/?q=Masjid+Al+Muhajirin+Rewwin+Sidoarjo"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center space-x-1 text-[#2E7D32] mt-2 hover:underline"
                    >
                      <span>Buka di Google Maps</span>
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Social Media */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center space-x-2 bg-[#E8F5E9] text-[#2E7D32] px-4 py-2 rounded-full mb-6">
              <Instagram className="h-5 w-5" />
              <span className="text-sm font-semibold">Media Sosial</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Ikuti Kami di <span className="text-[#2E7D32]">Sosial Media</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-3xl mx-auto">
            {socialMedia.map((social, index) => (
              <a
                key={index}
                href={social.link}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white border-2 border-gray-100 p-6 rounded-2xl text-center hover:shadow-xl transition-all duration-300 group"
              >
                <div className={`w-14 h-14 bg-gradient-to-r ${social.color} rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <social.icon className="h-7 w-7 text-white" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-1">{social.title}</h3>
                <p className="text-[#2E7D32] font-medium">{social.handle}</p>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Quick Contact CTA */}
      <section className="py-16 bg-gradient-to-br from-[#1B5E20] via-[#2E7D32] to-[#388E3C]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <MessageCircle className="h-16 w-16 text-[#FFB300] mx-auto mb-6" />
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Ada Pertanyaan?
            </h2>
            <p className="text-lg text-[#C8E6C9] mb-8 max-w-2xl mx-auto">
              Jangan ragu untuk menghubungi kami. Tim kami siap membantu menjawab
              pertanyaan seputar zakat, infaq, sedekah, wakaf, dan program kami.
            </p>
            <button
              onClick={handleWhatsAppClick}
              className="inline-flex items-center space-x-2 bg-[#25D366] hover:bg-[#128C7E] text-white px-8 py-4 rounded-full font-semibold shadow-lg transition-all duration-300 transform hover:scale-105"
            >
              <MessageCircle className="h-5 w-5" />
              <span>Chat via WhatsApp</span>
            </button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Siap Menyalurkan <span className="text-[#2E7D32]">ZISWAF?</span>
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              Tunaikan zakat, infaq, sedekah, dan wakaf Anda melalui LAZ Muhajirin.
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

      {/* Emergency Contact */}
      <section className="py-12 bg-gradient-to-r from-red-500 to-red-600 text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center animate-pulse">
                <Ambulance className="h-8 w-8" />
              </div>
              <div>
                <h3 className="text-xl font-bold">Ambulance Gratis 24 Jam</h3>
                <p className="text-red-100">Layanan darurat untuk masyarakat</p>
              </div>
            </div>
            <a
              href="tel:081554444576"
              className="flex items-center space-x-2 bg-white text-red-600 px-8 py-4 rounded-full font-bold shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <Phone className="h-5 w-5" />
              <span>081-55-4444-576</span>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
