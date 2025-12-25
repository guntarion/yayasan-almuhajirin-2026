'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Plus, Search, Filter, ArrowUpCircle, ArrowDownCircle,
  FileText, RefreshCw, ChevronLeft, ChevronRight, Eye, Edit, Ban
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { formatCurrency, formatDate } from '@/utils/keuangan';

interface JournalEntry {
  id: string;
  entryType: 'debit' | 'credit';
  amount: number;
  description: string;
  akun: {
    kode: string;
    nama: string;
    kategori?: string;
  };
}

interface TransactionDetail {
  id: string;
  code: string;
  transactionDate: string;
  type: 'income' | 'expense';
  amount: number;
  description: string;
  entityName: string | null;
  paymentMethod: string;
  notes: string | null;
  isVoided: boolean;
  voidReason: string | null;
  bidang: { kode: string; nama: string } | null;
  unitKerja: { kode: string; nama: string } | null;
  programKerja: { id: string; kode: string; nama: string } | null;
  programItem: {
    id: string;
    kodeItem: string;
    namaItem: string;
    jumlah: number;
    realisasi: number;
  } | null;
  journalEntries: JournalEntry[];
  fiscalPeriod: { id: string; year: number; name: string } | null;
  createdAt: string;
  updatedAt: string;
}

interface Transaction {
  id: string;
  code: string;
  date: string;
  description: string;
  amount: number;
  type: 'income' | 'expense';
  unit: string;
  bidang: string;
  programItem?: {
    kodeItem: string;
    namaItem: string;
  } | null;
}

