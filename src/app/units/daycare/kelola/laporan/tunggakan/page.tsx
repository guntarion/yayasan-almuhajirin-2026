// src/app/units/daycare/kelola/laporan/tunggakan/page.tsx
'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  AlertCircle,
  Loader2,
  Phone,
  MessageCircle,
  Users,
  Wallet,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ReportHeader } from '@/components/daycare/laporan/ReportHeader';
import { PrintStyles } from '@/components/daycare/laporan/PrintButton';
import {
  PAKET_LAYANAN_OPTIONS,
  formatRupiah,
  getNamaBulan,
  getPaketLabel,
  getPaketColor,
} from '@/types/daycare';

interface TunggakanItem {
  bulan: number;
  tahun: number;
  nominal: number;
}

interface TunggakanData {
  anak: {
    id: string;
    nomorInduk: string;
    namaLengkap: string;
    paketLayanan: string;
  };
  orangTuaKontak?: {
    nama: string;
    nomorHP?: string | null;
  };
  tunggakan: TunggakanItem[];
  totalTunggakan: number;
}

interface Summary {
  totalTunggakan: number;
  jumlahAnakMenunggak: number;
}

export default function TunggakanReportPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [tunggakanList, setTunggakanList] = useState<TunggakanData[]>([]);
  const [summary, setSummary] = useState<Summary>({
    totalTunggakan: 0,
    jumlahAnakMenunggak: 0,
  });

  // Filters
  const [filterPaket, setFilterPaket] = useState('all');

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams({
        type: 'tunggakan',
      });

      if (filterPaket !== 'all') params.append('paket', filterPaket);

      const response = await fetch(`/api/daycare/laporan?${params.toString()}`);
      const result = await response.json();

      if (result.success) {
        setTunggakanList(result.data || []);
        setSummary(result.summary || {
          totalTunggakan: 0,
          jumlahAnakMenunggak: 0,
        });
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setIsLoading(false);
    }
  }, [filterPaket]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleWhatsAppReminder = (data: TunggakanData) => {
    if (!data.orangTuaKontak?.nomorHP) {
      alert('Nomor HP orang tua tidak tersedia');
      return;
    }

    // Format phone number for WhatsApp
    let phoneNumber = data.orangTuaKontak.nomorHP.replace(/\D/g, '');
    if (phoneNumber.startsWith('0')) {
      phoneNumber = '62' + phoneNumber.slice(1);
    }

    // Create message
    const tunggakanDetail = data.tunggakan
      .map((t) => `- ${getNamaBulan(t.bulan)} ${t.tahun}: ${formatRupiah(t.nominal)}`)
      .join('\n');

    const message = `Assalamu'alaikum ${data.orangTuaKontak.nama},

Dengan hormat, kami ingin mengingatkan bahwa terdapat tunggakan pembayaran Daycare Al Muhajirin untuk anak *${data.anak.namaLengkap}* dengan rincian:

${tunggakanDetail}

*Total Tunggakan: ${formatRupiah(data.totalTunggakan)}*

Mohon untuk segera melakukan pembayaran. Jika sudah melakukan pembayaran, mohon abaikan pesan ini.

Terima kasih atas perhatiannya.

Wassalamu'alaikum
_Daycare Al Muhajirin Rewwin_`;

    // Open WhatsApp
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const filterSlot = (
    <div className="flex flex-wrap gap-4">
      <div className="min-w-[180px]">
        <label className="text-sm font-medium text-gray-700 mb-1 block">
          Paket Layanan
        </label>
        <Select value={filterPaket} onValueChange={setFilterPaket}>
          <SelectTrigger>
            <SelectValue placeholder="Semua Paket" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Semua Paket</SelectItem>
            {PAKET_LAYANAN_OPTIONS.filter((opt) => opt.value !== 'HARIAN').map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-10 w-10 animate-spin text-[#00BCD4]" />
          <p className="text-gray-600">Memuat data tunggakan...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PrintStyles />

      <ReportHeader
        title="Daftar Tunggakan"
        subtitle="Daftar anak yang memiliki tunggakan pembayaran"
        filterSlot={filterSlot}
        printTitle="Daftar Tunggakan - Daycare Al Muhajirin"
      />

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 no-print">
        <Card className="border-2 border-red-100 bg-gradient-to-br from-red-50 to-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Tunggakan</CardTitle>
            <Wallet className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {formatRupiah(summary.totalTunggakan)}
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 border-orange-100 bg-gradient-to-br from-orange-50 to-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Jumlah Anak Menunggak</CardTitle>
            <Users className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {summary.jumlahAnakMenunggak} <span className="text-sm font-normal text-gray-500">anak</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Print Summary */}
      <div className="print-only hidden print-summary rounded-lg">
        <div className="grid grid-cols-2 gap-4 text-center">
          <div>
            <p className="text-sm text-gray-600">Total Tunggakan</p>
            <p className="text-xl font-bold text-red-600">{formatRupiah(summary.totalTunggakan)}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Jumlah Anak Menunggak</p>
            <p className="text-xl font-bold text-orange-600">{summary.jumlahAnakMenunggak} anak</p>
          </div>
        </div>
      </div>

      {/* Data Table */}
      <Card className="border-2 border-gray-100 rounded-2xl">
        <CardContent className="pt-6">
          {tunggakanList.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-100 flex items-center justify-center">
                <AlertCircle className="h-8 w-8 text-green-500" />
              </div>
              <p className="font-medium text-green-600">Tidak ada tunggakan</p>
              <p className="text-sm">Semua anak sudah lunas pembayarannya</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50">
                    <TableHead className="w-12">No</TableHead>
                    <TableHead>No. Induk</TableHead>
                    <TableHead>Nama Anak</TableHead>
                    <TableHead>Paket</TableHead>
                    <TableHead>Bulan Tunggakan</TableHead>
                    <TableHead className="text-right">Total Tunggakan</TableHead>
                    <TableHead>Kontak Orang Tua</TableHead>
                    <TableHead className="no-print text-center">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tunggakanList.map((item, index) => (
                    <TableRow key={item.anak.id}>
                      <TableCell className="font-medium">{index + 1}</TableCell>
                      <TableCell className="font-mono text-sm">
                        {item.anak.nomorInduk}
                      </TableCell>
                      <TableCell className="font-medium">
                        {item.anak.namaLengkap}
                      </TableCell>
                      <TableCell>
                        <Badge className={getPaketColor(item.anak.paketLayanan)}>
                          {getPaketLabel(item.anak.paketLayanan)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          {item.tunggakan.map((t, idx) => (
                            <div key={idx} className="flex items-center justify-between text-sm">
                              <span>{getNamaBulan(t.bulan)} {t.tahun}</span>
                              <span className="text-gray-500 ml-2">
                                {formatRupiah(t.nominal)}
                              </span>
                            </div>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell className="text-right font-bold text-red-600">
                        {formatRupiah(item.totalTunggakan)}
                      </TableCell>
                      <TableCell>
                        {item.orangTuaKontak ? (
                          <div>
                            <p className="text-sm font-medium">{item.orangTuaKontak.nama}</p>
                            {item.orangTuaKontak.nomorHP && (
                              <p className="text-xs text-gray-500 flex items-center gap-1">
                                <Phone className="h-3 w-3" />
                                {item.orangTuaKontak.nomorHP}
                              </p>
                            )}
                          </div>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </TableCell>
                      <TableCell className="no-print text-center">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleWhatsAppReminder(item)}
                          disabled={!item.orangTuaKontak?.nomorHP}
                          className="border-green-300 text-green-600 hover:bg-green-50 hover:border-green-400"
                        >
                          <MessageCircle className="h-4 w-4 mr-1" />
                          WhatsApp
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Print Footer Note */}
      <div className="print-only hidden mt-8 pt-4 border-t border-gray-200">
        <p className="text-sm text-gray-500 text-center">
          Dokumen ini dicetak dari Sistem Daycare Al Muhajirin Rewwin
        </p>
      </div>
    </div>
  );
}
