import { NextRequest, NextResponse } from 'next/server';
import { authenticateAdmin } from '@/middleware/auth';
import { getAllFormSubmissions, getFormSubmissionStats } from '@/models/FormSubmission';

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
    const source = searchParams.get('source') as any;
    const type = searchParams.get('type');

    if (type === 'stats') {
      const stats = await getFormSubmissionStats();
      return NextResponse.json(stats, { status: 200 });
    }

    const submissions = await getAllFormSubmissions(source);
    return NextResponse.json({ submissions }, { status: 200 });
  } catch (error: any) {
    console.error('Get form submissions error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch form submissions' },
      { status: 500 }
    );
  }
}

