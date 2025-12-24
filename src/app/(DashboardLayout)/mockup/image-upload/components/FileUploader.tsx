// src/app/(DashboardLayout)/mockup/spaces-digital-ocean/components/FileUploader.tsx
'use client';

import React, { useState, useRef } from 'react';
import { Upload, X, FileWarning, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ACCEPTED_FILE_TYPES, MAX_FILE_SIZE, API_ENDPOINTS, ERROR_MESSAGES } from '../data';
import { UploadStatus, FileUploadResponse, FileInfo } from './types';

interface FileUploaderProps {
  onUploadSuccess: (fileInfo: FileInfo) => void;
}

/**
 * Component for uploading files to Digital Ocean Spaces
 * Simplified implementation based on working project example
 */
const FileUploader: React.FC<FileUploaderProps> = ({ onUploadSuccess }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadStatus, setUploadStatus] = useState<UploadStatus>('idle');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handler for file selection
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    setErrorMessage('');

    if (!files || files.length === 0) {
      return;
    }

    const file = files[0];

    // Validate file type
    if (!Object.keys(ACCEPTED_FILE_TYPES).includes(file.type)) {
      setErrorMessage(ERROR_MESSAGES.INVALID_FILE_TYPE);
      return;
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      setErrorMessage(ERROR_MESSAGES.FILE_TOO_LARGE);
      return;
    }

    setSelectedFile(file);
  };

  // Handler for the upload button
  const handleUpload = async () => {
    if (!selectedFile) {
      setErrorMessage(ERROR_MESSAGES.NO_FILE_SELECTED);
      return;
    }

    setUploadStatus('uploading');
    setErrorMessage('');

    try {
      // Create FormData
      const formData = new FormData();
      formData.append('file', selectedFile);

      // Simple fetch approach without abort controllers or timeouts
      const response = await fetch(API_ENDPOINTS.UPLOAD, {
        method: 'POST',
        body: formData,
      });

      // Process response
      if (!response.ok) {
        throw new Error(`Upload failed with status ${response.status}`);
      }

      const data = await response.json() as FileUploadResponse;

      // Create file info with current timestamp
      const fileInfo: FileInfo = {
        fileName: data.fileName,
        url: data.url,
        path: data.path,
        uploadTime: new Date()
      };

      // Pass the uploaded file info to the parent component
      onUploadSuccess(fileInfo);
      
      // Reset form
      setSelectedFile(null);
      setUploadStatus('success');
      
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      console.error('Upload error:', error);
      setUploadStatus('error');
      setErrorMessage(error instanceof Error ? error.message : ERROR_MESSAGES.UNKNOWN_ERROR);
    }
  };

  // Reset the form
  const handleReset = () => {
    setSelectedFile(null);
    setUploadStatus('idle');
    setErrorMessage('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Format file size for display
  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' bytes';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
  };

  // Get accepted file extensions for display
  const acceptedExtensions = Object.values(ACCEPTED_FILE_TYPES).flat().join(', ');

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="h-5 w-5" />
          Upload Image to Digital Ocean Spaces
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* File input with drag & drop area */}
          <div 
            className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors
              ${selectedFile ? 'border-green-500 bg-green-50 dark:bg-green-900/20' : 'border-gray-300 hover:border-gray-400 dark:border-gray-700 dark:hover:border-gray-600'}
              ${errorMessage ? 'border-red-500 bg-red-50 dark:bg-red-900/20' : ''}
            `}
            onClick={() => fileInputRef.current?.click()}
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept={Object.keys(ACCEPTED_FILE_TYPES).join(',')}
              className="hidden"
              disabled={uploadStatus === 'uploading'}
            />
            
            {selectedFile ? (
              <div className="space-y-2">
                <p className="text-sm font-medium">Selected file:</p>
                <p className="text-sm font-bold truncate">{selectedFile.name}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {formatFileSize(selectedFile.size)}
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                <Upload className="h-8 w-8 mx-auto text-gray-400" />
                <p className="text-sm font-medium">
                  Drag and drop or click to select a file
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Accepted formats: {acceptedExtensions}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Maximum size: {MAX_FILE_SIZE / (1024 * 1024)}MB
                </p>
              </div>
            )}
          </div>

          {/* Error message */}
          {errorMessage && (
            <Alert variant="destructive" className="mt-4">
              <FileWarning className="h-4 w-4" />
              <AlertDescription>
                {errorMessage}
              </AlertDescription>
            </Alert>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" size="sm" onClick={handleReset} disabled={uploadStatus === 'uploading'}>
          <X className="mr-2 h-4 w-4" />
          Clear
        </Button>
        <Button 
          onClick={handleUpload} 
          disabled={!selectedFile || uploadStatus === 'uploading'}
          className="ml-2"
        >
          {uploadStatus === 'uploading' ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Uploading...
            </>
          ) : (
            <>
              <Upload className="mr-2 h-4 w-4" />
              Upload
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default FileUploader;
