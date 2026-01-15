import { NextRequest, NextResponse } from 'next/server';
import { authenticateAdmin } from '@/middleware/auth';
import { getNewsPaginated, createNews, getAllCategories, getAllTags } from '@/models/News';

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
    const category = searchParams.get('category') || undefined;
    const type = searchParams.get('type');

    if (type === 'categories') {
      const categories = await getAllCategories();
      return NextResponse.json({ categories }, { status: 200 });
    }

    if (type === 'tags') {
      const tags = await getAllTags();
      return NextResponse.json({ tags }, { status: 200 });
    }

    const result = await getNewsPaginated(page, limit, category, true);
    return NextResponse.json(result, { status: 200 });
  } catch (error: any) {
    console.error('Get news error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch news' },
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
    const {
      title,
      slug,
      category,
      excerpt,
      content,
      featuredImage,
      featuredImageAlt,
      postType,
      videoUrl,
      audioEmbed,
      galleryImages,
      sliderImages,
      quoteText,
      author,
      authorImage,
      publishDate,
      commentsCount,
      tags,
      isPopularFeed,
      isFeatured,
      isService, // Added field
    } = body;

    // Validate required fields
    if (!title || !slug || !category || !excerpt || !content || !postType || !author) {
      return NextResponse.json(
        { error: 'Title, slug, category, excerpt, content, post type, and author are required' },
        { status: 400 }
      );
    }

    // Generate slug from title if not provided
    const finalSlug = slug || title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    const news = await createNews({
      title,
      slug: finalSlug,
      category,
      excerpt,
      content,
      featuredImage: featuredImage || '',
      featuredImageAlt: featuredImageAlt || '',
      postType,
      videoUrl,
      audioEmbed,
      galleryImages: galleryImages || [],
      sliderImages: sliderImages || [],
      quoteText,
      author,
      authorImage,
      publishDate: publishDate ? new Date(publishDate) : new Date(),
      commentsCount: commentsCount || 0,
      tags: tags || [],

      isPopularFeed: isPopularFeed || false,
      isFeatured: isFeatured || false,
      status: body.status || 'published', // Default to published for backward compatibility if needed, or draft
    });

    return NextResponse.json(
      { message: 'News created successfully', news },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Create news error:', error);

    if (error.message === 'News with this slug already exists') {
      return NextResponse.json(
        { error: error.message },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to create news' },
      { status: 500 }
    );
  }
}

