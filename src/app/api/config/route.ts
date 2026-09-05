import { NextResponse } from 'next/server';
import { getSiteConfig, saveSiteConfig } from '@/data/db';
import { getSiteConfigFromDB, saveSiteConfigInDB } from '@/lib/supabaseService';

export const dynamic = 'force-dynamic';

export async function GET() {
  const dbConfig = await getSiteConfigFromDB();
  if (dbConfig) {
    return NextResponse.json(dbConfig);
  }
  const config = getSiteConfig();
  return NextResponse.json(config);
}

export async function PUT(request: Request) {
  try {
    const newConfig = await request.json();
    if (!newConfig.name) {
      return NextResponse.json({ error: 'Missing site name' }, { status: 400 });
    }

    // 1. Save to Supabase
    await saveSiteConfigInDB(newConfig);

    // 2. Backup to local JSON
    saveSiteConfig(newConfig);

    return NextResponse.json(newConfig);
  } catch (e) {
    return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
  }
}

export async function POST(request: Request) {
  return PUT(request);
}
