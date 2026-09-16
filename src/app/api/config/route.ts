import { NextResponse } from 'next/server';
import { getSiteConfig, saveSiteConfig } from '@/data/db';
import { getSiteConfigFromDB, saveSiteConfigInDB } from '@/lib/supabaseService';

export const dynamic = 'force-dynamic';

export async function GET() {
  const localConfig = getSiteConfig();
  try {
    const dbConfig = await getSiteConfigFromDB();
    if (dbConfig && dbConfig.name) {
      return NextResponse.json({
        ...localConfig,
        ...dbConfig,
        logo: dbConfig.logo || localConfig.logo || '',
        favicon: dbConfig.favicon || localConfig.favicon || '',
      });
    }
  } catch (e) {}
  return NextResponse.json(localConfig);
}

export async function PUT(request: Request) {
  try {
    const newConfig = await request.json();
    if (!newConfig.name) {
      return NextResponse.json({ error: 'Missing site name' }, { status: 400 });
    }

    if (newConfig.favicon || newConfig.faviconUrl) {
      newConfig.favicon = newConfig.favicon || newConfig.faviconUrl;
      try {
        const fs = await import('fs');
        const path = await import('path');
        const raw = newConfig.favicon.replace(/^data:image\/[a-z]+;base64,/, '');
        const buf = Buffer.from(raw, 'base64');
        const targets = [
          'public/favicon.ico',
          'public/icon.png',
          'public/apple-icon.png',
          'public/favicon.png',
        ];
        targets.forEach((t) => {
          try {
            fs.writeFileSync(path.join(process.cwd(), t), buf);
          } catch (err) {}
        });
      } catch (err) {}
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
