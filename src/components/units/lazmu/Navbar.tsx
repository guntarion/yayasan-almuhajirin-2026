// src/components/units/lazmu/Navbar.tsx
'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Menu, X, ChevronDown, Heart, Phone, ExternalLink } from 'lucide-react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Beranda', href: '/' },
    {
      name: 'Tentang',
      href: '/tentang-kami',
      dropdown: [
        { name: 'Profil LAZ', href: '/tentang-kami' },
        { name: 'Visi & Misi', href: '/tentang-kami#visi-misi' },
        { name: 'Legalitas', href: '/tentang-kami#legalitas' },
        { name: 'Keunggulan', href: '/tentang-kami#keunggulan' },
      ],
    },
    {
      name: 'Program',
      href: '/program',
      dropdown: [
        { name: 'Semua Program', href: '/program' },
        { name: 'Pendidikan', href: '/program#pendidikan' },
        { name: 'Kesehatan', href: '/program#kesehatan' },
        { name: 'Sosial Kemanusiaan', href: '/program#sosial' },
        { name: 'Layanan Jenazah', href: '/program#jenazah' },
        { name: 'Tanggap Bencana', href: '/program#bencana' },
      ],
    },
    {
      name: 'Donasi',
      href: '/donasi',
      dropdown: [
        { name: 'Cara Berdonasi', href: '/donasi' },
        { name: 'Transfer Bank', href: '/donasi#bank' },
        { name: 'QRIS', href: '/donasi#qris' },
        { name: 'Jemput Zakat', href: '/donasi#jemput' },
      ],
    },
    {
      name: 'Informasi',
      href: '/laporan',
      dropdown: [
        { name: 'Laporan', href: '/laporan' },
        { name: 'FAQ', href: '/faq' },
        { name: 'Kontak', href: '/kontak' },
      ],
    },
  ];

  const handleDropdownToggle = (name: string) => {
    setOpenDropdown(openDropdown === name ? null : name);
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-white/95 backdrop-blur-md shadow-lg'
          : 'bg-transparent'
      }`}
    >
      {/* Top Bar */}
      <div className="hidden lg:block bg-gradient-to-r from-[#2E7D32] to-[#4CAF50] text-white text-sm py-2">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <span>Mitra LAZNAS Dewan Da&apos;wah Islamiyah Indonesia Jawa Timur</span>
          </div>
          <div className="flex items-center space-x-4">
            <a href="tel:0312233443416" className="flex items-center space-x-1 hover:text-[#C8E6C9]">
              <Phone className="h-4 w-4" />
              <span>0812-2334-3416</span>
            </a>
            <a
              href="https://almuhajirin.or.id"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-1 hover:text-[#C8E6C9]"
            >
              <ExternalLink className="h-4 w-4" />
              <span>Yayasan Al Muhajirin</span>
            </a>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 flex-shrink-0">
            <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-[#4CAF50] shadow-md">
              <Image
                src="/images/Logo-LAZ-Muhajirin.jpg"
                alt="LAZ Muhajirin"
                fill
                className="object-cover"
              />
            </div>
            <div className="flex flex-col">
              <span className={`text-lg font-bold ${isScrolled ? 'text-[#2E7D32]' : 'text-white'}`}>
                LAZ Muhajirin
              </span>
              <span className={`text-xs ${isScrolled ? 'text-gray-600' : 'text-white/80'}`}>
                Amanah & Profesional
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1">
            {navLinks.map((link) => (
              <div key={link.name} className="relative group">
                {link.dropdown ? (
                  <button
                    onMouseEnter={() => setOpenDropdown(link.name)}
                    onMouseLeave={() => setOpenDropdown(null)}
                    className={`flex items-center space-x-1 px-4 py-2 rounded-lg transition-all duration-200 ${
                      isScrolled
                        ? 'text-gray-700 hover:text-[#4CAF50] hover:bg-[#E8F5E9]'
                        : 'text-white/90 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    <span className="font-medium">{link.name}</span>
                    <ChevronDown className="h-4 w-4" />
                  </button>
                ) : (
                  <Link
                    href={link.href}
                    className={`px-4 py-2 rounded-lg transition-all duration-200 font-medium ${
                      isScrolled
                        ? 'text-gray-700 hover:text-[#4CAF50] hover:bg-[#E8F5E9]'
                        : 'text-white/90 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    {link.name}
                  </Link>
                )}

                {/* Dropdown Menu */}
                {link.dropdown && (
                  <div
                    onMouseEnter={() => setOpenDropdown(link.name)}
                    onMouseLeave={() => setOpenDropdown(null)}
                    className={`absolute left-0 mt-0 w-56 bg-white rounded-xl shadow-xl border border-gray-100 py-2 transition-all duration-200 ${
                      openDropdown === link.name
                        ? 'opacity-100 visible translate-y-0'
                        : 'opacity-0 invisible -translate-y-2'
                    }`}
                  >
                    {link.dropdown.map((item) => (
                      <Link
                        key={item.name}
                        href={item.href}
                        className="block px-4 py-2 text-gray-700 hover:bg-[#E8F5E9] hover:text-[#2E7D32] transition-colors"
                      >
                        {item.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {/* CTA Button */}
            <Link
              href="/donasi"
              className="ml-4 flex items-center space-x-2 bg-gradient-to-r from-[#FFB300] to-[#FFC107] hover:from-[#FFA000] hover:to-[#FFB300] text-gray-900 px-6 py-2.5 rounded-full font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              <Heart className="h-5 w-5" />
              <span>Donasi Sekarang</span>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className={`lg:hidden p-2 rounded-lg ${
              isScrolled ? 'text-gray-700' : 'text-white'
            }`}
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`lg:hidden transition-all duration-300 ${
          isOpen ? 'max-h-[80vh] opacity-100' : 'max-h-0 opacity-0'
        } overflow-hidden bg-white shadow-xl`}
      >
        <div className="container mx-auto px-4 py-4 space-y-2">
          {navLinks.map((link) => (
            <div key={link.name}>
              {link.dropdown ? (
                <div>
                  <button
                    onClick={() => handleDropdownToggle(link.name)}
                    className="flex items-center justify-between w-full px-4 py-3 text-gray-700 hover:bg-[#E8F5E9] rounded-lg"
                  >
                    <span className="font-medium">{link.name}</span>
                    <ChevronDown
                      className={`h-4 w-4 transition-transform ${
                        openDropdown === link.name ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                  {openDropdown === link.name && (
                    <div className="pl-4 mt-1 space-y-1">
                      {link.dropdown.map((item) => (
                        <Link
                          key={item.name}
                          href={item.href}
                          onClick={() => setIsOpen(false)}
                          className="block px-4 py-2 text-gray-600 hover:text-[#2E7D32] hover:bg-[#E8F5E9] rounded-lg"
                        >
                          {item.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="block px-4 py-3 text-gray-700 hover:bg-[#E8F5E9] rounded-lg font-medium"
                >
                  {link.name}
                </Link>
              )}
            </div>
          ))}
          <Link
            href="/donasi"
            onClick={() => setIsOpen(false)}
            className="flex items-center justify-center space-x-2 w-full bg-gradient-to-r from-[#FFB300] to-[#FFC107] text-gray-900 px-6 py-3 rounded-full font-semibold mt-4"
          >
            <Heart className="h-5 w-5" />
            <span>Donasi Sekarang</span>
          </Link>
        </div>
      </div>
    </nav>
  );
}
