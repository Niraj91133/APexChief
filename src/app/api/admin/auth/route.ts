import { NextResponse } from 'next/server';
import {
  verifyAdminPasswordInDB,
  saveAdminPasswordInDB,
  getAdminPasswordFromDB,
} from '@/lib/supabaseService';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action, password, currentPassword, newPassword } = body;

    // Action 1: Verify Password (Login)
    if (action === 'verify' || !action) {
      const targetPassword = password || currentPassword;
      if (!targetPassword) {
        return NextResponse.json(
          { success: false, error: 'Password is required' },
          { status: 400 }
        );
      }

      const isValid = await verifyAdminPasswordInDB(targetPassword);
      if (isValid) {
        return NextResponse.json({
          success: true,
          message: 'Authentication successful',
        });
      } else {
        return NextResponse.json(
          {
            success: false,
            error: 'Incorrect admin password. Please verify and try again.',
          },
          { status: 401 }
        );
      }
    }

    // Action 2: Change Admin Password (Database Connected)
    if (action === 'change_password') {
      if (!currentPassword) {
        return NextResponse.json(
          { success: false, error: 'Current password is required.' },
          { status: 400 }
        );
      }

      const isCurrentValid = await verifyAdminPasswordInDB(currentPassword);
      if (!isCurrentValid) {
        return NextResponse.json(
          { success: false, error: 'Current password is incorrect.' },
          { status: 401 }
        );
      }

      if (!newPassword || newPassword.trim().length < 6) {
        return NextResponse.json(
          {
            success: false,
            error: 'New password must be at least 6 characters long.',
          },
          { status: 400 }
        );
      }

      const updateResult = await saveAdminPasswordInDB(newPassword.trim());
      if (updateResult.success) {
        return NextResponse.json({
          success: true,
          message: 'Admin password updated in database successfully!',
        });
      } else {
        return NextResponse.json(
          {
            success: false,
            error: updateResult.error || 'Failed to update admin password in database.',
          },
          { status: 500 }
        );
      }
    }

    return NextResponse.json(
      { success: false, error: 'Invalid action specified' },
      { status: 400 }
    );
  } catch (error: any) {
    console.error('Admin auth route error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error during authentication.' },
      { status: 500 }
    );
  }
}
