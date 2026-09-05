import { NextResponse } from 'next/server';
import { getImageKitAuth } from '@/lib/imagekit';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const authParams = getImageKitAuth();
    return NextResponse.json({
      success: true,
      ...authParams,
      publicKey: process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY || 'public_AzVFBiMBL7qidkoKpbvbErgv8Hg=',
      urlEndpoint: process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT || 'https://ik.imagekit.io/2nle9znkn',
    });
  } catch (error: any) {
    console.error('ImageKit auth error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to generate ImageKit authentication parameters' },
      { status: 500 }
    );
  }
}
