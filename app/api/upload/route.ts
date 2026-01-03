import { NextRequest, NextResponse } from 'next/server';
import { uploadBufferToCloudinary } from '@/lib/cloudinary';

export async function POST(request: NextRequest) {
  try {
    // Validate Cloudinary configuration
    if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
      return NextResponse.json(
        { 
          error: 'Cloudinary configuration is missing',
          details: 'Please set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET in your environment variables'
        },
        { status: 500 }
      );
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;
    const folder = formData.get('folder') as string || 'uploads';
    // Check both NEXT_PUBLIC_ and regular env var for preset
    const preset = (formData.get('preset') as string) || 
                   process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || 
                   process.env.CLOUDINARY_UPLOAD_PRESET;

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    // Convert File to Buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Upload to Cloudinary
    const result = await uploadBufferToCloudinary(
      buffer,
      folder,
      preset,
      file.name.replace(/\.[^/.]+$/, '') // Remove extension for public_id
    );

    return NextResponse.json(
      {
        url: result.secure_url,
        public_id: result.public_id,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Failed to upload file', details: error.message },
      { status: 500 }
    );
  }
}

