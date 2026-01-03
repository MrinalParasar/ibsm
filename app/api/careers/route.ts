import { NextRequest, NextResponse } from 'next/server';
import { getCareersPaginated } from '@/models/Career';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '9', 10);

    const result = await getCareersPaginated(page, limit);
    return NextResponse.json(result, { status: 200 });
  } catch (error: any) {
    console.error('Get careers error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch careers' },
      { status: 500 }
    );
  }
}

