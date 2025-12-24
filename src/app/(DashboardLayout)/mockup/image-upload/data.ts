// src/app/(DashboardLayout)/mockup/spaces-digital-ocean/data.ts
/**
 * Data and constants for the Digital Ocean Spaces mockup page
 */

// Accepted file types for upload
export const ACCEPTED_FILE_TYPES = {
  'image/jpeg': ['.jpg', '.jpeg'],
  'image/png': ['.png'],
  'image/gif': ['.gif'],
  'image/webp': ['.webp'],
  'image/svg+xml': ['.svg'],
};

// Maximum file size in bytes (5MB)
export const MAX_FILE_SIZE = 5 * 1024 * 1024;

// API endpoints
export const API_ENDPOINTS = {
  UPLOAD: '/api/spaces-digital-ocean/upload-to-space',
  DELETE: '/api/spaces-digital-ocean/delete-from-space',
};

// Error messages
export const ERROR_MESSAGES = {
  FILE_TOO_LARGE: `File size exceeds the maximum limit of ${MAX_FILE_SIZE / (1024 * 1024)}MB`,
  INVALID_FILE_TYPE: 'Invalid file type. Please upload an image file',
  NO_FILE_SELECTED: 'Please select a file to upload',
  UPLOAD_FAILED: 'Failed to upload file. Please try again',
  DELETE_FAILED: 'Failed to delete file. Please try again',
  UNKNOWN_ERROR: 'An unknown error occurred',
};

// Success messages
export const SUCCESS_MESSAGES = {
  UPLOAD_SUCCESS: 'File uploaded successfully',
  DELETE_SUCCESS: 'File deleted successfully',
};

// Digital Ocean Spaces related information
export const DO_SPACES_INFO = {
  BUCKET_NAME: 'bucket-titianbakat-ai-project',
  REGION: 'sgp1',
  CDN_BASE_URL: 'https://bucket-titianbakat-ai-project.sgp1.digitaloceanspaces.com',
  FOLDER_PATH: 'uniform/aset-desain',
};
