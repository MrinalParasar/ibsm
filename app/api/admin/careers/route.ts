import { NextRequest, NextResponse } from 'next/server';
import { authenticateAdmin } from '@/middleware/auth';
import { getCareersPaginated, createCareer } from '@/models/Career';

export async function GET(request: NextRequest) {
  try {
    const payload = await authenticateAdmin(request);
    
    if (!payload) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

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

export async function POST(request: NextRequest) {
  try {
    const payload = await authenticateAdmin(request);
    
    if (!payload) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { title, location, type, description, requirements } = body;

    // Validate input
    if (!title || !location || !type || !description || !requirements) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    if (!Array.isArray(requirements)) {
      return NextResponse.json(
        { error: 'Requirements must be an array' },
        { status: 400 }
      );
    }

    const career = await createCareer({
      title,
      location,
      type,
      description,
      requirements,
    });

    return NextResponse.json(
      { message: 'Career created successfully', career },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Create career error:', error);
    return NextResponse.json(
      { error: 'Failed to create career' },
      { status: 500 }
    );
  }
}

