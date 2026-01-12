import * as crypto from 'crypto';

const PIXEL_ID = process.env.NEXT_PUBLIC_FACEBOOK_PIXEL_ID;
const ACCESS_TOKEN = process.env.FACEBOOK_CONVERSIONS_API_TOKEN;
const API_VERSION = 'v21.0';

// Hash function for user data (Facebook requires SHA256 hashing)
export function hashData(data: string | null | undefined): string | null {
  if (!data) return null;
  return crypto
    .createHash('sha256')
    .update(data.toLowerCase().trim())
    .digest('hex');
}

// User data interface
export interface FacebookUserData {
  em?: string; // Email (will be hashed)
  ph?: string; // Phone (will be hashed)
  fn?: string; // First name (will be hashed)
  ln?: string; // Last name (will be hashed)
  ge?: string; // Gender (m or f, will be hashed)
  db?: string; // Date of birth YYYYMMDD (will be hashed)
  ct?: string; // City (will be hashed)
  st?: string; // State (will be hashed)
  zp?: string; // Zip code (will be hashed)
  country?: string; // Country code (will be hashed)
  external_id?: string; // External ID (will be hashed)
  client_ip_address?: string; // IP address (not hashed)
  client_user_agent?: string; // User agent (not hashed)
  fbc?: string; // Facebook click ID from _fbc cookie
  fbp?: string; // Facebook browser ID from _fbp cookie
}

// Custom data interface
export interface FacebookCustomData {
  value?: number;
  currency?: string;
  content_name?: string;
  content_category?: string;
  content_ids?: string[];
  content_type?: string;
  contents?: Array<{ id: string; quantity: number }>;
  num_items?: number;
  search_string?: string;
  status?: string;
  predicted_ltv?: number;
  // Custom properties
  [key: string]: unknown;
}

// Event interface
export interface FacebookEvent {
  event_name: string;
  event_time: number;
  event_id?: string; // For deduplication with browser pixel
  event_source_url?: string;
  action_source: 'website' | 'email' | 'app' | 'phone_call' | 'chat' | 'physical_store' | 'system_generated' | 'other';
  user_data: FacebookUserData;
  custom_data?: FacebookCustomData;
  opt_out?: boolean;
}

// Prepare user data with proper hashing
function prepareUserData(userData: FacebookUserData): Record<string, unknown> {
  const prepared: Record<string, unknown> = {};

  // Fields that need to be hashed
  const hashFields = ['em', 'ph', 'fn', 'ln', 'ge', 'db', 'ct', 'st', 'zp', 'country', 'external_id'];

  for (const [key, value] of Object.entries(userData)) {
    if (value === null || value === undefined) continue;

    if (hashFields.includes(key)) {
      const hashed = hashData(value);
      if (hashed) {
        prepared[key] = key === 'em' || key === 'ph' ? [hashed] : hashed;
      }
    } else {
      // Don't hash these fields
      prepared[key] = value;
    }
  }

  return prepared;
}

// Send event to Facebook Conversions API
export async function sendFacebookEvent(event: FacebookEvent): Promise<{
  success: boolean;
  events_received?: number;
  messages?: string[];
  fbtrace_id?: string;
  error?: string;
}> {
  if (!PIXEL_ID || !ACCESS_TOKEN) {
    console.warn('Facebook Pixel ID or Access Token not configured');
    return { success: false, error: 'Configuration missing' };
  }

  const url = `https://graph.facebook.com/${API_VERSION}/${PIXEL_ID}/events`;

  const payload = {
    data: [
      {
        ...event,
        user_data: prepareUserData(event.user_data),
      },
    ],
    access_token: ACCESS_TOKEN,
  };

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const result = await response.json();

    if (response.ok) {
      return {
        success: true,
        events_received: result.events_received,
        messages: result.messages,
        fbtrace_id: result.fbtrace_id,
      };
    } else {
      console.error('Facebook Conversions API error:', result);
      return {
        success: false,
        error: result.error?.message || 'Unknown error',
      };
    }
  } catch (error) {
    console.error('Facebook Conversions API request failed:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Request failed',
    };
  }
}

// Send multiple events in a batch
export async function sendFacebookEvents(events: FacebookEvent[]): Promise<{
  success: boolean;
  events_received?: number;
  messages?: string[];
  fbtrace_id?: string;
  error?: string;
}> {
  if (!PIXEL_ID || !ACCESS_TOKEN) {
    console.warn('Facebook Pixel ID or Access Token not configured');
    return { success: false, error: 'Configuration missing' };
  }

  const url = `https://graph.facebook.com/${API_VERSION}/${PIXEL_ID}/events`;

  const payload = {
    data: events.map((event) => ({
      ...event,
      user_data: prepareUserData(event.user_data),
    })),
    access_token: ACCESS_TOKEN,
  };

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const result = await response.json();

    if (response.ok) {
      return {
        success: true,
        events_received: result.events_received,
        messages: result.messages,
        fbtrace_id: result.fbtrace_id,
      };
    } else {
      console.error('Facebook Conversions API error:', result);
      return {
        success: false,
        error: result.error?.message || 'Unknown error',
      };
    }
  } catch (error) {
    console.error('Facebook Conversions API request failed:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Request failed',
    };
  }
}

