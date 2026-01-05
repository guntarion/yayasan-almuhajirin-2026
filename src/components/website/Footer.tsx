// src/components/website/Footer.tsx
'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Facebook, Instagram, Youtube, MessageCircle, Phone, MapPin, Mail, Heart, ExternalLink } from 'lucide-react';

export function Footer() {
  const currentYear = new Date().getFullYear();

  const handleWhatsAppClick = () => {
    window.open('https://wa.me/6282126380665?text=Assalamualaikum,%20saya%20ingin%20bertanya%20tentang%20Yayasan%20Al%20Muhajirin%20Rewwin', '_blank');
  };

  const unitLinks = [
    { name: 'Masjid Al Muhajirin', href: 'https://masjid.muhajirinrewwin.or.id', external: true },
    { name: 'Daycare', href: 'https://daycare.muhajirinrewwin.or.id', external: true },
    { name: 'KBTK', href: 'https://kbtk.muhajirinrewwin.or.id', external: true },
    { name: 'LAZMU', href: 'https://lazmu.muhajirinrewwin.or.id', external: true },
  ];

  const quickLinks = [
    { name: 'Beranda', href: '/' },
    { name: 'Unit Kami', href: '/#units' },
    { name: 'Tentang', href: '/#about' },
    { name: 'Kontak', href: '/#contact' },
  ];

  return (
    <footer className="bg-gradient-to-br from-[#006064] to-[#00363a] text-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Column */}
          <div className="col-span-1">
            <Link href="/" className="inline-flex items-center space-x-3 mb-6">
              <div className="relative w-14 h-14 rounded-xl overflow-hidden shadow-md bg-white p-1">
                <Image
                  src="/images/Logo-YAMR.png"
                  alt="Logo Yayasan Al Muhajirin"
                  fill
                  className="object-contain"
                />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold text-white">Yayasan Al Muhajirin</span>
                <span className="text-sm text-[#80DEEA]">Rewwin, Waru</span>
              </div>
            </Link>
            <p className="text-[#B2EBF2] mb-6 text-sm leading-relaxed">
              Lembaga sosial keagamaan yang menaungi berbagai unit bidang keagamaan, pendidikan, dan kemanusiaan untuk kesejahteraan umat.
            </p>
            <div className="flex space-x-4">
              <a
                href="https://facebook.com/almuhajirin.rewwin"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-colors"
              >
                <Facebook size={18} />
              </a>
              <a
                href="https://instagram.com/almuhajirinrewwin"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-colors"
              >
                <Instagram size={18} />
              </a>
              <a
                href="https://youtube.com/@almuhajirin"
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
            <h3 className="text-lg font-semibold text-white mb-4">Menu</h3>
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
          </div>

          {/* Unit Links */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Unit Kami</h3>
            <ul className="space-y-3">
              {unitLinks.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#B2EBF2] hover:text-white text-sm transition-colors flex items-center space-x-2"
                  >
                    <span className="w-1 h-1 bg-[#4CAF50] rounded-full"></span>
                    <span>{link.name}</span>
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Kontak</h3>
            <ul className="space-y-3">
              <li className="flex items-start space-x-3 text-sm">
                <Phone className="h-4 w-4 text-[#00BCD4] mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-[#B2EBF2]">WhatsApp:</p>
                  <button
                    onClick={handleWhatsAppClick}
                    className="text-white hover:text-[#80DEEA] transition-colors"
                  >
                    0821-2638-0665
                  </button>
                </div>
              </li>
              <li className="flex items-start space-x-3 text-sm">
                <Mail className="h-4 w-4 text-[#FFB300] mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-[#B2EBF2]">Email:</p>
                  <a
                    href="mailto:info@muhajirinrewwin.or.id"
                    className="text-white hover:text-[#80DEEA] transition-colors"
                  >
                    info@muhajirinrewwin.or.id
                  </a>
                </div>
              </li>
              <li className="flex items-start space-x-3 text-sm">
                <MapPin className="h-4 w-4 text-[#4CAF50] mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-[#B2EBF2]">Alamat:</p>
                  <a
                    href="https://maps.app.goo.gl/WBXFy8CczJ5o4us27"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white hover:text-[#80DEEA] transition-colors"
                  >
                    Jl. Rajawali No. 207<br />
                    RT 11, RW 06 Rewwin, Waru<br />
                    Sidoarjo, Jawa Timur 61256
                  </a>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Call to Action */}
        <div className="border-t border-white/20 mt-8 pt-8">
          <div className="bg-gradient-to-r from-[#00BCD4]/20 to-[#4CAF50]/20 rounded-2xl p-6 text-center">
            <h3 className="text-xl font-bold text-white mb-2">
              Mari Bersama Membangun Umat
            </h3>
            <p className="text-[#B2EBF2] mb-4">
              Bergabunglah dengan kami dalam berbagai program dan kegiatan untuk kesejahteraan umat.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={handleWhatsAppClick}
                className="bg-[#25D366] hover:bg-[#128C7E] text-white px-6 py-3 rounded-full font-semibold transition-colors flex items-center justify-center space-x-2"
              >
                <MessageCircle className="h-4 w-4" />
                <span>Hubungi via WhatsApp</span>
              </button>
              <Link
                href="/#units"
                className="bg-gradient-to-r from-[#00BCD4] to-[#006064] hover:from-[#006064] hover:to-[#00BCD4] text-white px-6 py-3 rounded-full font-semibold transition-all inline-flex items-center justify-center"
              >
                Lihat Unit Kami
              </Link>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-white/20 mt-8 pt-8 flex flex-col md:flex-row md:justify-between items-center">
          <p className="text-[#B2EBF2] text-sm">
            &copy; {currentYear} Yayasan Al Muhajirin Rewwin. All rights reserved.
          </p>
          <p className="text-[#B2EBF2] text-sm mt-2 md:mt-0 flex items-center space-x-1">
            <span>Made with</span>
            <Heart className="h-4 w-4 text-red-400 fill-current" />
            <span>untuk Umat</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
