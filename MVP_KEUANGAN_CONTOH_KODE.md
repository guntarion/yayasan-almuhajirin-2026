# Contoh Kode Implementasi MVP Keuangan

Dokumen ini berisi contoh kode konkret untuk implementasi MVP Keuangan di almuhajirin2026.

---

## 1. PRISMA SCHEMA ADDITIONS

Tambahkan ke `prisma/schema.prisma`:

```prisma
// ===========================================
// KEUANGAN MODELS (NEW)
// ===========================================

enum TransactionType {
  pemasukan
  pengeluaran
}

enum JenisDana {
  umum
  terbatas
  permanent
}

// Fiscal Period
model FiscalPeriod {
  id        Int       @id @default(autoincrement())
  year      Int       @unique
  startDate DateTime  @map("start_date")
  endDate   DateTime  @map("end_date")
  isCurrent Boolean   @default(false) @map("is_current")
  isClosed  Boolean   @default(false) @map("is_closed")
  closedAt  DateTime? @map("closed_at")

  createdAt DateTime  @default(now()) @map("created_at")
  updatedAt DateTime  @updatedAt @map("updated_at")

  // Relations
  openingBalances UnitOpeningBalance[]
  transactions    KeuanganTransaction[]

  @@map("fiscal_periods")
}

// Chart of Accounts
model KodeAkun {
  kode           String    @id
  nama           String
  kategori       String    // 'aset', 'kewajiban', 'aset_bersih', 'pendapatan', 'beban'
  jenisDana      JenisDana @default(umum) @map("jenis_dana")
  normalBalance  String    @map("normal_balance") // 'debit' atau 'credit'
  deskripsi      String?
  isActive       Boolean   @default(true) @map("is_active")

  createdAt      DateTime  @default(now()) @map("created_at")

  // Relations
  journalEntries JournalEntry[]
  openingBalances UnitOpeningBalance[]

  @@map("kode_akun")
}

// Transaction (Simplified from YAMR)
model KeuanganTransaction {
  id                Int              @id @default(autoincrement())
  transactionDate   DateTime         @map("transaction_date")
  unitId            String           @map("unit_id")
  transactionType   TransactionType  @map("transaction_type")
  amount            Decimal          @db.Decimal(15, 2)
  description       String
  jenisDana         JenisDana        @default(umum) @map("jenis_dana")
  notes             String?

  createdAt         DateTime         @default(now()) @map("created_at")
  updatedAt         DateTime         @updatedAt @map("updated_at")

  // Relations
  unit              Unit             @relation(fields: [unitId], references: [id])
  journalEntries    JournalEntry[]

  @@index([unitId])
  @@index([transactionDate])
  @@map("transactions")
}

// Journal Entries (Auto-generated, read-only for UI)
model JournalEntry {
  id              Int               @id @default(autoincrement())
  transactionId   Int               @map("transaction_id")
  kodeAkun        String            @map("kode_akun")
  entryType       String            @map("entry_type") // 'debit' atau 'credit'
  amount          Decimal           @db.Decimal(15, 2)

  createdAt       DateTime          @default(now()) @map("created_at")

  // Relations
  transaction     KeuanganTransaction @relation(fields: [transactionId], references: [id], onDelete: Cascade)
  account         KodeAkun          @relation(fields: [kodeAkun], references: [kode])

  @@index([transactionId])
  @@index([kodeAkun])
  @@map("journal_entries")
}

// Unit Opening Balance
model UnitOpeningBalance {
  id              Int           @id @default(autoincrement())
  fiscalPeriodId  Int           @map("fiscal_period_id")
  unitId          String        @map("unit_id")
  kodeAkun        String        @map("kode_akun")
  openingBalance  Decimal       @default(0) @db.Decimal(15, 2) @map("opening_balance")

  createdAt       DateTime      @default(now()) @map("created_at")

  // Relations
  fiscalPeriod    FiscalPeriod  @relation(fields: [fiscalPeriodId], references: [id])
  unit            Unit          @relation(fields: [unitId], references: [id])
  account         KodeAkun      @relation(fields: [kodeAkun], references: [kode])

  @@unique([fiscalPeriodId, unitId, kodeAkun])
  @@index([unitId])
  @@index([fiscalPeriodId])
  @@map("unit_opening_balances")
}

// Extend Unit model (tambahkan relasi)
model Unit {
  // ... existing fields ...

  // Tambahkan relasi ini:
  keuanganTransactions KeuanganTransaction[]
  openingBalances      UnitOpeningBalance[]
}
```

