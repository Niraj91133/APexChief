import { NextRequest, NextResponse } from 'next/server';
import { uploadImage } from '@/lib/imagekit';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  try {
    const contentType = req.headers.get('content-type') || '';

    if (contentType.includes('multipart/form-data')) {
      const formData = await req.formData();
      const file = formData.get('file') as File | null;
      const folder = (formData.get('folder') as string) || '/articles';

      if (!file) {
        return NextResponse.json({ success: false, error: 'No file uploaded' }, { status: 400 });
      }

      const buffer = Buffer.from(await file.arrayBuffer());
      const fileName = file.name || `img-${Date.now()}.jpg`;

      const uploadResult = await uploadImage(buffer, fileName, folder);
      if (!uploadResult.success) {
        return NextResponse.json({ success: false, error: uploadResult.error }, { status: 500 });
      }

      return NextResponse.json(uploadResult);
    } else {
      // JSON body (base64 or remote image URL)
      const body = await req.json();
      const { file, fileName = `img-${Date.now()}.jpg`, folder = '/articles' } = body;

      if (!file) {
        return NextResponse.json({ success: false, error: 'Missing file payload' }, { status: 400 });
      }

      const uploadResult = await uploadImage(file, fileName, folder);
      if (!uploadResult.success) {
        return NextResponse.json({ success: false, error: uploadResult.error }, { status: 500 });
      }

      return NextResponse.json(uploadResult);
    }
  } catch (error: any) {
    console.error('Image upload route error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Internal server error during upload' },
      { status: 500 }
    );
  }
}
