// src/app/(DashboardLayout)/mockup/file-upload/components/FileList.tsx
'use client';

import React, { useState } from 'react';
import { FileType2, FileText, FileImage, FileSpreadsheet, FileArchive, File, Trash2, ExternalLink, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { API_ENDPOINTS } from '../data';
import { UploadedFile } from '../types';

interface FileListProps {
  files: UploadedFile[];
  onFileDeleted: (filePath: string) => void;
}

/**
 * Component to display a list of uploaded files with actions
 */
const FileList: React.FC<FileListProps> = ({ files, onFileDeleted }) => {
  const [deletingFile, setDeletingFile] = useState<string | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState('');

  // Get appropriate icon based on file type
  const getFileIcon = (fileType: string) => {
    if (fileType.includes('pdf')) {
      return <FileType2 className='h-6 w-6 text-red-500' />;
    } else if (fileType.includes('word') || fileType.includes('document')) {
      return <FileText className='h-6 w-6 text-blue-500' />;
    } else if (fileType.includes('sheet') || fileType.includes('excel')) {
      return <FileSpreadsheet className='h-6 w-6 text-green-500' />;
    } else if (fileType.includes('image')) {
      return <FileImage className='h-6 w-6 text-purple-500' />;
    } else if (fileType.includes('zip') || fileType.includes('archive')) {
      return <FileArchive className='h-6 w-6 text-yellow-500' />;
    } else {
      return <File className='h-6 w-6 text-gray-500' />;
    }
  };

  // Format the date for display
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Confirm and handle file deletion
  const confirmDelete = (filePath: string) => {
    setDeletingFile(filePath);
    setShowConfirm(true);
  };

  const handleDelete = async () => {
    if (!deletingFile) return;

    setIsDeleting(true);
    setError('');

    try {
      const response = await fetch(API_ENDPOINTS.DELETE, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ filePath: deletingFile }),
      });

      if (!response.ok) {
        throw new Error(`Delete failed with status ${response.status}`);
      }

      // Notify parent component
      onFileDeleted(deletingFile);
    } catch (error) {
      console.error('Delete error:', error);
      setError('Failed to delete file. Please try again.');
    } finally {
      setIsDeleting(false);
      setShowConfirm(false);
    }
  };

  // If no files, show empty state
  if (files.length === 0) {
    return (
      <Card className='w-full'>
        <CardHeader>
          <CardTitle className='text-lg'>Uploaded Files</CardTitle>
        </CardHeader>
        <CardContent>
          <div className='text-center py-6 text-gray-500 dark:text-gray-400'>
            <FileText className='mx-auto h-12 w-12 opacity-30 mb-2' />
            <p>No files uploaded yet</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card className='w-full'>
        <CardHeader>
          <CardTitle className='text-lg'>Uploaded Files ({files.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant='destructive' className='mb-4'>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className='space-y-3'>
            {files.map((file, index) => (
              <div key={index} className='flex items-center p-3 border rounded-md bg-gray-50 dark:bg-gray-900'>
                <div className='mr-3'>{getFileIcon(file.fileType)}</div>
                <div className='flex-1 min-w-0'>
                  <p className='font-medium truncate'>{file.fileName}</p>
                  <p className='text-xs text-gray-500 dark:text-gray-400'>Uploaded: {formatDate(file.uploadDate)}</p>
                </div>
                <div className='flex gap-2'>
                  <Button variant='outline' size='icon' title='Open file' onClick={() => window.open(file.fileUrl, '_blank')}>
                    <ExternalLink className='h-4 w-4' />
                  </Button>
                  <Button variant='destructive' size='icon' title='Delete file' onClick={() => confirmDelete(file.filePath)}>
                    <Trash2 className='h-4 w-4' />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Delete confirmation dialog */}
      <AlertDialog open={showConfirm} onOpenChange={setShowConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action will permanently delete this file from the storage. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault();
                handleDelete();
              }}
              disabled={isDeleting}
              className='bg-red-500 hover:bg-red-600'
            >
              {isDeleting ? (
                <>
                  <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                  Deleting...
                </>
              ) : (
                'Delete'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default FileList;