---

## 2. API ROUTES

### `/app/api/keuangan/dashboard/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/utils/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function GET(request: NextRequest) {
  try {
    // Check auth
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get current fiscal period
    const currentPeriod = await prisma.fiscalPeriod.findFirst({
      where: { isCurrent: true },
    });

    if (!currentPeriod) {
      return NextResponse.json(
        { error: 'No current fiscal period' },
        { status: 400 }
      );
    }

    // Get user's unit (if not admin, only show their unit)
    const userUnit = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: { unit: true },
    });

    // Get units filter
    const unitFilter =
      session.user.role === 'admin'
        ? {} // Show all
        : { unitId: userUnit?.unitId };

    // 1. Total Kas (Account 1101 + 1102 + 1103 + 1104)
    const kasList = await prisma.journalEntry.findMany({
      where: {
        kodeAkun: { in: ['1101', '1102', '1103', '1104'] },
        transaction: {
          ...unitFilter,
          transactionDate: {
            lte: new Date(),
          },
        },
      },
      select: { entryType: true, amount: true },
    });

    const totalKas = kasList.reduce((sum, entry) => {
      const multiplier = entry.entryType === 'debit' ? 1 : -1;
      return sum + Number(entry.amount) * multiplier;
    }, 0);

    // 2. Total Aset (all debit accounts)
    const asetList = await prisma.journalEntry.findMany({
      where: {
        transaction: {
          ...unitFilter,
          transactionDate: { lte: new Date() },
        },
        account: { kategori: 'aset' },
      },
      select: { entryType: true, amount: true },
    });

    const totalAset = asetList.reduce((sum, entry) => {
      const multiplier = entry.entryType === 'debit' ? 1 : -1;
      return sum + Number(entry.amount) * multiplier;
    }, 0);

    // 3. Total Utang (all credit accounts in liability)
    const utangList = await prisma.journalEntry.findMany({
      where: {
        transaction: {
          ...unitFilter,
          transactionDate: { lte: new Date() },
        },
        account: { kategori: 'kewajiban' },
      },
      select: { entryType: true, amount: true },
    });

    const totalUtang = utangList.reduce((sum, entry) => {
      const multiplier = entry.entryType === 'credit' ? 1 : -1;
      return sum + Number(entry.amount) * multiplier;
    }, 0);

    // 4. Aset Bersih (Aset - Utang)
    const asetBersih = totalAset - totalUtang;

    // 5. Activity log (10 latest transactions)
    const activities = await prisma.keuanganTransaction.findMany({
      where: unitFilter,
      include: { unit: true },
      orderBy: { transactionDate: 'desc' },
      take: 10,
    });

    // 6. This month income/expense
    const monthStart = new Date(
      new Date().getFullYear(),
      new Date().getMonth(),
      1
    );
    const monthEnd = new Date();

    const thisMonthTransactions = await prisma.keuanganTransaction.findMany({
      where: {
        ...unitFilter,
        transactionDate: {
          gte: monthStart,
          lte: monthEnd,
        },
      },
      select: { transactionType: true, amount: true },
    });

    const thisMonthIncome = thisMonthTransactions
      .filter((t) => t.transactionType === 'pemasukan')
      .reduce((sum, t) => sum + Number(t.amount), 0);

    const thisMonthExpense = thisMonthTransactions
      .filter((t) => t.transactionType === 'pengeluaran')
      .reduce((sum, t) => sum + Number(t.amount), 0);

    return NextResponse.json({
      metrics: {
        totalKas,
        totalAset,
        totalUtang,
        asetBersih,
        thisMonthIncome,
        thisMonthExpense,
        thisMonthSurplus: thisMonthIncome - thisMonthExpense,
      },
      activities: activities.map((a) => ({
        id: a.id,
        date: a.transactionDate,
        unit: a.unit.name,
        description: a.description,
        amount: a.amount,
        type: a.transactionType,
      })),
    });
  } catch (error) {
    console.error('Dashboard error:', error);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
```

### `/app/api/keuangan/transactions/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/utils/prisma';
import { getServerSession } from 'next-auth/next';
import { z } from 'zod';

// Transaction input validation
const TransactionSchema = z.object({
  transactionDate: z.string().datetime(),
  unitId: z.string().cuid(),
  transactionType: z.enum(['pemasukan', 'pengeluaran']),
  amount: z.number().positive().max(999999999),
  description: z.string().min(5).max(255),
  jenisDana: z.enum(['umum', 'terbatas', 'permanent']).default('umum'),
  notes: z.string().optional(),
});

// GET: List transactions with filters
export async function GET(request: NextRequest) {
  const session = await getServerSession();
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const searchParams = request.nextUrl.searchParams;
  const page = parseInt(searchParams.get('page') || '1');
  const pageSize = 20;
  const skip = (page - 1) * pageSize;

  // Build filters
  const filters: any = {};

  const unitId = searchParams.get('unitId');
  if (unitId) filters.unitId = unitId;

  const type = searchParams.get('type');
  if (type) filters.transactionType = type;

  const startDate = searchParams.get('startDate');
  const endDate = searchParams.get('endDate');
  if (startDate || endDate) {
    filters.transactionDate = {};
    if (startDate) filters.transactionDate.gte = new Date(startDate);
    if (endDate) filters.transactionDate.lte = new Date(endDate);
  }

  try {
    const [transactions, total] = await Promise.all([
      prisma.keuanganTransaction.findMany({
        where: filters,
        include: { unit: true },
        orderBy: { transactionDate: 'desc' },
        skip,
        take: pageSize,
      }),
      prisma.keuanganTransaction.count({ where: filters }),
    ]);

    return NextResponse.json({
      data: transactions,
      pagination: {
        page,
        pageSize,
        total,
        pages: Math.ceil(total / pageSize),
      },
    });
  } catch (error) {
    console.error('Error fetching transactions:', error);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}

// POST: Create transaction + auto-journal
export async function POST(request: NextRequest) {
  const session = await getServerSession();
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const validated = TransactionSchema.parse(body);

    // Determine journal accounts based on transaction type
    let debetAccount: string;
    let kreditAccount: string;

    if (validated.transactionType === 'pemasukan') {
      // Pemasukan: Debit Kas, Credit Pendapatan
      debetAccount = validated.jenisDana === 'umum' ? '1101' : '1104'; // Kas or Bank Wakaf
      kreditAccount = '4101'; // Pendapatan
    } else {
      // Pengeluaran: Debit Beban, Credit Kas
      debetAccount = '5101'; // Beban
      kreditAccount = validated.jenisDana === 'umum' ? '1101' : '1104'; // Kas or Bank Wakaf
    }

    // Create transaction with auto-journal in a transaction
    const result = await prisma.$transaction(async (tx) => {
      // 1. Create transaction
      const transaction = await tx.keuanganTransaction.create({
        data: {
          transactionDate: new Date(validated.transactionDate),
          unitId: validated.unitId,
          transactionType: validated.transactionType,
          amount: validated.amount,
          description: validated.description,
          jenisDana: validated.jenisDana,
          notes: validated.notes,
        },
      });

      // 2. Create debit journal entry
      await tx.journalEntry.create({
        data: {
          transactionId: transaction.id,
          kodeAkun: debetAccount,
          entryType: 'debit',
          amount: new Prisma.Decimal(validated.amount),
        },
      });

      // 3. Create credit journal entry
      await tx.journalEntry.create({
        data: {
          transactionId: transaction.id,
          kodeAkun: kreditAccount,
          entryType: 'credit',
          amount: new Prisma.Decimal(validated.amount),
        },
      });

      return transaction;
    });

    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      );
    }
    console.error('Error creating transaction:', error);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
```

---

## 3. REACT COMPONENTS

### `components/keuangan/TransactionForm.tsx`

```typescript
'use client';

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { DollarSign, Plus, X } from 'lucide-react';
import { useRouter } from 'next/navigation';

// Validation schema
const transactionSchema = z.object({
  transactionDate: z.string().datetime(),
  unitId: z.string().min(1, 'Pilih unit'),
  transactionType: z.enum(['pemasukan', 'pengeluaran']),
  amount: z.number().positive('Jumlah harus positif').max(999999999),
  description: z.string().min(5, 'Min 5 karakter').max(255),
  jenisDana: z.enum(['umum', 'terbatas', 'permanent']),
  notes: z.string().optional(),
});

type TransactionFormData = z.infer<typeof transactionSchema>;

interface TransactionFormProps {
  onSuccess?: () => void;
  units: Array<{ id: string; name: string }>;
}

export function TransactionForm({ onSuccess, units }: TransactionFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const form = useForm<TransactionFormData>({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      transactionDate: new Date().toISOString(),
      unitId: units[0]?.id || '',
      transactionType: 'pengeluaran',
      amount: 0,
      description: '',
      jenisDana: 'umum',
      notes: '',
    },
  });

  async function onSubmit(data: TransactionFormData) {
    setIsSubmitting(true);
    try {
      const response = await fetch('/api/keuangan/transactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Gagal menyimpan transaksi');
      }

      toast({
        title: 'Berhasil',
        description: 'Transaksi berhasil disimpan',
        variant: 'default',
      });

      form.reset();
      onSuccess?.();
      router.refresh();
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Terjadi kesalahan',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  const formatCurrency = (value: string) => {
    return value.replace(/\D/g, '').replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="flex items-center gap-2 mb-6">
        <DollarSign className="w-6 h-6 text-blue-600" />
        <h2 className="text-2xl font-bold">Input Transaksi Baru</h2>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Row 1: Date and Unit */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="transactionDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tanggal Transaksi</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="unitId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Unit</FormLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih unit" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {units.map((unit) => (
                        <SelectItem key={unit.id} value={unit.id}>
                          {unit.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Row 2: Type and Amount */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="transactionType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipe Transaksi</FormLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="pemasukan">
                        <span className="text-green-600 font-medium">
                          Pemasukan
                        </span>
                      </SelectItem>
                      <SelectItem value="pengeluaran">
                        <span className="text-red-600 font-medium">
                          Pengeluaran
                        </span>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Jumlah (Rp)</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="0"
                      {...field}
                      onChange={(e) => {
                        const formatted = formatCurrency(e.target.value);
                        field.onChange(
                          parseInt(formatted.replace(/,/g, '')) || 0
                        );
                      }}
                      value={
                        field.value
                          ? field.value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                          : ''
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Deskripsi */}
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Deskripsi Transaksi</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Contoh: Donasi Zakat dari Muhammad Salim"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Jenis Dana */}
          <FormField
            control={form.control}
            name="jenisDana"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Jenis Dana</FormLabel>
                <Select value={field.value} onValueChange={field.onChange}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="umum">Dana Umum</SelectItem>
                    <SelectItem value="terbatas">Dana Terbatas</SelectItem>
                    <SelectItem value="permanent">Dana Abadi</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Catatan */}
          <FormField
            control={form.control}
            name="notes"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Catatan Tambahan (Opsional)</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Tambahan informasi jika diperlukan..."
                    className="resize-none"
                    rows={3}
                    {...field}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          {/* Buttons */}
          <div className="flex justify-end gap-4 pt-6 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={() => form.reset()}
            >
              <X className="w-4 h-4 mr-2" />
              Batal
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              {isSubmitting ? 'Menyimpan...' : 'Simpan Transaksi'}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
```

### `components/keuangan/DashboardMetrics.tsx`

```typescript
'use client';

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatCurrency } from '@/lib/keuangan/formatting';
import { Loader2, TrendingUp, TrendingDown, Wallet, PiggyBank } from 'lucide-react';

interface Metrics {
  totalKas: number;
  totalAset: number;
  totalUtang: number;
  asetBersih: number;
  thisMonthIncome: number;
  thisMonthExpense: number;
  thisMonthSurplus: number;
}

interface Activity {
  id: number;
  date: Date;
  unit: string;
  description: string;
  amount: number;
  type: 'pemasukan' | 'pengeluaran';
}

export function DashboardMetrics() {
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboard();
  }, []);

  async function fetchDashboard() {
    try {
      const response = await fetch('/api/keuangan/dashboard');
      const data = await response.json();
      setMetrics(data.metrics);
      setActivities(data.activities);
    } catch (error) {
      console.error('Error fetching dashboard:', error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!metrics) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Tidak ada data keuangan</p>
      </div>
    );
  }

  const MetricCard = ({ title, value, icon: Icon, trend, subtitle }) => (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-gray-600">
          {title}
        </CardTitle>
        <Icon className="h-4 w-4 text-gray-400" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{formatCurrency(value)}</div>
        {subtitle && (
          <p className="text-xs text-gray-500 mt-1">{subtitle}</p>
        )}
        {trend && (
          <div className="flex items-center gap-1 mt-2">
            {trend > 0 ? (
              <TrendingUp className="w-3 h-3 text-green-600" />
            ) : (
              <TrendingDown className="w-3 h-3 text-red-600" />
            )}
            <span
              className={
                trend > 0 ? 'text-green-600 text-xs' : 'text-red-600 text-xs'
              }
            >
              {trend > 0 ? '+' : ''}
              {formatCurrency(Math.abs(trend))}
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Total Kas"
          value={metrics.totalKas}
          icon={Wallet}
          subtitle="Tunai & Bank"
        />
        <MetricCard
          title="Total Aset"
          value={metrics.totalAset}
          icon={PiggyBank}
          subtitle="Seluruh Aset"
        />
        <MetricCard
          title="Total Utang"
          value={metrics.totalUtang}
          icon={TrendingDown}
          trend={-metrics.totalUtang}
          subtitle="Kewajiban"
        />
        <MetricCard
          title="Aset Bersih"
          value={metrics.asetBersih}
          icon={TrendingUp}
          subtitle="Aset - Utang"
        />
      </div>

      {/* This Month Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Ringkasan Bulan Ini</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="border-l-4 border-green-600 pl-4">
              <p className="text-sm text-gray-600">Penerimaan</p>
              <p className="text-2xl font-bold text-green-600">
                {formatCurrency(metrics.thisMonthIncome)}
              </p>
            </div>
            <div className="border-l-4 border-red-600 pl-4">
              <p className="text-sm text-gray-600">Pengeluaran</p>
              <p className="text-2xl font-bold text-red-600">
                {formatCurrency(metrics.thisMonthExpense)}
              </p>
            </div>
            <div className="border-l-4 border-blue-600 pl-4">
              <p className="text-sm text-gray-600">Surplus</p>
              <p
                className={`text-2xl font-bold ${
                  metrics.thisMonthSurplus >= 0
                    ? 'text-blue-600'
                    : 'text-red-600'
                }`}
              >
                {formatCurrency(metrics.thisMonthSurplus)}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Activity Log */}
      <Card>
        <CardHeader>
          <CardTitle>Aktivitas Terbaru</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {activities.length === 0 ? (
              <p className="text-sm text-gray-500 text-center py-8">
                Belum ada transaksi
              </p>
            ) : (
              activities.map((activity) => (
                <div key={activity.id} className="flex justify-between items-center pb-3 border-b last:border-0">
                  <div className="flex-1">
                    <p className="text-sm font-medium">{activity.description}</p>
                    <p className="text-xs text-gray-500">
                      {activity.unit} •{' '}
                      {new Date(activity.date).toLocaleDateString('id-ID')}
                    </p>
                  </div>
                  <p
                    className={`font-bold ${
                      activity.type === 'pemasukan'
                        ? 'text-green-600'
                        : 'text-red-600'
                    }`}
                  >
                    {activity.type === 'pemasukan' ? '+' : '-'}
                    {formatCurrency(activity.amount)}
                  </p>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
```

---

## 4. UTILITY FUNCTIONS

### `lib/keuangan/formatting.ts`

```typescript
/**
 * Format number as Indonesian currency (Rupiah)
 */
export function formatCurrency(amount: number | string): string {
  const num = typeof amount === 'string' ? parseFloat(amount) : amount;

  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(num);
}

/**
 * Format date to Indonesian locale
 */
export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;

  return new Intl.DateTimeFormat('id-ID', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(d);
}

/**
 * Format date for input[type="date"]
 */
export function formatDateForInput(date: Date): string {
  return date.toISOString().split('T')[0];
}

/**
 * Parse currency string to number
 */
export function parseCurrency(value: string): number {
  return parseInt(value.replace(/\D/g, '')) || 0;
}
```

### `lib/keuangan/calculations.ts`

```typescript
/**
 * Calculate debit/credit balance
 */
export function calculateBalance(
  entries: Array<{ entryType: 'debit' | 'credit'; amount: number }>
): number {
  return entries.reduce((sum, entry) => {
    const multiplier = entry.entryType === 'debit' ? 1 : -1;
    return sum + entry.amount * multiplier;
  }, 0);
}

/**
 * Group transactions by category
 */
export function groupTransactionsByCategory(
  transactions: Array<{ transactionType: string; amount: number }>
) {
  return transactions.reduce((acc, t) => {
    const key = t.transactionType;
    if (!acc[key]) acc[key] = 0;
    acc[key] += t.amount;
    return acc;
  }, {} as Record<string, number>);
}

/**
 * Calculate month-over-month change
 */
export function calculateMoMChange(thisMonth: number, lastMonth: number): number {
  if (lastMonth === 0) return 100;
  return ((thisMonth - lastMonth) / Math.abs(lastMonth)) * 100;
}
```

---

## 5. HOOK UNTUK DATA FETCHING

### `hooks/keuangan/useTransactions.ts`

```typescript
import { useState, useEffect } from 'react';
import { useCallback } from 'react';

export interface Transaction {
  id: number;
  transactionDate: string;
  unit: { name: string };
  transactionType: 'pemasukan' | 'pengeluaran';
  amount: number;
  description: string;
  jenisDana: string;
  notes?: string;
}

export function useTransactions(initialPage = 1) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(initialPage);
  const [pageSize] = useState(20);
  const [total, setTotal] = useState(0);

  const [filters, setFilters] = useState({
    unitId: '',
    type: '',
    startDate: '',
    endDate: '',
  });

  const fetch = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams({
        page: page.toString(),
        ...Object.fromEntries(
          Object.entries(filters).filter(([_, v]) => v)
        ),
      });

      const response = await fetch(`/api/keuangan/transactions?${params}`);

      if (!response.ok) throw new Error('Failed to fetch');

      const data = await response.json();
      setTransactions(data.data);
      setTotal(data.pagination.total);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, [page, filters]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return {
    transactions,
    loading,
    error,
    page,
    setPage,
    pageSize,
    total,
    filters,
    setFilters,
    refetch: fetch,
  };
}
```

---

## 6. PAGE COMPONENT

### `app/(DashboardLayout)/keuangan/page.tsx`

```typescript
'use client';

import React from 'react';
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import { DashboardMetrics } from '@/components/keuangan/DashboardMetrics';
import { Loader } from 'lucide-react';

export default function KeuanganDashboard() {
  const { data: session, status } = useSession();

  if (status === 'loading') {
    return (
      <div className="flex justify-center items-center h-96">
        <Loader className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  if (status === 'unauthenticated') {
    redirect('/auth/signin');
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Dashboard Keuangan</h1>
        <p className="text-gray-600 mt-2">
          Ringkasan informasi keuangan Yayasan Al Muhajirin
        </p>
      </div>

      <DashboardMetrics />
    </div>
  );
}
```

---

## 7. SAMPLE COA DATA

### `data/keuangan/coa.ts`

```typescript
export const COA_DATA = [
  // ASET
  { kode: '1101', nama: 'Kas', kategori: 'aset', normalBalance: 'debit' },
  { kode: '1102', nama: 'Bank - Rekening Umum', kategori: 'aset', normalBalance: 'debit' },
  { kode: '1103', nama: 'Bank - Zakat', kategori: 'aset', normalBalance: 'debit', jenisDana: 'terbatas' },
  { kode: '1104', nama: 'Bank - Wakaf', kategori: 'aset', normalBalance: 'debit', jenisDana: 'permanent' },
  { kode: '1110', nama: 'Piutang KBTK', kategori: 'aset', normalBalance: 'debit' },
  { kode: '1111', nama: 'Piutang Kolam Renang', kategori: 'aset', normalBalance: 'debit' },
  { kode: '1201', nama: 'Tanah', kategori: 'aset', normalBalance: 'debit' },
  { kode: '1202', nama: 'Bangunan', kategori: 'aset', normalBalance: 'debit' },

  // KEWAJIBAN
  { kode: '2101', nama: 'Utang', kategori: 'kewajiban', normalBalance: 'credit' },
  { kode: '2102', nama: 'Utang Pajak', kategori: 'kewajiban', normalBalance: 'credit' },

  // ASET BERSIH
  { kode: '3101', nama: 'Aset Bersih Tidak Terbatas', kategori: 'aset_bersih', normalBalance: 'credit' },
  { kode: '3102', nama: 'Aset Bersih Terbatas', kategori: 'aset_bersih', normalBalance: 'credit', jenisDana: 'terbatas' },
  { kode: '3103', nama: 'Aset Bersih Abadi', kategori: 'aset_bersih', normalBalance: 'credit', jenisDana: 'permanent' },

  // PENDAPATAN
  { kode: '4101', nama: 'Donasi', kategori: 'pendapatan', normalBalance: 'credit' },
  { kode: '4102', nama: 'Zakat', kategori: 'pendapatan', normalBalance: 'credit', jenisDana: 'terbatas' },
  { kode: '4103', nama: 'SPP KBTK', kategori: 'pendapatan', normalBalance: 'credit' },
  { kode: '4104', nama: 'Sewa Kolam Renang', kategori: 'pendapatan', normalBalance: 'credit' },
  { kode: '4105', nama: 'Bunga Bank', kategori: 'pendapatan', normalBalance: 'credit' },

  // BEBAN
  { kode: '5101', nama: 'Gaji Karyawan', kategori: 'beban', normalBalance: 'debit' },
  { kode: '5102', nama: 'Operasional', kategori: 'beban', normalBalance: 'debit' },
  { kode: '5103', nama: 'Program Keagamaan', kategori: 'beban', normalBalance: 'debit' },
  { kode: '5104', nama: 'Penyusutan', kategori: 'beban', normalBalance: 'debit' },
];
```

---

## 8. MIGRATION SCRIPT (untuk seed data)

### `prisma/seed.ts`

```typescript
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // 1. Create fiscal period
  const currentYear = new Date().getFullYear();
  await prisma.fiscalPeriod.upsert({
    where: { year: currentYear },
    update: {},
    create: {
      year: currentYear,
      startDate: new Date(`${currentYear}-01-01`),
      endDate: new Date(`${currentYear}-12-31`),
      isCurrent: true,
      isClosed: false,
    },
  });

  // 2. Create Chart of Accounts
  const COA = [
    { kode: '1101', nama: 'Kas', kategori: 'aset', normalBalance: 'debit' },
    // ... add all COA items
  ];

  for (const account of COA) {
    await prisma.kodeAkun.upsert({
      where: { kode: account.kode },
      update: {},
      create: account,
    });
  }

  console.log('Seeding completed');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
```

---

Dokumen ini memberikan template konkret untuk implementasi. Sesuaikan dengan kebutuhan spesifik project dan best practices yang sudah ada di almuhajirin2026.
