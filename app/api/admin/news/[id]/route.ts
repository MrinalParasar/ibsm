import { NextRequest, NextResponse } from 'next/server';
import { authenticateAdmin } from '@/middleware/auth';
import { getNewsById, updateNews, deleteNews } from '@/models/News';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const payload = await authenticateAdmin(request);

    if (!payload) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id } = await params;
    const news = await getNewsById(id);
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

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const payload = await authenticateAdmin(request);

    if (!payload) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id } = await params;
    const body = await request.json();
    const updateData: any = {};

    if (body.title !== undefined) updateData.title = body.title;
    if (body.slug !== undefined) updateData.slug = body.slug;
    if (body.category !== undefined) updateData.category = body.category;
    if (body.excerpt !== undefined) updateData.excerpt = body.excerpt;
    if (body.content !== undefined) updateData.content = body.content;
    if (body.featuredImage !== undefined) updateData.featuredImage = body.featuredImage;
    if (body.featuredImageAlt !== undefined) updateData.featuredImageAlt = body.featuredImageAlt;
    if (body.postType !== undefined) updateData.postType = body.postType;
    if (body.videoUrl !== undefined) updateData.videoUrl = body.videoUrl;
    if (body.audioEmbed !== undefined) updateData.audioEmbed = body.audioEmbed;
    if (body.galleryImages !== undefined) updateData.galleryImages = body.galleryImages;
    if (body.sliderImages !== undefined) updateData.sliderImages = body.sliderImages;
    if (body.quoteText !== undefined) updateData.quoteText = body.quoteText;
    if (body.author !== undefined) updateData.author = body.author;
    if (body.authorImage !== undefined) updateData.authorImage = body.authorImage;
    if (body.publishDate !== undefined) updateData.publishDate = new Date(body.publishDate);
    if (body.commentsCount !== undefined) updateData.commentsCount = body.commentsCount;
    if (body.tags !== undefined) updateData.tags = body.tags;
    if (body.isPopularFeed !== undefined) updateData.isPopularFeed = body.isPopularFeed;
    if (body.isFeatured !== undefined) updateData.isFeatured = body.isFeatured;
    if (body.isService !== undefined) updateData.isService = body.isService; // Added field
    if (body.status !== undefined) updateData.status = body.status;

    const news = await updateNews(id, updateData);
    if (!news) {
      return NextResponse.json(
        { error: 'News not found' },
        { status: 404 }
      );
    }

    if (news === null && updateData.slug) {
      return NextResponse.json(
        { error: 'News with this slug already exists' },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { message: 'News updated successfully', news },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Update news error:', error);

    if (error.message === 'News with this slug already exists') {
      return NextResponse.json(
        { error: error.message },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to update news' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const payload = await authenticateAdmin(request);

    if (!payload) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id } = await params;
    const deleted = await deleteNews(id);
    if (!deleted) {
      return NextResponse.json(
        { error: 'News not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: 'News deleted successfully' },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Delete news error:', error);
    return NextResponse.json(
      { error: 'Failed to delete news' },
      { status: 500 }
    );
  }
}

