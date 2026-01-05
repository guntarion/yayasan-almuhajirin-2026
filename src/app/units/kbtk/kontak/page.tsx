// src/app/units/kbtk/kontak/page.tsx
'use client';

import React from 'react';
import Link from 'next/link';
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  MessageCircle,
  Facebook,
  Instagram,
  Youtube,
  Navigation,
  ArrowRight
} from 'lucide-react';

export default function KontakPage() {
  const handleWhatsAppClick = () => {
    window.open('https://wa.me/6281314661918?text=Assalamualaikum,%20saya%20ingin%20bertanya%20tentang%20KBTK%20Al%20Muhajirin', '_blank');
  };

  const handleMapsClick = () => {
    window.open('https://maps.google.com/?q=KBTK+Al+Muhajirin+Rewwin+Waru+Sidoarjo', '_blank');
  };

  const contactInfo = [
    {
      icon: Phone,
      title: 'Telepon / WhatsApp',
      value: '0813-1466-1918',
      action: handleWhatsAppClick,
      actionText: 'Chat via WhatsApp',
      color: 'from-[#25D366] to-[#128C7E]',
    },
    {
      icon: Mail,
      title: 'Email',
      value: 'kbtk@muhajirinrewwin.or.id',
      action: () => window.location.href = 'mailto:kbtk@muhajirinrewwin.or.id',
      actionText: 'Kirim Email',
      color: 'from-[#00BCD4] to-[#006064]',
    },
    {
      icon: MapPin,
      title: 'Alamat',
      value: 'Jl. Rajawali No. 207 Kepuhkiriman, Waru, Sidoarjo, Jawa Timur 61256',
      action: handleMapsClick,
      actionText: 'Lihat di Maps',
      color: 'from-[#FF5722] to-[#E64A19]',
    },
    {
      icon: Clock,
      title: 'Jam Operasional',
      value: 'Senin - Jumat: 07.00 - 12.00 WIB',
      action: null,
      actionText: '',
      color: 'from-[#9C27B0] to-[#7B1FA2]',
    },
  ];

  const socialMedia = [
    { name: 'Facebook', icon: Facebook, url: 'https://facebook.com/kbtkalmuhajirin', color: '#1877F2' },
    { name: 'Instagram', icon: Instagram, url: 'https://instagram.com/kbtk_almuhajirin_rewwin', color: '#E4405F' },
    { name: 'YouTube', icon: Youtube, url: 'https://youtube.com/@kbtkalmuhajirin', color: '#FF0000' },
    { name: 'WhatsApp', icon: MessageCircle, url: '#', onClick: handleWhatsAppClick, color: '#25D366' },
  ];

  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-br from-[#006064] to-[#00838F]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-sm text-white px-4 py-2 rounded-full mb-6">
              <MapPin className="h-5 w-5" />
              <span className="text-sm font-medium">Kontak & Lokasi</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Hubungi Kami
            </h1>
            <p className="text-lg text-[#B2EBF2]">
              Kami siap membantu menjawab pertanyaan Anda tentang KBTK Al Muhajirin Rewwin
            </p>
          </div>
        </div>
      </section>

      {/* Contact Cards */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {contactInfo.map((item, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow"
              >
                <div className={`w-14 h-14 bg-gradient-to-r ${item.color} rounded-xl flex items-center justify-center mb-4`}>
                  <item.icon className="h-7 w-7 text-white" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-600 mb-4">{item.value}</p>
                {item.action && (
                  <button
                    onClick={item.action}
                    className="text-[#00BCD4] hover:text-[#006064] font-semibold text-sm flex items-center space-x-1 transition-colors"
                  >
                    <span>{item.actionText}</span>
                    <ArrowRight className="h-4 w-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Lokasi Sekolah
              </h2>
              <p className="text-gray-600 mb-6 leading-relaxed">
                KBTK Al Muhajirin berlokasi di kawasan Rewwin, Waru, Sidoarjo. Lokasi yang strategis
                dan mudah dijangkau dari berbagai arah, dekat dengan perumahan Rewwin dan kawasan
                komersial.
              </p>

              <div className="space-y-4 mb-8">
                <div className="flex items-start space-x-4">
                  <MapPin className="h-6 w-6 text-[#00BCD4] flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-semibold text-gray-900">Alamat Lengkap</h4>
                    <p className="text-gray-600">
                      Jl. Rajawali No. 207 Kepuhkiriman<br />
                      Waru, Sidoarjo<br />
                      Jawa Timur 61256
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <Navigation className="h-6 w-6 text-[#4CAF50] flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-semibold text-gray-900">Petunjuk Arah</h4>
                    <p className="text-gray-600">
                      Dari Bundaran Waru, ambil arah ke Rewwin. KBTK Al Muhajirin berada di kompleks
                      Yayasan Al Muhajirin, dekat Masjid Al Muhajirin.
                    </p>
                  </div>
                </div>
              </div>

              <button
                onClick={handleMapsClick}
                className="flex items-center space-x-2 bg-gradient-to-r from-[#00BCD4] to-[#006064] hover:from-[#006064] hover:to-[#00BCD4] text-white px-6 py-3 rounded-full font-semibold shadow-lg transition-all"
              >
                <Navigation className="h-5 w-5" />
                <span>Buka di Google Maps</span>
              </button>
            </div>

            {/* Map Embed */}
            <div className="relative h-96 lg:h-[500px] rounded-2xl overflow-hidden shadow-2xl">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3957.1234567890123!2d112.7567890!3d-7.3456789!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zN8KwMjAnNDQuNCJTIDExMsKwNDUnMjQuNCJF!5e0!3m2!1sen!2sid!4v1234567890123!5m2!1sen!2sid"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="absolute inset-0"
              ></iframe>
            </div>
          </div>
        </div>
      </section>

      {/* Social Media */}
      <section className="py-20 bg-gradient-to-br from-[#006064] to-[#00838F]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Ikuti Media Sosial Kami
            </h2>
            <p className="text-[#B2EBF2]">
              Dapatkan update terbaru kegiatan dan informasi KBTK Al Muhajirin
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-6">
            {socialMedia.map((social, index) => (
              <a
                key={index}
                href={social.url}
                onClick={social.onClick ? (e) => { e.preventDefault(); social.onClick(); } : undefined}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-3 bg-white/10 hover:bg-white/20 backdrop-blur-sm px-6 py-4 rounded-2xl transition-colors group"
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center"
                  style={{ backgroundColor: social.color }}
                >
                  <social.icon className="h-6 w-6 text-white" />
                </div>
                <span className="text-white font-semibold group-hover:text-[#80DEEA] transition-colors">
                  {social.name}
                </span>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Quick Contact CTA */}
      <section className="py-20 bg-gradient-to-r from-[#B2EBF2] via-[#80DEEA] to-[#B2EBF2]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-[#006064] mb-6">
              Punya Pertanyaan?
            </h2>
            <p className="text-lg text-[#00838F] mb-8">
              Tim kami siap membantu menjawab semua pertanyaan Anda. Hubungi kami sekarang!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={handleWhatsAppClick}
                className="flex items-center justify-center space-x-2 bg-[#25D366] hover:bg-[#128C7E] text-white px-8 py-4 rounded-full font-semibold shadow-lg hover:shadow-xl transition-all"
              >
                <MessageCircle className="h-5 w-5" />
                <span>Chat via WhatsApp</span>
              </button>
              <a
                href="tel:+6281314661918"
                className="flex items-center justify-center space-x-2 bg-[#006064] hover:bg-[#004D40] text-white px-8 py-4 rounded-full font-semibold shadow-lg hover:shadow-xl transition-all"
              >
                <Phone className="h-5 w-5" />
                <span>Telepon Langsung</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Info Banner */}
      <section className="py-8 bg-white border-t">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
            <div>
              <p className="text-gray-600">
                <strong className="text-[#006064]">KBTK Al Muhajirin Rewwin</strong> - Bagian dari Yayasan Al Muhajirin
              </p>
            </div>
            <Link
              href="/pendaftaran"
              className="flex items-center space-x-2 text-[#00BCD4] hover:text-[#006064] font-semibold transition-colors"
            >
              <span>Daftar Sekarang</span>
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
