// src/app/api/spaces-digital-ocean/upload-to-space/route.ts
import { NextResponse } from 'next/server';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

// Debug logging for environment variables
console.log('Environment Check:', {
  endpoint: process.env.NEXT_PUBLIC_DO_SPACE_ENDPOINT,
  accessKeyLength: process.env.NEXT_PUBLIC_DO_SPACE_ACCESS_KEY?.length,
  secretKeyLength: process.env.NEXT_PUBLIC_DO_SPACE_SECRET_KEY?.length,
});

// Initialize S3 client with credentials - simplified configuration
const s3Client = new S3Client({
  endpoint: process.env.NEXT_PUBLIC_DO_SPACE_ENDPOINT,
  region: 'sgp1',
  forcePathStyle: false,
  credentials: {
    accessKeyId: process.env.NEXT_PUBLIC_DO_SPACE_ACCESS_KEY!,
    secretAccessKey: process.env.NEXT_PUBLIC_DO_SPACE_SECRET_KEY!,
  },
});

export async function POST(request: Request) {
  try {
    // Get the file from the request
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Get folder path from query params or use default
    const folderPath = formData.get('folderPath') as string || 'uniform/uploads';

    // Log file details
    console.log('File details:', {
      name: file.name,
      type: file.type,
      size: file.size,
      folderPath,
    });

    // Convert file to buffer
    const buffer = await file.arrayBuffer();

    // Generate unique filename - sanitize to remove problematic characters
    const timestamp = new Date().getTime();
    const sanitizedName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
    const fileName = `${timestamp}-${sanitizedName}`;
    const key = `${folderPath}/${fileName}`;

    // Log upload attempt details
    console.log('Upload attempt:', {
      bucket: 'bucket-titianbakat-ai-project',
      key: key,
      contentType: file.type || 'application/octet-stream',
      bufferSize: buffer.byteLength,
    });

    // Determine content type (with fallback for generic binary files)
    const contentType = file.type || 'application/octet-stream';

    // Create upload command
    const command = new PutObjectCommand({
      Bucket: 'bucket-titianbakat-ai-project',
      Key: key,
      Body: Buffer.from(buffer),
      ContentType: contentType,
      ACL: 'public-read',
    });

    // Attempt upload
    const result = await s3Client.send(command);

    // Log successful upload
    console.log('Upload result:', {
      status: result.$metadata.httpStatusCode,
      requestId: result.$metadata.requestId,
    });

    return NextResponse.json({
      success: true,
      message: 'File uploaded successfully',
      fileName: fileName,
      url: `https://bucket-titianbakat-ai-project.sgp1.digitaloceanspaces.com/${key}`,
      path: key,
    });
  } catch (error) {
    // Enhanced error logging
    console.error('Upload error details:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      code: (error as { Code?: string }).Code,
      resource: (error as { Resource?: string }).Resource,
      requestId: (error as { RequestId?: string }).RequestId,
      metadata: (error as { $metadata?: unknown }).$metadata,
      stack: error instanceof Error ? error.stack : undefined,
    });

    return NextResponse.json(
      {
        error: 'Error uploading file',
        details: error instanceof Error ? error.message : 'Unknown error',
        code: (error as { Code?: string }).Code,
      },
      { status: 500 }
    );
  }
}