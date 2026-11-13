import { NextResponse } from 'next/server';
import { getArticleRawImageFromDB } from '@/lib/supabaseService';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const raw = await getArticleRawImageFromDB(slug);

  if (!raw) {
    return NextResponse.redirect(
      'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200'
    );
  }

  if (raw.startsWith('data:image/')) {
    const match = raw.match(/^data:(image\/[a-zA-Z0-9+.-]+);base64,(.+)$/);
    if (match) {
      const contentType = match[1];
      const buffer = Buffer.from(match[2], 'base64');
      return new NextResponse(buffer, {
        status: 200,
        headers: {
          'Content-Type': contentType,
          'Cache-Control': 'public, max-age=3600, stale-while-revalidate=86400',
        },
      });
    }
  }

  if (raw.startsWith('http://') || raw.startsWith('https://') || raw.startsWith('/')) {
    return NextResponse.redirect(raw);
  }

  return NextResponse.redirect(
    'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200'
  );
}

