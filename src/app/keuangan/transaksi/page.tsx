'use client';

import React from 'react';
import Link from 'next/link';
import { Plus, Search, Filter, ArrowUpCircle, ArrowDownCircle, FileText } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { formatCurrency, formatDate } from '@/utils/keuangan';

// Mock data - will be replaced with API calls
const mockTransactions = [
  {
    id: '1',
    code: 'TRX-202601-001',
    date: new Date('2026-01-15'),
    description: 'SPP KBTK Januari 2026',
    amount: 15000000,
    type: 'income' as const,
    unit: 'KBTK',
    bidang: 'Sosial',
  },
  {
    id: '2',
    code: 'TRX-202601-002',
    date: new Date('2026-01-14'),
    description: 'Gaji Guru KBTK',
    amount: 13800000,
    type: 'expense' as const,
    unit: 'KBTK',
    bidang: 'Sosial',
  },
  {
    id: '3',
    code: 'TRX-202601-003',
    date: new Date('2026-01-13'),
    description: 'Infaq Jumat ke-2',
    amount: 5200000,
    type: 'income' as const,
    unit: 'Ketakmiran',
    bidang: 'Keagamaan',
  },
  {
    id: '4',
    code: 'TRX-202601-004',
    date: new Date('2026-01-12'),
    description: 'Listrik Masjid',
    amount: 5000000,
    type: 'expense' as const,
    unit: 'Ketakmiran',
    bidang: 'Keagamaan',
  },
  {
    id: '5',
    code: 'TRX-202601-005',
    date: new Date('2026-01-11'),
    description: 'SPP Daycare Januari',
    amount: 28900000,
    type: 'income' as const,
    unit: 'Daycare',
    bidang: 'Sosial',
  },
];

export default function TransaksiPage() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#006064]">Daftar Transaksi</h1>
          <p className="text-sm text-gray-600 mt-1">Kelola transaksi keuangan yayasan</p>
        </div>
        <Button
          asChild
          className="bg-gradient-to-r from-[#00BCD4] to-[#006064] hover:from-[#006064] hover:to-[#00BCD4] text-white shadow-lg"
        >
          <Link href="/keuangan/transaksi/input">
            <Plus className="h-4 w-4 mr-2" />
            Input Transaksi
          </Link>
        </Button>
      </div>

      {/* Filter Section */}
      <Card className="border-2" style={{ borderColor: 'rgba(0, 188, 212, 0.1)' }}>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Filter className="h-5 w-5 text-[#00BCD4]" />
            Filter & Pencarian
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Cari transaksi..."
                className="pl-10 border-2 focus:border-[#00BCD4] rounded-xl"
              />
            </div>
            <Input type="date" className="border-2 focus:border-[#00BCD4] rounded-xl" />
            <Input type="date" className="border-2 focus:border-[#00BCD4] rounded-xl" />
            <Button variant="outline" className="border-[#00BCD4] text-[#006064]">
              Terapkan Filter
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Transactions List */}
      <Card className="border border-gray-200">
        <CardHeader>
          <CardTitle className="text-lg text-[#006064] flex items-center gap-2">
            <FileText className="h-5 w-5 text-[#00BCD4]" />
            Transaksi
          </CardTitle>
          <CardDescription>{mockTransactions.length} transaksi ditemukan</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {mockTransactions.map((trx) => (
              <div
                key={trx.id}
                className="flex items-center justify-between p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors border border-gray-200"
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`p-3 rounded-xl ${
                      trx.type === 'income' ? 'bg-green-100' : 'bg-orange-100'
                    }`}
                  >
                    {trx.type === 'income' ? (
                      <ArrowUpCircle className="h-5 w-5 text-green-600" />
                    ) : (
                      <ArrowDownCircle className="h-5 w-5 text-orange-600" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{trx.description}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-sm text-gray-500">{formatDate(trx.date)}</span>
                      <span className="text-gray-300">|</span>
                      <Badge variant="outline" className="text-xs">
                        {trx.bidang} - {trx.unit}
                      </Badge>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p
                    className={`font-bold ${
                      trx.type === 'income' ? 'text-green-600' : 'text-orange-600'
                    }`}
                  >
                    {trx.type === 'income' ? '+' : '-'}
                    {formatCurrency(trx.amount)}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">{trx.code}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