interface Pagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export default function TransaksiPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [pagination, setPagination] = useState<Pagination>({
    total: 0, page: 1, limit: 20, totalPages: 0, hasNext: false, hasPrev: false
  });

  // Detail modal state
  const [detailOpen, setDetailOpen] = useState(false);
  const [detailLoading, setDetailLoading] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<TransactionDetail | null>(null);

  const fetchTransactions = async (page = 1) => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (startDate) params.append('startDate', startDate);
      if (endDate) params.append('endDate', endDate);
      params.append('page', page.toString());
      params.append('limit', '20');

      const response = await fetch(`/api/keuangan/transaksi?${params}`);
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to fetch transactions');
      }

      setTransactions(result.data);
      setPagination(result.pagination);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Terjadi kesalahan');
    } finally {
      setLoading(false);
    }
  };

  const fetchTransactionDetail = async (id: string) => {
    try {
      setDetailLoading(true);
      const response = await fetch(`/api/keuangan/transaksi/${id}`);
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to fetch transaction detail');
      }

      setSelectedTransaction(result.data);
      setDetailOpen(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Gagal memuat detail transaksi');
    } finally {
      setDetailLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleFilter = () => {
    fetchTransactions(1);
  };

  const handleReset = () => {
    setSearch('');
    setStartDate('');
    setEndDate('');
    fetchTransactions(1);
  };

  const handlePageChange = (newPage: number) => {
    fetchTransactions(newPage);
  };

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
          <Link href="/transaksi/input">
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
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="relative md:col-span-2">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Cari transaksi..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 border-2 focus:border-[#00BCD4] rounded-xl"
              />
            </div>
            <Input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="border-2 focus:border-[#00BCD4] rounded-xl"
              placeholder="Dari tanggal"
            />
            <Input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="border-2 focus:border-[#00BCD4] rounded-xl"
              placeholder="Sampai tanggal"
            />
            <div className="flex gap-2">
              <Button
                variant="outline"
                className="border-[#00BCD4] text-[#006064] flex-1"
                onClick={handleFilter}
              >
                Terapkan
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleReset}
                title="Reset filter"
              >
                <RefreshCw className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Error State */}
      {error && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-4">
            <p className="text-red-600">{error}</p>
          </CardContent>
        </Card>
      )}

      {/* Transactions List */}
      <Card className="border border-gray-200">
        <CardHeader>
          <CardTitle className="text-lg text-[#006064] flex items-center gap-2">
            <FileText className="h-5 w-5 text-[#00BCD4]" />
            Transaksi
          </CardTitle>
          <CardDescription>
            {loading ? 'Memuat...' : `${pagination.total} transaksi ditemukan`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#00BCD4]"></div>
            </div>
          ) : transactions.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <FileText className="h-12 w-12 mx-auto mb-4 opacity-30" />
              <p>Belum ada transaksi</p>
              <Button asChild className="mt-4" variant="outline">
                <Link href="/transaksi/input">Input Transaksi Pertama</Link>
              </Button>
            </div>
          ) : (
            <>
            <div className="space-y-3">
              {transactions.map((trx) => (
                <div
                  key={trx.id}
                  onClick={() => fetchTransactionDetail(trx.id)}
                  className="flex items-center justify-between p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors border border-gray-200 cursor-pointer group"
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
                      <div className="flex items-center gap-2 mt-1 flex-wrap">
                        <span className="text-sm text-gray-500">{formatDate(new Date(trx.date))}</span>
                        <span className="text-gray-300">|</span>
                        <Badge variant="outline" className="text-xs">
                          {trx.bidang} - {trx.unit}
                        </Badge>
                        {trx.programItem && (
                          <>
                            <span className="text-gray-300">|</span>
                            <Badge variant="secondary" className="text-xs">
                              {trx.programItem.kodeItem}
                            </Badge>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
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
                    <Eye className="h-5 w-5 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="flex items-center justify-between pt-4 border-t mt-4">
                <p className="text-sm text-gray-500">
                  Halaman {pagination.page} dari {pagination.totalPages}
                </p>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(pagination.page - 1)}
                    disabled={!pagination.hasPrev}
                  >
                    <ChevronLeft className="h-4 w-4 mr-1" />
                    Sebelumnya
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(pagination.page + 1)}
                    disabled={!pagination.hasNext}
                  >
                    Selanjutnya
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </div>
              </div>
            )}
            </>
          )}
        </CardContent>
      </Card>

      {/* Transaction Detail Modal */}
      <Dialog open={detailOpen} onOpenChange={setDetailOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-[#006064]">
              <FileText className="h-5 w-5 text-[#00BCD4]" />
              Detail Transaksi
            </DialogTitle>
            <DialogDescription>
              {selectedTransaction?.code}
            </DialogDescription>
          </DialogHeader>

          {detailLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#00BCD4]"></div>
            </div>
          ) : selectedTransaction && (
            <div className="space-y-6">
              {/* Transaction Type Badge */}
              <div className="flex items-center gap-3">
                <div className={`p-3 rounded-xl ${
                  selectedTransaction.type === 'income' ? 'bg-green-100' : 'bg-orange-100'
                }`}>
                  {selectedTransaction.type === 'income' ? (
                    <ArrowUpCircle className="h-6 w-6 text-green-600" />
                  ) : (
                    <ArrowDownCircle className="h-6 w-6 text-orange-600" />
                  )}
                </div>
                <div>
                  <p className={`text-2xl font-bold ${
                    selectedTransaction.type === 'income' ? 'text-green-600' : 'text-orange-600'
                  }`}>
                    {selectedTransaction.type === 'income' ? '+' : '-'}
                    {formatCurrency(selectedTransaction.amount)}
                  </p>
                  <p className="text-sm text-gray-500">
                    {selectedTransaction.type === 'income' ? 'Pendapatan' : 'Pengeluaran'}
                    {' • '}
                    {selectedTransaction.paymentMethod === 'cash' ? 'Kas/Tunai' :
                      selectedTransaction.paymentMethod === 'bank' ? 'Bank Transfer' : 'Transfer Digital'}
                  </p>
                </div>
                {selectedTransaction.isVoided && (
                  <Badge variant="destructive" className="ml-auto">
                    <Ban className="h-3 w-3 mr-1" />
                    Dibatalkan
                  </Badge>
                )}
              </div>

              {/* Basic Info */}
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-500">Tanggal</p>
                  <p className="font-medium">{formatDate(new Date(selectedTransaction.transactionDate))}</p>
                </div>
                <div>
                  <p className="text-gray-500">Periode Fiskal</p>
                  <p className="font-medium">{selectedTransaction.fiscalPeriod?.name || '-'}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-gray-500">Deskripsi</p>
                  <p className="font-medium">{selectedTransaction.description}</p>
                </div>
                {selectedTransaction.entityName && (
                  <div className="col-span-2">
                    <p className="text-gray-500">Pihak Terkait</p>
                    <p className="font-medium">{selectedTransaction.entityName}</p>
                  </div>
                )}
                {selectedTransaction.notes && (
                  <div className="col-span-2">
                    <p className="text-gray-500">Catatan</p>
                    <p className="font-medium">{selectedTransaction.notes}</p>
                  </div>
                )}
              </div>

              {/* Organization Info */}
              <div className="border-t pt-4">
                <p className="text-sm font-semibold text-gray-700 mb-3">Organisasi</p>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-500">Bidang</p>
                    <p className="font-medium">{selectedTransaction.bidang?.nama || '-'}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Unit Kerja</p>
                    <p className="font-medium">{selectedTransaction.unitKerja?.nama || '-'}</p>
                  </div>
                </div>
              </div>

              {/* Program Item Info */}
              {selectedTransaction.programItem && (
                <div className="border-t pt-4">
                  <p className="text-sm font-semibold text-gray-700 mb-3">Rincian Anggaran</p>
                  <div className="bg-gray-50 p-3 rounded-lg text-sm">
                    <p className="font-medium">{selectedTransaction.programItem.kodeItem} - {selectedTransaction.programItem.namaItem}</p>
                    {selectedTransaction.programKerja && (
                      <p className="text-gray-500 mt-1">Program: {selectedTransaction.programKerja.nama}</p>
                    )}
                    <div className="flex items-center gap-4 mt-2">
                      <span className="text-gray-500">Anggaran: {formatCurrency(selectedTransaction.programItem.jumlah)}</span>
                      <span className="text-orange-600">Realisasi: {formatCurrency(selectedTransaction.programItem.realisasi)}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Journal Entries */}
              {selectedTransaction.journalEntries.length > 0 && (
                <div className="border-t pt-4">
                  <p className="text-sm font-semibold text-gray-700 mb-3">Jurnal Entries</p>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Kode Akun</TableHead>
                        <TableHead>Nama Akun</TableHead>
                        <TableHead className="text-right">Debit</TableHead>
                        <TableHead className="text-right">Kredit</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {selectedTransaction.journalEntries.map((je) => (
                        <TableRow key={je.id}>
                          <TableCell className="font-mono">{je.akun.kode}</TableCell>
                          <TableCell>{je.akun.nama}</TableCell>
                          <TableCell className="text-right">
                            {je.entryType === 'debit' ? formatCurrency(je.amount) : '-'}
                          </TableCell>
                          <TableCell className="text-right">
                            {je.entryType === 'credit' ? formatCurrency(je.amount) : '-'}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}

              {/* Void Reason */}
              {selectedTransaction.isVoided && selectedTransaction.voidReason && (
                <div className="bg-red-50 border border-red-200 p-3 rounded-lg">
                  <p className="text-sm font-semibold text-red-700">Alasan Pembatalan</p>
                  <p className="text-sm text-red-600">{selectedTransaction.voidReason}</p>
                </div>
              )}

              {/* Actions */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t">
                <Button variant="outline" onClick={() => setDetailOpen(false)}>
                  Tutup
                </Button>
                {!selectedTransaction.isVoided && (
                  <Button
                    asChild
                    className="bg-gradient-to-r from-[#00BCD4] to-[#006064] hover:from-[#006064] hover:to-[#00BCD4] text-white"
                  >
                    <Link href={`/transaksi/edit/${selectedTransaction.id}`}>
                      <Edit className="h-4 w-4 mr-2" />
                      Edit Transaksi
                    </Link>
                  </Button>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
