"use client";

import { useEffect, useState } from "react";
import Breadcrumb from "@/components/Breadcrumb";
import NextLayout from "@/layouts/NextLayout";
import Link from "next/link";
import Pagination from "@/components/Pagination";

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
  galleryImages?: { url: string; alt: string; }[];
  sliderImages?: { url: string; alt: string; }[];
  quoteText?: string;
  author: string;
  authorImage?: string;
  publishDate: string;
  commentsCount: number;
  tags: string[];
  isPopularFeed: boolean;
}



const NewsPage = () => {
  const [news, setNews] = useState<News[]>([]);

  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchNews(currentPage);

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





  const renderNewsPost = (newsItem: News, index: number) => {
    return (
      <div className="single-blog-post" style={{
        border: "1px solid #eee",
        borderRadius: "10px",
        marginBottom: "30px",
        height: "100%",
        background: "#fff",
        overflow: "hidden"
      }}>
        <div
          className="post-featured-thumb bg-cover"
          style={{
            backgroundImage: `url(${newsItem.featuredImage})`,
            height: "250px",
            width: "100%",
            borderRadius: "0",
            marginBottom: "0",
            position: "relative"
          }}
        >
          {newsItem.postType === 'video' && (
            <div className="video-play-btn" style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)" }}>
              <a href={newsItem.videoUrl || '#'} className="video-button ripple video-popup" style={{ width: "60px", height: "60px", lineHeight: "60px", fontSize: "16px" }}>
                <i className="fas fa-play" />
              </a>
            </div>
          )}
        </div>
        <div className="post-content" style={{ padding: "25px" }}>
          <h2 style={{ fontSize: "20px", fontWeight: "600", lineHeight: "1.4", margin: "0" }}>
            <Link href={`/blog/${newsItem.slug}`} className="news-title-link">
              {newsItem.title}
            </Link>
          </h2>
        </div>
      </div>
    );
  };

  return (
    <NextLayout>
      <Breadcrumb pageName="Blog Standard" />
      <section className="blog-wrapper news-wrapper section-padding" style={{ paddingTop: "0px" }}>
        <div className="container">
          <div className="news-area">
            <div className="row">
              <div className="col-12">
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
                    <div className="row gy-5">
                      {news.map((newsItem, index) => (
                        <div
                          className="col-xl-4 col-lg-4 col-md-6 wow fadeInUp"
                          data-wow-delay=".2s"
                          key={newsItem._id}
                        >
                          {renderNewsPost(newsItem, index)}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                />
              </div>

            </div>
          </div>
        </div>
      </section>
    </NextLayout>
  );
};

export default NewsPage;
