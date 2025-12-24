// src/app/api/spaces-digital-ocean/check-connection/route.ts
import { NextResponse } from 'next/server';
import { S3Client, HeadBucketCommand, ListObjectsV2Command } from '@aws-sdk/client-s3';

export async function POST(request: Request) {
  try {
    console.log('Running Digital Ocean Spaces connection diagnostic check');
    
    // Extract bucket and region from request if provided
    const body = await request.json().catch(() => ({}));
    const bucket = body.bucket || 'bucket-titianbakat-ai-project';
    const region = body.region || 'sgp1';
    
    // Get environment variables for diagnostics
    const endpoint = process.env.NEXT_PUBLIC_DO_SPACE_ENDPOINT;
    const accessKey = process.env.NEXT_PUBLIC_DO_SPACE_ACCESS_KEY;
    const secretKey = process.env.NEXT_PUBLIC_DO_SPACE_SECRET_KEY;
    
    // Basic environment check
    const envCheck = {
      endpoint: endpoint ? 'configured' : 'missing',
      accessKey: accessKey ? 'configured' : 'missing',
      secretKey: secretKey ? 'configured' : 'missing',
    };
    
    console.log('Environment check:', envCheck);
    
    // Check if required environment variables are defined
    if (!endpoint || !accessKey || !secretKey) {
      return NextResponse.json({
        success: false,
        error: 'Missing required Digital Ocean Spaces credentials',
        details: {
          envCheck,
          bucket,
          region,
          error: 'One or more required environment variables are missing',
        }
      }, { status: 400 });
    }
    
    // Initialize S3 client with explicit configuration
    const s3Client = new S3Client({
      endpoint: endpoint,
      region: region,
      credentials: {
        accessKeyId: accessKey,
        secretAccessKey: secretKey,
      },
      // Set a more reasonable timeout
      requestHandler: {
        timeoutInMs: 10000, // 10 seconds
      },
    });
    
    console.log('Checking bucket accessibility:', bucket);
    
    // Step 1: Check if the bucket exists and is accessible
    try {
      const headCommand = new HeadBucketCommand({ Bucket: bucket });
      const headResult = await s3Client.send(headCommand);
      
      console.log('Bucket exists and is accessible:', {
        status: headResult.$metadata.httpStatusCode,
        requestId: headResult.$metadata.requestId,
      });
      
      // Step 2: Try to list a few objects in the bucket
      const listCommand = new ListObjectsV2Command({
        Bucket: bucket,
        MaxKeys: 3, // Limit the number of objects to return
        Prefix: 'uniform/aset-desain/', // Use the appropriate folder path
      });
      
      const listResult = await s3Client.send(listCommand);
      
      console.log('Successfully listed objects:', {
        count: listResult.Contents?.length || 0,
        status: listResult.$metadata.httpStatusCode,
        requestId: listResult.$metadata.requestId,
      });
      
      return NextResponse.json({
        success: true,
        message: 'Connection to Digital Ocean Spaces is working properly',
        details: {
          bucket,
          region,
          endpoint,
          bucketExists: true,
          objectCount: listResult.Contents?.length || 0,
          objectsListed: listResult.Contents?.map(obj => ({
            key: obj.Key,
            size: obj.Size,
            lastModified: obj.LastModified,
          })) || [],
          metadata: {
            headBucket: headResult.$metadata,
            listObjects: listResult.$metadata,
          },
        },
      });
    } catch (error) {
      console.error('Bucket access check failed:', error);
      
      // Determine the specific error type
      let errorType = 'unknown';
      let errorMessage = error instanceof Error ? error.message : 'Unknown error';
      
      if (error instanceof Error) {
        if (error.name === 'NoSuchBucket') {
          errorType = 'no_such_bucket';
          errorMessage = `Bucket '${bucket}' does not exist`;
        } else if (error.name === 'AccessDenied') {
          errorType = 'access_denied';
          errorMessage = 'Access denied to the bucket (check credentials and permissions)';
        } else if (error.name === 'NetworkingError' || error.message?.includes('network')) {
          errorType = 'network_error';
          errorMessage = 'Network error connecting to Digital Ocean Spaces';
        } else if (error.name === 'CredentialsProviderError' || error.message?.includes('credentials')) {
          errorType = 'credentials_error';
          errorMessage = 'Invalid credentials for Digital Ocean Spaces';
        } else if (error.name === 'TimeoutError' || error.message?.includes('timeout')) {
          errorType = 'timeout';
          errorMessage = 'Connection to Digital Ocean Spaces timed out';
        }
      }
      
      return NextResponse.json({
        success: false,
        error: errorMessage,
        details: {
          envCheck,
          bucket,
          region,
          endpoint,
          errorType,
          errorName: error instanceof Error ? error.name : 'Unknown',
          errorMessage: error instanceof Error ? error.message : 'Unknown error',
          errorCode: (error as { Code?: string }).Code,
          errorStack: process.env.NODE_ENV === 'development' && error instanceof Error ? error.stack : undefined,
        },
      }, { status: 500 });
    }
  } catch (error) {
    console.error('Connection diagnostic check error:', error);
    
    return NextResponse.json({
      success: false,
      error: 'Failed to run connection diagnostic',
      details: {
        errorMessage: error instanceof Error ? error.message : 'Unknown error',
        errorStack: process.env.NODE_ENV === 'development' && error instanceof Error ? error.stack : undefined,
      },
    }, { status: 500 });
  }
}