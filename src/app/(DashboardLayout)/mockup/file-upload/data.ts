// src/app/(DashboardLayout)/mockup/file-upload/data.ts

// Maximum file size in bytes (25MB)
export const MAX_FILE_SIZE = 25 * 1024 * 1024;

// Accepted file types for upload
export const ACCEPTED_FILE_TYPES = [
  '.pdf', '.doc', '.docx', 
  '.xls', '.xlsx', 
  '.jpg', '.jpeg', '.png', 
  '.gif', '.svg',
  '.txt', '.csv', '.zip'
];

// Digital Ocean Spaces related information
export const DO_SPACES_INFO = {
  BUCKET_NAME: 'bucket-titianbakat-ai-project',
  REGION: 'sgp1',
  BASE_URL: 'https://bucket-titianbakat-ai-project.sgp1.digitaloceanspaces.com',
  FOLDER_PATH: 'uniform/uploads',
};

// API endpoints
export const API_ENDPOINTS = {
  UPLOAD: '/api/spaces-digital-ocean/upload-to-space',
  DELETE: '/api/spaces-digital-ocean/delete-from-space',
};
