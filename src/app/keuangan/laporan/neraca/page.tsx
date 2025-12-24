'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Download, Printer, Calendar, CheckCircle2, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface AccountBalance {
  kode: string;
  nama: string;
  saldo: number;
  subKategori: string | null;
  isContraAccount: boolean;
}

interface NeracaSection {
  title: string;
  accounts: AccountBalance[];
  total: number;
}

interface NeracaData {
  period: {
    year: number;
    month: number | null;
    startDate: string;
    endDate: string;
    fiscalPeriodName: string;
  };
  aset: {
    asetLancar: NeracaSection;
    asetTetap: NeracaSection;
    totalAset: number;
  };
  kewajiban: {
    jangkaPendek: NeracaSection;
    jangkaPanjang: NeracaSection;
    totalKewajiban: number;
  };
  asetBersih: {
    tanpaPembatasan: NeracaSection;
    pembatasanTemporer: NeracaSection;
    pembatasanPermanen: NeracaSection;
    totalAsetBersih: number;
  };
  totalKewajibanDanAsetBersih: number;
  isBalanced: boolean;
}

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

const months = [
  { value: '', label: 'Tahunan (Semua Bulan)' },
  { value: '1', label: 'Januari' },
  { value: '2', label: 'Februari' },
  { value: '3', label: 'Maret' },
  { value: '4', label: 'April' },
  { value: '5', label: 'Mei' },
  { value: '6', label: 'Juni' },
  { value: '7', label: 'Juli' },
  { value: '8', label: 'Agustus' },
  { value: '9', label: 'September' },
  { value: '10', label: 'Oktober' },
  { value: '11', label: 'November' },
  { value: '12', label: 'Desember' },
];

function AccountSection({ section, isNested = false }: { section: NeracaSection; isNested?: boolean }) {
  if (section.accounts.length === 0) return null;

  return (
    <div className={isNested ? 'ml-4' : ''}>
      <h4 className="font-medium text-gray-700 mb-2">{section.title}</h4>
      <div className="space-y-1">
        {section.accounts.map((account) => (
          <div
            key={account.kode}
            className={`flex justify-between items-center py-1 px-2 rounded ${
              account.isContraAccount ? 'text-red-600 bg-red-50' : 'hover:bg-gray-50'
            }`}
          >
            <span className="text-sm">
              <span className="text-gray-500 mr-2">{account.kode}</span>
              {account.nama}
            </span>
            <span className="text-sm font-medium tabular-nums">
              {formatCurrency(account.saldo)}
            </span>
          </div>
        ))}
        <div className="flex justify-between items-center py-2 px-2 border-t border-gray-200 font-semibold">
          <span>Total {section.title}</span>
          <span className="tabular-nums">{formatCurrency(section.total)}</span>
        </div>
      </div>
    </div>
  );
}

