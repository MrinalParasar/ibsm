"use client";

import { useEffect, useState } from "react";
import AdminLayout from "@/components/AdminLayout";
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

export default function AdminNewsPage() {
  const [news, setNews] = useState<News[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [editingNews, setEditingNews] = useState<News | null>(null);
  const [imageUploading, setImageUploading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    category: "",
    excerpt: "",
    content: "",
    featuredImage: "",
    postType: "regular" as News['postType'],
    videoUrl: "",
    audioEmbed: "",
    galleryImages: "",
    sliderImages: "",
    quoteText: "",
    author: "",
    authorImage: "",
    publishDate: new Date().toISOString().split('T')[0],
    commentsCount: 0,
    tags: "",
    isPopularFeed: false,
  });

  useEffect(() => {
    fetchNews(currentPage);
  }, [currentPage]);

  const fetchNews = async (page: number = 1) => {
    setLoading(true);
    const token = localStorage.getItem("adminToken");
    try {
      const response = await fetch(`/api/admin/news?page=${page}&limit=9`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setNews(data.news || []);
        setTotalPages(data.totalPages || 1);
        setTotal(data.total || 0);
      }
    } catch (error) {
      console.error("Failed to fetch news:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (newsItem?: News) => {
    if (newsItem) {
      setEditingNews(newsItem);
      setFormData({
        title: newsItem.title,
        slug: newsItem.slug,
        category: newsItem.category,
        excerpt: newsItem.excerpt,
        content: newsItem.content,
        featuredImage: newsItem.featuredImage,
        postType: newsItem.postType,
        videoUrl: newsItem.videoUrl || "",
        audioEmbed: newsItem.audioEmbed || "",
        galleryImages: newsItem.galleryImages?.join("\n") || "",
        sliderImages: newsItem.sliderImages?.join("\n") || "",
        quoteText: newsItem.quoteText || "",
        author: newsItem.author,
        authorImage: newsItem.authorImage || "",
        publishDate: newsItem.publishDate.split('T')[0],
        commentsCount: newsItem.commentsCount,
        tags: newsItem.tags.join(", "),
        isPopularFeed: newsItem.isPopularFeed,
      });
    } else {
      setEditingNews(null);
      setFormData({
        title: "",
        slug: "",
        category: "",
        excerpt: "",
        content: "",
        featuredImage: "",
        postType: "regular",
        videoUrl: "",
        audioEmbed: "",
        galleryImages: "",
        sliderImages: "",
        quoteText: "",
        author: "",
        authorImage: "",
        publishDate: new Date().toISOString().split('T')[0],
        commentsCount: 0,
        tags: "",
        isPopularFeed: false,
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingNews(null);
  };

  const generateSlug = (title: string) => {
    return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  };

  const handleTitleChange = (title: string) => {
    setFormData({ ...formData, title });
    if (!editingNews && !formData.slug) {
      setFormData({ ...formData, title, slug: generateSlug(title) });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem("adminToken");
    const tags = formData.tags.split(",").map(t => t.trim()).filter(t => t.length > 0);
    const galleryImages = formData.galleryImages.split("\n").map(img => img.trim()).filter(img => img.length > 0);
    const sliderImages = formData.sliderImages.split("\n").map(img => img.trim()).filter(img => img.length > 0);

    try {
      const url = editingNews
        ? `/api/admin/news/${editingNews._id}`
        : "/api/admin/news";
      const method = editingNews ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: formData.title,
          slug: formData.slug || generateSlug(formData.title),
          category: formData.category,
          excerpt: formData.excerpt,
          content: formData.content,
          featuredImage: formData.featuredImage,
          postType: formData.postType,
          videoUrl: formData.postType === 'video' ? formData.videoUrl : undefined,
          audioEmbed: formData.postType === 'audio' ? formData.audioEmbed : undefined,
          galleryImages: formData.postType === 'gallery' ? galleryImages : undefined,
          sliderImages: formData.postType === 'slider' ? sliderImages : undefined,
          quoteText: formData.postType === 'quote' ? formData.quoteText : undefined,
          author: formData.author,
          authorImage: formData.authorImage,
          publishDate: formData.publishDate,
          commentsCount: formData.commentsCount,
          tags,
          isPopularFeed: formData.isPopularFeed,
        }),
      });

      if (response.ok) {
        fetchNews(currentPage);
        handleCloseModal();
      } else {
        const data = await response.json();
        alert(data.error || "Failed to save news");
      }
    } catch (error) {
      console.error("Failed to save news:", error);
      alert("Failed to save news");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this news?")) {
      return;
    }

    const token = localStorage.getItem("adminToken");
    try {
      const response = await fetch(`/api/admin/news/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        if (news.length === 1 && currentPage > 1) {
          setCurrentPage(currentPage - 1);
        } else {
          fetchNews(currentPage);
        }
      } else {
        const data = await response.json();
        alert(data.error || "Failed to delete news");
      }
    } catch (error) {
      console.error("Failed to delete news:", error);
      alert("Failed to delete news");
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  const handleImageUpload = async (file: File, folder: string = 'news/images') => {
    setImageUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', folder);
      formData.append('preset', process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || '');

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        return data.url;
      } else {
        alert(data.error || 'Failed to upload image');
        return null;
      }
    } catch (error) {
      console.error("Upload error:", error);
      alert('An error occurred while uploading image');
      return null;
    } finally {
      setImageUploading(false);
    }
  };

  const handleGalleryImagesUpload = async (files: FileList) => {
    const uploadedUrls: string[] = [];
    setImageUploading(true);
    
    try {
      for (let i = 0; i < files.length; i++) {
        const url = await handleImageUpload(files[i], 'news/gallery');
        if (url) {
          uploadedUrls.push(url);
        }
      }
      return uploadedUrls;
    } finally {
      setImageUploading(false);
    }
  };

  return (
    <AdminLayout>
      <div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "30px",
          }}
        >
          <div>
            <h1
              style={{
                color: "#FAC014",
                fontSize: "32px",
                fontWeight: "700",
                marginBottom: "8px",
              }}
            >
              Manage News
            </h1>
            <p style={{ color: "#696969", fontSize: "14px" }}>
              Add, edit, or delete news articles
            </p>
          </div>
          <button
            onClick={() => handleOpenModal()}
            style={{
              padding: "12px 24px",
              background: "linear-gradient(90deg, #FAD02B 0%, #FAC014 100%)",
              color: "#000",
              border: "none",
              borderRadius: "8px",
              fontSize: "14px",
              fontWeight: "700",
              cursor: "pointer",
              transition: "all 0.3s",
              boxShadow: "0 4px 15px rgba(250, 192, 20, 0.3)",
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.boxShadow = "0 6px 20px rgba(250, 192, 20, 0.4)";
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 4px 15px rgba(250, 192, 20, 0.3)";
            }}
          >
            <i className="fas fa-plus" style={{ marginRight: "8px" }} />
            Add New News
          </button>
        </div>

        {loading ? (
          <div style={{ textAlign: "center", padding: "40px", color: "#FAC014" }}>
            Loading...
          </div>
        ) : news.length === 0 ? (
          <div
            style={{
              background: "#121416",
              borderRadius: "14px",
              padding: "40px",
              textAlign: "center",
              border: "1px solid rgba(250, 192, 20, 0.1)",
            }}
          >
            <p style={{ color: "#696969", fontSize: "16px" }}>
              No news found. Click "Add New News" to create one.
            </p>
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))",
              gap: "20px",
            }}
          >
            {news.map((newsItem) => (
              <div
                key={newsItem._id}
                style={{
                  background: "#121416",
                  borderRadius: "14px",
                  padding: "25px",
                  border: "1px solid rgba(250, 192, 20, 0.1)",
                  transition: "all 0.3s",
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.borderColor = "#FAC014";
                  e.currentTarget.style.transform = "translateY(-5px)";
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.borderColor = "rgba(250, 192, 20, 0.1)";
                  e.currentTarget.style.transform = "translateY(0)";
                }}
              >
                {newsItem.featuredImage && (
                  <div
                    style={{
                      width: "100%",
                      height: "200px",
                      backgroundImage: `url(${newsItem.featuredImage})`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                      borderRadius: "8px",
                      marginBottom: "15px",
                    }}
                  />
                )}
                <div style={{ marginBottom: "15px" }}>
                  <span
                    style={{
                      background: "#1800ad",
                      color: "white",
                      padding: "4px 12px",
                      borderRadius: "4px",
                      fontSize: "12px",
                      fontWeight: "600",
                      display: "inline-block",
                      marginRight: "8px",
                      marginBottom: "8px",
                    }}
                  >
                    {newsItem.postType}
                  </span>
                  {newsItem.isPopularFeed && (
                    <span
                      style={{
                        background: "#FAC014",
                        color: "#000",
                        padding: "4px 12px",
                        borderRadius: "4px",
                        fontSize: "12px",
                        fontWeight: "600",
                        display: "inline-block",
                        marginBottom: "8px",
                      }}
                    >
                      Popular
                    </span>
                  )}
                  <span
                    style={{
                      background: "#373737",
                      color: "#fff",
                      padding: "4px 12px",
                      borderRadius: "4px",
                      fontSize: "12px",
                      fontWeight: "600",
                      display: "inline-block",
                      marginBottom: "8px",
                    }}
                  >
                    {newsItem.category}
                  </span>
                </div>
                <h3
                  style={{
                    color: "#fff",
                    fontSize: "18px",
                    fontWeight: "600",
                    marginBottom: "8px",
                  }}
                >
                  {newsItem.title}
                </h3>
                <p style={{ color: "#696969", fontSize: "12px", marginBottom: "10px" }}>
                  <i className="fas fa-user" style={{ marginRight: "6px" }} />
                  {newsItem.author} • {formatDate(newsItem.publishDate)}
                </p>
                <p
                  style={{
                    color: "#ccc",
                    fontSize: "14px",
                    marginBottom: "15px",
                    lineHeight: "1.6",
                    display: "-webkit-box",
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                  }}
                >
                  {newsItem.excerpt}
                </p>
                <div
                  style={{
                    display: "flex",
                    gap: "10px",
                    marginTop: "20px",
                    paddingTop: "15px",
                    borderTop: "1px solid #373737",
                  }}
                >
                  <Link
                    href={`/news-details?slug=${newsItem.slug}`}
                    style={{
                      flex: 1,
                      padding: "10px",
                      background: "transparent",
                      color: "#FAC014",
                      border: "1px solid #FAC014",
                      borderRadius: "6px",
                      fontSize: "13px",
                      fontWeight: "600",
                      cursor: "pointer",
                      transition: "all 0.3s",
                      textDecoration: "none",
                      textAlign: "center",
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.background = "#FAC014";
                      e.currentTarget.style.color = "#000";
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.background = "transparent";
                      e.currentTarget.style.color = "#FAC014";
                    }}
                  >
                    <i className="fas fa-eye" style={{ marginRight: "6px" }} />
                    View
                  </Link>
                  <button
                    onClick={() => handleOpenModal(newsItem)}
                    style={{
                      flex: 1,
                      padding: "10px",
                      background: "transparent",
                      color: "#FAC014",
                      border: "1px solid #FAC014",
                      borderRadius: "6px",
                      fontSize: "13px",
                      fontWeight: "600",
                      cursor: "pointer",
                      transition: "all 0.3s",
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.background = "#FAC014";
                      e.currentTarget.style.color = "#000";
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.background = "transparent";
                      e.currentTarget.style.color = "#FAC014";
                    }}
                  >
                    <i className="fas fa-edit" style={{ marginRight: "6px" }} />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(newsItem._id)}
                    style={{
                      flex: 1,
                      padding: "10px",
                      background: "transparent",
                      color: "#ff6b6b",
                      border: "1px solid #ff6b6b",
                      borderRadius: "6px",
                      fontSize: "13px",
                      fontWeight: "600",
                      cursor: "pointer",
                      transition: "all 0.3s",
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.background = "#ff6b6b";
                      e.currentTarget.style.color = "#fff";
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.background = "transparent";
                      e.currentTarget.style.color = "#ff6b6b";
                    }}
                  >
                    <i className="fas fa-trash" style={{ marginRight: "6px" }} />
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination - Same as careers page */}
        {totalPages > 1 && (
          <>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                gap: "10px",
                marginTop: "30px",
                flexWrap: "wrap",
              }}
            >
              <button
                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                style={{
                  padding: "10px 20px",
                  background: currentPage === 1 ? "#373737" : "linear-gradient(90deg, #FAD02B 0%, #FAC014 100%)",
                  color: currentPage === 1 ? "#696969" : "#000",
                  border: "none",
                  borderRadius: "8px",
                  fontSize: "14px",
                  fontWeight: "600",
                  cursor: currentPage === 1 ? "not-allowed" : "pointer",
                  transition: "all 0.3s",
                  opacity: currentPage === 1 ? 0.5 : 1,
                }}
              >
                <i className="fas fa-chevron-left" style={{ marginRight: "5px" }} />
                Previous
              </button>

              <div style={{ display: "flex", gap: "5px", alignItems: "center" }}>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                  if (
                    page === 1 ||
                    page === totalPages ||
                    (page >= currentPage - 1 && page <= currentPage + 1)
                  ) {
                    return (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        style={{
                          padding: "10px 16px",
                          background: currentPage === page
                            ? "linear-gradient(90deg, #FAD02B 0%, #FAC014 100%)"
                            : "#0D0D0D",
                          color: currentPage === page ? "#000" : "#fff",
                          border: currentPage === page ? "none" : "1px solid #373737",
                          borderRadius: "8px",
                          fontSize: "14px",
                          fontWeight: currentPage === page ? "700" : "500",
                          cursor: "pointer",
                          transition: "all 0.3s",
                          minWidth: "40px",
                        }}
                        onMouseOver={(e) => {
                          if (currentPage !== page) {
                            e.currentTarget.style.borderColor = "#FAC014";
                            e.currentTarget.style.color = "#FAC014";
                          }
                        }}
                        onMouseOut={(e) => {
                          if (currentPage !== page) {
                            e.currentTarget.style.borderColor = "#373737";
                            e.currentTarget.style.color = "#fff";
                          }
                        }}
                      >
                        {page}
                      </button>
                    );
                  } else if (
                    page === currentPage - 2 ||
                    page === currentPage + 2
                  ) {
                    return (
                      <span
                        key={page}
                        style={{
                          color: "#696969",
                          padding: "0 5px",
                        }}
                      >
                        ...
                      </span>
                    );
                  }
                  return null;
                })}
              </div>

              <button
                onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                style={{
                  padding: "10px 20px",
                  background: currentPage === totalPages ? "#373737" : "linear-gradient(90deg, #FAD02B 0%, #FAC014 100%)",
                  color: currentPage === totalPages ? "#696969" : "#000",
                  border: "none",
                  borderRadius: "8px",
                  fontSize: "14px",
                  fontWeight: "600",
                  cursor: currentPage === totalPages ? "not-allowed" : "pointer",
                  transition: "all 0.3s",
                  opacity: currentPage === totalPages ? 0.5 : 1,
                }}
              >
                Next
                <i className="fas fa-chevron-right" style={{ marginLeft: "5px" }} />
              </button>
            </div>

            {totalPages > 1 && (
              <div
                style={{
                  textAlign: "center",
                  marginTop: "15px",
                  color: "#696969",
                  fontSize: "14px",
                }}
              >
                Showing page {currentPage} of {totalPages} ({total} total news)
              </div>
            )}
          </>
        )}

        {/* Modal - Will continue in next part due to size */}
        {showModal && (
          <NewsModal
            formData={formData}
            setFormData={setFormData}
            editingNews={editingNews}
            handleTitleChange={handleTitleChange}
            handleSubmit={handleSubmit}
            handleCloseModal={handleCloseModal}
            handleImageUpload={handleImageUpload}
            handleGalleryImagesUpload={handleGalleryImagesUpload}
            imageUploading={imageUploading}
          />
        )}
      </div>
    </AdminLayout>
  );
}

// Separate component for the modal to keep code organized
function NewsModal({
  formData,
  setFormData,
  editingNews,
  handleTitleChange,
  handleSubmit,
  handleCloseModal,
  handleImageUpload,
  handleGalleryImagesUpload,
  imageUploading,
}: {
  formData: any;
  setFormData: any;
  editingNews: News | null;
  handleTitleChange: (title: string) => void;
  handleSubmit: (e: React.FormEvent) => void;
  handleCloseModal: () => void;
  handleImageUpload: (file: File, folder?: string) => Promise<string | null>;
  handleGalleryImagesUpload: (files: FileList) => Promise<string[]>;
  imageUploading: boolean;
}) {
  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: "rgba(0, 0, 0, 0.8)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
        padding: "20px",
        overflowY: "auto",
      }}
      onClick={handleCloseModal}
    >
      <div
        style={{
          background: "#121416",
          borderRadius: "14px",
          padding: "30px",
          maxWidth: "900px",
          width: "100%",
          maxHeight: "90vh",
          overflowY: "auto",
          border: "1px solid rgba(250, 192, 20, 0.1)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "25px",
          }}
        >
          <h2
            style={{
              color: "#FAC014",
              fontSize: "24px",
              fontWeight: "700",
            }}
          >
            {editingNews ? "Edit News" : "Add New News"}
          </h2>
          <button
            onClick={handleCloseModal}
            style={{
              background: "transparent",
              border: "none",
              color: "#696969",
              fontSize: "24px",
              cursor: "pointer",
              padding: "0",
              width: "30px",
              height: "30px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "20px" }}>
            <div>
              <label style={{ display: "block", color: "#fff", marginBottom: "8px", fontSize: "14px", fontWeight: "500" }}>
                Title *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => handleTitleChange(e.target.value)}
                required
                style={{
                  width: "100%",
                  padding: "12px 16px",
                  background: "#0D0D0D",
                  border: "1px solid #373737",
                  borderRadius: "8px",
                  color: "#fff",
                  fontSize: "14px",
                  outline: "none",
                }}
                onFocus={(e) => { e.target.style.borderColor = "#FAC014"; }}
                onBlur={(e) => { e.target.style.borderColor = "#373737"; }}
              />
            </div>
            <div>
              <label style={{ display: "block", color: "#fff", marginBottom: "8px", fontSize: "14px", fontWeight: "500" }}>
                Slug *
              </label>
              <input
                type="text"
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                required
                style={{
                  width: "100%",
                  padding: "12px 16px",
                  background: "#0D0D0D",
                  border: "1px solid #373737",
                  borderRadius: "8px",
                  color: "#fff",
                  fontSize: "14px",
                  outline: "none",
                }}
                onFocus={(e) => { e.target.style.borderColor = "#FAC014"; }}
                onBlur={(e) => { e.target.style.borderColor = "#373737"; }}
              />
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "20px" }}>
            <div>
              <label style={{ display: "block", color: "#fff", marginBottom: "8px", fontSize: "14px", fontWeight: "500" }}>
                Category *
              </label>
              <input
                type="text"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                required
                placeholder="e.g., Digital Marketing"
                style={{
                  width: "100%",
                  padding: "12px 16px",
                  background: "#0D0D0D",
                  border: "1px solid #373737",
                  borderRadius: "8px",
                  color: "#fff",
                  fontSize: "14px",
                  outline: "none",
                }}
                onFocus={(e) => { e.target.style.borderColor = "#FAC014"; }}
                onBlur={(e) => { e.target.style.borderColor = "#373737"; }}
              />
            </div>
            <div>
              <label style={{ display: "block", color: "#fff", marginBottom: "8px", fontSize: "14px", fontWeight: "500" }}>
                Post Type *
              </label>
              <select
                value={formData.postType}
                onChange={(e) => setFormData({ ...formData, postType: e.target.value })}
                required
                style={{
                  width: "100%",
                  padding: "12px 16px",
                  background: "#0D0D0D",
                  border: "1px solid #373737",
                  borderRadius: "8px",
                  color: "#fff",
                  fontSize: "14px",
                  outline: "none",
                }}
                onFocus={(e) => { e.target.style.borderColor = "#FAC014"; }}
                onBlur={(e) => { e.target.style.borderColor = "#373737"; }}
              >
                <option value="regular">Regular</option>
                <option value="quote">Quote</option>
                <option value="video">Video</option>
                <option value="audio">Audio</option>
                <option value="gallery">Gallery</option>
                <option value="slider">Slider</option>
              </select>
            </div>
          </div>

          <div style={{ marginBottom: "20px" }}>
            <label style={{ display: "block", color: "#fff", marginBottom: "8px", fontSize: "14px", fontWeight: "500" }}>
              Featured Image *
            </label>
            <div style={{ display: "flex", gap: "10px", alignItems: "flex-start" }}>
              <input
                type="file"
                id="featured-image-upload"
                accept="image/*"
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    const url = await handleImageUpload(file, 'news/images');
                    if (url) {
                      setFormData({ ...formData, featuredImage: url });
                    }
                  }
                }}
                style={{ display: "none" }}
              />
              <button
                type="button"
                onClick={() => document.getElementById('featured-image-upload')?.click()}
                disabled={imageUploading}
                style={{
                  padding: "12px 20px",
                  background: imageUploading ? "#373737" : "linear-gradient(90deg, #FAD02B 0%, #FAC014 100%)",
                  color: imageUploading ? "#696969" : "#000",
                  border: "none",
                  borderRadius: "8px",
                  fontSize: "14px",
                  fontWeight: "600",
                  cursor: imageUploading ? "not-allowed" : "pointer",
                  whiteSpace: "nowrap",
                }}
              >
                {imageUploading ? "Uploading..." : <><i className="fas fa-upload" style={{ marginRight: "8px" }} />Upload Image</>}
              </button>
              <input
                type="url"
                value={formData.featuredImage}
                onChange={(e) => setFormData({ ...formData, featuredImage: e.target.value })}
                placeholder="Or enter image URL"
                required
                style={{
                  flex: 1,
                  padding: "12px 16px",
                  background: "#0D0D0D",
                  border: "1px solid #373737",
                  borderRadius: "8px",
                  color: "#fff",
                  fontSize: "14px",
                  outline: "none",
                }}
                onFocus={(e) => { e.target.style.borderColor = "#FAC014"; }}
                onBlur={(e) => { e.target.style.borderColor = "#373737"; }}
              />
            </div>
            {formData.featuredImage && (
              <div style={{ marginTop: "10px" }}>
                <img
                  src={formData.featuredImage}
                  alt="Preview"
                  style={{
                    maxWidth: "200px",
                    maxHeight: "150px",
                    borderRadius: "8px",
                    border: "1px solid rgba(250, 192, 20, 0.2)",
                  }}
                />
              </div>
            )}
          </div>

          <div style={{ marginBottom: "20px" }}>
            <label style={{ display: "block", color: "#fff", marginBottom: "8px", fontSize: "14px", fontWeight: "500" }}>
              Excerpt *
            </label>
            <textarea
              value={formData.excerpt}
              onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
              required
              rows={3}
              style={{
                width: "100%",
                padding: "12px 16px",
                background: "#0D0D0D",
                border: "1px solid #373737",
                borderRadius: "8px",
                color: "#fff",
                fontSize: "14px",
                outline: "none",
                resize: "vertical",
                fontFamily: "inherit",
              }}
              onFocus={(e) => { e.target.style.borderColor = "#FAC014"; }}
              onBlur={(e) => { e.target.style.borderColor = "#373737"; }}
            />
          </div>

          <div style={{ marginBottom: "20px" }}>
            <label style={{ display: "block", color: "#fff", marginBottom: "8px", fontSize: "14px", fontWeight: "500" }}>
              Content *
            </label>
            <textarea
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              required
              rows={10}
              style={{
                width: "100%",
                padding: "12px 16px",
                background: "#0D0D0D",
                border: "1px solid #373737",
                borderRadius: "8px",
                color: "#fff",
                fontSize: "14px",
                outline: "none",
                resize: "vertical",
                fontFamily: "inherit",
              }}
              onFocus={(e) => { e.target.style.borderColor = "#FAC014"; }}
              onBlur={(e) => { e.target.style.borderColor = "#373737"; }}
            />
          </div>

          {/* Conditional fields based on post type */}
          {formData.postType === 'video' && (
            <div style={{ marginBottom: "20px" }}>
              <label style={{ display: "block", color: "#fff", marginBottom: "8px", fontSize: "14px", fontWeight: "500" }}>
                Video URL
              </label>
              <input
                type="url"
                value={formData.videoUrl}
                onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
                placeholder="https://www.youtube.com/watch?v=..."
                style={{
                  width: "100%",
                  padding: "12px 16px",
                  background: "#0D0D0D",
                  border: "1px solid #373737",
                  borderRadius: "8px",
                  color: "#fff",
                  fontSize: "14px",
                  outline: "none",
                }}
                onFocus={(e) => { e.target.style.borderColor = "#FAC014"; }}
                onBlur={(e) => { e.target.style.borderColor = "#373737"; }}
              />
            </div>
          )}

          {formData.postType === 'audio' && (
            <div style={{ marginBottom: "20px" }}>
              <label style={{ display: "block", color: "#fff", marginBottom: "8px", fontSize: "14px", fontWeight: "500" }}>
                Audio Embed Code
              </label>
              <textarea
                value={formData.audioEmbed}
                onChange={(e) => setFormData({ ...formData, audioEmbed: e.target.value })}
                rows={4}
                placeholder="<iframe>...</iframe>"
                style={{
                  width: "100%",
                  padding: "12px 16px",
                  background: "#0D0D0D",
                  border: "1px solid #373737",
                  borderRadius: "8px",
                  color: "#fff",
                  fontSize: "14px",
                  outline: "none",
                  resize: "vertical",
                  fontFamily: "monospace",
                }}
                onFocus={(e) => { e.target.style.borderColor = "#FAC014"; }}
                onBlur={(e) => { e.target.style.borderColor = "#373737"; }}
              />
            </div>
          )}

          {formData.postType === 'gallery' && (
            <div style={{ marginBottom: "20px" }}>
              <label style={{ display: "block", color: "#fff", marginBottom: "8px", fontSize: "14px", fontWeight: "500" }}>
                Gallery Images
              </label>
              <div style={{ marginBottom: "10px" }}>
                <input
                  type="file"
                  id="gallery-images-upload"
                  accept="image/*"
                  multiple
                  onChange={async (e) => {
                    const files = e.target.files;
                    if (files && files.length > 0) {
                      const uploadedUrls = await handleGalleryImagesUpload(files);
                      if (uploadedUrls.length > 0) {
                        const existingUrls = formData.galleryImages.split("\n").filter((url: string) => url.trim());
                        setFormData({ ...formData, galleryImages: [...existingUrls, ...uploadedUrls].join("\n") });
                      }
                    }
                  }}
                  style={{ display: "none" }}
                />
                <button
                  type="button"
                  onClick={() => document.getElementById('gallery-images-upload')?.click()}
                  disabled={imageUploading}
                  style={{
                    padding: "10px 18px",
                    background: imageUploading ? "#373737" : "linear-gradient(90deg, #FAD02B 0%, #FAC014 100%)",
                    color: imageUploading ? "#696969" : "#000",
                    border: "none",
                    borderRadius: "8px",
                    fontSize: "13px",
                    fontWeight: "600",
                    cursor: imageUploading ? "not-allowed" : "pointer",
                    marginBottom: "10px",
                  }}
                >
                  {imageUploading ? "Uploading..." : <><i className="fas fa-upload" style={{ marginRight: "6px" }} />Upload Multiple Images</>}
                </button>
              </div>
              <textarea
                value={formData.galleryImages}
                onChange={(e) => setFormData({ ...formData, galleryImages: e.target.value })}
                rows={5}
                placeholder="Enter image URLs (one per line) or upload images above"
                style={{
                  width: "100%",
                  padding: "12px 16px",
                  background: "#0D0D0D",
                  border: "1px solid #373737",
                  borderRadius: "8px",
                  color: "#fff",
                  fontSize: "14px",
                  outline: "none",
                  resize: "vertical",
                  fontFamily: "monospace",
                }}
                onFocus={(e) => { e.target.style.borderColor = "#FAC014"; }}
                onBlur={(e) => { e.target.style.borderColor = "#373737"; }}
              />
            </div>
          )}

          {formData.postType === 'slider' && (
            <div style={{ marginBottom: "20px" }}>
              <label style={{ display: "block", color: "#fff", marginBottom: "8px", fontSize: "14px", fontWeight: "500" }}>
                Slider Images
              </label>
              <div style={{ marginBottom: "10px" }}>
                <input
                  type="file"
                  id="slider-images-upload"
                  accept="image/*"
                  multiple
                  onChange={async (e) => {
                    const files = e.target.files;
                    if (files && files.length > 0) {
                      const uploadedUrls = await handleGalleryImagesUpload(files);
                      if (uploadedUrls.length > 0) {
                        const existingUrls = formData.sliderImages.split("\n").filter((url: string) => url.trim());
                        setFormData({ ...formData, sliderImages: [...existingUrls, ...uploadedUrls].join("\n") });
                      }
                    }
                  }}
                  style={{ display: "none" }}
                />
                <button
                  type="button"
                  onClick={() => document.getElementById('slider-images-upload')?.click()}
                  disabled={imageUploading}
                  style={{
                    padding: "10px 18px",
                    background: imageUploading ? "#373737" : "linear-gradient(90deg, #FAD02B 0%, #FAC014 100%)",
                    color: imageUploading ? "#696969" : "#000",
                    border: "none",
                    borderRadius: "8px",
                    fontSize: "13px",
                    fontWeight: "600",
                    cursor: imageUploading ? "not-allowed" : "pointer",
                    marginBottom: "10px",
                  }}
                >
                  {imageUploading ? "Uploading..." : <><i className="fas fa-upload" style={{ marginRight: "6px" }} />Upload Multiple Images</>}
                </button>
              </div>
              <textarea
                value={formData.sliderImages}
                onChange={(e) => setFormData({ ...formData, sliderImages: e.target.value })}
                rows={5}
                placeholder="Enter image URLs (one per line) or upload images above"
                style={{
                  width: "100%",
                  padding: "12px 16px",
                  background: "#0D0D0D",
                  border: "1px solid #373737",
                  borderRadius: "8px",
                  color: "#fff",
                  fontSize: "14px",
                  outline: "none",
                  resize: "vertical",
                  fontFamily: "monospace",
                }}
                onFocus={(e) => { e.target.style.borderColor = "#FAC014"; }}
                onBlur={(e) => { e.target.style.borderColor = "#373737"; }}
              />
            </div>
          )}

          {formData.postType === 'quote' && (
            <div style={{ marginBottom: "20px" }}>
              <label style={{ display: "block", color: "#fff", marginBottom: "8px", fontSize: "14px", fontWeight: "500" }}>
                Quote Text
              </label>
              <textarea
                value={formData.quoteText}
                onChange={(e) => setFormData({ ...formData, quoteText: e.target.value })}
                rows={3}
                style={{
                  width: "100%",
                  padding: "12px 16px",
                  background: "#0D0D0D",
                  border: "1px solid #373737",
                  borderRadius: "8px",
                  color: "#fff",
                  fontSize: "14px",
                  outline: "none",
                  resize: "vertical",
                  fontFamily: "inherit",
                }}
                onFocus={(e) => { e.target.style.borderColor = "#FAC014"; }}
                onBlur={(e) => { e.target.style.borderColor = "#373737"; }}
              />
            </div>
          )}

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "20px" }}>
            <div>
              <label style={{ display: "block", color: "#fff", marginBottom: "8px", fontSize: "14px", fontWeight: "500" }}>
                Author *
              </label>
              <input
                type="text"
                value={formData.author}
                onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                required
                style={{
                  width: "100%",
                  padding: "12px 16px",
                  background: "#0D0D0D",
                  border: "1px solid #373737",
                  borderRadius: "8px",
                  color: "#fff",
                  fontSize: "14px",
                  outline: "none",
                }}
                onFocus={(e) => { e.target.style.borderColor = "#FAC014"; }}
                onBlur={(e) => { e.target.style.borderColor = "#373737"; }}
              />
            </div>
            <div>
              <label style={{ display: "block", color: "#fff", marginBottom: "8px", fontSize: "14px", fontWeight: "500" }}>
                Author Image URL
              </label>
              <input
                type="url"
                value={formData.authorImage}
                onChange={(e) => setFormData({ ...formData, authorImage: e.target.value })}
                style={{
                  width: "100%",
                  padding: "12px 16px",
                  background: "#0D0D0D",
                  border: "1px solid #373737",
                  borderRadius: "8px",
                  color: "#fff",
                  fontSize: "14px",
                  outline: "none",
                }}
                onFocus={(e) => { e.target.style.borderColor = "#FAC014"; }}
                onBlur={(e) => { e.target.style.borderColor = "#373737"; }}
              />
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "20px" }}>
            <div>
              <label style={{ display: "block", color: "#fff", marginBottom: "8px", fontSize: "14px", fontWeight: "500" }}>
                Publish Date *
              </label>
              <input
                type="date"
                value={formData.publishDate}
                onChange={(e) => setFormData({ ...formData, publishDate: e.target.value })}
                required
                style={{
                  width: "100%",
                  padding: "12px 16px",
                  background: "#0D0D0D",
                  border: "1px solid #373737",
                  borderRadius: "8px",
                  color: "#fff",
                  fontSize: "14px",
                  outline: "none",
                }}
                onFocus={(e) => { e.target.style.borderColor = "#FAC014"; }}
                onBlur={(e) => { e.target.style.borderColor = "#373737"; }}
              />
            </div>
            <div>
              <label style={{ display: "block", color: "#fff", marginBottom: "8px", fontSize: "14px", fontWeight: "500" }}>
                Comments Count
              </label>
              <input
                type="number"
                value={formData.commentsCount}
                onChange={(e) => setFormData({ ...formData, commentsCount: parseInt(e.target.value) || 0 })}
                min="0"
                style={{
                  width: "100%",
                  padding: "12px 16px",
                  background: "#0D0D0D",
                  border: "1px solid #373737",
                  borderRadius: "8px",
                  color: "#fff",
                  fontSize: "14px",
                  outline: "none",
                }}
                onFocus={(e) => { e.target.style.borderColor = "#FAC014"; }}
                onBlur={(e) => { e.target.style.borderColor = "#373737"; }}
              />
            </div>
          </div>

          <div style={{ marginBottom: "20px" }}>
            <label style={{ display: "block", color: "#fff", marginBottom: "8px", fontSize: "14px", fontWeight: "500" }}>
              Tags (comma-separated)
            </label>
            <input
              type="text"
              value={formData.tags}
              onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
              placeholder="Marketing, SEO, Content"
              style={{
                width: "100%",
                padding: "12px 16px",
                background: "#0D0D0D",
                border: "1px solid #373737",
                borderRadius: "8px",
                color: "#fff",
                fontSize: "14px",
                outline: "none",
              }}
              onFocus={(e) => { e.target.style.borderColor = "#FAC014"; }}
              onBlur={(e) => { e.target.style.borderColor = "#373737"; }}
            />
          </div>

          <div style={{ marginBottom: "25px" }}>
            <label style={{ display: "flex", alignItems: "center", gap: "10px", color: "#fff", fontSize: "14px", cursor: "pointer" }}>
              <input
                type="checkbox"
                checked={formData.isPopularFeed}
                onChange={(e) => setFormData({ ...formData, isPopularFeed: e.target.checked })}
                style={{ width: "18px", height: "18px", cursor: "pointer" }}
              />
              Mark as Popular Feed
            </label>
          </div>

          <div style={{ display: "flex", gap: "12px", justifyContent: "flex-end" }}>
            <button
              type="button"
              onClick={handleCloseModal}
              style={{
                padding: "12px 24px",
                background: "transparent",
                color: "#696969",
                border: "1px solid #373737",
                borderRadius: "8px",
                fontSize: "14px",
                fontWeight: "600",
                cursor: "pointer",
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              style={{
                padding: "12px 24px",
                background: "linear-gradient(90deg, #FAD02B 0%, #FAC014 100%)",
                color: "#000",
                border: "none",
                borderRadius: "8px",
                fontSize: "14px",
                fontWeight: "700",
                cursor: "pointer",
                boxShadow: "0 4px 15px rgba(250, 192, 20, 0.3)",
              }}
            >
              {editingNews ? "Update" : "Create"} News
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

