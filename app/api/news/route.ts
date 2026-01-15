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

    if (type === 'featured') {
      const limitCount = parseInt(searchParams.get('limit') || '3', 10);
      const { getFeaturedNews } = await import('@/models/News'); // Import dynamically to avoid circular issues if any
      const featuredNews = await getFeaturedNews(limitCount);

      // Merge with hardcoded featured news
      const { hardcodedNews } = await import('@/lib/data/hardcoded-news');
      const hardcodedFeatured = hardcodedNews
        .filter(item => item.isFeatured)
        .map(item => ({
          ...item,
          publishDate: new Date(item.publishDate),
          createdAt: new Date(),
          updatedAt: new Date(),
          status: 'published'
        })) as any[];

      // Filter out hardcoded if slug exists in DB result
      const dbSlugs = new Set(featuredNews.map(n => n.slug));
      const uniqueHardcoded = hardcodedFeatured.filter(h => !dbSlugs.has(h.slug));

      // Combine: Hardcoded first (as per existing pattern), then DB items
      // Or maybe DB items first? Usually "Featured" means "I just featured this". 
      // But Hardcoded are "Permanent Featured". Let's stick to uniqueHardcoded + featuredNews.
      // But verify limit.
      const combined = [...uniqueHardcoded, ...featuredNews].slice(0, limitCount);

      return NextResponse.json({ news: combined }, { status: 200 });
    }

    if (type === 'services') {
      const limitCount = parseInt(searchParams.get('limit') || '3', 10);
      const { getServiceFeatures } = await import('@/models/News');
      const serviceNews = await getServiceFeatures(limitCount);

      // We can also merge with hardcoded services if we want, but likely the user wants to fetch from DB mainly.
      // For now, return what's in DB. The UI will fallback to hardcoded if empty (handled in page.tsx).
      return NextResponse.json({ news: serviceNews }, { status: 200 });
    }

    let result = await getNewsPaginated(page, limit, category);

    // Merge hardcoded news if DB result is empty (or just checking if we need to fill gaps)
    // For this context, we'll PREPEND hardcoded news to ensure they show up first
    if (page === 1 && !category) {
      const { hardcodedNews } = await import('@/lib/data/hardcoded-news');
      const hardcodedItems = hardcodedNews.map(item => ({
        ...item,
        publishDate: new Date(item.publishDate),
        createdAt: new Date(),
        updatedAt: new Date(),
        status: 'published'
      })) as any[];

      // Filter out duplicates if needed (by slug)
      const existingSlugs = new Set(result.news.map(n => n.slug));
      const uniqueHardcoded = hardcodedItems.filter(h => !existingSlugs.has(h.slug));

      result.news = [...uniqueHardcoded, ...result.news];
      result.total += uniqueHardcoded.length;
    }

    return NextResponse.json(result, { status: 200 });
  } catch (error: any) {
    console.error('Get news error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch news' },
      { status: 500 }
    );
  }
}

