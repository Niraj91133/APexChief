import { NextResponse } from 'next/server';
import { incrementArticleViewInDB } from '@/lib/supabaseService';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const { slug, isUnique } = body;

    await incrementArticleViewInDB(slug, Boolean(isUnique));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Analytics track error:', error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
