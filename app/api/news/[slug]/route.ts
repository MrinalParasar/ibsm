import { NextRequest, NextResponse } from 'next/server';
import { getNewsBySlug } from '@/models/News';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    let news = await getNewsBySlug(slug);

    if (!news) {
      // Fallback to hardcoded news if not found in DB
      const { hardcodedNews } = await import('@/lib/data/hardcoded-news');
      const found = hardcodedNews.find(item => item.slug === slug);
      if (found) {
        // Cast to News type (convert string dates to Date objects if needed, though frontend handles strings usually)
        // The News interface expects Date objects for dates
        news = {
          ...found,
          publishDate: new Date(found.publishDate),
          // Add other required fields if missing from hardcoded
          createdAt: new Date(),
          updatedAt: new Date(),
          status: 'published'
        } as any;
      }
    }

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

