'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ArrowLeft, Pencil, FileText, Calendar } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

interface ProgramItem {
  id: string;
  kodeItem: string;
  namaItem: string;
  keterangan: string | null;
  volume: number;
  satuan: string;
  hargaSatuan: number;
  jumlah: number;
  realisasi: number;
  monthlyBudget: Record<string, number | null>;
  kodeAkun: { kode: string; nama: string } | null;
}

interface ProgramDetail {
  id: string;
  kode: string;
  nama: string;
  jenis: 'pendapatan' | 'pengeluaran';
  sifat: string;
  status: string;
  fiscalYear: number;
  deskripsi: string | null;
  bidang: { kode: string; nama: string };
  unit: { kode: string; nama: string };
  totalAnggaran: number;
  totalRealisasi: number;
  progress: number;
  items: ProgramItem[];
  recentTransactions: Array<{
    id: string;
    code: string;
    date: string;
    description: string;
    amount: number;
    type: string;
  }>;
}

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

const _monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];

export default function ProgramDetailPage() {
  const params = useParams();
  const [program, setProgram] = useState<ProgramDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (params.id) {
      fetchProgram(params.id as string);
    }
  }, [params.id]);

  const fetchProgram = async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`/api/keuangan/programs/${id}`);
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Program tidak ditemukan');
      }

      setProgram(result.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Terjadi kesalahan');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#00BCD4]"></div>
      </div>
    );
  }

  if (error || !program) {
    return (
      <div className="space-y-6">
        <Button variant="ghost" asChild>
          <Link href="/program">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Kembali
          </Link>
        </Button>
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <p className="text-red-600">{error || 'Program tidak ditemukan'}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const isPendapatan = program.jenis === 'pendapatan';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/program">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-[#006064]">{program.nama}</h1>
            <p className="text-sm text-gray-500 font-mono">{program.kode}</p>
          </div>
        </div>
        <Button asChild className="bg-[#00BCD4] hover:bg-[#006064]">
          <Link href={`/program/${program.id}/edit`}>
            <Pencil className="h-4 w-4 mr-2" />
            Edit Program
          </Link>
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-4">
            <p className="text-sm text-gray-600">Total Anggaran</p>
            <p className="text-xl font-bold text-[#006064]">{formatCurrency(program.totalAnggaran)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <p className="text-sm text-gray-600">Total Realisasi</p>
            <p className={`text-xl font-bold ${isPendapatan ? 'text-green-600' : 'text-orange-600'}`}>
              {formatCurrency(program.totalRealisasi)}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <p className="text-sm text-gray-600">Progress</p>
            <div className="flex items-center gap-2">
              <Progress value={program.progress} className="h-2 flex-1" />
              <span className="text-lg font-bold">{program.progress}%</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <p className="text-sm text-gray-600">Status</p>
            <div className="flex items-center gap-2 mt-1">
              <Badge
                className={`${
                  program.status === 'aktif'
                    ? 'bg-green-100 text-green-700'
                    : program.status === 'selesai'
                    ? 'bg-blue-100 text-blue-700'
                    : 'bg-gray-100 text-gray-700'
                }`}
              >
                {program.status}
              </Badge>
              <Badge variant="outline" className={isPendapatan ? 'text-green-600' : 'text-orange-600'}>
                {isPendapatan ? 'Pendapatan' : 'Pengeluaran'}
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Program Info */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <FileText className="h-5 w-5 text-[#00BCD4]" />
            Informasi Program
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-sm text-gray-500">Bidang</p>
              <p className="font-medium">{program.bidang.nama}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Unit Kerja</p>
              <p className="font-medium">{program.unit.nama}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Sifat</p>
              <p className="font-medium capitalize">{program.sifat}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Tahun Fiskal</p>
              <p className="font-medium">{program.fiscalYear}</p>
            </div>
          </div>
          {program.deskripsi && (
            <div className="mt-4 pt-4 border-t">
              <p className="text-sm text-gray-500">Deskripsi</p>
              <p className="mt-1">{program.deskripsi}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Program Items */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Calendar className="h-5 w-5 text-[#00BCD4]" />
            Rincian Anggaran ({program.items.length} item)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-gray-50">
                  <th className="text-left py-3 px-2">Kode</th>
                  <th className="text-left py-3 px-2">Nama Item</th>
                  <th className="text-center py-3 px-2">Vol</th>
                  <th className="text-right py-3 px-2">Harga</th>
                  <th className="text-right py-3 px-2">Jumlah</th>
                  <th className="text-right py-3 px-2">Realisasi</th>
                  <th className="text-center py-3 px-2">Progress</th>
                </tr>
              </thead>
              <tbody>
                {program.items.map((item) => {
                  const itemProgress = item.jumlah > 0 ? Math.round((item.realisasi / item.jumlah) * 100) : 0;
                  return (
                    <tr key={item.id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-2 font-mono text-xs">{item.kodeItem}</td>
                      <td className="py-3 px-2">
                        <div>{item.namaItem}</div>
                        {item.keterangan && (
                          <div className="text-xs text-gray-500">{item.keterangan}</div>
                        )}
                      </td>
                      <td className="py-3 px-2 text-center">
                        {item.volume} {item.satuan}
                      </td>
                      <td className="py-3 px-2 text-right tabular-nums">
                        {formatCurrency(item.hargaSatuan)}
                      </td>
                      <td className="py-3 px-2 text-right tabular-nums font-medium">
                        {formatCurrency(item.jumlah)}
                      </td>
                      <td className="py-3 px-2 text-right tabular-nums">
                        {formatCurrency(item.realisasi)}
                      </td>
                      <td className="py-3 px-2">
                        <div className="flex items-center gap-2">
                          <Progress value={itemProgress} className="h-2 w-16" />
                          <span className="text-xs w-8">{itemProgress}%</span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
              <tfoot>
                <tr className="bg-gray-100 font-bold">
                  <td colSpan={4} className="py-3 px-2">TOTAL</td>
                  <td className="py-3 px-2 text-right tabular-nums">{formatCurrency(program.totalAnggaran)}</td>
                  <td className="py-3 px-2 text-right tabular-nums">{formatCurrency(program.totalRealisasi)}</td>
                  <td className="py-3 px-2 text-center">{program.progress}%</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Recent Transactions */}
      {program.recentTransactions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Transaksi Terbaru</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {program.recentTransactions.map((trx) => (
                <div key={trx.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium">{trx.description}</p>
                    <p className="text-sm text-gray-500">
                      {new Date(trx.date).toLocaleDateString('id-ID')} - {trx.code}
                    </p>
                  </div>
                  <p className={`font-bold ${trx.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                    {trx.type === 'income' ? '+' : '-'} {formatCurrency(trx.amount)}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
