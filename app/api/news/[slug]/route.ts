import { NextRequest, NextResponse } from 'next/server';
import { getNewsBySlug } from '@/models/News';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const news = await getNewsBySlug(slug);
    if (!news) {
      return NextResponse.json(
        { error: 'News not found' },
        { status: 404 }
      );
    }
    return NextResponse.json({ news }, { status: 200 });
  } catch (error: any) {
    console.error('Get news error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch news' },
      { status: 500 }
    );
  }
}

