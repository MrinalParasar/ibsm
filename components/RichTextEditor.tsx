"use client";

import { useEditor, EditorContent, ReactNodeViewRenderer } from "@tiptap/react";
import ResizableImage from "./ResizableImage";
import { BubbleMenu } from "@tiptap/react/menus";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import Youtube from "@tiptap/extension-youtube";
import TextAlign from "@tiptap/extension-text-align";
import { BackspaceToParagraph } from "./editor-extensions/BackspaceToParagraph";
import {
    Box,
    IconButton,
    Stack,
    Paper,
    Tooltip,
    TextField,
    Button,
    Popover,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Tabs,
    Tab,
    CircularProgress,
    Typography,
    Divider,
    Select,
    MenuItem,
    FormControl
} from "@mui/material";
import {
    FormatBold,
    FormatItalic,
    FormatUnderlined,
    Link as LinkIcon,
    Title,
    FormatQuote,
    FormatListBulleted,
    FormatListNumbered,
    Image as ImageIcon,
    YouTube as YouTubeIcon,
    CloudUpload as UploadIcon,
    Link as UrlIcon,
    Close as CloseIcon,
    TextFields,
    FormatAlignLeft,
    FormatAlignCenter,
    FormatAlignRight,
    FormatAlignJustify,
    InsertDriveFile as FileIcon
} from "@mui/icons-material";
import { useState, useCallback } from "react";

interface RichTextEditorProps {
    content: string;
    onChange: (content: string) => void;
    placeholder?: string;
    minHeight?: string | number;
}

