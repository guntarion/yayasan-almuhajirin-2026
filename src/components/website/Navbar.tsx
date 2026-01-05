// src/components/website/Navbar.tsx
'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Menu, X, Phone, MapPin, MessageCircle, ChevronDown } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

/**
 * Navbar component for the website - Yayasan Al Muhajirin
 * Includes responsive mobile menu and authentication links
 */
export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const pathname = usePathname();
  const { isAuthenticated, isLoading } = useAuth();

  // Handle scroll effect for sticky navbar
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleWhatsAppClick = () => {
    window.open('https://wa.me/6282126380665?text=Assalamualaikum,%20saya%20ingin%20bertanya%20tentang%20Yayasan%20Al%20Muhajirin%20Rewwin', '_blank');
  };

  const navItems = [
    { name: 'Beranda', href: '/' },
    {
      name: 'Unit Kami',
      href: '/#units',
      dropdown: [
        { name: 'Masjid Al Muhajirin', href: 'https://masjid.muhajirinrewwin.or.id', external: true },
        { name: 'Daycare', href: 'https://daycare.muhajirinrewwin.or.id', external: true },
        { name: 'KBTK', href: 'https://kbtk.muhajirinrewwin.or.id', external: true },
        { name: 'LAZMU', href: 'https://lazmu.muhajirinrewwin.or.id', external: true },
      ],
    },
    { name: 'Tentang', href: '/#about' },
    { name: 'Kontak', href: '/#contact' },
  ];

  return (
    <>
      {/* Top Bar */}
      <div className="bg-gradient-to-r from-[#006064] to-[#00838F] text-white py-2 text-sm hidden md:block">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2">
              <Phone className="h-4 w-4" />
              <span>0821-2638-0665</span>
            </div>
            <div className="flex items-center space-x-2">
              <MapPin className="h-4 w-4" />
              <span>Jl. Rajawali No. 207 Rewwin, Waru</span>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <span>Melayani Umat dengan Amanah</span>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <nav
        className={`sticky top-0 z-50 w-full transition-all duration-300 ${
          isScrolled ? 'bg-white/95 backdrop-blur-md shadow-lg' : 'bg-white'
        }`}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-20 justify-between items-center">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-3">
              <div className="relative w-12 h-12 rounded-xl overflow-hidden shadow-md flex-shrink-0 bg-gradient-to-br from-[#00BCD4] to-[#006064] p-1">
                <Image
                  src="/images/Logo-YAMR.png"
                  alt="Logo Yayasan Al Muhajirin"
                  fill
                  className="object-contain p-1"
                />
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-bold text-[#006064] leading-tight">Yayasan Al Muhajirin</span>
                <span className="text-[10px] text-[#00838F] hidden sm:block">Rewwin, Waru, Sidoarjo</span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-1">
              {navItems.map((item) => (
                <div
                  key={item.name}
                  className="relative"
                  onMouseEnter={() => item.dropdown && setActiveDropdown(item.name)}
                  onMouseLeave={() => setActiveDropdown(null)}
                >
                  <Link
                    href={item.href}
                    className={`flex items-center px-4 py-2 font-medium transition-colors rounded-lg hover:bg-[#00BCD4]/5 ${
                      pathname === item.href ? 'text-[#00BCD4]' : 'text-gray-700 hover:text-[#00BCD4]'
                    }`}
                  >
                    {item.name}
                    {item.dropdown && <ChevronDown className="ml-1 h-4 w-4" />}
                  </Link>

                  {/* Dropdown Menu */}
                  {item.dropdown && activeDropdown === item.name && (
                    <div className="absolute top-full left-0 mt-1 w-56 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50">
                      {item.dropdown.map((subItem) => (
                        subItem.external ? (
                          <a
                            key={subItem.name}
                            href={subItem.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block px-4 py-2.5 text-gray-700 hover:text-[#00BCD4] hover:bg-[#00BCD4]/5 transition-colors"
                          >
                            {subItem.name}
                          </a>
                        ) : (
                          <Link
                            key={subItem.name}
                            href={subItem.href}
                            className="block px-4 py-2.5 text-gray-700 hover:text-[#00BCD4] hover:bg-[#00BCD4]/5 transition-colors"
                          >
                            {subItem.name}
                          </Link>
                        )
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="hidden lg:flex items-center space-x-3">
              {!isLoading && !isAuthenticated ? (
                <Link
                  href="/auth/login"
                  className="px-4 py-2 text-sm font-medium text-[#006064] hover:text-[#00BCD4] transition-colors"
                >
                  Login
                </Link>
              ) : null}
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
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-white border-t border-gray-100 shadow-xl">
            <div className="container mx-auto px-4 py-4 space-y-2">
              {navItems.map((item) => (
                <div key={item.name}>
                  <Link
                    href={item.href}
                    onClick={() => !item.dropdown && setMobileMenuOpen(false)}
                    className="block px-4 py-3 text-gray-700 hover:text-[#00BCD4] hover:bg-[#00BCD4]/5 rounded-lg font-medium transition-colors"
                  >
                    {item.name}
                  </Link>
                  {item.dropdown && (
                    <div className="pl-6 space-y-1">
                      {item.dropdown.map((subItem) => (
                        subItem.external ? (
                          <a
                            key={subItem.name}
                            href={subItem.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={() => setMobileMenuOpen(false)}
                            className="block px-4 py-2 text-gray-600 hover:text-[#00BCD4] hover:bg-[#00BCD4]/5 rounded-lg text-sm transition-colors"
                          >
                            {subItem.name}
                          </a>
                        ) : (
                          <Link
                            key={subItem.name}
                            href={subItem.href}
                            onClick={() => setMobileMenuOpen(false)}
                            className="block px-4 py-2 text-gray-600 hover:text-[#00BCD4] hover:bg-[#00BCD4]/5 rounded-lg text-sm transition-colors"
                          >
                            {subItem.name}
                          </Link>
                        )
                      ))}
                    </div>
                  )}
                </div>
              ))}
              <div className="pt-4 px-4 space-y-3">
                {!isLoading && !isAuthenticated && (
                  <Link
                    href="/auth/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block w-full text-center px-4 py-2 text-[#006064] border border-[#006064] rounded-full font-medium"
                  >
                    Login
                  </Link>
                )}
                <button
                  onClick={() => {
                    handleWhatsAppClick();
                    setMobileMenuOpen(false);
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
