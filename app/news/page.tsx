"use client";

import { useEffect, useState } from "react";
import Breadcrumb from "@/components/Breadcrumb";
import NextLayout from "@/layouts/NextLayout";
import Link from "next/link";

interface News {
  _id: string;
  title: string;
  slug: string;
  category: string;
  excerpt: string;
  content: string;
  featuredImage: string;
  postType: 'regular' | 'quote' | 'video' | 'audio' | 'gallery' | 'slider';
  videoUrl?: string;
  audioEmbed?: string;
  galleryImages?: string[];
  sliderImages?: string[];
  quoteText?: string;
  author: string;
  authorImage?: string;
  publishDate: string;
  commentsCount: number;
  tags: string[];
  isPopularFeed: boolean;
}

interface Category {
  name: string;
  count: number;
}

const NewsPage = () => {
  const [news, setNews] = useState<News[]>([]);
  const [popularFeeds, setPopularFeeds] = useState<News[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchNews(currentPage);
    fetchPopularFeeds();
    fetchCategories();
    fetchTags();
  }, [currentPage]);

  const fetchNews = async (page: number = 1) => {
    try {
      const response = await fetch(`/api/news?page=${page}&limit=9`);
      if (response.ok) {
        const data = await response.json();
        setNews(data.news || []);
        setTotalPages(data.totalPages || 1);
      }
    } catch (error) {
      console.error("Failed to fetch news:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchPopularFeeds = async () => {
    try {
      const response = await fetch("/api/news?type=popular&limit=3");
      if (response.ok) {
        const data = await response.json();
        setPopularFeeds(data.news || []);
      }
    } catch (error) {
      console.error("Failed to fetch popular feeds:", error);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch("/api/news?type=categories");
      if (response.ok) {
        const data = await response.json();
        setCategories(data.categories || []);
      }
    } catch (error) {
      console.error("Failed to fetch categories:", error);
    }
  };

  const fetchTags = async () => {
    try {
      const response = await fetch("/api/news?type=tags");
      if (response.ok) {
        const data = await response.json();
        setTags(data.tags || []);
      }
    } catch (error) {
      console.error("Failed to fetch tags:", error);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.toLocaleDateString('en-US', { month: 'long' });
    const year = date.getFullYear();
    const suffix = day === 1 || day === 21 || day === 31 ? 'st' :
                   day === 2 || day === 22 ? 'nd' :
                   day === 3 || day === 23 ? 'rd' : 'th';
    return `${day}${suffix} ${month} ${year}`;
  };

  const renderNewsPost = (newsItem: News, index: number) => {
    const formattedDate = formatDate(newsItem.publishDate);

    if (newsItem.postType === 'quote') {
      return (
        <div key={newsItem._id} className="single-blog-post quote-post format-quote">
          <div className="post-content text-white bg-cover" style={{ backgroundImage: `url(${newsItem.featuredImage})` }}>
            <div className="quote-content">
              <div className="icon">
                <i className="fas fa-quote-left" />
              </div>
              <div className="quote-text">
                <h2>{newsItem.quoteText || newsItem.title}</h2>
                <div className="post-meta">
                  <span>
                    <i className="fal fa-comments" />
                    {newsItem.commentsCount} Comments
                  </span>
                  <span>
                    <i className="fal fa-calendar-alt" />
                    {formattedDate}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    if (newsItem.postType === 'video') {
      return (
        <div key={newsItem._id} className="single-blog-post">
          <div
            className="post-featured-thumb bg-cover"
            style={{ backgroundImage: `url(${newsItem.featuredImage})` }}
          >
            <div className="video-play-btn">
              <a
                href={newsItem.videoUrl || '#'}
                className="video-button ripple video-popup"
              >
                <i className="fas fa-play" />
              </a>
            </div>
          </div>
          <div className="post-content">
            <div className="post-meta">
              <span>
                <i className="fal fa-comments" />
                {newsItem.commentsCount} Comments
              </span>
              <span>
                <i className="fal fa-calendar-alt" />
                {formattedDate}
              </span>
            </div>
            <h2>
              <Link href={`/news-details?slug=${newsItem.slug}`}>
                {newsItem.title}
              </Link>
            </h2>
            <p>{newsItem.excerpt}</p>
            <Link
              href={`/news-details?slug=${newsItem.slug}`}
              className="theme-btn mt-4 line-height"
            >
              <span>
                READ MORE <i className="fas fa-chevron-right" />
              </span>
            </Link>
          </div>
        </div>
      );
    }

    if (newsItem.postType === 'audio') {
      return (
        <div key={newsItem._id} className="single-blog-post">
          <div className="postbox-audio">
            {newsItem.audioEmbed ? (
              <div dangerouslySetInnerHTML={{ __html: newsItem.audioEmbed }} />
            ) : (
              <div style={{ padding: "20px", background: "#f5f5f5", textAlign: "center" }}>
                Audio content
              </div>
            )}
          </div>
          <div className="post-content">
            <div className="post-meta">
              <span>
                <i className="fal fa-comments" />
                {newsItem.commentsCount} Comments
              </span>
              <span>
                <i className="fal fa-calendar-alt" />
                {formattedDate}
              </span>
            </div>
            <h2>
              <Link href={`/news-details?slug=${newsItem.slug}`}>
                {newsItem.title}
              </Link>
            </h2>
            <p>{newsItem.excerpt}</p>
            <Link
              href={`/news-details?slug=${newsItem.slug}`}
              className="theme-btn mt-4 line-height"
            >
              <span>
                READ MORE <i className="fas fa-chevron-right" />
              </span>
            </Link>
          </div>
        </div>
      );
    }

    if (newsItem.postType === 'slider' && newsItem.sliderImages && newsItem.sliderImages.length > 0) {
      return (
        <div key={newsItem._id} className="single-blog-post">
          <div className="swiper blog-post-slider">
            <div className="swiper-wrapper">
              {newsItem.sliderImages.map((img, idx) => (
                <div key={idx} className="swiper-slide">
                  <div
                    className="post-featured-thumb bg-cover"
                    style={{ backgroundImage: `url(${img})` }}
                  />
                </div>
              ))}
            </div>
            <div className="array-button">
              <button className="array-prev">
                <i className="far fa-chevron-left" />
              </button>
              <button className="array-next">
                <i className="far fa-chevron-right" />
              </button>
            </div>
          </div>
          <div className="post-content">
            <div className="post-meta">
              <span>
                <i className="fal fa-comments" />
                {newsItem.commentsCount} Comments
              </span>
              <span>
                <i className="fal fa-calendar-alt" />
                {formattedDate}
              </span>
            </div>
            <h2>
              <Link href={`/news-details?slug=${newsItem.slug}`}>
                {newsItem.title}
              </Link>
            </h2>
            <p>{newsItem.excerpt}</p>
            <Link
              href={`/news-details?slug=${newsItem.slug}`}
              className="theme-btn mt-4 line-height"
            >
              <span>
                READ MORE <i className="fas fa-chevron-right" />
              </span>
            </Link>
          </div>
        </div>
      );
    }

    // Regular post type (default)
    return (
      <div key={newsItem._id} className="single-blog-post">
        <div
          className="post-featured-thumb bg-cover"
          style={{ backgroundImage: `url(${newsItem.featuredImage})` }}
        />
        <div className="post-content">
          <div className="post-meta">
            <span>
              <i className="fal fa-comments" />
              {newsItem.commentsCount} Comments
            </span>
            <span>
              <i className="fal fa-calendar-alt" />
              {formattedDate}
            </span>
          </div>
          <h2>
            <Link href={`/news-details?slug=${newsItem.slug}`}>
              {newsItem.title}
            </Link>
          </h2>
          <p>{newsItem.excerpt}</p>
          <Link
            href={`/news-details?slug=${newsItem.slug}`}
            className="theme-btn mt-4 line-height"
          >
            <span>
              READ MORE <i className="fas fa-chevron-right" />
            </span>
          </Link>
        </div>
      </div>
    );
  };

  return (
    <NextLayout>
      <Breadcrumb pageName="Blog Standard" />
      <section className="blog-wrapper news-wrapper section-padding">
        <div className="container">
          <div className="news-area">
            <div className="row">
              <div className="col-12 col-lg-8">
                <div className="blog-posts">
                  {loading ? (
                    <div style={{ textAlign: "center", padding: "40px", color: "#696969" }}>
                      Loading news...
                    </div>
                  ) : news.length === 0 ? (
                    <div style={{ textAlign: "center", padding: "40px", color: "#696969" }}>
                      No news articles available at the moment.
                    </div>
                  ) : (
                    news.map((newsItem, index) => renderNewsPost(newsItem, index))
                  )}
                </div>
                {totalPages > 1 && (
                  <div className="page-nav-wrap mt-5 text-center">
                    <ul>
                      <li>
                        <button
                          className="page-numbers"
                          onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                          disabled={currentPage === 1}
                          style={{ background: "none", border: "none", color: currentPage === 1 ? "#999" : "inherit", cursor: currentPage === 1 ? "not-allowed" : "pointer" }}
                        >
                          <i className="fal fa-long-arrow-left" />
                        </button>
                      </li>
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                        if (page === 1 || page === totalPages || (page >= currentPage - 1 && page <= currentPage + 1)) {
                          return (
                            <li key={page}>
                              <button
                                className={`page-numbers ${currentPage === page ? 'current' : ''}`}
                                onClick={() => setCurrentPage(page)}
                                style={{
                                  background: currentPage === page ? "#FAC014" : "transparent",
                                  border: "none",
                                  color: currentPage === page ? "#000" : "inherit",
                                  cursor: "pointer",
                                  padding: "8px 12px",
                                }}
                              >
                                {page}
                              </button>
                            </li>
                          );
                        } else if (page === currentPage - 2 || page === currentPage + 2) {
                          return (
                            <li key={page}>
                              <span className="page-numbers">..</span>
                            </li>
                          );
                        }
                        return null;
                      })}
                      <li>
                        <button
                          className="page-numbers"
                          onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                          disabled={currentPage === totalPages}
                          style={{ background: "none", border: "none", color: currentPage === totalPages ? "#999" : "inherit", cursor: currentPage === totalPages ? "not-allowed" : "pointer" }}
                        >
                          <i className="fal fa-long-arrow-right" />
                        </button>
                      </li>
                    </ul>
                  </div>
                )}
              </div>
              <div className="col-12 col-lg-4">
                <div className="main-sidebar">
                  <div className="single-sidebar-widget">
                    <div className="wid-title">
                      <h3>Search</h3>
                    </div>
                    <div className="search_widget">
                      <form action="#">
                        <input type="text" placeholder="Keywords here...." />
                        <button type="submit">
                          <i className="fal fa-search" />
                        </button>
                      </form>
                    </div>
                  </div>
                  <div className="single-sidebar-widget">
                    <div className="wid-title">
                      <h3>Popular Feeds</h3>
                    </div>
                    <div className="popular-posts">
                      {popularFeeds.length === 0 ? (
                        <p style={{ color: "#696969", fontSize: "14px" }}>No popular feeds available</p>
                      ) : (
                        popularFeeds.map((feed) => (
                          <div key={feed._id} className="single-post-item">
                            <div
                              className="thumb bg-cover"
                              style={{ backgroundImage: `url(${feed.featuredImage})` }}
                            />
                            <div className="post-content">
                              <h5>
                                <Link href={`/news-details?slug=${feed.slug}`}>
                                  {feed.title}
                                </Link>
                              </h5>
                              <div className="post-date">
                                <i className="far fa-calendar-alt" />
                                {formatDate(feed.publishDate)}
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                  <div className="single-sidebar-widget">
                    <div className="wid-title">
                      <h3>Categories</h3>
                    </div>
                    <div className="widget_categories">
                      <ul>
                        {categories.length === 0 ? (
                          <li style={{ color: "#696969" }}>No categories available</li>
                        ) : (
                          categories.map((cat) => (
                            <li key={cat.name}>
                              <Link href={`/news?category=${cat.name}`}>
                                {cat.name} <span>{cat.count}</span>
                              </Link>
                            </li>
                          ))
                        )}
                      </ul>
                    </div>
                  </div>
                  <div className="single-sidebar-widget">
                    <div className="wid-title">
                      <h3>Never Miss News</h3>
                    </div>
                    <div className="social-link">
                      <a href="#">
                        <i className="fab fa-facebook-f" />
                      </a>
                      <a href="#">
                        <i className="fab fa-twitter" />
                      </a>
                      <a href="#">
                        <i className="fab fa-instagram" />
                      </a>
                      <a href="#">
                        <i className="fab fa-linkedin-in" />
                      </a>
                      <a href="#">
                        <i className="fab fa-youtube" />
                      </a>
                    </div>
                  </div>
                  <div className="single-sidebar-widget">
                    <div className="wid-title">
                      <h3>Popular Tags</h3>
                    </div>
                    <div className="tagcloud">
                      {tags.length === 0 ? (
                        <span style={{ color: "#696969" }}>No tags available</span>
                      ) : (
                        tags.slice(0, 6).map((tag) => (
                          <Link key={tag} href={`/news?tag=${tag}`}>
                            {tag}
                          </Link>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </NextLayout>
  );
};

export default NewsPage;
