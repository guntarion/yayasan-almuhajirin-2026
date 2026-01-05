// src/components/units/kbtk/Footer.tsx
'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Facebook, Instagram, Youtube, MessageCircle, Phone, MapPin, Clock, Mail, Heart, GraduationCap } from 'lucide-react';

export function KBTKFooter() {
  const currentYear = new Date().getFullYear();

  const handleWhatsAppClick = () => {
    window.open('https://wa.me/6281314661918?text=Assalamualaikum,%20saya%20ingin%20bertanya%20tentang%20KBTK%20Al%20Muhajirin%20Rewwin', '_blank');
  };

  const quickLinks = [
    { name: 'Beranda', href: '/' },
    { name: 'Tentang Kami', href: '/tentang-kami' },
    { name: 'Program & Kurikulum', href: '/program-kurikulum' },
    { name: 'Tim Pengajar', href: '/tim-pengajar' },
  ];

  const layananLinks = [
    { name: 'Pendaftaran', href: '/pendaftaran' },
    { name: 'Galeri', href: '/galeri' },
    { name: 'Kontak', href: '/kontak' },
  ];

  const programLinks = [
    { name: 'Day Care', href: '/program-kurikulum#daycare' },
    { name: 'Kelompok Bermain', href: '/program-kurikulum#kb' },
    { name: 'TK A & TK B', href: '/program-kurikulum#tk' },
  ];

  return (
    <footer className="bg-gradient-to-br from-[#006064] to-[#00363a] text-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Column */}
          <div className="col-span-1">
            <Link href="/" className="inline-flex items-center space-x-3 mb-6">
              <div className="relative w-14 h-14 rounded-xl overflow-hidden shadow-md bg-white">
                <Image
                  src="/images/kbtk/Logo-KBTK-Al-Muhajirin.jpg"
                  alt="Logo KBTK Al Muhajirin"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold text-white">KBTK Al Muhajirin</span>
                <span className="text-sm text-[#80DEEA]">Rewwin</span>
              </div>
            </Link>
            <p className="text-[#B2EBF2] mb-6 text-sm leading-relaxed">
              Lembaga pendidikan anak usia dini dengan metode BCCT dan pendekatan Islami Montessori.
              Membimbing anak beraqidah mantap, berakhlak karimah, dan berprestasi optimal.
            </p>
            <div className="flex space-x-4">
              <a
                href="https://facebook.com/kbtkalmuhajirin"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-colors"
              >
                <Facebook size={18} />
              </a>
              <a
                href="https://instagram.com/kbtk_almuhajirin_rewwin"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-colors"
              >
                <Instagram size={18} />
              </a>
              <a
                href="https://youtube.com/@kbtkalmuhajirin"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-colors"
              >
                <Youtube size={18} />
              </a>
              <button
                onClick={handleWhatsAppClick}
                className="w-10 h-10 bg-[#25D366] rounded-full flex items-center justify-center text-white hover:bg-[#128C7E] transition-colors"
              >
                <MessageCircle size={18} />
              </button>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Menu Utama</h3>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-[#B2EBF2] hover:text-white text-sm transition-colors flex items-center space-x-2">
                    <span className="w-1 h-1 bg-[#00BCD4] rounded-full"></span>
                    <span>{link.name}</span>
                  </Link>
                </li>
              ))}
            </ul>

            <h3 className="text-lg font-semibold text-white mb-4 mt-6">Informasi</h3>
            <ul className="space-y-3">
              {layananLinks.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-[#B2EBF2] hover:text-white text-sm transition-colors flex items-center space-x-2">
                    <span className="w-1 h-1 bg-[#4CAF50] rounded-full"></span>
                    <span>{link.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Programs */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Program Kami</h3>
            <ul className="space-y-3">
              {programLinks.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-[#B2EBF2] hover:text-white text-sm transition-colors flex items-center space-x-2">
                    <GraduationCap className="h-4 w-4 text-[#FFB300]" />
                    <span>{link.name}</span>
                  </Link>
                </li>
              ))}
            </ul>

            <div className="mt-6 p-4 bg-white/10 rounded-xl">
              <p className="text-sm font-semibold text-[#FFB300] mb-2">Motto Kami</p>
              <p className="text-white text-sm italic">&quot;Berakhlak, Berilmu, dan Kreatif&quot;</p>
            </div>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Kontak Kami</h3>
            <ul className="space-y-3">
              <li className="flex items-start space-x-3 text-sm">
                <Phone className="h-4 w-4 text-[#00BCD4] mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-[#B2EBF2]">WhatsApp:</p>
                  <button
                    onClick={handleWhatsAppClick}
                    className="text-white hover:text-[#80DEEA] transition-colors"
                  >
                    0813-1466-1918
                  </button>
                </div>
              </li>
              <li className="flex items-start space-x-3 text-sm">
                <Mail className="h-4 w-4 text-[#4CAF50] mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-[#B2EBF2]">Email:</p>
                  <a
                    href="mailto:kbtk@muhajirinrewwin.or.id"
                    className="text-white hover:text-[#80DEEA] transition-colors"
                  >
                    kbtk@muhajirinrewwin.or.id
                  </a>
                </div>
              </li>
              <li className="flex items-start space-x-3 text-sm">
                <MapPin className="h-4 w-4 text-[#FFB300] mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-[#B2EBF2]">Alamat:</p>
                  <p className="text-white">
                    Jl. Rajawali No. 207<br />
                    Kepuhkiriman, Waru, Sidoarjo<br />
                    Jawa Timur 61256
                  </p>
                </div>
              </li>
              <li className="flex items-start space-x-3 text-sm">
                <Clock className="h-4 w-4 text-[#9C27B0] mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-[#B2EBF2]">Jam Operasional:</p>
                  <p className="text-white">
                    Senin - Jumat<br />
                    07.00 - 12.00 WIB
                  </p>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Call to Action */}
        <div className="border-t border-white/20 mt-8 pt-8">
          <div className="bg-gradient-to-r from-[#00BCD4]/20 to-[#4CAF50]/20 rounded-2xl p-6 text-center">
            <h3 className="text-xl font-bold text-white mb-2">
              Daftarkan Putra-Putri Anda Sekarang!
            </h3>
            <p className="text-[#B2EBF2] mb-4">
              Dapatkan asesmen perkembangan anak GRATIS. Tim kami siap membantu Anda memilih program yang tepat.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={handleWhatsAppClick}
                className="bg-[#25D366] hover:bg-[#128C7E] text-white px-6 py-3 rounded-full font-semibold transition-colors flex items-center justify-center space-x-2"
              >
                <MessageCircle className="h-4 w-4" />
                <span>WhatsApp Sekarang</span>
              </button>
              <Link
                href="/pendaftaran"
                className="bg-gradient-to-r from-[#00BCD4] to-[#006064] hover:from-[#006064] hover:to-[#00BCD4] text-white px-6 py-3 rounded-full font-semibold transition-all inline-flex items-center justify-center"
              >
                Lihat Info Pendaftaran
              </Link>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-white/20 mt-8 pt-8 flex flex-col md:flex-row md:justify-between items-center">
          <p className="text-[#B2EBF2] text-sm">
            &copy; {currentYear} KBTK Al Muhajirin Rewwin. All rights reserved.
          </p>
          <p className="text-[#B2EBF2] text-sm mt-2 md:mt-0 flex items-center space-x-1">
            <span>Made with</span>
            <Heart className="h-4 w-4 text-red-400 fill-current" />
            <span>by Yayasan Al Muhajirin</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
