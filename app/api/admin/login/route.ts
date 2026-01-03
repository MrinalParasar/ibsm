import { NextRequest, NextResponse } from 'next/server';
import { findAdminByEmail, verifyAdminPassword } from '@/models/Admin';
import { generateToken } from '@/lib/jwt';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Find admin user
    const adminUser = await findAdminByEmail(email);
    if (!adminUser) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Verify password
    const isPasswordValid = await verifyAdminPassword(adminUser, password);
    if (!isPasswordValid) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Generate JWT token
    const token = generateToken({
      userId: adminUser._id!.toString(),
      email: adminUser.email,
    });

    // Return success response with token
    return NextResponse.json(
      {
        message: 'Login successful',
        token,
        user: {
          id: adminUser._id!.toString(),
          email: adminUser.email,
          name: adminUser.name,
        },
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Failed to login' },
      { status: 500 }
    );
  }
}

