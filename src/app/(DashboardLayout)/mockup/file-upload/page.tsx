// src/app/(DashboardLayout)/mockup/file-upload/page.tsx
// Notice that it only works on deployment (vercel) - it's not working on Localhost
'use client';

import React, { useState } from 'react';
import { FolderUp } from 'lucide-react';
import CommonBreadcrumb from '@/components/shared/CommonBreadcrumb';
import CommonCardHeader from '@/components/shared/CommonCardHeader';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import FileUploader from './components/FileUploader';
import FileList from './components/FileList';
import { UploadedFile } from './types';
import { DO_SPACES_INFO } from './data';

/**
 * File Upload Page
 *
 * This page demonstrates general file upload functionality with Digital Ocean Spaces.
 * Users can upload various file types, view the uploads, and delete files.
 */
const FileUploadPage = () => {
  // State to track uploaded files
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  /**
   * Handle successful file upload
   */
  const handleFileUploaded = (newFile: UploadedFile) => {
    setUploadedFiles((prev) => [...prev, newFile]);
    setMessage({
      text: `File "${newFile.fileName}" uploaded successfully!`,
      type: 'success',
    });

    // Clear success message after 5 seconds
    setTimeout(() => {
      setMessage(null);
    }, 5000);
  };

  /**
   * Handle file deletion
   */
  const handleFileDeleted = (filePath: string) => {
    // Find the deleted file to get its name for the message
    const deletedFile = uploadedFiles.find((file) => file.filePath === filePath);

    // Update state to remove the deleted file
    setUploadedFiles((prev) => prev.filter((file) => file.filePath !== filePath));

    // Show success message
    setMessage({
      text: `File "${deletedFile?.fileName || 'selected'}" deleted successfully.`,
      type: 'success',
    });

    // Clear success message after 5 seconds
    setTimeout(() => {
      setMessage(null);
    }, 5000);
  };

  return (
    <>
      <CommonBreadcrumb pageTitle='File Upload Demo' parent='Mockup' />
      <div className='container mx-auto px-4'>
        <div className='grid grid-cols-1 gap-6'>
          {/* Page header */}
          <div className='col-span-1'>
            <div className='rounded-lg bg-white dark:bg-gray-800 shadow-md'>
              <div className='flex items-center p-6 border-b border-gray-200 dark:border-gray-700'>
                <FolderUp className='h-6 w-6 text-blue-500 mr-3' />
                <div>
                  <CommonCardHeader
                    heading='Digital Ocean Spaces File Upload'
                    subHeading={[{ text: 'Upload, manage, and delete files using Digital Ocean Spaces as storage' }]}
                  />
                </div>
              </div>
              <div className='p-6'>
                <p className='text-gray-600 dark:text-gray-300 mb-4'>
                  This is a mockup page to test file upload functionality with Digital Ocean Spaces. You can upload various file types, view them, and
                  delete them as needed. Files are stored in the{' '}
                  <code className='bg-gray-100 dark:bg-gray-700 px-1 py-0.5 rounded'>{DO_SPACES_INFO.FOLDER_PATH}</code> folder of the{' '}
                  <code className='bg-gray-100 dark:bg-gray-700 px-1 py-0.5 rounded'>{DO_SPACES_INFO.BUCKET_NAME}</code> bucket.
                </p>

                {/* Message alert */}
                {message && (
                  <Alert
                    className={`mb-6 ${
                      message.type === 'success'
                        ? 'bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-200 border-green-200 dark:border-green-800'
                        : 'bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-200 border-red-200 dark:border-red-800'
                    }`}
                  >
                    <AlertDescription>{message.text}</AlertDescription>
                  </Alert>
                )}
              </div>
            </div>
          </div>

          {/* File uploader */}
          <div className='col-span-1'>
            <FileUploader uploadedFiles={uploadedFiles} onFileUploaded={handleFileUploaded} maxFiles={5} />
          </div>

          <Separator className='my-2' />

          {/* File list */}
          <div className='col-span-1'>
            <FileList files={uploadedFiles} onFileDeleted={handleFileDeleted} />
          </div>
        </div>
      </div>
    </>
  );
};

export default FileUploadPage;
