"use client";
import Link from "next/link";
import { useEffect, useState } from "react";

interface News {
    _id: string;
    title: string;
    slug: string;
    featuredImage: string;
    publishDate: string;
}

const BlogMegaMenu = () => {
    const [blogs, setBlogs] = useState<News[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBlogs = async () => {
            try {
                // Fetch latest 3 blogs
                const response = await fetch("/api/news?page=1&limit=3");
                if (response.ok) {
                    const data = await response.json();
                    setBlogs(data.news?.slice(0, 3) || []);
                }
            } catch (error) {
                console.error("Failed to fetch blogs for mega menu:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchBlogs();
    }, []);

    if (loading) {
        return (
            <div className="blog-mega-menu-loading" style={{ padding: "20px", color: "#666" }}>
                Loading...
            </div>
        );
    }

    if (blogs.length === 0) {
        return null;
    }

    return (
        <div className="blog-mega-menu-content">
            {blogs.map((blog) => (
                <div key={blog._id} className="blog-mega-item">
                    <Link href={`/news-details?slug=${blog.slug}`} className="blog-mega-link">
                        <div
                            className="blog-mega-thumb"
                            style={{ backgroundImage: `url(${blog.featuredImage})` }}
                        />
                        <div className="blog-mega-info">
                            <h6 className="blog-mega-title">{blog.title}</h6>
                            <span className="blog-mega-date">
                                {new Date(blog.publishDate).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}
                            </span>
                        </div>
                    </Link>
                </div>
            ))}
            <div className="blog-mega-footer">
                <Link href="/news" className="view-all-btn">
                    View All News <i className="fas fa-arrow-right" />
                </Link>
            </div>
        </div>
    );
};

export default BlogMegaMenu;
