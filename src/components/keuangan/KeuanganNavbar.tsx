'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Receipt,
  FileText,
  Settings,
  ChevronDown,
  Menu,
  X,
  ArrowUpCircle,
  ArrowDownCircle,
  BarChart3,
  PieChart,
  TrendingUp,
  BookOpen,
  Wallet,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface NavItem {
  label: string;
  href?: string;
  icon?: React.ReactNode;
  children?: NavItem[];
}

const navItems: NavItem[] = [
  {
    label: 'Dashboard',
    href: '/keuangan',
    icon: <LayoutDashboard className="h-4 w-4" />,
  },
  {
    label: 'Transaksi',
    icon: <Receipt className="h-4 w-4" />,
    children: [
      {
        label: 'Input Transaksi',
        href: '/keuangan/transaksi/input',
        icon: <ArrowUpCircle className="h-4 w-4" />,
      },
      {
        label: 'Daftar Transaksi',
        href: '/keuangan/transaksi',
        icon: <FileText className="h-4 w-4" />,
      },
    ],
  },
  {
    label: 'Program Kerja',
    href: '/keuangan/program',
    icon: <Wallet className="h-4 w-4" />,
  },
  {
    label: 'Laporan',
    icon: <BarChart3 className="h-4 w-4" />,
    children: [
      {
        label: 'Neraca',
        href: '/keuangan/laporan/neraca',
        icon: <PieChart className="h-4 w-4" />,
      },
      {
        label: 'Laporan Aktivitas',
        href: '/keuangan/laporan/aktivitas',
        icon: <TrendingUp className="h-4 w-4" />,
      },
      {
        label: 'Arus Kas',
        href: '/keuangan/laporan/arus-kas',
        icon: <ArrowDownCircle className="h-4 w-4" />,
      },
    ],
  },
  {
    label: 'Pengaturan',
    icon: <Settings className="h-4 w-4" />,
    children: [
      {
        label: 'Daftar Akun',
        href: '/keuangan/pengaturan/akun',
        icon: <BookOpen className="h-4 w-4" />,
      },
      {
        label: 'Pengaturan',
        href: '/keuangan/pengaturan',
        icon: <Settings className="h-4 w-4" />,
      },
    ],
  },
];

export default function KeuanganNavbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (href: string) => {
    if (href === '/keuangan') {
      return pathname === '/keuangan';
    }
    return pathname.startsWith(href);
  };

  const isParentActive = (item: NavItem) => {
    if (item.href && isActive(item.href)) return true;
    if (item.children) {
      return item.children.some((child) => child.href && isActive(child.href));
    }
    return false;
  };

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/keuangan" className="flex items-center gap-3">
            <Image
              src="/images/Logo-YAMR.png"
              alt="YAMR"
              width={40}
              height={40}
              className="rounded-lg"
            />
            <div className="hidden sm:block">
              <h1 className="text-lg font-bold text-[#006064]">Keuangan YAMR</h1>
              <p className="text-xs text-gray-500">Yayasan Al Muhajirin</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) =>
              item.children ? (
                <DropdownMenu key={item.label}>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className={`flex items-center gap-1 px-3 py-2 rounded-lg transition-all duration-200 ${
                        isParentActive(item)
                          ? 'bg-gradient-to-r from-[#00BCD4]/10 to-[#006064]/10 text-[#006064] font-semibold'
                          : 'text-gray-600 hover:text-[#00BCD4] hover:bg-[#00BCD4]/5'
                      }`}
                    >
                      {item.icon}
                      <span className="ml-1">{item.label}</span>
                      <ChevronDown className="h-4 w-4 ml-1" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="w-48">
                    <DropdownMenuLabel className="text-[#006064]">{item.label}</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {item.children.map((child) => (
                      <DropdownMenuItem key={child.label} asChild>
                        <Link
                          href={child.href || '#'}
                          className={`flex items-center gap-2 w-full cursor-pointer ${
                            child.href && isActive(child.href)
                              ? 'text-[#00BCD4] font-semibold'
                              : ''
                          }`}
                        >
                          {child.icon}
                          {child.label}
                        </Link>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Link
                  key={item.label}
                  href={item.href || '#'}
                  className={`flex items-center gap-1 px-3 py-2 rounded-lg transition-all duration-200 ${
                    item.href && isActive(item.href)
                      ? 'bg-gradient-to-r from-[#00BCD4]/10 to-[#006064]/10 text-[#006064] font-semibold'
                      : 'text-gray-600 hover:text-[#00BCD4] hover:bg-[#00BCD4]/5'
                  }`}
                >
                  {item.icon}
                  <span className="ml-1">{item.label}</span>
                </Link>
              )
            )}
          </div>

          {/* Year Selector */}
          <div className="hidden md:flex items-center gap-2">
            <span className="text-sm text-gray-500">Tahun Fiskal:</span>
            <Button
              variant="outline"
              size="sm"
              className="border-[#00BCD4] text-[#006064] hover:bg-[#00BCD4]/10"
            >
              2026
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-gray-200 bg-white">
          <div className="px-4 py-3 space-y-1">
            {navItems.map((item) =>
              item.children ? (
                <div key={item.label} className="space-y-1">
                  <div className="flex items-center gap-2 px-3 py-2 text-sm font-semibold text-[#006064]">
                    {item.icon}
                    {item.label}
                  </div>
                  <div className="pl-6 space-y-1">
                    {item.children.map((child) => (
                      <Link
                        key={child.label}
                        href={child.href || '#'}
                        onClick={() => setMobileMenuOpen(false)}
                        className={`flex items-center gap-2 px-3 py-2 text-sm rounded-lg transition-colors ${
                          child.href && isActive(child.href)
                            ? 'bg-[#00BCD4]/10 text-[#006064] font-semibold'
                            : 'text-gray-600 hover:bg-gray-100'
                        }`}
                      >
                        {child.icon}
                        {child.label}
                      </Link>
                    ))}
                  </div>
                </div>
              ) : (
                <Link
                  key={item.label}
                  href={item.href || '#'}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-2 px-3 py-2 text-sm rounded-lg transition-colors ${
                    item.href && isActive(item.href)
                      ? 'bg-[#00BCD4]/10 text-[#006064] font-semibold'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {item.icon}
                  {item.label}
                </Link>
              )
            )}
            <div className="pt-2 border-t border-gray-200">
              <div className="flex items-center gap-2 px-3 py-2">
                <span className="text-sm text-gray-500">Tahun Fiskal:</span>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-[#00BCD4] text-[#006064]"
                >
                  2026
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
