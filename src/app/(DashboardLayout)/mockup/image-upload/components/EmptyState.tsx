// src/app/(DashboardLayout)/mockup/spaces-digital-ocean/components/EmptyState.tsx
import React from 'react';
import { ImageIcon } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

/**
 * Empty state component shown when no files have been uploaded
 */
const EmptyState: React.FC = () => {
  return (
    <Card className="w-full">
      <CardContent className="flex flex-col items-center justify-center py-16 text-center">
        <ImageIcon className="h-16 w-16 text-gray-300 dark:text-gray-600 mb-4" />
        <h3 className="text-lg font-medium mb-2">No images uploaded yet</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 max-w-sm">
          Upload an image using the form above to see it displayed here. You&apos;ll be able to
          view, download, and delete your uploaded images.
        </p>
      </CardContent>
    </Card>
  );
};

export default EmptyState;
