// src/components/units/kbtk/Navbar.tsx
'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Menu, X, ChevronDown, Phone, Mail, Clock, MessageCircle } from 'lucide-react';

export function KBTKNavbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleWhatsAppClick = () => {
    window.open('https://wa.me/6281314661918?text=Assalamualaikum,%20saya%20ingin%20bertanya%20tentang%20KBTK%20Al%20Muhajirin%20Rewwin', '_blank');
  };

  const navLinks = [
    { name: 'Beranda', href: '/' },
    {
      name: 'Tentang',
      href: '/tentang-kami',
      dropdown: [
        { name: 'Profil Sekolah', href: '/tentang-kami' },
        { name: 'Tim Pengajar', href: '/tim-pengajar' },
        { name: 'Visi & Misi', href: '/tentang-kami#visi-misi' },
        { name: 'Fasilitas', href: '/tentang-kami#fasilitas' },
      ],
    },
    {
      name: 'Program',
      href: '/program-kurikulum',
      dropdown: [
        { name: 'Kurikulum', href: '/program-kurikulum' },
        { name: 'Program Unggulan', href: '/program-kurikulum#program-unggulan' },
        { name: 'Jadwal Kegiatan', href: '/program-kurikulum#jadwal' },
      ],
    },
    {
      name: 'Informasi',
      href: '/pendaftaran',
      dropdown: [
        { name: 'Pendaftaran', href: '/pendaftaran' },
        { name: 'Galeri', href: '/galeri' },
        { name: 'Kontak', href: '/kontak' },
      ],
    },
  ];

  return (
    <>
      {/* Top Bar */}
      <div className="bg-gradient-to-r from-[#006064] to-[#00838F] text-white py-2 text-sm hidden md:block">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2">
              <Phone className="h-4 w-4" />
              <span>0813-1466-1918</span>
            </div>
            <div className="flex items-center space-x-2">
              <Mail className="h-4 w-4" />
              <span>kbtk@almuhajirin.or.id</span>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Clock className="h-4 w-4" />
            <span>Senin - Jumat: 07.00 - 12.00 WIB</span>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <nav
        className={`sticky top-0 z-50 transition-all duration-300 ${
          isScrolled
            ? 'bg-white/95 backdrop-blur-md shadow-lg'
            : 'bg-white'
        }`}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-2">
              <div className="relative w-12 h-12 rounded-xl overflow-hidden shadow-md flex-shrink-0">
                <Image
                  src="/images/kbtk/Logo-KBTK-Al-Muhajirin.jpg"
                  alt="Logo KBTK Al Muhajirin"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-bold text-[#006064] leading-tight">KBTK Al Muhajirin</span>
                <span className="text-[10px] text-[#00838F] hidden sm:block">Berakhlak, Berilmu, Kreatif</span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-1">
              {navLinks.map((link) => (
                <div
                  key={link.name}
                  className="relative"
                  onMouseEnter={() => link.dropdown && setActiveDropdown(link.name)}
                  onMouseLeave={() => setActiveDropdown(null)}
                >
                  <Link
                    href={link.href}
                    className="flex items-center px-4 py-2 text-gray-700 hover:text-[#00BCD4] font-medium transition-colors rounded-lg hover:bg-[#00BCD4]/5"
                  >
                    {link.name}
                    {link.dropdown && <ChevronDown className="ml-1 h-4 w-4" />}
                  </Link>

                  {/* Dropdown Menu */}
                  {link.dropdown && activeDropdown === link.name && (
                    <div className="absolute top-full left-0 mt-1 w-56 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50">
                      {link.dropdown.map((item) => (
                        <Link
                          key={item.name}
                          href={item.href}
                          className="block px-4 py-2.5 text-gray-700 hover:text-[#00BCD4] hover:bg-[#00BCD4]/5 transition-colors"
                        >
                          {item.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* CTA Button */}
            <div className="hidden lg:flex items-center space-x-3">
              <button
                onClick={handleWhatsAppClick}
                className="flex items-center space-x-2 bg-gradient-to-r from-[#00BCD4] to-[#006064] hover:from-[#006064] hover:to-[#00BCD4] text-white px-5 py-2.5 rounded-full font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              >
                <MessageCircle className="h-4 w-4" />
                <span>Hubungi Kami</span>
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="lg:hidden p-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="lg:hidden bg-white border-t border-gray-100 shadow-xl">
            <div className="container mx-auto px-4 py-4 space-y-2">
              {navLinks.map((link) => (
                <div key={link.name}>
                  <Link
                    href={link.href}
                    onClick={() => !link.dropdown && setIsOpen(false)}
                    className="block px-4 py-3 text-gray-700 hover:text-[#00BCD4] hover:bg-[#00BCD4]/5 rounded-lg font-medium transition-colors"
                  >
                    {link.name}
                  </Link>
                  {link.dropdown && (
                    <div className="pl-6 space-y-1">
                      {link.dropdown.map((item) => (
                        <Link
                          key={item.name}
                          href={item.href}
                          onClick={() => setIsOpen(false)}
                          className="block px-4 py-2 text-gray-600 hover:text-[#00BCD4] hover:bg-[#00BCD4]/5 rounded-lg text-sm transition-colors"
                        >
                          {item.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              <div className="pt-4 px-4">
                <button
                  onClick={() => {
                    handleWhatsAppClick();
                    setIsOpen(false);
                  }}
                  className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-[#00BCD4] to-[#006064] text-white px-5 py-3 rounded-full font-semibold shadow-lg"
                >
                  <MessageCircle className="h-4 w-4" />
                  <span>Hubungi Kami</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </nav>
    </>
  );
}
