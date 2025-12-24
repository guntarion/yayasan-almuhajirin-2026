// src/components/units/daycare/Navbar.tsx
'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { usePathname } from 'next/navigation';
import { Menu, X, Phone, MapPin, ChevronDown } from 'lucide-react';

/**
 * Navbar component for the daycare website
 * Indonesian interface with dropdown navigation for daycare pages
 */
export function DaycareNavbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const pathname = usePathname();

  // Base path for daycare unit
  const basePath = '/units/daycare';

  // Helper to get the relative path for comparison
  const getRelativePath = (path: string) => {
    if (path === '/') return basePath;
    return `${basePath}${path}`;
  };

  // Handle scroll effect for sticky navbar
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      // Don't close if clicking on dropdown button or dropdown content
      if (!target.closest('[data-dropdown-trigger]') && !target.closest('[data-dropdown-content]')) {
        setOpenDropdown(null);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const navigationMenu = [
    { name: 'Beranda', href: '/' },
    {
      name: 'Tentang',
      dropdownItems: [
        { name: 'Tentang Kami', href: '/tentang-kami', description: 'Profil, visi misi, dan sejarah' },
        { name: 'Tim Pengasuh', href: '/tim-pengasuh', description: 'Profil guru dan pengasuh berpengalaman' },
        { name: 'Fasilitas', href: '/fasilitas', description: 'Virtual tour dan showcase fasilitas' }
      ]
    },
    {
      name: 'Program',
      dropdownItems: [
        { name: 'Program & Layanan', href: '/program-layanan', description: 'Paket fullday, after school, harian' },
        { name: 'Biaya & Pendaftaran', href: '/biaya-pendaftaran', description: 'Pricing, calculator, dan cara daftar' }
      ]
    },
    {
      name: 'Media',
      dropdownItems: [
        { name: 'Galeri', href: '/galeri', description: 'Foto dan video kegiatan anak-anak' },
        { name: 'Kontak & Lokasi', href: '/kontak', description: 'Alamat, peta, dan cara menghubungi' }
      ]
    }
  ];

  const handleWhatsAppClick = () => {
    window.open('https://wa.me/6281314661918?text=Assalamualaikum,%20saya%20ingin%20bertanya%20tentang%20Daycare%20Al%20Muhajirin%20Rewwin', '_blank');
  };

  const handleDropdownClick = (e: React.MouseEvent, dropdownName: string) => {
    e.preventDefault();
    e.stopPropagation();
    setOpenDropdown(openDropdown === dropdownName ? null : dropdownName);
  };

  const isActivePath = (href: string) => {
    const fullPath = getRelativePath(href);
    return pathname === fullPath;
  };

  return (
    <>
      {/* Top Contact Bar */}
      <div className="bg-green-600 text-white py-2 px-4 text-sm">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Phone className="h-4 w-4" />
              <span>0813-1466-191</span>
            </div>
            <div className="hidden sm:flex items-center space-x-2">
              <MapPin className="h-4 w-4" />
              <span>Jl. Rajawali No. 207, Rewwin, Waru, Sidoarjo</span>
            </div>
          </div>
          <div className="text-xs">
            <span>Senin - Jumat: 07:00 - 17:00 WIB</span>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <nav
        className={`sticky top-0 z-50 w-full transition-all duration-300 ${
          isScrolled ? 'bg-white/95 backdrop-blur-md shadow-lg' : 'bg-white shadow-sm'
        }`}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-20 justify-between items-center">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-blue-600 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-lg">AM</span>
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold text-gray-800">Daycare Al Muhajirin</span>
                <span className="text-sm text-gray-600">Rewwin</span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-6">
              {navigationMenu.map((item) => (
                <div key={item.name} className="relative">
                  {item.href ? (
                    <Link
                      href={item.href}
                      className={`text-sm font-medium transition-colors hover:text-green-600 ${
                        isActivePath(item.href) ? 'text-green-600 font-semibold' : 'text-gray-700'
                      }`}
                    >
                      {item.name}
                    </Link>
                  ) : (
                    <>
                      <button
                        onClick={(e) => handleDropdownClick(e, item.name)}
                        className="flex items-center space-x-1 text-sm font-medium text-gray-700 hover:text-green-600 transition-colors"
                        data-dropdown-trigger
                      >
                        <span>{item.name}</span>
                        <ChevronDown className={`h-4 w-4 transition-transform ${
                          openDropdown === item.name ? 'rotate-180' : ''
                        }`} />
                      </button>

                      {/* Dropdown Menu */}
                      {openDropdown === item.name && (
                        <div className="absolute top-full left-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-gray-200 py-4 z-50" data-dropdown-content>
                          <div className="px-4 pb-3 border-b border-gray-100">
                            <h3 className="font-semibold text-gray-900">{item.name}</h3>
                          </div>
                          <div className="py-2">
                            {item.dropdownItems?.map((dropdownItem) => (
                              <Link
                                key={dropdownItem.name}
                                href={dropdownItem.href}
                                className={`block px-4 py-3 hover:bg-green-50 transition-colors ${
                                  isActivePath(dropdownItem.href) ? 'bg-green-50 border-r-2 border-green-500' : ''
                                }`}
                                onClick={() => setOpenDropdown(null)}
                              >
                                <div className="flex flex-col">
                                  <span className={`font-medium ${
                                    isActivePath(dropdownItem.href) ? 'text-green-600' : 'text-gray-900'
                                  }`}>
                                    {dropdownItem.name}
                                  </span>
                                  <span className="text-xs text-gray-500 mt-1">
                                    {dropdownItem.description}
                                  </span>
                                </div>
                              </Link>
                            ))}
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </div>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="hidden md:flex items-center space-x-4">
              <Button
                onClick={handleWhatsAppClick}
                className="bg-green-500 hover:bg-green-600 text-white"
                size="sm"
              >
                WhatsApp Kami
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <div className="lg:hidden">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </Button>
            </div>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="lg:hidden py-4 px-2 space-y-2 border-t bg-white">
              {navigationMenu.map((item) => (
                <div key={item.name}>
                  {item.href ? (
                    <Link
                      href={item.href}
                      className={`block py-3 px-4 text-base font-medium rounded-lg transition-colors hover:bg-green-50 hover:text-green-600 ${
                        isActivePath(item.href) ? 'text-green-600 bg-green-50 font-semibold' : 'text-gray-700'
                      }`}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {item.name}
                    </Link>
                  ) : (
                    <div>
                      <button
                        onClick={(e) => handleDropdownClick(e, item.name)}
                        className="w-full flex items-center justify-between py-3 px-4 text-base font-medium text-gray-700 hover:bg-green-50 hover:text-green-600 rounded-lg transition-colors"
                        data-dropdown-trigger
                      >
                        <span>{item.name}</span>
                        <ChevronDown className={`h-4 w-4 transition-transform ${
                          openDropdown === item.name ? 'rotate-180' : ''
                        }`} />
                      </button>

                      {openDropdown === item.name && (
                        <div className="ml-4 mt-2 space-y-1" data-dropdown-content>
                          {item.dropdownItems?.map((dropdownItem) => (
                            <Link
                              key={dropdownItem.name}
                              href={dropdownItem.href}
                              className={`block py-2 px-4 text-sm rounded-lg transition-colors hover:bg-green-50 hover:text-green-600 ${
                                isActivePath(dropdownItem.href) ? 'text-green-600 bg-green-50 font-semibold' : 'text-gray-600'
                              }`}
                              onClick={() => {
                                setMobileMenuOpen(false);
                                setOpenDropdown(null);
                              }}
                            >
                              <div className="flex flex-col">
                                <span className="font-medium">{dropdownItem.name}</span>
                                <span className="text-xs text-gray-500 mt-1">{dropdownItem.description}</span>
                              </div>
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
              <div className="pt-4 border-t border-gray-200 flex flex-col space-y-3">
                <Button
                  onClick={handleWhatsAppClick}
                  className="bg-green-500 hover:bg-green-600 text-white w-full"
                >
                  WhatsApp Kami
                </Button>
              </div>
            </div>
          )}
        </div>
      </nav>
    </>
  );
}
