import { NextRequest, NextResponse } from 'next/server';
import { createAdminUser } from '@/models/Admin';
import { generateToken } from '@/lib/jwt';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password, name, secretPass } = body;

    // Validate secret pass
    const ADMIN_REGISTER_SECRET = process.env.ADMIN_REGISTER_SECRET;
    if (!ADMIN_REGISTER_SECRET) {
      return NextResponse.json(
        { error: 'Admin registration is not configured' },
        { status: 500 }
      );
    }

    if (secretPass !== ADMIN_REGISTER_SECRET) {
      return NextResponse.json(
        { error: 'Invalid secret pass' },
        { status: 401 }
      );
    }

    // Validate input
    if (!email || !password || !name) {
      return NextResponse.json(
        { error: 'Email, password, and name are required' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Validate password strength
    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters long' },
        { status: 400 }
      );
    }

    // Create admin user
    const adminUser = await createAdminUser(email, password, name);

    // Generate JWT token
    const token = generateToken({
      userId: adminUser._id!.toString(),
      email: adminUser.email,
    });

    // Return success response with token
    return NextResponse.json(
      {
        message: 'Admin user created successfully',
        token,
        user: {
          id: adminUser._id!.toString(),
          email: adminUser.email,
          name: adminUser.name,
        },
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Registration error:', error);
    
    if (error.message === 'Admin user with this email already exists') {
      return NextResponse.json(
        { error: error.message },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to create admin user' },
      { status: 500 }
    );
  }
}

