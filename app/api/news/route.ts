import { NextRequest, NextResponse } from 'next/server';
import { getNewsPaginated, getPopularFeeds, getAllCategories, getAllTags } from '@/models/News';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '9', 10);
    const category = searchParams.get('category') || undefined;
    const type = searchParams.get('type');

    if (type === 'popular') {
      const limitCount = parseInt(searchParams.get('limit') || '3', 10);
      const popularFeeds = await getPopularFeeds(limitCount);
      return NextResponse.json({ news: popularFeeds }, { status: 200 });
    }

    if (type === 'categories') {
      const categories = await getAllCategories();
      return NextResponse.json({ categories }, { status: 200 });
    }

    if (type === 'tags') {
      const tags = await getAllTags();
      return NextResponse.json({ tags }, { status: 200 });
    }

    const result = await getNewsPaginated(page, limit, category);
    return NextResponse.json(result, { status: 200 });
  } catch (error: any) {
    console.error('Get news error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch news' },
      { status: 500 }
    );
  }
}

