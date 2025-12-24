// src/app/(DashboardLayout)/mockup/spaces-digital-ocean/page.tsx
// Notice that it only works on deployment (vercel) - it's not working on Localhost
'use client';

import React, { useState } from 'react';
import { CloudIcon } from 'lucide-react';
import CommonBreadcrumb from '@/components/shared/CommonBreadcrumb';
import CommonCardHeader from '@/components/shared/CommonCardHeader';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { FileUploader, FileDisplay, EmptyState } from './components';
import { FileInfo } from './components/types';

/**
 * Digital Ocean Spaces Mockup Page
 *
 * This page demonstrates upload, display, download, and delete functionality
 * using Digital Ocean Spaces as an S3-compatible storage service.
 *
 * Simplified implementation based on working project example.
 */
const SpacesDigitalOceanPage = () => {
  // State to track the currently uploaded file
  const [uploadedFile, setUploadedFile] = useState<FileInfo | null>(null);
  const [successMessage, setSuccessMessage] = useState<string>('');

  /**
   * Handle successful file upload
   */
  const handleUploadSuccess = (fileInfo: FileInfo) => {
    setUploadedFile(fileInfo);
    setSuccessMessage('File uploaded successfully! You can now download or delete it.');

    // Clear success message after 5 seconds
    setTimeout(() => {
      setSuccessMessage('');
    }, 5000);
  };

  /**
   * Handle file deletion
   */
  const handleFileDeleted = () => {
    setUploadedFile(null);
    setSuccessMessage('File deleted successfully!');

    // Clear success message after 5 seconds
    setTimeout(() => {
      setSuccessMessage('');
    }, 5000);
  };

  return (
    <>
      <CommonBreadcrumb pageTitle='Digital Ocean Spaces' parent='Mockup' />
      <div className='container mx-auto px-4'>
        <div className='grid grid-cols-1 gap-6'>
          {/* Page header */}
          <div className='col-span-1'>
            <div className='rounded-lg bg-white dark:bg-gray-800 shadow-md'>
              <div className='flex items-center p-6 border-b border-gray-200 dark:border-gray-700'>
                <CloudIcon className='h-6 w-6 text-blue-500 mr-3' />
                <div>
                  <CommonCardHeader
                    heading='Digital Ocean Spaces Mockup'
                    subHeading={[
                      {
                        text: 'This page demonstrates upload, display, download, and delete functionality for image files using Digital Ocean Spaces',
                      },
                    ]}
                  />
                </div>
              </div>
              <div className='p-6'>
                <p className='text-gray-600 dark:text-gray-300 mb-4'>
                  This is a mockup page to test S3-compatible Digital Ocean Spaces functionality. You can upload image files, view them, download
                  them, and delete them. No database storage is used; all operations interact directly with the Digital Ocean Spaces bucket.
                </p>

                {/* Success message */}
                {successMessage && (
                  <Alert className='mb-6 bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-200 border-green-200 dark:border-green-800'>
                    <AlertDescription>{successMessage}</AlertDescription>
                  </Alert>
                )}
              </div>
            </div>
          </div>

          {/* File uploader */}
          <div className='col-span-1'>
            <FileUploader onUploadSuccess={handleUploadSuccess} />
          </div>

          <Separator className='my-2' />

          {/* File display or empty state */}
          <div className='col-span-1'>{uploadedFile ? <FileDisplay fileInfo={uploadedFile} onDelete={handleFileDeleted} /> : <EmptyState />}</div>
        </div>
      </div>
    </>
  );
};

export default SpacesDigitalOceanPage;
