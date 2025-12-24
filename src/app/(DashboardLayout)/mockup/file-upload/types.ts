// src/app/(DashboardLayout)/mockup/file-upload/types.ts

export interface UploadedFile {
  fileName: string;
  filePath: string;
  fileUrl: string;
  fileType: string;
  uploadDate: Date;
}

export interface FileUploadResponse {
  success: boolean;
  message: string;
  fileName: string;
  url: string;
  path: string;
}
