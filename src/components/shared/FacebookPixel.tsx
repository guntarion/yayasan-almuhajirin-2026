'use client';

import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import Script from 'next/script';

const FB_PIXEL_ID = process.env.NEXT_PUBLIC_FACEBOOK_PIXEL_ID;

// Extend window type for Facebook Pixel
declare global {
  interface Window {
    fbq: (...args: unknown[]) => void;
    _fbq: (...args: unknown[]) => void;
  }
}

// Facebook Pixel helper functions
export const pageview = () => {
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('track', 'PageView');
  }
};

export const event = (name: string, options: Record<string, unknown> = {}) => {
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('track', name, options);
  }
};

// Standard Facebook Pixel events
export const fbEvents = {
  // ViewContent - when viewing a page/product
  viewContent: (params?: {
    content_name?: string;
    content_category?: string;
    content_ids?: string[];
    content_type?: string;
    value?: number;
    currency?: string;
  }) => event('ViewContent', params || {}),

  // CompleteRegistration - when completing a registration
  completeRegistration: (params?: {
    content_name?: string;
    currency?: string;
    value?: number;
    status?: string;
  }) => event('CompleteRegistration', params || {}),

  // Lead - when submitting info (contact form, etc)
  lead: (params?: {
    content_name?: string;
    content_category?: string;
    currency?: string;
    value?: number;
  }) => event('Lead', params || {}),

  // Contact - when initiating contact
  contact: () => event('Contact'),

  // Search - when searching
  search: (params?: {
    search_string?: string;
    content_category?: string;
    content_ids?: string[];
  }) => event('Search', params || {}),

  // AddToCart - when adding to cart
  addToCart: (params?: {
    content_ids?: string[];
    content_name?: string;
    content_type?: string;
    value?: number;
    currency?: string;
  }) => event('AddToCart', params || {}),

  // InitiateCheckout - when starting checkout
  initiateCheckout: (params?: {
    content_ids?: string[];
    content_type?: string;
    value?: number;
    currency?: string;
    num_items?: number;
  }) => event('InitiateCheckout', params || {}),

  // Purchase - when completing purchase
  purchase: (params: {
    value: number;
    currency: string;
    content_ids?: string[];
    content_type?: string;
    num_items?: number;
  }) => event('Purchase', params),

  // Subscribe - when subscribing
  subscribe: (params?: {
    currency?: string;
    value?: number;
    predicted_ltv?: number;
  }) => event('Subscribe', params || {}),

  // Donate - when making a donation
  donate: (params?: {
    currency?: string;
    value?: number;
  }) => event('Donate', params || {}),

  // Schedule - when scheduling appointment
  schedule: () => event('Schedule'),

  // CustomizeProduct - when customizing
  customizeProduct: () => event('CustomizeProduct'),

  // FindLocation - when searching for location
  findLocation: () => event('FindLocation'),

  // StartTrial - when starting trial
  startTrial: (params?: {
    currency?: string;
    value?: number;
    predicted_ltv?: number;
  }) => event('StartTrial', params || {}),

  // SubmitApplication - when submitting application
  submitApplication: () => event('SubmitApplication'),
};

export default function FacebookPixel() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Track pageview on route change
    if (FB_PIXEL_ID) {
      pageview();
    }
  }, [pathname, searchParams]);

  if (!FB_PIXEL_ID) {
    return null;
  }

  return (
    <>
      {/* Facebook Pixel Base Code */}
      <Script
        id="fb-pixel"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '${FB_PIXEL_ID}');
            fbq('track', 'PageView');
          `,
        }}
      />
      {/* Noscript fallback */}
      <noscript>
        <img
          height="1"
          width="1"
          style={{ display: 'none' }}
          src={`https://www.facebook.com/tr?id=${FB_PIXEL_ID}&ev=PageView&noscript=1`}
          alt=""
        />
      </noscript>
    </>
  );
}
