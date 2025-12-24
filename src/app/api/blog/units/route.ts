import { NextRequest, NextResponse } from 'next/server';
import { getAllUnits } from '@/lib/blog/queries';

// GET /api/blog/units - List all units
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function GET(_request: NextRequest) {
  try {
    const units = await getAllUnits();

    return NextResponse.json(units, {
      headers: {
        'Cache-Control': 'public, s-maxage=600, stale-while-revalidate=1200',
      },
    });
  } catch (error) {
    console.error('Error fetching units:', error);
    return NextResponse.json(
      { error: { code: 'INTERNAL_ERROR', message: 'Failed to fetch units' } },
      { status: 500 }
    );
  }
}