export default function RichTextEditor({
    content,
    onChange,
    placeholder = "Write something...",
    minHeight = 400
}: RichTextEditorProps) {
    const [linkUrl, setLinkUrl] = useState("");
    const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

    // Image/File Dialog State
    const [showMediaDialog, setShowMediaDialog] = useState(false);
    const [mediaTab, setMediaTab] = useState(0); // 0: Upload Image, 1: Image URL, 2: Upload File
    const [imageUrl, setImageUrl] = useState("");
    const [imageAlt, setImageAlt] = useState("");
    const [fileText, setFileText] = useState("");
    const [isUploading, setIsUploading] = useState(false);

    // Youtube Dialog State
    const [showYoutubeDialog, setShowYoutubeDialog] = useState(false);
    const [youtubeUrl, setYoutubeUrl] = useState("");

    const editor = useEditor({
        immediatelyRender: false,
        extensions: [
            StarterKit,
            Underline,
            TextAlign.configure({
                types: ['heading', 'paragraph'],
            }),
            Link.configure({
                openOnClick: false,
                HTMLAttributes: {
                    class: 'rich-text-link',
                    style: 'color: #1800ad; text-decoration: underline; font-weight: 500;'
                },
            }),
            Image.configure({
                allowBase64: true,
                inline: true,
                HTMLAttributes: {
                    class: 'resizable-image',
                },
            }).extend({
                addNodeView() {
                    return ReactNodeViewRenderer(ResizableImage);
                },
            }),
            Youtube.configure({
                controls: false,
                nocookie: true,
                width: 640,
                height: 480,
                HTMLAttributes: {
                    style: 'max-width: 100%; border-radius: 8px; margin: 1rem 0;',
                },
            }),
            BackspaceToParagraph,
        ],
        content: content,
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML());
        },
        editorProps: {
            attributes: {
                class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl focus:outline-none',
                style: `min-height: ${typeof minHeight === 'number' ? `${minHeight}px` : minHeight}; padding: 1rem;`,
            },
        },
    });

    // --- Link Handling ---
    const setLink = useCallback(() => {
        if (editor) {
            if (linkUrl === "") {
                editor.chain().focus().extendMarkRange("link").unsetLink().run();
            } else {
                editor.chain().focus().setLink({ href: linkUrl }).run();
            }
        }
        setAnchorEl(null);
        setLinkUrl("");
    }, [editor, linkUrl]);

    const handleLinkClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        const previousUrl = editor?.getAttributes("link").href;
        setLinkUrl(previousUrl || "");
        setAnchorEl(event.currentTarget);
    };

    // --- Image Handling ---
    const handleImageUpload = async (file: File) => {
        setIsUploading(true);
        const formData = new FormData();
        formData.append('file', file);
        formData.append('folder', 'news-content'); // Optional: organize in folder

        try {
            const response = await fetch('/api/upload', {
                method: 'POST',
                body: formData,
            });

            if (response.ok) {
                const data = await response.json();
                editor?.chain().focus().setImage({ src: data.url, alt: imageAlt }).run();
                setShowMediaDialog(false);
                setImageAlt("");
            } else {
                alert('Failed to upload image');
            }
        } catch (error) {
            console.error('Error uploading image:', error);
            alert('Error uploading image');
        } finally {
            setIsUploading(false);
        }
    };

    const addImageUrl = () => {
        if (imageUrl) {
            editor?.chain().focus().setImage({ src: imageUrl, alt: imageAlt }).run();
            setShowMediaDialog(false);
            setImageUrl("");
            setImageAlt("");
        }
    };

    // --- File Handling ---
    const handleFileUpload = async (file: File) => {
        setIsUploading(true);
        const formData = new FormData();
        formData.append('file', file);
        formData.append('folder', 'documents');

        try {
            const response = await fetch('/api/upload', {
                method: 'POST',
                body: formData,
            });

            if (response.ok) {
                const data = await response.json();
                // Create a link to the file
                const text = fileText || file.name;
                editor?.chain().focus()
                    .extendMarkRange('link')
                    .setLink({ href: data.url })
                    .insertContent(text)
                    .run();

                setShowMediaDialog(false);
                setFileText("");
            } else {
                alert('Failed to upload file');
            }
        } catch (error) {
            console.error('Error uploading file:', error);
            alert('Error uploading file');
        } finally {
            setIsUploading(false);
        }
    };

    // --- Youtube Handling ---
    const addYoutubeVideo = () => {
        if (youtubeUrl) {
            editor?.chain().focus().setYoutubeVideo({ src: youtubeUrl }).run();
            setShowYoutubeDialog(false);
            setYoutubeUrl("");
        }
    };


    if (!editor) {
        return null;
    }

    return (
        <Box sx={{
            border: '1px solid #eeeeee',
            borderRadius: 1,
            bgcolor: 'white',
            '&:focus-within': {
                borderColor: 'primary.main',
                boxShadow: '0 0 0 1px #1800ad'
            },
            '& .rich-text-link': {
                color: '#1800ad',
                textDecoration: 'underline'
            }
        }}>
            {/* Fixed Toolbar */}
            <Box sx={{
                p: 1,
                borderBottom: '1px solid #eeeeee',
                display: 'flex',
                gap: 0.5,
                flexWrap: 'wrap',
                bgcolor: '#f8f9fa',
                borderTopLeftRadius: 4,
                borderTopRightRadius: 4
            }}>
                <Tooltip title="Bold">
                    <IconButton size="small" onClick={() => editor.chain().focus().toggleBold().run()} color={editor.isActive("bold") ? "primary" : "default"}>
                        <FormatBold fontSize="small" />
                    </IconButton>
                </Tooltip>
                <Tooltip title="Italic">
                    <IconButton size="small" onClick={() => editor.chain().focus().toggleItalic().run()} color={editor.isActive("italic") ? "primary" : "default"}>
                        <FormatItalic fontSize="small" />
                    </IconButton>
                </Tooltip>
                <Tooltip title="Underline">
                    <IconButton size="small" onClick={() => editor.chain().focus().toggleUnderline().run()} color={editor.isActive("underline") ? "primary" : "default"}>
                        <FormatUnderlined fontSize="small" />
                    </IconButton>
                </Tooltip>
                <FormControl size="small" variant="standard" sx={{ minWidth: 120, mx: 1 }}>
                    <Select
                        value={
                            editor.isActive('heading', { level: 1 }) ? 'h1' :
                                editor.isActive('heading', { level: 2 }) ? 'h2' :
                                    editor.isActive('heading', { level: 3 }) ? 'h3' :
                                        editor.isActive('heading', { level: 4 }) ? 'h4' :
                                            'p'
                        }
                        onChange={(e) => {
                            const val = e.target.value;
                            if (val === 'p') editor.chain().focus().setParagraph().run();
                            else if (val === 'h1') editor.chain().focus().toggleHeading({ level: 1 }).run();
                            else if (val === 'h2') editor.chain().focus().toggleHeading({ level: 2 }).run();
                            else if (val === 'h3') editor.chain().focus().toggleHeading({ level: 3 }).run();
                            else if (val === 'h4') editor.chain().focus().toggleHeading({ level: 4 }).run();
                        }}
                        disableUnderline
                        sx={{
                            height: 32,
                            '& .MuiSelect-select': { py: 0.5, fontSize: '0.875rem', fontWeight: 500, color: '#444' }
                        }}
                    >
                        <MenuItem value="p">Paragraph</MenuItem>
                        <MenuItem value="h1" sx={{ fontWeight: 800, fontSize: '1.4rem' }}>Heading 1</MenuItem>
                        <MenuItem value="h2" sx={{ fontWeight: 700, fontSize: '1.2rem' }}>Heading 2</MenuItem>
                        <MenuItem value="h3" sx={{ fontWeight: 600, fontSize: '1.1rem' }}>Heading 3</MenuItem>
                        <MenuItem value="h4" sx={{ fontWeight: 600, fontSize: '1rem' }}>Heading 4</MenuItem>
                    </Select>
                </FormControl>
                <Tooltip title="Bullet List">
                    <IconButton size="small" onClick={() => editor.chain().focus().toggleBulletList().run()} color={editor.isActive("bulletList") ? "primary" : "default"}>
                        <FormatListBulleted fontSize="small" />
                    </IconButton>
                </Tooltip>
                <Tooltip title="Ordered List">
                    <IconButton size="small" onClick={() => editor.chain().focus().toggleOrderedList().run()} color={editor.isActive("orderedList") ? "primary" : "default"}>
                        <FormatListNumbered fontSize="small" />
                    </IconButton>
                </Tooltip>
                <Tooltip title="Blockquote">
                    <IconButton size="small" onClick={() => editor.chain().focus().toggleBlockquote().run()} color={editor.isActive("blockquote") ? "primary" : "default"}>
                        <FormatQuote fontSize="small" />
                    </IconButton>
                </Tooltip>

                <Divider orientation="vertical" flexItem sx={{ mx: 0.5 }} />

                <Tooltip title="Link">
                    <IconButton size="small" onClick={handleLinkClick} color={editor.isActive("link") ? "primary" : "default"}>
                        <LinkIcon fontSize="small" />
                    </IconButton>
                </Tooltip>
                <Tooltip title="Insert Image / File">
                    <IconButton size="small" onClick={() => { setMediaTab(0); setShowMediaDialog(true); }}>
                        <ImageIcon fontSize="small" />
                    </IconButton>
                </Tooltip>
                <Tooltip title="Insert YouTube Video">
                    <IconButton size="small" onClick={() => setShowYoutubeDialog(true)}>
                        <YouTubeIcon fontSize="small" />
                    </IconButton>
                </Tooltip>
            </Box>

            {/* Editor Content */}
            <EditorContent editor={editor} />

            {/* Bubble Menu (Keep for quick text formatting) */}
            {editor && (
                <BubbleMenu editor={editor}>
                    <Paper
                        elevation={3}
                        sx={{
                            p: 0.5,
                            display: 'flex',
                            gap: 0.5,
                            bgcolor: '#1a1a1a',
                            color: 'white',
                            borderRadius: 2
                        }}
                    >
                        <IconButton size="small" onClick={() => editor.chain().focus().toggleBold().run()} sx={{ color: editor.isActive("bold") ? "primary.light" : "white" }}>
                            <FormatBold fontSize="small" />
                        </IconButton>
                        <IconButton size="small" onClick={() => editor.chain().focus().toggleItalic().run()} sx={{ color: editor.isActive("italic") ? "primary.light" : "white" }}>
                            <FormatItalic fontSize="small" />
                        </IconButton>
                        <IconButton size="small" onClick={handleLinkClick} sx={{ color: editor.isActive("link") ? "primary.light" : "white" }}>
                            <LinkIcon fontSize="small" />
                        </IconButton>
                    </Paper>
                </BubbleMenu>
            )}

            {/* Link Popover */}
            <Popover
                open={Boolean(anchorEl)}
                anchorEl={anchorEl}
                onClose={() => setAnchorEl(null)}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                transformOrigin={{ vertical: 'top', horizontal: 'center' }}
                PaperProps={{ sx: { p: 2, width: 300 } }}
            >
                <Stack spacing={2}>
                    <TextField
                        fullWidth
                        size="small"
                        label="URL"
                        value={linkUrl}
                        onChange={(e) => setLinkUrl(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && setLink()}
                        autoFocus
                    />
                    <Stack direction="row" spacing={1} justifyContent="flex-end">
                        {editor.isActive("link") && (
                            <Button size="small" color="error" onClick={() => { editor.chain().focus().unsetLink().run(); setAnchorEl(null); }}>Remove</Button>
                        )}
                        <Button size="small" variant="contained" onClick={setLink}>Apply</Button>
                    </Stack>
                </Stack>
            </Popover>

            {/* Media Dialog (Image & File) */}
            <Dialog open={showMediaDialog} onClose={() => setShowMediaDialog(false)} maxWidth="sm" fullWidth>
                <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    Insert Media
                    <IconButton onClick={() => setShowMediaDialog(false)}><CloseIcon /></IconButton>
                </DialogTitle>
                <DialogContent>
                    <Tabs value={mediaTab} onChange={(_, v) => setMediaTab(v)} sx={{ mb: 2 }}>
                        <Tab icon={<UploadIcon />} label="Upload Image" />
                        <Tab icon={<UrlIcon />} label="Image URL" />
                        <Tab icon={<FileIcon />} label="Upload File" />
                    </Tabs>

                    {/* Tab 0: Upload Image */}
                    {mediaTab === 0 && (
                        <Box sx={{ p: 3, border: '2px dashed #eeeeee', borderRadius: 2, textAlign: 'center', cursor: 'pointer', '&:hover': { bgcolor: '#f5f5f5' } }}>
                            <input
                                type="file"
                                accept="image/*"
                                style={{ display: 'none' }}
                                id="image-upload-input"
                                onChange={(e) => {
                                    if (e.target.files?.[0]) handleImageUpload(e.target.files[0]);
                                }}
                            />
                            <label htmlFor="image-upload-input" style={{ width: '100%', height: '100%', display: 'block', cursor: 'pointer' }}>
                                {isUploading ? (
                                    <CircularProgress size={24} />
                                ) : (
                                    <>
                                        <UploadIcon sx={{ fontSize: 40, color: 'text.secondary', mb: 1 }} />
                                        <Typography color="text.secondary">Click to upload an image</Typography>
                                    </>
                                )}
                            </label>
                        </Box>
                    )}

                    {/* Tab 1: Image URL */}
                    {mediaTab === 1 && (
                        <Stack spacing={2}>
                            <TextField
                                fullWidth
                                label="Image URL"
                                value={imageUrl}
                                onChange={(e) => setImageUrl(e.target.value)}
                                placeholder="https://example.com/image.jpg"
                            />
                        </Stack>
                    )}

                    {/* Tab 2: Upload File */}
                    {mediaTab === 2 && (
                        <Stack spacing={2}>
                            <Box sx={{ p: 3, border: '2px dashed #eeeeee', borderRadius: 2, textAlign: 'center', cursor: 'pointer', '&:hover': { bgcolor: '#f5f5f5' } }}>
                                <input
                                    type="file"
                                    // accept any file
                                    style={{ display: 'none' }}
                                    id="file-upload-input"
                                    onChange={(e) => {
                                        if (e.target.files?.[0]) handleFileUpload(e.target.files[0]);
                                    }}
                                />
                                <label htmlFor="file-upload-input" style={{ width: '100%', height: '100%', display: 'block', cursor: 'pointer' }}>
                                    {isUploading ? (
                                        <CircularProgress size={24} />
                                    ) : (
                                        <>
                                            <FileIcon sx={{ fontSize: 40, color: 'text.secondary', mb: 1 }} />
                                            <Typography color="text.secondary">Click to upload a document (PDF, Doc, etc)</Typography>
                                        </>
                                    )}
                                </label>
                            </Box>
                            <TextField
                                fullWidth
                                label="Link Text (Optional)"
                                value={fileText}
                                onChange={(e) => setFileText(e.target.value)}
                                placeholder="Download Document"
                                helperText="Click insert after selecting text if uploading manually, or upload to insert directly."
                            />
                        </Stack>
                    )}

                    {(mediaTab === 0 || mediaTab === 1) && (
                        <Box sx={{ mt: 2 }}>
                            <TextField
                                fullWidth
                                size="small"
                                label="Alt Text (Optional)"
                                value={imageAlt}
                                onChange={(e) => setImageAlt(e.target.value)}
                                placeholder="Description for accessibility"
                            />
                        </Box>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setShowMediaDialog(false)}>Cancel</Button>
                    {mediaTab === 1 && <Button variant="contained" onClick={addImageUrl}>Insert Image</Button>}
                </DialogActions>
            </Dialog>

            {/* YouTube Dialog */}
            <Dialog open={showYoutubeDialog} onClose={() => setShowYoutubeDialog(false)} maxWidth="sm" fullWidth>
                <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    Insert YouTube Video
                    <IconButton onClick={() => setShowYoutubeDialog(false)}><CloseIcon /></IconButton>
                </DialogTitle>
                <DialogContent>
                    <Typography variant="body2" sx={{ mb: 2, color: 'text.secondary' }}>
                        Paste a YouTube video URL below.
                    </Typography>
                    <TextField
                        fullWidth
                        label="YouTube URL"
                        value={youtubeUrl}
                        onChange={(e) => setYoutubeUrl(e.target.value)}
                        placeholder="https://www.youtube.com/watch?v=..."
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setShowYoutubeDialog(false)}>Cancel</Button>
                    <Button variant="contained" onClick={addYoutubeVideo}>Insert Video</Button>
                </DialogActions>
            </Dialog>

            <style jsx global>{`
        .ProseMirror {
          min-height: ${typeof minHeight === 'number' ? `${minHeight}px` : minHeight};
        }
        .ProseMirror p { margin-bottom: 1em; }
        .ProseMirror h1 { font-size: 2rem; font-weight: 800; margin-top: 1.5em; margin-bottom: 0.5em; color: #1800ad; line-height: 1.2; }
        .ProseMirror h2 { font-size: 1.5rem; font-weight: 700; margin-top: 1.5em; margin-bottom: 0.5em; color: #1800ad; line-height: 1.3; }
        .ProseMirror h3 { font-size: 1.25rem; font-weight: 600; margin-top: 1.2em; margin-bottom: 0.5em; color: #1800ad; line-height: 1.4; }
        .ProseMirror h4 { font-size: 1.1rem; font-weight: 600; margin-top: 1.2em; margin-bottom: 0.5em; color: #1800ad; line-height: 1.5; }
        .ProseMirror ul, .ProseMirror ol { padding-left: 2.5rem; margin-bottom: 1em; }
        .ProseMirror ul { list-style-type: disc; }
        .ProseMirror ol { list-style-type: decimal; }
        .ProseMirror blockquote { border-left: 4px solid #1800ad; padding-left: 1rem; font-style: italic; color: #666; margin: 1em 0; }
        .ProseMirror a { color: #1800ad; text-decoration: underline; cursor: pointer; }
        .ProseMirror img { max-width: 100%; height: auto; border-radius: 8px; margin: 1em 0; }
        .ProseMirror iframe { max-width: 100%; border-radius: 8px; margin: 1em 0; }
      `}</style>
        </Box>
    );
}
