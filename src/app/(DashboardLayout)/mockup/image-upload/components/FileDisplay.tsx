// src/app/(DashboardLayout)/mockup/spaces-digital-ocean/components/FileDisplay.tsx
'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Download, Trash2, Link, ExternalLink, FileText, Loader2, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { API_ENDPOINTS, ERROR_MESSAGES } from '../data';
import { FileInfo } from './types';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';

interface FileDisplayProps {
  fileInfo: FileInfo | null;
  onDelete: () => void;
}

/**
 * Component to display uploaded file information and provide download/delete functionality
 * Simplified implementation based on working project
 */
const FileDisplay: React.FC<FileDisplayProps> = ({ fileInfo, onDelete }) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string>('');
  const [copied, setCopied] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [imageError, setImageError] = useState(false);

  if (!fileInfo) {
    return null;
  }

  // Handle file deletion
  const handleDelete = async () => {
    setIsDeleting(true);
    setError('');

    try {
      // Simple fetch approach without abort controllers or timeouts
      const response = await fetch(API_ENDPOINTS.DELETE, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ filePath: fileInfo.path }),
      });

      if (!response.ok) {
        throw new Error(`Delete failed with status ${response.status}`);
      }

      // Notify parent component about successful deletion
      onDelete();
    } catch (error) {
      console.error('Delete error:', error);
      setError(error instanceof Error ? error.message : ERROR_MESSAGES.UNKNOWN_ERROR);
      setIsDeleting(false);
    }
  };

  // Handle file download
  const handleDownload = () => {
    try {
      // Create an anchor element and trigger download
      const link = document.createElement('a');
      link.href = fileInfo.url;
      link.download = fileInfo.fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Download error:', error);
      setError('Failed to download the file. You can try copying the URL and opening it in a new tab.');
    }
  };

  // Copy URL to clipboard
  const copyToClipboard = () => {
    navigator.clipboard.writeText(fileInfo.url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  // Format the upload timestamp
  const formatUploadTime = (date: Date): string => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    }).format(date);
  };

  return (
    <>
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Uploaded Image
          </CardTitle>
        </CardHeader>
        
        <Tabs defaultValue="preview" className="w-full">
          <TabsList className="grid grid-cols-2 mx-4">
            <TabsTrigger value="preview">Preview</TabsTrigger>
            <TabsTrigger value="details">Details</TabsTrigger>
          </TabsList>
          
          <TabsContent value="preview" className="p-4">
            <div className="relative overflow-hidden rounded-lg border border-gray-200 dark:border-gray-800 aspect-auto bg-gray-100 dark:bg-gray-900 flex items-center justify-center min-h-[300px]">
              {!imageError ? (
                <Image 
                  src={fileInfo.url}
                  alt={fileInfo.fileName}
                  className="object-contain"
                  fill
                  sizes="(max-width: 768px) 100vw, 768px"
                  priority
                  onError={() => setImageError(true)}
                />
              ) : (
                <div className="flex flex-col items-center justify-center text-center p-4">
                  <AlertTriangle className="h-12 w-12 text-amber-500 mb-2" />
                  <p className="text-base font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Failed to load image
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                    The image could not be displayed. It may have been deleted or the URL may be invalid.
                  </p>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => window.open(fileInfo.url, '_blank')}
                  >
                    <ExternalLink className="mr-2 h-4 w-4" />
                    Open URL in new tab
                  </Button>
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="details" className="p-4">
            <div className="space-y-4">
              {/* File details */}
              <div className="grid gap-2">
                <div className="text-sm font-medium">File Name</div>
                <div className="text-sm truncate">{fileInfo.fileName}</div>
              </div>
              
              <div className="grid gap-2">
                <div className="text-sm font-medium">Upload Time</div>
                <div className="text-sm">{formatUploadTime(fileInfo.uploadTime)}</div>
              </div>
              
              <div className="grid gap-2">
                <div className="text-sm font-medium">File URL</div>
                <div className="flex items-center gap-2">
                  <Input 
                    value={fileInfo.url} 
                    readOnly
                    className="text-sm font-mono"
                  />
                  <Button 
                    variant="outline" 
                    size="icon"
                    onClick={copyToClipboard}
                    title="Copy URL to clipboard"
                  >
                    <Link className={`h-4 w-4 ${copied ? 'text-green-500' : ''}`} />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="icon"
                    title="Open in new tab"
                    onClick={() => window.open(fileInfo.url, '_blank')}
                  >
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              <div className="grid gap-2">
                <div className="text-sm font-medium">Storage Path</div>
                <div className="text-sm font-mono truncate">{fileInfo.path}</div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
        
        {error && (
          <Alert variant="destructive" className="mx-4 mb-4">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        <CardFooter className="flex justify-between">
          <Button onClick={handleDownload} variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Download
          </Button>
          <Button
            onClick={() => setShowDeleteConfirm(true)}
            variant="destructive"
            disabled={isDeleting}
          >
            {isDeleting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Deleting...
              </>
            ) : (
              <>
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </>
            )}
          </Button>
        </CardFooter>
      </Card>

      {/* Delete confirmation dialog */}
      <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure you want to delete this file?</AlertDialogTitle>
            <AlertDialogDescription>
              This action will permanently delete the file from Digital Ocean Spaces.
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={(e) => {
                e.preventDefault();
                handleDelete();
                setShowDeleteConfirm(false);
              }}
              disabled={isDeleting}
              className="bg-red-500 hover:bg-red-600"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default FileDisplay;
