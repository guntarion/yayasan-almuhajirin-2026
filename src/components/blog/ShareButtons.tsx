'use client';

import { useState } from 'react';
import { Facebook, Twitter, Link2, Check, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ShareButtonsProps {
  url: string;
  title: string;
  description?: string;
}

export function ShareButtons({ url, title, description }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);

  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);
  // Description available for future use in sharing
  void description;

  const shareLinks = {
    whatsapp: `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    twitter: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const openShare = (shareUrl: string) => {
    window.open(shareUrl, '_blank', 'width=600,height=400');
  };

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-muted-foreground mr-2">Bagikan:</span>

      <Button
        variant="outline"
        size="icon"
        className="h-9 w-9 text-green-600 hover:text-green-700 hover:bg-green-50"
        onClick={() => openShare(shareLinks.whatsapp)}
        title="Share via WhatsApp"
      >
        <MessageCircle className="h-4 w-4" />
      </Button>

      <Button
        variant="outline"
        size="icon"
        className="h-9 w-9 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
        onClick={() => openShare(shareLinks.facebook)}
        title="Share via Facebook"
      >
        <Facebook className="h-4 w-4" />
      </Button>

      <Button
        variant="outline"
        size="icon"
        className="h-9 w-9 text-sky-500 hover:text-sky-600 hover:bg-sky-50"
        onClick={() => openShare(shareLinks.twitter)}
        title="Share via Twitter"
      >
        <Twitter className="h-4 w-4" />
      </Button>

      <Button
        variant="outline"
        size="icon"
        className="h-9 w-9"
        onClick={handleCopy}
        title="Copy link"
      >
        {copied ? (
          <Check className="h-4 w-4 text-green-600" />
        ) : (
          <Link2 className="h-4 w-4" />
        )}
      </Button>
    </div>
  );
}

export default ShareButtons;
