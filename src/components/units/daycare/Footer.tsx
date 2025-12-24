// src/components/units/daycare/Footer.tsx
'use client';

import React from 'react';
import Link from 'next/link';
import { Facebook, Instagram, Youtube, MessageCircle, Phone, MapPin, Clock, Mail, Heart } from 'lucide-react';

export function DaycareFooter() {
  const currentYear = new Date().getFullYear();

  const handleWhatsAppClick = () => {
    window.open('https://wa.me/6281314661918?text=Assalamualaikum,%20saya%20ingin%20bertanya%20tentang%20Daycare%20Al%20Muhajirin%20Rewwin', '_blank');
  };

  const quickLinks = [
    { name: 'Beranda', href: '/' },
    { name: 'Tentang Kami', href: '/tentang-kami' },
    { name: 'Program & Layanan', href: '/program-layanan' },
    { name: 'Fasilitas', href: '/fasilitas' },
  ];

  const layananLinks = [
    { name: 'Tim Pengasuh', href: '/tim-pengasuh' },
    { name: 'Biaya & Pendaftaran', href: '/biaya-pendaftaran' },
    { name: 'Galeri', href: '/galeri' },
    { name: 'Kontak & Lokasi', href: '/kontak' },
  ];

  return (
    <footer className="bg-gradient-to-br from-green-800 to-blue-900 text-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Column */}
          <div className="col-span-1 md:col-span-1">
            <Link href="/" className="inline-flex items-center space-x-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-blue-500 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-lg">AM</span>
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold text-white">Daycare Al Muhajirin</span>
                <span className="text-sm text-green-200">Rewwin</span>
              </div>
            </Link>
            <p className="text-green-100 mb-6 text-sm leading-relaxed">
              Daycare terpercaya dengan pendidikan karakter Islami, fasilitas premium,
              dan tim pengasuh berpengalaman untuk tumbuh kembang optimal buah hati Anda.
            </p>
            <div className="flex space-x-4">
              <a
                href="https://facebook.com/daycarealmuhajirin"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-colors"
              >
                <Facebook size={18} />
              </a>
              <a
                href="https://instagram.com/daycare_almuhajirin_rewwin"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-colors"
              >
                <Instagram size={18} />
              </a>
              <a
                href="https://youtube.com/@daycarealmuhajirin"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-colors"
              >
                <Youtube size={18} />
              </a>
              <button
                onClick={handleWhatsAppClick}
                className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white hover:bg-green-600 transition-colors"
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
                  <Link href={link.href} className="text-green-200 hover:text-white text-sm transition-colors flex items-center space-x-2">
                    <span className="w-1 h-1 bg-green-400 rounded-full"></span>
                    <span>{link.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services Links */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Layanan</h3>
            <ul className="space-y-3">
              {layananLinks.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-green-200 hover:text-white text-sm transition-colors flex items-center space-x-2">
                    <span className="w-1 h-1 bg-blue-400 rounded-full"></span>
                    <span>{link.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Kontak Kami</h3>
            <ul className="space-y-3">
              <li className="flex items-start space-x-3 text-sm">
                <Phone className="h-4 w-4 text-green-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-green-200">WhatsApp:</p>
                  <button
                    onClick={handleWhatsAppClick}
                    className="text-white hover:text-green-300 transition-colors"
                  >
                    0813-1466-191
                  </button>
                </div>
              </li>
              <li className="flex items-start space-x-3 text-sm">
                <Mail className="h-4 w-4 text-blue-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-green-200">Email:</p>
                  <a
                    href="mailto:info@daycare-almuhajirin.com"
                    className="text-white hover:text-blue-300 transition-colors"
                  >
                    info@daycare-almuhajirin.com
                  </a>
                </div>
              </li>
              <li className="flex items-start space-x-3 text-sm">
                <MapPin className="h-4 w-4 text-purple-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-green-200">Alamat:</p>
                  <p className="text-white">
                    Jl. Rajawali No. 207 RT 11 RW 06<br />
                    Rewwin, Waru, Sidoarjo<br />
                    Jawa Timur 61256
                  </p>
                </div>
              </li>
              <li className="flex items-start space-x-3 text-sm">
                <Clock className="h-4 w-4 text-yellow-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-green-200">Jam Operasional:</p>
                  <p className="text-white">
                    Senin - Jumat<br />
                    07:00 - 17:00 WIB
                  </p>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Call to Action */}
        <div className="border-t border-white/20 mt-8 pt-8">
          <div className="bg-white/10 rounded-2xl p-6 text-center">
            <h3 className="text-xl font-bold text-white mb-2">
              Hubungi Kami Sekarang untuk Jadwalkan Kunjungan
            </h3>
            <p className="text-green-100 mb-4">
              Berikan yang terbaik untuk buah hati Anda. Tim kami siap membantu Anda menemukan program yang tepat.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={handleWhatsAppClick}
                className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-full font-semibold transition-colors flex items-center justify-center space-x-2"
              >
                <MessageCircle className="h-4 w-4" />
                <span>WhatsApp Kami Sekarang</span>
              </button>
              <Link
                href="/biaya-pendaftaran"
                className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-full font-semibold transition-colors inline-flex items-center justify-center"
              >
                Lihat Biaya & Pendaftaran
              </Link>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-white/20 mt-8 pt-8 flex flex-col md:flex-row md:justify-between items-center">
          <p className="text-green-200 text-sm">
            &copy; {currentYear} Daycare Al Muhajirin Rewwin. All rights reserved.
          </p>
          <p className="text-green-200 text-sm mt-2 md:mt-0 flex items-center space-x-1">
            <span>Made with</span>
            <Heart className="h-4 w-4 text-red-400 fill-current" />
            <span>for your precious ones</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
