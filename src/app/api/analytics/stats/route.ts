import { NextResponse } from 'next/server';
import { getAnalyticsDataFromDB } from '@/lib/supabaseService';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const stats = await getAnalyticsDataFromDB();
    return NextResponse.json(stats);
  } catch (error) {
    console.error('Analytics stats error:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve analytics metrics' },
      { status: 500 }
    );
  }
}
