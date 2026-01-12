import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';
import {
  sendFacebookEvent,
  generateEventId,
  type FacebookUserData,
  type FacebookCustomData,
} from '@/utils/facebook-conversions';

// Standard Facebook Pixel events
const VALID_EVENTS = [
  'ViewContent',
  'CompleteRegistration',
  'Lead',
  'Contact',
  'Search',
  'AddToCart',
  'InitiateCheckout',
  'Purchase',
  'Subscribe',
  'Donate',
  'Schedule',
  'CustomizeProduct',
  'FindLocation',
  'StartTrial',
  'SubmitApplication',
  'PageView',
];

interface EventRequest {
  event_name: string;
  event_id?: string;
  event_source_url?: string;
  user_data?: Partial<FacebookUserData>;
  custom_data?: Partial<FacebookCustomData>;
}

export async function POST(request: NextRequest) {
  try {
    const body: EventRequest = await request.json();

    // Validate event name
    if (!body.event_name || !VALID_EVENTS.includes(body.event_name)) {
      return NextResponse.json(
        { error: `Invalid event_name. Must be one of: ${VALID_EVENTS.join(', ')}` },
        { status: 400 }
      );
    }

    // Get headers for user data
    const headersList = await headers();
    const clientIp =
      headersList.get('x-forwarded-for')?.split(',')[0]?.trim() ||
      headersList.get('x-real-ip') ||
      'unknown';
    const userAgent = headersList.get('user-agent') || '';

    // Build user data
    const userData: FacebookUserData = {
      ...body.user_data,
      client_ip_address: clientIp,
      client_user_agent: userAgent,
    };

    // Send event to Facebook
    const result = await sendFacebookEvent({
      event_name: body.event_name,
      event_time: Math.floor(Date.now() / 1000),
      event_id: body.event_id || generateEventId(),
      event_source_url: body.event_source_url,
      action_source: 'website',
      user_data: userData,
      custom_data: body.custom_data,
    });

    if (result.success) {
      return NextResponse.json({
        success: true,
        events_received: result.events_received,
        fbtrace_id: result.fbtrace_id,
      });
    } else {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Facebook events API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Test endpoint to verify configuration
export async function GET() {
  const pixelId = process.env.NEXT_PUBLIC_FACEBOOK_PIXEL_ID;
  const hasToken = !!process.env.FACEBOOK_CONVERSIONS_API_TOKEN;

  return NextResponse.json({
    configured: !!pixelId && hasToken,
    pixel_id: pixelId ? `${pixelId.substring(0, 4)}...` : null,
    has_access_token: hasToken,
    valid_events: VALID_EVENTS,
  });
}
