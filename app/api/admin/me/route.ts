import { NextRequest, NextResponse } from 'next/server';
import { authenticateAdmin } from '@/middleware/auth';
import { findAdminByEmail } from '@/models/Admin';

export async function GET(request: NextRequest) {
  try {
    const payload = await authenticateAdmin(request);
    
    if (!payload) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const adminUser = await findAdminByEmail(payload.email);
    if (!adminUser) {
      return NextResponse.json(
        { error: 'Admin user not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        user: {
          id: adminUser._id!.toString(),
          email: adminUser.email,
          name: adminUser.name,
        },
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Get user error:', error);
    return NextResponse.json(
      { error: 'Failed to get user information' },
      { status: 500 }
    );
  }
}

