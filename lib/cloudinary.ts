import { v2 as cloudinary } from 'cloudinary';

// Validate required environment variables
if (!process.env.CLOUDINARY_CLOUD_NAME) {
  console.warn('Warning: CLOUDINARY_CLOUD_NAME is not set');
}
if (!process.env.CLOUDINARY_API_KEY) {
  console.warn('Warning: CLOUDINARY_API_KEY is not set');
}
if (!process.env.CLOUDINARY_API_SECRET) {
  console.warn('Warning: CLOUDINARY_API_SECRET is not set');
}

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || '',
  api_key: process.env.CLOUDINARY_API_KEY || '',
  api_secret: process.env.CLOUDINARY_API_SECRET || '',
});

export default cloudinary;


export async function uploadBufferToCloudinary(
  buffer: Buffer,
  folder: string,
  preset?: string,
  filename?: string
): Promise<{ secure_url: string; public_id: string }> {
  // Validate Cloudinary configuration
  if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
    throw new Error('Cloudinary configuration is missing. Please set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET in your environment variables.');
  }

  return new Promise((resolve, reject) => {
    const uploadOptions: any = {
      folder,
      resource_type: 'auto',
    };

    if (preset) {
      uploadOptions.upload_preset = preset;
    }

    if (filename) {
      // Remove extension from filename for public_id
      const nameWithoutExt = filename.replace(/\.[^/.]+$/, '');
      uploadOptions.public_id = nameWithoutExt;
    }

    const uploadStream = cloudinary.uploader.upload_stream(
      uploadOptions,
      (error, result) => {
        if (error) {
          reject(error);
        } else if (result) {
          resolve({
            secure_url: result.secure_url,
            public_id: result.public_id,
          });
        } else {
          reject(new Error('Upload failed'));
        }
      }
    );

    uploadStream.end(buffer);
  });
}

