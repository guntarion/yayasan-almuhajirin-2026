'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Download, Printer, Calendar, TrendingUp, TrendingDown } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';

interface ActivityItem {
  kode: string;
  nama: string;
  jumlah: number;
  subKategori: string | null;
}

interface ActivitySection {
  title: string;
  items: ActivityItem[];
  total: number;
}

interface ProgramSummary {
  kode: string;
  nama: string;
  jenis: string;
  bidang: string;
  unit: string;
  anggaran: number;
  realisasi: number;
  progress: number;
}

interface AktivitasData {
  period: {
    year: number;
    month: number | null;
    startDate: string;
    endDate: string;
    fiscalPeriodName: string;
  };
  pendapatan: {
    tanpaPembatasan: ActivitySection;
    pembatasanTemporer: ActivitySection;
    pembatasanPermanen: ActivitySection;
    totalPendapatan: number;
  };
  beban: {
    program: ActivitySection;
    operasional: ActivitySection;
    totalBeban: number;
  };
  perubahanAsetBersih: {
    tanpaPembatasan: number;
    pembatasanTemporer: number;
    pembatasanPermanen: number;
    total: number;
  };
  programSummary: ProgramSummary[];
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
  { value: 'all', label: 'Tahunan (Semua Bulan)' },
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

function ActivityTable({ section, type }: { section: ActivitySection; type: 'income' | 'expense' }) {
  if (section.items.length === 0) return null;

  const bgColor = type === 'income' ? 'bg-green-50' : 'bg-red-50';
  const textColor = type === 'income' ? 'text-green-700' : 'text-red-700';

  return (
    <div className="mb-4">
      <h4 className="font-medium text-gray-700 mb-2">{section.title}</h4>
      <div className="space-y-1">
        {section.items.map((item) => (
          <div
            key={item.kode}
            className={`flex justify-between items-center py-2 px-3 rounded hover:${bgColor}`}
          >
            <span className="text-sm">
              <span className="text-gray-500 mr-2">{item.kode}</span>
              {item.nama}
            </span>
            <span className={`text-sm font-medium tabular-nums ${textColor}`}>
              {formatCurrency(item.jumlah)}
            </span>
          </div>
        ))}
        <div className={`flex justify-between items-center py-2 px-3 ${bgColor} rounded font-semibold ${textColor}`}>
          <span>Total {section.title}</span>
          <span className="tabular-nums">{formatCurrency(section.total)}</span>
        </div>
      </div>
    </div>
  );
}

export default function AktivitasPage() {
  const [year, setYear] = useState(2026);
  const [month, setMonth] = useState('all');
  const [data, setData] = useState<AktivitasData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const params = new URLSearchParams({ year: year.toString() });
        if (month && month !== 'all') params.append('month', month);

        const response = await fetch(`/api/keuangan/reports/aktivitas?${params}`);
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

  const isPositive = (value: number) => value >= 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/laporan">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-[#006064]">Laporan Aktivitas</h1>
            <p className="text-sm text-gray-600 mt-1">Statement of Activities - PSAK 45 / ISAK 35</p>
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
            <h3 className="text-lg font-semibold text-gray-700">Laporan Aktivitas</h3>
            <p className="text-sm text-gray-600">
              Untuk Periode yang Berakhir {new Date(data.period.endDate).toLocaleDateString('id-ID', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })}
            </p>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="bg-green-50 border-green-200">
              <CardContent className="pt-4">
                <div className="flex items-center gap-3">
                  <TrendingUp className="h-8 w-8 text-green-600" />
                  <div>
                    <p className="text-sm text-green-700">Total Pendapatan</p>
                    <p className="text-xl font-bold text-green-800">
                      {formatCurrency(data.pendapatan.totalPendapatan)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-red-50 border-red-200">
              <CardContent className="pt-4">
                <div className="flex items-center gap-3">
                  <TrendingDown className="h-8 w-8 text-red-600" />
                  <div>
                    <p className="text-sm text-red-700">Total Beban</p>
                    <p className="text-xl font-bold text-red-800">
                      {formatCurrency(data.beban.totalBeban)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className={isPositive(data.perubahanAsetBersih.total) ? 'bg-blue-50 border-blue-200' : 'bg-orange-50 border-orange-200'}>
              <CardContent className="pt-4">
                <div className="flex items-center gap-3">
                  {isPositive(data.perubahanAsetBersih.total) ? (
                    <TrendingUp className="h-8 w-8 text-blue-600" />
                  ) : (
                    <TrendingDown className="h-8 w-8 text-orange-600" />
                  )}
                  <div>
                    <p className={`text-sm ${isPositive(data.perubahanAsetBersih.total) ? 'text-blue-700' : 'text-orange-700'}`}>
                      Perubahan Aset Bersih
                    </p>
                    <p className={`text-xl font-bold ${isPositive(data.perubahanAsetBersih.total) ? 'text-blue-800' : 'text-orange-800'}`}>
                      {formatCurrency(data.perubahanAsetBersih.total)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Pendapatan */}
            <Card>
              <CardHeader className="bg-green-100/50 border-b">
                <CardTitle className="text-green-800 flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  PENDAPATAN
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <ActivityTable section={data.pendapatan.tanpaPembatasan} type="income" />
                <ActivityTable section={data.pendapatan.pembatasanTemporer} type="income" />
                <ActivityTable section={data.pendapatan.pembatasanPermanen} type="income" />

                <div className="flex justify-between items-center py-3 px-3 bg-green-100 rounded-lg font-bold text-green-800 mt-4">
                  <span>TOTAL PENDAPATAN</span>
                  <span className="tabular-nums text-lg">{formatCurrency(data.pendapatan.totalPendapatan)}</span>
                </div>
              </CardContent>
            </Card>

            {/* Beban */}
            <Card>
              <CardHeader className="bg-red-100/50 border-b">
                <CardTitle className="text-red-800 flex items-center gap-2">
                  <TrendingDown className="h-5 w-5" />
                  BEBAN
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <ActivityTable section={data.beban.program} type="expense" />
                <ActivityTable section={data.beban.operasional} type="expense" />

                <div className="flex justify-between items-center py-3 px-3 bg-red-100 rounded-lg font-bold text-red-800 mt-4">
                  <span>TOTAL BEBAN</span>
                  <span className="tabular-nums text-lg">{formatCurrency(data.beban.totalBeban)}</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Perubahan Aset Bersih */}
          <Card>
            <CardHeader className="bg-[#00BCD4]/10 border-b">
              <CardTitle className="text-[#006064]">PERUBAHAN ASET BERSIH</CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600">Tanpa Pembatasan</p>
                  <p className={`text-lg font-bold ${isPositive(data.perubahanAsetBersih.tanpaPembatasan) ? 'text-green-700' : 'text-red-700'}`}>
                    {formatCurrency(data.perubahanAsetBersih.tanpaPembatasan)}
                  </p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600">Pembatasan Temporer</p>
                  <p className={`text-lg font-bold ${isPositive(data.perubahanAsetBersih.pembatasanTemporer) ? 'text-green-700' : 'text-red-700'}`}>
                    {formatCurrency(data.perubahanAsetBersih.pembatasanTemporer)}
                  </p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600">Pembatasan Permanen</p>
                  <p className={`text-lg font-bold ${isPositive(data.perubahanAsetBersih.pembatasanPermanen) ? 'text-green-700' : 'text-red-700'}`}>
                    {formatCurrency(data.perubahanAsetBersih.pembatasanPermanen)}
                  </p>
                </div>
              </div>
              <div className={`flex justify-between items-center py-4 px-4 mt-4 rounded-lg font-bold text-white ${
                isPositive(data.perubahanAsetBersih.total) ? 'bg-green-600' : 'bg-red-600'
              }`}>
                <span>TOTAL PERUBAHAN ASET BERSIH</span>
                <span className="tabular-nums text-xl">{formatCurrency(data.perubahanAsetBersih.total)}</span>
              </div>
            </CardContent>
          </Card>

          {/* Program Summary */}
          {data.programSummary.length > 0 && (
            <Card>
              <CardHeader className="border-b">
                <CardTitle className="text-[#006064]">Ringkasan Program Kerja</CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-2 px-2">Kode</th>
                        <th className="text-left py-2 px-2">Program</th>
                        <th className="text-left py-2 px-2">Unit</th>
                        <th className="text-right py-2 px-2">Anggaran</th>
                        <th className="text-right py-2 px-2">Realisasi</th>
                        <th className="text-center py-2 px-2 w-32">Progress</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.programSummary.slice(0, 10).map((program) => (
                        <tr key={program.kode} className="border-b hover:bg-gray-50">
                          <td className="py-2 px-2 font-mono text-xs">{program.kode}</td>
                          <td className="py-2 px-2">
                            <div>{program.nama}</div>
                            <div className="text-xs text-gray-500">{program.jenis}</div>
                          </td>
                          <td className="py-2 px-2 text-gray-600">{program.unit}</td>
                          <td className="py-2 px-2 text-right tabular-nums">{formatCurrency(program.anggaran)}</td>
                          <td className="py-2 px-2 text-right tabular-nums">{formatCurrency(program.realisasi)}</td>
                          <td className="py-2 px-2">
                            <div className="flex items-center gap-2">
                              <Progress value={program.progress} className="h-2" />
                              <span className="text-xs w-10 text-right">{program.progress}%</span>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          )}

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
