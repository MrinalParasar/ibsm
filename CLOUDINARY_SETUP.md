# Cloudinary Image Upload Setup

## Environment Variables Required

Add these to your `.env.local` file:

```env
# Cloudinary Configuration (REQUIRED)
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Cloudinary Upload Preset (REQUIRED)
# Use NEXT_PUBLIC_ prefix if you need it on client-side, otherwise use without prefix
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=zestpay
# OR
CLOUDINARY_UPLOAD_PRESET=zestpay
```

**Important Notes:**
- `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, and `CLOUDINARY_API_SECRET` are **REQUIRED** for uploads to work
- These should **NOT** have the `NEXT_PUBLIC_` prefix (they're server-side only)
- The upload preset can use `NEXT_PUBLIC_` prefix if needed, but the API will also check `CLOUDINARY_UPLOAD_PRESET`
- After adding these variables, **restart your Next.js development server** for changes to take effect

## Features Implemented

### 1. Career Form CV Upload
- **Location**: `/app/careers/page.tsx`
- **Functionality**: 
  - Users can upload CV files (PDF, DOC, DOCX) up to 5MB
  - Files are uploaded to Cloudinary in the `careers/cv` folder
  - CV URL is stored with the form submission
  - CV can be viewed/downloaded from admin panel

### 2. News Admin Image Upload
- **Location**: `/app/admin/news/page.tsx`
- **Functionality**:
  - **Featured Image**: Upload single image for featured image
  - **Gallery Images**: Upload multiple images for gallery posts
  - **Slider Images**: Upload multiple images for slider posts
  - Images are uploaded to Cloudinary in the `news/images` and `news/gallery` folders
  - Supports both file upload and URL input

## API Endpoints

### `/api/upload` (POST)
Uploads files to Cloudinary.

**Request:**
- `file`: File object (multipart/form-data)
- `folder`: Folder path in Cloudinary (optional, default: 'uploads')
- `preset`: Upload preset name (optional, uses env var if not provided)

**Response:**
```json
{
  "url": "https://res.cloudinary.com/...",
  "public_id": "folder/filename"
}
```

## File Structure

- `lib/cloudinary.ts`: Cloudinary configuration and upload utilities
- `app/api/upload/route.ts`: Upload API endpoint
- `models/FormSubmission.ts`: Updated to include `cvUrl` and `cvFileName`
- `app/careers/page.tsx`: CV upload functionality
- `app/admin/news/page.tsx`: Image upload functionality
- `app/admin/forms/page.tsx`: CV display in admin panel

## Usage

### Career Form CV Upload
1. User selects CV file (PDF, DOC, DOCX)
2. File is validated (max 5MB)
3. On form submit, CV is uploaded to Cloudinary
4. CV URL is saved with the form submission
5. Admin can view/download CV from form details

### News Image Upload
1. Admin clicks "Upload Image" button
2. Selects image file(s)
3. Image(s) are uploaded to Cloudinary
4. URL(s) are automatically filled in the form
5. Admin can also manually enter URLs if needed

## Notes

- All uploads use the Cloudinary upload preset from environment variables
- Files are organized in folders: `careers/cv`, `news/images`, `news/gallery`
- Upload progress is shown to users during upload
- Both file upload and URL input are supported for flexibility

