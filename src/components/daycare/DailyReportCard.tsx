'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { LikertIndicator } from './LikertScaleInput';
import {
  formatTanggal,
  parseKegiatanHariIni,
  KEGIATAN_OPTIONS,
  getPaketLabel,
  getPaketColor,
} from '@/types/daycare';
import {
  Eye,
  Edit,
  Trash2,
  Baby,
  Heart,
  Users,
  Utensils,
  Moon,
  ClipboardList,
  Calendar,
  User,
} from 'lucide-react';

interface ReportData {
  id: string;
  anakId?: string;
  tanggal: Date | string;
  guruPengisi?: string | null;
  moodSikap?: number | null;
  interaksiTeman?: number | null;
  catatanPerilaku?: string | null;
  partisipasiBelajar?: number | null;
  responBermain?: number | null;
  catatanAktivitas?: string | null;
  makanSiang?: number | null;
  snack?: number | null;
  catatanMakan?: string | null;
  tidurSiang?: number | null;
  durasiTidur?: string | null;
  catatanTidur?: string | null;
  kegiatanHariIni?: string | null;
  catatanGuru?: string | null;
  anak: {
    id: string;
    nomorInduk: string;
    namaLengkap: string;
    namaPanggilan?: string | null;
    foto?: string | null;
    paketLayanan?: string;
  };
}

interface DailyReportCardProps {
  report: ReportData;
  onView?: (id: string) => void;
  onEdit?: (report: ReportData) => void;
  onDelete?: (id: string) => void;
  showAnakInfo?: boolean;
}

