"use client";

import { useEffect, useState, use } from "react";
import Breadcrumb from "@/components/Breadcrumb";
import NextLayout from "@/layouts/NextLayout";
import Link from "next/link";
import { notFound } from "next/navigation";

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

const BlogDetailsPage = ({ params }: { params: Promise<{ slug: string }> }) => {
    // Unwrap params using React.use()
    const { slug } = use(params);

    const [news, setNews] = useState<News | null>(null);
    const [popularFeeds, setPopularFeeds] = useState<News[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [tags, setTags] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        if (slug) {
            fetchNews(slug);
            fetchPopularFeeds();
            fetchCategories();
            fetchTags();
        }
    }, [slug]);

    const fetchNews = async (newsSlug: string) => {
        setLoading(true);
        setError(false);
        try {
            const response = await fetch(`/api/news/${newsSlug}`);
            if (response.ok) {
                const data = await response.json();
                setNews(data.news);
            } else {
                setError(true);
            }
        } catch (error) {
            console.error("Failed to fetch news:", error);
            setError(true);
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

    if (loading) {
        return (
            <NextLayout>
                <Breadcrumb pageName="Loading..." />
                <section className="blog-wrapper news-wrapper section-padding" style={{ paddingTop: "0px" }}>
                    <div className="container">
                        <div style={{ textAlign: "center", padding: "40px", color: "#696969" }}>
                            Loading...
                        </div>
                    </div>
                </section>
            </NextLayout>
        );
    }

    if (error || !news) {
        return (
            <NextLayout>
                <Breadcrumb pageName="Not Found" />
                <section className="blog-wrapper news-wrapper section-padding" style={{ paddingTop: "0px" }}>
                    <div className="container">
                        <div style={{ textAlign: "center", padding: "40px", color: "#696969" }}>
                            News article not found.
                        </div>
                    </div>
                </section>
            </NextLayout>
        );
    }

    const formattedDate = formatDate(news.publishDate);

    return (
        <NextLayout>
            <Breadcrumb pageName={news.title} />
            <section className="blog-wrapper news-wrapper section-padding" style={{ paddingTop: "0px" }}>
                <div className="container">
                    <div className="news-area">
                        <div className="row">
                            <div className="col-12 col-lg-8">
                                <div className="blog-post-details border-wrap mt-0">
                                    <div className="single-blog-post post-details mt-0">
                                        <div className="post-content pt-0">
                                            <h2 className="mt-0">{news.title}</h2>
                                            <div className="post-meta mt-3">
                                                <span>
                                                    <i className="fal fa-user" />
                                                    {news.author}
                                                </span>
                                                <span>
                                                    <i className="fal fa-comments" />
                                                    {news.commentsCount} Comments
                                                </span>
                                                <span>
                                                    <i className="fal fa-calendar-alt" />
                                                    {formattedDate}
                                                </span>
                                            </div>
                                            {news.featuredImage && (
                                                <img
                                                    src={news.featuredImage}
                                                    alt={news.title}
                                                    className="single-post-image"
                                                    style={{ width: "100%", marginTop: "20px", marginBottom: "20px" }}
                                                />
                                            )}
                                            <div dangerouslySetInnerHTML={{ __html: news.content.replace(/\n/g, '<br />') }} />
                                        </div>
                                    </div>
                                    <div className="row tag-share-wrap">
                                        <div className="col-lg-8 col-12">
                                            <h4>Related Tags</h4>
                                            <div className="tagcloud">
                                                {news.tags && news.tags.length > 0 ? (
                                                    news.tags.map((tag) => (
                                                        <Link key={tag} href={`/news?tag=${tag}`}>
                                                            {tag}
                                                        </Link>
                                                    ))
                                                ) : (
                                                    <span style={{ color: "#696969" }}>No tags</span>
                                                )}
                                            </div>
                                        </div>
                                        {/* Social Share kept as is */}
                                        <div className="col-lg-4 col-12 mt-3 mt-lg-0 text-lg-end">
                                            <h4>Social Share</h4>
                                            <div className="social-share">
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
                                            </div>
                                        </div>
                                    </div>
                                    {/* Comments section */}
                                    <div className="comments-section-wrap">
                                        <div className="comments-heading pt-5">
                                            <h3>{news.commentsCount} Comments</h3>
                                        </div>
                                    </div>
                                    <div className="comment-form-wrap mt-40">
                                        <h3>Post Comment</h3>
                                        <form action="#" className="comment-form">
                                            <div className="single-form-input">
                                                <textarea placeholder="Type your comments...." defaultValue={""} />
                                            </div>
                                            <div className="single-form-input">
                                                <input type="text" placeholder="Type your name...." />
                                            </div>
                                            <div className="single-form-input">
                                                <input type="email" placeholder="Type your email...." />
                                            </div>
                                            <div className="single-form-input">
                                                <input type="text" placeholder="Type your website...." />
                                            </div>
                                            <button className="theme-btn center" type="submit">
                                                <span>
                                                    <i className="fal fa-comments" />
                                                    Post Comment
                                                </span>
                                            </button>
                                        </form>
                                    </div>
                                </div>
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
                                                                <Link href={`/blog/${feed.slug}`}>
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
                                    {/* Remaining sidebar widgets */}
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

export default BlogDetailsPage;