// Helper to generate event_id for deduplication
export function generateEventId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;
}

// Pre-configured event helpers
export const facebookServerEvents = {
  // ViewContent event
  viewContent: (
    userData: FacebookUserData,
    options: {
      eventId?: string;
      sourceUrl?: string;
      contentName?: string;
      contentCategory?: string;
      contentIds?: string[];
      contentType?: string;
      value?: number;
      currency?: string;
    } = {}
  ) =>
    sendFacebookEvent({
      event_name: 'ViewContent',
      event_time: Math.floor(Date.now() / 1000),
      event_id: options.eventId,
      event_source_url: options.sourceUrl,
      action_source: 'website',
      user_data: userData,
      custom_data: {
        content_name: options.contentName,
        content_category: options.contentCategory,
        content_ids: options.contentIds,
        content_type: options.contentType,
        value: options.value,
        currency: options.currency,
      },
    }),

  // CompleteRegistration event
  completeRegistration: (
    userData: FacebookUserData,
    options: {
      eventId?: string;
      sourceUrl?: string;
      contentName?: string;
      value?: number;
      currency?: string;
      status?: string;
    } = {}
  ) =>
    sendFacebookEvent({
      event_name: 'CompleteRegistration',
      event_time: Math.floor(Date.now() / 1000),
      event_id: options.eventId,
      event_source_url: options.sourceUrl,
      action_source: 'website',
      user_data: userData,
      custom_data: {
        content_name: options.contentName,
        value: options.value,
        currency: options.currency,
        status: options.status,
      },
    }),

  // Lead event
  lead: (
    userData: FacebookUserData,
    options: {
      eventId?: string;
      sourceUrl?: string;
      contentName?: string;
      contentCategory?: string;
      value?: number;
      currency?: string;
    } = {}
  ) =>
    sendFacebookEvent({
      event_name: 'Lead',
      event_time: Math.floor(Date.now() / 1000),
      event_id: options.eventId,
      event_source_url: options.sourceUrl,
      action_source: 'website',
      user_data: userData,
      custom_data: {
        content_name: options.contentName,
        content_category: options.contentCategory,
        value: options.value,
        currency: options.currency,
      },
    }),

  // Contact event
  contact: (
    userData: FacebookUserData,
    options: {
      eventId?: string;
      sourceUrl?: string;
    } = {}
  ) =>
    sendFacebookEvent({
      event_name: 'Contact',
      event_time: Math.floor(Date.now() / 1000),
      event_id: options.eventId,
      event_source_url: options.sourceUrl,
      action_source: 'website',
      user_data: userData,
    }),

  // Purchase event
  purchase: (
    userData: FacebookUserData,
    options: {
      eventId?: string;
      sourceUrl?: string;
      value: number;
      currency: string;
      contentIds?: string[];
      contentType?: string;
      numItems?: number;
    }
  ) =>
    sendFacebookEvent({
      event_name: 'Purchase',
      event_time: Math.floor(Date.now() / 1000),
      event_id: options.eventId,
      event_source_url: options.sourceUrl,
      action_source: 'website',
      user_data: userData,
      custom_data: {
        value: options.value,
        currency: options.currency,
        content_ids: options.contentIds,
        content_type: options.contentType,
        num_items: options.numItems,
      },
    }),

  // Donate event
  donate: (
    userData: FacebookUserData,
    options: {
      eventId?: string;
      sourceUrl?: string;
      value?: number;
      currency?: string;
    } = {}
  ) =>
    sendFacebookEvent({
      event_name: 'Donate',
      event_time: Math.floor(Date.now() / 1000),
      event_id: options.eventId,
      event_source_url: options.sourceUrl,
      action_source: 'website',
      user_data: userData,
      custom_data: {
        value: options.value,
        currency: options.currency,
      },
    }),

  // Subscribe event
  subscribe: (
    userData: FacebookUserData,
    options: {
      eventId?: string;
      sourceUrl?: string;
      value?: number;
      currency?: string;
      predictedLtv?: number;
    } = {}
  ) =>
    sendFacebookEvent({
      event_name: 'Subscribe',
      event_time: Math.floor(Date.now() / 1000),
      event_id: options.eventId,
      event_source_url: options.sourceUrl,
      action_source: 'website',
      user_data: userData,
      custom_data: {
        value: options.value,
        currency: options.currency,
        predicted_ltv: options.predictedLtv,
      },
    }),

  // Schedule event
  schedule: (
    userData: FacebookUserData,
    options: {
      eventId?: string;
      sourceUrl?: string;
    } = {}
  ) =>
    sendFacebookEvent({
      event_name: 'Schedule',
      event_time: Math.floor(Date.now() / 1000),
      event_id: options.eventId,
      event_source_url: options.sourceUrl,
      action_source: 'website',
      user_data: userData,
    }),

  // SubmitApplication event
  submitApplication: (
    userData: FacebookUserData,
    options: {
      eventId?: string;
      sourceUrl?: string;
    } = {}
  ) =>
    sendFacebookEvent({
      event_name: 'SubmitApplication',
      event_time: Math.floor(Date.now() / 1000),
      event_id: options.eventId,
      event_source_url: options.sourceUrl,
      action_source: 'website',
      user_data: userData,
    }),
};
