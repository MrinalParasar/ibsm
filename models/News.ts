import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export type PostType = 'regular' | 'quote' | 'video' | 'audio' | 'gallery' | 'slider';

export interface NewsImage {
  url: string;
  alt: string;
}

export interface News {
  _id: string;
  title: string;
  slug: string;
  category: string;
  excerpt: string;
  content: string;
  featuredImage: string;
  featuredImageAlt?: string;
  postType: PostType;
  videoUrl?: string;
  audioEmbed?: string;
  galleryImages?: NewsImage[];
  sliderImages?: NewsImage[];
  quoteText?: string;
  author: string;
  authorImage?: string;
  publishDate: Date;
  commentsCount: number;
  tags: string[];
  isPopularFeed: boolean;
  isFeatured?: boolean;
  isService?: boolean;
  isCaseStudy?: boolean; // New field for Case Studies section
  status: 'published' | 'draft';
  createdAt: Date;
  updatedAt: Date;
}

export interface PaginatedNewsResult {
  news: News[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export async function getAllNews(): Promise<News[]> {
  const client = await clientPromise;
  const db = client.db();
  const news = await db.collection('news').find({}).sort({ publishDate: -1 }).toArray();
  return news.map(item => ({
    ...item,
    _id: item._id.toString(),
    publishDate: item.publishDate,
    createdAt: item.createdAt,
    updatedAt: item.updatedAt,
  })) as News[];
}

export async function getNewsPaginated(
  page: number = 1,
  limit: number = 9,
  category?: string,
  includeDrafts: boolean = false // New param, default false (public behavior)
): Promise<PaginatedNewsResult> {
  const client = await clientPromise;
  const db = client.db();

  const skip = (page - 1) * limit;
  // If includeDrafts is true (Admin), we don't filter by status (show everything).
  // If false (Public), we show 'published' OR items with NO status (backward compatibility).
  const statusQuery = includeDrafts
    ? {}
    : { $or: [{ status: 'published' }, { status: { $exists: false } }] };

  const query = category
    ? { ...statusQuery, category }
    : statusQuery;

  const total = await db.collection('news').countDocuments(query);
  const totalPages = Math.ceil(total / limit);

  const news = await db.collection('news')
    .find(query)
    .sort({ publishDate: -1 })
    .skip(skip)
    .limit(limit)
    .toArray();

  return {
    news: news.map(item => ({
      ...item,
      _id: item._id.toString(),
      publishDate: item.publishDate,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt,
    })) as News[],
    total,
    page,
    limit,
    totalPages,
  };
}

export async function getNewsBySlug(slug: string): Promise<News | null> {
  const client = await clientPromise;
  const db = client.db();
  const news = await db.collection('news').findOne({ slug });
  if (!news) return null;
  return {
    ...news,
    _id: news._id.toString(),
    publishDate: news.publishDate,
    createdAt: news.createdAt,
    updatedAt: news.updatedAt,
  } as News;
}

export async function getNewsById(id: string): Promise<News | null> {
  const client = await clientPromise;
  const db = client.db();
  const news = await db.collection('news').findOne({ _id: new ObjectId(id) });
  if (!news) return null;
  return {
    ...news,
    _id: news._id.toString(),
    publishDate: news.publishDate,
    createdAt: news.createdAt,
    updatedAt: news.updatedAt,
  } as News;
}

export async function getPopularFeeds(limit: number = 3): Promise<News[]> {
  const client = await clientPromise;
  const db = client.db();
  const news = await db.collection('news')
    .find({ isPopularFeed: true })
    .sort({ publishDate: -1 })
    .limit(limit)
    .toArray();
  return news.map(item => ({
    ...item,
    _id: item._id.toString(),
    publishDate: item.publishDate,
    createdAt: item.createdAt,
    updatedAt: item.updatedAt,
  })) as News[];
}

export async function getFeaturedNews(limit: number = 3): Promise<News[]> {
  const client = await clientPromise;
  const db = client.db();
  const news = await db.collection('news')
    .find({ isFeatured: true })
    .sort({ publishDate: -1 })
    .limit(limit)
    .toArray();
  return news.map(item => ({
    ...item,
    _id: item._id.toString(),
    publishDate: item.publishDate,
    createdAt: item.createdAt,
    updatedAt: item.updatedAt,
  })) as News[];
}

export async function getServiceFeatures(limit: number = 3): Promise<News[]> {
  const client = await clientPromise;
  const db = client.db();
  const news = await db.collection('news')
    .find({ isService: true })
    .sort({ publishDate: -1 })
    .limit(limit)
    .toArray();
  return news.map(item => ({
    ...item,
    _id: item._id.toString(),
    publishDate: item.publishDate,
    createdAt: item.createdAt,
    updatedAt: item.updatedAt,
  })) as News[];
}

export async function getCaseStudies(limit: number = 3): Promise<News[]> {
  const client = await clientPromise;
  const db = client.db();
  const news = await db.collection('news')
    .find({ isCaseStudy: true })
    .sort({ publishDate: -1 })
    .limit(limit)
    .toArray();
  return news.map(item => ({
    ...item,
    _id: item._id.toString(),
    publishDate: item.publishDate,
    createdAt: item.createdAt,
    updatedAt: item.updatedAt,
  })) as News[];
}

export async function createNews(newsData: Omit<News, '_id' | 'createdAt' | 'updatedAt'>): Promise<News> {
  const client = await clientPromise;
  const db = client.db();

  // Check if slug already exists
  const existingNews = await db.collection('news').findOne({ slug: newsData.slug });
  if (existingNews) {
    throw new Error('News with this slug already exists');
  }

  const newsToInsert = {
    ...newsData,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const result = await db.collection('news').insertOne(newsToInsert);
  return {
    ...newsToInsert,
    _id: result.insertedId.toString(),
  } as News;
}

export async function updateNews(id: string, newsData: Partial<Omit<News, '_id' | 'createdAt'>>): Promise<News | null> {
  const client = await clientPromise;
  const db = client.db();

  // If slug is being updated, check if it's already taken by another news
  if (newsData.slug) {
    const existingNews = await db.collection('news').findOne({
      slug: newsData.slug,
      _id: { $ne: new ObjectId(id) }
    });
    if (existingNews) {
      throw new Error('News with this slug already exists');
    }
  }

  const updateData = {
    ...newsData,
    updatedAt: new Date(),
  };

  const result = await db.collection('news').findOneAndUpdate(
    { _id: new ObjectId(id) },
    { $set: updateData },
    { returnDocument: 'after' }
  );

  if (!result) return null;
  return {
    ...result,
    _id: result._id.toString(),
    publishDate: result.publishDate,
    createdAt: result.createdAt,
    updatedAt: result.updatedAt,
  } as News;
}

export async function deleteNews(id: string): Promise<boolean> {
  const client = await clientPromise;
  const db = client.db();

  const result = await db.collection('news').deleteOne({ _id: new ObjectId(id) });
  return result.deletedCount === 1;
}

export async function getAllCategories(): Promise<{ name: string; count: number }[]> {
  const client = await clientPromise;
  const db = client.db();

  const categories = await db.collection('news').aggregate([
    { $group: { _id: '$category', count: { $sum: 1 } } },
    { $sort: { count: -1 } }
  ]).toArray();

  return categories.map(cat => ({
    name: cat._id,
    count: cat.count,
  }));
}

export async function getAllTags(): Promise<string[]> {
  const client = await clientPromise;
  const db = client.db();

  const news = await db.collection('news').find({}).toArray();
  const allTags = new Set<string>();

  news.forEach(item => {
    if (item.tags && Array.isArray(item.tags)) {
      item.tags.forEach(tag => allTags.add(tag));
    }
  });

  return Array.from(allTags).sort();
}

