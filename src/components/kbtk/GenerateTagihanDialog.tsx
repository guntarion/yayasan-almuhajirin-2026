'use client';

import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Loader2, Users, AlertTriangle } from 'lucide-react';
import {
  BULAN_OPTIONS,
  formatKelompok,
} from '@/types/kbtk';

interface GenerateTagihanDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onGenerate: (data: GenerateData) => Promise<GenerateResult>;
}

interface GenerateData {
  bulan: number;
  tahun: number;
}

interface GenerateResult {
  created: number;
  skipped: number;
  errors: string[];
}

interface StudentPreview {
  id: string;
  nomorInduk: string;
  namaLengkap: string;
  kelompokLevel: string;
  kelompokKelas: string;
  tahunAjaran: string;
}

export function GenerateTagihanDialog({
  open,
  onOpenChange,
  onGenerate,
}: GenerateTagihanDialogProps) {
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1;

  const [bulan, setBulan] = useState<string>(currentMonth.toString());
  const [tahun, setTahun] = useState<string>(currentYear.toString());
  const [loading, setLoading] = useState(false);
  const [loadingPreview, setLoadingPreview] = useState(false);
  const [students, setStudents] = useState<StudentPreview[]>([]);
  const [result, setResult] = useState<GenerateResult | null>(null);

  // Generate year options (current year -1 to +1)
  const yearOptions = [
    currentYear - 1,
    currentYear,
    currentYear + 1,
  ].map((y) => ({ value: y.toString(), label: y.toString() }));

  // Fetch active students when dialog opens
  useEffect(() => {
    if (open) {
      fetchActiveStudents();
      setResult(null);
    }
  }, [open]);

  const fetchActiveStudents = async () => {
    setLoadingPreview(true);
    try {
      const res = await fetch('/api/kbtk/siswa?status=aktif&pageSize=100');
      const data = await res.json();
      if (data.data) {
        setStudents(
          data.data.map((s: StudentPreview) => ({
            id: s.id,
            nomorInduk: s.nomorInduk,
            namaLengkap: s.namaLengkap,
            kelompokLevel: s.kelompokLevel,
            kelompokKelas: s.kelompokKelas,
            tahunAjaran: s.tahunAjaran,
          }))
        );
      }
    } catch (error) {
      console.error('Error fetching students:', error);
    } finally {
      setLoadingPreview(false);
    }
  };

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const result = await onGenerate({
        bulan: parseInt(bulan),
        tahun: parseInt(tahun),
      });
      setResult(result);
    } catch (error) {
      console.error('Error generating tagihan:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setResult(null);
    onOpenChange(false);
  };

  // Group students by kelompok
  const studentsByKelompok = students.reduce((acc, student) => {
    const key = formatKelompok(student.kelompokLevel, student.kelompokKelas);
    if (!acc[key]) acc[key] = [];
    acc[key].push(student);
    return acc;
  }, {} as Record<string, StudentPreview[]>);

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-[#006064]">Generate Tagihan SPP</DialogTitle>
          <DialogDescription>
            Buat tagihan SPP bulanan untuk semua siswa aktif
          </DialogDescription>
        </DialogHeader>

        {result ? (
          // Show result
          <div className="py-4 space-y-4">
            <div className="text-center p-6 bg-gradient-to-r from-[#00BCD4]/5 to-[#006064]/5 rounded-lg">
              {result.created > 0 ? (
                <>
                  <div className="text-4xl font-bold text-green-600 mb-2">
                    {result.created}
                  </div>
                  <p className="text-gray-600">Tagihan berhasil dibuat</p>
                </>
              ) : (
                <>
                  <AlertTriangle className="h-12 w-12 mx-auto text-yellow-500 mb-2" />
                  <p className="text-gray-600">Tidak ada tagihan baru yang dibuat</p>
                </>
              )}
            </div>

            {result.skipped > 0 && (
              <p className="text-sm text-gray-500 text-center">
                {result.skipped} siswa sudah memiliki tagihan untuk periode ini
              </p>
            )}

            {result.errors.length > 0 && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-sm font-medium text-red-700 mb-2">Peringatan:</p>
                <ul className="text-sm text-red-600 space-y-1">
                  {result.errors.slice(0, 5).map((err, i) => (
                    <li key={i}>- {err}</li>
                  ))}
                  {result.errors.length > 5 && (
                    <li>... dan {result.errors.length - 5} lainnya</li>
                  )}
                </ul>
              </div>
            )}

            <DialogFooter>
              <Button
                onClick={handleClose}
                className="bg-gradient-to-r from-[#00BCD4] to-[#006064] text-white"
              >
                Selesai
              </Button>
            </DialogFooter>
          </div>
        ) : (
          // Show form
          <>
            <div className="space-y-4 py-4">
              {/* Period Selection */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Bulan</Label>
                  <Select value={bulan} onValueChange={setBulan}>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih bulan" />
                    </SelectTrigger>
                    <SelectContent>
                      {BULAN_OPTIONS.map((option) => (
                        <SelectItem
                          key={option.value}
                          value={option.value.toString()}
                        >
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Tahun</Label>
                  <Select value={tahun} onValueChange={setTahun}>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih tahun" />
                    </SelectTrigger>
                    <SelectContent>
                      {yearOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Students Preview */}
              <div className="space-y-2">
                <Label>
                  Preview Siswa Aktif ({students.length} siswa)
                </Label>
                {loadingPreview ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin text-[#00BCD4]" />
                  </div>
                ) : students.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <Users className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                    <p>Tidak ada siswa aktif</p>
                  </div>
                ) : (
                  <ScrollArea className="h-48 rounded-lg border">
                    <div className="p-3 space-y-3">
                      {Object.entries(studentsByKelompok).map(([kelompok, list]) => (
                        <div key={kelompok}>
                          <div className="flex items-center gap-2 mb-2">
                            <Badge
                              variant="outline"
                              className="text-[#006064] border-[#00BCD4]"
                            >
                              {kelompok}
                            </Badge>
                            <span className="text-xs text-gray-500">
                              ({list.length} siswa)
                            </span>
                          </div>
                          <div className="pl-4 space-y-1">
                            {list.map((student) => (
                              <p key={student.id} className="text-sm text-gray-600">
                                {student.namaLengkap}
                              </p>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                )}
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={handleClose}>
                Batal
              </Button>
              <Button
                onClick={handleGenerate}
                disabled={loading || students.length === 0}
                className="bg-gradient-to-r from-[#00BCD4] to-[#006064] text-white"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Generating...
                  </>
                ) : (
                  `Generate ${students.length} Tagihan`
                )}
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
