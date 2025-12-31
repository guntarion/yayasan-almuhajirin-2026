// src/app/units/daycare/kelola/layout.tsx
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Users,
  UserPlus,
  CreditCard,
  FileText,
  Menu,
  ArrowLeft,
  Baby,
  Calendar,
  ClipboardList,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from '@/components/ui/sheet';

interface NavItem {
  label: string;
  href: string;
  icon: React.ElementType;
}

const navItems: NavItem[] = [
  {
    label: 'Dashboard',
    href: '/units/daycare/kelola',
    icon: LayoutDashboard,
  },
  {
    label: 'Data Anak',
    href: '/units/daycare/kelola/data-anak',
    icon: Users,
  },
  {
    label: 'Pendaftaran',
    href: '/units/daycare/kelola/pendaftaran',
    icon: UserPlus,
  },
  {
    label: 'Tagihan Bulanan',
    href: '/units/daycare/kelola/tagihan-bulanan',
    icon: CreditCard,
  },
  {
    label: 'Kehadiran Harian',
    href: '/units/daycare/kelola/kehadiran-harian',
    icon: Calendar,
  },
  {
    label: 'Daily Report',
    href: '/units/daycare/kelola/daily-report',
    icon: ClipboardList,
  },
  {
    label: 'Laporan',
    href: '/units/daycare/kelola/laporan',
    icon: FileText,
  },
];

function SidebarNav({ onItemClick }: { onItemClick?: () => void }) {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === '/units/daycare/kelola') {
      return pathname === '/units/daycare/kelola';
    }
    return pathname.startsWith(href);
  };

  return (
    <nav className="space-y-1 px-3">
      {navItems.map((item) => {
        const Icon = item.icon;
        const active = isActive(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onItemClick}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
              active
                ? 'bg-gradient-to-r from-[#00BCD4] to-[#006064] text-white shadow-lg'
                : 'text-gray-600 hover:bg-gradient-to-r hover:from-[#B2EBF2]/30 hover:to-[#80DEEA]/30 hover:text-[#006064]'
            }`}
          >
            <Icon
              className={`h-5 w-5 transition-transform duration-200 ${
                active ? 'text-white' : 'text-[#00BCD4] group-hover:scale-110'
              }`}
            />
            <span className="font-medium">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}

function Sidebar() {
  return (
    <aside className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 bg-white border-r border-gray-200 shadow-sm">
      {/* Logo & Brand */}
      <div className="flex items-center gap-3 px-6 py-5 border-b border-gray-100">
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-br from-[#00BCD4] to-[#006064] rounded-xl blur opacity-30" />
          <Image
            src="/images/Logo-YAMR.png"
            alt="Daycare Al Muhajirin"
            width={44}
            height={44}
            className="rounded-xl relative"
          />
        </div>
        <div>
          <h1 className="text-sm font-bold text-[#006064]">Kelola Daycare</h1>
          <p className="text-xs text-gray-500">Al Muhajirin Rewwin</p>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto py-6">
        <SidebarNav />
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-gray-100">
        <Link
          href="/units/daycare"
          className="flex items-center gap-2 px-4 py-3 text-sm text-gray-600 hover:text-[#006064] hover:bg-[#B2EBF2]/20 rounded-xl transition-all duration-200"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Kembali ke Website</span>
        </Link>
      </div>
    </aside>
  );
}

function Header() {
  const [sheetOpen, setSheetOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-sm lg:ml-64">
      <div className="flex items-center justify-between px-4 sm:px-6 lg:px-8 h-16">
        {/* Mobile Menu Button & Title */}
        <div className="flex items-center gap-4">
          <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden text-gray-600 hover:text-[#006064] hover:bg-[#B2EBF2]/30"
              >
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-72 p-0">
              <SheetTitle className="sr-only">Menu Navigasi</SheetTitle>
              {/* Mobile Sidebar */}
              <div className="flex flex-col h-full">
                {/* Logo */}
                <div className="flex items-center gap-3 px-6 py-5 border-b border-gray-100">
                  <Image
                    src="/images/Logo-YAMR.png"
                    alt="Daycare Al Muhajirin"
                    width={40}
                    height={40}
                    className="rounded-xl"
                  />
                  <div>
                    <h1 className="text-sm font-bold text-[#006064]">Kelola Daycare</h1>
                    <p className="text-xs text-gray-500">Al Muhajirin</p>
                  </div>
                </div>

                {/* Navigation */}
                <div className="flex-1 overflow-y-auto py-6">
                  <SidebarNav onItemClick={() => setSheetOpen(false)} />
                </div>

                {/* Footer */}
                <div className="p-4 border-t border-gray-100">
                  <Link
                    href="/units/daycare"
                    onClick={() => setSheetOpen(false)}
                    className="flex items-center gap-2 px-4 py-3 text-sm text-gray-600 hover:text-[#006064] hover:bg-[#B2EBF2]/20 rounded-xl transition-colors"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    <span>Kembali ke Website</span>
                  </Link>
                </div>
              </div>
            </SheetContent>
          </Sheet>

          {/* Title */}
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-[#00BCD4]/10 to-[#006064]/10">
              <Baby className="h-5 w-5 text-[#006064]" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-[#006064]">
                Daycare Al Muhajirin
              </h1>
              <p className="text-xs text-gray-500 hidden sm:block">
                Administrasi Daycare
              </p>
            </div>
          </div>
        </div>

        {/* Back Link (Desktop) */}
        <div className="hidden lg:flex items-center">
          <Link
            href="/units/daycare"
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-[#006064] hover:bg-[#B2EBF2]/30 rounded-xl transition-all duration-200"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Kembali ke Website</span>
          </Link>
        </div>
      </div>
    </header>
  );
}

export default function DaycareKelolaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#B2EBF2]/5 via-white to-[#80DEEA]/5">
      <Sidebar />
      <Header />
      <main className="lg:ml-64">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 print:max-w-full print:mx-0 print:px-0 print:py-0">
          {children}
        </div>
      </main>
      <footer className="lg:ml-64 border-t border-gray-200 mt-auto no-print">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <p className="text-center text-sm text-gray-500">
            Daycare Al Muhajirin Rewwin &copy; 2025 - Yayasan Al Muhajirin Rewwin
          </p>
        </div>
      </footer>

      {/* Print Styles */}
      <style jsx global>{`
        @media print {
          .no-print {
            display: none !important;
          }
          .print-only {
            display: block !important;
          }
          body {
            background: white !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          main {
            margin-left: 0 !important;
          }
          table {
            font-size: 10pt !important;
            width: 100% !important;
          }
          th, td {
            padding: 6px 8px !important;
            border: 1px solid #e5e7eb !important;
          }
          th {
            background-color: #f3f4f6 !important;
          }
          .page-break {
            page-break-before: always;
          }
          @page {
            margin: 1.5cm;
            size: A4;
          }
        }
      `}</style>
    </div>
  );
}
