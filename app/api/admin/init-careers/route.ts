import { NextRequest, NextResponse } from 'next/server';
import { authenticateAdmin } from '@/middleware/auth';
import { initializeDefaultCareers } from '@/models/Career';

export async function POST(request: NextRequest) {
  try {
    const payload = await authenticateAdmin(request);
    
    if (!payload) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await initializeDefaultCareers();
    
    return NextResponse.json(
      { message: 'Default careers initialized successfully' },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Initialize careers error:', error);
    return NextResponse.json(
      { error: 'Failed to initialize careers' },
      { status: 500 }
    );
  }
}

