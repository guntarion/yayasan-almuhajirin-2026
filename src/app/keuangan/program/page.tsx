'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, Filter, Plus, Eye, Pencil, Trash2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface Program {
  id: string;
  kode: string;
  nama: string;
  jenis: 'pendapatan' | 'pengeluaran';
  status: string;
  bidang: { kode: string; nama: string };
  unit: { kode: string; nama: string };
  totalAnggaran: number;
  totalRealisasi: number;
  progress: number;
}

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

export default function ProgramPage() {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [bidangFilter, setBidangFilter] = useState('all');
  const [jenisFilter, setJenisFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [bidangOptions, setBidangOptions] = useState<{ value: string; label: string }[]>([]);
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; program: Program | null }>({
    open: false,
    program: null,
  });

  useEffect(() => {
    fetchPrograms();
    fetchBidang();
  }, []);

  const fetchPrograms = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/keuangan/programs?year=2026');
      const result = await response.json();
      if (result.data) {
        setPrograms(result.data);
      }
    } catch (error) {
      console.error('Error fetching programs:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchBidang = async () => {
    try {
      const response = await fetch('/api/keuangan/lookups?type=bidang');
      const result = await response.json();
      if (result.data) {
        setBidangOptions(result.data);
      }
    } catch (error) {
      console.error('Error fetching bidang:', error);
    }
  };

  const handleDelete = async () => {
    if (!deleteDialog.program) return;

    try {
      const response = await fetch(`/api/keuangan/programs/${deleteDialog.program.id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        fetchPrograms();
      } else {
        const result = await response.json();
        alert(result.error || 'Gagal menghapus program');
      }
    } catch (error) {
      console.error('Error deleting program:', error);
      alert('Gagal menghapus program');
    } finally {
      setDeleteDialog({ open: false, program: null });
    }
  };

  const filteredPrograms = programs.filter((program) => {
    const matchSearch =
      search === '' ||
      program.nama.toLowerCase().includes(search.toLowerCase()) ||
      program.kode.toLowerCase().includes(search.toLowerCase());
    const matchBidang = bidangFilter === 'all' || program.bidang.kode === bidangFilter;
    const matchJenis = jenisFilter === 'all' || program.jenis === jenisFilter;
    const matchStatus = statusFilter === 'all' || program.status === statusFilter;

    return matchSearch && matchBidang && matchJenis && matchStatus;
  });

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#006064]">Program Kerja</h1>
          <p className="text-sm text-gray-600 mt-1">Daftar program kerja tahun 2026</p>
        </div>
        <Button asChild className="bg-[#00BCD4] hover:bg-[#006064]">
          <Link href="/program/new">
            <Plus className="h-4 w-4 mr-2" />
            Tambah Program
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
                placeholder="Cari program..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 border-2 focus:border-[#00BCD4] rounded-xl"
              />
            </div>
            <Select value={bidangFilter} onValueChange={setBidangFilter}>
              <SelectTrigger className="border-[#00BCD4]/30">
                <SelectValue placeholder="Semua Bidang" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Bidang</SelectItem>
                {bidangOptions.map((b) => (
                  <SelectItem key={b.value} value={b.value}>
                    {b.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={jenisFilter} onValueChange={setJenisFilter}>
              <SelectTrigger className="border-[#00BCD4]/30">
                <SelectValue placeholder="Semua Jenis" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Jenis</SelectItem>
                <SelectItem value="pendapatan">Pendapatan</SelectItem>
                <SelectItem value="pengeluaran">Pengeluaran</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="border-[#00BCD4]/30">
                <SelectValue placeholder="Semua Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Status</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="aktif">Aktif</SelectItem>
                <SelectItem value="selesai">Selesai</SelectItem>
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

      {/* Empty State */}
      {!loading && filteredPrograms.length === 0 && (
        <Card className="text-center py-12">
          <CardContent>
            <p className="text-gray-500">Tidak ada program ditemukan</p>
          </CardContent>
        </Card>
      )}

      {/* Programs List */}
      {!loading && filteredPrograms.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredPrograms.map((program) => {
            const isPendapatan = program.jenis === 'pendapatan';

            return (
              <Card
                key={program.id}
                className="hover:shadow-lg transition-all duration-300 border border-gray-200 hover:border-[#00BCD4]/30"
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-base text-[#006064]">{program.nama}</CardTitle>
                      <CardDescription className="text-xs mt-1 font-mono">
                        {program.kode}
                      </CardDescription>
                    </div>
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
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Badge variant="outline">{program.bidang.nama}</Badge>
                    <span>-</span>
                    <span>{program.unit.nama}</span>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Realisasi</span>
                      <span className="font-medium">{program.progress}%</span>
                    </div>
                    <Progress value={program.progress} className="h-2" />
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>{formatCurrency(program.totalRealisasi)}</span>
                      <span>dari {formatCurrency(program.totalAnggaran)}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                    <Badge
                      variant="outline"
                      className={`${
                        isPendapatan
                          ? 'border-green-500 text-green-600'
                          : 'border-orange-500 text-orange-600'
                      }`}
                    >
                      {isPendapatan ? 'Pendapatan' : 'Pengeluaran'}
                    </Badge>
                    <div className="flex items-center gap-1">
                      <Button variant="ghost" size="icon" asChild className="h-8 w-8">
                        <Link href={`/program/${program.id}`}>
                          <Eye className="h-4 w-4 text-blue-600" />
                        </Link>
                      </Button>
                      <Button variant="ghost" size="icon" asChild className="h-8 w-8">
                        <Link href={`/program/${program.id}/edit`}>
                          <Pencil className="h-4 w-4 text-gray-600" />
                        </Link>
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => setDeleteDialog({ open: true, program })}
                      >
                        <Trash2 className="h-4 w-4 text-red-600" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialog.open} onOpenChange={(open) => setDeleteDialog({ open, program: null })}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Program?</AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin ingin menghapus program &quot;{deleteDialog.program?.nama}&quot;?
              Tindakan ini tidak dapat dibatalkan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
              Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
