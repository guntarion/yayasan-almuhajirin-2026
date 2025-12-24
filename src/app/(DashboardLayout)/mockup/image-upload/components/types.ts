// src/app/(DashboardLayout)/mockup/spaces-digital-ocean/components/types.ts
/**
 * Type definitions for the Digital Ocean Spaces components
 */

// Type for the file upload response from the API
export interface FileUploadResponse {
  success: boolean;
  message: string;
  fileName: string;
  url: string;
  path: string;
}

// Type for file deletion response from the API
export interface FileDeleteResponse {
  success: boolean;
  message: string;
}

// Type for file information display
export interface FileInfo {
  fileName: string;
  url: string;
  path: string;
  uploadTime: Date;
}

// Type for upload state management
export type UploadStatus = 'idle' | 'uploading' | 'success' | 'error';

// Error response type
export interface ErrorResponse {
  error: string;
  details?: string;
  code?: string;
}