export default function NeracaPage() {
  const [year, setYear] = useState(2026);
  const [month, setMonth] = useState('');
  const [data, setData] = useState<NeracaData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const params = new URLSearchParams({ year: year.toString() });
        if (month) params.append('month', month);

        const response = await fetch(`/api/keuangan/reports/neraca?${params}`);
        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.error || 'Failed to fetch data');
        }

        setData(result.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [year, month]);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/keuangan/laporan">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-[#006064]">Laporan Posisi Keuangan (Neraca)</h1>
            <p className="text-sm text-gray-600 mt-1">Statement of Financial Position - PSAK 45 / ISAK 35</p>
          </div>
        </div>
        <div className="flex gap-2 print:hidden">
          <Button variant="outline" size="sm" onClick={handlePrint}>
            <Printer className="h-4 w-4 mr-2" />
            Cetak
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card className="print:hidden">
        <CardContent className="pt-4">
          <div className="flex gap-4 items-center">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-gray-500" />
              <span className="text-sm font-medium">Periode:</span>
            </div>
            <Select value={year.toString()} onValueChange={(v) => setYear(parseInt(v))}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="2024">2024</SelectItem>
                <SelectItem value="2025">2025</SelectItem>
                <SelectItem value="2026">2026</SelectItem>
              </SelectContent>
            </Select>
            <Select value={month} onValueChange={setMonth}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Pilih Bulan" />
              </SelectTrigger>
              <SelectContent>
                {months.map((m) => (
                  <SelectItem key={m.value} value={m.value}>
                    {m.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#00BCD4]"></div>
        </div>
      )}

      {/* Error State */}
      {error && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-4">
            <div className="flex items-center gap-2 text-red-600">
              <AlertCircle className="h-5 w-5" />
              <span>{error}</span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Report Content */}
      {data && !loading && (
        <div className="space-y-6">
          {/* Report Header */}
          <div className="text-center border-b pb-4 print:border-b-2">
            <h2 className="text-xl font-bold">YAYASAN AL MUHAJIRIN REWWIN</h2>
            <h3 className="text-lg font-semibold text-gray-700">Laporan Posisi Keuangan</h3>
            <p className="text-sm text-gray-600">
              Per {new Date(data.period.endDate).toLocaleDateString('id-ID', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })}
            </p>
          </div>

          {/* Balance Check */}
          <div className={`flex items-center gap-2 p-3 rounded-lg ${
            data.isBalanced ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
          }`}>
            {data.isBalanced ? (
              <>
                <CheckCircle2 className="h-5 w-5" />
                <span className="font-medium">Neraca Seimbang</span>
              </>
            ) : (
              <>
                <AlertCircle className="h-5 w-5" />
                <span className="font-medium">Neraca Tidak Seimbang - Periksa transaksi!</span>
              </>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Column - Aset */}
            <Card>
              <CardHeader className="bg-[#00BCD4]/10 border-b">
                <CardTitle className="text-[#006064]">ASET</CardTitle>
              </CardHeader>
              <CardContent className="pt-4 space-y-6">
                <AccountSection section={data.aset.asetLancar} />
                <AccountSection section={data.aset.asetTetap} />

                <div className="flex justify-between items-center py-3 px-2 bg-[#00BCD4]/10 rounded-lg font-bold text-[#006064]">
                  <span>TOTAL ASET</span>
                  <span className="tabular-nums text-lg">{formatCurrency(data.aset.totalAset)}</span>
                </div>
              </CardContent>
            </Card>

            {/* Right Column - Kewajiban & Aset Bersih */}
            <div className="space-y-6">
              {/* Kewajiban */}
              <Card>
                <CardHeader className="bg-orange-100/50 border-b">
                  <CardTitle className="text-orange-800">KEWAJIBAN</CardTitle>
                </CardHeader>
                <CardContent className="pt-4 space-y-6">
                  <AccountSection section={data.kewajiban.jangkaPendek} />
                  <AccountSection section={data.kewajiban.jangkaPanjang} />

                  <div className="flex justify-between items-center py-3 px-2 bg-orange-100/50 rounded-lg font-bold text-orange-800">
                    <span>TOTAL KEWAJIBAN</span>
                    <span className="tabular-nums">{formatCurrency(data.kewajiban.totalKewajiban)}</span>
                  </div>
                </CardContent>
              </Card>

              {/* Aset Bersih */}
              <Card>
                <CardHeader className="bg-green-100/50 border-b">
                  <CardTitle className="text-green-800">ASET BERSIH</CardTitle>
                </CardHeader>
                <CardContent className="pt-4 space-y-6">
                  <AccountSection section={data.asetBersih.tanpaPembatasan} />
                  <AccountSection section={data.asetBersih.pembatasanTemporer} />
                  <AccountSection section={data.asetBersih.pembatasanPermanen} />

                  <div className="flex justify-between items-center py-3 px-2 bg-green-100/50 rounded-lg font-bold text-green-800">
                    <span>TOTAL ASET BERSIH</span>
                    <span className="tabular-nums">{formatCurrency(data.asetBersih.totalAsetBersih)}</span>
                  </div>
                </CardContent>
              </Card>

              {/* Total Kewajiban + Aset Bersih */}
              <Card className="bg-[#006064] text-white">
                <CardContent className="py-4">
                  <div className="flex justify-between items-center font-bold">
                    <span>TOTAL KEWAJIBAN + ASET BERSIH</span>
                    <span className="tabular-nums text-lg">{formatCurrency(data.totalKewajibanDanAsetBersih)}</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Footer Notes */}
          <div className="text-sm text-gray-500 border-t pt-4 print:mt-8">
            <p>Catatan: Laporan ini disusun sesuai dengan PSAK 45 / ISAK 35 tentang Pelaporan Keuangan Entitas Nirlaba.</p>
            <p className="mt-1">Dicetak pada: {new Date().toLocaleString('id-ID')}</p>
          </div>
        </div>
      )}
    </div>
  );
}
