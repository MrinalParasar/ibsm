"use client";

import { useEffect, useState, useMemo } from "react";
import { useAdmin } from "@/components/AdminContext";
import dynamic from "next/dynamic";
import { useSearchParams, useRouter, usePathname } from "next/navigation";

import Link from "next/link";
import {
  Typography,
  Box,
  Button,
  Grid,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Chip,
  IconButton,
  Pagination,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Checkbox,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as VisibilityIcon,
  Person as PersonIcon,
  CalendarToday as CalendarTodayIcon,
  CloudUpload as CloudUploadIcon,
  Close as CloseIcon,
  TableChart as TableIcon,
  GridView as CardsIcon,
  ArrowBack as BackIcon,
} from "@mui/icons-material";

const RichTextEditor = dynamic(() => import("@/components/RichTextEditor"), {
  ssr: false,
  loading: () => <Box sx={{ height: 400, bgcolor: '#f5f5f5', borderRadius: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><CircularProgress size={24} /></Box>
});

interface News {
  _id: string;
  title: string;
  slug: string;
  category: string;
  excerpt: string;
  content: string;
  featuredImage: string;
  featuredImageAlt?: string;
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
  isFeatured?: boolean;
  isService?: boolean; // Added field
  status: 'published' | 'draft';
}

export default function AdminNewsPage() {
  /* Navigation Hooks */
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  /* State */
  const { setSidebarCollapsed } = useAdmin();
  const [news, setNews] = useState<News[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingNews, setEditingNews] = useState<News | null>(null);
  const [imageUploading, setImageUploading] = useState(false);
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');
  const [showDraftDialog, setShowDraftDialog] = useState(false);
  const [draftData, setDraftData] = useState<any>(null);
  const [isDirty, setIsDirty] = useState(false);

  /* Effects */

  // 1. View Mode Restoration
  useEffect(() => {
    const savedMode = localStorage.getItem('newsViewMode') as 'table' | 'cards';
    if (savedMode) setViewMode(savedMode);
  }, []);

  // 2. Draft Check
  useEffect(() => {
    const editSlug = searchParams.get('edit');
    const action = searchParams.get('action');

    const savedDraft = localStorage.getItem('admin_news_draft');
    if (savedDraft) {
      try {
        const parsed = JSON.parse(savedDraft);

        // Scenario A: Deep linking to a specific post
        if (editSlug) {
          // If the draft matches the deep-linked post, offer to resume
          // (Check slug or ID if available. parsed.slug should match)
          if (parsed.slug === editSlug) {
            setDraftData(parsed);
            setShowDraftDialog(true);
          }
          // If draft is for a different post, we might ignore it or warn, 
          // but for now let's prioritize the deep link (DB version) 
          // effectively "discarding" the irrelevant draft for the current view context,
          // OR we could show it. Let's start with matching only.
        }
        // Scenario B: Creating new (and draft is new)
        else if (action === 'create') {
          if (!parsed._id && !parsed.slug) { // primitive check for "new" draft
            setDraftData(parsed);
            setShowDraftDialog(true);
          }
        }
        // Scenario C: General Index access - Show in list instead of dialog
        else {
          setDraftData(parsed);
          // setShowDraftDialog(true); // Disable dialog for general list view, show in table instead
        }
      } catch (e) {
        console.error("Failed to parse draft", e);
      }
    }
  }, []); // Run once on mount

  // 3. Navigation Safety (Before Unload)
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isDirty) {
        e.preventDefault();
        e.returnValue = '';
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [isDirty]);

  // 4. Restore Editor from URL (Deep Linking)
  useEffect(() => {
    const editSlug = searchParams.get('edit');
    const action = searchParams.get('action');

    if (editSlug && !isEditorOpen && news.length > 0) {
      // Find in current list
      const item = news.find(n => n.slug === editSlug);
      if (item) {
        handleOpenModal(item, false); // false to prevent pushing URL again
      } else {
        // Fetch specific item if not in list (Simple fetch by slug logic needed, or filter api)
        // Ideally backend supports get-by-slug. 
        // Fallback: If pagination prevents finding it, we might need a specific fetch.
        // For now, assuming user mostly edits recent stuff or we need a fetchBySlug.
        // Let's try to fetch it specifically if missing.
        fetch(`/api/admin/news/${editSlug}`).then(res => res.json()).then(data => {
          if (data && !data.error) {
            handleOpenModal(data, false);
          }
        }).catch(err => console.error("Failed to load deep link post", err));
      }
    } else if (action === 'create' && !isEditorOpen) {
      handleOpenModal(undefined, false);
    } else if (!editSlug && !action && isEditorOpen) {
      // If URL has no params but editor IS open, it means user hit Back button.
      // We should close the editor to match the URL.
      setIsEditorOpen(false);
      setSidebarCollapsed(false);
      setEditingNews(null);
      // Optional: Clear form if needed, but isDirty check might want to persist draft?
      // Since it's a browser nav, we usually treat it as a discard/close.
    }
  }, [searchParams, news]); // Depend on news to retry find if list loads

  const handleViewChange = (_: any, value: 'table' | 'cards') => {
    if (value) {
      setViewMode(value);
      localStorage.setItem('newsViewMode', value);
    }
  };

  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    category: "",
    excerpt: "",
    content: "",
    featuredImage: "",
    featuredImageAlt: "",
    postType: "regular" as News['postType'],
    videoUrl: "",
    audioEmbed: "",
    galleryImages: [] as { url: string; alt: string; }[],
    sliderImages: [] as { url: string; alt: string; }[],
    quoteText: "",
    author: "",
    authorImage: "",
    publishDate: new Date().toISOString().split('T')[0],
    commentsCount: 0,
    tags: "",
    isPopularFeed: false,
    isFeatured: false,
    isService: false, // Added field
    status: 'published' as 'published' | 'draft',
  });

  // Auto-save draft
  // Auto-save draft & Dirty Check
  useEffect(() => {
    // Helper to check if form is substantially different from initial
    const isDifferent = () => {
      if (!editingNews) {
        // New post: dirty if any main field has content
        return !!(formData.title || formData.content || formData.excerpt);
      } else {
        // Edit post: dirty if any field doesn't match
        // Simplify check for key fields
        return (
          formData.title !== editingNews.title ||
          formData.slug !== editingNews.slug ||
          formData.content !== editingNews.content ||
          formData.excerpt !== editingNews.excerpt ||
          formData.category !== editingNews.category ||
          formData.author !== editingNews.author ||
          formData.postType !== editingNews.postType ||
          formData.status !== editingNews.status ||
          formData.isService !== (editingNews.isService || false) ||
          formData.isFeatured !== (editingNews.isFeatured || false) ||
          formData.isPopularFeed !== (editingNews.isPopularFeed || false) ||
          // Date handling
          formData.publishDate !== (editingNews.publishDate ? new Date(editingNews.publishDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0])
        );
      }
    };

    if (isDifferent()) {
      setIsDirty(true);
      // Only save draft if NOT editing existing (or implement separate draft logic for edits if desired)
      if (!editingNews) {
        const timeoutId = setTimeout(() => {
          localStorage.setItem('admin_news_draft', JSON.stringify(formData));
        }, 1000);
        return () => clearTimeout(timeoutId);
      }
    } else {
      // Not different implies clean (e.g. reverted changes), but usually we only set true.
      // If we want to allow reverting to disable save, we can set false here:
      // setIsDirty(false); // OPTIONAL: Enables "Undo" to disable save button.
    }
  }, [formData, editingNews]);

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



  const handleOpenModal = (newsItem?: News, updateUrl = true) => {
    if (newsItem) {
      setEditingNews(newsItem);
      setFormData({
        title: newsItem.title,
        slug: newsItem.slug,
        category: newsItem.category,
        excerpt: newsItem.excerpt,
        content: newsItem.content,
        featuredImage: newsItem.featuredImage,
        featuredImageAlt: newsItem.featuredImageAlt || "",
        postType: newsItem.postType,
        videoUrl: newsItem.videoUrl || "",
        audioEmbed: newsItem.audioEmbed || "",
        galleryImages: newsItem.galleryImages || [],
        sliderImages: newsItem.sliderImages || [],
        quoteText: newsItem.quoteText || "",
        author: newsItem.author || "",
        authorImage: newsItem.authorImage || "",
        publishDate: newsItem.publishDate ? new Date(newsItem.publishDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
        commentsCount: newsItem.commentsCount || 0,
        tags: Array.isArray(newsItem.tags) ? newsItem.tags.join(', ') : (newsItem.tags || ""),
        isPopularFeed: newsItem.isPopularFeed || false,
        isFeatured: newsItem.isFeatured || false,
        isService: newsItem.isService || false,
        status: newsItem.status || 'published',
      });
      if (updateUrl) {
        router.push(`?edit=${newsItem.slug}`);
      }
    } else {
      setEditingNews(null);
      setFormData({
        title: "",
        slug: "",
        category: "",
        excerpt: "",
        content: "",
        featuredImage: "",
        featuredImageAlt: "",
        postType: "regular",
        videoUrl: "",
        audioEmbed: "",
        galleryImages: [],
        sliderImages: [],
        quoteText: "",
        author: "",
        authorImage: "",
        publishDate: new Date().toISOString().split('T')[0],
        commentsCount: 0,
        tags: "",
        isPopularFeed: false,
        isFeatured: false,
        isService: false,
        status: 'published',
      });
      if (updateUrl) {
        router.push(`?action=create`);
      }
    }
    setIsEditorOpen(true);
    setSidebarCollapsed(true);
    setIsDirty(false); // Reset dirty state on open
  };

  const handleCloseEditor = (skipCheck = false) => {
    if (!skipCheck && isDirty && !window.confirm("You have unsaved changes. Are you sure you want to discard them?")) {
      return;
    }
    setIsEditorOpen(false);
    setSidebarCollapsed(false);

    // Reset URL
    router.push('/admin/news');

    // Reset form data to defaults to prevent "New Post" detector from firing in useEffect
    setFormData({
      title: "",
      slug: "",
      category: "",
      excerpt: "",
      content: "",
      featuredImage: "",
      featuredImageAlt: "",
      postType: "regular",
      videoUrl: "",
      audioEmbed: "",
      galleryImages: [],
      sliderImages: [],
      quoteText: "",
      author: "",
      authorImage: "",
      publishDate: new Date().toISOString().split('T')[0],
      commentsCount: 0,

      tags: "",
      isPopularFeed: false,
      isFeatured: false,
      isService: false,
      status: 'published',
    });

    setIsDirty(false);
    setEditingNews(null);
    localStorage.removeItem('admin_news_draft'); // Clear draft on explicit close/discard
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
    // The original `tags` variable was already splitting.
    // The new `payload` structure will handle `tags` and `commentsCount` transformations.
    // Remove the old `galleryImages` and `sliderImages` splitting as they will be used directly.
    // const galleryImages = formData.galleryImages.split("\n").map(img => img.trim()).filter(img => img.length > 0);
    // const sliderImages = formData.sliderImages.split("\n").map(img => img.trim()).filter(img => img.length > 0);

    const payload = {
      ...formData,
      slug: formData.slug || generateSlug(formData.title), // Use existing logic for slug
      commentsCount: typeof formData.commentsCount === 'string' ? parseInt(formData.commentsCount) : formData.commentsCount,
      tags: typeof formData.tags === 'string' ? formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0) : formData.tags,
      galleryImages: formData.postType === 'gallery' ? formData.galleryImages : undefined, // Use formData.galleryImages directly
      sliderImages: formData.postType === 'slider' ? formData.sliderImages : undefined, // Use formData.sliderImages directly
      // Ensure other fields are correctly passed based on postType
      videoUrl: formData.postType === 'video' ? formData.videoUrl : undefined,
      audioEmbed: formData.postType === 'audio' ? formData.audioEmbed : undefined,
      quoteText: formData.postType === 'quote' ? formData.quoteText : undefined,
    };

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
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        const data = await response.json();
        fetchNews(currentPage);

        // Clear dirty state and draft
        setIsDirty(false);
        localStorage.removeItem('admin_news_draft');

        // If creating new, switch to edit mode
        if (!editingNews && data.news) {
          setEditingNews(data.news);
          // Sync form data with response to ensure isDifferent() returns false
          setFormData(prev => ({
            ...prev,
            ...data.news, // Spread basic fields
            // Ensure complex fields are correctly mapped back if needed
            // tags: Array.isArray(data.news.tags) ? data.news.tags.join(', ') : data.news.tags, 
            // Ideally we just trust isDifferent's subset check.
            // If we just sync ...data.news, it might overwrite local state formatting if mismatched.
            // For now, let's assume ...data.news provides the canonical state.
            publishDate: data.news.publishDate ? new Date(data.news.publishDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]
          }));
        } else if (editingNews && data.news) {
          // Update URL if slug changed
          if (editingNews.slug !== data.news.slug) {
            router.replace(`?edit=${data.news.slug}`, { scroll: false });
          }
          setEditingNews(data.news);
          // Sync form data with response to ensure isDifferent() returns false
          setFormData(prev => ({
            ...prev,
            ...data.news,
            publishDate: data.news.publishDate ? new Date(data.news.publishDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]
          }));
        }
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

  const handleResumeDraft = () => {
    if (draftData) {
      setFormData(draftData);
      setIsEditorOpen(true);
      setEditingNews(null); // Ensure it's treated as new if no ID
      setShowDraftDialog(false);
    }
  };

  const handleDiscardDraft = () => {
    if (confirm("Are you sure you want to discard this unsaved draft?")) {
      localStorage.removeItem('admin_news_draft');
      setDraftData(null);
      setShowDraftDialog(false);
    }
  };

  if (isEditorOpen) {
    return (
      <NewsEditor
        formData={formData}
        setFormData={setFormData}
        editingNews={editingNews}
        handleTitleChange={handleTitleChange}
        handleSubmit={handleSubmit}
        handleCloseEditor={handleCloseEditor}
        handleImageUpload={handleImageUpload}
        handleGalleryImagesUpload={handleGalleryImagesUpload}
        imageUploading={imageUploading}
        isDirty={isDirty}
        setIsDirty={setIsDirty}
      />
    );
  }

  return (
    <>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 700, mb: 1, color: '#1a1a1a' }}>
            Manage News
          </Typography>
          <Typography variant="body1" sx={{ color: "text.secondary" }}>
            Add, edit, or delete news articles
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          <ToggleButtonGroup
            value={viewMode}
            exclusive
            onChange={handleViewChange}
            size="small"
          >
            <ToggleButton value="table" aria-label="table view">
              <TableIcon sx={{ mr: 1 }} /> Table
            </ToggleButton>
            <ToggleButton value="cards" aria-label="cards view">
              <CardsIcon sx={{ mr: 1 }} /> Cards
            </ToggleButton>
          </ToggleButtonGroup>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={() => handleOpenModal()}
            sx={{
              px: 3,
              py: 1.5,
              boxShadow: "0 4px 15px rgba(24, 0, 173, 0.3)",
            }}
          >
            Add New News
          </Button>
        </Box>
      </Box>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 8 }}>
          <CircularProgress color="primary" />
        </Box>
      ) : news.length === 0 ? (
        <Card sx={{ p: 8, textAlign: 'center' }}>
          <Typography variant="body1" sx={{ color: "text.secondary" }}>
            No news found. Click "Add New News" to create one.
          </Typography>
        </Card>
      ) : viewMode === 'table' ? (
        <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid #eeeeee' }}>
          <Table sx={{ minWidth: 650 }}>
            <TableHead>
              <TableRow sx={{ bgcolor: 'rgba(24, 0, 173, 0.05)' }}>
                <TableCell sx={{ color: 'primary.main', fontWeight: 600 }}>Image</TableCell>
                <TableCell sx={{ color: 'primary.main', fontWeight: 600 }}>Title</TableCell>
                <TableCell sx={{ color: 'primary.main', fontWeight: 600 }}>Category</TableCell>
                <TableCell sx={{ color: 'primary.main', fontWeight: 600 }}>Author</TableCell>
                <TableCell sx={{ color: 'primary.main', fontWeight: 600 }}>Date</TableCell>
                <TableCell align="right" sx={{ color: 'primary.main', fontWeight: 600 }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {/* Draft Row */}
              {draftData && !draftData._id && (
                <TableRow sx={{ bgcolor: '#fff9c4', '&:hover': { bgcolor: '#fff59d' } }}>
                  <TableCell>
                    {draftData.featuredImage ? (
                      <img
                        src={draftData.featuredImage}
                        alt={draftData.title || "Draft"}
                        style={{ width: 50, height: 40, objectFit: 'cover', borderRadius: 4, opacity: 0.7 }}
                      />
                    ) : <Box sx={{ width: 50, height: 40, bgcolor: 'rgba(0,0,0,0.05)', borderRadius: 1 }} />}
                  </TableCell>
                  <TableCell onClick={handleResumeDraft} sx={{ cursor: 'pointer', maxWidth: 300 }}>
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <Typography variant="body2" sx={{ fontWeight: 600, fontStyle: 'italic', color: 'text.secondary' }}>
                        {draftData.title || "(Untitled Draft)"}
                      </Typography>
                      <Chip label="Unsaved Draft" size="small" color="warning" variant="outlined" sx={{ height: 20, fontSize: '0.65rem' }} />
                    </Stack>
                  </TableCell>
                  <TableCell>
                    <Chip label={draftData.category || "Uncategorized"} size="small" variant="outlined" sx={{ opacity: 0.7 }} />
                  </TableCell>
                  <TableCell>{draftData.author || "You"}</TableCell>
                  <TableCell sx={{ color: 'text.secondary', fontSize: '0.8rem' }}>
                    {formatDate(new Date().toISOString())} (Not published)
                  </TableCell>
                  <TableCell align="right">
                    <Stack direction="row" spacing={1} justifyContent="flex-end">
                      <Button size="small" variant="contained" color="warning" onClick={handleResumeDraft} sx={{ textTransform: 'none', px: 2 }}>
                        Resume
                      </Button>
                      <IconButton size="small" onClick={handleDiscardDraft} color="error" title="Discard Draft">
                        <CloseIcon fontSize="small" />
                      </IconButton>
                    </Stack>
                  </TableCell>
                </TableRow>
              )}
              {news.map((newsItem) => (
                <TableRow
                  key={newsItem._id}
                  sx={{ '&:hover': { bgcolor: 'rgba(0,0,0,0.02)' } }}
                >
                  <TableCell>
                    {newsItem.featuredImage ? (
                      <img
                        src={newsItem.featuredImage}
                        alt={newsItem.title}
                        style={{ width: 50, height: 40, objectFit: 'cover', borderRadius: 4 }}
                      />
                    ) : "-"}
                  </TableCell>
                  <TableCell sx={{ maxWidth: 300, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {newsItem.title}
                  </TableCell>
                  <TableCell>
                    <Chip label={newsItem.category} size="small" variant="outlined" />
                  </TableCell>
                  <TableCell>{newsItem.author}</TableCell>
                  <TableCell sx={{ color: 'text.secondary', fontSize: '0.8rem' }}>
                    {formatDate(newsItem.publishDate)}
                  </TableCell>
                  <TableCell align="right">
                    <Stack direction="row" spacing={1} justifyContent="flex-end">
                      <IconButton
                        size="small"
                        component={Link}
                        href={`/blog/${newsItem.slug}`}
                        sx={{ color: 'primary.main', border: '1px solid rgba(24, 0, 173, 0.2)' }}
                      >
                        <VisibilityIcon fontSize="small" />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => handleOpenModal(newsItem)}
                        sx={{ color: 'primary.main', border: '1px solid rgba(24, 0, 173, 0.2)' }}
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => handleDelete(newsItem._id)}
                        sx={{ color: 'error.main', border: '1px solid rgba(211, 47, 47, 0.2)' }}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <Grid container spacing={3}>
          {/* Draft Card */}
          {draftData && !draftData._id && (
            <Grid size={{ xs: 12, sm: 12, md: 6, lg: 4 }}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', border: '2px dashed #fbc02d', bgcolor: '#fffde7' }}>
                <CardContent sx={{ flexGrow: 1 }}>
                  <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Chip label="Unsaved Draft" color="warning" size="small" />
                    <IconButton size="small" onClick={handleDiscardDraft} color="error">
                      <CloseIcon fontSize="small" />
                    </IconButton>
                  </Box>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 1, fontStyle: 'italic', color: 'text.primary' }}>
                    {draftData.title || "(Untitled Draft)"}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    Resume editing where you left off...
                  </Typography>
                </CardContent>
                <CardActions sx={{ p: 2 }}>
                  <Button fullWidth variant="contained" color="warning" onClick={handleResumeDraft}>
                    Resume Editing
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          )}
          {news.map((newsItem) => (
            <Grid size={{ xs: 12, sm: 12, md: 6, lg: 4 }} key={newsItem._id}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'all 0.3s',
                  '&:hover': {
                    borderColor: 'primary.main',
                    transform: 'translateY(-5px)',
                  },
                }}
              >
                {newsItem.featuredImage && (
                  <CardMedia
                    component="img"
                    height="200"
                    image={newsItem.featuredImage}
                    alt={newsItem.title}
                  />
                )}
                <CardContent sx={{ flexGrow: 1 }}>
                  <Box sx={{ mb: 2, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    <Chip
                      label={newsItem.postType}
                      size="small"
                      sx={{ bgcolor: 'grey.200', color: 'text.secondary', fontWeight: 600 }}
                    />
                    {newsItem.isPopularFeed && (
                      <Chip
                        label="Popular"
                        size="small"
                        sx={{ bgcolor: 'primary.main', color: 'white', fontWeight: 600 }}
                      />
                    )}
                    <Chip
                      label={newsItem.category}
                      size="small"
                      variant="outlined"
                    />
                  </Box>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 1, color: 'text.primary' }}>
                    {newsItem.title}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                    <PersonIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                      {newsItem.author}
                    </Typography>
                    <Box sx={{ mx: 0.5, color: 'text.secondary' }}>•</Box>
                    <CalendarTodayIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                      {formatDate(newsItem.publishDate)}
                    </Typography>
                  </Box>
                  <Typography
                    variant="body2"
                    sx={{
                      color: 'text.secondary',
                      display: '-webkit-box',
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                      lineHeight: 1.6,
                    }}
                  >
                    {newsItem.excerpt}
                  </Typography>
                </CardContent>
                <CardActions sx={{ p: 2, pt: 0, gap: 1 }}>
                  <Button
                    size="small"
                    variant="outlined"
                    component={Link}
                    href={`/blog/${newsItem.slug}`}
                    startIcon={<VisibilityIcon />}
                    sx={{ flex: 1 }}
                  >
                    View
                  </Button>
                  <Button
                    size="small"
                    variant="outlined"
                    onClick={() => handleOpenModal(newsItem)}
                    startIcon={<EditIcon />}
                    sx={{ flex: 1 }}
                  >
                    Edit
                  </Button>
                  <Button
                    size="small"
                    variant="outlined"
                    color="error"
                    onClick={() => handleDelete(newsItem._id)}
                    startIcon={<DeleteIcon />}
                    sx={{ flex: 1 }}
                  >
                    Delete
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <Stack spacing={2} sx={{ mt: 6, alignItems: 'center' }}>
          <Pagination
            count={totalPages}
            page={currentPage}
            onChange={(_, page) => setCurrentPage(page)}
            color="primary"
            size="large"
          />
          <Typography variant="body2" sx={{ color: "text.secondary" }}>
            Showing page {currentPage} of {totalPages} ({total} total news)
          </Typography>
        </Stack>
      )}

      {/* Pagination component logic ... */}
      {/* Draft Recovery Dialog */}
      <Dialog open={showDraftDialog} onClose={() => setShowDraftDialog(false)}>
        <DialogTitle>Unsaved Draft Found</DialogTitle>
        <DialogContent>
          <Typography>
            You have an unsaved draft from a previous session. Would you like to resume editing?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => {
            localStorage.removeItem('admin_news_draft');
            setDraftData(null); // Clear local state too
            setShowDraftDialog(false);
          }} color="error">
            Discard
          </Button>
          <Button
            variant="contained"
            onClick={handleResumeDraft}
          >
            Resume Editing
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

// Full page editor component
function NewsEditor({
  formData,
  setFormData,
  editingNews,
  handleTitleChange,
  handleSubmit,
  handleCloseEditor,
  handleImageUpload,
  handleGalleryImagesUpload,
  imageUploading,
  isDirty,
  setIsDirty,
}: {
  formData: any;
  setFormData: any;
  editingNews: News | null;
  handleTitleChange: (title: string) => void;
  handleSubmit: (e: React.FormEvent) => void;
  handleCloseEditor: () => void;
  handleImageUpload: (file: File, folder?: string) => Promise<string | null>;
  handleGalleryImagesUpload: (files: FileList) => Promise<string[]>;
  imageUploading: boolean;
  isDirty: boolean;
  setIsDirty: (val: boolean) => void;
}) {
  return (
    <Box>
      <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', gap: 2 }}>
        <IconButton onClick={handleCloseEditor} sx={{ color: 'primary.main' }}>
          <BackIcon />
        </IconButton>
        <Box>
          <Typography variant="h5" sx={{ color: 'primary.main', fontWeight: 700 }}>
            {editingNews ? "Edit News Article" : "Create New News Article"}
          </Typography>
          <Typography variant="body1" sx={{ color: 'text.secondary' }}>
            {editingNews ? `Updating: ${editingNews.title}` : "Fill in the details for your new article"}
          </Typography>
        </Box>
      </Box>

      <Paper
        elevation={0}
        sx={{
          p: 4,
          border: '1px solid #eeeeee',
          borderRadius: 2,
          bgcolor: 'background.paper',
        }}
      >
        <Box component="form" onSubmit={handleSubmit}>
          <Grid container spacing={4}>
            {/* Main Content Area */}
            <Grid size={{ xs: 12, md: 8 }}>
              <Stack spacing={3}>
                <TextField
                  fullWidth
                  label="Article Title"
                  required
                  value={formData.title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  variant="outlined"
                  sx={{ '& .MuiInputBase-input': { color: 'black !important', WebkitTextFillColor: 'black !important' } }}
                />

                <TextField
                  fullWidth
                  label="URL Slug"
                  required
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  variant="outlined"
                  sx={{
                    '& .MuiInputBase-input': {
                      color: 'black !important',
                      WebkitTextFillColor: 'black !important', // For WebKit browsers
                    }
                  }}
                />

                <TextField
                  fullWidth
                  label="Short Excerpt"
                  required
                  multiline
                  rows={3}
                  value={formData.excerpt}
                  onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                  helperText="Summarize the article for card previews"
                  sx={{
                    '& .MuiInputBase-input': {
                      color: 'black !important',
                      WebkitTextFillColor: 'black !important',
                    },
                    '& .MuiInputBase-inputMultiline': {
                      color: 'black !important',
                      WebkitTextFillColor: 'black !important',
                    }
                  }}
                />

                <Box>
                  <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600, color: 'text.secondary' }}>Full Content</Typography>
                  <RichTextEditor
                    content={formData.content}
                    onChange={(content) => setFormData({ ...formData, content })}
                    minHeight={500}
                  />
                </Box>
              </Stack>
            </Grid>

            {/* Sidebar Area */}
            <Grid size={{ xs: 12, md: 4 }}>
              <Stack spacing={3}>
                {/* Publishing Settings */}
                <Paper variant="outlined" sx={{ p: 2, bgcolor: '#fbfbfb', borderStyle: 'dashed' }}>
                  <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 700 }}>PUBLISHING SETTINGS</Typography>
                  <Stack spacing={2}>
                    <FormControl fullWidth size="small">
                      <InputLabel id="category-label">Category</InputLabel>
                      <Select
                        labelId="category-label"
                        value={formData.category}
                        label="Category"
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        required
                        sx={{ color: 'text.primary', '& .MuiSelect-select': { color: 'text.primary' } }}
                      >
                        <MenuItem value="Business">Business</MenuItem>
                        <MenuItem value="Technology">Technology</MenuItem>
                        <MenuItem value="Marketing">Marketing</MenuItem>
                        <MenuItem value="Innovation">Innovation</MenuItem>
                        <MenuItem value="Security">Security</MenuItem>
                      </Select>
                    </FormControl>

                    <FormControl fullWidth size="small">
                      <InputLabel id="post-type-label">Post Format</InputLabel>
                      <Select
                        labelId="post-type-label"
                        value={formData.postType}
                        label="Post Format"
                        onChange={(e) => setFormData({ ...formData, postType: e.target.value })}
                        required
                        sx={{ color: 'text.primary', '& .MuiSelect-select': { color: 'text.primary' } }}
                      >
                        <MenuItem value="regular">Regular Article</MenuItem>
                        <MenuItem value="quote">Quote</MenuItem>
                        <MenuItem value="video">Video</MenuItem>
                        <MenuItem value="audio">Audio</MenuItem>
                        <MenuItem value="gallery">Gallery</MenuItem>
                        <MenuItem value="slider">Slider</MenuItem>
                      </Select>
                    </FormControl>

                    <TextField
                      fullWidth
                      size="small"
                      label="Author Name"
                      required
                      value={formData.author}
                      onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                      sx={{ '& .MuiInputBase-input': { color: 'black !important', WebkitTextFillColor: 'black !important' } }}
                    />

                    <TextField
                      fullWidth
                      size="small"
                      label="Publish Date"
                      type="date"
                      required
                      value={formData.publishDate}
                      onChange={(e) => setFormData({ ...formData, publishDate: e.target.value })}
                      InputLabelProps={{ shrink: true }}
                      sx={{ '& .MuiInputBase-input': { color: 'black !important', WebkitTextFillColor: 'black !important' } }}
                    />

                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={formData.isFeatured || false}
                          onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                          color="primary"
                        />
                      }
                      label={<Typography variant="body2">Show on Homepage</Typography>}
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={formData.isService || false}
                          onChange={(e) => setFormData({ ...formData, isService: e.target.checked })}
                          color="primary"
                        />
                      }
                      label={<Typography variant="body2">Show in Services Section</Typography>}
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={formData.isPopularFeed}
                          onChange={(e) => setFormData({ ...formData, isPopularFeed: e.target.checked })}
                          color="primary"
                        />
                      }
                      label={<Typography variant="body2">Mark as Popular</Typography>}
                    />
                  </Stack>
                </Paper>

                {/* Media & Images */}
                <Paper variant="outlined" sx={{ p: 2, bgcolor: '#fbfbfb', borderStyle: 'dashed' }}>
                  <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 700 }}>MEDIA & IMAGES</Typography>
                  <Stack spacing={2}>
                    <Box>
                      <Typography variant="caption" sx={{ mb: 1, display: 'block', color: 'text.secondary' }}>Featured Image</Typography>
                      <Button
                        fullWidth
                        variant="outlined"
                        component="label"
                        startIcon={imageUploading ? <CircularProgress size={16} /> : <CloudUploadIcon />}
                        disabled={imageUploading}
                        size="small"
                        sx={{ mb: 1 }}
                      >
                        {imageUploading ? "Uploading..." : "Upload File"}
                        <input
                          type="file"
                          hidden
                          accept="image/*"
                          onChange={async (e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              const url = await handleImageUpload(file, 'news/images');
                              if (url) setFormData({ ...formData, featuredImage: url });
                            }
                          }}
                        />
                      </Button>
                      <TextField
                        fullWidth
                        size="small"
                        label="Or enter URL"
                        value={formData.featuredImage}
                        onChange={(e) => setFormData({ ...formData, featuredImage: e.target.value })}
                        sx={{ '& .MuiInputBase-input': { color: 'black !important', WebkitTextFillColor: 'black !important' } }}
                      />
                    </Box>

                    {formData.featuredImage && (
                      <Box sx={{ position: 'relative', borderRadius: 1, overflow: 'hidden', border: '1px solid #eeeeee' }}>
                        <img src={formData.featuredImage} alt="Preview" style={{ width: '100%', height: 120, objectFit: 'cover' }} />
                        <IconButton
                          size="small"
                          sx={{ position: 'absolute', top: 5, right: 5, bgcolor: 'rgba(255,255,255,0.8)' }}
                          onClick={() => setFormData({ ...formData, featuredImage: "" })}
                        >
                          <CloseIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    )}

                    {formData.featuredImage && (
                      <TextField
                        fullWidth
                        size="small"
                        label="Alt Text (Optional)"
                        value={formData.featuredImageAlt || ''}
                        onChange={(e) => setFormData({ ...formData, featuredImageAlt: e.target.value })}
                        placeholder="Describe the image"
                        sx={{ mt: 1, '& .MuiInputBase-input': { color: 'black !important', WebkitTextFillColor: 'black !important' } }}
                      />
                    )}

                    {/* Conditional Media Fields */}
                    {formData.postType === 'video' && (
                      <TextField
                        fullWidth
                        size="small"
                        label="Video URL (YouTube/Vimeo)"
                        value={formData.videoUrl}
                        onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
                        placeholder="https://..."
                        sx={{ '& .MuiInputBase-input': { color: 'black !important', WebkitTextFillColor: 'black !important' } }}
                      />
                    )}

                    {formData.postType === 'audio' && (
                      <TextField
                        fullWidth
                        size="small"
                        label="Audio Embed Code"
                        multiline
                        rows={3}
                        value={formData.audioEmbed}
                        onChange={(e) => setFormData({ ...formData, audioEmbed: e.target.value })}
                        placeholder="<iframe>...</iframe>"
                        sx={{
                          '& .MuiInputBase-input': { color: 'black !important', WebkitTextFillColor: 'black !important' },
                          '& .MuiInputBase-inputMultiline': { color: 'black !important', WebkitTextFillColor: 'black !important' }
                        }}
                      />
                    )}

                    {['gallery', 'slider'].includes(formData.postType) && (
                      <Box>
                        <Typography variant="caption" sx={{ mb: 1, display: 'block', color: 'text.secondary' }}>
                          {formData.postType === 'gallery' ? 'Gallery' : 'Slider'} Images
                        </Typography>

                        <Button
                          fullWidth
                          variant="outlined"
                          component="label"
                          startIcon={imageUploading ? <CircularProgress size={16} /> : <CloudUploadIcon />}
                          disabled={imageUploading}
                          size="small"
                          sx={{ mb: 2 }}
                        >
                          Upload Multiple
                          <input
                            type="file"
                            hidden
                            multiple
                            accept="image/*"
                            onChange={async (e) => {
                              const files = e.target.files;
                              if (files && files.length > 0) {
                                const uploadedUrls = await handleGalleryImagesUpload(files);
                                if (uploadedUrls.length > 0) {
                                  const field = formData.postType === 'gallery' ? 'galleryImages' : 'sliderImages';
                                  const existingImages = formData[field] || [];
                                  const newImages = uploadedUrls.map(url => ({ url, alt: '' }));
                                  setFormData({
                                    ...formData,
                                    [field]: [...existingImages, ...newImages]
                                  });
                                }
                              }
                            }}
                          />
                        </Button>

                        <Stack spacing={2}>
                          {((formData.postType === 'gallery' ? formData.galleryImages : formData.sliderImages) || []).map((img: { url: string; alt: string }, index: number) => (
                            <Paper key={index} variant="outlined" sx={{ p: 1.5, position: 'relative' }}>
                              <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'flex-start' }}>
                                {img.url && (
                                  <Box sx={{ width: 60, height: 60, flexShrink: 0, borderRadius: 1, overflow: 'hidden', bgcolor: '#eee' }}>
                                    <img src={img.url} alt="preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                  </Box>
                                )}
                                <Box sx={{ flexGrow: 1 }}>
                                  <TextField
                                    fullWidth
                                    size="small"
                                    label="Image URL"
                                    value={img.url}
                                    onChange={(e) => {
                                      const field = formData.postType === 'gallery' ? 'galleryImages' : 'sliderImages';
                                      const images = [...(formData[field] || [])];
                                      images[index] = { ...images[index], url: e.target.value };
                                      setFormData({ ...formData, [field]: images });
                                    }}
                                    sx={{ mb: 1, '& .MuiInputBase-input': { color: 'black !important', WebkitTextFillColor: 'black !important' } }}
                                  />
                                  <TextField
                                    fullWidth
                                    size="small"
                                    label="Alt Text"
                                    value={img.alt}
                                    placeholder="Description"
                                    onChange={(e) => {
                                      const field = formData.postType === 'gallery' ? 'galleryImages' : 'sliderImages';
                                      const images = [...(formData[field] || [])];
                                      images[index] = { ...images[index], alt: e.target.value };
                                      setFormData({ ...formData, [field]: images });
                                    }}
                                    sx={{ '& .MuiInputBase-input': { color: 'black !important', WebkitTextFillColor: 'black !important' } }}
                                  />
                                </Box>
                              </Box>
                              <IconButton
                                size="small"
                                color="error"
                                onClick={() => {
                                  const field = formData.postType === 'gallery' ? 'galleryImages' : 'sliderImages';
                                  const images = [...(formData[field] || [])];
                                  images.splice(index, 1);
                                  setFormData({ ...formData, [field]: images });
                                }}
                                sx={{ position: 'absolute', top: 5, right: 5, bgcolor: 'rgba(255,255,255,0.8)' }}
                              >
                                <CloseIcon fontSize="small" />
                              </IconButton>
                            </Paper>
                          ))}
                          <Button
                            variant="outlined"
                            fullWidth
                            onClick={() => {
                              const field = formData.postType === 'gallery' ? 'galleryImages' : 'sliderImages';
                              const images = [...(formData[field] || [])];
                              images.push({ url: '', alt: '' });
                              setFormData({ ...formData, [field]: images });
                            }}
                            sx={{ border: '1px dashed #ccc', color: 'text.secondary' }}
                          >
                            + Add Image Manually
                          </Button>
                        </Stack>
                      </Box>
                    )}

                    {formData.postType === 'quote' && (
                      <TextField
                        fullWidth
                        size="small"
                        label="Quote Text"
                        multiline
                        rows={3}
                        value={formData.quoteText}
                        onChange={(e) => setFormData({ ...formData, quoteText: e.target.value })}
                        sx={{
                          '& .MuiInputBase-input': { color: 'black !important', WebkitTextFillColor: 'black !important' },
                          '& .MuiInputBase-inputMultiline': { color: 'black !important', WebkitTextFillColor: 'black !important' }
                        }}
                      />
                    )}
                  </Stack>
                </Paper>

                {/* Extra Metadata */}
                <Paper variant="outlined" sx={{ p: 2, bgcolor: '#fbfbfb', borderStyle: 'dashed' }}>
                  <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 700 }}>PUBLISH SETTINGS</Typography>
                  <Stack spacing={2}>
                    <FormControl fullWidth size="small">
                      <InputLabel>Status</InputLabel>
                      <Select
                        label="Status"
                        value={formData.status || 'published'}
                        onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                      >
                        <MenuItem value="published">Published</MenuItem>
                        <MenuItem value="draft">Draft</MenuItem>
                      </Select>
                    </FormControl>

                    <TextField
                      fullWidth
                      size="small"
                      label="Author Image URL"
                      value={formData.authorImage}
                      onChange={(e) => setFormData({ ...formData, authorImage: e.target.value })}
                      sx={{ '& .MuiInputBase-input': { color: 'black !important', WebkitTextFillColor: 'black !important' } }}
                    />
                    <TextField
                      fullWidth
                      size="small"
                      label="Comments Count"
                      type="number"
                      value={formData.commentsCount}
                      onChange={(e) => setFormData({ ...formData, commentsCount: parseInt(e.target.value) || 0 })}
                      sx={{ '& .MuiInputBase-input': { color: 'black !important', WebkitTextFillColor: 'black !important' } }}
                    />
                    <TextField
                      fullWidth
                      size="small"
                      label="Tags (comma-separated)"
                      value={formData.tags}
                      onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                      placeholder="e.g. Technology, Security"
                      sx={{ '& .MuiInputBase-input': { color: 'black !important', WebkitTextFillColor: 'black !important' } }}
                    />
                  </Stack>
                </Paper>

                {/* Action Buttons */}
                <Stack direction="row" spacing={2} sx={{ pt: 2 }}>
                  <Button
                    fullWidth
                    variant="outlined"
                    onClick={handleCloseEditor}
                    sx={{ py: 1.5, fontWeight: 600 }}
                  >
                    Discard
                  </Button>
                  <Button
                    fullWidth
                    type="submit"
                    variant="contained"
                    disabled={!isDirty}
                    color="primary"
                    sx={{
                      py: 1.5,
                      fontWeight: 700,
                      boxShadow: "0 4px 15px rgba(24, 0, 173, 0.3)",
                      "&.Mui-disabled": {
                        backgroundColor: "rgba(24, 0, 173, 0.5) !important", // Light/Transparent Blue
                        color: "white !important",
                        boxShadow: "none !important",
                        border: "none !important",
                        cursor: "not-allowed !important",
                        pointerEvents: "auto !important" // Required to show the cursor on disabled elements
                      }
                    }}
                  >
                    {editingNews ? "Save Changes" : "Create Post"}
                  </Button>
                </Stack>
              </Stack>
            </Grid>
          </Grid>
        </Box>
      </Paper>


    </Box>
  );
}
