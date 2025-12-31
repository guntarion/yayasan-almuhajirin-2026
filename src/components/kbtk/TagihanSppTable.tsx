'use client';

import React from 'react';
import Link from 'next/link';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertCircle,
  Eye,
  MoreHorizontal,
  CreditCard,
} from 'lucide-react';
import {
  KbtkTagihanSppWithRelations,
  formatCurrency,
  getNamaBulan,
  formatKelompok,
  getStatusTagihanColor,
  isTagihanOverdue,
  STATUS_TAGIHAN_OPTIONS,
} from '@/types/kbtk';

interface TagihanSppTableProps {
  data: KbtkTagihanSppWithRelations[];
  onPayment?: (tagihan: KbtkTagihanSppWithRelations) => void;
  loading?: boolean;
}

export function TagihanSppTable({
  data,
  onPayment,
  loading = false,
}: TagihanSppTableProps) {
  if (loading) {
    return (
      <div className="rounded-lg border border-gray-200 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-gradient-to-r from-[#00BCD4]/5 to-[#006064]/5">
              <TableHead className="font-semibold text-[#006064]">Bulan/Tahun</TableHead>
              <TableHead className="font-semibold text-[#006064]">Siswa</TableHead>
              <TableHead className="font-semibold text-[#006064]">Kelompok</TableHead>
              <TableHead className="font-semibold text-[#006064] text-right">Tagihan</TableHead>
              <TableHead className="font-semibold text-[#006064] text-right">Sudah Bayar</TableHead>
              <TableHead className="font-semibold text-[#006064] text-right">Sisa</TableHead>
              <TableHead className="font-semibold text-[#006064]">Status</TableHead>
              <TableHead className="font-semibold text-[#006064] text-center">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {[...Array(5)].map((_, i) => (
              <TableRow key={i}>
                {[...Array(8)].map((_, j) => (
                  <TableCell key={j}>
                    <div className="h-4 bg-gray-200 rounded animate-pulse" />
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="rounded-lg border border-gray-200 p-8 text-center">
        <CreditCard className="h-12 w-12 mx-auto text-gray-400 mb-4" />
        <p className="text-gray-500">Belum ada data tagihan SPP</p>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-gray-200 overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-gradient-to-r from-[#00BCD4]/5 to-[#006064]/5">
            <TableHead className="font-semibold text-[#006064]">Bulan/Tahun</TableHead>
            <TableHead className="font-semibold text-[#006064]">Siswa</TableHead>
            <TableHead className="font-semibold text-[#006064]">Kelompok</TableHead>
            <TableHead className="font-semibold text-[#006064] text-right">Tagihan</TableHead>
            <TableHead className="font-semibold text-[#006064] text-right">Sudah Bayar</TableHead>
            <TableHead className="font-semibold text-[#006064] text-right">Sisa</TableHead>
            <TableHead className="font-semibold text-[#006064]">Status</TableHead>
            <TableHead className="font-semibold text-[#006064] text-center">Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((tagihan) => {
            const overdue = isTagihanOverdue(tagihan.bulan, tagihan.tahun) && tagihan.status !== 'lunas';
            const statusOption = STATUS_TAGIHAN_OPTIONS.find(
              (s) => s.value === tagihan.status
            );

            return (
              <TableRow
                key={tagihan.id}
                className={overdue ? 'bg-red-50/50' : ''}
              >
                <TableCell>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">
                      {getNamaBulan(tagihan.bulan)} {tagihan.tahun}
                    </span>
                    {overdue && (
                      <AlertCircle className="h-4 w-4 text-red-500" />
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <div>
                    <p className="font-medium">{tagihan.siswa?.namaLengkap}</p>
                    <p className="text-xs text-gray-500">
                      {tagihan.siswa?.nomorInduk}
                    </p>
                  </div>
                </TableCell>
                <TableCell>
                  {tagihan.siswa &&
                    formatKelompok(
                      tagihan.siswa.kelompokLevel,
                      tagihan.siswa.kelompokKelas
                    )}
                </TableCell>
                <TableCell className="text-right font-medium">
                  {formatCurrency(Number(tagihan.totalTagihan))}
                </TableCell>
                <TableCell className="text-right text-green-600 font-medium">
                  {formatCurrency(tagihan._totalBayar || 0)}
                </TableCell>
                <TableCell className="text-right">
                  <span
                    className={`font-medium ${
                      (tagihan._sisaTagihan || 0) > 0
                        ? 'text-red-600'
                        : 'text-green-600'
                    }`}
                  >
                    {formatCurrency(tagihan._sisaTagihan || 0)}
                  </span>
                </TableCell>
                <TableCell>
                  <Badge className={getStatusTagihanColor(tagihan.status)}>
                    {statusOption?.label || tagihan.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center justify-center gap-1">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                          <Link href={`/units/kbtk/kelola/spp/tagihan/${tagihan.id}`}>
                            <Eye className="h-4 w-4 mr-2" />
                            Lihat Detail
                          </Link>
                        </DropdownMenuItem>
                        {tagihan.status !== 'lunas' && onPayment && (
                          <DropdownMenuItem
                            onClick={() => onPayment(tagihan)}
                            className="text-green-600"
                          >
                            <CreditCard className="h-4 w-4 mr-2" />
                            Input Pembayaran
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
