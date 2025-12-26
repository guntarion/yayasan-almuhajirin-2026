// src/components/units/lazmu/Footer.tsx
'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Phone,
  MapPin,
  Heart,
  Instagram,
  ExternalLink,
  Ambulance,
  Building2
} from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { name: 'Tentang Kami', href: '/tentang-kami' },
    { name: 'Program', href: '/program' },
    { name: 'Cara Donasi', href: '/donasi' },
    { name: 'Laporan', href: '/laporan' },
    { name: 'FAQ', href: '/faq' },
    { name: 'Kontak', href: '/kontak' },
  ];

  const programs = [
    { name: 'Beasiswa Pendidikan', href: '/program#pendidikan' },
    { name: 'Ambulance Gratis', href: '/program#kesehatan' },
    { name: 'Poliklinik Gratis', href: '/program#kesehatan' },
    { name: 'Khitan Ceria', href: '/program#sosial' },
    { name: 'Perawatan Jenazah', href: '/program#jenazah' },
    { name: 'Tanggap Bencana', href: '/program#bencana' },
  ];

  return (
    <footer className="bg-gradient-to-br from-[#1B5E20] via-[#2E7D32] to-[#388E3C] text-white">
      {/* Main Footer */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Logo & Description */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center space-x-3 mb-6">
              <div className="relative w-14 h-14 rounded-full overflow-hidden border-2 border-[#81C784] shadow-lg">
                <Image
                  src="/images/Logo-LAZ-Muhajirin.jpg"
                  alt="LAZ Muhajirin"
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <span className="text-xl font-bold text-white block">LAZ Muhajirin</span>
                <span className="text-sm text-[#A5D6A7]">LAZMU Rewwin</span>
              </div>
            </Link>
            <p className="text-[#C8E6C9] mb-6 leading-relaxed">
              Lembaga Amil Zakat yang beroperasi di bawah naungan Yayasan Al Muhajirin Rewwin,
              Sidoarjo. Mitra resmi LAZNAS Dewan Da&apos;wah Islamiyah Indonesia Provinsi Jawa Timur.
            </p>
            <div className="flex space-x-3">
              <a
                href="https://instagram.com/lazmuhajirinrewwin"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-white/10 hover:bg-[#E91E63] rounded-full flex items-center justify-center transition-all duration-300"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href="https://linktr.ee/lazmuhajirinrewwin"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-white/10 hover:bg-[#43E55E] rounded-full flex items-center justify-center transition-all duration-300"
              >
                <ExternalLink className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-bold text-white mb-6 flex items-center">
              <div className="w-1 h-6 bg-[#FFB300] rounded-full mr-3"></div>
              Tautan Cepat
            </h3>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-[#C8E6C9] hover:text-white hover:pl-2 transition-all duration-200 flex items-center"
                  >
                    <span className="w-1.5 h-1.5 bg-[#81C784] rounded-full mr-2"></span>
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Programs */}
          <div>
            <h3 className="text-lg font-bold text-white mb-6 flex items-center">
              <div className="w-1 h-6 bg-[#FFB300] rounded-full mr-3"></div>
              Program Kami
            </h3>
            <ul className="space-y-3">
              {programs.map((program) => (
                <li key={program.name}>
                  <Link
                    href={program.href}
                    className="text-[#C8E6C9] hover:text-white hover:pl-2 transition-all duration-200 flex items-center"
                  >
                    <span className="w-1.5 h-1.5 bg-[#81C784] rounded-full mr-2"></span>
                    {program.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-bold text-white mb-6 flex items-center">
              <div className="w-1 h-6 bg-[#FFB300] rounded-full mr-3"></div>
              Kontak Kami
            </h3>
            <ul className="space-y-4">
              <li className="flex items-start space-x-3">
                <MapPin className="h-5 w-5 text-[#FFB300] flex-shrink-0 mt-0.5" />
                <span className="text-[#C8E6C9]">
                  Jl. Rajawali No. 207, Rewwin<br />
                  Kec. Waru, Sidoarjo 61256
                </span>
              </li>
              <li className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-[#FFB300] flex-shrink-0" />
                <div className="text-[#C8E6C9]">
                  <a href="tel:0318674030" className="hover:text-white block">031-8674030 (Careline)</a>
                  <a href="tel:081223343416" className="hover:text-white block">0812-2334-3416 (WA)</a>
                </div>
              </li>
              <li className="flex items-center space-x-3">
                <Ambulance className="h-5 w-5 text-[#FFB300] flex-shrink-0" />
                <a href="tel:08155444576" className="text-[#C8E6C9] hover:text-white">
                  081-55-4444-576 (24 Jam)
                </a>
              </li>
              <li className="flex items-center space-x-3">
                <Building2 className="h-5 w-5 text-[#FFB300] flex-shrink-0" />
                <a href="tel:081331026307" className="text-[#C8E6C9] hover:text-white">
                  0813-3102-6307 (Jenazah)
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bank Accounts */}
        <div className="mt-12 pt-8 border-t border-white/20">
          <h3 className="text-lg font-bold text-white mb-6 text-center">Rekening Donasi</h3>
          <div className="grid sm:grid-cols-3 gap-4 max-w-3xl mx-auto">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center">
              <p className="text-[#A5D6A7] text-sm mb-1">Zakat, Infaq, Sedekah</p>
              <p className="font-bold text-white">Bank Muamalat</p>
              <p className="text-lg font-mono text-[#FFB300]">707.000.7500</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center">
              <p className="text-[#A5D6A7] text-sm mb-1">Wakaf</p>
              <p className="font-bold text-white">Bank Muamalat</p>
              <p className="text-lg font-mono text-[#FFB300]">707.000.7498</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center">
              <p className="text-[#A5D6A7] text-sm mb-1">Zakat Maal</p>
              <p className="font-bold text-white">Bank Muamalat</p>
              <p className="text-lg font-mono text-[#FFB300]">707.000.7499</p>
            </div>
          </div>
          <p className="text-center text-[#A5D6A7] mt-4 text-sm">
            a.n. LAZ Muhajirin Rewwin
          </p>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="bg-[#1B5E20] py-6">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-[#A5D6A7] text-sm text-center md:text-left">
              &copy; {currentYear} LAZ Muhajirin Rewwin. All rights reserved.
            </p>
            <p className="text-[#A5D6A7] text-sm flex items-center">
              Dibuat dengan <Heart className="h-4 w-4 text-red-400 mx-1" /> oleh{' '}
              <a
                href="https://almuhajirin.or.id"
                target="_blank"
                rel="noopener noreferrer"
                className="ml-1 text-white hover:text-[#FFB300]"
              >
                Yayasan Al Muhajirin
              </a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
