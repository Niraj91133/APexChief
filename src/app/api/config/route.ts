import { NextResponse } from 'next/server';
import { getSiteConfig, saveSiteConfig } from '@/data/db';

export async function GET() {
  const config = getSiteConfig();
  return NextResponse.json(config);
}

export async function PUT(request: Request) {
  try {
    const newConfig = await request.json();
    if (!newConfig.name) {
      return NextResponse.json({ error: 'Missing site name' }, { status: 400 });
    }

    const success = saveSiteConfig(newConfig);
    if (success) {
      return NextResponse.json(newConfig);
    } else {
      return NextResponse.json({ error: 'Failed to save configuration to file' }, { status: 500 });
    }
  } catch (e) {
    return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
  }
}
