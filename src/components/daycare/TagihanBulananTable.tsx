'use client';

import * as React from 'react';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Eye,
  MoreHorizontal,
  CreditCard,
  Trash2,
} from 'lucide-react';
import {
  TagihanBulananWithRelations,
  STATUS_TAGIHAN_OPTIONS,
  formatRupiah,
  getStatusColor,
  getPaketLabel,
  getPaketColor,
  getNamaBulan,
} from '@/types/daycare';

export interface TagihanBulananListItem extends TagihanBulananWithRelations {
  _totalBayar: number;
  _sisaTagihan: number;
}

interface TagihanBulananTableProps {
  data: TagihanBulananListItem[];
  onQuickPayment?: (tagihan: TagihanBulananListItem) => void;
  onDelete?: (id: string) => void;
}

export function TagihanBulananTable({
  data,
  onQuickPayment,
  onDelete,
}: TagihanBulananTableProps) {
  const getProgressPercent = (tagihan: TagihanBulananListItem) => {
    const total = Number(tagihan.totalTagihan);
    const bayar = tagihan._totalBayar || 0;
    return total > 0 ? Math.min((bayar / total) * 100, 100) : 0;
  };

  const getPaymentBadge = (tagihan: TagihanBulananListItem) => {
    const status = tagihan.status;
    const statusOption = STATUS_TAGIHAN_OPTIONS.find((s) => s.value === status);
    return (
      <Badge className={getStatusColor(status)}>
        {statusOption?.label || status}
      </Badge>
    );
  };

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Periode</TableHead>
            <TableHead>Nama Anak</TableHead>
            <TableHead>Paket</TableHead>
            <TableHead className="text-right">Tagihan</TableHead>
            <TableHead>Pembayaran</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((tagihan) => (
            <TableRow key={tagihan.id}>
              <TableCell className="whitespace-nowrap font-medium">
                {getNamaBulan(tagihan.bulan)} {tagihan.tahun}
              </TableCell>
              <TableCell>
                <div>
                  <div className="font-medium">{tagihan.anak?.namaLengkap}</div>
                  <div className="text-sm text-gray-500">{tagihan.anak?.nomorInduk}</div>
                </div>
              </TableCell>
              <TableCell>
                <Badge className={getPaketColor(tagihan.paket)}>
                  {getPaketLabel(tagihan.paket)}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <div>
                  <div className="font-medium">{formatRupiah(Number(tagihan.totalTagihan))}</div>
                  {Number(tagihan.diskon) > 0 && (
                    <div className="text-xs text-green-600">
                      Diskon: {formatRupiah(Number(tagihan.diskon))}
                    </div>
                  )}
                </div>
              </TableCell>
              <TableCell>
                <div className="space-y-2 min-w-[180px]">
                  <div className="flex justify-between text-sm">
                    <span className="text-green-600">{formatRupiah(tagihan._totalBayar || 0)}</span>
                    <span className="text-red-600">{formatRupiah(tagihan._sisaTagihan || 0)}</span>
                  </div>
                  <Progress
                    value={getProgressPercent(tagihan)}
                    className="h-2"
                  />
                </div>
              </TableCell>
              <TableCell>
                {getPaymentBadge(tagihan)}
              </TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem asChild>
                      <Link href={`/units/daycare/kelola/tagihan-bulanan/${tagihan.id}`}>
                        <Eye className="w-4 h-4 mr-2" />
                        Lihat Detail
                      </Link>
                    </DropdownMenuItem>
                    {tagihan.status !== 'lunas' && onQuickPayment && (
                      <DropdownMenuItem onClick={() => onQuickPayment(tagihan)}>
                        <CreditCard className="w-4 h-4 mr-2" />
                        Bayar
                      </DropdownMenuItem>
                    )}
                    {tagihan.pembayaran.length === 0 && onDelete && (
                      <DropdownMenuItem
                        className="text-red-600"
                        onClick={() => onDelete(tagihan.id)}
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Hapus
                      </DropdownMenuItem>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
