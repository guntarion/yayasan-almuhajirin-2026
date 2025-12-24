// src/app/(DashboardLayout)/mockup/file-upload/components/FileUploader.tsx
'use client';

import React, { useState, useRef } from 'react';
import { Upload, FileWarning, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ACCEPTED_FILE_TYPES, MAX_FILE_SIZE, API_ENDPOINTS } from '../data';
import { UploadedFile } from '../types';

interface FileUploaderProps {
  uploadedFiles: UploadedFile[];
  onFileUploaded: (file: UploadedFile) => void;
  maxFiles?: number;
}

/**
 * A component for selecting and uploading files to Digital Ocean Spaces
 */
const FileUploader: React.FC<FileUploaderProps> = ({ uploadedFiles, onFileUploaded, maxFiles = 3 }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [fileSizeError, setFileSizeError] = useState(false);
  const [error, setError] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle file selection from input
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    setFileSizeError(false);
    setError('');

    if (file) {
      // Check file size
      if (file.size > MAX_FILE_SIZE) {
        setFileSizeError(true);
        event.target.value = '';
        return;
      }
      setSelectedFile(file);
    }
  };

  // Handle file upload to Digital Ocean Spaces
  const handleFileUpload = async () => {
    if (!selectedFile) return;

    try {
      setUploading(true);
      setError('');

      // Create FormData
      const formData = new FormData();
      formData.append('file', selectedFile);

      // Upload file to DigitalOcean Space
      const response = await fetch(API_ENDPOINTS.UPLOAD, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Upload failed with status ${response.status}`);
      }

      const data = await response.json();

      // Create new file object
      const newFile: UploadedFile = {
        fileName: selectedFile.name,
        filePath: data.path,
        fileUrl: data.url,
        fileType: selectedFile.type,
        uploadDate: new Date(),
      };

      // Notify parent component
      onFileUploaded(newFile);

      // Reset file input
      setSelectedFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      console.error('Upload error:', error);
      setError('Failed to upload file. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  // Format file size for display
  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' bytes';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
  };

  // Check if max files limit is reached
  const isMaxFilesReached = uploadedFiles.length >= maxFiles;

  return (
    <Card className='w-full'>
      <CardHeader>
        <CardTitle className='flex items-center gap-2 text-lg'>
          <Upload className='h-5 w-5' />
          Upload Files
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className='space-y-4'>
          {/* File input field */}
          <div className='flex flex-wrap gap-2 items-center'>
            <div className='flex-1'>
              <Input
                ref={fileInputRef}
                type='file'
                onChange={handleFileSelect}
                accept={ACCEPTED_FILE_TYPES.join(',')}
                disabled={isMaxFilesReached || uploading}
                className='max-w-md'
              />
            </div>
            <Button onClick={handleFileUpload} disabled={!selectedFile || uploading || isMaxFilesReached}>
              {uploading ? (
                <>
                  <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                  Uploading...
                </>
              ) : (
                'Upload'
              )}
            </Button>
          </div>

          {/* File selection info */}
          {selectedFile && (
            <div className='text-sm'>
              <p>
                <span className='font-medium'>Selected file:</span> {selectedFile.name}
              </p>
              <p>
                <span className='font-medium'>Size:</span> {formatFileSize(selectedFile.size)}
              </p>
              <p>
                <span className='font-medium'>Type:</span> {selectedFile.type || 'Unknown'}
              </p>
            </div>
          )}

          {/* Error messages */}
          {fileSizeError && (
            <Alert variant='destructive'>
              <FileWarning className='h-4 w-4' />
              <AlertDescription>File size exceeds the maximum limit of {MAX_FILE_SIZE / (1024 * 1024)}MB.</AlertDescription>
            </Alert>
          )}

          {error && (
            <Alert variant='destructive'>
              <FileWarning className='h-4 w-4' />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {isMaxFilesReached && (
            <Alert className='bg-amber-50 text-amber-800 border-amber-300 dark:bg-amber-900/20 dark:text-amber-300 dark:border-amber-800'>
              <AlertDescription>Maximum number of files ({maxFiles}) reached. Delete existing files to upload more.</AlertDescription>
            </Alert>
          )}

          {/* Help text */}
          <div className='text-xs text-gray-500 dark:text-gray-400'>
            <p>Accepted file types: PDF, Word, Excel, images and more</p>
            <p>Maximum file size: {MAX_FILE_SIZE / (1024 * 1024)}MB</p>
            <p>Maximum files: {maxFiles}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default FileUploader;