export function DailyReportCard({
  report,
  onView,
  onEdit,
  onDelete,
  showAnakInfo = true,
}: DailyReportCardProps) {
  const kegiatan = parseKegiatanHariIni(report.kegiatanHariIni);
  const kegiatanLabels = kegiatan
    .map((k) => KEGIATAN_OPTIONS.find((opt) => opt.value === k)?.label || k)
    .slice(0, 3);

  // Calculate average score
  const scores = [
    report.moodSikap,
    report.interaksiTeman,
    report.partisipasiBelajar,
    report.responBermain,
    report.makanSiang,
    report.snack,
    report.tidurSiang,
  ].filter((s) => s !== null && s !== undefined) as number[];

  const avgScore = scores.length > 0
    ? (scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(1)
    : null;

  return (
    <Card className="hover:shadow-lg transition-all duration-200 border-gray-200 hover:border-[#00BCD4]/50">
      <CardContent className="pt-4">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            {showAnakInfo && (
              <div className="w-12 h-12 bg-gradient-to-br from-[#00BCD4] to-[#006064] rounded-full flex items-center justify-center flex-shrink-0">
                <Baby className="w-6 h-6 text-white" />
              </div>
            )}
            <div>
              {showAnakInfo && (
                <>
                  <p className="font-semibold text-[#006064]">
                    {report.anak.namaLengkap}
                  </p>
                  <p className="text-xs text-gray-500 font-mono">
                    {report.anak.nomorInduk}
                  </p>
                </>
              )}
              <div className="flex items-center gap-2 mt-1">
                <Calendar className="w-3 h-3 text-gray-400" />
                <span className="text-sm text-gray-600">
                  {formatTanggal(report.tanggal)}
                </span>
              </div>
            </div>
          </div>
          <div className="flex flex-col items-end gap-2">
            {report.anak.paketLayanan && (
              <Badge
                variant="outline"
                className={getPaketColor(report.anak.paketLayanan)}
              >
                {getPaketLabel(report.anak.paketLayanan)}
              </Badge>
            )}
            {avgScore && (
              <div className="flex items-center gap-1 text-sm">
                <span className="text-gray-500">Rata-rata:</span>
                <span
                  className={`font-bold ${
                    parseFloat(avgScore) >= 4
                      ? 'text-green-600'
                      : parseFloat(avgScore) >= 3
                      ? 'text-yellow-600'
                      : 'text-red-600'
                  }`}
                >
                  {avgScore}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Scores Grid */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          {/* Perilaku */}
          <div className="p-2 bg-pink-50 rounded-lg">
            <div className="flex items-center gap-1 mb-1">
              <Heart className="w-3 h-3 text-pink-500" />
              <span className="text-xs font-medium text-pink-700">Perilaku</span>
            </div>
            <div className="space-y-1">
              <LikertIndicator value={report.moodSikap} label="Mood" />
              <LikertIndicator value={report.interaksiTeman} label="Interaksi" />
            </div>
          </div>

          {/* Aktivitas */}
          <div className="p-2 bg-blue-50 rounded-lg">
            <div className="flex items-center gap-1 mb-1">
              <Users className="w-3 h-3 text-blue-500" />
              <span className="text-xs font-medium text-blue-700">Aktivitas</span>
            </div>
            <div className="space-y-1">
              <LikertIndicator value={report.partisipasiBelajar} label="Belajar" />
              <LikertIndicator value={report.responBermain} label="Bermain" />
            </div>
          </div>

          {/* Makan */}
          <div className="p-2 bg-orange-50 rounded-lg">
            <div className="flex items-center gap-1 mb-1">
              <Utensils className="w-3 h-3 text-orange-500" />
              <span className="text-xs font-medium text-orange-700">Makan</span>
            </div>
            <div className="space-y-1">
              <LikertIndicator value={report.makanSiang} label="Siang" />
              <LikertIndicator value={report.snack} label="Snack" />
            </div>
          </div>

          {/* Tidur */}
          <div className="p-2 bg-purple-50 rounded-lg">
            <div className="flex items-center gap-1 mb-1">
              <Moon className="w-3 h-3 text-purple-500" />
              <span className="text-xs font-medium text-purple-700">Tidur</span>
            </div>
            <div className="space-y-1">
              <LikertIndicator value={report.tidurSiang} label="Tidur" />
              {report.durasiTidur && (
                <p className="text-xs text-purple-600">
                  Durasi: {report.durasiTidur}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Kegiatan */}
        {kegiatan.length > 0 && (
          <div className="mb-3">
            <div className="flex items-center gap-1 mb-2">
              <ClipboardList className="w-3 h-3 text-[#00BCD4]" />
              <span className="text-xs font-medium text-[#006064]">
                Kegiatan Hari Ini
              </span>
            </div>
            <div className="flex flex-wrap gap-1">
              {kegiatanLabels.map((label) => (
                <Badge
                  key={label}
                  variant="outline"
                  className="text-xs bg-[#00BCD4]/10 border-[#00BCD4]/30 text-[#006064]"
                >
                  {label}
                </Badge>
              ))}
              {kegiatan.length > 3 && (
                <Badge
                  variant="outline"
                  className="text-xs bg-gray-100 border-gray-300 text-gray-600"
                >
                  +{kegiatan.length - 3} lagi
                </Badge>
              )}
            </div>
          </div>
        )}

        {/* Guru */}
        {report.guruPengisi && (
          <div className="flex items-center gap-1 mb-3 text-xs text-gray-500">
            <User className="w-3 h-3" />
            <span>Diisi oleh: {report.guruPengisi}</span>
          </div>
        )}

        {/* Catatan Preview */}
        {report.catatanGuru && (
          <div className="p-2 bg-gray-50 rounded-lg mb-3">
            <p className="text-xs text-gray-600 line-clamp-2">
              {report.catatanGuru}
            </p>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center gap-2 pt-3 border-t">
          {onView && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onView(report.id)}
              className="flex-1 border-[#00BCD4] text-[#006064] hover:bg-[#00BCD4]/10"
            >
              <Eye className="w-4 h-4 mr-1" />
              Detail
            </Button>
          )}
          {onEdit && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onEdit(report)}
              className="border-[#00BCD4] text-[#006064] hover:bg-[#00BCD4]/10"
            >
              <Edit className="w-4 h-4" />
            </Button>
          )}
          {onDelete && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onDelete(report.id)}
              className="border-red-300 text-red-600 hover:bg-red-50"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
