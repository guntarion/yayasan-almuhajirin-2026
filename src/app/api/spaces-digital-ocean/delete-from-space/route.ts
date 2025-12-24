// src/app/api/spaces-digital-ocean/delete-from-space/route.ts
import { NextResponse } from 'next/server';
import { S3Client, DeleteObjectCommand } from '@aws-sdk/client-s3';

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
    // Get file path from request body
    const { filePath } = await request.json();

    if (!filePath) {
      return NextResponse.json({ error: 'File path is required' }, { status: 400 });
    }

    // Log deletion attempt
    console.log('Attempting to delete file:', {
      bucket: 'bucket-titianbakat-ai-project',
      key: filePath,
    });

    // Create delete command
    const command = new DeleteObjectCommand({
      Bucket: 'bucket-titianbakat-ai-project',
      Key: filePath,
    });

    // Execute delete command
    const response = await s3Client.send(command);

    // Log successful deletion
    console.log('File deleted successfully:', {
      filePath,
      response: response.$metadata,
    });

    return NextResponse.json({
      success: true,
      message: 'File deleted successfully',
    });
  } catch (error) {
    // Log error details
    console.error('Error deleting file:', {
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      metadata: (error as { $metadata?: unknown }).$metadata,
    });

    return NextResponse.json(
      {
        error: 'Failed to delete file',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}